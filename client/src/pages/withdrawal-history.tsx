import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { getCountryByCode } from "@/lib/countries";
import { useViewportBackground } from "@/hooks/use-viewport-background";
import { getTransactionOrderNumber } from "@shared/transaction-order-number";
import EmptyState from "@/components/empty-state";
import "./transaction-history.css";

interface Withdrawal {
  id: number;
  amount: string | number;
  netAmount?: string | number;
  status: string;
  createdAt: string;
}

function formatMoney(value: string | number, currency: string) {
  const amount = Number(value || 0);
  const formatted = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
  return `${formatted} ${currency}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date indisponible";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
}

function getStatus(status: string) {
  switch (status.toLowerCase()) {
    case "approved":
    case "completed":
      return { label: "Réussi", tone: "is-success" };
    case "processing":
      return { label: "En cours", tone: "is-pending" };
    case "rejected":
    case "failed":
    case "canceled":
    case "cancelled":
      return { label: "Refusé", tone: "is-failure" };
    default:
      return { label: "En attente", tone: "is-pending" };
  }
}

export default function WithdrawalHistoryPage() {
  useViewportBackground("#000");
  const { user } = useAuth();
  const countryInfo = user ? getCountryByCode(user.country) : null;
  const currency = countryInfo?.currency === "XOF" || countryInfo?.currency === "XAF"
    ? "FCFA"
    : countryInfo?.currency || "FCFA";

  const {
    data: withdrawals = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Withdrawal[]>({
    queryKey: ["/api/withdrawals/history"],
  });

  return (
    <main className="transaction-history-page">
      <div className="transaction-history-shell">
        <header className="transaction-history-header">
          <Link href="/account" className="transaction-history-back" aria-label="Retour au compte" data-testid="button-back">
            <ChevronLeft aria-hidden="true" />
          </Link>
          <h1>Relevé des retraits</h1>
        </header>

        <section className="transaction-history-list" aria-label="Historique des retraits" aria-live="polite">
          {isLoading ? (
            Array.from({ length: 4 }, (_, index) => (
              <div className="transaction-record-skeleton withdrawal-record-skeleton" key={index} aria-hidden="true" />
            ))
          ) : isError ? (
            <div className="transaction-history-error" role="alert">
              <p>Impossible de charger le relevé des retraits.</p>
              <button type="button" onClick={() => void refetch()}>Réessayer</button>
            </div>
          ) : withdrawals.length === 0 ? (
            <EmptyState className="transaction-history-empty">
              <p>Aucun retrait pour le moment</p>
            </EmptyState>
          ) : (
            withdrawals.map((withdrawal) => {
              const status = getStatus(withdrawal.status);
              const orderNumber = getTransactionOrderNumber("withdrawal", withdrawal.id);
              const receivedAmount = withdrawal.netAmount ?? withdrawal.amount;
              return (
                <article
                  key={withdrawal.id}
                  className="withdrawal-record-card"
                  data-testid={`withdrawal-item-${withdrawal.id}`}
                  data-order-number={orderNumber}
                >
                  <div className="withdrawal-record-heading">
                    <div>
                      <span className="transaction-record-label">Montant</span>
                      <strong className="withdrawal-record-amount">{formatMoney(withdrawal.amount, currency)}</strong>
                    </div>
                    <strong className={`transaction-record-status ${status.tone}`}>{status.label}</strong>
                  </div>
                  <div className="withdrawal-record-arrivals">
                    <span>Montant reçu</span>
                    <strong>{formatMoney(receivedAmount, currency)}</strong>
                  </div>
                  <div className="withdrawal-record-date">
                    <span>Date</span>
                    <time dateTime={withdrawal.createdAt}>{formatDate(withdrawal.createdAt)}</time>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
