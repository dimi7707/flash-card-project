import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Deshabilita CUALQUIER tipo de prerendering
  typescript: {
    tsc: true,
  },
  experimental: {
    isrMemoryCacheSize: 0,
  },
  // Fuerza todas las rutas a ser dinámicas
  staticPageGenerationTimeout: 0,
  env: {
    // Asegura que Prisma no intente conectar en build
    SKIP_PRISMA_VALIDATION: 'true',
  },
};

export default nextConfig;