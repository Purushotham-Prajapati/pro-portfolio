import { Skeleton } from "../components/shared/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col pt-20 px-6">
      <div className="max-w-[1200px] w-full mx-auto relative mt-20">
        <Skeleton className="h-4 w-48 mb-8 bg-zinc-800/80" />
        <Skeleton className="h-20 sm:h-32 w-3/4 mb-4 bg-zinc-800/80" />
        <Skeleton className="h-20 sm:h-32 w-1/2 mb-10 bg-zinc-800/80" />
        <Skeleton className="h-6 w-full max-w-[480px] mb-2 bg-zinc-800/80" />
        <Skeleton className="h-6 w-3/4 max-w-[360px] mb-16 bg-zinc-800/80" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-zinc-800">
            <Skeleton className="h-16 w-full bg-zinc-800/80" />
            <Skeleton className="h-16 w-full bg-zinc-800/80" />
            <Skeleton className="h-16 w-full bg-zinc-800/80" />
            <Skeleton className="h-16 w-full bg-zinc-800/80" />
        </div>
      </div>
    </div>
  );
}
