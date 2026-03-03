// src/store/AppContext.jsx
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchFamilyData, updateActivityStatus, updateMissionStatus, deleteDependent, saveMission } from '../actions/db';

const AppContext = createContext();

export const useAppStore = () => useContext(AppContext);

const getInitialState = (key, defaultVal) => {
    if (typeof window === 'undefined') return defaultVal;
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultVal;
    } catch (e) {
        return defaultVal;
    }
};

const getThemeState = () => {
    if (typeof window === 'undefined') return 'theme-fustat';
    return window.localStorage.getItem('mandae_theme') || 'theme-fustat';
};

const safeSetItem = (key, value) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(key, value);
    } catch (e) {
        console.error(`Error setting localStorage key "${key}":`, e);
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            console.warn('LocalStorage quota exceeded! Clearing some space...');
            // In a real app we might want to be more selective, but for this mock we can reset or just skip
        }
    }
};

export const AppProvider = ({ children }) => {
    // DB State
    const [users, setUsers] = useState([]);
    const [missions, setMissions] = useState([]);
    const [activities, setActivities] = useState([]);
    const [penalties, setPenalties] = useState([]);

    // Auth state
    const [currentUser, setCurrentUser] = useState(() => getInitialState('mandae_current_user', null));

    // Theme state
    const [theme, setTheme] = useState(() => getThemeState());

    useEffect(() => { safeSetItem('mandae_theme', theme); }, [theme]);

    // Apply Theme to Document
    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);

    useEffect(() => {
        if (currentUser) {
            safeSetItem('mandae_current_user', JSON.stringify(currentUser));
            // Trigger DB fetch for everything
            const loadData = async () => {
                const res = await fetchFamilyData(currentUser.id);
                if (res.success) {
                    setUsers(res.users || []);
                    setMissions(res.missions || []);
                    setActivities(res.activities || []);
                    setPenalties(res.penalties || []);
                }
            };
            loadData();
        } else {
            localStorage.removeItem('mandae_current_user');
            // Clear local cached db state immediately
            setUsers([]);
            setMissions([]);
            setActivities([]);
            setPenalties([]);
        }
    }, [currentUser]);

    // Auto-complete missions when all tasks are done
    useEffect(() => {
        setMissions(prevMissions => {
            let changed = false;
            const newMissions = prevMissions.map(m => {
                if (m.status === 'EM_ANDAMENTO') {
                    const missionActivities = activities.filter(a => a.missionId === m.id);
                    if (missionActivities.length > 0 && missionActivities.every(a => a.status === 'realizada')) {
                        changed = true;
                        return { ...m, status: 'CONCLUIDA' };
                    }
                }
                return m;
            });
            return changed ? newMissions : prevMissions;
        });
    }, [activities]);

    // Actions
    // The Login and logic now runs on pages directly (Login/Register)
    // Here we just set the current user after successful auth
    const login = (userObj) => {
        setCurrentUser(userObj);
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const updateUser = (userId, newProps) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...newProps } : u));
        if (currentUser?.id === userId) {
            setCurrentUser(prev => ({ ...prev, ...newProps }));
        }
    };

    const approveActivity = async (activityId) => {
        const res = await updateActivityStatus(activityId, 'realizada');
        if (res.success) {
            // Update UI state
            setActivities(prev => prev.map(a =>
                a.id === activityId ? { ...a, status: 'realizada', completedAt: res.activity.completedAt } : a
            ));
            fetchFamilyData(currentUser.id).then(d => {
                if (d.success) setMissions(d.missions);
            });
        }
        return res;
    };

    const claimActivity = async (activityId) => {
        const res = await updateActivityStatus(activityId, 'reivindicada');
        if (res.success) {
            setActivities(prev => prev.map(a =>
                a.id === activityId ? { ...a, status: 'reivindicada' } : a
            ));
        }
        return res;
    };

    const rejectActivity = async (activityId) => {
        const res = await updateActivityStatus(activityId, 'pendente');
        if (res.success) {
            setActivities(prev => prev.map(a =>
                a.id === activityId ? { ...a, status: 'pendente' } : a
            ));
        }
        return res;
    };

    const updateMission = async (missionId, props) => {
        // Here we just do UI optimistic, actual server call is elsewhere or via saveMission
        setMissions(prev => prev.map(m => m.id === missionId ? { ...m, ...props } : m));
    };

    const updateMissionActivities = (missionId, newActivities) => {
        setActivities(prev => [
            ...prev.filter(a => a.missionId !== missionId),
            ...newActivities
        ]);
    };

    const addPenalty = (penalty) => {
        setPenalties(prev => [...prev, penalty]);
    };

    const removePenalty = (penaltyId) => {
        setPenalties(prev => prev.filter(p => p.id !== penaltyId));
    };

    // Selectors
    const getMissionProgress = (missionId) => {
        const mission = missions.find(m => m.id === missionId);
        if (!mission) return { progress: 0, text: '', totalValue: 0, currentValue: 0 };

        const missionActivities = activities.filter(a => a.missionId === missionId);
        const missionPenalties = penalties.filter(p => p.missionId === missionId);

        if (mission.type === 'FIXO') {
            const earned = missionActivities.filter(a => a.status === 'realizada').reduce((acc, a) => acc + (a.weight || 0), 0);
            const lost = missionPenalties.reduce((acc, p) => acc + (p.impactPercent || 0), 0);
            let total = Math.max(0, earned - lost);
            return { progress: total, isCompleted: total >= 100 };
        } else {
            const earned = missionActivities.filter(a => a.status === 'realizada').reduce((acc, a) => acc + (a.value || 0), 0);
            const possible = missionActivities.reduce((acc, a) => acc + (a.value || 0), 0);
            const lost = missionPenalties.reduce((acc, p) => acc + (p.impactValue || 0), 0);
            let current = earned - lost;
            return { totalValue: possible, currentValue: current, lostValue: lost };
        }
    };

    // We expose state and actions here
    const value = {
        users, setUsers,
        missions, setMissions,
        activities, setActivities,
        penalties, setPenalties,
        currentUser, login, logout, updateUser,
        approveActivity, claimActivity, rejectActivity,
        getMissionProgress, updateMission, updateMissionActivities, addPenalty, removePenalty,
        theme, setTheme
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
