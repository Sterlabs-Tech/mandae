'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../../store/AppContext';
import { PlusCircle, Target, AlertTriangle, Play, Trash2, Edit3, X, Eye, ChevronRight } from 'lucide-react';
import MissionWizard from '../../../components/parent/MissionWizard';

export default function Dashboard() {
    const { missions, getMissionProgress, users, currentUser } = useAppStore();
    const router = useRouter();
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    // Somente missões do responsável logado
    const myMissions = missions.filter(m => m.ownerId === currentUser?.id);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2>Visão Geral</h2>
                    <p style={{ color: 'var(--mandae-text-light)' }}>Acompanhe o desempenho dos seus dependentes.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsWizardOpen(true)}>
                    <PlusCircle size={20} /> Nova Missão
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {myMissions.map(mission => {
                    const progress = getMissionProgress(mission.id);
                    const child = users.find(u => u.id === mission.childId);

                    return (
                        <div key={mission.id} className="card hover-lift" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }} onClick={() => router.push(`/parent/mission/${mission.id}`)}>
                            <div style={{ height: '140px', margin: '-1.5rem -1.5rem 1.5rem -1.5rem', overflow: 'hidden', position: 'relative' }}>
                                <img src={mission.coverImage} alt={mission.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--mandae-bg-element)', borderRadius: '20px', padding: '2px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                                    <span className={`badge ${mission.status === 'EM_ANDAMENTO' ? 'badge-info' : mission.status === 'CONCLUIDA' ? 'badge-warning' : mission.status === 'FINALIZADA' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                                        {mission.status === 'CONCLUIDA' ? 'ENTREGAR PRÊMIO' : mission.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--glass-bg)', padding: '4px 12px', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
                                    <img src={child?.avatar} style={{ width: '24px', height: '24px', borderRadius: '50%' }} alt={child?.name} />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{child?.name}</span>
                                </div>
                            </div>

                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{mission.title}</h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--mandae-text-light)' }}>
                                <Target size={16} />
                                {mission.type === 'FIXO' ? `Prêmio: ${mission.prizeDescription}` : `Acumulativo (${mission.subtype})`}
                            </div>

                            <div style={{ marginTop: 'auto' }}>
                                {mission.type === 'FIXO' ? (
                                    <>
                                        <div className="progress-container" style={{ marginBottom: '0.5rem' }}>
                                            <div className="progress-bar" style={{ width: `${Math.min(100, progress.progress)}%`, background: progress.progress === 100 ? 'var(--mandae-success)' : '' }}></div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                            <span style={{ color: 'var(--mandae-text-light)' }}>Progresso</span>
                                            <span style={{ fontWeight: '600', color: progress.progress === 100 ? 'var(--mandae-success)' : 'inherit' }}>{progress.progress}%</span>
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ color: 'var(--mandae-text-light)', fontSize: '0.85rem' }}>Até o Momento</span>
                                            <strong style={{ fontSize: '1.4rem', color: progress.currentValue < 0 ? 'var(--mandae-danger)' : 'var(--mandae-text)' }}>
                                                R$ {progress.currentValue.toFixed(2)}
                                            </strong>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.85rem' }}>
                                            <span style={{ color: 'var(--mandae-text-light)' }}>Total Possível</span>
                                            <strong>R$ {progress.totalValue.toFixed(2)}</strong>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--mandae-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', color: 'var(--mandae-primary)', fontWeight: '500', fontSize: '0.9rem' }}>
                                Gerenciar Missão <ChevronRight size={18} style={{ marginLeft: '4px' }} />
                            </div>
                        </div>
                    );
                })}

                {myMissions.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--mandae-text-light)' }}>
                        Nenhuma missão cadastrada. Clique em "Nova Missão" para começar.
                    </div>
                )}
            </div>

            {isWizardOpen && <MissionWizard onClose={() => setIsWizardOpen(false)} />}
        </div>
    );
}
