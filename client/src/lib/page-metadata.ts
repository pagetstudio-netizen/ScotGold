import { ADMIN_PATH } from "./admin-path";

interface PageMetadata {
  title: string;
  description: string;
}

const COMPANY_DESCRIPTION =
  "Scotgold Resources Ltd. is a Scottish gold exploration company focused on the Cononish mine in the Scottish Highlands.";

const DEFAULT_TITLE = "Page introuvable";

const PAGE_TITLES: Record<string, string> = {
  "/": "Accueil",
  "/login": "Connexion",
  "/register": "Inscription",
  "/invitation": "Inscription par invitation",
  "/rejoindre": "Rejoindre Scotgold",
  "/tasks": "Inviter",
  "/invest": "Produits",
  "/orders": "Commandes",
  "/team": "Partager",
  "/my-products": "Mes produits",
  "/checkin": "Roue de la fortune",
  "/account": "Mon compte",
  "/deposit": "Dépôt",
  "/robotpay": "Paiement RobotPay",
  "/withdrawal": "Retrait",
  "/deposit-history": "Relevé des dépôts",
  "/deposits-history": "Relevé des dépôts",
  "/history": "Mon relevé",
  "/withdrawal-history": "Relevé des retraits",
  "/deposit-orders": "Ordres de dépôt",
  "/service": "Service client",
  "/wallet": "Compte de retrait",
  "/change-password": "Changer le mot de passe",
  "/about": "À propos",
  "/rules": "Règles",
  "/gift-code": "Code cadeau",
  "/team-details": "Détails des filleuls",
  "/daily-bonus": "Récompenses",
  "/salary-bonus": "Bonus",
  "/banker": "Espace banquier",
};

function normalizedPath(location: string) {
  const pathname = location.split(/[?#]/, 1)[0] || "/";
  return pathname.replace(/\/+$/, "") || "/";
}

export function getPageMetadata(location: string): PageMetadata {
  const pathname = normalizedPath(location);
  let title = PAGE_TITLES[pathname];

  if (!title && /^\/products\/[^/]+$/.test(pathname)) {
    title = "Détail du produit";
  } else if (!title && (pathname === ADMIN_PATH || pathname.startsWith(`${ADMIN_PATH}/`))) {
    title = "Administration";
  }

  return {
    title: title || DEFAULT_TITLE,
    description: COMPANY_DESCRIPTION,
  };
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function applyPageMetadata(location: string) {
  const metadata = getPageMetadata(location);
  const title = metadata.title;
  const absoluteUrl = new URL(normalizedPath(location), window.location.origin).toString();
  const absoluteImageUrl = new URL("/scotgold-og.jpg", window.location.origin).toString();

  document.title = title;
  setMeta("name", "description", metadata.description);
  setMeta("property", "og:type", "website");
  setMeta("property", "og:site_name", "Scotgold Resources Ltd.");
  setMeta("property", "og:locale", "fr_FR");
  setMeta("property", "og:url", absoluteUrl);
  setMeta("property", "og:image", absoluteImageUrl);
  setMeta("property", "og:image:type", "image/jpeg");
  setMeta("property", "og:image:width", "1200");
  setMeta("property", "og:image:height", "630");
  setMeta("property", "og:image:alt", "Scotgold Resources Ltd. — exploration aurifère en Écosse");
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", metadata.description);
  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:image", absoluteImageUrl);
  setMeta("name", "twitter:image:alt", "Scotgold Resources Ltd. — exploration aurifère en Écosse");
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", metadata.description);
}
