import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Database...');

    // 1. Create the parent (Responsável)
    const parentPassword = await bcrypt.hash('123456', 10);

    const parent = await prisma.user.upsert({
        where: { email: 'responsavel@mandae.com' },
        update: {},
        create: {
            name: 'João (Responsável)',
            email: 'responsavel@mandae.com',
            password: parentPassword,
            role: 'responsavel',
            phone: '11999999999',
        },
    });

    console.log('Created Parent:', parent.name);

    // 2. Create the child (Criança) linked to the parent
    const childPassword = await bcrypt.hash('123456', 10);

    const child = await prisma.user.upsert({
        where: { email: 'crianca@mandae.com' },
        update: {
            parentId: parent.id
        },
        create: {
            name: 'Maria (Criança)',
            email: 'crianca@mandae.com',
            password: childPassword,
            role: 'crianca',
            parentId: parent.id
        },
    });

    console.log('Created Child:', child.name);
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
