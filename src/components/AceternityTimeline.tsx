/**
 * Aceternity-inspired Timeline with scroll-beam effect
 * Left column: sticky year label
 * Center: animated vertical beam that fills as you scroll
 * Right: event cards with rich content
 */
import { useEffect, useRef, useState } from 'react'
import { timelineEvents, TimelineEvent } from '../data/portfolio'

const typeConfig: Record<TimelineEvent['type'], { color: string; label: string; bg: string }> = {
    education: { color: '#10B981', label: 'Education', bg: '#10B98115' },
    career: { color: '#3B82F6', label: 'Career', bg: '#3B82F615' },
    award: { color: '#F59E0B', label: 'Award', bg: '#F59E0B15' },
    research: { color: '#EF4444', label: 'Research', bg: '#EF444415' },
    milestone: { color: '#A78BFA', label: 'Milestone', bg: '#A78BFA15' },
}

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
    const itemRef = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)
    const cfg = typeConfig[event.type]

    useEffect(() => {
        const el = itemRef.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
            { threshold: 0.15 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    return (
        <div
            ref={itemRef}
            style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr',
                gap: '0 40px',
                position: 'relative',
                paddingBottom: index === timelineEvents.length - 1 ? 0 : '56px',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.65s ease ${index * 0.04}s, transform 0.65s ease ${index * 0.04}s`,
            }}
        >
            {/* Year */}
            <div style={{
                paddingTop: '20px',
                textAlign: 'right',
                position: 'sticky',
                top: '100px',
                height: 'fit-content',
            }}>
                <span style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: cfg.color,
                    letterSpacing: '0.04em',
                    display: 'block',
                    lineHeight: 1,
                }}>
                    {event.year}
                </span>

                {/* Connector dot */}
                <div style={{
                    width: '12px', height: '12px',
                    borderRadius: '50%',
                    backgroundColor: cfg.color,
                    boxShadow: `0 0 0 4px ${cfg.color}30`,
                    margin: '10px 0 0 auto',
                    transition: 'box-shadow 0.3s ease',
                }} />
            </div>

            {/* Card */}
            <div
                style={{
                    backgroundColor: '#111114',
                    border: `1px solid #27272A`,
                    borderLeft: `3px solid ${cfg.color}`,
                    padding: '22px 28px',
                    cursor: 'default',
                    transition: 'border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#18181B'
                    e.currentTarget.style.borderColor = cfg.color
                    e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#111114'
                    e.currentTarget.style.borderColor = '#27272A'
                    e.currentTarget.style.borderLeftColor = cfg.color
                    e.currentTarget.style.transform = 'translateX(0)'
                }}
            >
                {/* Tag */}
                <span style={{
                    display: 'inline-block',
                    fontSize: '10px', fontWeight: 600,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: cfg.color,
                    backgroundColor: cfg.bg,
                    border: `1px solid ${cfg.color}35`,
                    padding: '3px 10px',
                    marginBottom: '12px',
                }}>
                    {cfg.label}
                </span>

                <h3 style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontSize: '17px', fontWeight: 700,
                    color: '#FAFAFA', margin: '0 0 6px',
                    lineHeight: 1.3, letterSpacing: '-0.01em',
                }}>
                    {event.title}
                </h3>
                <div style={{ fontSize: '13px', fontWeight: 500, color: cfg.color, marginBottom: '12px' }}>
                    {event.subtitle}
                </div>
                <p style={{ fontSize: '14px', color: '#71717A', margin: 0, lineHeight: 1.7 }}>
                    {event.description}
                </p>
            </div>
        </div>
    )
}

export default function AceternityTimeline() {
    const containerRef = useRef<HTMLDivElement>(null)
    const lineRef = useRef<HTMLDivElement>(null)
    const beamRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        const line = lineRef.current
        const beam = beamRef.current
        if (!container || !line || !beam) return

        const update = () => {
            const rect = container.getBoundingClientRect()
            const winH = window.innerHeight
            // Fraction of container scrolled through viewport
            const start = rect.top
            const end = rect.bottom
            const scrollable = end - start
            const scrolled = winH - start
            const progress = Math.min(Math.max(scrolled / scrollable, 0), 1)
            beam.style.height = `${progress * 100}%`
        }

        window.addEventListener('scroll', update, { passive: true })
        update()
        return () => window.removeEventListener('scroll', update)
    }, [])

    return (
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '2px 1fr', gap: '0 0' }}>
            {/* Vertical track */}
            <div
                ref={lineRef}
                style={{
                    position: 'relative',
                    backgroundColor: '#27272A',
                    width: '2px',
                    minHeight: '100%',
                    marginLeft: '130px', // align with dot column
                }}
            >
                {/* Scroll beam — animated fill */}
                <div
                    ref={beamRef}
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0,
                        height: '0%',
                        background: 'linear-gradient(to bottom, #3B82F6, #10B981)',
                        transition: 'height 0.1s linear',
                        willChange: 'height',
                    }}
                />
            </div>

            {/* Events */}
            <div ref={containerRef} style={{ paddingLeft: '40px' }}>
                {timelineEvents.map((event, i) => (
                    <TimelineItem key={event.year + event.title} event={event} index={i} />
                ))}
            </div>
        </div>
    )
}
