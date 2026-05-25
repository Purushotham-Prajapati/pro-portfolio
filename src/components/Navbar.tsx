"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import ThemeToggle from "./shared/ThemeToggle";

interface NavItem {
    label: string;
    href: string;
    order: number;
    is_visible: boolean;
}

const academicItems = [
    { label: "Publications", href: "/academic-activities?category=publications" },
    { label: "Continuing Education & Certifications", href: "/academic-activities?category=certifications" },
    { label: "E-Content Developed", href: "/academic-activities?category=eContent" },
    { label: "Events Organised", href: "/academic-activities?category=events" },
    { label: "Guest Talks", href: "/academic-activities?category=guestTalks" },
];

export default function Navbar({ navItems }: { navItems: NavItem[] }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    useEffect(() => setMobileOpen(false), [pathname]);

    const solid = scrolled || pathname !== "/";
    const visibleItems = navItems.filter((item) => item.is_visible).sort((a, b) => a.order - b.order);

    return (
        <>
            <nav
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    transition: "all 0.35s ease",
                    backgroundColor: solid ? "var(--nav-bg)" : "transparent",
                    backdropFilter: solid ? "blur(14px)" : "none",
                    borderBottom: solid ? "1px solid var(--glass-border)" : "none",
                }}
            >
                <div
                    style={{
                        maxWidth: "1280px",
                        margin: "0 auto",
                        padding: `${solid ? "14px" : "22px"} 24px`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "16px",
                        transition: "padding 0.35s ease",
                    }}
                >
                    <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "32px",
                                height: "32px",
                                background: "linear-gradient(135deg, hsl(var(--theme-accent)), hsl(var(--theme-accent-2)))",
                                color: "#fff",
                                fontSize: "12px",
                                fontWeight: 800,
                                fontFamily: "Archivo, sans-serif",
                                letterSpacing: "0.01em",
                                boxShadow: "var(--theme-shadow)",
                            }}
                        >
                            MB
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontFamily: "Archivo, sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--nav-text)", lineHeight: 1.2 }}>
                                Dr. M. Madhu Bala
                            </div>
                            <div style={{ fontSize: "10px", color: "var(--muted-text)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                Professor · CSE
                            </div>
                        </div>
                    </Link>

                    <ul style={{ display: "flex", gap: "4px", listStyle: "none", margin: 0, padding: 0 }} className="nav-desktop">
                        {visibleItems.map((item) => {
                            const active = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        style={{
                                            display: "inline-block",
                                            padding: "6px 14px",
                                            fontSize: "12px",
                                            fontWeight: 600,
                                            letterSpacing: "0.06em",
                                            textTransform: "uppercase",
                                            textDecoration: "none",
                                            color: active ? "var(--nav-text)" : "var(--muted-text)",
                                            backgroundColor: active ? "var(--nav-active-bg)" : "transparent",
                                            border: active ? "1px solid var(--glass-border-strong)" : "1px solid transparent",
                                            transition: "all 0.2s ease",
                                        }}
                                        onMouseEnter={(event) => {
                                            if (!active) event.currentTarget.style.color = "var(--nav-text)";
                                        }}
                                        onMouseLeave={(event) => {
                                            if (!active) event.currentTarget.style.color = "var(--muted-text)";
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                        <li className="academic-nav-item">
                            <Link
                                href="/academic-activities"
                                className="academic-nav-trigger"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "6px 14px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    textDecoration: "none",
                                    color: pathname.startsWith("/academic-activities") ? "var(--nav-text)" : "var(--muted-text)",
                                    backgroundColor: pathname.startsWith("/academic-activities") ? "var(--nav-active-bg)" : "transparent",
                                    border: pathname.startsWith("/academic-activities") ? "1px solid var(--glass-border-strong)" : "1px solid transparent",
                                }}
                            >
                                Academic Activities <ChevronDown size={13} />
                            </Link>
                            <div className="academic-nav-dropdown">
                                {academicItems.map((item) => (
                                    <Link key={item.href} href={item.href}>
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </li>
                    </ul>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <ThemeToggle />
                        <button
                            onClick={() => setMobileOpen((open) => !open)}
                            style={{ background: "none", border: "none", color: "var(--nav-text)", cursor: "pointer", padding: "6px", display: "none" }}
                            aria-label="Toggle navigation"
                            className="nav-mobile-toggle"
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </nav>

            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 99,
                    backgroundColor: "var(--nav-bg-solid)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    opacity: mobileOpen ? 1 : 0,
                    pointerEvents: mobileOpen ? "all" : "none",
                    transition: "opacity 0.25s ease",
                }}
            >
                {visibleItems.map((item, index) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        style={{
                            fontSize: "clamp(24px, 6vw, 40px)",
                            fontFamily: "Archivo, sans-serif",
                            fontWeight: 800,
                            textDecoration: "none",
                            color: pathname === item.href ? "hsl(var(--theme-accent))" : "var(--nav-text)",
                            letterSpacing: "-0.02em",
                            padding: "8px 0",
                            transform: `translateY(${mobileOpen ? "0" : "20px"})`,
                            transition: `color 0.2s ease, transform 0.35s ease ${index * 0.05}s`,
                        }}
                    >
                        {item.label}
                    </Link>
                ))}
                <div className="mobile-academic-group">
                    <Link
                        href="/academic-activities"
                        style={{
                            fontSize: "clamp(22px, 5.6vw, 36px)",
                            fontFamily: "Archivo, sans-serif",
                            fontWeight: 800,
                            textDecoration: "none",
                            color: pathname.startsWith("/academic-activities") ? "hsl(var(--theme-accent))" : "var(--nav-text)",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Academic Activities
                    </Link>
                    <div>
                        {academicItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .academic-nav-item {
                    position: relative;
                    padding-bottom: 10px;
                }

                .academic-nav-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    display: grid;
                    min-width: 280px;
                    padding: 8px;
                    border: 1px solid var(--glass-border-strong);
                    background: var(--glass-bg);
                    backdrop-filter: blur(16px);
                    box-shadow: var(--theme-shadow);
                    opacity: 0;
                    pointer-events: none;
                    transform: translateY(8px);
                    transition: opacity 160ms ease, transform 160ms ease;
                }

                .academic-nav-dropdown::before {
                    content: "";
                    position: absolute;
                    top: -12px;
                    left: 0;
                    right: 0;
                    height: 12px;
                }

                .academic-nav-item:hover .academic-nav-dropdown,
                .academic-nav-item:focus-within .academic-nav-dropdown {
                    opacity: 1;
                    pointer-events: auto;
                    transform: translateY(0);
                }

                .academic-nav-dropdown a {
                    color: var(--nav-text);
                    padding: 10px 12px;
                    text-decoration: none;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    border: 1px solid transparent;
                }

                .academic-nav-dropdown a:hover,
                .academic-nav-dropdown a:focus {
                    background: var(--nav-active-bg);
                    border-color: var(--glass-border);
                    outline: none;
                }

                .mobile-academic-group {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    margin-top: 12px;
                    transform: translateY(${mobileOpen ? "0" : "20px"});
                    transition: transform 0.35s ease ${visibleItems.length * 0.05}s;
                }

                .mobile-academic-group > div {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }

                .mobile-academic-group > div a {
                    color: var(--muted-text);
                    font-size: 13px;
                    font-weight: 750;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    text-decoration: none;
                }

                @media (min-width: 768px) {
                    .nav-desktop { display: flex !important; }
                    .nav-mobile-toggle { display: none !important; }
                }
                @media (max-width: 767px) {
                    .nav-desktop { display: none !important; }
                    .nav-mobile-toggle { display: block !important; }
                }
            `}</style>
        </>
    );
}
