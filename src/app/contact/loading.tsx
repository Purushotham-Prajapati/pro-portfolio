import { Skeleton } from "../../components/shared/Skeleton";

export default function ContactLoading() {
    return (
        <div className="min-h-screen bg-[#09090B] pt-32 pb-20 px-6">
            <div className="max-w-[1200px] w-full mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Left Col */}
                    <div>
                        <Skeleton className="h-4 w-32 mb-4 bg-zinc-800/80" />
                        <Skeleton className="h-12 sm:h-16 w-3/4 mb-6 bg-zinc-800/80" />
                        <Skeleton className="h-24 w-full mb-8 bg-zinc-800/80" />
                        
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-full max-w-sm rounded-lg bg-zinc-800/80" />
                            <Skeleton className="h-12 w-full max-w-sm rounded-lg bg-zinc-800/80" />
                            <Skeleton className="h-12 w-full max-w-sm rounded-lg bg-zinc-800/80" />
                        </div>
                    </div>
                    
                    {/* Right Col */}
                    <div>
                        <Skeleton className="h-96 w-full rounded-2xl bg-zinc-800/80" />
                    </div>
                </div>
            </div>
        </div>
    );
}
