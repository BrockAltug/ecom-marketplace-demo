"use client"

import { useState } from "react"
import { Mic, MicOff, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export function VoiceSearch() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [showVoiceCard, setShowVoiceCard] = useState(false)

  const startListening = () => {
    setIsListening(true)
    setShowVoiceCard(true)

    // Simulate voice recognition
    setTimeout(() => {
      setTranscript("wireless bluetooth headphones")
      setIsListening(false)
    }, 3000)
  }

  const stopListening = () => {
    setIsListening(false)
    setShowVoiceCard(false)
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <Input
          type="search"
          placeholder="Search with voice or text..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="flex-1"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={isListening ? stopListening : startListening}
          className={`${isListening ? "bg-red-500 text-white hover:bg-red-600" : ""}`}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {showVoiceCard && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 animate-in slide-in-from-top-2">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className={`h-3 w-3 rounded-full ${isListening ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
              <span className="text-sm font-medium">{isListening ? "Listening..." : "Voice search complete"}</span>
            </div>
            {transcript && <p className="text-sm text-muted-foreground">Heard: "{transcript}"</p>}
            {isListening && (
              <div className="flex justify-center mt-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-accent rounded-full animate-pulse"
                      style={{
                        height: Math.random() * 20 + 10,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
