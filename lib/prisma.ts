// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Importante: desabilita logging en build time
    log: process.env.NODE_ENV === 'production' 
      ? [] 
      : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Desconecta en build time para evitar timeout
if (process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'production') {
  // No mantener conexión durante build
}