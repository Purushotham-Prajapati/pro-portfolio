"use client";
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { SkeletonSection, SaveBar, SectionHeader, FieldGroup } from '../../../../components/shared/AdminUI';

function TagInput({ tags, onAdd, onRemove }: { tags: string[]; onAdd: (t: string) => void; onRemove: (i: number) => void }) {
    const [input, setInput] = useState('');
    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && input.trim()) { onAdd(input.trim()); setInput(''); }
    };
    return (
        <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-zinc-800/50 ring-1 ring-white/10 min-h-[48px]">
            {tags.map((t, i) => (
                <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-medium ring-1 ring-blue-500/30">
                    {t} <button onClick={() => onRemove(i)} className="hover:text-red-400 cursor-pointer"><X size={11} /></button>
                </span>
            ))}
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                placeholder="Type and press Enter..."
                className="bg-transparent outline-none text-sm text-white placeholder:text-zinc-600 flex-1 min-w-[120px]" />
        </div>
    );
}

function SkillRow({ label, items, onChange }: { label: string; items: string[]; onChange: (i: string[]) => void }) {
    return (
        <FieldGroup label={label}>
            <TagInput tags={items} onAdd={t => onChange([...items, t])} onRemove={i => onChange(items.filter((_, idx) => idx !== i))} />
        </FieldGroup>
    );
}

export default function AboutEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<any>(null);

    useEffect(() => {
        fetch('/api/portfolio').then(r => r.json()).then(d => {
            setData({ research_interests: d.research_interests || [], technical_skills: d.technical_skills || {} });
            setLoading(false);
        });
    }, []);

    const save = async () => {
        setSaving(true);
        try {
            await fetch('/api/portfolio', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'research_interests', data: data.research_interests }) });
            await fetch('/api/portfolio', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'technical_skills', data: data.technical_skills }) });
            setMessage({ type: 'success', text: 'Saved!' });
        } catch { setMessage({ type: 'error', text: 'Failed.' }); }
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };

    if (loading || !data) return <SkeletonSection rows={5} />;

    const setSkill = (key: string, value: string[]) => setData((d: any) => ({ ...d, technical_skills: { ...d.technical_skills, [key]: value } }));

    return (
        <div>
            <SectionHeader title="About & Skills" subtitle="Manage research interests and technical skill tags." />
            <div className="space-y-6">
                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Research Interests</h3>
                    <TagInput tags={data.research_interests} onAdd={t => setData((d: any) => ({ ...d, research_interests: [...d.research_interests, t] }))} onRemove={i => setData((d: any) => ({ ...d, research_interests: d.research_interests.filter((_: any, idx: number) => idx !== i) }))} />
                </div>
                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Technical Skills</h3>
                    <SkillRow label="Programming" items={data.technical_skills.programming || []} onChange={v => setSkill('programming', v)} />
                    <SkillRow label="ML Libraries" items={data.technical_skills.ml_libraries || []} onChange={v => setSkill('ml_libraries', v)} />
                    <SkillRow label="Tools" items={data.technical_skills.tools || []} onChange={v => setSkill('tools', v)} />
                    <SkillRow label="Expertise" items={data.technical_skills.expertise || []} onChange={v => setSkill('expertise', v)} />
                </div>
            </div>
            <SaveBar saving={saving} message={message} onSave={save} />
        </div>
    );
}
