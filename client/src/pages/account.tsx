import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChevronRight, Loader2, Power } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ADMIN_PATH } from "@/lib/admin-path";
import { SCOTGOLD_LOGO } from "@/lib/john-deere-assets";
import GiftCodeModal from "@/components/gift-code-modal";
import "./account.css";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

interface AccountMenuItem {
  label: string;
  image?: string;
  isLogout?: boolean;
  onSelect: () => void;
}

interface AccountShortcut {
  label: string;
  image: string;
  onSelect: () => void;
}

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showPinModal, setShowPinModal] = useState(false);
  const [showGiftCodeModal, setShowGiftCodeModal] = useState(
    () => new URLSearchParams(window.location.search).get("giftCode") === "open",
  );
  const [adminPin, setAdminPin] = useState("");

  const verifyPinMutation = useMutation({
    mutationFn: async (pin: string) => {
      const response = await apiRequest("POST", "/api/admin/verify-pin", { pin });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Code PIN incorrect");
      }
      return response.json();
    },
    onSuccess: () => {
      setShowPinModal(false);
      setAdminPin("");
      navigate(ADMIN_PATH);
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  if (!user) return null;

  const formatFcfa = (value: string | number | null | undefined) => {
    const amount = Number(value || 0);
    return `${new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0)} FCFA`;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleAdminClick = () => {
    if (user.isAdminPasswordRequired === false) {
      navigate(ADMIN_PATH);
      return;
    }
    setShowPinModal(true);
  };

  const handleInstall = async () => {
    const installPrompt = (window as Window & {
      _installPrompt?: BeforeInstallPromptEvent | null;
    })._installPrompt;
    if (!installPrompt) {
      toast({
        title: "Téléchargement indisponible",
        description: "Ouvrez ce site dans un navigateur compatible pour l’installer.",
      });
      return;
    }
    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
    } catch {
      toast({
        title: "Installation non disponible",
        description: "Vous pourrez réessayer depuis le menu de votre navigateur.",
      });
    } finally {
      (window as Window & { _installPrompt?: BeforeInstallPromptEvent | null })._installPrompt = null;
    }
  };

  const handleGiftCodeModalChange = (open: boolean) => {
    setShowGiftCodeModal(open);
    if (!open && new URLSearchParams(window.location.search).get("giftCode") === "open") {
      navigate("/account", { replace: true });
    }
  };

  const menuItems: AccountMenuItem[] = [
    {
      label: "Changer le mot de passe",
      image: "/scotgold-account/password.png",
      onSelect: () => navigate("/change-password"),
    },
    {
      label: "À propos de nous",
      image: "/scotgold-account/about.png",
      onSelect: () => navigate("/about"),
    },
    {
      label: "Télécharger l’application",
      image: "/scotgold-account/download.png",
      onSelect: () => void handleInstall(),
    },
    {
      label: "Se déconnecter",
      isLogout: true,
      onSelect: () => void handleLogout(),
    },
  ];
  const shortcuts: AccountShortcut[] = [
    {
      label: "Banque",
      image: "/scotgold-account/bank.png",
      onSelect: () => navigate("/wallet"),
    },
    {
      label: "Mon relevé",
      image: "/scotgold-account/history.png",
      onSelect: () => navigate("/history"),
    },
    {
      label: "Relevé de recharge",
      image: "/scotgold-account/recharge.png",
      onSelect: () => navigate("/deposit-history"),
    },
    {
      label: "Relevé de retrait",
      image: "/scotgold-account/withdrawal.png",
      onSelect: () => navigate("/withdrawal-history"),
    },
  ];

  return (
    <main className="account-page">
      <div className="account-shell">
        <section className="account-profile" aria-label="Mon compte">
          <div className="account-profile-decoration" aria-hidden="true" />
          <h1 className="account-title">MOI</h1>
          <button
            type="button"
            className={`account-logo${user.isAdmin ? " is-admin-access" : ""}`}
            onClick={user.isAdmin ? handleAdminClick : undefined}
            aria-label={user.isAdmin ? "Accès administrateur" : "Scotgold"}
            tabIndex={user.isAdmin ? 0 : -1}
          >
            <img src={SCOTGOLD_LOGO} alt="" />
          </button>
          <span className="account-phone">{user.phone}</span>
          <p className="account-prominent-balance" aria-label={`Solde du compte : ${formatFcfa(user.balance)}`}>
            {formatFcfa(user.balance)}
          </p>
          <section className="account-stat-panel" aria-label="Solde et revenus">
            <div className="account-stat">
              <strong>{formatFcfa(user.balance)}</strong>
              <span>Solde</span>
            </div>
            <div className="account-stat">
              <strong>{formatFcfa(user.totalEarnings)}</strong>
              <span>Mes revenus</span>
            </div>
          </section>
        </section>

        <nav className="account-quick-actions" aria-label="Accès rapides">
          {shortcuts.map(({ label, image, onSelect }) => (
            <button
              key={label}
              type="button"
              className="account-quick-action"
              onClick={onSelect}
              aria-label={label}
            >
              <span className="account-quick-icon">
                <img src={image} alt="" aria-hidden="true" />
              </span>
              <span className="account-quick-label">{label}</span>
            </button>
          ))}
        </nav>

        <nav className="account-menu" aria-label="Services du compte">
          <div className="account-menu-grid">
            {menuItems.map(({ label, image, isLogout, onSelect }) => (
              <button
                key={label}
                type="button"
                className={`account-menu-item${isLogout ? " is-logout" : ""}`}
                onClick={onSelect}
                aria-label={label}
              >
                {!isLogout && image && (
                  <span className="account-menu-icon" aria-hidden="true">
                    <img src={image} alt="" />
                  </span>
                )}
                {isLogout && <Power className="account-logout-icon" aria-hidden="true" />}
                <span className="account-menu-label">{label}</span>
                {!isLogout && <ChevronRight className="account-menu-chevron" aria-hidden="true" />}
              </button>
            ))}
          </div>
          <div className="account-menu-divider" aria-hidden="true" />
        </nav>
      </div>

      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Code d'accès administrateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Entrez votre code PIN pour accéder au panel administrateur
            </p>
            <Input
              type="password"
              value={adminPin}
              onChange={(event) => setAdminPin(event.target.value)}
              placeholder="Code PIN"
              className="text-center text-2xl tracking-widest"
              maxLength={8}
              data-testid="input-admin-pin"
            />
            <Button
              onClick={() => {
                if (adminPin.length < 4) {
                  toast({
                    title: "Le code PIN doit contenir au moins 4 caractères",
                    variant: "destructive",
                  });
                  return;
                }
                verifyPinMutation.mutate(adminPin);
              }}
              disabled={verifyPinMutation.isPending || adminPin.length < 4}
              className="w-full bg-[#367c2b] hover:bg-[#285f20]"
              data-testid="button-verify-pin"
            >
              {verifyPinMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <GiftCodeModal open={showGiftCodeModal} onOpenChange={handleGiftCodeModalChange} />
    </main>
  );
}
