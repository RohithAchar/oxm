import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12 mx-auto max-w-screen-2xl px-3 md:px-6">
      <div className="pt-2 md:pt-4">
        <Skeleton className="h-7 w-40 md:h-9 md:w-56" />
        <Skeleton className="h-4 w-56 md:w-80 mt-2" />
      </div>
      <div className="border-t" />

      <div className="rounded-md border">
        <div className="grid grid-cols-12 px-3 py-2 text-xs md:text-sm text-muted-foreground">
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 items-center px-3 py-3">
              <Skeleton className="col-span-2 h-4 w-24" />
              <Skeleton className="col-span-3 h-4 w-40" />
              <Skeleton className="col-span-2 h-4 w-24" />
              <Skeleton className="col-span-2 h-4 w-24" />
              <Skeleton className="col-span-2 h-4 w-24" />
              <Skeleton className="col-span-1 h-8 w-8 rounded" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-10 h-10 rounded-md" />
        ))}
      </div>
    </main>
  );
};

export default Loading;
