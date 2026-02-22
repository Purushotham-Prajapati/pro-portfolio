import { useEffect, useRef } from 'react'
import { timelineEvents, TimelineEvent } from '../data/portfolio'

const typeConfig: Record<TimelineEvent['type'], { color: string; label: string }> = {
    education: { color: '#059669', label: 'Education' },
    career: { color: '#2563EB', label: 'Career' },
    award: { color: '#D97706', label: 'Award' },
    research: { color: '#DC2626', label: 'Research' },
    milestone: { color: '#7C3AED', label: 'Milestone' },
}

function TimelineCard({
    event,
    index,
}: {
    event: TimelineEvent
    index: number
}) {
    const cardRef = useRef<HTMLDivElement>(null)
    const isLeft = index % 2 === 0

    useEffect(() => {
        const el = cardRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('visible')
                    observer.disconnect()
                }
            },
            { threshold: 0.2 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const { color, label } = typeConfig[event.type]

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 60px 1fr',
                alignItems: 'start',
                position: 'relative',
                marginBottom: '0',
            }}
            className="timeline-row"
        >
            {/* Left content */}
            <div
                ref={isLeft ? cardRef : undefined}
                className={isLeft ? 'reveal-left' : ''}
                style={{ padding: '0 32px 64px 0', textAlign: 'right' }}
            >
                {isLeft && <TimelineCardContent event={event} color={color} label={label} align="right" />}
            </div>

            {/* Center: dot + year */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <div style={{
                    width: '44px', height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '#09090B',
                    border: `2px solid ${color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2,
                    boxShadow: `0 0 0 4px ${color}20`,
                    flexShrink: 0,
                }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />
                </div>
                <div style={{
                    fontSize: '11px', fontWeight: 700, color,
                    letterSpacing: '0.04em', marginTop: '6px',
                    fontFamily: 'Archivo, sans-serif',
                }}>
                    {event.year}
                </div>
            </div>

            {/* Right content */}
            <div
                ref={!isLeft ? cardRef : undefined}
                className={!isLeft ? 'reveal-right' : ''}
                style={{ padding: '0 0 64px 32px' }}
            >
                {!isLeft && <TimelineCardContent event={event} color={color} label={label} align="left" />}
            </div>
        </div>
    )
}

function TimelineCardContent({
    event, color, label, align,
}: {
    event: TimelineEvent; color: string; label: string; align: 'left' | 'right'
}) {
    return (
        <div
            style={{
                backgroundColor: '#111114',
                border: '1px solid #27272A',
                padding: '24px',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
                cursor: 'default',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = color
                e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#27272A'
                e.currentTarget.style.transform = 'translateY(0)'
            }}
        >
            <span style={{
                display: 'inline-block',
                fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em',
                textTransform: 'uppercase', color, marginBottom: '10px',
                border: `1px solid ${color}40`,
                padding: '2px 8px',
                backgroundColor: `${color}12`,
            }}>
                {label}
            </span>
            <h3 style={{
                fontFamily: 'Archivo, sans-serif',
                fontSize: '16px', fontWeight: 700, color: '#FAFAFA',
                margin: '0 0 6px', lineHeight: 1.3,
                textAlign: align,
            }}>
                {event.title}
            </h3>
            <div style={{
                fontSize: '12px', color, fontWeight: 500,
                marginBottom: '10px', textAlign: align,
            }}>
                {event.subtitle}
            </div>
            <p style={{
                fontSize: '13px', color: '#71717A',
                margin: 0, lineHeight: 1.65, textAlign: align,
            }}>
                {event.description}
            </p>
        </div>
    )
}

export default function TimelineSection() {
    const headerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = headerRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect() } },
            { threshold: 0.2 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <section id="journey" style={{ backgroundColor: '#09090B', padding: 'clamp(60px, 8vw, 120px) 24px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {/* Header */}
                <div ref={headerRef} className="reveal" style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563EB', fontWeight: 600 }}>
                        — The Journey
                    </span>
                    <h2 style={{
                        fontFamily: 'Archivo, sans-serif', fontWeight: 800,
                        fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.1,
                        letterSpacing: '-0.02em', color: '#FAFAFA',
                        margin: '12px 0 16px',
                    }}>
                        33 Years of<br />
                        <span style={{ color: '#2563EB' }}>Relentless Growth</span>
                    </h2>
                    <p style={{ fontSize: '15px', color: '#71717A', maxWidth: '420px', margin: '0 auto', lineHeight: 1.7 }}>
                        From a Diploma in 1992 to twin DST-funded research projects in 2025 — every milestone tells a story.
                    </p>
                </div>

                {/* Timeline */}
                <div style={{ position: 'relative' }}>
                    {/* Vertical line */}
                    <div style={{
                        position: 'absolute',
                        left: '50%', top: 0, bottom: 0,
                        transform: 'translateX(-50%)',
                        width: '1px',
                        background: 'linear-gradient(to bottom, transparent, #2563EB 5%, #2563EB 95%, transparent)',
                        zIndex: 1,
                    }} />

                    {timelineEvents.map((event, index) => (
                        <TimelineCard key={event.year + event.title} event={event} index={index} />
                    ))}
                </div>
            </div>

            {/* Mobile styles */}
            <style>{`
        @media (max-width: 700px) {
          .timeline-row {
            grid-template-columns: 40px 1fr !important;
          }
        }
      `}</style>
        </section>
    )
}
