import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Paytone_One } from "next/font/google";
import Image from "next/image";
import { Clapperboard, Crown, Sofa, TriangleAlert } from "lucide-react";
import DeadlineCountdown from "./DeadlineCountdown";
import "./tuyen-thuong-de.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const paytoneOne = Paytone_One({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  display: "swap",
  variable: "--font-display",
});

const ASSETS = "/tuyen-thuong-de";
const PACK_CHAN_GA = `${ASSETS}/pack-chan-ga.webp`;
const PACK_CHAN_GA_KL = `${ASSETS}/pack-chan-ga-kl.webp`;
const PACK_MAI_TON = `${ASSETS}/pack-mai-ton.webp`;
const PACK_TAM_CAY = `${ASSETS}/pack-tam-cay.webp`;
const HASHTAG = "#BaTuyetTuyenThuongDe";

const RULE_TITLES = [
  "Đơn vị tổ chức",
  "Nội dung chương trình",
  "Thời gian",
  "Đối tượng tham gia",
  "Cách ứng tuyển",
  "Yêu cầu với video ứng tuyển",
  "Quy trình và tiêu chí tuyển chọn",
  "Quyền lợi",
  "Quyền sử dụng video ứng tuyển",
  "Thông tin cá nhân",
  "Trường hợp không xét hoặc hủy kết quả",
  "Điều khoản chung",
];

const LOGO = "/tuyen-thuong-de/logo.png";
const OG_TITLE = "Bà Tuyết Tuyển Thượng Đế";
const OG_DESCRIPTION =
  "Thực nhận 26 triệu cho tháng 12. Việc duy nhất: không làm việc. Nộp đơn bằng video TikTok trước 23h59 ngày 22/11/2026.";

export const metadata: Metadata = {
  title: { absolute: "Bà Tuyết Tuyển Thượng Đế · Ăn Cùng Bà Tuyết" },
  description:
    "Bà Tuyết tuyển thật 01 Thượng Đế cho tháng 12/2026. Thực nhận 26 triệu, việc duy nhất là không làm việc. Nộp đơn bằng video TikTok gắn #BaTuyetTuyenThuongDe trước 23h59 ngày 22/11/2026.",
  alternates: { canonical: "https://acbt.vn/tuyen-thuong-de" },
  icons: { icon: LOGO, apple: LOGO },
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    url: "https://acbt.vn/tuyen-thuong-de",
    siteName: "Ăn Cùng Bà Tuyết",
    images: [
      {
        url: "https://acbt.vn/logo-acbt.png",
        width: 1080,
        height: 1080,
        alt: "Logo Ăn Cùng Bà Tuyết",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#EE6624",
};

export default function TuyenThuongDePage() {
  return (
    <div className={`ttd ${beVietnamPro.className} ${paytoneOne.variable}`}>
      <header className="top">
        <div className="wrap">
          <a href="#top" className="logo" aria-label="Ăn Cùng Bà Tuyết">
            <Image src={LOGO} alt="" width={46} height={46} />
          </a>
          <nav>
            <a href="#cach-ung-tuyen">Ứng tuyển</a>
            <a href="#lich">Lịch</a>
            <a href="#the-le">Thể lệ</a>
            <a className="cta" href="#cach-ung-tuyen">
              Nộp đơn
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        <div className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
            <span className="tag">Tin tuyển dụng thật</span>
            <h1>
              Bà Tuyết tuyển<span>Thượng Đế</span>
            </h1>
            <p className="sub">
              Làm gì cũng được.
              <br />
              <b>Miễn là đừng làm việc.</b>
            </p>
            <div className="facts">
              <div className="fact">
                <div className="n">01</div>
                <div className="l">người</div>
              </div>
              <div className="fact">
                <div className="n">26 triệu</div>
                <div className="l">thực nhận</div>
              </div>
              <div className="fact">
                <div className="n">T12</div>
                <div className="l">năm 2026</div>
              </div>
            </div>
            <a className="btn" href="#cach-ung-tuyen">
              Nộp đơn bằng video →
            </a>
            <DeadlineCountdown />
            </div>
            <div className="hero-art">
              <Image className="pack p1" src={PACK_CHAN_GA_KL} alt="" width={560} height={647} sizes="150px" />
              <Image
                className="ba"
                src={`${ASSETS}/ba-tuyet.webp`}
                alt="Bà Tuyết cười tươi, giơ ngón tay cái"
                width={1100}
                height={1218}
                sizes="(max-width: 820px) 340px, 520px"
                priority
              />
              <Image className="pack p2" src={PACK_CHAN_GA} alt="" width={560} height={754} sizes="150px" />
              <Image className="pack p3" src={PACK_MAI_TON} alt="" width={560} height={616} sizes="130px" />
            </div>
          </div>
        </div>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i}>{HASHTAG}</span>
            ))}
          </div>
        </div>

        <section>
          <div className="wrap">
            <div className="kicker">Hiểu nhanh trong 10 giây</div>
            <h2>
              Làm Thượng Đế nhà Bà Tuyết là <em>làm gì?</em>
            </h2>
            <p className="lead">
              Tại Ăn Cùng Bà Tuyết, khách hàng là trung tâm. Bà Tuyết tuyển 01 người làm Thượng Đế để cả công ty phục vụ trong tháng 12.
            </p>
            <div className="cards">
              <div className="card c1">
                <div className="ic">
                  <Sofa size={28} aria-hidden="true" />
                </div>
                <h3>Mô tả công việc</h3>
                <ul>
                  <li>Không làm gì cả</li>
                  <li>Ăn vặt, ngồi chơi, lướt điện thoại</li>
                  <li>Nói &quot;Thích&quot; hay &quot;Không thích&quot; với mọi thứ</li>
                </ul>
              </div>
              <div className="card c2">
                <Image className="peek" src={PACK_TAM_CAY} alt="" width={560} height={615} sizes="84px" />
                <div className="ic">
                  <Crown size={28} aria-hidden="true" />
                </div>
                <h3>Quyền lợi</h3>
                <ul>
                  <li>Thực nhận 26 triệu đồng, có ký hợp đồng.</li>
                  <li>Ăn vặt đồ ăn nhà Bà Tuyết thả ga</li>
                  <li>Hỗ trợ đi lại, di chuyển</li>
                </ul>
              </div>
              <div className="card c3">
                <div className="ic">
                  <Clapperboard size={28} aria-hidden="true" />
                </div>
                <h3>Yêu cầu</h3>
                <ul>
                  <li>Đủ 18 tuổi</li>
                  <li>Thoải mái trước ống kính, được quay/chụp hình cả tháng</li>
                  <li>Rảnh trọn tháng 12/2026 (01–31/12)</li>
                </ul>
              </div>
            </div>
            <p className="note">Không cần biết làm content, không cần nhiều follower.</p>
          </div>
        </section>

        <section id="cach-ung-tuyen" className="apply">
          <div className="wrap apply-grid">
            <div className="apply-head">
            <div className="kicker">Cách ứng tuyển</div>
            <h2>
              Không nhận CV. <em>Quay 1 video</em> là được.
            </h2>
            </div>
            <div>
            <div className="steps">
              <div className="step">
                <div className="no">1</div>
                <div>
                  <h3>Quay video</h3>
                  <p>Kể Bà nghe: nếu được mời về làm Thượng Đế nhà Bà Tuyết, bạn sẽ làm gì?</p>
                </div>
              </div>
              <div className="step">
                <div className="no">2</div>
                <div>
                  <h3>Đăng TikTok công khai</h3>
                  <p>
                    Gắn hashtag <span className="hash">#BaTuyetTuyenThuongDe</span> và tag <b>@ancungbatuyet86</b>.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="no">3</div>
                <div>
                  <h3>Chờ Bà Tuyết lựa chọn</h3>
                  <p>
                    Bà chấm đơn hằng ngày. Người lọt vòng trong nhận tin nhắn mời trước 23/11 để lên livestream 23–29/11. Tối 29/11 công bố Thượng Đế.
                  </p>
                </div>
              </div>
            </div>
            <p style={{ marginTop: 14 }}>
              <a className="btn" href="https://www.tiktok.com/tag/batuyettuyenthuongde" target="_blank" rel="noopener">
                Xem các đơn đã nộp trên TikTok →
              </a>
            </p>
            <p className="note">
              <b>Miễn phí, không cần mua sản phẩm.</b> Nhà Bà Tuyết chỉ liên hệ ứng viên qua tài khoản TikTok chính thức và không bao giờ thu phí hay yêu cầu chuyển khoản.
            </p>
            </div>
          </div>
        </section>

        <section id="lich">
          <div className="wrap">
            <div className="kicker">Lịch tuyển dụng</div>
            <h2>
              Tuyển dụng trên các kênh <em>theo đúng quy trình.</em>
            </h2>
            <div className="tl">
              <div>
                <div className="d">04/11</div>
                <div className="t">Mở nhận đơn</div>
                <div className="x">Đăng ký tham gia bằng video</div>
              </div>
              <div>
                <div className="d">22/11</div>
                <div className="t">Đóng đơn</div>
                <div className="x">23h59 cùng ngày</div>
              </div>
              <div>
                <div className="d">23–29/11</div>
                <div className="t">Livestream chọn</div>
                <div className="x">Mỗi tối trên kênh Thượng Đế Nhà Bà Tuyết. Tối 29/11 công bố Thượng Đế</div>
              </div>
              <div className="on">
                <div className="inner">
                  <div className="d">01–31/12</div>
                  <div className="t">Thượng Đế đi làm</div>
                  <div className="x">Hành trình Thượng Đế đi làm tại Ăn Cùng Bà Tuyết</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="faq">
          <div className="wrap faq-grid">
            <div>
            <div className="kicker">Hỏi đáp nhanh</div>
            <h2>
              Thông tin thêm <em>về chương trình.</em>
            </h2>
            </div>
            <div>
            <details>
              <summary>Chương trình này có thật không?</summary>
              <p>Có thật. Chương trình có hội đồng chấm, có hợp đồng ký, có thu nhập trả thật. Cả quá trình được quay và đăng tải cập nhật công khai trên hệ thống kênh của Ăn Cùng Bà Tuyết.</p>
            </details>
            <details>
              <summary>26 triệu nhận như thế nào?</summary>
              <p>Người được chọn ký Hợp đồng Thượng Đế (bản chất là hợp đồng dịch vụ) với Ăn Cùng Bà Tuyết cho tháng 12/2026. Thượng Đế thực nhận 26 triệu đồng; thuế thu nhập cá nhân do công ty khấu trừ và nộp thay.</p>
            </details>
            <details>
              <summary>Ở xa Hà Nội có nộp đơn được không?</summary>
              <p>Được. Trong tháng làm việc, nhà Bà Tuyết lo đưa đón và chỗ nghỉ theo địa điểm, thống nhất cụ thể với người trúng tuyển trước khi ký hợp đồng.</p>
            </details>
            <details>
              <summary>Nộp nhiều video được không?</summary>
              <p>Được. Hội đồng xét theo người phù hợp, không theo số lượng video.</p>
            </details>
            </div>
          </div>
        </section>

        <section className="rules" id="the-le">
          <div className="wrap">
            <div className="kicker">Thể lệ chính thức</div>
            <h2>Thể lệ chương trình “Bà Tuyết Tuyển Thượng Đế”</h2>
            <p className="meta">Áp dụng từ ngày 04/11/2026. Bằng việc đăng video ứng tuyển, người tham gia được hiểu là đã đọc và đồng ý với thể lệ này.</p>

            <div className="rules-grid">
            <nav className="toc" aria-label="Các điều trong thể lệ">
              <ol>
                {RULE_TITLES.map((title, i) => (
                  <li key={title}>
                    <a href={`#dieu-${i + 1}`}>
                      Điều {i + 1}. {title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div>
            <div className="art" id="dieu-1">
              <h3>
                <span>Điều 1.</span> Đơn vị tổ chức
              </h3>
              <p>Công ty Cổ phần Thực phẩm Ăn Cùng Bà Tuyết (sau đây gọi là “Ban tổ chức” hoặc “Ăn Cùng Bà Tuyết”).</p>
              <p>Địa chỉ: Cụm công nghiệp Từ Liêm, Xuân Phương, Hà Nội.</p>
            </div>

            <div className="art" id="dieu-2">
              <h3>
                <span>Điều 2.</span> Nội dung chương trình
              </h3>
              <p>
                Ban tổ chức tuyển chọn <b>01 (một)</b> người đảm nhận vai trò “Thượng Đế” trong tháng 12/2026: trải nghiệm sản phẩm và môi trường của Ăn Cùng Bà Tuyết với vai trò khách hàng, đồng thời tham gia sản xuất nội dung cùng Ban tổ chức.
              </p>
              <p>“Thượng Đế” trong chương trình được hiểu theo nghĩa “khách hàng là thượng đế”. Đây là chương trình tuyển chọn, không phải chương trình khuyến mại; việc ứng tuyển hoàn toàn miễn phí và không gắn với việc mua bất kỳ sản phẩm nào.</p>
            </div>

            <div className="art" id="dieu-3">
              <h3>
                <span>Điều 3.</span> Thời gian
              </h3>
              <table>
                <tbody>
                  <tr>
                    <td>Nhận video ứng tuyển</td>
                    <td>Từ ngày 04/11/2026 đến 23h59 ngày 22/11/2026 (giờ Việt Nam)</td>
                  </tr>
                  <tr>
                    <td>Sàng lọc hồ sơ</td>
                    <td>Cuốn chiếu từ ngày 10/11/2026</td>
                  </tr>
                  <tr>
                    <td>Livestream duet chọn Thượng Đế</td>
                    <td>Mỗi tối từ 23/11 đến 29/11/2026 trên kênh TikTok “Thượng Đế Nhà Bà Tuyết”; Bà Tuyết có mặt phiên mở 23/11 và phiên chung kết 29/11</td>
                  </tr>
                  <tr>
                    <td>Công bố kết quả</td>
                    <td>Trên livestream tối 29/11/2026</td>
                  </tr>
                  <tr>
                    <td>Lễ ký Hợp đồng Thượng Đế</td>
                    <td>30/11/2026</td>
                  </tr>
                  <tr>
                    <td>Thời gian làm Thượng Đế</td>
                    <td>Từ 01/12/2026 đến 31/12/2026: tuần 1 văn phòng, tuần 2 nhà máy và kho, tuần 3 điểm bán, tuần 4 livestream và nhà khán giả. Địa điểm có thể linh hoạt theo kế hoạch nội dung</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="art" id="dieu-4">
              <h3>
                <span>Điều 4.</span> Đối tượng tham gia
              </h3>
              <ol>
                <li>Cá nhân đủ 18 tuổi trở lên tính đến ngày nộp đơn, có năng lực hành vi dân sự đầy đủ, đang sinh sống tại Việt Nam.</li>
                <li>Có thể tham gia trọn thời gian làm Thượng Đế từ 01/12/2026 đến 31/12/2026 nếu trúng tuyển.</li>
                <li>Không thuộc diện xét tuyển: người sáng tạo nội dung (KOL, KOC, creator) nhận phí hợp tác với Ăn Cùng Bà Tuyết trong chương trình; người lao động của Ăn Cùng Bà Tuyết và các đơn vị trực tiếp tổ chức chương trình.</li>
              </ol>
            </div>

            <div className="art" id="dieu-5">
              <h3>
                <span>Điều 5.</span> Cách ứng tuyển
              </h3>
              <ol>
                <li>Quay một video có chính người ứng tuyển xuất hiện, kể nếu được mời về làm Thượng Đế nhà Bà Tuyết thì mình sẽ làm gì.</li>
                <li>
                  Đăng video lên TikTok ở chế độ công khai, gắn hashtag <span className="hash">#BaTuyetTuyenThuongDe</span> và tag tài khoản <b>@ancungbatuyet86</b>.
                </li>
                <li>Giữ video ở chế độ công khai ít nhất đến hết ngày 29/11/2026 để Hội đồng xét tuyển.</li>
                <li>Mỗi người được nộp nhiều video. Hội đồng xét theo người, không theo số lượng video hay lượt tương tác.</li>
              </ol>
            </div>

            <div className="art" id="dieu-6">
              <h3>
                <span>Điều 6.</span> Yêu cầu với video ứng tuyển
              </h3>
              <ul>
                <li>Do chính người ứng tuyển thực hiện và xuất hiện; không dùng hình ảnh, giọng nói của người khác khi chưa được đồng ý.</li>
                <li>Không vi phạm pháp luật, thuần phong mỹ tục; không xúc phạm, bôi nhọ cá nhân hay tổ chức nào.</li>
                <li>Không vi phạm bản quyền (khuyến khích dùng nhạc trong thư viện của TikTok).</li>
                <li>Không quảng cáo cho thương hiệu, sản phẩm khác.</li>
                <li>Trẻ em dưới 16 tuổi xuất hiện trong video phải có sự đồng ý của cha mẹ hoặc người giám hộ.</li>
              </ul>
              <p>Ban tổ chức có quyền không xét các video không đáp ứng yêu cầu trên.</p>
            </div>

            <div className="art" id="dieu-7">
              <h3>
                <span>Điều 7.</span> Quy trình và tiêu chí tuyển chọn
              </h3>
              <ol>
                <li>
                  <b>Vòng hồ sơ:</b> Hội đồng tuyển chọn của Ban tổ chức xem các video hợp lệ và chọn ứng viên mời vào vòng livestream. Ứng viên được mời sẽ được liên hệ qua tin nhắn từ tài khoản TikTok chính thức <b>@ancungbatuyet86</b> hoặc <b>Thượng Đế Nhà Bà Tuyết</b>.
                </li>
                <li>
                  <b>Xác minh:</b> trước khi lên livestream, ứng viên cung cấp thông tin cần thiết để Ban tổ chức xác minh độ tuổi và nhân thân.
                </li>
                <li>
                  <b>Vòng livestream:</b> ứng viên duet cùng Hội đồng và tham gia thử thách “không làm việc” trực tiếp trên sóng. Khán giả có thể bình chọn cảm tình; kết quả bình chọn mang tính tham khảo.
                </li>
                <li>
                  <b>Kết quả:</b> Hội đồng quyết định chọn Thượng Đế Đầu Tiên nhà Bà Tuyết và 01 người dự bị, công bố trên phiên livestream chung kết tối 29/11/2026, có Bà Tuyết.
                </li>
              </ol>
              <p>Tiêu chí: có duyên khi lên hình; phản ứng tự nhiên; gần gũi, dễ khiến nhiều người thấy mình trong đó; thoải mái được quay trong suốt thời gian làm việc. Không yêu cầu kinh nghiệm làm nội dung hay số lượng người theo dõi.</p>
            </div>

            <div className="art" id="dieu-8">
              <h3>
                <span>Điều 8.</span> Quyền lợi
              </h3>
              <p>
                <b>Thượng Đế trúng tuyển:</b>
              </p>
              <ul>
                <li>Ký “Hợp đồng Thượng Đế” (hợp đồng dịch vụ) với Ban tổ chức cho thời gian từ 01/12 đến 31/12/2026.</li>
                <li>Thù lao thực nhận 26.000.000 đồng (hai mươi sáu triệu đồng); thuế thu nhập cá nhân do Ban tổ chức khấu trừ và nộp thay theo quy định, không trừ vào số thực nhận.</li>
                <li>Thời gian làm việc tối đa 5 ngày/tuần, không quá 8 tiếng/ngày kể cả thời gian di chuyển.</li>
                <li>Được dùng sản phẩm nhà Bà Tuyết trong giờ làm việc; có ghế, bộ đồ Thượng Đế riêng; được đưa đón theo lịch quay. Người ở xa được hỗ trợ chỗ nghỉ theo thỏa thuận trong hợp đồng.</li>
                <li>Các “thẻ vàng” hay “hình phạt” trong luật chơi chỉ để vui, không trừ thù lao.</li>
              </ul>
              <p>
                <b>Thượng Đế dự bị:</b> ký thỏa thuận giữ chỗ, quyền lợi theo thỏa thuận riêng với Ban tổ chức.
              </p>
              <p>
                <b>Ứng viên lên livestream không được chọn:</b> nhận quà cảm ơn từ nhà Bà Tuyết.
              </p>
            </div>

            <div className="art" id="dieu-9">
              <h3>
                <span>Điều 9.</span> Quyền sử dụng video ứng tuyển
              </h3>
              <ol>
                <li>
                  Khi gắn hashtag <b>#BaTuyetTuyenThuongDe</b>, người ứng tuyển đồng ý để Ăn Cùng Bà Tuyết chia sẻ lại, duet, stitch, trích đoạn video ứng tuyển trên các kênh chính thức của Ăn Cùng Bà Tuyết trong phạm vi chương trình, có ghi tên tài khoản, không phát sinh chi phí.
                </li>
                <li>Quyền tác giả của video vẫn thuộc về người ứng tuyển.</li>
                <li>Người ứng tuyển có thể rút video bằng cách xóa video hoặc nhắn tin cho Ban tổ chức; Ban tổ chức ngừng sử dụng mới trong thời gian hợp lý. Nội dung đã phát trực tiếp không thể thu hồi.</li>
                <li>Việc sử dụng hình ảnh của Thượng Đế và Thượng Đế dự bị được quy định riêng trong hợp đồng.</li>
              </ol>
            </div>

            <div className="art" id="dieu-10">
              <h3>
                <span>Điều 10.</span> Thông tin cá nhân
              </h3>
              <p>Ban tổ chức chỉ đề nghị cung cấp thông tin cá nhân (họ tên, ngày sinh, số điện thoại, giấy tờ tùy thân) với ứng viên được mời vào vòng livestream và người trúng tuyển, nhằm xác minh, ký hợp đồng và thực hiện nghĩa vụ thuế. Thông tin được bảo mật, không cung cấp cho bên thứ ba trừ trường hợp pháp luật yêu cầu, và được xử lý theo quy định pháp luật về bảo vệ dữ liệu cá nhân.</p>
            </div>

            <div className="art" id="dieu-11">
              <h3>
                <span>Điều 11.</span> Trường hợp không xét hoặc hủy kết quả
              </h3>
              <ul>
                <li>Khai không đúng độ tuổi, nhân thân hoặc thông tin cung cấp cho Ban tổ chức.</li>
                <li>Gian lận tương tác (mua lượt xem, tài khoản ảo…) hoặc vi phạm Điều 6.</li>
                <li>Người trúng tuyển không ký hợp đồng trong thời hạn Ban tổ chức thông báo. Khi đó Thượng Đế dự bị được mời thay thế.</li>
              </ul>
            </div>

            <div className="art" id="dieu-12">
              <h3>
                <span>Điều 12.</span> Điều khoản chung
              </h3>
              <ol>
                <li>Ban tổ chức có thể điều chỉnh lịch trình vì lý do khách quan và sẽ thông báo trên trang này cùng các kênh chính thức của Ăn Cùng Bà Tuyết.</li>
                <li>Kết quả tuyển chọn do Hội đồng tuyển chọn của Ban tổ chức quyết định.</li>
                <li>Mọi thắc mắc, khiếu nại được giải quyết trên tinh thần thương lượng, theo quy định của pháp luật Việt Nam.</li>
              </ol>
              <div className="warn">
                <TriangleAlert size={22} aria-hidden="true" />
                <div>
                <b>Cảnh giác mạo danh:</b> Ban tổ chức <b>không thu bất kỳ khoản phí nào</b>, không yêu cầu chuyển khoản, không hỏi mã OTP hay mật khẩu. Ban tổ chức chỉ chủ động nhắn tin cho ứng viên qua tài khoản TikTok chính thức nêu tại Điều 7.
                </div>
              </div>
              <p style={{ marginTop: 12 }}>
                Liên hệ Ban tổ chức: Hotline{" "}
                <a href="tel:02483889679">
                  <b>024 8388 9679</b>
                </a>{" "}
                · Email{" "}
                <a href="mailto:gdtruyenthong@acbt.vn">
                  <b>gdtruyenthong@acbt.vn</b>
                </a>{" "}
                · Fanpage{" "}
                <a href="https://www.facebook.com/ancungbatuyet" target="_blank" rel="noopener">
                  <b>facebook.com/ancungbatuyet</b>
                </a>
              </p>
            </div>
            </div>
            </div>
          </div>
        </section>

        <div className="final">
          <div className="wrap">
            <Image className="pack p1" src={PACK_TAM_CAY} alt="" width={560} height={615} sizes="190px" />
            <Image className="pack p2" src={PACK_CHAN_GA} alt="" width={560} height={754} sizes="190px" />
            <Image className="mark" src={`${ASSETS}/wordmark.webp`} alt="" width={821} height={338} sizes="440px" />
            <h2>Chào Thượng Đế!</h2>
            <p>Ở nhà Bà Tuyết, ăn vặt là phải ăn cùng nhau.</p>
            <a className="btn" href="#cach-ung-tuyen">
              Nộp đơn ngay →
            </a>
          </div>
        </div>
      </main>

      <footer>
        <div className="wrap">
          <Image className="logo" src={LOGO} alt="Logo Ăn Cùng Bà Tuyết" width={64} height={64} />
          <div>
            <b>Ăn Cùng Bà Tuyết</b>
            <br />
            Ăn vặt thì phải ăn cùng Bà Tuyết
            <br />
            Cụm công nghiệp Từ Liêm, Xuân Phương, Hà Nội
            <br />
            Hotline <a href="tel:02483889679">024 8388 9679</a> · <a href="mailto:gdtruyenthong@acbt.vn">gdtruyenthong@acbt.vn</a>
            <br />
            <a href="https://www.facebook.com/ancungbatuyet" target="_blank" rel="noopener">
              Fanpage
            </a>{" "}
            ·{" "}
            <a href="https://www.tiktok.com/@ancungbatuyet86" target="_blank" rel="noopener">
              TikTok @ancungbatuyet86
            </a>{" "}
            · #BaTuyetTuyenThuongDe
          </div>
        </div>
      </footer>
    </div>
  );
}
