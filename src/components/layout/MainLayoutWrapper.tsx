"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import type { SiteConfigData } from "@/lib/site-config-defaults";

export default function MainLayoutWrapper({
  children,
  initialConfig,
}: {
  children: React.ReactNode;
  initialConfig?: SiteConfigData;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [config, setConfig] = useState<SiteConfigData | undefined>(initialConfig);

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
      <Navbar initialLinks={config?.navbarLinks} initialContact={config?.footerContact} />
      <main className="flex-1 pt-16 lg:pt-18">{children}</main>
      <Footer initialLinks={config?.footerLinks} initialContact={config?.footerContact} />
    </>
  );
}
