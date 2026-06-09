"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    if (!isAdmin) {
      fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.data) {
            setConfig(data.data);
          }
        })
        .catch(console.error);
    }
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar initialLinks={config?.navbarLinks} />
      <main className="flex-1 pt-16 lg:pt-18">{children}</main>
      <Footer initialLinks={config?.footerLinks} initialContact={config?.footerContact} />
    </>
  );
}
