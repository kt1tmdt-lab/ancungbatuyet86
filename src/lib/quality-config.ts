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
    eyebrow: string;
    title: string;
    description: string;
    secondaryDescription: string;
    imageUrl: string;
    videoTitle: string;
    videoUrl: string;
    facts: QualitySimpleItem[];
  };
  factory: {
    eyebrow: string;
    title: string;
    description: string;
    secondaryDescription: string;
    processIntro: string;
    imageUrl: string;
    launchedAt: string;
    address: string;
    stats: QualitySimpleItem[];
    steps: QualitySimpleItem[];
  };
  documents: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: QualitySimpleItem[];
  };
  pvi: {
    eyebrow: string;
    title: string;
    description: string;
    note: string;
    imageUrl: string;
    insuredEntity: string;
    coverageScope: string;
    coveragePeriod: string;
    documentLabel: string;
  };
  policy: {
    eyebrow: string;
    title: string;
    description: string;
    supportTitle: string;
    supportDetails: string;
    items: QualitySimpleItem[];
  };
  closing: {
    title: string;
    description: string;
    primaryText: string;
    primaryLink: string;
    secondaryText: string;
    secondaryLink: string;
  };
  faq: {
    title: string;
    items: QualitySimpleItem[];
  };
};

export const DEFAULT_QUALITY_CONFIG: QualityPageConfig = {
  hero: {
    eyebrow: "Chất lượng sản phẩm",
    title: "Đừng nghe những gì chúng tôi nói — Hãy xem những gì chúng tôi làm",
    subtitle:
      "Mọi thông tin về nguyên liệu, nhà máy và chứng nhận trên trang này đều đi kèm hồ sơ có thể kiểm chứng. Ăn Cùng Bà Tuyết chỉ công bố những gì có tài liệu chứng minh.",
    imageUrl: "/bento/bento-factory.png",
    ctaText: "Xem hồ sơ pháp lý",
    ctaLink: "#ho-so-phap-ly",
    secondaryCtaText: "Tìm điểm bán",
    secondaryCtaLink: "/diem-ban",
  },
  source: {
    eyebrow: "01 · Nguồn nguyên liệu",
    title: "Chân gà nguyên liệu — nhập khẩu 100% từ châu Âu",
    description:
      "Chân gà — nguyên liệu chính của các dòng sản phẩm chủ lực tại Ăn Cùng Bà Tuyết được nhập khẩu 100% từ các nước châu Âu như Ba Lan, Hungary. Mỗi lô nguyên liệu về đến nhà máy đều có đầy đủ chứng nhận xuất xứ (C/O), giấy kiểm dịch thú y và hồ sơ nhập khẩu, được lưu trữ và có thể truy xuất khi cần.",
    secondaryDescription:
      "Nguyên liệu được bảo quản trong hệ thống kho lạnh theo quy chuẩn xuyên suốt từ khi nhập cảng đến khi đưa vào sản xuất.",
    imageUrl: "/bento/bento-ingredients.png",
    videoTitle: "",
    videoUrl: "",
    facts: [
      { id: "source-1", title: "Xuất xứ châu Âu", description: "Chân gà nhập khẩu từ Ba Lan, Hungary và các nước EU — có hồ sơ nhập khẩu theo từng lô." },
      { id: "source-2", title: "C/O & kiểm dịch", description: "Mỗi lô hàng có chứng nhận xuất xứ và giấy kiểm dịch thú y do cơ quan chức năng cấp." },
      { id: "source-3", title: "Bảo quản kho lạnh", description: "Chuỗi lạnh duy trì liên tục từ cảng nhập về đến nhà máy sản xuất." },
      { id: "source-4", title: "Truy xuất theo lô", description: "Thông tin nguồn gốc gắn với từng lô sản xuất, truy xuất được khi có yêu cầu." },
    ],
  },
  factory: {
    eyebrow: "02 · Nhà máy & quy trình",
    title: "Nhà máy sản xuất Chân gà Bà Tuyết tại KCN Sông Công II, Thái Nguyên",
    description:
      "Các sản phẩm chân gà của Ăn Cùng Bà Tuyết được sản xuất tại nhà máy với quy mô khoảng 3.300 m², với các khu vực tách biệt: tiếp nhận nguyên liệu, sơ chế, chế biến, kiểm soát chất lượng, đóng gói và lưu kho.",
    secondaryDescription:
      "Công ty TNHH NMV Food là pháp nhân trực tiếp sản xuất và đứng tên trên các chứng nhận, giấy phép liên quan — bao gồm chứng nhận hệ thống quản lý an toàn thực phẩm ISO 22000:2018.",
    processIntro:
      "Toàn bộ dây chuyền được bố trí liên hoàn trong nhà xưởng khép kín. Các thông số nhiệt độ, thời gian được kiểm soát theo tiêu chuẩn nội bộ; công nhân qua khử trùng và mặc đồ bảo hộ đầy đủ trước khi vào khu sản xuất.",
    imageUrl: "/bento/bento-factory.png",
    launchedAt: "",
    address: "",
    stats: [
      { id: "factory-stat-1", title: "3.300+ m²", description: "Quy mô nhà máy" },
      { id: "factory-stat-2", title: "ISO 22000:2018", description: "Chứng nhận chất lượng" },
      { id: "factory-stat-3", title: "Kiểm nghiệm định kỳ", description: "Sản phẩm kiểm nghiệm bởi đơn vị độc lập" },
    ],
    steps: [
      { id: "step-1", title: "Rã đông & rửa bằng nước RO", description: "Chân gà nhập khẩu được rã đông và rửa bằng nước RO. Nguyên liệu đi qua băng tải để chọn lọc — chân không đạt tiêu chuẩn bị loại ngay từ đầu vào." },
      { id: "step-2", title: "Luộc & làm mát", description: "Luộc theo nhiệt độ và thời gian tiêu chuẩn, sau đó làm mát nhanh bằng nước RO lạnh để giữ độ giòn của da." },
      { id: "step-3", title: "Ngâm gia vị trong phòng lạnh", description: "Ngâm trong nước gia vị pha theo công thức riêng, tại phòng duy trì 14°C, đủ thời gian tiêu chuẩn để gia vị thấm đều." },
      { id: "step-4", title: "Phân loại & đóng gói hút chân không", description: "Chân gà được phân loại theo kích cỡ, sau đó đóng gói bằng máy tự động: cân định lượng, hút chân không và hàn miệng túi." },
      { id: "step-5", title: "Thanh trùng ở nhiệt độ cao", description: "Từng túi sản phẩm được thanh trùng ở nhiệt độ và áp suất cao — công đoạn quyết định độ an toàn và thời hạn sử dụng của sản phẩm." },
      { id: "step-6", title: "Kiểm tra lỗi tự động qua bể rửa", description: "Sản phẩm đi qua bể rửa băng tải: túi nào hở chân không sẽ nổi lên và bị loại khỏi dây chuyền. Đây là lớp kiểm soát tự động giúp phát hiện lỗi bao bì trước khi sấy." },
      { id: "step-7", title: "Sấy khô & lưu kho ổn định", description: "Thành phẩm được sấy khô, sau đó lưu tại kho điều hòa dưới 23°C trong thời gian quy định để sản phẩm ổn định trước khi đóng thùng." },
      { id: "step-8", title: "Kiểm tra cuối & xuất xưởng", description: "Công nhân kiểm tra độ chân không từng túi lần cuối bằng tay — túi lỏng bị loại. Sản phẩm đạt mới được đóng thùng, in đầy đủ NSX/HSD và xuất xưởng." },
    ],
  },
  documents: {
    eyebrow: "03 · Hồ sơ pháp lý",
    title: "Hồ sơ pháp lý & chứng nhận",
    subtitle: "Mỗi chứng nhận dưới đây đều có bản scan đính kèm để khách hàng, đối tác và báo chí có thể kiểm chứng trực tiếp.",
    items: [
      { id: "doc-1", title: "ISO 22000:2018", description: "Hệ thống quản lý an toàn thực phẩm — cấp cho NMV Food.", imageUrl: "" },
      { id: "doc-2", title: "Giấy chứng nhận cơ sở đủ điều kiện ATTP", description: "Do cơ quan quản lý cấp cho cơ sở sản xuất.", imageUrl: "" },
      { id: "doc-3", title: "Phiếu kiểm nghiệm định kỳ", description: "Sản phẩm được kiểm nghiệm định kỳ các chỉ tiêu an toàn thực phẩm bởi đơn vị độc lập.", imageUrl: "" },
      { id: "doc-4", title: "Hồ sơ tự công bố sản phẩm", description: "Hồ sơ tra cứu bản tự công bố của từng SKU chủ lực.", imageUrl: "" },
    ],
  },
  pvi: {
    eyebrow: "04 · Bảo hiểm trách nhiệm sản phẩm",
    title: "Bảo hiểm trách nhiệm sản phẩm — PVI",
    description:
      "Sản phẩm của Ăn Cùng Bà Tuyết được mua bảo hiểm trách nhiệm sản phẩm tại Tổng công ty Bảo hiểm PVI. Trong trường hợp sản phẩm gây thiệt hại cho người tiêu dùng thuộc phạm vi hợp đồng bảo hiểm, đơn vị bảo hiểm tham gia trách nhiệm bồi thường theo quy định.",
    note:
      "Bảo hiểm trách nhiệm sản phẩm là một lớp bảo vệ bổ sung cho người tiêu dùng — không thay thế chứng nhận chất lượng, phiếu kiểm nghiệm hay trách nhiệm trực tiếp của đơn vị sản xuất và kinh doanh.",
    imageUrl: "/bento/bento-insurance.png",
    insuredEntity: "",
    coverageScope: "",
    coveragePeriod: "",
    documentLabel: "",
  },
  policy: {
    eyebrow: "05 · Quyền lợi khách hàng",
    title: "Khi có vấn đề, khách hàng được bảo vệ thế nào",
    description:
      "Ăn Cùng Bà Tuyết cam kết mọi phản ánh về sản phẩm đều có kênh tiếp nhận rõ ràng, quy trình xử lý cụ thể và thời hạn phản hồi công khai.",
    supportTitle: "Kênh hỗ trợ khách hàng",
    supportDetails:
      "Hotline 0989 852 948 · cskh@ancungbatuyet.vn · T2–T7, 8:00–17:00",
    items: [
      { id: "policy-1", title: "Quyền được thông tin", description: "Mọi sản phẩm ghi rõ thành phần, ngày sản xuất, hạn sử dụng và thông tin nhà sản xuất trên bao bì." },
      { id: "policy-2", title: "Quyền đổi trả", description: "Sản phẩm lỗi do sản xuất hoặc vận chuyển được đổi trả theo chính sách công bố." },
      { id: "policy-3", title: "Quyền khiếu nại", description: "Phản ánh được tiếp nhận qua hotline, email và fanpage chính thức, phản hồi trong 24 giờ làm việc." },
      { id: "policy-4", title: "Bảo hiểm trách nhiệm sản phẩm", description: "Người tiêu dùng được bảo vệ thêm một lớp qua hợp đồng bảo hiểm trách nhiệm sản phẩm với PVI." },
    ],
  },
  closing: {
    title: "Xem sản phẩm và tìm điểm bán chính thức",
    description:
      "Sau khi đã hiểu về quy trình và hồ sơ chất lượng, mời bạn khám phá các sản phẩm của Ăn Cùng Bà Tuyết tại kênh phân phối chính thức gần nhất.",
    primaryText: "Tìm điểm bán gần nhất",
    primaryLink: "/diem-ban",
    secondaryText: "Xem sản phẩm",
    secondaryLink: "/san-pham",
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

const LEGACY_QUALITY_COPY = new Set([
  "Năng lực sản xuất rõ ràng trước khi nói về bán hàng",
  "Nguyên liệu nhập khẩu từ châu Âu — có truy xuất",
  "Nhà máy sản xuất NMV Food — Thái Nguyên",
  "Khách hàng cần biết mình được bảo vệ thế nào",
]);

const INTERNAL_COPY_MARKERS = [
  "khi công bố claim",
  "ghi đúng chủ thể",
  "không ghi thành acbt",
  "không trình bày như",
  "cần bổ sung",
  "cần xác nhận",
  "chỉ hiển thị sau khi",
  "không sử dụng tuyên bố",
];

function publicStr(value: unknown, fallback: string) {
  const candidate = str(value, fallback).trim();
  const normalized = candidate.toLocaleLowerCase("vi");
  if (
    LEGACY_QUALITY_COPY.has(candidate) ||
    INTERNAL_COPY_MARKERS.some((marker) => normalized.includes(marker))
  ) {
    return fallback;
  }
  return candidate || fallback;
}

function item(value: unknown, fallback: QualitySimpleItem): QualitySimpleItem {
  const raw = asRecord(value);
  return {
    id: str(raw.id, fallback.id),
    title: publicStr(raw.title, fallback.title),
    description: publicStr(raw.description, fallback.description),
    imageUrl: normalizeUploadPublicUrl(str(raw.imageUrl, fallback.imageUrl || "")),
  };
}

function items(value: unknown, fallback: QualitySimpleItem[]) {
  if (!Array.isArray(value)) return fallback;
  return value.map((entry, index) => item(entry, fallback[index] || { id: `item-${index}`, title: "", description: "" }));
}

function completeItems(
  value: unknown,
  fallback: QualitySimpleItem[],
  expectedLength: number,
) {
  if (!Array.isArray(value) || value.length !== expectedLength) return fallback;
  return items(value, fallback);
}

export function normalizeQualityConfig(input: unknown): QualityPageConfig {
  const raw = asRecord(input);
  const hero = asRecord(raw.hero);
  const source = asRecord(raw.source);
  const factory = asRecord(raw.factory);
  const documents = asRecord(raw.documents);
  const pvi = asRecord(raw.pvi);
  const policy = asRecord(raw.policy);
  const closing = asRecord(raw.closing);
  const faq = asRecord(raw.faq);

  return {
    hero: {
      eyebrow: publicStr(hero.eyebrow, DEFAULT_QUALITY_CONFIG.hero.eyebrow),
      title: publicStr(hero.title, DEFAULT_QUALITY_CONFIG.hero.title),
      subtitle: publicStr(hero.subtitle, DEFAULT_QUALITY_CONFIG.hero.subtitle),
      imageUrl: normalizeUploadPublicUrl(str(hero.imageUrl, DEFAULT_QUALITY_CONFIG.hero.imageUrl)),
      ctaText: publicStr(hero.ctaText, DEFAULT_QUALITY_CONFIG.hero.ctaText),
      ctaLink: str(hero.ctaLink, DEFAULT_QUALITY_CONFIG.hero.ctaLink),
      secondaryCtaText:
        str(hero.secondaryCtaText, "") === "Xem sản phẩm"
          ? DEFAULT_QUALITY_CONFIG.hero.secondaryCtaText
          : publicStr(
              hero.secondaryCtaText,
              DEFAULT_QUALITY_CONFIG.hero.secondaryCtaText,
            ),
      secondaryCtaLink:
        str(hero.secondaryCtaLink, "") === "/san-pham"
          ? DEFAULT_QUALITY_CONFIG.hero.secondaryCtaLink
          : str(
              hero.secondaryCtaLink,
              DEFAULT_QUALITY_CONFIG.hero.secondaryCtaLink,
            ),
    },
    source: {
      eyebrow: publicStr(source.eyebrow, DEFAULT_QUALITY_CONFIG.source.eyebrow),
      title: publicStr(source.title, DEFAULT_QUALITY_CONFIG.source.title),
      description: publicStr(source.description, DEFAULT_QUALITY_CONFIG.source.description),
      secondaryDescription: publicStr(
        source.secondaryDescription,
        DEFAULT_QUALITY_CONFIG.source.secondaryDescription,
      ),
      imageUrl: normalizeUploadPublicUrl(str(source.imageUrl, DEFAULT_QUALITY_CONFIG.source.imageUrl)),
      videoTitle: str(source.videoTitle, DEFAULT_QUALITY_CONFIG.source.videoTitle),
      videoUrl: str(source.videoUrl, DEFAULT_QUALITY_CONFIG.source.videoUrl),
      facts: completeItems(
        source.facts,
        DEFAULT_QUALITY_CONFIG.source.facts,
        DEFAULT_QUALITY_CONFIG.source.facts.length,
      ),
    },
    factory: {
      eyebrow: publicStr(factory.eyebrow, DEFAULT_QUALITY_CONFIG.factory.eyebrow),
      title: publicStr(factory.title, DEFAULT_QUALITY_CONFIG.factory.title),
      description: publicStr(factory.description, DEFAULT_QUALITY_CONFIG.factory.description),
      secondaryDescription: publicStr(
        factory.secondaryDescription,
        DEFAULT_QUALITY_CONFIG.factory.secondaryDescription,
      ),
      processIntro: publicStr(
        factory.processIntro,
        DEFAULT_QUALITY_CONFIG.factory.processIntro,
      ),
      imageUrl: normalizeUploadPublicUrl(str(factory.imageUrl, DEFAULT_QUALITY_CONFIG.factory.imageUrl)),
      launchedAt: str(factory.launchedAt, DEFAULT_QUALITY_CONFIG.factory.launchedAt),
      address: str(factory.address, DEFAULT_QUALITY_CONFIG.factory.address),
      stats: completeItems(
        factory.stats,
        DEFAULT_QUALITY_CONFIG.factory.stats,
        DEFAULT_QUALITY_CONFIG.factory.stats.length,
      ),
      steps: completeItems(
        factory.steps,
        DEFAULT_QUALITY_CONFIG.factory.steps,
        DEFAULT_QUALITY_CONFIG.factory.steps.length,
      ),
    },
    documents: {
      eyebrow: publicStr(documents.eyebrow, DEFAULT_QUALITY_CONFIG.documents.eyebrow),
      title: publicStr(documents.title, DEFAULT_QUALITY_CONFIG.documents.title),
      subtitle: publicStr(documents.subtitle, DEFAULT_QUALITY_CONFIG.documents.subtitle),
      items:
        Array.isArray(documents.items) &&
        documents.items.some(
          (entry) => asRecord(entry).title === "HACCP",
        )
          ? DEFAULT_QUALITY_CONFIG.documents.items
          : completeItems(
              documents.items,
              DEFAULT_QUALITY_CONFIG.documents.items,
              DEFAULT_QUALITY_CONFIG.documents.items.length,
            ),
    },
    pvi: {
      eyebrow: publicStr(pvi.eyebrow, DEFAULT_QUALITY_CONFIG.pvi.eyebrow),
      title: publicStr(pvi.title, DEFAULT_QUALITY_CONFIG.pvi.title),
      description: publicStr(pvi.description, DEFAULT_QUALITY_CONFIG.pvi.description),
      note: publicStr(pvi.note, DEFAULT_QUALITY_CONFIG.pvi.note),
      imageUrl: normalizeUploadPublicUrl(str(pvi.imageUrl, DEFAULT_QUALITY_CONFIG.pvi.imageUrl)),
      insuredEntity: str(pvi.insuredEntity, DEFAULT_QUALITY_CONFIG.pvi.insuredEntity),
      coverageScope: str(pvi.coverageScope, DEFAULT_QUALITY_CONFIG.pvi.coverageScope),
      coveragePeriod: str(pvi.coveragePeriod, DEFAULT_QUALITY_CONFIG.pvi.coveragePeriod),
      documentLabel: str(pvi.documentLabel, DEFAULT_QUALITY_CONFIG.pvi.documentLabel),
    },
    policy: {
      eyebrow: publicStr(policy.eyebrow, DEFAULT_QUALITY_CONFIG.policy.eyebrow),
      title: publicStr(policy.title, DEFAULT_QUALITY_CONFIG.policy.title),
      description: publicStr(
        policy.description,
        DEFAULT_QUALITY_CONFIG.policy.description,
      ),
      supportTitle: publicStr(
        policy.supportTitle,
        DEFAULT_QUALITY_CONFIG.policy.supportTitle,
      ),
      supportDetails: publicStr(
        policy.supportDetails,
        DEFAULT_QUALITY_CONFIG.policy.supportDetails,
      ),
      items: completeItems(
        policy.items,
        DEFAULT_QUALITY_CONFIG.policy.items,
        DEFAULT_QUALITY_CONFIG.policy.items.length,
      ),
    },
    closing: {
      title: publicStr(closing.title, DEFAULT_QUALITY_CONFIG.closing.title),
      description: publicStr(
        closing.description,
        DEFAULT_QUALITY_CONFIG.closing.description,
      ),
      primaryText: publicStr(
        closing.primaryText,
        DEFAULT_QUALITY_CONFIG.closing.primaryText,
      ),
      primaryLink: str(
        closing.primaryLink,
        DEFAULT_QUALITY_CONFIG.closing.primaryLink,
      ),
      secondaryText: publicStr(
        closing.secondaryText,
        DEFAULT_QUALITY_CONFIG.closing.secondaryText,
      ),
      secondaryLink: str(
        closing.secondaryLink,
        DEFAULT_QUALITY_CONFIG.closing.secondaryLink,
      ),
    },
    faq: {
      title: str(faq.title, DEFAULT_QUALITY_CONFIG.faq.title),
      items: items(faq.items, DEFAULT_QUALITY_CONFIG.faq.items),
    },
  };
}
