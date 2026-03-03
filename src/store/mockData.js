// src/store/mockData.js

export const initialUsers = [
    {
        id: 'parent_1',
        name: 'Roberto Silva (Pai)',
        email: 'roberto@mandae.com',
        phone: '+5511999999999',
        password: '123', // Em dev apenas
        avatar: 'https://i.pravatar.cc/150?u=parent_1',
        role: 'responsavel',
        status: true,
    },
    {
        id: 'child_1',
        parentId: 'parent_1', // Vinculo
        name: 'Leo Silva',
        email: 'leo@mandae.com',
        password: '123',
        avatar: 'https://i.pravatar.cc/150?u=child_1',
        role: 'crianca',
        status: true,
    },
    {
        id: 'child_2',
        parentId: 'parent_1', // Vinculo
        name: 'Mia Silva',
        email: 'mia@mandae.com',
        password: '123',
        avatar: 'https://i.pravatar.cc/150?u=child_2',
        role: 'crianca',
        status: true,
    }
];

export const initialMissions = [
    {
        id: 'mission_1',
        title: 'Projeto Quarto Limpo',
        coverImage: 'https://images.unsplash.com/photo-1595514535415-84cf0efd3244?w=400&q=80',
        type: 'FIXO',
        subtype: 'PRESENTE',
        prizeDescription: 'Lego Star Wars',
        status: 'EM_ANDAMENTO', // A_INICIAR, EM_ANDAMENTO, CONCLUIDA, FINALIZADA, CANCELADA
        ownerId: 'parent_1',
        childId: 'child_1',
        startDate: '2026-03-01',
        endDate: '2026-04-01',
        startedAt: new Date().toISOString(),
        completedAt: null,
    },
    {
        id: 'mission_2',
        title: 'Mesada Financeira',
        coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
        type: 'VARIAVEL',
        subtype: 'DINHEIRO',
        prizeDescription: 'Poupanca',
        status: 'EM_ANDAMENTO',
        ownerId: 'parent_1',
        childId: 'child_2',
        startDate: '2026-03-01',
        endDate: '2026-03-31',
        startedAt: new Date().toISOString(),
        completedAt: null,
    }
];

export const initialActivities = [
    // Mission 1 (Fixa) - Total must round to 100%
    {
        id: 'act_1',
        missionId: 'mission_1',
        description: 'Arrumar a cama',
        plannedDate: '2026-03-02',
        weight: 25, // %
        value: null,
        status: 'realizada', // pendente, reivindicada, realizada
        completedAt: new Date().toISOString(),
    },
    {
        id: 'act_2',
        missionId: 'mission_1',
        description: 'Guardar os brinquedos',
        plannedDate: '2026-03-05',
        weight: 25,
        value: null,
        status: 'reivindicada',
        completedAt: null,
    },
    {
        id: 'act_3',
        missionId: 'mission_1',
        description: 'Lavar a louça do jantar',
        plannedDate: '2026-03-10',
        weight: 50,
        value: null,
        status: 'pendente',
        completedAt: null,
    },
    // Mission 2 (Variavel)
    {
        id: 'act_4',
        missionId: 'mission_2',
        description: 'Tirar nota A em Mat',
        plannedDate: '2026-03-15',
        weight: null,
        value: 50.00, // R$
        status: 'realizada',
        completedAt: new Date().toISOString(),
    },
    {
        id: 'act_5',
        missionId: 'mission_2',
        description: 'Ler um livro de 50 pags',
        plannedDate: '2026-03-20',
        weight: null,
        value: 30.00,
        status: 'pendente',
        completedAt: null,
    }
];

export const initialPenalties = [
    {
        id: 'pen_1',
        missionId: 'mission_1', // Em andamento
        description: 'Falar palavrão',
        impactPercent: 10, // -10% progress
        impactValue: null,
        ownerId: 'parent_1',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'pen_2',
        missionId: 'mission_2',
        description: 'Desobediência',
        impactPercent: null,
        impactValue: 15.00, // -R$15
        ownerId: 'parent_1',
        createdAt: new Date().toISOString(),
    }
];
