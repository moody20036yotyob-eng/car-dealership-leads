ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS client_type TEXT CHECK (client_type IN ('individual', 'company')),
  ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('cash', 'finance')),
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS car_wanted TEXT;
