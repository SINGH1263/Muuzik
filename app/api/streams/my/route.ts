import { prismaClient } from "@/app/lib/db"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json(
      { message: "unauthenticated" },
      { status: 403 }
    )
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: session.user.email,
    },
  })

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 403 }
    )
  }

  const streams = await prismaClient.stream.findMany({
    where: {
      userId: user.id,
    },
    include: {
      votes: {
        where: {
          userId: user.id,
        },
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
  })

  return NextResponse.json({
    stream: streams.map(({ votes, _count, ...rest }) => ({
      ...rest,
      voteCount: _count.votes,
      haveVoted: votes.length > 0,
      voteType: votes[0]?.type ?? null,
    })),
  })
}
