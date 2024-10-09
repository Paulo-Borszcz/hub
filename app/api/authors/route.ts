import { NextResponse } from 'next/server'
import { getAuthors } from '@/lib/mongodb'

export async function GET() {
  try {
    const authors = await getAuthors()
    return NextResponse.json(authors)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch authors' }, { status: 500 })
  }
}