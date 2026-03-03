import { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { X, Upload, Save } from 'lucide-react';

const ChildProfileSettings = ({ child, onClose }) => {
    const { updateUser } = useAppStore();

    const [name, setName] = useState(child?.name || '');
    const [email, setEmail] = useState(child?.email || '');
    const [password, setPassword] = useState(child?.password || '');
    const [avatar, setAvatar] = useState(child?.avatar || '');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            alert('Nome, e-mail e senha são obrigatórios.');
            return;
        }

        updateUser(child.id, {
            name,
            email,
            password,
            avatar
        });

        onClose();
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--mandae-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.4rem' }}>Editar Dependente</h2>
                    <button className="btn-icon btn-ghost" onClick={onClose}><X size={20} /></button>
                </div>

                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--mandae-border)', marginBottom: '1rem' }}>
                            {avatar ? (
                                <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: 'var(--mandae-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
                                    {name.charAt(0) || '?'}
                                </div>
                            )}
                        </div>
                        <label className="btn btn-outline" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                            <Upload size={16} /> Trocar Foto
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                        </label>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Nome Completo</label>
                        <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">E-mail de Acesso</label>
                        <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Senha de Acesso</label>
                        <input type="text" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                </div>

                <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--mandae-border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: 'var(--mandae-bg-element)' }}>
                    <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        <Save size={18} /> Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChildProfileSettings;
