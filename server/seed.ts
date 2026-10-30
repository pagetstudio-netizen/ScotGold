import { db } from "./db";
import { users, tasks, paymentChannels, platformSettings, countries } from "@shared/schema";
import { INVITATION_TASK_DEFAULTS, INVITATION_TASK_KEY_PREFIX } from "./invitation-tasks";
import bcrypt from "bcrypt";
import { eq, inArray, sql } from "drizzle-orm";

export async function seed() {
  console.log("Seeding database...");

  // One-time migration: existing single-wallet balances become non-withdrawable deposit balance.
  const walletSplitMigrationKey = "userWalletSplitV1";
  const walletSplitMigration = await db.select({ key: platformSettings.key })
    .from(platformSettings)
    .where(eq(platformSettings.key, walletSplitMigrationKey))
    .limit(1);
  if (walletSplitMigration.length === 0) {
    await db.transaction(async (tx) => {
      await tx.update(users).set({
        depositBalance: users.balance,
        withdrawalBalance: "0",
      });
      await tx.insert(platformSettings).values({ key: walletSplitMigrationKey, value: "1" });
    });
    console.log("Existing balances moved to the non-withdrawable deposit wallet");
  }

  // Create session table for connect-pg-simple (if not exists)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "session" (
      "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL,
      CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
    ) WITH (OIDS=FALSE)
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire")
  `);
  await db.execute(sql`
    ALTER TABLE "payment_numbers" ALTER COLUMN "phone" DROP NOT NULL
  `).catch(() => undefined);
  await db.execute(sql`
    ALTER TABLE "payment_numbers" ADD COLUMN IF NOT EXISTS "payment_link" text
  `).catch(() => undefined);
  await db.execute(sql`
    ALTER TABLE "deposits"
      ADD COLUMN IF NOT EXISTS "drimpay_reference" text,
      ADD COLUMN IF NOT EXISTS "drimpay_order_id" text
  `);
  await db.execute(sql`
    ALTER TABLE "withdrawals"
      ADD COLUMN IF NOT EXISTS "drimpay_reference" text,
      ADD COLUMN IF NOT EXISTS "drimpay_external_ref" text
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "deposits_drimpay_reference_idx" ON "deposits" ("drimpay_reference")
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "deposits_drimpay_order_id_idx" ON "deposits" ("drimpay_order_id")
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "withdrawals_drimpay_reference_idx" ON "withdrawals" ("drimpay_reference")
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "withdrawals_drimpay_external_ref_idx" ON "withdrawals" ("drimpay_external_ref")
  `);

  // Ensure countries table exists
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "countries" (
      "id" serial PRIMARY KEY,
      "code" text NOT NULL UNIQUE,
      "name" text NOT NULL,
      "currency" text NOT NULL,
      "phone_prefix" text NOT NULL,
      "operators" text NOT NULL DEFAULT '[]',
      "is_active" boolean NOT NULL DEFAULT true
    )
  `);

  // Check if admin already exists. Keep a development fallback for existing
  // installations, while allowing deployments to configure the admin phone
  // through the secret store.
  const adminPhone = process.env.ADMIN_PHONE || "99935673";
  const existingAdmin = await db.select().from(users).where(eq(users.phone, adminPhone));
  const adminPassword = process.env.ADMIN_PASSWORD;

  const adminPin = process.env.ADMIN_PIN;

  if (existingAdmin.length === 0) {
    if (!adminPassword) {
      console.warn("No administrator exists yet; set ADMIN_PASSWORD to provision the initial admin.");
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await db.insert(users).values({
        fullName: "Super Admin",
        phone: adminPhone,
        country: "TG",
        password: hashedPassword,
        referralCode: "ADMIN1",
        balance: "0",
        isAdmin: true,
        isSuperAdmin: true,
        adminPin: adminPin || null,
      });
      console.log("Super admin created");
      if (adminPin) console.log("Super admin PIN configured");
    }
  } else {
    // Always update admin flags; also update password and PIN if env vars are set
    const updateData: any = { country: "TG", isAdmin: true, isSuperAdmin: true };
    if (adminPassword) {
      updateData.password = await bcrypt.hash(adminPassword, 12);
      console.log("Super admin password updated");
    }
    if (adminPin) {
      updateData.adminPin = adminPin;
      console.log("Super admin PIN updated");
    }
    await db.update(users)
      .set(updateData)
      .where(eq(users.phone, adminPhone));
    console.log("Super admin access verified");
  }

  // Seed countries only on first install — never overwrite admin changes
  const existingCountries = await db.select().from(countries);
  if (existingCountries.length === 0) {
    const defaultCountries = [
      {
        code: "TG",
        name: "Togo",
        currency: "XOF",
        phonePrefix: "228",
        operators: JSON.stringify(["Togocel", "Moov Africa Togo"]),
        isActive: true,
      },
      {
        code: "CM",
        name: "Cameroun",
        currency: "XAF",
        phonePrefix: "237",
        operators: JSON.stringify(["Orange Cameroun", "MTN Cameroun"]),
        isActive: true,
      },
      {
        code: "BF",
        name: "Burkina Faso",
        currency: "XOF",
        phonePrefix: "226",
        operators: JSON.stringify(["Orange Burkina", "Moov Africa Burkina"]),
        isActive: true,
      },
      {
        code: "NE",
        name: "Niger",
        currency: "XOF",
        phonePrefix: "227",
        operators: JSON.stringify(["NITA TRANSFERT", "AMANA TRANSFERT"]),
        isActive: true,
      },
      {
        code: "BJ",
        name: "Benin",
        currency: "XOF",
        phonePrefix: "229",
        operators: JSON.stringify(["MTN Benin", "Moov Africa Benin"]),
        isActive: true,
      },
    ];
    for (const countryData of defaultCountries) {
      await db.insert(countries).values(countryData);
      console.log(`Country added: ${countryData.name}`);
    }
  } else {
    console.log(`Countries skipped — ${existingCountries.length} existing countries preserved`);
  }

  // One-time migration: replace old invitation tiers while preserving claimed-task history.
  const invitationTaskMigrationKey = "invitationTaskTiersV2";
  const invitationTaskMigration = await db.select({ key: platformSettings.key })
    .from(platformSettings)
    .where(eq(platformSettings.key, invitationTaskMigrationKey))
    .limit(1);
  if (invitationTaskMigration.length === 0) {
    const existingTasks = await db.select().from(tasks);
    const retainedTaskIds = new Set<number>();

    for (const { taskKey, ...tier } of INVITATION_TASK_DEFAULTS) {
      const existing = existingTasks.find(task => task.name === taskKey);
      if (existing) {
        await db.update(tasks).set(tier).where(eq(tasks.id, existing.id));
        retainedTaskIds.add(existing.id);
      } else {
        const [inserted] = await db.insert(tasks)
          .values(tier)
          .returning({ id: tasks.id });
        if (inserted) retainedTaskIds.add(inserted.id);
      }
    }

    const legacyTaskNames = new Set([
      "Parrain Bronze",
      "Parrain Argent",
      "Parrain Or",
      "Parrain Platine",
      "Parrain Diamant",
      "Parrain Elite",
    ]);
    const obsoleteTaskIds = existingTasks
      .filter(task => (
        task.name.startsWith(INVITATION_TASK_KEY_PREFIX) || legacyTaskNames.has(task.name)
      ) && !retainedTaskIds.has(task.id))
      .map(task => task.id);
    if (obsoleteTaskIds.length > 0) {
      await db.update(tasks).set({ isActive: false }).where(inArray(tasks.id, obsoleteTaskIds));
    }

    await db.insert(platformSettings).values({ key: invitationTaskMigrationKey, value: "1" });
    console.log("Invitation task tiers migrated to the five requested milestones");
  }

  // Check if payment channels exist
  const existingChannels = await db.select().from(paymentChannels);
  if (existingChannels.length === 0) {
    await db.insert(paymentChannels).values([
      { name: "LeekPay", redirectUrl: "https://leekpay.com/pay", isApi: false },
      { name: "FedaPay", redirectUrl: "https://fedapay.com/payment", isApi: false },
    ]);
    console.log("Payment channels seeded");
  }

  // Check if settings exist - apply new values for new keys or update existing
  const existingSettings = await db.select().from(platformSettings);
  const requiredSettings = [
    { key: "supportLink", value: "https://t.me/sybotx" },
    { key: "supportType", value: "telegram" },
    { key: "supportLabel", value: "Service client" },
    { key: "support2Link", value: "https://t.me/sybotx" },
    { key: "support2Type", value: "telegram" },
    { key: "support2Label", value: "Service client 2" },
    { key: "channelLink", value: "https://t.me/sybotx" },
    { key: "channelType", value: "telegram" },
    { key: "channelLabel", value: "Chaîne officielle" },
    { key: "groupLink", value: "https://t.me/sybotx" },
    { key: "groupType", value: "telegram" },
    { key: "groupLabel", value: "Groupe de discussion" },
    { key: "popupButtonLabel", value: "Cliquez ici pour rejoindre le groupe Telegram" },
    { key: "noticeText", value: "Scotgold Resources Ltd. explore des projets aurifères en Écosse, dont la mine de Cononish dans les Highlands." },
    { key: "supportEnabled", value: "true" },
    { key: "support2Enabled", value: "true" },
    { key: "channelEnabled", value: "true" },
    { key: "groupEnabled", value: "true" },
    { key: "minDeposit", value: "3000" },
    { key: "minWithdrawal", value: "1500" },
    { key: "withdrawalFees", value: "18" },
    { key: "withdrawalStartHour", value: "9" },
    { key: "withdrawalEndHour", value: "17" },
    { key: "maxWithdrawalsPerDay", value: "1" },
    { key: "level1Commission", value: "25" },
    { key: "level2Commission", value: "3" },
    { key: "level3Commission", value: "2" },
    { key: "signupBonus", value: "500" },
    { key: "soleaspayEnabled", value: "false" },
    { key: "soleaspayCountries", value: "" },
    { key: "soleaspayChannelName", value: "Westpay" },
    { key: "omnipayEnabled", value: "false" },
    { key: "omnipayChannelName", value: "OmniPay" },
    { key: "omnipayCallbackKey", value: "" },
    { key: "sendavapayEnabled", value: "false" },
    { key: "sendavapayChannelName", value: "SendavaPay" },
    { key: "sendavapayWebhookSecret", value: "" },
    { key: "westpayEnabled", value: "false" },
    { key: "westpayChannelName", value: "WestPay" },
    { key: "westpayCountries", value: "" },
    { key: "westpayWebhookSecret", value: "" },
    { key: "ashtechEnabled", value: "true" },
    { key: "ashtechChannelName", value: "AshtechPay" },
    { key: "ashtechCountries", value: "BF,TG,CM,BJ" },
    { key: "ashtechWebhookSecret", value: "" },
    { key: "inpayEnabled", value: "false" },
    { key: "inpayChannelName", value: "InPay" },
    { key: "inpayCountries", value: "" },
  ];

  for (const settingData of requiredSettings) {
    const existing = existingSettings.find(s => s.key === settingData.key);
    const isSensitive = /secret|key|token|password/i.test(settingData.key);
    if (!existing) {
      await db.insert(platformSettings).values(settingData);
      console.log(`Setting added: ${settingData.key}${isSensitive ? "" : ` = ${settingData.value}`}`);
    } else if (
      settingData.key === "noticeText" &&
      /roboticsfund|sybotx|zijin mining|disney|walt|pixar|marvel|star wars/i.test(existing.value)
    ) {
      await db.update(platformSettings)
        .set({ value: settingData.value })
        .where(eq(platformSettings.key, settingData.key));
      console.log(`Setting updated: ${settingData.key} = ${settingData.value}`);
    } else {
      console.log(`Setting preserved: ${existing.key}${isSensitive ? "" : ` = ${existing.value}`}`);
    }
  }
  console.log("Settings check complete");

  console.log("Database seeding complete!");
}
