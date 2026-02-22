import { useEffect, useRef, useState } from 'react'
import { useCountUp } from '../hooks/useCountUp'
import { personalInfo, publications } from '../data/portfolio'
import { ChevronDown } from 'lucide-react'

function StatCard({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
    const { count, ref } = useCountUp(value, 1800)
    return (
        <div style={{ textAlign: 'center' }}>
            <div
                ref={ref as React.RefObject<HTMLDivElement>}
                style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontSize: 'clamp(36px, 5vw, 52px)',
                    fontWeight: 800,
                    color: '#FAFAFA',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                }}
            >
                {count}{suffix}
            </div>
            <div style={{ fontSize: '12px', color: '#71717A', marginTop: '6px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
                {label}
            </div>
        </div>
    )
}

export default function HeroSection() {
    const titleRef = useRef<HTMLHeadingElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100)
        return () => clearTimeout(t)
    }, [])

    const nameParts = personalInfo.name.split(' ')

    return (
        <section
            id="hero"
            style={{
                minHeight: '100vh',
                backgroundColor: '#09090B',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                paddingTop: '80px',
            }}
        >
            {/* Grid bg */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(#27272A 1px, transparent 1px), linear-gradient(90deg, #27272A 1px, transparent 1px)',
                backgroundSize: '80px 80px',
                opacity: 0.3,
                pointerEvents: 'none',
            }} />

            {/* Accent glow top-right */}
            <div style={{
                position: 'absolute', top: '-10%', right: '-5%',
                width: '400px', height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', width: '100%', position: 'relative' }}>

                {/* Eyebrow */}
                <div
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        marginBottom: '32px',
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'none' : 'translateY(20px)',
                        transition: 'all 0.7s ease 0.1s',
                    }}
                >
                    <span style={{
                        width: '40px', height: '1px', background: '#2563EB', display: 'block',
                    }} />
                    <span style={{
                        fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: '#2563EB', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif',
                    }}>
                        Professor · Researcher · Mentor
                    </span>
                </div>

                {/* Name */}
                <h1
                    ref={titleRef}
                    style={{
                        fontFamily: 'Archivo, sans-serif',
                        fontWeight: 900,
                        lineHeight: 0.9,
                        letterSpacing: '-0.03em',
                        color: '#FAFAFA',
                        fontSize: 'clamp(52px, 8vw, 110px)',
                        margin: 0,
                        marginBottom: '8px',
                    }}
                >
                    {nameParts.map((part, i) => (
                        <span
                            key={i}
                            style={{
                                display: 'block',
                                opacity: visible ? 1 : 0,
                                transform: visible ? 'none' : 'translateY(40px)',
                                transition: `all 0.8s cubic-bezier(0.25,0.46,0.45,0.94) ${0.2 + i * 0.1}s`,
                            }}
                        >
                            {i === nameParts.length - 1 ? (
                                <span style={{ color: '#2563EB' }}>{part}</span>
                            ) : part}
                        </span>
                    ))}
                </h1>

                {/* Designation */}
                <p
                    style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: 'clamp(14px, 2vw, 18px)',
                        color: '#71717A',
                        fontWeight: 400,
                        marginTop: '24px',
                        marginBottom: '0',
                        maxWidth: '480px',
                        lineHeight: 1.6,
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'none' : 'translateY(20px)',
                        transition: 'all 0.7s ease 0.6s',
                    }}
                >
                    {personalInfo.designation}
                    <br />
                    <span style={{ color: '#52525B', fontSize: '0.9em' }}>
                        JNTUH-Ratified · IEEE Member
                    </span>
                </p>

                {/* Stats */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '24px',
                        maxWidth: '640px',
                        marginTop: '64px',
                        paddingTop: '40px',
                        borderTop: '1px solid #27272A',
                        opacity: visible ? 1 : 0,
                        transition: 'opacity 0.7s ease 0.8s',
                    }}
                >
                    <StatCard value={personalInfo.experience.total} suffix="+" label="Years Experience" />
                    <StatCard value={publications.totalPapers} suffix="+" label="Publications" />
                    <StatCard value={publications.patents} label="Patents" />
                    <StatCard value={personalInfo.googleScholar.citations} suffix="+" label="Citations" />
                </div>
            </div>

            {/* Scroll indicator */}
            <div
                style={{
                    position: 'absolute', bottom: '32px', left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '6px',
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 0.7s ease 1.2s',
                    animation: 'bounce 2s ease-in-out infinite',
                }}
            >
                <span style={{ fontSize: '10px', color: '#52525B', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Scroll</span>
                <ChevronDown size={16} color="#52525B" />
            </div>

            <style>{`
        @keyframes bounce {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
        </section>
    )
}
