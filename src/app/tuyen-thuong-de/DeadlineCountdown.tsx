"use client";

import { useSyncExternalStore } from "react";

const DEADLINE = new Date("2026-11-22T23:59:59+07:00").getTime();
const CLOSED = -1;

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 30_000);
  return () => clearInterval(timer);
}

// Làm tròn theo phút để giá trị giữ ổn định giữa các lần React đọc lại.
function getMinutesLeft() {
  const ms = DEADLINE - Date.now();
  return ms <= 0 ? CLOSED : Math.floor(ms / 60_000);
}

export default function DeadlineCountdown() {
  // Server render dòng hạn nộp cố định; trình duyệt mới hiển thị thời gian còn lại.
  const minutesLeft = useSyncExternalStore(subscribe, getMinutesLeft, () => null);

  if (minutesLeft === null) {
    return (
      <p className="count">
        Hạn nộp: <b>23h59 ngày 22/11/2026</b>
      </p>
    );
  }

  if (minutesLeft === CLOSED) {
    return (
      <p className="count">
        <b>Đã đóng nhận đơn.</b> Hẹn bạn trên livestream 23–29/11!
      </p>
    );
  }

  const days = Math.floor(minutesLeft / 1440);
  const hours = Math.floor((minutesLeft % 1440) / 60);
  const minutes = minutesLeft % 60;

  return (
    <p className="count">
      Còn{" "}
      <b>
        {days} ngày {hours} giờ {minutes} phút
      </b>{" "}
      · hạn 23h59 ngày 22/11/2026
    </p>
  );
}
