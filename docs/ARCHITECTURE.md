# ACBT Web Architecture

## Mục tiêu

Dự án này nên được vận hành như một hệ thống gồm 2 phần:

- Public website: tối ưu SEO, tốc độ tải, chuyển đổi mua hàng.
- Admin CMS: tối ưu thao tác nội bộ, phân quyền, nhập liệu, media, page builder.

## Quy ước tổ chức code

```txt
src/
  app/                 Route, layout, API endpoint
  components/ui/       Design system primitives
  components/layout/   Navbar, Footer, shell
  components/shared/   Component dùng lại ở nhiều màn
  components/admin/    UI riêng cho CMS
  features/            Logic nghiệp vụ theo domain
  lib/                 Hạ tầng chung: auth, prisma, response, slug
```

## Feature layer

Mỗi domain nên có:

```txt
features/products/
  queries.ts           Đọc dữ liệu
  mutations.ts         Ghi dữ liệu
  types.ts             Type dùng chung
```

API routes và page nên gọi feature layer, không query Prisma trực tiếp ở nhiều nơi.

## UI layer

Các component mới nên ưu tiên dùng:

- `components/ui/Button.tsx`
- `components/ui/Input.tsx`
- `components/ui/Badge.tsx`
- `components/ui/Card.tsx`
- `components/ui/EmptyState.tsx`

Khi cần thêm UI mới, thêm vào `components/ui` trước rồi dùng lại ở admin/public.

## Data fetching

Public page nên ưu tiên Server Component và gọi trực tiếp `features/*/queries`.
Client Component chỉ nên dùng khi cần state, event handler, animation, form, local storage.

## API routes

API route nên mỏng:

1. Đọc request/search params.
2. Kiểm tra quyền nếu cần.
3. Gọi feature query/mutation.
4. Trả `jsonOk` hoặc `jsonError`.

Không nên để business logic dài trong `route.ts`.
