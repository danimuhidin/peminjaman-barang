import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'], // Tampilkan query di console log saat development
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;