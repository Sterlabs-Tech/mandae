const dotenv = require('dotenv');
dotenv.config({ path: '.env.staging' });

const { PrismaClient } = require('@prisma/client');

console.log('Connecting with URL:', process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function test() {
    try {
        const users = await prisma.user.findMany();
        console.log('Success! Users length:', users.length);
    } catch (e) {
        console.error('Prisma Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}
test();
