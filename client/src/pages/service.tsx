import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronLeft, Headphones } from "lucide-react";
import { useLocation } from "wouter";
import supportTelegramIcon from "@assets/groupService_1790964597734.png";
import "./service-screenshot.css";

interface LinksSettings {
  supportLink?: string;
  supportEnabled?: string | boolean;
  groupLink?: string;
  groupEnabled?: string | boolean;
}

function isEnabled(value?: string | boolean) {
  return value === undefined || value === true || value === "true";
}

function ServiceCard({
  kind,
  eyebrow,
  title,
  description,
  action,
  href,
  testId,
  hours,
}: {
  kind: "support" | "community";
  eyebrow: string;
  title: string;
  description: string;
  action: string;
  href: string;
  testId: string;
  hours?: { label: string; value: string };
}) {
  return (
    <article className={`service-card service-card--${kind}`}>
      <div className="service-card-heading">
        <div className={`service-card-icon service-card-icon--${kind}`} aria-hidden="true">
          {kind === "support" ? (
            <Headphones />
          ) : (
            <img src={supportTelegramIcon} alt="" />
          )}
        </div>
        <div className="service-card-titles">
          <span className="service-card-eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
      </div>

      <p className="service-card-description">{description}</p>

      {hours && (
        <>
          <div className="service-card-divider" />
          <div className="service-card-hours">
            <span>{hours.label}</span>
            <span>{hours.value}</span>
          </div>
        </>
      )}

      <a
        className="service-card-action"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-testid={testId}
      >
        <span>{action}</span>
        <ArrowRight aria-hidden="true" />
      </a>
    </article>
  );
}

export default function ServicePage() {
  const [, navigate] = useLocation();
  const { data: settings } = useQuery<LinksSettings>({
    queryKey: ["/api/settings/links"],
  });

  return (
    <main className="service-client-page">
      <div className="service-client-screen">
        <header className="service-client-topbar">
          <button
            className="service-client-back"
            type="button"
            aria-label="Retour au compte"
            onClick={() => navigate("/account")}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <h1>Service client</h1>
        </header>

        <section className="service-client-brand" aria-label="Centre d’assistance Scotgold">
          <strong>SCOTGOLD</strong>
          <span>Centre d’assistance</span>
        </section>

        <section className="service-client-contacts" aria-label="Contacts officiels">
          {isEnabled(settings?.supportEnabled) && (
            <ServiceCard
              kind="support"
              eyebrow="SCOTGOLD"
              title="Service client"
              description="Si vous avez des questions ou besoin d’aide, n’hésitez pas à nous contacter."
              action="Contacter le support"
              href={settings?.supportLink || "https://t.me/sybotx"}
              testId="button-support-link"
              hours={{ label: "Heures d’ouverture", value: "9 h-19 h" }}
            />
          )}
          {isEnabled(settings?.groupEnabled) && (
            <ServiceCard
              kind="community"
              eyebrow="Telegram"
              title="Communauté SCOTGOLD"
              description="Actualités officielles, mises à jour et annonces de la communauté."
              action="Rejoindre Telegram"
              href={settings?.groupLink || "https://t.me/sybotx"}
              testId="button-group-link"
            />
          )}
        </section>
      </div>
    </main>
  );
}