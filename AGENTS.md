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

8. **DILARANG MENYELESAIKAN MASALAH DENGAN MENAMBAH MASALAH BARU SECARA STRUKTURAL**
   - Setiap perbaikan wajib menyasar akar masalah utama secara bedah tuntas (root-cause resolution) tanpa merusak ketergantungan antar-modul, tanpa merusak tipe data baku, dan tanpa menciptakan regresi pada fitur yang sudah berjalan.
   - Dilarang melakukan siklus bongkar-pasang spekulatif yang tidak terarah; setiap perubahan harus terbukti lulus pengujian menyeluruh (`npm run test:all` dan `npm run lint`) sebelum dinyatakan selesai.

---

## 2. STRUKTUR JABATAN STRUKTURAL RESMI (PERMANENT SYSTEM MEMORY)

Agen dan Orkestrator wajib selalu mengingat dan menggunakan susunan struktural jabatan resmi berikut:

### Divisi Admin

1. **Wahyu** (`director-wahyu`) — *Director / Owner*
2. **M. Fahrulyana . A / Fahrul** (`staff-fahrul`) — *Manager*
3. **Agustino Setiawan / Agus** (`staff-agustino`) — *Staff Admin*
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

---

## 4. PENANGANAN DATA EKSEPSIONAL & PERGANTIAN PERIODE BULANAN

1. **Aturan Penambahan Tipe Divisi "Umum":**
   - Dalam data *raw* dari Google Sheet (Daily Report), terdapat kalanya staf menginput kolom divisi dengan nilai `"Umum"` (contohnya untuk penugasan umum atau bantuan lintas divisi).
   - Tipe data `Division` pada `src/types.ts` **wajib** mencakup nilai `'Umum'`. Hal ini untuk mencegah *TypeScript error* di IDE saat memproses `canonicalFirestoreData.ts` dan demi mempertahankan keaslian data historis yang diinput oleh staf.

2. **Aturan Update Referensi & Jadwal Bulan Baru:**
   - **Data Daily Report:** Data harian di bulan baru wajib di-append ke *array* di `canonicalFirestoreData.ts` mengikuti pola ID resmi (contoh: `rep-YYYYMMDD-[nama]-[no]-0`).
   - **Format Jadwal Shift:** Format jadwal bulan baru wajib dibuat pada file tersendiri (misal: `oktober2026Schedule.ts`) dengan mengacu pada pola shift bulan sebelumnya (misal September), lalu disesuaikan dengan kalender aktual bulan tersebut. Jadwal ini harus diregistrasi sebagai *Official Schedule* di dalam `src/data/staffSchedules.ts`.
   - **Pola Sinkronisasi URL:** Saat beralih ke bulan baru, `DEFAULT_SPREADSHEET_URL` di dalam `src/lib/googleSheetSync.ts` wajib diperbarui dengan parameter `gid` spesifik dari tab Google Sheet bulan yang bersangkutan untuk memastikan integrasi Cloud Sync tidak salah menarik data bulan lalu.

3. **Penyaringan Staf (Staff Whitelisting) Wajib Dinamis:**
   - Dilarang keras melakukan *hardcode* pada daftar nama staf yang dievaluasi (misalnya menggunakan array statis `OFFICIAL_GSHEET_STAFF_NAMES` di `kpiCalculator.ts`).
   - Logika verifikasi staf (seperti fungsi `isStaffInGoogleSheet`) wajib selalu merujuk secara dinamis ke fungsi `getCurrentMonthSchedule()` dan memeriksa kehadiran riil di jadwal aktif atau entri logbook bulan berjalan. Hal ini memastikan seluruh staf yang bertugas (termasuk Gatot, Mang Ube, Abah, Damri, dll.) otomatis masuk ke tabel KPI tanpa perlu perbaikan manual setiap pergantian bulan.

---

## 5. METODOLOGI KERJA: MULTI-AGENTIC AI & POLA R.A.G (RETRIEVAL-AUGMENTED GENERATION)

Semua agen yang beroperasi wajib mengadopsi standar kinerja berikut:

1. **Pola R.A.G Wajib:** Sebelum memodifikasi logika kalkulasi, UI, atau integrasi data, agen wajib melakukan *Retrieval* (pengambilan data silang) dari base data resmi (Spreadsheet, `staffSchedules.ts`, rules). Tidak boleh ada injeksi instruksi tanpa memvalidasi struktur sumber data yang sesungguhnya (*Augmented Generation*).
2. **Keterhubungan Menyeluruh (Connected End-to-End):** Agen harus memastikan perubahan di satu titik secara otomatis terefleksi dan terkoneksi dengan titik lain (Hulu ke Hilir). *State*, properti komponen, antarmuka TypeScript, hingga database Firestore harus sinkron.
3. **Harmonisasi Multi-Agentic:** Agen mengingat pekerjaan yang telah dieksekusi sebelumnya melalui dokumen `AGENTS.md` (Permanent System Memory) ini agar tidak terjadi tumpang tindih perintah, *error looping*, ataupun degradasi kinerja oleh agen yang bekerja secara paralel atau di *session* berikutnya.

---

## 6. REGISTRI EKSEKUSI & AMANAH REVISI TERBARU (OCTOBER 2026 & MULTI-MONTH INTEGRATION)

Seluruh agen pembangun wajib mematuhi registrasi eksekusi dan memori kerja terbaru berikut:

1. **Sumber Referensi Resmi & GID Aktif:**
   - URL Google Sheet Resmi: `https://docs.google.com/spreadsheets/d/1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA/edit?gid=1340328886#gid=1340328886`
   - Spreadsheet ID: `1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA`
   - GID Tab Aktif Oktober 2026: `1340328886`

2. **Aturan Sinkronisasi Non-Destruktif (Safe Merge Protocol):**
   - Engine `agent_google_sheet_sync.ts` **dilarang keras** menghapus atau mengganti `CANONICAL_FIRESTORE_FINDINGS` dan `CANONICAL_FIRESTORE_WORK_ORDERS` menjadi array kosong (`[]`).
   - Setiap kali data Google Sheet bulan baru di-pull, data harian wajib di-merge berdasarkan ID ke `canonicalFirestoreData.ts` agar seluruh histori harian dari bulan-bulan sebelumnya (September, Oktober, dst.) tetap 100% tersimpan secara utuh tanpa ada yang hilang.

3. **Aturan Parsing Tanggal Multi-Bulan (Dynamic Date Parsing):**
   - Dilarang keras melakukan hardcode string bulan tertentu (seperti regex khusus `/September/i`).
   - Engine parsing tanggal wajib mendukung seluruh 12 bulan bahasa Indonesia (`Januari` s/d `Desember`) dan bahasa Inggris (`January` s/d `December`) agar tanggal kegiatan staf terpetakan secara presisi pada hari aktualnya masing-masing.

4. **Protokol Pembersihan Cache Peramban (Auto-Flush LocalStorage):**
   - Ketika dataset kanonikal atau referensi resmi diubah, kunci versi `REF_SYNC_KEY` di `src/App.tsx` wajib diperbarui (contoh: `riz_ref_synced_v40_canonical_october_exact_gsheet`).
   - Inisialisasi state wajib menggabungkan data kanonikal terbaru dengan `localStorage` peramban agar peramban laptop user tidak menampilkan data cache lama yang usang.

5. **Integritas Metrik Performa Staf (Anti-Duplikasi):**
   - Metrik `QC Checked` diisolasi khusus untuk aktivitas inspeksi teknis, checklist gudang, P2H, dan testing (`qc`, `inspeksi`, `checklist`, `onhouse`, `p2h`). Dilarang menduplikasi entri daily report biasa menjadi entri QC.
   - Kehadiran riil staf (`attendanceCount`) dihitung dari kombinasi log absensi dan hari kerja unik aktivitas di lapangan. Staf tanpa entri kegiatan di bulan aktif dieliminasi secara otomatis dari tabel produktivitas bulan tersebut.

6. **Sumber Tunggal Aturan Baca Sheet (`src/lib/dailySheetParser.ts`):**
   - Seluruh logika pembacaan format 7 kolom Google Sheet, pemetaan nama panggilan staf (`NAME_TO_STAFF_ID`), normalisasi entri, dan deteksi QC (`checkIsQc`) dipusatkan secara permanen di `src/lib/dailySheetParser.ts`.
   - Modul aplikasi runtime (`src/lib/googleSheetSync.ts`), script sinkronisasi CLI (`scripts/agent_google_sheet_sync.ts`), dan test suite (`scripts/test_daily_sheet_parser.ts`) wajib selalu menggunakan `parseDailySheet()` agar aturan baca 100% konsisten antar-lingkungan.

7. **Kategori Penilaian & Bobot Resmi KPI (Komit Mutlak 100%):**
   - **Disiplin Kerja**: Bobot 10%
   - **Produktivitas (Daily Report)**: Bobot 25%
   - **Kualitas Pemeriksaan QC**: Bobot 20%
   - **Kompleksitas Tugas & Work Order**: Bobot 10%
   - **Kerja Sama Tim & Pengembangan**: Bobot 5%
   - **Jumlah Absensi (Kehadiran)**: Bobot 15%
   - **Uji Kompetensi yang Diikuti**: Bobot 15%
   - *Total Bobot*: 100% (Formula: `(discipline * 0.10) + (report * 0.25) + (qc * 0.20) + (wo * 0.10) + (teamwork * 0.05) + (attendance * 0.15) + (competency * 0.15)`).

8. **Komit Mutlak: Semua Staff Bisa Lintas Divisi:**
   - Seluruh staf (Admin, Gudang, Sound, Lighting, Multimedia, Videotron, Service) memiliki kapabilitas penuh untuk bertugas lintas divisi pada modul: **Daily Task**, **Temuan (Findings)**, **Work Order**, **QC Checklist**, dan **Daily Report**.
   - Dilarang mengunci form input, pemilihan divisi pelaksana, atau dropdown PIC hanya untuk divisi bawaan staf. Seluruh 22 staf inhouse dapat ditugaskan atau berkontribusi pada peralatan/divisi manapun.

9. **Komit Logika Workflow Operasional (5W: When, Who, What, Why, Where):**
   - Prinsip utama pelaporan: *"Siapa (Staff) melakukan tindakan apa, menghasilkan apa?"*
   - **WHEN? (Kapan?)**: Tanggal kejadian / laporan, target penyelesaian, deadline tugas.
   - **WHO? (Siapa?)**: Teknisi / staf PIC penanggung jawab tindakan nyata.
   - **WHAT? (Apa?)**: Aktivitas, pengerjaan tugas, unit alat, atau temuan kerusakan.
   - **WHY? (Mengapa?)**: Detail masalah, alasan tindakan, prioritas, catatan tindak lanjut.
   - **WHERE? (Di mana?)**: Divisi pelaksana, area set/posisi alat (FOH, panggung, gudang, workshop event).

10. **Protokol Pembacaan Data Excel & Google Sheet (Anti-Halusinasi & Sumber Nyata):**

    - **ID Spreadsheet Resmi:** `1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA`
    - **Daftar Tab Bulanan & GID Terverifikasi:**
      - Mei 2026: GID `673324712` (Month: `2026-05`)
      - Juni 2026: GID `86125629` (Month: `2026-06`)
      - Juli 2026: GID `2099865640` (Month: `2026-07`)
      - Agustus 2026: GID `1894783738` (Month: `2026-08`)
      - September 2026: GID `1869844599` (Month: `2026-09`)
      - Oktober 2026: GID `1340328886` (Month: `2026-10`)
      - November 2026: GID `1463883290` (Month: `2026-11`)
      - Desember 2026: GID `646140708` (Month: `2026-12`)
    - **Normalisasi Dinamis Header (Wajib):** Pada tab bulan Mei s/d Agustus, kolom A kosong atau berisi nomor urut sehingga kolom Tanggal bergeser ke indeks 1 atau 2. Agen dan parser WAJIB menggunakan `extractNormalizedDailySheetRows` dari `src/lib/dailySheetParser.ts` untuk mendeteksi posisi `Tanggal` secara dinamis, bukan mengasumsikan kolom 0.
    - **Larangan Halusinasi, Data Sintetis & Gimmick:**
      - Dilarang mengarang baris kegiatan atau nama kru yang tidak tercatat di Google Sheet.
      - Dilarang menganggap temuan kendala sebagai "Menunggu Sparepart" kecuali secara eksplisit tercantum kebutuhan komponen/sparepart pada deskripsi temuan.
      - Dilarang menggandakan logbook biasa menjadi Preventive Maintenance (PM). PM hanya dihitung dari jadwal Preventive resmi dan Work Order tipe PM.
      - Dilarang menampilkan 100% kesehatan aset jika divisi tersebut belum pernah melakukan inspeksi pada periode bersangkutan (tampilkan `N/A (Belum Ada Cek)`).
      - Dilarang membuat tombol stempel interaktif fiktif ("✔ APPROVED") di luar alur pengesahan dokumen riil. Lembar pengesahan wajib mencantumkan nama dan jabatan struktural resmi yang valid.
      - Dilarang mengisi textarea catatan manajemen dengan teks otomatis (*boilerplate generator*). Teks catatan harus berasal murni dari input manual pengguna/manajemen.

11. **Protokol Logika Perangkingan & Produktivitas Staf (Anti-Inversi Nilai KPI):**
    - **Akar Masalah Inversi:** Pada bulan berjalan, target absensi dan laporan tidak boleh diambil dari shift template mentah per individu yang menyebabkan staf part-time/1-shift mendapat target 1 (lalu memperoleh skor 100% dengan 1 laporan), sementara staf inhouse/full-time mendapat target 7 (lalu memperoleh skor 43% meskipun telah menyumbang 3 laporan & 24 jam kerja).
    - **Patokan Proporsional Operasional:** Target absensi (`attendanceTarget`), laporan harian (`reportTarget`), dan QC (`qcTarget`) pada bulan berjalan dipatok secara dinamis berbasis performa operasional tertinggi tim riil (`maxTeamReports` dan `maxTeamQcs`).
    - **Monotonik & Logis:** Staf dengan kontribusi riil lebih tinggi (3 laporan, 2 QC, 24 jam) WAJIB mendapatkan skor KPI lebih tinggi dan berada pada peringkat lebih atas dibandingkan staf dengan kontribusi lebih rendah (2 laporan/16 jam, atau 1 laporan/8 jam).
    - **Urutan Resmi Tabel & Top Performer:** Tabel Produktivitas Staf dan widget Top Performer diurutkan secara konsisten: Total KPI (%) Descending -> Kehadiran Riil Descending -> Daily Report Descending -> QC Checklist Descending -> WO Descending.

12. **Komit Mutlak: Google Sheet Sumber Acuan Resmi Mutlak (Single Source of Truth):**
    - **Status Resmi:** Google Sheet yang disertakan (Spreadsheet ID: `1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA`) adalah satu-satunya sumber acuan data resmi mutlak operasional PT. Riz Production Multi Kreasi.
    - **Dual-Ingestion Konsisten:** Baik data yang diinput manual langsung ke tab Google Sheet oleh personil lapangan, maupun data yang diinput melalui aplikasi (form Daily Task / QC Checklist / Logbook) yang di-append ke Google Sheet, keduanya memiliki validitas hukum operasional yang sama dan disinkronkan secara timbal-balik (bi-directional).
    - **Kaidah Kehadiran Faktual:** Staff yang dianggap hadir adalah staff yang namanya tercantum di dalam Google Sheet pada aktivitas hari bersangkutan. Dilarang menghitung kehadiran dari shift template teoritis yang menyebabkan distorsi angka (seperti kehadiran ratusan hari padahal sebulan maksimal 31 hari).

13. **Komit Mutlak: Folder Resmi Google Drive Penyimpanan Foto Dokumentasi:**
    - **URL Folder Resmi:** `https://drive.google.com/drive/folders/1s_mRU4FzBm29SKvsmNWlBlz1rfL3b90h?usp=sharing`
    - **Folder ID:** `1s_mRU4FzBm29SKvsmNWlBlz1rfL3b90h`
    - **Fungsi:** Tempat penyimpanan seluruh file foto dokumentasi kegiatan lapangan, checklist QC, foto temuan unit kendala/rusak, dan bukti absensi yang dikirim dari aplikasi oleh pengguna.

14. **Komit Mutlak: Folder Resmi Google Drive Bukti Absensi:**
    - **URL Folder Bukti Absensi:** `https://drive.google.com/drive/folders/1s_mRU4FzBm29SKvsmNWlBlz1rfL3b90h`
    - **Folder ID:** `1s_mRU4FzBm29SKvsmNWlBlz1rfL3b90h`
    - **Aturan Operasional:** Seluruh verifikasi foto selfie absensi kehadiran (Check In), absensi pulang (Check Out), bukti dokumentasi kehadiran lapangan, dan log absensi personil wajib tertaut secara permanen ke folder resmi ini. Tautan akses langsung wajib selalu tersedia di komponen Absensi Mandiri, form input foto selfie, dan histori log absensi.

15. **Komit Mutlak: Alamat Resmi & Koordinat GPS Kantor / Gudang Operasional:**
    - **Alamat Resmi:** `Jl. Alternatif Jl. Tugu Wates No.78, RT.02/RW.13, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat 16164`
    - **Google Plus Code:** `CRR3+82 Kedungbadak, Bogor City, West Java` (Kode Penuh: `6P58CRR3+82`)
    - **Koordinat GPS Resmi:** Latitude `-6.55919`, Longitude `106.80256` (`Lat: -6.55919, Lng: 106.80256`)
    - **Tautan Google Maps:** `https://www.google.com/maps/search/?api=1&query=-6.55919,106.80256`
    - **Penerapan Sistem:** Menjadi basis acuan tunggal titik lokasi kantor/workshop (HQ) untuk validasi absensi (Check In / Check Out), informasi geolokasi logbook, serta kop dokumen resmi cetak (print headers) di seluruh modul aplikasi.

16. **Komit Mutlak: Cakupan Notifikasi HANYA 4 Sumber Operasional Resmi:**
    - Notifikasi Pusat Notifikasi (`QCNotificationCenter`) HANYA bersumber dari:
      1. **Daily Task** (Penugasan pekerjaan dari modul Daily Task Kanban).
      2. **Daily Log** (Catatan harian kerja dari Google Sheet Daily Report & checklist QC harian).
      3. **Temuan Unit Bermasalah Oleh Semua Divisi** (Temuan kendala/kerusakan unit peralatan dari seluruh divisi: Sound, Lighting, Multimedia, Videotron, Service, Gudang).
      4. **Unit Yang Dikeluarkan dan Diterima Oleh Divisi Gudang / Warehouse** (Log mutasi serah terima barang gudang: Masuk, Keluar, Loading, Unloading).
    - Seluruh log di luar 4 sumber ini (seperti log absensi mandiri, audit log aktivitas user umum, dan proses sinkronisasi server background) DILARANG dimunculkan pada Pusat Notifikasi.
    - Tab filter di dalam panel notifikasi wajib strictly berisikan: `Semua`, `Daily Task`, `Daily Log`, `Temuan Unit Bermasalah`, dan `Mutasi Unit Gudang`.
