"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./kol-handbook.css";

export default function TikTokFoodFestPage() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"day1" | "day2">("day1");
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: "00",
    minutes: "00",
    seconds: "00",
    isLive: false,
  });

  useEffect(() => {
    setMounted(true);
    const target = new Date("2026-09-25T09:00:00+07:00").getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setCountdown((prev) => ({ ...prev, isLive: true }));
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setCountdown({
        days: d,
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
        isLive: false,
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    hash: string
  ) => {
    setIsNavOpen(false);
    const targetEl = document.getElementById(hash);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      if (typeof window !== "undefined") {
        window.history.pushState(
          null,
          "",
          `https://acbt.vn/tiktok-food-fest#${hash}`
        );
      }
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="kol-handbook-container">
      {/* TOPBAR */}
      <nav className="topbar">
        <div className="topbar-brand">
          <a
            href="https://acbt.vn/tiktok-food-fest#top"
            onClick={(e) => handleAnchorClick(e, "top")}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            ACBT <span>× Food Fest 2026</span>
          </a>
        </div>
        <button
          className="menu-btn"
          onClick={() => setIsNavOpen(true)}
          aria-label="Menu"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </nav>

      {/* NAV DRAWER */}
      <div id="navDrawer" className={`nav-drawer ${isNavOpen ? "open" : ""}`}>
        <div
          className="nav-overlay"
          onClick={() => setIsNavOpen(false)}
        ></div>
        <div className="nav-panel">
          <button
            className="nav-close"
            onClick={() => setIsNavOpen(false)}
            aria-label="Đóng menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="22"
              height="22"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <a
            href="https://acbt.vn/tiktok-food-fest#truockhi"
            className="nav-link"
            onClick={(e) => handleAnchorClick(e, "truockhi")}
          >
            <span className="nav-num">1</span>Trước khi đến
          </a>
          <a
            href="https://acbt.vn/tiktok-food-fest#checkin"
            className="nav-link"
            onClick={(e) => handleAnchorClick(e, "checkin")}
          >
            <span className="nav-num">2</span>Check-in tại booth
          </a>
          <a
            href="https://acbt.vn/tiktok-food-fest#trainghiem"
            className="nav-link"
            onClick={(e) => handleAnchorClick(e, "trainghiem")}
          >
            <span className="nav-num">3</span>Hành trình trải nghiệm
          </a>
          <a
            href="https://acbt.vn/tiktok-food-fest#quatang"
            className="nav-link"
            onClick={(e) => handleAnchorClick(e, "quatang")}
          >
            <span className="nav-num">4</span>Quà tặng & Giải thưởng
          </a>
          <a
            href="https://acbt.vn/tiktok-food-fest#collab"
            className="nav-link"
            onClick={(e) => handleAnchorClick(e, "collab")}
          >
            <span className="nav-num">5</span>Quay collab
          </a>
          <a
            href="https://acbt.vn/tiktok-food-fest#contentkit"
            className="nav-link"
            onClick={(e) => handleAnchorClick(e, "contentkit")}
          >
            <span className="nav-num">6</span>Content Kit
          </a>
          <a
            href="https://acbt.vn/tiktok-food-fest#lichtrinh"
            className="nav-link"
            onClick={(e) => handleAnchorClick(e, "lichtrinh")}
          >
            <span className="nav-num">7</span>Lịch trình 2 ngày
          </a>
          <a
            href="https://acbt.vn/tiktok-food-fest#sausukien"
            className="nav-link"
            onClick={(e) => handleAnchorClick(e, "sausukien")}
          >
            <span className="nav-num">9</span>Sau sự kiện
          </a>
          <a
            href="https://acbt.vn/tiktok-food-fest#faq"
            className="nav-link"
            onClick={(e) => handleAnchorClick(e, "faq")}
          >
            <span className="nav-num">?</span>FAQ
          </a>
          <a
            href="https://acbt.vn/tiktok-food-fest#lienhe"
            className="nav-link"
            onClick={(e) => handleAnchorClick(e, "lienhe")}
          >
            <span className="nav-num">☎</span>Liên hệ
          </a>
        </div>
      </div>

      {/* HERO */}
      <section className="hero" id="top">
        <img
          src="/tiktok-food-fest/images/logo-acbt.png"
          alt="Logo Ăn Cùng Bà Tuyết"
          style={{
            width: "120px",
            height: "auto",
            margin: "0 auto 16px",
            display: "block",
            borderRadius: "16px",
          }}
        />
        <div className="hero-eyebrow">Cẩm nang KOL/KOC</div>
        <h1>
          Chào mừng bạn đến với
          <br />
          <em>Ăn Cùng Bà Tuyết</em>
        </h1>
        <p className="hero-sub">
          Tại TikTok Food Fest 2026 — &ldquo;Food As a Love Language&rdquo;
        </p>
        <div className="hero-meta">
          <span className="meta-chip">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            25–26/09/2026
          </span>
          <span className="meta-chip">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            9:00 – 22:00
          </span>
          <span className="meta-chip">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            CV Bờ Sông, Thủ Thiêm
          </span>
          <span className="meta-chip">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a4 4 0 00-8 0v2" />
            </svg>
            Booth 7×7m
          </span>
        </div>

        {/* COUNTDOWN */}
        <div id="countdown" className="countdown">
          {countdown.isLive ? (
            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--accent)",
                padding: "12px",
              }}
            >
              🎉 Sự kiện đang diễn ra!
            </div>
          ) : (
            <>
              <div className="cd-unit">
                <span className="cd-num" id="cd-d">
                  {mounted ? countdown.days : "0"}
                </span>
                <span className="cd-label">Ngày</span>
              </div>
              <div className="cd-unit">
                <span className="cd-num" id="cd-h">
                  {mounted ? countdown.hours : "00"}
                </span>
                <span className="cd-label">Giờ</span>
              </div>
              <div className="cd-unit">
                <span className="cd-num" id="cd-m">
                  {mounted ? countdown.minutes : "00"}
                </span>
                <span className="cd-label">Phút</span>
              </div>
              <div className="cd-unit">
                <span className="cd-num" id="cd-s">
                  {mounted ? countdown.seconds : "00"}
                </span>
                <span className="cd-label">Giây</span>
              </div>
            </>
          )}
        </div>

        <div style={{ marginTop: "20px" }}>
          <img
            src="/tiktok-food-fest/images/3d-map.png"
            alt="Sơ đồ 3D TikTok Food Fest 2026"
            style={{
              width: "100%",
              maxWidth: "600px",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow-md)",
            }}
          />
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              marginTop: "6px",
            }}
          >
            Sơ đồ 3D khu vực sự kiện — Booth ACBT nằm góc trái phía trên
          </p>
        </div>

        <div style={{ marginTop: "16px" }}>
          <img
            src="/tiktok-food-fest/images/event-intro.png"
            alt="TikTok Food Fest 2026 — Food As A Love Language"
            style={{
              width: "100%",
              maxWidth: "600px",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow-md)",
            }}
          />
        </div>
      </section>

      {/* ─── 1. TRƯỚC KHI ĐẾN ─── */}
      <div className="section-divider"></div>
      <section className="section" id="truockhi">
        <div className="section-header">
          <span className="section-num">1</span>
          <h2 className="section-title">Trước khi đến</h2>
        </div>

        <div className="card">
          <div className="card-title">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <path d="M22 4L12 14.01l-3-3" />
            </svg>
            Xác nhận tham dự
          </div>
          <p style={{ fontSize: "14px", marginBottom: "8px" }}>
            Vui lòng xác nhận trước <strong>23:59 ngày 24/09</strong> qua đầu
            mối KOL của bạn, ghi rõ:
          </p>
          <ul className="checklist">
            <li>Ngày đến (25/09, 26/09 hoặc cả hai)</li>
            <li>Khung giờ dự kiến đến booth ACBT</li>
            <li>Có người đi cùng không, bao nhiêu người</li>
          </ul>
        </div>

        <div className="card">
          <div className="card-title">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <path d="M12 18h.01" />
            </svg>
            Cần mang theo
          </div>
          <ul className="checklist">
            <li>
              <strong>Thư mời / mã QR</strong> — điều kiện bắt buộc để nhận quà
            </li>
            <li>
              <strong>CCCD/CMND</strong> — bắt buộc nếu trúng giải thưởng giá
              trị
            </li>
            <li>Điện thoại sạc đầy + sạc dự phòng</li>
            <li>Mic cài áo (nếu có, để quay collab)</li>
          </ul>
        </div>

        <div className="alert alert-warn">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z" />
          </svg>
          <div>
            <strong>Trang phục:</strong> Nên mặc trang phục tông sáng, tránh đồ
            sẫm/tối vì booth ACBT có backdrop màu nổi. Sự kiện ngoài trời, cuối
            tháng 9 TP.HCM dễ có mưa chiều — mang ô/áo mưa nhỏ.
          </div>
        </div>

        <div className="card" style={{ marginTop: "12px" }}>
          <div className="card-title">🚫 Vật dụng không được mang vào</div>
          <img
            src="/tiktok-food-fest/images/prohibited-items.png"
            alt="Vật dụng không được mang vào sự kiện"
            style={{ width: "100%", borderRadius: "var(--radius-sm)" }}
          />
        </div>

        <div className="card" style={{ marginTop: "12px" }}>
          <div className="card-title">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Di chuyển
          </div>
          <div className="info-row">
            <span className="info-label">Địa chỉ</span>
            <span className="info-value">
              <a
                href="https://maps.app.goo.gl/zAyN7qVrHQGfnmU88"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent)", textDecoration: "underline" }}
              >
                Công viên Bờ Sông Sài Gòn
              </a>
              , Phường An Khánh, TP. Thủ Đức, TP.HCM
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Đậu xe</span>
            <span className="info-value">
              Đường N12 hoặc Nguyễn Thiện Thành, An Khánh.{" "}
              <em>Xe không vào được khu vực sự kiện.</em>
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Lưu ý</span>
            <span className="info-value">
              Hàng hóa phải bốc dỡ tại bãi xe, di chuyển thủ công vào khu vực
              sự kiện.
            </span>
          </div>
        </div>
      </section>

      {/* ─── 2. CHECK-IN ─── */}
      <div className="section-divider"></div>
      <section className="section" id="checkin">
        <div className="section-header">
          <span className="section-num">2</span>
          <h2 className="section-title">Check-in tại booth</h2>
        </div>

        <div className="flow">
          <div className="flow-step" data-step="1">
            <div className="flow-title">Vào cổng sự kiện</div>
            <div className="flow-desc">
              Sự kiện mở cổng từ 9:00. Đeo thẻ định danh suốt sự kiện.
            </div>
          </div>
          <div className="flow-step" data-step="2">
            <div className="flow-title">Di chuyển đến booth ACBT</div>
            <div className="flow-desc">
              Booth 7×7m, khu vực gần sân khấu chính và VIP Lounge. Nhân viên sẽ
              đón tại lối vào booth.
            </div>
          </div>
          <div className="flow-step" data-step="3">
            <div className="flow-title">Check-in tại bàn tiếp đón</div>
            <div className="flow-desc">
              Xuất trình thư mời/QR code → nhận vòng tay KOL → ghi nhận thông
              tin.
            </div>
          </div>
          <div className="flow-step" data-step="4">
            <div className="flow-title">Nhận hướng dẫn trải nghiệm</div>
            <div className="flow-desc">
              Nhân viên giới thiệu các trạm trải nghiệm, sắp xếp slot collab (nếu
              có).
            </div>
          </div>
        </div>

        <div className="alert alert-info" style={{ marginTop: "12px" }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          <div>
            <strong>Đầu mối đón KOL tại booth:</strong> Nhân viên Ban Truyền
            thông sẽ đón bạn ngay tại booth. Liên hệ Thảo (booking KOL) khi đến
            nơi.
          </div>
        </div>
      </section>

      {/* ─── 3. HÀNH TRÌNH TRẢI NGHIỆM ─── */}
      <div className="section-divider"></div>
      <section className="section" id="trainghiem">
        <div className="section-header">
          <span className="section-num">3</span>
          <h2 className="section-title">Hành trình trải nghiệm</h2>
        </div>

        <div className="card">
          <div className="card-title">🎁 Trạm 1 — Nhận quà khách mời</div>
          <p style={{ fontSize: "14px" }}>
            Có thư mời + đã check-in → nhận 01 phần quà. Mỗi người 01 phần duy
            nhất.
          </p>
        </div>
        <div className="card">
          <div className="card-title">🍗 Trạm 2 — Thử sản phẩm ACBT</div>
          <p style={{ fontSize: "14px", marginBottom: "8px" }}>
            Trải nghiệm các sản phẩm đặc trưng của Ăn Cùng Bà Tuyết ngay tại
            booth:
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
              marginTop: "6px",
            }}
          >
            <span className="product-tag">Chân gà rút xương</span>
            <span className="product-tag">Chân gà khổng lồ</span>
            <span className="product-tag">Tăm cay Bà Tuyết</span>
          </div>
        </div>
        <div className="card">
          <div className="card-title">🎯 Trạm 3 — Máy gắp chân gà</div>
          <p style={{ fontSize: "14px" }}>
            Máy gắp thú quen thuộc — nhưng thay vì thú bông, bên trong là chân gà
            Bà Tuyết! Thử vận may và mang về chiến lợi phẩm.
          </p>
        </div>
        <div className="card">
          <div className="card-title">🏆 Trạm 4 — Quay thưởng</div>
          <p style={{ fontSize: "14px" }}>
            Cơ hội trúng <strong>vàng 9999</strong> và{" "}
            <strong>vé fan zone Đại nhạc hội</strong>. Xem chi tiết tại mục 4.
          </p>
        </div>
        <div className="card">
          <div className="card-title">🎬 Trạm 5 — Quay collab</div>
          <p style={{ fontSize: "14px" }}>
            Collab cùng Bà Tuyết, Đàm Đức, Hải Đăng và các KOL/KOC khác. Xem chi
            tiết tại mục 5.
          </p>
        </div>
        <div className="card">
          <div className="card-title">🎪 Trạm 6 — Khám phá Food Fest</div>
          <p style={{ fontSize: "14px", marginBottom: "6px" }}>
            Sự kiện có hơn 30 gian hàng F&B và hoạt động phong phú:
          </p>
          <ul className="checklist">
            <li>
              <strong>Taste Hunt:</strong> Nhận Thẻ nhiệm vụ, ghé các gian hàng
              đóng dấu → mỗi 5 dấu = 1 phần quà
            </li>
            <li>
              <strong>Đại nhạc hội</strong> trên sân khấu chính — xem lịch tại
              mục 8
            </li>
            <li>
              Các gian hàng: Omachi, Chinsu, TH True Milk, Milo, KitKat,
              Nescafé, Maggi, NutiFood…
            </li>
          </ul>
        </div>
      </section>

      {/* ─── 4. QUÀ TẶNG ─── */}
      <div className="section-divider"></div>
      <section className="section" id="quatang">
        <div className="section-header">
          <span className="section-num">4</span>
          <h2 className="section-title">Quà tặng & Giải thưởng</h2>
        </div>

        <div className="card">
          <div className="card-title">🎁 Quà khách mời</div>
          <div className="info-row">
            <span className="info-label">Điều kiện</span>
            <span className="info-value">
              Có thư mời + đã check-in tại booth ACBT
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Nhận tại</span>
            <span className="info-value">
              Bàn check-in booth ACBT, ngay sau khi xác nhận
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Giới hạn</span>
            <span className="info-value">01 phần / người</span>
          </div>
        </div>

        <div className="card">
          <div className="card-title">🏅 Vàng 9999</div>
          <p style={{ fontSize: "14px", marginBottom: "8px" }}>
            Cơ hội trúng vàng 9999 thông qua vòng quay may mắn tại booth.
          </p>
          <div className="alert alert-warn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z" />
            </svg>
            <div>
              <strong>Nếu trúng giải:</strong> Cần xuất trình CCCD/CMND gốc.
              Giải thưởng có giá trị trên 10 triệu VND sẽ phải khấu trừ thuế
              TNCN 10% phần vượt theo quy định.
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">🎵 Vé fan zone Đại nhạc hội</div>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Vé vào khu vực fan zone sân khấu chính trong khung giờ biểu diễn nghệ
            sĩ. Nhận trực tiếp tại booth sau khi trúng thưởng.
          </p>
          <img
            src="/tiktok-food-fest/images/lineup.png"
            alt="Line-up Đại nhạc hội TikTok Food Fest 2026"
            style={{ width: "100%", borderRadius: "var(--radius-sm)" }}
          />
        </div>

        <p
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            textAlign: "center",
            marginTop: "12px",
            fontStyle: "italic",
          }}
        >
          Quyết định của Ban tổ chức là quyết định cuối cùng trong mọi trường
          hợp.
        </p>
      </section>

      {/* ─── 5. COLLAB ─── */}
      <div className="section-divider"></div>
      <section className="section" id="collab">
        <div className="section-header">
          <span className="section-num">5</span>
          <h2 className="section-title">Quay collab</h2>
        </div>

        <div className="card">
          <div className="card-title">📅 Đặt slot trước</div>
          <p style={{ fontSize: "14px" }}>
            Slot quay collab với Bà Tuyết và các KOL khác có giới hạn. Liên hệ
            đầu mối KOL để đăng ký khung giờ cụ thể.
          </p>
        </div>

        <div className="card">
          <div className="card-title">💡 Format gợi ý</div>
          <p style={{ fontSize: "14px", marginBottom: "8px" }}>
            Bạn không cần tự nghĩ kịch bản — team đã chuẩn bị sẵn một số ý
            tưởng:
          </p>
          <ul className="checklist">
            <li>
              <strong>Thử thách gắp chân gà</strong> cùng Bà Tuyết — ai gắp
              nhiều hơn?
            </li>
            <li>
              <strong>Phản ứng lần đầu ăn thử</strong> — &ldquo;Lần đầu ăn chân gà
              rút xương&rdquo;
            </li>
            <li>
              <strong>Khám phá booth</strong> — dẫn khán giả tour quanh gian hàng
              ACBT
            </li>
            <li>
              <strong>Trend đang hot</strong> — kết hợp trend TikTok hiện tại với
              sản phẩm
            </li>
          </ul>
        </div>

        <div className="card" style={{ borderColor: "var(--accent)" }}>
          <div className="card-title" style={{ color: "var(--accent)" }}>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ color: "var(--accent)" }}
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z" />
            </svg>
            Quy tắc khi quay với Bà Tuyết
          </div>
          <ul className="checklist">
            <li>
              <strong>Bà nói bằng lời của bà</strong> — không đưa kịch bản bắt
              bà đọc
            </li>
            <li>
              <strong>Không hỏi</strong> chuyện kinh doanh, công ty, chuyện nội
              bộ hoặc chuyện cũ
            </li>
            <li>
              <strong>Không xin bà cam kết</strong> hoặc hứa hẹn gì trước máy
              quay
            </li>
            <li>
              Bà Tuyết là người kể chuyện, không phải phát ngôn viên doanh nghiệp
            </li>
          </ul>
        </div>

        <div className="card">
          <div className="card-title">🤝 Collab KOL với KOL</div>
          <p style={{ fontSize: "14px" }}>
            Đàm Đức, Hải Đăng và các KOL/KOC khác cũng có mặt tại booth. Muốn
            collab chéo, liên hệ đầu mối booking để sắp lịch.
          </p>
        </div>

        <div className="alert alert-info" style={{ marginTop: "12px" }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          <div>
            Nếu bạn có hợp đồng hoặc thỏa thuận affiliate, gửi bản dựng về
            Thảo/Tuyên trước khi đăng nhé. Team phản hồi trong vòng 4 giờ.
          </div>
        </div>
      </section>

      {/* ─── 6. CONTENT KIT ─── */}
      <div className="section-divider"></div>
      <section className="section" id="contentkit">
        <div className="section-header">
          <span className="section-num">6</span>
          <h2 className="section-title">Content Kit</h2>
        </div>

        <div className="card">
          <div className="card-title"># Hashtag & Tag</div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginBottom: "10px",
            }}
          >
            <span className="badge badge-amber">#Ancungbatuyet</span>
            <span className="badge badge-amber">#acbtfoodfest</span>
            <span className="badge badge-red">#tiktokfoodfest</span>
          </div>
          <p style={{ fontSize: "14px" }}>
            <strong>Tag tài khoản:</strong> @ancungbatuyet86 (TikTok chính) +
            tài khoản TikTok Food Fest của BTC
          </p>
        </div>

        <div className="card">
          <div className="card-title">📝 Thông điệp chính</div>
          <p style={{ fontSize: "14px", marginBottom: "8px" }}>
            ACBT tham gia Food Fest để mọi người biết đến thương hiệu,{" "}
            <strong>không phải để chốt đơn</strong>. 3 thông điệp gợi ý:
          </p>
          <ol
            style={{
              fontSize: "14px",
              paddingLeft: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <li>&ldquo;Ăn vặt thì phải ăn cùng Bà Tuyết&rdquo; — slogan chính</li>
            <li>Đồ ăn vặt Việt Nam — ngon, an toàn, rõ nguồn gốc</li>
            <li>Trải nghiệm vui, gần gũi, không chỉ là ăn mà là kết nối</li>
          </ol>
        </div>

        <div className="card">
          <div className="card-title">📸 Góc máy & ánh sáng</div>
          <ul className="checklist">
            <li>Booth có backdrop chính — góc chụp/quay tốt nhất ở mặt trước</li>
            <li>
              Ánh sáng tự nhiên tốt nhất: buổi sáng và chiều muộn (tránh 11h–14h
              nắng gắt)
            </li>
            <li>
              Khu vực gắp chân gà có setup bàn riêng — background sạch, đủ sáng
            </li>
          </ul>
        </div>

        <div className="alert alert-info" style={{ marginTop: "12px" }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          <div>
            Nội dung hợp tác trả phí nên gắn nhãn &ldquo;Hợp tác&rdquo; hoặc &ldquo;Quảng cáo&rdquo;
            theo quy định TikTok. Nội dung tự nguyện chia sẻ thì không cần.
          </div>
        </div>
      </section>

      {/* ─── 7. LỊCH TRÌNH ─── */}
      <div className="section-divider"></div>
      <section className="section" id="lichtrinh">
        <div className="section-header">
          <span className="section-num">7</span>
          <h2 className="section-title">Lịch trình 2 ngày</h2>
        </div>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "day1" ? "active" : ""}`}
            onClick={() => setActiveTab("day1")}
          >
            Thứ Năm 25/09
          </button>
          <button
            className={`tab-btn ${activeTab === "day2" ? "active" : ""}`}
            onClick={() => setActiveTab("day2")}
          >
            Thứ Sáu 26/09
          </button>
        </div>

        {activeTab === "day1" && (
          <div id="day1" className="tab-content active">
            <div className="tl-item">
              <span className="tl-time">09:00</span>
              <div className="tl-desc">
                <strong>Mở cổng sự kiện</strong>
                <div className="tl-note">
                  Bắt đầu đón khách. Gian hàng vận hành.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <span className="tl-time">09:00–12:00</span>
              <div className="tl-desc">
                <strong>Slot KOL buổi sáng</strong>
                <div className="tl-note">
                  Check-in, trải nghiệm booth, quay collab (theo lịch đăng ký)
                </div>
              </div>
            </div>
            <div className="tl-item">
              <span className="tl-time">12:00–14:00</span>
              <div className="tl-desc">
                <strong>Giờ cao điểm</strong>
                <div className="tl-note">
                  Lượng khách đông. Tránh quay nếu muốn góc thoáng.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <span className="tl-time">14:00–17:00</span>
              <div className="tl-desc">
                <strong>Slot KOL buổi chiều</strong>
                <div className="tl-note">
                  Ánh sáng tốt cho quay ngoài trời. Collab slot chiều.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <span className="tl-time">17:00–22:00</span>
              <div className="tl-desc">
                <strong>Buổi tối — Đại nhạc hội</strong>
                <div className="tl-note">
                  Sân khấu chính hoạt động. Quay thưởng giải vàng & vé fan zone.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <span className="tl-time">22:00</span>
              <div className="tl-desc">
                <strong>Đóng cổng</strong>
                <div className="tl-note">
                  Toàn bộ khách và nhân sự rời khu vực. Mở lại 8:00 sáng hôm
                  sau.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "day2" && (
          <div id="day2" className="tab-content active">
            <div className="tl-item">
              <span className="tl-time">09:00</span>
              <div className="tl-desc">
                <strong>Mở cổng ngày 2</strong>
                <div className="tl-note">
                  Tiếp tục đón khách. Gian hàng vận hành.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <span className="tl-time">09:00–12:00</span>
              <div className="tl-desc">
                <strong>Slot KOL buổi sáng</strong>
                <div className="tl-note">
                  Các KOL chưa đến ngày 1 check-in tại đây.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <span className="tl-time">12:00–14:00</span>
              <div className="tl-desc">
                <strong>Giờ cao điểm</strong>
                <div className="tl-note">
                  Ngày cuối — lượng khách có thể đông hơn ngày 1.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <span className="tl-time">14:00–17:00</span>
              <div className="tl-desc">
                <strong>Slot KOL buổi chiều</strong>
                <div className="tl-note">
                  Cơ hội cuối để collab và quay nội dung.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <span className="tl-time">17:00–22:00</span>
              <div className="tl-desc">
                <strong>Buổi tối — Đại nhạc hội</strong>
                <div className="tl-note">
                  Chương trình âm nhạc chính. Quay thưởng giải thưởng cuối cùng.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <span className="tl-time">22:00</span>
              <div className="tl-desc">
                <strong>Kết thúc sự kiện</strong>
                <div className="tl-note">
                  Hẹn gặp lại ở những sự kiện tiếp theo!
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="alert alert-warn" style={{ marginTop: "12px" }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z" />
          </svg>
          <div>
            <strong>Lưu ý thời tiết:</strong> Cuối tháng 9, TP.HCM thường có mưa
            chiều/tối. Sự kiện ngoài trời — mang áo mưa/ô và chuẩn bị phương án B
            cho thiết bị quay.
          </div>
        </div>
      </section>

      {/* ─── 9. SAU SỰ KIỆN ─── */}
      <div className="section-divider"></div>
      <section className="section" id="sausukien">
        <div className="section-header">
          <span className="section-num">9</span>
          <h2 className="section-title">Sau sự kiện</h2>
        </div>

        <div className="card">
          <div className="card-title">📤 Đăng bài</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nhóm</th>
                  <th>Nghĩa vụ</th>
                  <th>Duyệt trước</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="badge badge-red">A</span> Có hợp đồng
                  </td>
                  <td>Theo hợp đồng (số video, deadline)</td>
                  <td>Có — gửi bản dựng trước khi đăng</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-amber">B</span> Affiliate
                  </td>
                  <td>Theo thỏa thuận, gắn giỏ hàng</td>
                  <td>Có — nội dung sản phẩm</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-teal">C</span> Khách mời
                  </td>
                  <td>Không bắt buộc</td>
                  <td>Không — nhưng áp dụng mục &ldquo;Không nên&rdquo;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-title">📷 Nhận ảnh/video hậu trường</div>
          <p style={{ fontSize: "14px" }}>
            Team truyền thông ACBT sẽ quay ảnh/video tại sự kiện. Link Google
            Drive sẽ được gửi qua đầu mối trong vòng 3 ngày sau sự kiện.
          </p>
        </div>

        <div className="card">
          <div className="card-title">💬 Góp ý</div>
          <p style={{ fontSize: "14px" }}>
            Sau sự kiện, chúng tôi sẽ gửi form góp ý ngắn (3 câu hỏi). Phản hồi
            của bạn giúp chúng tôi tổ chức tốt hơn cho lần sau — và là cơ sở để
            mời bạn hợp tác trong các chiến dịch tiếp theo.
          </p>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <div className="section-divider"></div>
      <section className="section" id="faq">
        <div className="section-header">
          <span className="section-num">?</span>
          <h2 className="section-title">Câu hỏi thường gặp</h2>
        </div>

        <div className="card" style={{ padding: "0 16px" }}>
          <details>
            <summary>Đến muộn hơn giờ đăng ký thì sao?</summary>
            <div className="faq-body">
              Vẫn được check-in bình thường. Tuy nhiên, slot collab với Bà Tuyết
              có giới hạn thời gian — nếu đến muộn có thể mất slot. Liên hệ đầu
              mối ngay khi biết sẽ đến muộn.
            </div>
          </details>
          <details>
            <summary>Có thể đi cùng bạn bè không?</summary>
            <div className="faq-body">
              Được. Tuy nhiên, chỉ người có thư mời mới nhận được quà khách mời
              và tham gia các hoạt động dành riêng cho KOL. Người đi cùng vẫn có
              thể vào sự kiện và trải nghiệm gian hàng như khách tham quan thông
              thường.
            </div>
          </details>
          <details>
            <summary>Không có thư mời, có vào booth ACBT được không?</summary>
            <div className="faq-body">
              Có. Bất kỳ ai tham dự sự kiện đều có thể ghé thăm booth ACBT và
              trải nghiệm sản phẩm. Thư mời là điều kiện để nhận quà và tham gia
              slot collab ưu tiên.
            </div>
          </details>
          <details>
            <summary>Trúng giải nhưng đã về rồi thì sao?</summary>
            <div className="faq-body">
              Liên hệ ngay đầu mối KOL. Chúng tôi sẽ sắp xếp phương án nhận giải
              phù hợp. Cần có CCCD/CMND để làm thủ tục.
            </div>
          </details>
          <details>
            <summary>Có bắt buộc đăng bài không?</summary>
            <div className="faq-body">
              Nếu bạn là <strong>khách mời (nhóm C)</strong>: không bắt buộc,
              hoàn toàn tự nguyện. Nếu có{" "}
              <strong>hợp đồng hoặc thỏa thuận affiliate (nhóm A/B)</strong>: theo
              cam kết trong hợp đồng/thỏa thuận.
            </div>
          </details>
          <details>
            <summary>Trời mưa thì sao?</summary>
            <div className="faq-body">
              Booth ACBT có mái che. Sự kiện vẫn diễn ra trong điều kiện mưa nhẹ.
              Mang áo mưa/ô để di chuyển giữa các gian hàng. Nếu mưa lớn bất
              thường, BTC sẽ thông báo phương án.
            </div>
          </details>
          <details>
            <summary>Muốn hợp tác lâu dài với ACBT?</summary>
            <div className="faq-body">
              Liên hệ đầu mối booking KOL/KOC tại mục &ldquo;Liên hệ&rdquo; bên dưới. Chúng
              tôi luôn tìm kiếm những người sáng tạo nội dung phù hợp với giá trị
              thương hiệu.
            </div>
          </details>
          <details>
            <summary>Taste Hunt là gì?</summary>
            <div className="faq-body">
              Trò chơi xuyên suốt sự kiện của BTC: nhận Thẻ nhiệm vụ, ghé các
              gian hàng tham gia hoạt động → được đóng 01 dấu/booth. Mỗi 5 dấu =
              1 phần quà tại Quầy Đổi Quà. Mỗi 5 sticker Vịt = 1 phần quà đặc
              biệt.
            </div>
          </details>
        </div>
      </section>

      {/* ─── LIÊN HỆ ─── */}
      <div className="section-divider"></div>
      <section className="section" id="lienhe">
        <div className="section-header">
          <span className="section-num" style={{ background: "var(--navy)" }}>
            ☎
          </span>
          <h2 className="section-title">Liên hệ</h2>
        </div>

        <p
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            marginBottom: "12px",
          }}
        >
          Ghi theo vai trò. Gọi hoặc nhắn Zalo cho đúng người:
        </p>

        <div className="contact-card">
          <div className="contact-info">
            <div className="contact-role">Booking KOL/KOC</div>
            <div className="contact-name">Thảo / Tuyên</div>
          </div>
          <div className="contact-phone">Liên hệ qua Zalo</div>
        </div>
        <div className="contact-card">
          <div className="contact-info">
            <div className="contact-role">Giám đốc Truyền thông</div>
            <div className="contact-name">Hạ Hồng Việt</div>
          </div>
          <div className="contact-phone">Liên hệ trực tiếp</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>
          <strong>Ăn Cùng Bà Tuyết</strong> — &ldquo;Ăn vặt thì phải ăn cùng Bà
          Tuyết&rdquo;
        </p>
        <p style={{ marginTop: "4px" }}>
          TikTok Food Fest 2026 — Gold Sponsor
        </p>
        <p style={{ marginTop: "8px", fontSize: "11px" }}>
          Tài liệu nội bộ dành cho KOL/KOC. Không phổ biến đại trà.
        </p>
      </footer>

      {/* FLOAT CTA */}
      <div className="float-cta">
        <button
          className="back-top"
          onClick={scrollToTop}
          aria-label="Lên đầu trang"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="20"
            height="20"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
