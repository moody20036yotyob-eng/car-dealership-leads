export type LeadStatus = 'new' | 'contacted' | 'interested' | 'appointment' | 'sold' | 'not_interested'

export interface Lead {
  id: string
  name: string
  phone: string
  status: LeadStatus
  source: string
  campaign: string | null
  ad: string | null
  client_type: 'individual' | 'company' | null
  payment_method: 'cash' | 'finance' | null
  nationality: 'citizen' | 'resident' | null
  city: string | null
  car_wanted: string | null
  created_at: string
  updated_at: string
}

export interface LeadStats {
  total: number
  today: number
  this_week: number
  this_month: number
  interested: number
  sold: number
}

export interface DailyLeadCount {
  date: string
  count: number
}

export interface StatusCount {
  status: LeadStatus
  count: number
}
