import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import "./_group.css";

interface TaskWithStatus {
  id: number;
  reward: number;
  requiredInvites: number;
  isCompleted: boolean;
  canClaim: boolean;
  currentInvites: number;
}

type CopyKind = "code" | "link";

const previewUser = { referralCode: "15859178" };
const previewTasks: TaskWithStatus[] = [
  { id: 1, reward: 5000, requiredInvites: 5, isCompleted: false, canClaim: true, currentInvites: 5 },
  { id: 2, reward: 15000, requiredInvites: 15, isCompleted: false, canClaim: false, currentInvites: 5 },
  { id: 3, reward: 50000, requiredInvites: 50, isCompleted: false, canClaim: false, currentInvites: 5 },
];

const tierStyles = [
  "tier-peach",
  "tier-yellow",
  "tier-orange",
  "tier-coral",
  "tier-red",
  "tier-crimson",
  "tier-crimson",
];

function formatFcfa(amount: number) {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(amount)} FCFA`;
}

export default function Current() {
  const user = previewUser;
  const toast = (_message: { title: string; description: string; variant?: "destructive" }) => undefined;
  const [copied, setCopied] = useState<CopyKind | null>(null);
  const tasks = previewTasks;
  const isLoading = false;
  const isError = false;
  const refetch = () => undefined;
  const claimMutation = { isPending: false, mutate: (_taskId: number) => undefined };

  const invitationLink = useMemo(() => {
    if (!user?.referralCode || typeof window === "undefined") return "";
    return `${window.location.origin}/register?code=${encodeURIComponent(user.referralCode)}`;
  }, [user?.referralCode]);

  const copyInvitationValue = async (value: string, kind: CopyKind) => {
    try {
      try {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
        await navigator.clipboard.writeText(value);
      } catch {
        const field = document.createElement("textarea");
        field.value = value;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        const copiedSuccessfully = document.execCommand("copy");
        field.remove();
        if (!copiedSuccessfully) throw new Error("Copy failed");
      }

      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1300);
      toast({
        title: "Copie réussie",
        description: kind === "code"
          ? "Code d’invitation copié."
          : "Lien d’invitation copié.",
      });
    } catch {
      toast({
        title: "Copie impossible",
        description: "Veuillez sélectionner et copier le texte manuellement.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="invite-reference-preview invite-page">
      <svg className="invite-reference-clip-defs" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="invite-tier-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.1 0.02 C 0.0448 0.02 0 0.0872 0 0.17 L 0 0.83 C 0 0.9128 0.0448 0.98 0.1 0.98 C 0.3 0.86 0.7 0.86 0.9 0.98 C 0.9552 0.98 1 0.9128 1 0.83 L 1 0.17 C 1 0.0872 0.9552 0.02 0.9 0.02 C 0.7 0.14 0.3 0.14 0.1 0.02 Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="invite-reference-scroll">
        <header className="invite-reference-header">
          <h1>Récompenses d&apos;invitation</h1>
          <img className="invite-reference-hero-robot" src="/scotgold-gold-bars-closeup.jpg" alt="" aria-hidden="true" />

          <section className="invite-reference-code-panel" aria-label="Informations d'invitation">
            <div className="invite-reference-code-row">
              <div className="invite-reference-code-copy">
                <span className="invite-reference-label">Code d&apos;invitation</span>
                <strong>{user.referralCode}</strong>
              </div>
              <button
                className="invite-reference-copy-button"
                type="button"
                onClick={() => void copyInvitationValue(user.referralCode, "code")}
                aria-label="Copier le code d'invitation"
              >
                {copied === "code" ? "Copié" : "Copie"}
              </button>
            </div>
            <div className="invite-reference-code-row invite-reference-link-row">
              <div className="invite-reference-code-copy">
                <span className="invite-reference-label">Copier le lien</span>
                <strong className="invite-reference-url">{invitationLink || "Lien indisponible"}</strong>
              </div>
              <button
                className="invite-reference-copy-button"
                type="button"
                onClick={() => invitationLink && void copyInvitationValue(invitationLink, "link")}
                disabled={!invitationLink}
                aria-label="Copier le lien d'invitation"
              >
                {copied === "link" ? "Copié" : "Copie"}
              </button>
            </div>
          </section>
        </header>

        <section className="invite-reference-tiers" aria-label="Paliers de récompense">
          {isLoading ? (
            <div className="invite-reference-loading" role="status">
              <Loader2 aria-hidden="true" />
              <span>Chargement...</span>
            </div>
          ) : isError ? (
            <div className="invite-reference-error" role="alert">
              <span>Impossible de charger les tâches d&apos;invitation.</span>
              <button type="button" onClick={() => void refetch()}>Réessayer</button>
            </div>
          ) : tasks && tasks.length > 0 ? (
            tasks.map((task, index) => {
              const statusLabel = task.isCompleted
                ? "Terminé"
                : task.canClaim
                  ? "Réclamer"
                  : "Inachevé";
              const taskClass = tierStyles[index] ?? tierStyles[tierStyles.length - 1];

              return (
                <article className={`invite-reference-tier ${taskClass}`} key={task.id} data-testid={`task-item-${task.id}`}>
                  <img className="invite-reference-watermark" src="/scotgold-gold-bars-stack.jpg" alt="" aria-hidden="true" />
                  <div className="invite-reference-tier-content">
                    <strong className="invite-reference-reward">{formatFcfa(task.reward)}</strong>
                    <h2>Tâche d&apos;invitation</h2>
                    <p>Invitez {task.requiredInvites} membres de niveau 1 à investir</p>
                    {task.canClaim && !task.isCompleted ? (
                      <button
                        className="invite-reference-status invite-reference-claim-button"
                        type="button"
                        onClick={() => claimMutation.mutate(task.id)}
                        disabled={claimMutation.isPending}
                        data-testid={`button-claim-${task.id}`}
                      >
                        {claimMutation.isPending ? <Loader2 className="invite-claim-spinner" aria-label="Réclamation en cours" /> : statusLabel}
                      </button>
                    ) : (
                      <span className={`invite-reference-status ${task.isCompleted ? "is-completed" : ""}`}>
                        {statusLabel}
                      </span>
                    )}
                    <span className="invite-reference-progress">
                      Progression : {task.currentInvites}/{task.requiredInvites}
                    </span>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="invite-reference-empty">
              <p>Aucune tâche d&apos;invitation disponible.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
