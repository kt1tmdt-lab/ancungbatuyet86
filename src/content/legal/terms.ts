import type { BilingualLegalDocument } from "@/lib/legal-documents";
import { COMPANY } from "./company";

/**
 * Nội dung Điều khoản sử dụng, viết chung cho mọi nền tảng bên thứ ba
 * (TikTok, TikTok Shop, Shopee, Lazada, Facebook, Google...).
 * Tên công ty lấy từ ./company.ts.
 */
const terms: BilingualLegalDocument = {
  en: {
    title: "Terms of Service – ACBT Data Hub and acbt.vn",
    intro: ["Effective date: 09/11/2026"],
    sections: [
      {
        heading: "1. Acceptance",
        blocks: [
          `By using https://acbt.vn or ACBT Data Hub, operated by ${COMPANY.nameEn} ("we", "us"), you agree to these Terms. If you do not agree, do not use our services.`,
        ],
      },
      {
        heading: "2. The service",
        blocks: [
          `acbt.vn provides information about the Ăn Cùng Bà Tuyết brand and its products. ACBT Data Hub is an internal analytics tool that, with your authorization, reads data from accounts on third-party platforms such as TikTok, TikTok Shop, Shopee, Lazada, Facebook and Google (together, the "Platforms") that are owned by or connected to us, and displays it to our authorized staff.`,
        ],
      },
      {
        heading: "3. Connecting a Platform account",
        blocks: [
          "You connect an account only by signing in through the relevant Platform and approving the permissions shown. You confirm that you own the account or are authorized to connect it. You may disconnect at any time from the dashboard or in that Platform's settings.",
        ],
      },
      {
        heading: "4. Acceptable use",
        blocks: [
          "You must not misuse the service, attempt unauthorized access, interfere with its operation, or use it in violation of law or of the terms and policies of any Platform.",
        ],
      },
      {
        heading: "5. Third-party services",
        blocks: [
          "The service relies on the APIs of the Platforms. Your use of each Platform remains subject to that Platform's own terms and privacy policy. We are not responsible for the availability or changes of the Platforms' services.",
        ],
      },
      {
        heading: "6. Intellectual property",
        blocks: [
          "The Ăn Cùng Bà Tuyết name, logo and website content belong to us. Content from Platform accounts remains the property of its owners.",
        ],
      },
      {
        heading: "7. Privacy",
        blocks: [
          "Our handling of personal data is described in our Privacy Policy at https://acbt.vn/privacy-policy.",
        ],
      },
      {
        heading: "8. Disclaimer and liability",
        blocks: [
          `The service is provided "as is". To the extent permitted by law, we are not liable for indirect or consequential losses arising from its use.`,
        ],
      },
      {
        heading: "9. Changes and termination",
        blocks: [
          "We may update these Terms or suspend the service at any time. Updated Terms are posted on this page.",
        ],
      },
      {
        heading: "10. Governing law",
        blocks: [
          "These Terms are governed by the laws of Vietnam. Disputes are resolved by the competent courts in Hanoi.",
        ],
      },
      {
        heading: "11. Contact",
        blocks: [`${COMPANY.nameEn} – gdtruyenthong@acbt.vn – 024 8388 9679`],
      },
    ],
  },
  vi: {
    title: "Điều khoản sử dụng – ACBT Data Hub và acbt.vn",
    intro: ["Ngày hiệu lực: 09/11/2026"],
    sections: [
      {
        heading: "1. Chấp thuận",
        blocks: [
          `Khi sử dụng https://acbt.vn hoặc ACBT Data Hub do ${COMPANY.nameVi} vận hành, bạn đồng ý với các điều khoản này. Nếu không đồng ý, vui lòng không sử dụng.`,
        ],
      },
      {
        heading: "2. Dịch vụ",
        blocks: [
          `acbt.vn cung cấp thông tin về thương hiệu và sản phẩm Ăn Cùng Bà Tuyết. ACBT Data Hub là công cụ phân tích nội bộ: khi được bạn cấp quyền, công cụ đọc dữ liệu từ các tài khoản trên nền tảng bên thứ ba như TikTok, TikTok Shop, Shopee, Lazada, Facebook và Google (gọi chung là "Nền tảng") thuộc hoặc kết nối với công ty, và hiển thị cho nhân viên được phân quyền.`,
        ],
      },
      {
        heading: "3. Kết nối tài khoản Nền tảng",
        blocks: [
          "Bạn chỉ kết nối bằng cách đăng nhập qua Nền tảng tương ứng và chấp thuận các quyền được hiển thị. Bạn xác nhận mình là chủ hoặc được ủy quyền kết nối tài khoản đó. Bạn có thể ngắt kết nối bất cứ lúc nào trên dashboard hoặc trong cài đặt của Nền tảng đó.",
        ],
      },
      {
        heading: "4. Sử dụng hợp lệ",
        blocks: [
          "Không lạm dụng dịch vụ, truy cập trái phép, cản trở hoạt động, hoặc sử dụng trái pháp luật hay trái điều khoản, chính sách của bất kỳ Nền tảng nào.",
        ],
      },
      {
        heading: "5. Dịch vụ bên thứ ba",
        blocks: [
          "Dịch vụ dựa trên API của các Nền tảng. Việc bạn dùng mỗi Nền tảng vẫn tuân theo điều khoản và chính sách bảo mật riêng của Nền tảng đó. Chúng tôi không chịu trách nhiệm về tính sẵn sàng hay thay đổi của dịch vụ các Nền tảng.",
        ],
      },
      {
        heading: "6. Sở hữu trí tuệ",
        blocks: [
          "Tên, logo Ăn Cùng Bà Tuyết và nội dung website thuộc về công ty. Nội dung trên các tài khoản Nền tảng thuộc về chủ sở hữu tương ứng.",
        ],
      },
      {
        heading: "7. Bảo mật",
        blocks: [
          "Cách xử lý dữ liệu cá nhân được nêu tại Chính sách bảo mật https://acbt.vn/privacy-policy.",
        ],
      },
      {
        heading: "8. Miễn trừ và giới hạn trách nhiệm",
        blocks: [
          `Dịch vụ được cung cấp "nguyên trạng". Trong phạm vi pháp luật cho phép, chúng tôi không chịu trách nhiệm về thiệt hại gián tiếp phát sinh từ việc sử dụng.`,
        ],
      },
      {
        heading: "9. Thay đổi và chấm dứt",
        blocks: [
          "Chúng tôi có thể cập nhật điều khoản hoặc tạm ngưng dịch vụ bất cứ lúc nào. Bản cập nhật được đăng tại trang này.",
        ],
      },
      {
        heading: "10. Luật áp dụng",
        blocks: [
          "Điều khoản tuân theo pháp luật Việt Nam. Tranh chấp được giải quyết tại tòa án có thẩm quyền tại Hà Nội.",
        ],
      },
      {
        heading: "11. Liên hệ",
        blocks: [`${COMPANY.nameVi} – gdtruyenthong@acbt.vn – 024 8388 9679`],
      },
    ],
  },
};

export default terms;
