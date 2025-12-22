import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart2, History, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { resetresultaction } from '../Redux/Resultreducer';

export default function DashboardLayout({ children, activePage = 'dashboard', onTabChange }) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { userid } = useSelector(state => state.result);

    const handleLogout = () => {
        dispatch(resetresultaction());
        navigate('/');
    }

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/select-quiz' },
        { id: 'results', label: 'Results', icon: FileText, path: '#' }, // Placeholder for now, active on Result page
        { id: 'performance', label: 'Performance', icon: BarChart2, path: '#' },
        { id: 'history', label: 'History', icon: History, path: '#' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', background: '#f8fafc' }}>
            {/* Persistent Left Sidebar */}
            <div style={{ width: '260px', background: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50 }}>
                {/* Logo Area */}
                <div style={{ padding: '32px 24px', borderBottom: '1px solid #f1f5f9' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #347ab7 0%, #1e40af 100%)', borderRadius: '8px' }}></div>
                        Assessment
                    </h2>
                </div>

                {/* Navigation Items */}
                <div style={{ flex: 1, padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {navItems.map(item => (
                        <div
                            key={item.id}
                            onClick={() => {
                                if (item.path !== '#') {
                                    if (location.pathname === item.path && onTabChange) {
                                        onTabChange(item.id);
                                    } else {
                                        navigate(item.path);
                                    }
                                } else if (onTabChange) {
                                    onTabChange(item.id);
                                }
                            }}
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

                {/* User Profile & Logout */}
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

            {/* Main Content Area */}
            <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px 40px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {/* Optional Top Bar Content (e.g. User Profile placeholder if needed, though sidebar covers most) */}
                    {/* For now, just spacing or breadcrumb could go here. Keeping it minimal. */}
                </div>

                <div style={{ padding: '40px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
