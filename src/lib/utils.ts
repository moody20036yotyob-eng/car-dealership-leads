import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { LeadStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0')) return '966' + cleaned.slice(1)
  if (cleaned.startsWith('966')) return cleaned
  return '966' + cleaned
}

export function formatPhoneDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('966')) {
    const local = '0' + cleaned.slice(3)
    return local.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
  }
  if (cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
  }
  return phone
}

export function getWhatsAppUrl(phone: string, message?: string): string {
  const formatted = formatPhone(phone)
  const encodedMessage = message
    ? encodeURIComponent(message)
    : encodeURIComponent('السلام عليكم، معك من معرض السيارات بخصوص طلبك.')
  return `https://wa.me/${formatted}?text=${encodedMessage}`
}

export function getTelUrl(phone: string): string {
  const formatted = formatPhone(phone)
  return `tel:+${formatted}`
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'جديد',
  contacted: 'تم التواصل',
  interested: 'مهتم',
  appointment: 'موعد',
  sold: 'تم البيع',
  not_interested: 'غير مهتم',
}

export const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  contacted: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  interested: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  appointment: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  sold: 'bg-green-500/20 text-green-300 border-green-500/30',
  not_interested: 'bg-red-500/20 text-red-300 border-red-500/30',
}

export const LEAD_STATUSES: LeadStatus[] = [
  'new',
  'contacted',
  'interested',
  'appointment',
  'sold',
  'not_interested',
]

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('ar-SA', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}
