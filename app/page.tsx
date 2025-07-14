"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, Users, Zap, Heart, Play, Headphones, Radio } from "lucide-react"
import Link from "next/link"
import { Appbar } from "./components/Appbar"
import { Redirect } from "./components/Redirect"
import { signIn } from "next-auth/react"

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header
        className={`px-4 lg:px-10 h-20 flex items-center justify-between border-b bg-white/30 backdrop-blur-md ${
          scrolled ? "shadow-lg" : "shadow-none"
        } rounded-b-xl sticky top-0 z-50 transition-shadow duration-300`}
      >
        {/* Left: Logo and Name */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-slate-900 rounded-full flex items-center justify-center shadow-lg">
            <Music className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-slate-900 text-transparent bg-clip-text tracking-tight">
            StreamSync
          </span>
        </div>

        {/* Center: Hindi Slogan */}
        <div className="hidden md:flex justify-center flex-1 text-sm font-medium text-black tracking-wide">
          🎶 <span className="italic mx-2">"गीत","वो अजब सा सुकून है, जो संगीत में मिलता है, हर दर्द को भुलाकर, दिल को सुकून मिलता है।"</span> 🎶
        </div>

        {/* Right: Redirect/Sign In */}
        <div className="flex items-center gap-4">
          <Redirect />
        </div>

         <div className="flex items-center gap-4">
          <Appbar />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <Badge className="w-fit bg-gradient-to-r from-blue-600 to-slate-900 text-white">
                    🎵 Interactive Streaming
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Let Your Fans{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-slate-900 bg-clip-text text-transparent">
                      Control the Music
                    </span>
                  </h1>
                  <p className="max-w-[600px] text-slate-600 md:text-xl">
                    Stream live while your audience votes on what plays next. Build deeper connections through music.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-slate-900 hover:from-blue-700 hover:to-slate-800"
                    onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Streaming
                  </Button>
                  <Button variant="outline" size="lg" className="border-slate-300 bg-transparent">
                    <Headphones className="mr-2 h-4 w-4" />
                    Join as Fan
                  </Button>
                </div>
                <div className="flex items-center gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>10K+ Creators</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>500K+ Fans</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-slate-900 rounded-3xl blur-3xl opacity-20"></div>
                  <img
                    src="https://scrolldroll.com/wp-content/uploads/2021/01/mere-halaat-ese-hein-k-mein-kuch-kar-nahi-sakta-bollywood-song-meme-templates-01.jpg"
                    width={600}
                    height={600}
                    alt="StreamSync Interface"
                    className="relative rounded-3xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">Why StreamSync?</h2>
              <p className="max-w-[600px] text-slate-600 md:text-lg">
                Transform your streams into interactive experiences
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  icon: <Radio className="h-6 w-6 text-white" />,
                  title: "Real-Time Voting",
                  text: "Fans vote on songs in real-time, creating dynamic playlists that reflect your community's mood.",
                },
                {
                  icon: <Zap className="h-6 w-6 text-white" />,
                  title: "Easy Setup",
                  text: "Go live in minutes. Connect your music library and start streaming with fan-controlled playlists.",
                },
                {
                  icon: <Heart className="h-6 w-6 text-white" />,
                  title: "Build Community",
                  text: "Foster deeper connections through shared musical experiences and collaborative playlists.",
                },
              ].map((feature, i) => (
                <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-slate-900 rounded-lg flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                    </div>
                    <p className="text-slate-600">{feature.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-16 md:py-24 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">How It Works</h2>
              <p className="max-w-[600px] text-slate-600 md:text-lg">Three simple steps to interactive streaming</p>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              {["Create Stream", "Fans Vote", "Music Plays"].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold">{step}</h3>
                  <p className="text-slate-600">
                    {
                      ["Set up your room and connect your music library", "Your audience joins and votes on songs they want to hear", "Top voted songs play automatically during your stream"][i]
                    }
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-r from-blue-600 to-slate-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center text-white space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Get Started?</h2>
              <p className="max-w-[600px] text-blue-100 md:text-lg">
                Join creators building stronger communities through interactive music experiences.
              </p>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-slate-900 hover:from-blue-700 hover:to-slate-800"
                  onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Streaming
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  Watch Demo
                </Button>
              </div>
              <p className="text-sm text-blue-200">Free to start. No credit card required.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-gradient-to-br from-blue-600 to-slate-900 rounded flex items-center justify-center">
            <Music className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm text-slate-600">© 2024 StreamSync. All rights reserved.</span>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-slate-600">
            Terms
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-slate-600">
            Privacy
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-slate-600">
            Support
          </Link>
        </nav>
      </footer>
    </div>
  )
}
