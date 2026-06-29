export type LinkItem = {
  href: string;
  label: string;
};

export type StatItem = {
  value: string;
  label: string;
  desc: string;
};

export type SiteConfigData = {
  heroBanner: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  navbarLinks: LinkItem[];
  footerLinks: {
    products: LinkItem[];
    explore: LinkItem[];
  };
  footerContact: {
    phone: string;
    email: string;
    address: string;
    workingHours: string;
    shopeeUrl: string;
    tiktokUrl: string;
    facebookUrl: string;
  };
  stats: {
    followers: StatItem;
    orders: StatItem;
    area: StatItem;
    insurance: StatItem;
  };
};

export const REQUIRED_NAV_LINKS: LinkItem[] = [
  { href: "/", label: "Trang chủ" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/quy-trinh", label: "Quy trình" },
  { href: "/he-thong-ban", label: "Hệ thống bán" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/lien-he", label: "Liên hệ" },
];


export const DEFAULT_SITE_CONFIG: SiteConfigData = {
  heroBanner: {
    title: "Ăn vặt thì phải Ăn Cùng Bà Tuyết",
    subtitle:
      "Thương hiệu đồ ăn vặt Việt Nam xây dựng niềm tin bằng nguyên liệu rõ ràng, quy trình sản xuất chỉn chu và hệ thống phân phối chính thức.",
    ctaText: "Xem sản phẩm nổi bật",
    ctaLink: "/san-pham",
  },
  seo: {
    title: "Ăn Cùng Bà Tuyết - Đồ ăn vặt sạch hàng đầu Việt Nam",
    description:
      "Thương hiệu đồ ăn vặt sạch hàng đầu Việt Nam. Chân gà rút xương, tăm cay, snack bánh tráng với nguyên liệu sạch và quy trình rõ ràng.",
    keywords: "đồ ăn vặt sạch, ăn cùng bà tuyết, tăm cay, chân gà rút xương, snack bánh tráng",
  },
  navbarLinks: [
    { href: "/", label: "Trang chủ" },
    { href: "/san-pham", label: "Sản phẩm" },
    { href: "/quy-trinh", label: "Quy trình" },
    { href: "/he-thong-ban", label: "Hệ thống bán" },
    { href: "/gioi-thieu", label: "Giới thiệu" },
    { href: "/tin-tuc", label: "Tin tức" },
    { href: "/lien-he", label: "Liên hệ" },
  ],
  footerLinks: {
    products: [
      { href: "/san-pham/chan-ga-rut-xuong", label: "Chân gà rút xương" },
      { href: "/san-pham/chan-ga-khong-lo", label: "Chân gà khổng lồ" },
      { href: "/san-pham/tam-cay", label: "Tăm cay" },
      { href: "/san-pham/snack-banh-trang", label: "Snack" },
      { href: "/san-pham/banh-trang", label: "Bánh tráng" },
      { href: "/san-pham/bo-suu-tap", label: "Sản phẩm khác" },
    ],
    explore: [
      { href: "/quy-trinh", label: "Quy trình sản xuất" },
      { href: "/he-thong-ban", label: "Hệ thống điểm bán" },
      { href: "/gioi-thieu", label: "Về chúng tôi" },
      { href: "/tin-tuc", label: "Tin tức" },
      { href: "/lien-he", label: "Liên hệ" },
    ],
  },
  footerContact: {
    phone: "0989 852 948",
    email: "cskh@ancungbatuyet.vn",
    address: "Xuân Phương, Hà Nội",
    workingHours: "T2 - T7: 8:00 - 17:00",
    shopeeUrl: "https://shopee.vn/an-vat-ba-tuyet-tam-cay",
    tiktokUrl: "https://tiktok.com/@batuyethanhvi",
    facebookUrl: "https://facebook.com/ancungbatuyet",
  },
  stats: {
    followers: {
      value: "10M+",
      label: "Cộng đồng theo dõi",
      desc: "Cộng đồng khách hàng theo dõi Bà Tuyết và Ăn Cùng Bà Tuyết trên các nền tảng mạng xã hội.",
    },
    orders: {
      value: "8M+",
      label: "Đơn hàng online",
      desc: "Ghi nhận từ các kênh bán hàng trực tuyến chính thức của thương hiệu.",
    },
    area: {
      value: "5.000+m²",
      label: "Không gian sản xuất",
      desc: "Thể hiện năng lực sản xuất, đóng gói và kiểm soát chất lượng theo quy trình rõ ràng.",
    },
    insurance: {
      value: "PVI",
      label: "Bảo hiểm sản phẩm",
      desc: "Thể hiện trách nhiệm của thương hiệu với khách hàng và chất lượng sản phẩm.",
    },
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringOrDefault(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function normalizeLinks(value: unknown, fallback: LinkItem[]) {
  if (!Array.isArray(value)) return fallback;

  const links = value
    .map((item) => {
      if (!isRecord(item)) return null;
      const label = typeof item.label === "string" ? item.label.trim() : "";
      const href = typeof item.href === "string" ? item.href.trim() : "";
      return label && href ? { label, href } : null;
    })
    .filter((item): item is LinkItem => Boolean(item));

  return links.length > 0 ? links : fallback;
}

function normalizeNavbarLinks(value: unknown) {
  const links = normalizeLinks(value, REQUIRED_NAV_LINKS);
  const byHref = new Map(links.map((item) => [item.href, item]));

  return REQUIRED_NAV_LINKS.map((requiredItem) => ({
    ...requiredItem,
    ...(byHref.get(requiredItem.href) || {}),
  })).concat(
    links.filter((item) => !REQUIRED_NAV_LINKS.some((requiredItem) => requiredItem.href === item.href)),
  );
}

export function normalizeSiteConfig(input: unknown): SiteConfigData {
  const source = isRecord(input) ? input : {};
  const heroBanner = isRecord(source.heroBanner) ? source.heroBanner : {};
  const seo = isRecord(source.seo) ? source.seo : {};
  const footerLinks = isRecord(source.footerLinks) ? source.footerLinks : {};
  const footerContact = isRecord(source.footerContact) ? source.footerContact : {};
  const stats = isRecord(source.stats) ? source.stats : {};
  const followers = isRecord(stats.followers) ? stats.followers : {};
  const orders = isRecord(stats.orders) ? stats.orders : {};
  const area = isRecord(stats.area) ? stats.area : {};
  const insurance = isRecord(stats.insurance) ? stats.insurance : {};

  return {
    heroBanner: {
      title: stringOrDefault(heroBanner.title, DEFAULT_SITE_CONFIG.heroBanner.title),
      subtitle: stringOrDefault(heroBanner.subtitle, DEFAULT_SITE_CONFIG.heroBanner.subtitle),
      ctaText: stringOrDefault(heroBanner.ctaText, DEFAULT_SITE_CONFIG.heroBanner.ctaText),
      ctaLink: stringOrDefault(heroBanner.ctaLink, DEFAULT_SITE_CONFIG.heroBanner.ctaLink),
    },
    seo: {
      title: stringOrDefault(seo.title, DEFAULT_SITE_CONFIG.seo.title),
      description: stringOrDefault(seo.description, DEFAULT_SITE_CONFIG.seo.description),
      keywords:
        typeof seo.keywords === "string"
          ? seo.keywords
          : DEFAULT_SITE_CONFIG.seo.keywords,
    },
    navbarLinks: normalizeNavbarLinks(source.navbarLinks),
    footerLinks: {
      products: normalizeLinks(footerLinks.products, DEFAULT_SITE_CONFIG.footerLinks.products),
      explore: normalizeLinks(footerLinks.explore, DEFAULT_SITE_CONFIG.footerLinks.explore),
    },
    footerContact: {
      phone: stringOrDefault(footerContact.phone, DEFAULT_SITE_CONFIG.footerContact.phone),
      email: stringOrDefault(footerContact.email, DEFAULT_SITE_CONFIG.footerContact.email),
      address: stringOrDefault(footerContact.address, DEFAULT_SITE_CONFIG.footerContact.address),
      workingHours: stringOrDefault(
        footerContact.workingHours,
        DEFAULT_SITE_CONFIG.footerContact.workingHours,
      ),
      shopeeUrl:
        typeof footerContact.shopeeUrl === "string"
          ? footerContact.shopeeUrl
          : DEFAULT_SITE_CONFIG.footerContact.shopeeUrl,
      tiktokUrl:
        typeof footerContact.tiktokUrl === "string"
          ? footerContact.tiktokUrl
          : DEFAULT_SITE_CONFIG.footerContact.tiktokUrl,
      facebookUrl:
        typeof footerContact.facebookUrl === "string"
          ? footerContact.facebookUrl
          : DEFAULT_SITE_CONFIG.footerContact.facebookUrl,
    },
    stats: {
      followers: {
        value: stringOrDefault(followers.value, DEFAULT_SITE_CONFIG.stats.followers.value),
        label: stringOrDefault(followers.label, DEFAULT_SITE_CONFIG.stats.followers.label),
        desc: stringOrDefault(followers.desc, DEFAULT_SITE_CONFIG.stats.followers.desc),
      },
      orders: {
        value: stringOrDefault(orders.value, DEFAULT_SITE_CONFIG.stats.orders.value),
        label: stringOrDefault(orders.label, DEFAULT_SITE_CONFIG.stats.orders.label),
        desc: stringOrDefault(orders.desc, DEFAULT_SITE_CONFIG.stats.orders.desc),
      },
      area: {
        value: stringOrDefault(area.value, DEFAULT_SITE_CONFIG.stats.area.value),
        label: stringOrDefault(area.label, DEFAULT_SITE_CONFIG.stats.area.label),
        desc: stringOrDefault(area.desc, DEFAULT_SITE_CONFIG.stats.area.desc),
      },
      insurance: {
        value: stringOrDefault(insurance.value, DEFAULT_SITE_CONFIG.stats.insurance.value),
        label: stringOrDefault(insurance.label, DEFAULT_SITE_CONFIG.stats.insurance.label),
        desc: stringOrDefault(insurance.desc, DEFAULT_SITE_CONFIG.stats.insurance.desc),
      },
    },
  };
}

export function keywordsToArray(keywords: string) {
  return keywords
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}
