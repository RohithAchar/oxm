export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-3/4 rounded bg-muted" />
        <div className="h-5 w-2/3 rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-40 rounded bg-muted" />
          <div className="h-40 rounded bg-muted" />
          <div className="h-40 rounded bg-muted" />
          <div className="h-40 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}


