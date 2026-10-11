-- ====================================================================
-- SKEMA BASIS DATA SUPABASE (POSTGRESQL) RESMI
-- PT. RIZ PRODUCTION MULTI KREASI
-- Log Task Book & Management System
-- Sesuai Kaidah Supabase Postgres Best Practices (RLS, Indexing, Lowercase)
-- ====================================================================

-- 1. TABEL: MASTER STAFF (Karyawan & Profil)
create table if not exists public.master_staff (
  id text primary key,
  name text not null,
  full_name text,
  nickname text,
  division text not null,
  secondary_division text,
  divisions text[],
  role text not null,
  level integer default 1,
  avatar text,
  phone text,
  email text,
  password text,
  password_request text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_master_staff_division on public.master_staff(division);
create index if not exists idx_master_staff_nickname on public.master_staff(nickname);

-- 2. TABEL: DAILY REPORTS (Laporan Harian Operasional & Event)
create table if not exists public.daily_reports (
  id text primary key,
  date date not null,
  staff_name text not null,
  division text not null,
  activity text not null,
  notes text,
  photo_url text,
  photos text[],
  status text default 'Submitted',
  source text default 'web',
  sync_meta jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_daily_reports_date on public.daily_reports(date desc);
create index if not exists idx_daily_reports_staff on public.daily_reports(staff_name);
create index if not exists idx_daily_reports_division on public.daily_reports(division);
create index if not exists idx_daily_reports_composite on public.daily_reports(date, division);

-- 3. TABEL: LOGBOOK ENTRIES (Inspeksi & QC Checklist Onhouse)
create table if not exists public.logbook_entries (
  id text primary key,
  date date not null,
  division text not null,
  staff_name text not null,
  activity text not null,
  result text default 'OK',
  follow_up text,
  status text default 'Close',
  verification text,
  checklists jsonb default '{}'::jsonb,
  photo_url text,
  photos text[],
  source text default 'web',
  sync_meta jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_logbook_entries_date on public.logbook_entries(date desc);
create index if not exists idx_logbook_entries_division on public.logbook_entries(division);
create index if not exists idx_logbook_entries_staff on public.logbook_entries(staff_name);
create index if not exists idx_logbook_entries_status on public.logbook_entries(status);

-- 4. TABEL: FINDINGS (Temuan Kerusakan & Kerusakan Unit)
create table if not exists public.findings (
  id text primary key,
  date_created date not null,
  equipment text not null,
  asset_code text,
  division text not null,
  issue_description text not null,
  severity text default 'Medium',
  status text default 'Open',
  pic text not null,
  target_date date,
  completion_date date,
  action_plan text,
  cost_estimate numeric default 0,
  photo_url text,
  photos text[],
  sync_meta jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_findings_status on public.findings(status);
create index if not exists idx_findings_division on public.findings(division);
create index if not exists idx_findings_pic on public.findings(pic);

-- 5. TABEL: WORK ORDERS (Perintah Kerja Servis / Pemeliharaan)
create table if not exists public.work_orders (
  id text primary key,
  title text not null,
  type text default 'Corrective',
  division text not null,
  equipment text not null,
  description text not null,
  priority text default 'Medium',
  status text default 'Pending',
  pic text not null,
  progress integer default 0,
  date_created date not null,
  deadline date not null,
  completed_at timestamptz,
  sync_meta jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_work_orders_status on public.work_orders(status);
create index if not exists idx_work_orders_division on public.work_orders(division);
create index if not exists idx_work_orders_pic on public.work_orders(pic);

-- 6. TABEL: DAILY TASKS (Tugas Harian Staff)
create table if not exists public.daily_tasks (
  id text primary key,
  title text not null,
  division text not null,
  assigned_to text,
  assigned_name text not null,
  due_date date,
  status text default 'Todo',
  priority text default 'Normal',
  notes text,
  created_by text,
  sync_meta jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_daily_tasks_status on public.daily_tasks(status);
create index if not exists idx_daily_tasks_assigned on public.daily_tasks(assigned_name);

-- 7. TABEL: ATTENDANCE LOGS (Log Absensi & Shift Masuk/Pulang)
create table if not exists public.attendance_logs (
  id text primary key,
  staff_id text not null,
  staff_name text not null,
  division text not null,
  date date not null,
  check_in_time text,
  check_in_photo text,
  check_in_gps text,
  check_out_time text,
  check_out_photo text,
  check_out_gps text,
  status text default 'Hadir',
  is_late boolean default false,
  late_minutes integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_attendance_logs_date on public.attendance_logs(date desc);
create index if not exists idx_attendance_logs_staff on public.attendance_logs(staff_id);

-- 8. TABEL: SYSTEM CONFIGS (Konfigurasi & Matrix Kompetensi)
create table if not exists public.system_configs (
  key text primary key,
  data jsonb not null,
  updated_by text,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Mengizinkan pembacaan dan penulisan terotentikasi / public anon key
-- ====================================================================

alter table public.master_staff enable row level security;
alter table public.daily_reports enable row level security;
alter table public.logbook_entries enable row level security;
alter table public.findings enable row level security;
alter table public.work_orders enable row level security;
alter table public.daily_tasks enable row level security;
alter table public.attendance_logs enable row level security;
alter table public.system_configs enable row level security;

-- Policy untuk public / anon access
create policy "Allow all read on master_staff" on public.master_staff for select using (true);
create policy "Allow all write on master_staff" on public.master_staff for all using (true) with check (true);

create policy "Allow all read on daily_reports" on public.daily_reports for select using (true);
create policy "Allow all write on daily_reports" on public.daily_reports for all using (true) with check (true);

create policy "Allow all read on logbook_entries" on public.logbook_entries for select using (true);
create policy "Allow all write on logbook_entries" on public.logbook_entries for all using (true) with check (true);

create policy "Allow all read on findings" on public.findings for select using (true);
create policy "Allow all write on findings" on public.findings for all using (true) with check (true);

create policy "Allow all read on work_orders" on public.work_orders for select using (true);
create policy "Allow all write on work_orders" on public.work_orders for all using (true) with check (true);

create policy "Allow all read on daily_tasks" on public.daily_tasks for select using (true);
create policy "Allow all write on daily_tasks" on public.daily_tasks for all using (true) with check (true);

create policy "Allow all read on attendance_logs" on public.attendance_logs for select using (true);
create policy "Allow all write on attendance_logs" on public.attendance_logs for all using (true) with check (true);

create policy "Allow all read on system_configs" on public.system_configs for select using (true);
create policy "Allow all write on system_configs" on public.system_configs for all using (true) with check (true);
