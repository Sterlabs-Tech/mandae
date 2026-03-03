import { Outlet, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/AppContext';
import { LogOut, Star, Trophy } from 'lucide-react';

const ChildLayout = () => {
    const { currentUser, logout } = useAppStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                        src={currentUser?.avatar}
                        alt="Avatar"
                        className="avatar hover-lift"
                        style={{ width: '56px', height: '56px', border: '3px solid white', cursor: 'pointer' }}
                        onClick={() => navigate('/child')}
                    />
                    <div>
                        <h2 style={{ fontSize: '1.4rem', color: 'white', margin: 0 }}>Olá, {currentUser?.name.split(' ')[0]}!</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', opacity: 0.9 }}>
                            <Star size={14} fill="white" /> <span>Nível: Aventureiro</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem 1rem', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '1rem' }}>
                        <Trophy size={18} color="gold" />
                        <span>Minhas Metas</span>
                    </div>
                    <button className="btn-icon" onClick={handleLogout} style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }} title="Sair">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="main-content" style={{ padding: '2rem 5%', background: 'var(--mandae-bg)' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default ChildLayout;
