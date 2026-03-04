'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '../../store/AppContext';
import { LogIn, KeyRound } from 'lucide-react';
import { loginUser } from '../../actions/db';

export default function Login() {
    const [email, setEmail] = useState('responsavel@mandae.com');
    const [password, setPassword] = useState('123456');
    const [error, setError] = useState('');

    const { login } = useAppStore();
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const result = await loginUser(email, password);
            if (result.success) {
                login(result.user); // update global state context
                if (result.role === 'responsavel') router.push('/parent');
                else router.push('/child');
            } else {
                setError(result.message || 'E-mail ou senha inválidos.');
            }
        } catch (err) {
            setError('Erro ao se conectar com o servidor.');
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label className="form-label" style={{ color: 'var(--mandae-text)', fontWeight: '500', marginBottom: 0 }}>Senha</label>
                            <a href="#" style={{ fontSize: '0.85rem', color: 'var(--mandae-primary-dark)', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); alert("Instruções de recuperação enviadas para o e-mail (Mock)"); }}>Esqueci minha senha</a>
                        </div>
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

                    <div style={{ position: 'relative', margin: '1.5rem 0', textAlign: 'center' }}>
                        <hr style={{ border: 'none', borderTop: '1px solid var(--mandae-border)', margin: 0 }} />
                        <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--mandae-bg)', padding: '0 10px', color: 'var(--mandae-text-light)', fontSize: '0.85rem' }}>ou</span>
                    </div>

                    <button type="button" className="btn btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={() => alert("Integração com Google em breve!")}>
                        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        Continuar com Gmail
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
