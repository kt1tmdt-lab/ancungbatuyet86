import { normalizeUploadPublicUrl } from "@/lib/upload-url";

export type QualitySimpleItem = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
};

export type QualityPageConfig = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
  };
  source: {
    title: string;
    description: string;
    imageUrl: string;
    facts: QualitySimpleItem[];
  };
  factory: {
    title: string;
    description: string;
    imageUrl: string;
    gallery: QualitySimpleItem[];
    steps: QualitySimpleItem[];
  };
  documents: {
    title: string;
    subtitle: string;
    items: QualitySimpleItem[];
  };
  pvi: {
    title: string;
    description: string;
    imageUrl: string;
  };
  policy: {
    title: string;
    items: QualitySimpleItem[];
  };
  faq: {
    title: string;
    items: QualitySimpleItem[];
  };
};

export const DEFAULT_QUALITY_CONFIG: QualityPageConfig = {
  hero: {
    eyebrow: "Chất lượng kiểm chứng",
    title: "Năng lực sản xuất rõ ràng trước khi nói về bán hàng",
    subtitle:
      "Nguyên liệu, nhà máy, chứng nhận và bảo hiểm — mọi thứ cần có hồ sơ đi kèm. Chỗ nào chưa có file công khai sẽ ghi rõ [cần bổ sung], không tự tuyên bố thay bằng chứng.",
    imageUrl: "/bento/bento-factory.png",
    ctaText: "Xem hồ sơ pháp lý",
    ctaLink: "#ho-so-phap-ly",
    secondaryCtaText: "Xem sản phẩm",
    secondaryCtaLink: "/san-pham",
  },
  source: {
    title: "Nguyên liệu nhập khẩu từ châu Âu — có truy xuất",
    description:
      "Nguyên liệu chính như chân gà được định hướng công khai theo hồ sơ nhập khẩu từ Ba Lan, Hungary và các nước châu Âu khác. Khi công bố claim này, cần đi kèm C/O, phiếu kiểm dịch và hồ sơ lô hàng tương ứng.",
    imageUrl: "/bento/bento-ingredients.png",
    facts: [
      { id: "source-1", title: "Ba Lan, Hungary", description: "Nguồn nhập khẩu châu Âu. [cần bổ sung hồ sơ lô hàng public]" },
      { id: "source-2", title: "C/O & kiểm dịch", description: "Claim nguồn gốc cần đi kèm C/O, kiểm dịch. [cần bổ sung ảnh scan]" },
      { id: "source-3", title: "Kho lạnh", description: "Lưu kho lạnh theo quy chuẩn vận hành. [cần bổ sung ảnh/video kho]" },
    ],
  },
  factory: {
    title: "Nhà máy sản xuất NMV Food — Thái Nguyên",
    description:
      "Ghi đúng chủ thể: NMV Food đạt chứng nhận ISO 22000:2018. Không ghi thành ACBT nếu hồ sơ không thể hiện như vậy. Không dùng “an toàn tuyệt đối”, “vô trùng”; dùng “quy trình 6 bước có kiểm soát”.",
    imageUrl: "/bento/bento-factory.png",
    gallery: [
      { id: "factory-gallery-1", title: "Không gian nhà máy", description: "Ảnh dây chuyền/khu sản xuất.", imageUrl: "/bento/bento-factory.png" },
      { id: "factory-gallery-2", title: "Đóng gói", description: "Ảnh đóng gói/phân phối.", imageUrl: "/bento/bento-tiktok.png" },
      { id: "factory-gallery-3", title: "Sản phẩm thực tế", description: "Ảnh sản phẩm thật.", imageUrl: "/hero/chan-ga-plate.png" },
      { id: "factory-gallery-4", title: "Hồ sơ", description: "Ảnh chứng nhận/bảo hiểm.", imageUrl: "/bento/bento-insurance.png" },
    ],
    steps: [
      { id: "step-1", title: "Nguyên liệu", description: "Tiếp nhận nguyên liệu theo hồ sơ lô hàng, điều kiện bảo quản và kiểm tra đầu vào." },
      { id: "step-2", title: "Sơ chế", description: "Sơ chế theo khu vực riêng, giảm lẫn chéo và giữ tính ổn định giữa các lô." },
      { id: "step-3", title: "Chế biến", description: "Tẩm ướp/chế biến theo công thức và thông số nội bộ được kiểm soát." },
      { id: "step-4", title: "QC", description: "Kiểm tra cảm quan, quy cách, bao bì và các điểm kiểm soát chất lượng." },
      { id: "step-5", title: "Đóng gói", description: "Đóng gói, tem nhãn, thông tin NSX/HSD và nhận diện sản phẩm." },
      { id: "step-6", title: "Giao hàng", description: "Lưu kho, phân phối tới sàn TMĐT, điểm bán và kênh chính thức." },
    ],
  },
  documents: {
    title: "Hồ sơ pháp lý & chứng nhận",
    subtitle: "Mỗi chứng nhận nên có ảnh scan hoặc PDF đi kèm để khách hàng, đối tác và báo chí kiểm chứng.",
    items: [
      { id: "doc-1", title: "ISO 22000:2018", description: "Ghi rõ: cấp cho NMV Food. [cần bổ sung scan chứng nhận]", imageUrl: "/bento/bento-factory.png" },
      { id: "doc-2", title: "HACCP", description: "Chương trình đào tạo, NMV Food. [cần bổ sung hồ sơ]", imageUrl: "/bento/bento-insurance.png" },
      { id: "doc-3", title: "Giấy phép ATTP", description: "Giấy đủ điều kiện an toàn thực phẩm. [cần bổ sung ảnh/PDF]", imageUrl: "/bento/bento-ingredients.png" },
      { id: "doc-4", title: "Phiếu kiểm nghiệm", description: "VNTEST — kiểm nghiệm định kỳ hàng tháng (NMV Food). [cần bổ sung phiếu mới nhất]", imageUrl: "/bento/bento-tiktok.png" },
    ],
  },
  pvi: {
    title: "PVI là cam kết trách nhiệm, không phải “bảo chứng chất lượng”",
    description:
      "ACBT mua bảo hiểm trách nhiệm sản phẩm từ PVI. Nếu sản phẩm gây thiệt hại cho người tiêu dùng theo phạm vi hợp đồng, có đơn vị bảo hiểm tham gia trách nhiệm bồi thường. Không trình bày như PVI xác nhận chất lượng sản phẩm.",
    imageUrl: "/bento/bento-insurance.png",
  },
  policy: {
    title: "Khách hàng cần biết mình được bảo vệ thế nào",
    items: [
      { id: "policy-1", title: "Quyền được thông tin", description: "Sản phẩm cần ghi rõ thành phần, NSX, HSD và thông tin nhận diện." },
      { id: "policy-2", title: "Quyền đổi trả", description: "Có quy trình đổi trả khi sản phẩm lỗi theo chính sách CSKH. [cần bổ sung điều kiện]" },
      { id: "policy-3", title: "Quyền khiếu nại", description: "Có kênh tiếp nhận và thời gian xử lý phản hồi. [cần bổ sung SLA]" },
      { id: "policy-4", title: "Bảo hiểm sản phẩm", description: "Sản phẩm được bảo hiểm trách nhiệm sản phẩm bởi PVI theo phạm vi hợp đồng." },
      { id: "policy-5", title: "Kênh hỗ trợ", description: "Hotline, email và thời gian làm việc. [cần bổ sung thông tin chính thức]" },
    ],
  },
  faq: {
    title: "Những câu dễ bị hỏi nhất phải trả lời gọn và chắc",
    items: [
      { id: "faq-1", title: "ACBT có tự tuyên bố chất lượng không?", description: "Không nên. Trang này ưu tiên để bên thứ ba và hồ sơ nói thay." },
      { id: "faq-2", title: "Nếu chưa có file chứng nhận thì sao?", description: "Giữ nhãn [cần bổ sung] ngay tại vị trí đó." },
      { id: "faq-3", title: "PVI có nghĩa là sản phẩm được chứng nhận chất lượng không?", description: "Không. PVI là bảo hiểm trách nhiệm sản phẩm." },
    ],
  },
};

function asRecord(value: unknown): Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function str(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function item(value: unknown, fallback: QualitySimpleItem): QualitySimpleItem {
  const raw = asRecord(value);
  return {
    id: str(raw.id, fallback.id),
    title: str(raw.title, fallback.title),
    description: str(raw.description, fallback.description),
    imageUrl: normalizeUploadPublicUrl(str(raw.imageUrl, fallback.imageUrl || "")),
  };
}

function items(value: unknown, fallback: QualitySimpleItem[]) {
  if (!Array.isArray(value)) return fallback;
  return value.map((entry, index) => item(entry, fallback[index] || { id: `item-${index}`, title: "", description: "" }));
}

export function normalizeQualityConfig(input: unknown): QualityPageConfig {
  const raw = asRecord(input);
  const hero = asRecord(raw.hero);
  const source = asRecord(raw.source);
  const factory = asRecord(raw.factory);
  const documents = asRecord(raw.documents);
  const pvi = asRecord(raw.pvi);
  const policy = asRecord(raw.policy);
  const faq = asRecord(raw.faq);

  return {
    hero: {
      eyebrow: str(hero.eyebrow, DEFAULT_QUALITY_CONFIG.hero.eyebrow),
      title: str(hero.title, DEFAULT_QUALITY_CONFIG.hero.title),
      subtitle: str(hero.subtitle, DEFAULT_QUALITY_CONFIG.hero.subtitle),
      imageUrl: normalizeUploadPublicUrl(str(hero.imageUrl, DEFAULT_QUALITY_CONFIG.hero.imageUrl)),
      ctaText: str(hero.ctaText, DEFAULT_QUALITY_CONFIG.hero.ctaText),
      ctaLink: str(hero.ctaLink, DEFAULT_QUALITY_CONFIG.hero.ctaLink),
      secondaryCtaText: str(hero.secondaryCtaText, DEFAULT_QUALITY_CONFIG.hero.secondaryCtaText),
      secondaryCtaLink: str(hero.secondaryCtaLink, DEFAULT_QUALITY_CONFIG.hero.secondaryCtaLink),
    },
    source: {
      title: str(source.title, DEFAULT_QUALITY_CONFIG.source.title),
      description: str(source.description, DEFAULT_QUALITY_CONFIG.source.description),
      imageUrl: normalizeUploadPublicUrl(str(source.imageUrl, DEFAULT_QUALITY_CONFIG.source.imageUrl)),
      facts: items(source.facts, DEFAULT_QUALITY_CONFIG.source.facts),
    },
    factory: {
      title: str(factory.title, DEFAULT_QUALITY_CONFIG.factory.title),
      description: str(factory.description, DEFAULT_QUALITY_CONFIG.factory.description),
      imageUrl: normalizeUploadPublicUrl(str(factory.imageUrl, DEFAULT_QUALITY_CONFIG.factory.imageUrl)),
      gallery: items(factory.gallery, DEFAULT_QUALITY_CONFIG.factory.gallery),
      steps: items(factory.steps, DEFAULT_QUALITY_CONFIG.factory.steps),
    },
    documents: {
      title: str(documents.title, DEFAULT_QUALITY_CONFIG.documents.title),
      subtitle: str(documents.subtitle, DEFAULT_QUALITY_CONFIG.documents.subtitle),
      items: items(documents.items, DEFAULT_QUALITY_CONFIG.documents.items),
    },
    pvi: {
      title: str(pvi.title, DEFAULT_QUALITY_CONFIG.pvi.title),
      description: str(pvi.description, DEFAULT_QUALITY_CONFIG.pvi.description),
      imageUrl: normalizeUploadPublicUrl(str(pvi.imageUrl, DEFAULT_QUALITY_CONFIG.pvi.imageUrl)),
    },
    policy: {
      title: str(policy.title, DEFAULT_QUALITY_CONFIG.policy.title),
      items: items(policy.items, DEFAULT_QUALITY_CONFIG.policy.items),
    },
    faq: {
      title: str(faq.title, DEFAULT_QUALITY_CONFIG.faq.title),
      items: items(faq.items, DEFAULT_QUALITY_CONFIG.faq.items),
    },
  };
}
