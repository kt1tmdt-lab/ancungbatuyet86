import { ShieldCheck } from "lucide-react";
import { CustomerPolicyDetailPage } from "@/components/pages/CustomerPolicyDetailPage";

export default function ProductInsurancePage() {
  return <CustomerPolicyDetailPage label="Bảo vệ khách hàng" title="Bảo hiểm trách nhiệm sản phẩm" intro="Bảo hiểm trách nhiệm sản phẩm là một lớp bảo vệ bổ sung cho người tiêu dùng trong phạm vi và điều kiện của hợp đồng bảo hiểm." icon={ShieldCheck} items={[
    { title: "Vai trò của bảo hiểm", description: "Bảo hiểm hỗ trợ xử lý trách nhiệm khi có sự việc thuộc phạm vi bảo hiểm, bên cạnh trách nhiệm trực tiếp của đơn vị sản xuất và kinh doanh." },
    { title: "Phạm vi áp dụng", description: "Việc xem xét bồi thường phụ thuộc vào hồ sơ sự việc, điều khoản hợp đồng và kết quả xác minh của các bên liên quan." },
    { title: "Hồ sơ cần thiết", description: "Thông tin về sản phẩm, bằng chứng mua hàng và tài liệu liên quan sẽ giúp quá trình tiếp nhận được đầy đủ hơn." },
    { title: "Cách yêu cầu hỗ trợ", description: "Khi phát sinh vấn đề, hãy liên hệ thương hiệu trước để được tiếp nhận thông tin và hướng dẫn các bước tiếp theo." },
  ]} note="Bảo hiểm không thay thế chứng nhận chất lượng, kiểm nghiệm định kỳ hay trách nhiệm xử lý trực tiếp của thương hiệu." />;
}
