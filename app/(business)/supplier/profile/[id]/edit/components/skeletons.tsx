import { Skeleton } from "@/components/ui/skeleton";

export const ProfileFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 mb-24">
      {/* Header Section Skeleton */}
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Form Container */}
      <div className="p-4 rounded-lg border space-y-4 pb-4">
        {/* Business Name Field Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-48" />
        </div>

        {/* Business Type Field Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-52" />
        </div>

        {/* Alternate Phone Field Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* City Field Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* State Field Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-22" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Pincode Field Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Business Address Field Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-20 w-full" />
        </div>

        {/* Submit Button Skeleton */}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};
