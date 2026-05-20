"use client";
import { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SkeletonSection, SaveBar, SectionHeader, FieldGroup, Input } from '../../../../components/shared/AdminUI';

const EVENT_TYPES = ['education', 'career', 'award', 'research', 'milestone'];
const TYPE_COLORS: Record<string, string> = {
    education: '#059669', career: '#2563EB', award: '#D97706', research: '#DC2626', milestone: '#0D9488'
};

function SortableEvent({ id, event, index, onChange, onRemove }: any) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const [open, setOpen] = useState(false);
    const color = TYPE_COLORS[event.type] || '#71717A';

    return (
        <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
            className="rounded-xl bg-zinc-900/50 ring-1 ring-white/5 overflow-hidden">
            <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setOpen(!open)}>
                <button {...attributes} {...listeners} className="cursor-grab text-zinc-600 hover:text-zinc-400" onClick={e => e.stopPropagation()}><GripVertical size={16} /></button>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>{event.type}</span>
                <span className="font-semibold text-white text-sm flex-1">{event.year} — {event.title || 'Untitled'}</span>
                <button onClick={(e) => { e.stopPropagation(); onRemove(index); }} className="text-zinc-600 hover:text-red-400 cursor-pointer"><Trash2 size={14} /></button>
                {open ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
            </div>
            {open && (
                <div className="px-4 pb-4 border-t border-white/5 pt-4 grid grid-cols-2 gap-3">
                    <FieldGroup label="Year"><Input type="number" value={event.year} onChange={v => onChange(index, 'year', Number(v))} /></FieldGroup>
                    <FieldGroup label="Type">
                        <select value={event.type} onChange={e => onChange(index, 'type', e.target.value)}
                            className="w-full rounded-lg border-0 bg-zinc-800/50 py-2.5 px-3 text-white text-sm ring-1 ring-white/10 outline-none">
                            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </FieldGroup>
                    <div className="col-span-2"><FieldGroup label="Title"><Input value={event.title} onChange={v => onChange(index, 'title', v)} /></FieldGroup></div>
                    <div className="col-span-2"><FieldGroup label="Subtitle"><Input value={event.subtitle} onChange={v => onChange(index, 'subtitle', v)} /></FieldGroup></div>
                    <div className="col-span-2">
                        <FieldGroup label="Description">
                            <textarea value={event.description} onChange={e => onChange(index, 'description', e.target.value)}
                                rows={3} className="w-full rounded-lg border-0 bg-zinc-800/50 py-2.5 px-3 text-white text-sm ring-1 ring-white/10 outline-none resize-none" />
                        </FieldGroup>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function JourneyEditor() {
    const [events, setEvents] = useState<any[]>([]);
    const [introBadge, setIntroBadge] = useState('THE JOURNEY');
    const [introLine1, setIntroLine1] = useState('33 Years of');
    const [introLine2, setIntroLine2] = useState('Relentless Growth');
    const [introDescription, setIntroDescription] = useState('');
    const [stats, setStats] = useState<any[]>([
        { value: '18', label: 'Years Teaching' },
        { value: '3 yrs', label: 'Industry Exp.' },
        { value: '13 yrs', label: 'Research Active' },
        { value: '8+', label: 'PhD Scholars' }
    ]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<any>(null);
    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        fetch('/api/portfolio')
            .then(r => r.json())
            .then(d => {
                setEvents(d.timeline_events || []);
                if (d.journey_intro) {
                    setIntroBadge(d.journey_intro.badge || 'THE JOURNEY');
                    setIntroLine1(d.journey_intro.title_line_1 || '');
                    setIntroLine2(d.journey_intro.title_line_2 || '');
                    setIntroDescription(d.journey_intro.description || '');
                    setStats(d.journey_intro.stats || [
                        { value: '18', label: 'Years Teaching' },
                        { value: '3 yrs', label: 'Industry Exp.' },
                        { value: '13 yrs', label: 'Research Active' },
                        { value: '8+', label: 'PhD Scholars' }
                    ]);
                }
                setLoading(false);
            });
    }, []);

    const onChange = (i: number, key: string, val: any) => setEvents(prev => { const n = [...prev]; n[i] = { ...n[i], [key]: val }; return n; });
    const onRemove = (i: number) => setEvents(prev => prev.filter((_, idx) => idx !== i));
    const addEvent = () => setEvents(prev => [...prev, { year: new Date().getFullYear(), title: '', subtitle: '', description: '', type: 'education' }]);

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (over && active.id !== over.id) {
            const oi = events.findIndex((_, i) => `ev-${i}` === active.id);
            const ni = events.findIndex((_, i) => `ev-${i}` === over.id);
            setEvents(arrayMove(events, oi, ni));
        }
    };

    const save = async () => {
        setSaving(true);
        try {
            await fetch('/api/portfolio', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'timeline_events', data: events }) });
            await fetch('/api/portfolio', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section: 'journey_intro',
                    data: {
                        badge: introBadge,
                        title_line_1: introLine1,
                        title_line_2: introLine2,
                        description: introDescription,
                        stats: stats
                    }
                })
            });
            setMessage({ type: 'success', text: 'Saved!' });
        } catch { setMessage({ type: 'error', text: 'Failed.' }); }
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };

    if (loading) return <SkeletonSection rows={5} />;

    return (
        <div>
            <SectionHeader title="Journey & Timeline" subtitle="Edit timeline events, page intro header, and metrics. Drag timeline to reorder." />
            
            <div className="space-y-6 mb-8">
                {/* Header Configuration */}
                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Page Header Content</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FieldGroup label="Section Badge">
                            <Input value={introBadge} onChange={setIntroBadge} placeholder="e.g. THE JOURNEY" />
                        </FieldGroup>
                        <FieldGroup label="Headline Line 1 (Regular)">
                            <Input value={introLine1} onChange={setIntroLine1} placeholder="e.g. 33 Years of" />
                        </FieldGroup>
                        <FieldGroup label="Headline Line 2 (Gradient Highlight)">
                            <Input value={introLine2} onChange={setIntroLine2} placeholder="e.g. Relentless Growth" />
                        </FieldGroup>
                        <div className="col-span-1 md:col-span-3">
                            <FieldGroup label="Description Subtext">
                                <textarea value={introDescription} onChange={e => setIntroDescription(e.target.value)}
                                    rows={3} className="w-full rounded-lg border-0 bg-zinc-800/50 py-2.5 px-3 text-white text-sm ring-1 ring-white/10 outline-none resize-none"
                                    placeholder="Brief introductory context..." />
                            </FieldGroup>
                        </div>
                    </div>
                </div>

                {/* Experience Stats Configuration */}
                <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Experience Summary Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="space-y-2.5 p-3.5 bg-zinc-800/30 rounded-xl ring-1 ring-white/5">
                                <FieldGroup label={`Metric ${i + 1} Value`}>
                                    <Input value={stat.value} onChange={v => {
                                        const n = [...stats];
                                        n[i] = { ...n[i], value: v };
                                        setStats(n);
                                    }} placeholder="e.g. 18" />
                                </FieldGroup>
                                <FieldGroup label={`Metric ${i + 1} Label`}>
                                    <Input value={stat.label} onChange={v => {
                                        const n = [...stats];
                                        n[i] = { ...n[i], label: v };
                                        setStats(n);
                                    }} placeholder="e.g. Years Teaching" />
                                </FieldGroup>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Timeline Events Editor */}
            <div className="border-t border-white/5 pt-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-300">Timeline Events</h3>
                    <button onClick={addEvent} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold rounded-lg ring-1 ring-blue-500/30 cursor-pointer transition-all">
                        <Plus size={13} /> Add Event
                    </button>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={events.map((_, i) => `ev-${i}`)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3">
                            {events.map((ev, i) => (
                                <SortableEvent key={`ev-${i}`} id={`ev-${i}`} event={ev} index={i} onChange={onChange} onRemove={onRemove} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
            
            <SaveBar saving={saving} message={message} onSave={save} />
        </div>
    );
}
