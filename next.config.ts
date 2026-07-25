import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i1-kinhdoanh.vnecdn.net" },
      { protocol: "https", hostname: "i1-giadinh.vnecdn.net" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/daiviet",
        destination: "https://cd85mgkd-5173.jpe1.devtunnels.ms/",
        permanent: false,
      },
      {
        source: "/dv",
        destination: "https://cd85mgkd-5173.jpe1.devtunnels.ms/",
        permanent: false,
      },
      {
        source: "/tmdt",
        destination: "https://cd85mgkd-5174.jpe1.devtunnels.ms/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
