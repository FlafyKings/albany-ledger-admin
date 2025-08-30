import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, LogOut } from 'lucide-react'

export default function ProfileLoading() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        {/* Header card */}
        <Card className="border-gray-200 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Skeleton className="w-20 h-20 rounded-full" />
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-16" />
                  </div>
                </div>
                <div className="border-t border-gray-200 my-4" />
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-start gap-2">
                    <Skeleton className="h-4 w-4 mt-0.5" />
                    <div>
                      <Skeleton className="h-4 w-12 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Skeleton className="h-4 w-4 mt-0.5" />
                    <div>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Skeleton className="h-4 w-4 mt-0.5" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Bio + Achievements */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-56" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white">
                    <Skeleton className="h-5 w-5 mt-0.5" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-48 mb-2" />
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-56" />
              </CardHeader>
              <CardContent>
                <div className="relative border-s border-gray-200">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="mb-8 ms-6">
                      <div className="absolute -start-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-gray-300" />
                      <div className="flex items-center justify-between mb-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-3 w-40 mb-1" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column: Office, Committees */}
          <div className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Skeleton className="h-4 w-4 mt-0.5" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Skeleton className="h-3 w-12 mb-1" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
