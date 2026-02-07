import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "10.187.56.153:3000",
        "10.187.56.153:3001",
        "localhost:3000",
        "localhost:3001",
      ],
    },
  },
  // SEO optimizations
  trailingSlash: false, // Consistent URL structure
  compress: true, // Enable gzip compression for faster load times
  poweredByHeader: false, // Remove X-Powered-By header for security
};

export default nextConfig;
