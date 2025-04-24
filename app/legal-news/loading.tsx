import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container py-8">
      <div className="space-y-4 mb-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-full max-w-md" />
      </div>

      <Skeleton className="h-10 w-48 mb-8" />

      <div className="space-y-6">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex gap-2 items-center">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="space-y-2 pt-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Skeleton className="h-full w-full rounded-r-lg" />
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  )
}
