-- These CMS records belonged to public pages that now have dedicated layouts.
-- Keeping them made Admin show editors whose changes never appeared publicly.
DELETE FROM "Page"
WHERE "slug" IN (
  'chat-luong',
  'chat-luong-minh-bach-nguon-nguyen-lieu',
  'chat-luong-nha-may-quy-trinh-san-xuat',
  'chat-luong-ho-so-phap-ly-chung-nhan',
  'chat-luong-bao-hiem-trach-nhiem-san-pham-pvi',
  'chat-luong-chinh-sach-bao-ve-quyen-loi-khach-hang',
  'diem-ban',
  'diem-ban-he-thong-diem-ban-offline',
  'diem-ban-kenh-online-chinh-thuc',
  'diem-ban-nhan-dien-hang-chinh-hang',
  'gioi-thieu-cau-chuyen-thuong-hieu',
  'gioi-thieu-thong-tin-doanh-nghiep',
  'gioi-thieu-hanh-trinh-phat-trien',
  'hop-tac',
  'hop-tac-dai-ly-nha-phan-phoi',
  'hop-tac-truyen-thong',
  'tiktok-settings'
);
