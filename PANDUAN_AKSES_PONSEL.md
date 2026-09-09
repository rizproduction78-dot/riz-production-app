# PANDUAN RESMI AKSES APLIKASI RIZ-PRO LOG DI PONSEL (ANDROID & iOS)

Dokumen panduan ini ditujukan bagi seluruh staf dan pengguna PT. Riz Production Multi Kreasi untuk membuka serta memasang aplikasi **RIZ-PRO LOG** langsung melalui perangkat ponsel (smartphone).

---

## 1. Syarat Utama Koneksi

Sebelum membuka di ponsel, pastikan:
1. Ponsel Anda dan Komputer Server (Mac) terhubung pada **jaringan Wi-Fi / Router yang sama**.
2. Server pengembang dalam kondisi berjalan (`npm run dev` aktif di port 3000).

---

## 2. Alamat Akses di Browser Ponsel

Buka aplikasi penjelajah (browser) di ponsel Anda dan masukkan alamat:

```text
http://192.168.0.101:3000
```

> **Catatan:**
> - Jika IP komputer berubah karena DHCP Wi-Fi, periksa IP terbaru komputer melalui terminal dengan perintah: `ipconfig getifaddr en0` atau `ifconfig | grep "inet "`.

---

## 3. Panduan Pemasangan di Ponsel Android

Rekomendasi Browser: **Google Chrome**

1. **Buka Alamat:**
   Ketik `http://192.168.0.101:3000` di kolom alamat Google Chrome.
2. **Masuk ke Sistem:**
   Pilih nama staf atau akun Anda pada layar Login.
3. **Pasang Aplikasi (PWA):**
   - Di bagian atas atau menu navigasi akan muncul tombol biru bertuliskan **"Install PWA"** atau **"Install Aplikasi (PWA)"**.
   - Ketuk tombol tersebut, lalu klik **Install / Pasang**.
   - *Alternatif Manual:* Ketuk menu titik tiga (⋮) di pojok kanan atas Chrome $\rightarrow$ pilih **"Tambahkan ke Layar Utama" (Add to Home screen)** / **"Instal aplikasi"**.
4. **Selesai:**
   Ikon **RIZ-PRO LOG** otomatis muncul di layar utama (home screen) ponsel Android dan berjalan dalam mode layar penuh (standalone) tanpa bilah URL browser.

---

## 4. Panduan Pemasangan di iPhone & iPad (iOS)

Rekomendasi Browser: **Apple Safari Resmi** *(Wajib menggunakan Safari agar fitur instalasi PWA aktif)*

1. **Buka Alamat:**
   Buka Safari di iPhone/iPad, masukkan alamat `http://192.168.0.101:3000`.
2. **Ketuk Tombol Share (Bagikan):**
   Di bilah bawah Safari, ketuk ikon **Bagikan (Share)** — yaitu tombol kotak dengan panah mengarah ke atas $(\uparrow)$.
3. **Pilih Tambah ke Layar Utama:**
   Gulir ke bawah pada lembar opsi, lalu ketuk pilihan **"Tambah ke Layar Utama"** (*Add to Home Screen*).
4. **Konfirmasi:**
   Pastikan judul aplikasi adalah **RIZ-PROLOG**, lalu ketuk tombol **Tambah (Add)** di sudut kanan atas.
5. **Selesai:**
   Aplikasi terpasang di Homescreen iOS dengan ikon resmi, mendukung optimasi notch/dynamic island, scrolling mulus, dan kemampuan offline caching.

---

## 5. Fitur Selama Berjalan di Ponsel

- **Full Screen Native App:** Tidak ada address bar browser yang memakan ruang layar.
- **Offline Cache:** Jika koneksi Wi-Fi terputus sesaat, aplikasi tetap dapat dibuka dan data tersimpan lokal.
- **Auto-Sync Firestore:** Saat terhubung internet kembali, seluruh input Daily Task, QC Checklist, dan Logbook akan tersinkronisasi otomatis ke Cloud Firestore & Google Sheets.

---
*Diterbitkan oleh: Sistem Operasional & QC PT. Riz Production Multi Kreasi*
