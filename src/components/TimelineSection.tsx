import { useEffect, useRef } from 'react'
import { timelineEvents, TimelineEvent } from '../data/portfolio'

const typeConfig: Record<TimelineEvent['type'], { color: string; label: string }> = {
    education: { color: '#059669', label: 'Education' },
    career: { color: '#2563EB', label: 'Career' },
    award: { color: '#D97706', label: 'Award' },
    research: { color: '#DC2626', label: 'Research' },
    milestone: { color: '#7C3AED', label: 'Milestone' },
}

const observe = (el: HTMLDivElement | null, cls: string) => {
    if (!el) return () => { }
    const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { el.classList.add(cls); obs.disconnect() } },
        { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
}

function TimelineCard({ event, index }: { event: TimelineEvent; index: number }) {
    const desktopRef = useRef<HTMLDivElement>(null)
    const mobileRef = useRef<HTMLDivElement>(null)
    const isLeft = index % 2 === 0
    const { color, label } = typeConfig[event.type]

    useEffect(() => {
        const c1 = observe(desktopRef.current, 'visible')
        const c2 = observe(mobileRef.current, 'visible')
        return () => { c1(); c2() }
    }, [])

    return (
        <>
            {/* ── DESKTOP: alternating 3-col grid ── */}
            <div className="tl-row-desktop">
                {/* Left col */}
                <div
                    ref={isLeft ? desktopRef : undefined}
                    className={isLeft ? 'reveal-left' : ''}
                    style={{ padding: '0 32px 64px 0', textAlign: 'right' }}
                >
                    {isLeft && <TimelineCardContent event={event} color={color} label={label} align="right" />}
                </div>

                {/* Center: dot + year */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        width: '44px', height: '44px', borderRadius: '50%',
                        backgroundColor: '#09090B', border: `2px solid ${color}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2, boxShadow: `0 0 0 4px ${color}20`, flexShrink: 0,
                    }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color, letterSpacing: '0.04em', marginTop: '6px', fontFamily: 'Archivo, sans-serif' }}>
                        {event.year}
                    </div>
                </div>

                {/* Right col */}
                <div
                    ref={!isLeft ? desktopRef : undefined}
                    className={!isLeft ? 'reveal-right' : ''}
                    style={{ padding: '0 0 64px 32px' }}
                >
                    {!isLeft && <TimelineCardContent event={event} color={color} label={label} align="left" />}
                </div>
            </div>

            {/* ── MOBILE: single-column flex ── */}
            <div className="tl-row-mobile">
                {/* Dot + year */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '44px' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        backgroundColor: '#09090B', border: `2px solid ${color}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2, boxShadow: `0 0 0 3px ${color}20`,
                    }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color, letterSpacing: '0.04em', marginTop: '5px', fontFamily: 'Archivo, sans-serif', textAlign: 'center' }}>
                        {event.year}
                    </div>
                </div>

                {/* Card */}
                <div ref={mobileRef} className="reveal" style={{ flex: 1, paddingBottom: '36px' }}>
                    <TimelineCardContent event={event} color={color} label={label} align="left" />
                </div>
            </div>
        </>
    )
}

function TimelineCardContent({ event, color, label, align }: {
    event: TimelineEvent; color: string; label: string; align: 'left' | 'right'
}) {
    return (
        <div
            style={{
                backgroundColor: '#111114', border: '1px solid #27272A',
                padding: '24px',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
                cursor: 'default',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#27272A'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
            <span style={{
                display: 'inline-block', fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase', color,
                marginBottom: '10px', border: `1px solid ${color}40`,
                padding: '2px 8px', backgroundColor: `${color}12`,
            }}>
                {label}
            </span>
            <h3 style={{
                fontFamily: 'Archivo, sans-serif', fontSize: '16px', fontWeight: 700,
                color: '#FAFAFA', margin: '0 0 6px', lineHeight: 1.3, textAlign: align,
            }}>
                {event.title}
            </h3>
            <div style={{ fontSize: '12px', color, fontWeight: 500, marginBottom: '10px', textAlign: align }}>
                {event.subtitle}
            </div>
            <p style={{ fontSize: '13px', color: '#71717A', margin: 0, lineHeight: 1.65, textAlign: align }}>
                {event.description}
            </p>
        </div>
    )
}

export default function TimelineSection() {
    const headerRef = useRef<HTMLDivElement>(null)

    useEffect(() => { return observe(headerRef.current, 'visible') }, [])

    return (
        <section id="journey" style={{ backgroundColor: '#09090B', padding: 'clamp(60px, 8vw, 120px) clamp(16px, 4vw, 24px)' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {/* Header */}
                <div ref={headerRef} className="reveal" style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563EB', fontWeight: 600 }}>
                        — The Journey
                    </span>
                    <h2 style={{
                        fontFamily: 'Archivo, sans-serif', fontWeight: 800,
                        fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.1,
                        letterSpacing: '-0.02em', color: '#FAFAFA', margin: '12px 0 16px',
                    }}>
                        33 Years of<br />
                        <span style={{ color: '#2563EB' }}>Relentless Growth</span>
                    </h2>
                    <p style={{ fontSize: '15px', color: '#71717A', maxWidth: '420px', margin: '0 auto', lineHeight: 1.7 }}>
                        From a Diploma in 1992 to twin DST-funded research projects in 2025 — every milestone tells a story.
                    </p>
                </div>

                {/* Timeline wrapper */}
                <div style={{ position: 'relative' }}>
                    {/* Desktop: vertical centre line */}
                    <div className="tl-center-line" style={{
                        position: 'absolute', left: '50%', top: 0, bottom: 0,
                        transform: 'translateX(-50%)', width: '1px',
                        background: 'linear-gradient(to bottom, transparent, #2563EB 5%, #2563EB 95%, transparent)',
                        zIndex: 1,
                    }} />

                    {/* Mobile: left-edge line */}
                    <div className="tl-left-line" style={{
                        position: 'absolute', left: '18px', top: 0, bottom: 0,
                        width: '1px',
                        background: 'linear-gradient(to bottom, transparent, #2563EB 5%, #2563EB 95%, transparent)',
                        zIndex: 1,
                    }} />

                    {timelineEvents.map((event, index) => (
                        <TimelineCard key={event.year + event.title} event={event} index={index} />
                    ))}
                </div>
            </div>

            <style>{`
                /* Desktop layout */
                .tl-row-desktop {
                    display: grid;
                    grid-template-columns: 1fr 60px 1fr;
                    align-items: start;
                    position: relative;
                }
                .tl-row-mobile  { display: none; }
                .tl-center-line { display: block; }
                .tl-left-line   { display: none; }

                @media (max-width: 700px) {
                    .tl-row-desktop { display: none; }
                    .tl-center-line { display: none; }

                    .tl-row-mobile {
                        display: flex;
                        align-items: flex-start;
                        gap: 14px;
                        position: relative;
                    }
                    .tl-left-line { display: block; }
                }
            `}</style>
        </section>
    )
}
