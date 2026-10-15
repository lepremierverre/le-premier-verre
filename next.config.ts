import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/__clerk/:path*",
        destination: "https://frontend-api.clerk.dev/__clerk/:path*",
      },
      {
        source: "/_clerk/npm/@clerk/clerk-js@:version/dist/:path*",
        destination: "https://clerk.com/npm/@clerk/clerk-js@:version/dist/:path*",
      },
      {
        source: "/npm/@clerk/:path*",
        destination: "https://clerk.com/npm/@clerk/:path*",
      },
      {
        source: "/v1/:path*",
        destination: "https://frontend-api.clerk.dev/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
