import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  return NextResponse.json({
    url_len: url.length,
    url_start: url.substring(0, 20),
    anon_len: anon.length,
    anon_start: anon.substring(0, 20),
  })
}
