"use client";
import { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SkeletonSection, SaveBar, SectionHeader, FieldGroup, Input } from '../../../../components/shared/AdminUI';

const COLORS = ['#D97706', '#2563EB', '#059669', '#DC2626', '#0D9488', '#0891B2', '#EA580C'];

function SortableAward({ id, award, index, onChange, onRemove }: any) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const color = COLORS[index % COLORS.length];
    return (
        <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
            className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 ring-1 ring-white/5">
            <button {...attributes} {...listeners} className="cursor-grab text-zinc-600 hover:text-zinc-400"><GripVertical size={16} /></button>
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
            <div className="flex-1 grid grid-cols-4 gap-3">
                <div className="col-span-3"><Input value={award.title} onChange={v => onChange(index, 'title', v)} placeholder="Award Title" /></div>
                <Input type="number" value={award.year} onChange={v => onChange(index, 'year', Number(v))} placeholder="Year" />
            </div>
            <button onClick={() => onRemove(index)} className="text-zinc-600 hover:text-red-400 cursor-pointer"><Trash2 size={15} /></button>
        </div>
    );
}

export default function AwardsEditor() {
    const [awards, setAwards] = useState<any[]>([]);
    const [introBadge, setIntroBadge] = useState('HONOURS & AWARDS');
    const [introLine1, setIntroLine1] = useState('Recognition that');
    const [introLine2, setIntroLine2] = useState('spans 14 years.');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<any>(null);
    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        fetch('/api/portfolio')
            .then(r => r.json())
            .then(d => {
                setAwards(d.awards || []);
                if (d.awards_intro) {
                    setIntroBadge(d.awards_intro.badge || 'HONOURS & AWARDS');
                    setIntroLine1(d.awards_intro.title_line_1 || '');
                    setIntroLine2(d.awards_intro.title_line_2 || '');
                }
                setLoading(false);
            });
    }, []);

    const onChange = (i: number, key: string, val: any) => setAwards(a => { const n = [...a]; n[i] = { ...n[i], [key]: val }; return n; });
    const onRemove = (i: number) => setAwards(a => a.filter((_, idx) => idx !== i));
    const addAward = () => setAwards(a => [...a, { title: '', year: new Date().getFullYear() }]);

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (over && active.id !== over.id) {
            const oi = awards.findIndex((_, i) => `aw-${i}` === active.id);
            const ni = awards.findIndex((_, i) => `aw-${i}` === over.id);
            setAwards(arrayMove(awards, oi, ni));
        }
    };

    const save = async () => {
        setSaving(true);
        try {
            await fetch('/api/portfolio', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'awards', data: awards }) });
            await fetch('/api/portfolio', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section: 'awards_intro',
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

    if (loading) return <SkeletonSection rows={6} />;

    return (
        <div>
            <SectionHeader title="Awards & Honours" subtitle="Add, edit, reorder awards. Drag to change display order." />
            
            {/* Header Configuration */}
            <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-4 mb-6">
                <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Page Header Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FieldGroup label="Section Badge">
                        <Input value={introBadge} onChange={setIntroBadge} placeholder="e.g. HONOURS & AWARDS" />
                    </FieldGroup>
                    <FieldGroup label="Headline Line 1 (Regular)">
                        <Input value={introLine1} onChange={introLine1 => setIntroLine1(introLine1)} placeholder="e.g. Recognition that" />
                    </FieldGroup>
                    <FieldGroup label="Headline Line 2 (Gradient Highlight)">
                        <Input value={introLine2} onChange={introLine2 => setIntroLine2(introLine2)} placeholder="e.g. spans 14 years." />
                    </FieldGroup>
                </div>
            </div>

            <div className="border-t border-white/5 pt-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-300">Awards & Honours List</h3>
                    <button onClick={addAward} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-lg ring-1 ring-amber-500/30 cursor-pointer transition-all">
                        <Plus size={13} /> Add Award
                    </button>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={awards.map((_, i) => `aw-${i}`)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                            {awards.map((aw, i) => <SortableAward key={`aw-${i}`} id={`aw-${i}`} award={aw} index={i} onChange={onChange} onRemove={onRemove} />)}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
            <SaveBar saving={saving} message={message} onSave={save} />
        </div>
    );
}
