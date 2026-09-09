# PANDUAN RESMI AKSES APLIKASI RIZ-PRO LOG DI PONSEL (ANDROID & iOS)

Dokumen panduan ini ditujukan bagi seluruh staf dan manajemen PT. Riz Production Multi Kreasi untuk membuka dan memasang aplikasi **RIZ-PRO LOG** langsung melalui perangkat ponsel (smartphone) dari mana saja, **tanpa harus berada di jaringan Wi-Fi yang sama**.

---

## 1. Akses Online Resmi (Bisa Diakses dari Kuota / Internet Mana Saja)

Aplikasi telah terhubung ke cloud production dengan alamat publik resmi berkeamanan SSL (HTTPS). Anda dapat membukanya menggunakan **koneksi paket data seluler (4G/5G), Wi-Fi kantor, Wi-Fi rumah, maupun hotspot di lokasi acara/event**:

```text
https://wh-logbook-2026.web.app
```
*(Alternatif domain: `https://wh-logbook-2026.firebaseapp.com`)*

---

## 2. Panduan Pemasangan di Ponsel Android

Rekomendasi Browser: **Google Chrome**

1. **Buka Alamat:**
   Buka Google Chrome di HP Android, ketik alamat:
   `https://wh-logbook-2026.web.app`
2. **Masuk ke Akun:**
   Pilih nama akun staf atau login menggunakan kredensial Anda.
3. **Pasang Aplikasi (PWA):**
   - Akan muncul tombol biru **"Install PWA"** atau pop-up otomatis *"Tambahkan RIZ-PRO LOG ke Layar Utama"*.
   - Ketuk tombol tersebut, lalu klik **Install / Pasang**.
   - *(Jika tombol tidak muncul)*: Ketuk ikon titik tiga (⋮) di pojok kanan atas Chrome $\rightarrow$ pilih menu **"Tambahkan ke Layar Utama" (Add to Home screen)** / **"Instal aplikasi"**.
4. **Hasil:**
   Aplikasi akan memiliki ikon di layar utama ponsel dan berjalan penuh (fullscreen) seperti aplikasi Play Store.

---

## 3. Panduan Pemasangan di iPhone & iPad (iOS)

Rekomendasi Browser: **Apple Safari Resmi** *(Wajib menggunakan Safari agar fitur PWA aktif)*

1. **Buka Alamat:**
   Buka Safari di iPhone/iPad, masukkan alamat:
   `https://wh-logbook-2026.web.app`
2. **Ketuk Tombol Share (Bagikan):**
   Di bagian bawah layar Safari, ketuk tombol **Bagikan (Share)** — yaitu tombol kotak dengan panah mengarah ke atas $(\uparrow)$.
3. **Pilih Tambah ke Layar Utama:**
   Gulir ke bawah pada menu opsi yang muncul, lalu pilih **"Tambah ke Layar Utama"** (*Add to Home Screen*).
4. **Konfirmasi:**
   Pastikan judul aplikasi adalah **RIZ-PROLOG**, lalu ketuk tombol **Tambah (Add)** di sudut kanan atas.
5. **Hasil:**
   Aplikasi terpasang langsung di Homescreen iOS dengan ikon resmi, mendukung optimasi notch/dynamic island, scrolling mulus, dan bekerja tanpa frame browser.

---

## 4. Akses Offline & Sinkronisasi Cloud Otomatis

- **Dukungan Offline:** Jika staf berada di area warehouse atau lokasi event yang minim sinyal internet, aplikasi tetap dapat dibuka dan formulir tetap dapat diisi.
- **Auto-Sync:** Begitu ponsel staf mendapatkan kembali koneksi internet (baik melalui paket data kuota seluler maupun Wi-Fi), data antrean otomatis disinkronkan ke Cloud Firestore dan Google Sheets pusat.

---

## 5. Akses Khusus Pengujian Lokal (Opsional / Satu Jaringan Wi-Fi)

Jika Anda ingin mengakses server uji coba lokal pengembang saat komputer Mac sedang menjalankan `npm run dev`:
```text
http://192.168.0.101:3000
```
*(Hanya berlaku bila HP dan komputer Mac terhubung pada Wi-Fi yang sama)*.

---
*Diterbitkan oleh: Sistem Operasional & QC PT. Riz Production Multi Kreasi*
