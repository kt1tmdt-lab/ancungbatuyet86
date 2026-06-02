"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";

const contactInfo = [
  { icon: Phone, label: "Hotline", value: "0989 852 948", href: "tel:0989852948", color: "bg-primary/10 text-primary" },
  { icon: Mail, label: "Email", value: "ancungbatuyet@gmail.com", href: "mailto:ancungbatuyet@gmail.com", color: "bg-blue-500/10 text-blue-600" },
  { icon: MapPin, label: "Địa chỉ", value: "KCN Sông Công, Thái Nguyên", href: "#map", color: "bg-secondary/10 text-secondary" },
  { icon: Clock, label: "Giờ làm việc", value: "T2 - T7: 8:00 - 17:00", href: undefined, color: "bg-amber-500/10 text-amber-600" },
];

const subjects = [
  "Mua hàng / Đặt hàng",
  "Đăng ký đại lý",
  "Hợp tác / Báo chí",
  "Khiếu nại / Góp ý",
  "Khác",
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Liên hệ</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral mt-3">Chúng tôi luôn sẵn sàng</h1>
            <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
              Bạn có câu hỏi, muốn hợp tác, hoặc cần hỗ trợ? Hãy liên hệ với chúng tôi qua bất kỳ kênh nào dưới đây
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                {info.href ? (
                  <a href={info.href} className="block p-6 rounded-2xl bg-cream hover:shadow-md transition-all text-center">
                    <div className={`w-14 h-14 rounded-2xl ${info.color} flex items-center justify-center mx-auto mb-3`}>
                      <info.icon size={24} />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">{info.label}</p>
                    <p className="font-bold text-neutral mt-1">{info.value}</p>
                  </a>
                ) : (
                  <div className="block p-6 rounded-2xl bg-cream text-center">
                    <div className={`w-14 h-14 rounded-2xl ${info.color} flex items-center justify-center mx-auto mb-3`}>
                      <info.icon size={24} />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">{info.label}</p>
                    <p className="font-bold text-neutral mt-1">{info.value}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="text-primary" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral">Gửi tin nhắn</h2>
                  <p className="text-sm text-gray-400">Chúng tôi sẽ phản hồi trong vòng 24 giờ</p>
                </div>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl bg-cream border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Nguyễn Văn A" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                    <input type="tel" required className="w-full px-4 py-3 rounded-xl bg-cream border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="0912 345 678" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl bg-cream border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề *</label>
                  <select required className="w-full px-4 py-3 rounded-xl bg-cream border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-700">
                    <option value="">Chọn chủ đề</option>
                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung *</label>
                  <textarea required rows={5} className="w-full px-4 py-3 rounded-xl bg-cream border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="Nội dung tin nhắn..." />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-4 rounded-xl font-semibold transition-colors">
                  <Send size={18} /> Gửi tin nhắn
                </button>
              </form>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-6"
            >
              <div id="map" className="flex-1 rounded-2xl overflow-hidden shadow-sm min-h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50000!2d105.849!3d21.4735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDI4JzI0LjYiTiAxMDXCsDUwJzU2LjQiRQ!5e0!3m2!1svi!2svn!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 400 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vị trí Ăn Cùng Bà Tuyết"
                />
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-neutral mb-3">Kết nối với chúng tôi</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "TikTok", url: "https://tiktok.com/@batuyethanhvi", color: "bg-black" },
                    { name: "Facebook", url: "https://facebook.com/ancungbatuyet", color: "bg-blue-600" },
                    { name: "Shopee", url: "https://shopee.vn/nmtvlog99", color: "bg-orange-500" },
                    { name: "Lazada", url: "https://lazada.vn/shop/an-cung-ba-tuyet", color: "bg-blue-800" },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-2 ${social.color} text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity`}
                    >
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
