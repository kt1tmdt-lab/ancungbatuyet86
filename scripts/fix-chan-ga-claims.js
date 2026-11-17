/**
 * Sửa các nội dung sai sự thật / chưa được duyệt trên trang /san-pham/chan-ga
 * theo bản rà soát dựa trên ACBT-TT-SP-001 (16/11).
 *
 *   node scripts/fix-chan-ga-claims.js          # chỉ in ra thay đổi, không ghi DB
 *   node scripts/fix-chan-ga-claims.js --apply  # ghi vào DB
 *
 * Chạy lại nhiều lần vẫn an toàn: chỉ ghi khi còn nội dung cần sửa.
 */
const { PrismaClient } = require("@prisma/client");

const APPLY = process.argv.includes("--apply");
const SLUGS = ["chan-ga", "chan-ga-rut-xuong"];

const DESCRIPTION =
  "Chân gà nhập khẩu từ châu Âu (Ba Lan, Hungary…), có đủ giấy thông quan và kiểm dịch. " +
  "Chân gà được rút xương thủ công và đóng gói hút chân không để giữ chất lượng khi vận chuyển xa. " +
  "Gia vị sốt cay tê thấm đượm từng thớ thịt.";

// Chỉ giữ các bước đã có video công khai; các bước còn lại ẩn đến khi TGĐ Sản xuất duyệt.
const PROCESS_STEPS = [
  { step: 1, title: "Nhập khẩu & kiểm dịch", description: "Kiểm tra giấy tờ kiểm dịch từng lô nhập khẩu" },
  { step: 2, title: "Rút xương thủ công", description: "Rút xương từng chiếc chân gà" },
  { step: 3, title: "Đóng gói hút chân không", description: "Hút chân không để giữ chất lượng khi vận chuyển xa" },
];

// Câu chuyện "ủ sả ớt" chưa kiểm chứng và lệch vị sản phẩm → bỏ; trang sẽ hiển thị phần mô tả thay thế.
const STORY = "";

const SEO_TITLE = "Ăn Cùng Bà Tuyết – Ăn vặt thì phải ăn cùng Bà Tuyết";
const SEO_DESCRIPTION =
  "Ăn Cùng Bà Tuyết – thương hiệu đồ ăn vặt Việt Nam: chân gà rút xương, tăm cay, snack bánh tráng, công khai thành phần và nguồn gốc.";

function fixSpecs(specs) {
  if (!Array.isArray(specs)) return specs;
  return specs.flatMap((spec) => {
    if (!spec || typeof spec !== "object") return [spec];
    const label = String(spec.label || "");
    const value = String(spec.value || "");
    if (/hạn sử dụng/i.test(label) && /\d/.test(value)) {
      return [{ ...spec, value: "In trên bao bì từng sản phẩm" }];
    }
    if (/ATVSTP|bảo chứng/i.test(value)) {
      return [{ ...spec, label: "Bảo hiểm", value: "Bảo hiểm trách nhiệm sản phẩm PVI" }];
    }
    return [spec];
  });
}

function fixIngredientRow(row) {
  if (!row || typeof row !== "object") return row;
  const name = String(row.name || "");
  const next = { ...row };
  if (/^chân gà$/i.test(name.trim())) {
    if (/chăn nuôi|VietGAP/i.test(next.origin || "")) next.origin = "Nhập khẩu từ châu Âu";
    next.role = String(next.role || "").replace(/\s*·\s*giàu collagen/i, "").replace(/giàu collagen/i, "Nguyên liệu chính");
  }
  if (/262ii/i.test(name) && /muối ăn/i.test(next.origin || "")) next.origin = "Natri axetat + axit axetic";
  if (/nisin|INS 234/i.test(name) && /vi khuẩn/i.test(next.origin || "")) next.origin = "Peptide do lợi khuẩn tạo ra khi lên men";
  if (/150c/i.test(name) && /nấu cháy/i.test(next.origin || "")) next.origin = "Phẩm màu caramel (caramel amoni)";
  return next;
}

function fixIngredientDetails(details) {
  if (!details || typeof details !== "object" || !Array.isArray(details.rows)) return details;
  return { ...details, rows: details.rows.map(fixIngredientRow) };
}

function fixIngredients(list) {
  if (!Array.isArray(list)) return list;
  return list.map((item) => (/^chân gà tươi/i.test(item) ? "Chân gà nhập khẩu" : item));
}

function showChange(label, before, after) {
  const a = JSON.stringify(before);
  const b = JSON.stringify(after);
  if (a === b) return false;
  console.log(`\n  • ${label}\n    TRƯỚC: ${a}\n    SAU:   ${b}`);
  return true;
}

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log(APPLY ? "== CHẾ ĐỘ GHI DB ==" : "== CHẠY THỬ (không ghi DB). Thêm --apply để ghi ==");

    const products = await prisma.product.findMany({ where: { slug: { in: SLUGS } } });
    if (products.length === 0) console.log("\nKhông tìm thấy sản phẩm chân gà theo slug", SLUGS.join(", "));

    for (const product of products) {
      console.log(`\n[Sản phẩm] ${product.name} (/san-pham/${product.slug})`);
      const next = {
        description: DESCRIPTION,
        processSteps: PROCESS_STEPS,
        story: STORY,
        specs: fixSpecs(product.specs),
        ingredients: fixIngredients(product.ingredients),
        ingredientDetails: fixIngredientDetails(product.ingredientDetails),
      };

      const data = {};
      for (const [key, value] of Object.entries(next)) {
        if (showChange(key, product[key], value)) data[key] = value;
      }

      if (Object.keys(data).length === 0) {
        console.log("  Không còn gì cần sửa.");
      } else if (APPLY) {
        await prisma.product.update({ where: { id: product.id }, data });
        console.log("  → Đã lưu.");
      }
    }

    const config = await prisma.siteConfig.findUnique({ where: { id: "global" } });
    const seo = config && config.data && typeof config.data === "object" ? config.data.seo : null;
    console.log("\n[Cấu hình SEO toàn site]");
    if (!seo) {
      console.log("  Chưa có cấu hình riêng trong DB → website dùng giá trị mặc định trong code (đã sửa).");
    } else {
      const nextSeo = { ...seo };
      if (/hàng đầu|sạch/i.test(seo.title || "")) nextSeo.title = SEO_TITLE;
      if (/hàng đầu/i.test(seo.description || "")) nextSeo.description = SEO_DESCRIPTION;
      if (typeof seo.keywords === "string") {
        nextSeo.keywords = seo.keywords.replace(/đồ ăn vặt sạch/gi, "đồ ăn vặt");
      }

      if (!showChange("seo", seo, nextSeo)) {
        console.log("  Không còn gì cần sửa.");
      } else if (APPLY) {
        await prisma.siteConfig.update({
          where: { id: "global" },
          data: { data: { ...config.data, seo: nextSeo } },
        });
        console.log("  → Đã lưu.");
      }
    }

    console.log(APPLY ? "\nXong." : "\nChưa ghi gì. Kiểm tra lại các thay đổi ở trên rồi chạy với --apply.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
