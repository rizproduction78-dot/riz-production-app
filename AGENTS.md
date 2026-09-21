# PRINSIP & ATURAN KERJA RESMI (MANDATORY INSTRUCTIONS)

## PT. Riz Production Multi Kreasi

Setiap tindakan pengkodean, perubahan fitur, dan respons HARUS mematuhi aturan kerja dan memori struktural ini tanpa pengecualian:

---

## 1. TUJUH PRINSIP UTAMA KERJA

1. **DATA AKURAT DENGAN SUMBER RESMI DARI USER**
   - Hanya gunakan data, referensi, jadwal, format, dan spesifikasi yang valid serta resmi diberikan oleh user.
   - Jangan pernah menggunakan asumsi atau data fiktif jika user telah memberikan referensi resmi.

2. **TIDAK MENGARANG PERINTAH**
   - Hanya kerjakan apa yang diperintahkan secara eksplisit oleh user.
   - Jangan menambahkan tugas atau asumsi mandiri di luar arahan user.

3. **TIDAK MENGURANGI PERINTAH**
   - Seluruh poin dalam instruksi user harus dipenuhi secara utuh dan lengkap tanpa ada bagian yang terlewatkan.

4. **IKUTI USER SECARA LITERAL**
   - Pahami dan laksanakan perintah sesuai makna harfiah dan kehendak persis dari user.

5. **TIDAK MENAMBAH, MENGURANGI TAMPILAN TANPA PERSETUJUAN DARI USER**
   - Dilarang keras menambah elemen tampilan (UI) baru atau menghapus elemen tampilan yang sudah ada tanpa persetujuan eksplisit dari user.

6. **WAJIB RUN TEST DEBUGGING MENYELURUH SETELAH SETIAP PERUBAHAN**
   - Setiap kali AI Agent Helper melakukan perubahan kode, wajib menjalankan seluruh rangkaian test debugging (`npm run test:all` atau `npm run build`) untuk mendeteksi dan mencegah bug sebelum komit.
   - Tidak diperkenankan membuat komit atau menganggap pekerjaan selesai tanpa pembuktian eksekusi test yang lulus 100%.

7. **STOP SELEBRASI PALSU, HALUSINASI HASIL KERJA, DAN IMPROVISASI TANPA REFERENSI**
   - Dilarang keras membuat selebrasi palsu, klaim berlebihan, ataupun halusinasi capaian kerja yang tidak terbukti secara empiris dalam data.
   - Dilarang melakukan improvisasi atau interpretasi liar di luar referensi data resmi yang disediakan oleh user.
   - Seluruh laporan, status, dan respons harus disampaikan secara murni faktual, dingin, presisi, dan objektif berbasis data nyata.

---

## 2. STRUKTUR JABATAN STRUKTURAL RESMI (PERMANENT SYSTEM MEMORY)

Agen dan Orkestrator wajib selalu mengingat dan menggunakan susunan struktural jabatan resmi berikut:

### Divisi Admin

1. **Wahyu** (`director-wahyu`) — *Director / Owner*
2. **M. Fahrulyana . A / Fahrul** (`staff-fahrul`) — *Manager*
3. **Agustino Setiawan / Agus** (`staff-agustino`) — *Supervisor*
4. **Syalsa Sri Hestariana / Caca** (`staff-syalsa`) — *Staff Admin*
5. **Seno Subroto / Seno** (`staff-seno`) — *Staff Admin*

### Divisi Staff Gudang

1. **Udin Saepudin / Mang ube** (`staff-udin`) — *Staff Leader / Team Leader*
2. **Gatot Wiliyanto / Gatot** (`staff-gatot`) — *Staff*
3. **Aep Saepudin / Aep / Subur** (`staff-absobur`) — *Staff*

### Divisi Sound (Audio)

1. **Muhamad Rahmat / Mboh** (`staff-rahmat`) — *Team Leader*
2. **Wahyudin / Unyim** (`staff-unyin`) — *Staff*
3. **Ramdani / Dani** (`staff-ramdani`) — *Staff*
4. **Iwan Kurniawan / Butonk** (`staff-iwan`) — *Staff*
5. **Yudishtira Purnama A / Yudish** (`staff-yudish`) — *Staff*
6. **Taufik Diana / Opik** (`staff-taufik`) — *Staff*
7. **Suryana / Nana / Buluk** (`staff-suryana`) — *Staff*

### Divisi Lighting

1. **Heri** (`staff-heri`) — *Team Leader*

### Divisi Multimedia

1. **Mulyadi / Jay** (`staff-mulyadi`) — *Team Leader*

### Divisi Videotron

1. **Ayong Sumarsih / Ayong** (`staff-ayong`) — *Team Leader*
2. **Dedi Agus Wigiantoro / Wigi** (`staff-dedi`) — *Staff*
3. **Muhamad Irvan / Irfan** (`staff-irvan`) — *Staff*
4. **Mulyana / Kharo** (`staff-mulyana`) — *Staff*

### Divisi Service

1. **Damri** (`staff-damri`) — *Team Leader*
2. **Mulyana / Kharo** (`staff-mulyana`) — *Staff*

> [!IMPORTANT]
> **ATURAN MUTLAK STAF DUAL-DIVISI:**
> **Mulyana / Kharo** memegang peran resmi di dua divisi: **Service** (primer) dan **Videotron** (sekunder). Rekaman aktivitas, laporan harian, temuan kerusakan, dan metrik pekerjaannya wajib terhitung dan tampil di kedua divisi tersebut secara utuh.

---

## 3. PROTOKOL KONTROL EKSEKUSI & CEK KETERHUBUNGAN ANTAR-MODUL

Setiap kali melakukan pekerjaan:

1. **Kenali Jenis Tugas:**
   - *Maintenance (Pemeliharaan):* Modifikasi logika kalkulasi/filter. **DILARANG ME-RESET KUNCI PENYIMPANAN ATAU DATABASE**.
   - *Re-build (Pembangunan Ulang):* Hanya dilakukan bila diperintahkan secara eksplisit dan harfiah oleh user.
2. **Lacak Ketergantungan Hulu-Hilir:**
   - Hulu: `googleSheetSync.ts` &rarr; `canonicalFirestoreData.ts` &rarr; `data.ts`
   - Tengah: `cloudSync.ts` &rarr; `App.tsx` (State Central)
   - Hilir: `Dashboard.tsx` & `Reports.tsx`
   - Pastikan perubahan di salah satu komponen tidak membuat tabel di komponen lain kosong (*blank*).
3. **Verifikasi Output Nyata:**
   - Bagian 04 (Produktivitas Staff): Wajib menampilkan daftar performa staf.
   - Bagian 05 (Statistik QC): Angka harus faktual tanpa penggandaan fiktif.
   - Bagian III Reports (Temuan QC): Wajib menampilkan daftar unit yang mengalami kendala.
   - Bagian V Reports (Work Orders): Wajib menampilkan tindak lanjut pekerjaan perbaikan.
