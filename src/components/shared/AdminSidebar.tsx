"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, User, BookOpen, Clock, FlaskConical,
    Trophy, GraduationCap, Mail, Navigation, ImageIcon, Settings,
    LogOut, ChevronRight, Eye
} from 'lucide-react';
import { useState } from 'react';

const navSections = [
    { group: 'Overview', items: [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ]},
    { group: 'Content', items: [
        { label: 'Personal Info', href: '/admin/dashboard/personal', icon: User },
        { label: 'About & Skills', href: '/admin/dashboard/about', icon: BookOpen },
        { label: 'Journey', href: '/admin/dashboard/journey', icon: Clock },
        { label: 'Research', href: '/admin/dashboard/research', icon: FlaskConical },
        { label: 'Awards', href: '/admin/dashboard/awards', icon: Trophy },
        { label: 'Teaching', href: '/admin/dashboard/teaching', icon: GraduationCap },
        { label: 'Contact', href: '/admin/dashboard/contact', icon: Mail },
    ]},
    { group: 'Site', items: [
        { label: 'Navigation', href: '/admin/dashboard/navigation', icon: Navigation },
        { label: 'Media', href: '/admin/dashboard/media', icon: ImageIcon },
        { label: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
    ]},
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewKey, setPreviewKey] = useState(0);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/admin/login';
    };

    // Determine the public route to preview based on current admin route
    const publicRouteMap: Record<string, string> = {
        '/admin/dashboard/personal': '/',
        '/admin/dashboard/about': '/',
        '/admin/dashboard/journey': '/journey',
        '/admin/dashboard/research': '/research',
        '/admin/dashboard/awards': '/awards',
        '/admin/dashboard/teaching': '/teaching',
        '/admin/dashboard/contact': '/contact',
    };
    const previewUrl = publicRouteMap[pathname] || '/';

    return (
        <>
            {/* Sidebar */}
            <aside style={{
                width: '220px', flexShrink: 0, background: 'rgba(9,9,11,0.95)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', flexDirection: 'column', height: '100vh',
                position: 'sticky', top: 0, overflowY: 'auto',
            }}>
                {/* Logo */}
                <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff', borderRadius: '6px' }}>
                            MB
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FAFAFA' }}>Dr. M. Madhu Bala</div>
                            <div style={{ fontSize: '10px', color: '#52525B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Admin Panel</div>
                        </div>
                    </div>
                </div>

                {/* Nav groups */}
                <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {navSections.map((section) => (
                        <div key={section.group}>
                            <div style={{ fontSize: '10px', fontWeight: 600, color: '#52525B', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: '4px' }}>
                                {section.group}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                                    return (
                                        <Link key={item.href} href={item.href} style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            padding: '8px 10px', borderRadius: '6px', textDecoration: 'none',
                                            fontSize: '13px', fontWeight: active ? 600 : 400,
                                            color: active ? '#FAFAFA' : '#71717A',
                                            background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                                            transition: 'all 0.15s',
                                        }}>
                                            <Icon size={15} color={active ? '#60A5FA' : '#52525B'} />
                                            {item.label}
                                            {active && <ChevronRight size={12} style={{ marginLeft: 'auto', color: '#52525B' }} />}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom actions */}
                <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button
                        onClick={() => { setPreviewKey(k => k + 1); setPreviewOpen(true); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '6px', border: 'none', background: 'rgba(37,99,235,0.12)', color: '#60A5FA', cursor: 'pointer', fontSize: '13px', fontWeight: 500, width: '100%' }}>
                        <Eye size={15} />
                        Live Preview
                    </button>
                    <button onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#71717A', cursor: 'pointer', fontSize: '13px', width: '100%', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                        onMouseLeave={e => e.currentTarget.style.color = '#71717A'}>
                        <LogOut size={15} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Live Preview Panel */}
            {previewOpen && (
                <div style={{
                    position: 'fixed', right: 0, top: 0, bottom: 0,
                    width: '55%', zIndex: 200, background: '#09090B',
                    borderLeft: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,0.5)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(24,24,27,0.9)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Eye size={14} color="#60A5FA" />
                            <span style={{ fontSize: '12px', color: '#A1A1AA', fontFamily: 'monospace' }}>localhost:3000{previewUrl}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => setPreviewKey(k => k + 1)}
                                style={{ padding: '4px 10px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#71717A', fontSize: '12px', cursor: 'pointer' }}>
                                ↻ Refresh
                            </button>
                            <button onClick={() => setPreviewOpen(false)}
                                style={{ padding: '4px 10px', borderRadius: '5px', border: 'none', background: 'rgba(239,68,68,0.15)', color: '#EF4444', fontSize: '12px', cursor: 'pointer' }}>
                                ✕ Close
                            </button>
                        </div>
                    </div>
                    <iframe key={previewKey} src={`http://localhost:3000${previewUrl}`} style={{ flex: 1, border: 'none', width: '100%' }} title="Live Preview" />
                </div>
            )}
        </>
    );
}
