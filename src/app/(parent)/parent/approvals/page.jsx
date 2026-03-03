'use client';
import { useAppStore } from '../../../../store/AppContext';
import { Check, X, Bell } from 'lucide-react';

export default function Approvals() {
    const { activities, users, missions, approveActivity, rejectActivity } = useAppStore();

    const pendingApprovals = activities.filter(a => a.status === 'reivindicada');

    if (pendingApprovals.length === 0) {
        return (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--mandae-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                    <Check size={40} color="var(--mandae-text-light)" />
                </div>
                <h2 style={{ marginBottom: '0.5rem' }}>Tudo Limpo!</h2>
                <p style={{ color: 'var(--mandae-text-light)' }}>Não há atividades pendentes de aprovação.</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Caixa de Entrada</h2>
                <p style={{ color: 'var(--mandae-text-light)' }}>Aprove ou rejeite as atividades reivindicadas pelos seus dependentes.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingApprovals.map(activity => {
                    const mission = missions.find(m => m.id === activity.missionId);
                    const child = users.find(u => u.id === mission?.childId);

                    return (
                        <div key={activity.id} className="card hover-lift" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <img src={child?.avatar} alt={child?.name} className="avatar" />
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--mandae-text-light)', marginBottom: '0.2rem' }}>
                                        <strong>{child?.name}</strong> reivindicou na missão <span className="badge" style={{ marginLeft: '4px', fontSize: '0.7rem' }}>{mission?.title}</span>
                                    </div>
                                    <div style={{ fontWeight: '500', fontSize: '1.1rem' }}>{activity.description}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--mandae-primary)', marginTop: '0.2rem', fontWeight: '500' }}>
                                        Recompensa: {activity.weight ? `+${activity.weight}%` : `+ R$ ${activity.value?.toFixed(2)}`}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    className="btn btn-outline"
                                    style={{ borderColor: 'var(--mandae-danger)', color: 'var(--mandae-danger)' }}
                                    onClick={() => rejectActivity(activity.id)}
                                    title="Reprovar"
                                >
                                    <X size={18} />
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{ background: 'var(--mandae-success)' }}
                                    onClick={() => approveActivity(activity.id)}
                                >
                                    <Check size={18} /> Aprovar
                                </button>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}
