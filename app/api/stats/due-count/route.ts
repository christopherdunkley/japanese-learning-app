import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const now = new Date()
    
    const count = await prisma.flashcard.count({
      where: {
        OR: [
          { nextReviewAt: null },
          { nextReviewAt: { lte: now } }
        ]
      }
    })
    
    return new NextResponse(JSON.stringify({ count }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch {
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch count' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}