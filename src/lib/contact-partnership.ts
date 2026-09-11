export function normalizeContactSource(source: string | null | undefined) {
  return String(source || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase();
}

export function isDistributorRegistration(source: string | null | undefined) {
  const normalized = normalizeContactSource(source);
  return ["dai ly", "npp", "phan phoi", "mua si"].some((keyword) =>
    normalized.includes(keyword),
  );
}

export function isPartnershipRegistration(source: string | null | undefined) {
  const normalized = normalizeContactSource(source);
  return [
    "hop tac",
    "dai ly",
    "npp",
    "phan phoi",
    "mua si",
    "truyen thong",
    "kol",
    "koc",
  ].some((keyword) => normalized.includes(keyword));
}
