import { DailyReport, LogbookEntry, Finding, WorkOrder } from '../types';

/**
 * DATA KANONIKAL RESMI GOOGLE SHEET PT. RIZ PRODUCTION MULTI KREASI
 * Sumber Resmi: Google Spreadsheet 1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA (GID: 198998470)
 * Seluruh data operasional di bawah ini merefleksikan 100% data log harian bertugas & checklist QC.
 */

export const CANONICAL_FIRESTORE_DAILY_REPORTS: DailyReport[] = [
  {
    "id": "rep-20260901-jay-0-0",
    "date": "2026-09-01",
    "staffName": "Jay",
    "division": "Multimedia",
    "activity": "- Belajar Aplikasi Gemini",
    "notes": "selesai basic progress tingkat lanjut",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260901-jay-1-0",
    "date": "2026-09-01",
    "staffName": "Jay",
    "division": "Multimedia",
    "activity": "- Belajar Aplikasi Chat GPT",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260903-mboh-2-0",
    "date": "2026-09-03",
    "staffName": "Mboh",
    "division": "Audio",
    "activity": "1. pengecekan semua unit speker DBTtech15, dengan mengunakan smartlive berdasarkan data reference unit yang sehat",
    "notes": "- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event.\n-Rekomendasi untuk di cek oleh team service terutama pada modul Amplifier dan pengecekan  spare-part Tweter",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260903-butong-5-0",
    "date": "2026-09-03",
    "staffName": "Butong",
    "division": "Audio",
    "activity": "2. membersihkan smua unit DBtech dari debu",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260904-opik-6-0",
    "date": "2026-09-04",
    "staffName": "Opik",
    "division": "Audio",
    "activity": "- Pengecekan Panel 3 Unit",
    "notes": "- 2 panel Listrik 3 Phase Sudah OK",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260904-buluk-7-0",
    "date": "2026-09-04",
    "staffName": "Buluk",
    "division": "Umum",
    "activity": "- Hadir",
    "notes": "- 1 Ganti Stop Kontak, 1 Ganti Legran Cewe",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260905-opik-8-0",
    "date": "2026-09-05",
    "staffName": "Opik",
    "division": "Audio",
    "activity": "- Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire menggunakan Sub T45",
    "notes": "- Semua Panel listrik dalam kondisi aman dan bisa di gunakan",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260905-kharo-10-0",
    "date": "2026-09-05",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- Repair/ perbaikan Ganti Pixel Kabinet LED 2 Box",
    "notes": "selesai 2 box ( 16 Panel Cabinet)",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260906-kharo-11-0",
    "date": "2026-09-06",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "notes": "selesai 2 box ( 16 Panel Cabinet)",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260906-wigi-11-1",
    "date": "2026-09-06",
    "staffName": "Wigi",
    "division": "Videotron",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "notes": "selesai 2 box ( 16 Panel Cabinet)",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260906-irvan-11-2",
    "date": "2026-09-06",
    "staffName": "Irvan",
    "division": "Videotron",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "notes": "selesai 2 box ( 16 Panel Cabinet)",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260906-dani-12-0",
    "date": "2026-09-06",
    "staffName": "Dani",
    "division": "Audio",
    "activity": "- Cek cable XLR dan Jack to Jack",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260907-heri-13-0",
    "date": "2026-09-07",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "Cek unit, Cleaning, Cek Colour Parled",
    "notes": "Harus service warm mati no 12,25,29 | Warm Separo no 3,32",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260909-kharo-14-0",
    "date": "2026-09-09",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- Repair dead pixel 1 box\n- Copot Masking 7 box",
    "notes": "selesai 1 box ( 8 Panel Cabinet ) ",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260909-wigi-15-0",
    "date": "2026-09-09",
    "staffName": "Wigi",
    "division": "Umum",
    "activity": "- Hadir",
    "notes": "selesai 1 box ( 8 Panel Cabinet ) ",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260909-ayong-16-0",
    "date": "2026-09-09",
    "staffName": "Ayong",
    "division": "Umum",
    "activity": "- Hadir",
    "notes": "selesai 1 box ( 8 Panel Cabinet ) ",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260909-buluk-17-0",
    "date": "2026-09-09",
    "staffName": "Buluk",
    "division": "Audio",
    "activity": "- Perbaikan/ Service Mandiri :\n1. Kabel snake 8 ch \n2. Kabel snake 16 ch \n3. Kabel rumbay drum 8 ch\n4. Cek Mic EWD/ Ganti Spul",
    "notes": "- Semua selesai dan dapat di gunakan",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260910-heri-21-0",
    "date": "2026-09-10",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "Cek Unit, Cleaning, Cek colour, Perbaikan kabel  link :\n- Beam 450 (9 bok / 18 Unit)\n- BSW 550 (6 bok / 12 Unit)\n- B-Eye (4 bok / 8 Unit)",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260910-heri-22-0",
    "date": "2026-09-10",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Parled",
    "notes": "- Harus service warm separo no. 19,20,27",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260910-heri-23-0",
    "date": "2026-09-10",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- XLR (Link)",
    "notes": "- Sudah service",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260910-mboh-24-0",
    "date": "2026-09-10",
    "staffName": "Mboh",
    "division": "Audio",
    "activity": "-ngulik fitur DLMS marani MIR480I dan MIR480A",
    "notes": "unit dalam kondisi aman tidak ada kendala",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260910-mboh-25-0",
    "date": "2026-09-10",
    "staffName": "Mboh",
    "division": "Audio",
    "activity": "-CALIBRASI MIC RTA BEHRINGER ECM8000",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260910-mboh-26-0",
    "date": "2026-09-10",
    "staffName": "Mboh",
    "division": "Audio",
    "activity": "-revisi pemasangan BEHRINGER ULTRA LINK",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260911-unyim-27-0",
    "date": "2026-09-11",
    "staffName": "unyim",
    "division": "Audio",
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat",
    "notes": "selesai dengan baik dan sudah bisa di gunakan",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260911-buluk-27-1",
    "date": "2026-09-11",
    "staffName": "buluk",
    "division": "Audio",
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat",
    "notes": "selesai dengan baik dan sudah bisa di gunakan",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260912-heri-28-0",
    "date": "2026-09-12",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "Cek Unit, Cleaning, Cek Colour Parled",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260912-heri-29-0",
    "date": "2026-09-12",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Cek Mixer Tiger Touch",
    "notes": "Kondisi Normal",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260912-heri-30-0",
    "date": "2026-09-12",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Cleaning All Stromy",
    "notes": "Kondisi Bersih Normal",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260912-heri-31-0",
    "date": "2026-09-12",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Cleaning All Freshnell 300 w",
    "notes": "Kondisi Normal",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260912-heri-32-0",
    "date": "2026-09-12",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Cleaning All blinder 4Cell",
    "notes": "Kondisi Bersih Normal",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260912-heri-33-0",
    "date": "2026-09-12",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Cleaning Parled No. 11,13,14,15,16,17",
    "notes": "Kondisi Bersih I No. 13 Harus Servic ( Merah Mati )",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260916-kharo-34-0",
    "date": "2026-09-16",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- Repair Dead Pixel",
    "notes": "selesai",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260916-ayong-35-0",
    "date": "2026-09-16",
    "staffName": "Ayong",
    "division": "Videotron",
    "activity": "- Buka Masking Kabinet",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260916-jay-36-0",
    "date": "2026-09-16",
    "staffName": "Jay",
    "division": "Multimedia",
    "activity": "- Ganti Konektor SDI kabel panjang 1. Kabel pendek 1",
    "notes": "Sudah selesai dan bisa di gunakan",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260916-jay-37-0",
    "date": "2026-09-16",
    "staffName": "Jay",
    "division": "Multimedia",
    "activity": "- Cek Kabel SDI Perleng Box",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260916-unyim-38-0",
    "date": "2026-09-16",
    "staffName": "Unyim",
    "division": "Audio",
    "activity": "- Cleaning Avanda 210 16 Box",
    "notes": "Kondisi Bersih dan Normal",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260916-dani-39-0",
    "date": "2026-09-16",
    "staffName": "Dani",
    "division": "Audio",
    "activity": "- Cleaning & Repaint Mic SM58, SM57 & VXT",
    "notes": "SM58 ( Bagus 17, Rusak 1 ), SM57 ( Bagus 11, Rusak 4, Hilang 9 ), VXT ( Bagus 8, Rusak 2 )",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260916-butonk-40-0",
    "date": "2026-09-16",
    "staffName": "Butonk",
    "division": "Audio",
    "activity": "- Bongkar RCF 8003 Kirim ke sambang",
    "notes": "2 Unit Komponen Speaker 18inc saja untuk di service keluar",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260916-heri-41-0",
    "date": "2026-09-16",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "CLEANING, CEK UNIT",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260916-heri-42-0",
    "date": "2026-09-16",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Konek artnet ke Tiger Touch",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260916-heri-43-0",
    "date": "2026-09-16",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Cleaning All Freshnell 200 W",
    "notes": "Kondisi Normal",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260916-heri-44-0",
    "date": "2026-09-16",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Cek Smoke erorr",
    "notes": "Smoke No.3 ERORR",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260916-heri-45-0",
    "date": "2026-09-16",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Rapihin Kabel PerlBox",
    "notes": "Aman",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260916-heri-46-0",
    "date": "2026-09-16",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Ganti Roda Box Kabel",
    "notes": "Lancar",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260917-kharo-47-0",
    "date": "2026-09-17",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- Ganti Dead Pixel",
    "notes": "- 5 Box Diluar Blom Beres",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260917-kharo-48-0",
    "date": "2026-09-17",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "1 Box Kerusakan Berat",
    "notes": "- 1 Box Clear 8 Panel Cabinet selesai",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260917-kharo-49-0",
    "date": "2026-09-17",
    "staffName": "Kharo",
    "division": "Umum",
    "activity": "- Hadir",
    "notes": "- 1 Box Baru Beres 4 Kabinet sisa 4 perbaikan",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260917-kharo-50-0",
    "date": "2026-09-17",
    "staffName": "Kharo",
    "division": "Umum",
    "activity": "- Hadir",
    "notes": "- 1 Box Kerusakan Berat isi 8 kabinet",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260917-jay-51-0",
    "date": "2026-09-17",
    "staffName": "Jay",
    "division": "Multimedia",
    "activity": "- Cek Kabel SDI 50 Meter Dan Ganti Konektor 3 Unit",
    "notes": "- Dari 3 Unit Kabel SDI, 1 Unit Harus Ganti konektor ( 2 Unit Aman )",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260917-opik-52-0",
    "date": "2026-09-17",
    "staffName": "Opik",
    "division": "Audio",
    "activity": "- Cek Panel Dan Ganti 3 Unit Indikator",
    "notes": "- Udah Aman Diganti baru",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260917-dani-53-0",
    "date": "2026-09-17",
    "staffName": "Dani",
    "division": "Audio",
    "activity": "- Cek Mic  & Jumlahnya",
    "notes": "- Bagus Dan Bersih",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260917-unyim-54-0",
    "date": "2026-09-17",
    "staffName": "Unyim",
    "division": "Audio",
    "activity": "- Cek Takel 1 & 2 Ton",
    "notes": "- Takel yg 1 Ton LOS 1 Unit wajib di perbaiki",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260917-yudis-55-0",
    "date": "2026-09-17",
    "staffName": "Yudis",
    "division": "Audio",
    "activity": "- Cek Ampeg SVT-4",
    "notes": "- Harus service dan ganti PTC",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260918-kharo-58-0",
    "date": "2026-09-18",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- Ganti Dead Pixel",
    "notes": "- 3 Box Belum Beres",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260918-kharo-59-0",
    "date": "2026-09-18",
    "staffName": "Kharo",
    "division": "Umum",
    "activity": "- Hadir",
    "notes": "- 2 Box Clear",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260918-kharo-60-0",
    "date": "2026-09-18",
    "staffName": "Kharo",
    "division": "Umum",
    "activity": "- Hadir",
    "notes": "- 1 Box Beres 3 Kabinet",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260918-kharo-61-0",
    "date": "2026-09-18",
    "staffName": "Kharo",
    "division": "Umum",
    "activity": "- Hadir",
    "notes": "- 1 Box Kerusakan Berat",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260921-heri-62-0",
    "date": "2026-09-21",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "Service & Cek Unit",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260921-heri-63-0",
    "date": "2026-09-21",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Smoke No 3 Ganti PCB mainboard",
    "notes": "- Smoke Kondisi Normal Semua",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260921-heri-64-0",
    "date": "2026-09-21",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Parled Eror No 3,12,13,19,20,25,27,29,32",
    "notes": "- Parled Kondisi Normal Semua",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260921-heri-65-0",
    "date": "2026-09-21",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "Sudah NORMAL (Service Mg Damri)",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260921-heri-66-0",
    "date": "2026-09-21",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Rapihin Cover Bekas Pakai",
    "notes": "- Cover2 lengkap",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260921-heri-67-0",
    "date": "2026-09-21",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Cek Kabel dan Unit Bekas Sewaan Plaza Festival",
    "notes": "- Kabel lengkap , Minus Breket Stromy 1bok",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260922-buluk-68-0",
    "date": "2026-09-22",
    "staffName": "Buluk",
    "division": "Audio",
    "activity": "- Ngerapihin Rumbai Mic",
    "notes": "- Beres, Aman Rumbai bisa di gunakan",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260922-buluk-69-0",
    "date": "2026-09-22",
    "staffName": "Buluk",
    "division": "Audio",
    "activity": "- Cek Sub Kla 4 Unit",
    "notes": "- Service Modul Sub Kla No.3 ( Kirim Ke PIB )",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260923-yudis-70-0",
    "date": "2026-09-23",
    "staffName": "Yudis",
    "division": "Audio",
    "activity": "- Merapihkan Rak Penyimpanan",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260923-yudis-71-0",
    "date": "2026-09-23",
    "staffName": "Yudis",
    "division": "Audio",
    "activity": "-",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260924-opik-72-0",
    "date": "2026-09-24",
    "staffName": "Opik",
    "division": "Audio",
    "activity": "setup layout hardcase gudang",
    "notes": "1 set backline dalam kondisi normal(siap pakai)",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260924-yudis-73-0",
    "date": "2026-09-24",
    "staffName": "Yudis",
    "division": "Audio",
    "activity": "cek 1 set backline",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260924-mboh-74-0",
    "date": "2026-09-24",
    "staffName": "Mboh",
    "division": "Audio",
    "activity": "cek komponen sub KLA",
    "notes": "isu komponen KLA problem ngeleker ternyata normal(siap pakai)",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260924-heri-75-0",
    "date": "2026-09-24",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Set Up Layout Gudang",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260924-heri-76-0",
    "date": "2026-09-24",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Mirorrball Ter Hardcase",
    "notes": "1 Unit Mirror-Ball sudah masuk Hardcase",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260924-heri-77-0",
    "date": "2026-09-24",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Bersih bersih bok",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260924-kharo-78-0",
    "date": "2026-09-24",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- repair 12 kabinet",
    "notes": "8 Panel cabinet blm clear",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260924-kharo-79-0",
    "date": "2026-09-24",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "-1 kabinet ngacing",
    "notes": "5 kabinet kena ic warna",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260924-kharo-80-0",
    "date": "2026-09-24",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "-1 kabinet ilang jalur",
    "notes": "3 kabinet ilang jalur",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260924-kharo-81-0",
    "date": "2026-09-24",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "-10 kabinet dead pixel",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260924-kharo-82-0",
    "date": "2026-09-24",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "-ganti kuncian kabel",
    "notes": "selesai di ganti kunci kabel",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260924-kharo-83-0",
    "date": "2026-09-24",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "-sortir masking",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260928-kharo-84-0",
    "date": "2026-09-28",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "repair 8 kabinet led",
    "notes": "Selesai 7 kabinet",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260928-kharo-85-0",
    "date": "2026-09-28",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- 7 kabinet dead pixel",
    "notes": "1 kabinet proses perbaikan",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260928-kharo-86-0",
    "date": "2026-09-28",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- 1 kabinet ilang jalur",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260928-dani-87-0",
    "date": "2026-09-28",
    "staffName": "Dani",
    "division": "Audio",
    "activity": "*iventory mic\n*cat mic VXT",
    "notes": "*MIC SM58 ORIGINAL 16 PCS",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260928-butonk-88-0",
    "date": "2026-09-28",
    "staffName": "Butonk",
    "division": "Audio",
    "activity": "*iventory mic\n*cat mic VXT",
    "notes": "*MIC SM 58 KW 1PCS",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260928-mboh-89-0",
    "date": "2026-09-28",
    "staffName": "Mboh",
    "division": "Audio",
    "activity": "*iventory mic\n*cat mic VXT",
    "notes": "*MIC VXT 7PCS",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260928-mboh-90-0",
    "date": "2026-09-28",
    "staffName": "Mboh",
    "division": "Umum",
    "activity": "- Hadir",
    "notes": "*MIC SAMSON 3PCS",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260928-mboh-91-0",
    "date": "2026-09-28",
    "staffName": "Mboh",
    "division": "Umum",
    "activity": "- Hadir",
    "notes": "*MIC C1000 HITAM 7PCS",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260928-mboh-92-0",
    "date": "2026-09-28",
    "staffName": "Mboh",
    "division": "Umum",
    "activity": "- Hadir",
    "notes": "*MIC C1000 GOLD 8PCS",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260928-mboh-93-0",
    "date": "2026-09-28",
    "staffName": "Mboh",
    "division": "Umum",
    "activity": "- Hadir",
    "notes": "*MIC AUDIX D6 1PCS",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260928-mboh-94-0",
    "date": "2026-09-28",
    "staffName": "Mboh",
    "division": "Umum",
    "activity": "- Hadir",
    "notes": "*MIC SM57 13PCS ( -6 )",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260928-jay-95-0",
    "date": "2026-09-28",
    "staffName": "Jay",
    "division": "Multimedia",
    "activity": "Bantu cek  Data Inventory dan cek fisik unit Divisi Sound",
    "notes": "Menghitung jumlah Fisik Unit",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260928-jay-96-0",
    "date": "2026-09-28",
    "staffName": "Jay",
    "division": "Umum",
    "activity": "- Hadir",
    "notes": "Menghitung jumlah Fisik Unit/ Sesuai",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260929-yudis-97-0",
    "date": "2026-09-29",
    "staffName": "yudis",
    "division": "Audio",
    "activity": "inventory Kabel",
    "notes": "Menghitung jumlah Fisik Unit/ Sesuai",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260929-unyim-98-0",
    "date": "2026-09-29",
    "staffName": "unyim",
    "division": "Audio",
    "activity": "kabel xlr.",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260929-unyim-99-0",
    "date": "2026-09-29",
    "staffName": "unyim",
    "division": "Audio",
    "activity": "kabel perleng.",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260929-unyim-100-0",
    "date": "2026-09-29",
    "staffName": "unyim",
    "division": "Audio",
    "activity": "kabel snake 8ch",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260929-unyim-101-0",
    "date": "2026-09-29",
    "staffName": "unyim",
    "division": "Audio",
    "activity": "kabel snake 16ch",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260929-unyim-102-0",
    "date": "2026-09-29",
    "staffName": "unyim",
    "division": "Audio",
    "activity": "cek laptop baru koneksi ke dlms",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261001-irfan-103-0",
    "date": "2026-10-01",
    "staffName": "Irfan",
    "division": "Videotron",
    "activity": "- Cek kabel lan",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261001-ayong-104-0",
    "date": "2026-10-01",
    "staffName": "Ayong",
    "division": "Videotron",
    "activity": "- Bersiin Prosesor dan cek kelengkapan kabel Di Processor",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261001-ayong-105-0",
    "date": "2026-10-01",
    "staffName": "Ayong",
    "division": "Videotron",
    "activity": "- Nyuci pemberat",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  }
];

export const CANONICAL_FIRESTORE_LOGBOOK_ENTRIES: LogbookEntry[] = [
  {
    "id": "log-20260903-mboh-2-0",
    "date": "2026-09-03",
    "staffName": "Mboh",
    "division": "Audio",
    "activity": "1. pengecekan semua unit speker DBTtech15, dengan mengunakan smartlive berdasarkan data reference unit yang sehat",
    "result": "OK",
    "followUp": "- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event.\n-Rekomendasi untuk di cek oleh team service terutama pada modul Amplifier dan pengecekan  spare-part Tweter",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260904-opik-6-0",
    "date": "2026-09-04",
    "staffName": "Opik",
    "division": "Audio",
    "activity": "- Pengecekan Panel 3 Unit",
    "result": "OK",
    "followUp": "- 2 panel Listrik 3 Phase Sudah OK",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260905-kharo-10-0",
    "date": "2026-09-05",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- Repair/ perbaikan Ganti Pixel Kabinet LED 2 Box",
    "result": "OK",
    "followUp": "selesai 2 box ( 16 Panel Cabinet)",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260906-kharo-11-0",
    "date": "2026-09-06",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "result": "OK",
    "followUp": "selesai 2 box ( 16 Panel Cabinet)",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260906-wigi-11-1",
    "date": "2026-09-06",
    "staffName": "Wigi",
    "division": "Videotron",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "result": "OK",
    "followUp": "selesai 2 box ( 16 Panel Cabinet)",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260906-irvan-11-2",
    "date": "2026-09-06",
    "staffName": "Irvan",
    "division": "Videotron",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "result": "OK",
    "followUp": "selesai 2 box ( 16 Panel Cabinet)",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260906-dani-12-0",
    "date": "2026-09-06",
    "staffName": "Dani",
    "division": "Audio",
    "activity": "- Cek cable XLR dan Jack to Jack",
    "result": "OK",
    "followUp": "",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260907-heri-13-0",
    "date": "2026-09-07",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "Cek unit, Cleaning, Cek Colour Parled",
    "result": "OK",
    "followUp": "Harus service warm mati no 12,25,29 | Warm Separo no 3,32",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260909-kharo-14-0",
    "date": "2026-09-09",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- Repair dead pixel 1 box\n- Copot Masking 7 box",
    "result": "OK",
    "followUp": "selesai 1 box ( 8 Panel Cabinet ) ",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260909-buluk-17-0",
    "date": "2026-09-09",
    "staffName": "Buluk",
    "division": "Audio",
    "activity": "- Perbaikan/ Service Mandiri :\n1. Kabel snake 8 ch \n2. Kabel snake 16 ch \n3. Kabel rumbay drum 8 ch\n4. Cek Mic EWD/ Ganti Spul",
    "result": "OK",
    "followUp": "- Semua selesai dan dapat di gunakan",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260910-heri-21-0",
    "date": "2026-09-10",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "Cek Unit, Cleaning, Cek colour, Perbaikan kabel  link :\n- Beam 450 (9 bok / 18 Unit)\n- BSW 550 (6 bok / 12 Unit)\n- B-Eye (4 bok / 8 Unit)",
    "result": "OK",
    "followUp": "",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260911-unyim-27-0",
    "date": "2026-09-11",
    "staffName": "unyim",
    "division": "Audio",
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat",
    "result": "OK",
    "followUp": "selesai dengan baik dan sudah bisa di gunakan",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260911-buluk-27-1",
    "date": "2026-09-11",
    "staffName": "buluk",
    "division": "Audio",
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat",
    "result": "OK",
    "followUp": "selesai dengan baik dan sudah bisa di gunakan",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260912-heri-28-0",
    "date": "2026-09-12",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "Cek Unit, Cleaning, Cek Colour Parled",
    "result": "OK",
    "followUp": "",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260912-heri-29-0",
    "date": "2026-09-12",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Cek Mixer Tiger Touch",
    "result": "OK",
    "followUp": "Kondisi Normal",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260912-heri-30-0",
    "date": "2026-09-12",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Cleaning All Stromy",
    "result": "OK",
    "followUp": "Kondisi Bersih Normal",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260912-heri-31-0",
    "date": "2026-09-12",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Cleaning All Freshnell 300 w",
    "result": "OK",
    "followUp": "Kondisi Normal",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260912-heri-32-0",
    "date": "2026-09-12",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Cleaning All blinder 4Cell",
    "result": "OK",
    "followUp": "Kondisi Bersih Normal",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260912-heri-33-0",
    "date": "2026-09-12",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Cleaning Parled No. 11,13,14,15,16,17",
    "result": "OK",
    "followUp": "Kondisi Bersih I No. 13 Harus Servic ( Merah Mati )",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260916-kharo-34-0",
    "date": "2026-09-16",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- Repair Dead Pixel",
    "result": "OK",
    "followUp": "selesai",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260916-jay-36-0",
    "date": "2026-09-16",
    "staffName": "Jay",
    "division": "Multimedia",
    "activity": "- Ganti Konektor SDI kabel panjang 1. Kabel pendek 1",
    "result": "OK",
    "followUp": "Sudah selesai dan bisa di gunakan",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260916-jay-37-0",
    "date": "2026-09-16",
    "staffName": "Jay",
    "division": "Multimedia",
    "activity": "- Cek Kabel SDI Perleng Box",
    "result": "OK",
    "followUp": "",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260916-unyim-38-0",
    "date": "2026-09-16",
    "staffName": "Unyim",
    "division": "Audio",
    "activity": "- Cleaning Avanda 210 16 Box",
    "result": "OK",
    "followUp": "Kondisi Bersih dan Normal",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260916-dani-39-0",
    "date": "2026-09-16",
    "staffName": "Dani",
    "division": "Audio",
    "activity": "- Cleaning & Repaint Mic SM58, SM57 & VXT",
    "result": "OK",
    "followUp": "SM58 ( Bagus 17, Rusak 1 ), SM57 ( Bagus 11, Rusak 4, Hilang 9 ), VXT ( Bagus 8, Rusak 2 )",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260916-heri-41-0",
    "date": "2026-09-16",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "CLEANING, CEK UNIT",
    "result": "OK",
    "followUp": "",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260916-heri-43-0",
    "date": "2026-09-16",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Cleaning All Freshnell 200 W",
    "result": "OK",
    "followUp": "Kondisi Normal",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260916-heri-44-0",
    "date": "2026-09-16",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Cek Smoke erorr",
    "result": "OK",
    "followUp": "Smoke No.3 ERORR",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260916-heri-46-0",
    "date": "2026-09-16",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Ganti Roda Box Kabel",
    "result": "OK",
    "followUp": "Lancar",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260917-kharo-47-0",
    "date": "2026-09-17",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- Ganti Dead Pixel",
    "result": "OK",
    "followUp": "- 5 Box Diluar Blom Beres",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260917-jay-51-0",
    "date": "2026-09-17",
    "staffName": "Jay",
    "division": "Multimedia",
    "activity": "- Cek Kabel SDI 50 Meter Dan Ganti Konektor 3 Unit",
    "result": "OK",
    "followUp": "- Dari 3 Unit Kabel SDI, 1 Unit Harus Ganti konektor ( 2 Unit Aman )",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260917-opik-52-0",
    "date": "2026-09-17",
    "staffName": "Opik",
    "division": "Audio",
    "activity": "- Cek Panel Dan Ganti 3 Unit Indikator",
    "result": "OK",
    "followUp": "- Udah Aman Diganti baru",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260917-dani-53-0",
    "date": "2026-09-17",
    "staffName": "Dani",
    "division": "Audio",
    "activity": "- Cek Mic  & Jumlahnya",
    "result": "OK",
    "followUp": "- Bagus Dan Bersih",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260917-unyim-54-0",
    "date": "2026-09-17",
    "staffName": "Unyim",
    "division": "Audio",
    "activity": "- Cek Takel 1 & 2 Ton",
    "result": "OK",
    "followUp": "- Takel yg 1 Ton LOS 1 Unit wajib di perbaiki",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260917-yudis-55-0",
    "date": "2026-09-17",
    "staffName": "Yudis",
    "division": "Audio",
    "activity": "- Cek Ampeg SVT-4",
    "result": "OK",
    "followUp": "- Harus service dan ganti PTC",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260918-kharo-58-0",
    "date": "2026-09-18",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- Ganti Dead Pixel",
    "result": "OK",
    "followUp": "- 3 Box Belum Beres",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260921-heri-62-0",
    "date": "2026-09-21",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "Service & Cek Unit",
    "result": "OK",
    "followUp": "",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260921-heri-63-0",
    "date": "2026-09-21",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Smoke No 3 Ganti PCB mainboard",
    "result": "OK",
    "followUp": "- Smoke Kondisi Normal Semua",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260921-heri-67-0",
    "date": "2026-09-21",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Cek Kabel dan Unit Bekas Sewaan Plaza Festival",
    "result": "OK",
    "followUp": "- Kabel lengkap , Minus Breket Stromy 1bok",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260922-buluk-69-0",
    "date": "2026-09-22",
    "staffName": "Buluk",
    "division": "Audio",
    "activity": "- Cek Sub Kla 4 Unit",
    "result": "OK",
    "followUp": "- Service Modul Sub Kla No.3 ( Kirim Ke PIB )",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260924-yudis-73-0",
    "date": "2026-09-24",
    "staffName": "Yudis",
    "division": "Audio",
    "activity": "cek 1 set backline",
    "result": "OK",
    "followUp": "",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260924-mboh-74-0",
    "date": "2026-09-24",
    "staffName": "Mboh",
    "division": "Audio",
    "activity": "cek komponen sub KLA",
    "result": "OK",
    "followUp": "isu komponen KLA problem ngeleker ternyata normal(siap pakai)",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260924-kharo-78-0",
    "date": "2026-09-24",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- repair 12 kabinet",
    "result": "OK",
    "followUp": "8 Panel cabinet blm clear",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260924-kharo-82-0",
    "date": "2026-09-24",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "-ganti kuncian kabel",
    "result": "OK",
    "followUp": "selesai di ganti kunci kabel",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260928-kharo-84-0",
    "date": "2026-09-28",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "repair 8 kabinet led",
    "result": "OK",
    "followUp": "Selesai 7 kabinet",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260928-jay-95-0",
    "date": "2026-09-28",
    "staffName": "Jay",
    "division": "Multimedia",
    "activity": "Bantu cek  Data Inventory dan cek fisik unit Divisi Sound",
    "result": "OK",
    "followUp": "Menghitung jumlah Fisik Unit",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260929-unyim-102-0",
    "date": "2026-09-29",
    "staffName": "unyim",
    "division": "Audio",
    "activity": "cek laptop baru koneksi ke dlms",
    "result": "OK",
    "followUp": "",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet"
  }
];

export const CANONICAL_FIRESTORE_FINDINGS: Finding[] = [];
export const CANONICAL_FIRESTORE_WORK_ORDERS: WorkOrder[] = [];

