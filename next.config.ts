import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests from network IP during development
  allowedDevOrigins: [
    "http://10.187.56.153:3000",
    "http://10.187.56.153:3001",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
};

export default nextConfig;
