"use client";
import { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { SkeletonSection, SaveBar, SectionHeader, Input } from '../../../../components/shared/AdminUI';

function TagInput({ tags, onAdd, onRemove }: { tags: string[]; onAdd: (t: string) => void; onRemove: (i: number) => void }) {
    const [input, setInput] = useState('');
    const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && input.trim()) { onAdd(input.trim()); setInput(''); } };
    return (
        <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-zinc-800/50 ring-1 ring-white/10 min-h-[52px]">
            {tags.map((t, i) => (
                <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-700/50 text-zinc-200 text-xs font-medium ring-1 ring-white/10">
                    {t} <button onClick={() => onRemove(i)} className="hover:text-red-400 cursor-pointer"><X size={11} /></button>
                </span>
            ))}
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Type & press Enter..." className="bg-transparent outline-none text-sm text-white placeholder:text-zinc-600 flex-1 min-w-[120px]" />
        </div>
    );
}

export default function TeachingEditor() {
    const [subjects, setSubjects] = useState<string[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [memberships, setMemberships] = useState<any[]>([]);
    const [introBadge, setIntroBadge] = useState('TEACHING & LEADERSHIP');
    const [introLine1, setIntroLine1] = useState('18 Years of');
    const [introLine2, setIntroLine2] = useState('Classroom Excellence');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<any>(null);

    useEffect(() => {
        fetch('/api/portfolio').then(r => r.json()).then(d => {
            setSubjects(d.subjects_handled || []);
            setRoles(d.administrative_roles || []);
            setMemberships(d.professional_memberships || []);
            if (d.teaching_intro) {
                setIntroBadge(d.teaching_intro.badge || 'TEACHING & LEADERSHIP');
                setIntroLine1(d.teaching_intro.title_line_1 || '');
                setIntroLine2(d.teaching_intro.title_line_2 || '');
            } else if (d.personal_info?.experience_summary?.teaching) {
                setIntroLine1(`${d.personal_info.experience_summary.teaching} Years of`);
            }
            setLoading(false);
        });
    }, []);

    const save = async () => {
        setSaving(true);
        try {
            await fetch('/api/portfolio', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'subjects_handled', data: subjects }) });
            await fetch('/api/portfolio', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'administrative_roles', data: roles }) });
            await fetch('/api/portfolio', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'professional_memberships', data: memberships }) });
            await fetch('/api/portfolio', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section: 'teaching_intro',
                    data: { badge: introBadge, title_line_1: introLine1, title_line_2: introLine2 }
                })
            });
            setMessage({ type: 'success', text: 'Saved!' });
        } catch { setMessage({ type: 'error', text: 'Failed.' }); }
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };

    if (loading) return <SkeletonSection rows={4} />;

    return (
        <div>
            <SectionHeader title="Teaching & Administration" subtitle="Manage subjects, admin roles, and professional memberships." />
            <div className="space-y-6">
                {/* Teaching Header Config */}
                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Teaching Section Header</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Section Badge</label>
                            <Input value={introBadge} onChange={setIntroBadge} placeholder="e.g. TEACHING & LEADERSHIP" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Headline Part 1 (Regular)</label>
                            <Input value={introLine1} onChange={setIntroLine1} placeholder="e.g. 18 Years of" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Headline Part 2 (Accent Blue)</label>
                            <Input value={introLine2} onChange={setIntroLine2} placeholder="e.g. Classroom Excellence" />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-3">
                    <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Subjects Handled</h3>
                    <TagInput tags={subjects} onAdd={t => setSubjects(s => [...s, t])} onRemove={i => setSubjects(s => s.filter((_, idx) => idx !== i))} />
                </div>
                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-3">
                    <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Administrative Roles</h3>
                    <TagInput tags={roles} onAdd={t => setRoles(r => [...r, t])} onRemove={i => setRoles(r => r.filter((_, idx) => idx !== i))} />
                </div>
                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <h3 className="text-sm font-semibold text-zinc-300">Professional Memberships</h3>
                        <button onClick={() => setMemberships(m => [...m, { organization: '', membership_id: '' }])}
                            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 cursor-pointer"><Plus size={13} /> Add</button>
                    </div>
                    <div className="space-y-2">
                        {memberships.map((m, i) => (
                            <div key={i} className="flex gap-3 items-center">
                                <div className="flex-1"><Input value={m.organization} onChange={v => { const n = [...memberships]; n[i] = { ...n[i], organization: v }; setMemberships(n); }} placeholder="Organization" /></div>
                                <div className="w-40"><Input value={m.membership_id || ''} onChange={v => { const n = [...memberships]; n[i] = { ...n[i], membership_id: v }; setMemberships(n); }} placeholder="Member ID (optional)" /></div>
                                <button onClick={() => setMemberships(ms => ms.filter((_, idx) => idx !== i))} className="text-zinc-600 hover:text-red-400 cursor-pointer"><Trash2 size={15} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <SaveBar saving={saving} message={message} onSave={save} />
        </div>
    );
}
