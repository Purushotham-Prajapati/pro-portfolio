"use client";
import { useState, useEffect, useRef } from 'react';
import { SectionHeader, SkeletonLine } from '../../../../components/shared/AdminUI';
import { Upload, Trash2, Copy, Check, FileImage, AlertCircle, RefreshCw } from 'lucide-react';

interface MediaFile {
    fileId: string;
    name: string;
    url: string;
    thumbnailUrl: string;
    size: number;
}

export default function MediaManagerPage() {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch files from API
    const fetchFiles = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/media');
            if (!res.ok) {
                throw new Error(await res.text() || 'Failed to fetch media assets');
            }
            const data = await res.json();
            setFiles(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error('Error loading media library:', err);
            setError(err.message || 'Error loading media files.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    // Format bytes to KB/MB
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Handle Copy to Clipboard
    const copyToClipboard = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Handle File upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        const file = selectedFiles[0];
        if (file.size > 5 * 1024 * 1024) {
            setError('File exceeds the 5MB size limit.');
            return;
        }

        setUploading(true);
        setUploadProgress(15);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploadProgress(45);
            const res = await fetch('/api/media', {
                method: 'POST',
                body: formData,
            });

            setUploadProgress(85);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to upload file');
            }

            setUploadProgress(100);
            setTimeout(() => {
                setUploading(false);
                setUploadProgress(0);
                fetchFiles();
            }, 600);
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.message || 'File upload failed. Please try again.');
            setUploading(false);
            setUploadProgress(0);
        }
    };

    // Handle file deletion
    const handleDelete = async (fileId: string) => {
        if (deletingId) return;
        setDeletingId(fileId);
        setError(null);
        try {
            const res = await fetch(`/api/media?fileId=${fileId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete asset');
            }

            setFiles(prev => prev.filter(f => f.fileId !== fileId));
        } catch (err: any) {
            console.error('Delete failed:', err);
            setError(err.message || 'Failed to delete media asset.');
        } finally {
            setDeletingId(null);
        }
    };

    const triggerSelectFile = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <SectionHeader 
                    title="Media Manager" 
                    subtitle="Upload, preview, copy CDN links, and manage your portfolio's assets on ImageKit." 
                />
                <button 
                    onClick={fetchFiles}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-50 transition-all cursor-pointer"
                >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Error Message banner */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-sm rounded-lg">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {/* Upload Zone */}
            <div 
                onClick={triggerSelectFile}
                className="group relative flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-blue-500/50 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all duration-300 p-8 rounded-xl cursor-pointer text-center"
            >
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,application/pdf"
                    className="hidden" 
                />

                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-zinc-800/80 group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-all duration-300 mb-4 text-zinc-400">
                    <Upload size={22} className="group-hover:scale-110 transition-transform duration-300" />
                </div>

                <h3 className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors duration-200">
                    Click to upload media file
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                    Supports PNG, JPG, JPEG, WEBP, GIF, and PDF (Max 5MB)
                </p>

                {/* Progress bar overlay */}
                {uploading && (
                    <div className="absolute inset-0 bg-[#0A0A0B]/90 rounded-xl flex flex-col items-center justify-center p-6 transition-all duration-300">
                        <div className="w-64 space-y-2">
                            <div className="flex justify-between text-xs font-semibold text-zinc-300">
                                <span>Uploading file to ImageKit...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                                <div 
                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Media Grid */}
            <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
                    Media Assets ({files.length})
                </h3>

                {loading ? (
                    // Skeleton Grid Loader (Zero Layout Shifts)
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {Array(8).fill(0).map((_, idx) => (
                            <div 
                                key={idx} 
                                className="rounded-xl bg-zinc-900/50 aspect-square border border-white/5 p-3 flex flex-col justify-between animate-pulse"
                            >
                                <div className="w-full h-32 bg-zinc-800/60 rounded-lg" />
                                <div className="space-y-1.5 mt-3">
                                    <SkeletonLine h="h-4" w="w-3/4" />
                                    <SkeletonLine h="h-3" w="w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : files.length === 0 ? (
                    // Empty state
                    <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/10 border border-white/5 rounded-xl text-center">
                        <FileImage size={38} className="text-zinc-600 mb-3" />
                        <h4 className="text-sm font-semibold text-zinc-400">Your media library is empty</h4>
                        <p className="mt-1 text-xs text-zinc-500 max-w-sm">
                            Upload images or files here, then copy their CDN URLs for use in your portfolio bio, awards, or settings.
                        </p>
                    </div>
                ) : (
                    // Beautiful Responsive Asset Grid
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {files.map((file) => {
                            const isCopied = copiedId === file.fileId;
                            const isDeleting = deletingId === file.fileId;

                            return (
                                <div 
                                    key={file.fileId} 
                                    className="group relative flex flex-col justify-between bg-zinc-900/30 border border-white/5 hover:border-white/10 rounded-xl p-3 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    {/* Thumbnail container */}
                                    <div className="relative aspect-square w-full rounded-lg bg-zinc-950 overflow-hidden flex items-center justify-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            src={file.thumbnailUrl || file.url} 
                                            alt={file.name} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />

                                        {/* Hover actions overlay */}
                                        <div className="absolute inset-0 bg-[#0A0A0B]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                            <button 
                                                onClick={() => copyToClipboard(file.url, file.fileId)}
                                                title="Copy Full CDN URL"
                                                className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-700 active:scale-90 transition-all cursor-pointer"
                                            >
                                                {isCopied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
                                                        handleDelete(file.fileId);
                                                    }
                                                }}
                                                title="Delete file"
                                                disabled={isDeleting}
                                                className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-800 border border-white/10 text-zinc-400 hover:text-red-400 hover:bg-red-950/20 hover:border-red-500/20 active:scale-90 transition-all cursor-pointer"
                                            >
                                                <Trash2 size={15} className={isDeleting ? 'animate-pulse' : ''} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Asset details info */}
                                    <div className="mt-3 space-y-1">
                                        <p 
                                            title={file.name}
                                            className="text-xs font-medium text-zinc-300 truncate w-full"
                                        >
                                            {file.name}
                                        </p>
                                        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">
                                            <span>IMAGEKIT</span>
                                            <span>{formatBytes(file.size)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
