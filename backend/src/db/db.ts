import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaNeon } from '@prisma/adapter-neon';
import env from '../../env.ts';

const adapter = new PrismaNeon({
  connectionString: env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });
