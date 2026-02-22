import { useRef, useEffect } from 'react'
import { personalInfo, publications, majorProjects } from '../data/portfolio'
import { ExternalLink, TrendingUp, FileText, Lightbulb, BookOpen } from 'lucide-react'

function MetricCard({ value, label, sub }: { value: string | number; label: string; sub?: string }) {
    return (
        <div style={{
            padding: '24px',
            border: '1px solid #E4E4E7',
            backgroundColor: '#FAFAFA',
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
            cursor: 'default',
        }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(37,99,235,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
            <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: '40px', fontWeight: 800, color: '#09090B', lineHeight: 1 }}>
                {value}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#3F3F46', marginTop: '8px' }}>{label}</div>
            {sub && <div style={{ fontSize: '12px', color: '#71717A', marginTop: '4px' }}>{sub}</div>}
        </div>
    )
}

export default function ResearchSection() {
    const metricsRef = useRef<HTMLDivElement>(null)
    const projectsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const refs = [metricsRef, projectsRef]
        const observers = refs.map((ref) => {
            const el = ref.current
            if (!el) return null
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
                { threshold: 0.1 }
            )
            obs.observe(el)
            return obs
        })
        return () => observers.forEach((o) => o?.disconnect())
    }, [])

    return (
        <section style={{ backgroundColor: '#FAFAFA', color: '#09090B', padding: 'clamp(48px, 6vw, 96px) 24px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>


                {/* Publication stats */}
                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#71717A', marginBottom: '16px', marginTop: 0 }}>
                        Publication Output
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1px', backgroundColor: '#E4E4E7', border: '1px solid #E4E4E7', marginBottom: '48px' }}>
                        <MetricCard value={`${publications.totalPapers}+`} label="Research Papers" sub="International Journals & Conferences" />
                        <MetricCard value={publications.patents} label="Patents Filed" sub="National & International" />
                        <MetricCard value={publications.booksAuthored} label="Books Authored" />
                        <MetricCard value={publications.copyrights} label="Copyrights" />
                    </div>
                </div>

                {/* Scholar profiles side by side */}
                <div
                    ref={metricsRef}
                    className="stagger-children"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '80px' }}
                >
                    {/* Google Scholar */}
                    <div style={{
                        backgroundColor: '#09090B', color: '#FAFAFA',
                        border: '1px solid #27272A', padding: '36px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                            <TrendingUp size={18} color="#2563EB" />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#A1A1AA', letterSpacing: '0.04em' }}>Google Scholar</span>
                        </div>
                        {[
                            { label: 'Total Documents', value: personalInfo.googleScholar.documents },
                            { label: 'Total Citations', value: personalInfo.googleScholar.citations },
                            { label: 'H-Index', value: personalInfo.googleScholar.hIndex },
                            { label: 'i10-Index', value: personalInfo.googleScholar.i10Index },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #27272A' }}>
                                <span style={{ fontSize: '13px', color: '#71717A' }}>{label}</span>
                                <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: '20px', fontWeight: 800, color: '#FAFAFA' }}>{value}</span>
                            </div>
                        ))}
                        <a
                            href={personalInfo.googleScholar.link}
                            target="_blank" rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                marginTop: '20px', fontSize: '12px', color: '#2563EB',
                                textDecoration: 'none', fontWeight: 500,
                            }}
                        >
                            View Profile <ExternalLink size={12} />
                        </a>
                    </div>

                    {/* Scopus */}
                    <div style={{
                        backgroundColor: '#09090B', color: '#FAFAFA',
                        border: '1px solid #27272A', padding: '36px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                            <FileText size={18} color="#D97706" />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#A1A1AA', letterSpacing: '0.04em' }}>Scopus</span>
                        </div>
                        {[
                            { label: 'Total Documents', value: personalInfo.scopus.documents },
                            { label: 'Total Citations', value: personalInfo.scopus.citations },
                            { label: 'H-Index', value: personalInfo.scopus.hIndex },
                            { label: 'ORCID', value: personalInfo.orcid },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #27272A', flexWrap: 'wrap', gap: '4px' }}>
                                <span style={{ fontSize: '13px', color: '#71717A' }}>{label}</span>
                                <span style={{ fontFamily: typeof value === 'number' ? 'Archivo, sans-serif' : undefined, fontSize: typeof value === 'number' ? '20px' : '12px', fontWeight: typeof value === 'number' ? 800 : 500, color: '#FAFAFA' }}>{value}</span>
                            </div>
                        ))}
                        <a
                            href={personalInfo.scopus.link}
                            target="_blank" rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                marginTop: '20px', fontSize: '12px', color: '#D97706',
                                textDecoration: 'none', fontWeight: 500,
                            }}
                        >
                            View Profile <ExternalLink size={12} />
                        </a>
                    </div>
                </div>

                {/* Funded Projects */}
                <div ref={projectsRef} className="reveal">
                    <h3 style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#71717A', marginBottom: '24px', marginTop: 0 }}>
                        Major Funded Research Projects
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: '#E4E4E7', border: '1px solid #E4E4E7' }}>
                        {majorProjects.map((project) => (
                            <div
                                key={project.title}
                                style={{
                                    backgroundColor: '#FAFAFA',
                                    padding: '28px 32px',
                                    display: 'grid',
                                    gridTemplateColumns: '1fr auto',
                                    gap: '16px',
                                    alignItems: 'center',
                                    transition: 'background-color 0.2s ease',
                                    cursor: 'default',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F4F4F5'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FAFAFA'}
                            >
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                        <span style={{
                                            fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                                            color: '#DC2626', border: '1px solid #DC262640', backgroundColor: '#DC262610',
                                            padding: '2px 8px',
                                        }}>
                                            {project.fundingAgency}
                                        </span>
                                        <span style={{ fontSize: '11px', color: '#71717A' }}>{project.year}</span>
                                        <span style={{ fontSize: '11px', color: '#52525B' }}>Principal Investigator</span>
                                    </div>
                                    <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: '15px', color: '#09090B', lineHeight: 1.4 }}>
                                        {project.title}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                                        <Lightbulb size={14} color="#D97706" />
                                        <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: '20px', fontWeight: 800, color: '#09090B' }}>
                                            ₹{project.amountLakhs}L
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#71717A', marginTop: '2px' }}>Sanctioned</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                        <BookOpen size={12} color="#71717A" />
                        <span style={{ fontSize: '12px', color: '#71717A' }}>
                            Total sanctioned: <strong style={{ color: '#09090B' }}>₹{majorProjects.reduce((s, p) => s + p.amountLakhs, 0).toFixed(2)} Lakhs</strong>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
