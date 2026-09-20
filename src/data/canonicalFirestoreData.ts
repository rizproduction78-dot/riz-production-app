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
    "notes": "- 2 panel Sudah OK",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260905-opik-8-0",
    "date": "2026-09-05",
    "staffName": "Opik",
    "division": "Audio",
    "activity": "- Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire menggunakan Sub T45",
    "notes": "- Panel listrik dalam kondisi aman dan bisa di gunakan",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260905-kharo-10-0",
    "date": "2026-09-05",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- Repair/ perbaikan Ganti Pixel Kabinet LED 2 Box",
    "notes": "selesai 2 box",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260906-kharo-11-0",
    "date": "2026-09-06",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "notes": "selesai 2 box",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260906-wigi-11-1",
    "date": "2026-09-06",
    "staffName": "Wigi",
    "division": "Videotron",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "notes": "selesai 2 box",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260906-irvan-11-2",
    "date": "2026-09-06",
    "staffName": "Irvan",
    "division": "Videotron",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "notes": "selesai 2 box",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260906-dani-12-0",
    "date": "2026-09-06",
    "staffName": "-Dani",
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
    "notes": "selesai 1 box",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260909-buluk-17-0",
    "date": "2026-09-09",
    "staffName": "Buluk",
    "division": "Audio",
    "activity": "- Perbaikan/ Service Mandiri :\n1. Kabel snake 8 ch \n2. Kabel snake 16 ch \n3. Kabel rumbay drum 8 ch\n4. Cek Mic EWD/ Ganti Spul",
    "notes": "- selesai dan dapat di gunakan",
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
    "id": "rep-20260910-mboh-24-0",
    "date": "2026-09-10",
    "staffName": "Mboh",
    "division": "Audio",
    "activity": "*ngulik fitur DLMS marani MIR480I dan MIR480A",
    "notes": "unit dalam kondisi aman tida ada kendala",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260911-unyim-27-0",
    "date": "2026-09-11",
    "staffName": "unyim",
    "division": "Audio",
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat",
    "notes": "selesai dengan baik dan bisa di gunakan",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260911-buluk-27-1",
    "date": "2026-09-11",
    "staffName": "buluk",
    "division": "Audio",
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat",
    "notes": "selesai dengan baik dan bisa di gunakan",
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
    "id": "rep-20260916-kharo-34-0",
    "date": "2026-09-16",
    "staffName": "Kharo",
    "division": "Videotron",
    "activity": "- Reapir Dead Pixel",
    "notes": "",
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
    "notes": "2 Unit Speaker 18inc saja",
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
  }
];

export const CANONICAL_FIRESTORE_LOGBOOK_ENTRIES: LogbookEntry[] = [
  {
    "id": "log-20260903-mboh-2-0",
    "date": "2026-09-03",
    "division": "Audio",
    "staffName": "Mboh",
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
    "division": "Audio",
    "staffName": "Opik",
    "activity": "- Pengecekan Panel 3 Unit",
    "result": "OK",
    "followUp": "- 2 panel Sudah OK",
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
    "id": "log-20260905-opik-8-0",
    "date": "2026-09-05",
    "division": "Audio",
    "staffName": "Opik",
    "activity": "- Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire menggunakan Sub T45",
    "result": "OK",
    "followUp": "- Panel listrik dalam kondisi aman dan bisa di gunakan",
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
    "division": "Videotron",
    "staffName": "Kharo",
    "activity": "- Repair/ perbaikan Ganti Pixel Kabinet LED 2 Box",
    "result": "OK",
    "followUp": "selesai 2 box",
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
    "division": "Videotron",
    "staffName": "Kharo",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "result": "OK",
    "followUp": "selesai 2 box",
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
    "division": "Videotron",
    "staffName": "Wigi",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "result": "OK",
    "followUp": "selesai 2 box",
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
    "division": "Videotron",
    "staffName": "Irvan",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "result": "OK",
    "followUp": "selesai 2 box",
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
    "division": "Audio",
    "staffName": "-Dani",
    "activity": "- Cek cable XLR dan Jack to Jack",
    "result": "OK",
    "followUp": "Tugas harian selesai",
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
    "division": "Lighting",
    "staffName": "Heri",
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
    "division": "Videotron",
    "staffName": "Kharo",
    "activity": "- Repair dead pixel 1 box\n- Copot Masking 7 box",
    "result": "OK",
    "followUp": "selesai 1 box",
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
    "division": "Audio",
    "staffName": "Buluk",
    "activity": "- Perbaikan/ Service Mandiri :\n1. Kabel snake 8 ch \n2. Kabel snake 16 ch \n3. Kabel rumbay drum 8 ch\n4. Cek Mic EWD/ Ganti Spul",
    "result": "OK",
    "followUp": "- selesai dan dapat di gunakan",
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
    "division": "Lighting",
    "staffName": "Heri",
    "activity": "Cek Unit, Cleaning, Cek colour, Perbaikan kabel  link :\n- Beam 450 (9 bok / 18 Unit)\n- BSW 550 (6 bok / 12 Unit)\n- B-Eye (4 bok / 8 Unit)",
    "result": "OK",
    "followUp": "Tugas harian selesai",
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
    "division": "Audio",
    "staffName": "unyim",
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat",
    "result": "OK",
    "followUp": "selesai dengan baik dan bisa di gunakan",
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
    "division": "Audio",
    "staffName": "buluk",
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat",
    "result": "OK",
    "followUp": "selesai dengan baik dan bisa di gunakan",
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
    "division": "Lighting",
    "staffName": "Heri",
    "activity": "Cek Unit, Cleaning, Cek Colour Parled",
    "result": "OK",
    "followUp": "Tugas harian selesai",
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
    "division": "Multimedia",
    "staffName": "Jay",
    "activity": "- Ganti Konektor SDI kabel panjang 1. Kabel pendek 1",
    "result": "OK",
    "followUp": "Tugas harian selesai",
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
    "division": "Audio",
    "staffName": "Unyim",
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
    "division": "Audio",
    "staffName": "Dani",
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
    "division": "Lighting",
    "staffName": "Heri",
    "activity": "CLEANING, CEK UNIT",
    "result": "OK",
    "followUp": "Tugas harian selesai",
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
    "division": "Videotron",
    "staffName": "Kharo",
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
    "division": "Multimedia",
    "staffName": "Jay",
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
    "division": "Audio",
    "staffName": "Opik",
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
    "division": "Audio",
    "staffName": "Dani",
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
    "division": "Audio",
    "staffName": "Unyim",
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
    "division": "Audio",
    "staffName": "Yudis",
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
    "division": "Videotron",
    "staffName": "Kharo",
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
  }
];

export const CANONICAL_FIRESTORE_FINDINGS: Finding[] = [];

export const CANONICAL_FIRESTORE_WORK_ORDERS: WorkOrder[] = [];
