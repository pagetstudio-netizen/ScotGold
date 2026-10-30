import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useViewportBackground } from "@/hooks/use-viewport-background";
import { Loader2, ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import passwordFieldIcon from "@assets/login02_1791498369057.png";
import "./change-password.css";

export default function ChangePasswordPage() {
  useViewportBackground("#000");
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousRootOverscroll = root.style.overscrollBehavior;
    const previousBodyOverscroll = body.style.overscrollBehavior;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;

    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      root.style.overflow = previousRootOverflow;
      root.style.overscrollBehavior = previousRootOverscroll;
      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousBodyOverscroll;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, []);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const res = await apiRequest("POST", "/api/change-password", data);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erreur lors du changement de mot de passe");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Succès", description: "Mot de passe modifié avec succès" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      navigate("/account");
    },
    onError: (error: Error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "Champs requis", description: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Mot de passe trop court", description: "Minimum 6 caractères requis", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Erreur", description: "Les nouveaux mots de passe ne correspondent pas", variant: "destructive" });
      return;
    }
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <main className="change-password-screen">
      <div className="change-password-shell">
        <button
          type="button"
          onClick={() => navigate("/account")}
          className="change-password-back"
          aria-label="Retour au compte"
          data-testid="button-back"
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <img className="change-password-logo" src="/scotgold-logo.png" alt="Scotgold Resources Ltd." />

        <section className="change-password-content" aria-label="Modification du mot de passe">
          <h1 className="change-password-sr-only">Changer le mot de passe</h1>
          <form
            className="change-password-form"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <div className="change-password-field">
              <div className="change-password-field-heading">
                <img src={passwordFieldIcon} alt="" aria-hidden="true" />
                <label htmlFor="current-password">Mot de passe actuel</label>
              </div>
              <input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Saisir le mot de passe actuel"
                aria-label="Mot de passe actuel"
                data-testid="input-current-password"
              />
            </div>

            <div className="change-password-field">
              <div className="change-password-field-heading">
                <img src={passwordFieldIcon} alt="" aria-hidden="true" />
                <label htmlFor="new-password">Nouveau mot de passe</label>
              </div>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Saisir le nouveau mot de passe"
                aria-label="Nouveau mot de passe"
                data-testid="input-new-password"
              />
            </div>

            <div className="change-password-field">
              <div className="change-password-field-heading">
                <img src={passwordFieldIcon} alt="" aria-hidden="true" />
                <label htmlFor="confirm-new-password">Confirmer le mot de passe</label>
              </div>
              <input
                id="confirm-new-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Saisir à nouveau le mot de passe"
                aria-label="Confirmer le nouveau mot de passe"
                data-testid="input-confirm-password"
              />
            </div>

            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="change-password-submit"
              data-testid="button-change-password-submit"
            >
              {changePasswordMutation.isPending ? (
                <span className="change-password-loading">
                  <Loader2 aria-hidden="true" />
                  Modification…
                </span>
              ) : (
                "Modifier"
              )}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
