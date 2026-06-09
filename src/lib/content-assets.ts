const LEGACY_IMAGE_URLS: Record<string, string> = {
  "do-an-vat-viet.jpg": "/uploads/1780482157869-chan-ga-rut-xuong-moi-png.png",
  "icon-quality.png": "/bento/bento-insurance.png",
  "icon-package.png": "/bento/bento-ingredients.png",
  "ba-tuyet-livestream.jpg": "/uploads/1780481989589-snack-nem-nuong-ba-tuyet-2k.png",
  "dong-goi-san-pham.jpg": "/uploads/1780482013661-dui-ga-pho-mai-700g.png",
  "team-acbt.jpg": "/hero/ba-tuyet-character.png",
  "icon-care.png": "/bento/bento-tiktok.png",
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeContentAssetUrls(content: string | null | undefined) {
  if (!content) return "";

  return Object.entries(LEGACY_IMAGE_URLS).reduce((html, [legacyName, replacement]) => {
    const pattern = new RegExp(`(["'(/])(?:/?(?:images|uploads)/)?${escapeRegExp(legacyName)}(?=["')])`, "g");
    return html.replace(pattern, `$1${replacement}`);
  }, content);
}
