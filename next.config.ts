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
};

export default nextConfig;
