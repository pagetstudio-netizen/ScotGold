export function applyRequestSocialMetadata(
  html: string,
  origin: string,
  pathname: string,
): string {
  const imageUrl = new URL("/scotgold-og.jpg", origin).toString();
  const pageUrl = new URL(pathname, origin).toString();

  const withRequestMetadata = html
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${pageUrl}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${imageUrl}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${imageUrl}$2`);

  const canonicalTag = `<link rel="canonical" href="${pageUrl}" />`;
  return /<link rel="canonical" href="[^"]*"/.test(withRequestMetadata)
    ? withRequestMetadata.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, canonicalTag)
    : withRequestMetadata.replace("</head>", `  ${canonicalTag}\n  </head>`);
}
