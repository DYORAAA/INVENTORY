# Inventaris Peralatan TKJ (Project)

Deskripsi singkat
------------------
Proyek ini adalah aplikasi inventaris sederhana untuk keperluan laboratorium atau kelas TKJ.
Aplikasi berjalan sebagai halaman statis (HTML/JS) yang menyimpan data di localStorage pada browser.
Fitur tambahan yang diimplementasikan: riwayat peminjaman, notifikasi Telegram (opsional), pemindaian QR, dan ekspor data.

Cara cepat menjalankan (untuk demo/presentasi)
------------------------------------------------
1. Buka terminal di folder proyek (`/home/rizki181007/project`).
2. Jalankan server statis sederhana, mis. dengan Python:

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000/index.html
```

3. Login demo: username `admin`, password `tkj123`.

Fitur utama (singkat untuk presentasi)
-------------------------------------
- Login admin (demo) — akses dashboard manajemen.
- Manajemen inventaris — tambah / edit / hapus barang (termasuk foto dan QR code).
- Peminjaman & pengembalian — ubah status ke `Dipinjam` / `Baik` dan catat kejadian.
- Riwayat peminjaman — lihat semua aksi (pinjam, kembali, laporan rusak), export CSV, dan hapus semua.
- Notifikasi Telegram (opsional) — kirim pesan ke chat atau grup menggunakan Bot Telegram.
- Scan QR — halaman scanner untuk memindai kode barang dan konfirmasi peminjaman.

Struktur file dan penjelasan (untuk slide presentasi)
---------------------------------------------------
- `index.html` — Halaman login. Menyertakan desain UI/animasi; skrip login dan toggle box dipisah ke `login.js`.
- `dashboard.html` — Halaman utama admin: daftar inventaris, form tambah/edit, statistik ringkas, tombol ekspor, dan akses ke pemindaian QR serta riwayat.
- `history.html` — Halaman yang menampilkan riwayat (pinjam/kembali/rusak), tombol export CSV dan clear.
- `qr-scanner.html` — Halaman untuk memindai QR menggunakan `html5-qrcode` dan mengkonfirmasi peminjaman.

- `script.js` — Logika utama aplikasi:
	- Penyimpanan inventaris di `localStorage` (key: `inventarisTKJ`).
	- Menampilkan tabel, hitung statistik, edit/hapus.
	- Handler peminjaman (`triggerNotifPinjam`) dan laporan rusak (`triggerNotifRusak`) yang juga menulis ke riwayat.
	- Fungsi untuk menerima peminjaman dari scanner (`konfirmasiPinjamByKode`).

- `notif.js` — Logika pengiriman notifikasi Telegram:
	- Mencoba memuat konfigurasi dari `config.json` (jika ada) atau memakai fallback.
	- Fungsi publik: `notifPinjam`, `notifRusak`, `notifKembali`.
	- Peringatan: menaruh token di client-side tidak aman; untuk produksi gunakan server proxy.

- `history.js` — Manajemen riwayat peminjaman di `localStorage` (key: `loanHistory`):
	- API: `addHistory`, `getHistory`, `clearHistory`, `exportHistoryCSV`, `renderHistory`.
	- Menyediakan rendering tabel untuk `history.html`.

- `login.js` — Skrip terpisah untuk login UI/toggle dan handler tombol login (dipisah dari `index.html`).
- `qr-scanner.js` — Skrip terpisah untuk inisialisasi kamera, switching kamera, stop/start, dan konfirmasi peminjaman dari scanner.

- `excel.js`, `ui-anim.js`, `style.css` — Helper untuk ekspor XLSX, animasi UI, dan styling.

Konfigurasi Telegram
---------------------
- Contoh file: `config.example.json` — jangan commit file `config.json` yang berisi token nyata.
- Untuk demo lokal, buat file `config.json` di root proyek (sama level dengan `index.html`) berisi:

```json
{
	"BOT_TOKEN": "123456789:ABCDEF_your_bot_token_here",
	"CHAT_ID": "123456789"
}
```

- Catatan keamanan: meletakkan BOT_TOKEN di client browser berisiko (siapa pun bisa melihatnya). Untuk produksi, buat server proxy (mis. Node/Express) yang menyimpan token dan meneruskan notifikasi dari client.

Langkah demo singkat (alur presentasi)
-------------------------------------
1. Tunjukkan `index.html` — desain dan cara membuka form login (klik ikon untuk expand).
2. Login sebagai `admin` → buka `dashboard.html`.
3. Demo tambah barang: isi nama, kode, jumlah, upload foto (opsional), simpan.
4. Tunjukkan QR yang dibuat otomatis untuk setiap barang.
5. Klik `Notif Pinjam` pada sebuah item, masukkan nama peminjam → perlihatkan perubahan status dan masuk di `history.html`.
6. Buka `qr-scanner.html` (di tab lain) dan scan kode dari layar (atau masukkan langsung) → konfirmasi peminjaman via scanner.
7. Tunjukkan `history.html` → export CSV dan clear.
8. Jika ingin, jelaskan bagaimana notifikasi Telegram bekerja dan sarankan penggunaan server untuk keamanan.

Catatan teknis singkat untuk Q&A
-------------------------------
- Penyimpanan: seluruh data disimpan di `localStorage` browser — aplikasi ini cocok untuk demo dan penggunaan lokal, bukan multi-user produksi.
- Modularisasi: beberapa skrip sudah dipisah (`login.js`, `qr-scanner.js`, `history.js`, `notif.js`) untuk memudahkan presentasi dan maintenance.
- Untuk menjadikan ini multi-user/produksi: butuh backend (API + database) dan otentikasi yang aman.

Butuh yang lain untuk presentasi?
--------------------------------
Saya bisa:
- Buatkan slide ringkas (Markdown -> PDF) yang berisi poin-poin presentasi.
- Tambah server proxy minimal (Node) untuk mengamankan token Telegram.
- Pecah `script.js` lebih jauh menjadi modul (items/storage/ui) jika Anda ingin penjelasan kode lebih mendetail.

-- Selesai --

Fitur tambahan:

- Riwayat peminjaman disimpan di localStorage dan dapat dilihat pada `history.html`.
- Notifikasi Telegram: letakkan `config.json` di folder yang sama (tidak termasuk di repo) atau edit `notif.js` untuk menambahkan `BOT_TOKEN` dan `CHAT_ID` (tidak direkomendasikan untuk produksi).

Contoh `config.example.json` disertakan sebagai panduan.

Catatan keamanan: menyimpan token bot di client-side tidak aman untuk produksi. Untuk penggunaan nyata, buat endpoint server yang menyimpan token dengan aman dan yang menerima event dari client untuk diteruskan ke Telegram.
