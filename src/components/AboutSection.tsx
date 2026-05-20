"use client";
import { useScrollReveal } from '../hooks/useScrollReveal'
import { BookOpen, Cpu, FlaskConical, Users } from 'lucide-react'

const tagColors: Record<string, string> = {
    "Machine Learning": "#2563EB",
    "Image Mining": "#0891B2",
    "Computer Vision": "#059669",
    "Data Science": "#D97706",
    "Federated Learning": "#475569",
    "Artificial Intelligence": "#DC2626",
    "Healthcare Analytics": "#0D9488",
    "Social Media Mining": "#EA580C",
}

interface AboutSectionProps {
    data: {
        personal_info: {
            experience_summary: { total_years: number; teaching: number; industry: number; research: number };
            scopus: { h_index: number; documents: number };
            google_scholar: { h_index: number; i10_index: number };
        };
        research_interests: string[];
        technical_skills: {
            programming: string[];
            ml_libraries: string[];
            tools: string[];
            expertise: string[];
        };
    };
}

export default function AboutSection({ data }: AboutSectionProps) {
    const statsRef = useScrollReveal<HTMLDivElement>(0.1)
    const tagsRef = useScrollReveal<HTMLDivElement>()
    const skillsRef = useScrollReveal<HTMLDivElement>()

    const { personal_info, research_interests, technical_skills } = data;

    const stats = [
        { icon: BookOpen, value: `${personal_info.experience_summary.total_years}`, label: 'Years of Experience', sub: `${personal_info.experience_summary.teaching} Teaching + ${personal_info.experience_summary.industry} Industry` },
        { icon: Users, value: `${personal_info.experience_summary.research}`, label: 'Years in Research', sub: 'Active since 2012' },
        { icon: Cpu, value: `#${personal_info.scopus.h_index}`, label: 'Scopus H-Index', sub: `${personal_info.scopus.documents} documents` },
        { icon: FlaskConical, value: `#${personal_info.google_scholar.h_index}`, label: 'Scholar H-Index', sub: `i10-Index: ${personal_info.google_scholar.i10_index}` },
    ];

    return (
        <section style={{ backgroundColor: '#FAFAFA', color: '#09090B', padding: 'clamp(60px, 8vw, 120px) 24px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

                {/* Stats grid */}
                <div ref={statsRef} className="stagger-children" style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '1px', backgroundColor: '#E4E4E7', border: '1px solid #E4E4E7', marginBottom: '80px',
                }}>
                    {stats.map(({ icon: Icon, value, label, sub }) => (
                        <div key={label} style={{ backgroundColor: '#FAFAFA', padding: '32px 28px', transition: 'background-color 0.2s ease', cursor: 'default' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F4F4F5')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}>
                            <Icon size={18} color="#2563EB" strokeWidth={1.5} />
                            <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: '36px', color: '#09090B', marginTop: '12px', lineHeight: 1 }}>{value}</div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#3F3F46', marginTop: '8px' }}>{label}</div>
                            <div style={{ fontSize: '12px', color: '#71717A', marginTop: '4px' }}>{sub}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px' }}>
                    {/* Research Interests */}
                    <div ref={tagsRef} className="reveal">
                        <h3 style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: '18px', color: '#09090B', marginBottom: '20px', marginTop: 0 }}>Research Interests</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {research_interests.map((interest) => (
                                <span key={interest} style={{
                                    display: 'inline-block', padding: '8px 16px',
                                    backgroundColor: `${tagColors[interest] || '#2563EB'}14`,
                                    color: tagColors[interest] || '#2563EB',
                                    border: `1px solid ${tagColors[interest] || '#2563EB'}30`,
                                    fontSize: '13px', fontWeight: 500, transition: 'all 0.2s ease', cursor: 'default',
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = tagColors[interest] || '#2563EB'; e.currentTarget.style.color = '#fff' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${tagColors[interest] || '#2563EB'}14`; e.currentTarget.style.color = tagColors[interest] || '#2563EB' }}
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Technical Skills */}
                    <div ref={skillsRef} className="reveal">
                        <h3 style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: '18px', color: '#09090B', marginBottom: '20px', marginTop: 0 }}>Technical Skills</h3>
                        {[
                            { label: 'Programming', items: technical_skills.programming },
                            { label: 'ML Libraries', items: technical_skills.ml_libraries },
                            { label: 'Tools', items: technical_skills.tools },
                            { label: 'Expertise', items: technical_skills.expertise },
                        ].map(({ label, items }) => (
                            <div key={label} style={{ marginBottom: '16px' }}>
                                <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#71717A', fontWeight: 600, marginBottom: '8px' }}>{label}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {(items || []).map((item) => (
                                        <span key={item} style={{
                                            display: 'inline-block', padding: '4px 12px',
                                            backgroundColor: '#F4F4F5', color: '#3F3F46',
                                            border: '1px solid #E4E4E7', fontSize: '12px', fontWeight: 500, transition: 'all 0.15s ease',
                                        }}
                                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#09090B'; e.currentTarget.style.color = '#FAFAFA' }}
                                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F4F4F5'; e.currentTarget.style.color = '#3F3F46' }}
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
