"use client";

import { Skeleton } from "../ui/skeleton";

export const ProfileCardSkeleton = () => {
  return (
    <div className="flex items-center gap-2 bg-muted p-4 rounded-lg">
      <Skeleton className="w-12 h-12 bg-muted-foreground animate-pulse" />
      <div className="flex flex-col gap-1">
        <Skeleton className="w-24 h-4 bg-muted-foreground animate-pulse" />
        <Skeleton className="w-16 h-2 bg-muted-foreground animate-pulse" />
      </div>
    </div>
  );
};
