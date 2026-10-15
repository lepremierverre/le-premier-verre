import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/__clerk/npm/:path*",
        destination: "https://frontend-api.clerk.dev/npm/:path*",
      },
      {
        source: "/_clerk/npm/:path*",
        destination: "https://frontend-api.clerk.dev/npm/:path*",
      },
      {
        source: "/__clerk/:path*",
        destination: "https://frontend-api.clerk.dev/__clerk/:path*",
      },
      {
        source: "/v1/:path*",
        destination: "https://frontend-api.clerk.dev/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
