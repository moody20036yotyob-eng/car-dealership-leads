'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, Loader2, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

const schema = z.object({
  client_type: z.enum(['individual', 'company'], { required_error: 'اختر نوع العميل' }),
  payment_method: z.enum(['cash', 'finance'], { required_error: 'اختر طريقة الدفع' }),
  name: z
    .string()
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم طويل جداً'),
  phone: z
    .string()
    .regex(/^(05\d{8}|9665\d{8}|\+9665\d{8})$/, 'رقم الجوال غير صحيح (مثال: 05XXXXXXXX)'),
  city: z.string().min(2, 'أدخل المدينة').max(100),
  car_wanted: z.string().min(2, 'أدخل السيارة المطلوبة').max(200),
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
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { client_type: 'individual', payment_method: 'cash' },
  })

  const clientType = watch('client_type')
  const paymentMethod = watch('payment_method')

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
          client_type: data.client_type,
          payment_method: data.payment_method,
          city: data.city,
          car_wanted: data.car_wanted,
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
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="absolute inset-0 opacity-15">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/30" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-yellow-400/30 bg-yellow-500/10 mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-yellow-400" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white/60 tracking-widest">معرض السيارات الفاخرة</h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mt-3" />
        </div>

        {submitted ? (
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur border border-green-500/20 rounded-2xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">تم استلام طلبك بنجاح</h2>
              <p className="text-white/60 leading-relaxed">
                سيتواصل معك أحد مستشاري المبيعات قريبًا بأفضل العروض المتاحة.
              </p>
              <div className="mt-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                <p className="text-yellow-400 text-sm font-medium">شكراً لاهتمامك بمعرضنا</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">بيانات الطلب</h2>
                <p className="text-white/40 text-sm">أدخل بياناتك وسنتواصل معك فوراً</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Client Type */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-3">نوع العميل *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'individual', label: 'أفراد' },
                      { value: 'company', label: 'شركات' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setValue('client_type', opt.value as 'individual' | 'company')}
                        className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                          clientType === opt.value
                            ? 'bg-yellow-500/20 border-yellow-500/60 text-yellow-400'
                            : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {errors.client_type && <p className="mt-1.5 text-red-400 text-xs">{errors.client_type.message}</p>}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-3">طريقة الدفع *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'cash', label: 'كاش' },
                      { value: 'finance', label: 'تمويل' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setValue('payment_method', opt.value as 'cash' | 'finance')}
                        className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                          paymentMethod === opt.value
                            ? 'bg-yellow-500/20 border-yellow-500/60 text-yellow-400'
                            : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {errors.payment_method && <p className="mt-1.5 text-red-400 text-xs">{errors.payment_method.message}</p>}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    {clientType === 'company' ? 'اسم المسؤول *' : 'الاسم الكامل *'}
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder={clientType === 'company' ? 'اسم المسؤول' : 'محمد أحمد'}
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 transition-all ${
                      errors.name ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 focus:ring-yellow-500/30 focus:border-yellow-500/50'
                    }`}
                  />
                  {errors.name && <p className="mt-1.5 text-red-400 text-xs">{errors.name.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">رقم الجوال *</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="05XXXXXXXX"
                    inputMode="numeric"
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 transition-all ${
                      errors.phone ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 focus:ring-yellow-500/30 focus:border-yellow-500/50'
                    }`}
                  />
                  {errors.phone && <p className="mt-1.5 text-red-400 text-xs">{errors.phone.message}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">المدينة *</label>
                  <input
                    {...register('city')}
                    type="text"
                    placeholder="الرياض"
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 transition-all ${
                      errors.city ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 focus:ring-yellow-500/30 focus:border-yellow-500/50'
                    }`}
                  />
                  {errors.city && <p className="mt-1.5 text-red-400 text-xs">{errors.city.message}</p>}
                </div>

                {/* Car Wanted */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">السيارة المطلوبة *</label>
                  <input
                    {...register('car_wanted')}
                    type="text"
                    placeholder="مثال: تويوتا كامري 2026"
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 transition-all ${
                      errors.car_wanted ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 focus:ring-yellow-500/30 focus:border-yellow-500/50'
                    }`}
                  />
                  {errors.car_wanted && <p className="mt-1.5 text-red-400 text-xs">{errors.car_wanted.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20 mt-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />جاري الإرسال...</>
                  ) : (
                    <>أرسل طلبك<ChevronLeft className="w-5 h-5" /></>
                  )}
                </button>
              </form>

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

        <div className="mt-10 text-center">
          <p className="text-white/20 text-xs">© 2025 معرض السيارات الفاخرة - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  )
}
