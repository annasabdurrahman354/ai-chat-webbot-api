# 🤖 AI Chat WebBot API

> Platform *Full-Stack* yang mengubah antarmuka web obrolan AI menjadi layanan REST API terkelola dengan dasbor admin terpusat.

---

## 📝 Tentang Proyek

Aplikasi ini berfungsi sebagai **API Wrapper** berbasis otomatisasi peramban. Inti fungsinya adalah memungkinkan sistem eksternal untuk berinteraksi dengan chatbot AI berbasis web secara terprogram melalui *endpoint* API, tanpa harus berinteraksi langsung dengan antarmuka grafis (UI) web tersebut secara manual.

### Bagaimana Cara Kerjanya?

1. **Otomatisasi Playwright**  
   Sistem menjalankan peramban Chromium di latar belakang (*headless mode*) untuk mengakses `TARGET_URL`.

2. **Interaksi Cerdas**  
   Bot secara otomatis mengklik elemen visual (seperti tombol "Diffusion Effect"), mengisi pesan pengguna ke dalam formulir, dan mengirimkannya.

3. **Ekstraksi Respons**  
   Setelah AI memberikan jawaban, bot mendeteksi elemen HTML dengan kelas `.prose-chat`, mengambil teksnya, dan mengirimkannya kembali sebagai respons JSON melalui API.

---

## ✨ Fitur Utama

- 🧠 **AI-as-a-Service**: Mengubah situs web AI manapun menjadi API yang dapat dikonsumsi oleh aplikasi lain.
- 🔐 **Manajemen Token API**: Akses ke API diamankan dengan sistem token (`sk_inv_...`). Anda dapat membuat, memantau, dan mencabut token melalui dasbor.
- 📊 **Logging & Audit**: Setiap permintaan (termasuk parameter pesan dan respons bot) dicatat secara otomatis ke dalam database SQLite untuk keperluan pemantauan.
- 🛡️ **Multi-User Role**: Membedakan hak akses antara **Admin** (kontrol penuh pengguna/token) dan **User** (manajemen token pribadi).
- 🛑 **Global Kill Switch**: Fitur khusus admin untuk menghentikan seluruh instansi peramban yang aktif dalam satu klik melalui endpoint `/api/stop`.

---

## 📂 Struktur Proyek

```text
ai-chat-webbot-api/
├── frontend/               # Dasbor Admin (React, Vite, Tailwind CSS)
├── src/                    # Logika Server (Auth & Database)
├── tests/                  # Pengujian E2E (Playwright)
├── bot.ts                  # Mesin otomatisasi peramban (Core Logic)
├── index.ts                # Server API Express & Manajemen Rute
└── playwright.config.ts    # Konfigurasi Headless Browser
```

---

## 🚀 Panduan Memulai

### Ringkasan Perintah Cepat

1. Pasang dependensi backend dan frontend

```bash
npm install
cd frontend && npm install
```

2. Install Playwright browser binaries (wajib untuk bot)

```bash
npx playwright install
```

3. Build frontend (produksi)

```bash
npm run build
```

4. Jalankan server

```bash
npm start
```

---

### Konfigurasi Environment

Buat file `.env` di root proyek dan tambahkan variabel berikut (contoh):

```env
PORT=3000
TARGET_URL=https://target-ai-website.com
JWT_SECRET=your_secret_key
```

---

### First-time: Login Admin & Buat API Token

Proyek ini men-seed satu akun admin default dengan kredensial:

- Username: `admin`
- Password: `password`

Contoh langkah menggunakan `curl` untuk login, menyimpan cookie, dan membuat token baru:

1) Login dan simpan cookie:

```bash
curl -c cookies.txt -H "Content-Type: application/json" \
   -X POST http://localhost:3000/api/auth/login \
   -d '{"username":"admin","password":"password"}'
```

2) Buat token API (menggunakan cookie session yang tersimpan):

```bash
curl -b cookies.txt -H "Content-Type: application/json" \
   -X POST http://localhost:3000/api/tokens \
   -d '{}'
```

Response akan berisi token seperti:

```json
{ "message": "Token generated", "token": "sk_inv_..." }
```

Setelah menerima `sk_inv_...` token, gunakan header `Authorization: Bearer <token>` untuk memanggil endpoint bot, mis.:

```bash
curl -H "Authorization: Bearer sk_inv_..." \
   "http://localhost:3000/api/message?message=Hello"
```

---

Jika Anda lebih suka menggunakan GUI, jalankan frontend dengan `npm start` dan buka dasbor untuk membuat/revoke token dari halaman `Tokens`.


## 🛠️ Teknologi Utama

| Komponen        | Teknologi                          |
| ---------------- | ---------------------------------- |
| Otomatisasi     | Playwright                         |
| Backend         | Express.js                         |
| Database        | SQLite (`better-sqlite3`)          |
| Frontend        | React + Vite + Tailwind CSS        |
| Bahasa          | TypeScript                         |
