"use client";
import { usePortfolioSection } from '../../../../hooks/usePortfolioSection';
import { SkeletonSection, SaveBar, SectionHeader, FieldGroup, Input } from '../../../../components/shared/AdminUI';
import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableRatification({ id, item, index, update, remove }: any) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    return (
        <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
            className="flex gap-3 items-start p-3 bg-zinc-800/30 rounded-lg ring-1 ring-white/5">
            <button {...attributes} {...listeners} className="cursor-grab mt-2 text-zinc-600 hover:text-zinc-400"><GripVertical size={16} /></button>
            <div className="flex-1 grid grid-cols-3 gap-2">
                <Input value={item.designation} onChange={v => update(index, 'designation', v)} placeholder="Designation" />
                <Input value={item.university} onChange={v => update(index, 'university', v)} placeholder="University" />
                <Input value={item.date} onChange={v => update(index, 'date', v)} placeholder="Date" />
            </div>
            <button onClick={() => remove(index)} className="mt-2 text-zinc-600 hover:text-red-400 cursor-pointer"><Trash2 size={16} /></button>
        </div>
    );
}

export default function PersonalInfoEditor() {
    const { data: raw, loading, saving, save, message } = usePortfolioSection<any>('personal_info');
    const [form, setForm] = useState<any>(null);

    useEffect(() => { if (raw) setForm(raw); }, [raw]);

    const sensors = useSensors(useSensor(PointerSensor));

    if (loading || !form) return <SkeletonSection rows={6} />;

    const set = (path: string[], value: any) => {
        setForm((prev: any) => {
            const next = structuredClone(prev);
            let cur = next;
            for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
            cur[path[path.length - 1]] = value;
            return next;
        });
    };

    const updateRat = (i: number, key: string, val: string) => {
        const rats = [...form.ratification];
        rats[i] = { ...rats[i], [key]: val };
        set(['ratification'], rats);
    };

    const removeRat = (i: number) => set(['ratification'], form.ratification.filter((_: any, idx: number) => idx !== i));
    const addRat = () => set(['ratification'], [...(form.ratification || []), { designation: '', university: '', date: '' }]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIdx = form.ratification.findIndex((_: any, i: number) => `rat-${i}` === active.id);
            const newIdx = form.ratification.findIndex((_: any, i: number) => `rat-${i}` === over.id);
            set(['ratification'], arrayMove(form.ratification, oldIdx, newIdx));
        }
    };

    return (
        <div>
            <SectionHeader title="Personal Info" subtitle="Edit the Hero section — name, designation, academic stats, and ratification history." />

            <div className="space-y-8">
                {/* Basic */}
                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Basic Info</h3>
                    <FieldGroup label="Full Name"><Input value={form.name} onChange={v => set(['name'], v)} /></FieldGroup>
                    <FieldGroup label="Designation"><Input value={form.designation} onChange={v => set(['designation'], v)} /></FieldGroup>
                </div>

                {/* Experience */}
                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Experience Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FieldGroup label="Total Years"><Input type="number" value={form.experience_summary?.total_years || 0} onChange={v => set(['experience_summary', 'total_years'], Number(v))} /></FieldGroup>
                        <FieldGroup label="Teaching"><Input type="number" value={form.experience_summary?.teaching || 0} onChange={v => set(['experience_summary', 'teaching'], Number(v))} /></FieldGroup>
                        <FieldGroup label="Industry"><Input type="number" value={form.experience_summary?.industry || 0} onChange={v => set(['experience_summary', 'industry'], Number(v))} /></FieldGroup>
                        <FieldGroup label="Research"><Input type="number" value={form.experience_summary?.research || 0} onChange={v => set(['experience_summary', 'research'], Number(v))} /></FieldGroup>
                    </div>
                </div>

                {/* Scholar / Scopus */}
                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Google Scholar</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FieldGroup label="Documents"><Input type="number" value={form.google_scholar?.documents || 0} onChange={v => set(['google_scholar', 'documents'], Number(v))} /></FieldGroup>
                        <FieldGroup label="Citations"><Input type="number" value={form.google_scholar?.citations || 0} onChange={v => set(['google_scholar', 'citations'], Number(v))} /></FieldGroup>
                        <FieldGroup label="H-Index"><Input type="number" value={form.google_scholar?.h_index || 0} onChange={v => set(['google_scholar', 'h_index'], Number(v))} /></FieldGroup>
                        <FieldGroup label="i10-Index"><Input type="number" value={form.google_scholar?.i10_index || 0} onChange={v => set(['google_scholar', 'i10_index'], Number(v))} /></FieldGroup>
                        <FieldGroup label="Link (full URL)"><Input value={form.google_scholar?.link || ''} onChange={v => set(['google_scholar', 'link'], v)} /></FieldGroup>
                    </div>
                </div>

                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Scopus & ORCID</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FieldGroup label="Documents"><Input type="number" value={form.scopus?.documents || 0} onChange={v => set(['scopus', 'documents'], Number(v))} /></FieldGroup>
                        <FieldGroup label="Citations"><Input type="number" value={form.scopus?.citations || 0} onChange={v => set(['scopus', 'citations'], Number(v))} /></FieldGroup>
                        <FieldGroup label="H-Index"><Input type="number" value={form.scopus?.h_index || 0} onChange={v => set(['scopus', 'h_index'], Number(v))} /></FieldGroup>
                        <FieldGroup label="Scopus Link"><Input value={form.scopus?.link || ''} onChange={v => set(['scopus', 'link'], v)} /></FieldGroup>
                        <FieldGroup label="ORCID ID"><Input value={form.orcid || ''} onChange={v => set(['orcid'], v)} /></FieldGroup>
                    </div>
                </div>

                {/* Ratification DND */}
                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <h3 className="text-sm font-semibold text-zinc-300">Ratification History</h3>
                        <button onClick={addRat} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 cursor-pointer"><Plus size={14} /> Add</button>
                    </div>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={(form.ratification || []).map((_: any, i: number) => `rat-${i}`)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-2">
                                {(form.ratification || []).map((rat: any, i: number) => (
                                    <SortableRatification key={`rat-${i}`} id={`rat-${i}`} item={rat} index={i} update={updateRat} remove={removeRat} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>

            <SaveBar saving={saving} message={message} onSave={() => save(form)} />
        </div>
    );
}
