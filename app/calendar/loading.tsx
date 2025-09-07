import { CalendarSkeleton, CalendarHeaderSkeleton } from "@/components/calendar/calendar-skeleton"

export default function CalendarLoading() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header Skeleton */}
      <CalendarHeaderSkeleton />

      {/* Main Content Skeleton */}
      <main className="flex-1 p-6">
        <CalendarSkeleton />
      </main>
    </div>
  )
} 