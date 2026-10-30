import { useState, useEffect, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { type ApiCountry } from "@/lib/countries";
import { AuthPageShell } from "@/components/auth-page-shell";
import { CountrySelector } from "@/components/country-selector";
import { getReferralCodeFromHash, PENDING_REFERRAL_STORAGE_KEY } from "@/lib/referral-link";
import { ChevronDown, Loader2 } from "lucide-react";
import phoneFieldIcon from "@assets/phone_1793195291747.png";
import passwordFieldIcon from "@assets/password_1793195291656.png";
import verificationFieldIcon from "@assets/fill_1793195291771.png";
import invitationFieldIcon from "@assets/vip_(1)_1793195291791.png";
import { normalizeBeninPhone } from "@shared/phone";

const registerSchema = z.object({
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  country: z.string().min(2, "Sélectionnez un pays"),
  password: z.string().min(6, "Au moins 6 caractères"),
  verificationCode: z.string().regex(/^\d{4}$/, "Saisissez les 4 chiffres affichés."),
  invitationCode: z.string().optional(),
}).refine((data) => data.country.toUpperCase() !== "BJ" || normalizeBeninPhone(data.phone) !== null, {
  message: "Au Bénin, saisissez 8 chiffres locaux ou 01 suivi de 8 chiffres.",
  path: ["phone"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const { register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [captchaChallengeId, setCaptchaChallengeId] = useState("");
  const [captchaImageUrl, setCaptchaImageUrl] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(true);
  const [captchaError, setCaptchaError] = useState("");
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0);
  const currentCaptchaUrl = useRef<string | null>(null);

  const params = new URLSearchParams(searchString);
  // Keep accepting legacy invitation links that placed a second "?" before code.
  const currentInvitationMatch = searchString.match(/[?&]code=([^&?#]+)/i);
  let pendingReferralCode = "";
  try {
    pendingReferralCode = window.sessionStorage.getItem(PENDING_REFERRAL_STORAGE_KEY) || "";
  } catch {
    // The URL-based invitation formats remain available when storage is disabled.
  }
  const refCode = currentInvitationMatch?.[1]
    || params.get("invite")
    || params.get("money")
    || params.get("reg")
    || params.get("code")
    || getReferralCodeFromHash(window.location.hash)
    || pendingReferralCode
    || "";

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phone: "",
      country: "",
      password: "",
      verificationCode: "",
      invitationCode: refCode,
    },
  });

  useEffect(() => {
    try {
      window.sessionStorage.removeItem(PENDING_REFERRAL_STORAGE_KEY);
    } catch {
      // Ignore unavailable browser storage.
    }
  }, []);

  const { data: apiCountries, isLoading: countriesLoading } = useQuery<ApiCountry[]>({
    queryKey: ["/api/countries"],
  });

  const [selectedCountry, setSelectedCountry] = useState("");

  useEffect(() => {
    if (!apiCountries || apiCountries.length === 0) return;
    const isValid = apiCountries.some(
      ac => ac.code.toUpperCase() === selectedCountry.toUpperCase() && ac.isActive,
    );
    if (!isValid) {
      const first = apiCountries.find(ac => ac.isActive);
      if (first) {
        setSelectedCountry(first.code);
        form.setValue("country", first.code);
      }
    }
  }, [apiCountries, selectedCountry, form]);

  const countryData = (() => {
    if (apiCountries && apiCountries.length > 0) {
      const c = apiCountries.find(
        ac => ac.code.toUpperCase() === selectedCountry.toUpperCase() && ac.isActive,
      );
      if (c) return { phonePrefix: c.phonePrefix, name: c.name };
      return null;
    }
    return null;
  })();

  useEffect(() => {
    let cancelled = false;
    setCaptchaLoading(true);
    setCaptchaError("");
    setCaptchaChallengeId("");

    async function loadCaptcha() {
      try {
        const response = await fetch("/api/auth/register-captcha", {
          credentials: "include",
          cache: "no-store",
        });
        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.message || "Le code de vérification est indisponible.");
        }

        const challengeId = response.headers.get("X-Registration-Captcha-Id");
        if (!challengeId) throw new Error("Impossible de charger le code de vérification.");

        const image = await response.blob();
        const imageUrl = URL.createObjectURL(image);
        if (cancelled) {
          URL.revokeObjectURL(imageUrl);
          return;
        }

        if (currentCaptchaUrl.current) URL.revokeObjectURL(currentCaptchaUrl.current);
        currentCaptchaUrl.current = imageUrl;
        setCaptchaImageUrl(imageUrl);
        setCaptchaChallengeId(challengeId);
        form.setValue("verificationCode", "");
      } catch (error) {
        if (!cancelled) {
          setCaptchaError(error instanceof Error ? error.message : "Impossible de charger le code.");
        }
      } finally {
        if (!cancelled) setCaptchaLoading(false);
      }
    }

    void loadCaptcha();
    return () => {
      cancelled = true;
    };
  }, [captchaRefreshKey]);

  useEffect(() => () => {
    if (currentCaptchaUrl.current) URL.revokeObjectURL(currentCaptchaUrl.current);
  }, []);

  function refreshCaptcha() {
    form.setValue("verificationCode", "");
    setCaptchaRefreshKey((key) => key + 1);
  }

  async function onSubmit(data: RegisterForm) {
    const phone = data.country.toUpperCase() === "BJ"
      ? normalizeBeninPhone(data.phone)
      : data.phone.trim();
    if (!phone) {
      form.setError("phone", { message: "Au Bénin, saisissez 8 chiffres locaux ou 01 suivi de 8 chiffres." });
      return;
    }
    if (!captchaChallengeId) {
      form.setError("verificationCode", { message: "Actualisez le code de vérification puis réessayez." });
      return;
    }

    setIsLoading(true);
    try {
      await register({
        fullName: `User_${phone}`,
        phone,
        country: data.country,
        password: data.password,
        invitationCode: data.invitationCode,
        captchaChallengeId,
        captchaCode: data.verificationCode,
      });
      toast({ title: "Inscription réussie !", description: "Bienvenue chez Scotgold !" });
      navigate("/");
    } catch (error: any) {
      toast({ title: "Erreur d'inscription", description: error.message || "Une erreur est survenue", variant: "destructive" });
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  }

  const displayedPrefix = countryData?.phonePrefix || (countriesLoading ? "..." : "");
  const phoneField = form.register("phone");

  return (
    <AuthPageShell mode="register">
      <form className="auth-register-form" onSubmit={form.handleSubmit(onSubmit)}>
        <input type="hidden" {...form.register("country")} />
        <div className="auth-fields">
          <div className="auth-field auth-field-stacked auth-phone-field">
            <div className="auth-field-heading">
              <img className="auth-phone-icon auth-field-icon auth-gold-icon" src={phoneFieldIcon} alt="" aria-hidden="true" />
              <span className="auth-field-caption">Téléphone</span>
              <button
                type="button"
                className="auth-country-button"
                onClick={() => setCountryModalOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={countryModalOpen}
                aria-label={`Choisir le pays : ${countryData?.name || "non sélectionné"}, indicatif +${displayedPrefix}`}
                title="Choisir un autre pays"
                data-testid="button-select-country"
              >
                <span className="auth-country-value">
                  <ChevronDown aria-hidden="true" />
                  <span className="auth-country-code">+{displayedPrefix}</span>
                </span>
              </button>
            </div>
            <div className="auth-field-input-row">
              <input
                {...phoneField}
                onBlur={(event) => {
                  phoneField.onBlur(event);
                  if (selectedCountry.toUpperCase() === "BJ") {
                    const normalized = normalizeBeninPhone(event.currentTarget.value);
                    if (normalized && normalized !== event.currentTarget.value) {
                      form.setValue("phone", normalized, { shouldDirty: true, shouldValidate: true });
                    }
                  }
                }}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={selectedCountry.toUpperCase() === "BJ" ? "01 00 00 00 00" : "Saisir votre numéro de téléphone"}
                aria-label="Numéro de téléphone"
                aria-invalid={Boolean(form.formState.errors.phone)}
                data-testid="input-phone"
              />
            </div>
          </div>
          {form.formState.errors.phone && <p className="auth-error">{form.formState.errors.phone.message}</p>}
          <div className="auth-field auth-field-stacked auth-password-field">
            <div className="auth-field-heading">
              <img className="auth-leading-icon auth-field-icon auth-gold-icon" src={passwordFieldIcon} alt="" aria-hidden="true" />
              <span className="auth-field-caption">Mot de passe</span>
            </div>
            <div className="auth-field-input-row">
              <input
                {...form.register("password")}
                type="password"
                autoComplete="new-password"
                placeholder="Saisir votre mot de passe"
                aria-label="Mot de passe"
                aria-invalid={Boolean(form.formState.errors.password)}
                data-testid="input-password"
              />
            </div>
          </div>
          {form.formState.errors.password && <p className="auth-error">{form.formState.errors.password.message}</p>}

          <div className="auth-field auth-field-stacked auth-verification-field">
            <div className="auth-field-heading">
              <img className="auth-verification-icon auth-field-icon auth-gold-icon" src={verificationFieldIcon} alt="" aria-hidden="true" />
              <span className="auth-field-caption">Code</span>
            </div>
            <div className="auth-field-input-row auth-verification-row">
              <input
                {...form.register("verificationCode")}
                type="text"
                inputMode="numeric"
                maxLength={4}
                autoComplete="off"
                placeholder="Saisir le code"
                aria-label="Code de vérification"
                aria-invalid={Boolean(form.formState.errors.verificationCode)}
                data-testid="input-verification-code"
              />
              <button
                type="button"
                className="auth-visual-code"
                onClick={refreshCaptcha}
                disabled={captchaLoading}
                aria-label="Actualiser le code de vérification"
                aria-busy={captchaLoading}
                data-testid="button-refresh-captcha"
              >
                {captchaImageUrl
                  ? <img src={captchaImageUrl} alt="" aria-hidden="true" />
                  : <span>{captchaLoading ? "…" : "Actualiser"}</span>}
              </button>
            </div>
          </div>
          {(form.formState.errors.verificationCode || captchaError) && (
            <p className="auth-error">
              {form.formState.errors.verificationCode?.message || captchaError}
              {captchaError && (
                <button type="button" className="auth-captcha-retry" onClick={refreshCaptcha}>
                  Réessayer
                </button>
              )}
            </p>
          )}

          <div className="auth-field auth-field-stacked auth-invitation-field">
            <div className="auth-field-heading">
              <img className="auth-leading-icon auth-field-icon auth-gold-icon" src={invitationFieldIcon} alt="" aria-hidden="true" />
              <span className="auth-field-caption">Code d’invitation</span>
            </div>
            <div className="auth-field-input-row">
              <input
                {...form.register("invitationCode")}
                placeholder="Saisir le code d’invitation"
                aria-label="Code d’invitation"
                data-testid="input-invitation-code"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={isLoading || captchaLoading || !captchaChallengeId} className="auth-submit" data-testid="button-register">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "S’inscrire"}
        </button>
        <p className="auth-switch-copy">
          <span>Déjà un compte ?</span>
          <button type="button" className="auth-switch-link" onClick={() => navigate("/login")} data-testid="link-login">
            Connexion
          </button>
        </p>
      </form>
      <CountrySelector
        selectedCountryCode={selectedCountry}
        open={countryModalOpen}
        onClose={() => setCountryModalOpen(false)}
        onSelect={(code) => {
          setSelectedCountry(code);
          form.setValue("country", code, { shouldValidate: true });
        }}
      />
    </AuthPageShell>
  );
}
