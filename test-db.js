import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to DB...');
        const users = await prisma.user.findMany();
        console.log('Success! Users found:', users.length);
    } catch (error) {
        console.error('Error connecting to DB:');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
