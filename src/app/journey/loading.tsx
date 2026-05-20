import { Skeleton } from "../../components/shared/Skeleton";

export default function JourneyLoading() {
    return (
        <div className="min-h-screen bg-[#09090B] pt-32 pb-20 px-6">
            <div className="max-w-[1200px] w-full mx-auto">
                {/* Header Skeleton */}
                <div className="mb-16">
                    <Skeleton className="h-4 w-32 mb-4 bg-zinc-800/80" />
                    <Skeleton className="h-12 sm:h-16 w-3/4 max-w-lg mb-6 bg-zinc-800/80" />
                    <Skeleton className="h-6 w-full max-w-2xl bg-zinc-800/80" />
                </div>
                
                {/* Timeline Skeleton */}
                <div className="relative border-l border-zinc-800 pl-8 space-y-12 ml-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="relative">
                            <div className="absolute -left-[41px] top-2 h-4 w-4 rounded-full bg-zinc-800" />
                            <Skeleton className="h-6 w-24 mb-4 bg-zinc-800/80" />
                            <Skeleton className="h-48 w-full max-w-3xl rounded-xl bg-zinc-800/80" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
