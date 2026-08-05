# LPK Humaira Institute — Official Website & Registration System

Website resmi dan sistem pendaftaran calon mahasiswa/peserta pelatihan **LPK Humaira Institute** (Sending Organization resmi Kemenaker RI untuk program pelatihan dan penyaluran kerja ke Jepang).

---

## 🚀 Teknologi Yang Digunakan

- **Frontend Core**: React 18, Vite 5, React Router DOM v6
- **Styling & UI**: Tailwind CSS, Headless UI, Heroicons v2
- **Database & Backend**: Firebase Firestore (Spark 100% Free Plan)
- **Media & Document Storage**: Cloudinary Direct Unsigned API (25GB Free Storage)
- **Notifikasi Pendaftaran**: Telegram Bot API (`@lpk_humaira_notif_bot`)

---

## 📁 Struktur Folder Project (`/src`)

```
src/
├── assets/
│   ├── hero/                 # Gambar slideshow background hero (hero-1.jpg .. hero-5.jpg)
│   ├── images/               # Logo brand, hero-banner.jpg, hero-fasilitas.jpg, favicon
│   └── icons/                # Icon sosial media (icon-ig.png, icon-fb.png, icon-tiktok.png)
├── components/
│   ├── common/               # Komponen UI Reusable Kecil (FormInput, FileUpload, WarningBox, dll)
│   ├── layout/               # Komponen Structural Layout (Layout, Navbar, Footer, MegaMenu, MobileMenu)
│   └── sections/             # Komponen Section Halaman (HeroSection, HeroBackgroundSlider, StepTimeline, dll)
├── config/                   # Data Statis Navigasi & Dictionary Halaman (navigationData.js, pagesContent.js)
├── firebase/                 # Integrasi Services (config.js, firestore.js, storage.js)
├── hooks/                    # Custom React Hooks (useRegistrationForm.js)
├── utils/                    # Utility & Validator (validators.js)
├── pages/                    # Route Halaman Utama (Home.jsx, Pendaftaran.jsx, SuksesPendaftaran.jsx, GenericPage.jsx)
└── styles/                   # Stylesheet Global (index.css)
```

---

## 🛠️ Cara Menginstall & Menjalankan di Lokal

1. **Clone repository ini**:
   ```bash
   git clone <repository-url>
   cd WebHai
   ```

2. **Install seluruh dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables (`.env`)**:
   Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Isi credentials Firebase, Cloudinary, dan Telegram Bot Token Anda.

4. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:3000/`.

5. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## 🔒 Fitur Keamanan & Performa

- **No Credit Card Required**: Integrasi Cloudinary direct upload & Telegram Bot API bekerja 100% pada free tier tanpa memerlukan Firebase Blaze plan.
- **Strict Firestore Rules**: Aturan keamanan `firestore.rules` membatasi akses publik hanya untuk tindakan `create` pada formulir pendaftaran.
- **Crossfade & Slide Animation**: Hero background slider dilengkapi dengan preloading gambar & penanganan memori bebas kebocoran (*memory-leak free*).
