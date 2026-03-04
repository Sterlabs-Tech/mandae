'use client';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../store/AppContext';
import { LogOut, Star, Trophy } from 'lucide-react';

export default function ChildLayout({ children }) {
    const { currentUser, logout } = useAppStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="app-container" style={{ background: 'var(--mandae-bg)', flexDirection: 'column' }}>
            {/* Top Navbar for Child - Mobile First / Visual */}
            <header style={{
                height: '80px',
                background: 'linear-gradient(90deg, var(--mandae-primary), var(--mandae-accent))',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 5%',
                boxShadow: '0 4px 20px rgba(247, 37, 133, 0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                        src={currentUser?.avatar}
                        alt="Avatar"
                        className="avatar hover-lift child-header-avatar"
                        style={{ width: '56px', height: '56px', border: '3px solid white', cursor: 'pointer' }}
                        onClick={() => router.push('/child')}
                    />
                    <div>
                        <h2 className="child-header-title" style={{ fontSize: '1.4rem', color: 'white', margin: 0, whiteSpace: 'nowrap' }}>Olá, {currentUser?.name.split(' ')[0]}!</h2>
                        <div className="child-header-level" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', opacity: 0.9 }}>
                            <Star size={14} fill="white" /> <span>Nível: Aventureiro</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <div className="badge child-header-badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem 1rem', display: 'flex', gap: '6px', alignItems: 'center', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                        <Trophy size={18} color="gold" />
                        <span className="child-header-badge-text">Minhas Metas</span>
                    </div>
                    <button className="btn-icon" onClick={handleLogout} style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }} title="Sair">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="main-content" style={{ padding: '2rem 5%', background: 'var(--mandae-bg)' }}>
                {children}
            </main>
        </div>
    );
}
