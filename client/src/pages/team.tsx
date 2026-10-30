import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { getCountryByCode } from "@/lib/countries";
import { useLocation } from "wouter";
import "./team.css";

type TeamLevel = 1 | 2 | 3;

interface TeamStats {
  level1Count: number;
  level2Count: number;
  level3Count: number;
  totalCommission: number;
  level1Commission: number;
  level2Commission: number;
  level3Commission: number;
  level1RechargeAmount: number;
  level2RechargeAmount: number;
  level3RechargeAmount: number;
  teamRechargeAmount: number;
}

const formatWholeNumber = (value: number) =>
  Math.round(Number(value) || 0).toLocaleString("fr-FR");

const formatAmount = (value: number, decimals = false) =>
  new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(Number(value) || 0);

const formatRate = (value: string | undefined) => {
  const rate = Number(value);
  return Number.isFinite(rate)
    ? `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(rate)}%`
    : "—";
};

export default function TeamPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const {
    data: stats,
    isError: statsError,
  } = useQuery<TeamStats>({
    queryKey: ["/api/team/stats"],
  });

  const {
    data: settings,
    isError: settingsError,
  } = useQuery<Record<string, string>>({
    queryKey: ["/api/settings"],
  });

  if (!user) return null;

  const countryInfo = getCountryByCode(user.country || "TG");
  const rawCurrency = countryInfo?.currency || "FCFA";
  const currency = ["XOF", "XAF", "FCFA"].includes(rawCurrency) ? "FCFA" : rawCurrency;

  const levels: TeamLevel[] = [1, 2, 3];
  const levelStats = {
    1: {
      count: stats?.level1Count ?? 0,
      commission: stats?.level1Commission ?? 0,
      recharge: stats?.level1RechargeAmount ?? 0,
    },
    2: {
      count: stats?.level2Count ?? 0,
      commission: stats?.level2Commission ?? 0,
      recharge: stats?.level2RechargeAmount ?? 0,
    },
    3: {
      count: stats?.level3Count ?? 0,
      commission: stats?.level3Commission ?? 0,
      recharge: stats?.level3RechargeAmount ?? 0,
    },
  } satisfies Record<TeamLevel, { count: number; commission: number; recharge: number }>;
  const levelRates = levels.map((level) =>
    formatRate(settings?.[`level${level}Commission`]),
  );
  const teamSize =
    (stats?.level1Count ?? 0) +
    (stats?.level2Count ?? 0) +
    (stats?.level3Count ?? 0);
  const formatMoney = (value: number) => `${formatAmount(value, true)} ${currency}`;

  return (
    <main className="team-page">
      <div className="team-page-shell">
        <section className="team-hero" aria-labelledby="team-page-title">
          <div className="team-hero-decoration" aria-hidden="true" />
          <h1 className="team-hero-title" id="team-page-title">Mon équipe</h1>
          <div className="team-hero-panels">
            <div className="team-people-card">
              <strong>{formatWholeNumber(teamSize)}</strong>
              <span>Personnes</span>
            </div>
            <div className="team-hero-summaries">
              <div className="team-summary-card">
                <strong>{formatMoney(stats?.totalCommission ?? 0)}</strong>
                <span>Revenus totaux</span>
              </div>
              <div className="team-summary-card">
                <strong>{formatMoney(stats?.teamRechargeAmount ?? 0)}</strong>
                <span>Recharge</span>
              </div>
            </div>
          </div>
        </section>

        <section className="team-levels" aria-labelledby="team-levels-title">
          <h2 className="team-section-title" id="team-levels-title">Taille de l’équipe</h2>
          <div className="team-level-list">
            {levels.map((level) => {
              const current = levelStats[level];
              return (
                <button
                  key={level}
                  type="button"
                  className="team-level-card"
                  onClick={() => navigate(`/team-details?level=${level}`)}
                  aria-label={`Voir les détails du niveau ${level}`}
                  data-testid={`team-level-card-${level}`}
                >
                  <span className="team-level-card-header">
                    <img
                      src={`/scotgold-team/level-${level}.png`}
                      alt=""
                      aria-hidden="true"
                    />
                    <span className="team-level-name">Niveau {level}</span>
                    <span className="team-level-rate">
                      {formatRate(settings?.[`level${level}Commission`])}
                    </span>
                  </span>
                  <span className="team-level-card-body">
                    <span className="team-level-metric">
                      <strong>{formatWholeNumber(current.count)}</strong>
                      <span>Personnes</span>
                    </span>
                    <span className="team-level-metric">
                      <strong>{formatMoney(current.recharge)}</strong>
                      <span>Recharge</span>
                    </span>
                    <span className="team-level-metric">
                      <strong>{formatMoney(current.commission)}</strong>
                      <span>Revenus</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="team-guide" aria-labelledby="team-guide-title">
          <h2 className="team-section-title" id="team-guide-title">
            Créez rapidement votre équipe
          </h2>
          <article className="team-guide-card">
            <h3>Pourquoi créer une équipe&nbsp;?</h3>
            <p>
              Taux de commission de l’équipe : ({levelRates.join(" · ")})
            </p>
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
              Si un membre de niveau 1 effectue un premier achat payé d’un produit stable
              de 4 000&nbsp;FCFA, la commission est calculée au taux du niveau 1 affiché
              ci-dessus.
            </p>
          </article>
        </section>

        {(statsError || settingsError) && (
          <p className="team-page-error" role="status">
            Certaines données de l’équipe ne sont pas disponibles pour le moment.
          </p>
        )}
      </div>
    </main>
  );
}
