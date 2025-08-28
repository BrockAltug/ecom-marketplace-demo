"use client"

import type React from "react"

import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface LoadingBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export function LoadingBoundary({ children, fallback, className }: LoadingBoundaryProps) {
  const defaultFallback = (
    <div className={`space-y-4 ${className || ""}`}>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>
}
