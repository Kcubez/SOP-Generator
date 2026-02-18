import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sopgenerator.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@sopgenerator.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create test user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@sopgenerator.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'user@sopgenerator.com',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log('Seeded users:');
  console.log('  Admin:', admin.email, '(password: admin123)');
  console.log('  User:', user.email, '(password: user123)');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
