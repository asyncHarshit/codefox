"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react"

import { useQuery } from "@tanstack/react-query"
import { getReviews } from "@/module/review/actions"
import { formatDistanceToNow } from "date-fns"

/* ================= Shimmer Card ================= */

function ReviewCardShimmer() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3 space-y-3">
        <div className="flex justify-between gap-3">
          <div className="h-4 w-40 shimmer rounded" />
          <div className="h-5 w-20 shimmer rounded-full" />
        </div>
        <div className="h-3 w-32 shimmer rounded" />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="space-y-2">
          <div className="h-3 w-full shimmer rounded" />
          <div className="h-3 w-full shimmer rounded" />
          <div className="h-3 w-4/5 shimmer rounded" />
          <div className="h-3 w-3/5 shimmer rounded" />
        </div>

        <div className="h-9 w-full shimmer rounded-lg mt-auto" />
      </CardContent>
    </Card>
  )
}

/* ================= Page ================= */

export default function ReviewsPage() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      return await getReviews()
    },
  })

  /* ---------- SHIMMER STATE ---------- */
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8 space-y-3">
          <div className="h-8 w-48 shimmer rounded" />
          <div className="h-4 w-96 shimmer rounded" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ReviewCardShimmer key={i} />
          ))}
        </div>
      </div>
    )
  }

  /* ---------- EMPTY STATE ---------- */
  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-3 pt-6">
            <XCircle className="h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No reviews found</p>
            <p className="text-sm text-muted-foreground text-center">
              Start reviewing pull requests to see them appear here
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  /* ---------- DATA STATE ---------- */
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Code Reviews</h1>
        <p className="text-muted-foreground">
          Review history and status for all pull requests
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <Card
            key={review.id}
            className="flex flex-col hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <CardTitle className="text-base line-clamp-2 flex-1">
                  {review.prTitle}
                </CardTitle>

                <Badge
                  variant={review.status === "completed" ? "default" : "secondary"}
                  className="shrink-0"
                >
                  {review.status === "completed" ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {review.status}
                </Badge>
              </div>

              <CardDescription className="flex items-center gap-2">
                <span>PR #{review.prNumber}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(review.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-4">
              <p className="text-sm text-muted-foreground line-clamp-4">
                {review.review}
              </p>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-auto"
                asChild
              >
                <a
                  href={review.prUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  View Pull Request
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
