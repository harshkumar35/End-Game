import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function PostDetailLoading() {
  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-6">
        <Skeleton className="h-10 w-32" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Skeleton className="h-64 w-full rounded-md" />

          <div className="flex gap-2 mt-4">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          <div className="flex items-center gap-6 pt-4 border-t">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex-col items-start">
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="space-y-4 w-full">
            <Skeleton className="h-24 w-full" />
            <div className="flex items-start gap-3 w-full">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>
            <div className="flex items-start gap-3 w-full">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
