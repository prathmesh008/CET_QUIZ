import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart2, History, LogOut, Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { resetresultaction } from '../Redux/Resultreducer';

export default function DashboardLayout({ children, activePage = 'dashboard', onTabChange }) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { userid } = useSelector(state => state.result);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = () => {
        dispatch(resetresultaction());
        navigate('/');
    }

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/select-quiz' },
        { id: 'results', label: 'Results', icon: FileText, path: '#' },
        { id: 'performance', label: 'Performance', icon: BarChart2, path: '#' },
        { id: 'history', label: 'History', icon: History, path: '#' },
    ];

    const handleNavClick = (item) => {
        if (item.path !== '#') {
            if (location.pathname === item.path && onTabChange) {
                onTabChange(item.id);
            } else {
                navigate(item.path);
            }
        } else if (onTabChange) {
            onTabChange(item.id);
        }
        setIsMobileOpen(false); 
    };

    return (
        <div className="dashboard-container-flex">
            {}
            {isMobileOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {}
            <div className={`dashboard-sidebar ${isMobileOpen ? 'open' : ''}`}>
                {}
                <div style={{ padding: '32px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #347ab7 0%, #1e40af 100%)', borderRadius: '8px' }}></div>
                        Assessment
                    </h2>
                    <button className="mobile-menu-toggle" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsMobileOpen(false)}>
                        <X size={24} color="#64748b" />
                    </button>
                </div>

                {}
                <div style={{ flex: 1, padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {navItems.map(item => (
                        <div
                            key={item.id}
                            onClick={() => handleNavClick(item)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                color: activePage === item.id ? '#347ab7' : '#64748b',
                                background: activePage === item.id ? '#f0f9ff' : 'transparent',
                                fontWeight: activePage === item.id ? '600' : '500',
                                transition: 'all 0.2s ease',
                                borderLeft: activePage === item.id ? '3px solid #347ab7' : '3px solid transparent'
                            }}
                        >
                            <item.icon size={20} strokeWidth={activePage === item.id ? 2.5 : 2} />
                            {item.label}
                        </div>
                    ))}
                </div>

                {}
                <div style={{ padding: '24px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: '#e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            color: '#475569',
                            fontSize: '1rem',
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                            {userid ? userid[0]?.toUpperCase() : 'U'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {userid || 'Candidate'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Student</div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            width: '100%',
                            padding: '10px 16px',
                            background: 'white',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            color: '#475569',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>

            {}
            <div className="dashboard-main">
                <div style={{ padding: '16px 20px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '64px' }}>
                    <button className="mobile-menu-toggle" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsMobileOpen(true)}>
                        <Menu size={24} color="#0f172a" />
                    </button>
                    {}
                </div>

                <div className="dashboard-content-wrapper">
                    {children}
                </div>
            </div>
        </div>
    );
}
