import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useAuth } from "@/lib/auth";
import { formatCurrency } from "@/lib/countries";
import { apiRequest, queryClient } from "@/lib/queryClient";
import "./checkin-game-visual.css";

type DailyCheckinStatus = {
  amount: number;
  claimedToday: boolean;
};

type DailyCheckinClaimResult = {
  success: boolean;
  amount: number;
  balance: string;
};

type DemoActivityRow = {
  id: string;
  phone: string;
  kind: "Recharge" | "Withdraw";
  amount: number;
};

const demoActivityRows: DemoActivityRow[] = [
  { id: "demo-1", phone: "991****845", kind: "Withdraw", amount: 5_000 },
  { id: "demo-2", phone: "994****643", kind: "Withdraw", amount: 6_000 },
  { id: "demo-3", phone: "939****364", kind: "Withdraw", amount: 5_100 },
  { id: "demo-4", phone: "921****362", kind: "Recharge", amount: 40_000 },
  { id: "demo-5", phone: "939****364", kind: "Recharge", amount: 15_000 },
  { id: "demo-6", phone: "975****451", kind: "Withdraw", amount: 33_400 },
  { id: "demo-7", phone: "919****844", kind: "Recharge", amount: 15_000 },
  { id: "demo-8", phone: "981****014", kind: "Withdraw", amount: 5_000 },
  { id: "demo-9", phone: "917****945", kind: "Recharge", amount: 40_000 },
];

function amountNumber(value: string | number | null | undefined) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

function formatBalance(value: number) {
  return value.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function currencyFor(country: string) {
  const currency = formatCurrency(0, country).replace(/[\d.,\s]/g, "") || "FCFA";
  return /^(XOF|XAF|FCFA)$/i.test(currency) ? "FCFA" : currency;
}

function formatDemoAmount(value: number) {
  return `${value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} FCFA`;
}

export default function HomeDashboard() {
  const { user, refreshUser } = useAuth();
  const [, navigate] = useLocation();
  const [presenceDialogOpen, setPresenceDialogOpen] = useState(false);
  const [dailyBonusMessage, setDailyBonusMessage] = useState<string | null>(null);
  const dailyBonusStatusQuery = useQuery<DailyCheckinStatus>({
    queryKey: ["/api/daily-checkin/status"],
    enabled: presenceDialogOpen && Boolean(user),
    staleTime: 0,
  });
  const dailyBonusClaimMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/daily-checkin/claim", {});
      return response.json() as Promise<DailyCheckinClaimResult>;
    },
    onSuccess: (result) => {
      setDailyBonusMessage(`Votre bonus de ${result.amount} FCFA a été crédité sur votre solde.`);
      void refreshUser();
      void queryClient.invalidateQueries({ queryKey: ["/api/daily-checkin/status"] });
      void queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
    onError: (error: Error & { status?: number }) => {
      setDailyBonusMessage(
        error.status === 409
          ? "Vous avez déjà récupéré votre bonus pour aujourd'hui. Revenez demain."
          : error.message || "Impossible de récupérer le bonus. Réessayez.",
      );
      void queryClient.invalidateQueries({ queryKey: ["/api/daily-checkin/status"] });
    },
  });

  useEffect(() => {
    if (!user) return;
    const refreshTimer = window.setInterval(() => void refreshUser(), 60_000);
    return () => window.clearInterval(refreshTimer);
  }, [user?.id, refreshUser]);

  if (!user) return null;

  const country = user.country;
  const balance = amountNumber(user.balance);
  const totalEarnings = amountNumber(user.totalEarnings);
  const currency = currencyFor(country);

  return (
    <main className="scotgold-home-page">
      <div className="scotgold-home-screen">
        <header className="scotgold-home-intro" aria-label="Scotgold Resources Ltd.">
          <svg className="scotgold-home-streaks" viewBox="0 0 512 342" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="scotgold-streak" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#c89c52" stopOpacity=".38" />
                <stop offset="1" stopColor="#c89c52" stopOpacity="0" />
              </linearGradient>
              <filter id="scotgold-glow" x="-100%" y="-5%" width="300%" height="120%">
                <feGaussianBlur stdDeviation="1.2" />
              </filter>
            </defs>
            <g stroke="url(#scotgold-streak)" strokeWidth="1">
              <path d="M244 0v102" />
              <path d="M258 0v141" />
              <path d="M274 0v68" />
              <path d="M294 0v39" />
              <path d="M341 0v108" />
              <path d="M357 0v181" />
              <path d="M374 0v47" />
              <path d="M391 0v107" />
              <path d="M418 0v224" />
              <path d="M444 0v93" />
              <path d="M468 0v55" />
            </g>
            <g stroke="#e5c27d" strokeOpacity=".28" strokeWidth="2" filter="url(#scotgold-glow)">
              <path d="M258 0v141" />
              <path d="M357 0v181" />
              <path d="M418 0v224" />
            </g>
          </svg>
          <img
            className="scotgold-home-wordmark"
            src="/scotgold-home/wordmark.png"
            alt="Scotgold Resources Ltd."
          />
        </header>

        <div className="scotgold-home-content">
          <section className="scotgold-balance-card" aria-label="Solde et revenus">
            <svg className="scotgold-balance-lines" viewBox="0 0 478 163" preserveAspectRatio="none" aria-hidden="true">
              <g fill="none" stroke="#fff4ca" strokeOpacity=".22" strokeWidth="1">
                <path d="M-20 145C76 105 96 53 173 15s114-49 180-27 76 19 145-5" />
                <path d="M-14 161C91 119 107 77 190 31s111-46 174-23 85 17 140-5" />
                <path d="M-18 125C72 91 101 31 166 7s118-36 185-16 92 26 154-1" />
                <path d="M-22 101C82 71 108 26 183-2s124-14 185 2 91 19 138-3" />
                <path d="M-24 85C71 57 100 20 176-8s123-8 192 12 93 12 140-7" />
                <path d="M-20 153C73 114 106 89 186 73s143-18 216 3 74 23 108 18" />
                <path d="M-18 142C81 112 110 101 188 86s143-16 213 5 78 24 113 21" />
                <path d="M-22 133C74 106 106 114 188 98s143-13 216 7 78 26 112 25" />
                <path d="M-24 119C81 99 113 121 190 109s143-10 216 10 78 23 110 25" />
                <path d="M-21 109C78 93 113 128 192 120s144-6 217 14 75 20 106 24" />
                <path d="M-12 157C102 137 146 145 221 130s123-7 191 12 84 16 104 19" />
              </g>
            </svg>
            <div className="scotgold-balance-column">
              <span className="scotgold-currency">{currency}</span>
              <strong className="scotgold-balance-value">{formatBalance(balance)}</strong>
              <span className="scotgold-balance-label">
                <img src="/scotgold-home/assets.png" alt="" />
                Solde
              </span>
            </div>
            <div className="scotgold-balance-column">
              <span className="scotgold-currency">{currency}</span>
              <strong className="scotgold-balance-value">{formatBalance(totalEarnings)}</strong>
              <span className="scotgold-balance-label">
                <img src="/scotgold-home/income.png" alt="" />
                Mes revenus
              </span>
            </div>
          </section>

          <section className="scotgold-quick-actions" aria-label="Actions rapides">
            <button type="button" className="scotgold-action" onClick={() => navigate("/deposit")}>
              <img src="/scotgold-home/recharge.png" alt="" />
              <span>Recharger</span>
            </button>
            <button type="button" className="scotgold-action" onClick={() => navigate("/withdrawal")}>
              <img src="/scotgold-home/withdraw.png" alt="" />
              <span>Retrait</span>
            </button>
            <button
              type="button"
              className="scotgold-action"
              aria-haspopup="dialog"
              aria-expanded={presenceDialogOpen}
              onClick={() => {
                setDailyBonusMessage(null);
                setPresenceDialogOpen(true);
              }}
            >
              <img src="/scotgold-home/checkin.png" alt="" />
              <span>Présence</span>
            </button>
            <button type="button" className="scotgold-action" onClick={() => navigate("/service")}>
              <img src="/scotgold-home/service.png" alt="" />
              <span>Service client</span>
            </button>
          </section>

          <section className="scotgold-activity-panel" aria-label="Exemples fictifs de transactions">
            <h1 className="scotgold-activity-heading">
              <span aria-hidden="true" />
              <span>User Investment List</span>
              <span className="scotgold-activity-demo">Du lourd</span>
            </h1>
            <div className="scotgold-activity-viewport">
              <div className="scotgold-activity-track">
                {[0, 1].map((copy) => (
                  <div className="scotgold-activity-set" key={copy} aria-hidden={copy === 1}>
                    {demoActivityRows.map((row) => (
                      <div className="scotgold-activity-row" key={`${copy}-${row.id}`}>
                        <span className="scotgold-activity-phone">{row.phone}</span>
                        <span className="scotgold-activity-type">{row.kind}</span>
                        <span className="scotgold-activity-amount">{formatDemoAmount(row.amount)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <DialogPrimitive.Root
        open={presenceDialogOpen}
        onOpenChange={(open) => {
          setPresenceDialogOpen(open);
          if (open) setDailyBonusMessage(null);
        }}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fortune-wheel-modal-backdrop" />
          <DialogPrimitive.Content
            className="fortune-wheel-modal daily-checkin-bonus-modal"
            aria-labelledby="daily-checkin-title"
            aria-describedby="daily-checkin-message"
            style={{
              position: "fixed",
              zIndex: 1001,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              outline: "none",
            }}
          >
            <div className="fortune-wheel-modal__content" aria-live="polite">
              <DialogPrimitive.Title asChild>
                <h2 id="daily-checkin-title">Bonus de connexion</h2>
              </DialogPrimitive.Title>
              {dailyBonusMessage ? (
                <DialogPrimitive.Description
                  id="daily-checkin-message"
                  className="fortune-wheel-modal__message"
                >
                  {dailyBonusMessage}
                </DialogPrimitive.Description>
              ) : dailyBonusStatusQuery.isFetching ? (
                <DialogPrimitive.Description
                  id="daily-checkin-message"
                  className="fortune-wheel-modal__message"
                >
                  Vérification de votre bonus…
                </DialogPrimitive.Description>
              ) : dailyBonusStatusQuery.isError ? (
                <DialogPrimitive.Description
                  id="daily-checkin-message"
                  className="fortune-wheel-modal__message"
                >
                  Impossible de vérifier votre bonus.
                </DialogPrimitive.Description>
              ) : dailyBonusStatusQuery.data?.claimedToday ? (
                <DialogPrimitive.Description
                  id="daily-checkin-message"
                  className="fortune-wheel-modal__message"
                >
                  Vous avez déjà récupéré votre bonus pour aujourd'hui. Revenez demain.
                </DialogPrimitive.Description>
              ) : (
                <>
                  <DialogPrimitive.Description
                    id="daily-checkin-message"
                    className="fortune-wheel-modal__message"
                  >
                    Bonus de connexion disponible : 50 FCFA.
                  </DialogPrimitive.Description>
                  <p className="fortune-wheel-modal__detail">
                    Vous pouvez récupérer ce bonus une fois par jour.
                  </p>
                </>
              )}
            </div>
            <div className="fortune-wheel-modal__footer">
              {dailyBonusStatusQuery.isError && !dailyBonusMessage ? (
                <button
                  type="button"
                  onClick={() => void dailyBonusStatusQuery.refetch()}
                  autoFocus
                >
                  RÉESSAYER
                </button>
              ) : dailyBonusMessage || dailyBonusStatusQuery.data?.claimedToday ? (
                <DialogPrimitive.Close asChild>
                  <button type="button" autoFocus>D’ACCORD</button>
                </DialogPrimitive.Close>
              ) : (
                <button
                  type="button"
                  onClick={() => dailyBonusClaimMutation.mutate()}
                  disabled={
                    dailyBonusClaimMutation.isPending
                    || dailyBonusStatusQuery.isFetching
                    || !dailyBonusStatusQuery.data
                  }
                  autoFocus={!dailyBonusStatusQuery.isFetching}
                >
                  {dailyBonusStatusQuery.isFetching
                    ? "VÉRIFICATION…"
                    : dailyBonusClaimMutation.isPending
                      ? "RÉCUPÉRATION…"
                      : "RÉCUPÉRER 50 FCFA"}
                </button>
              )}
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <style>{`
        .scotgold-home-page,
        .scotgold-home-page *,
        .scotgold-home-page *::before,
        .scotgold-home-page *::after {
          box-sizing: border-box;
        }
        .scotgold-home-page {
          min-height: 100dvh;
          overflow-x: clip;
          background: #050506;
          color: #f3f3f3;
          font-family: Arial, Helvetica, sans-serif;
          -webkit-tap-highlight-color: transparent;
        }
        .scotgold-home-screen {
          width: 100%;
          max-width: 512px;
          min-height: 100dvh;
          margin: 0 auto;
          padding-bottom: calc(92px + env(safe-area-inset-bottom, 0px));
          background: #050506;
        }
        .scotgold-home-intro {
          position: relative;
          height: min(66.8vw, 342px);
          min-height: 0;
          overflow: hidden;
          padding: min(7.4vw, 38px) min(3.3vw, 17px) 0;
          background:
            radial-gradient(ellipse at 73% 4%, rgba(153, 111, 45, .26), transparent 42%),
            linear-gradient(180deg, #1d160d 0%, #050506 39%, #050506 100%);
        }
        .scotgold-home-streaks {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .scotgold-home-wordmark {
          position: relative;
          z-index: 1;
          display: block;
          width: min(38.3vw, 196px);
          height: min(13.1vw, 67px);
          object-fit: contain;
          background: #fff;
        }
        .scotgold-home-content {
          padding: 0 clamp(13px, 3.3vw, 17px);
        }
        .scotgold-balance-card {
          position: relative;
          display: grid;
          width: 100%;
          aspect-ratio: 2.94 / 1;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          overflow: hidden;
          border-radius: 14px;
          background: linear-gradient(107deg, #efc13d 0%, #ffd979 100%);
          color: #16130d;
          box-shadow: 0 2px 10px rgba(255, 206, 82, .08);
        }
        .scotgold-balance-lines {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .scotgold-balance-column {
          position: relative;
          z-index: 1;
          display: flex;
          min-width: 0;
          flex-direction: column;
          align-items: center;
          padding: min(7.6vw, 39px) 0 0;
        }
        .scotgold-currency {
          font-size: 14px;
          font-weight: 400;
          line-height: 17px;
        }
        .scotgold-balance-value {
          margin-top: 18px;
          font-size: clamp(21px, 5.5vw, 28px);
          font-weight: 400;
          line-height: 1.1;
          letter-spacing: -.04em;
        }
        .scotgold-balance-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          font-size: clamp(13px, 3.2vw, 16px);
          line-height: 20px;
          white-space: nowrap;
        }
        .scotgold-balance-label img {
          display: block;
          width: 24px;
          height: 24px;
          object-fit: contain;
        }
        .scotgold-quick-actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px min(3.5vw, 18px);
          margin-top: 15px;
        }
        .scotgold-action {
          display: flex;
          min-width: 0;
          aspect-ratio: 1.83 / 1;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          gap: 9px;
          overflow: hidden;
          border: 0;
          border-radius: 14px;
          padding: 12px clamp(12px, 3vw, 15px) 10px;
          background: #242426;
          color: #e5cb68;
          cursor: pointer;
          font: inherit;
          text-align: left;
          transition: transform .14s ease, filter .14s ease;
        }
        .scotgold-action:nth-child(even) { background: #303033; }
        .scotgold-action img {
          display: block;
          width: min(13.3vw, 68px);
          height: min(13.3vw, 68px);
          flex: 0 0 auto;
          object-fit: contain;
        }
        .scotgold-action span {
          display: block;
          max-width: 100%;
          overflow: hidden;
          font-size: clamp(12px, 3.125vw, 16px);
          line-height: 1.2;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .scotgold-action:hover { filter: brightness(1.06); }
        .scotgold-action:active { transform: scale(.985); }
        .scotgold-action:focus-visible {
          outline: 2px solid #f2d56f;
          outline-offset: 2px;
        }
        .scotgold-activity-panel {
          display: flex;
          height: clamp(300px, 76vw, 390px);
          flex-direction: column;
          overflow: hidden;
          margin-top: 15px;
          border-radius: 14px;
          background: #303033;
          color: #e6e6e6;
        }
        .scotgold-activity-heading {
          display: flex;
          min-height: 57px;
          flex: 0 0 57px;
          align-items: center;
          gap: 7px;
          margin: 0;
          border-bottom: 1px solid #4c4c4e;
          padding: 0 12px;
          color: #e8e8ea;
          font-size: clamp(16px, 3.9vw, 18px);
          font-weight: 500;
          line-height: 1.2;
        }
        .scotgold-activity-demo {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          border: 1px solid rgba(231, 198, 79, .55);
          border-radius: 999px;
          padding: 3px 7px;
          color: #e7c64f;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .06em;
          line-height: 1;
          white-space: nowrap;
        }
        .scotgold-activity-heading > span:first-child {
          display: block;
          width: 5px;
          height: 16px;
          flex: 0 0 5px;
          border-radius: 3px;
          background: #e7c75f;
        }
        .scotgold-activity-heading > span:nth-child(2) {
          min-width: 0;
          flex: 1 1 auto;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .scotgold-activity-viewport {
          min-height: 0;
          flex: 1 1 auto;
          overflow: hidden;
          overscroll-behavior: contain;
        }
        .scotgold-activity-track {
          display: flex;
          flex-direction: column;
          animation: scotgold-activity-scroll 36s linear infinite;
          will-change: transform;
        }
        .scotgold-activity-set { flex: 0 0 auto; padding: 0 12px 4px; }
        .scotgold-activity-row {
          display: grid;
          height: 38px;
          min-height: 38px;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
          align-items: center;
          gap: 8px;
          color: #e0e0e2;
          font-size: 16px;
          line-height: 1.2;
        }
        .scotgold-activity-phone,
        .scotgold-activity-type {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .scotgold-activity-amount {
          overflow: hidden;
          color: #e7c64f;
          font-size: 15px;
          text-align: right;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        @keyframes scotgold-activity-scroll { to { transform: translateY(-50%); } }
        @media (max-width: 360px) {
          .scotgold-balance-column { padding-top: 18px; }
          .scotgold-balance-value { margin-top: 8px; }
          .scotgold-balance-label { margin-top: 5px; }
          .scotgold-balance-label img { width: 20px; height: 20px; }
          .scotgold-activity-row { font-size: 14px; }
          .scotgold-activity-amount { font-size: 13px; }
          .scotgold-activity-panel { height: clamp(280px, 76vw, 350px); }
          .scotgold-activity-heading { font-size: 16px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .scotgold-activity-viewport { overflow-y: auto; }
          .scotgold-activity-track { animation: none; }
          .scotgold-activity-set[aria-hidden="true"] { display: none; }
          .scotgold-home-page *, .scotgold-home-page *::before, .scotgold-home-page *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
