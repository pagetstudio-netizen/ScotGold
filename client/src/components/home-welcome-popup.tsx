import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import telegramIcon from "@assets/groupService1_1793177028432.png";
import "./home-welcome-popup.css";

interface HomePopupSettings {
  groupLink?: string;
  popupButtonLabel?: string;
  level1Commission?: string;
  signupBonus?: string;
  maxWithdrawalsPerDay?: string;
  withdrawalStartHour?: string;
  withdrawalEndHour?: string;
}

function safeTelegramUrl(value?: string) {
  if (!value?.trim()) return undefined;

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function formatFcfa(value?: string) {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? `${Math.round(amount).toLocaleString("fr-FR")} FCFA`
    : "— FCFA";
}

function formatPercent(value?: string) {
  const rate = Number(value ?? "25");
  return Number.isFinite(rate)
    ? `${rate.toLocaleString("fr-FR")} %`
    : "— %";
}

function withdrawalNotice(settings?: HomePopupSettings) {
  const limit = Number(settings?.maxWithdrawalsPerDay ?? "1");
  const startHour = settings?.withdrawalStartHour || "9";
  const endHour = settings?.withdrawalEndHour || "17";
  const limitText = Number.isFinite(limit) && limit > 0
    ? `dans la limite de ${limit} retrait${limit > 1 ? "s" : ""} par jour`
    : "sans limite quotidienne";

  return `Les retraits sont disponibles de ${startHour} h à ${endHour} h, ${limitText}.`;
}

export default function HomeWelcomePopup() {
  const [open, setOpen] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  const [location] = useLocation();
  const lastUserId = useRef<string | null>(null);
  const pendingSessionPopup = useRef(false);
  const { data: settings, isLoading } = useQuery<HomePopupSettings>({
    queryKey: ["/api/settings"],
    enabled: open,
  });

  useEffect(() => {
    if (authLoading) return;

    const currentUserId = user?.id == null ? null : String(user.id);
    if (currentUserId === null) {
      pendingSessionPopup.current = false;
    } else if (lastUserId.current === null) {
      pendingSessionPopup.current = true;
    }
    lastUserId.current = currentUserId;

    const isAuthOrRobotPayPage =
      location === "/login" || location === "/register" || location === "/robotpay";
    if (pendingSessionPopup.current && !isAuthOrRobotPayPage) {
      pendingSessionPopup.current = false;
      setOpen(true);
    }
  }, [authLoading, location, user?.id]);

  useEffect(() => {
    const showPopup = () => setOpen(true);
    window.addEventListener("home-tab-clicked", showPopup);
    return () => window.removeEventListener("home-tab-clicked", showPopup);
  }, []);

  const groupUrl = safeTelegramUrl(settings?.groupLink);
  const canJoinGroup = Boolean(groupUrl);
  const configuredJoinLabel = settings?.popupButtonLabel?.trim();
  const joinLabel = configuredJoinLabel
    && configuredJoinLabel !== "Cliquez ici pour rejoindre le groupe Telegram"
    ? configuredJoinLabel
    : "Rejoignez la chaîne Telegram";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="home-welcome-overlay">
          <img
            className="home-welcome-illustration"
            src="/scotgold-logo.png"
            alt=""
            aria-hidden="true"
          />
        </DialogPrimitive.Overlay>
        <DialogPrimitive.Content
          className="home-welcome-dialog"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="home-welcome-stage" aria-busy={isLoading}>
            <div className="home-welcome-card" aria-hidden="true" />
            <DialogPrimitive.Title className="home-welcome-title">
              <span>Bienvenue sur l'application</span>
              <span>SCOTGOLD !</span>
            </DialogPrimitive.Title>

            <div className="home-welcome-body">
              <DialogPrimitive.Description className="sr-only">
                Présentation de SCOTGOLD, des bonus et des informations de retrait.
              </DialogPrimitive.Description>

              <div className="home-welcome-details" aria-live="polite">
                <p className="home-welcome-country">ÉCOSSE</p>
                <p className="home-welcome-summary">
                  Scotgold Resources Ltd. est une société d’exploration et d’exploitation aurifère
                  basée en Écosse, principalement axée sur le développement de gisements aurifères
                  dans le pays. Son projet phare est la mine d’or de Cononish, située dans les
                  Highlands écossaises.
                </p>
                <div className="home-welcome-points">
                  <p>1. Bonus d’inscription : {formatFcfa(settings?.signupBonus ?? "500")}</p>
                  <p>2. Bonus de connexion quotidien : 50 FCFA</p>
                  <p>
                    3. Invitez d’autres personnes à investir et recevez une commission de{" "}
                    {formatPercent(settings?.level1Commission)} sur leur premier achat éligible.
                  </p>
                  <p>4. {withdrawalNotice(settings)}</p>
                  <p>5. SCOTGOLD est disponible dans plusieurs pays d’Afrique de l’Ouest.</p>
                  <p>
                    6. Rejoignez notre groupe Telegram pour en savoir plus sur les gains potentiels.
                  </p>
                </div>
              </div>
            </div>

            <div className="home-welcome-actions">
              {canJoinGroup ? (
                <a
                  className="home-welcome-telegram"
                  href={groupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={joinLabel}
                >
                  <span className="home-welcome-telegram-icon" aria-hidden="true">
                    <img src={telegramIcon} alt="" />
                  </span>
                  <span className="home-welcome-telegram-label">{joinLabel}</span>
                </a>
              ) : (
                <button
                  className="home-welcome-telegram is-unavailable"
                  type="button"
                  disabled
                  aria-label="Chaîne Telegram, lien non configuré"
                >
                  <span className="home-welcome-telegram-icon" aria-hidden="true">
                    <img src={telegramIcon} alt="" />
                  </span>
                  <span className="home-welcome-telegram-label">{joinLabel}</span>
                </button>
              )}

              <DialogPrimitive.Close asChild>
                <button className="home-welcome-acknowledge" type="button">
                  D’ACCORD
                </button>
              </DialogPrimitive.Close>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}