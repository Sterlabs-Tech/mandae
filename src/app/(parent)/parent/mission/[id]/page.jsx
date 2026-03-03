'use client';
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../../../../store/AppContext';
import { PlusCircle, Target, ArrowLeft, Trash2, Edit3, Trash, CheckCircle2, Clock, Play, Gift } from 'lucide-react';
import MissionEditModal from '../../../../../components/parent/MissionEditModal';

export default function ParentMissionDetails({ params }) {
    // Unwrap params in Next.js 15
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const router = useRouter();
    const { missions, activities, penalties, setMissions, users, getMissionProgress, approveActivity } = useAppStore();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const mission = missions.find(m => m.id === id);
    const missionActivities = activities.filter(a => a.missionId === id);
    const missionPenalties = penalties.filter(p => p.missionId === id);
    const child = users.find(u => u.id === mission?.childId);

    if (!mission) return <div style={{ padding: '2rem' }}>Missão não encontrada</div>;
    const progress = getMissionProgress(mission.id);

    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir esta missão permanentemente?')) {
            setMissions(missions.filter(m => m.id !== mission.id));
            router.push('/parent');
        }
    };

    const handleStartMission = () => {
        setMissions(missions.map(m => m.id === mission.id ? { ...m, status: 'EM_ANDAMENTO', startedAt: new Date().toISOString() } : m));
    };

    const completedActivities = missionActivities.filter(a => a.status === 'realizada');
    const pendingActivities = missionActivities.filter(a => a.status !== 'realizada');

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem', maxWidth: '1000px', margin: '0 auto' }}>
            <button className="btn btn-ghost" onClick={() => router.push('/parent')} style={{ marginBottom: '1rem', padding: '0.5rem' }}>
                <ArrowLeft size={18} /> Voltar para Missões
            </button>

            <div className="card" style={{ padding: 0, marginBottom: '2rem', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                    <img src={mission.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--mandae-bg-element)', borderRadius: '20px', padding: '2px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                        <span className={`badge ${mission.status === 'EM_ANDAMENTO' ? 'badge-info' : mission.status === 'CONCLUIDA' ? 'badge-warning' : mission.status === 'FINALIZADA' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                            {mission.status === 'CONCLUIDA' ? 'CONCLUÍDA - ENTREGAR PRÊMIO' : mission.status.replace('_', ' ')}
                        </span>
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '2rem 2rem 1rem 2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <h2 style={{ color: 'white', margin: 0, fontSize: '2rem' }}>{mission.title}</h2>
                                <div style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Target size={16} /> Recompensa: {mission.type === 'FIXO' ? mission.prizeDescription : 'Caixa Acumulativa'}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {mission.status === 'CONCLUIDA' && (
                                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => updateMission(mission.id, { status: 'FINALIZADA', finishedAt: new Date().toISOString() })}>
                                        <Gift size={18} /> Registrar Entrega Prêmio
                                    </button>
                                )}
                                {mission.status !== 'FINALIZADA' && mission.status !== 'CONCLUIDA' && (
                                    <button className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'transparent' }} onClick={() => setIsEditOpen(true)}>
                                        <Edit3 size={18} /> Editar
                                    </button>
                                )}
                                {mission.status !== 'FINALIZADA' && (
                                    <button className="btn btn-outline" style={{ background: 'var(--mandae-danger-light)', color: 'var(--mandae-danger)', borderColor: 'transparent' }} onClick={handleDelete}>
                                        <Trash2 size={18} /> Apagar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', padding: '2rem', gap: '2rem', flexWrap: 'wrap' }}>
                    {/* Info Sidebar */}
                    <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--mandae-bg)' }}>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--mandae-text-light)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Resumo Executivo</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                                <img src={child?.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt={child?.name} />
                                <div>
                                    <div style={{ fontWeight: '600' }}>{child?.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--mandae-text-light)' }}>Dependente</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--mandae-text-light)' }}>Criada em:</span>
                                    <span>{new Date(mission.startDate).toLocaleDateString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--mandae-text-light)' }}>Prazo Final:</span>
                                    <span>{new Date(mission.endDate).toLocaleDateString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--mandae-text-light)' }}>Tipo:</span>
                                    <span>{mission.type}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--mandae-bg)' }}>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--mandae-text-light)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Balanço Atual</h4>
                            {mission.type === 'FIXO' ? (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: '500' }}>Progresso Total</span>
                                        <strong style={{ fontSize: '1.8rem', color: progress.progress === 100 ? 'var(--mandae-success)' : 'var(--mandae-text)' }}>{progress.progress}%</strong>
                                    </div>
                                    <div className="progress-container" style={{ height: '8px' }}>
                                        <div className="progress-bar" style={{ width: `${Math.min(100, progress.progress)}%`, background: progress.progress === 100 ? 'var(--mandae-success)' : '' }}></div>
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: progress.currentValue < 0 ? 'var(--mandae-danger)' : 'var(--mandae-text)' }}>
                                        R$ {progress.currentValue.toFixed(2)}
                                    </div>
                                    <div style={{ color: 'var(--mandae-text-light)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                        Capacidade Máxima: R$ {progress.totalValue.toFixed(2)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {mission.status === 'A_INICIAR' && (
                            <button className="btn btn-primary hover-lift" style={{ padding: '1rem', width: '100%' }} onClick={handleStartMission}>
                                <Play size={20} /> Iniciar Missão Agora
                            </button>
                        )}
                    </div>

                    {/* Lists Area */}
                    <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Penalties Section */}
                        {missionPenalties.length > 0 && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ color: 'var(--mandae-danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Trash size={20} /> Histórico de Penalidades
                                    </h3>
                                    {mission.status !== 'FINALIZADA' && mission.status !== 'CONCLUIDA' && (
                                        <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>+ Aplicar</button>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                    {missionPenalties.map(pen => (
                                        <div key={pen.id} style={{ minWidth: '240px', background: 'var(--mandae-danger-light)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--mandae-danger)' }}>
                                            <div style={{ fontWeight: '600', color: 'var(--mandae-danger)', marginBottom: '0.5rem' }}>{pen.description}</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--mandae-danger)' }}>
                                                <span>{new Date(pen.createdAt).toLocaleDateString()}</span>
                                                <strong>- {mission.type === 'FIXO' ? `${pen.impactPercent}%` : `R$ ${pen.impactValue?.toFixed(2)}`}</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pending Tasks */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}> A Fazer </h3>
                                {mission.status !== 'FINALIZADA' && mission.status !== 'CONCLUIDA' && (
                                    <button className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--mandae-primary)' }}>+ Nova Tarefa</button>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {pendingActivities.map(act => (
                                    <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--mandae-bg)', borderRadius: 'var(--radius-sm)', borderLeft: act.status === 'reivindicada' ? '4px solid var(--mandae-warning)' : '4px solid var(--mandae-border)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                            {act.status === 'reivindicada' ? <Clock size={20} color="var(--mandae-warning)" /> : <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px dashed var(--mandae-border)' }} />}
                                            <div>
                                                <div style={{ fontWeight: '500', textDecoration: act.status === 'reivindicada' ? 'line-through' : 'none' }}>{act.description}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                                                    <span style={{ color: 'var(--mandae-text-light)' }}>Prazo: {new Date(act.plannedDate).toLocaleDateString()}</span>
                                                    {act.status === 'reivindicada' && (
                                                        <span className="badge badge-warning" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>Aguardando Aprovação</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                            <div style={{ fontWeight: '600', color: 'var(--mandae-primary)' }}>
                                                + {mission.type === 'FIXO' ? `${act.weight}%` : `R$ ${act.value?.toFixed(2)}`}
                                            </div>
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                onClick={() => approveActivity(act.id)}
                                            >
                                                <CheckCircle2 size={16} /> Concluir
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {pendingActivities.length === 0 && <div style={{ color: 'var(--mandae-text-light)', padding: '1rem', textAlign: 'center' }}>Nenhuma tarefa pendente!</div>}
                            </div>
                        </div>

                        {/* Completed Tasks */}
                        <div>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--mandae-success)' }}> Concluído </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {completedActivities.map(act => (
                                    <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--mandae-success-light)', borderRadius: 'var(--radius-sm)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <CheckCircle2 size={20} color="var(--mandae-success)" />
                                            <div style={{ fontWeight: '500', textDecoration: 'line-through' }}>{act.description}</div>
                                        </div>
                                        <div style={{ fontWeight: '600', color: 'var(--mandae-success)' }}>
                                            + {mission.type === 'FIXO' ? `${act.weight}%` : `R$ ${act.value?.toFixed(2)}`}
                                        </div>
                                    </div>
                                ))}
                                {completedActivities.length === 0 && <div style={{ color: 'var(--mandae-text-light)', padding: '1rem', textAlign: 'center' }}>Nenhuma tarefa concluída ainda.</div>}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {isEditOpen && <MissionEditModal mission={mission} onClose={() => setIsEditOpen(false)} />}
        </div>
    );
}
