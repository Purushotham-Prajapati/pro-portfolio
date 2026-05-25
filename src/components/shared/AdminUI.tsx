export function SkeletonLine({ w = 'w-full', h = 'h-4' }: { w?: string; h?: string }) {
    return <div className={`${h} ${w} bg-zinc-800/60 rounded animate-pulse`} />;
}

export function SkeletonCard() {
    return (
        <div className="rounded-xl bg-zinc-900/50 p-5 ring-1 ring-white/5 space-y-3 animate-pulse">
            <SkeletonLine h="h-5" w="w-1/3" />
            <SkeletonLine h="h-4" w="w-2/3" />
            <SkeletonLine h="h-4" w="w-1/2" />
        </div>
    );
}

export function SkeletonSection({ rows = 4 }: { rows?: number }) {
    return (
        <div className="space-y-4">
            <SkeletonLine h="h-8" w="w-48" />
            <SkeletonLine h="h-4" w="w-72" />
            <div className="mt-6 space-y-3">
                {Array(rows).fill(0).map((_, i) => <SkeletonLine key={i} h="h-12" />)}
            </div>
        </div>
    );
}

export function SaveBar({ saving, message, onSave }: {
    saving: boolean;
    message: { type: 'success' | 'error'; text: string } | null;
    onSave: () => void;
}) {
    return (
        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
            <button
                onClick={onSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 rounded-lg text-sm font-semibold text-white transition-all cursor-pointer"
            >
                {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {message && (
                <span className={`text-sm font-medium ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {message.text}
                </span>
            )}
        </div>
    );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
        </div>
    );
}

export function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</label>
            {children}
        </div>
    );
}

export function Input({ value, onChange, placeholder, type = 'text' }: {
    value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border-0 bg-zinc-800/50 py-2.5 px-3 text-white text-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-zinc-600"
        />
    );
}
