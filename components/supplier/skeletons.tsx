import { Skeleton } from "../ui/skeleton";

export const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 max-w-2xl rounded-2xl border p-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-full" />
      </div>
      <div className="bg-muted p-4 rounded-xl border">
        <div className="flex gap-2">
          <Skeleton className="w-12 h-12 bg-muted-foreground rounded-full" />
          <Skeleton className="w-full h-12 bg-muted-foreground" />
        </div>
      </div>
      <div className="bg-muted p-4 rounded-xl flex flex-col gap-4 border">
        <div className="space-y-1">
          <Skeleton className="h-6 w-2/3 bg-muted-foreground" />
          <Skeleton className="h-4 w-full bg-muted-foreground" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-6 w-2/3 bg-muted-foreground" />
          <Skeleton className="h-4 w-full bg-muted-foreground" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-6 w-2/3 bg-muted-foreground" />
          <Skeleton className="h-4 w-full bg-muted-foreground" />
          <Skeleton className="h-4 w-full bg-muted-foreground" />
          <Skeleton className="h-4 w-full bg-muted-foreground" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-6 w-2/3 bg-muted-foreground" />
          <Skeleton className="h-4 w-full bg-muted-foreground" />
        </div>
        <Skeleton className="h-4 w-full bg-muted-foreground" />
      </div>
    </div>
  );
};
