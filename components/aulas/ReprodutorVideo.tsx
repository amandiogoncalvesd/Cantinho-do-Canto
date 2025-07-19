"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from "lucide-react"

interface ReprodutorVideoProps {
  videoUrl: string
  title: string
  onProgress?: (progress: number) => void
}

const ReprodutorVideo = ({ videoUrl, title, onProgress }: ReprodutorVideoProps) => {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)

  const handleProgress = (state: any) => {
    setPlayed(state.played)
    if (onProgress) {
      onProgress(state.played * 100)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Player */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              src={videoUrl}
              width="100%"
              height="100%"
              className="w-full h-full object-cover"
              muted={muted}
              controls={false}
            />

            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/20"
                onClick={() => setPlaying(!playing)}
              >
                {playing ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={played * 100} className="h-2" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatTime(played * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPlaying(!playing)}>
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <Button variant="outline" size="sm" onClick={() => setMuted(!muted)}>
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPlayed(0)
                  setPlaying(false)
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReprodutorVideo
