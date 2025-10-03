import { PrismaClient } from '@prisma/client';


// Create a single instance of PrismaClient
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export { prisma };

export async function connectDB() {
    try {
        await prisma.$connect();
        console.log("✅ PostgreSQL connected successfully with Prisma!");
    } catch (err) {
        console.error("❌ Error connecting to PostgreSQL:", err);
        process.exit(1);
    }
}

export async function disconnectDB() {
    try {
        await prisma.$disconnect();
        console.log("✅ PostgreSQL disconnected successfully!");
    } catch (err) {
        console.error("❌ Error disconnecting from PostgreSQL:", err);
    }
}
