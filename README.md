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

### 1. Instalasi

```bash
npm install
```

---

### 2. Konfigurasi Environment

Buat file `.env` dan tambahkan variabel berikut:

```env
PORT=3000
TARGET_URL=https://target-ai-website.com
JWT_SECRET=your_secret_key
```

---

### 3. Menjalankan Aplikasi

```bash
# Jalankan Backend (Server & Bot)
npm start

# Jalankan Frontend (Dasbor)
cd frontend && npm run dev
```

---

## 🛠️ Teknologi Utama

| Komponen        | Teknologi                          |
| ---------------- | ---------------------------------- |
| Otomatisasi     | Playwright                         |
| Backend         | Express.js                         |
| Database        | SQLite (`better-sqlite3`)          |
| Frontend        | React + Vite + Tailwind CSS        |
| Bahasa          | TypeScript                         |
