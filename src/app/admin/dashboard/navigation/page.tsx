"use client";
import { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SkeletonSection, SaveBar, SectionHeader, Input } from '../../../../components/shared/AdminUI';

function SortableNavItem({ id, item, index, onChange, onRemove, onToggle }: any) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    return (
        <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: item.is_visible ? 1 : 0.4 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 ring-1 ring-white/5">
            <button {...attributes} {...listeners} className="cursor-grab text-zinc-600 hover:text-zinc-400"><GripVertical size={16} /></button>
            <div className="flex-1 grid grid-cols-2 gap-3">
                <Input value={item.label} onChange={v => onChange(index, 'label', v)} placeholder="Label (e.g. Research)" />
                <Input value={item.href} onChange={v => onChange(index, 'href', v)} placeholder="Path (e.g. /research)" />
            </div>
            <button onClick={() => onToggle(index)} title={item.is_visible ? 'Hide from nav' : 'Show in nav'} className="text-zinc-500 hover:text-zinc-200 cursor-pointer">
                {item.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button onClick={() => onRemove(index)} className="text-zinc-600 hover:text-red-400 cursor-pointer"><Trash2 size={15} /></button>
        </div>
    );
}

export default function NavigationEditor() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<any>(null);
    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => { fetch('/api/portfolio').then(r => r.json()).then(d => { setItems(d.nav_items?.sort((a: any, b: any) => a.order - b.order) || []); setLoading(false); }); }, []);

    const onChange = (i: number, key: string, val: any) => setItems(prev => { const n = [...prev]; n[i] = { ...n[i], [key]: val }; return n; });
    const onToggle = (i: number) => setItems(prev => { const n = [...prev]; n[i] = { ...n[i], is_visible: !n[i].is_visible }; return n; });
    const onRemove = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));
    const addItem = () => setItems(prev => [...prev, { label: '', href: '/', order: prev.length, is_visible: true }]);

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (over && active.id !== over.id) {
            const oi = items.findIndex((_, i) => `nav-${i}` === active.id);
            const ni = items.findIndex((_, i) => `nav-${i}` === over.id);
            setItems(arrayMove(items, oi, ni).map((item, i) => ({ ...item, order: i })));
        }
    };

    const save = async () => {
        setSaving(true);
        const withOrder = items.map((item, i) => ({ ...item, order: i }));
        try {
            const res = await fetch('/api/portfolio', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'nav_items', data: withOrder }) });
            setMessage(res.ok ? { type: 'success', text: 'Saved! Navbar updated.' } : { type: 'error', text: 'Failed.' });
        } catch { setMessage({ type: 'error', text: 'Network error.' }); }
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };

    if (loading) return <SkeletonSection rows={6} />;

    return (
        <div>
            <SectionHeader title="Navigation Menu" subtitle="Drag to reorder, toggle visibility, or add new nav links." />
            <div className="rounded-xl bg-zinc-900/50 p-4 ring-1 ring-white/5 mb-4 text-xs text-zinc-500">
                💡 Changes here instantly update the navbar on all public pages after saving.
            </div>
            <button onClick={addItem} className="flex items-center gap-2 mb-4 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-sm font-medium rounded-lg ring-1 ring-blue-500/30 cursor-pointer transition-all">
                <Plus size={15} /> Add Nav Item
            </button>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map((_, i) => `nav-${i}`)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {items.map((item, i) => <SortableNavItem key={`nav-${i}`} id={`nav-${i}`} item={item} index={i} onChange={onChange} onRemove={onRemove} onToggle={onToggle} />)}
                    </div>
                </SortableContext>
            </DndContext>
            <SaveBar saving={saving} message={message} onSave={save} />
        </div>
    );
}
