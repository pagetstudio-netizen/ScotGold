import "./_group.css";
import { useState, type ReactNode } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
const SCOTGOLD_LOGO = "/__mockup/images/scotgold-products/logo.png";
const serviceIcon = "/__mockup/images/scotgold-products/service.png";

interface ProductWithOwnership {
  id: number;
  name: string;
  price: number;
  cycleDays: number;
  dailyEarnings: number;
  totalReturn: number;
  productType: "stable" | "activity";
  imageUrl: string | null;
  isFree: boolean;
  isOwned: boolean;
  canClaimFree: boolean;
  ownedCount?: number;
  stockLimit?: number | null;
  stockCount?: number;
  canPurchaseThisLaunch?: boolean;
}

const sampleProducts: ProductWithOwnership[] = [
  { id: 2, name: "Robot 1", price: 150, cycleDays: 100, dailyEarnings: 50, totalReturn: 5000, productType: "stable", imageUrl: null, isFree: false, isOwned: false, canClaimFree: false },
  { id: 3, name: "Robot 2", price: 400, cycleDays: 100, dailyEarnings: 133, totalReturn: 13300, productType: "stable", imageUrl: null, isFree: false, isOwned: false, canClaimFree: false },
  { id: 4, name: "Robot 3", price: 600, cycleDays: 100, dailyEarnings: 200, totalReturn: 20000, productType: "stable", imageUrl: null, isFree: false, isOwned: false, canClaimFree: false },
  { id: 5, name: "Robot 4", price: 1000, cycleDays: 100, dailyEarnings: 333, totalReturn: 33300, productType: "stable", imageUrl: null, isFree: false, isOwned: false, canClaimFree: false },
];

function getScotgoldProductDisplayName(id: number, _productName?: string | null) {
  return `Scotgold ${Math.max(1, id - 1)}`;
}

function getScotgoldProductImage(_imageUrl: string | null, id: number, _productName?: string | null) {
  const imageIndex = ((id - 2) % 6 + 6) % 6 + 1;
  return `/__mockup/images/scotgold-products/vip${imageIndex}.jpg`;
}

function isProductStockFull(limit: number | null | undefined, count: number) {
  return limit != null && count >= limit;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={className} />;
}

function EmptyState({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={className}>{children}</div>;
}

function formatNumber(value: number | string) {
  return Number(value).toLocaleString("fr-FR");
}

export function Current() {
  const user = { balance: "0", country: "TG" };
  const navigate = (_path: string) => {};
  const [confirmProduct, setConfirmProduct] = useState<ProductWithOwnership | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");
  const products = sampleProducts;
  const isLoading = false;
  const purchaseMutation = { isPending: false, mutate: (_id: number) => setConfirmProduct(null) };
  const balance = parseFloat(user.balance);
  const currency = "FCFA";
  const paidProducts = products.filter(p => !p.isFree);
  const myProducts   = paidProducts.filter(p => p.isOwned);
  const displayed    = activeTab === "all" ? paidProducts : myProducts;

  return (
    <div className="flex flex-col min-h-full" style={{ background: "#f0f2f5" }}>

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 py-3 shadow-sm"
        style={{ background: "linear-gradient(135deg, #142644 0%, #0b1733 100%)" }}
      >
          <div className="flex items-center gap-2">
            <img src={SCOTGOLD_LOGO} alt="Scotgold Resources Ltd." className="h-8 w-8 rounded-md object-contain" />
            <span className="text-white text-sm font-bold">Scotgold</span>
          </div>
        <button
          onClick={() => navigate("/service")}
          className="flex items-center justify-center"
          data-testid="button-service"
        >
          <img src={serviceIcon} alt="Service client" className="w-8 h-8 object-contain" />
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-3 px-4 pt-4 pb-2">
        <button
          onClick={() => setActiveTab("all")}
          className="px-5 py-2 rounded-full font-bold text-sm transition-all"
          style={{
            background: activeTab === "all"
              ? "linear-gradient(135deg, #c6a64e, #9c7d2f)"
              : "linear-gradient(135deg, #f5edcf, #e8dcae)",
            color: activeTab === "all" ? "#142644" : "#5c4b1f",
          }}
        >
          our products
        </button>
        <button
          onClick={() => setActiveTab("mine")}
          className="px-5 py-2 rounded-full font-bold text-sm transition-all"
          style={{
            background: activeTab === "mine"
              ? "linear-gradient(135deg, #367c2b, #25591c)"
              : "linear-gradient(135deg, #bbf7d0, #86efac)",
            color: activeTab === "mine" ? "#fff" : "#15803d",
          }}
        >
          my product
        </button>
      </div>

      {/* ── Product list ── */}
      <div className="flex-1 overflow-y-auto pb-24 px-3 space-y-3 pt-1">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)
        ) : displayed.length > 0 ? (
          displayed.map((product) => {
            const productDisplayName = getScotgoldProductDisplayName(product.id, product.name);
            const img = getScotgoldProductImage(product.imageUrl, product.id, product.name);
            const stockFull = isProductStockFull(product.stockLimit, product.stockCount || 0);
            const launchAlreadyPurchased = product.productType === "activity"
              && product.canPurchaseThisLaunch === false;
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden flex"
                data-testid={`product-card-${product.id}`}
              >
                {/* Left — product image */}
                <div className="shrink-0" style={{ width: 150, minHeight: 160 }}>
                  <img
                    src={img}
                    alt={productDisplayName}
                    className="w-full h-full object-cover"
                    style={{ minHeight: 160 }}
                    onError={(event) => {
                      if (product.productType === "activity") {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = getScotgoldProductImage(null, product.id, product.name);
                      }
                    }}
                  />
                </div>

                {/* Right — info */}
                <div className="flex-1 flex flex-col px-3 pt-3 pb-3 min-w-0">
                  {/* Name + Acheter */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-black text-gray-900 text-base leading-tight">{productDisplayName}</p>
                    <button
                      onClick={() => setConfirmProduct(product)}
                      disabled={stockFull || launchAlreadyPurchased}
                      className="shrink-0 px-4 py-1.5 rounded-full text-white text-sm font-bold shadow"
                      style={{
                        background: "linear-gradient(135deg, #367c2b, #25591c)",
                        opacity: stockFull || launchAlreadyPurchased ? 0.55 : 1,
                      }}
                      data-testid={`button-purchase-${product.id}`}
                    >
                      {stockFull ? "Complet" : launchAlreadyPurchased ? "Déjà acheté" : "Acheter"}
                    </button>
                  </div>
                  {product.productType === "activity" && (product.stockLimit != null || launchAlreadyPurchased) && (
                    <p className={`text-xs mb-2 ${stockFull || launchAlreadyPurchased ? "text-red-600" : "text-gray-500"}`}>
                      {stockFull
                        ? `Toutes les places sont prises (${product.stockCount || 0}/${product.stockLimit}).`
                        : launchAlreadyPurchased
                          ? "Vous pourrez acheter un autre produit au prochain lancement."
                          : `${product.stockCount || 0}/${product.stockLimit} places prises`}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="space-y-1 mt-auto">
                    {[
                      { label: "Prix unitaire",    value: `${currency} ${Number(product.price).toLocaleString("fr-FR")}` },
                      { label: "Validité",         value: `${product.cycleDays} Jours` },
                      { label: "Gain/jour (calcul)", value: `${currency} ${Number(product.dailyEarnings).toLocaleString("fr-FR")}` },
                       {
                         label: product.productType === "stable" ? "Rendement total prévu" : "Gain à l’échéance",
                         value: `${currency} ${Number(product.totalReturn).toLocaleString("fr-FR")}`,
                       },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-gray-400 text-[11px]">{label}</span>
                        <span className="font-bold text-[11px]" style={{ color: "var(--ton-green)" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
           <EmptyState className="text-center py-8 flex flex-col items-center gap-2">
            <p className="text-gray-400 text-sm">
              {activeTab === "mine" ? "Vous n'avez aucun produit actif" : "Aucun produit disponible"}
            </p>
           </EmptyState>
        )}
      </div>

      {/* ── Purchase confirm modal ── */}
      {confirmProduct && (() => {
        const productDisplayName = getScotgoldProductDisplayName(confirmProduct.id, confirmProduct.name);
        const prodImg   = getScotgoldProductImage(confirmProduct.imageUrl, confirmProduct.id, confirmProduct.name);
        const stockFull = isProductStockFull(confirmProduct.stockLimit, confirmProduct.stockCount || 0);
        const launchAlreadyPurchased = confirmProduct.productType === "activity"
          && confirmProduct.canPurchaseThisLaunch === false;
        const shortage  = confirmProduct.price - balance;
        const daily     = Number(confirmProduct.dailyEarnings || 0);
        const total     = Number(confirmProduct.totalReturn  || daily * Number(confirmProduct.cycleDays || 90));
        const duration  = Number(confirmProduct.cycleDays || 90);

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black/60"
            onClick={() => setConfirmProduct(null)}
          >
            <div
              className="w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: "linear-gradient(160deg, #142644 0%, #0b1733 100%)" }}
              onClick={e => e.stopPropagation()}
            >
              {/* ── Title block ── */}
              <div className="px-5 pt-6 pb-4">
                <p className="text-white font-extrabold text-2xl leading-tight">
                  {productDisplayName}
                </p>
                <p className="text-white/70 text-sm mt-2 leading-relaxed">
                  {confirmProduct.productType === "stable"
                    ? "Les gains stables sont crédités toutes les 24 heures, dans la limite du rendement total prévu."
                    : "Les gains du produit d’activité sont versés à l’échéance."}
                </p>
              </div>

              {/* ── Details row ── */}
              <div className="mx-5 mb-4 flex items-start gap-4">
                {/* Product image */}
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border-2 border-white/20">
                  <img src={prodImg} alt={productDisplayName} className="w-full h-full object-cover" />
                </div>

                {/* Info list */}
                <div className="flex-1 space-y-2">
                  {[
                    { label: "Prix",              value: `${currency} ${Number(confirmProduct.price).toLocaleString("fr-FR")}` },
                    { label: "Gain/jour (calcul)", value: `${currency} ${daily.toLocaleString("fr-FR")}` },
                    {
                      label: confirmProduct.productType === "stable" ? "Rendement total prévu" : "Gain à l’échéance",
                      value: `${currency} ${total.toLocaleString("fr-FR")}`,
                    },
                    { label: "Période de validité", value: `${duration} jours` },
                  ].map(row => (
                    <div key={row.label}>
                      <p className="text-white/60 text-[10px] leading-none">{row.label}</p>
                      <p className="text-white font-bold text-[13px] leading-tight">{row.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Insufficient balance warning ── */}
              {shortage > 0 && (
                <div className="mx-5 mb-4 flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ background: "rgba(220,50,50,0.22)", border: "1px solid rgba(255,100,100,0.35)" }}>
                  <AlertTriangle className="w-4 h-4 text-red-300 shrink-0" />
                  <p className="text-red-200 text-xs leading-snug">
                    Solde insuffisant. Il vous manque {currency} {shortage.toLocaleString("fr-FR")}.
                  </p>
                </div>
              )}

              {/* ── Buttons ── */}
              <div className="flex gap-3 px-5 pb-6">
                <button
                  onClick={() => setConfirmProduct(null)}
                  className="flex-1 py-3 rounded-2xl font-semibold text-white/80 text-sm active:opacity-70 transition-opacity"
                  style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}
                  data-testid="button-cancel-purchase"
                >
                  Annuler
                </button>
                <button
                  onClick={() => purchaseMutation.mutate(confirmProduct.id)}
                  disabled={purchaseMutation.isPending || stockFull || launchAlreadyPurchased}
                  className="flex-1 py-3 rounded-2xl font-bold text-white/90 text-sm flex items-center justify-center gap-1.5 active:opacity-70 transition-opacity"
                  style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}
                  data-testid="button-confirm-purchase"
                >
                  {purchaseMutation.isPending
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : stockFull
                      ? "Complet"
                      : launchAlreadyPurchased
                        ? "Déjà acheté"
                        : "Confirmer"
                  }
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
