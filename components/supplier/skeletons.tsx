import { Skeleton } from "../ui/skeleton";

export const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 max-w-2xl rounded-2xl border p-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-full" />
      </div>
      <div className="p-4 rounded-xl border">
        <div className="flex gap-2">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-full h-12" />
        </div>
      </div>
      <div className="p-4 rounded-xl flex flex-col gap-4 border">
        <div className="space-y-1">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
};
