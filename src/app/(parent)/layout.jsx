'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '../../store/AppContext';
import { LayoutDashboard, CheckCircle, Users, LogOut, Settings } from 'lucide-react';
import UserProfileSettings from '../../components/shared/UserProfileSettings';

export default function ParentLayout({ children }) {
    const { currentUser, logout, activities } = useAppStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    // If no currentUser or not a parent, we should handle this via a higher level auth wrapper, 
    // but for now, we just let it render or you can add a redirect here if needed.

    // Count pending approvals
    const pendingApprovals = activities.filter(a => a.status === 'reivindicada').length;

    return (
        <div className="app-container" style={{ background: 'var(--mandae-bg)' }}>
            {/* Sidebar */}
            <aside style={{
                width: 'var(--sidebar-width)',
                background: 'var(--mandae-bg-element)',
                borderRight: '1px solid var(--mandae-border)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '4px 0 24px rgba(0,0,0,0.02)'
            }}>
                {/* Logo / Brand */}
                <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--mandae-border)' }}>
                    <h2 className="text-gradient" style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--mandae-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>M</span>
                        </div>
                        Mandae
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--mandae-text-light)' }}>Plataforma para Pais</span>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link
                        href="/parent"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)',
                            background: pathname === '/parent' ? 'rgba(67, 97, 238, 0.1)' : 'transparent',
                            color: pathname === '/parent' ? 'var(--mandae-primary)' : 'var(--mandae-text)',
                            fontWeight: pathname === '/parent' ? '600' : '500',
                            textDecoration: 'none'
                        }}
                    >
                        <LayoutDashboard size={20} />
                        Missões
                    </Link>

                    <Link
                        href="/parent/approvals"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)',
                            background: pathname === '/parent/approvals' ? 'rgba(67, 97, 238, 0.1)' : 'transparent',
                            color: pathname === '/parent/approvals' ? 'var(--mandae-primary)' : 'var(--mandae-text)',
                            fontWeight: pathname === '/parent/approvals' ? '600' : '500',
                            justifyContent: 'space-between',
                            textDecoration: 'none'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <CheckCircle size={20} />
                            Aprovações
                        </div>
                        {pendingApprovals > 0 && (
                            <span className="badge badge-danger" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>{pendingApprovals}</span>
                        )}
                    </Link>

                    <Link
                        href="/parent/dependents"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)',
                            background: pathname === '/parent/dependents' ? 'rgba(67, 97, 238, 0.1)' : 'transparent',
                            color: pathname === '/parent/dependents' ? 'var(--mandae-primary)' : 'var(--mandae-text)',
                            fontWeight: pathname === '/parent/dependents' ? '600' : '500',
                            textDecoration: 'none'
                        }}
                    >
                        <Users size={20} />
                        Dependentes
                    </Link>
                </nav>

                {/* User Card */}
                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--mandae-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                        <img src={currentUser?.avatar} alt="Avatar" className="avatar" style={{ width: '40px', height: '40px' }} />
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{currentUser?.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--mandae-text-light)' }}>Diretor</div>
                        </div>
                        <button className="btn-icon btn-ghost" onClick={() => setIsProfileOpen(true)}><Settings size={18} /></button>
                    </div>
                    <button className="btn btn-outline" style={{ width: '100%' }} onClick={handleLogout}>
                        <LogOut size={16} /> Sair
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <header style={{
                    height: 'var(--header-height)',
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid var(--mandae-border)',
                    position: 'sticky', top: 0, zIndex: 10,
                    display: 'flex', alignItems: 'center', padding: '0 2rem'
                }}>
                    <h1 style={{ fontSize: '1.25rem' }}>Painel do Responsável</h1>
                </header>
                <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>

            {isProfileOpen && <UserProfileSettings onClose={() => setIsProfileOpen(false)} />}
        </div>
    );
}
