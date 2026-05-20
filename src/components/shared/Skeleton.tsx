export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-zinc-800/50 ${className || ''}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 rounded-xl bg-zinc-900/50 p-6 ring-1 ring-white/5">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
