import { Skeleton } from "../../components/shared/Skeleton";

export default function ResearchLoading() {
    return (
        <div className="min-h-screen bg-[#09090B] pt-32 pb-20 px-6">
            <div className="max-w-[1200px] w-full mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Skeleton className="h-4 w-40 mb-4 bg-zinc-800/80" />
                    <Skeleton className="h-12 sm:h-16 w-2/3 max-w-lg mb-6 bg-zinc-800/80" />
                    <Skeleton className="h-6 w-full max-w-2xl bg-zinc-800/80" />
                </div>
                
                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <Skeleton className="h-10 w-32 rounded-full bg-zinc-800/80" />
                    <Skeleton className="h-10 w-32 rounded-full bg-zinc-800/80" />
                    <Skeleton className="h-10 w-32 rounded-full bg-zinc-800/80" />
                </div>

                {/* List */}
                <div className="space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl bg-zinc-800/80" />
                    ))}
                </div>
            </div>
        </div>
    );
}
