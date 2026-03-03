'use client';
import { useState } from 'react';
import { useAppStore } from '../../../../store/AppContext';
import { UserPlus, Settings, Trash2 } from 'lucide-react';
import ChildProfileSettings from '../../../../components/shared/ChildProfileSettings';

export default function Dependents() {
    const { users, currentUser, setUsers } = useAppStore();
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingChild, setEditingChild] = useState(null);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const children = users.filter(u => u.role === 'crianca' && u.parentId === currentUser?.id);

    const handleAddChild = (e) => {
        e.preventDefault();
        const newChild = {
            id: `child_${Date.now()}`,
            parentId: currentUser.id,
            name,
            email,
            password,
            role: 'crianca',
            status: true,
            avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=06d6a0&color=fff`
        };
        setUsers([...users, newChild]);
        setShowAddForm(false);
        setName(''); setEmail(''); setPassword('');
    };

    const removeChild = (childId) => {
        if (confirm('Tem certeza que deseja remover esta criança e todo o seu histórico?')) {
            setUsers(users.filter(u => u.id !== childId));
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2>Gestão de Dependentes</h2>
                    <p style={{ color: 'var(--mandae-text-light)' }}>Adicione e gerencie os acessos dos seus filhos.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                    <UserPlus size={20} /> Adicionar Criança
                </button>
            </div>

            {showAddForm && (
                <div className="card animate-scale-in" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--mandae-primary)' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Novo Dependente</h3>
                    <form onSubmit={handleAddChild} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                            <label className="form-label">Nome da Criança</label>
                            <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                            <label className="form-label">E-mail de Acesso</label>
                            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group" style={{ flex: '1 1 150px', marginBottom: 0 }}>
                            <label className="form-label">Senha Inicial</label>
                            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="button" className="btn btn-ghost" onClick={() => setShowAddForm(false)}>Cancelar</button>
                            <button type="submit" className="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {children.map(child => (
                    <div key={child.id} className="card hover-lift" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                        <img src={child.avatar} alt={child.name} className="avatar avatar-lg" style={{ margin: '0 auto 1rem auto' }} />
                        <h3 style={{ marginBottom: '0.25rem' }}>{child.name}</h3>
                        <p style={{ color: 'var(--mandae-text-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{child.email}</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                            <button className="btn btn-outline" style={{ flex: 1, padding: '0.5rem' }} onClick={() => setEditingChild(child)}>
                                <Settings size={16} /> Editar
                            </button>
                            <button className="btn btn-outline" style={{ padding: '0.5rem', borderColor: 'var(--mandae-danger)', color: 'var(--mandae-danger)' }} onClick={() => removeChild(child.id)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {children.length === 0 && !showAddForm && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--mandae-text-light)' }}>
                        Nenhum dependente cadastrado ainda.
                    </div>
                )}
            </div>

            {editingChild && <ChildProfileSettings child={editingChild} onClose={() => setEditingChild(null)} />}
        </div>
    );
}
