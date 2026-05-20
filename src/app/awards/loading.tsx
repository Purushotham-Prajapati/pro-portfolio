import { Skeleton } from "../../components/shared/Skeleton";

export default function AwardsLoading() {
    return (
        <div className="min-h-screen bg-[#09090B] pt-32 pb-20 px-6">
            <div className="max-w-[1200px] w-full mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <Skeleton className="h-4 w-32 mb-4 bg-zinc-800/80" />
                    <Skeleton className="h-12 sm:h-16 w-3/4 max-w-md mb-6 bg-zinc-800/80" />
                </div>
                
                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-xl bg-zinc-800/80" />
                    ))}
                </div>
            </div>
        </div>
    );
}
