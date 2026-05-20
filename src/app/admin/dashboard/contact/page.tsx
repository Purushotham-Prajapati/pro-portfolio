"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { SkeletonSection, SaveBar, SectionHeader, FieldGroup, Input } from '../../../../components/shared/AdminUI';

const RichTextEditor = dynamic(() => import('../../../../components/shared/RichTextEditor'), { ssr: false });

export default function ContactEditor() {
    const [contact, setContact] = useState<any>(null);
    const [introBadge, setIntroBadge] = useState('CONNECT');
    const [introLine1, setIntroLine1] = useState('Academic Profiles');
    const [introLine2, setIntroLine2] = useState('& Collaboration');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<any>(null);

    useEffect(() => {
        fetch('/api/portfolio')
            .then(r => r.json())
            .then(d => {
                setContact(d.contact || {});
                if (d.contact_intro) {
                    setIntroBadge(d.contact_intro.badge || 'CONNECT');
                    setIntroLine1(d.contact_intro.title_line_1 || '');
                    setIntroLine2(d.contact_intro.title_line_2 || '');
                }
                setLoading(false);
            });
    }, []);

    const set = (key: string, value: any) => setContact((c: any) => ({ ...c, [key]: value }));
    const setNested = (parent: string, key: string, value: any) => setContact((c: any) => ({ ...c, [parent]: { ...(c[parent] || {}), [key]: value } }));

    const save = async () => {
        setSaving(true);
        try {
            await fetch('/api/portfolio', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'contact', data: contact }) });
            await fetch('/api/portfolio', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section: 'contact_intro',
                    data: {
                        badge: introBadge,
                        title_line_1: introLine1,
                        title_line_2: introLine2
                    }
                })
            });
            setMessage({ type: 'success', text: 'Saved!' });
        } catch { setMessage({ type: 'error', text: 'Failed.' }); }
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };

    if (loading || !contact) return <SkeletonSection rows={5} />;

    return (
        <div>
            <SectionHeader title="Contact Section" subtitle="Edit contact info, academic profile links, and the description shown on the contact page." />
            <div className="space-y-6">
                {/* Header Configuration */}
                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Page Header Content</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FieldGroup label="Section Badge">
                            <Input value={introBadge} onChange={setIntroBadge} placeholder="e.g. CONNECT" />
                        </FieldGroup>
                        <FieldGroup label="Headline Line 1 (Regular)">
                            <Input value={introLine1} onChange={introLine1 => setIntroLine1(introLine1)} placeholder="e.g. Academic Profiles" />
                        </FieldGroup>
                        <FieldGroup label="Headline Line 2 (Gradient Highlight)">
                            <Input value={introLine2} onChange={introLine2 => setIntroLine2(introLine2)} placeholder="e.g. & Collaboration" />
                        </FieldGroup>
                    </div>
                </div>

                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Contact Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FieldGroup label="Email"><Input value={contact.email || ''} onChange={v => set('email', v)} placeholder="madhubala@cvr.ac.in" /></FieldGroup>
                        <FieldGroup label="ORCID"><Input value={contact.orcid || ''} onChange={v => set('orcid', v)} placeholder="0000-0000-0000-0000" /></FieldGroup>
                        <div className="col-span-2"><FieldGroup label="Department"><Input value={contact.department || ''} onChange={v => set('department', v)} /></FieldGroup></div>
                        <div className="col-span-2"><FieldGroup label="Institution"><Input value={contact.institution || ''} onChange={v => set('institution', v)} /></FieldGroup></div>
                    </div>
                </div>

                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Google Scholar</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <FieldGroup label="Link"><Input value={contact.google_scholar?.link || ''} onChange={v => setNested('google_scholar', 'link', v)} /></FieldGroup>
                        <FieldGroup label="Documents"><Input type="number" value={contact.google_scholar?.documents || 0} onChange={v => setNested('google_scholar', 'documents', Number(v))} /></FieldGroup>
                        <FieldGroup label="Citations"><Input type="number" value={contact.google_scholar?.citations || 0} onChange={v => setNested('google_scholar', 'citations', Number(v))} /></FieldGroup>
                    </div>
                </div>

                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Scopus</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FieldGroup label="Link"><Input value={contact.scopus?.link || ''} onChange={v => setNested('scopus', 'link', v)} /></FieldGroup>
                        <FieldGroup label="H-Index"><Input type="number" value={contact.scopus?.h_index || 0} onChange={v => setNested('scopus', 'h_index', Number(v))} /></FieldGroup>
                    </div>
                </div>

                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Page Description</h3>
                    <RichTextEditor content={contact.description || ''} onChange={v => set('description', v)} />
                </div>
            </div>
            <SaveBar saving={saving} message={message} onSave={save} />
        </div>
    );
}
