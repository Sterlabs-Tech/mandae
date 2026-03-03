'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../../../../store/AppContext';
import { CheckCircle2, CircleDashed, Clock, ArrowLeft } from 'lucide-react';

export default function MissionDetails({ params }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();
    const { missions, activities, claimActivity } = useAppStore();

    const mission = missions.find(m => m.id === id);
    const missionActivities = activities
        .filter(a => a.missionId === id)
        // Sort by planned date (closest to due)
        .sort((a, b) => new Date(a.plannedDate) - new Date(b.plannedDate));

    if (!mission) return <div style={{ padding: '2rem' }}>Missão não encontrada</div>;

    const handleClaim = (activityId) => {
        claimActivity(activityId);
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem', maxWidth: '800px', margin: '0 auto' }}>

            <button className="btn btn-ghost" onClick={() => router.push('/child')} style={{ marginBottom: '1rem', padding: '0.5rem' }}>
                <ArrowLeft size={18} /> Voltar
            </button>

            <div className="card" style={{ padding: 0, marginBottom: '2rem', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
                <div style={{ height: '160px', width: '100%', position: 'relative' }}>
                    <img src={mission.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--mandae-bg-element)', borderRadius: '20px', padding: '2px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                        <span className={`badge ${mission.status === 'EM_ANDAMENTO' ? 'badge-info' : mission.status === 'CONCLUIDA' ? 'badge-warning' : mission.status === 'FINALIZADA' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                            {mission.status === 'CONCLUIDA' ? 'AGUARDANDO PRÊMIO' : mission.status.replace('_', ' ')}
                        </span>
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '2rem 1.5rem 1rem 1.5rem' }}>
                        <h2 style={{ color: 'white', margin: 0, fontSize: '1.8rem' }}>{mission.title}</h2>
                    </div>
                </div>
            </div>

            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>O que precisa ser feito</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {missionActivities.map(activity => {

                    let statusColor = 'var(--mandae-text-light)';
                    let statusIcon = <CircleDashed size={24} color={statusColor} />;
                    let buttonLabel = 'Reivindicar';
                    let buttonDisabled = false;
                    let buttonStyle = 'btn-outline';

                    if (activity.status === 'reivindicada') {
                        statusColor = 'var(--mandae-warning)';
                        statusIcon = <Clock size={24} color={statusColor} />;
                        buttonLabel = 'Aguardando Pais';
                        buttonDisabled = true;
                        buttonStyle = 'btn-ghost';
                    } else if (activity.status === 'realizada') {
                        statusColor = 'var(--mandae-success)';
                        statusIcon = <CheckCircle2 size={24} color={statusColor} />;
                        buttonLabel = 'Concluída';
                        buttonDisabled = true;
                        buttonStyle = 'btn-ghost';
                    }

                    const dueDate = new Date(activity.plannedDate);
                    const isLate = dueDate < new Date() && activity.status === 'pendente';

                    return (
                        <div key={activity.id} className="card hover-lift" style={{
                            display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem',
                            borderLeft: isLate ? '4px solid var(--mandae-danger)' : `4px solid ${activity.status === 'realizada' ? 'var(--mandae-success)' : 'var(--mandae-border)'}`,
                            opacity: activity.status === 'realizada' ? 0.7 : 1
                        }}>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: '80px', textAlign: 'center', padding: '0.5rem', background: 'var(--mandae-bg)', borderRadius: 'var(--radius-sm)' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--mandae-text-light)', textTransform: 'uppercase', fontWeight: 'bold' }}> {dueDate.toLocaleString('pt-BR', { month: 'short' })} </span>
                                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: isLate ? 'var(--mandae-danger)' : 'var(--mandae-text)' }}> {dueDate.getDate()} </span>
                            </div>

                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem', textDecoration: activity.status === 'realizada' ? 'line-through' : 'none' }}>{activity.description}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className="badge" style={{ background: 'var(--mandae-primary)', color: 'white' }}>
                                        Recompensa: {mission.type === 'FIXO' ? `+ ${activity.weight}%` : `+ R$ ${activity.value.toFixed(2)}`}
                                    </span>
                                    {isLate && <span className="badge badge-danger">Atrasado</span>}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minWidth: '140px' }}>
                                {statusIcon}
                                <button
                                    className={`btn ${buttonStyle}`}
                                    style={{ width: '100%', padding: '0.6rem 1rem' }}
                                    disabled={buttonDisabled}
                                    onClick={() => handleClaim(activity.id)}
                                >
                                    {buttonLabel}
                                </button>
                            </div>

                        </div>
                    );
                })}
            </div>

        </div>
    );
}
