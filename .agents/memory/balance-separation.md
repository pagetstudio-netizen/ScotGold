---
name: Balance separation
description: Accounting policy for non-withdrawable deposit funds and withdrawable user earnings.
---

Use `users.balance` as the user's single visible and spendable balance. Deposits, bonuses, earnings, commissions, and rewards all contribute to it. Product purchases and withdrawals debit from the same total. The adjacent “Mes revenus” figure is an informational cumulative total of credited product earnings (`users.totalEarnings`), never a second spendable balance.

Withdrawals still require at least one eligible active stable-product position and all other existing withdrawal conditions. The legacy `depositBalance` and `withdrawalBalance` columns may remain for internal credit classification and compatibility, but must not restrict purchases or withdrawals or be presented as separate user balances.

**Why:** The user requires one spendable balance while also requesting a separate, informational “Mes revenus” statistic beside it.

**How to apply:** Read `balance` for user-facing totals and sufficiency checks; show `totalEarnings` only as cumulative credited income. Keep the stable-product withdrawal gate on the server, and avoid deleting legacy columns or historical transaction records as part of this policy change.
