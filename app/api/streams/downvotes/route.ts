import { prismaClient } from "@/app/lib/db"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const DownvoteSchema = z.object({
  streamId: z.string(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json(
      { message: "Unauthenticated" },
      { status: 403 }
    )
  }

  const user = await prismaClient.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 403 }
    )
  }

  try {
    const body = await req.json()
    const data = DownvoteSchema.parse(body)

    const existingVote = await prismaClient.vote.findFirst({
      where: {
        userId: user.id,
        streamId: data.streamId,
      },
    })

    if (existingVote) {
      // Update existing vote to down
      await prismaClient.vote.update({
        where: { id: existingVote.id },
        data: { type: "down" },
      })
    } else {
      // Create a new downvote
      await prismaClient.vote.create({
        data: {
          userId: user.id,
          streamId: data.streamId,
          type: "down",
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { message: "Error processing downvote" },
      { status: 400 }
    )
  }
}
