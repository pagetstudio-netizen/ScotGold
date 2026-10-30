import { useState } from "react";
import "./ReferenceMatch.css";

type TeamLevel = 1 | 2 | 3;

const levels: Array<{ level: TeamLevel; rate: string; badge: string }> = [
  { level: 1, rate: "35%", badge: "/__mockup/images/scotgold-team/level-1.png" },
  { level: 2, rate: "2%", badge: "/__mockup/images/scotgold-team/level-2.png" },
  { level: 3, rate: "1%", badge: "/__mockup/images/scotgold-team/level-3.png" },
];

const navigation = [
  { label: "Accueil", icon: "home" },
  { label: "Produits", icon: "products" },
  { label: "Partage", icon: "share" },
  { label: "Équipe", icon: "team" },
  { label: "Compte", icon: "account" },
];

function TeamLevelCard({
  level,
  rate,
  badge,
  active,
  onSelect,
}: {
  level: TeamLevel;
  rate: string;
  badge: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`sg-team-level${active ? " is-selected" : ""}`}
      onClick={onSelect}
      aria-label={`Niveau ${level}, taux ${rate}`}
      aria-pressed={active}
    >
      <span className="sg-team-level-head">
        <span className="sg-team-level-name">
          <img src={badge} alt="" />
          <span>Niveau {level}</span>
        </span>
        <span className="sg-team-rate">{rate}</span>
      </span>
      <span className="sg-team-level-stats">
        <span><strong>0</strong><span>Personnes</span></span>
        <span><strong>0,00 FCFA</strong><span>Recharge</span></span>
        <span><strong>0,00 FCFA</strong><span>Revenus</span></span>
      </span>
    </button>
  );
}

export default function ReferenceMatch() {
  const [activeLevel, setActiveLevel] = useState<TeamLevel>(1);
  const [activeDestination, setActiveDestination] = useState("Équipe");

  return (
    <main className="sg-team-phone">
      <div className="sg-team-scroll">
        <header className="sg-team-top">
          <div className="sg-team-heading">Mon équipe</div>
          <section className="sg-team-overview" aria-label="Résumé de l’équipe">
            <div className="sg-team-members">
              <strong>0</strong>
              <span>Personnes</span>
            </div>
            <div className="sg-team-totals">
              <div><strong>0,00 FCFA</strong><span>Revenus totaux</span></div>
              <div><strong>0,00 FCFA</strong><span>Recharge</span></div>
            </div>
          </section>
        </header>

        <section className="sg-team-levels" aria-label="Taille de l’équipe par niveau">
          <h1>Taille de l’équipe</h1>
          <div className="sg-team-level-list">
            {levels.map((item) => (
              <TeamLevelCard
                key={item.level}
                {...item}
                active={activeLevel === item.level}
                onSelect={() => setActiveLevel(item.level)}
              />
            ))}
          </div>
        </section>

        <section className="sg-team-explainer">
          <h2>Créez rapidement votre équipe</h2>
          <div className="sg-team-explainer-card">
            <h3>Pourquoi créer une équipe&nbsp;?</h3>
            <p className="sg-team-rate-summary">Taux de commission par niveau : 35% · 2% · 1%</p>
            <p>
              Invitez vos amis à rejoindre votre équipe grâce à votre lien exclusif&nbsp;!
            </p>
            <p>Méthodes de partage :</p>
            <p>
              1. Copiez votre lien exclusif et envoyez-le à vos amis pour qu’ils rejoignent
              votre équipe. Vous recevez une commission sur leur premier achat payé d’un
              produit stable, selon leur niveau.
            </p>
            <p>
              2. Partagez votre lien dans vos groupes WhatsApp, Instagram, X, Facebook ou
              ailleurs. Les commissions sont calculées selon les conditions du programme.
            </p>
            <p>Par exemple :</p>
            <p>
              Si un membre de niveau 1 effectue un premier achat payé d’un produit stable de
              4 000&nbsp;FCFA, la commission est calculée au taux du niveau 1 affiché ci-dessus.
            </p>
          </div>
        </section>
        <div className="sg-team-scroll-tail" aria-hidden="true" />
      </div>

      <nav className="sg-team-nav" aria-label="Navigation principale">
        {navigation.map((item) => (
          <button
            className={`sg-team-nav-item${item.label === activeDestination ? " is-active" : ""}`}
            type="button"
            key={item.icon}
            aria-current={item.label === activeDestination ? "page" : undefined}
            onClick={() => setActiveDestination(item.label)}
          >
            <img
              src={`/__mockup/images/scotgold-team/navigation/${item.icon}.png`}
              alt=""
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
