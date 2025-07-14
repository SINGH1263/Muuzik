"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronUp, ChevronDown, Share2, Play, Users, Music, SkipForward } from "lucide-react"
import { toast } from "react-toastify"
import { signOut } from "next-auth/react"

interface Video {
  id: string
  title: string
  thumbnail: string
  url: string
  votes: number
  userVote?: "up" | "down" | null
}

export default function MusicVotingInterface() {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [queue, setQueue] = useState<Video[]>([])
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isVideoEnded, setIsVideoEnded] = useState(false)
  const playerRef = useRef<any>(null)

  const sortedQueue = [...queue].sort((a, b) => b.votes - a.votes)

  useEffect(() => {
    if (isVideoEnded && sortedQueue.length > 0) {
      playNextVideo()
    }
  }, [isVideoEnded, sortedQueue])

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      document.body.appendChild(tag)
    }
  }, [])

  useEffect(() => {
    if (window.YT && currentVideo) {
      if (playerRef.current) {
        playerRef.current.destroy()
      }

      playerRef.current = new window.YT.Player("yt-player", {
        videoId: currentVideo.id,
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              setIsVideoEnded(true)
            }
          },
        },
        playerVars: {
          autoplay: 1,
          controls: 1,
        },
      })
    }
  }, [currentVideo])

  const playNextVideo = () => {
    if (sortedQueue.length > 0) {
      const nextVideo = sortedQueue[0]
      setCurrentVideo(nextVideo)
      setQueue((prev) => prev.filter((video) => video.id !== nextVideo.id))
      setIsVideoEnded(false)
      toast.success(`Now playing: ${nextVideo.title}`)
    } else {
      setCurrentVideo(null)
      toast.info("Queue is empty. Add more songs!")
    }
  }

  const skipToNext = () => {
    if (sortedQueue.length > 0) {
      playNextVideo()
    } else {
      toast.info("No songs in queue to skip to")
    }
  }

  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const fetchVideoDetails = async (videoId: string): Promise<Video | null> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return {
        id: videoId,
        title: `Video Title for ${videoId}`,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        votes: 0,
        userVote: null,
      }
    } catch (error) {
      return null
    }
  }

  const handleUrlChange = async (url: string) => {
    setNewVideoUrl(url)
    if (!url.trim()) {
      setPreviewVideo(null)
      return
    }
    const videoId = extractVideoId(url)
    if (videoId) {
      setIsLoading(true)
      const videoDetails = await fetchVideoDetails(videoId)
      setPreviewVideo(videoDetails)
      setIsLoading(false)
    } else {
      setPreviewVideo(null)
    }
  }

  const addToQueue = () => {
    if (previewVideo) {
      const exists = queue.find((video) => video.id === previewVideo.id)
      const isCurrentlyPlaying = currentVideo?.id === previewVideo.id

      if (exists || isCurrentlyPlaying) {
        toast.error("This video is already in the queue or currently playing.")
        return
      }

      setQueue((prev) => [...prev, previewVideo])
      if (!currentVideo) {
        setCurrentVideo(previewVideo)
        toast.success("Video is now playing!")
      } else {
        toast.success("Video added to queue!")
      }
      setNewVideoUrl("")
      setPreviewVideo(null)
    }
  }

  const handleVote = (videoId: string, voteType: "up" | "down") => {
    setQueue((prev) =>
      prev.map((video) => {
        if (video.id === videoId) {
          let newVotes = video.votes
          let newUserVote: "up" | "down" | null = voteType

          if (video.userVote === voteType) {
            newUserVote = null
            newVotes += voteType === "up" ? -1 : 1
          } else if (video.userVote) {
            newVotes += voteType === "up" ? 2 : -2
          } else {
            newVotes += voteType === "up" ? 1 : -1
          }

          return { ...video, votes: newVotes, userVote: newUserVote }
        }
        return video
      })
    )
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Vote for the next song!",
        text: "Help choose what plays next on the stream!",
        url: window.location.href,
      })
    } catch (error) {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Share link has been copied to clipboard.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">StreamVote</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {queue.length} songs
              </Badge>
              <Button onClick={handleShare} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Add New Video */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Add to Queue
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Paste YouTube URL here..."
                  value={newVideoUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                />
                {isLoading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading preview...</p>
                  </div>
                )}
                {previewVideo && (
                  <div className="space-y-3">
                    <img
                      src={previewVideo.thumbnail}
                      alt={previewVideo.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <h4 className="font-medium text-sm line-clamp-2">{previewVideo.title}</h4>
                    <Button onClick={addToQueue} className="w-full">
                      {!currentVideo ? "Play Now" : "Add to Queue"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Queue */}
            <Card>
              <CardHeader>
                <CardTitle>Queue ({sortedQueue.length})</CardTitle>
                <p className="text-sm text-gray-500">Songs are ordered by votes (highest first)</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {sortedQueue.map((video, index) => (
                    <div key={video.id} className="flex items-center gap-3 p-3 rounded-lg border bg-white/50">
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-medium text-gray-500">#{index + 1}</div>
                        {index === 0 && <Badge variant="default" className="text-xs mt-1">Next</Badge>}
                      </div>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Button
                          size="sm"
                          variant={video.userVote === "up" ? "default" : "outline"}
                          onClick={() => handleVote(video.id, "up")}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">{video.votes}</span>
                        <Button
                          size="sm"
                          variant={video.userVote === "down" ? "destructive" : "outline"}
                          onClick={() => handleVote(video.id, "down")}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {sortedQueue.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Music className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No songs in queue yet</p>
                      <p className="text-sm">Add the first song!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Now Playing Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-red-500" />
                    {currentVideo ? "Now Playing" : "No Song Playing"}
                  </CardTitle>
                  {currentVideo && sortedQueue.length > 0 && (
                    <Button onClick={skipToNext} variant="outline" size="sm">
                      <SkipForward className="h-4 w-4 mr-2" />
                      Skip
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {currentVideo ? (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                      <div id="yt-player" className="w-full h-full" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{currentVideo.title}</h2>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Live</Badge>
                        <div className="text-sm text-gray-500">
                          Next: {sortedQueue.length > 0 ? sortedQueue[0].title : "Queue is empty"}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Music className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No song is playing</h3>
                      <p className="text-sm">Add a song to get started!</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
