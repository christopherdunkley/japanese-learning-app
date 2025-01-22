import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { totalCards } = await request.json()
    
    const session = await prisma.session.create({
      data: {
        totalCards,
        results: {
          AGAIN: 0,
          HARD: 0,
          GOOD: 0,
          EASY: 0
        }
      }
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}