"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", content: "", source: "Website Contact Form" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.content) {
      setError("Vui lòng nhập tên và nội dung tin nhắn");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ name: "", phone: "", email: "", content: "", source: "Website Contact Form" });
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#fff7ed] min-h-screen pt-24 pb-16 selection:bg-orange-600 selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-black uppercase tracking-[0.24em] text-orange-700"
          >
            Liên hệ với chúng tôi
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-4xl sm:text-5xl font-black leading-tight tracking-[-0.04em] text-slate-950"
          >
            Hợp tác & Phản hồi
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base text-slate-600 max-w-2xl mx-auto"
          >
            Dành cho khách hàng, đại lý và đối tác muốn trao đổi thông tin, phản hồi sản phẩm hoặc tìm hiểu cơ hội kinh doanh cùng Ăn Cùng Bà Tuyết.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 bg-white shadow-xl">
          
          <div className="p-8 sm:p-12 bg-orange-600 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-[-0.03em] mb-6">Thông tin liên hệ</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-500/50 p-3 shrink-0"><MapPin size={20} /></div>
                  <div>
                    <h3 className="font-bold text-orange-100 text-sm tracking-wider uppercase mb-1">Văn phòng chính</h3>
                    <p className="font-semibold text-lg leading-relaxed">Hà Nội, Việt Nam</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-orange-500/50 p-3 shrink-0"><Phone size={20} /></div>
                  <div>
                    <h3 className="font-bold text-orange-100 text-sm tracking-wider uppercase mb-1">Hotline đối tác</h3>
                    <p className="font-semibold text-lg leading-relaxed">0123 456 789</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-orange-500/50 p-3 shrink-0"><Mail size={20} /></div>
                  <div>
                    <h3 className="font-bold text-orange-100 text-sm tracking-wider uppercase mb-1">Email hỗ trợ</h3>
                    <p className="font-semibold text-lg leading-relaxed">hello@ancungbatuyet.vn</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-12 border-t border-orange-500/50">
              <p className="font-bold text-orange-100 text-sm tracking-wider uppercase mb-4">Kết nối qua mạng xã hội</p>
              <div className="flex gap-4">
                <a href="#" className="bg-orange-500/50 p-3 hover:bg-white hover:text-orange-600 transition-colors">TikTok</a>
                <a href="#" className="bg-orange-500/50 p-3 hover:bg-white hover:text-orange-600 transition-colors">Facebook</a>
                <a href="#" className="bg-orange-500/50 p-3 hover:bg-white hover:text-orange-600 transition-colors">Shopee</a>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950 mb-6">Gửi tin nhắn</h2>
            
            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 flex items-center justify-center rounded-full mb-4">
                  <Send className="text-green-600" size={24} />
                </div>
                <h3 className="font-black text-xl mb-2">Đã gửi thành công!</h3>
                <p className="text-slate-600">Cảm ơn bạn đã liên hệ. Đội ngũ của chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-6 font-bold text-green-700 underline underline-offset-4"
                >
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 text-sm font-bold">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Họ và Tên *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                      placeholder="VD: 0987654321"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                      placeholder="VD: email@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Chủ đề quan tâm</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                  >
                    <option value="Website Contact Form">Góp ý chung</option>
                    <option value="Đăng ký đại lý">Hợp tác làm đại lý / phân phối</option>
                    <option value="Mua hàng sỉ">Mua sỉ số lượng lớn</option>
                    <option value="Phản ánh chất lượng">Phản ánh chất lượng sản phẩm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nội dung chi tiết *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors resize-none"
                    placeholder="Bạn muốn trao đổi về vấn đề gì..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-sm py-4 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader className="animate-spin" size={18} /> : <Send size={18} />}
                  <span>{loading ? "Đang gửi..." : "Gửi tin nhắn"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
