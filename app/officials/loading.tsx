import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Header } from "@/components/Header"

export default function OfficialsLoading() {
  return (
    <>
      <div className="flex-1 flex flex-col">
        <Header 
          title="Officials" 
          subtitle="Manage elected officials and their public profiles"
        />
        
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-72" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>

        <main className="flex-1 p-6">
          <Card className="border-gray-200">
            <CardHeader className="pb-0">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Official</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Office</TableHead>
                      <TableHead>Committees</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell className="min-w-[220px]">
                          <div className="flex items-center gap-3">
                            <Skeleton className="w-9 h-9 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-32 mb-1" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell className="min-w-[220px]">
                          <div className="space-y-1">
                            <Skeleton className="h-3 w-40" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[220px]">
                          <div className="space-y-1">
                            <Skeleton className="h-3 w-36" />
                            <Skeleton className="h-3 w-28" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 rounded" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Skeleton className="h-3.5 w-3.5" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  )
}
