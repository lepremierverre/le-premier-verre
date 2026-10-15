import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/__clerk/:path*",
        destination: "https://frontend-api.clerk.dev/__clerk/:path*",
      },
      {
        source: "/npm/@clerk/:path*",
        destination: "https://frontend-api.clerk.dev/npm/@clerk/:path*",
      },
      {
        source: "/v1/:path*",
        destination: "https://frontend-api.clerk.dev/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
