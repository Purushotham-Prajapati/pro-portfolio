"use client";
import { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SkeletonSection, SaveBar, SectionHeader, FieldGroup, Input } from '../../../../components/shared/AdminUI';

const COLORS = ['#D97706', '#EA580C', '#059669', '#DC2626', '#B45309', '#E11D48'];

function SortableAward({ id, award, index, onEdit, onRemove }: any) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const color = COLORS[index % COLORS.length];
    return (
        <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
            className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 ring-1 ring-white/5">
            <button {...attributes} {...listeners} className="cursor-grab text-zinc-600 hover:text-zinc-400"><GripVertical size={16} /></button>
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
            <div className="flex-1 min-w-0">
                <button onClick={() => onEdit(index)} className="w-full text-left">
                    <div className="truncate text-sm font-semibold text-white">{award.title || 'Untitled award'}</div>
                    <div className="text-xs text-zinc-500">{award.year || 'Year not set'}</div>
                </button>
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
    const [modalOpen, setModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [draftAward, setDraftAward] = useState<any>({ title: '', year: new Date().getFullYear() });
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

    const onRemove = (i: number) => setAwards(a => a.filter((_, idx) => idx !== i));
    const openAwardModal = (i: number | null) => {
        setEditingIndex(i);
        setDraftAward(i === null ? { title: '', year: new Date().getFullYear() } : { ...awards[i] });
        setModalOpen(true);
    };
    const closeAwardModal = () => {
        setModalOpen(false);
        setEditingIndex(null);
        setDraftAward({ title: '', year: new Date().getFullYear() });
    };
    const saveAwardDraft = () => {
        if (editingIndex === null) {
            setAwards(a => [...a, draftAward]);
        } else {
            setAwards(a => a.map((award, idx) => idx === editingIndex ? draftAward : award));
        }
        closeAwardModal();
    };

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
                    <button onClick={() => openAwardModal(null)} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-lg ring-1 ring-amber-500/30 cursor-pointer transition-all">
                        <Plus size={13} /> Add Award
                    </button>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={awards.map((_, i) => `aw-${i}`)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                            {awards.map((aw, i) => <SortableAward key={`aw-${i}`} id={`aw-${i}`} award={aw} index={i} onEdit={openAwardModal} onRemove={onRemove} />)}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
            {modalOpen ? (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-zinc-950 p-6 ring-1 ring-amber-500/25 shadow-2xl">
                        <h3 className="text-lg font-bold text-white">{editingIndex === null ? 'Add Award' : 'Edit Award'}</h3>
                        <div className="mt-5 space-y-4">
                            <FieldGroup label="Award Title">
                                <Input value={draftAward.title || ''} onChange={v => setDraftAward((d: any) => ({ ...d, title: v }))} />
                            </FieldGroup>
                            <FieldGroup label="Year">
                                <Input type="number" value={draftAward.year || new Date().getFullYear()} onChange={v => setDraftAward((d: any) => ({ ...d, year: Number(v) }))} />
                            </FieldGroup>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={closeAwardModal} className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 ring-1 ring-white/10">Cancel</button>
                            <button onClick={saveAwardDraft} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500">Save Award</button>
                        </div>
                    </div>
                </div>
            ) : null}
            <SaveBar saving={saving} message={message} onSave={save} />
        </div>
    );
}
