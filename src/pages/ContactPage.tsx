import { useEffect } from 'react'
import ContactSection from '../components/ContactSection'

export default function ContactPage() {
    useEffect(() => { window.scrollTo(0, 0) }, [])
    return (
        <div style={{ paddingTop: '80px', backgroundColor: '#09090B', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(48px, 7vw, 96px) 24px 0' }}>
                <span style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#2563EB', fontWeight: 600 }}>
                    — Connect
                </span>
                <h1 style={{
                    fontFamily: 'Archivo, sans-serif', fontWeight: 800,
                    fontSize: 'clamp(36px, 6vw, 72px)', lineHeight: 1.05,
                    letterSpacing: '-0.03em', color: '#FAFAFA', margin: '16px 0 0',
                }}>
                    Academic Profiles<br />
                    <span style={{ color: '#2563EB' }}>& Collaboration</span>
                </h1>
            </div>
            <ContactSection />
        </div>
    )
}
