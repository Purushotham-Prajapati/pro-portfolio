"use client";
import { usePortfolioSection } from '../../../../hooks/usePortfolioSection';
import { SkeletonSection, SaveBar, SectionHeader, FieldGroup, Input } from '../../../../components/shared/AdminUI';
import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, GripVertical, RotateCcw, RotateCw, Upload, Scissors, ImageIcon, RefreshCw, CheckCircle2 } from 'lucide-react';
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

type MediaAsset = {
    fileId: string;
    name: string;
    url: string;
    thumbnailUrl?: string;
    size?: number;
    createdAt?: string;
};

function ProfileImageEditor({ form, setProfileImage }: { form: any; setProfileImage: (url: string, fileId?: string) => void }) {
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const sourceImageRef = useRef<HTMLImageElement | null>(null);
    const [sourceUrl, setSourceUrl] = useState('');
    const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
    const [mediaLoading, setMediaLoading] = useState(false);
    const [mediaError, setMediaError] = useState('');
    const [publishingFileId, setPublishingFileId] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1.08);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const imageMediaAssets = mediaAssets
        .filter((asset) => /\.(avif|gif|jpe?g|png|webp)$/i.test(asset.name || asset.url || ''))
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    const persistProfileImage = async (url: string, fileId?: string) => {
        if (!fileId) throw new Error('Selected image is missing its media file ID.');

        const saveRes = await fetch('/api/profile-image', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileId, url }),
        });

        if (!saveRes.ok) {
            const data = await saveRes.json().catch(() => null);
            throw new Error(data?.error || 'Could not publish the profile image.');
        }

        setProfileImage(url, fileId);
    };

    const fetchMediaAssets = async () => {
        setMediaLoading(true);
        setMediaError('');
        try {
            const res = await fetch('/api/media', { cache: 'no-store' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Could not load media library.');
            setMediaAssets(Array.isArray(data) ? data : []);
        } catch (error: any) {
            setMediaError(error.message || 'Could not load media library.');
        } finally {
            setMediaLoading(false);
        }
    };

    useEffect(() => {
        fetchMediaAssets();
    }, []);

    const drawImage = (canvas: HTMLCanvasElement, width: number, height: number) => {
        const image = sourceImageRef.current;
        const ctx = canvas.getContext('2d');
        if (!image || !ctx) return false;

        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#111114';
        ctx.fillRect(0, 0, width, height);

        const radians = (rotation * Math.PI) / 180;
        const rotated = Math.abs(rotation % 180) === 90;
        const baseW = rotated ? image.naturalHeight : image.naturalWidth;
        const baseH = rotated ? image.naturalWidth : image.naturalHeight;
        const baseScale = Math.max(width / baseW, height / baseH) * zoom;
        const drawW = image.naturalWidth * baseScale;
        const drawH = image.naturalHeight * baseScale;

        ctx.save();
        ctx.translate(width / 2 + (offsetX / 100) * width, height / 2 + (offsetY / 100) * height);
        ctx.rotate(radians);
        ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
        return true;
    };

    useEffect(() => {
        const canvas = previewCanvasRef.current;
        if (canvas) drawImage(canvas, 320, 390);
    }, [sourceUrl, zoom, offsetX, offsetY, rotation]);

    const loadFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setStatus({ type: 'error', text: 'Please choose an image file.' });
            return;
        }

        const url = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
            if (sourceUrl) URL.revokeObjectURL(sourceUrl);
            sourceImageRef.current = image;
            setSourceUrl(url);
            setZoom(1.08);
            setOffsetX(0);
            setOffsetY(0);
            setRotation(0);
            setStatus(null);
        };
        image.src = url;
    };

    const exportWebp = async () => {
        const canvas = document.createElement('canvas');
        if (!drawImage(canvas, 960, 1170)) throw new Error('Choose and crop an image first.');

        return new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Could not export WebP image.'));
            }, 'image/webp', 0.88);
        });
    };

    const uploadProfileImage = async () => {
        setUploading(true);
        setStatus(null);
        try {
            const blob = await exportWebp();
            const payload = new FormData();
            payload.append('file', new File([blob], 'profile-avatar.webp', { type: 'image/webp' }));

            const uploadRes = await fetch('/api/media', { method: 'POST', body: payload });
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.error || 'ImageKit upload failed.');

            await persistProfileImage(uploadData.file.url, uploadData.file.fileId);
            await fetchMediaAssets();

            setStatus({ type: 'success', text: 'Uploaded as WebP and published to the homepage.' });
        } catch (error: any) {
            setStatus({ type: 'error', text: error.message || 'Upload failed.' });
        } finally {
            setUploading(false);
        }
    };

    const publishMediaAsset = async (asset: MediaAsset) => {
        setPublishingFileId(asset.fileId);
        setStatus(null);
        try {
            await persistProfileImage(asset.url, asset.fileId);
            setSourceUrl('');
            sourceImageRef.current = null;
            setStatus({ type: 'success', text: `"${asset.name}" is now the homepage profile image.` });
        } catch (error: any) {
            setStatus({ type: 'error', text: error.message || 'Could not publish selected media.' });
        } finally {
            setPublishingFileId(null);
        }
    };

    return (
        <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                <div>
                    <h3 className="text-sm font-semibold text-zinc-300">Hero Profile Picture</h3>
                    <p className="mt-1 text-xs text-zinc-500">Upload a cropped WebP or publish an existing ImageKit media asset.</p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-amber-600/20 px-3 py-2 text-xs font-semibold text-amber-200 ring-1 ring-amber-500/30 hover:bg-amber-600/30">
                    <Upload size={14} /> Choose Image
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
                </label>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
                <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-[28px_72px_28px_28px] bg-zinc-950 ring-1 ring-white/10">
                        {sourceUrl ? (
                            <canvas ref={previewCanvasRef} className="block aspect-[0.82] w-full" />
                        ) : form.profile_image_url ? (
                            <img src={form.profile_image_url} alt="Current profile" className="block aspect-[0.82] w-full object-cover" />
                        ) : (
                            <div className="grid aspect-[0.82] place-items-center text-center text-xs text-zinc-600">
                                <div>
                                    <Scissors className="mx-auto mb-2" size={22} />
                                    Choose an image to start editing.
                                </div>
                            </div>
                        )}
                    </div>
                    {form.profile_image_url && <p className="truncate text-xs text-zinc-500">{form.profile_image_url}</p>}
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => setRotation((v) => v - 90)} disabled={!sourceUrl} className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200 ring-1 ring-white/10 disabled:opacity-40">
                            <RotateCcw size={15} /> Turn Left
                        </button>
                        <button type="button" onClick={() => setRotation((v) => v + 90)} disabled={!sourceUrl} className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200 ring-1 ring-white/10 disabled:opacity-40">
                            <RotateCw size={15} /> Turn Right
                        </button>
                    </div>

                    <FieldGroup label="Crop Zoom">
                        <input type="range" min="1" max="2.4" step="0.01" value={zoom} disabled={!sourceUrl} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-amber-500" />
                    </FieldGroup>
                    <FieldGroup label="Move Left / Right">
                        <input type="range" min="-40" max="40" step="1" value={offsetX} disabled={!sourceUrl} onChange={(e) => setOffsetX(Number(e.target.value))} className="w-full accent-amber-500" />
                    </FieldGroup>
                    <FieldGroup label="Move Up / Down">
                        <input type="range" min="-40" max="40" step="1" value={offsetY} disabled={!sourceUrl} onChange={(e) => setOffsetY(Number(e.target.value))} className="w-full accent-amber-500" />
                    </FieldGroup>

                    <button type="button" onClick={uploadProfileImage} disabled={!sourceUrl || uploading} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-500 disabled:opacity-50">
                        {uploading ? 'Uploading WebP...' : 'Upload WebP to ImageKit'}
                    </button>

                    {status && <p className={`text-sm ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{status.text}</p>}
                </div>
            </div>

            <div className="border-t border-white/5 pt-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">Use From Media Library</h4>
                        <p className="mt-1 text-xs text-zinc-600">Only image assets are shown. Selection publishes immediately.</p>
                    </div>
                    <button
                        type="button"
                        onClick={fetchMediaAssets}
                        disabled={mediaLoading}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-400 transition-all hover:bg-white/5 hover:text-white disabled:opacity-50"
                    >
                        <RefreshCw size={13} className={mediaLoading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>

                {mediaError && (
                    <div className="mb-4 rounded-lg border border-red-500/20 bg-red-950/30 px-3 py-2 text-sm text-red-300">
                        {mediaError}
                    </div>
                )}

                {mediaLoading ? (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="aspect-square animate-pulse rounded-xl bg-zinc-800/40 ring-1 ring-white/5" />
                        ))}
                    </div>
                ) : imageMediaAssets.length === 0 ? (
                    <div className="grid place-items-center rounded-xl border border-dashed border-white/10 bg-zinc-950/30 px-6 py-10 text-center">
                        <div>
                            <ImageIcon className="mx-auto mb-3 text-zinc-600" size={28} />
                            <p className="text-sm font-semibold text-zinc-400">No image assets available</p>
                            <p className="mt-1 text-xs text-zinc-600">Upload images in Media Manager or use the crop uploader above.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
                        {imageMediaAssets.map((asset) => {
                            const selected = form.profile_image_file_id === asset.fileId || form.profile_image_url === asset.url;
                            const publishing = publishingFileId === asset.fileId;

                            return (
                                <button
                                    type="button"
                                    key={asset.fileId}
                                    onClick={() => publishMediaAsset(asset)}
                                    disabled={!!publishingFileId}
                                    className={`group relative overflow-hidden rounded-xl bg-zinc-950 text-left ring-1 transition-all hover:-translate-y-0.5 hover:ring-amber-400/50 disabled:opacity-60 ${selected ? 'ring-emerald-400/70' : 'ring-white/10'}`}
                                >
                                    <img
                                        src={asset.thumbnailUrl || asset.url}
                                        alt={asset.name}
                                        loading="lazy"
                                        className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2">
                                        <p className="truncate text-[11px] font-semibold text-white">{asset.name}</p>
                                    </div>
                                    {(selected || publishing) && (
                                        <div className="absolute right-2 top-2 rounded-full bg-emerald-500 p-1 text-white shadow-lg">
                                            {publishing ? <RefreshCw size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
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
    const setProfileImage = (url: string, fileId?: string) => {
        setForm((prev: any) => ({
            ...prev,
            profile_image_url: url,
            profile_image_file_id: fileId || prev.profile_image_file_id,
        }));
    };

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
                <ProfileImageEditor form={form} setProfileImage={setProfileImage} />

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
