import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function PostSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Skeleton className="h-48 w-full rounded-t-lg" />
        <Skeleton className="h-6 w-3/4 mt-4" />
      </CardHeader>
      <CardContent className="flex-grow">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 mt-2" />
        <Skeleton className="h-4 w-4/6 mt-2" />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-24" />
      </CardFooter>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}