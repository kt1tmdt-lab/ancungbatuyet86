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
        source: "/999",
        destination: "https://cd85mgkd-5173.jpe1.devtunnels.ms/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
