export const SCOTGOLD_LOGO = "/scotgold-logo.png";

export const JOHN_DEERE_PHOTOS = {
  homeHero: "/john-deere/home-hero.jpeg",
  expo: "/john-deere/expo-logo.jpg",
  dealership: "/john-deere/dealership.jpg",
  tractorService: "/john-deere/tractor-service.jpg",
  showroom: "/john-deere/showroom.jpg",
  tractorExpo: "/john-deere/tractor-expo.jpg",
  dealerTeam: "/john-deere/dealer-team.jpg",
  teamMachinery: "/john-deere/team-machinery.jpg",
  fieldTeam: "/john-deere/field-team.jpg",
  emblem: "/john-deere/deere-emblem.jpg",
} as const;

export const SCOTGOLD_PRODUCT_IMAGES = [
  "/scotgold-products/vip1.jpg",
  "/scotgold-products/vip2.jpg",
  "/scotgold-products/vip3.jpg",
  "/scotgold-products/vip4.jpg",
  "/scotgold-products/vip5.jpg",
  "/scotgold-products/vip6.jpg",
] as const;

export function getScotgoldProductDisplayName(
  _productId: number,
  productName?: string | null,
) {
  return productName?.trim() || "Produit";
}

export function getScotgoldProductImage(
  imageUrl: string | null | undefined,
  productId: number,
  productName?: string | null,
) {
  const storedImage = imageUrl?.trim();
  const productNumber = productName?.match(/(?:VIP|robot|scotgold)[\s_-]*(\d+)/i)?.[1];
  const namedIndex = productNumber ? Number(productNumber) - 1 : Number.NaN;
  if (Number.isInteger(namedIndex) && namedIndex >= 0) {
    const safeNamedIndex = namedIndex % SCOTGOLD_PRODUCT_IMAGES.length;
    return SCOTGOLD_PRODUCT_IMAGES[safeNamedIndex] ?? SCOTGOLD_PRODUCT_IMAGES[0];
  }

  if (storedImage && !storedImage.startsWith("/john-deere/products/")) return storedImage;

  const idIndex = Number.isFinite(productId) && productId > 1
    ? Math.trunc(productId) - 2
    : 0;
  const safeIndex = ((idIndex % SCOTGOLD_PRODUCT_IMAGES.length) + SCOTGOLD_PRODUCT_IMAGES.length)
    % SCOTGOLD_PRODUCT_IMAGES.length;

  return SCOTGOLD_PRODUCT_IMAGES[safeIndex] ?? SCOTGOLD_PRODUCT_IMAGES[0];
}
