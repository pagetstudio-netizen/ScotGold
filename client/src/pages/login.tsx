import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { type ApiCountry } from "@/lib/countries";
import { AuthPageShell } from "@/components/auth-page-shell";
import { CountrySelector } from "@/components/country-selector";
import { ChevronDown, Loader2 } from "lucide-react";
import phoneFieldIcon from "@assets/phone_1793195291747.png";
import passwordFieldIcon from "@assets/password_1793195291656.png";
import verificationFieldIcon from "@assets/fill_1793195291771.png";

const loginSchema = z.object({
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  country: z.string().min(2, "Sélectionnez un pays"),
  password: z.string().min(1, "Le mot de passe est requis"),
  verificationCode: z.string().regex(/^\d{4}$/, "Saisissez les 4 chiffres affichés."),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [captchaChallengeId, setCaptchaChallengeId] = useState("");
  const [captchaImageUrl, setCaptchaImageUrl] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(true);
  const [captchaError, setCaptchaError] = useState("");
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0);
  const currentCaptchaUrl = useRef<string | null>(null);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      country: "",
      password: "",
      verificationCode: "",
    },
  });

  const { data: apiCountries, isLoading: countriesLoading } = useQuery<ApiCountry[]>({
    queryKey: ["/api/countries"],
  });

  const [selectedCountry, setSelectedCountry] = useState("");

  useEffect(() => {
    // Remove credentials persisted by versions that stored login data locally.
    localStorage.removeItem("doosan_credentials");
    localStorage.removeItem("doosan_login_preferences");
  }, []);

  useEffect(() => {
    let cancelled = false;
    setCaptchaLoading(true);
    setCaptchaError("");
    setCaptchaChallengeId("");
    setCaptchaImageUrl("");
    if (currentCaptchaUrl.current) {
      URL.revokeObjectURL(currentCaptchaUrl.current);
      currentCaptchaUrl.current = null;
    }

    async function loadCaptcha() {
      try {
        const response = await fetch("/api/auth/login-captcha", {
          credentials: "include",
          cache: "no-store",
        });
        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.message || "Le code de vérification est indisponible.");
        }

        const challengeId = response.headers.get("X-Login-Captcha-Id");
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
    form.clearErrors("verificationCode");
    setCaptchaRefreshKey((key) => key + 1);
  }

  useEffect(() => {
    if (!apiCountries || apiCountries.length === 0) return;
    const isValid = apiCountries.some(
      ac => ac.code.toUpperCase() === selectedCountry.toUpperCase() && ac.isActive,
    );
    // Keep a remembered/selected country long enough for the server to apply
    // the administrator-only cross-country login rule.
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

  async function onSubmit(data: LoginForm) {
    if (!captchaChallengeId) {
      form.setError("verificationCode", { message: "Actualisez le code de vérification puis réessayez." });
      return;
    }

    setIsLoading(true);
    try {
      await login(data.phone, data.country, data.password, captchaChallengeId, data.verificationCode);
      navigate("/");
    } catch (error: any) {
      toast({ title: "Erreur de connexion", description: error.message || "Vérifiez vos informations", variant: "destructive" });
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  }

  const displayedPrefix = countryData?.phonePrefix || (countriesLoading ? "..." : "");

  return (
    <AuthPageShell mode="login">
      <form className="auth-login-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                {...form.register("phone")}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="Saisir votre numéro de téléphone"
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
                autoComplete="current-password"
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
                data-testid="input-login-verification-code"
              />
              <button
                type="button"
                className="auth-visual-code"
                onClick={refreshCaptcha}
                disabled={captchaLoading}
                aria-label="Actualiser le code de vérification"
                aria-busy={captchaLoading}
                data-testid="button-refresh-login-captcha"
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
        </div>

        <button
          type="submit"
          disabled={isLoading || captchaLoading || !captchaChallengeId}
          className="auth-submit"
          data-testid="button-login"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Se connecter"}
        </button>
        <p className="auth-switch-copy">
          <span>Pas de compte ?</span>
          <button type="button" className="auth-switch-link" onClick={() => navigate("/register")} data-testid="link-register">
            S’inscrire
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
