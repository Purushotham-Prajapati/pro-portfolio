"use client";
import { useState, useEffect } from 'react';
import { usePortfolioSection } from '../../../../hooks/usePortfolioSection';
import { SectionHeader, SkeletonSection, FieldGroup, Input, SaveBar } from '../../../../components/shared/AdminUI';
import { Shield, Globe, ImageIcon, X, AlertCircle } from 'lucide-react';


interface MediaFile {
    fileId: string;
    name: string;
    url: string;
    thumbnailUrl: string;
    size: number;
}

export default function SettingsPage() {
    // Portfolio SEO Meta hook
    const { data: rawMeta, loading: metaLoading, saving: metaSaving, save: saveMeta, message: metaMessage } = usePortfolioSection<any>('site_meta');
    const [metaForm, setMetaForm] = useState<any>(null);

    // Tab state
    const [activeTab, setActiveTab] = useState<'seo' | 'security'>('seo');

    // Security/Credentials form states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [securitySaving, setSecuritySaving] = useState(false);
    const [securityMessage, setSecurityMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Media picker modal states
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [mediaLoading, setMediaLoading] = useState(false);
    const [mediaError, setMediaError] = useState<string | null>(null);

    useEffect(() => {
        if (rawMeta) {
            setMetaForm(rawMeta);
        }
    }, [rawMeta]);

    // Fetch media library files for the picker
    const fetchMediaForPicker = async () => {
        setMediaLoading(true);
        setMediaError(null);
        try {
            const res = await fetch('/api/media');
            if (!res.ok) throw new Error('Failed to load media');
            const data = await res.json();
            setMediaFiles(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error('Error fetching media for picker:', err);
            setMediaError(err.message || 'Could not load media assets');
        } finally {
            setMediaLoading(false);
        }
    };

    const openMediaPicker = () => {
        setShowMediaPicker(true);
        fetchMediaForPicker();
    };

    const selectImageFromPicker = (url: string) => {
        setMetaForm((prev: any) => ({
            ...prev,
            profile_image_url: url,
        }));
        setShowMediaPicker(false);
    };

    // Update metadata field
    const setMetaField = (key: string, value: string) => {
        setMetaForm((prev: any) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Handle security credentials form submission
    const handleSecuritySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSecurityMessage(null);

        if (!currentPassword || !newPassword) {
            setSecurityMessage({ type: 'error', text: 'All fields are required' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setSecurityMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (newPassword.length < 6) {
            setSecurityMessage({ type: 'error', text: 'New password must be at least 6 characters' });
            return;
        }

        setSecuritySaving(true);
        try {
            const res = await fetch('/api/auth/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    newUsername: newUsername.trim() !== '' ? newUsername : undefined,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to update credentials');
            }

            setSecurityMessage({ type: 'success', text: 'Credentials updated successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setNewUsername('');
        } catch (err: any) {
            setSecurityMessage({ type: 'error', text: err.message || 'An error occurred' });
        } finally {
            setSecuritySaving(false);
        }
    };

    if (metaLoading || !metaForm) {
        return <SkeletonSection rows={5} />;
    }

    return (
        <div className="space-y-6">
            <SectionHeader 
                title="Global Settings" 
                subtitle="Configure SEO metadata, search engine metrics, website details, and update administrator credentials." 
            />

            {/* Premium Tab Navigation */}
            <div className="flex gap-1.5 p-1 bg-zinc-950/60 border border-white/5 rounded-xl max-w-sm">
                <button
                    onClick={() => setActiveTab('seo')}
                    className={`flex items-center justify-center gap-2 flex-1 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        activeTab === 'seo'
                            ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/5'
                            : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                >
                    <Globe size={14} />
                    SEO & Site Metadata
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center justify-center gap-2 flex-1 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        activeTab === 'security'
                            ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/5'
                            : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                >
                    <Shield size={14} />
                    Security Settings
                </button>
            </div>

            {/* TAB CONTENT: SEO & Site Metadata */}
            {activeTab === 'seo' && (
                <div className="space-y-6">
                    <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-5">
                        <div className="border-b border-white/5 pb-3">
                            <h3 className="text-sm font-semibold text-zinc-200">SEO & Identity Configuration</h3>
                            <p className="text-xs text-zinc-500 mt-0.5">Define metadata indexable by search engines (Google, Bing).</p>
                        </div>

                        <FieldGroup label="Site Title / Meta Title">
                            <Input 
                                value={metaForm.site_title || ''} 
                                onChange={(v: string) => setMetaField('site_title', v)} 
                                placeholder="E.g. Dr. M. Madhu Bala | Professor of Computer Science"
                            />
                        </FieldGroup>

                        <FieldGroup label="SEO Meta Description">
                            <textarea
                                value={metaForm.site_description || ''}
                                onChange={e => setMetaField('site_description', e.target.value)}
                                placeholder="A rich summary of your site indexable by search crawlers..."
                                rows={3}
                                className="w-full rounded-lg border-0 bg-zinc-800/50 py-2.5 px-3 text-white text-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-600"
                            />
                        </FieldGroup>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FieldGroup label="Copyright Notice">
                                <Input 
                                    value={metaForm.copyright || ''} 
                                    onChange={(v: string) => setMetaField('copyright', v)} 
                                    placeholder="© 2026 Dr. M. Madhu Bala"
                                />
                            </FieldGroup>

                            <FieldGroup label="SEO Keywords (comma separated)">
                                <Input 
                                    value={metaForm.keywords || ''} 
                                    onChange={(v: string) => setMetaField('keywords', v)} 
                                    placeholder="keywords, research, professor, computer science"
                                />
                            </FieldGroup>
                        </div>

                        {/* Profile Image Select */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                Global Profile Image (URL or Library)
                            </label>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Input 
                                        value={metaForm.profile_image_url || ''} 
                                        onChange={(v: string) => setMetaField('profile_image_url', v)} 
                                        placeholder="https://ik.imagekit.io/..."
                                    />
                                </div>
                                <button
                                    onClick={openMediaPicker}
                                    className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-sm font-semibold border border-white/5 transition-all cursor-pointer"
                                >
                                    <ImageIcon size={15} />
                                    Choose Asset
                                </button>
                            </div>
                            {metaForm.profile_image_url && (
                                <div className="mt-2 flex items-center gap-3 p-2 bg-zinc-950/40 border border-white/5 rounded-lg w-fit">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        src={metaForm.profile_image_url} 
                                        alt="Preview" 
                                        className="w-10 h-10 object-cover rounded-md border border-white/10"
                                    />
                                    <div>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase">Image Preview</p>
                                        <p className="text-xs text-zinc-400 truncate max-w-xs">{metaForm.profile_image_url}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <SaveBar 
                        saving={metaSaving} 
                        message={metaMessage} 
                        onSave={() => saveMeta(metaForm)} 
                    />
                </div>
            )}

            {/* TAB CONTENT: Security Settings */}
            {activeTab === 'security' && (
                <form onSubmit={handleSecuritySubmit} className="space-y-6">
                    <div className="rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5 space-y-5">
                        <div className="border-b border-white/5 pb-3">
                            <h3 className="text-sm font-semibold text-zinc-200">Administrator Credentials</h3>
                            <p className="text-xs text-zinc-500 mt-0.5">Securely hash and modify your system dashboard login credentials.</p>
                        </div>

                        {securityMessage && (
                            <div className={`flex items-center gap-2 p-3 text-sm rounded-lg border ${
                                securityMessage.type === 'success'
                                    ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400'
                                    : 'bg-red-950/40 border-red-500/20 text-red-400'
                            }`}>
                                <AlertCircle size={16} />
                                <span>{securityMessage.text}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <FieldGroup label="Change Username (leave blank to keep current)">
                                <Input
                                    value={newUsername}
                                    onChange={setNewUsername}
                                    placeholder="Enter new admin username (optional)"
                                />
                            </FieldGroup>

                            <div className="border-t border-white/5 my-4 pt-4" />

                            <FieldGroup label="Current Secure Password">
                                <Input
                                    type="password"
                                    value={currentPassword}
                                    onChange={setCurrentPassword}
                                    placeholder="••••••••••••"
                                />
                            </FieldGroup>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FieldGroup label="New Security Password">
                                    <Input
                                        type="password"
                                        value={newPassword}
                                        onChange={setNewPassword}
                                        placeholder="••••••••••••"
                                    />
                                </FieldGroup>

                                <FieldGroup label="Confirm New Password">
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={setConfirmPassword}
                                        placeholder="••••••••••••"
                                    />
                                </FieldGroup>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
                        <button
                            type="submit"
                            disabled={securitySaving}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg text-sm font-semibold text-white transition-all cursor-pointer"
                        >
                            {securitySaving ? '⏳ Updating...' : '💾 Update Security Credentials'}
                        </button>
                    </div>
                </form>
            )}

            {/* PORTFOLIO-WIDE MODAL IMAGE PICKER */}
            {showMediaPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm transition-opacity duration-300">
                    <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-[#111114] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-zinc-950/40">
                            <div>
                                <h3 className="text-sm font-semibold text-white">Select Asset from Media Library</h3>
                                <p className="text-xs text-zinc-500 mt-0.5">Click any asset thumbnail to choose and automatically populate the url field.</p>
                            </div>
                            <button 
                                onClick={() => setShowMediaPicker(false)}
                                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal Library Grid Body */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {mediaError && (
                                <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-sm rounded-lg mb-4">
                                    <AlertCircle size={16} />
                                    <span>{mediaError}</span>
                                </div>
                            )}

                            {mediaLoading ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {Array(10).fill(0).map((_, i) => (
                                        <div key={i} className="aspect-square bg-zinc-900/50 rounded-xl border border-white/5 animate-pulse" />
                                    ))}
                                </div>
                            ) : mediaFiles.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-12 text-center">
                                    <ImageIcon size={32} className="text-zinc-700 mb-2" />
                                    <p className="text-sm font-medium text-zinc-400">No media files found</p>
                                    <p className="text-xs text-zinc-600 mt-1 max-w-sm">Please navigate to the Media dashboard page and upload assets to list them here.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {mediaFiles.map((file) => (
                                        <div
                                            key={file.fileId}
                                            onClick={() => selectImageFromPicker(file.url)}
                                            className="group relative aspect-square bg-zinc-950 rounded-xl overflow-hidden border border-white/5 hover:border-blue-500/50 cursor-pointer shadow-md hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={file.thumbnailUrl || file.url}
                                                alt={file.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider">
                                                    Select
                                                </span>
                                            </div>
                                            <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1.5 text-[9px] text-zinc-300 truncate">
                                                {file.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-3 border-t border-white/5 bg-zinc-950/20 text-right">
                            <button
                                onClick={() => setShowMediaPicker(false)}
                                className="px-4 py-2 border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
