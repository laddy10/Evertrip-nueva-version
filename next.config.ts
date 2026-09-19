import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.40"],
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "qnaeoclfcpkxewwhcxei.supabase.co",
      },
      {
        protocol: "https",
        hostname: "pub-9936f5f82a2345e986d1f24b51d2341d.r2.dev",
        pathname: "/routes/**",
      },
      {
        protocol: "https",
        hostname: "pub-9936f5f82a2345e986d1f24b51d2341d.r2.dev",
        pathname: "/vehicles/**",
      },
    ],
  },
};

export default nextConfig;
