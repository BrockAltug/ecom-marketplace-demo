"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  fps: number
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== "development") return

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart
      const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart

      // Estimate memory usage (if available)
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0

      // Simple FPS counter
      let fps = 0
      let lastTime = performance.now()
      let frameCount = 0

      const countFPS = () => {
        frameCount++
        const currentTime = performance.now()
        if (currentTime - lastTime >= 1000) {
          fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
          frameCount = 0
          lastTime = currentTime
        }
        requestAnimationFrame(countFPS)
      }
      countFPS()

      setMetrics({
        loadTime: Math.round(loadTime),
        renderTime: Math.round(renderTime),
        memoryUsage: Math.round(memoryUsage / 1024 / 1024), // Convert to MB
        fps,
      })
    }

    // Measure after page load
    if (document.readyState === "complete") {
      measurePerformance()
    } else {
      window.addEventListener("load", measurePerformance)
    }

    // Toggle visibility with keyboard shortcut
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        setIsVisible(!isVisible)
      }
    }

    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("load", measurePerformance)
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [isVisible])

  if (!metrics || !isVisible) return null

  const getPerformanceColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return "bg-green-500"
    if (value <= thresholds[1]) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="w-64 bg-background/95 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Performance</h3>
            <Badge variant="outline" className="text-xs">
              Dev Mode
            </Badge>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span>Load Time:</span>
              <div className="flex items-center gap-2">
                <span>{metrics.loadTime}ms</span>
                <div className={`w-2 h-2 rounded-full ${getPerformanceColor(metrics.loadTime, [100, 300])}`} />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Render Time:</span>
              <div className="flex items-center gap-2">
                <span>{metrics.renderTime}ms</span>
                <div className={`w-2 h-2 rounded-full ${getPerformanceColor(metrics.renderTime, [50, 150])}`} />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Memory:</span>
              <div className="flex items-center gap-2">
                <span>{metrics.memoryUsage}MB</span>
                <div className={`w-2 h-2 rounded-full ${getPerformanceColor(metrics.memoryUsage, [50, 100])}`} />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>FPS:</span>
              <div className="flex items-center gap-2">
                <span>{metrics.fps}</span>
                <div className={`w-2 h-2 rounded-full ${getPerformanceColor(60 - metrics.fps, [10, 30])}`} />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Press Ctrl+Shift+P to toggle</p>
        </CardContent>
      </Card>
    </div>
  )
}
