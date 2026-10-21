# News x AI — XAUUSD Prediction Engine (Frontend Mockup)

Mockup frontend berdasarkan PRD `PRD-NewsXAI-XAUUSD-23.md`.
Gaya: Bloomberg Terminal (hitam + emas). Fokus: arah prediksi (Bullish/Bearish USD → Buy/Sell XAUUSD) — TANPA chart harga, TANPA entry/TP/SL.

## Deploy ke Vercel (2 cara)

### Cara A — Paling gampang (Drag & Drop, tanpa install apa-apa)
1. Buka https://vercel.com/new
2. Login / daftar (bisa pakai akun GitHub atau email)
3. Pilih tab **"Browse / Upload"** → drag folder `newsx-ai` ini ke halaman
4. Beri nama project → klik **Deploy**
5. Selesai — dapat URL `https://nama-project.vercel.app`

### Cara B — Via CLI (butuh Node.js)
```bash
npm i -g vercel
cd newsx-ai
vercel login        # login via email/GitHub
vercel --prod       # deploy ke production
```

## Catatan
- Ini mockup statis (data contoh). Backend produksi sesuai PRD = Google Apps Script + Google Sheets.
- Toggle **Trader / Admin** di atas untuk melihat perbedaan hak akses (RBAC).
