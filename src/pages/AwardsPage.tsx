import { useEffect } from 'react'
import AwardsSection from '../components/AwardsSection'

export default function AwardsPage() {
    useEffect(() => { window.scrollTo(0, 0) }, [])
    return (
        <div style={{ paddingTop: '80px', backgroundColor: '#09090B', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(48px, 7vw, 96px) 24px 0' }}>
                <span style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F59E0B', fontWeight: 600 }}>
                    — Honours & Awards
                </span>
                <h1 style={{
                    fontFamily: 'Archivo, sans-serif', fontWeight: 800,
                    fontSize: 'clamp(36px, 6vw, 72px)', lineHeight: 1.05,
                    letterSpacing: '-0.03em', color: '#FAFAFA', margin: '16px 0 0',
                }}>
                    Recognition that<br />
                    <span style={{ color: '#F59E0B' }}>spans 14 years.</span>
                </h1>
            </div>
            <AwardsSection />
        </div>
    )
}
