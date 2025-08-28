"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineAlert, setShowOfflineAlert] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineAlert(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineAlert(true)
    }

    // Set initial state
    setIsOnline(navigator.onLine)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!showOfflineAlert) return null

  return (
    <div className="fixed top-16 left-4 right-4 z-50 animate-in slide-in-from-top-4">
      <Alert variant="destructive" className="max-w-md mx-auto">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>You're currently offline</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowOfflineAlert(false)}
            className="h-auto p-1 text-destructive-foreground hover:bg-destructive-foreground/20"
          >
            ×
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}
