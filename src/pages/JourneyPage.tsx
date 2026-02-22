import { useEffect } from 'react'
import AceternityTimeline from '../components/AceternityTimeline'

export default function JourneyPage() {
    useEffect(() => { window.scrollTo(0, 0) }, [])

    return (
        <div style={{ backgroundColor: '#09090B', minHeight: '100vh', paddingTop: '80px' }}>
            {/* Page header */}
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: 'clamp(48px, 7vw, 96px) 24px 64px',
            }}>
                <span style={{
                    fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: '#3B82F6', fontWeight: 600,
                }}>
                    — The Journey
                </span>
                <h1 style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 800,
                    fontSize: 'clamp(36px, 6vw, 72px)',
                    lineHeight: 1.05,
                    letterSpacing: '-0.03em',
                    color: '#FAFAFA',
                    margin: '16px 0 20px',
                }}>
                    33 Years of<br />
                    <span style={{
                        backgroundImage: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        Relentless Growth
                    </span>
                </h1>
                <p style={{
                    fontSize: '16px', color: '#71717A',
                    maxWidth: '480px', lineHeight: 1.75, margin: 0,
                }}>
                    From a Diploma in Electronics in 1992 to leading dual DST-funded research projects in 2025 — every milestone tells a story of dedication, discovery, and impact.
                </p>

                {/* Quick stats row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '48px' }}>
                    {[
                        { label: 'Years Teaching', value: '18' },
                        { label: 'Industry Experience', value: '3 yrs' },
                        { label: 'Research Active', value: '13 yrs' },
                        { label: 'PhD Scholars Guided', value: '8+' },
                    ].map(({ label, value }) => (
                        <div key={label} style={{ borderLeft: '2px solid #27272A', paddingLeft: '16px' }}>
                            <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: '28px', fontWeight: 800, color: '#FAFAFA', lineHeight: 1 }}>
                                {value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#52525B', marginTop: '4px', letterSpacing: '0.04em' }}>{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline */}
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px clamp(60px, 8vw, 120px)' }}>
                <AceternityTimeline />
            </div>
        </div>
    )
}
