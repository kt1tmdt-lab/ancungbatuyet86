export type PartnershipPageConfig = {
  label: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageLabel: string;
  imageCaption: string;
  ctaText: string;
  ctaLink: string;
};

export const DEFAULT_PARTNERSHIP_CONFIG: PartnershipPageConfig = {
  label: "Hợp tác",
  title: "Hợp tác",
  subtitle:
    "Thông tin dành cho đại lý, nhà phân phối, đối tác truyền thông và các bên muốn làm việc cùng Ăn Cùng Bà Tuyết.",
  imageUrl: "/bento/bento-factory.png",
  imageLabel: "Trang nội dung",
  imageCaption: "Nội dung được cập nhật theo từng giai đoạn",
  ctaText: "",
  ctaLink: "",
};

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

export function normalizePartnershipConfig(
  input: unknown,
): PartnershipPageConfig {
  const source =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};

  return {
    label: stringValue(source.label, DEFAULT_PARTNERSHIP_CONFIG.label),
    title: stringValue(source.title, DEFAULT_PARTNERSHIP_CONFIG.title),
    subtitle: stringValue(
      source.subtitle,
      DEFAULT_PARTNERSHIP_CONFIG.subtitle,
    ),
    imageUrl: stringValue(
      source.imageUrl,
      DEFAULT_PARTNERSHIP_CONFIG.imageUrl,
    ),
    imageLabel: stringValue(
      source.imageLabel,
      DEFAULT_PARTNERSHIP_CONFIG.imageLabel,
    ),
    imageCaption: stringValue(
      source.imageCaption,
      DEFAULT_PARTNERSHIP_CONFIG.imageCaption,
    ),
    ctaText: stringValue(
      source.ctaText,
      DEFAULT_PARTNERSHIP_CONFIG.ctaText,
    ),
    ctaLink: stringValue(
      source.ctaLink,
      DEFAULT_PARTNERSHIP_CONFIG.ctaLink,
    ),
  };
}
