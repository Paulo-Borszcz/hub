import { NextRequest, NextResponse } from 'next/server'
import { createCanvas } from 'canvas'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const width = parseInt(searchParams.get('width') || '300', 10)
  const height = parseInt(searchParams.get('height') || '150', 10)
  const text = searchParams.get('text') || ''

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Set background
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, width, height)

  // Set text
  ctx.fillStyle = '#444'
  ctx.font = '24px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height / 2)

  const buffer = canvas.toBuffer('image/png')

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}