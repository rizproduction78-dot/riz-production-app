import { DailyReport, LogbookEntry, Finding, WorkOrder } from '../types';

/**
 * DATA KANONIKAL RESMI GOOGLE SHEET PT. RIZ PRODUCTION MULTI KREASI
 * Sumber Resmi: Google Spreadsheet 1N8MkJtDpD9VmrtSkTuygxiyNRmEVCAWDITZisiVd_Dc (GID: 198998470)
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
    notes: "Repair dead pixel 1 box, Copot Masking 7 box.",
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
    notes: "Membantu repair dead pixel dan copot masking 7 box bersama tim LED.",
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
    notes: "Supervisi dan pengerjaan modul LED kabinet.",
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
