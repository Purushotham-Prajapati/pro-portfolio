import { useRef, useEffect } from 'react'
import { personalInfo } from '../data/portfolio'
import { ExternalLink, Mail, Globe, BookOpen } from 'lucide-react'

const links = [
    {
        icon: BookOpen,
        label: 'Google Scholar',
        href: personalInfo.googleScholar.link,
        description: `${personalInfo.googleScholar.documents} documents · ${personalInfo.googleScholar.citations} citations`,
        color: '#2563EB',
    },
    {
        icon: Globe,
        label: 'Scopus Profile',
        href: personalInfo.scopus.link,
        description: `h-index: ${personalInfo.scopus.hIndex} · ORCID: ${personalInfo.orcid}`,
        color: '#D97706',
    },
]

export default function ContactSection() {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
            { threshold: 0.1 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    return (
        <section id="contact" style={{ backgroundColor: '#09090B', padding: 'clamp(60px, 8vw, 120px) 24px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                <div
                    ref={ref}
                    className="reveal"
                    style={{
                        border: '1px solid #27272A',
                        backgroundColor: '#111114',
                        padding: 'clamp(40px, 6vw, 80px)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '48px',
                        alignItems: 'center',
                    }}
                >
                    {/* Left */}
                    <div>
                        <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563EB', fontWeight: 600 }}>
                            — Academic Profiles
                        </span>
                        <h2 style={{
                            fontFamily: 'Archivo, sans-serif', fontWeight: 800,
                            fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1,
                            letterSpacing: '-0.02em', color: '#FAFAFA',
                            margin: '12px 0 16px',
                        }}>
                            Connect & Collaborate
                        </h2>
                        <p style={{ fontSize: '15px', color: '#71717A', lineHeight: 1.7, maxWidth: '360px', margin: 0 }}>
                            Explore the full breadth of Dr. Madhu Bala's academic output — publications, citations, and research collaborations.
                        </p>

                        {/* ORCID badge */}
                        <div style={{
                            marginTop: '32px',
                            display: 'inline-flex', alignItems: 'center', gap: '10px',
                            padding: '12px 20px', border: '1px solid #27272A',
                            backgroundColor: '#09090B',
                        }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669' }} />
                            <span style={{ fontSize: '12px', color: '#71717A' }}>ORCID</span>
                            <span style={{ fontSize: '12px', fontFamily: 'Space Grotesk, monospace', color: '#A1A1AA', fontWeight: 500 }}>
                                {personalInfo.orcid}
                            </span>
                        </div>
                    </div>

                    {/* Right - links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {links.map(({ icon: Icon, label, href, description, color }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center', gap: '20px',
                                    padding: '24px',
                                    border: '1px solid #27272A',
                                    backgroundColor: '#09090B',
                                    textDecoration: 'none',
                                    transition: 'border-color 0.2s ease, transform 0.2s ease',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateX(4px)' }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#27272A'; e.currentTarget.style.transform = 'translateX(0)' }}
                            >
                                <div style={{
                                    width: '44px', height: '44px',
                                    backgroundColor: `${color}18`,
                                    border: `1px solid ${color}30`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <Icon size={18} color={color} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: '14px', fontWeight: 700, color: '#FAFAFA', marginBottom: '4px' }}>
                                        {label}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#71717A' }}>{description}</div>
                                </div>
                                <ExternalLink size={14} color="#52525B" />
                            </a>
                        ))}

                        {/* Email placeholder */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '20px',
                            padding: '24px', border: '1px solid #27272A',
                            backgroundColor: '#09090B',
                        }}>
                            <div style={{
                                width: '44px', height: '44px',
                                backgroundColor: '#05966918',
                                border: '1px solid #05966930',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <Mail size={18} color="#059669" />
                            </div>
                            <div>
                                <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: '14px', fontWeight: 700, color: '#FAFAFA', marginBottom: '4px' }}>
                                    Department Contact
                                </div>
                                <div style={{ fontSize: '12px', color: '#71717A' }}>Department of Computer Science & Engineering</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    marginTop: '48px',
                    paddingTop: '24px',
                    borderTop: '1px solid #27272A',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                }}>
                    <span style={{ fontSize: '13px', color: '#52525B' }}>
                        © 2025 Dr. M. Madhu Bala — Professor of Computer Science & Engineering
                    </span>
                    <span style={{ fontSize: '11px', color: '#3F3F46', letterSpacing: '0.06em' }}>
                        IEEE Member #96417786 · JNTUH Ratified
                    </span>
                </div>
            </div>
        </section>
    )
}
