import { useEffect } from 'react'
import TeachingSection from '../components/TeachingSection'

export default function TeachingPage() {
    useEffect(() => { window.scrollTo(0, 0) }, [])
    return (
        <div style={{ paddingTop: '80px', backgroundColor: '#F4F4F5', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(48px, 7vw, 96px) 24px 0' }}>
                <span style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#2563EB', fontWeight: 600 }}>
                    — Teaching & Leadership
                </span>
                <h1 style={{
                    fontFamily: 'Archivo, sans-serif', fontWeight: 800,
                    fontSize: 'clamp(36px, 6vw, 72px)', lineHeight: 1.05,
                    letterSpacing: '-0.03em', color: '#09090B', margin: '16px 0 0',
                }}>
                    18 Years of<br />
                    <span style={{ color: '#2563EB' }}>Classroom Excellence</span>
                </h1>
            </div>
            <TeachingSection />
        </div>
    )
}
