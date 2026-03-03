'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '../../store/AppContext';
import { UserPlus, Camera } from 'lucide-react';
import { registerUser } from '../../actions/db';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    // No longer need users array here, calling db action directly
    // const { users, setUsers } = useAppStore();
    const router = useRouter();

    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Let the server handle ID creation (uuid) and avatar defaults
            const data = { name, email, phone, password };
            const result = await registerUser(data);

            if (result.success) {
                router.push('/login');
            } else {
                setError(result.message || 'Erro ao realizar cadastro.');
            }
        } catch (err) {
            setError('Houve um erro no servidor.');
        }
    };

    return (
        <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--mandae-primary-light), var(--mandae-primary-dark))' }}>
            <div className="glass-panel animate-slide-right" style={{ padding: '2.5rem', width: '100%', maxWidth: '460px', borderRadius: 'var(--radius-xl)' }}>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ color: 'var(--mandae-primary-dark)', marginBottom: '0.5rem' }}>Seja um Diretor</h2>
                    <p style={{ color: 'var(--mandae-text-light)' }}>Gerencie as missões dos seus filhos.</p>
                </div>

                {error && (
                    <div className="badge badge-danger" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem', padding: '0.75rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--mandae-primary-light)', cursor: 'pointer' }}>
                            <Camera color="var(--mandae-primary)" size={32} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--mandae-text)', fontWeight: '500' }}>Nome Completo</label>
                        <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required placeholder="Ex: Roberto Silva" />
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--mandae-text)', fontWeight: '500' }}>E-mail</label>
                        <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seu@email.com" />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label" style={{ color: 'var(--mandae-text)', fontWeight: '500' }}>Telefone</label>
                            <input type="tel" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="(11) 99999-9999" />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label" style={{ color: 'var(--mandae-text)', fontWeight: '500' }}>Senha</label>
                            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required placeholder="******" />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'var(--mandae-success)' }}>
                        <UserPlus size={20} /> Cadastrar Responsável
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <Link href="/login" style={{ color: 'var(--mandae-primary-dark)', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'underline' }}>
                        Voltar para o Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
