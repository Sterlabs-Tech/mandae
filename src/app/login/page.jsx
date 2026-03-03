'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '../../store/AppContext';
import { LogIn, KeyRound } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('responsavel@mandae.com');
    const [password, setPassword] = useState('123456');
    const [error, setError] = useState('');

    const { login } = useAppStore();
    const router = useRouter();

    const handleLogin = (e) => {
        e.preventDefault();
        const result = login(email, password);
        if (result.success) {
            if (result.role === 'responsavel') router.push('/parent');
            else router.push('/child');
        } else {
            setError('E-mail ou senha inválidos.');
        }
    };

    return (
        <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--mandae-primary-light), var(--mandae-primary-dark))' }}>
            <div className="glass-panel animate-scale-in" style={{ padding: '2.5rem', width: '100%', maxWidth: '420px', borderRadius: 'var(--radius-xl)' }}>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--mandae-primary-dark)', marginBottom: '0.5rem', fontSize: '2.5rem' }}>Mandae</h1>
                    <p style={{ color: 'var(--mandae-text-light)' }}>Bem-vindo à Jornada!</p>
                </div>

                {error && (
                    <div className="badge badge-danger" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem', padding: '0.75rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--mandae-text)', fontWeight: '500' }}>E-mail</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--mandae-text)', fontWeight: '500' }}>Senha</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="******"
                                required
                            />
                            <KeyRound size={18} style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--mandae-text-light)' }} />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'var(--mandae-primary-dark)', padding: '1rem' }}>
                        <LogIn size={20} /> Entrar na Plataforma
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <span style={{ color: 'var(--mandae-text-light)', fontSize: '0.9rem' }}>Novo por aqui? </span>
                    <Link href="/register" style={{ color: 'var(--mandae-primary-dark)', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'underline' }}>
                        Criar conta de Responsável
                    </Link>
                </div>
            </div>
        </div>
    );
}
