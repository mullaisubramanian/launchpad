-- ========================================================================
-- LaunchBridge: Supabase Database Schema & Seed Data
-- Project ID: zkwnoyjuzsogsrwarjpk
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zkwnoyjuzsogsrwarjpk/sql/new
-- ========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (User accounts & roles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  role TEXT NOT NULL CHECK (role IN ('startup', 'investor', 'pilot', 'grant')),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  pass TEXT DEFAULT 'demo123',
  org TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SCHEMES TABLE (Opportunities created by investors, pilots, grants)
CREATE TABLE IF NOT EXISTS public.schemes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type TEXT NOT NULL CHECK (type IN ('investor', 'pilot', 'grant')),
  owner_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  name TEXT NOT NULL,
  amount TEXT NOT NULL,
  dept TEXT NOT NULL,
  grant_kind TEXT CHECK (grant_kind IN ('Grant', 'Scheme') OR grant_kind IS NULL),
  "desc" TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. APPLICATIONS TABLE (Startup proposals to schemes)
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  scheme_id TEXT NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  startup_name TEXT NOT NULL,
  "desc" TEXT NOT NULL,
  file_name TEXT,
  file_data TEXT,
  status TEXT NOT NULL DEFAULT 'Registered' CHECK (status IN ('Registered', 'Accepted', 'Rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_scheme_applicant UNIQUE (scheme_id, user_id)
);

-- Helpful Query Indexes
CREATE INDEX IF NOT EXISTS idx_schemes_type ON public.schemes(type);
CREATE INDEX IF NOT EXISTS idx_schemes_dept ON public.schemes(dept);
CREATE INDEX IF NOT EXISTS idx_schemes_owner ON public.schemes(owner_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_scheme ON public.applications(scheme_id);

-- Enable Row Level Security (RLS) with open read access
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Anonymous public policies for app interaction
CREATE POLICY "Public profiles access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public schemes access" ON public.schemes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public applications access" ON public.applications FOR ALL USING (true) WITH CHECK (true);

-- ========================================================================
-- SEED DATA (Demo accounts & initial platform opportunities)
-- ========================================================================

-- Insert Initial Users
INSERT INTO public.profiles (id, role, name, phone, email, pass, city, state, pincode, org, created_at)
VALUES
  ('u_startup1', 'startup', 'Arjun Kumar', '9876543210', 'startup@demo.in', 'demo123', 'Coimbatore', 'Tamil Nadu', '641001', 'New Creative', '2026-01-10T10:00:00Z'),
  ('u_investor1', 'investor', 'Ravi Shankar', '9845123456', 'investor@demo.in', 'demo123', 'Chennai', 'Tamil Nadu', '600001', 'Simple Invest', '2026-01-05T09:00:00Z'),
  ('u_pilot1', 'pilot', 'Meena Lakshmi', '9789012345', 'pilot@demo.in', 'demo123', 'Tiruppur', 'Tamil Nadu', '641601', 'XYZ Logistics', '2026-01-08T11:30:00Z'),
  ('u_grant1', 'grant', 'Dr. Vijay Kumar', '9123456780', 'grant@demo.in', 'demo123', 'New Delhi', 'Delhi', '110001', 'Central Government', '2026-01-02T14:15:00Z'),
  ('u_startup2', 'startup', 'Suresh Prabhu', '9940123456', 'abcdd@gmail.com', 'demo123', 'Madurai', 'Tamil Nadu', '625001', 'Migrate Bee', '2026-02-12T08:00:00Z')
ON CONFLICT (email) DO NOTHING;

-- Insert Initial Schemes
INSERT INTO public.schemes (id, type, owner_id, company, name, amount, dept, grant_kind, "desc", eligibility, created_at)
VALUES
  ('s_inv_1', 'investor', 'u_investor1', 'Simple Invest', 'Innovation Power', '2000000', 'Ecommerce', NULL, 'Early stage capital for next-gen direct-to-consumer and retail supply chain platforms.', 'No age limit', '2026-02-01T10:00:00Z'),
  ('s_inv_2', 'investor', 'u_investor1', 'Simple Invest', 'AgriTech Seed Circle', '500000-2500000', 'Agriculture', NULL, 'Funding technology-driven post-harvest and precision farming startups across India.', 'Working prototype or farm pilots completed.', '2026-02-10T12:00:00Z'),
  ('s_plt_1', 'pilot', 'u_pilot1', 'XYZ Logistics', 'Innovative Ignite Fund', '500000-1000000', 'Logistics', NULL, 'Paid corporate pilot with our regional fulfillment hubs and fleet network across South India.', 'No age limit to apply', '2026-02-05T14:00:00Z'),
  ('s_grt_1', 'grant', 'u_grant1', 'Central Government', 'Agri Help Grant', '100000', 'Agriculture', 'Grant', 'Non-dilutive grant support for registered small agricultural innovators and organic processors.', 'Registered entity with DPIIT recognition.', '2026-01-20T11:00:00Z'),
  ('s_grt_2', 'grant', 'u_grant1', 'Central Government', 'Initiatives for Development and Innovation Scheme', '1000000', 'IT & Software', 'Scheme', 'Scheme for open-source AI, sovereign cloud technologies and digital infrastructure.', 'Indian owned and controlled startup with demonstrable tech stack.', '2026-01-25T15:30:00Z')
ON CONFLICT (id) DO NOTHING;

-- Insert Initial Applications
INSERT INTO public.applications (id, scheme_id, user_id, startup_name, "desc", file_name, file_data, status, created_at, updated_at)
VALUES
  ('app_1', 's_inv_1', 'u_startup2', 'New Creative', 'Building a headless omni-channel distribution engine for homegrown fashion brands.', 'NewCreative_PitchDeck.pdf', 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXprKW1', 'Registered', '2026-02-15T10:30:00Z', '2026-02-15T10:30:00Z'),
  ('app_2', 's_inv_1', 'u_startup1', 'New Creative', 'Scale-up expansion round targeting 10 tier-2 cities warehouse integrations.', 'PitchDeck_v3.pdf', 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXprKW1', 'Accepted', '2026-02-16T11:00:00Z', '2026-02-18T16:20:00Z'),
  ('app_3', 's_plt_1', 'u_startup1', 'Migrate Bee', 'Autonomous route optimization software reducing last-mile carbon footprint by 22%.', 'Pilot_Proposal_XYZ.docx', 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQAAAAIA', 'Registered', '2026-02-17T09:15:00Z', '2026-02-17T09:15:00Z'),
  ('app_4', 's_grt_2', 'u_startup1', 'Buzz AI', 'Multilingual low-resource speech intelligence model for public service delivery.', 'Grant_Proposal_BuzzAI.pdf', 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXprKW1', 'Registered', '2026-02-18T14:40:00Z', '2026-02-18T14:40:00Z')
ON CONFLICT (id) DO NOTHING;
