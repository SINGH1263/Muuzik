"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, Users, Zap, Heart, Play, Headphones, Radio } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
export function Appbar(){
    const session = useSession();

return (
  <header className="w-full bg-white shadow-sm py-4 px-8">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      

     


      <div className="items-end">
        {session.data?.user ? (
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition duration-300"
            onClick={() => signOut()}
          >
            Logout
          </Button>
        ) : (
          <Button
            size="lg"
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg  transition duration-300 "
            onClick={() => signIn()}
          >
            SignIn
          </Button>
        )}
      </div>
    </div>
  </header>
);


}