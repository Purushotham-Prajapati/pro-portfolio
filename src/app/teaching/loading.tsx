import { Skeleton } from "../../components/shared/Skeleton";

export default function TeachingLoading() {
    return (
        <div className="min-h-screen bg-[#09090B] pt-32 pb-20 px-6">
            <div className="max-w-[1200px] w-full mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <Skeleton className="h-4 w-32 mb-4 bg-zinc-800/80" />
                    <Skeleton className="h-12 sm:h-16 w-2/3 max-w-md mb-6 bg-zinc-800/80" />
                </div>
                
                {/* 2 Cols */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-48 mb-6 bg-zinc-800/80" />
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-16 w-full rounded-lg bg-zinc-800/80" />
                        ))}
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-48 mb-6 bg-zinc-800/80" />
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-16 w-full rounded-lg bg-zinc-800/80" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
