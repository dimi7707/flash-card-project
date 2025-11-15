import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    isrMemoryCacheSize: 0,
  },
  // Importante: deshabilita prerendering de rutas dinámicas
  staticPageGenerationTimeout: 0,
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;