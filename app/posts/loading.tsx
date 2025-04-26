export default function Loading() {
  return (
    <div className="container py-8">
      <div className="space-y-4 mb-8">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-96 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-auto md:flex-1">
          <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-40 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-40 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>

      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 w-72 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
