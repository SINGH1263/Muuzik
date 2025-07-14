import { prismaClient } from "@/app/lib/db"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const UpvoteSchema = z.object({
  streamId: z.string(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 403 })
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: session.user.email,
    },
  })

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = UpvoteSchema.parse(body)

    // Check if vote already exists
    const existingVote = await prismaClient.vote.findFirst({
      where: {
        streamId: data.streamId,
        userId: user.id,
      },
    })

    if (existingVote) {
      // Update existing vote to "up"
      await prismaClient.vote.update({
        where: { id: existingVote.id },
        data: { type: "up" },
      })
    } else {
      // Create new upvote
      await prismaClient.vote.create({
        data: {
          streamId: data.streamId,
          userId: user.id,
          type: "up",
        },
      })
    }

    return NextResponse.json({ message: "Upvote recorded successfully" })
  } catch (e) {
    console.error("Upvote error:", e)
    return NextResponse.json(
      { message: "Error while upvoting" },
      { status: 400 }
    )
  }
}
