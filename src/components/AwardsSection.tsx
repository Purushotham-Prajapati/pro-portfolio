"use client";
import type { CSSProperties } from 'react'
import { useRef, useEffect } from 'react'
import { Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import TiltCard from './shared/TiltCard'

const awardColors = [
    '#D97706',
    '#EA580C',
    '#059669',
    '#DC2626',
    '#B45309',
    '#E11D48',
]

interface AwardsSectionProps {
    data: {
        awards: Array<{ title: string; year: number }>;
        awards_intro?: { badge: string; title_line_1: string; title_line_2: string };
    };
}

export default function AwardsSection({ data }: AwardsSectionProps) {
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

    const sorted = [...(data.awards || [])].sort((a, b) => b.year - a.year)
    const intro = data.awards_intro || {
        badge: "HONOURS & AWARDS",
        title_line_1: "Recognition that",
        title_line_2: "spans 14 years."
    };

    return (
        <section className="theme-page page-theme-awards awards-section" style={{ padding: 'clamp(100px, 12vw, 140px) 24px clamp(48px, 6vw, 96px)' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ textAlign: 'left', marginBottom: '60px' }}>
                    <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D97706', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>
                        — {intro.badge || 'HONOURS & AWARDS'}
                    </span>
                    <h2 style={{
                        fontFamily: 'Archivo, sans-serif', fontWeight: 800,
                        fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.1,
                        letterSpacing: '-0.02em', color: 'hsl(var(--app-text))', margin: '12px 0 0',
                    }}>
                        {intro.title_line_1 || 'Recognition that'}<br />
                        <span style={{
                            background: 'linear-gradient(135deg, #D97706 0%, #EA580C 48%, #E11D48 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}>{intro.title_line_2 || 'spans 14 years.'}</span>
                    </h2>
                </div>

                <div ref={gridRef} className="stagger-children visible awards-grid" style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '1px',
                }}>
                    {sorted.map((award, i) => {
                        const color = awardColors[i % awardColors.length]
                        return (
                            <motion.div
                                key={award.title}
                                initial={false}
                                whileInView={{ y: 0, rotateX: 0 }}
                                viewport={{ once: true, amount: 0.25 }}
                                transition={{ type: 'spring', stiffness: 90, damping: 18, delay: Math.min(i * 0.04, 0.28) }}
                                style={{ perspective: 900 }}
                            >
                                <TiltCard className="award-card award-card-tilt" style={{
                                padding: '32px 28px',
                                borderLeft: `3px solid ${color}`,
                                cursor: 'default',
                            } as CSSProperties}>
                                    <span className="award-shimmer" />
                                    <Trophy size={18} color={color} strokeWidth={1.5} style={{ marginBottom: '16px', position: 'relative', zIndex: 1 }} />
                                    <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: '32px', fontWeight: 800, color, lineHeight: 1, marginBottom: '12px', position: 'relative', zIndex: 1 }}>{award.year}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'hsl(var(--app-text))', lineHeight: 1.4, position: 'relative', zIndex: 1 }}>{award.title}</div>
                                </TiltCard>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
            <style>{`
                .award-card-tilt {
                    min-height: 100%;
                    overflow: hidden;
                    position: relative;
                }

                .award-shimmer {
                    background: linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.26) 45%, transparent 70%);
                    bottom: -20%;
                    left: -80%;
                    pointer-events: none;
                    position: absolute;
                    top: -20%;
                    transform: translateX(0) skewX(-18deg);
                    transition: transform 600ms ease;
                    width: 62%;
                    z-index: 0;
                }

                .award-card-tilt:hover .award-shimmer {
                    transform: translateX(330%) skewX(-18deg);
                }
            `}</style>
        </section>
    )
}
