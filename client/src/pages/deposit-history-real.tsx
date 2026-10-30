import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { getCountryByCode } from "@/lib/countries";
import { useViewportBackground } from "@/hooks/use-viewport-background";
import { getTransactionOrderNumber } from "@shared/transaction-order-number";
import EmptyState from "@/components/empty-state";
import "./transaction-history.css";

interface Deposit {
  id: number;
  amount: string | number;
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

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date indisponible";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
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

export default function DepositHistoryPage() {
  useViewportBackground("#000");
  const { user } = useAuth();
  const countryInfo = user ? getCountryByCode(user.country) : null;
  const currency = countryInfo?.currency === "XOF" || countryInfo?.currency === "XAF"
    ? "FCFA"
    : countryInfo?.currency || "FCFA";

  const {
    data: deposits = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Deposit[]>({
    queryKey: ["/api/deposits/history"],
  });

  return (
    <main className="transaction-history-page">
      <div className="transaction-history-shell">
        <header className="transaction-history-header">
          <Link href="/account" className="transaction-history-back" aria-label="Retour au compte" data-testid="button-back">
            <ChevronLeft aria-hidden="true" />
          </Link>
          <h1>Relevé des dépôts</h1>
        </header>

        <section className="transaction-history-list" aria-label="Historique des dépôts" aria-live="polite">
          {isLoading ? (
            Array.from({ length: 4 }, (_, index) => (
              <div className="transaction-record-skeleton deposit-record-skeleton" key={index} aria-hidden="true" />
            ))
          ) : isError ? (
            <div className="transaction-history-error" role="alert">
              <p>Impossible de charger le relevé des dépôts.</p>
              <button type="button" onClick={() => void refetch()}>Réessayer</button>
            </div>
          ) : deposits.length === 0 ? (
            <EmptyState className="transaction-history-empty">
              <p>Aucun dépôt effectué</p>
            </EmptyState>
          ) : (
            deposits.map((deposit) => {
              const status = getStatus(deposit.status);
              const orderNumber = getTransactionOrderNumber("deposit", deposit.id);
              return (
                <article
                  key={deposit.id}
                  className="deposit-record-card"
                  data-testid={`deposit-item-${deposit.id}`}
                  data-order-number={orderNumber}
                >
                  <div className="deposit-record-heading">
                    <span className="transaction-record-label">Montant</span>
                    <strong className={`transaction-record-status ${status.tone}`}>{status.label}</strong>
                  </div>
                  <strong className="deposit-record-amount">{formatMoney(deposit.amount, currency)}</strong>
                  <div className="deposit-record-details">
                    <div className="deposit-record-detail">
                      <span>Numéro de commande</span>
                      <strong title={orderNumber}>{orderNumber}</strong>
                    </div>
                    <div className="deposit-record-detail">
                      <span>Date</span>
                      <time dateTime={deposit.createdAt}>{formatDateTime(deposit.createdAt)}</time>
                    </div>
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
