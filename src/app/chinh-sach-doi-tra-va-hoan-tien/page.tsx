import { PackageCheck } from "lucide-react";
import { CustomerPolicyDetailPage } from "@/components/pages/CustomerPolicyDetailPage";

export default function ReturnPolicyPage() {
  return <CustomerPolicyDetailPage label="Quyền lợi khách hàng" title="Chính sách đổi trả và hoàn tiền" intro="Khi sản phẩm gặp lỗi thuộc phạm vi hỗ trợ, khách hàng có thể gửi thông tin để được tiếp nhận và hướng dẫn xử lý." icon={PackageCheck} items={[
    { title: "Trường hợp tiếp nhận", description: "Sản phẩm có dấu hiệu lỗi do sản xuất, đóng gói hoặc hư hại trong quá trình vận chuyển cần được phản ánh sớm để kiểm tra." },
    { title: "Thông tin cần gửi", description: "Vui lòng chuẩn bị hình ảnh sản phẩm, bao bì, hạn sử dụng, nơi mua và mô tả tình trạng để việc xác minh nhanh hơn." },
    { title: "Quy trình xử lý", description: "Bộ phận hỗ trợ tiếp nhận, kiểm tra thông tin và phản hồi phương án phù hợp theo từng trường hợp cụ thể." },
    { title: "Kết quả hỗ trợ", description: "Việc đổi sản phẩm hoặc hoàn tiền được thực hiện khi thông tin đã được xác minh theo chính sách áp dụng tại thời điểm mua." },
  ]} note="Để được hỗ trợ tốt nhất, hãy giữ lại sản phẩm, bao bì và thông tin đơn hàng cho đến khi quá trình xác minh hoàn tất." />;
}
