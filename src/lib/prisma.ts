import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  pool: Pool;
};

// Use DIRECT_URL for pg Pool to avoid double pooling
// (Supabase's pooler on port 5432 already does pooling — stacking pg.Pool on top causes timeouts)
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL!;

const pool =
  globalForPrisma.pool ||
  new Pool({
    connectionString,
    max: 5, // Keep low for serverless (Vercel)
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000, // Increased from 10s to 30s
    allowExitOnIdle: true, // Let serverless functions clean up
  });

// Handle pool errors gracefully (prevents unhandled rejections)
pool.on('error', err => {
  console.error('Database pool error:', err.message);
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.pool = pool;

const adapter = new PrismaPg(pool);

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma };
