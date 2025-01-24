import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
 try {
   const count = await prisma.flashcard.count({
     where: {
       OR: [
         { reviews: { none: {} } },
         {
           reviews: {
             some: {
               nextReview: {
                 lte: new Date()
               }
             }
           }
         }
       ]
     }
   })
   return NextResponse.json({ count })
 } catch {
   return NextResponse.json({ error: 'Failed to fetch count' }, { status: 500 })
 }
}