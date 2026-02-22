import { useScrollReveal } from '../hooks/useScrollReveal'
import { researchInterests, technicalSkills, personalInfo } from '../data/portfolio'
import { BookOpen, Cpu, FlaskConical, Users } from 'lucide-react'

const tagColors: Record<string, string> = {
    "Machine Learning": "#2563EB",
    "Image Mining": "#0891B2",
    "Computer Vision": "#059669",
    "Data Science": "#D97706",
    "Federated Learning": "#7C3AED",
    "Artificial Intelligence": "#DC2626",
    "Healthcare Analytics": "#0D9488",
    "Social Media Mining": "#EA580C",
}

const stats = [
    { icon: BookOpen, value: '21', label: 'Years of Experience', sub: '18 Teaching + 3 Industry' },
    { icon: Users, value: '13', label: 'Years in Research', sub: 'Active since 2012' },
    { icon: Cpu, value: `#${personalInfo.scopus.hIndex}`, label: 'Scopus H-Index', sub: `${personalInfo.scopus.documents} documents` },
    { icon: FlaskConical, value: `#${personalInfo.googleScholar.hIndex}`, label: 'Scholar H-Index', sub: `i10-Index: ${personalInfo.googleScholar.i10Index}` },
]

export default function AboutSection() {
    const statsRef = useScrollReveal<HTMLDivElement>(0.1)
    const tagsRef = useScrollReveal<HTMLDivElement>()
    const skillsRef = useScrollReveal<HTMLDivElement>()

    return (
        <section style={{ backgroundColor: '#FAFAFA', color: '#09090B', padding: 'clamp(60px, 8vw, 120px) 24px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

                {/* Stats grid */}
                <div
                    ref={statsRef}
                    className="stagger-children"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '1px',
                        backgroundColor: '#E4E4E7',
                        border: '1px solid #E4E4E7',
                        marginBottom: '80px',
                    }}
                >
                    {stats.map(({ icon: Icon, value, label, sub }) => (
                        <div
                            key={label}
                            style={{
                                backgroundColor: '#FAFAFA',
                                padding: '32px 28px',
                                transition: 'background-color 0.2s ease',
                                cursor: 'default',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F4F4F5')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                        >
                            <Icon size={18} color="#2563EB" strokeWidth={1.5} />
                            <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: '36px', color: '#09090B', marginTop: '12px', lineHeight: 1 }}>
                                {value}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#3F3F46', marginTop: '8px' }}>{label}</div>
                            <div style={{ fontSize: '12px', color: '#71717A', marginTop: '4px' }}>{sub}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px' }}>
                    {/* Research Interests */}
                    <div ref={tagsRef} className="reveal">
                        <h3 style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: '18px', color: '#09090B', marginBottom: '20px', marginTop: 0 }}>
                            Research Interests
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {researchInterests.map((interest) => (
                                <span
                                    key={interest}
                                    style={{
                                        display: 'inline-block',
                                        padding: '8px 16px',
                                        backgroundColor: `${tagColors[interest] || '#2563EB'}14`,
                                        color: tagColors[interest] || '#2563EB',
                                        border: `1px solid ${tagColors[interest] || '#2563EB'}30`,
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        transition: 'all 0.2s ease',
                                        cursor: 'default',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = tagColors[interest] || '#2563EB'
                                        e.currentTarget.style.color = '#fff'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = `${tagColors[interest] || '#2563EB'}14`
                                        e.currentTarget.style.color = tagColors[interest] || '#2563EB'
                                    }}
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Technical Skills */}
                    <div ref={skillsRef} className="reveal">
                        <h3 style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: '18px', color: '#09090B', marginBottom: '20px', marginTop: 0 }}>
                            Technical Skills
                        </h3>
                        {[
                            { label: 'Programming', items: technicalSkills.programming },
                            { label: 'ML Libraries', items: technicalSkills.mlLibraries },
                            { label: 'Tools', items: technicalSkills.tools },
                            { label: 'Expertise', items: technicalSkills.expertise },
                        ].map(({ label, items }) => (
                            <div key={label} style={{ marginBottom: '16px' }}>
                                <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#71717A', fontWeight: 600, marginBottom: '8px' }}>
                                    {label}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {items.map((item) => (
                                        <span
                                            key={item}
                                            style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                backgroundColor: '#F4F4F5',
                                                color: '#3F3F46',
                                                border: '1px solid #E4E4E7',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                transition: 'all 0.15s ease',
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
        </section >
    )
}
