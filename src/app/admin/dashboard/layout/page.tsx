"use client";

import { useEffect, useState } from "react";
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react";
import { FieldGroup, Input, SaveBar, SectionHeader, SkeletonSection } from "../../../../components/shared/AdminUI";

type LayoutBlock = {
    key: string;
    label: string;
    page: string;
    visible: boolean;
    order: number;
    themeClass: string;
};

const defaultLayout: LayoutBlock[] = [
    { key: "home.hero", label: "Home Hero", page: "home", visible: true, order: 0, themeClass: "page-theme-home" },
    { key: "home.about", label: "About Preview", page: "home", visible: true, order: 1, themeClass: "page-theme-home" },
    { key: "research.metrics", label: "Research Metrics", page: "research", visible: true, order: 0, themeClass: "page-theme-research" },
    { key: "research.projects", label: "Funded Projects", page: "research", visible: true, order: 1, themeClass: "page-theme-research" },
    { key: "teaching.core", label: "Teaching Core Content", page: "teaching", visible: true, order: 0, themeClass: "page-theme-teaching" },
];

function SortableLayoutBlock({ block, onChange, onRemove }: {
    block: LayoutBlock;
    onChange: (block: LayoutBlock) => void;
    onRemove: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.key });
    return (
        <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className="rounded-xl bg-zinc-900/60 p-4 ring-1 ring-white/10">
            <div className="mb-4 flex items-center gap-3">
                <button type="button" {...attributes} {...listeners} className="cursor-grab text-zinc-500 hover:text-amber-300">
                    <GripVertical size={16} />
                </button>
                <button type="button" onClick={() => onChange({ ...block, visible: !block.visible })} className="text-zinc-400 hover:text-emerald-300">
                    {block.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <span className="rounded bg-zinc-800 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">{block.page}</span>
                <button type="button" onClick={onRemove} className="ml-auto text-zinc-500 hover:text-red-400">
                    <Trash2 size={16} />
                </button>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <FieldGroup label="Block Key">
                    <Input value={block.key} onChange={(key) => onChange({ ...block, key })} />
                </FieldGroup>
                <FieldGroup label="Label">
                    <Input value={block.label} onChange={(label) => onChange({ ...block, label })} />
                </FieldGroup>
                <FieldGroup label="Page">
                    <Input value={block.page} onChange={(page) => onChange({ ...block, page })} />
                </FieldGroup>
                <FieldGroup label="Theme Class">
                    <Input value={block.themeClass} onChange={(themeClass) => onChange({ ...block, themeClass })} />
                </FieldGroup>
            </div>
        </div>
    );
}

export default function LayoutEditorPage() {
    const [blocks, setBlocks] = useState<LayoutBlock[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        fetch("/api/portfolio")
            .then((response) => response.json())
            .then((data) => setBlocks((data.layout_config || defaultLayout).sort((a: LayoutBlock, b: LayoutBlock) => a.order - b.order)))
            .finally(() => setLoading(false));
    }, []);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = blocks.findIndex((block) => block.key === active.id);
        const newIndex = blocks.findIndex((block) => block.key === over.id);
        setBlocks(arrayMove(blocks, oldIndex, newIndex).map((block, order) => ({ ...block, order })));
    };

    const save = async () => {
        setSaving(true);
        const payload = blocks.map((block, order) => ({ ...block, order }));
        const response = await fetch("/api/portfolio", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ section: "layout_config", data: payload }),
        });
        setMessage(response.ok ? { type: "success", text: "Layout saved." } : { type: "error", text: "Save failed." });
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };

    if (loading) return <SkeletonSection rows={6} />;

    return (
        <div>
            <SectionHeader title="Layout Controller" subtitle="Toggle, reorder, and theme page-level blocks." />
            <div className="mb-4 flex justify-end">
                <button
                    type="button"
                    onClick={() => setBlocks((items) => [...items, { key: `custom.${Date.now()}`, label: "Custom Block", page: "research", visible: true, order: items.length, themeClass: "page-theme-research" }])}
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-200 ring-1 ring-amber-400/25"
                >
                    <Plus size={13} /> Add Block
                </button>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={blocks.map((block) => block.key)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                        {blocks.map((block, index) => (
                            <SortableLayoutBlock
                                key={block.key}
                                block={block}
                                onChange={(nextBlock) => setBlocks((items) => items.map((item, itemIndex) => itemIndex === index ? nextBlock : item))}
                                onRemove={() => setBlocks((items) => items.filter((_, itemIndex) => itemIndex !== index))}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            <SaveBar saving={saving} message={message} onSave={save} />
        </div>
    );
}
