import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

// 1. Create the Pool and Adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. Singleton Function
const prismaClientSingleton = () => {
	return new PrismaClient({ adapter });
};

// 3. Global Object Handling (prevents hot-reload crashes)
declare global {
	var prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}

const globalForPrisma = globalThis as typeof globalThis & {
	prisma?: ReturnType<typeof prismaClientSingleton>;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}

export default prisma;