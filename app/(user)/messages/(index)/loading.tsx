import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List Skeleton */}
          <div className="lg:col-span-1 border rounded-lg space-y-4">
            <div className="p-4 border-b">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-3 p-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted"
                >
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="w-3 h-3 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area Skeleton */}
          <div className="lg:col-span-2 border rounded-lg flex flex-col">
            {/* Chat Header Skeleton */}
            <div className="p-4 border-b flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>

            {/* Messages Skeleton */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex ${
                    i % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-xs space-y-2 ${
                      i % 2 === 0 ? "mr-auto" : "ml-auto"
                    }`}
                  >
                    <Skeleton
                      className={`h-4 w-48 rounded-lg ${
                        i % 2 === 0 ? "bg-muted" : "bg-primary"
                      }`}
                    />
                    <Skeleton
                      className={`h-3 w-20 rounded ${
                        i % 2 === 0 ? "ml-0" : "ml-auto"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input Skeleton */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Skeleton className="flex-1 h-10 rounded-lg" />
                <Skeleton className="w-20 h-10 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
