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
    "division": "Service",
    "activity": "- Ganti Dead Pixel LED Kabinet",
    "notes": "- 3 Box Belum Beres\n- 2 Box Clear\n- 1 Box Beres 3 Kabinet\n- 1 Box Kerusakan Berat",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260903-yudis-hadir",
    "date": "2026-09-03",
    "staffName": "Yudis",
    "division": "Audio",
    "activity": "- Hadir & Standby pengecekan unit Audio bersama tim",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260904-buluk-hadir",
    "date": "2026-09-04",
    "staffName": "Buluk",
    "division": "Audio",
    "activity": "- 1 Ganti Stop Kontak, 1 Ganti Legran Cewe (panel)",
    "notes": "Selesai diperbaiki",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260905-mboh-hadir",
    "date": "2026-09-05",
    "staffName": "Mboh",
    "division": "Audio",
    "activity": "- Hadir & Support kegiatan audio bersama tim Opik",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260909-wigi-hadir",
    "date": "2026-09-09",
    "staffName": "Wigi",
    "division": "Videotron",
    "activity": "- Repair dead pixel kabinet LED — selesai 1 box",
    "notes": "selesai 1 box",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260909-ayong-hadir",
    "date": "2026-09-09",
    "staffName": "Ayong",
    "division": "Videotron",
    "activity": "- Repair LED, copot masking — selesai 1 box",
    "notes": "selesai 1 box",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260909-opik-hadir",
    "date": "2026-09-09",
    "staffName": "Opik",
    "division": "Audio",
    "activity": "- Hadir & standby support perbaikan audio bersama tim",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260909-butong-hadir",
    "date": "2026-09-09",
    "staffName": "Butong",
    "division": "Audio",
    "activity": "- Hadir & standby support perbaikan audio bersama tim",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260909-dani-hadir",
    "date": "2026-09-09",
    "staffName": "Dani",
    "division": "Audio",
    "activity": "- Hadir & standby support bersama tim",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260917-buluk-hadir",
    "date": "2026-09-17",
    "staffName": "Buluk",
    "division": "Audio",
    "activity": "- Hadir & standby support audio bersama tim",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260917-butonk-hadir",
    "date": "2026-09-17",
    "staffName": "Butonk",
    "division": "Audio",
    "activity": "- Hadir & standby support bersama tim",
    "notes": "",
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

export const CANONICAL_FIRESTORE_FINDINGS: Finding[] = [
  {
    "id": "fd-20260903-mboh-amplifier",
    "equipment": "DBTech Speaker No.18 — Modul Amplifier",
    "issue": "Modul Amplifier bermasalah. Saat terkena beban input besar, suara yang dikeluarkan menjadi serak. Perlu pengecekan modul amplifier dan spare-part tweeter.",
    "priority": "Sedang",
    "pic": "Muhamad Rahmat",
    "targetDate": "2026-09-17",
    "status": "Open",
    "dateCreated": "2026-09-03",
    "division": "Audio",
    "_source": "google_sheet_remark"
  },
  {
    "id": "fd-20260907-heri-parled-warm-01",
    "equipment": "Parled Warm — Unit No.12, 25, 29 (Mati) & No.3, 32 (Separo)",
    "issue": "Warm mati total: no.12, 25, 29. Warm hanya separo: no.3, 32. Harus service segera.",
    "priority": "Tinggi",
    "pic": "Heri",
    "targetDate": "2026-09-14",
    "status": "Open",
    "dateCreated": "2026-09-07",
    "division": "Lighting",
    "_source": "google_sheet_remark"
  },
  {
    "id": "fd-20260910-heri-parled-warm-02",
    "equipment": "Parled Warm — Unit No.19, 20, 27 (Separo)",
    "issue": "Warm separo pada unit no.19, 20, 27. Harus service.",
    "priority": "Tinggi",
    "pic": "Heri",
    "targetDate": "2026-09-17",
    "status": "Open",
    "dateCreated": "2026-09-10",
    "division": "Lighting",
    "_source": "google_sheet_remark"
  },
  {
    "id": "fd-20260912-heri-parled-13",
    "equipment": "Parled No.13 — LED Merah Mati",
    "issue": "Parled No.13: LED merah mati total. Harus service segera.",
    "priority": "Tinggi",
    "pic": "Heri",
    "targetDate": "2026-09-19",
    "status": "Open",
    "dateCreated": "2026-09-12",
    "division": "Lighting",
    "_source": "google_sheet_remark"
  },
  {
    "id": "fd-20260916-heri-smoke-03",
    "equipment": "Smoke Machine No.3",
    "issue": "Smoke No.3 ERROR — tidak berfungsi normal saat pengecekan.",
    "priority": "Sedang",
    "pic": "Heri",
    "targetDate": "2026-09-21",
    "status": "Open",
    "dateCreated": "2026-09-16",
    "division": "Lighting",
    "_source": "google_sheet_remark"
  },
  {
    "id": "fd-20260916-dani-sm57",
    "equipment": "Mic SM57 — Rusak & Hilang",
    "issue": "Hasil inventaris: SM57 Rusak 4 unit, Hilang 9 unit. Perlu tindak lanjut dan pemenuhan unit pengganti.",
    "priority": "Tinggi",
    "pic": "Ramdani",
    "targetDate": "2026-09-23",
    "status": "Open",
    "dateCreated": "2026-09-16",
    "division": "Audio",
    "_source": "google_sheet_remark"
  },
  {
    "id": "fd-20260917-unyim-takel",
    "equipment": "Takel 1 Ton — Unit LOS",
    "issue": "Takel 1 Ton: 1 unit LOS (Line of Sight failure). Wajib diperbaiki sebelum digunakan untuk event berikutnya.",
    "priority": "Tinggi",
    "pic": "Wahyudin",
    "targetDate": "2026-09-22",
    "status": "Open",
    "dateCreated": "2026-09-17",
    "division": "Audio",
    "_source": "google_sheet_remark"
  },
  {
    "id": "fd-20260917-yudis-ampeg",
    "equipment": "Ampeg SVT-4 — Amplifier Bass",
    "issue": "Ampeg SVT-4 harus service dan ganti komponen PTC. Tidak layak pakai sebelum diperbaiki.",
    "priority": "Tinggi",
    "pic": "Yudishtira Purnama A",
    "targetDate": "2026-09-22",
    "status": "Open",
    "dateCreated": "2026-09-17",
    "division": "Audio",
    "_source": "google_sheet_remark"
  }
];

export const CANONICAL_FIRESTORE_WORK_ORDERS: WorkOrder[] = [
  {
    "id": "wo-20260903-amplifier-dbtech",
    "findingId": "fd-20260903-mboh-amplifier",
    "title": "Service Modul Amplifier DBTech No.18",
    "description": "Pengecekan dan perbaikan modul amplifier pada speaker DBTech No.18. Suara serak saat beban input besar. Cek modul amplifier dan spare-part tweeter.",
    "pic": "Mulyana",
    "division": "Service",
    "deadline": "2026-09-17",
    "progress": 0,
    "status": "Pending",
    "dateCreated": "2026-09-03",
    "equipment": "DBTech Speaker No.18",
    "priority": "Sedang",
    "notes": "Rekomendasi dari: Muhamad Rahmat (Mboh) — Audio",
    "_source": "google_sheet_remark"
  },
  {
    "id": "wo-20260907-parled-warm-01",
    "findingId": "fd-20260907-heri-parled-warm-01",
    "title": "Service Parled Warm — Mati No.12,25,29 & Separo No.3,32",
    "description": "Perbaikan Parled Warm: Unit no.12, 25, 29 mati total. Unit no.3, 32 hanya nyala separo. Perlu service menyeluruh.",
    "pic": "Mulyana",
    "division": "Service",
    "deadline": "2026-09-14",
    "progress": 0,
    "status": "In Progress",
    "dateCreated": "2026-09-07",
    "equipment": "Parled Warm Lighting",
    "priority": "Tinggi",
    "notes": "Ditemukan oleh: Heri — Divisi Lighting",
    "_source": "google_sheet_remark"
  },
  {
    "id": "wo-20260910-parled-warm-02",
    "findingId": "fd-20260910-heri-parled-warm-02",
    "title": "Service Parled Warm — Separo No.19,20,27",
    "description": "Perbaikan Parled Warm: Unit no.19, 20, 27 hanya nyala separo. Harus service.",
    "pic": "Mulyana",
    "division": "Service",
    "deadline": "2026-09-17",
    "progress": 0,
    "status": "In Progress",
    "dateCreated": "2026-09-10",
    "equipment": "Parled Warm Lighting",
    "priority": "Tinggi",
    "notes": "Ditemukan oleh: Heri — Divisi Lighting",
    "_source": "google_sheet_remark"
  },
  {
    "id": "wo-20260912-parled-13",
    "findingId": "fd-20260912-heri-parled-13",
    "title": "Service Parled No.13 — LED Merah Mati",
    "description": "Parled No.13 LED merah mati total. Butuh pengecekan dan penggantian modul LED merah.",
    "pic": "Mulyana",
    "division": "Service",
    "deadline": "2026-09-19",
    "progress": 0,
    "status": "Pending",
    "dateCreated": "2026-09-12",
    "equipment": "Parled Lighting No.13",
    "priority": "Tinggi",
    "notes": "Ditemukan oleh: Heri — Divisi Lighting",
    "_source": "google_sheet_remark"
  },
  {
    "id": "wo-20260916-smoke-03",
    "findingId": "fd-20260916-heri-smoke-03",
    "title": "Perbaikan Smoke Machine No.3 — ERROR",
    "description": "Smoke Machine No.3 mengalami error saat pengecekan tanggal 16 Sep 2026. Perlu diagnosa dan perbaikan.",
    "pic": "Mulyana",
    "division": "Service",
    "deadline": "2026-09-21",
    "progress": 0,
    "status": "Pending",
    "dateCreated": "2026-09-16",
    "equipment": "Smoke Machine No.3",
    "priority": "Sedang",
    "notes": "Ditemukan oleh: Heri — Divisi Lighting",
    "_source": "google_sheet_remark"
  },
  {
    "id": "wo-20260916-sm57-inventaris",
    "findingId": "fd-20260916-dani-sm57",
    "title": "Tindak Lanjut SM57 Rusak 4 Unit & Hilang 9 Unit",
    "description": "Dari hasil inventaris oleh Ramdani: SM57 rusak 4 unit, hilang 9 unit. Perlu laporan ke manajemen, pengajuan penggantian unit, dan investigasi penyebab kehilangan.",
    "pic": "Ramdani",
    "division": "Audio",
    "deadline": "2026-09-23",
    "progress": 0,
    "status": "Pending",
    "dateCreated": "2026-09-16",
    "equipment": "Mic Shure SM57",
    "priority": "Tinggi",
    "notes": "Ditemukan oleh: Ramdani (Dani) — Divisi Audio. SM58: Bagus 17, Rusak 1. VXT: Bagus 8, Rusak 2.",
    "_source": "google_sheet_remark"
  },
  {
    "id": "wo-20260917-takel-1ton",
    "findingId": "fd-20260917-unyim-takel",
    "title": "Perbaikan Takel 1 Ton — LOS",
    "description": "Takel kapasitas 1 Ton mengalami LOS (Line of Sight failure / rantai putus). Wajib diperbaiki atau diganti sebelum digunakan pada event.",
    "pic": "Mulyana",
    "division": "Service",
    "deadline": "2026-09-22",
    "progress": 0,
    "status": "In Progress",
    "dateCreated": "2026-09-17",
    "equipment": "Takel Chain Hoist 1 Ton",
    "priority": "Tinggi",
    "notes": "Ditemukan oleh: Wahyudin (Unyim) — Divisi Audio. Safety critical — jangan digunakan sebelum diperbaiki.",
    "_source": "google_sheet_remark"
  },
  {
    "id": "wo-20260917-ampeg-svt4",
    "findingId": "fd-20260917-yudis-ampeg",
    "title": "Service Ampeg SVT-4 — Ganti Komponen PTC",
    "description": "Ampeg SVT-4 amplifier bass tidak berfungsi normal. Harus service dan ganti komponen PTC. Tidak layak digunakan sebelum diperbaiki.",
    "pic": "Mulyana",
    "division": "Service",
    "deadline": "2026-09-22",
    "progress": 0,
    "status": "Pending",
    "dateCreated": "2026-09-17",
    "equipment": "Ampeg SVT-4 Bass Amplifier",
    "priority": "Tinggi",
    "notes": "Ditemukan oleh: Yudishtira Purnama A (Yudis) — Divisi Audio.",
    "_source": "google_sheet_remark"
  }
];

