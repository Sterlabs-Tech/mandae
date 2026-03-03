'use server';

import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

// Helper to convert Prisma objects to plain JS objects that can be passed to Client Components safely
const toPlainObj = (obj) => JSON.parse(JSON.stringify(obj));

export const loginUser = async (email, password) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return { success: false, message: 'Usuário não encontrado.' };

        // For this mock/seed scenario where we might have seeded plain text passwords previously
        // Check if password matches plain text OR bcrypt
        let isMatch = false;

        if (user.password.startsWith('$2b$')) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            isMatch = (user.password === password);
        }

        if (isMatch) {
            return { success: true, role: user.role, user: toPlainObj(user) };
        } else {
            return { success: false, message: 'Senha incorreta.' };
        }
    } catch (error) {
        console.error('Login Error:', error);
        return { success: false, message: 'Erro no servidor.' };
    }
};

export const registerUser = async (data) => {
    try {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) return { success: false, message: 'Email já cadastrado.' };

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = await prisma.user.create({
            data: {
                id: data.id, // optional
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: hashedPassword,
                role: 'responsavel',
                status: true
            }
        });

        return { success: true, user: toPlainObj(newUser) };
    } catch (error) {
        console.error('Register Error:', error);
        return { success: false, message: 'Erro ao cadastrar usuário.' };
    }
};

export const fetchFamilyData = async (userId) => {
    try {
        // Fetch current user
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            include: { children: true }
        });

        if (!currentUser) return { success: false, message: 'Usuário não encontrado' };

        // If parent, fetch all children. If child, fetch just parent info.
        let users = [currentUser];
        let familyIds = [userId];

        if (currentUser.role === 'responsavel') {
            users = [...users, ...currentUser.children];
            familyIds = users.map(u => u.id);
        } else {
            if (currentUser.parentId) {
                const parent = await prisma.user.findUnique({ where: { id: currentUser.parentId } });
                if (parent) {
                    users.push(parent);
                    familyIds.push(parent.id);
                }
            }
        }

        // Fetch missions where owner or child is in familyIds
        const missions = await prisma.mission.findMany({
            where: {
                OR: [
                    { ownerId: { in: familyIds } },
                    { childId: { in: familyIds } }
                ]
            }
        });

        const missionIds = missions.map(m => m.id);

        const activities = await prisma.activity.findMany({
            where: { missionId: { in: missionIds } }
        });

        const penalties = await prisma.penalty.findMany({
            where: { missionId: { in: missionIds } }
        });

        return {
            success: true,
            users: toPlainObj(users),
            missions: toPlainObj(missions),
            activities: toPlainObj(activities),
            penalties: toPlainObj(penalties)
        };

    } catch (error) {
        console.error('fetchFamilyData error:', error);
        return { success: false, message: 'Erro ao buscar dados.' };
    }
};

export const createDependent = async (data) => {
    try {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) return { success: false, message: 'Email já cadastrado.' };

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newChild = await prisma.user.create({
            data: {
                id: data.id,
                parentId: data.parentId,
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: 'crianca',
                status: true,
                avatar: data.avatar
            }
        });

        return { success: true, child: toPlainObj(newChild) };
    } catch (error) {
        console.error('Create Dependent Error:', error);
        return { success: false, message: 'Erro ao cadastrar criança.' };
    }
};

export const updateDependent = async (id, data) => {
    try {
        // If password is provided, hash it
        let updateData = { ...data };
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updated = await prisma.user.update({
            where: { id },
            data: updateData
        });
        return { success: true, user: toPlainObj(updated) };
    } catch (error) {
        console.error('Update Dependent Error:', error);
        return { success: false, message: 'Erro ao atualizar.' };
    }
};

export const deleteDependent = async (id) => {
    try {
        await prisma.user.delete({ where: { id } });
        return { success: true };
    } catch (error) {
        console.error('Delete Dependent Error:', error);
        return { success: false, message: 'Erro ao deletar.' };
    }
};

export const saveMission = async (missionData, activitiesData) => {
    try {
        // Handle dates
        const mData = { ...missionData };
        if (mData.startDate && typeof mData.startDate === 'string') mData.startDate = new Date(mData.startDate);
        if (mData.endDate && typeof mData.endDate === 'string') mData.endDate = new Date(mData.endDate);
        if (mData.startedAt && typeof mData.startedAt === 'string') mData.startedAt = new Date(mData.startedAt);
        if (mData.completedAt && typeof mData.completedAt === 'string') mData.completedAt = new Date(mData.completedAt);
        if (mData.finishedAt && typeof mData.finishedAt === 'string') mData.finishedAt = new Date(mData.finishedAt);
        if (mData.createdAt && typeof mData.createdAt === 'string') mData.createdAt = new Date(mData.createdAt);
        if (mData.updatedAt && typeof mData.updatedAt === 'string') mData.updatedAt = new Date(mData.updatedAt);

        // Transaction to save mission and its activities
        const val = await prisma.$transaction(async (tx) => {
            // Check if exist
            const existing = await tx.mission.findUnique({ where: { id: mData.id } });

            let savedMission;
            if (existing) {
                savedMission = await tx.mission.update({
                    where: { id: mData.id },
                    data: mData
                });

                // For updates, simpler logic is to delete and re-create activities, or upsert.
                // Assuming activitiesData is the complete NEW list of activities for this mission.
                await tx.activity.deleteMany({ where: { missionId: mData.id } });
            } else {
                savedMission = await tx.mission.create({ data: mData });
            }

            // Create activities
            let savedActivities = [];
            if (activitiesData && activitiesData.length > 0) {
                const newActs = activitiesData.map(a => ({
                    ...a,
                    missionId: mData.id,
                    plannedDate: a.plannedDate ? new Date(a.plannedDate) : new Date(),
                    completedAt: a.completedAt ? new Date(a.completedAt) : null,
                    createdAt: a.createdAt ? new Date(a.createdAt) : undefined,
                    updatedAt: a.updatedAt ? new Date(a.updatedAt) : undefined,
                }));

                await tx.activity.createMany({ data: newActs });
                savedActivities = await tx.activity.findMany({ where: { missionId: mData.id } });
            }

            return { mission: savedMission, activities: savedActivities };
        });

        return { success: true, mission: toPlainObj(val.mission), activities: toPlainObj(val.activities) };
    } catch (e) {
        console.error('Save Mission Error:', e);
        return { success: false, message: 'Erro ao salvar missão.' };
    }
};

export const deleteMission = async (id) => {
    try {
        await prisma.mission.delete({ where: { id } });
        return { success: true };
    } catch (error) {
        console.error('Delete Mission Error:', error);
        return { success: false, message: 'Erro ao deletar missão.' };
    }
};

export const updateActivityStatus = async (activityId, status) => {
    try {
        const data = { status };
        if (status === 'realizada') data.completedAt = new Date();
        if (status === 'pendente') data.completedAt = null;

        const act = await prisma.activity.update({
            where: { id: activityId },
            data
        });

        // Check if mission needs status update
        if (status === 'realizada') {
            const allActs = await prisma.activity.findMany({ where: { missionId: act.missionId } });
            if (allActs.every(a => a.status === 'realizada')) {
                await prisma.mission.update({
                    where: { id: act.missionId },
                    data: { status: 'CONCLUIDA' }
                });
            }
        }

        return { success: true, activity: toPlainObj(act) };
    } catch (error) {
        console.error('Update Activity Error:', error);
        return { success: false, message: 'Erro ao atualizar atividade.' };
    }
};

export const updateMissionStatus = async (id, status) => {
    try {
        const data = { status };
        if (status === 'CONCLUIDA') data.completedAt = new Date();
        if (status === 'FINALIZADA') data.finishedAt = new Date();
        if (status === 'EM_ANDAMENTO') data.startedAt = new Date();

        const m = await prisma.mission.update({
            where: { id },
            data
        });
        return { success: true, mission: toPlainObj(m) };
    } catch (error) {
        console.error('Update Mission Status Error:', error);
        return { success: false, message: 'Erro ao alterar status da missão.' };
    }
};
