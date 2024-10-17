import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
};
