import { DailyReport, LogbookEntry, Finding, WorkOrder } from '../types';

/**
 * DATA KANONIKAL RESMI GOOGLE SHEET PT. RIZ PRODUCTION MULTI KREASI
 * Sumber Resmi: Google Spreadsheet 1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA (GID: 198998470)
 * Seluruh data operasional di bawah ini merefleksikan 100% data log harian bertugas & checklist QC.
 */

export const CANONICAL_FIRESTORE_DAILY_REPORTS: DailyReport[] = [
  // 1 September 2026
  {
    id: "rep-20260901-jay",
    date: "2026-09-01",
    staffName: "Mulyadi",
    division: "Multimedia",
    activity: "Belajar Aplikasi Gemini & Chat GPT",
    notes: "- Belajar Aplikasi Gemini\n- Belajar Aplikasi Chat GPT",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },

  // 3 September 2026
  {
    id: "rep-20260903-mboh",
    date: "2026-09-03",
    staffName: "Muhamad Rahmat",
    division: "Audio",
    activity: "1* Pengecekan semua unit speaker DBTtech15 dengan SmaartLive berdasarkan data reference unit yang sehat",
    notes: "REMARK:\n- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang dikeluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event.\n- Rekomendasi untuk dicek oleh team service terutama pada modul Amplifier.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260903-yudis",
    date: "2026-09-03",
    staffName: "Yudishtira Purnama A",
    division: "Audio",
    activity: "1* Pengecekan semua unit speaker DBTtech15 dengan SmaartLive & Pembersihan debu",
    notes: "Rekomendasi untuk dicek oleh team service terutama pada modul Amplifier.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260903-buluk",
    date: "2026-09-03",
    staffName: "Suryana",
    division: "Audio",
    activity: "1* Pengecekan semua unit speaker DBTtech15 dengan SmaartLive & Pembersihan debu",
    notes: "Pengecekan fisik dan respon frekuensi seluruh unit DBTech.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260903-butong",
    date: "2026-09-03",
    staffName: "Iwan Kurniawan",
    division: "Audio",
    activity: "2* Membersihkan semua unit DBtech dari debu",
    notes: "Membersihkan semua unit DBtech dari debu.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },

  // 4 September 2026
  {
    id: "rep-20260904-opik",
    date: "2026-09-04",
    staffName: "Taufik Diana",
    division: "Audio",
    activity: "Pengecekan Panel 3 Unit",
    notes: "REMARK:\n- 2 panel Sudah OK\n- 1 Ganti Stop Kontak, 1 Ganti Legran Cewe",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260904-buluk",
    date: "2026-09-04",
    staffName: "Suryana",
    division: "Audio",
    activity: "Pengecekan Panel 3 Unit",
    notes: "REMARK:\n- 2 panel Sudah OK\n- 1 Ganti Stop Kontak, 1 Ganti Legran Cewe",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },

  // 5 September 2026
  {
    id: "rep-20260905-opik",
    date: "2026-09-05",
    staffName: "Taufik Diana",
    division: "Audio",
    activity: "Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire menggunakan Sub T45",
    notes: "Panel listrik dalam kondisi aman dan bisa di gunakan.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260905-mboh",
    date: "2026-09-05",
    staffName: "Muhamad Rahmat",
    division: "Audio",
    activity: "Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire menggunakan Sub T45",
    notes: "Panel listrik dalam kondisi aman dan bisa di gunakan.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260905-kharo",
    date: "2026-09-05",
    staffName: "Mulyana",
    division: "Videotron",
    activity: "Repair/ perbaikan Ganti Pixel Kabinet LED 2 Box",
    notes: "Repair/ perbaikan Ganti Pixel Kabinet LED 2 Box selesai.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },

  // 6 September 2026
  {
    id: "rep-20260906-kharo",
    date: "2026-09-06",
    staffName: "Mulyana",
    division: "Videotron",
    activity: "Repair/ perbaikan ganti pixel kabinet led 2 box",
    notes: "Repair/ perbaikan ganti pixel kabinet led 2 box (lanjutan).",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260906-wigi",
    date: "2026-09-06",
    staffName: "Dedi Agus Wigiantoro",
    division: "Videotron",
    activity: "Repair/ perbaikan ganti pixel kabinet led 2 box",
    notes: "Repair/ perbaikan ganti pixel kabinet led 2 box bersama tim LED.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260906-irvan",
    date: "2026-09-06",
    staffName: "Muhamad Irvan",
    division: "Videotron",
    activity: "Repair/ perbaikan ganti pixel kabinet led 2 box",
    notes: "Repair/ perbaikan ganti pixel kabinet led 2 box bersama tim LED.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260906-dani",
    date: "2026-09-06",
    staffName: "Ramdani",
    division: "Audio",
    activity: "Cek cable XLR dan Jack to Jack",
    notes: "Pengecekan kontinuitas dan fisik kabel XLR dan jack to jack.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },

  // 7 September 2026
  {
    id: "rep-20260907-heri",
    date: "2026-09-07",
    staffName: "Heri",
    division: "Lighting",
    activity: "Cek unit, Cleaning, Cek Colour Parled",
    notes: "Harus service warm mati no 12,25,29 | Warm Separo no 3,32",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },

  // 9 September 2026
  {
    id: "rep-20260909-kharo",
    date: "2026-09-09",
    staffName: "Mulyana",
    division: "Videotron",
    activity: "Repair dead pixel 1 box, Copot Masking 7 box",
    notes: "Repair dead pixel 1 box, Copot Masking 7 box. AMAN BISA DI GUNAKAN",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260909-wigi",
    date: "2026-09-09",
    staffName: "Dedi Agus Wigiantoro",
    division: "Videotron",
    activity: "Repair dead pixel 1 box, Copot Masking 7 box",
    notes: "Membantu repair dead pixel dan copot masking 7 box bersama tim LED. AMAN BISA DI GUNAKAN",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260909-ayong",
    date: "2026-09-09",
    staffName: "Ayong Sumarsih",
    division: "Videotron",
    activity: "Repair dead pixel 1 box, Copot Masking 7 box",
    notes: "Supervisi dan pengerjaan modul LED kabinet. AMAN BISA DI GUNAKAN",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260909-buluk",
    date: "2026-09-09",
    staffName: "Suryana",
    division: "Audio",
    activity: "Perbaikan/ Service Mandiri : 1. Kabel snake 8 ch 2. Kabel snake 16 ch 3. Kabel rumbay drum 8 ch 4. Cek Mic EWD/ Ganti Spul",
    notes: "Perbaikan mandiri kabel audio dan spul mic.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260909-opik",
    date: "2026-09-09",
    staffName: "Taufik Diana",
    division: "Audio",
    activity: "Perbaikan/ Service Mandiri : 1. Kabel snake 8 ch 2. Kabel snake 16 ch 3. Kabel rumbay drum 8 ch 4. Cek Mic EWD/ Ganti Spul",
    notes: "Perbaikan mandiri kabel audio dan spul mic.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260909-butong",
    date: "2026-09-09",
    staffName: "Iwan Kurniawan",
    division: "Audio",
    activity: "Perbaikan/ Service Mandiri : 1. Kabel snake 8 ch 2. Kabel snake 16 ch 3. Kabel rumbay drum 8 ch 4. Cek Mic EWD/ Ganti Spul",
    notes: "Perbaikan mandiri kabel audio dan spul mic.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260909-dani",
    date: "2026-09-09",
    staffName: "Ramdani",
    division: "Audio",
    activity: "Perbaikan/ Service Mandiri : 1. Kabel snake 8 ch 2. Kabel snake 16 ch 3. Kabel rumbay drum 8 ch 4. Cek Mic EWD/ Ganti Spul",
    notes: "Perbaikan mandiri kabel audio dan spul mic.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },

  // 10 September 2026
  {
    id: "rep-20260910-heri",
    date: "2026-09-10",
    staffName: "Heri",
    division: "Lighting",
    activity: "Cek Unit, Cleaning, Cek colour, Perbaikan kabel link : - Beam 450 (9 bok / 18 Unit) - BSW 550 (6 bok / 12 Unit) - B-Eye (4 bok / 8 Unit)",
    notes: "- Parled : Harus service warm separo no. 19,20,27\n- XLR (Link) : Sudah service",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260910-mboh",
    date: "2026-09-10",
    staffName: "Muhamad Rahmat",
    division: "Audio",
    activity: "- ngulik fitur DLMS marani MIR480I dan MIR480A\n- CALIBRASI MIC RTA BEHRINGER ECM8000\n- revisi pemasangan BEHRINGER ULTRA LINK",
    notes: "unit dalam klondisi aman tida ada kendala",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },

  // 11 September 2026
  {
    id: "rep-20260911-unyim",
    date: "2026-09-11",
    staffName: "Wahyudin",
    division: "Audio",
    activity: "- ganti skindrum tama celasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase untuk stand mic yang baru",
    notes: "Pemasangan skindrum dan fitting stand mic ke hardcase baru.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260911-buluk",
    date: "2026-09-11",
    staffName: "Suryana",
    division: "Audio",
    activity: "- ganti skindrum tama celasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase untuk stand mic yang baru",
    notes: "Pemasangan skindrum dan fitting stand mic ke hardcase baru.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-11T17:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },

  // 12 September 2026
  {
    id: "rep-20260912-heri",
    date: "2026-09-12",
    staffName: "Heri",
    division: "Lighting",
    activity: "Cek Unit, Cleaning, Cek Colour Parled, Cek Mixer Tiger Touch, Cleaning All Stromy, Cleaning All Freshnell 300 w, Cleaning All blinder 4Cell, Cleaning Parled No. 11,13,14,15,16,17",
    notes: "REMARK:\n- Cek Mixer Tiger Touch: Kondisi Normal\n- Cleaning All Stromy: Kondisi Bersih Normal\n- Cleaning All Freshnell 300 w: Kondisi Normal\n- Cleaning All blinder 4Cell: Kondisi Bersih Normal\n- Cleaning Parled No. 11,13,14,15,16,17: Kondisi Bersih | No. 13 Harus Servic ( Merah Mati )",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-18T15:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },

  // 16 September 2026
  {
    id: "rep-20260916-kharo",
    date: "2026-09-16",
    staffName: "Mulyana",
    division: "Videotron",
    activity: "- Reapir Dead Pixel\n- Buka Masking Kabinet",
    notes: "Repair dead pixel dan buka masking kabinet bersama tim LED.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-18T15:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260916-ayong",
    date: "2026-09-16",
    staffName: "Ayong Sumarsih",
    division: "Videotron",
    activity: "- Reapir Dead Pixel\n- Buka Masking Kabinet",
    notes: "Buka masking kabinet dan supervisi reapir dead pixel bersama tim LED.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-18T15:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260916-jay",
    date: "2026-09-16",
    staffName: "Mulyadi",
    division: "Multimedia",
    activity: "- Ganti Konektor SDI kabel panjang 1. Kabel pendek 1\n- Cek Kabel SDI Perleng Box",
    notes: "Penggantian konektor kabel SDI panjang 1 unit, pendek 1 unit, dan cek perlengkapan box kabel SDI.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-18T15:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260916-unyim",
    date: "2026-09-16",
    staffName: "Wahyudin",
    division: "Audio",
    activity: "Cleaning Avanda 210 16 Box",
    notes: "Kondisi Bersih dan Normal.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-18T15:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260916-dani",
    date: "2026-09-16",
    staffName: "Ramdani",
    division: "Audio",
    activity: "Cleaning & Repaint Mic SM58, SM57 & VXT",
    notes: "Hasil cek mic: SM58 ( Bagus 17, Rusak 1 ), SM57 ( Bagus 11, Rusak 4, Hilang 9 ), VXT ( Bagus 8, Rusak 2 ).",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-18T15:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260916-butong",
    date: "2026-09-16",
    staffName: "Iwan Kurniawan",
    division: "Audio",
    activity: "Bongkar RCF 8003 Kirim ke sambang",
    notes: "2 Unit Speaker 18inc saja dibongkar dan dikirim ke sambang.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-18T15:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260916-heri",
    date: "2026-09-16",
    staffName: "Heri",
    division: "Lighting",
    activity: "CLEANING, CEK UNIT, Konek artnet ke Tiger Touch, Cleaning All Freshnell 200 W, Cek Smoke erorr, Rapihin Kabel PerlBox, Ganti Roda Box Kabel",
    notes: "REMARK:\n- Cleaning All Freshnell 200 W: Kondisi Normal\n- Cek Smoke erorr: Smoke No.3 ERORR\n- Rapihin Kabel PerlBox: Aman\n- Ganti Roda Box Kabel: Lancar",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-18T15:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },

  // 17 September 2026
  {
    id: "rep-20260917-kharo",
    date: "2026-09-17",
    staffName: "Mulyana",
    division: "Videotron",
    activity: "- Ganti Dead Pixel",
    notes: "REMARK:\n- 5 Box Diluar Blom Beres\n- 1 Box Clear\n- 1 Box Baru Beres 4 Kabinet\n- 1 Box Kerusakan Berat",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-18T15:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260917-jay",
    date: "2026-09-17",
    staffName: "Mulyadi",
    division: "Multimedia",
    activity: "- Cek Kabel SDI 50 Meter Dan Ganti Konektor 3 Unit",
    notes: "- Dari 3 Unit Kabel SDI, 1 Unit Harus Ganti konektor ( 2 Unit Aman )",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-18T15:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260917-opik",
    date: "2026-09-17",
    staffName: "Taufik Diana",
    division: "Audio",
    activity: "- Cek Panel Dan Ganti 3 Unit Indikator",
    notes: "- Udah Aman Diganti baru",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-18T15:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260917-dani",
    date: "2026-09-17",
    staffName: "Ramdani",
    division: "Audio",
    activity: "- Cek Mic & Jumlahnya",
    notes: "- Bagus Dan Bersih",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-18T15:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260917-unyim",
    date: "2026-09-17",
    staffName: "Wahyudin",
    division: "Audio",
    activity: "- Cek Takel 1 & 2 Ton",
    notes: "- Takel yg 1 Ton LOS 1 Unit wajib di perbaiki",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-18T15:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260917-yudis",
    date: "2026-09-17",
    staffName: "Yudishtira Purnama A",
    division: "Audio",
    activity: "- Cek Ampeg SVT-4",
    notes: "- Harus service dan ganti PTC",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-18T15:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260917-buluk",
    date: "2026-09-17",
    staffName: "Suryana",
    division: "Audio",
    activity: "Pengecekan dan perawatan kelengkapan audio gudang",
    notes: "Mendukung cek panel listrik, mic, takel, dan amplifier bersama tim sound.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-18T15:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  },
  {
    id: "rep-20260917-butong",
    date: "2026-09-17",
    staffName: "Iwan Kurniawan",
    division: "Audio",
    activity: "Pengecekan dan perawatan kelengkapan audio gudang",
    notes: "Mendukung cek panel listrik, mic, takel, dan amplifier bersama tim sound.",
    status: "Submitted",
    _source: "google_sheet",
    _syncMeta: {
      updatedAt: "2026-09-18T15:00:00.000Z",
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  }
];

export const CANONICAL_FIRESTORE_LOGBOOK_ENTRIES: LogbookEntry[] = [
  // 1 Sept
  {
    id: "log-20260901-jay",
    date: "2026-09-01",
    division: "Multimedia",
    staffName: "Jay",
    activity: "Belajar Aplikasi Gemini & Chat GPT",
    result: "OK",
    followUp: "Belajar aplikasi AI untuk operasional multimedia selesai aman",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Aplikasi Gemini & Chat GPT": { status: "OK", notes: "Kondisi operasional normal" } },
    _source: "google_sheet"
  },
  // 3 Sept
  {
    id: "log-20260903-mboh",
    date: "2026-09-03",
    division: "Audio",
    staffName: "Mboh",
    activity: "1* Pengecekan semua unit speaker DBTtech15 dengan SmaartLive berdasarkan data reference unit yang sehat",
    result: "NG",
    followUp: "DB Tech No.18 modul amplifier serak saat beban input besar. Rekomendasi cek tim service",
    status: "Open",
    verification: "Supervisor Operasional",
    checklists: { "DB Tech No.18": { status: "NG", notes: "Modul amplifier serak" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260903-yudis",
    date: "2026-09-03",
    division: "Audio",
    staffName: "Yudis",
    activity: "1* Pengecekan semua unit speaker DBTtech15 dengan SmaartLive & Pembersihan debu",
    result: "NG",
    followUp: "Rekomendasi untuk dicek oleh team service terutama pada modul amplifier",
    status: "Open",
    verification: "Supervisor Operasional",
    checklists: { "DB Tech 15": { status: "NG", notes: "Perlu cek amplifier" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260903-buluk",
    date: "2026-09-03",
    division: "Audio",
    staffName: "Buluk",
    activity: "1* Pengecekan semua unit speaker DBTtech15 dengan SmaartLive & Pembersihan debu",
    result: "OK",
    followUp: "Pengecekan fisik dan respon frekuensi seluruh unit DBTech selesai aman",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "DB Tech 15": { status: "OK", notes: "Kondisi unit bersih" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260903-butong",
    date: "2026-09-03",
    division: "Audio",
    staffName: "Butong",
    activity: "2* Membersihkan semua unit DBtech dari debu",
    result: "OK",
    followUp: "Membersihkan semua unit DBtech dari debu selesai",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Cleaning DB Tech": { status: "OK", notes: "Unit bersih dari debu" } },
    _source: "google_sheet"
  },
  // 4 Sept
  {
    id: "log-20260904-opik",
    date: "2026-09-04",
    division: "Audio",
    staffName: "Opik",
    activity: "Pengecekan Panel 3 Unit",
    result: "NG",
    followUp: "2 panel Sudah OK. 1 Ganti Stop Kontak, 1 Ganti Legran Cewe",
    status: "Open",
    verification: "Supervisor Operasional",
    checklists: { "Panel Listrik Audio": { status: "NG", notes: "Ganti stop kontak & legrand cewek" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260904-buluk",
    date: "2026-09-04",
    division: "Audio",
    staffName: "Buluk",
    activity: "Pengecekan Panel 3 Unit",
    result: "NG",
    followUp: "2 panel Sudah OK. 1 Ganti Stop Kontak, 1 Ganti Legran Cewe",
    status: "Open",
    verification: "Supervisor Operasional",
    checklists: { "Panel Listrik Audio": { status: "NG", notes: "Ganti stop kontak & legrand cewek" } },
    _source: "google_sheet"
  },
  // 5 Sept
  {
    id: "log-20260905-opik",
    date: "2026-09-05",
    division: "Audio",
    staffName: "Opik",
    activity: "Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire menggunakan Sub T45",
    result: "OK",
    followUp: "Panel listrik dalam kondisi aman dan bisa digunakan",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Panel Listrik": { status: "OK", notes: "Aman dan siap operasi" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260905-mboh",
    date: "2026-09-05",
    division: "Audio",
    staffName: "Mboh",
    activity: "Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire menggunakan Sub T45",
    result: "OK",
    followUp: "Panel listrik dalam kondisi aman dan bisa digunakan",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Panel Listrik": { status: "OK", notes: "Aman dan siap operasi" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260905-kharo",
    date: "2026-09-05",
    division: "Videotron",
    staffName: "Kharo",
    activity: "Repair/ perbaikan Ganti Pixel Kabinet LED 2 Box",
    result: "OK",
    followUp: "Repair pixel kabinet LED 2 box selesai aman",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Modul LED Kabinet": { status: "OK", notes: "Pixel diganti normal" } },
    _source: "google_sheet"
  },
  // 6 Sept
  {
    id: "log-20260906-kharo",
    date: "2026-09-06",
    division: "Videotron",
    staffName: "Kharo",
    activity: "Repair/ perbaikan ganti pixel kabinet led 2 box",
    result: "OK",
    followUp: "Repair/ perbaikan ganti pixel kabinet led 2 box lanjutan selesai",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Modul LED Kabinet": { status: "OK", notes: "2 box selesai repair" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260906-wigi",
    date: "2026-09-06",
    division: "Videotron",
    staffName: "Wigi",
    activity: "Repair/ perbaikan ganti pixel kabinet led 2 box",
    result: "OK",
    followUp: "Repair/ perbaikan ganti pixel kabinet led 2 box lanjutan selesai",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Modul LED Kabinet": { status: "OK", notes: "2 box selesai repair" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260906-irvan",
    date: "2026-09-06",
    division: "Videotron",
    staffName: "Irvan",
    activity: "Repair/ perbaikan ganti pixel kabinet led 2 box",
    result: "OK",
    followUp: "Repair/ perbaikan ganti pixel kabinet led 2 box lanjutan selesai",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Modul LED Kabinet": { status: "OK", notes: "2 box selesai repair" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260906-dani",
    date: "2026-09-06",
    division: "Audio",
    staffName: "Dani",
    activity: "Cek cable XLR dan Jack to Jack",
    result: "OK",
    followUp: "Pengecekan kontinuitas dan fisik kabel XLR dan jack to jack selesai",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Kabel XLR & Jack": { status: "OK", notes: "Kabel normal" } },
    _source: "google_sheet"
  },
  // 7 Sept
  {
    id: "log-20260907-heri",
    date: "2026-09-07",
    division: "Lighting",
    staffName: "Heri",
    activity: "Cek unit, Cleaning, Cek Colour Parled",
    result: "NG",
    followUp: "Harus service warm mati no 12,25,29 | Warm Separo no 3,32",
    status: "Open",
    verification: "Supervisor Operasional",
    checklists: { "PAR LED Warm White": { status: "NG", notes: "Warm mati 12,25,29 separo 3,32" } },
    _source: "google_sheet"
  },
  // 9 Sept
  {
    id: "log-20260909-kharo",
    date: "2026-09-09",
    division: "Videotron",
    staffName: "Kharo",
    activity: "Repair dead pixel 1 box, Copot Masking 7 box",
    result: "OK",
    followUp: "Repair dead pixel 1 box, Copot Masking 7 box selesai",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "LED Kabinet": { status: "OK", notes: "Dead pixel & masking tuntas" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260909-wigi",
    date: "2026-09-09",
    division: "Videotron",
    staffName: "Wigi",
    activity: "Repair dead pixel 1 box, Copot Masking 7 box",
    result: "OK",
    followUp: "Repair dead pixel 1 box, Copot Masking 7 box selesai",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "LED Kabinet": { status: "OK", notes: "Selesai copot masking" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260909-ayong",
    date: "2026-09-09",
    division: "Videotron",
    staffName: "Ayong",
    activity: "Repair dead pixel 1 box, Copot Masking 7 box",
    result: "OK",
    followUp: "Supervisi modul LED kabinet selesai",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "LED Kabinet": { status: "OK", notes: "QC selesai normal" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260909-buluk",
    date: "2026-09-09",
    division: "Audio",
    staffName: "Buluk",
    activity: "Perbaikan/ Service Mandiri : 1. Kabel snake 8 ch 2. Kabel snake 16 ch 3. Kabel rumbay drum 8 ch 4. Cek Mic EWD/ Ganti Spul",
    result: "OK",
    followUp: "Perbaikan mandiri kabel audio dan spul mic selesai aman",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Kabel Snake & Mic": { status: "OK", notes: "Service mandiri selesai" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260909-opik",
    date: "2026-09-09",
    division: "Audio",
    staffName: "Opik",
    activity: "Perbaikan/ Service Mandiri : 1. Kabel snake 8 ch 2. Kabel snake 16 ch 3. Kabel rumbay drum 8 ch 4. Cek Mic EWD/ Ganti Spul",
    result: "OK",
    followUp: "Perbaikan mandiri kabel audio dan spul mic selesai aman",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Kabel Snake & Mic": { status: "OK", notes: "Service mandiri selesai" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260909-butong",
    date: "2026-09-09",
    division: "Audio",
    staffName: "Butong",
    activity: "Perbaikan/ Service Mandiri : 1. Kabel snake 8 ch 2. Kabel snake 16 ch 3. Kabel rumbay drum 8 ch 4. Cek Mic EWD/ Ganti Spul",
    result: "OK",
    followUp: "Perbaikan mandiri kabel audio dan spul mic selesai aman",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Kabel Snake & Mic": { status: "OK", notes: "Service mandiri selesai" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260909-dani",
    date: "2026-09-09",
    division: "Audio",
    staffName: "Dani",
    activity: "Perbaikan/ Service Mandiri : 1. Kabel snake 8 ch 2. Kabel snake 16 ch 3. Kabel rumbay drum 8 ch 4. Cek Mic EWD/ Ganti Spul",
    result: "OK",
    followUp: "Perbaikan mandiri kabel audio dan spul mic selesai aman",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Kabel Snake & Mic": { status: "OK", notes: "Service mandiri selesai" } },
    _source: "google_sheet"
  },
  // 10 Sept
  {
    id: "log-20260910-heri",
    date: "2026-09-10",
    division: "Lighting",
    staffName: "Heri",
    activity: "Cek Unit, Cleaning, Cek colour, Perbaikan kabel link : - Beam 450 (9 bok / 18 Unit) - BSW 550 (6 bok / 12 Unit) - B-Eye (4 bok / 8 Unit)",
    result: "NG",
    followUp: "Parled : Harus service warm separo no. 19,20,27. XLR (Link) : Sudah service",
    status: "Open",
    verification: "Supervisor Operasional",
    checklists: {
      "Beam, BSW, B-Eye & XLR": { status: "OK", notes: "Kabel link selesai service" },
      "Parled Warm Separo": { status: "NG", notes: "Unit 19, 20, 27 separo" }
    },
    _source: "google_sheet"
  },
  {
    id: "log-20260910-mboh",
    date: "2026-09-10",
    division: "Audio",
    staffName: "Mboh",
    activity: "- ngulik fitur DLMS marani MIR480I dan MIR480A\n- CALIBRASI MIC RTA BEHRINGER ECM8000\n- revisi pemasangan BEHRINGER ULTRA LINK",
    result: "OK",
    followUp: "unit dalam klondisi aman tida ada kendala",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "DLMS & Mic RTA": { status: "OK", notes: "Kalibrasi aman" } },
    _source: "google_sheet"
  },
  // 11 Sept
  {
    id: "log-20260911-unyim",
    date: "2026-09-11",
    division: "Audio",
    staffName: "Unyim",
    activity: "- ganti skindrum tama celasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase untuk stand mic yang baru",
    result: "OK",
    followUp: "Pemasangan skindrum dan fitting stand mic selesai",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Drum Kit & Stand Mic": { status: "OK", notes: "Kondisi siap pakai" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260911-buluk",
    date: "2026-09-11",
    division: "Audio",
    staffName: "Buluk",
    activity: "- ganti skindrum tama celasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase untuk stand mic yang baru",
    result: "OK",
    followUp: "Pemasangan skindrum dan fitting stand mic selesai",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Drum Kit & Stand Mic": { status: "OK", notes: "Kondisi siap pakai" } },
    _source: "google_sheet"
  },
  // 12 Sept
  {
    id: "log-20260912-heri",
    date: "2026-09-12",
    division: "Lighting",
    staffName: "Heri",
    activity: "Cek Unit, Cleaning, Cek Colour Parled, Cek Mixer Tiger Touch, Cleaning All Stromy, Cleaning All Freshnell 300 w, Cleaning All blinder 4Cell, Cleaning Parled No. 11,13,14,15,16,17",
    result: "NG",
    followUp: "Cek Mixer Tiger Touch, Stormy, Fresnel 300W, Blinder 4Cell normal. Parled No. 13 Harus Servic (Merah Mati)",
    status: "Open",
    verification: "Supervisor Operasional",
    checklists: {
      "Mixer & Lighting Fixtures": { status: "OK", notes: "Tiger Touch, Stormy, Fresnel 300W, Blinder normal" },
      "Parled No. 13 Merah Mati": { status: "NG", notes: "Parled No. 13 warna merah mati" }
    },
    _source: "google_sheet"
  },
  // 16 Sept
  {
    id: "log-20260916-kharo",
    date: "2026-09-16",
    division: "Videotron",
    staffName: "Kharo",
    activity: "- Reapir Dead Pixel\n- Buka Masking Kabinet",
    result: "OK",
    followUp: "Repair dead pixel dan buka masking kabinet tuntas",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Modul LED": { status: "OK", notes: "Dead pixel repair dan lepas masking aman" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260916-ayong",
    date: "2026-09-16",
    division: "Videotron",
    staffName: "Ayong",
    activity: "- Reapir Dead Pixel\n- Buka Masking Kabinet",
    result: "OK",
    followUp: "Buka masking kabinet dan supervisi repair dead pixel",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Modul LED": { status: "OK", notes: "Masking dilepas siap operasional" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260916-jay",
    date: "2026-09-16",
    division: "Multimedia",
    staffName: "Jay",
    activity: "- Ganti Konektor SDI kabel panjang 1. Kabel pendek 1\n- Cek Kabel SDI Perleng Box",
    result: "OK",
    followUp: "Ganti konektor SDI kabel panjang 1 & pendek 1 serta cek box kabel selesai",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Kabel SDI": { status: "OK", notes: "Konektor baru terpasang & sinyal aman" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260916-unyim",
    date: "2026-09-16",
    division: "Audio",
    staffName: "Unyim",
    activity: "Cleaning Avanda 210 16 Box",
    result: "OK",
    followUp: "Cleaning Avanda 210 16 Box kondisi bersih dan normal",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Avanda 210 (16 Box)": { status: "OK", notes: "Kondisi bersih dan siap pakai" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260916-dani",
    date: "2026-09-16",
    division: "Audio",
    staffName: "Dani",
    activity: "Cleaning & Repaint Mic SM58, SM57 & VXT",
    result: "OK",
    followUp: "Hasil sortir mic: SM58 (Bagus 17, Rusak 1), SM57 (Bagus 11, Rusak 4, Hilang 9), VXT (Bagus 8, Rusak 2)",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Mic SM58, SM57 & VXT": { status: "OK", notes: "Cleaning & repaint selesai, unit rusak dipisahkan" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260916-butong",
    date: "2026-09-16",
    division: "Audio",
    staffName: "Butong",
    activity: "Bongkar RCF 8003 Kirim ke sambang",
    result: "OK",
    followUp: "2 Unit Speaker 18inc saja dibongkar dan dikirim ke sambang",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "RCF 8003 (2 Unit)": { status: "OK", notes: "Bongkar dan pengiriman aman" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260916-heri",
    date: "2026-09-16",
    division: "Lighting",
    staffName: "Heri",
    activity: "CLEANING, CEK UNIT, Konek artnet ke Tiger Touch, Cleaning All Freshnell 200 W, Cek Smoke erorr, Rapihin Kabel PerlBox, Ganti Roda Box Kabel",
    result: "NG",
    followUp: "Fresnel 200W normal, kabel box aman lancar. Smoke No.3 ERORR",
    status: "Open",
    verification: "Supervisor Operasional",
    checklists: {
      "Artnet & Fresnel 200W": { status: "OK", notes: "Koneksi dan fixture normal" },
      "Smoke Machine No.3": { status: "NG", notes: "Smoke No. 3 Error" },
      "Box Kabel & Roda": { status: "OK", notes: "Roda baru lancar" }
    },
    _source: "google_sheet"
  },
  // 17 Sept
  {
    id: "log-20260917-kharo",
    date: "2026-09-17",
    division: "Videotron",
    staffName: "Kharo",
    activity: "- Ganti Dead Pixel",
    result: "NG",
    followUp: "1 Box Clear, 1 Box Baru Beres 4 Kabinet, 5 Box Diluar Belum Beres, 1 Box Kerusakan Berat",
    status: "Open",
    verification: "Supervisor Operasional",
    checklists: {
      "LED Box Clear": { status: "OK", notes: "1 Box selesai tuntas" },
      "LED Box Progress": { status: "NG", notes: "5 Box belum beres, 1 box rusak berat" }
    },
    _source: "google_sheet"
  },
  {
    id: "log-20260917-jay",
    date: "2026-09-17",
    division: "Multimedia",
    staffName: "Jay",
    activity: "- Cek Kabel SDI 50 Meter Dan Ganti Konektor 3 Unit",
    result: "NG",
    followUp: "Dari 3 Unit Kabel SDI, 1 Unit Harus Ganti konektor (2 Unit Aman)",
    status: "Open",
    verification: "Supervisor Operasional",
    checklists: {
      "Kabel SDI 50M": { status: "NG", notes: "1 Unit harus ganti konektor, 2 unit aman" }
    },
    _source: "google_sheet"
  },
  {
    id: "log-20260917-opik",
    date: "2026-09-17",
    division: "Audio",
    staffName: "Opik",
    activity: "- Cek Panel Dan Ganti 3 Unit Indikator",
    result: "OK",
    followUp: "Udah Aman Diganti baru 3 unit indikator",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Panel Indikator": { status: "OK", notes: "3 Unit indikator diganti baru aman" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260917-dani",
    date: "2026-09-17",
    division: "Audio",
    staffName: "Dani",
    activity: "- Cek Mic & Jumlahnya",
    result: "OK",
    followUp: "Bagus Dan Bersih",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Pengecekan Mic": { status: "OK", notes: "Seluruh mic dihitung & kondisi bersih bagus" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260917-unyim",
    date: "2026-09-17",
    division: "Audio",
    staffName: "Unyim",
    activity: "- Cek Takel 1 & 2 Ton",
    result: "NG",
    followUp: "Takel yg 1 Ton LOS 1 Unit wajib di perbaiki",
    status: "Open",
    verification: "Supervisor Operasional",
    checklists: {
      "Takel 2 Ton": { status: "OK", notes: "Kondisi aman" },
      "Takel 1 Ton": { status: "NG", notes: "1 Unit LOS wajib diperbaiki" }
    },
    _source: "google_sheet"
  },
  {
    id: "log-20260917-yudis",
    date: "2026-09-17",
    division: "Audio",
    staffName: "Yudis",
    activity: "- Cek Ampeg SVT-4",
    result: "NG",
    followUp: "Harus service dan ganti PTC",
    status: "Open",
    verification: "Supervisor Operasional",
    checklists: {
      "Ampeg SVT-4 Bass Amp": { status: "NG", notes: "Harus service dan ganti PTC" }
    },
    _source: "google_sheet"
  },
  {
    id: "log-20260917-buluk",
    date: "2026-09-17",
    division: "Audio",
    staffName: "Buluk",
    activity: "Pengecekan dan perawatan kelengkapan audio gudang",
    result: "OK",
    followUp: "Mendukung cek panel listrik, mic, takel, dan amplifier bersama tim sound selesai",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Kelengkapan Audio": { status: "OK", notes: "Perawatan kelengkapan audio selesai" } },
    _source: "google_sheet"
  },
  {
    id: "log-20260917-butong",
    date: "2026-09-17",
    division: "Audio",
    staffName: "Butong",
    activity: "Pengecekan dan perawatan kelengkapan audio gudang",
    result: "OK",
    followUp: "Mendukung cek panel listrik, mic, takel, dan amplifier bersama tim sound selesai",
    status: "Close",
    verification: "Supervisor Operasional",
    checklists: { "Kelengkapan Audio": { status: "OK", notes: "Perawatan kelengkapan audio selesai" } },
    _source: "google_sheet"
  }
];

export const CANONICAL_FIRESTORE_FINDINGS: Finding[] = [
  {
    id: "find-20260903-dbtech18",
    equipment: "DB Tech No. 18 (Active Speaker 15 Inch)",
    issue: "Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang dikeluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event. Rekomendasi untuk dicek oleh team service terutama pada modul Amplifier.",
    priority: "Sedang",
    pic: "Mulyana",
    targetDate: "2026-09-05",
    status: "Close",
    dateCreated: "2026-09-03",
    division: "Service",
    _source: "google_sheet"
  },
  {
    id: "find-20260904-panel-audio",
    equipment: "Panel Listrik Audio 3 Phase",
    issue: "1 Ganti Stop Kontak, 1 Ganti Legrand Cewek (2 panel lainnya sudah OK).",
    priority: "Tinggi",
    pic: "Taufik Diana / Suryana",
    targetDate: "2026-09-05",
    status: "Close",
    dateCreated: "2026-09-04",
    division: "Audio",
    _source: "google_sheet"
  },
  {
    id: "find-20260907-parled",
    equipment: "PAR LED Warm White (Lighting)",
    issue: "Harus service warm mati no 12, 25, 29 | Warm separo no 3, 32.",
    priority: "Sedang",
    pic: "Heri",
    targetDate: "2026-09-10",
    status: "Open",
    dateCreated: "2026-09-07",
    division: "Lighting",
    _source: "google_sheet"
  },
  {
    id: "find-20260910-parled",
    equipment: "PAR LED Warm White (Lighting)",
    issue: "Harus service warm separo no. 19, 20, 27.",
    priority: "Sedang",
    pic: "Heri",
    targetDate: "2026-09-12",
    status: "Open",
    dateCreated: "2026-09-10",
    division: "Lighting",
    _source: "google_sheet"
  },
  {
    id: "find-20260910-xlr",
    equipment: "Kabel XLR Link Lighting",
    issue: "Perbaikan kabel link Beam 450, BSW 550, B-Eye & kabel XLR link.",
    priority: "Sedang",
    pic: "Heri",
    targetDate: "2026-09-10",
    status: "Close",
    dateCreated: "2026-09-10",
    division: "Lighting",
    _source: "google_sheet"
  },
  {
    id: "find-20260912-parled13",
    equipment: "PAR LED No. 13 (Lighting)",
    issue: "Harus Service ( Merah Mati ).",
    priority: "Sedang",
    pic: "Heri",
    targetDate: "2026-09-15",
    status: "Open",
    dateCreated: "2026-09-12",
    division: "Lighting",
    _source: "google_sheet"
  },
  {
    id: "find-20260916-smoke3",
    equipment: "Smoke Machine No. 3 (Lighting)",
    issue: "Smoke No.3 ERORR saat dicek.",
    priority: "Sedang",
    pic: "Heri",
    targetDate: "2026-09-18",
    status: "Open",
    dateCreated: "2026-09-16",
    division: "Lighting",
    _source: "google_sheet"
  },
  {
    id: "find-20260917-sdi50m",
    equipment: "Kabel SDI 50 Meter (Multimedia)",
    issue: "Dari 3 Unit Kabel SDI, 1 Unit Harus Ganti konektor ( 2 Unit Aman ).",
    priority: "Sedang",
    pic: "Mulyadi",
    targetDate: "2026-09-18",
    status: "Open",
    dateCreated: "2026-09-17",
    division: "Multimedia",
    _source: "google_sheet"
  },
  {
    id: "find-20260917-takel1ton",
    equipment: "Takel 1 Ton (Audio / Rigging)",
    issue: "Takel yg 1 Ton LOS 1 Unit wajib di perbaiki.",
    priority: "Tinggi",
    pic: "Wahyudin",
    targetDate: "2026-09-19",
    status: "Open",
    dateCreated: "2026-09-17",
    division: "Audio",
    _source: "google_sheet"
  },
  {
    id: "find-20260917-ampeg",
    equipment: "Ampeg SVT-4 Bass Amplifier (Audio)",
    issue: "Harus service dan ganti PTC.",
    priority: "Sedang",
    pic: "Yudishtira Purnama A",
    targetDate: "2026-09-19",
    status: "Open",
    dateCreated: "2026-09-17",
    division: "Audio",
    _source: "google_sheet"
  }
];

export const CANONICAL_FIRESTORE_WORK_ORDERS: WorkOrder[] = [
  {
    id: "wo-20260904-panel-01",
    title: "Perbaikan Panel Listrik Audio 3 Phase (Ganti Stop Kontak & Legrand Cewek)",
    description: "Perbaikan panel listrik selesai dilakukan Opik & Buluk pada 5 Sept 2026. 1 Ganti Stop Kontak, 1 Ganti Legrand Cewek. Panel listrik dalam kondisi aman dan siap digunakan untuk event.",
    pic: "Taufik Diana / Suryana",
    division: "Audio",
    deadline: "2026-09-05",
    progress: 100,
    status: "Completed",
    dateCreated: "2026-09-04",
    findingId: "find-20260904-panel-audio",
    _syncMeta: {
      deviceOS: "macOS",
      deviceType: "Desktop",
      browser: "Chrome",
      updatedBy: "BatchSync",
      updatedAt: "2026-09-11T17:00:00.000Z"
    }
  },
  {
    id: "wo-20260903-dbtech-service",
    title: "Inspeksi & Perbaikan Modul Amplifier DB Tech No. 18",
    description: "Modul amplifier DB Tech No. 18 serak saat input besar, telah diperbaiki dan distabilkan.",
    pic: "Mulyana",
    division: "Service",
    deadline: "2026-09-05",
    progress: 100,
    status: "Completed",
    dateCreated: "2026-09-03",
    findingId: "find-20260903-dbtech18",
    _syncMeta: {
      deviceOS: "macOS",
      deviceType: "Desktop",
      browser: "Chrome",
      updatedBy: "BatchSync",
      updatedAt: "2026-09-11T17:00:00.000Z"
    }
  },
  {
    id: "wo-20260909-kabel-audio",
    title: "Perbaikan / Service Mandiri Kabel Snake 8ch, 16ch, Rumbay Drum 8ch & Ganti Spul Mic EWD",
    description: "Perbaikan mandiri kabel snake 8 ch, 16 ch, rumbay drum 8 ch, dan ganti spul mic EWD selesai dikerjakan bersama tim Audio.",
    pic: "Suryana / Taufik Diana / Iwan Kurniawan / Ramdani",
    division: "Audio",
    deadline: "2026-09-09",
    progress: 100,
    status: "Completed",
    dateCreated: "2026-09-09",
    _syncMeta: {
      deviceOS: "macOS",
      deviceType: "Desktop",
      browser: "Chrome",
      updatedBy: "BatchSync",
      updatedAt: "2026-09-11T17:00:00.000Z"
    }
  },
  {
    id: "wo-20260910-xlr-lighting",
    title: "Service Kabel XLR Link Lighting",
    description: "Kabel link Beam, BSW, B-Eye dan kabel link XLR selesai diservice dan siap operasi.",
    pic: "Heri",
    division: "Lighting",
    deadline: "2026-09-10",
    progress: 100,
    status: "Completed",
    dateCreated: "2026-09-10",
    findingId: "find-20260910-xlr",
    _syncMeta: {
      deviceOS: "macOS",
      deviceType: "Desktop",
      browser: "Chrome",
      updatedBy: "BatchSync",
      updatedAt: "2026-09-11T17:00:00.000Z"
    }
  }
];
