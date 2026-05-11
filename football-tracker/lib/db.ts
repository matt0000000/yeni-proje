// Database client placeholder.
// To enable: set DATABASE_URL, run `npx prisma generate && npx prisma migrate dev`,
// then uncomment the PrismaClient import and replace mock-data calls with DB queries.

// import { PrismaClient } from "@prisma/client";
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
// export const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ["warn", "error"] });
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const prisma = null;
