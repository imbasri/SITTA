# 🎓 SITTA - Sistem Informasi Toko Buku Terbuka

**Single Page Application (SPA)** untuk pemesanan buku Universitas Terbuka dengan fitur lengkap termasuk admin panel dan public tracking.

## ✨ Fitur Utama

### 👥 Untuk User
- 📚 **Katalog Buku** - Browse 60+ buku UT dari berbagai program studi
- 🛒 **Keranjang Belanja** - Tambah/hapus buku, lihat total
- 💳 **Pembayaran** - QR Code QRIS untuk pembayaran
- 📦 **Riwayat Pesanan** - Lihat semua pesanan
- 🚚 **Tracking Pengiriman** - Timeline detail status pengiriman
- 👤 **My Profile** - Edit profil dan kelola alamat pengiriman
- 🔍 **Public Tracking** - Lacak pesanan tanpa login (nama & alamat di-mask)

### 🔐 Untuk Admin
- ➕ **Tambah Buku** - Tambah buku baru ke katalog
- ✏️ **Edit Buku** - Update info buku (judul, harga, stok, semester)
- 🗑️ **Hapus Buku** - Hapus buku dari katalog
- 📊 **Kelola Pesanan** - Lihat semua pesanan dan status
- 🚀 **Update Status** - Update status pengiriman dengan timeline

## 🚀 Quick Start

### 1. Clone/Download Project
```bash
cd "c:\Users\anind\imbasri\Student\Kuliahan\semester 4\tugas_web"
```

### 2. Start Local Server
```bash
python -m http.server 8000
```

### 3. Buka di Browser
```
http://localhost:8000
```

## 🔑 Login Credentials

### Admin Account
- Email: `admin@sitta.ac.id`
- Password: `admin123`
- Akses: Admin Dashboard (kelola buku & pesanan)

### User Account (Demo Mode)
- Email: **any email**
- Password: **any password (min 6 karakter)**
- Semua email/password diterima untuk testing

## 📁 Struktur Project

```
tugas_web/
├── index.html          # Main HTML file (SPA)
├── css/
│   └── style.css       # Styling & animations
├── js/
│   ├── data.js         # Katalog buku (60+ items)
│   └── script.js       # Main JavaScript logic
├── scraper/
│   ├── scrape_books.py # Web scraper untuk pustaka.ut.ac.id
│   ├── update_data.py  # Script untuk update data.js
│   └── output_books.json # Hasil scraping
├── ADMIN_GUIDE.md      # Panduan lengkap admin
└── README.md           # File ini
```

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: localStorage (client-side)
- **Payment**: QRCode.js for QRIS
- **Server**: Python http.server (development)
- **Scraper**: Python (requests, BeautifulSoup4)

## 📚 Data Buku

### Sumber Data
1. **Manual**: 50+ buku dari berbagai prodi (Sistem Informasi, dll)
2. **Scraping**: 10 buku Administrasi Bisnis dari pustaka.ut.ac.id

### Program Studi
- Sistem Informasi
- Administrasi Bisnis (NEW - dari scraping)
- Ilmu Sosial
- Dan lainnya...

### Total: 60+ Buku

## 🔄 Web Scraping

Scraper berhasil mengambil **10 buku** dari https://pustaka.ut.ac.id/lib/ruangbaca/

### Jalankan Scraper
```bash
cd scraper
pip install -r requirements.txt
python scrape_books.py
python update_data.py
```

### Hasil Scraping
- Filter otomatis: hanya buku dengan kode valid (ADBI4211, dll)
- Gambar: dari pustaka.ut.ac.id
- Output: `new_books.js` siap di-merge ke `data.js`

## 🎨 Fitur UI/UX

### Design
- **Responsive Design** - Mobile & desktop friendly
- **Smooth Animations** - Fade in, slide up, transitions
- **Modal Dialogs** - Untuk detail buku, forms, dll
- **Status Badges** - Color-coded untuk status pengiriman
- **Image Fallback** - Otomatis hide broken images

### Pages
1. **Auth Page** - Login/Register
2. **Public Tracking** - Lacak pesanan tanpa login
3. **Catalog** - Browse semua buku
4. **Cart** - Review & checkout
5. **History** - Riwayat pemesanan
6. **Shipping** - Tracking detail
7. **Profile** - Edit profile & addresses
8. **Admin** - Dashboard admin (tabs: Books & Orders)

## 🔒 Privacy & Security

### Public Tracking
- **Nama di-mask**: `Budi Santoso` → `B...o`
- **Alamat di-mask**: `Jl. Sudirman No. 123` → `Jl....123`
- Detail lengkap hanya untuk user yang login

### Data Storage
- localStorage (client-side)
- Not recommended for production
- Use backend database (MySQL/PostgreSQL) untuk real app

## 🧪 Testing Guide

### Test User Flow
1. Register akun baru
2. Browse katalog, tambah ke cart
3. Checkout dengan alamat
4. Bayar dengan QR Code
5. Lihat di "Riwayat Pesanan"
6. Track di "Pengiriman"
7. Edit profile & tambah alamat di "My Profile"

### Test Admin Flow
1. Login sebagai admin
2. Klik menu "⚙️ Admin"
3. Tab "📚 Kelola Buku":
   - Tambah buku baru
   - Edit stok buku existing
   - Hapus buku testing
4. Tab "📦 Kelola Pesanan":
   - Lihat pesanan user
   - Update status ke "Sedang Diproses"
   - Update lagi ke "Dalam Pengiriman"
   - Akhirnya "Terkirim"
5. Login sebagai user → cek timeline terupdate

### Test Public Tracking
1. Buat pesanan sebagai user
2. Dapatkan No. Pesanan (ORD...) dan No. Resi (RESI...)
3. Logout
4. Di halaman login, klik **"Lacak Pesanan Saya"**
5. Cari dengan No. Pesanan atau No. Resi
6. Lihat hasil dengan nama & alamat ter-mask
7. Login untuk lihat detail lengkap

## 📦 Features Completed

### ✅ Phase 1: Basic Features
- [x] Login/Register
- [x] Catalog with filters
- [x] Shopping cart
- [x] Checkout process
- [x] Payment with QR Code
- [x] Order history

### ✅ Phase 2: Enhanced Features
- [x] Shipping tracking with timeline
- [x] Public tracking without login
- [x] Data masking for privacy
- [x] My Profile page
- [x] Address management (CRUD)
- [x] Image error handling

### ✅ Phase 3: Admin Features
- [x] Admin authentication
- [x] Book management (Add/Edit/Delete)
- [x] Stock management
- [x] Semester assignment
- [x] Order management
- [x] Shipping status updates
- [x] Timeline management

### ✅ Phase 4: Web Scraping
- [x] Scraper for pustaka.ut.ac.id
- [x] Filter valid books only
- [x] Auto-update data.js
- [x] 10 new books added (Administrasi Bisnis)

## 🚀 Deployment Notes

### For Production
1. **Backend Required**:
   - Node.js/Express or PHP/Laravel
   - MySQL/PostgreSQL database
   - REST API for book/order management

2. **Security**:
   - HTTPS/SSL
   - JWT authentication
   - Password hashing (bcrypt)
   - Input validation & sanitization
   - SQL injection prevention

3. **Storage**:
   - Move from localStorage to database
   - File upload for book covers
   - CDN for images

4. **Payment Integration**:
   - Real QRIS integration (Midtrans, Xendit, dll)
   - Payment verification webhook

## 📝 Documentation

- **ADMIN_GUIDE.md** - Panduan lengkap untuk admin
- **README.md** - Overview project (file ini)
- Code comments - Inline documentation di JS

## 🐛 Known Issues

1. Gambar scraping semua sama (logo perpustakaan)
   - Fix: Admin bisa update URL gambar manual
   
2. localStorage limited storage
   - Fix: Migrate to backend database

3. Client-side validation only
   - Fix: Add server-side validation

## 🎯 Future Enhancements

- [ ] Backend API (Node.js/PHP)
- [ ] Real database (MySQL/PostgreSQL)
- [ ] User reviews & ratings
- [ ] Wishlist feature
- [ ] Email notifications
- [ ] SMS/WhatsApp notifications for shipping updates
- [ ] Admin analytics dashboard
- [ ] Export orders to Excel/PDF
- [ ] Bulk book upload (CSV/Excel)
- [ ] Real QRIS payment integration

## 👨‍💻 Development

### Prerequisites
- Python 3.x (untuk local server & scraper)
- Modern browser (Chrome, Firefox, Edge)
- Text editor (VS Code recommended)

### Installation
```bash
# Clone project
git clone <repo-url>
cd tugas_web

# Install scraper dependencies
cd scraper
pip install -r requirements.txt

# Start server
cd ..
python -m http.server 8000
```

## 📄 License

Project ini dibuat untuk tugas praktik Pemrograman Web - Universitas Terbuka.

## 🙏 Credits

- **Data Buku**: Pustaka UT (https://pustaka.ut.ac.id)
- **QR Code**: QRCode.js library
- **Icons**: Emoji built-in

## 📞 Support

Untuk bantuan dan pertanyaan, silakan hubungi tim developer.

---

**SITTA** - Memudahkan akses buku UT untuk semua! 📚✨
