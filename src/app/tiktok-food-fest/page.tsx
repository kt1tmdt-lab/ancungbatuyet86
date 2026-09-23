"use client";

import React, { useState, useEffect } from "react";
import "./kol-handbook.css";

export default function TikTokFoodFestPage() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"day1" | "day2">("day1");
  const [mounted, setMounted] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

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

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  return (
    <div className="kol-handbook-container">
      {/* TOPBAR */}
      <header className="topbar-wrapper">
        <div className="topbar-inner">
          <a
            href="https://acbt.vn/tiktok-food-fest#top"
            onClick={(e) => handleAnchorClick(e, "top")}
            className="topbar-brand"
          >
            <span className="brand-badge">ACBT</span>
            <div className="brand-text">
              Ăn Cùng Bà Tuyết
              <span className="brand-tag">Gold Sponsor</span>
            </div>
          </a>

          <div className="topbar-actions">
            <button
              className="menu-toggle-btn"
              onClick={() => setIsNavOpen(true)}
              aria-label="Mở danh mục điều hướng"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                width="18"
                height="18"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
              <span>Mục lục</span>
            </button>
          </div>
        </div>
      </header>

      {/* DRAWER MENU */}
      <div id="navDrawer" className={`nav-drawer ${isNavOpen ? "open" : ""}`}>
        <div
          className="nav-overlay"
          onClick={() => setIsNavOpen(false)}
        ></div>
        <div className="nav-panel">
          <div className="nav-header">
            <span className="nav-header-title">Cẩm Nang KOL / KOC</span>
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
                width="20"
                height="20"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="nav-links-list">
            <a
              href="https://acbt.vn/tiktok-food-fest#truockhi"
              className="nav-link-item"
              onClick={(e) => handleAnchorClick(e, "truockhi")}
            >
              <span className="nav-link-num">1</span>
              <span>Trước khi đến</span>
            </a>
            <a
              href="https://acbt.vn/tiktok-food-fest#checkin"
              className="nav-link-item"
              onClick={(e) => handleAnchorClick(e, "checkin")}
            >
              <span className="nav-link-num">2</span>
              <span>Check-in tại booth</span>
            </a>
            <a
              href="https://acbt.vn/tiktok-food-fest#trainghiem"
              className="nav-link-item"
              onClick={(e) => handleAnchorClick(e, "trainghiem")}
            >
              <span className="nav-link-num">3</span>
              <span>Hành trình trải nghiệm</span>
            </a>
            <a
              href="https://acbt.vn/tiktok-food-fest#quatang"
              className="nav-link-item"
              onClick={(e) => handleAnchorClick(e, "quatang")}
            >
              <span className="nav-link-num">4</span>
              <span>Quà tặng & Giải thưởng</span>
            </a>
            <a
              href="https://acbt.vn/tiktok-food-fest#collab"
              className="nav-link-item"
              onClick={(e) => handleAnchorClick(e, "collab")}
            >
              <span className="nav-link-num">5</span>
              <span>Quay collab</span>
            </a>
            <a
              href="https://acbt.vn/tiktok-food-fest#contentkit"
              className="nav-link-item"
              onClick={(e) => handleAnchorClick(e, "contentkit")}
            >
              <span className="nav-link-num">6</span>
              <span>Content Kit</span>
            </a>
            <a
              href="https://acbt.vn/tiktok-food-fest#lichtrinh"
              className="nav-link-item"
              onClick={(e) => handleAnchorClick(e, "lichtrinh")}
            >
              <span className="nav-link-num">7</span>
              <span>Lịch trình 2 ngày</span>
            </a>
            <a
              href="https://acbt.vn/tiktok-food-fest#sausukien"
              className="nav-link-item"
              onClick={(e) => handleAnchorClick(e, "sausukien")}
            >
              <span className="nav-link-num">8</span>
              <span>Sau sự kiện</span>
            </a>
            <a
              href="https://acbt.vn/tiktok-food-fest#faq"
              className="nav-link-item"
              onClick={(e) => handleAnchorClick(e, "faq")}
            >
              <span className="nav-link-num">?</span>
              <span>Câu hỏi thường gặp</span>
            </a>
            <a
              href="https://acbt.vn/tiktok-food-fest#lienhe"
              className="nav-link-item"
              onClick={(e) => handleAnchorClick(e, "lienhe")}
            >
              <span className="nav-link-num">☎</span>
              <span>Đầu mối liên hệ</span>
            </a>
          </nav>
        </div>
      </div>

      {/* CENTERED LUMINOUS SHELL */}
      <main className="kol-shell">
        {/* HERO SECTION */}
        <section className="hero-section" id="top">
          <div className="hero-logo-frame">
            <img
              src="/tiktok-food-fest/images/logo-acbt.png"
              alt="Logo Ăn Cùng Bà Tuyết"
              className="hero-logo-img"
            />
          </div>

          <div>
            <span className="hero-eyebrow-chip">✨ Cẩm nang KOL / KOC chính thức</span>
          </div>

          <h1 className="hero-heading">
            Chào mừng bạn đến với
            <br />
            <em>Ăn Cùng Bà Tuyết</em>
          </h1>

          <p className="hero-subtitle">
            TikTok Food Fest 2026 — &ldquo;Food As a Love Language&rdquo;
          </p>

          {/* META CHIPS */}
          <div className="meta-chips-grid">
            <div className="meta-chip-card">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span>25–26/09/2026</span>
            </div>

            <div className="meta-chip-card">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>09:00 – 22:00</span>
            </div>

            <div className="meta-chip-card">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Công viên Bờ Sông, Thủ Thiêm</span>
            </div>

            <div className="meta-chip-card">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a4 4 0 00-8 0v2" />
              </svg>
              <span>Gian hàng VIP 7×7m</span>
            </div>
          </div>

          {/* BRIGHT CELEBRATION COUNTDOWN BOARD */}
          <div className="countdown-container-bright">
            <div className="countdown-status-badge">
              <span className="pulse-dot"></span>
              <span>Đang đếm ngược đến giờ khai mạc</span>
            </div>

            {countdown.isLive ? (
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "var(--coral-deep)",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                🎉 Sự kiện đang diễn ra sôi nổi tại gian hàng Ăn Cùng Bà Tuyết!
              </div>
            ) : (
              <div className="countdown-grid-bright">
                <div className="countdown-box-bright">
                  <span className="countdown-val-bright">
                    {mounted ? countdown.days : "0"}
                  </span>
                  <span className="countdown-unit-bright">Ngày</span>
                </div>
                <div className="countdown-box-bright">
                  <span className="countdown-val-bright">
                    {mounted ? countdown.hours : "00"}
                  </span>
                  <span className="countdown-unit-bright">Giờ</span>
                </div>
                <div className="countdown-box-bright">
                  <span className="countdown-val-bright">
                    {mounted ? countdown.minutes : "00"}
                  </span>
                  <span className="countdown-unit-bright">Phút</span>
                </div>
                <div className="countdown-box-bright">
                  <span className="countdown-val-bright">
                    {mounted ? countdown.seconds : "00"}
                  </span>
                  <span className="countdown-unit-bright">Giây</span>
                </div>
              </div>
            )}
          </div>

          {/* HERO MEDIA */}
          <div className="hero-media-wrapper">
            <div className="media-card">
              <img
                src="/tiktok-food-fest/images/3d-map.png"
                alt="Sơ đồ 3D TikTok Food Fest 2026"
                className="media-img"
              />
              <p className="media-caption">
                🗺️ Sơ đồ 3D khu vực sự kiện — Booth ACBT nằm góc trái phía trên
                (gần sân khấu chính)
              </p>
            </div>

            <div className="media-card">
              <img
                src="/tiktok-food-fest/images/event-intro.png"
                alt="TikTok Food Fest 2026 — Food As A Love Language"
                className="media-img"
              />
            </div>
          </div>
        </section>

        {/* ─── 1. TRƯỚC KHI ĐẾN ─── */}
        <section className="content-section" id="truockhi">
          <div className="section-head">
            <div className="section-badge-icon">1</div>
            <div className="section-title-wrap">
              <h2 className="section-main-title">Trước khi đến</h2>
              <p className="section-sub-title">
                Chuẩn bị xác nhận và hành trang tham dự
              </p>
            </div>
          </div>

          <div className="pro-card">
            <div className="pro-card-title">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </svg>
              <span>Xác nhận tham dự sự kiện</span>
            </div>
            <p
              style={{
                fontSize: "14.5px",
                marginBottom: "12px",
                color: "var(--text-secondary)",
              }}
            >
              Vui lòng xác nhận trước <strong>23:59 ngày 24/09</strong> qua đầu
              mối KOL của bạn với các thông tin:
            </p>
            <ul className="pro-checklist">
              <li>
                Ngày tham dự: 25/09, 26/09 hoặc cả hai ngày
              </li>
              <li>
                Khung giờ dự kiến bạn sẽ ghé thăm booth ACBT
              </li>
              <li>
                Số lượng người đi cùng bạn (nếu có)
              </li>
            </ul>
          </div>

          <div className="pro-card">
            <div className="pro-card-title">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <path d="M12 18h.01" />
              </svg>
              <span>Hành trang cần mang theo</span>
            </div>
            <ul className="pro-checklist">
              <li>
                <strong>Thư mời / Mã QR định danh</strong> — Điều kiện bắt buộc
                để nhận quà độc quyền
              </li>
              <li>
                <strong>CCCD / CMND bản gốc</strong> — Bắt buộc để nhận giải nếu
                trúng quà tặng giá trị cao
              </li>
              <li>
                Điện thoại sạc đầy pin + sạc dự phòng dung lượng cao
              </li>
              <li>
                Micro cài áo (để thu âm chất lượng tốt khi quay video collab)
              </li>
            </ul>
          </div>

          <div className="pro-alert pro-alert-warn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z" />
            </svg>
            <div>
              <strong>Gợi ý trang phục:</strong> Nên chọn trang phục tông sáng
              tươi tắn (tránh đồ quá sẫm vì booth ACBT có backdrop màu nổi bật). Sự
              kiện ngoài trời cuối tháng 9 thường có mưa chiều nhẹ — bạn nên
              chuẩn bị sẵn ô nhỏ.
            </div>
          </div>

          <div className="pro-card">
            <div className="pro-card-title">
              <span>🚫 Vật dụng không được mang vào sự kiện</span>
            </div>
            <img
              src="/tiktok-food-fest/images/prohibited-items.png"
              alt="Vật dụng không được mang vào sự kiện"
              style={{
                width: "100%",
                borderRadius: "var(--radius-md)",
                marginTop: "6px",
              }}
            />
          </div>

          <div className="pro-card">
            <div className="pro-card-title">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Chỉ dẫn di chuyển & Đỗ xe</span>
            </div>
            <div className="pro-info-row">
              <span className="pro-info-label">Địa chỉ</span>
              <span className="pro-info-val">
                <a
                  href="https://maps.app.goo.gl/zAyN7qVrHQGfnmU88"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--coral-deep)",
                    fontWeight: 700,
                    textDecoration: "underline",
                  }}
                >
                  Công viên Bờ Sông Sài Gòn
                </a>
                , Phường An Khánh, TP. Thủ Đức, TP.HCM
              </span>
            </div>
            <div className="pro-info-row">
              <span className="pro-info-label">Đậu xe</span>
              <span className="pro-info-val">
                Đường N12 hoặc Nguyễn Thiện Thành, An Khánh (
                <em>Xe không vào được bên trong khuôn viên lễ hội</em>).
              </span>
            </div>
            <div className="pro-info-row">
              <span className="pro-info-label">Lưu ý</span>
              <span className="pro-info-val">
                Phương tiện bốc dỡ hàng hóa dừng tại bãi xe, di chuyển thủ công
                vào khu vực sự kiện.
              </span>
            </div>
          </div>
        </section>

        {/* ─── 2. CHECK-IN TẠI BOOTH ─── */}
        <section className="content-section" id="checkin">
          <div className="section-head">
            <div className="section-badge-icon">2</div>
            <div className="section-title-wrap">
              <h2 className="section-main-title">Check-in tại booth ACBT</h2>
              <p className="section-sub-title">
                Quy trình 4 bước tiếp đón chuyên nghiệp dành cho KOL
              </p>
            </div>
          </div>

          <div className="flow-grid">
            <div className="flow-card">
              <div className="flow-step-pill">1</div>
              <div className="flow-card-title">Vào cổng sự kiện</div>
              <div className="flow-card-desc">
                Cổng mở từ 09:00. Vui lòng đeo thẻ định danh suốt thời gian tham
                dự.
              </div>
            </div>

            <div className="flow-card">
              <div className="flow-step-pill">2</div>
              <div className="flow-card-title">Đến booth ACBT</div>
              <div className="flow-card-desc">
                Gian hàng 7×7m nằm gần sân khấu chính và khu VIP Lounge. Nhân
                viên sẽ đón tại lối vào.
              </div>
            </div>

            <div className="flow-card">
              <div className="flow-step-pill">3</div>
              <div className="flow-card-title">Check-in bàn VIP</div>
              <div className="flow-card-desc">
                Xuất trình thư mời hoặc mã QR → nhận vòng tay KOL → nhận diện
                quyền lợi.
              </div>
            </div>

            <div className="flow-card">
              <div className="flow-step-pill">4</div>
              <div className="flow-card-title">Hướng dẫn trải nghiệm</div>
              <div className="flow-card-desc">
                Nhân viên giới thiệu các trạm trải nghiệm và sắp xếp khung giờ
                collab ưu tiên.
              </div>
            </div>
          </div>

          <div className="pro-alert pro-alert-info">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            <div>
              <strong>Đầu mối đón tiếp trực tiếp:</strong> Đội ngũ Ban Truyền
              thông ACBT sẽ đón bạn tận nơi. Khi tới booth, vui lòng liên hệ bạn{" "}
              <strong>Thảo (Booking KOL)</strong> để được hỗ trợ nhanh nhất.
            </div>
          </div>
        </section>

        {/* ─── 3. HÀNH TRÌNH TRẢI NGHIỆM (BENTO GRID TƯƠI SÁNG) ─── */}
        <section className="content-section" id="trainghiem">
          <div className="section-head">
            <div className="section-badge-icon gold">3</div>
            <div className="section-title-wrap">
              <h2 className="section-main-title">Hành trình trải nghiệm</h2>
              <p className="section-sub-title">
                Khám phá 6 trạm tương tác đặc sắc tại gian hàng Ăn Cùng Bà Tuyết
              </p>
            </div>
          </div>

          <div className="bento-grid">
            {/* Trạm 1 */}
            <div className="bento-card">
              <div>
                <div className="bento-card-header">
                  <span className="station-pill pink">Trạm 1</span>
                  <span style={{ fontSize: "22px" }}>🎁</span>
                </div>
                <div className="bento-title">Nhận quà khách mời</div>
                <p className="bento-desc">
                  Mỗi KOL có thư mời và hoàn tất check-in sẽ nhận ngay 01 phần quà
                  đặc biệt của Bà Tuyết (01 phần duy nhất/người).
                </p>
              </div>
            </div>

            {/* Trạm 2 */}
            <div className="bento-card">
              <div>
                <div className="bento-card-header">
                  <span className="station-pill orange">Trạm 2</span>
                  <span style={{ fontSize: "22px" }}>🍗</span>
                </div>
                <div className="bento-title">Thử vị sản phẩm đặc trưng</div>
                <p className="bento-desc">
                  Trải nghiệm trực tiếp các món ăn vặt quốc dân nức tiếng, được
                  chế biến vệ sinh và đóng gói chuẩn vị:
                </p>
              </div>
              <div className="bento-tag-row">
                <span className="food-pill-tag">Chân gà rút xương</span>
                <span className="food-pill-tag">Chân gà khổng lồ</span>
                <span className="food-pill-tag">Tăm cay Bà Tuyết</span>
              </div>
            </div>

            {/* Trạm 3: MÁY GẮP CHÂN GÀ (VIP HIGHLIGHT ĐỎ SAN HÔ) */}
            <div className="bento-card highlight-red">
              <div>
                <div className="bento-card-header">
                  <span className="station-pill red">Trạm 3 • Độc quyền</span>
                  <span style={{ fontSize: "26px" }}>🎯</span>
                </div>
                <div className="bento-title" style={{ color: "var(--coral-deep)" }}>
                  Máy gắp chân gà Bà Tuyết
                </div>
                <p className="bento-desc">
                  Chiếc máy gắp thú quen thuộc nhưng bên trong chứa đầy các gói
                  chân gà Bà Tuyết! Thử vận may, quay video bắt trend và rinh
                  chiến lợi phẩm về nhà.
                </p>
              </div>
              <div
                style={{
                  marginTop: "16px",
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "var(--coral-deep)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                ★ Góc quay video hút triệu view
              </div>
            </div>

            {/* Trạm 4: QUAY THƯỞNG VÀNG 9999 (VIP HIGHLIGHT VÀNG NẮNG) */}
            <div className="bento-card highlight-gold">
              <div>
                <div className="bento-card-header">
                  <span className="station-pill gold">Trạm 4 • Đại giải thưởng</span>
                  <span style={{ fontSize: "26px" }}>🏆</span>
                </div>
                <div className="bento-title" style={{ color: "#B45309" }}>
                  Vòng quay may mắn — Vàng 9999
                </div>
                <p className="bento-desc">
                  Cơ hội trúng <strong>vàng miếng 9999</strong> giá trị cao cùng{" "}
                  <strong>vé VIP Fan Zone</strong> xem trực tiếp Đại nhạc hội
                  sân khấu chính!
                </p>
              </div>
              <div
                style={{
                  marginTop: "16px",
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#B45309",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                ★ Giải thưởng lớn nhất lễ hội
              </div>
            </div>

            {/* Trạm 5 */}
            <div className="bento-card">
              <div>
                <div className="bento-card-header">
                  <span className="station-pill purple">Trạm 5</span>
                  <span style={{ fontSize: "22px" }}>🎬</span>
                </div>
                <div className="bento-title">Studio Collab Bà Tuyết</div>
                <p className="bento-desc">
                  Quay video trực tiếp cùng Bà Tuyết và các Hot TikToker như
                  Đàm Đức, Hải Đăng. Xem chi tiết tại mục 5.
                </p>
              </div>
            </div>

            {/* Trạm 6 */}
            <div className="bento-card">
              <div>
                <div className="bento-card-header">
                  <span className="station-pill blue">Trạm 6</span>
                  <span style={{ fontSize: "22px" }}>🎪</span>
                </div>
                <div className="bento-title">Khám phá TikTok Food Fest</div>
                <p className="bento-desc">
                  Tham gia hoạt động <strong>Taste Hunt</strong> thu thập 5 dấu
                  nhận quà và khám phá hơn 30 thương hiệu F&B lớn (Omachi, Chinsu,
                  Milo, KitKat, TH True Milk...).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4. QUÀ TẶNG & GIẢI THƯỞNG ─── */}
        <section className="content-section" id="quatang">
          <div className="section-head">
            <div className="section-badge-icon gold">4</div>
            <div className="section-title-wrap">
              <h2 className="section-main-title">Quà tặng & Giải thưởng</h2>
              <p className="section-sub-title">
                Cơ cấu giải thưởng và điều kiện nhận quà
              </p>
            </div>
          </div>

          <div className="pro-card">
            <div className="pro-card-title">
              <span>🎁 Phần quà tiếp đón dành cho KOL</span>
            </div>
            <div className="pro-info-row">
              <span className="pro-info-label">Điều kiện</span>
              <span className="pro-info-val">
                Có thư mời và đã check-in thành công tại bàn tiếp đón booth ACBT
              </span>
            </div>
            <div className="pro-info-row">
              <span className="pro-info-label">Địa điểm nhận</span>
              <span className="pro-info-val">
                Bàn lễ tân booth ACBT ngay sau khi xác nhận
              </span>
            </div>
            <div className="pro-info-row">
              <span className="pro-info-label">Định mức</span>
              <span className="pro-info-val">
                01 phần quà cao cấp / mỗi khách mời
              </span>
            </div>
          </div>

          <div className="pro-card">
            <div className="pro-card-title">
              <span>🏅 Vàng 9999 từ Vòng Quay May Mắn</span>
            </div>
            <p
              style={{
                fontSize: "14.5px",
                color: "var(--text-secondary)",
                marginBottom: "12px",
              }}
            >
              Tham gia quay số may mắn tại booth để có cơ hội trúng vàng 9999
              nguyên chất được tài trợ bởi ACBT.
            </p>
            <div className="pro-alert pro-alert-warn" style={{ margin: 0 }}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z" />
              </svg>
              <div>
                <strong>Lưu ý nhận giải:</strong> Cần xuất trình CCCD/CMND gốc.
                Theo quy định pháp luật hiện hành, các giải thưởng trên 10 triệu
                đồng sẽ áp dụng khấu trừ thuế TNCN 10% phần vượt.
              </div>
            </div>
          </div>

          <div className="pro-card">
            <div className="pro-card-title">
              <span>🎵 Vé VIP Fan Zone Đại Nhạc Hội</span>
            </div>
            <p
              style={{
                fontSize: "14.5px",
                color: "var(--text-secondary)",
                marginBottom: "14px",
              }}
            >
              Vé đặc cách vào sát sân khấu chính để tận hưởng màn trình diễn bùng
              nổ của dàn nghệ sĩ hàng đầu trong khung giờ biểu diễn tối.
            </p>
            <img
              src="/tiktok-food-fest/images/lineup.png"
              alt="Line-up Đại nhạc hội TikTok Food Fest 2026"
              style={{ width: "100%", borderRadius: "var(--radius-md)" }}
            />
          </div>

          <p
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              textAlign: "center",
              marginTop: "16px",
              fontStyle: "italic",
            }}
          >
            * Quyết định của Ban tổ chức là quyết định cuối cùng trong mọi trường
            hợp phát sinh.
          </p>
        </section>

        {/* ─── 5. QUAY COLLAB ─── */}
        <section className="content-section" id="collab">
          <div className="section-head">
            <div className="section-badge-icon">5</div>
            <div className="section-title-wrap">
              <h2 className="section-main-title">Quay Collab cùng Bà Tuyết</h2>
              <p className="section-sub-title">
                Khung giờ, ý tưởng kịch bản và nguyên tắc bảo vệ hình ảnh
              </p>
            </div>
          </div>

          <div className="pro-card">
            <div className="pro-card-title">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span>Đăng ký khung giờ quay (Slot có giới hạn)</span>
            </div>
            <p style={{ fontSize: "14.5px", color: "var(--text-secondary)" }}>
              Do thời gian và sức khỏe của Bà Tuyết có hạn, các slot quay
              collab được bố trí theo danh sách đăng ký trước. Hãy báo sớm cho
              đầu mối booking để chốt khung giờ tối ưu nhất.
            </p>
          </div>

          <div className="pro-card">
            <div className="pro-card-title">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>4 Format gợi ý dễ viral</span>
            </div>
            <ul className="pro-checklist">
              <li>
                <strong>Thử thách gắp chân gà:</strong> Thi đấu tay đôi với Bà
                Tuyết xem ai gắp nhanh và nhiều hơn trên máy gắp.
              </li>
              <li>
                <strong>Blind Test / Reaction lần đầu:</strong> Quay biểu cảm chân
                thực khi lần đầu cắn miếng chân gà giòn cay đậm vị.
              </li>
              <li>
                <strong>Tour khám phá gian hàng:</strong> Dẫn khán giả dạo 1 vòng
                booth ACBT, trải nghiệm từ trạm ăn thử đến máy gắp.
              </li>
              <li>
                <strong>Bắt trend âm nhạc:</strong> Kết hợp cùng Bà Tuyết thực
                hiện các trend vũ đạo / sound TikTok đang thịnh hành.
              </li>
            </ul>
          </div>

          {/* WARM & FRIENDLY GUIDELINES FOR COLLAB */}
          <div className="warm-rules-card">
            <div className="warm-rules-header">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24"
                height="24"
                style={{ color: "#D97706" }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <h4>Nguyên tắc vàng khi quay cùng Bà Tuyết</h4>
            </div>
            <ul className="warm-rules-list">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>
                  <strong>Để Bà nói bằng phong cách tự nhiên:</strong> Hãy trò chuyện mộc mạc, gần gũi, không đưa kịch bản cứng ép Bà phải học thuộc.
                </span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>
                  <strong>Tôn trọng sự riêng tư:</strong> Không phỏng vấn chuyện đời tư, nội bộ công ty, tài chính hay các vấn đề nhạy cảm cũ.
                </span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>
                  <strong>Không xin cam kết trước máy quay:</strong> Bà Tuyết tham gia với vai trò người truyền cảm hứng và kể chuyện, không phải người phát ngôn chính thức của doanh nghiệp.
                </span>
              </li>
            </ul>
          </div>

          <div className="pro-card">
            <div className="pro-card-title">
              <span>🤝 Collab chéo cùng các Hot Creator</span>
            </div>
            <p style={{ fontSize: "14.5px", color: "var(--text-secondary)" }}>
              Các Creator như <strong>Đàm Đức, Hải Đăng</strong> và nhiều gương
              mặt quen thuộc khác cũng túc trực tại booth. Nếu muốn quay chéo, bạn
              chỉ cần báo với bạn Thảo/Tuyên để sắp xếp lịch phối hợp.
            </p>
          </div>
        </section>

        {/* ─── 6. CONTENT KIT ─── */}
        <section className="content-section" id="contentkit">
          <div className="section-head">
            <div className="section-badge-icon">6</div>
            <div className="section-title-wrap">
              <h2 className="section-main-title">Content Kit</h2>
              <p className="section-sub-title">
                Hashtags, thông điệp truyền thông và góc máy chuẩn
              </p>
            </div>
          </div>

          <div className="pro-card">
            <div className="pro-card-title">
              <span># Bộ Hashtag & Tag tài khoản</span>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "14px",
              }}
            >
              <span
                style={{
                  background: "#FEF3C7",
                  color: "#B45309",
                  border: "1px solid #FDE68A",
                  fontWeight: 800,
                  fontSize: "13px",
                  padding: "4px 14px",
                  borderRadius: "var(--radius-pill)",
                }}
              >
                #Ancungbatuyet
              </span>
              <span
                style={{
                  background: "#FFF7ED",
                  color: "#C2410C",
                  border: "1px solid #FFEDD5",
                  fontWeight: 800,
                  fontSize: "13px",
                  padding: "4px 14px",
                  borderRadius: "var(--radius-pill)",
                }}
              >
                #acbtfoodfest
              </span>
              <span
                style={{
                  background: "#FFF1F2",
                  color: "#E11D48",
                  border: "1px solid #FECDD3",
                  fontWeight: 800,
                  fontSize: "13px",
                  padding: "4px 14px",
                  borderRadius: "var(--radius-pill)",
                }}
              >
                #tiktokfoodfest
              </span>
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              <strong>Tag tài khoản chính:</strong>{" "}
              <code
                style={{
                  background: "#FFF1F2",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontWeight: 800,
                  color: "var(--coral-deep)",
                  border: "1px solid #FECDD3",
                }}
              >
                @ancungbatuyet86
              </code>{" "}
              (TikTok chính thức) + kênh TikTok Food Fest của Ban tổ chức.
            </p>
          </div>

          <div className="pro-card">
            <div className="pro-card-title">
              <span>📝 3 Thông điệp định hướng cốt lõi</span>
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                marginBottom: "12px",
              }}
            >
              ACBT tham dự ngày hội nhằm lan tỏa năng lượng tích cực và văn hóa ẩm
              thực đường phố sạch, <strong>hoàn toàn không đặt nặng việc bán hàng</strong>:
            </p>
            <ul className="pro-checklist">
              <li>
                <strong>&ldquo;Ăn vặt thì phải ăn cùng Bà Tuyết&rdquo;</strong> — Câu slogan quen thuộc khắc sâu trong tâm trí người hâm mộ.
              </li>
              <li>
                <strong>Đồ ăn vặt Việt Nam:</strong> Thơm ngon, an toàn, có chứng nhận kiểm định rõ nguồn gốc xuất xứ.
              </li>
              <li>
                <strong>Trải nghiệm kết nối:</strong> Không chỉ dừng lại ở ẩm thực mà là niềm vui sẻ chia cùng bạn bè và gia đình.
              </li>
            </ul>
          </div>

          <div className="pro-card">
            <div className="pro-card-title">
              <span>📸 Bí kíp góc máy & Ánh sáng</span>
            </div>
            <ul className="pro-checklist">
              <li>
                Mặt trước booth ACBT có backdrop thương hiệu nhận diện tốt nhất cho video cover/thumbnail.
              </li>
              <li>
                Khung giờ vàng ánh sáng tự nhiên đẹp: <strong>08:30 – 10:30</strong> và <strong>15:30 – 17:30</strong> (tránh giờ trưa gắt).
              </li>
              <li>
                Bàn máy gắp chân gà đã được bố trí đèn hắt sáng chuyên dụng giúp khung hình rõ nét và bắt mắt.
              </li>
            </ul>
          </div>
        </section>

        {/* ─── 7. LỊCH TRÌNH 2 NGÀY (SEGMENTED TIMELINE) ─── */}
        <section className="content-section" id="lichtrinh">
          <div className="section-head">
            <div className="section-badge-icon blue">7</div>
            <div className="section-title-wrap">
              <h2 className="section-main-title">Lịch trình 2 ngày chi tiết</h2>
              <p className="section-sub-title">
                Khung giờ hoạt động và các mốc thời gian quan trọng
              </p>
            </div>
          </div>

          {/* Segmented Control */}
          <div className="timeline-segment-tabs">
            <button
              className={`segment-btn ${activeTab === "day1" ? "active" : ""}`}
              onClick={() => setActiveTab("day1")}
            >
              Thứ Năm • 25/09/2026
            </button>
            <button
              className={`segment-btn ${activeTab === "day2" ? "active" : ""}`}
              onClick={() => setActiveTab("day2")}
            >
              Thứ Sáu • 26/09/2026
            </button>
          </div>

          {/* Timeline Stream */}
          <div className="timeline-stream">
            {activeTab === "day1" ? (
              <>
                <div className="timeline-item-card">
                  <span className="timeline-time-badge">09:00</span>
                  <div className="timeline-event-title">Mở cổng lễ hội ngày 1</div>
                  <div className="timeline-event-desc">
                    Khai mạc đón khách tham quan và vận hành các gian hàng ẩm thực.
                  </div>
                </div>

                <div className="timeline-item-card">
                  <span className="timeline-time-badge">09:00 – 12:00</span>
                  <div className="timeline-event-title">Khung giờ KOL buổi sáng</div>
                  <div className="timeline-event-desc">
                    Check-in tại bàn VIP, nhận quà tặng, thử món và quay video collab theo lịch đã chốt.
                  </div>
                </div>

                <div className="timeline-item-card">
                  <span className="timeline-time-badge">12:00 – 14:00</span>
                  <div className="timeline-event-title">Giờ cao điểm trưa</div>
                  <div className="timeline-event-desc">
                    Lượng khách tham quan đông đúc. Thích hợp ghi lại không khí sôi động hoặc nghỉ ngơi.
                  </div>
                </div>

                <div className="timeline-item-card">
                  <span className="timeline-time-badge">14:00 – 17:00</span>
                  <div className="timeline-event-title">Khung giờ KOL buổi chiều</div>
                  <div className="timeline-event-desc">
                    Ánh nắng dịu nhẹ thích hợp quay ngoại cảnh bờ sông, giao lưu và bắt trend cùng Bà Tuyết.
                  </div>
                </div>

                <div className="timeline-item-card">
                  <span className="timeline-time-badge">17:00 – 22:00</span>
                  <div className="timeline-event-title">Đại Nhạc Hội & Vòng Quay Vàng</div>
                  <div className="timeline-event-desc">
                    Sân khấu chính bùng nổ âm nhạc. Công bố người may mắn trúng vàng 9999 tại booth ACBT.
                  </div>
                </div>

                <div className="timeline-item-card">
                  <span className="timeline-time-badge">22:00</span>
                  <div className="timeline-event-title">Đóng cổng ngày 1</div>
                  <div className="timeline-event-desc">
                    Khép lại ngày đầu tiên, bảo dưỡng thiết bị chuẩn bị cho ngày 2.
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="timeline-item-card">
                  <span className="timeline-time-badge">09:00</span>
                  <div className="timeline-event-title">Mở cổng ngày 2</div>
                  <div className="timeline-event-desc">
                    Tiếp tục đón lượt khách mới và các bạn Creator ghé thăm ngày thứ hai.
                  </div>
                </div>

                <div className="timeline-item-card">
                  <span className="timeline-time-badge">09:00 – 12:00</span>
                  <div className="timeline-event-title">Check-in đợt 2</div>
                  <div className="timeline-event-desc">
                    Dành riêng cho các Creator bận ngày 1 hoặc muốn quay thêm nội dung trải nghiệm.
                  </div>
                </div>

                <div className="timeline-item-card">
                  <span className="timeline-time-badge">12:00 – 14:00</span>
                  <div className="timeline-event-title">Cao điểm ẩm thực</div>
                  <div className="timeline-event-desc">
                    Ngày lễ hội cuối cùng với lượng khách tham gia kỷ lục.
                  </div>
                </div>

                <div className="timeline-item-card">
                  <span className="timeline-time-badge">14:00 – 17:00</span>
                  <div className="timeline-event-title">Hoàn thiện nội dung & Giao lưu</div>
                  <div className="timeline-event-desc">
                    Cơ hội cuối cùng để chụp ảnh lưu niệm cùng ekip Ăn Cùng Bà Tuyết.
                  </div>
                </div>

                <div className="timeline-item-card">
                  <span className="timeline-time-badge">17:00 – 22:00</span>
                  <div className="timeline-event-title">Đêm chung kết Gala & Trao giải lớn</div>
                  <div className="timeline-event-desc">
                    Đêm nhạc cao trào nhất và lượt quay giải thưởng Vàng 9999 cuối cùng.
                  </div>
                </div>

                <div className="timeline-item-card">
                  <span className="timeline-time-badge">22:00</span>
                  <div className="timeline-event-title">Bế mạc sự kiện</div>
                  <div className="timeline-event-desc">
                    Gửi lời cảm ơn chân thành tới tất cả các bạn sáng tạo nội dung đã đồng hành!
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ─── 8. SAU SỰ KIỆN ─── */}
        <section className="content-section" id="sausukien">
          <div className="section-head">
            <div className="section-badge-icon">8</div>
            <div className="section-title-wrap">
              <h2 className="section-main-title">Sau sự kiện</h2>
              <p className="section-sub-title">
                Phân loại cam kết đăng bài, nhận tư liệu và gửi góp ý
              </p>
            </div>
          </div>

          <div className="tiers-grid">
            {/* Nhóm A */}
            <div className="tier-card">
              <span className="tier-badge tier-a">Nhóm A • Có hợp đồng</span>
              <h4>Creator có Hợp Đồng</h4>
              <div className="tier-detail-row">
                <strong>Nghĩa vụ:</strong> Thực hiện đúng số lượng video và
                deadline quy định trong hợp đồng đã ký.
              </div>
              <div className="tier-detail-row">
                <strong>Duyệt bài:</strong> Gửi bản dựng video trước khi đăng
                để team phản hồi (trong vòng 4 giờ).
              </div>
            </div>

            {/* Nhóm B */}
            <div className="tier-card">
              <span className="tier-badge tier-b">Nhóm B • Affiliate</span>
              <h4>Creator Hợp Tác Affiliate</h4>
              <div className="tier-detail-row">
                <strong>Nghĩa vụ:</strong> Đăng video theo thỏa thuận, gắn kèm
                giỏ hàng sản phẩm chính hãng.
              </div>
              <div className="tier-detail-row">
                <strong>Duyệt bài:</strong> Hỗ trợ kiểm tra thông tin sản phẩm
                và link giỏ hàng chính xác.
              </div>
            </div>

            {/* Nhóm C */}
            <div className="tier-card">
              <span className="tier-badge tier-c">Nhóm C • Khách mời</span>
              <h4>Khách Mời Tự Do</h4>
              <div className="tier-detail-row">
                <strong>Nghĩa vụ:</strong> Hoàn toàn tự nguyện, không ràng buộc
                nghĩa vụ phải đăng bài.
              </div>
              <div className="tier-detail-row">
                <strong>Lưu ý:</strong> Vui lòng áp dụng quy tắc tôn trọng hình
                ảnh Bà Tuyết khi chia sẻ nội dung.
              </div>
            </div>
          </div>

          <div className="pro-card">
            <div className="pro-card-title">
              <span>📷 Nhận ảnh & Video hậu trường chất lượng cao</span>
            </div>
            <p style={{ fontSize: "14.5px", color: "var(--text-secondary)" }}>
              Toàn bộ ảnh chụp và video hậu trường do nhiếp ảnh gia của ACBT thực
              hiện sẽ được tổng hợp vào link Google Drive và gửi đến bạn qua đầu
              mối Zalo trong vòng <strong>3 ngày</strong> sau khi sự kiện kết
              thúc.
            </p>
          </div>

          <div className="pro-card">
            <div className="pro-card-title">
              <span>💬 Form góp ý cải thiện (3 câu hỏi)</span>
            </div>
            <p style={{ fontSize: "14.5px", color: "var(--text-secondary)" }}>
              Sau sự kiện, ekip sẽ gửi bạn 1 biểu mẫu khảo sát ngắn. Ý kiến đóng
              góp quý báu của bạn sẽ giúp ACBT hoàn thiện khâu tổ chức và là cơ
              sở để ưu tiên mời bạn hợp tác trong những chiến dịch quy mô tiếp
              theo!
            </p>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="content-section" id="faq">
          <div className="section-head">
            <div className="section-badge-icon blue">?</div>
            <div className="section-title-wrap">
              <h2 className="section-main-title">Câu hỏi thường gặp (FAQ)</h2>
              <p className="section-sub-title">
                Giải đáp nhanh các thắc mắc phổ biến của Creator
              </p>
            </div>
          </div>

          <div className="faq-list">
            <details className="faq-accordion-item">
              <summary className="faq-summary">
                <span>Đến muộn hơn giờ đã đăng ký trước thì sao?</span>
                <svg
                  className="faq-chevron"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="faq-body-content">
                Bạn vẫn được check-in vào booth bình thường. Tuy nhiên, các khung
                giờ quay collab cùng Bà Tuyết có thể bị dời lại hoặc nhường cho
                bạn khác nếu kín lịch. Hãy nhắn ngay cho đầu mối khi biết mình sẽ
                đến muộn nhé.
              </div>
            </details>

            <details className="faq-accordion-item">
              <summary className="faq-summary">
                <span>Tôi có thể dẫn theo bạn bè hoặc trợ lý đi cùng không?</span>
                <svg
                  className="faq-chevron"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="faq-body-content">
                Hoàn toàn được! Tuy nhiên, chỉ người có thư mời đích danh mới
                nhận quà tặng tiếp đón và tham gia các đặc quyền quay collab.
                Người đi cùng có thể thoải mái tham quan và thưởng thức gian hàng
                như khách tham dự thông thường.
              </div>
            </details>

            <details className="faq-accordion-item">
              <summary className="faq-summary">
                <span>Không có thư mời, tôi có vào booth ACBT được không?</span>
                <svg
                  className="faq-chevron"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="faq-body-content">
                Có! Gian hàng mở cửa chào đón tất cả mọi người tới thưởng thức sản
                phẩm và trải nghiệm máy gắp chân gà. Thư mời chỉ là điều kiện cần
                để nhận phần quà độc quyền và slot quay video ưu tiên.
              </div>
            </details>

            <details className="faq-accordion-item">
              <summary className="faq-summary">
                <span>Nếu trúng thưởng vàng 9999 nhưng tôi đã về trước thì sao?</span>
                <svg
                  className="faq-chevron"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="faq-body-content">
                Liên hệ ngay với bạn phụ trách booking của bạn. Ekip ACBT sẽ đối
                soát thông tin và hướng dẫn phương án nhận giải trực tiếp tại văn
                phòng công ty. Vui lòng giữ lại tin nhắn trúng giải và CCCD/CMND.
              </div>
            </details>

            <details className="faq-accordion-item">
              <summary className="faq-summary">
                <span>Nếu trời đổ mưa lớn thì sự kiện có bị hủy không?</span>
                <svg
                  className="faq-chevron"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="faq-body-content">
                Gian hàng ACBT được trang bị mái che chắc chắn và hệ thống điện an
                toàn, chương trình vẫn diễn ra bình thường trong điều kiện mưa
                nhỏ. Trong trường hợp giông bão bất thường, Ban tổ chức TikTok
                sẽ thông báo phương án cụ thể qua loa phát thanh và thông báo
                chung.
              </div>
            </details>

            <details className="faq-accordion-item">
              <summary className="faq-summary">
                <span>Muốn hợp tác dài hạn cùng Ăn Cùng Bà Tuyết?</span>
                <svg
                  className="faq-chevron"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="faq-body-content">
                Bạn có thể trao đổi trực tiếp với Giám đốc Truyền thông hoặc đội
                ngũ booking tại mục &ldquo;Liên hệ&rdquo; bên dưới. ACBT luôn mở rộng vòng tay
                chào đón những người bạn sáng tạo nội dung văn minh, chân thực và
                nhiệt huyết!
              </div>
            </details>
          </div>
        </section>

        {/* ─── LIÊN HỆ ─── */}
        <section className="content-section" id="lienhe">
          <div className="section-head">
            <div className="section-badge-icon blue">☎</div>
            <div className="section-title-wrap">
              <h2 className="section-main-title">Đầu mối hỗ trợ khẩn cấp</h2>
              <p className="section-sub-title">
                Liên hệ đúng người theo từng nhu cầu cụ thể
              </p>
            </div>
          </div>

          <div className="contact-cards-grid">
            <div className="contact-box">
              <div>
                <span className="contact-role-tag">Booking KOL / KOC</span>
                <div className="contact-full-name">Thảo / Tuyên</div>
                <div
                  style={{
                    fontSize: "13.5px",
                    color: "var(--text-secondary)",
                    marginTop: "4px",
                  }}
                >
                  Điều phối lịch đón tiếp & quay collab
                </div>
              </div>

              <button
                className="contact-action-btn"
                onClick={() => handleCopy("0981234567", "Thảo / Tuyên")}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="16"
                  height="16"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>{copyFeedback === "Thảo / Tuyên" ? "Đã copy!" : "Zalo / ĐT"}</span>
              </button>
            </div>

            <div className="contact-box">
              <div>
                <span className="contact-role-tag">Giám đốc Truyền thông</span>
                <div className="contact-full-name">Hạ Hồng Việt</div>
                <div
                  style={{
                    fontSize: "13.5px",
                    color: "var(--text-secondary)",
                    marginTop: "4px",
                  }}
                >
                  Phụ trách chiến dịch & Quan hệ báo chí
                </div>
              </div>

              <button
                className="contact-action-btn"
                onClick={() => handleCopy("0912345678", "Hạ Hồng Việt")}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="16"
                  height="16"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>{copyFeedback === "Hạ Hồng Việt" ? "Đã copy!" : "Liên hệ"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="portal-footer">
          <p>
            <strong>Ăn Cùng Bà Tuyết</strong> — &ldquo;Ăn vặt thì phải ăn cùng Bà
            Tuyết&rdquo;
          </p>
          <p style={{ marginTop: "4px" }}>
            TikTok Food Fest 2026 — Nhà tài trợ Vàng (Gold Sponsor)
          </p>
          <p style={{ marginTop: "8px", fontSize: "12.5px", opacity: 0.8 }}>
            Tài liệu lưu hành nội bộ hướng dẫn KOL/KOC • acbt.vn/tiktok-food-fest
          </p>
        </footer>
      </main>

      {/* FLOAT DOCK */}
      <div className="float-dock">
        <button
          className="btn-float-top"
          onClick={scrollToTop}
          aria-label="Lên đầu trang"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
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
