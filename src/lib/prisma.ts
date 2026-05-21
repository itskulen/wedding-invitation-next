import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

const client = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production' && client) {
  globalForPrisma.prisma = client;
}

/** Prisma client; `null` when `DATABASE_URL` is not configured (local demo without MySQL). */
export const prisma: PrismaClient | null = client;

export function isDatabaseConfigured(): boolean {
  return client !== null;
}
