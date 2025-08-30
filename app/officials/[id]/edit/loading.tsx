import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'

export default function EditOfficialLoading() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <Button variant="ghost" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <Skeleton className="h-8 w-48 mb-1" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div />
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="space-y-6">
          {/* Basic Info Card */}
          <Card className="border-gray-200">
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card className="border-gray-200">
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`space-y-2 ${i === 7 ? 'md:col-span-2' : ''}`}>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Biography Card */}
          <Card className="border-gray-200">
            <CardHeader>
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>

          {/* Experience Card */}
          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <Skeleton className="h-6 w-36 mb-2" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-10 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-gray-200 bg-white p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={`space-y-2 ${i === 4 || i === 5 ? 'md:col-span-2' : ''}`}>
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-3">
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Committees Card */}
          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <Skeleton className="h-6 w-44 mb-2" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-10 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-gray-200 bg-white p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-3">
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Card */}
          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <Skeleton className="h-6 w-36 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-36" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-gray-200 bg-white p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={`space-y-2 ${i === 2 ? 'md:col-span-2' : ''}`}>
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-3">
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </main>
    </div>
  )
}
