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
      "Nguyên liệu, nhà máy, chứng nhận và bảo hiểm được trình bày rõ ràng để khách hàng và đối tác có thêm cơ sở kiểm tra.",
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
      { id: "source-1", title: "Ba Lan, Hungary", description: "Nguồn nguyên liệu được trình bày theo hồ sơ xuất xứ và kiểm dịch." },
      { id: "source-2", title: "C/O & kiểm dịch", description: "Thông tin xuất xứ và kiểm dịch là cơ sở để kiểm tra nguồn nguyên liệu." },
      { id: "source-3", title: "Kho lạnh", description: "Lưu kho lạnh theo quy chuẩn vận hành để giữ chất lượng ổn định." },
    ],
  },
  factory: {
    title: "Nhà máy sản xuất NMV Food — Thái Nguyên",
    description:
      "Ghi đúng chủ thể: NMV Food đạt chứng nhận ISO 22000:2018. Không ghi thành ACBT nếu hồ sơ không thể hiện như vậy. Sử dụng cách diễn đạt trung tính như “quy trình 6 bước có kiểm soát”.",
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
    subtitle: "Các hồ sơ pháp lý, kiểm nghiệm và chứng nhận được trình bày để khách hàng, đối tác có thêm cơ sở đánh giá.",
    items: [
      { id: "doc-1", title: "ISO 22000:2018", description: "Chứng nhận ISO 22000:2018 cấp cho NMV Food trong hệ thống quản lý an toàn thực phẩm.", imageUrl: "/bento/bento-factory.png" },
      { id: "doc-2", title: "HACCP", description: "Chương trình đào tạo và kiểm soát theo nguyên tắc HACCP tại NMV Food.", imageUrl: "/bento/bento-insurance.png" },
      { id: "doc-3", title: "Giấy phép ATTP", description: "Giấy đủ điều kiện an toàn thực phẩm cho hoạt động sản xuất, kinh doanh liên quan.", imageUrl: "/bento/bento-ingredients.png" },
      { id: "doc-4", title: "Phiếu kiểm nghiệm", description: "Kiểm nghiệm định kỳ là cơ sở theo dõi chất lượng sản phẩm theo từng giai đoạn.", imageUrl: "/bento/bento-tiktok.png" },
    ],
  },
  pvi: {
    title: "Bảo hiểm trách nhiệm sản phẩm — PVI",
    description:
      "Bảo hiểm trách nhiệm sản phẩm do PVI cung cấp được trình bày theo phạm vi hợp đồng. Không trình bày như PVI trực tiếp kiểm nghiệm hoặc xác nhận chất lượng sản phẩm.",
    imageUrl: "/bento/bento-insurance.png",
  },
  policy: {
    title: "Khách hàng cần biết mình được bảo vệ thế nào",
    items: [
      { id: "policy-1", title: "Quyền được thông tin", description: "Sản phẩm cần ghi rõ thành phần, NSX, HSD và thông tin nhận diện." },
      { id: "policy-2", title: "Quyền đổi trả", description: "Có quy trình đổi trả khi sản phẩm lỗi theo chính sách CSKH." },
      { id: "policy-3", title: "Quyền khiếu nại", description: "Có kênh tiếp nhận và thời gian xử lý phản hồi." },
      { id: "policy-4", title: "Bảo hiểm trách nhiệm sản phẩm", description: "Quyền lợi bảo hiểm được xem xét theo pháp nhân, sản phẩm, thời hạn và điều kiện cụ thể của hợp đồng." },
      { id: "policy-5", title: "Kênh hỗ trợ", description: "Hotline, email và thời gian làm việc được công bố để khách hàng liên hệ khi cần." },
    ],
  },
  faq: {
    title: "Những câu dễ bị hỏi nhất phải trả lời gọn và chắc",
    items: [
      { id: "faq-1", title: "ACBT có tự tuyên bố chất lượng không?", description: "Không nên. Trang này ưu tiên để bên thứ ba và hồ sơ nói thay." },
      { id: "faq-2", title: "Khách hàng nên xem hồ sơ nào?", description: "Ưu tiên xem nguồn nguyên liệu, nhà máy, chứng nhận, kiểm nghiệm và chính sách bảo vệ quyền lợi khách hàng." },
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
