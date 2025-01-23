import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      where: {
        endedAt: {
          not: null
        }
      },
      orderBy: {
        startedAt: 'desc'
      },
      take: 5,  // Get last 5 sessions
      include: {
        reviews: true
      }
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching recent sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent sessions' },
      { status: 500 }
    )
  }
}