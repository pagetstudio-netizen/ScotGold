import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getPaymentMethodsForCountry, type ApiCountry } from "@/lib/countries";
import { Loader2, Trash2, CreditCard, ChevronLeft, ChevronRight, Shield, Check } from "lucide-react";
import { Link, useLocation, useSearch } from "wouter";
import type { WithdrawalWallet } from "@shared/schema";
import EmptyState from "@/components/empty-state";
import "./wallet-form.css";

const walletSchema = z.object({
  accountName: z.string().min(2, "Nom du titulaire requis"),
  accountNumber: z.string().min(8, "Numéro requis"),
  paymentMethod: z.string().min(2, "Moyen de paiement requis"),
});

type WalletForm = z.infer<typeof walletSchema>;

export default function WalletPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const selectMode = params.get("from") === "withdrawal";
  const openFormDirectly = params.get("mode") === "form";
  const [showBankSheet, setShowBankSheet] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const operatorPickerRef = useRef<HTMLDivElement | null>(null);
  const operatorTriggerRef = useRef<HTMLButtonElement | null>(null);

  const { data: wallets, isLoading } = useQuery<WithdrawalWallet[]>({
    queryKey: ["/api/wallets"],
  });
  const showForm =
    !selectMode ||
    openFormDirectly ||
    (!isLoading && (wallets?.length ?? 0) === 0);

  const { data: apiCountries = [], isLoading: isCountriesLoading } = useQuery<ApiCountry[]>({
    queryKey: ["/api/countries"],
  });

  useEffect(() => {
    if (!showBankSheet) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!operatorPickerRef.current?.contains(event.target as Node)) {
        setShowBankSheet(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowBankSheet(false);
        operatorTriggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [showBankSheet]);

  const form = useForm<WalletForm>({
    resolver: zodResolver(walletSchema),
    defaultValues: { accountName: "", accountNumber: "", paymentMethod: "" },
  });

  const primaryWallet = wallets?.find((wallet) => wallet.isDefault) ?? wallets?.[0];
  const formInitialized = useRef(false);

  useEffect(() => {
    if (!showForm || isLoading || formInitialized.current) return;
    formInitialized.current = true;
    if (!primaryWallet) return;

    form.reset({
      accountName: primaryWallet.accountName,
      accountNumber: primaryWallet.accountNumber,
      paymentMethod: primaryWallet.paymentMethod,
    });
    setSelectedMethod(primaryWallet.paymentMethod);
  }, [form, isLoading, primaryWallet, showForm]);

  const addMutation = useMutation({
    mutationFn: async (data: WalletForm) => {
      const response = await apiRequest("POST", "/api/wallets", {
        ...data,
        country: user!.country,
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Erreur");
      }
      return response.json();
    },
    onSuccess: (savedWallet: WithdrawalWallet) => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      toast({ title: "Compte de retrait enregistré" });
      form.reset({
        accountName: savedWallet.accountName,
        accountNumber: savedWallet.accountNumber,
        paymentMethod: savedWallet.paymentMethod,
      });
      setSelectedMethod(savedWallet.paymentMethod);
      if (selectMode) {
        localStorage.setItem("selectedWalletId", savedWallet.id.toString());
        navigate("/withdrawal");
      }
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (walletId: number) => {
      const response = await apiRequest("DELETE", `/api/wallets/${walletId}`, {});
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Erreur");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      toast({ title: "Portefeuille supprimé !" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (walletId: number) => {
      const response = await apiRequest("PATCH", `/api/wallets/${walletId}/default`, {});
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Erreur");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const handleSelectWallet = (wallet: WithdrawalWallet) => {
    if (selectMode) {
      localStorage.setItem("selectedWalletId", wallet.id.toString());
      navigate("/withdrawal");
    }
  };

  const handleChooseMethod = (method: string) => {
    setSelectedMethod(method);
    form.setValue("paymentMethod", method);
    setShowBankSheet(false);
    operatorTriggerRef.current?.focus();
  };

  const handleSubmit = form.handleSubmit((data) => addMutation.mutate(data));

  if (!user) return null;

  const paymentMethods = getPaymentMethodsForCountry(user.country, apiCountries);
  const backLink = selectMode ? "/withdrawal" : "/account";

  /* ─── ADD FORM VIEW ─── */
  if (showForm) {
    return (
      <main className="wallet-form-page">
        <div className="wallet-form-shell">
          <header className="wallet-form-header">
            <button
              type="button"
              onClick={() => navigate(backLink)}
              className="wallet-form-back"
              aria-label="Retour"
              data-testid="button-back-form"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <h1>Compte de retrait lié</h1>
          </header>

          <form className="wallet-form-content" onSubmit={handleSubmit}>
            <div className="wallet-form-fields">
              <div className="wallet-form-field">
                <label htmlFor="wallet-account-name">Nom réel</label>
                <input
                  {...form.register("accountName")}
                  id="wallet-account-name"
                  autoComplete="name"
                  placeholder="Saisir le nom du titulaire"
                  data-testid="input-wallet-name"
                />
                {form.formState.errors.accountName && (
                  <p className="wallet-form-error">{form.formState.errors.accountName.message}</p>
                )}
              </div>

              <div className="wallet-form-field wallet-operator-field" ref={operatorPickerRef}>
                <label id="wallet-operator-label">Opérateur</label>
                <button
                  type="button"
                  ref={operatorTriggerRef}
                  onClick={() => setShowBankSheet((open) => !open)}
                  className={`wallet-form-select${selectedMethod ? " has-value" : ""}`}
                  aria-label="Sélectionner un opérateur"
                  aria-haspopup="listbox"
                  aria-expanded={showBankSheet}
                  aria-controls="wallet-operator-options"
                  data-testid="button-select-bank"
                >
                  <span>{selectedMethod || "Choisir un opérateur"}</span>
                  <ChevronRight aria-hidden="true" />
                </button>
                {showBankSheet && (
                  <div
                    id="wallet-operator-options"
                    className="wallet-operator-options"
                    role="listbox"
                    aria-labelledby="wallet-operator-label"
                  >
                    {paymentMethods.length > 0 ? paymentMethods.map((method) => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => handleChooseMethod(method)}
                        className={`wallet-operator-option${selectedMethod === method ? " is-selected" : ""}`}
                        role="option"
                        aria-selected={selectedMethod === method}
                        data-testid={`button-bank-${method}`}
                      >
                        {method}
                      </button>
                    )) : (
                      <p className="wallet-operator-empty">
                        {isCountriesLoading ? "Chargement des opérateurs…" : "Aucun opérateur disponible pour ce pays."}
                      </p>
                    )}
                  </div>
                )}
                {form.formState.errors.paymentMethod && (
                  <p className="wallet-form-error">{form.formState.errors.paymentMethod.message}</p>
                )}
              </div>

              <div className="wallet-form-field">
                <label htmlFor="wallet-account-number">Compte bancaire</label>
                <input
                  {...form.register("accountNumber")}
                  id="wallet-account-number"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="Saisir le numéro du compte"
                  data-testid="input-wallet-number"
                />
                {form.formState.errors.accountNumber && (
                  <p className="wallet-form-error">{form.formState.errors.accountNumber.message}</p>
                )}
              </div>
            </div>

            <section className="wallet-form-reminders" aria-labelledby="wallet-reminders-title">
              <h2 id="wallet-reminders-title">Rappels importants :</h2>
              <ol>
                <li>Vérifiez les informations de votre compte avant de le lier pour éviter tout problème lors du retrait.</li>
                <li>Après la liaison du compte, vérifiez à nouveau ses coordonnées pour éviter un échec de retrait.</li>
                <li>En cas d’erreur pendant la procédure, contactez le service client Scotgold pour obtenir de l’aide.</li>
              </ol>
            </section>

            <button
              type="submit"
              disabled={addMutation.isPending}
              className="wallet-form-submit"
              data-testid="button-confirm-wallet"
            >
              {addMutation.isPending ? (
                <span className="wallet-form-submit-loading">
                  <Loader2 aria-hidden="true" />
                  Enregistrement…
                </span>
              ) : primaryWallet ? (
                "Enregistrer"
              ) : (
                "Ajouter"
              )}
            </button>
          </form>
        </div>
      </main>
    );
  }

  /* ─── LIST VIEW ─── */
  return (
    <div className="flex flex-col min-h-full bg-gray-50">

      {/* Header */}
      <div
        className="flex items-center px-4 py-4"
        style={{ background: "linear-gradient(112deg, #55c9e5 0%, #3174d1 100%)" }}
      >
        <Link href={backLink}>
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20" data-testid="button-back">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        </Link>
        <h1 className="flex-1 text-center text-white font-bold text-base">
          {selectMode ? "Sélectionner un compte" : "Liste des comptes bancaires"}
        </h1>
        <div className="w-9" />
      </div>

      {/* Wallet list */}
      <div className="flex-1 px-4 pt-4 pb-28 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#3174d1]" />
          </div>
        ) : wallets && wallets.length > 0 ? (
          wallets.map((wallet) => (
            <div
              key={wallet.id}
              onClick={() => selectMode && handleSelectWallet(wallet)}
              className={`bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 ${
                selectMode ? "cursor-pointer active:opacity-80" : ""
              } ${wallet.isDefault ? "border-l-4 border-[#3174d1]" : ""}`}
              data-testid={`wallet-card-${wallet.id}`}
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-gray-500" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm">{wallet.paymentMethod}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{wallet.accountName}</p>
                <p className="text-xs text-gray-400 mt-0.5">{wallet.accountNumber}</p>
                {wallet.isDefault && (
                  <div className="flex items-center gap-1 mt-1">
                    <Shield className="w-3 h-3 text-[#3174d1]" />
                    <span className="text-xs text-[#3174d1] font-medium">Par défaut</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              {!selectMode && (
                <div className="flex items-center gap-1">
                  {!wallet.isDefault && (
                    <button
                      onClick={() => setDefaultMutation.mutate(wallet.id)}
                      disabled={setDefaultMutation.isPending}
                      className="p-2"
                      data-testid={`button-set-default-${wallet.id}`}
                    >
                      <Check className="w-4 h-4 text-green-500" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(wallet.id)}
                    disabled={deleteMutation.isPending}
                    className="p-2"
                    data-testid={`button-delete-wallet-${wallet.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-[#3174d1]" />
                  </button>
                </div>
              )}

              {selectMode && (
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              )}
            </div>
          ))
        ) : (
           <EmptyState className="text-center py-10 flex flex-col items-center gap-2">
            <p className="text-gray-500 text-sm">Aucun compte bancaire enregistré</p>
            <p className="text-gray-400 text-xs mt-1">Ajoutez un compte pour effectuer des retraits</p>
           </EmptyState>
        )}
      </div>

    </div>
  );
}
