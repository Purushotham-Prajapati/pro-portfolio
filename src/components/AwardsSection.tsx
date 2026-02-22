import { useRef, useEffect } from 'react'
import { awards } from '../data/portfolio'
import { Trophy } from 'lucide-react'

const awardColors = [
    '#D97706', '#2563EB', '#059669', '#DC2626', '#7C3AED', '#0891B2', '#EA580C',
]

export default function AwardsSection() {
    const gridRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = gridRef.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
            { threshold: 0.05 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    const sorted = [...awards].sort((a, b) => b.year - a.year)

    return (
        <section style={{ backgroundColor: '#09090B', padding: 'clamp(48px, 6vw, 96px) 24px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

                {/* Awards grid */}
                <div
                    ref={gridRef}
                    className="stagger-children"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '1px',
                        backgroundColor: '#1A1A1C',
                        border: '1px solid #27272A',
                    }}
                >
                    {sorted.map((award, i) => {
                        const color = awardColors[i % awardColors.length]
                        return (
                            <div
                                key={award.title}
                                style={{
                                    backgroundColor: '#09090B',
                                    padding: '32px 28px',
                                    borderLeft: `3px solid ${color}`,
                                    transition: 'background-color 0.2s ease, transform 0.2s ease',
                                    cursor: 'default',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#111114'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#09090B'; e.currentTarget.style.transform = 'translateY(0)' }}
                            >
                                <Trophy size={18} color={color} strokeWidth={1.5} style={{ marginBottom: '16px' }} />
                                <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: '32px', fontWeight: 800, color, lineHeight: 1, marginBottom: '12px' }}>
                                    {award.year}
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#FAFAFA', lineHeight: 1.4 }}>
                                    {award.title}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
