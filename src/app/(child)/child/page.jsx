'use client';
import { useAppStore } from '../../../store/AppContext';
import { useRouter } from 'next/navigation';
import { Target, Clock } from 'lucide-react';

export default function Home() {
    const { missions, currentUser, getMissionProgress } = useAppStore();
    const router = useRouter();

    // Somente missões em andamento/concluidas da criança logada
    const myMissions = missions.filter(m => m.childId === currentUser?.id && m.status !== 'A_INICIAR');

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem', color: 'var(--mandae-primary-dark)' }}>Minhas Missões</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
                {myMissions.map(mission => {
                    const progress = getMissionProgress(mission.id);

                    return (
                        <div
                            key={mission.id}
                            className="card hover-lift"
                            style={{ cursor: 'pointer', padding: 0, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                            onClick={() => router.push(`/child/mission/${mission.id}`)}
                        >
                            {/* Card Header Image (40% of height) */}
                            <div style={{ height: '200px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                                <img src={mission.coverImage} alt={mission.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--mandae-bg-element)', borderRadius: '20px', padding: '2px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                                    <span className={`badge ${mission.status === 'EM_ANDAMENTO' ? 'badge-info' : mission.status === 'CONCLUIDA' ? 'badge-warning' : mission.status === 'FINALIZADA' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                                        {mission.status === 'CONCLUIDA' ? 'AGUARDANDO PRÊMIO' : mission.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '2rem 1.5rem 1rem 1.5rem' }}>
                                    <h3 style={{ color: 'white', margin: 0, fontSize: '1.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{mission.title}</h3>
                                </div>
                            </div>

                            {/* Card Content Area */}
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--mandae-text-light)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Target size={16} />
                                        <span>Prêmio: {mission.type === 'FIXO' ? mission.prizeDescription : 'Caixinha Acumulativa'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Clock size={16} />
                                        <span>Até {new Date(mission.endDate).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {mission.type === 'FIXO' ? (
                                    <div style={{ background: 'var(--mandae-bg)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', alignItems: 'flex-end' }}>
                                            <span style={{ fontWeight: '500', color: 'var(--mandae-text)' }}>Buscando 100%</span>
                                            <strong style={{ fontSize: '1.6rem', color: progress.progress === 100 ? 'var(--mandae-success)' : 'var(--mandae-primary)' }}>{progress.progress}%</strong>
                                        </div>
                                        <div className="progress-container" style={{ height: '16px', borderRadius: '8px' }}>
                                            <div className="progress-bar" style={{ width: `${Math.min(100, progress.progress)}%`, background: progress.progress === 100 ? 'var(--mandae-success)' : '' }}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ background: 'var(--mandae-bg)', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                        <div style={{ color: 'var(--mandae-text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Acumulado até agora:</div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: progress.currentValue < 0 ? 'var(--mandae-danger)' : 'var(--mandae-success)' }}>
                                            R$ {progress.currentValue.toFixed(2)}
                                        </div>
                                        <div style={{ color: 'var(--mandae-text-light)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                            Potencial Restante: R$ {(progress.totalValue - progress.currentValue - progress.lostValue).toFixed(2)}
                                        </div>
                                    </div>
                                )}

                                <div style={{ marginTop: '1.5rem' }}>
                                    <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
                                        Ver Minhas Tarefas
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {myMissions.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--mandae-text-light)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎮</div>
                        <h3>Nenhuma missão no momento!</h3>
                        <p>Seus pais ainda não te passaram nenhuma missão. Aproveite o descanso!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
