"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ProgressiveImageProps {
  src: string
  placeholder: string
  alt: string
  className?: string
}

export function ProgressiveImage({ src, placeholder, alt, className }: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(placeholder)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setCurrentSrc(src)
      setIsLoaded(true)
    }
    img.src = src
  }, [src])

  return (
    <img
      src={currentSrc || "/placeholder.svg"}
      alt={alt}
      className={cn("transition-all duration-300", !isLoaded && "blur-sm scale-105", className)}
    />
  )
}
