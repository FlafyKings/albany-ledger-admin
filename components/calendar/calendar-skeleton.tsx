import { Skeleton } from "@/components/ui/skeleton"

interface CalendarSkeletonProps {
  view?: 'month' | 'week'
}

export function CalendarSkeleton({ view = 'month' }: CalendarSkeletonProps) {
  return (
    <div className="space-y-6 bg-white rounded-lg shadow-sm p-6">
      {/* Calendar Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
          
          {/* Month/Year title */}
          <Skeleton className="h-6 w-40" />
          
          {/* Today button */}
          <Skeleton className="h-8 w-16" />
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle buttons */}
          <div className="flex rounded-md border border-[#5e6461]/20">
            <Skeleton className="h-8 w-16 rounded-r-none" />
            <Skeleton className="h-8 w-16 rounded-l-none" />
          </div>
          
          {/* Refresh button */}
          <Skeleton className="h-8 w-20" />
          
          {/* Export button */}
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      {/* Event Filters Skeleton */}
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-4 w-12" /> {/* "Filters:" text */}
        <Skeleton className="h-8 w-24 rounded-full" /> {/* Commission filter */}
        <Skeleton className="h-8 w-20 rounded-full" /> {/* County filter */}
        <Skeleton className="h-8 w-28 rounded-full" /> {/* School Board filter */}
        <Skeleton className="h-8 w-20 rounded-full" /> {/* Election filter */}
        <Skeleton className="h-8 w-16" /> {/* Clear all button */}
      </div>

      {/* Calendar Content Skeleton */}
      {view === 'month' ? <MonthViewSkeleton /> : <WeekViewSkeleton />}
    </div>
  )
}

function MonthViewSkeleton() {
  return (
    <div className="border border-[#5e6461]/20 rounded-lg overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 bg-[#5e6461]/5">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="p-3 text-center">
            <Skeleton className="h-4 w-8 mx-auto" />
          </div>
        ))}
      </div>

      {/* Calendar grid - 6 weeks × 7 days */}
      <div className="grid grid-cols-7">
        {Array.from({ length: 42 }).map((_, index) => (
          <div key={index} className="min-h-[120px] border-b border-r border-[#5e6461]/10 p-2">
            {/* Date number */}
            <Skeleton className="h-4 w-6 mb-2" />
            
            {/* Event skeletons - some days have events, some don't */}
            {index % 3 === 0 && (
              <div className="space-y-1">
                <Skeleton className="h-4 w-full rounded-sm" />
                {index % 6 === 0 && <Skeleton className="h-4 w-3/4 rounded-sm" />}
              </div>
            )}
            
            {index % 4 === 1 && (
              <div className="space-y-1">
                <Skeleton className="h-4 w-4/5 rounded-sm" />
              </div>
            )}
            
            {index % 5 === 2 && (
              <div className="space-y-1">
                <Skeleton className="h-4 w-full rounded-sm" />
                <Skeleton className="h-4 w-2/3 rounded-sm" />
                <Skeleton className="h-3 w-8 rounded-sm opacity-60" /> {/* "+1 more" indicator */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function WeekViewSkeleton() {
  return (
    <div className="border border-[#5e6461]/20 rounded-lg overflow-hidden">
      <div className="max-h-[600px] overflow-y-auto">
        {/* Week day headers */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-[#5e6461]/5 border-b border-[#5e6461]/10 sticky top-0 z-10">
          <div className="p-2 text-center border-r border-[#5e6461]/10">
            <Skeleton className="h-4 w-8 mx-auto" />
          </div>
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="p-2 text-center border-r border-[#5e6461]/10">
              <Skeleton className="h-4 w-8 mx-auto mb-1" />
              <Skeleton className="h-5 w-6 mx-auto" />
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          {/* Time column */}
          <div className="border-r border-[#5e6461]/10">
            {Array.from({ length: 24 }).map((_, hour) => (
              <div key={hour} className="h-16 border-b border-[#5e6461]/10 p-2 text-center">
                <Skeleton className="h-3 w-8 mx-auto" />
              </div>
            ))}
          </div>

          {/* Week columns with some random events */}
          {Array.from({ length: 7 }).map((_, dayIndex) => (
            <div key={dayIndex} className="border-r border-[#5e6461]/10">
              {Array.from({ length: 24 }).map((_, hourIndex) => (
                <div key={hourIndex} className="h-16 border-b border-[#5e6461]/10 p-1 relative">
                  {/* Add some random event skeletons */}
                  {(dayIndex === 1 && hourIndex === 9) && (
                    <Skeleton className="h-12 w-full rounded-sm" />
                  )}
                  {(dayIndex === 3 && hourIndex === 14) && (
                    <Skeleton className="h-8 w-full rounded-sm" />
                  )}
                  {(dayIndex === 5 && hourIndex === 10) && (
                    <Skeleton className="h-16 w-full rounded-sm" />
                  )}
                  {(dayIndex === 2 && hourIndex === 16) && (
                    <Skeleton className="h-6 w-3/4 rounded-sm" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CalendarHeaderSkeleton() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </header>
  )
} 