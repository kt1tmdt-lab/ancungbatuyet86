import { Headphones } from "lucide-react";
import { CustomerPolicyDetailPage } from "@/components/pages/CustomerPolicyDetailPage";

export default function ComplaintReceptionPage() {
  return <CustomerPolicyDetailPage label="Hỗ trợ khách hàng" title="Tiếp nhận phản ánh và khiếu nại" intro="Mọi phản ánh liên quan đến sản phẩm được tiếp nhận qua các kênh chính thức để chuyển đúng bộ phận xử lý." icon={Headphones} items={[
    { title: "Gửi phản ánh", description: "Khách hàng có thể liên hệ qua hotline, email, fanpage hoặc biểu mẫu liên hệ trên website." },
    { title: "Ghi nhận thông tin", description: "Nội dung được ghi nhận cùng thời gian, thông tin liên hệ và bằng chứng liên quan nếu có." },
    { title: "Xác minh và phản hồi", description: "Bộ phận phụ trách kiểm tra nội dung, phối hợp với đơn vị liên quan và phản hồi theo tiến độ xử lý." },
    { title: "Bảo vệ quyền lợi", description: "Mục tiêu của quy trình là làm rõ sự việc, đưa ra hướng xử lý phù hợp và hạn chế trải nghiệm không tốt lặp lại." },
  ]} />;
}
