import { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { X, ChevronRight, ChevronLeft, Save, Upload } from 'lucide-react';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1595514535415-84cf0efd3244?w=400&q=80';

const MissionWizard = ({ onClose }) => {
    const { users, currentUser, missions, setMissions, setActivities } = useAppStore();

    const [step, setStep] = useState(1);
    const children = users.filter(u => u.role === 'crianca' && u.parentId === currentUser?.id);

    // Form State
    const [title, setTitle] = useState('');
    const [childId, setChildId] = useState('');
    const [type, setType] = useState('FIXO'); // FIXO | VARIAVEL
    const [prizeDesc, setPrizeDesc] = useState('');
    const [coverImage, setCoverImage] = useState(DEFAULT_COVER);

    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState('');

    const [missionActivities, setMissionActivities] = useState([]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Step 3 Actions
    const addActivity = () => {
        setMissionActivities([
            ...missionActivities,
            { id: Date.now().toString(), description: '', plannedDate: startDate, weight: 0, value: 0 }
        ]);
    };

    const updateActivity = (index, field, val) => {
        const newActs = [...missionActivities];
        let parsedVal = val;
        if (field === 'weight' || field === 'value') parsedVal = Number(val) || 0;
        newActs[index][field] = parsedVal;
        setMissionActivities(newActs);
    };

    const removeActivity = (index) => {
        const newActs = [...missionActivities];
        newActs.splice(index, 1);
        setMissionActivities(newActs);
    };

    const autoBalanceWeights = () => {
        if (missionActivities.length === 0) return;
        const balanced = Math.floor(100 / missionActivities.length);
        let remainder = 100 - (balanced * missionActivities.length);

        const newActs = missionActivities.map((a, i) => ({
            ...a,
            weight: i === missionActivities.length - 1 ? balanced + remainder : balanced
        }));
        setMissionActivities(newActs);
    };

    const totalWeight = missionActivities.reduce((acc, a) => acc + (a.weight || 0), 0);
    const totalValue = missionActivities.reduce((acc, a) => acc + (a.value || 0), 0);

    const canProceedStep1 = title.trim() !== '' && childId !== '' && (type === 'VARIAVEL' || prizeDesc.trim() !== '');
    const canProceedStep2 = startDate && endDate && new Date(endDate) >= new Date(startDate);
    const canProceedStep3 = missionActivities.length > 0 &&
        (type === 'FIXO' ? totalWeight === 100 : true) &&
        missionActivities.every(a => a.description.trim() !== '' && a.plannedDate);

    const handleFinish = () => {
        const newMissionId = `mission_${Date.now()}`;
        const newMission = {
            id: newMissionId,
            title,
            coverImage: coverImage || DEFAULT_COVER,
            type,
            subtype: type === 'FIXO' ? 'PRESENTE' : 'DINHEIRO',
            prizeDescription: prizeDesc,
            status: 'A_INICIAR', // saving as draft conceptually, or EM_ANDAMENTO
            ownerId: currentUser.id,
            childId,
            startDate,
            endDate,
            startedAt: null,
            completedAt: null
        };

        const finalActivities = missionActivities.map(a => ({
            id: `act_${Date.now()}_${Math.random()}`,
            missionId: newMissionId,
            description: a.description,
            plannedDate: a.plannedDate,
            weight: type === 'FIXO' ? a.weight : null,
            value: type === 'VARIAVEL' ? a.value : null,
            status: 'pendente',
            completedAt: null
        }));

        setMissions([...missions, newMission]);
        setActivities(prev => [...prev, ...finalActivities]);
        onClose();
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>

                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--mandae-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.4rem' }}>Criar Nova Missão</h2>
                    <button className="btn-icon btn-ghost" onClick={onClose}><X size={20} /></button>
                </div>

                <div style={{ padding: '1rem 2rem', background: 'var(--mandae-bg)', display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} style={{ flex: 1, height: '6px', borderRadius: '4px', background: s <= step ? 'var(--mandae-primary)' : 'var(--mandae-border)' }} />
                    ))}
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>

                    {step === 1 && (
                        <div className="animate-fade-in">
                            <h3 style={{ marginBottom: '1.5rem' }}>Passo 1: O Objetivo</h3>

                            <div className="form-group">
                                <label className="form-label">Título da Missão</label>
                                <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Operação Quarto Limpo" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Foto de Capa</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--mandae-border)' }}>
                                        <img src={coverImage || DEFAULT_COVER} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <label className="btn btn-outline" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Upload size={18} /> Subir Foto
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                                    </label>
                                    {coverImage !== DEFAULT_COVER && (
                                        <button type="button" className="btn btn-ghost" onClick={() => setCoverImage(DEFAULT_COVER)} style={{ color: 'var(--mandae-danger)', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                            Remover
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Criança Alvo</label>
                                <select className="form-control" value={childId} onChange={e => setChildId(e.target.value)}>
                                    <option value="">Selecione um dependente...</option>
                                    {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tipo de Recompensa</label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div
                                        onClick={() => setType('FIXO')}
                                        style={{ flex: 1, padding: '1rem', border: `2px solid ${type === 'FIXO' ? 'var(--mandae-primary)' : 'var(--mandae-border)'}`, borderRadius: 'var(--radius-sm)', cursor: 'pointer', textAlign: 'center', background: type === 'FIXO' ? 'rgba(67, 97, 238, 0.05)' : 'transparent' }}
                                    >
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>Prêmio Fixo</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--mandae-text-light)' }}>Trabalha por %, prêmio único final.</div>
                                    </div>
                                    <div
                                        onClick={() => setType('VARIAVEL')}
                                        style={{ flex: 1, padding: '1rem', border: `2px solid ${type === 'VARIAVEL' ? 'var(--mandae-primary)' : 'var(--mandae-border)'}`, borderRadius: 'var(--radius-sm)', cursor: 'pointer', textAlign: 'center', background: type === 'VARIAVEL' ? 'rgba(67, 97, 238, 0.05)' : 'transparent' }}
                                    >
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>Variável (Dinheiro/Pontos)</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--mandae-text-light)' }}>Acumula valores por cada tarefa.</div>
                                    </div>
                                </div>
                            </div>

                            {type === 'FIXO' && (
                                <div className="form-group animate-fade-in">
                                    <label className="form-label">Qual é o Prêmio?</label>
                                    <input type="text" className="form-control" value={prizeDesc} onChange={e => setPrizeDesc(e.target.value)} placeholder="Ex: Xbox Game Pass (1 Mês)" />
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in">
                            <h3 style={{ marginBottom: '1.5rem' }}>Passo 2: O Cronograma</h3>

                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Data de Início Prevista</label>
                                    <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Data de Término (Prazo Final)</label>
                                    <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} />
                                </div>
                            </div>

                            {endDate && new Date(endDate) < new Date(startDate) && (
                                <div className="badge badge-danger" style={{ display: 'block', marginTop: '1rem' }}>
                                    A data de término não pode ser anterior à data de início.
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade-in">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3>Passo 3: As Atividades</h3>
                                <button className="btn btn-outline" onClick={addActivity} style={{ padding: '0.5rem 1rem' }}>+ Nova Ativa</button>
                            </div>

                            {missionActivities.length === 0 ? (
                                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--mandae-text-light)', border: '2px dashed var(--mandae-border)', borderRadius: 'var(--radius-sm)' }}>
                                    Adicione as atividades que a criança deverá cumprir.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {missionActivities.map((act, index) => (
                                        <div key={act.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--mandae-bg)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                                            <input
                                                type="text" className="form-control" placeholder="Descrição do que fazer"
                                                value={act.description} onChange={e => updateActivity(index, 'description', e.target.value)} style={{ flex: 2 }}
                                            />
                                            <input
                                                type="date" className="form-control"
                                                value={act.plannedDate} onChange={e => updateActivity(index, 'plannedDate', e.target.value)}
                                                min={startDate} max={endDate} style={{ flex: 1 }}
                                            />

                                            {type === 'FIXO' ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <input
                                                        type="number" className="form-control" placeholder="%"
                                                        value={act.weight || ''} onChange={e => updateActivity(index, 'weight', e.target.value)}
                                                        style={{ width: '80px', textAlign: 'right' }} min="1" max="100"
                                                    />
                                                    <span>%</span>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span>R$</span>
                                                    <input
                                                        type="number" className="form-control" placeholder="0.00"
                                                        value={act.value || ''} onChange={e => updateActivity(index, 'value', e.target.value)}
                                                        style={{ width: '100px', textAlign: 'right' }} min="0" step="0.5"
                                                    />
                                                </div>
                                            )}

                                            <button className="btn-icon btn-ghost" onClick={() => removeActivity(index)} style={{ color: 'var(--mandae-danger)' }}>
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}

                                    {type === 'FIXO' && (
                                        <div style={{ marginTop: '1rem', padding: '1rem', background: totalWeight === 100 ? 'rgba(6, 214, 160, 0.1)' : 'rgba(239, 71, 111, 0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: '500', color: totalWeight === 100 ? 'var(--mandae-success)' : 'var(--mandae-danger)' }}>
                                                Total de Pesos: {totalWeight}% / 100%
                                            </span>
                                            {totalWeight !== 100 && (
                                                <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={autoBalanceWeights}>
                                                    Dividir Iguais
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {type === 'VARIAVEL' && (
                                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(67, 97, 238, 0.1)', borderRadius: 'var(--radius-sm)', textAlign: 'right' }}>
                                            <span style={{ fontWeight: '600', color: 'var(--mandae-primary)' }}>
                                                Total Previsto: R$ {totalValue.toFixed(2)}
                                            </span>
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>
                    )}

                    {step === 4 && (
                        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(67, 97, 238, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <Save size={40} color="var(--mandae-primary)" />
                            </div>
                            <h3 style={{ marginBottom: '1rem' }}>Tudo Pronto!</h3>
                            <p style={{ color: 'var(--mandae-text-light)', marginBottom: '2rem' }}>
                                A missão <strong>{title}</strong> com {missionActivities.length} atividades será criada e enviada para o dependente.
                            </p>

                            <div style={{ background: 'var(--mandae-bg)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--mandae-text-light)' }}>Tipo</span>
                                    <strong>{type}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--mandae-text-light)' }}>Datas</span>
                                    <strong>{new Date(startDate).toLocaleDateString()} a {new Date(endDate).toLocaleDateString()}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--mandae-text-light)' }}>Alvo</span>
                                    <strong>{children.find(c => c.id === childId)?.name}</strong>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--mandae-border)', display: 'flex', justifyContent: 'space-between', background: 'var(--mandae-bg-element)' }}>
                    {step > 1 ? (
                        <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>
                            <ChevronLeft size={20} /> Voltar
                        </button>
                    ) : <div></div>}

                    {step < 4 ? (
                        <button
                            className="btn btn-primary"
                            onClick={() => setStep(step + 1)}
                            disabled={
                                (step === 1 && !canProceedStep1) ||
                                (step === 2 && !canProceedStep2) ||
                                (step === 3 && !canProceedStep3)
                            }
                        >
                            Avançar <ChevronRight size={20} />
                        </button>
                    ) : (
                        <button className="btn btn-primary" style={{ background: 'var(--mandae-success)' }} onClick={handleFinish}>
                            <Save size={20} /> Finalizar Missão
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MissionWizard;
