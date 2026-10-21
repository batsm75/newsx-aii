# News x AI — XAUUSD Prediction Engine (Full-Stack, tanpa Apps Script)

Backend: **Vercel Serverless Functions** (`/api/*`) + **Supabase Postgres** (database) + **Vercel Cron** (prediksi otomatis menjelang sesi New York).
Frontend: `index.html` statis (sama seperti mockup, tapi sudah konek ke API beneran + login).

## Langkah Deploy (±10 menit)

### 1. Buat database Supabase (gratis)
1. Daftar di https://supabase.com (pakai GitHub) → **New Project** → tunggu sampai ready.
2. Buka menu **SQL Editor** → paste isi file `setup.sql` → klik **Run**.
3. Buka **Project Settings → API** → catat:
   - `Project URL` (contoh: `https://xxxx.supabase.co`)
   - `service_role` key (RAHASIA — jangan dibagikan)

### 2. Deploy ke Vercel
1. Buka https://vercel.com/new → **Upload** folder `newsx-ai-fullstack` ini (drag & drop).
2. Beri nama project → **Deploy** → tunggu sampai dapat URL.
3. Buka **Project Settings → Environment Variables**, tambahkan:

| Nama | Isi |
|---|---|
| `SUPABASE_URL` | `https://xxxx.supabase.co` (dari langkah 1) |
| `SUPABASE_SERVICE_KEY` | `service_role` key (dari langkah 1) |
| `JWT_SECRET` | string acak panjang (misal hasil dari `openssl rand -hex 32`) |
| `SUPER_ADMIN_EMAIL` | `baysdarma0826@gmail.com` (sesuai PRD) |
| `TWELVEDATA_API_KEY` | API key dari https://twelvedata.com (gratis 800 req/hari) |
| `GEMINI_API_KEY` | API key dari https://aistudio.google.com (gratis) |
| `SOSOVALUE_API_KEY` | API key SosoValue (opsional — kosongkan jika belum punya) |
| `SOSOVALUE_URL` | endpoint SosoValue (opsional) |
| `CRON_SECRET` | string acak (opsional, untuk proteksi endpoint cron) |

4. **Redeploy** (Deployments → ⋯ → Redeploy) agar env var terbaca.

### 3. Pakai aplikasinya
1. Buka URL Vercel kamu → tab **Daftar** → daftar dengan email `baysdarma0826@gmail.com` → otomatis jadi **Super Admin** & langsung bisa login.
2. Akun Trader lain yang daftar akan berstatus **Pending** → disetujui lewat menu Admin.
3. Prediksi AI berjalan otomatis **setiap hari Senin–Jumat pukul 18:30 WIB** (cron `30 11 * * 1-5` UTC). Untuk tes manual: buka `https://domain-kamu.vercel.app/api/cron-predict` di browser.

## Catatan Penting
- **Tanpa API key TwelveData & Gemini**, cron prediksi akan error → tambahkan kedua key itu di env var.
- Endpoint SosoValue di `api/cron-predict.js` mungkin perlu disesuaikan dengan dokumentasi resmi SosoValue (sudah disiapkan lewat env `SOSOVALUE_URL`).
- Notifikasi email (sesuai PRD) bisa ditambah dengan **Resend** (gratis 3000 email/bulan) di dalam `cron-predict.js` — opsional.
- Ini bukan saran investasi.
