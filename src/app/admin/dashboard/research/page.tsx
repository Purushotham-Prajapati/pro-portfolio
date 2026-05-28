"use client";
import { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SkeletonSection, SaveBar, SectionHeader, FieldGroup, Input } from '../../../../components/shared/AdminUI';
import ActivityAdminPanel from '../../../../components/shared/ActivityAdminPanel';
import { ActivityCategory } from '../../../../components/public/ActivityTabs';

function SortableProject({ id, project, index, onChange, onRemove }: any) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const [open, setOpen] = useState(false);
    return (
        <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
            className="rounded-xl bg-zinc-900/50 ring-1 ring-white/5 overflow-hidden">
            <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setOpen(!open)}>
                <button {...attributes} {...listeners} className="cursor-grab text-zinc-600 hover:text-zinc-400" onClick={e => e.stopPropagation()}><GripVertical size={16} /></button>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-500/15 text-red-400">{project.funding_agency}</span>
                <span className="font-semibold text-white text-sm flex-1 truncate">{project.title || 'Untitled Project'}</span>
                <span className="text-emerald-400 text-sm font-bold">₹{project.amount_lakhs}L</span>
                <button onClick={(e) => { e.stopPropagation(); onRemove(index); }} className="text-zinc-600 hover:text-red-400 cursor-pointer"><Trash2 size={14} /></button>
                {open ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
            </div>
            {open && (
                <div className="px-4 pb-4 border-t border-white/5 pt-4 grid grid-cols-2 gap-3">
                    <div className="col-span-2"><FieldGroup label="Project Title"><Input value={project.title} onChange={v => onChange(index, 'title', v)} /></FieldGroup></div>
                    <FieldGroup label="Role"><Input value={project.role} onChange={v => onChange(index, 'role', v)} /></FieldGroup>
                    <FieldGroup label="Funding Agency"><Input value={project.funding_agency} onChange={v => onChange(index, 'funding_agency', v)} /></FieldGroup>
                    <FieldGroup label="Amount (Lakhs)"><Input type="number" value={project.amount_lakhs} onChange={v => onChange(index, 'amount_lakhs', Number(v))} /></FieldGroup>
                    <FieldGroup label="Year"><Input type="number" value={project.year} onChange={v => onChange(index, 'year', Number(v))} /></FieldGroup>
                </div>
            )}
        </div>
    );
}

export default function ResearchEditor() {
    const [projects, setProjects] = useState<any[]>([]);
    const [pubs, setPubs] = useState<any>({});
    const [activities, setActivities] = useState<ActivityCategory[]>([]);
    const [introBadge, setIntroBadge] = useState('RESEARCH & PUBLICATIONS');
    const [introLine1, setIntroLine1] = useState('A Decade of');
    const [introLine2, setIntroLine2] = useState('Measurable Impact');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<any>(null);
    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        fetch('/api/portfolio')
            .then(r => r.json())
            .then(d => {
                setProjects(d.major_research_projects || []);
                setPubs(d.publications || {});
                setActivities(d.activities || []);
                if (d.research_intro) {
                    setIntroBadge(d.research_intro.badge || 'RESEARCH & PUBLICATIONS');
                    setIntroLine1(d.research_intro.title_line_1 || '');
                    setIntroLine2(d.research_intro.title_line_2 || '');
                }
                setLoading(false);
            });
    }, []);

    const onChange = (i: number, key: string, val: any) => setProjects(p => { const n = [...p]; n[i] = { ...n[i], [key]: val }; return n; });
    const onRemove = (i: number) => setProjects(p => p.filter((_, idx) => idx !== i));
    const addProject = () => setProjects(p => [...p, { title: '', role: 'Principal Investigator', funding_agency: '', amount_lakhs: 0, year: new Date().getFullYear() }]);

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (over && active.id !== over.id) {
            const oi = projects.findIndex((_, i) => `proj-${i}` === active.id);
            const ni = projects.findIndex((_, i) => `proj-${i}` === over.id);
            setProjects(arrayMove(projects, oi, ni));
        }
    };

    const save = async () => {
        setSaving(true);
        try {
            await fetch('/api/portfolio', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'major_research_projects', data: projects }) });
            await fetch('/api/portfolio', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'publications', data: pubs }) });
            await fetch('/api/portfolio', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'activities', data: activities }) });
            await fetch('/api/portfolio', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section: 'research_intro',
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
            <SectionHeader title="Research & Projects" subtitle="Edit research intro header, funded projects, and publication metrics." />

            {/* Header Configuration */}
            <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-4 mb-6">
                <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2">Page Header Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FieldGroup label="Section Badge">
                        <Input value={introBadge} onChange={setIntroBadge} placeholder="e.g. RESEARCH & PUBLICATIONS" />
                    </FieldGroup>
                    <FieldGroup label="Headline Line 1 (Regular)">
                        <Input value={introLine1} onChange={setIntroLine1} placeholder="e.g. A Decade of" />
                    </FieldGroup>
                    <FieldGroup label="Headline Line 2 (Gradient Highlight)">
                        <Input value={introLine2} onChange={setIntroLine2} placeholder="e.g. Measurable Impact" />
                    </FieldGroup>
                </div>
            </div>

            {/* Publication stats */}
            <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 mb-6">
                <h3 className="text-sm font-semibold text-zinc-300 border-b border-white/5 pb-2 mb-4">Publication Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                    <FieldGroup label="Total Papers"><Input type="number" value={pubs.total_papers || 0} onChange={v => setPubs((p: any) => ({ ...p, total_papers: Number(v) }))} /></FieldGroup>
                    <FieldGroup label="Patents"><Input type="number" value={pubs.patents || 0} onChange={v => setPubs((p: any) => ({ ...p, patents: Number(v) }))} /></FieldGroup>
                    <FieldGroup label="Books Authored"><Input type="number" value={pubs.books_authored || 0} onChange={v => setPubs((p: any) => ({ ...p, books_authored: Number(v) }))} /></FieldGroup>
                    <FieldGroup label="Copyrights"><Input type="number" value={pubs.copyrights || 0} onChange={v => setPubs((p: any) => ({ ...p, copyrights: Number(v) }))} /></FieldGroup>
                </div>
            </div>

            {/* Projects */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-300">Funded Projects</h3>
                <button onClick={addProject} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-200 rounded-lg ring-1 ring-amber-500/30 cursor-pointer"><Plus size={13} /> Add Project</button>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={projects.map((_, i) => `proj-${i}`)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                        {projects.map((p, i) => <SortableProject key={`proj-${i}`} id={`proj-${i}`} project={p} index={i} onChange={onChange} onRemove={onRemove} />)}
                    </div>
                </SortableContext>
            </DndContext>
            <div className="mt-6">
                <ActivityAdminPanel activities={activities} onChange={setActivities} />
            </div>
            <SaveBar saving={saving} message={message} onSave={save} />
        </div>
    );
}
