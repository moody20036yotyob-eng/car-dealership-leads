import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100),
  phone: z.string().regex(/^(05|5|9665|\+9665)\d{8}$/, 'رقم الجوال غير صحيح'),
  source: z.string().default('TikTok'),
  campaign: z.string().nullable().optional(),
  ad: z.string().nullable().optional(),
  client_type: z.enum(['individual', 'company']).nullable().optional(),
  payment_method: z.enum(['cash', 'finance']).nullable().optional(),
  nationality: z.enum(['citizen', 'resident']).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  car_wanted: z.string().max(200).nullable().optional(),
})

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = leadSchema.parse(body)

    // Normalize phone
    let phone = validated.phone.replace(/\D/g, '')
    if (phone.startsWith('05')) phone = '966' + phone.slice(1)
    else if (phone.startsWith('5') && phone.length === 9) phone = '966' + phone
    else if (phone.startsWith('+')) phone = phone.slice(1)

    // Use service role key server-side to bypass RLS for public lead insertion
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from('leads')
      .insert({
        name: validated.name.trim(),
        phone,
        source: validated.source,
        campaign: validated.campaign || null,
        ad: validated.ad || null,
        client_type: validated.client_type || null,
        payment_method: validated.payment_method || null,
        nationality: validated.nationality || null,
        city: validated.city?.trim() || null,
        car_wanted: validated.car_wanted?.trim() || null,
        status: 'new',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'حدث خطأ أثناء حفظ البيانات' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 })
  }
}
