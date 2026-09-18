export function normalizeContactSource(source: string | null | undefined) {
  return String(source || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d");
}

export function isDistributorRegistration(source: string | null | undefined, content?: string | null) {
  const normalized = normalizeContactSource(`${source || ""} ${content || ""}`);
  return ["dai ly", "npp", "phan phoi", "mua si", "mua hang si", "nhap si"].some((keyword) =>
    normalized.includes(keyword),
  );
}

export function isPartnershipRegistration(source: string | null | undefined, content?: string | null) {
  const normalized = normalizeContactSource(`${source || ""} ${content || ""}`);
  return [
    "hop tac",
    "dai ly",
    "npp",
    "phan phoi",
    "mua si",
    "mua hang si",
    "nhap si",
    "truyen thong",
    "kol",
    "koc",
  ].some((keyword) => normalized.includes(keyword));
}
