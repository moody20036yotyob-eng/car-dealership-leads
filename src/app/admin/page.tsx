'use client'

import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Lead, LeadStats, LeadStatus } from '@/types'
import {
  Users,
  TrendingUp,
  Calendar,
  CalendarDays,
  Star,
  CheckCircle,
  Search,
  Phone,
  MessageCircle,
  LogOut,
  Car,
  RefreshCw,
  Eye,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  cn,
  STATUS_LABELS,
  STATUS_COLORS,
  LEAD_STATUSES,
  formatDate,
  formatDateShort,
  getWhatsAppUrl,
  getTelUrl,
  formatPhoneDisplay,
} from '@/lib/utils'

// -- Sub-components --

function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-1/2 mb-3" />
      <div className="h-8 bg-white/10 rounded w-1/3" />
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: number
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white/50 text-sm">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value.toLocaleString('ar-SA')}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border',
        STATUS_COLORS[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

function LeadModal({
  lead,
  onClose,
  onStatusChange,
}: {
  lead: Lead
  onClose: () => void
  onStatusChange: (id: string, status: LeadStatus) => Promise<void>
}) {
  const [updating, setUpdating] = useState(false)

  const handleStatusChange = async (status: LeadStatus) => {
    setUpdating(true)
    await onStatusChange(lead.id, status)
    setUpdating(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">تفاصيل العميل</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
              <span className="text-gold-400 font-bold">{lead.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-semibold text-white">{lead.name}</p>
              <p className="text-white/50 text-sm">{formatPhoneDisplay(lead.phone)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'المصدر', value: lead.source },
              { label: 'الحالة', value: STATUS_LABELS[lead.status] },
              { label: 'الحملة', value: lead.campaign || '—' },
              { label: 'الإعلان', value: lead.ad || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 bg-white/5 rounded-xl">
                <p className="text-white/40 text-xs mb-1">{label}</p>
                <p className="text-white text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white/5 rounded-xl">
            <p className="text-white/40 text-xs mb-1">تاريخ التسجيل</p>
            <p className="text-white text-sm">{formatDate(lead.created_at)}</p>
          </div>

          <div>
            <p className="text-white/40 text-xs mb-2">تغيير الحالة</p>
            <div className="grid grid-cols-3 gap-2">
              {LEAD_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updating || lead.status === s}
                  className={cn(
                    'py-1.5 px-2 rounded-lg text-xs font-medium border transition-all',
                    lead.status === s
                      ? STATUS_COLORS[s]
                      : 'border-white/10 text-white/50 hover:border-white/30'
                  )}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <a
              href={getTelUrl(lead.phone)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl text-sm font-medium hover:bg-blue-500/30 transition-colors"
            >
              <Phone className="w-4 h-4" />
              اتصال
            </a>
            <a
              href={getWhatsAppUrl(lead.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500/20 border border-green-500/30 text-green-300 rounded-xl text-sm font-medium hover:bg-green-500/30 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              واتساب
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// STATUS colors for charts
const PIE_COLORS: Record<LeadStatus, string> = {
  new: '#3B82F6',
  contacted: '#EAB308',
  interested: '#A855F7',
  appointment: '#F97316',
  sold: '#22C55E',
  not_interested: '#EF4444',
}

// -- Setup Required Screen --
function SetupRequired() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-4">
          <Car className="w-8 h-8 text-yellow-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">إعداد Supabase مطلوب</h2>
        <p className="text-white/50 text-sm leading-relaxed mb-4">
          لم يتم تكوين بيانات Supabase. يرجى إضافة المتغيرات التالية في ملف <code className="text-yellow-400">.env.local</code>:
        </p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-right font-mono text-xs text-green-400 space-y-1">
          <div>NEXT_PUBLIC_SUPABASE_URL=...</div>
          <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=...</div>
        </div>
        <p className="text-white/30 text-xs mt-4">ثم أعد تشغيل السيرفر</p>
      </div>
    </div>
  )
}

export default function AdminDashboardWrapper() {
  if (!isSupabaseConfigured) return <SetupRequired />
  return <AdminDashboard />
}

// -- Main Dashboard --
function AdminDashboard() {
  const router = useRouter()

  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<LeadStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')
  const [userEmail, setUserEmail] = useState('')

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/leads')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setLeads(data || [])
    } catch {
      toast.error('فشل تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setUserEmail('admin@cars.com')
    fetchLeads()
  }, [fetchLeads])

  // Compute stats from leads
  useEffect(() => {
    if (!leads.length && !loading) {
      setStats({ total: 0, today: 0, this_week: 0, this_month: 0, interested: 0, sold: 0 })
      return
    }
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(startOfDay)
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    setStats({
      total: leads.length,
      today: leads.filter((l) => new Date(l.created_at) >= startOfDay).length,
      this_week: leads.filter((l) => new Date(l.created_at) >= startOfWeek).length,
      this_month: leads.filter((l) => new Date(l.created_at) >= startOfMonth).length,
      interested: leads.filter((l) => l.status === 'interested').length,
      sold: leads.filter((l) => l.status === 'sold').length,
    })
  }, [leads, loading])

  // Filter leads
  useEffect(() => {
    let result = [...leads]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          (l.campaign && l.campaign.toLowerCase().includes(q))
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((l) => l.status === statusFilter)
    }

    const now = new Date()
    if (dateFilter === 'today') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      result = result.filter((l) => new Date(l.created_at) >= start)
    } else if (dateFilter === 'week') {
      const start = new Date(now)
      start.setDate(now.getDate() - 7)
      result = result.filter((l) => new Date(l.created_at) >= start)
    } else if (dateFilter === 'month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      result = result.filter((l) => new Date(l.created_at) >= start)
    }

    setFilteredLeads(result)
  }, [leads, search, statusFilter, dateFilter])

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()

      setLeads((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status, updated_at: new Date().toISOString() } : l
        )
      )
      if (selectedLead?.id === id) {
        setSelectedLead((prev) => (prev ? { ...prev, status } : null))
      }
      toast.success('تم تحديث الحالة بنجاح')
    } catch {
      toast.error('فشل تحديث الحالة')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  // Chart data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split('T')[0]
    const count = leads.filter((l) => l.created_at.startsWith(dateStr)).length
    return { date: formatDateShort(dateStr + 'T00:00:00'), count }
  })

  const pieData = LEAD_STATUSES.map((s) => ({
    name: STATUS_LABELS[s],
    value: leads.filter((l) => l.status === s).length,
    color: PIE_COLORS[s],
  })).filter((d) => d.value > 0)

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white" dir="rtl">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0D0D0D] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-500/30 flex items-center justify-center">
              <Car className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">معرض السيارات</p>
              <p className="text-white/40 text-xs hidden sm:block">لوحة الإدارة</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchLeads}
              className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
              title="تحديث"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-white/40 text-sm">
              <span>{userEmail}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)
          ) : stats ? (
            <>
              <StatCard
                label="إجمالي العملاء"
                value={stats.total}
                icon={Users}
                color="bg-blue-500/20 text-blue-400"
              />
              <StatCard
                label="عملاء اليوم"
                value={stats.today}
                icon={CalendarDays}
                color="bg-gold-500/20 text-gold-400"
              />
              <StatCard
                label="هذا الأسبوع"
                value={stats.this_week}
                icon={Calendar}
                color="bg-purple-500/20 text-purple-400"
              />
              <StatCard
                label="هذا الشهر"
                value={stats.this_month}
                icon={TrendingUp}
                color="bg-orange-500/20 text-orange-400"
              />
              <StatCard
                label="مهتمون"
                value={stats.interested}
                icon={Star}
                color="bg-yellow-500/20 text-yellow-400"
              />
              <StatCard
                label="تم البيع"
                value={stats.sold}
                icon={CheckCircle}
                color="bg-green-500/20 text-green-400"
              />
            </>
          ) : null}
        </div>

        {/* Charts */}
        {!loading && leads.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Area Chart */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white/70 mb-4">
                العملاء خلال آخر 7 أيام
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1A1A1A',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(v) => [`${v} عميل`, '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#D4AF37"
                    strokeWidth={2}
                    fill="url(#goldGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white/70 mb-4">توزيع الحالات</h3>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#1A1A1A',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[180px] flex items-center justify-center text-white/30 text-sm">
                  لا توجد بيانات
                </div>
              )}
              <div className="mt-2 space-y-1">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-white/60">{d.name}</span>
                    </div>
                    <span className="text-white/80 font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو الجوال أو الحملة..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-9 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500/30 text-sm transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white/70 focus:outline-none focus:ring-2 focus:ring-gold-500/20 text-sm"
          >
            <option value="all">كل الحالات</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white/70 focus:outline-none focus:ring-2 focus:ring-gold-500/20 text-sm"
          >
            <option value="all">كل الفترات</option>
            <option value="today">اليوم</option>
            <option value="week">آخر 7 أيام</option>
            <option value="month">هذا الشهر</option>
          </select>
        </div>

        {/* Leads Table / Cards */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-semibold text-white">
              العملاء{' '}
              {filteredLeads.length > 0 && (
                <span className="text-white/40 text-sm font-normal">({filteredLeads.length})</span>
              )}
            </h3>
          </div>

          {loading ? (
            <div className="divide-y divide-white/5">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="px-5 py-4 flex gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/10 rounded w-1/3" />
                      <div className="h-3 bg-white/5 rounded w-1/4" />
                    </div>
                  </div>
                ))}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-white/40 font-medium">لا توجد طلبات عملاء حتى الآن</p>
              <p className="text-white/20 text-sm mt-1">ستظهر هنا جميع طلبات العملاء الجديدة.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {[
                        'الاسم',
                        'رقم الجوال',
                        'المصدر',
                        'الحملة',
                        'الإعلان',
                        'الحالة',
                        'تاريخ التسجيل',
                        'الإجراءات',
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-right text-xs text-white/40 font-medium"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="flex items-center gap-2 hover:text-gold-400 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-sm font-bold flex-shrink-0">
                              {lead.name.charAt(0)}
                            </div>
                            <span className="text-white text-sm font-medium">{lead.name}</span>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-white/60 text-sm">
                          {formatPhoneDisplay(lead.phone)}
                        </td>
                        <td className="px-4 py-3 text-white/60 text-sm">{lead.source}</td>
                        <td className="px-4 py-3 text-white/60 text-sm">
                          {lead.campaign || '—'}
                        </td>
                        <td className="px-4 py-3 text-white/60 text-sm">{lead.ad || '—'}</td>
                        <td className="px-4 py-3">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value as LeadStatus)
                            }
                            className={cn(
                              'rounded-lg px-2 py-1 text-xs font-medium border bg-transparent cursor-pointer focus:outline-none',
                              STATUS_COLORS[lead.status]
                            )}
                          >
                            {LEAD_STATUSES.map((s) => (
                              <option key={s} value={s} className="bg-[#1A1A1A] text-white">
                                {STATUS_LABELS[s]}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-white/40 text-xs">
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <a
                              href={getTelUrl(lead.phone)}
                              className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                              title="اتصال"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={getWhatsAppUrl(lead.phone)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                              title="واتساب"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 transition-colors"
                              title="تفاصيل"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-white/5">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-bold">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{lead.name}</p>
                          <p className="text-white/50 text-xs">{formatPhoneDisplay(lead.phone)}</p>
                        </div>
                      </div>
                      <StatusBadge status={lead.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-white/30 text-xs">{formatDate(lead.created_at)}</p>
                      <div className="flex items-center gap-2">
                        <a
                          href={getTelUrl(lead.phone)}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-400"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={getWhatsAppUrl(lead.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-green-500/10 text-green-400"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-2 rounded-lg bg-white/5 text-white/40"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}
