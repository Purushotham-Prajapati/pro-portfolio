import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Journey', to: '/journey' },
    { label: 'Research', to: '/research' },
    { label: 'Awards', to: '/awards' },
    { label: 'Teaching', to: '/teaching' },
    { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 60)
        window.addEventListener('scroll', handler, { passive: true })
        return () => window.removeEventListener('scroll', handler)
    }, [])

    // Close mobile menu on route change
    useEffect(() => { setMobileOpen(false) }, [location.pathname])

    // Always show solid bg on inner pages
    const isHome = location.pathname === '/'
    const solid = scrolled || !isHome

    return (
        <>
            <nav
                style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0,
                    zIndex: 100,
                    transition: 'all 0.35s ease',
                    backgroundColor: solid ? 'rgba(9,9,11,0.95)' : 'transparent',
                    backdropFilter: solid ? 'blur(14px)' : 'none',
                    borderBottom: solid ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
            >
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: `${solid ? '14px' : '22px'} 24px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'padding 0.35s ease' }}>

                    {/* Logo */}
                    <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '32px', height: '32px', backgroundColor: '#2563EB',
                            color: '#fff', fontSize: '12px', fontWeight: 800,
                            fontFamily: 'Archivo, sans-serif', letterSpacing: '0.01em',
                        }}>
                            MB
                        </div>
                        <div>
                            <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: '14px', fontWeight: 700, color: '#FAFAFA', lineHeight: 1.2 }}>
                                Dr. M. Madhu Bala
                            </div>
                            <div style={{ fontSize: '10px', color: '#71717A', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                Professor · CSE
                            </div>
                        </div>
                    </NavLink>

                    {/* Desktop nav */}
                    <ul style={{ display: 'flex', gap: '4px', listStyle: 'none', margin: 0, padding: 0 }} className="nav-desktop">
                        {navItems.map((item) => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    end={item.to === '/'}
                                    style={({ isActive }) => ({
                                        display: 'inline-block',
                                        padding: '6px 14px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        letterSpacing: '0.06em',
                                        textTransform: 'uppercase',
                                        textDecoration: 'none',
                                        color: isActive ? '#FAFAFA' : '#71717A',
                                        backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                                        border: isActive ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
                                        transition: 'all 0.2s ease',
                                    })}
                                    onMouseEnter={(e) => { if (!(e.currentTarget as HTMLAnchorElement).getAttribute('aria-current')) e.currentTarget.style.color = '#FAFAFA' }}
                                    onMouseLeave={(e) => { if (!(e.currentTarget as HTMLAnchorElement).getAttribute('aria-current')) e.currentTarget.style.color = '#71717A' }}
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{ background: 'none', border: 'none', color: '#FAFAFA', cursor: 'pointer', padding: '6px', display: 'none' }}
                        aria-label="Toggle navigation"
                        className="nav-mobile-toggle"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            <div
                style={{
                    position: 'fixed', inset: 0, zIndex: 99,
                    backgroundColor: 'rgba(9,9,11,0.98)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: '8px',
                    opacity: mobileOpen ? 1 : 0,
                    pointerEvents: mobileOpen ? 'all' : 'none',
                    transition: 'opacity 0.25s ease',
                }}
            >
                {navItems.map((item, i) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        style={({ isActive }) => ({
                            fontSize: 'clamp(24px, 6vw, 40px)',
                            fontFamily: 'Archivo, sans-serif',
                            fontWeight: 800,
                            textDecoration: 'none',
                            color: isActive ? '#2563EB' : '#FAFAFA',
                            letterSpacing: '-0.02em',
                            padding: '8px 0',
                            transform: `translateY(${mobileOpen ? '0' : '20px'})`,
                            transition: `color 0.2s ease, transform 0.35s ease ${i * 0.05}s`,
                        })}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>

            <style>{`
        @media (min-width: 768px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile-toggle { display: none !important; }
        }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
        }
      `}</style>
        </>
    )
}
