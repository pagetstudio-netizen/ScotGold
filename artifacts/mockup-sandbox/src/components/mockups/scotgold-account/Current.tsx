import "./Current.css";
import "./CurrentPreview.css";

const items = [
  ["Changer le mot de passe", "/__mockup/images/scotgold-account/password.png"],
  ["Ma carte bancaire", "/__mockup/images/scotgold-account/bank.png"],
  ["Relevé de solde", "/__mockup/images/scotgold-account/history.png"],
  ["Contactez-nous", "/__mockup/images/scotgold-account/about.png"],
  ["À propos de nous", "/__mockup/images/scotgold-account/about.png"],
  ["Trésor", "/__mockup/images/scotgold-account/history.png"],
  ["Télécharger l'application", "/__mockup/images/scotgold-account/download.png"],
  ["Se déconnecter", "/__mockup/images/scotgold-account/password.png"],
];

const nav = [
  { key: "home", label: "Accueil" },
  { key: "products", label: "Produits" },
  { key: "share", label: "Partage" },
  { key: "team", label: "Équipe" },
  { key: "account", label: "Compte" },
];

export default function Current() {
  return (
    <main className="account-page">
      <div className="account-shell">
        <section className="account-stage" aria-label="Mon compte">
          <div className="account-card">
            <div className="account-card-art" />
            <div className="account-card-shade" />
            <div className="account-card-content">
              <div className="account-balance-pill">
                <span className="account-phone">9142383341</span>
                <span className="account-balance">Solde du compte : 50 FCFA</span>
              </div>
              <div className="account-shortcuts">
                <button type="button">
            <img src="/__mockup/images/scotgold-account/recharge.png" alt="" />
                  <span>Recharger</span>
                </button>
                <button type="button">
            <img src="/__mockup/images/scotgold-account/withdrawal.png" alt="" />
                  <span>Retirer</span>
                </button>
              </div>
            </div>
          </div>
          <div className="account-brand-mark">
            <img src="/__mockup/images/scotgold-account/logo.png" alt="" />
          </div>
        </section>
        <nav className="account-menu" aria-label="Services du compte">
          <div className="account-menu-grid">
            {items.map(([label, image]) => (
              <button className="account-menu-item" type="button" key={label}>
                <span className="account-menu-icon"><img src={image} alt="" /></span>
                <span className="account-menu-label">{label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
      <nav className="account-preview-nav" aria-label="Navigation principale">
        {nav.map(({ key, label }) => (
          <span className={key === "account" ? "active" : ""} key={key}>
            <img src={`/__mockup/images/scotgold-account/navigation/${key}.png`} alt="" />
            <small>{label}</small>
          </span>
        ))}
      </nav>
    </main>
  );
}
