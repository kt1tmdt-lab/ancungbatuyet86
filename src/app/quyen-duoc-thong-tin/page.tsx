import { FileSearch } from "lucide-react";
import { CustomerPolicyDetailPage } from "@/components/pages/CustomerPolicyDetailPage";

export default function RightToInformationPage() {
  return <CustomerPolicyDetailPage label="Quyền lợi khách hàng" title="Quyền được thông tin rõ ràng" intro="Khách hàng cần có đủ thông tin để lựa chọn, sử dụng và phản hồi về sản phẩm một cách chủ động." icon={FileSearch} items={[
    { title: "Thông tin trên bao bì", description: "Sản phẩm cần thể hiện thành phần, ngày sản xuất, hạn sử dụng, hướng dẫn bảo quản và thông tin của đơn vị chịu trách nhiệm." },
    { title: "Nguồn tham khảo", description: "Các thông tin về chất lượng, quy trình và hồ sơ được công bố theo những tài liệu hiện có trên website hoặc kênh chính thức." },
    { title: "Kênh xác minh", description: "Khi cần làm rõ thông tin, khách hàng có thể gửi câu hỏi qua các kênh liên hệ chính thức của thương hiệu." },
    { title: "Cập nhật minh bạch", description: "Nội dung công bố được rà soát và cập nhật khi có thay đổi liên quan đến sản phẩm hoặc chính sách." },
  ]} />;
}
