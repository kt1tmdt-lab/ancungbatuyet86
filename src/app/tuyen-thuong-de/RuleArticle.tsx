"use client";

import { useSyncExternalStore, type ReactNode } from "react";

// Trùng với breakpoint ẩn mục lục trong tuyen-thuong-de.css
const DESKTOP_QUERY = "(min-width: 961px)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function isDesktopViewport() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

/**
 * Một điều trong thể lệ: desktop luôn mở, mobile bấm để mở.
 * Server render trạng thái mở để toàn bộ thể lệ luôn có trong HTML.
 */
export default function RuleArticle({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  const isDesktop = useSyncExternalStore(subscribe, isDesktopViewport, () => true);

  return (
    <details className="art" id={`dieu-${n}`} open={isDesktop}>
      <summary
        onClick={(event) => {
          if (isDesktop) event.preventDefault();
        }}
      >
        <h3>
          <span>Điều {n}.</span> {title}
        </h3>
      </summary>
      <div className="art-body">{children}</div>
    </details>
  );
}
