import { useRef, useEffect } from 'react'
import { subjectsHandled, administrativeRoles, memberships } from '../data/portfolio'
import { Users, Briefcase, Award } from 'lucide-react'

export default function TeachingSection() {
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = contentRef.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
            { threshold: 0.05 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    return (
        <section style={{ backgroundColor: '#F4F4F5', color: '#09090B', padding: 'clamp(48px, 6vw, 96px) 24px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

                <div
                    ref={contentRef}
                    className="stagger-children"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}
                >
                    {/* Subjects */}
                    <div style={{ backgroundColor: '#FAFAFA', border: '1px solid #E4E4E7', padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                            <Users size={18} color="#2563EB" />
                            <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: '15px' }}>Subjects Taught</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {subjectsHandled.map((subject, i) => (
                                <div
                                    key={subject}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '10px 14px',
                                        backgroundColor: '#F4F4F5',
                                        border: '1px solid #E4E4E7',
                                        transition: 'all 0.15s ease',
                                        cursor: 'default',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#09090B'; e.currentTarget.style.borderColor = '#09090B'; (e.currentTarget.querySelector('.subj-text') as HTMLElement).style.color = '#FAFAFA' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F4F4F5'; e.currentTarget.style.borderColor = '#E4E4E7'; (e.currentTarget.querySelector('.subj-text') as HTMLElement).style.color = '#3F3F46' }}
                                >
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', fontFamily: 'Archivo, sans-serif', minWidth: '20px' }}>
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className="subj-text" style={{ fontSize: '13px', fontWeight: 500, color: '#3F3F46', transition: 'color 0.15s ease' }}>
                                        {subject}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Administrative Roles */}
                        <div style={{ backgroundColor: '#09090B', color: '#FAFAFA', border: '1px solid #27272A', padding: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                <Briefcase size={18} color="#D97706" />
                                <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: '15px', color: '#FAFAFA' }}>Administrative Roles</span>
                            </div>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {administrativeRoles.map((role) => (
                                    <li key={role} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D97706', flexShrink: 0, marginTop: '6px' }} />
                                        <span style={{ fontSize: '14px', color: '#A1A1AA', lineHeight: 1.5 }}>{role}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Memberships */}
                        <div style={{ backgroundColor: '#FAFAFA', border: '1px solid #E4E4E7', padding: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                <Award size={18} color="#059669" />
                                <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: '15px' }}>Professional Memberships</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {memberships.map((m) => (
                                    <div key={m.organization} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#F4F4F5', border: '1px solid #E4E4E7' }}>
                                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#09090B' }}>{m.organization}</span>
                                        {m.membershipId && (
                                            <span style={{ fontSize: '11px', color: '#71717A', fontFamily: 'Space Grotesk, monospace' }}>
                                                #{m.membershipId}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
