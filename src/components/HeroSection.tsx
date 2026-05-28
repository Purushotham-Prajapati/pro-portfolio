"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useCountUp } from "../hooks/useCountUp";

function StatCard({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
    const { count, ref } = useCountUp(value, 1800);

    return (
        <div style={{ textAlign: "center" }}>
            <div
                ref={ref as React.RefObject<HTMLDivElement>}
                style={{
                    fontFamily: "Archivo, sans-serif",
                    fontSize: "clamp(36px, 5vw, 52px)",
                    fontWeight: 800,
                    color: "#FAFAFA",
                    lineHeight: 1,
                }}
            >
                {count}
                {suffix}
            </div>
            <div
                style={{
                    fontSize: "12px",
                    color: "#A1A1AA",
                    marginTop: "6px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                }}
            >
                {label}
            </div>
        </div>
    );
}

interface HeroSectionProps {
    data: {
        personal_info: {
            name: string;
            designation: string;
            profile_image_url?: string;
            experience_summary: { total_years: number };
            google_scholar: { citations: number; link: string };
            scopus: { link: string };
            orcid: string;
        };
        publications: { total_papers: number; patents: number };
        media?: Array<{ name?: string; url?: string; createdAt?: string }>;
    };
}

export default function HeroSection({ data }: HeroSectionProps) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const { personal_info, publications } = data;
    const nameParts = personal_info.name.split(" ");
    const latestProfileUpload = [...(data.media || [])]
        .filter((item) => item.url && item.name?.startsWith("profile-avatar"))
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];
    const profileImageUrl = personal_info.profile_image_url || latestProfileUpload?.url;

    return (
        <section
            id="hero"
            className="page-theme-home"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, hsl(24 21% 9%) 0%, hsl(17 72% 17%) 48%, hsl(38 64% 12%) 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                paddingTop: "80px",
                paddingBottom: "100px",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "linear-gradient(#27272A 1px, transparent 1px), linear-gradient(90deg, #27272A 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                    opacity: 0.3,
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    top: "-10%",
                    right: "-5%",
                    width: "400px",
                    height: "400px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, hsl(var(--theme-accent-2) / 0.18) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", width: "100%", position: "relative" }}>
                <div className="hero-grid md:grid-cols-12">
                    <div className="hero-copy md:col-span-7">
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "32px",
                                opacity: visible ? 1 : 0,
                                transform: visible ? "none" : "translateY(20px)",
                                transition: "all 0.7s ease 0.1s",
                            }}
                        >
                            <span style={{ width: "40px", height: "1px", background: "hsl(var(--theme-accent-2))", display: "block" }} />
                            <span
                                style={{
                                    fontSize: "11px",
                                    letterSpacing: "0.2em",
                                    textTransform: "uppercase",
                                    color: "hsl(var(--theme-accent-2))",
                                    fontWeight: 700,
                                    fontFamily: "Space Grotesk, sans-serif",
                                }}
                            >
                                Professor / Researcher / Mentor
                            </span>
                        </div>

                        <h1
                            ref={titleRef}
                            style={{
                                fontFamily: "Archivo, sans-serif",
                                fontWeight: 900,
                                lineHeight: 0.9,
                                color: "#FAFAFA",
                                fontSize: "clamp(52px, 8vw, 110px)",
                                margin: 0,
                                marginBottom: "8px",
                            }}
                        >
                            {nameParts.map((part, index) => (
                                <span
                                    key={index}
                                    style={{
                                        display: "block",
                                        opacity: visible ? 1 : 0,
                                        transform: visible ? "none" : "translateY(40px)",
                                        transition: `all 0.8s cubic-bezier(0.25,0.46,0.45,0.94) ${0.2 + index * 0.1}s`,
                                    }}
                                >
                                    {index === nameParts.length - 1 ? (
                                        <span style={{ color: "hsl(var(--theme-accent-2))" }}>{part}</span>
                                    ) : (
                                        part
                                    )}
                                </span>
                            ))}
                        </h1>

                        <p
                            style={{
                                fontFamily: "Space Grotesk, sans-serif",
                                fontSize: "clamp(14px, 2vw, 18px)",
                                color: "#A1A1AA",
                                fontWeight: 400,
                                marginTop: "24px",
                                marginBottom: 0,
                                maxWidth: "480px",
                                lineHeight: 1.6,
                                opacity: visible ? 1 : 0,
                                transform: visible ? "none" : "translateY(20px)",
                                transition: "all 0.7s ease 0.6s",
                            }}
                        >
                            {personal_info.designation}
                            <br />
                            <span style={{ color: "#D4D4D8", fontSize: "0.9em" }}>JNTUH-Ratified / IEEE Member</span>
                        </p>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                                gap: "24px",
                                maxWidth: "640px",
                                marginTop: "64px",
                                paddingTop: "40px",
                                borderTop: "1px solid #27272A",
                                opacity: visible ? 1 : 0,
                                transition: "opacity 0.7s ease 0.8s",
                            }}
                        >
                            <StatCard value={personal_info.experience_summary.total_years} suffix="+" label="Years Experience" />
                            <StatCard value={publications.total_papers} suffix="+" label="Publications" />
                            <StatCard value={publications.patents} label="Patents" />
                            <StatCard value={personal_info.google_scholar.citations} suffix="+" label="Citations" />
                        </div>
                    </div>

                    <motion.div
                        className="hero-profile-wrap md:col-span-5"
                        initial={false}
                        animate={visible ? { opacity: 1, x: 0, scale: 1 } : undefined}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.45 }}
                    >
                        <div className="hero-profile-glow" />
                        <motion.div
                            className="hero-profile-card"
                            whileHover={{ scale: 1.03, boxShadow: "0 34px 90px hsl(var(--theme-accent-2) / 0.26)" }}
                            transition={{ duration: 0.28, ease: "easeOut" }}
                        >
                            {profileImageUrl ? (
                                <img
                                    src={profileImageUrl}
                                    alt={personal_info.name}
                                    className="hero-profile-image"
                                    onError={(event) => {
                                        event.currentTarget.style.display = "none";
                                    }}
                                />
                            ) : (
                                <div className="hero-profile-placeholder">
                                    <span>MB</span>
                                </div>
                            )}
                            <div className="hero-profile-caption">
                                <span>Professor of CSE</span>
                                <strong>Research Leadership</strong>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: "32px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.7s ease 1.2s",
                    animation: "bounce 2s ease-in-out infinite",
                }}
            >
                <span style={{ fontSize: "10px", color: "#A1A1AA", letterSpacing: "0.12em", textTransform: "uppercase" }}>Scroll</span>
                <ChevronDown size={16} color="#A1A1AA" />
            </div>

            <style>{`
                .hero-grid {
                    align-items: center;
                    display: grid;
                    gap: clamp(36px, 6vw, 72px);
                    grid-template-columns: repeat(12, minmax(0, 1fr));
                }

                .hero-copy {
                    grid-column: span 7 / span 7;
                    min-width: 0;
                }

                .hero-profile-wrap {
                    grid-column: span 5 / span 5;
                    justify-self: end;
                    max-width: 420px;
                    position: relative;
                    width: 100%;
                }

                .hero-profile-glow {
                    background: radial-gradient(circle, hsl(var(--theme-accent-2) / 0.25) 0%, transparent 70%);
                    filter: blur(64px);
                    inset: -18%;
                    opacity: 0.95;
                    pointer-events: none;
                    position: absolute;
                }

                .hero-profile-card {
                    aspect-ratio: 0.82;
                    background: linear-gradient(145deg, hsl(var(--theme-accent-2) / 0.22), rgba(255,255,255,0.08));
                    border: 1px solid rgba(255,255,255,0.14);
                    border-radius: 40px 120px 40px 40px;
                    box-shadow: 0 28px 80px rgba(0,0,0,0.34);
                    overflow: hidden;
                    position: relative;
                    transform-origin: center;
                }

                .hero-profile-image {
                    display: block;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                    width: 100%;
                }

                .hero-profile-placeholder {
                    align-items: center;
                    background:
                        radial-gradient(circle at 50% 34%, hsl(var(--theme-accent-2) / 0.28), transparent 34%),
                        linear-gradient(145deg, rgba(234,88,12,0.2), rgba(9,9,11,0.18));
                    color: hsl(var(--theme-accent-2));
                    display: flex;
                    font-family: Archivo, sans-serif;
                    font-size: clamp(72px, 9vw, 130px);
                    font-weight: 900;
                    height: 100%;
                    justify-content: center;
                    width: 100%;
                }

                .hero-profile-caption {
                    background: linear-gradient(180deg, transparent 0%, rgba(9,9,11,0.76) 100%);
                    bottom: 0;
                    color: #fff;
                    display: grid;
                    gap: 2px;
                    left: 0;
                    padding: 28px;
                    position: absolute;
                    right: 0;
                }

                .hero-profile-caption span {
                    color: hsl(var(--theme-accent-2));
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                }

                .hero-profile-caption strong {
                    font-family: Archivo, sans-serif;
                    font-size: 22px;
                    line-height: 1.1;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(6px); }
                }

                @media (max-width: 900px) {
                    .hero-grid {
                        grid-template-columns: 1fr;
                        padding-top: 48px;
                    }

                    .hero-copy,
                    .hero-profile-wrap {
                        grid-column: auto;
                    }

                    .hero-profile-wrap {
                        justify-self: center;
                        max-width: min(360px, 92vw);
                        order: -1;
                    }

                    .hero-profile-card {
                        border-radius: 34px 88px 34px 34px;
                    }
                }
            `}</style>
        </section>
    );
}
