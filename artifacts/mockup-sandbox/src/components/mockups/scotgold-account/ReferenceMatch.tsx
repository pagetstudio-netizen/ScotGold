import "./ReferenceMatch.css";

const accountIcons = "/__mockup/images/scotgold-account";

const shortcutItems = [
  { label: "Banque", icon: "bank.png", destination: "/wallet" },
  { label: "Mon relevé", icon: "history.png", destination: "/history" },
  { label: "Relevé de\nrecharge", icon: "recharge.png", destination: "/deposit-history" },
  { label: "Relevé de\nretrait", icon: "withdrawal.png", destination: "/withdrawal-history" },
];

const serviceItems = [
  { label: "Changer le mot de passe", icon: "password.png", destination: "/change-password" },
  { label: "À propos de nous", icon: "about.png", destination: "/about" },
  { label: "Télécharger l’application", icon: "download.png", destination: "/install" },
];

const navigationItems = [
  { label: "Accueil", icon: "home.png", destination: "/" },
  { label: "Produits", icon: "products.png", destination: "/invest" },
  { label: "Partage", icon: "share.png", destination: "/tasks" },
  { label: "Équipe", icon: "team.png", destination: "/team" },
  { label: "Compte", icon: "account.png", destination: "/account", active: true },
];

function requestNavigation(destination: string) {
  window.dispatchEvent(new CustomEvent("scotgold-mockup:navigate", { detail: { destination } }));
}

export default function ReferenceMatch() {
  const balance = "50,00 FCFA";
  const totalEarnings = "0,00 FCFA";

  return (
    <main className="scotgold-reference">
      <section className="sg-hero" aria-label="Résumé du compte Scotgold">
        <div className="sg-hero-pattern" aria-hidden="true" />
        <p className="sg-me">MOI</p>
        <img className="sg-logo" src={`${accountIcons}/logo.png`} alt="Scotgold Resources Ltd" />
        <p className="sg-phone">9142383341</p>
        <p className="sg-primary-balance">{balance}</p>
        <div className="sg-account-summary">
          <div className="sg-summary-cell">
            <strong>{balance}</strong>
            <span>Solde</span>
          </div>
          <div className="sg-summary-cell">
            <strong>{totalEarnings}</strong>
            <span>Mes revenus</span>
          </div>
        </div>
      </section>

      <section className="sg-shortcuts" aria-label="Raccourcis du compte">
        {shortcutItems.map(({ label, icon, destination }) => (
          <button
            className="sg-shortcut"
            type="button"
            key={destination}
            onClick={() => requestNavigation(destination)}
            aria-label={label.replace("\n", " ")}
            data-destination={destination}
          >
            <span className="sg-shortcut-icon">
              <img src={`${accountIcons}/${icon}`} alt="" aria-hidden="true" />
            </span>
            <span>{label.split("\n").map((line) => <span key={line}>{line}</span>)}</span>
          </button>
        ))}
      </section>

      <section className="sg-services" aria-label="Paramètres et informations">
        {serviceItems.map(({ label, icon, destination }) => (
          <button
            className="sg-service-row"
            type="button"
            key={destination}
            onClick={() => requestNavigation(destination)}
            data-destination={destination}
          >
            <img src={`${accountIcons}/${icon}`} alt="" aria-hidden="true" />
            <span>{label}</span>
            <span className="sg-chevron" aria-hidden="true" />
          </button>
        ))}
      </section>

      <nav className="sg-bottom-nav" aria-label="Navigation principale">
        {navigationItems.map(({ label, icon, destination, active }) => (
          <button
            className={`sg-nav-item${active ? " is-active" : ""}`}
            type="button"
            key={destination}
            onClick={() => requestNavigation(destination)}
            aria-current={active ? "page" : undefined}
            data-destination={destination}
          >
            <img src={`${accountIcons}/navigation/${icon}`} alt="" aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
