-- setup.sql — jalankan di Supabase → SQL Editor → paste → Run
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  role text not null default 'Trader',
  status text not null default 'Pending',
  created_at timestamptz default now()
);
create table if not exists jadwal_news (
  id bigserial primary key,
  tanggal date,
  event text,
  dampak text,
  actual text,
  forecast text,
  previous text,
  sumber text,
  created_at timestamptz default now()
);
create table if not exists riwayat_prediksi (
  id bigserial primary key,
  created_at timestamptz default now(),
  event_terkait text,
  arah text,
  rekomendasi text,
  model_ai text,
  confidence numeric default 0,
  alasan text,
  status text default 'Menunggu'
);
create table if not exists ulasan_pengguna (
  id bigserial primary key,
  created_at timestamptz default now(),
  email text,
  prediksi_id bigint,
  penilaian text,
  komentar text
);
create table if not exists form_saran (
  id bigserial primary key,
  created_at timestamptz default now(),
  email text,
  isi text
);
create table if not exists app_settings (
  key text primary key,
  value text
);
insert into app_settings(key,value) values ('model_ai','gemini-2.5-flash') on conflict (key) do nothing;
-- Catatan: email baysdarma0826@gmail.com otomatis jadi Super Admin saat register pertama kali (lihat api/auth.js).
