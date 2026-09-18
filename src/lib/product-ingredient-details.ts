export type ProductIngredientRow = {
  name: string;
  origin: string;
  role: string;
};

export type ProductIngredientDetails = {
  title: string;
  intro: string;
  primaryPercent: string;
  secondaryPercent: string;
  secondaryName: string;
  rows: ProductIngredientRow[];
};

export const DEFAULT_CHICKEN_FEET_INGREDIENT_DETAILS: ProductIngredientDetails = {
  title: "Bên trong sản phẩm có gì?",
  intro: "Chân gà rút xương Bà Tuyết — nhìn rõ từng thành phần, nguồn gốc và vai trò trong hương vị cuối cùng.",
  primaryPercent: "95",
  secondaryPercent: "5",
  secondaryName: "Gia vị & phụ gia",
  rows: [
    { name: "Chân gà", origin: "Gia cầm chăn nuôi", role: "Nguyên liệu chính · giàu collagen" },
    { name: "Nước tinh khiết", origin: "Nước lọc", role: "Chế biến · hoà tan gia vị" },
    { name: "Muối", origin: "Khoáng chất", role: "Gia vị · bảo quản tự nhiên" },
    { name: "Đường", origin: "Mía", role: "Cân bằng vị" },
    { name: "Dầu ớt", origin: "Ớt ép", role: "Tạo vị cay · màu đỏ tự nhiên" },
    { name: "Mì chính (MSG)", origin: "Lên men từ mía/sắn", role: "Tăng vị ngọt thịt (umami)" },
    { name: "Gừng", origin: "Củ gia vị tự nhiên", role: "Hương thơm · khử mùi tanh" },
    { name: "I+G", origin: "Chiết xuất từ tinh bột lên men", role: "Tăng vị umami (cùng MSG)" },
    { name: "Acid lactic (INS 270)", origin: "Lên men tự nhiên (như dưa muối, sữa chua)", role: "Điều chỉnh độ chua · ức chế vi khuẩn" },
    { name: "Acid citric (INS 330)", origin: "Chiết xuất từ trái cây họ cam chanh", role: "Chống oxy hoá · giữ pH ổn định" },
    { name: "Sodium diacetate (INS 262ii)", origin: "Muối ăn + giấm", role: "Bảo quản · chống khuẩn" },
    { name: "Nisin (INS 234)", origin: "Vi khuẩn có lợi trong sữa chua lên men", role: "Bảo quản sinh học · chống khuẩn" },
    { name: "Phosphate (INS 450iii, 451i, 340ii)", origin: "Khoáng chất (có tự nhiên trong xương, sữa)", role: "Giữ kết cấu giòn dai" },
    { name: "Caramel (INS 150c)", origin: "Đường nấu cháy", role: "Tạo màu nâu đặc trưng" },
    { name: "Hương gà, hương thịt", origin: "Hương liệu tổng hợp", role: "Tăng hương vị" },
  ],
};

export function isChickenFeetProduct(slug: string) {
  return slug === "chan-ga" || slug === "chan-ga-rut-xuong";
}

function stringOr(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

export function normalizeProductIngredientDetails(value: unknown): ProductIngredientDetails | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const source = value as Record<string, unknown>;
  const rows = Array.isArray(source.rows)
    ? source.rows
        .filter((row): row is Record<string, unknown> => Boolean(row && typeof row === "object" && !Array.isArray(row)))
        .map((row) => ({
          name: stringOr(row.name, ""),
          origin: stringOr(row.origin, ""),
          role: stringOr(row.role, ""),
        }))
    : [];

  return {
    title: stringOr(source.title, ""),
    intro: stringOr(source.intro, ""),
    primaryPercent: stringOr(source.primaryPercent, ""),
    secondaryPercent: stringOr(source.secondaryPercent, ""),
    secondaryName: stringOr(source.secondaryName, ""),
    rows,
  };
}

export function createDefaultChickenFeetIngredientDetails(): ProductIngredientDetails {
  return {
    ...DEFAULT_CHICKEN_FEET_INGREDIENT_DETAILS,
    rows: DEFAULT_CHICKEN_FEET_INGREDIENT_DETAILS.rows.map((row) => ({ ...row })),
  };
}
