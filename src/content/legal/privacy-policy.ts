import type { BilingualLegalDocument } from "@/lib/legal-documents";
import { COMPANY } from "./company";

/**
 * Nội dung Chính sách bảo mật, viết chung cho mọi nền tảng bên thứ ba
 * (TikTok, TikTok Shop, Shopee, Lazada, Facebook, Google...).
 * Tên công ty và mã số thuế lấy từ ./company.ts.
 */
const privacyPolicy: BilingualLegalDocument = {
  en: {
    title: "Privacy Policy – ACBT Data Hub and acbt.vn",
    intro: ["Effective date: 09/11/2026"],
    sections: [
      {
        heading: "1. Who we are",
        blocks: [
          `This policy is issued by ${COMPANY.nameEn} ("we", "us"), tax code ${COMPANY.taxCode}, Lot 5 – CN6, Tu Liem Industrial Cluster, Xuan Phuong Ward, Hanoi, Vietnam, owner of the Ăn Cùng Bà Tuyết brand. It covers our website https://acbt.vn and ACBT Data Hub, our internal tool that connects to third-party platforms such as TikTok, TikTok Shop, Shopee, Lazada, Facebook and Google (together, the "Platforms").`,
        ],
      },
      {
        heading: "2. Data we collect",
        blocks: [
          {
            list: [
              "From social and video Platforms (for example TikTok, Facebook, YouTube), when you authorize our app: your account ID, display name, avatar, public profile information, follower and like counts, and the list of your public content with its view, like, comment and share counts.",
              "From e-commerce Platforms where we operate our own shops (for example TikTok Shop, Shopee, Lazada): order, product, inventory, fulfillment, return and settlement data. Buyer contact details are processed only when needed to deliver orders.",
              "From advertising Platforms, for our own ad accounts (for example TikTok for Business, Meta, Google Ads): campaign, ad and performance reporting data.",
              "From website visitors: information you submit in contact or partnership forms, and basic technical data such as IP address and browser type.",
            ],
          },
          "We only access the data that each Platform makes available and that you or we have authorized.",
        ],
      },
      {
        heading: "3. How we use data",
        blocks: [
          "We use this data only to: run internal performance reports and dashboards; manage orders, stock and payments; respond to customer and partner requests; and keep our systems secure. We use data from each Platform in line with that Platform's terms and developer policies. We do not use Platform data for advertising profiling, and we do not sell any personal data.",
        ],
      },
      {
        heading: "4. Sharing",
        blocks: [
          "We do not share data with third parties, except with hosting and infrastructure providers that process it on our behalf under confidentiality obligations, or when required by law.",
        ],
      },
      {
        heading: "5. Storage and security",
        blocks: [
          "Data is stored on servers controlled by us or our hosting provider, encrypted in transit (HTTPS), and accessible only to authorized staff. Platform data is refreshed regularly and kept only as long as needed for the purposes above.",
        ],
      },
      {
        heading: "6. Retention and deletion",
        blocks: [
          "If you disconnect your account on any Platform from our app, or revoke access in that Platform's settings, we delete the data received from that Platform about you within 30 days. You can also request deletion at any time by emailing us.",
        ],
      },
      {
        heading: "7. Your rights",
        blocks: [
          "You may request access to, correction of, or deletion of your personal data, or withdraw your consent, by contacting gdtruyenthong@acbt.vn. We will respond within the time required by applicable Vietnamese law.",
        ],
      },
      {
        heading: "8. Children",
        blocks: [
          "Our services are not directed to persons under 18, and we do not knowingly collect their data.",
        ],
      },
      {
        heading: "9. Changes",
        blocks: [
          "We may update this policy and will post the new version on this page with a new effective date.",
        ],
      },
      {
        heading: "10. Contact",
        blocks: [
          `${COMPANY.nameEn}
Email: gdtruyenthong@acbt.vn
Phone: 024 8388 9679
Address: Lot 5 – CN6, Tu Liem Industrial Cluster, Xuan Phuong Ward, Hanoi, Vietnam`,
        ],
      },
    ],
  },
  vi: {
    title: "Chính sách bảo mật – ACBT Data Hub và acbt.vn",
    intro: ["Ngày hiệu lực: 09/11/2026"],
    sections: [
      {
        heading: "1. Chúng tôi là ai",
        blocks: [
          `Chính sách này do ${COMPANY.nameVi} ("chúng tôi") ban hành, mã số thuế ${COMPANY.taxCode}, địa chỉ Lô 5 – CN6, Cụm Công nghiệp Từ Liêm, Phường Xuân Phương, TP Hà Nội, chủ sở hữu thương hiệu Ăn Cùng Bà Tuyết. Chính sách áp dụng cho website https://acbt.vn và ACBT Data Hub, công cụ nội bộ kết nối với các nền tảng bên thứ ba như TikTok, TikTok Shop, Shopee, Lazada, Facebook và Google (gọi chung là "Nền tảng").`,
        ],
      },
      {
        heading: "2. Dữ liệu thu thập",
        blocks: [
          {
            list: [
              "Từ các Nền tảng mạng xã hội và video (ví dụ TikTok, Facebook, YouTube), khi bạn cấp quyền cho app: ID tài khoản, tên hiển thị, ảnh đại diện, thông tin hồ sơ công khai, số người theo dõi và lượt thích, danh sách nội dung công khai kèm lượt xem, thích, bình luận, chia sẻ.",
              "Từ các Nền tảng thương mại điện tử nơi công ty mở gian hàng (ví dụ TikTok Shop, Shopee, Lazada): dữ liệu đơn hàng, sản phẩm, tồn kho, giao vận, hoàn hàng và đối soát. Thông tin liên hệ người mua chỉ được xử lý khi cần để giao hàng.",
              "Từ các Nền tảng quảng cáo, với tài khoản quảng cáo của công ty (ví dụ TikTok for Business, Meta, Google Ads): dữ liệu chiến dịch, quảng cáo và báo cáo hiệu suất.",
              "Từ khách truy cập website: thông tin bạn gửi qua form liên hệ hoặc hợp tác, và dữ liệu kỹ thuật cơ bản như địa chỉ IP, loại trình duyệt.",
            ],
          },
          "Chúng tôi chỉ truy cập dữ liệu mà từng Nền tảng cho phép và đã được bạn hoặc chúng tôi cấp quyền.",
        ],
      },
      {
        heading: "3. Mục đích sử dụng",
        blocks: [
          "Chỉ để: lập báo cáo và dashboard hiệu suất nội bộ; quản lý đơn hàng, tồn kho, thanh toán; phản hồi khách hàng và đối tác; bảo mật hệ thống. Dữ liệu từ mỗi Nền tảng được sử dụng theo điều khoản và chính sách dành cho nhà phát triển của Nền tảng đó. Chúng tôi không dùng dữ liệu từ các Nền tảng để lập hồ sơ quảng cáo và không bán dữ liệu cá nhân.",
        ],
      },
      {
        heading: "4. Chia sẻ",
        blocks: [
          "Không chia sẻ cho bên thứ ba, trừ nhà cung cấp hosting, hạ tầng xử lý thay mặt chúng tôi với nghĩa vụ bảo mật, hoặc khi pháp luật yêu cầu.",
        ],
      },
      {
        heading: "5. Lưu trữ và bảo mật",
        blocks: [
          "Dữ liệu lưu trên máy chủ do chúng tôi hoặc nhà cung cấp hosting quản lý, mã hóa khi truyền (HTTPS), chỉ nhân viên được phân quyền truy cập. Dữ liệu từ các Nền tảng được cập nhật định kỳ và chỉ lưu trong thời gian cần thiết.",
        ],
      },
      {
        heading: "6. Thời hạn lưu và xóa",
        blocks: [
          "Khi bạn ngắt kết nối tài khoản trên bất kỳ Nền tảng nào khỏi app, hoặc thu hồi quyền trong cài đặt của Nền tảng đó, chúng tôi xóa dữ liệu nhận từ Nền tảng đó về bạn trong vòng 30 ngày. Bạn cũng có thể yêu cầu xóa bất cứ lúc nào qua email.",
        ],
      },
      {
        heading: "7. Quyền của bạn",
        blocks: [
          "Bạn có quyền yêu cầu truy cập, chỉnh sửa, xóa dữ liệu cá nhân hoặc rút lại sự đồng ý bằng cách liên hệ gdtruyenthong@acbt.vn. Chúng tôi phản hồi trong thời hạn pháp luật Việt Nam quy định.",
        ],
      },
      {
        heading: "8. Trẻ em",
        blocks: [
          "Dịch vụ không dành cho người dưới 18 tuổi và chúng tôi không chủ động thu thập dữ liệu của họ.",
        ],
      },
      {
        heading: "9. Thay đổi",
        blocks: [
          "Chúng tôi có thể cập nhật chính sách và sẽ đăng phiên bản mới tại trang này kèm ngày hiệu lực mới.",
        ],
      },
      {
        heading: "10. Liên hệ",
        blocks: [
          `${COMPANY.nameVi}
Email: gdtruyenthong@acbt.vn
Điện thoại: 024 8388 9679
Địa chỉ: Lô 5 – CN6, Cụm Công nghiệp Từ Liêm, Phường Xuân Phương, TP Hà Nội`,
        ],
      },
    ],
  },
};

export default privacyPolicy;
