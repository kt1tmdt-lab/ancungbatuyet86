export const LEGACY_UNUSED_PAGE_SLUGS = [
  "chat-luong",
  "chat-luong-minh-bach-nguon-nguyen-lieu",
  "chat-luong-nha-may-quy-trinh-san-xuat",
  "chat-luong-ho-so-phap-ly-chung-nhan",
  "chat-luong-bao-hiem-trach-nhiem-san-pham-pvi",
  "chat-luong-chinh-sach-bao-ve-quyen-loi-khach-hang",
  "diem-ban",
  "diem-ban-he-thong-diem-ban-offline",
  "diem-ban-kenh-online-chinh-thuc",
  "diem-ban-nhan-dien-hang-chinh-hang",
  "gioi-thieu-cau-chuyen-thuong-hieu",
  "gioi-thieu-thong-tin-doanh-nghiep",
  "gioi-thieu-hanh-trinh-phat-trien",
  "hop-tac",
  "hop-tac-dai-ly-nha-phan-phoi",
  "hop-tac-truyen-thong",
  "tiktok-settings",
] as const;

const legacyUnusedPageSlugs = new Set<string>(LEGACY_UNUSED_PAGE_SLUGS);

export function isLegacyUnusedPageSlug(slug: string) {
  return legacyUnusedPageSlugs.has(slug);
}

export function customPageHref(slug: string) {
  return `/trang/${slug}`;
}

export function isCustomPageHref(href: string) {
  return /^\/trang\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(href);
}
