'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, Phone, User, Loader2, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

const schema = z.object({
  name: z
    .string()
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم طويل جداً')
    .regex(/^[؀-ۿa-zA-Z\s]+$/, 'الاسم يجب أن يحتوي على حروف فقط'),
  phone: z
    .string()
    .regex(/^(05\d{8}|9665\d{8}|\+9665\d{8})$/, 'رقم الجوال غير صحيح (مثال: 05XXXXXXXX)'),
})

type FormData = z.infer<typeof schema>

export default function LeadFormPage() {
  const [submitted, setSubmitted] = useState(false)
  const [utmParams, setUtmParams] = useState<Record<string, string>>({})

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const utm: Record<string, string> = {}
    ;['utm_source', 'utm_campaign', 'utm_content', 'utm_medium', 'utm_term'].forEach((key) => {
      const val = params.get(key)
      if (val) utm[key] = val
    })
    setUtmParams(utm)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const source = utmParams.utm_source
        ? utmParams.utm_source.charAt(0).toUpperCase() + utmParams.utm_source.slice(1)
        : 'TikTok'

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          source,
          campaign: utmParams.utm_campaign || null,
          ad: utmParams.utm_content || null,
        }),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'حدث خطأ')

      setSubmitted(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'حدث خطأ، حاول مجدداً')
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden" dir="rtl">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-500/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero car image */}
      <div className="absolute inset-0 opacity-15">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/30" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-gold-400/30 bg-gold-500/10 mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-8 h-8 text-gold-400"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white/60 tracking-widest uppercase">
            معرض السيارات الفاخرة
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-3" />
        </div>

        {submitted ? (
          /* Success State */
          <div className="w-full max-w-md">
            <div className="glass rounded-2xl p-8 text-center border border-green-500/20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">تم استلام طلبك بنجاح</h2>
              <p className="text-white/60 leading-relaxed">
                سيتواصل معك أحد مستشاري المبيعات قريبًا بأفضل العروض المتاحة.
              </p>
              <div className="mt-6 p-4 bg-gold-500/10 rounded-xl border border-gold-500/20">
                <p className="text-gold-400 text-sm font-medium">شكراً لاهتمامك بمعرضنا</p>
              </div>
            </div>
          </div>
        ) : (
          /* Lead Form */
          <div className="w-full max-w-md">
            <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
              <div className="mb-7">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">تواصل معنا</h2>
                <p className="text-white/50 text-sm leading-relaxed">
                  أدخل بياناتك وسيتواصل معك أحد مستشاري المبيعات بأفضل العروض المتاحة.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    الاسم الكامل
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-white/30" />
                    </div>
                    <input
                      {...register('name')}
                      type="text"
                      placeholder="محمد أحمد"
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 pr-10 text-white placeholder-white/20 focus:outline-none focus:ring-2 transition-all ${
                        errors.name
                          ? 'border-red-500/50 focus:ring-red-500/30'
                          : 'border-white/10 focus:ring-gold-500/30 focus:border-gold-500/50'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1.5 text-red-400 text-xs">{errors.name.message}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    رقم الجوال
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <Phone className="w-4 h-4 text-white/30" />
                    </div>
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder="05XXXXXXXX"
                      inputMode="numeric"
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 pr-10 text-white placeholder-white/20 focus:outline-none focus:ring-2 transition-all ${
                        errors.phone
                          ? 'border-red-500/50 focus:ring-red-500/30'
                          : 'border-white/10 focus:ring-gold-500/30 focus:border-gold-500/50'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1.5 text-red-400 text-xs">{errors.phone.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gold-500/20 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      أرسل طلبك
                      <ChevronLeft className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Trust indicators */}
              <div className="mt-6 flex items-center justify-center gap-4 text-white/30 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  آمن وموثوق
                </span>
                <span>•</span>
                <span>لن يتم مشاركة بياناتك</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom decoration */}
        <div className="mt-10 text-center">
          <p className="text-white/20 text-xs">
            © 2025 معرض السيارات الفاخرة - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  )
}
