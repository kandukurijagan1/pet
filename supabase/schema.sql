-- ====================================================================
-- PawNest Pet Care & Adoption Platform • Supabase Database Schema
-- Project: kandukurijagan7-star's Project (pmqvxznvixnsnulneehi)
-- Run this in Supabase Dashboard -> SQL Editor -> Run (New Query)
-- ====================================================================

-- 1. Pets Table (Marketplace Catalog)
CREATE TABLE IF NOT EXISTS public.pets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  age TEXT,
  price NUMERIC DEFAULT 0,
  image TEXT,
  description TEXT,
  status TEXT DEFAULT 'Available',
  added_by TEXT,
  added_by_name TEXT,
  seller_masked_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Orders Table (Cash on Delivery & OTP Verification)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  pet_id TEXT,
  pet_name TEXT,
  pet_breed TEXT,
  pet_price NUMERIC DEFAULT 0,
  pet_image TEXT,
  seller_email TEXT,
  buyer_masked_id TEXT,
  buyer_city TEXT,
  buyer_mobile_masked TEXT,
  buyer_email TEXT,
  buyer_actual_name TEXT,
  buyer_actual_phone TEXT,
  buyer_actual_address TEXT,
  payment_method TEXT DEFAULT 'Cash on Delivery (COD)',
  status TEXT DEFAULT 'Order Placed (Cash on Delivery)',
  placed_at TEXT,
  delivery_otp TEXT,
  otp_sent_to TEXT,
  otp_sent_at TEXT,
  verified_with_otp BOOLEAN DEFAULT FALSE,
  apps_script_dispatched BOOLEAN DEFAULT FALSE,
  apps_script_status TEXT,
  completed_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Authorized Customers Table (Approved Sellers / Breeders)
CREATE TABLE IF NOT EXISTS public.authorized_customers (
  email TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  photo TEXT,
  phone TEXT,
  address TEXT,
  added_at TEXT,
  added_by TEXT,
  updated_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Customer Applications Table (Photo Verification)
CREATE TABLE IF NOT EXISTS public.customer_requests (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  note TEXT,
  photo TEXT,
  requested_at TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Admin & Customer Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  customer_email TEXT,
  sender_email TEXT,
  sender_name TEXT,
  sender_role TEXT,
  recipient_email TEXT,
  text TEXT,
  type TEXT,
  order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- 6. Application Configuration & State Backup Table
CREATE TABLE IF NOT EXISTS public.app_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorized_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Set RLS Policies (Allow access via Publishable & Secret API Keys)
DROP POLICY IF EXISTS "Allow all pets" ON public.pets;
CREATE POLICY "Allow all pets" ON public.pets FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all orders" ON public.orders;
CREATE POLICY "Allow all orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all customers" ON public.authorized_customers;
CREATE POLICY "Allow all customers" ON public.authorized_customers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all customer_requests" ON public.customer_requests;
CREATE POLICY "Allow all customer_requests" ON public.customer_requests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all messages" ON public.messages;
CREATE POLICY "Allow all messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all app_config" ON public.app_config;
CREATE POLICY "Allow all app_config" ON public.app_config FOR ALL USING (true) WITH CHECK (true);
