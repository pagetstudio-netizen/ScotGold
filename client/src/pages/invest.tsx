import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { getCountryByCode } from "@/lib/countries";
import { Loader2 } from "lucide-react";
import type { Product } from "@shared/schema";
import { isProductStockFull } from "@shared/product-purchase-limit";
import { ProductPurchaseConfirmDialog } from "@/components/product-purchase-confirm-dialog";

import { getScotgoldProductDisplayName, getScotgoldProductImage } from "@/lib/john-deere-assets";
import "./invest.css";

interface ProductWithOwnership extends Product {
  isOwned: boolean;
  canClaimFree: boolean;
  ownedCount?: number;
  stockCount?: number;
  canPurchaseThisLaunch?: boolean;
}

interface UserProduct {
  id: number;
  purchasedAt: string;
  daysRemaining: number;
  totalEarned: string | number;
  prepaidEarnings?: string | number;
  totalReturn?: string | number;
  status: string;
  product: Product | null;
}

function ProductMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="scotgold-product-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export default function InvestPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [confirmProduct, setConfirmProduct] = useState<ProductWithOwnership | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");

  const { data: products, isLoading } = useQuery<ProductWithOwnership[]>({
    queryKey: ["/api/products"],
  });

  const {
    data: userProducts = [],
    isLoading: isUserProductsLoading,
    isError: userProductsError,
    refetch: refetchUserProducts,
  } = useQuery<UserProduct[]>({
    queryKey: ["/api/user/products"],
  });

  const purchaseMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest("POST", `/api/products/${productId}/purchase`, {});
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erreur");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/products"] });
      refreshUser();
      setConfirmProduct(null);
      toast({
        title: "Produit acheté !",
        description: "Les gains stables sont crédités toutes les 24 heures ; ceux des produits d’activité sont versés à l’échéance.",
      });
    },
    onError: (error: any) => {
      setConfirmProduct(null);
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  useEffect(() => {
    if (!user) return;
    const refreshTimer = window.setInterval(() => void refreshUser(), 60_000);
    return () => window.clearInterval(refreshTimer);
  }, [user?.id, refreshUser]);

  if (!user) return null;

  const balance     = parseFloat(user.balance || "0");
  const country     = getCountryByCode(user.country);
  const storedCurrency = country?.currency || "FCFA";
  const currency = /^(XOF|XAF|FCFA)$/i.test(storedCurrency) ? "FCFA" : storedCurrency;
  const formatAmount = (value: number | string | null | undefined) => {
    const amount = Number(value);
    return Math.round(Number.isFinite(amount) ? amount : 0).toLocaleString("fr-FR");
  };
  const formatStatAmount = (value: number | string | null | undefined) => {
    const amount = Number(value);
    return (Number.isFinite(amount) ? amount : 0).toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const formatMoney = (value: number | string | null | undefined) => `${formatAmount(value)} ${currency}`;
  const paidProducts = products?.filter(p => !p.isFree) || [];

  return (
    <main className="scotgold-invest-page">
      <div className="scotgold-invest-shell">
        <header className="scotgold-invest-header">
          <h1>PRODUITS</h1>
        </header>

        <section className="scotgold-invest-balance" aria-label="Solde et revenus">
          <div className="scotgold-invest-balance__item">
            <span className="scotgold-invest-balance__currency">{currency}</span>
            <strong className="scotgold-invest-balance__value">{formatStatAmount(balance)}</strong>
            <div className="scotgold-invest-balance__label">
              <img src="/scotgold-home/assets.png" alt="" aria-hidden="true" />
              <span>Solde</span>
            </div>
          </div>
          <div className="scotgold-invest-balance__item">
            <span className="scotgold-invest-balance__currency">{currency}</span>
            <strong className="scotgold-invest-balance__value">{formatStatAmount(user.totalEarnings)}</strong>
            <div className="scotgold-invest-balance__label">
              <img src="/scotgold-home/income.png" alt="" aria-hidden="true" />
              <span>Mes revenus</span>
            </div>
          </div>
        </section>

        <div className="scotgold-invest-tabs" role="tablist" aria-label="Produits">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "all"}
            className={activeTab === "all" ? "scotgold-invest-tab is-active" : "scotgold-invest-tab"}
            onClick={() => setActiveTab("all")}
          >
            Liste des produits
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "mine"}
            className={activeTab === "mine" ? "scotgold-invest-tab is-active" : "scotgold-invest-tab"}
            onClick={() => setActiveTab("mine")}
          >
            Mes produits
          </button>
        </div>

        <section
          className={activeTab === "all" ? "scotgold-invest-grid" : "scotgold-invest-grid is-owned-products"}
          role="tabpanel"
          aria-live="polite"
        >
          {activeTab === "all" ? (
            isLoading ? (
              Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="h-[370px] rounded-[13px] bg-[#262626]" />
              ))
            ) : paidProducts.length > 0 ? (
              paidProducts.map(product => {
                const productDisplayName = getScotgoldProductDisplayName(product.id, product.name);
                const image = getScotgoldProductImage(product.imageUrl, product.id, product.name);
                const stockFull = isProductStockFull(product.stockLimit, product.stockCount || 0);
                const launchAlreadyPurchased = product.productType === "activity"
                  && product.canPurchaseThisLaunch === false;
                const dailyLabel = product.productType === "stable" ? "Gain quotidien" : "Gain calculé/jour";
                const totalLabel = product.productType === "stable" ? "Gain total" : "Gain à l’échéance";

                return (
                  <article
                    key={product.id}
                    className="scotgold-product-card"
                    data-testid={`product-card-${product.id}`}
                  >
                    <div className="scotgold-product-photo">
                      <img
                        src={image}
                        alt={productDisplayName}
                        onError={event => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = getScotgoldProductImage(null, product.id, product.name);
                        }}
                      />
                      <span>{productDisplayName}</span>
                    </div>
                    <div className="scotgold-product-metrics">
                      <ProductMetric value={formatMoney(product.price)} label="Prix" />
                      <ProductMetric value={formatMoney(product.dailyEarnings)} label={dailyLabel} />
                      <ProductMetric value={formatAmount(product.cycleDays)} label="Jours" />
                      <ProductMetric value={formatMoney(product.totalReturn)} label={totalLabel} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setConfirmProduct(product)}
                      disabled={stockFull || launchAlreadyPurchased}
                      className="scotgold-product-buy"
                      data-testid={`button-purchase-${product.id}`}
                    >
                      {stockFull ? "Complet" : launchAlreadyPurchased ? "Déjà acheté" : "Acheter"}
                    </button>
                  </article>
                );
              })
            ) : (
              <p className="scotgold-invest-empty">Aucun produit disponible pour le moment.</p>
            )
          ) : isUserProductsLoading ? (
            Array.from({ length: 2 }, (_, index) => (
              <Skeleton key={index} className="h-[370px] rounded-[13px] bg-[#262626]" />
            ))
          ) : userProductsError ? (
            <div className="scotgold-invest-empty scotgold-invest-error" role="alert">
              <p>Impossible de charger vos produits.</p>
              <button type="button" onClick={() => void refetchUserProducts()}>Réessayer</button>
            </div>
          ) : userProducts.length > 0 ? (
            userProducts.map((userProduct, index) => {
              const product = userProduct.product;
              const productId = product?.id ?? index + 2;
              const productName = product
                ? getScotgoldProductDisplayName(product.id, product.name)
                : "Produit acheté";
              const image = getScotgoldProductImage(product?.imageUrl, productId, product?.name);
              const dailyLabel = product?.productType === "activity" ? "Gain calculé/jour" : "Gain quotidien";

              return (
                <article
                  key={userProduct.id}
                  className="scotgold-product-card"
                  data-testid={`my-product-card-${userProduct.id}`}
                >
                  <div className="scotgold-product-photo">
                    <img
                      src={image}
                      alt={productName}
                      onError={event => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = getScotgoldProductImage(null, productId, product?.name);
                      }}
                    />
                    <span>{productName}</span>
                  </div>
                  <div className="scotgold-product-metrics">
                    <ProductMetric value={formatMoney(product?.price)} label="Prix" />
                    <ProductMetric value={formatMoney(product?.dailyEarnings)} label={dailyLabel} />
                    <ProductMetric value={formatAmount(userProduct.daysRemaining)} label="Jours restants" />
                    <ProductMetric value={formatMoney(userProduct.totalEarned ?? 0)} label="Gains cumulés" />
                  </div>
                </article>
              );
            })
          ) : (
            <p className="scotgold-invest-empty">Aucun enregistrement pour le moment.</p>
          )}
        </section>
      </div>

      {/* ── Purchase confirm modal ── */}
      {confirmProduct && (() => {
        const stockFull = isProductStockFull(confirmProduct.stockLimit, confirmProduct.stockCount || 0);
        const launchAlreadyPurchased = confirmProduct.productType === "activity"
          && confirmProduct.canPurchaseThisLaunch === false;

        return (
          <ProductPurchaseConfirmDialog
            open
            onOpenChange={(open) => {
              if (!open) setConfirmProduct(null);
            }}
            onConfirm={() => purchaseMutation.mutate(confirmProduct.id)}
            confirmDisabled={purchaseMutation.isPending || stockFull || launchAlreadyPurchased}
            confirmLabel={
              purchaseMutation.isPending
                ? "Traitement…"
                : stockFull
                  ? "Complet"
                  : launchAlreadyPurchased
                    ? "Déjà acheté"
                    : "OUI"
            }
          />
        );
      })()}
      </main>
  );
}
