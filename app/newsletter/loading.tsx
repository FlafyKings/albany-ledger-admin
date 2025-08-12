export default function NewsletterLoading() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-4 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />
            <div className="mt-1 h-4 w-40 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border">
        <div className="border-b p-4">
          <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="grid gap-6 p-4 lg:grid-cols-3">
          <div className="space-y-3">
            <div className="h-9 w-full animate-pulse rounded bg-slate-200" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 w-full animate-pulse rounded bg-slate-200" />
            ))}
          </div>
          <div className="lg:col-span-2 space-y-3">
            <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-72 w-full animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  )
}
