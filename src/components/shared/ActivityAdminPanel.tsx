"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react";
import { ActivityCategory } from "../public/ActivityTabs";
import { FieldGroup, Input } from "./AdminUI";

type ActivityForm = {
    activities: ActivityCategory[];
};

const defaultActivities: ActivityCategory[] = [
    { key: "publications", label: "Publications", description: "Journals, conferences, and books.", visible: true, order: 0, records: [] },
    { key: "certifications", label: "Continuing Education & Certifications", description: "Courses and certifications.", visible: true, order: 1, records: [] },
    { key: "eContent", label: "E-Content Developed", description: "Digital learning resources.", visible: true, order: 2, records: [] },
    { key: "events", label: "Events Organised", description: "Workshops, webinars, and conferences.", visible: true, order: 3, records: [] },
    { key: "guestTalks", label: "Guest Talks", description: "Invited talks and panels.", visible: true, order: 4, records: [] },
];

function SortableCategory({
    id,
    children,
}: {
    id: string;
    children: (dragHandle: React.ReactNode) => React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    return (
        <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}>
            {children(
                <button type="button" {...attributes} {...listeners} className="cursor-grab text-zinc-500 hover:text-amber-300">
                    <GripVertical size={16} />
                </button>,
            )}
        </div>
    );
}

export default function ActivityAdminPanel({
    activities,
    onChange,
}: {
    activities: ActivityCategory[];
    onChange: (activities: ActivityCategory[]) => void;
}) {
    const sensors = useSensors(useSensor(PointerSensor));
    const { control, register, watch, setValue } = useForm<ActivityForm>({
        defaultValues: { activities: activities.length ? activities : defaultActivities },
    });
    const { fields, move, append, remove } = useFieldArray({ control, name: "activities" });
    const values = watch("activities");

    useEffect(() => {
        onChange(values.map((activity, index) => ({ ...activity, order: index })));
    }, [onChange, values]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over.id);
        move(oldIndex, newIndex);
    };

    const addRecord = (categoryIndex: number) => {
        const records = values[categoryIndex]?.records || [];
        setValue(`activities.${categoryIndex}.records`, [
            ...records,
            { title: "", description: "", date: "", venue: "", organization: "", link: "", type: "" },
        ]);
    };

    const removeRecord = (categoryIndex: number, recordIndex: number) => {
        const records = values[categoryIndex]?.records || [];
        setValue(
            `activities.${categoryIndex}.records`,
            records.filter((_, index) => index !== recordIndex),
        );
    };

    return (
        <section className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                    <h3 className="text-sm font-semibold text-zinc-200">Dynamic Activities Tabs</h3>
                    <p className="mt-1 text-xs text-zinc-500">Toggle, reorder, and edit academic activity records.</p>
                </div>
                <button
                    type="button"
                    onClick={() => append({ key: "events", label: "Custom Activity", description: "", visible: true, order: fields.length, records: [] })}
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-200 ring-1 ring-amber-400/25"
                >
                    <Plus size={13} /> Add Category
                </button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                        {fields.map((field, categoryIndex) => (
                            <SortableCategory key={field.id} id={field.id}>
                                {(dragHandle) => (
                                    <div className="rounded-xl bg-zinc-950/45 p-4 ring-1 ring-white/10">
                                        <div className="mb-4 flex items-center gap-3">
                                            {dragHandle}
                                            <button
                                                type="button"
                                                onClick={() => setValue(`activities.${categoryIndex}.visible`, !values[categoryIndex]?.visible)}
                                                className="text-zinc-400 hover:text-emerald-300"
                                                aria-label="Toggle category visibility"
                                            >
                                                {values[categoryIndex]?.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                                            </button>
                                            <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-2">
                                                <FieldGroup label="Tab Label">
                                                    <input type="hidden" {...register(`activities.${categoryIndex}.key`)} />
                                                    <input type="hidden" {...register(`activities.${categoryIndex}.order`, { valueAsNumber: true })} />
                                                    <input type="hidden" {...register(`activities.${categoryIndex}.visible`)} />
                                                    <Input value={values[categoryIndex]?.label || ""} onChange={(value) => setValue(`activities.${categoryIndex}.label`, value)} />
                                                </FieldGroup>
                                                <FieldGroup label="Description">
                                                    <Input value={values[categoryIndex]?.description || ""} onChange={(value) => setValue(`activities.${categoryIndex}.description`, value)} />
                                                </FieldGroup>
                                            </div>
                                            <button type="button" onClick={() => remove(categoryIndex)} className="text-zinc-500 hover:text-red-400">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {(values[categoryIndex]?.records || []).map((record, recordIndex) => (
                                                <div key={recordIndex} className="grid grid-cols-1 gap-3 rounded-lg bg-zinc-900/70 p-3 ring-1 ring-white/5 md:grid-cols-2">
                                                    <FieldGroup label="Title">
                                                        <Input value={record.title || ""} onChange={(value) => setValue(`activities.${categoryIndex}.records.${recordIndex}.title`, value)} />
                                                    </FieldGroup>
                                                    <FieldGroup label="Type / Date">
                                                        <Input value={record.type || record.date || ""} onChange={(value) => setValue(`activities.${categoryIndex}.records.${recordIndex}.type`, value)} />
                                                    </FieldGroup>
                                                    <FieldGroup label="Organization">
                                                        <Input value={record.organization || ""} onChange={(value) => setValue(`activities.${categoryIndex}.records.${recordIndex}.organization`, value)} />
                                                    </FieldGroup>
                                                    <FieldGroup label="Venue">
                                                        <Input value={record.venue || ""} onChange={(value) => setValue(`activities.${categoryIndex}.records.${recordIndex}.venue`, value)} />
                                                    </FieldGroup>
                                                    <div className="md:col-span-2">
                                                        <FieldGroup label="Description">
                                                            <Input value={record.description || ""} onChange={(value) => setValue(`activities.${categoryIndex}.records.${recordIndex}.description`, value)} />
                                                        </FieldGroup>
                                                    </div>
                                                    <div className="md:col-span-2 flex justify-end">
                                                        <button type="button" onClick={() => removeRecord(categoryIndex, recordIndex)} className="text-xs font-semibold text-red-300 hover:text-red-200">
                                                            Remove record
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <button type="button" onClick={() => addRecord(categoryIndex)} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-300">
                                            <Plus size={13} /> Add Record
                                        </button>
                                    </div>
                                )}
                            </SortableCategory>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </section>
    );
}
