import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    isrMemoryCacheSize: 0,
  },
  staticPageGenerationTimeout: 0,
};

export default nextConfig;