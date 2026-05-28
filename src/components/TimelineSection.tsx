"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import TiltCard from "./shared/TiltCard";

export interface TimelineEvent {
    year: number;
    title: string;
    subtitle: string;
    description: string;
    type: "education" | "career" | "award" | "research" | "milestone";
}

const typeConfig: Record<TimelineEvent["type"], { color: string; label: string }> = {
    education: { color: "#10B981", label: "Education" },
    career: { color: "#2563EB", label: "Career" },
    award: { color: "#F59E0B", label: "Award" },
    research: { color: "#8B5CF6", label: "Research" },
    milestone: { color: "#EC4899", label: "Milestone" },
};

const fallbackIntro = {
    badge: "THE JOURNEY",
    title_line_1: "33 Years of",
    title_line_2: "Relentless Growth",
    description:
        "From a Diploma in Electronics in 1992 to leading dual DST-funded research projects in 2025 - every milestone tells a story of dedication, discovery, and impact.",
    stats: [
        { value: "18", label: "Years Teaching" },
        { value: "3 yrs", label: "Industry Exp." },
        { value: "13 yrs", label: "Research Active" },
        { value: "8+", label: "PhD Scholars" },
    ],
};

function TimelineDot({ color, mobile = false }: { color: string; mobile?: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const active = useInView(ref, { amount: 0.75, once: false });

    return (
        <motion.div
            ref={ref}
            className={mobile ? "tl-dot tl-dot-mobile" : "tl-dot"}
            style={{ "--event-color": color } as CSSProperties}
            animate={{
                scale: active ? 1.08 : 1,
                boxShadow: active
                    ? `0 0 0 ${mobile ? 7 : 8}px ${color}22, 0 0 ${mobile ? 24 : 28}px ${color}72`
                    : `0 0 0 ${mobile ? 3 : 4}px ${color}20`,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            <span />
        </motion.div>
    );
}

function TimelineCard({ event, index }: { event: TimelineEvent; index: number }) {
    const isLeft = index % 2 === 0;
    const { color, label } = typeConfig[event.type] || typeConfig.milestone;

    return (
        <>
            <div className="tl-row-desktop">
                <motion.div
                    initial={false}
                    whileInView={isLeft ? { x: 0, rotateY: 0 } : undefined}
                    viewport={{ once: true, amount: 0.28 }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    style={{ padding: "0 32px 64px 0", textAlign: "right", perspective: 900 }}
                >
                    {isLeft && <TimelineCardContent event={event} color={color} label={label} align="right" />}
                </motion.div>

                <div className="tl-marker">
                    <TimelineDot color={color} />
                    <div className="tl-year" style={{ color }}>
                        {event.year}
                    </div>
                </div>

                <motion.div
                    initial={false}
                    whileInView={!isLeft ? { x: 0, rotateY: 0 } : undefined}
                    viewport={{ once: true, amount: 0.28 }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    style={{ padding: "0 0 64px 32px", perspective: 900 }}
                >
                    {!isLeft && <TimelineCardContent event={event} color={color} label={label} align="left" />}
                </motion.div>
            </div>

            <div className="tl-row-mobile">
                <div className="tl-marker tl-marker-mobile">
                    <TimelineDot color={color} mobile />
                    <div className="tl-year tl-year-mobile" style={{ color }}>
                        {event.year}
                    </div>
                </div>

                <motion.div
                    initial={false}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true, amount: 0.22 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ flex: 1, paddingBottom: "36px" }}
                >
                    <TimelineCardContent event={event} color={color} label={label} align="left" />
                </motion.div>
            </div>
        </>
    );
}

function TimelineCardContent({
    event,
    color,
    label,
    align,
}: {
    event: TimelineEvent;
    color: string;
    label: string;
    align: "left" | "right";
}) {
    return (
        <TiltCard
            className="tl-card"
            style={{ "--event-color": color, textAlign: align } as CSSProperties}
            maxTilt={7}
        >
            <span className="tl-card-label">{label}</span>
            <h3>{event.title}</h3>
            <div className="tl-card-subtitle">{event.subtitle}</div>
            <p>{event.description}</p>
        </TiltCard>
    );
}

export default function TimelineSection({ data }: { data: any }) {
    const timelineRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start center", "end center"],
    });
    const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
    const events = data?.timeline_events || [];
    const intro = {
        ...fallbackIntro,
        ...(data?.journey_intro || {}),
        stats: data?.journey_intro?.stats?.length ? data.journey_intro.stats : fallbackIntro.stats,
    };

    return (
        <section id="journey" className="journey-section page-theme-journey">
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                <motion.div
                    initial={false}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ textAlign: "left", marginBottom: "80px" }}
                >
                    <span className="journey-badge">- {intro.badge || fallbackIntro.badge}</span>
                    <h2 className="journey-title">
                        {intro.title_line_1 || fallbackIntro.title_line_1}
                        <br />
                        <span>{intro.title_line_2 || fallbackIntro.title_line_2}</span>
                    </h2>
                    <p className="journey-description">{intro.description || fallbackIntro.description}</p>

                    {intro.stats.length > 0 && (
                        <div className="journey-stats">
                            {intro.stats.map((stat: any, index: number) => (
                                <div key={`${stat.value}-${stat.label}-${index}`} className="journey-stat">
                                    <div>
                                        <span>{stat.value}</span>
                                        <small>{stat.label}</small>
                                    </div>
                                    {index < intro.stats.length - 1 && <div className="stats-divider" />}
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                <div ref={timelineRef} style={{ position: "relative" }}>
                    <div className="tl-center-line" />
                    <motion.div className="tl-center-line-progress" style={{ scaleY: lineScale }} />
                    <div className="tl-left-line" />
                    <motion.div className="tl-left-line-progress" style={{ scaleY: lineScale }} />

                    {events.map((event: TimelineEvent, index: number) => (
                        <TimelineCard key={`${event.year}-${event.title}-${index}`} event={event} index={index} />
                    ))}
                </div>
            </div>

            <style>{`
                .journey-section {
                    --journey-bg: radial-gradient(circle at 18% 10%, rgba(139, 92, 246, 0.22), transparent 28%),
                        radial-gradient(circle at 82% 18%, rgba(16, 185, 129, 0.18), transparent 24%),
                        linear-gradient(135deg, #f7f3ff 0%, #ffffff 44%, #eefdf8 100%);
                    --journey-card-bg: rgba(255, 255, 255, 0.74);
                    --journey-card-border: rgba(99, 102, 241, 0.18);
                    --journey-heading: #17141f;
                    --journey-muted: #5f6170;
                    --journey-dot-bg: rgba(255, 255, 255, 0.9);
                    --journey-stat-border: rgba(99, 102, 241, 0.2);
                    --journey-line-gradient: linear-gradient(to bottom, transparent, #8B5CF6 20%, #2563EB 50%, #10B981 80%, transparent);
                    background: var(--journey-bg);
                    color: var(--journey-heading);
                    overflow: hidden;
                    padding: clamp(100px, 12vw, 140px) clamp(16px, 4vw, 24px) clamp(60px, 8vw, 120px);
                }

                html.dark .journey-section {
                    --journey-bg: radial-gradient(circle at 18% 10%, rgba(139, 92, 246, 0.2), transparent 28%),
                        radial-gradient(circle at 82% 18%, rgba(16, 185, 129, 0.16), transparent 26%),
                        linear-gradient(135deg, #09090B 0%, #0d0a16 48%, #06110f 100%);
                    --journey-card-bg: rgba(17, 17, 20, 0.72);
                    --journey-card-border: rgba(255, 255, 255, 0.1);
                    --journey-heading: #FAFAFA;
                    --journey-muted: #A1A1AA;
                    --journey-dot-bg: #09090B;
                    --journey-stat-border: rgba(255, 255, 255, 0.1);
                }

                .journey-badge {
                    color: #8B5CF6;
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                }

                .journey-title {
                    color: var(--journey-heading);
                    font-family: 'Archivo', sans-serif;
                    font-size: clamp(32px, 5vw, 56px);
                    font-weight: 800;
                    line-height: 1.1;
                    margin: 12px 0 16px;
                }

                .journey-title span {
                    background: linear-gradient(135deg, #E11D48 0%, #EA580C 48%, #F59E0B 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    display: inline-block;
                }

                .journey-description {
                    color: var(--journey-muted);
                    font-size: 15px;
                    line-height: 1.7;
                    margin: 0 0 32px;
                    max-width: 680px;
                }

                .journey-stats {
                    align-items: stretch;
                    border-top: 1px solid var(--journey-stat-border);
                    display: flex;
                    flex-wrap: wrap;
                    gap: 18px 32px;
                    padding-top: 32px;
                }

                .journey-stat {
                    align-items: center;
                    display: flex;
                    gap: 32px;
                }

                .journey-stat span {
                    color: var(--journey-heading);
                    display: block;
                    font-family: 'Archivo', sans-serif;
                    font-size: 28px;
                    font-weight: 800;
                    line-height: 1;
                }

                .journey-stat small {
                    color: var(--journey-muted);
                    display: block;
                    font-size: 12px;
                    font-weight: 600;
                    margin-top: 6px;
                }

                .stats-divider {
                    background: var(--journey-stat-border);
                    display: block;
                    height: 36px;
                    width: 1px;
                }

                .tl-center-line {
                    background: linear-gradient(to bottom, transparent, rgba(139, 92, 246, 0.22), rgba(37, 99, 235, 0.22), rgba(16, 185, 129, 0.22), transparent);
                    bottom: 0;
                    display: block;
                    left: 50%;
                    position: absolute;
                    top: 0;
                    transform: translateX(-50%);
                    width: 1px;
                    z-index: 1;
                }

                .tl-center-line-progress {
                    background: var(--journey-line-gradient);
                    bottom: 0;
                    box-shadow: 0 0 26px rgba(139, 92, 246, 0.46);
                    display: block;
                    left: 50%;
                    margin-left: -1.5px;
                    position: absolute;
                    top: 0;
                    transform-origin: top;
                    width: 3px;
                    z-index: 1;
                }

                .tl-left-line {
                    background: linear-gradient(to bottom, transparent, rgba(139, 92, 246, 0.22), rgba(37, 99, 235, 0.22), rgba(16, 185, 129, 0.22), transparent);
                    bottom: 0;
                    display: none;
                    left: 18px;
                    position: absolute;
                    top: 0;
                    width: 1px;
                    z-index: 1;
                }

                .tl-left-line-progress {
                    background: var(--journey-line-gradient);
                    bottom: 0;
                    box-shadow: 0 0 22px rgba(16, 185, 129, 0.42);
                    display: none;
                    left: 18px;
                    position: absolute;
                    top: 0;
                    transform-origin: top;
                    width: 3px;
                    z-index: 1;
                }

                .tl-row-desktop {
                    align-items: start;
                    display: grid;
                    grid-template-columns: 1fr 60px 1fr;
                    position: relative;
                }

                .tl-row-mobile {
                    display: none;
                }

                .tl-marker {
                    align-items: center;
                    display: flex;
                    flex-direction: column;
                }

                .tl-dot {
                    align-items: center;
                    background: var(--journey-dot-bg);
                    border: 2px solid var(--event-color);
                    border-radius: 999px;
                    display: flex;
                    flex-shrink: 0;
                    height: 44px;
                    justify-content: center;
                    position: relative;
                    width: 44px;
                    z-index: 2;
                }

                .tl-dot::after {
                    animation: tl-pulse 1.8s ease-out infinite;
                    border: 1px solid var(--event-color);
                    border-radius: inherit;
                    content: "";
                    inset: -8px;
                    opacity: 0.22;
                    position: absolute;
                }

                .tl-dot span {
                    background: var(--event-color);
                    border-radius: 999px;
                    height: 10px;
                    width: 10px;
                }

                .tl-year {
                    font-family: 'Archivo', sans-serif;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.04em;
                    margin-top: 6px;
                }

                .tl-card {
                    backdrop-filter: blur(18px);
                    background: var(--journey-card-bg);
                    border: 1px solid var(--journey-card-border);
                    box-shadow: 0 18px 48px rgba(17, 24, 39, 0.08);
                    cursor: default;
                    padding: 24px;
                    transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
                }

                .tl-card:hover {
                    border-color: var(--event-color);
                    box-shadow: 0 22px 70px color-mix(in srgb, var(--event-color) 34%, transparent);
                }

                .tl-card-label {
                    background: color-mix(in srgb, var(--event-color) 12%, transparent);
                    border: 1px solid color-mix(in srgb, var(--event-color) 36%, transparent);
                    color: var(--event-color);
                    display: inline-block;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    margin-bottom: 10px;
                    padding: 3px 9px;
                    text-transform: uppercase;
                }

                .tl-card h3 {
                    color: var(--journey-heading);
                    font-family: 'Archivo', sans-serif;
                    font-size: 16px;
                    font-weight: 750;
                    line-height: 1.3;
                    margin: 0 0 6px;
                }

                .tl-card-subtitle {
                    color: var(--event-color);
                    font-size: 12px;
                    font-weight: 700;
                    margin-bottom: 10px;
                }

                .tl-card p {
                    color: var(--journey-muted);
                    font-size: 13px;
                    line-height: 1.65;
                    margin: 0;
                }

                @keyframes tl-pulse {
                    0% { opacity: 0.28; transform: scale(0.7); }
                    100% { opacity: 0; transform: scale(1.55); }
                }

                @media (max-width: 700px) {
                    .journey-section {
                        padding-top: 96px;
                    }

                    .journey-stats {
                        display: grid;
                        gap: 14px;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .journey-stat {
                        align-items: flex-start;
                        border: 1px solid var(--journey-stat-border);
                        display: block;
                        padding: 14px;
                    }

                    .stats-divider {
                        display: none;
                    }

                    .tl-row-desktop,
                    .tl-center-line,
                    .tl-center-line-progress {
                        display: none;
                    }

                    .tl-row-mobile {
                        align-items: flex-start;
                        display: flex;
                        gap: 14px;
                        position: relative;
                    }

                    .tl-left-line {
                        display: block;
                    }

                    .tl-left-line-progress {
                        display: block;
                    }

                    .tl-marker-mobile {
                        flex-shrink: 0;
                        width: 44px;
                    }

                    .tl-dot-mobile {
                        height: 36px;
                        width: 36px;
                    }

                    .tl-dot-mobile span {
                        height: 8px;
                        width: 8px;
                    }

                    .tl-year-mobile {
                        font-size: 10px;
                        margin-top: 5px;
                        text-align: center;
                    }

                    .tl-card {
                        padding: 18px;
                        text-align: left !important;
                    }
                }
            `}</style>
        </section>
    );
}
