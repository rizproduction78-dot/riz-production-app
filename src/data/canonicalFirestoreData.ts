import { DailyReport, LogbookEntry, Finding, WorkOrder } from '../types';

/**
 * DATA KANONIKAL RESMI CLOUD FIRESTORE & GOOGLE SHEET PT. RIZ PRODUCTION MULTI KREASI
 * Disinkronkan langsung dari Cloud Firestore (wh-logbook-2026).
 * Total: 256 Daily Reports | 221 Logbook Entries | 47 Findings | 16 Work Orders
 */

export const CANONICAL_FIRESTORE_DAILY_REPORTS: DailyReport[] = [
  {
    "id": "gsheet-v2-2026-09-01-Mulyadi--_Belajar_Aplikasi_Chat_GPT",
    "notes": "",
    "_syncedAt": "2026-09-29T01:45:35.183Z",
    "staffName": "Mulyadi",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-02T07:00:44.441Z"
    },
    "division": "Multimedia",
    "activity": "- Belajar Aplikasi Chat GPT",
    "status": "Submitted",
    "_source": "google_sheet",
    "date": "2026-09-01"
  },
  {
    "id": "gsheet-v2-2026-09-01-Mulyadi--_Belajar_Aplikasi_Gemini",
    "notes": "selesai basic progress tingkat lanjut",
    "date": "2026-09-01",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-02T07:00:44.441Z"
    },
    "_source": "google_sheet",
    "division": "Multimedia",
    "_syncedAt": "2026-09-29T01:45:35.130Z",
    "staffName": "Mulyadi",
    "activity": "- Belajar Aplikasi Gemini",
    "status": "Submitted"
  },
  {
    "id": "rep-20260901-jay",
    "status": "Submitted",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome"
    },
    "_source": "google_sheet",
    "photos": [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80"
    ],
    "staffName": "Mulyadi",
    "activity": "Belajar Aplikasi Gemini & Chat GPT",
    "notes": "- Belajar Aplikasi Gemini\n- Belajar Aplikasi Chat GPT\nselesai basic progress tingkat lanjut",
    "division": "Multimedia",
    "date": "2026-09-01"
  },
  {
    "id": "rep-20260901-jay-0-0",
    "notes": "selesai basic progress tingkat lanjut",
    "activity": "- Belajar Aplikasi Gemini",
    "division": "Multimedia",
    "_source": "google_sheet",
    "date": "2026-09-01",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.039Z"
    },
    "staffName": "Jay",
    "status": "Submitted"
  },
  {
    "id": "rep-20260901-jay-1-0",
    "notes": "",
    "_source": "google_sheet",
    "staffName": "Jay",
    "status": "Submitted",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.039Z"
    },
    "activity": "- Belajar Aplikasi Chat GPT",
    "date": "2026-09-01",
    "division": "Multimedia"
  },
  {
    "id": "gsheet-v2-2026-09-03-Iwan_Kurniawan-2__membersihkan_smua_unit_DBte",
    "staffName": "Iwan Kurniawan",
    "_syncedAt": "2026-09-29T01:45:37.528Z",
    "_syncMeta": {
      "updatedAt": "2026-10-02T07:00:44.441Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "status": "Submitted",
    "_source": "google_sheet",
    "notes": "",
    "division": "Audio",
    "activity": "2. membersihkan smua unit DBtech dari debu",
    "date": "2026-09-03"
  },
  {
    "id": "gsheet-v2-2026-09-03-Iwan_Kurniawan-2_membersihkan_smua_unit_DBtec",
    "date": "2026-09-03",
    "activity": "2*membersihkan smua unit DBtech dari debu",
    "status": "Submitted",
    "_source": "google_sheet",
    "staffName": "Iwan Kurniawan",
    "_syncedAt": "2026-09-29T00:30:15.243Z",
    "notes": "",
    "_syncMeta": {
      "updatedBy": "User",
      "deviceOS": "Windows",
      "updatedAt": "2026-09-29T00:30:15.901Z",
      "deviceType": "Desktop",
      "browser": "Chrome"
    },
    "division": "Audio"
  },
  {
    "id": "gsheet-v2-2026-09-03-Muhamad_Rahmat-1__pengecekan_semua_unit_speke",
    "date": "2026-09-03",
    "activity": "1. pengecekan semua unit speker DBTtech15, dengan mengunakan smartlive berdasarkan data reference unit yang sehat",
    "status": "Submitted",
    "_source": "google_sheet",
    "staffName": "Muhamad Rahmat",
    "_syncedAt": "2026-09-29T01:45:36.358Z",
    "notes": "- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event.\n-Rekomendasi untuk di cek oleh team service terutama pada modul Amplifier dan pengecekan  spare-part Tweter",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-02T07:00:44.441Z",
      "deviceType": "Desktop"
    },
    "division": "Audio"
  },
  {
    "id": "gsheet-v2-2026-09-03-Muhamad_Rahmat-1_pengecekan_semua_unit_speker",
    "date": "2026-09-03",
    "notes": "- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event. Perlu pergantian sparepart tweteer segera",
    "_syncedAt": "2026-09-29T00:30:13.620Z",
    "staffName": "Muhamad Rahmat",
    "_source": "google_sheet",
    "division": "Audio",
    "_syncMeta": {
      "updatedBy": "User",
      "updatedAt": "2026-09-29T00:30:14.560Z",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "Windows"
    },
    "status": "Submitted",
    "activity": "1*pengecekan semua unit speker DBTtech15, dengan mengunakan smartlive berdasarkan data reference unit yang sehat"
  },
  {
    "id": "rep-20260903-buluk",
    "activity": "1* Pengecekan semua unit speaker DBTtech15 dengan SmaartLive & Pembersihan debu",
    "status": "Submitted",
    "photos": [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80"
    ],
    "division": "Audio",
    "notes": "Pengecekan fisik dan respon frekuensi seluruh unit DBTech.",
    "date": "2026-09-03",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:35.401Z"
    },
    "_source": "google_sheet",
    "staffName": "Suryana"
  },
  {
    "id": "rep-20260903-butong",
    "photos": [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80"
    ],
    "activity": "2* Membersihkan semua unit DBtech dari debu",
    "division": "Audio",
    "notes": "Membersihkan semua unit DBtech dari debu.",
    "status": "Submitted",
    "date": "2026-09-03",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:35.401Z"
    },
    "staffName": "Iwan Kurniawan",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260903-butong-5-0",
    "activity": "2. membersihkan smua unit DBtech dari debu",
    "_source": "google_sheet",
    "division": "Audio",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.040Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "staffName": "Butong",
    "notes": "",
    "status": "Submitted",
    "date": "2026-09-03"
  },
  {
    "id": "rep-20260903-mboh",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "status": "Submitted",
    "staffName": "Muhamad Rahmat",
    "photos": [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80"
    ],
    "date": "2026-09-03",
    "activity": "1* Pengecekan semua unit speaker DBTtech15 dengan SmaartLive berdasarkan data reference unit yang sehat",
    "notes": "REMARK:\n- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang dikeluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event.\n- Rekomendasi untuk dicek oleh team service terutama pada modul Amplifier.\n- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event.\n- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event.\n-Rekomendasi untuk di cek oleh team service terutama pada modul Amplifier dan pengecekan  spare-part Tweter\n- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event. Perlu pergantian sparepart tweteer segera",
    "division": "Audio",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260903-mboh-2-0",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.040Z",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome"
    },
    "status": "Submitted",
    "staffName": "Mboh",
    "date": "2026-09-03",
    "activity": "1. pengecekan semua unit speker DBTtech15, dengan mengunakan smartlive berdasarkan data reference unit yang sehat",
    "notes": "- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event.\n-Rekomendasi untuk di cek oleh team service terutama pada modul Amplifier dan pengecekan  spare-part Tweter",
    "division": "Audio",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260903-yudis",
    "photos": [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80"
    ],
    "notes": "Rekomendasi untuk dicek oleh team service terutama pada modul Amplifier.",
    "staffName": "Yudishtira Purnama A",
    "status": "Submitted",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "date": "2026-09-03",
    "division": "Audio",
    "_source": "google_sheet",
    "activity": "1* Pengecekan semua unit speaker DBTtech15 dengan SmaartLive & Pembersihan debu"
  },
  {
    "id": "gsheet-v2-2026-09-04-Taufik_Diana--_Pengecekan_Panel_3_Unit",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-02T07:00:44.441Z"
    },
    "date": "2026-09-04",
    "staffName": "Taufik Diana",
    "_syncedAt": "2026-09-29T01:45:38.292Z",
    "_source": "google_sheet",
    "status": "Submitted",
    "activity": "- Pengecekan Panel 3 Unit",
    "division": "Audio",
    "notes": "- 2 panel Listrik 3 Phase Sudah OK"
  },
  {
    "id": "rep-20260904-buluk",
    "date": "2026-09-04",
    "status": "Submitted",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "browser": "Chrome"
    },
    "staffName": "Suryana",
    "activity": "Pengecekan Panel 3 Unit",
    "_source": "google_sheet",
    "division": "Audio",
    "photos": [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80"
    ],
    "notes": "REMARK:\n- 2 panel Sudah OK\n- 1 Ganti Stop Kontak, 1 Ganti Legran Cewe\nSelesai diperbaiki"
  },
  {
    "id": "rep-20260904-buluk-7-0",
    "staffName": "Buluk",
    "division": "Umum",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.040Z",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome"
    },
    "_source": "google_sheet",
    "status": "Submitted",
    "notes": "- 1 Ganti Stop Kontak, 1 Ganti Legran Cewe",
    "date": "2026-09-04",
    "activity": "- Hadir"
  },
  {
    "id": "rep-20260904-opik",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "staffName": "Taufik Diana",
    "_source": "google_sheet",
    "date": "2026-09-04",
    "status": "Submitted",
    "activity": "Pengecekan Panel 3 Unit",
    "division": "Audio",
    "notes": "REMARK:\n- 2 panel Sudah OK\n- 1 Ganti Stop Kontak, 1 Ganti Legran Cewe\n- 2 panel Listrik 3 Phase Sudah OK",
    "photos": [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "id": "rep-20260904-opik-6-0",
    "staffName": "Opik",
    "division": "Audio",
    "notes": "- 2 panel Listrik 3 Phase Sudah OK",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.040Z"
    },
    "status": "Submitted",
    "activity": "- Pengecekan Panel 3 Unit",
    "date": "2026-09-04"
  },
  {
    "id": "gsheet-v2-2026-09-05-Mulyana--_Repair__perbaikan_Ganti_Pixe",
    "_syncedAt": "2026-09-29T01:45:39.194Z",
    "staffName": "Mulyana",
    "status": "Submitted",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-02T07:00:44.441Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "_source": "google_sheet",
    "notes": "selesai 2 box ( 16 Panel Cabinet)",
    "activity": "- Repair/ perbaikan Ganti Pixel Kabinet LED 2 Box",
    "division": "Videotron",
    "date": "2026-09-05"
  },
  {
    "id": "gsheet-v2-2026-09-05-Taufik_Diana--_Perbaikan_panel_listrik_dan_",
    "notes": "- Semua Panel listrik dalam kondisi aman dan bisa di gunakan",
    "date": "2026-09-05",
    "_source": "google_sheet",
    "status": "Submitted",
    "_syncMeta": {
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-02T07:00:44.441Z",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "activity": "- Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire menggunakan Sub T45",
    "_syncedAt": "2026-09-29T01:45:38.792Z",
    "staffName": "Taufik Diana",
    "division": "Audio"
  },
  {
    "id": "rep-20260905-kharo",
    "_source": "google_sheet",
    "activity": "Repair/ perbaikan Ganti Pixel Kabinet LED 2 Box",
    "staffName": "Mulyana",
    "division": "Service",
    "notes": "Repair/ perbaikan Ganti Pixel Kabinet LED 2 Box selesai.\nselesai 2 box\nselesai dan bisa di gunakan\nselesai 2 box ( 16 Panel Cabinet)",
    "date": "2026-09-05",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "photos": [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
    ],
    "status": "Submitted"
  },
  {
    "id": "rep-20260905-kharo-10-0",
    "division": "Videotron",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.040Z",
      "deviceOS": "macOS"
    },
    "date": "2026-09-05",
    "staffName": "Kharo",
    "activity": "- Repair/ perbaikan Ganti Pixel Kabinet LED 2 Box",
    "status": "Submitted",
    "_source": "google_sheet",
    "notes": "selesai 2 box ( 16 Panel Cabinet)"
  },
  {
    "id": "rep-20260905-mboh",
    "_source": "google_sheet",
    "staffName": "Muhamad Rahmat",
    "division": "Audio",
    "notes": "Panel listrik dalam kondisi aman dan bisa di gunakan.",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "status": "Submitted",
    "date": "2026-09-05",
    "photos": [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80"
    ],
    "activity": "Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire menggunakan Sub T45"
  },
  {
    "id": "rep-20260905-opik",
    "status": "Submitted",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "deviceType": "Desktop"
    },
    "date": "2026-09-05",
    "staffName": "Taufik Diana",
    "photos": [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80"
    ],
    "activity": "Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire menggunakan Sub T45",
    "division": "Audio",
    "notes": "Panel listrik dalam kondisi aman dan bisa di gunakan.\n- Panel listrik dalam kondisi aman dan bisa di gunakan\n- Semua Panel listrik dalam kondisi aman dan bisa di gunakan",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260905-opik-8-0",
    "notes": "- Semua Panel listrik dalam kondisi aman dan bisa di gunakan",
    "status": "Submitted",
    "activity": "- Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire menggunakan Sub T45",
    "date": "2026-09-05",
    "division": "Audio",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.040Z"
    },
    "staffName": "Opik"
  },
  {
    "id": "gsheet-v2-2026-09-06-Dedi_Agus_Wigiantoro--_Repair__perbaikan_ganti_pixe",
    "_syncedAt": "2026-09-30T06:44:22.325Z",
    "staffName": "Agus Wigi (Videotron)",
    "division": "Videotron",
    "date": "2026-09-06",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:35.401Z"
    },
    "notes": "selesai 2 box ( 16 Panel Cabinet)",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "_source": "google_sheet",
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-06-Muhamad_Irvan--_Repair__perbaikan_ganti_pixe",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "status": "Submitted",
    "_syncMeta": {
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "updatedBy": "BatchSync",
      "browser": "Chrome"
    },
    "division": "Videotron",
    "_source": "google_sheet",
    "_syncedAt": "2026-09-30T06:44:24.056Z",
    "staffName": "Muhamad Irvan",
    "date": "2026-09-06",
    "notes": "selesai 2 box ( 16 Panel Cabinet)"
  },
  {
    "id": "gsheet-v2-2026-09-06-Mulyana--_Repair__perbaikan_ganti_pixe",
    "date": "2026-09-06",
    "division": "Videotron",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "status": "Submitted",
    "_source": "google_sheet",
    "_syncedAt": "2026-09-29T01:45:39.732Z",
    "staffName": "Mulyana",
    "notes": "selesai 2 box ( 16 Panel Cabinet)",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-02T07:00:44.441Z",
      "deviceType": "Desktop"
    }
  },
  {
    "id": "gsheet-v2-2026-09-06-Ramdani--_Cek_cable_XLR_dan_Jack_to_Ja",
    "_syncMeta": {
      "updatedAt": "2026-10-02T07:00:44.441Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "staffName": "Ramdani",
    "_syncedAt": "2026-09-29T01:45:41.400Z",
    "notes": "",
    "date": "2026-09-06",
    "_source": "google_sheet",
    "division": "Audio",
    "status": "Submitted",
    "activity": "- Cek cable XLR dan Jack to Jack"
  },
  {
    "id": "rep-20260906-dani",
    "division": "Audio",
    "_source": "google_sheet",
    "staffName": "Ramdani",
    "activity": "Cek cable XLR dan Jack to Jack",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "deviceType": "Desktop"
    },
    "notes": "Pengecekan kontinuitas dan fisik kabel XLR dan jack to jack.",
    "status": "Submitted",
    "photos": [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80"
    ],
    "date": "2026-09-06"
  },
  {
    "id": "rep-20260906-dani-12-0",
    "staffName": "Dani",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.041Z",
      "browser": "Chrome"
    },
    "_source": "google_sheet",
    "date": "2026-09-06",
    "division": "Audio",
    "status": "Submitted",
    "notes": "",
    "activity": "- Cek cable XLR dan Jack to Jack"
  },
  {
    "id": "rep-20260906-irvan-11-2",
    "division": "Videotron",
    "status": "Submitted",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "notes": "selesai 2 box ( 16 Panel Cabinet)",
    "staffName": "Irvan",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.040Z",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "date": "2026-09-06",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260906-kharo",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "deviceOS": "macOS"
    },
    "notes": "Repair/ perbaikan ganti pixel kabinet led 2 box (lanjutan).\nselesai 2 box\nselesai dan bisa di gunakan\nselesai 2 box ( 16 Panel Cabinet)",
    "photos": [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
    ],
    "staffName": "Mulyana",
    "status": "Submitted",
    "date": "2026-09-06",
    "division": "Service",
    "_source": "google_sheet",
    "activity": "Repair/ perbaikan ganti pixel kabinet led 2 box"
  },
  {
    "id": "rep-20260906-kharo-11-0",
    "staffName": "Kharo",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.040Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync"
    },
    "date": "2026-09-06",
    "notes": "selesai 2 box ( 16 Panel Cabinet)",
    "status": "Submitted",
    "division": "Videotron",
    "_source": "google_sheet",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box"
  },
  {
    "id": "rep-20260906-wigi-11-1",
    "_source": "google_sheet",
    "date": "2026-09-06",
    "status": "Submitted",
    "division": "Videotron",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "staffName": "Wigi",
    "notes": "selesai 2 box ( 16 Panel Cabinet)",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.040Z"
    }
  },
  {
    "id": "gsheet-v2-2026-09-07-Heri-Cek_unit__Cleaning__Cek_Colour",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-02T07:00:44.441Z"
    },
    "notes": "Harus service warm mati no 12,25,29 | Warm Separo no 3,32",
    "_syncedAt": "2026-09-29T01:45:41.802Z",
    "staffName": "Heri",
    "date": "2026-09-07",
    "_source": "google_sheet",
    "division": "Lighting",
    "status": "Submitted",
    "activity": "Cek unit, Cleaning, Cek Colour Parled"
  },
  {
    "id": "rep-20260907-heri",
    "activity": "Cek unit, Cleaning, Cek Colour Parled",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "status": "Submitted",
    "staffName": "Heri",
    "photos": [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80"
    ],
    "division": "Lighting",
    "date": "2026-09-07",
    "_source": "google_sheet",
    "notes": "Harus service warm mati no 12,25,29 | Warm Separo no 3,32"
  },
  {
    "id": "rep-20260907-heri-13-0",
    "activity": "Cek unit, Cleaning, Cek Colour Parled",
    "division": "Lighting",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.041Z",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync"
    },
    "staffName": "Heri",
    "date": "2026-09-07",
    "status": "Submitted",
    "_source": "google_sheet",
    "notes": "Harus service warm mati no 12,25,29 | Warm Separo no 3,32"
  },
  {
    "id": "gsheet-v2-2026-09-09-Ayong_Sumarsih--_Repair_dead_pixel_1_box_-_Co",
    "activity": "- Repair dead pixel 1 box\n- Copot Masking 7 box",
    "division": "Videotron",
    "status": "Submitted",
    "date": "2026-09-09",
    "_source": "google_sheet",
    "notes": "AMAN BISA DI GUNAKAN",
    "_syncMeta": {
      "updatedBy": "User",
      "deviceType": "Desktop",
      "deviceOS": "Windows",
      "updatedAt": "2026-09-29T00:30:07.412Z",
      "browser": "Chrome"
    },
    "_syncedAt": "2026-09-27T08:58:00.880Z",
    "staffName": "Ayong Sumarsih"
  },
  {
    "id": "gsheet-v2-2026-09-09-Iwan_Kurniawan--_Perbaikan__Service_Mandiri__",
    "status": "Submitted",
    "division": "Audio",
    "date": "2026-09-09",
    "notes": "- mic wireless EWD udah bisa di gunakan kembali\n- kabel Snake sudah bisa di gunakan",
    "activity": "- Perbaikan/ Service Mandiri :\n1. Kabel snake 8 ch \n2. Kabel snake 16 ch \n3. Kabel rumbay drum 8 ch\n4. Cek Mic EWD\n5. Ganti Spul Mic EWD",
    "staffName": "Iwan Kurniawan",
    "_syncedAt": "2026-09-29T00:30:15.073Z",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedAt": "2026-09-29T00:30:15.783Z",
      "deviceType": "Desktop",
      "deviceOS": "Windows",
      "updatedBy": "User",
      "browser": "Chrome"
    }
  },
  {
    "id": "gsheet-v2-2026-09-09-Mulyana--_Repair_dead_pixel_1_box_-_Co",
    "date": "2026-09-09",
    "_source": "google_sheet",
    "status": "Submitted",
    "activity": "- Repair dead pixel 1 box\n- Copot Masking 7 box",
    "division": "Videotron",
    "_syncedAt": "2026-09-29T01:45:42.578Z",
    "staffName": "Mulyana",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "updatedAt": "2026-10-02T07:00:44.441Z",
      "deviceType": "Desktop"
    },
    "notes": "selesai 1 box ( 8 Panel Cabinet ) "
  },
  {
    "id": "gsheet-v2-2026-09-09-Ramdani--_Perbaikan__Service_Mandiri__",
    "activity": "- Perbaikan/ Service Mandiri :\n1. Kabel snake 8 ch \n2. Kabel snake 16 ch \n3. Kabel rumbay drum 8 ch\n4. Cek Mic EWD\n5. Ganti Spul Mic EWD",
    "status": "Submitted",
    "date": "2026-09-09",
    "division": "Audio",
    "_source": "google_sheet",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "Windows",
      "updatedBy": "User",
      "updatedAt": "2026-09-29T00:30:17.284Z",
      "deviceType": "Desktop"
    },
    "staffName": "Ramdani",
    "_syncedAt": "2026-09-29T00:30:16.466Z",
    "notes": "- mic wireless EWD udah bisa di gunakan kembali\n- kabel Snake sudah bisa di gunakan"
  },
  {
    "id": "gsheet-v2-2026-09-09-Suryana--_Perbaikan__Service_Mandiri__",
    "activity": "- Perbaikan/ Service Mandiri :\n1. Kabel snake 8 ch \n2. Kabel snake 16 ch \n3. Kabel rumbay drum 8 ch\n4. Cek Mic EWD/ Ganti Spul",
    "status": "Submitted",
    "date": "2026-09-09",
    "division": "Audio",
    "_source": "google_sheet",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-02T07:00:44.441Z"
    },
    "notes": "- Semua selesai dan dapat di gunakan",
    "_syncedAt": "2026-09-29T01:45:42.947Z",
    "staffName": "Suryana"
  },
  {
    "id": "gsheet-v2-2026-09-09-Taufik_Diana--_Perbaikan__Service_Mandiri__",
    "notes": "- mic wireless EWD udah bisa di gunakan kembali\n- kabel Snake sudah bisa di gunakan",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-09-29T00:30:14.437Z",
      "deviceType": "Desktop",
      "updatedBy": "User",
      "deviceOS": "Windows"
    },
    "date": "2026-09-09",
    "staffName": "Taufik Diana",
    "_syncedAt": "2026-09-29T00:30:13.524Z",
    "activity": "- Perbaikan/ Service Mandiri :\n1. Kabel snake 8 ch \n2. Kabel snake 16 ch \n3. Kabel rumbay drum 8 ch\n4. Cek Mic EWD\n5. Ganti Spul Mic EWD",
    "_source": "google_sheet",
    "status": "Submitted",
    "division": "Audio"
  },
  {
    "id": "rep-20260909-ayong",
    "activity": "Repair dead pixel 1 box, Copot Masking 7 box",
    "division": "Videotron",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "staffName": "Ayong Sumarsih",
    "date": "2026-09-09",
    "status": "Submitted",
    "_source": "google_sheet",
    "photos": [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
    ],
    "notes": "Supervisi dan pengerjaan modul LED kabinet. AMAN BISA DI GUNAKAN\nselesai 1 box\nselesai 1 box ( 8 Panel Cabinet )"
  },
  {
    "id": "rep-20260909-ayong-16-0",
    "status": "Submitted",
    "date": "2026-09-09",
    "activity": "- Hadir",
    "division": "Umum",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.041Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync"
    },
    "staffName": "Ayong",
    "notes": "selesai 1 box ( 8 Panel Cabinet ) ",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260909-buluk",
    "date": "2026-09-09",
    "status": "Submitted",
    "activity": "Perbaikan/ Service Mandiri : 1. Kabel snake 8 ch 2. Kabel snake 16 ch 3. Kabel rumbay drum 8 ch 4. Cek Mic EWD/ Ganti Spul",
    "photos": [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80"
    ],
    "division": "Audio",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "staffName": "Suryana",
    "notes": "Perbaikan mandiri kabel audio dan spul mic.\n- selesai dan dapat di gunakan\n- mic wireless EWD udah bisa di gunakan kembali\n- kabel Snake sudah bisa di gunakan\n- Semua selesai dan dapat di gunakan",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260909-buluk-17-0",
    "staffName": "Buluk",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.041Z",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "status": "Submitted",
    "notes": "- Semua selesai dan dapat di gunakan",
    "_source": "google_sheet",
    "date": "2026-09-09",
    "activity": "- Perbaikan/ Service Mandiri :\n1. Kabel snake 8 ch \n2. Kabel snake 16 ch \n3. Kabel rumbay drum 8 ch\n4. Cek Mic EWD/ Ganti Spul",
    "division": "Audio"
  },
  {
    "id": "rep-20260909-butong",
    "photos": [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80"
    ],
    "staffName": "Iwan Kurniawan",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "_source": "google_sheet",
    "notes": "Perbaikan mandiri kabel audio dan spul mic.\n- mic wireless EWD udah bisa di gunakan kembali\n- kabel Snake sudah bisa di gunakan",
    "status": "Submitted",
    "date": "2026-09-09",
    "activity": "Perbaikan/ Service Mandiri : 1. Kabel snake 8 ch 2. Kabel snake 16 ch 3. Kabel rumbay drum 8 ch 4. Cek Mic EWD/ Ganti Spul",
    "division": "Audio"
  },
  {
    "id": "rep-20260909-dani",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "deviceType": "Desktop"
    },
    "status": "Submitted",
    "staffName": "Ramdani",
    "photos": [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80"
    ],
    "date": "2026-09-09",
    "activity": "Perbaikan/ Service Mandiri : 1. Kabel snake 8 ch 2. Kabel snake 16 ch 3. Kabel rumbay drum 8 ch 4. Cek Mic EWD/ Ganti Spul",
    "notes": "Perbaikan mandiri kabel audio dan spul mic.\n- mic wireless EWD udah bisa di gunakan kembali\n- kabel Snake sudah bisa di gunakan",
    "_source": "google_sheet",
    "division": "Audio"
  },
  {
    "id": "rep-20260909-kharo",
    "division": "Service",
    "date": "2026-09-09",
    "staffName": "Mulyana",
    "notes": "Repair dead pixel 1 box, Copot Masking 7 box. AMAN BISA DI GUNAKAN\nselesai 1 box\nselesai 1 box ( 8 Panel Cabinet )",
    "_source": "google_sheet",
    "status": "Submitted",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "activity": "Repair dead pixel 1 box, Copot Masking 7 box",
    "photos": [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "id": "rep-20260909-kharo-14-0",
    "notes": "selesai 1 box ( 8 Panel Cabinet ) ",
    "activity": "- Repair dead pixel 1 box\n- Copot Masking 7 box",
    "_source": "google_sheet",
    "division": "Videotron",
    "status": "Submitted",
    "date": "2026-09-09",
    "staffName": "Kharo",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.041Z",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceType": "Desktop"
    }
  },
  {
    "id": "rep-20260909-opik",
    "_source": "google_sheet",
    "notes": "Perbaikan mandiri kabel audio dan spul mic.\n- mic wireless EWD udah bisa di gunakan kembali\n- kabel Snake sudah bisa di gunakan",
    "division": "Audio",
    "status": "Submitted",
    "staffName": "Taufik Diana",
    "photos": [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80"
    ],
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "date": "2026-09-09",
    "activity": "Perbaikan/ Service Mandiri : 1. Kabel snake 8 ch 2. Kabel snake 16 ch 3. Kabel rumbay drum 8 ch 4. Cek Mic EWD/ Ganti Spul"
  },
  {
    "id": "rep-20260909-wigi",
    "status": "Submitted",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:35.401Z"
    },
    "staffName": "Agus Wigi (Videotron)",
    "photos": [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
    ],
    "date": "2026-09-09",
    "division": "Videotron",
    "notes": "Membantu repair dead pixel dan copot masking 7 box bersama tim LED. AMAN BISA DI GUNAKAN\nselesai 1 box\nselesai 1 box ( 8 Panel Cabinet )",
    "activity": "Repair dead pixel 1 box, Copot Masking 7 box",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260909-wigi-15-0",
    "staffName": "Wigi",
    "status": "Submitted",
    "date": "2026-09-09",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.041Z"
    },
    "_source": "google_sheet",
    "activity": "- Hadir",
    "division": "Umum",
    "notes": "selesai 1 box ( 8 Panel Cabinet ) "
  },
  {
    "id": "gsheet-v2-2026-09-10-Heri--_Parled",
    "notes": "- Harus service warm separo no. 19,20,27",
    "activity": "- Parled",
    "division": "Lighting",
    "_syncMeta": {
      "updatedAt": "2026-10-02T07:00:44.443Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "staffName": "Heri",
    "_syncedAt": "2026-09-29T01:32:28.259Z",
    "_source": "google_sheet",
    "date": "2026-09-10",
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-10-Heri--_XLR__Link_",
    "division": "Lighting",
    "staffName": "Heri",
    "_syncedAt": "2026-09-29T01:32:29.021Z",
    "activity": "- XLR (Link)",
    "_syncMeta": {
      "updatedAt": "2026-10-02T07:00:44.443Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop"
    },
    "notes": "- Sudah service",
    "_source": "google_sheet",
    "status": "Submitted",
    "date": "2026-09-10"
  },
  {
    "id": "gsheet-v2-2026-09-10-Heri-Cek_Unit__Cleaning__Cek_colour",
    "division": "Lighting",
    "staffName": "Heri",
    "_syncedAt": "2026-09-29T01:45:43.407Z",
    "activity": "Cek Unit, Cleaning, Cek colour, Perbaikan kabel  link :\n- Beam 450 (9 bok / 18 Unit)\n- BSW 550 (6 bok / 12 Unit)\n- B-Eye (4 bok / 8 Unit)",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-02T07:00:44.441Z"
    },
    "notes": "",
    "_source": "google_sheet",
    "status": "Submitted",
    "date": "2026-09-10"
  },
  {
    "id": "gsheet-v2-2026-09-10-Muhamad_Rahmat--_ngulik_fitur_DLMS_marani_MIR",
    "status": "Submitted",
    "_syncMeta": {
      "updatedBy": "User",
      "deviceType": "Desktop",
      "deviceOS": "Windows",
      "browser": "Chrome",
      "updatedAt": "2026-09-29T00:30:23.644Z"
    },
    "_syncedAt": "2026-09-29T00:30:22.933Z",
    "staffName": "Muhamad Rahmat",
    "activity": "- ngulik fitur DLMS marani MIR480I dan MIR480A\n- CALIBRASI MIC RTA BEHRINGER ECM8000\n- revisi pemasangan BEHRINGER ULTRA LINK",
    "date": "2026-09-10",
    "notes": "unit dalam kondisi aman tidak  ada kendala",
    "_source": "google_sheet",
    "division": "Audio"
  },
  {
    "id": "gsheet-v2-2026-09-10-Muhamad_Rahmat--CALIBRASI_MIC_RTA_BEHRINGER_E",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-02T07:00:44.443Z",
      "deviceType": "Desktop"
    },
    "staffName": "Muhamad Rahmat",
    "_syncedAt": "2026-09-29T01:32:29.984Z",
    "date": "2026-09-10",
    "status": "Submitted",
    "division": "Audio",
    "_source": "google_sheet",
    "notes": "",
    "activity": "-CALIBRASI MIC RTA BEHRINGER ECM8000"
  },
  {
    "id": "gsheet-v2-2026-09-10-Muhamad_Rahmat--ngulik_fitur_DLMS_marani_MIR4",
    "status": "Submitted",
    "date": "2026-09-10",
    "notes": "unit dalam kondisi aman tidak ada kendala",
    "activity": "-ngulik fitur DLMS marani MIR480I dan MIR480A",
    "division": "Audio",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-02T07:00:44.441Z",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "_source": "google_sheet",
    "_syncedAt": "2026-09-29T01:44:46.238Z",
    "staffName": "Muhamad Rahmat"
  },
  {
    "id": "gsheet-v2-2026-09-10-Muhamad_Rahmat--revisi_pemasangan_BEHRINGER_U",
    "_source": "google_sheet",
    "notes": "",
    "activity": "-revisi pemasangan BEHRINGER ULTRA LINK",
    "division": "Audio",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-02T07:00:44.443Z",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "staffName": "Muhamad Rahmat",
    "_syncedAt": "2026-09-29T01:32:30.502Z",
    "status": "Submitted",
    "date": "2026-09-10"
  },
  {
    "id": "rep-20260910-heri",
    "division": "Lighting",
    "notes": "- Parled : Harus service warm separo no. 19,20,27\n- XLR (Link) : Sudah service\n- Harus service warm separo no. 19,20,27\n- Sudah service",
    "staffName": "Heri",
    "activity": "Cek Unit, Cleaning, Cek colour, Perbaikan kabel link : - Beam 450 (9 bok / 18 Unit) - BSW 550 (6 bok / 12 Unit) - B-Eye (4 bok / 8 Unit)",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:35.401Z"
    },
    "_source": "google_sheet",
    "date": "2026-09-10",
    "status": "Submitted"
  },
  {
    "id": "rep-20260910-heri-21-0",
    "date": "2026-09-10",
    "division": "Lighting",
    "status": "Submitted",
    "activity": "Cek Unit, Cleaning, Cek colour, Perbaikan kabel  link :\n- Beam 450 (9 bok / 18 Unit)\n- BSW 550 (6 bok / 12 Unit)\n- B-Eye (4 bok / 8 Unit)",
    "_source": "google_sheet",
    "notes": "",
    "staffName": "Heri",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.041Z",
      "deviceOS": "macOS"
    }
  },
  {
    "id": "rep-20260910-heri-22-0",
    "notes": "- Harus service warm separo no. 19,20,27",
    "status": "Submitted",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.041Z",
      "deviceOS": "macOS"
    },
    "activity": "- Parled",
    "staffName": "Heri",
    "_source": "google_sheet",
    "date": "2026-09-10",
    "division": "Lighting"
  },
  {
    "id": "rep-20260910-heri-23-0",
    "date": "2026-09-10",
    "division": "Lighting",
    "notes": "- Sudah service",
    "activity": "- XLR (Link)",
    "_source": "google_sheet",
    "staffName": "Heri",
    "status": "Submitted",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.041Z",
      "browser": "Chrome"
    }
  },
  {
    "id": "rep-20260910-mboh",
    "date": "2026-09-10",
    "division": "Audio",
    "notes": "unit dalam klondisi aman tida ada kendala\nunit dalam kondisi aman tidak  ada kendala\nunit dalam kondisi aman tida ada kendala\nunit dalam kondisi aman tidak ada kendala",
    "activity": "- ngulik fitur DLMS marani MIR480I dan MIR480A\n- CALIBRASI MIC RTA BEHRINGER ECM8000\n- revisi pemasangan BEHRINGER ULTRA LINK",
    "_source": "google_sheet",
    "staffName": "Muhamad Rahmat",
    "status": "Submitted",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    }
  },
  {
    "id": "rep-20260910-mboh-24-0",
    "_source": "google_sheet",
    "activity": "-ngulik fitur DLMS marani MIR480I dan MIR480A",
    "division": "Audio",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.042Z"
    },
    "staffName": "Mboh",
    "notes": "unit dalam kondisi aman tidak ada kendala",
    "status": "Submitted",
    "date": "2026-09-10"
  },
  {
    "id": "rep-20260910-mboh-25-0",
    "_source": "google_sheet",
    "activity": "-CALIBRASI MIC RTA BEHRINGER ECM8000",
    "notes": "",
    "staffName": "Mboh",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.042Z",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS"
    },
    "division": "Audio",
    "date": "2026-09-10",
    "status": "Submitted"
  },
  {
    "id": "rep-20260910-mboh-26-0",
    "status": "Submitted",
    "date": "2026-09-10",
    "staffName": "Mboh",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.042Z",
      "deviceType": "Desktop"
    },
    "division": "Audio",
    "activity": "-revisi pemasangan BEHRINGER ULTRA LINK",
    "notes": "",
    "_source": "google_sheet"
  },
  {
    "id": "gsheet-v2-2026-09-11-Suryana--_ganti_skindrum_tama_celasic_",
    "_syncedAt": "2026-09-29T00:30:25.756Z",
    "staffName": "Suryana",
    "_syncMeta": {
      "deviceOS": "Windows",
      "updatedAt": "2026-09-29T00:30:26.315Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "User"
    },
    "division": "Audio",
    "status": "Submitted",
    "activity": "- ganti skindrum tama celasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase untuk stand mic yang baru",
    "notes": "selesai dan bisa di gunakan kembali",
    "date": "2026-09-11",
    "_source": "google_sheet"
  },
  {
    "id": "gsheet-v2-2026-09-11-Suryana--_ganti_skindrum_tama_star_cla",
    "staffName": "Suryana",
    "_syncedAt": "2026-09-29T01:45:44.919Z",
    "division": "Audio",
    "_source": "google_sheet",
    "_syncMeta": {
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-02T07:00:44.441Z",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    },
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat",
    "date": "2026-09-11",
    "status": "Submitted",
    "notes": "selesai dengan baik dan sudah bisa di gunakan"
  },
  {
    "id": "gsheet-v2-2026-09-11-Wahyudin__Audio_--_ganti_skindrum_tama_celasic_",
    "notes": "selesai dan bisa di gunakan kembali",
    "_source": "google_sheet",
    "_syncedAt": "2026-09-29T00:30:24.329Z",
    "staffName": "Wahyudin (Audio)",
    "division": "Audio",
    "date": "2026-09-11",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "User",
      "deviceOS": "Windows",
      "deviceType": "Desktop",
      "updatedAt": "2026-09-29T00:30:25.136Z"
    },
    "status": "Submitted",
    "activity": "- ganti skindrum tama celasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase untuk stand mic yang baru"
  },
  {
    "id": "gsheet-v2-2026-09-11-Wahyudin--_ganti_skindrum_tama_star_cla",
    "date": "2026-09-11",
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat",
    "_source": "google_sheet",
    "division": "Audio",
    "_syncedAt": "2026-09-29T01:45:44.447Z",
    "staffName": "Wahyudin",
    "status": "Submitted",
    "_syncMeta": {
      "updatedAt": "2026-10-02T07:00:44.441Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "notes": "selesai dengan baik dan sudah bisa di gunakan"
  },
  {
    "id": "rep-20260911-buluk",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "staffName": "Suryana",
    "date": "2026-09-11",
    "status": "Submitted",
    "_source": "google_sheet",
    "notes": "Pemasangan skindrum dan fitting stand mic ke hardcase baru.\nselesai dengan baik dan bisa di gunakan\nselesai dan bisa di gunakan kembali\nselesai dengan baik dan sudah bisa di gunakan",
    "activity": "- ganti skindrum tama celasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase untuk stand mic yang baru",
    "division": "Audio"
  },
  {
    "id": "rep-20260911-buluk-27-1",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.042Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync"
    },
    "staffName": "buluk",
    "notes": "selesai dengan baik dan sudah bisa di gunakan",
    "status": "Submitted",
    "date": "2026-09-11",
    "division": "Audio",
    "_source": "google_sheet",
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat"
  },
  {
    "id": "rep-20260911-unyim",
    "notes": "Pemasangan skindrum dan fitting stand mic ke hardcase baru.\nselesai dan bisa di gunakan kembali\nselesai dengan baik dan bisa di gunakan\nselesai dengan baik dan sudah bisa di gunakan",
    "division": "Audio",
    "activity": "- ganti skindrum tama celasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase untuk stand mic yang baru",
    "status": "Submitted",
    "_source": "google_sheet",
    "date": "2026-09-11",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "staffName": "Wahyudin (Audio)"
  },
  {
    "id": "rep-20260911-unyim-27-0",
    "notes": "selesai dengan baik dan sudah bisa di gunakan",
    "_source": "google_sheet",
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat",
    "division": "Audio",
    "date": "2026-09-11",
    "staffName": "unyim",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.042Z",
      "deviceType": "Desktop"
    },
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-12-Heri--_Cek_Mixer_Tiger_Touch",
    "notes": "Kondisi Normal\nKondisi Bersih Normal\nKondisi Bersih I No. 13 Harus Servic ( Merah Mati )",
    "_source": "google_sheet",
    "_syncedAt": "2026-09-30T06:45:18.159Z",
    "staffName": "Heri",
    "division": "Lighting",
    "date": "2026-09-12",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:35.401Z",
      "deviceOS": "macOS"
    },
    "status": "Submitted",
    "activity": "- Cek Mixer Tiger Touch"
  },
  {
    "id": "gsheet-v2-2026-09-12-Heri--_Cleaning_All_blinder_4Cell",
    "division": "Lighting",
    "_source": "google_sheet",
    "_syncedAt": "2026-09-29T01:32:33.916Z",
    "staffName": "Heri",
    "notes": "Kondisi Bersih Normal",
    "_syncMeta": {
      "updatedAt": "2026-10-02T07:00:44.443Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "browser": "Chrome"
    },
    "activity": "- Cleaning All blinder 4Cell",
    "date": "2026-09-12",
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-12-Heri--_Cleaning_All_Freshnell_300_w",
    "date": "2026-09-12",
    "_source": "google_sheet",
    "activity": "- Cleaning All Freshnell 300 w",
    "staffName": "Heri",
    "_syncedAt": "2026-09-29T01:32:32.950Z",
    "division": "Lighting",
    "notes": "Kondisi Normal",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-02T07:00:44.443Z"
    },
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-12-Heri--_Cleaning_All_Stromy",
    "_syncedAt": "2026-09-29T01:32:32.399Z",
    "staffName": "Heri",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedAt": "2026-10-02T07:00:44.443Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "division": "Lighting",
    "date": "2026-09-12",
    "notes": "Kondisi Bersih Normal",
    "status": "Submitted",
    "activity": "- Cleaning All Stromy"
  },
  {
    "id": "gsheet-v2-2026-09-12-Heri--_Cleaning_Parled_No__11_13_14",
    "notes": "Kondisi Bersih I No. 13 Harus Servic ( Merah Mati )",
    "division": "Lighting",
    "activity": "- Cleaning Parled No. 11,13,14,15,16,17",
    "_source": "google_sheet",
    "staffName": "Heri",
    "_syncedAt": "2026-09-29T01:32:34.565Z",
    "date": "2026-09-12",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-02T07:00:44.443Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-12-Heri-Cek_Unit__Cleaning__Cek_Colour",
    "notes": "",
    "_source": "google_sheet",
    "activity": "Cek Unit, Cleaning, Cek Colour Parled",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-02T07:00:44.441Z",
      "deviceOS": "macOS"
    },
    "division": "Lighting",
    "_syncedAt": "2026-09-29T01:45:45.270Z",
    "staffName": "Heri",
    "date": "2026-09-12",
    "status": "Submitted"
  },
  {
    "id": "rep-20260912-heri-28-0",
    "_source": "google_sheet",
    "notes": "",
    "activity": "Cek Unit, Cleaning, Cek Colour Parled",
    "division": "Lighting",
    "date": "2026-09-12",
    "staffName": "Heri",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.042Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync"
    },
    "status": "Submitted"
  },
  {
    "id": "rep-20260912-heri-29-0",
    "status": "Submitted",
    "date": "2026-09-12",
    "staffName": "Heri",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.042Z",
      "deviceType": "Desktop"
    },
    "activity": "- Cek Mixer Tiger Touch",
    "notes": "Kondisi Normal",
    "division": "Lighting"
  },
  {
    "id": "rep-20260912-heri-30-0",
    "notes": "Kondisi Bersih Normal",
    "staffName": "Heri",
    "_source": "google_sheet",
    "status": "Submitted",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.043Z"
    },
    "activity": "- Cleaning All Stromy",
    "date": "2026-09-12",
    "division": "Lighting"
  },
  {
    "id": "rep-20260912-heri-31-0",
    "division": "Lighting",
    "activity": "- Cleaning All Freshnell 300 w",
    "staffName": "Heri",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.043Z",
      "deviceType": "Desktop"
    },
    "_source": "google_sheet",
    "status": "Submitted",
    "notes": "Kondisi Normal",
    "date": "2026-09-12"
  },
  {
    "id": "rep-20260912-heri-32-0",
    "notes": "Kondisi Bersih Normal",
    "activity": "- Cleaning All blinder 4Cell",
    "division": "Lighting",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.043Z",
      "deviceType": "Desktop"
    },
    "staffName": "Heri",
    "_source": "google_sheet",
    "date": "2026-09-12",
    "status": "Submitted"
  },
  {
    "id": "rep-20260912-heri-33-0",
    "date": "2026-09-12",
    "status": "Submitted",
    "_source": "google_sheet",
    "activity": "- Cleaning Parled No. 11,13,14,15,16,17",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.043Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync"
    },
    "division": "Lighting",
    "staffName": "Heri",
    "notes": "Kondisi Bersih I No. 13 Harus Servic ( Merah Mati )"
  },
  {
    "id": "gsheet-v2-2026-09-16-Ayong_Sumarsih--_Buka_Masking_Kabinet",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "_syncedAt": "2026-09-30T06:45:34.337Z",
    "staffName": "Ayong Sumarsih",
    "notes": "",
    "date": "2026-09-16",
    "_source": "google_sheet",
    "activity": "- Buka Masking Kabinet",
    "division": "Videotron",
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-16-Heri--_Cek_Smoke_erorr",
    "_syncedAt": "2026-09-30T06:46:14.659Z",
    "staffName": "Heri",
    "division": "Lighting",
    "_source": "google_sheet",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "deviceOS": "macOS"
    },
    "activity": "- Cek Smoke erorr",
    "status": "Submitted",
    "date": "2026-09-16",
    "notes": "Smoke No.3 ERORR\nKondisi Normal\nLancar\nAman"
  },
  {
    "id": "gsheet-v2-2026-09-16-Heri--_Cleaning_All_Freshnell_200_W",
    "activity": "- Cleaning All Freshnell 200 W",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-02T07:00:44.443Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "status": "Submitted",
    "notes": "Kondisi Normal",
    "date": "2026-09-16",
    "division": "Lighting",
    "_syncedAt": "2026-09-29T01:32:40.383Z",
    "staffName": "Heri",
    "_source": "google_sheet"
  },
  {
    "id": "gsheet-v2-2026-09-16-Heri--_Ganti_Roda_Box_Kabel",
    "activity": "- Ganti Roda Box Kabel",
    "date": "2026-09-16",
    "_syncMeta": {
      "updatedAt": "2026-10-02T07:00:44.443Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "status": "Submitted",
    "staffName": "Heri",
    "_syncedAt": "2026-09-29T01:32:42.705Z",
    "division": "Lighting",
    "notes": "Lancar",
    "_source": "google_sheet"
  },
  {
    "id": "gsheet-v2-2026-09-16-Heri--_Konek_artnet_ke_Tiger_Touch",
    "_syncedAt": "2026-09-29T01:32:39.644Z",
    "staffName": "Heri",
    "_source": "google_sheet",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-02T07:00:44.443Z",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "browser": "Chrome"
    },
    "notes": "",
    "division": "Lighting",
    "status": "Submitted",
    "date": "2026-09-16",
    "activity": "- Konek artnet ke Tiger Touch"
  },
  {
    "id": "gsheet-v2-2026-09-16-Heri--_Rapihin_Kabel_PerlBox",
    "notes": "Aman",
    "activity": "- Rapihin Kabel PerlBox",
    "_source": "google_sheet",
    "division": "Lighting",
    "status": "Submitted",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-02T07:00:44.443Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    },
    "_syncedAt": "2026-09-29T01:32:41.974Z",
    "staffName": "Heri",
    "date": "2026-09-16"
  },
  {
    "id": "gsheet-v2-2026-09-16-Heri-CLEANING__CEK_UNIT",
    "date": "2026-09-16",
    "status": "Submitted",
    "division": "Lighting",
    "activity": "CLEANING, CEK UNIT",
    "_syncedAt": "2026-09-29T01:45:49.018Z",
    "staffName": "Heri",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-02T07:00:44.441Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "notes": "",
    "_source": "google_sheet"
  },
  {
    "id": "gsheet-v2-2026-09-16-Iwan_Kurniawan--_Bongkar_RCF_8003_Kirim_ke_sa",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "staffName": "Iwan Kurniawan",
    "_syncedAt": "2026-09-30T06:45:58.009Z",
    "notes": "2 Unit Komponen Speaker 18inc saja untuk di service keluar",
    "date": "2026-09-16",
    "_source": "google_sheet",
    "division": "Audio",
    "activity": "- Bongkar RCF 8003 Kirim ke sambang",
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-16-Mulyadi--_Cek_Kabel_SDI_Perleng_Box",
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-05T09:22:35.402Z"
    },
    "_syncedAt": "2026-09-30T06:45:39.647Z",
    "staffName": "Mulyadi",
    "notes": "Sudah selesai dan bisa di gunakan",
    "date": "2026-09-16",
    "_source": "google_sheet",
    "division": "Multimedia",
    "activity": "- Cek Kabel SDI Perleng Box",
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-16-Mulyadi--_Ganti_Konektor_SDI_kabel_pan",
    "status": "Submitted",
    "_source": "google_sheet",
    "notes": "Sudah selesai dan bisa di gunakan",
    "activity": "- Ganti Konektor SDI kabel panjang 1. Kabel pendek 1",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-02T07:00:44.441Z",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "date": "2026-09-16",
    "division": "Multimedia",
    "staffName": "Mulyadi",
    "_syncedAt": "2026-09-29T01:45:46.804Z"
  },
  {
    "id": "gsheet-v2-2026-09-16-Mulyana--_Repair_Dead_Pixel",
    "status": "Submitted",
    "_source": "google_sheet",
    "activity": "- Repair Dead Pixel",
    "notes": "selesai",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "deviceType": "Desktop"
    },
    "date": "2026-09-16",
    "division": "Service",
    "staffName": "Mulyana",
    "_syncedAt": "2026-09-30T06:45:32.576Z"
  },
  {
    "id": "gsheet-v2-2026-09-16-Ramdani--_Cleaning___Repaint_Mic_SM58_",
    "date": "2026-09-16",
    "activity": "- Cleaning & Repaint Mic SM58, SM57 & VXT",
    "division": "Audio",
    "notes": "SM58 ( Bagus 17, Rusak 1 ), SM57 ( Bagus 11, Rusak 4, Hilang 9 ), VXT ( Bagus 8, Rusak 2 )",
    "_source": "google_sheet",
    "status": "Submitted",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:35.402Z"
    },
    "_syncedAt": "2026-09-30T06:45:54.167Z",
    "staffName": "Ramdani"
  },
  {
    "id": "gsheet-v2-2026-09-16-Wahyudin--_Cleaning_Avanda_210_16_Box",
    "date": "2026-09-16",
    "activity": "- Cleaning Avanda 210 16 Box",
    "division": "Audio",
    "notes": "Kondisi Bersih dan Normal",
    "_source": "google_sheet",
    "status": "Submitted",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "deviceType": "Desktop"
    },
    "staffName": "Wahyudin (Audio)",
    "_syncedAt": "2026-09-30T06:45:45.572Z"
  },
  {
    "id": "rep-20260916-ayong-35-0",
    "date": "2026-09-16",
    "staffName": "Ayong",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.043Z",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "notes": "",
    "division": "Videotron",
    "_source": "google_sheet",
    "status": "Submitted",
    "activity": "- Buka Masking Kabinet"
  },
  {
    "id": "rep-20260916-butonk-40-0",
    "status": "Submitted",
    "division": "Audio",
    "date": "2026-09-16",
    "activity": "- Bongkar RCF 8003 Kirim ke sambang",
    "staffName": "Butonk",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.044Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync"
    },
    "_source": "google_sheet",
    "notes": "2 Unit Komponen Speaker 18inc saja untuk di service keluar"
  },
  {
    "id": "rep-20260916-dani-39-0",
    "_source": "google_sheet",
    "notes": "SM58 ( Bagus 17, Rusak 1 ), SM57 ( Bagus 11, Rusak 4, Hilang 9 ), VXT ( Bagus 8, Rusak 2 )",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.044Z",
      "deviceType": "Desktop"
    },
    "staffName": "Dani",
    "activity": "- Cleaning & Repaint Mic SM58, SM57 & VXT",
    "date": "2026-09-16",
    "division": "Audio",
    "status": "Submitted"
  },
  {
    "id": "rep-20260916-heri-41-0",
    "status": "Submitted",
    "date": "2026-09-16",
    "division": "Lighting",
    "activity": "CLEANING, CEK UNIT",
    "staffName": "Heri",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.044Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync"
    },
    "_source": "google_sheet",
    "notes": ""
  },
  {
    "id": "rep-20260916-heri-42-0",
    "activity": "- Konek artnet ke Tiger Touch",
    "date": "2026-09-16",
    "status": "Submitted",
    "notes": "",
    "division": "Lighting",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.044Z"
    },
    "_source": "google_sheet",
    "staffName": "Heri"
  },
  {
    "id": "rep-20260916-heri-43-0",
    "status": "Submitted",
    "activity": "- Cleaning All Freshnell 200 W",
    "date": "2026-09-16",
    "division": "Lighting",
    "_source": "google_sheet",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.045Z",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "staffName": "Heri",
    "notes": "Kondisi Normal"
  },
  {
    "id": "rep-20260916-heri-44-0",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.045Z"
    },
    "notes": "Smoke No.3 ERORR",
    "date": "2026-09-16",
    "staffName": "Heri",
    "division": "Lighting",
    "_source": "google_sheet",
    "status": "Submitted",
    "activity": "- Cek Smoke erorr"
  },
  {
    "id": "rep-20260916-heri-45-0",
    "activity": "- Rapihin Kabel PerlBox",
    "date": "2026-09-16",
    "division": "Lighting",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.045Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync"
    },
    "staffName": "Heri",
    "status": "Submitted",
    "_source": "google_sheet",
    "notes": "Aman"
  },
  {
    "id": "rep-20260916-heri-46-0",
    "_source": "google_sheet",
    "notes": "Lancar",
    "date": "2026-09-16",
    "activity": "- Ganti Roda Box Kabel",
    "staffName": "Heri",
    "division": "Lighting",
    "status": "Submitted",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.045Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome"
    }
  },
  {
    "id": "rep-20260916-jay-36-0",
    "staffName": "Jay",
    "_source": "google_sheet",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.044Z",
      "deviceType": "Desktop"
    },
    "notes": "Sudah selesai dan bisa di gunakan",
    "division": "Multimedia",
    "status": "Submitted",
    "date": "2026-09-16",
    "activity": "- Ganti Konektor SDI kabel panjang 1. Kabel pendek 1"
  },
  {
    "id": "rep-20260916-jay-37-0",
    "_source": "google_sheet",
    "notes": "",
    "date": "2026-09-16",
    "activity": "- Cek Kabel SDI Perleng Box",
    "status": "Submitted",
    "division": "Multimedia",
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.044Z",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome"
    },
    "staffName": "Jay"
  },
  {
    "id": "rep-20260916-kharo-34-0",
    "activity": "- Repair Dead Pixel",
    "status": "Submitted",
    "division": "Videotron",
    "date": "2026-09-16",
    "_source": "google_sheet",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.043Z",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "notes": "selesai",
    "staffName": "Kharo"
  },
  {
    "id": "rep-20260916-unyim-38-0",
    "date": "2026-09-16",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.044Z"
    },
    "staffName": "Unyim",
    "division": "Audio",
    "status": "Submitted",
    "_source": "google_sheet",
    "notes": "Kondisi Bersih dan Normal",
    "activity": "- Cleaning Avanda 210 16 Box"
  },
  {
    "id": "gsheet-v2-2026-09-17-Mulyadi--_Cek_Kabel_SDI_50_Meter_Dan_G",
    "division": "Multimedia",
    "activity": "- Cek Kabel SDI 50 Meter Dan Ganti Konektor 3 Unit",
    "date": "2026-09-17",
    "status": "Submitted",
    "_source": "google_sheet",
    "_syncedAt": "2026-09-30T06:46:30.433Z",
    "staffName": "Mulyadi",
    "notes": "- Dari 3 Unit Kabel SDI, 1 Unit Harus Ganti konektor ( 2 Unit Aman )",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:35.402Z"
    }
  },
  {
    "id": "gsheet-v2-2026-09-17-Mulyana--_Ganti_Dead_Pixel",
    "division": "Service",
    "activity": "- Ganti Dead Pixel",
    "date": "2026-09-17",
    "status": "Submitted",
    "_source": "google_sheet",
    "_syncedAt": "2026-09-30T06:46:22.259Z",
    "staffName": "Mulyana",
    "notes": "- 5 Box Diluar Blom Beres\n- 1 Box Clear 8 Panel Cabinet selesai\n- 1 Box Baru Beres 4 Kabinet sisa 4 perbaikan\n- 1 Box Kerusakan Berat isi 8 kabinet\n- 1 Box Clear ( 8 Panel Cabinet )",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    }
  },
  {
    "id": "gsheet-v2-2026-09-17-Mulyana-1_Box_Kerusakan_Berat",
    "date": "2026-09-17",
    "status": "Submitted",
    "activity": "1 Box Kerusakan Berat",
    "_source": "google_sheet",
    "notes": "- 1 Box Clear ( 8 Panel Cabinet )",
    "division": "Service",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-02T07:00:44.443Z"
    },
    "_syncedAt": "2026-09-29T01:32:44.226Z",
    "staffName": "Mulyana"
  },
  {
    "id": "gsheet-v2-2026-09-17-Ramdani--_Cek_Mic____Jumlahnya",
    "notes": "- Bagus Dan Bersih",
    "division": "Audio",
    "activity": "- Cek Mic  & Jumlahnya",
    "status": "Submitted",
    "staffName": "Ramdani",
    "_syncedAt": "2026-09-30T06:46:35.785Z",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "date": "2026-09-17",
    "_source": "google_sheet"
  },
  {
    "id": "gsheet-v2-2026-09-17-Taufik_Diana--_Cek_Panel_Dan_Ganti_3_Unit_I",
    "activity": "- Cek Panel Dan Ganti 3 Unit Indikator",
    "_source": "google_sheet",
    "division": "Audio",
    "date": "2026-09-17",
    "status": "Submitted",
    "_syncedAt": "2026-09-30T06:46:33.171Z",
    "staffName": "Taufik Diana",
    "notes": "- Udah Aman Diganti baru",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "browser": "Chrome"
    }
  },
  {
    "id": "gsheet-v2-2026-09-17-Wahyudin--_Cek_Takel_1___2_Ton",
    "activity": "- Cek Takel 1 & 2 Ton",
    "_source": "google_sheet",
    "division": "Audio",
    "date": "2026-09-17",
    "status": "Submitted",
    "_syncedAt": "2026-09-30T06:46:37.926Z",
    "staffName": "Wahyudin (Audio)",
    "notes": "- Takel yg 1 Ton LOS 1 Unit wajib di perbaiki",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "deviceType": "Desktop"
    }
  },
  {
    "id": "gsheet-v2-2026-09-17-Yudishtira_Purnama_A--_Cek_Ampeg_SVT-4",
    "_syncedAt": "2026-09-30T06:46:40.651Z",
    "staffName": "Yudishtira Purnama A",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:35.402Z"
    },
    "date": "2026-09-17",
    "_source": "google_sheet",
    "status": "Submitted",
    "activity": "- Cek Ampeg SVT-4",
    "division": "Audio",
    "notes": "- Harus service dan ganti PTC"
  },
  {
    "id": "rep-20260917-dani-53-0",
    "notes": "- Bagus Dan Bersih",
    "division": "Audio",
    "activity": "- Cek Mic  & Jumlahnya",
    "status": "Submitted",
    "_source": "google_sheet",
    "staffName": "Dani",
    "date": "2026-09-17",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.046Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync"
    }
  },
  {
    "id": "rep-20260917-jay-51-0",
    "division": "Multimedia",
    "date": "2026-09-17",
    "staffName": "Jay",
    "activity": "- Cek Kabel SDI 50 Meter Dan Ganti Konektor 3 Unit",
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.046Z",
      "browser": "Chrome"
    },
    "status": "Submitted",
    "_source": "google_sheet",
    "notes": "- Dari 3 Unit Kabel SDI, 1 Unit Harus Ganti konektor ( 2 Unit Aman )"
  },
  {
    "id": "rep-20260917-kharo-47-0",
    "_source": "google_sheet",
    "activity": "- Ganti Dead Pixel",
    "division": "Videotron",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.045Z"
    },
    "staffName": "Kharo",
    "date": "2026-09-17",
    "notes": "- 5 Box Diluar Blom Beres",
    "status": "Submitted"
  },
  {
    "id": "rep-20260917-kharo-48-0",
    "_source": "google_sheet",
    "date": "2026-09-17",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.045Z"
    },
    "notes": "- 1 Box Clear 8 Panel Cabinet selesai",
    "staffName": "Kharo",
    "activity": "1 Box Kerusakan Berat",
    "status": "Submitted",
    "division": "Videotron"
  },
  {
    "id": "rep-20260917-kharo-49-0",
    "_source": "google_sheet",
    "notes": "- 1 Box Baru Beres 4 Kabinet sisa 4 perbaikan",
    "activity": "- Hadir",
    "staffName": "Kharo",
    "division": "Umum",
    "_syncMeta": {
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.046Z",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync"
    },
    "date": "2026-09-17",
    "status": "Submitted"
  },
  {
    "id": "rep-20260917-kharo-50-0",
    "_source": "google_sheet",
    "date": "2026-09-17",
    "status": "Submitted",
    "activity": "- Hadir",
    "notes": "- 1 Box Kerusakan Berat isi 8 kabinet",
    "division": "Umum",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.046Z",
      "deviceType": "Desktop"
    },
    "staffName": "Kharo"
  },
  {
    "id": "rep-20260917-opik-52-0",
    "staffName": "Opik",
    "date": "2026-09-17",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.046Z"
    },
    "status": "Submitted",
    "_source": "google_sheet",
    "notes": "- Udah Aman Diganti baru",
    "activity": "- Cek Panel Dan Ganti 3 Unit Indikator",
    "division": "Audio"
  },
  {
    "id": "rep-20260917-unyim-54-0",
    "activity": "- Cek Takel 1 & 2 Ton",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.046Z",
      "deviceOS": "macOS"
    },
    "status": "Submitted",
    "staffName": "Unyim",
    "date": "2026-09-17",
    "division": "Audio",
    "_source": "google_sheet",
    "notes": "- Takel yg 1 Ton LOS 1 Unit wajib di perbaiki"
  },
  {
    "id": "rep-20260917-yudis-55-0",
    "staffName": "Yudis",
    "status": "Submitted",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.047Z"
    },
    "division": "Audio",
    "activity": "- Cek Ampeg SVT-4",
    "date": "2026-09-17",
    "_source": "google_sheet",
    "notes": "- Harus service dan ganti PTC"
  },
  {
    "id": "gsheet-v2-2026-09-18-Mulyana--_Ganti_Dead_Pixel",
    "staffName": "Mulyana",
    "_syncedAt": "2026-09-30T06:46:43.496Z",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "_source": "google_sheet",
    "date": "2026-09-18",
    "activity": "- Ganti Dead Pixel",
    "status": "Submitted",
    "division": "Service",
    "notes": "- 3 Box Belum Beres\n- 2 Box Clear\n- 1 Box Beres 3 Kabinet\n- 1 Box Kerusakan Berat"
  },
  {
    "id": "rep-20260918-kharo-58-0",
    "notes": "- 3 Box Belum Beres",
    "activity": "- Ganti Dead Pixel",
    "_source": "google_sheet",
    "staffName": "Kharo",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.047Z",
      "browser": "Chrome"
    },
    "status": "Submitted",
    "division": "Videotron",
    "date": "2026-09-18"
  },
  {
    "id": "rep-20260918-kharo-59-0",
    "division": "Umum",
    "status": "Submitted",
    "activity": "- Hadir",
    "_source": "google_sheet",
    "date": "2026-09-18",
    "notes": "- 2 Box Clear",
    "staffName": "Kharo",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.047Z",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceType": "Desktop"
    }
  },
  {
    "id": "rep-20260918-kharo-60-0",
    "_source": "google_sheet",
    "activity": "- Hadir",
    "division": "Umum",
    "staffName": "Kharo",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.047Z",
      "deviceType": "Desktop"
    },
    "date": "2026-09-18",
    "notes": "- 1 Box Beres 3 Kabinet",
    "status": "Submitted"
  },
  {
    "id": "rep-20260918-kharo-61-0",
    "division": "Umum",
    "_source": "google_sheet",
    "activity": "- Hadir",
    "notes": "- 1 Box Kerusakan Berat",
    "status": "Submitted",
    "staffName": "Kharo",
    "date": "2026-09-18",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.047Z"
    }
  },
  {
    "id": "gsheet-v2-2026-09-21-Heri--_Cek_Kabel_dan_Unit_Bekas_Sew",
    "_syncedAt": "2026-09-30T06:47:27.901Z",
    "staffName": "Heri",
    "date": "2026-09-21",
    "_source": "google_sheet",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "notes": "- Kabel lengkap , Minus Breket Stromy 1bok\n- Parled Kondisi Normal Semua\n- Cover2 lengkap\n- Smoke Kondisi Normal Semua",
    "division": "Lighting",
    "status": "Submitted",
    "activity": "- Cek Kabel dan Unit Bekas Sewaan Plaza Festival"
  },
  {
    "id": "gsheet-v2-2026-09-21-Heri--_Parled_Eror_No_3_12_13_19_20",
    "notes": "- Parled Kondisi Normal Semua",
    "_source": "google_sheet",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-02T07:00:44.443Z",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "_syncedAt": "2026-09-29T01:32:50.470Z",
    "staffName": "Heri",
    "activity": "- Parled Eror No 3,12,13,19,20,25,27,29,32",
    "date": "2026-09-21",
    "division": "Lighting",
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-21-Heri--_Rapihin_Cover_Bekas_Pakai",
    "notes": "- Cover2 lengkap",
    "_source": "google_sheet",
    "status": "Submitted",
    "staffName": "Heri",
    "_syncedAt": "2026-09-29T01:32:53.781Z",
    "date": "2026-09-21",
    "_syncMeta": {
      "updatedAt": "2026-10-02T07:00:44.443Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop"
    },
    "division": "Lighting",
    "activity": "- Rapihin Cover Bekas Pakai"
  },
  {
    "id": "gsheet-v2-2026-09-21-Heri--_Smoke_No_3_Ganti_PCB_mainboa",
    "status": "Submitted",
    "date": "2026-09-21",
    "notes": "- Smoke Kondisi Normal Semua",
    "division": "Lighting",
    "activity": "- Smoke No 3 Ganti PCB mainboard",
    "_syncedAt": "2026-09-29T01:32:49.576Z",
    "staffName": "Heri",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedAt": "2026-10-02T07:00:44.443Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    }
  },
  {
    "id": "gsheet-v2-2026-09-21-Heri-Service___Cek_Unit",
    "_source": "google_sheet",
    "activity": "Service & Cek Unit",
    "_syncedAt": "2026-09-29T01:32:48.669Z",
    "staffName": "Heri",
    "division": "Lighting",
    "notes": "",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-02T07:00:44.443Z",
      "deviceOS": "macOS"
    },
    "date": "2026-09-21",
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-21-Heri-Sudah_NORMAL__Service_Mg_Damri",
    "activity": "Sudah NORMAL (Service Mg Damri)",
    "status": "Submitted",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-02T07:00:44.443Z",
      "browser": "Chrome"
    },
    "_source": "google_sheet",
    "division": "Lighting",
    "staffName": "Heri",
    "_syncedAt": "2026-09-29T01:32:52.432Z",
    "date": "2026-09-21",
    "notes": ""
  },
  {
    "id": "rep-20260921-heri-62-0",
    "notes": "",
    "date": "2026-09-21",
    "status": "Submitted",
    "division": "Lighting",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.047Z",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "_source": "google_sheet",
    "staffName": "Heri",
    "activity": "Service & Cek Unit"
  },
  {
    "id": "rep-20260921-heri-63-0",
    "staffName": "Heri",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.048Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync"
    },
    "division": "Lighting",
    "date": "2026-09-21",
    "notes": "- Smoke Kondisi Normal Semua",
    "status": "Submitted",
    "activity": "- Smoke No 3 Ganti PCB mainboard"
  },
  {
    "id": "rep-20260921-heri-64-0",
    "_source": "google_sheet",
    "notes": "- Parled Kondisi Normal Semua",
    "activity": "- Parled Eror No 3,12,13,19,20,25,27,29,32",
    "division": "Lighting",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.048Z",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS"
    },
    "staffName": "Heri",
    "date": "2026-09-21",
    "status": "Submitted"
  },
  {
    "id": "rep-20260921-heri-65-0",
    "_source": "google_sheet",
    "division": "Lighting",
    "staffName": "Heri",
    "notes": "",
    "date": "2026-09-21",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.048Z",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome"
    },
    "activity": "Sudah NORMAL (Service Mg Damri)",
    "status": "Submitted"
  },
  {
    "id": "rep-20260921-heri-66-0",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.048Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync"
    },
    "staffName": "Heri",
    "notes": "- Cover2 lengkap",
    "activity": "- Rapihin Cover Bekas Pakai",
    "status": "Submitted",
    "division": "Lighting",
    "date": "2026-09-21"
  },
  {
    "id": "rep-20260921-heri-67-0",
    "division": "Lighting",
    "status": "Submitted",
    "activity": "- Cek Kabel dan Unit Bekas Sewaan Plaza Festival",
    "staffName": "Heri",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.049Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync"
    },
    "_source": "google_sheet",
    "date": "2026-09-21",
    "notes": "- Kabel lengkap , Minus Breket Stromy 1bok"
  },
  {
    "id": "gsheet-v2-2026-09-22-Suryana--_Cek_Sub_Kla_4_Unit",
    "activity": "- Cek Sub Kla 4 Unit",
    "_source": "google_sheet",
    "division": "Audio",
    "date": "2026-09-22",
    "status": "Submitted",
    "staffName": "Suryana",
    "_syncedAt": "2026-09-30T06:47:33.237Z",
    "notes": "- Service Modul Sub Kla No.3 ( Kirim Ke PIB )\n- Beres, Aman Rumbai bisa di gunakan",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop"
    }
  },
  {
    "id": "gsheet-v2-2026-09-22-Suryana--_Ngerapihin_Rumbai_Mic",
    "notes": "- Beres, Aman Rumbai bisa di gunakan",
    "activity": "- Ngerapihin Rumbai Mic",
    "division": "Audio",
    "_syncMeta": {
      "updatedAt": "2026-10-02T07:00:44.442Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "staffName": "Suryana",
    "_syncedAt": "2026-09-29T01:44:58.036Z",
    "_source": "google_sheet",
    "date": "2026-09-22",
    "status": "Submitted"
  },
  {
    "id": "rep-20260922-buluk-68-0",
    "notes": "- Beres, Aman Rumbai bisa di gunakan",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.049Z",
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "staffName": "Buluk",
    "_source": "google_sheet",
    "activity": "- Ngerapihin Rumbai Mic",
    "division": "Audio",
    "date": "2026-09-22",
    "status": "Submitted"
  },
  {
    "id": "rep-20260922-buluk-69-0",
    "staffName": "Buluk",
    "division": "Audio",
    "_source": "google_sheet",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.049Z",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "activity": "- Cek Sub Kla 4 Unit",
    "date": "2026-09-22",
    "status": "Submitted",
    "notes": "- Service Modul Sub Kla No.3 ( Kirim Ke PIB )"
  },
  {
    "id": "gsheet-v2-2026-09-23-Yudishtira_Purnama_A--",
    "activity": "-",
    "status": "Submitted",
    "division": "Audio",
    "notes": "",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "date": "2026-09-23",
    "_source": "google_sheet",
    "staffName": "Yudishtira Purnama A",
    "_syncedAt": "2026-09-30T06:47:38.676Z"
  },
  {
    "id": "gsheet-v2-2026-09-23-Yudishtira_Purnama_A--_Merapihkan_Rak_Penyimpanan",
    "_source": "google_sheet",
    "notes": "",
    "division": "Audio",
    "status": "Submitted",
    "date": "2026-09-23",
    "activity": "- Merapihkan Rak Penyimpanan",
    "_syncedAt": "2026-09-29T01:44:58.765Z",
    "staffName": "Yudishtira Purnama A",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-02T07:00:44.442Z"
    }
  },
  {
    "id": "rep-20260923-yudis-70-0",
    "division": "Audio",
    "_source": "google_sheet",
    "notes": "",
    "status": "Submitted",
    "activity": "- Merapihkan Rak Penyimpanan",
    "date": "2026-09-23",
    "staffName": "Yudis",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.049Z"
    }
  },
  {
    "id": "rep-20260923-yudis-71-0",
    "_source": "google_sheet",
    "date": "2026-09-23",
    "notes": "",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.049Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync"
    },
    "staffName": "Yudis",
    "activity": "-",
    "status": "Submitted",
    "division": "Audio"
  },
  {
    "id": "gsheet-v2-2026-09-24-Heri--_Bersih_bersih_bok",
    "_source": "google_sheet",
    "notes": "1 Unit Mirror-Ball sudah masuk Hardcase",
    "status": "Submitted",
    "division": "Lighting",
    "date": "2026-09-24",
    "_syncedAt": "2026-09-30T06:48:25.109Z",
    "staffName": "Heri",
    "activity": "- Bersih bersih bok",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:35.402Z"
    }
  },
  {
    "id": "gsheet-v2-2026-09-24-Heri--_Mirorrball_Ter_Hardcase",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-02T07:00:44.442Z",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "status": "Submitted",
    "staffName": "Heri",
    "_syncedAt": "2026-09-29T01:33:04.413Z",
    "date": "2026-09-24",
    "_source": "google_sheet",
    "activity": "- Mirorrball Ter Hardcase",
    "notes": "1 Unit Mirror-Ball sudah masuk Hardcase",
    "division": "Lighting"
  },
  {
    "id": "gsheet-v2-2026-09-24-Heri--_Set_Up_Layout_Gudang",
    "notes": "",
    "_source": "google_sheet",
    "date": "2026-09-24",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-02T07:00:44.442Z"
    },
    "division": "Lighting",
    "staffName": "Heri",
    "_syncedAt": "2026-09-29T01:45:01.418Z",
    "activity": "- Set Up Layout Gudang",
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-24-Muhamad_Rahmat-cek_komponen_sub_KLA",
    "activity": "cek komponen sub KLA",
    "notes": "isu komponen KLA problem ngeleker ternyata normal(siap pakai)",
    "status": "Submitted",
    "date": "2026-09-24",
    "_source": "google_sheet",
    "division": "Audio",
    "_syncedAt": "2026-09-30T06:47:47.879Z",
    "staffName": "Muhamad Rahmat",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    }
  },
  {
    "id": "gsheet-v2-2026-09-24-Mulyana--_repair_12_kabinet",
    "division": "Videotron",
    "notes": "8 Panel cabinet blm clear",
    "date": "2026-09-24",
    "activity": "- repair 12 kabinet",
    "status": "Submitted",
    "_source": "google_sheet",
    "staffName": "Mulyana",
    "_syncedAt": "2026-09-29T01:45:01.927Z",
    "_syncMeta": {
      "updatedAt": "2026-10-02T07:00:44.442Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    }
  },
  {
    "id": "gsheet-v2-2026-09-24-Mulyana--1_kabinet_ilang_jalur",
    "date": "2026-09-24",
    "notes": "3 kabinet ilang jalur",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedAt": "2026-10-02T07:00:44.442Z",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "_source": "google_sheet",
    "staffName": "Mulyana",
    "_syncedAt": "2026-09-29T01:33:10.777Z",
    "activity": "-1 kabinet ilang jalur",
    "status": "Submitted",
    "division": "Service"
  },
  {
    "id": "gsheet-v2-2026-09-24-Mulyana--1_kabinet_ngacing",
    "staffName": "Mulyana",
    "_syncedAt": "2026-09-29T01:33:09.337Z",
    "status": "Submitted",
    "_syncMeta": {
      "updatedAt": "2026-10-02T07:00:44.442Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "browser": "Chrome"
    },
    "division": "Service",
    "date": "2026-09-24",
    "notes": "5 kabinet kena ic warna",
    "activity": "-1 kabinet ngacing",
    "_source": "google_sheet"
  },
  {
    "id": "gsheet-v2-2026-09-24-Mulyana--10_kabinet_dead_pixel",
    "notes": "3 kabinet ilang jalur\n5 kabinet kena ic warna\n8 Panel cabinet blm clear\nselesai di ganti kunci kabel",
    "activity": "-10 kabinet dead pixel",
    "division": "Service",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "_syncedAt": "2026-09-30T06:48:37.024Z",
    "staffName": "Mulyana",
    "date": "2026-09-24",
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-24-Mulyana--ganti_kuncian_kabel",
    "activity": "-ganti kuncian kabel",
    "_source": "google_sheet",
    "notes": "selesai di ganti kunci kabel",
    "date": "2026-09-24",
    "division": "Service",
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "updatedAt": "2026-10-02T07:00:44.442Z"
    },
    "staffName": "Mulyana",
    "_syncedAt": "2026-09-29T01:33:13.707Z",
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-24-Mulyana--sortir_masking",
    "activity": "-sortir masking",
    "status": "Submitted",
    "_source": "google_sheet",
    "notes": "",
    "date": "2026-09-24",
    "division": "Service",
    "_syncMeta": {
      "updatedAt": "2026-10-02T07:00:44.442Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "_syncedAt": "2026-09-29T01:33:15.199Z",
    "staffName": "Mulyana"
  },
  {
    "id": "gsheet-v2-2026-09-24-Taufik_Diana-setup_layout_hardcase_gudang",
    "status": "Submitted",
    "division": "Audio",
    "notes": "1 set backline dalam kondisi normal(siap pakai)",
    "date": "2026-09-24",
    "activity": "setup layout hardcase gudang",
    "staffName": "Taufik Diana",
    "_syncedAt": "2026-09-30T06:47:42.057Z",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    }
  },
  {
    "id": "gsheet-v2-2026-09-24-Yudishtira_Purnama_A-cek_1_set_backline",
    "division": "Audio",
    "status": "Submitted",
    "activity": "cek 1 set backline",
    "_source": "google_sheet",
    "notes": "",
    "date": "2026-09-24",
    "_syncedAt": "2026-09-30T06:47:44.975Z",
    "staffName": "Yudishtira Purnama A",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:35.402Z"
    }
  },
  {
    "id": "rep-20260924-heri-75-0",
    "staffName": "Heri",
    "status": "Submitted",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.050Z",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "date": "2026-09-24",
    "division": "Lighting",
    "activity": "- Set Up Layout Gudang",
    "notes": "",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260924-heri-76-0",
    "activity": "- Mirorrball Ter Hardcase",
    "_source": "google_sheet",
    "division": "Lighting",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.051Z"
    },
    "staffName": "Heri",
    "date": "2026-09-24",
    "status": "Submitted",
    "notes": "1 Unit Mirror-Ball sudah masuk Hardcase"
  },
  {
    "id": "rep-20260924-heri-77-0",
    "division": "Lighting",
    "activity": "- Bersih bersih bok",
    "date": "2026-09-24",
    "notes": "",
    "_source": "google_sheet",
    "status": "Submitted",
    "staffName": "Heri",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.051Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync"
    }
  },
  {
    "id": "rep-20260924-kharo-78-0",
    "activity": "- repair 12 kabinet",
    "notes": "8 Panel cabinet blm clear",
    "_source": "google_sheet",
    "status": "Submitted",
    "division": "Videotron",
    "date": "2026-09-24",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.051Z",
      "deviceType": "Desktop"
    },
    "staffName": "Kharo"
  },
  {
    "id": "rep-20260924-kharo-79-0",
    "notes": "5 kabinet kena ic warna",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.052Z",
      "deviceType": "Desktop"
    },
    "activity": "-1 kabinet ngacing",
    "_source": "google_sheet",
    "staffName": "Kharo",
    "status": "Submitted",
    "division": "Videotron",
    "date": "2026-09-24"
  },
  {
    "id": "rep-20260924-kharo-80-0",
    "division": "Videotron",
    "notes": "3 kabinet ilang jalur",
    "activity": "-1 kabinet ilang jalur",
    "status": "Submitted",
    "date": "2026-09-24",
    "_source": "google_sheet",
    "staffName": "Kharo",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.052Z",
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS"
    }
  },
  {
    "id": "rep-20260924-kharo-81-0",
    "division": "Videotron",
    "activity": "-10 kabinet dead pixel",
    "staffName": "Kharo",
    "status": "Submitted",
    "_source": "google_sheet",
    "date": "2026-09-24",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.052Z"
    },
    "notes": ""
  },
  {
    "id": "rep-20260924-kharo-82-0",
    "status": "Submitted",
    "staffName": "Kharo",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.053Z",
      "deviceType": "Desktop"
    },
    "division": "Videotron",
    "activity": "-ganti kuncian kabel",
    "date": "2026-09-24",
    "_source": "google_sheet",
    "notes": "selesai di ganti kunci kabel"
  },
  {
    "id": "rep-20260924-kharo-83-0",
    "activity": "-sortir masking",
    "status": "Submitted",
    "division": "Videotron",
    "notes": "",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.053Z",
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop"
    },
    "_source": "google_sheet",
    "date": "2026-09-24",
    "staffName": "Kharo"
  },
  {
    "id": "rep-20260924-mboh-74-0",
    "_source": "google_sheet",
    "staffName": "Mboh",
    "division": "Audio",
    "notes": "isu komponen KLA problem ngeleker ternyata normal(siap pakai)",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.050Z",
      "deviceType": "Desktop"
    },
    "status": "Submitted",
    "date": "2026-09-24",
    "activity": "cek komponen sub KLA"
  },
  {
    "id": "rep-20260924-opik-72-0",
    "staffName": "Opik",
    "date": "2026-09-24",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.050Z"
    },
    "division": "Audio",
    "status": "Submitted",
    "activity": "setup layout hardcase gudang",
    "notes": "1 set backline dalam kondisi normal(siap pakai)",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260924-yudis-73-0",
    "notes": "",
    "activity": "cek 1 set backline",
    "division": "Audio",
    "status": "Submitted",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.050Z",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "staffName": "Yudis",
    "_source": "google_sheet",
    "date": "2026-09-24"
  },
  {
    "id": "gsheet-v2-2026-09-28-Iwan_Kurniawan-_iventory_mic__cat_mic_VXT",
    "notes": "*MIC SM 58 KW 1PCS",
    "_source": "google_sheet",
    "staffName": "Iwan Kurniawan",
    "_syncedAt": "2026-09-30T06:49:00.261Z",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    },
    "status": "Submitted",
    "division": "Audio",
    "activity": "*iventory mic\n*cat mic VXT",
    "date": "2026-09-28"
  },
  {
    "id": "gsheet-v2-2026-09-28-Muhamad_Rahmat-_iventory_mic__cat_mic_VXT",
    "notes": "*MIC VXT 7PCS\n*MIC SAMSON 3PCS\n*MIC C1000 HITAM 7PCS\n*MIC C1000 GOLD 8PCS\n*MIC AUDIX D6 1PCS\n*MIC SM57 13PCS ( -6 )",
    "_source": "google_sheet",
    "_syncedAt": "2026-09-30T06:49:14.918Z",
    "staffName": "Muhamad Rahmat",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "deviceOS": "macOS"
    },
    "status": "Submitted",
    "division": "Audio",
    "activity": "*iventory mic\n*cat mic VXT",
    "date": "2026-09-28"
  },
  {
    "id": "gsheet-v2-2026-09-28-Mulyadi-Bantu_cek__Data_Inventory_dan_",
    "status": "Submitted",
    "division": "Multimedia",
    "activity": "Bantu cek  Data Inventory dan cek fisik unit Divisi Sound",
    "date": "2026-09-28",
    "staffName": "Mulyadi",
    "_syncedAt": "2026-09-30T06:49:41.628Z",
    "notes": "Menghitung jumlah Fisik Unit\nMenghitung jumlah Fisik Unit/ Sesuai",
    "_syncMeta": {
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "updatedBy": "BatchSync",
      "browser": "Chrome"
    },
    "_source": "google_sheet"
  },
  {
    "id": "gsheet-v2-2026-09-28-Mulyana--_1_kabinet_ilang_jalur",
    "status": "Submitted",
    "division": "Service",
    "activity": "- 1 kabinet ilang jalur",
    "date": "2026-09-28",
    "notes": "1 kabinet proses perbaikan\nSelesai 7 kabinet",
    "_syncedAt": "2026-09-30T06:48:51.041Z",
    "staffName": "Mulyana",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-05T09:22:35.402Z"
    },
    "_source": "google_sheet"
  },
  {
    "id": "gsheet-v2-2026-09-28-Mulyana--_7_kabinet_dead_pixel",
    "notes": "",
    "activity": "- 7 kabinet dead pixel",
    "division": "Service",
    "_source": "google_sheet",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-02T07:00:44.442Z",
      "browser": "Chrome"
    },
    "date": "2026-09-28",
    "_syncedAt": "2026-09-29T01:33:17.448Z",
    "staffName": "Mulyana",
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-28-Mulyana-repair_8_kabinet_led",
    "activity": "repair 8 kabinet led",
    "_source": "google_sheet",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-02T07:00:44.442Z",
      "browser": "Chrome"
    },
    "division": "Videotron",
    "_syncedAt": "2026-09-29T01:45:02.728Z",
    "staffName": "Mulyana",
    "notes": "",
    "status": "Submitted",
    "date": "2026-09-28"
  },
  {
    "id": "gsheet-v2-2026-09-28-Ramdani-_iventory_mic__cat_mic_VXT",
    "division": "Audio",
    "notes": "*MIC SM58 ORIGINAL 16 PCS",
    "_syncedAt": "2026-09-30T06:48:57.583Z",
    "staffName": "Ramdani",
    "date": "2026-09-28",
    "status": "Submitted",
    "activity": "*iventory mic\n*cat mic VXT",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:35.402Z"
    },
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260928-butonk-88-0",
    "activity": "*iventory mic\n*cat mic VXT",
    "status": "Submitted",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.054Z"
    },
    "division": "Audio",
    "staffName": "Butonk",
    "date": "2026-09-28",
    "notes": "*MIC SM 58 KW 1PCS",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260928-dani-87-0",
    "activity": "*iventory mic\n*cat mic VXT",
    "status": "Submitted",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.054Z",
      "deviceOS": "macOS"
    },
    "division": "Audio",
    "_source": "google_sheet",
    "staffName": "Dani",
    "notes": "*MIC SM58 ORIGINAL 16 PCS",
    "date": "2026-09-28"
  },
  {
    "id": "rep-20260928-jay-95-0",
    "status": "Submitted",
    "division": "Multimedia",
    "notes": "Menghitung jumlah Fisik Unit",
    "_syncMeta": {
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.056Z",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync"
    },
    "_source": "google_sheet",
    "date": "2026-09-28",
    "activity": "Bantu cek  Data Inventory dan cek fisik unit Divisi Sound",
    "staffName": "Jay"
  },
  {
    "id": "rep-20260928-jay-96-0",
    "_source": "google_sheet",
    "staffName": "Jay",
    "notes": "Menghitung jumlah Fisik Unit/ Sesuai",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.056Z",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "date": "2026-09-28",
    "division": "Umum",
    "status": "Submitted",
    "activity": "- Hadir"
  },
  {
    "id": "rep-20260928-kharo-84-0",
    "division": "Videotron",
    "notes": "Selesai 7 kabinet",
    "staffName": "Kharo",
    "status": "Submitted",
    "_source": "google_sheet",
    "activity": "repair 8 kabinet led",
    "date": "2026-09-28",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.053Z",
      "deviceOS": "macOS"
    }
  },
  {
    "id": "rep-20260928-kharo-85-0",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.054Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome"
    },
    "notes": "1 kabinet proses perbaikan",
    "staffName": "Kharo",
    "status": "Submitted",
    "division": "Videotron",
    "_source": "google_sheet",
    "activity": "- 7 kabinet dead pixel",
    "date": "2026-09-28"
  },
  {
    "id": "rep-20260928-kharo-86-0",
    "date": "2026-09-28",
    "notes": "",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.054Z",
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "_source": "google_sheet",
    "division": "Videotron",
    "staffName": "Kharo",
    "status": "Submitted",
    "activity": "- 1 kabinet ilang jalur"
  },
  {
    "id": "rep-20260928-mboh-89-0",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.055Z"
    },
    "staffName": "Mboh",
    "_source": "google_sheet",
    "activity": "*iventory mic\n*cat mic VXT",
    "division": "Audio",
    "date": "2026-09-28",
    "notes": "*MIC VXT 7PCS",
    "status": "Submitted"
  },
  {
    "id": "rep-20260928-mboh-90-0",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.055Z",
      "deviceType": "Desktop"
    },
    "staffName": "Mboh",
    "notes": "*MIC SAMSON 3PCS",
    "activity": "- Hadir",
    "_source": "google_sheet",
    "status": "Submitted",
    "division": "Umum",
    "date": "2026-09-28"
  },
  {
    "id": "rep-20260928-mboh-91-0",
    "status": "Submitted",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.055Z",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS"
    },
    "date": "2026-09-28",
    "staffName": "Mboh",
    "activity": "- Hadir",
    "division": "Umum",
    "notes": "*MIC C1000 HITAM 7PCS",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260928-mboh-92-0",
    "activity": "- Hadir",
    "notes": "*MIC C1000 GOLD 8PCS",
    "_source": "google_sheet",
    "status": "Submitted",
    "division": "Umum",
    "date": "2026-09-28",
    "staffName": "Mboh",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.055Z",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    }
  },
  {
    "id": "rep-20260928-mboh-93-0",
    "notes": "*MIC AUDIX D6 1PCS",
    "division": "Umum",
    "activity": "- Hadir",
    "status": "Submitted",
    "_source": "google_sheet",
    "date": "2026-09-28",
    "staffName": "Mboh",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.056Z"
    }
  },
  {
    "id": "rep-20260928-mboh-94-0",
    "notes": "*MIC SM57 13PCS ( -6 )",
    "division": "Umum",
    "staffName": "Mboh",
    "_source": "google_sheet",
    "status": "Submitted",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.056Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync"
    },
    "date": "2026-09-28",
    "activity": "- Hadir"
  },
  {
    "id": "gsheet-v2-2026-09-29-Wahyudin-cek_laptop_baru_koneksi_ke_dlm",
    "division": "Audio",
    "notes": "",
    "activity": "cek laptop baru koneksi ke dlms",
    "_source": "google_sheet",
    "staffName": "Wahyudin (Audio)",
    "_syncedAt": "2026-09-30T06:50:38.277Z",
    "date": "2026-09-29",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-29-Wahyudin-kabel_perleng_",
    "division": "Audio",
    "notes": "",
    "activity": "kabel perleng.",
    "_source": "google_sheet",
    "staffName": "Wahyudin",
    "_syncedAt": "2026-09-30T06:50:04.687Z",
    "date": "2026-09-29",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "User",
      "updatedAt": "2026-09-30T06:50:08.025Z",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-29-Wahyudin-kabel_snake_16ch",
    "division": "Audio",
    "date": "2026-09-29",
    "_source": "google_sheet",
    "staffName": "Wahyudin",
    "_syncedAt": "2026-09-30T06:50:34.857Z",
    "activity": "kabel snake 16ch",
    "_syncMeta": {
      "updatedBy": "User",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-09-30T06:50:36.759Z"
    },
    "status": "Submitted",
    "notes": ""
  },
  {
    "id": "gsheet-v2-2026-09-29-Wahyudin-kabel_snake_8ch",
    "staffName": "Wahyudin",
    "_syncedAt": "2026-09-30T06:50:19.787Z",
    "notes": "",
    "date": "2026-09-29",
    "_syncMeta": {
      "updatedAt": "2026-09-30T06:50:26.243Z",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedBy": "User",
      "deviceOS": "macOS"
    },
    "_source": "google_sheet",
    "division": "Audio",
    "status": "Submitted",
    "activity": "kabel snake 8ch"
  },
  {
    "id": "gsheet-v2-2026-09-29-Wahyudin-kabel_xlr_",
    "_syncMeta": {
      "updatedAt": "2026-09-30T06:50:02.782Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "User"
    },
    "_syncedAt": "2026-09-30T06:50:01.485Z",
    "staffName": "Wahyudin",
    "date": "2026-09-29",
    "status": "Submitted",
    "activity": "kabel xlr.",
    "_source": "google_sheet",
    "division": "Audio",
    "notes": ""
  },
  {
    "id": "gsheet-v2-2026-09-29-Yudishtira_Purnama_A-inventory_Kabel",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop"
    },
    "staffName": "Yudishtira Purnama A",
    "_syncedAt": "2026-09-30T06:49:57.852Z",
    "date": "2026-09-29",
    "status": "Submitted",
    "activity": "inventory Kabel",
    "_source": "google_sheet",
    "division": "Audio",
    "notes": "Menghitung jumlah Fisik Unit/ Sesuai"
  },
  {
    "id": "rep-20260929-unyim-100-0",
    "notes": "",
    "status": "Submitted",
    "division": "Audio",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.058Z"
    },
    "_source": "google_sheet",
    "date": "2026-09-29",
    "activity": "kabel snake 8ch",
    "staffName": "unyim"
  },
  {
    "id": "rep-20260929-unyim-101-0",
    "status": "Submitted",
    "activity": "kabel snake 16ch",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.058Z",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "browser": "Chrome"
    },
    "date": "2026-09-29",
    "notes": "",
    "staffName": "unyim",
    "division": "Audio",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260929-unyim-102-0",
    "activity": "cek laptop baru koneksi ke dlms",
    "status": "Submitted",
    "division": "Audio",
    "_source": "google_sheet",
    "date": "2026-09-29",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.058Z",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "notes": "",
    "staffName": "unyim"
  },
  {
    "id": "rep-20260929-unyim-98-0",
    "activity": "kabel xlr.",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.057Z",
      "deviceType": "Desktop"
    },
    "_source": "google_sheet",
    "status": "Submitted",
    "notes": "",
    "date": "2026-09-29",
    "division": "Audio",
    "staffName": "unyim"
  },
  {
    "id": "rep-20260929-unyim-99-0",
    "_source": "google_sheet",
    "date": "2026-09-29",
    "status": "Submitted",
    "division": "Audio",
    "activity": "kabel perleng.",
    "staffName": "unyim",
    "_syncMeta": {
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.057Z",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome"
    },
    "notes": ""
  },
  {
    "id": "rep-20260929-yudis-97-0",
    "_source": "google_sheet",
    "notes": "Menghitung jumlah Fisik Unit/ Sesuai",
    "staffName": "yudis",
    "activity": "inventory Kabel",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.057Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync"
    },
    "status": "Submitted",
    "date": "2026-09-29",
    "division": "Audio"
  },
  {
    "id": "gsheet-v2-2026-09-30-Heri--_Benerin_Tutup_Jerigen_Smoke",
    "notes": "- Sudah di perbaiki\n- Harus Ganti Pompa",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:35.402Z",
      "deviceOS": "macOS"
    },
    "_syncedAt": "2026-09-30T10:40:35.536Z",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "- Benerin Tutup Jerigen Smoke",
    "status": "Submitted",
    "_source": "google_sheet",
    "date": "2026-09-30"
  },
  {
    "id": "gsheet-v2-2026-09-30-Heri--_Cek_smoke_rusak_No__1",
    "_source": "google_sheet",
    "notes": "- Harus Ganti Pompa",
    "staffName": "Heri",
    "_syncedAt": "2026-09-30T10:40:37.821Z",
    "_syncMeta": {
      "updatedBy": "User",
      "deviceOS": "macOS",
      "updatedAt": "2026-09-30T10:40:38.679Z",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "date": "2026-09-30",
    "activity": "- Cek smoke rusak No. 1",
    "division": "Lighting",
    "status": "Submitted"
  },
  {
    "id": "gsheet-v2-2026-09-30-Heri--_Cleaning_Mixer_Tiger_touch_I",
    "notes": "",
    "division": "Lighting",
    "activity": "- Cleaning Mixer Tiger touch II , Mixer Titan Quartz",
    "status": "Submitted",
    "_syncMeta": {
      "updatedBy": "User",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-09-30T10:40:33.576Z",
      "deviceType": "Desktop"
    },
    "_syncedAt": "2026-09-30T10:40:33.019Z",
    "staffName": "Heri",
    "_source": "google_sheet",
    "date": "2026-09-30"
  },
  {
    "id": "gsheet-v2-2026-09-30-Heri--_Rapihin_kabel_bekas_pakai_da",
    "staffName": "Heri",
    "_syncedAt": "2026-09-30T10:40:41.899Z",
    "_source": "google_sheet",
    "date": "2026-09-30",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "User",
      "updatedAt": "2026-09-30T10:40:42.453Z",
      "deviceType": "Desktop"
    },
    "notes": "",
    "division": "Lighting",
    "status": "Submitted",
    "activity": "- Rapihin kabel bekas pakai dan cover2 bekas pakai"
  },
  {
    "id": "gsheet-v2-2026-09-30-Heri--_Service_kabel_link",
    "date": "2026-09-30",
    "notes": "- Sudah di perbaiki",
    "status": "Submitted",
    "_syncMeta": {
      "updatedBy": "User",
      "deviceType": "Desktop",
      "updatedAt": "2026-09-30T10:40:37.276Z",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "division": "Lighting",
    "staffName": "Heri",
    "_syncedAt": "2026-09-30T10:40:36.642Z",
    "_source": "google_sheet",
    "activity": "- Service kabel link"
  },
  {
    "id": "gsheet-v2-2026-09-30-Heri--_servise_1_kabinet_ganti_ic_w",
    "notes": "",
    "_source": "google_sheet",
    "date": "2026-09-30",
    "activity": "- servise 1 kabinet ganti ic warna-",
    "division": "Videotron",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-09-30T11:02:37.996Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "User"
    },
    "status": "Submitted",
    "_syncedAt": "2026-09-30T11:02:37.372Z",
    "staffName": "Heri"
  },
  {
    "id": "gsheet-v2-2026-09-30-Heri--_Set_up_layout_bok_lighting",
    "date": "2026-09-30",
    "status": "Submitted",
    "division": "Lighting",
    "_source": "google_sheet",
    "activity": "- Set up layout bok lighting",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "User",
      "browser": "Chrome",
      "updatedAt": "2026-09-30T10:40:41.090Z",
      "deviceType": "Desktop"
    },
    "staffName": "Heri",
    "_syncedAt": "2026-09-30T10:40:40.519Z",
    "notes": ""
  },
  {
    "id": "gsheet-v2-2026-09-30-Heri-Mixer_Ma_Wing__Mixer_GrandMa",
    "date": "2026-09-30",
    "_source": "google_sheet",
    "division": "Lighting",
    "staffName": "Heri",
    "_syncedAt": "2026-09-30T10:40:34.142Z",
    "notes": "",
    "_syncMeta": {
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-09-30T10:40:34.713Z",
      "updatedBy": "User"
    },
    "activity": "Mixer Ma Wing, Mixer GrandMa",
    "status": "Submitted"
  },
  {
    "id": "rep-20260901-irfan-0-0",
    "date": "2026-09-01",
    "staffName": "Irfan",
    "division": "Videotron",
    "activity": "- Cek kabel lan",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260901-ayong-1-0",
    "date": "2026-09-01",
    "staffName": "Ayong",
    "division": "Videotron",
    "activity": "- Bersiin Prosesor dan cek kelengkapan kabel Di Processor",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260901-kharo-3-0",
    "date": "2026-09-01",
    "staffName": "kharo",
    "division": "Videotron",
    "activity": "1. repair 3 kabinet ic warna  + ganti dead pixel 2 kabinet clear",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260901-unyim-11-0",
    "date": "2026-09-01",
    "staffName": "unyim",
    "division": "Audio",
    "activity": "inventory",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260901-irfan-28-0",
    "date": "2026-09-01",
    "staffName": "Irfan",
    "division": "Videotron",
    "activity": "- Beraihin kaki level",
    "notes": "- Kondisi Baik",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260901-ayong-29-0",
    "date": "2026-09-01",
    "staffName": "Ayong",
    "division": "Videotron",
    "activity": "- Bersihin Ambalan",
    "notes": "- Kondisi Baik",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260901-wigi-30-0",
    "date": "2026-09-01",
    "staffName": "Wigi",
    "division": "Videotron",
    "activity": "- Beneren perleng legran",
    "notes": "- Kondisi Normal",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260901-heri-31-0",
    "date": "2026-09-01",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "Cek Unit Tripot",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260901-kharo-39-0",
    "date": "2026-09-01",
    "staffName": "kharo",
    "division": "Videotron",
    "activity": "- repair 1 kabinet ganti ic warna + ganti dead pixel",
    "notes": "1 modul pcb bengkok",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260901-dani-41-0",
    "date": "2026-09-01",
    "staffName": "dani",
    "division": "Audio",
    "activity": "cleaning up  16 speaker monitor db , LVX 2 unit",
    "notes": "kondisi baik",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20260901-heri-43-0",
    "date": "2026-09-01",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "Cleaning All Beam 450 24 Unit (No. 1 - 24)",
    "notes": "Normal Semua",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261001-staff-irvan-4",
    "date": "2026-10-01",
    "staffName": "Muhamad Irvan",
    "division": "Videotron",
    "activity": "- Cek kabel lan",
    "notes": "Aman",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261001-staff-ayong-5",
    "date": "2026-10-01",
    "staffName": "Ayong Sumarsih",
    "division": "Videotron",
    "activity": "- Bersiin Prosesor dan cek kelengkapan kabel Di Processor\n- Nyuci pemberat",
    "notes": "Sudah\nSudah",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261002-staff-mulyana-7",
    "date": "2026-10-02",
    "staffName": "Mulyana",
    "division": "Videotron",
    "activity": "1. repair 3 kabinet ic warna  + ganti dead pixel 2 kabinet clear\n2. cek 11 modul kabinet\n- 2 modul ilang jalur ic\n- 3 modul ilang jalur pixel\n- 3 modul kena ic warna\n- 1 modul arus konslet\n3. copot ic buat kanibal\n4. sortir masking",
    "notes": "Aman\nBeres\nPerbaikan\nPerbaikan\nPerbaikan\nPerbaikan\nSudah\nSudah",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261002-staff-unyin-15",
    "date": "2026-10-02",
    "staffName": "Wahyudin",
    "division": "Audio",
    "activity": "inventory\nstand speaker 22pcs\nstand mic lama 44pcs\nstand mic baru 20pcs\nstand kick pendek 5pcs\nstand mic pendek 4pcs\nstand boox 22pcs\nstand key singel 4pcs\nstand key soubel 3pcs\nstand gtr lama isi 3 2pcs\nstand gtr singel 4pcs\nstand gtr baru isi 3 1pcs isi 3pcs\nmarking mic sm58 57 condensor c1000\nmarking mic drum\ntakel 2ton 2pcs\ntakel 1ton 8pcs\nsetrap takel panjang 10pcs pendek 2pcs",
    "notes": "Ada\nAda\nAda\nAda\nAda\nAda\nAda\nAda\nAda\nAda\nAda\nSudah\nSudah\nAman\nAman\nAda",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261002-staff-irvan-32",
    "date": "2026-10-02",
    "staffName": "Muhamad Irvan",
    "division": "Videotron",
    "activity": "- Beraihin kaki level",
    "notes": "- Kondisi Baik",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261002-staff-ayong-33",
    "date": "2026-10-02",
    "staffName": "Ayong Sumarsih",
    "division": "Videotron",
    "activity": "- Bersihin Ambalan",
    "notes": "- Kondisi Baik",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261002-staff-dedi-34",
    "date": "2026-10-02",
    "staffName": "Dedi Agus Wigiantoro",
    "division": "Videotron",
    "activity": "- Beneren perleng legran",
    "notes": "- Kondisi Normal",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261003-staff-heri-35",
    "date": "2026-10-03",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "Cek Unit Tripot\n- A , Tripot Centurion\n- B , Tripot Centurion\n- C , Tripot Lama (Berat)\n- D , Tripot Lama\n- E , Tripot Lama ( Tipis Enteng )\n- F , Tripot Lama ( Tipis Enteng )\n- G , Tripot Custom",
    "notes": "Normal\nNormal\nNormal\nNormal\nNormal\nNormal\nKeadaan tidak komplite",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261003-staff-mulyana-43",
    "date": "2026-10-03",
    "staffName": "Mulyana",
    "division": "Videotron",
    "activity": "- repair 1 kabinet ganti ic warna + ganti dead pixel\n- repair modul 1 clear ganti ic warna",
    "notes": "1 modul pcb bengkok\nAman 1",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261004-staff-ramdani-45",
    "date": "2026-10-04",
    "staffName": "Ramdani",
    "division": "Audio",
    "activity": "cleaning up  16 speaker monitor db , LVX 2 unit",
    "notes": "kondisi baik",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261004-staff-unyin-46",
    "date": "2026-10-04",
    "staffName": "Wahyudin",
    "division": "Audio",
    "activity": "cleaning up  16 speaker monitor db , LVX 2 unit",
    "notes": "KOndisi Baik",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261004-staff-heri-47",
    "date": "2026-10-04",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "Cleaning All Beam 450 24 Unit (No. 1 - 24)",
    "notes": "Normal Semua",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261005-staff-iwan-48",
    "date": "2026-10-05",
    "staffName": "Iwan Kurniawan",
    "division": "Audio",
    "activity": "cleaning up monitor ART 312,ART 315",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261005-staff-ramdani-48",
    "date": "2026-10-05",
    "staffName": "Ramdani",
    "division": "Audio",
    "activity": "cleaning up monitor ART 312,ART 315",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261006-staff-rahmat-49",
    "date": "2026-10-06",
    "staffName": "Muhamad Rahmat",
    "division": "Audio",
    "activity": "cek unit AVANDA210",
    "notes": "-semua unit AVANDA210 kondisi normaL",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261006-staff-yudish-50",
    "date": "2026-10-06",
    "staffName": "Yudishtira Purnama A",
    "division": "Audio",
    "activity": "cek unit AVANDA210",
    "notes": "Aman",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261006-staff-suryana-51",
    "date": "2026-10-06",
    "staffName": "Suryana",
    "division": "Audio",
    "activity": "cek unit AVANDA210",
    "notes": "Kondisi Baik",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261007-staff-ayong-52",
    "date": "2026-10-07",
    "staffName": "Ayong Sumarsih",
    "division": "Videotron",
    "activity": "Sortir led 5 box",
    "notes": "-3 box kondisi baik no. 02, 12, 27",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261007-staff-dedi-53",
    "date": "2026-10-07",
    "staffName": "Dedi Agus Wigiantoro",
    "division": "Videotron",
    "activity": "Sortir led 5 box",
    "notes": "-Box no. 03 full service dead pixel, box no. 25 5 kabinet dead pixel",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261008-staff-mulyana-54",
    "date": "2026-10-08",
    "staffName": "Mulyana",
    "division": "Videotron",
    "activity": "repair 4 kabinet led\n- 1 kabinet ganti ic warna\n- 1 kabinet ngacing\n- 2 kabinet ganti jalur",
    "notes": "",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261008-staff-heri-58",
    "date": "2026-10-08",
    "staffName": "Heri",
    "division": "Lighting",
    "activity": "Ganti Pompa Smoke No.1",
    "notes": "- Kondisi Sudah Normal (OKE)",
    "status": "Submitted",
    "_source": "google_sheet"
  },
  {
    "id": "rep-20261009-staff-irvan-59",
    "date": "2026-10-09",
    "staffName": "Muhamad Irvan",
    "division": "Videotron",
    "activity": "Cek hanging bar gantung",
    "notes": "- Kondisi Baik",
    "status": "Submitted",
    "_source": "google_sheet"
  }
];

export const CANONICAL_FIRESTORE_LOGBOOK_ENTRIES: LogbookEntry[] = [
  {
    "id": "log-20260901-jay",
    "result": "OK",
    "division": "Multimedia",
    "activity": "Belajar Aplikasi Gemini & Chat GPT",
    "status": "Close",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "verification": "Supervisor Operasional",
    "staffName": "Mulyadi",
    "_source": "google_sheet",
    "followUp": "Belajar aplikasi AI untuk operasional multimedia selesai aman",
    "checklists": {
      "Aplikasi Gemini & Chat GPT": {
        "notes": "Kondisi operasional normal",
        "status": "OK"
      }
    },
    "date": "2026-09-01"
  },
  {
    "id": "log-gsheet-v2-2026-09-01-Mulyadi--_Belajar_Aplikasi_Chat_GPT",
    "followUp": "",
    "_syncedAt": "2026-09-29T01:44:35.180Z",
    "checklists": {
      "- Belajar Aplikasi Chat GPT": {
        "status": "OK",
        "notes": "Kondisi operasional normal"
      }
    },
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.722Z"
    },
    "date": "2026-09-01",
    "status": "Close",
    "verification": "Supervisor Operasional",
    "staffName": "Mulyadi",
    "_source": "google_sheet",
    "result": "OK",
    "division": "Multimedia",
    "activity": "- Belajar Aplikasi Chat GPT"
  },
  {
    "id": "log-gsheet-v2-2026-09-01-Mulyadi--_Belajar_Aplikasi_Gemini",
    "followUp": "selesai basic progress tingkat lanjut",
    "checklists": {
      "- Belajar Aplikasi Gemini": {
        "status": "OK",
        "notes": "selesai basic progress tingkat lanjut"
      }
    },
    "staffName": "Mulyadi",
    "status": "Close",
    "date": "2026-09-01",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "deviceOS": "macOS"
    },
    "_source": "google_sheet",
    "_syncedAt": "2026-09-29T01:44:35.128Z",
    "verification": "Supervisor Operasional",
    "activity": "- Belajar Aplikasi Gemini",
    "division": "Multimedia",
    "result": "OK"
  },
  {
    "id": "log-20260903-buluk",
    "activity": "1* Pengecekan semua unit speaker DBTtech15 dengan SmaartLive & Pembersihan debu",
    "status": "Close",
    "verification": "Supervisor Operasional",
    "result": "OK",
    "division": "Audio",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:19.025Z"
    },
    "date": "2026-09-03",
    "checklists": {
      "DB Tech 15": {
        "status": "OK",
        "notes": "Kondisi unit bersih"
      }
    },
    "staffName": "Suryana",
    "followUp": "Pengecekan fisik dan respon frekuensi seluruh unit DBTech selesai aman",
    "_source": "google_sheet"
  },
  {
    "id": "log-20260903-butong",
    "staffName": "Iwan Kurniawan",
    "division": "Audio",
    "status": "Close",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "browser": "Chrome"
    },
    "result": "OK",
    "_source": "google_sheet",
    "activity": "2* Membersihkan semua unit DBtech dari debu",
    "verification": "Supervisor Operasional",
    "followUp": "Membersihkan semua unit DBtech dari debu selesai",
    "date": "2026-09-03",
    "checklists": {
      "Cleaning DB Tech": {
        "notes": "Unit bersih dari debu",
        "status": "OK"
      }
    }
  },
  {
    "id": "log-20260903-iwankurniawan-4",
    "followUp": "Pembersihan seluruh unit DBTech dari debu selesai",
    "_source": "google_sheet",
    "date": "2026-09-03",
    "verification": "Auto-Synced",
    "staffName": "Iwan Kurniawan",
    "status": "Close",
    "activity": "2. membersihkan smua unit DBtech dari debu",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "Pembersihan seluruh unit DBTech dari debu selesai",
        "status": "OK"
      }
    },
    "division": "Audio",
    "result": "OK"
  },
  {
    "id": "log-20260903-mboh",
    "result": "NG",
    "date": "2026-09-03",
    "verification": "Supervisor Operasional",
    "followUp": "DB Tech No.18 modul amplifier serak saat beban input besar. Rekomendasi cek tim service",
    "status": "Open",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "deviceType": "Desktop"
    },
    "activity": "1* Pengecekan semua unit speaker DBTtech15 dengan SmaartLive berdasarkan data reference unit yang sehat",
    "staffName": "Muhamad Rahmat",
    "checklists": {
      "DB Tech No.18": {
        "notes": "Modul amplifier serak",
        "status": "NG"
      }
    },
    "division": "Audio"
  },
  {
    "id": "log-20260903-mboh-2-0",
    "date": "2026-09-03",
    "verification": "Auto-Synced",
    "result": "OK",
    "followUp": "- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event.\n-Rekomendasi untuk di cek oleh team service terutama pada modul Amplifier dan pengecekan  spare-part Tweter",
    "status": "Close",
    "_source": "google_sheet",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.059Z"
    },
    "activity": "1. pengecekan semua unit speker DBTtech15, dengan mengunakan smartlive berdasarkan data reference unit yang sehat",
    "staffName": "Mboh",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "division": "Audio"
  },
  {
    "id": "log-20260903-muhamadrahmat-1",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event.\n-Rekomendasi untuk di cek oleh team service terutama pada modul Amplifier dan pengecekan  spare-part Tweter",
        "status": "NG"
      }
    },
    "result": "NG",
    "division": "Audio",
    "_source": "google_sheet",
    "activity": "1. pengecekan semua unit speker DBTtech15, dengan mengunakan smartlive berdasarkan data reference unit yang sehat",
    "status": "Open",
    "verification": "Auto-Synced",
    "staffName": "Muhamad Rahmat",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T22:43:01.723Z"
    },
    "date": "2026-09-03",
    "followUp": "- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event.\n-Rekomendasi untuk di cek oleh team service terutama pada modul Amplifier dan pengecekan  spare-part Tweter"
  },
  {
    "id": "log-20260903-yudis",
    "_source": "google_sheet",
    "checklists": {
      "DB Tech 15": {
        "notes": "Perlu cek amplifier",
        "status": "NG"
      }
    },
    "verification": "Supervisor Operasional",
    "followUp": "Rekomendasi untuk dicek oleh team service terutama pada modul amplifier",
    "staffName": "Yudishtira Purnama A",
    "division": "Audio",
    "result": "NG",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "date": "2026-09-03",
    "activity": "1* Pengecekan semua unit speaker DBTtech15 dengan SmaartLive & Pembersihan debu",
    "status": "Open"
  },
  {
    "id": "log-gsheet-v2-2026-09-03-Iwan_Kurniawan-2__membersihkan_smua_unit_DBte",
    "activity": "2. membersihkan smua unit DBtech dari debu",
    "division": "Audio",
    "result": "OK",
    "staffName": "Iwan Kurniawan",
    "verification": "Supervisor Operasional",
    "status": "Close",
    "date": "2026-09-03",
    "_source": "google_sheet",
    "followUp": "",
    "checklists": {
      "2. membersihkan smua unit DBtech dari de": {
        "notes": "Kondisi operasional normal",
        "status": "OK"
      }
    },
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "_syncedAt": "2026-09-29T01:44:36.729Z"
  },
  {
    "id": "log-gsheet-v2-2026-09-03-Iwan_Kurniawan-2_membersihkan_smua_unit_DBtec",
    "status": "Close",
    "staffName": "Iwan Kurniawan",
    "verification": "Supervisor Operasional",
    "checklists": {
      "2*membersihkan smua unit DBtech dari deb": {
        "status": "OK",
        "notes": "Kondisi operasional normal"
      }
    },
    "_source": "google_sheet",
    "followUp": "Pengecekan selesai aman",
    "division": "Audio",
    "activity": "2*membersihkan smua unit DBtech dari debu",
    "_syncedAt": "2026-09-29T00:30:15.851Z",
    "result": "OK",
    "_syncMeta": {
      "updatedAt": "2026-09-29T12:57:51.079Z",
      "updatedBy": "BatchSync",
      "deviceOS": "Windows",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "date": "2026-09-03"
  },
  {
    "id": "log-gsheet-v2-2026-09-03-Muhamad_Rahmat-1__pengecekan_semua_unit_speke",
    "status": "Open",
    "staffName": "Muhamad Rahmat",
    "_source": "google_sheet",
    "followUp": "- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event.\n-Rekomendasi untuk di cek oleh team service terutama pada modul Amplifier dan pengecekan  spare-part Tweter",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "deviceType": "Desktop"
    },
    "verification": "Supervisor Operasional",
    "activity": "1. pengecekan semua unit speker DBTtech15, dengan mengunakan smartlive berdasarkan data reference unit yang sehat",
    "_syncedAt": "2026-09-29T01:44:35.597Z",
    "result": "NG",
    "checklists": {
      "1. pengecekan semua unit speker DBTtech1": {
        "notes": "- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event.\n-Rekomendasi untuk di cek oleh team service terutama pada modul Amplifier dan pengecekan  spare-part Tweter",
        "status": "NG"
      }
    },
    "division": "Audio",
    "date": "2026-09-03"
  },
  {
    "id": "log-gsheet-v2-2026-09-03-Muhamad_Rahmat-1_pengecekan_semua_unit_speker",
    "status": "Open",
    "staffName": "Muhamad Rahmat",
    "verification": "Supervisor Operasional",
    "checklists": {
      "1*pengecekan semua unit speker DBTtech15": {
        "notes": "- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event. Perlu pergantian sparepart tweteer segera",
        "status": "NG"
      }
    },
    "followUp": "- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event. Perlu pergantian sparepart tweteer segera",
    "_source": "google_sheet",
    "division": "Audio",
    "activity": "1*pengecekan semua unit speker DBTtech15, dengan mengunakan smartlive berdasarkan data reference unit yang sehat",
    "result": "NG",
    "_syncedAt": "2026-09-29T00:30:14.507Z",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "Windows",
      "updatedAt": "2026-09-29T12:57:51.079Z"
    },
    "date": "2026-09-03"
  },
  {
    "id": "log-20260904-buluk",
    "division": "Audio",
    "activity": "Pengecekan Panel 3 Unit",
    "staffName": "Suryana",
    "_source": "google_sheet",
    "result": "NG",
    "date": "2026-09-04",
    "checklists": {
      "Panel Listrik Audio": {
        "notes": "Ganti stop kontak & legrand cewek",
        "status": "NG"
      }
    },
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop"
    },
    "verification": "Supervisor Operasional",
    "followUp": "2 panel Sudah OK. 1 Ganti Stop Kontak, 1 Ganti Legran Cewe",
    "status": "Open"
  },
  {
    "id": "log-20260904-opik",
    "activity": "Pengecekan Panel 3 Unit",
    "date": "2026-09-04",
    "checklists": {
      "Panel Listrik Audio": {
        "notes": "Ganti stop kontak & legrand cewek",
        "status": "NG"
      }
    },
    "division": "Audio",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "staffName": "Taufik Diana",
    "verification": "Supervisor Operasional",
    "status": "Open",
    "followUp": "2 panel Sudah OK. 1 Ganti Stop Kontak, 1 Ganti Legran Cewe",
    "_source": "google_sheet",
    "result": "NG"
  },
  {
    "id": "log-20260904-opik-6-0",
    "result": "OK",
    "staffName": "Opik",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.059Z"
    },
    "_source": "google_sheet",
    "status": "Close",
    "verification": "Auto-Synced",
    "followUp": "- 2 panel Listrik 3 Phase Sudah OK",
    "date": "2026-09-04",
    "division": "Audio",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "activity": "- Pengecekan Panel 3 Unit"
  },
  {
    "id": "log-20260904-taufikdiana-5",
    "status": "Close",
    "division": "Audio",
    "verification": "Auto-Synced",
    "date": "2026-09-04",
    "activity": "- Pengecekan Panel 3 Unit",
    "result": "OK",
    "_source": "google_sheet",
    "staffName": "Taufik Diana",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "- 2 panel Listrik 3 Phase Sudah OK",
        "status": "OK"
      }
    },
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "followUp": "- 2 panel Listrik 3 Phase Sudah OK"
  },
  {
    "id": "log-gsheet-v2-2026-09-04-Taufik_Diana--_Pengecekan_Panel_3_Unit",
    "staffName": "Taufik Diana",
    "date": "2026-09-04",
    "followUp": "- 2 panel Listrik 3 Phase Sudah OK",
    "_source": "google_sheet",
    "result": "OK",
    "_syncedAt": "2026-09-29T01:44:37.350Z",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "verification": "Supervisor Operasional",
    "checklists": {
      "- Pengecekan Panel 3 Unit": {
        "status": "OK",
        "notes": "- 2 panel Listrik 3 Phase Sudah OK"
      }
    },
    "status": "Close",
    "division": "Audio",
    "activity": "- Pengecekan Panel 3 Unit"
  },
  {
    "id": "log-20260905-kharo",
    "result": "OK",
    "activity": "Repair/ perbaikan Ganti Pixel Kabinet LED 2 Box",
    "_source": "google_sheet",
    "division": "Service",
    "status": "Close",
    "followUp": "Repair pixel kabinet LED 2 box selesai aman",
    "verification": "Supervisor Operasional",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "checklists": {
      "Modul LED Kabinet": {
        "notes": "Pixel diganti normal",
        "status": "OK"
      }
    },
    "staffName": "Mulyana",
    "date": "2026-09-05"
  },
  {
    "id": "log-20260905-kharo-10-0",
    "activity": "- Repair/ perbaikan Ganti Pixel Kabinet LED 2 Box",
    "result": "OK",
    "date": "2026-09-05",
    "division": "Videotron",
    "_source": "google_sheet",
    "status": "Close",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "followUp": "selesai 2 box ( 16 Panel Cabinet)",
    "staffName": "Kharo",
    "verification": "Auto-Synced",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.059Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync"
    }
  },
  {
    "id": "log-20260905-mboh",
    "date": "2026-09-05",
    "activity": "Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire menggunakan Sub T45",
    "checklists": {
      "Panel Listrik": {
        "status": "OK",
        "notes": "Aman dan siap operasi"
      }
    },
    "division": "Audio",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "_source": "google_sheet",
    "followUp": "Panel listrik dalam kondisi aman dan bisa digunakan",
    "result": "OK",
    "staffName": "Muhamad Rahmat",
    "verification": "Supervisor Operasional",
    "status": "Close"
  },
  {
    "id": "log-20260905-mulyana-9",
    "verification": "Auto-Synced",
    "_source": "google_sheet",
    "followUp": "selesai 2 box ( 16 Panel Cabinet)",
    "date": "2026-09-05",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "selesai 2 box ( 16 Panel Cabinet)",
        "status": "OK"
      }
    },
    "staffName": "Mulyana",
    "division": "Service",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "result": "OK",
    "status": "Close",
    "activity": "- Repair/ perbaikan Ganti Pixel Kabinet LED 2 Box"
  },
  {
    "id": "log-20260905-opik",
    "followUp": "Panel listrik dalam kondisi aman dan bisa digunakan",
    "checklists": {
      "Panel Listrik": {
        "status": "OK",
        "notes": "Aman dan siap operasi"
      }
    },
    "date": "2026-09-05",
    "staffName": "Taufik Diana",
    "division": "Audio",
    "status": "Close",
    "verification": "Supervisor Operasional",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "result": "OK",
    "activity": "Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire menggunakan Sub T45"
  },
  {
    "id": "log-20260905-taufikdiana-7",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "- Semua Panel listrik dalam kondisi aman dan bisa di gunakan",
        "status": "OK"
      }
    },
    "date": "2026-09-05",
    "result": "OK",
    "status": "Close",
    "followUp": "- Semua Panel listrik dalam kondisi aman dan bisa di gunakan",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "verification": "Auto-Synced",
    "division": "Audio",
    "staffName": "Taufik Diana",
    "activity": "- Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire menggunakan Sub T45",
    "_source": "google_sheet"
  },
  {
    "id": "log-gsheet-v2-2026-09-05-Mulyana--_Repair__perbaikan_Ganti_Pixe",
    "_syncedAt": "2026-09-29T01:44:38.765Z",
    "_source": "google_sheet",
    "followUp": "selesai 2 box ( 16 Panel Cabinet)",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "verification": "Supervisor Operasional",
    "date": "2026-09-05",
    "result": "NG",
    "staffName": "Mulyana",
    "activity": "- Repair/ perbaikan Ganti Pixel Kabinet LED 2 Box",
    "division": "Videotron",
    "checklists": {
      "- Repair/ perbaikan Ganti Pixel Kabinet ": {
        "notes": "selesai 2 box ( 16 Panel Cabinet)",
        "status": "NG"
      }
    },
    "status": "Open"
  },
  {
    "id": "log-gsheet-v2-2026-09-05-Taufik_Diana--_Perbaikan_panel_listrik_dan_",
    "_source": "google_sheet",
    "staffName": "Taufik Diana",
    "result": "NG",
    "activity": "- Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire menggunakan Sub T45",
    "division": "Audio",
    "followUp": "- Semua Panel listrik dalam kondisi aman dan bisa di gunakan",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "_syncedAt": "2026-09-29T01:44:37.995Z",
    "date": "2026-09-05",
    "checklists": {
      "- Perbaikan panel listrik dan praktek pe": {
        "notes": "- Semua Panel listrik dalam kondisi aman dan bisa di gunakan",
        "status": "NG"
      }
    },
    "status": "Open",
    "verification": "Supervisor Operasional"
  },
  {
    "id": "log-20260906-dani",
    "checklists": {
      "Kabel XLR & Jack": {
        "status": "OK",
        "notes": "Kabel normal"
      }
    },
    "activity": "Cek cable XLR dan Jack to Jack",
    "verification": "Supervisor Operasional",
    "_source": "google_sheet",
    "division": "Audio",
    "date": "2026-09-06",
    "followUp": "Pengecekan kontinuitas dan fisik kabel XLR dan jack to jack selesai",
    "status": "Close",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:19.025Z"
    },
    "staffName": "Ramdani",
    "result": "OK"
  },
  {
    "id": "log-20260906-dani-12-0",
    "staffName": "Dani",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.059Z",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "deviceType": "Desktop"
    },
    "followUp": "",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "verification": "Auto-Synced",
    "date": "2026-09-06",
    "division": "Audio",
    "status": "Close",
    "_source": "google_sheet",
    "activity": "- Cek cable XLR dan Jack to Jack",
    "result": "OK"
  },
  {
    "id": "log-20260906-dediaguswigiantoro-11",
    "verification": "Auto-Synced",
    "division": "Videotron",
    "status": "Close",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:19.026Z"
    },
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box bersama tim LED",
    "result": "OK",
    "staffName": "Agus Wigi (Videotron)",
    "date": "2026-09-06",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "status": "OK",
        "notes": "selesai 2 box ( 16 Panel Cabinet)"
      }
    },
    "followUp": "selesai 2 box ( 16 Panel Cabinet)",
    "_source": "google_sheet"
  },
  {
    "id": "log-20260906-irvan-11-2",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "followUp": "selesai 2 box ( 16 Panel Cabinet)",
    "staffName": "Irvan",
    "_source": "google_sheet",
    "division": "Videotron",
    "result": "OK",
    "verification": "Auto-Synced",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.059Z"
    },
    "date": "2026-09-06",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "status": "Close"
  },
  {
    "id": "log-20260906-kharo",
    "staffName": "Mulyana",
    "division": "Service",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "checklists": {
      "Modul LED Kabinet": {
        "status": "OK",
        "notes": "2 box selesai repair"
      }
    },
    "activity": "Repair/ perbaikan ganti pixel kabinet led 2 box",
    "result": "OK",
    "_source": "google_sheet",
    "verification": "Supervisor Operasional",
    "date": "2026-09-06",
    "followUp": "Repair/ perbaikan ganti pixel kabinet led 2 box lanjutan selesai",
    "status": "Close"
  },
  {
    "id": "log-20260906-kharo-11-0",
    "status": "Close",
    "result": "OK",
    "followUp": "selesai 2 box ( 16 Panel Cabinet)",
    "_source": "google_sheet",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "verification": "Auto-Synced",
    "staffName": "Kharo",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.059Z",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS"
    },
    "division": "Videotron",
    "date": "2026-09-06",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box"
  },
  {
    "id": "log-20260906-muhamadirvan-12",
    "result": "OK",
    "followUp": "selesai 2 box ( 16 Panel Cabinet)",
    "status": "Close",
    "_source": "google_sheet",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "selesai 2 box ( 16 Panel Cabinet)",
        "status": "OK"
      }
    },
    "date": "2026-09-06",
    "verification": "Auto-Synced",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box bersama tim LED",
    "staffName": "Muhamad Irvan",
    "division": "Videotron"
  },
  {
    "id": "log-20260906-mulyana-10",
    "status": "Close",
    "result": "OK",
    "verification": "Auto-Synced",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "selesai 2 box ( 16 Panel Cabinet)",
        "status": "OK"
      }
    },
    "staffName": "Mulyana",
    "followUp": "selesai 2 box ( 16 Panel Cabinet)",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    },
    "division": "Service",
    "date": "2026-09-06",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "_source": "google_sheet"
  },
  {
    "id": "log-20260906-ramdani-13",
    "activity": "- Cek cable XLR dan Jack to Jack",
    "division": "Audio",
    "_source": "google_sheet",
    "followUp": "Kondisi kabel dicek dan dirapikan",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.723Z"
    },
    "result": "OK",
    "staffName": "Ramdani",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "status": "OK",
        "notes": "Kondisi kabel dicek dan dirapikan"
      }
    },
    "date": "2026-09-06",
    "status": "Close",
    "verification": "Auto-Synced"
  },
  {
    "id": "log-20260906-wigi-11-1",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.059Z",
      "deviceType": "Desktop"
    },
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "staffName": "Wigi",
    "_source": "google_sheet",
    "division": "Videotron",
    "date": "2026-09-06",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "followUp": "selesai 2 box ( 16 Panel Cabinet)",
    "status": "Close",
    "result": "OK",
    "verification": "Auto-Synced"
  },
  {
    "id": "log-gsheet-v2-2026-09-06-Dedi_Agus_Wigiantoro--_Repair__perbaikan_ganti_pixe",
    "followUp": "selesai 2 box ( 16 Panel Cabinet)",
    "staffName": "Dedi Agus Wigiantoro",
    "verification": "Supervisor Operasional",
    "_source": "google_sheet",
    "result": "NG",
    "checklists": {
      "- Repair/ perbaikan ganti pixel kabinet ": {
        "notes": "selesai 2 box ( 16 Panel Cabinet)",
        "status": "NG"
      }
    },
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "status": "Open",
    "_syncedAt": "2026-09-29T01:45:40.522Z",
    "date": "2026-09-06",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "division": "Videotron"
  },
  {
    "id": "log-gsheet-v2-2026-09-06-Muhamad_Irvan--_Repair__perbaikan_ganti_pixe",
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "division": "Videotron",
    "status": "Open",
    "staffName": "Muhamad Irvan",
    "_source": "google_sheet",
    "checklists": {
      "- Repair/ perbaikan ganti pixel kabinet ": {
        "status": "NG",
        "notes": "selesai 2 box ( 16 Panel Cabinet)"
      }
    },
    "date": "2026-09-06",
    "followUp": "selesai 2 box ( 16 Panel Cabinet)",
    "result": "NG",
    "_syncedAt": "2026-09-29T01:44:40.545Z",
    "verification": "Supervisor Operasional",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T22:43:01.722Z"
    }
  },
  {
    "id": "log-gsheet-v2-2026-09-06-Mulyana--_Repair__perbaikan_ganti_pixe",
    "followUp": "selesai 2 box ( 16 Panel Cabinet)",
    "status": "Open",
    "_source": "google_sheet",
    "checklists": {
      "- Repair/ perbaikan ganti pixel kabinet ": {
        "notes": "selesai 2 box ( 16 Panel Cabinet)",
        "status": "NG"
      }
    },
    "staffName": "Mulyana",
    "result": "NG",
    "date": "2026-09-06",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "activity": "- Repair/ perbaikan ganti pixel kabinet led 2 box",
    "verification": "Supervisor Operasional",
    "_syncedAt": "2026-09-29T01:44:39.341Z",
    "division": "Videotron"
  },
  {
    "id": "log-gsheet-v2-2026-09-06-Ramdani--_Cek_cable_XLR_dan_Jack_to_Ja",
    "date": "2026-09-06",
    "followUp": "Pengecekan selesai",
    "staffName": "Ramdani",
    "verification": "Supervisor Operasional",
    "_source": "google_sheet",
    "result": "OK",
    "_syncedAt": "2026-09-29T01:44:41.460Z",
    "division": "Audio",
    "_syncMeta": {
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    },
    "status": "Close",
    "checklists": {
      "- Cek cable XLR dan Jack to Jack": {
        "status": "OK",
        "notes": "Kondisi operasional normal"
      }
    },
    "activity": "- Cek cable XLR dan Jack to Jack"
  },
  {
    "id": "log-20260907-heri",
    "status": "Open",
    "date": "2026-09-07",
    "followUp": "Harus service warm mati no 12,25,29 | Warm Separo no 3,32",
    "result": "NG",
    "checklists": {
      "PAR LED Warm White": {
        "status": "NG",
        "notes": "Warm mati 12,25,29 separo 3,32"
      }
    },
    "division": "Lighting",
    "verification": "Supervisor Operasional",
    "activity": "Cek unit, Cleaning, Cek Colour Parled",
    "staffName": "Heri",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-20260907-heri-13-0",
    "activity": "Cek unit, Cleaning, Cek Colour Parled",
    "_source": "google_sheet",
    "date": "2026-09-07",
    "staffName": "Heri",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.060Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync"
    },
    "division": "Lighting",
    "status": "Close",
    "followUp": "Harus service warm mati no 12,25,29 | Warm Separo no 3,32",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "verification": "Auto-Synced",
    "result": "OK"
  },
  {
    "id": "log-20260907-heri-14",
    "staffName": "Heri",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.723Z"
    },
    "status": "Open",
    "result": "NG",
    "followUp": "Harus service warm mati no 12,25,29 | Warm Separo no 3,32",
    "division": "Lighting",
    "verification": "Auto-Synced",
    "activity": "Cek unit, Cleaning, Cek Colour Parled",
    "_source": "google_sheet",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "status": "NG",
        "notes": "Harus service warm mati no 12,25,29 | Warm Separo no 3,32"
      }
    },
    "date": "2026-09-07"
  },
  {
    "id": "log-gsheet-v2-2026-09-07-Heri-Cek_unit__Cleaning__Cek_Colour",
    "followUp": "Harus service warm mati no 12,25,29 | Warm Separo no 3,32",
    "_source": "google_sheet",
    "staffName": "Heri",
    "verification": "Supervisor Operasional",
    "result": "NG",
    "date": "2026-09-07",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.722Z"
    },
    "_syncedAt": "2026-09-29T01:44:42.103Z",
    "status": "Open",
    "activity": "Cek unit, Cleaning, Cek Colour Parled",
    "checklists": {
      "Cek unit, Cleaning, Cek Colour Parled": {
        "notes": "Harus service warm mati no 12,25,29 | Warm Separo no 3,32",
        "status": "NG"
      }
    },
    "division": "Lighting"
  },
  {
    "id": "log-20260909-ayong",
    "status": "Close",
    "activity": "Repair dead pixel 1 box, Copot Masking 7 box",
    "date": "2026-09-09",
    "checklists": {
      "LED Kabinet": {
        "notes": "QC selesai normal",
        "status": "OK"
      }
    },
    "result": "OK",
    "division": "Videotron",
    "_source": "google_sheet",
    "followUp": "Supervisi modul LED kabinet selesai",
    "staffName": "Ayong Sumarsih",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:19.025Z"
    },
    "verification": "Supervisor Operasional"
  },
  {
    "id": "log-20260909-buluk",
    "status": "Close",
    "activity": "Perbaikan/ Service Mandiri : 1. Kabel snake 8 ch 2. Kabel snake 16 ch 3. Kabel rumbay drum 8 ch 4. Cek Mic EWD/ Ganti Spul",
    "checklists": {
      "Kabel Snake & Mic": {
        "notes": "Service mandiri selesai",
        "status": "OK"
      }
    },
    "date": "2026-09-09",
    "result": "OK",
    "division": "Audio",
    "_source": "google_sheet",
    "followUp": "Perbaikan mandiri kabel audio dan spul mic selesai aman",
    "staffName": "Suryana",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "verification": "Supervisor Operasional"
  },
  {
    "id": "log-20260909-buluk-17-0",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "activity": "- Perbaikan/ Service Mandiri :\n1. Kabel snake 8 ch \n2. Kabel snake 16 ch \n3. Kabel rumbay drum 8 ch\n4. Cek Mic EWD/ Ganti Spul",
    "result": "OK",
    "verification": "Auto-Synced",
    "_source": "google_sheet",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.060Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync"
    },
    "staffName": "Buluk",
    "status": "Close",
    "division": "Audio",
    "followUp": "- Semua selesai dan dapat di gunakan",
    "date": "2026-09-09"
  },
  {
    "id": "log-20260909-butong",
    "followUp": "Perbaikan mandiri kabel audio dan spul mic selesai aman",
    "division": "Audio",
    "staffName": "Iwan Kurniawan",
    "date": "2026-09-09",
    "verification": "Supervisor Operasional",
    "status": "Close",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:19.025Z"
    },
    "result": "OK",
    "activity": "Perbaikan/ Service Mandiri : 1. Kabel snake 8 ch 2. Kabel snake 16 ch 3. Kabel rumbay drum 8 ch 4. Cek Mic EWD/ Ganti Spul",
    "checklists": {
      "Kabel Snake & Mic": {
        "notes": "Service mandiri selesai",
        "status": "OK"
      }
    }
  },
  {
    "id": "log-20260909-dani",
    "activity": "Perbaikan/ Service Mandiri : 1. Kabel snake 8 ch 2. Kabel snake 16 ch 3. Kabel rumbay drum 8 ch 4. Cek Mic EWD/ Ganti Spul",
    "checklists": {
      "Kabel Snake & Mic": {
        "notes": "Service mandiri selesai",
        "status": "OK"
      }
    },
    "division": "Audio",
    "result": "OK",
    "_source": "google_sheet",
    "followUp": "Perbaikan mandiri kabel audio dan spul mic selesai aman",
    "date": "2026-09-09",
    "verification": "Supervisor Operasional",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "deviceType": "Desktop"
    },
    "status": "Close",
    "staffName": "Ramdani"
  },
  {
    "id": "log-20260909-kharo",
    "verification": "Supervisor Operasional",
    "division": "Service",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "checklists": {
      "LED Kabinet": {
        "notes": "Dead pixel & masking tuntas",
        "status": "OK"
      }
    },
    "staffName": "Mulyana",
    "date": "2026-09-09",
    "activity": "Repair dead pixel 1 box, Copot Masking 7 box",
    "_source": "google_sheet",
    "result": "OK",
    "followUp": "Repair dead pixel 1 box, Copot Masking 7 box selesai",
    "status": "Close"
  },
  {
    "id": "log-20260909-kharo-14-0",
    "result": "OK",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "followUp": "selesai 1 box ( 8 Panel Cabinet ) ",
    "staffName": "Kharo",
    "status": "Close",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.060Z"
    },
    "date": "2026-09-09",
    "division": "Videotron",
    "verification": "Auto-Synced",
    "_source": "google_sheet",
    "activity": "- Repair dead pixel 1 box\n- Copot Masking 7 box"
  },
  {
    "id": "log-20260909-mulyana-15",
    "result": "OK",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "selesai 1 box ( 8 Panel Cabinet )",
        "status": "OK"
      }
    },
    "_source": "google_sheet",
    "followUp": "selesai 1 box ( 8 Panel Cabinet )",
    "status": "Close",
    "date": "2026-09-09",
    "division": "Service",
    "verification": "Auto-Synced",
    "staffName": "Mulyana",
    "activity": "- Repair dead pixel 1 box\n- Copot Masking 7 box",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "browser": "Chrome"
    }
  },
  {
    "id": "log-20260909-opik",
    "result": "OK",
    "checklists": {
      "Kabel Snake & Mic": {
        "status": "OK",
        "notes": "Service mandiri selesai"
      }
    },
    "followUp": "Perbaikan mandiri kabel audio dan spul mic selesai aman",
    "_source": "google_sheet",
    "status": "Close",
    "division": "Audio",
    "date": "2026-09-09",
    "verification": "Supervisor Operasional",
    "staffName": "Taufik Diana",
    "activity": "Perbaikan/ Service Mandiri : 1. Kabel snake 8 ch 2. Kabel snake 16 ch 3. Kabel rumbay drum 8 ch 4. Cek Mic EWD/ Ganti Spul",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "deviceOS": "macOS"
    }
  },
  {
    "id": "log-20260909-suryana-18",
    "verification": "Auto-Synced",
    "staffName": "Suryana",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "deviceType": "Desktop"
    },
    "result": "OK",
    "status": "Close",
    "followUp": "- Semua selesai dan dapat di gunakan",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "- Semua selesai dan dapat di gunakan",
        "status": "OK"
      }
    },
    "date": "2026-09-09",
    "division": "Audio",
    "_source": "google_sheet",
    "activity": "- Perbaikan/ Service Mandiri : 1. Kabel snake 8 ch 2. Kabel snake 16 ch 3. Kabel rumbay drum 8 ch 4. Cek Mic EWD/ Ganti Spul"
  },
  {
    "id": "log-20260909-wigi",
    "followUp": "Repair dead pixel 1 box, Copot Masking 7 box selesai",
    "status": "Close",
    "result": "OK",
    "_source": "google_sheet",
    "activity": "Repair dead pixel 1 box, Copot Masking 7 box",
    "verification": "Supervisor Operasional",
    "checklists": {
      "LED Kabinet": {
        "notes": "Selesai copot masking",
        "status": "OK"
      }
    },
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "browser": "Chrome"
    },
    "division": "Videotron",
    "staffName": "Agus Wigi (Videotron)",
    "date": "2026-09-09"
  },
  {
    "id": "log-gsheet-v2-2026-09-09-Ayong_Sumarsih--_Repair_dead_pixel_1_box_-_Co",
    "followUp": "AMAN BISA DI GUNAKAN",
    "_source": "google_sheet",
    "result": "OK",
    "staffName": "Ayong Sumarsih",
    "verification": "Supervisor Operasional",
    "date": "2026-09-09",
    "division": "Videotron",
    "checklists": {
      "- Repair dead pixel 1 box\n- Copot Maskin": {
        "status": "OK",
        "notes": "AMAN BISA DI GUNAKAN"
      }
    },
    "status": "Close",
    "_syncedAt": "2026-09-29T00:30:07.415Z",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "User",
      "updatedAt": "2026-09-29T00:30:09.473Z",
      "deviceOS": "Windows",
      "browser": "Chrome"
    },
    "activity": "- Repair dead pixel 1 box\n- Copot Masking 7 box"
  },
  {
    "id": "log-gsheet-v2-2026-09-09-Iwan_Kurniawan--_Perbaikan__Service_Mandiri__",
    "date": "2026-09-09",
    "status": "Close",
    "followUp": "- mic wireless EWD udah bisa di gunakan kembali\n- kabel Snake sudah bisa di gunakan",
    "_syncMeta": {
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-09-29T00:30:16.466Z",
      "updatedBy": "User",
      "deviceOS": "Windows"
    },
    "_syncedAt": "2026-09-29T00:30:15.783Z",
    "division": "Audio",
    "activity": "- Perbaikan/ Service Mandiri :\n1. Kabel snake 8 ch \n2. Kabel snake 16 ch \n3. Kabel rumbay drum 8 ch\n4. Cek Mic EWD\n5. Ganti Spul Mic EWD",
    "verification": "Supervisor Operasional",
    "_source": "google_sheet",
    "checklists": {
      "- Perbaikan/ Service Mandiri :\n1. Kabel ": {
        "notes": "- mic wireless EWD udah bisa di gunakan kembali\n- kabel Snake sudah bisa di gunakan",
        "status": "OK"
      }
    },
    "staffName": "Iwan Kurniawan",
    "result": "OK"
  },
  {
    "id": "log-gsheet-v2-2026-09-09-Mulyana--_Repair_dead_pixel_1_box_-_Co",
    "date": "2026-09-09",
    "_syncedAt": "2026-09-29T01:44:43.229Z",
    "followUp": "selesai 1 box ( 8 Panel Cabinet ) ",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "deviceOS": "macOS"
    },
    "status": "Open",
    "checklists": {
      "- Repair dead pixel 1 box\n- Copot Maskin": {
        "notes": "selesai 1 box ( 8 Panel Cabinet ) ",
        "status": "NG"
      }
    },
    "staffName": "Mulyana",
    "verification": "Supervisor Operasional",
    "result": "NG",
    "activity": "- Repair dead pixel 1 box\n- Copot Masking 7 box",
    "division": "Videotron"
  },
  {
    "id": "log-gsheet-v2-2026-09-09-Ramdani--_Perbaikan__Service_Mandiri__",
    "followUp": "- mic wireless EWD udah bisa di gunakan kembali\n- kabel Snake sudah bisa di gunakan",
    "_source": "google_sheet",
    "staffName": "Ramdani",
    "status": "Close",
    "verification": "Supervisor Operasional",
    "date": "2026-09-09",
    "checklists": {
      "- Perbaikan/ Service Mandiri :\n1. Kabel ": {
        "notes": "- mic wireless EWD udah bisa di gunakan kembali\n- kabel Snake sudah bisa di gunakan",
        "status": "OK"
      }
    },
    "_syncMeta": {
      "updatedAt": "2026-09-29T00:30:17.998Z",
      "browser": "Chrome",
      "deviceOS": "Windows",
      "deviceType": "Desktop",
      "updatedBy": "User"
    },
    "result": "OK",
    "_syncedAt": "2026-09-29T00:30:17.285Z",
    "activity": "- Perbaikan/ Service Mandiri :\n1. Kabel snake 8 ch \n2. Kabel snake 16 ch \n3. Kabel rumbay drum 8 ch\n4. Cek Mic EWD\n5. Ganti Spul Mic EWD",
    "division": "Audio"
  },
  {
    "id": "log-gsheet-v2-2026-09-09-Suryana--_Perbaikan__Service_Mandiri__",
    "followUp": "- Semua selesai dan dapat di gunakan",
    "checklists": {
      "- Perbaikan/ Service Mandiri :\n1. Kabel ": {
        "status": "NG",
        "notes": "- Semua selesai dan dapat di gunakan"
      }
    },
    "staffName": "Suryana",
    "status": "Open",
    "_source": "google_sheet",
    "verification": "Supervisor Operasional",
    "result": "NG",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "browser": "Chrome"
    },
    "_syncedAt": "2026-09-29T01:44:44.106Z",
    "activity": "- Perbaikan/ Service Mandiri :\n1. Kabel snake 8 ch \n2. Kabel snake 16 ch \n3. Kabel rumbay drum 8 ch\n4. Cek Mic EWD/ Ganti Spul",
    "date": "2026-09-09",
    "division": "Audio"
  },
  {
    "id": "log-gsheet-v2-2026-09-09-Taufik_Diana--_Perbaikan__Service_Mandiri__",
    "activity": "- Perbaikan/ Service Mandiri :\n1. Kabel snake 8 ch \n2. Kabel snake 16 ch \n3. Kabel rumbay drum 8 ch\n4. Cek Mic EWD\n5. Ganti Spul Mic EWD",
    "division": "Audio",
    "status": "Close",
    "_syncMeta": {
      "updatedAt": "2026-09-29T00:30:15.071Z",
      "deviceOS": "Windows",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "User"
    },
    "_syncedAt": "2026-09-29T00:30:14.439Z",
    "date": "2026-09-09",
    "_source": "google_sheet",
    "followUp": "- mic wireless EWD udah bisa di gunakan kembali\n- kabel Snake sudah bisa di gunakan",
    "checklists": {
      "- Perbaikan/ Service Mandiri :\n1. Kabel ": {
        "status": "OK",
        "notes": "- mic wireless EWD udah bisa di gunakan kembali\n- kabel Snake sudah bisa di gunakan"
      }
    },
    "verification": "Supervisor Operasional",
    "staffName": "Taufik Diana",
    "result": "OK"
  },
  {
    "id": "log-20260910-heri",
    "division": "Lighting",
    "activity": "Cek Unit, Cleaning, Cek colour, Perbaikan kabel link : - Beam 450 (9 bok / 18 Unit) - BSW 550 (6 bok / 12 Unit) - B-Eye (4 bok / 8 Unit)",
    "date": "2026-09-10",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "staffName": "Heri",
    "result": "NG",
    "status": "Open",
    "verification": "Supervisor Operasional",
    "checklists": {
      "Parled Warm Separo": {
        "status": "NG",
        "notes": "Unit 19, 20, 27 separo"
      },
      "Beam, BSW, B-Eye & XLR": {
        "notes": "Kabel link selesai service",
        "status": "OK"
      }
    },
    "followUp": "Parled : Harus service warm separo no. 19,20,27. XLR (Link) : Sudah service"
  },
  {
    "id": "log-20260910-heri-21-0",
    "followUp": "",
    "_source": "google_sheet",
    "date": "2026-09-10",
    "verification": "Auto-Synced",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.060Z"
    },
    "staffName": "Heri",
    "result": "OK",
    "activity": "Cek Unit, Cleaning, Cek colour, Perbaikan kabel  link :\n- Beam 450 (9 bok / 18 Unit)\n- BSW 550 (6 bok / 12 Unit)\n- B-Eye (4 bok / 8 Unit)",
    "status": "Close",
    "division": "Lighting"
  },
  {
    "id": "log-20260910-heri-22",
    "verification": "Auto-Synced",
    "followUp": "- Parled: Harus service warm separo no. 19,20,27\n- XLR (Link): Sudah service",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T22:43:01.723Z"
    },
    "date": "2026-09-10",
    "staffName": "Heri",
    "status": "Close",
    "activity": "Cek Unit, Cleaning, Cek colour, Perbaikan kabel link : Beam 450 (9 bok / 18 Unit), BSW 550 (6 bok / 12 Unit), B-Eye (4 bok / 8 Unit), Parled, XLR Link",
    "division": "Lighting",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "- Parled: Harus service warm separo no. 19,20,27\n- XLR (Link): Sudah service",
        "status": "OK"
      }
    },
    "result": "OK"
  },
  {
    "id": "log-20260910-mboh",
    "verification": "Supervisor Operasional",
    "followUp": "unit dalam klondisi aman tida ada kendala",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:19.025Z"
    },
    "date": "2026-09-10",
    "staffName": "Muhamad Rahmat",
    "status": "Close",
    "activity": "- ngulik fitur DLMS marani MIR480I dan MIR480A\n- CALIBRASI MIC RTA BEHRINGER ECM8000\n- revisi pemasangan BEHRINGER ULTRA LINK",
    "division": "Audio",
    "checklists": {
      "DLMS & Mic RTA": {
        "notes": "Kalibrasi aman",
        "status": "OK"
      }
    },
    "result": "OK"
  },
  {
    "id": "log-20260910-muhamadrahmat-23",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "unit dalam kondisi aman tidak ada kendala",
        "status": "NG"
      }
    },
    "division": "Audio",
    "verification": "Auto-Synced",
    "date": "2026-09-10",
    "staffName": "Muhamad Rahmat",
    "activity": "-ngulik fitur DLMS marani MIR480I dan MIR480A\n-CALIBRASI MIC RTA BEHRINGER ECM8000\n-revisi pemasangan BEHRINGER ULTRA LINK",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "_source": "google_sheet",
    "result": "NG",
    "status": "Open",
    "followUp": "unit dalam kondisi aman tidak ada kendala"
  },
  {
    "id": "log-gsheet-v2-2026-09-10-Heri--_Parled",
    "staffName": "Heri",
    "division": "Lighting",
    "status": "Open",
    "_source": "google_sheet",
    "activity": "- Parled",
    "followUp": "- Harus service warm separo no. 19,20,27",
    "date": "2026-09-10",
    "checklists": {
      "- Parled": {
        "status": "NG",
        "notes": "- Harus service warm separo no. 19,20,27"
      }
    },
    "_syncedAt": "2026-09-29T01:32:28.535Z",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "verification": "Supervisor Operasional",
    "result": "NG"
  },
  {
    "id": "log-gsheet-v2-2026-09-10-Heri--_XLR__Link_",
    "_source": "google_sheet",
    "followUp": "- Sudah service",
    "verification": "Supervisor Operasional",
    "staffName": "Heri",
    "result": "NG",
    "checklists": {
      "- XLR (Link)": {
        "status": "NG",
        "notes": "- Sudah service"
      }
    },
    "date": "2026-09-10",
    "activity": "- XLR (Link)",
    "division": "Lighting",
    "status": "Open",
    "_syncedAt": "2026-09-29T01:32:29.267Z",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop"
    }
  },
  {
    "id": "log-gsheet-v2-2026-09-10-Heri-Cek_Unit__Cleaning__Cek_colour",
    "checklists": {
      "Cek Unit, Cleaning, Cek colour, Perbaika": {
        "status": "NG",
        "notes": "Kendala operasional terdeteksi"
      }
    },
    "staffName": "Heri",
    "followUp": "Perlu perbaikan teknis",
    "result": "NG",
    "division": "Lighting",
    "date": "2026-09-10",
    "_syncedAt": "2026-09-29T01:44:44.854Z",
    "activity": "Cek Unit, Cleaning, Cek colour, Perbaikan kabel  link :\n- Beam 450 (9 bok / 18 Unit)\n- BSW 550 (6 bok / 12 Unit)\n- B-Eye (4 bok / 8 Unit)",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "verification": "Supervisor Operasional",
    "status": "Open",
    "_source": "google_sheet"
  },
  {
    "id": "log-gsheet-v2-2026-09-10-Muhamad_Rahmat--_ngulik_fitur_DLMS_marani_MIR",
    "division": "Audio",
    "activity": "- ngulik fitur DLMS marani MIR480I dan MIR480A\n- CALIBRASI MIC RTA BEHRINGER ECM8000\n- revisi pemasangan BEHRINGER ULTRA LINK",
    "checklists": {
      "- ngulik fitur DLMS marani MIR480I dan M": {
        "status": "OK",
        "notes": "unit dalam kondisi aman tidak  ada kendala"
      }
    },
    "result": "OK",
    "_syncMeta": {
      "deviceOS": "Windows",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "User",
      "updatedAt": "2026-09-29T00:30:24.327Z"
    },
    "_syncedAt": "2026-09-29T00:30:23.644Z",
    "date": "2026-09-10",
    "verification": "Supervisor Operasional",
    "_source": "google_sheet",
    "status": "Close",
    "followUp": "unit dalam kondisi aman tidak  ada kendala",
    "staffName": "Muhamad Rahmat"
  },
  {
    "id": "log-gsheet-v2-2026-09-10-Muhamad_Rahmat--CALIBRASI_MIC_RTA_BEHRINGER_E",
    "result": "OK",
    "_syncedAt": "2026-09-29T01:32:30.249Z",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "checklists": {
      "-CALIBRASI MIC RTA BEHRINGER ECM8000": {
        "notes": "Kondisi operasional normal",
        "status": "OK"
      }
    },
    "division": "Audio",
    "activity": "-CALIBRASI MIC RTA BEHRINGER ECM8000",
    "staffName": "Muhamad Rahmat",
    "verification": "Supervisor Operasional",
    "status": "Close",
    "followUp": "",
    "date": "2026-09-10",
    "_source": "google_sheet"
  },
  {
    "id": "log-gsheet-v2-2026-09-10-Muhamad_Rahmat--ngulik_fitur_DLMS_marani_MIR4",
    "followUp": "unit dalam kondisi aman tidak ada kendala",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.721Z"
    },
    "checklists": {
      "-ngulik fitur DLMS marani MIR480I dan MI": {
        "notes": "unit dalam kondisi aman tidak ada kendala",
        "status": "OK"
      }
    },
    "_syncedAt": "2026-09-29T01:45:44.104Z",
    "verification": "Supervisor Operasional",
    "status": "Close",
    "_source": "google_sheet",
    "result": "OK",
    "staffName": "Muhamad Rahmat",
    "date": "2026-09-10",
    "activity": "-ngulik fitur DLMS marani MIR480I dan MIR480A",
    "division": "Audio"
  },
  {
    "id": "log-gsheet-v2-2026-09-10-Muhamad_Rahmat--revisi_pemasangan_BEHRINGER_U",
    "result": "OK",
    "_source": "google_sheet",
    "staffName": "Muhamad Rahmat",
    "followUp": "",
    "checklists": {
      "-revisi pemasangan BEHRINGER ULTRA LINK": {
        "notes": "Kondisi operasional normal",
        "status": "OK"
      }
    },
    "date": "2026-09-10",
    "activity": "-revisi pemasangan BEHRINGER ULTRA LINK",
    "status": "Close",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T22:43:01.723Z"
    },
    "division": "Audio",
    "_syncedAt": "2026-09-29T01:32:30.771Z",
    "verification": "Supervisor Operasional"
  },
  {
    "id": "log-20260911-buluk",
    "checklists": {
      "Drum Kit & Stand Mic": {
        "notes": "Kondisi siap pakai",
        "status": "OK"
      }
    },
    "result": "OK",
    "verification": "Supervisor Operasional",
    "followUp": "Pemasangan skindrum dan fitting stand mic selesai",
    "status": "Close",
    "division": "Audio",
    "_source": "google_sheet",
    "date": "2026-09-11",
    "staffName": "Suryana",
    "activity": "- ganti skindrum tama celasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase untuk stand mic yang baru",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "deviceType": "Desktop"
    }
  },
  {
    "id": "log-20260911-buluk-27-1",
    "staffName": "buluk",
    "division": "Audio",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.061Z"
    },
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat",
    "_source": "google_sheet",
    "result": "OK",
    "verification": "Auto-Synced",
    "date": "2026-09-11",
    "followUp": "selesai dengan baik dan sudah bisa di gunakan",
    "status": "Close"
  },
  {
    "id": "log-20260911-suryana-25",
    "status": "Close",
    "date": "2026-09-11",
    "result": "OK",
    "followUp": "selesai dengan baik dan sudah bisa di gunakan",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "status": "OK",
        "notes": "selesai dengan baik dan sudah bisa di gunakan"
      }
    },
    "staffName": "Suryana",
    "division": "Audio",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat",
    "_source": "google_sheet",
    "verification": "Auto-Synced"
  },
  {
    "id": "log-20260911-unyim",
    "division": "Audio",
    "activity": "- ganti skindrum tama celasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase untuk stand mic yang baru",
    "checklists": {
      "Drum Kit & Stand Mic": {
        "notes": "Kondisi siap pakai",
        "status": "OK"
      }
    },
    "staffName": "Wahyudin (Audio)",
    "_source": "google_sheet",
    "status": "Close",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:19.025Z",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "verification": "Supervisor Operasional",
    "result": "OK",
    "followUp": "Pemasangan skindrum dan fitting stand mic selesai",
    "date": "2026-09-11"
  },
  {
    "id": "log-20260911-unyim-27-0",
    "status": "Close",
    "followUp": "selesai dengan baik dan sudah bisa di gunakan",
    "date": "2026-09-11",
    "result": "OK",
    "verification": "Auto-Synced",
    "_source": "google_sheet",
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat",
    "division": "Audio",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "staffName": "unyim",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.061Z"
    }
  },
  {
    "id": "log-20260911-wahyudin-24",
    "_source": "google_sheet",
    "staffName": "Wahyudin",
    "division": "Audio",
    "verification": "Auto-Synced",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    },
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "status": "OK",
        "notes": "selesai dengan baik dan sudah bisa di gunakan"
      }
    },
    "result": "OK",
    "followUp": "selesai dengan baik dan sudah bisa di gunakan",
    "date": "2026-09-11",
    "status": "Close"
  },
  {
    "id": "log-gsheet-v2-2026-09-11-Suryana--_ganti_skindrum_tama_celasic_",
    "division": "Audio",
    "date": "2026-09-11",
    "activity": "- ganti skindrum tama celasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase untuk stand mic yang baru",
    "status": "Close",
    "checklists": {
      "- ganti skindrum tama celasic\n- cek mic ": {
        "status": "OK",
        "notes": "selesai dan bisa di gunakan kembali"
      }
    },
    "staffName": "Suryana",
    "result": "OK",
    "verification": "Supervisor Operasional",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "User",
      "deviceOS": "Windows",
      "deviceType": "Desktop",
      "updatedAt": "2026-09-29T00:30:27.151Z"
    },
    "_source": "google_sheet",
    "followUp": "selesai dan bisa di gunakan kembali",
    "_syncedAt": "2026-09-29T00:30:26.315Z"
  },
  {
    "id": "log-gsheet-v2-2026-09-11-Suryana--_ganti_skindrum_tama_star_cla",
    "verification": "Supervisor Operasional",
    "_source": "google_sheet",
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat",
    "division": "Audio",
    "checklists": {
      "- ganti skindrum tama star clasic\n- cek ": {
        "status": "NG",
        "notes": "selesai dengan baik dan sudah bisa di gunakan"
      }
    },
    "result": "NG",
    "staffName": "Suryana",
    "date": "2026-09-11",
    "followUp": "selesai dengan baik dan sudah bisa di gunakan",
    "status": "Open",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "_syncedAt": "2026-09-29T01:44:47.342Z"
  },
  {
    "id": "log-gsheet-v2-2026-09-11-Wahyudin__Audio_--_ganti_skindrum_tama_celasic_",
    "followUp": "selesai dan bisa di gunakan kembali",
    "staffName": "Wahyudin (Audio)",
    "date": "2026-09-11",
    "verification": "Supervisor Operasional",
    "status": "Close",
    "checklists": {
      "- ganti skindrum tama celasic\n- cek mic ": {
        "notes": "selesai dan bisa di gunakan kembali",
        "status": "OK"
      }
    },
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedBy": "User",
      "deviceOS": "Windows",
      "updatedAt": "2026-09-29T00:30:25.755Z",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "_syncedAt": "2026-09-29T00:30:25.138Z",
    "result": "OK",
    "activity": "- ganti skindrum tama celasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase untuk stand mic yang baru",
    "division": "Audio"
  },
  {
    "id": "log-gsheet-v2-2026-09-11-Wahyudin--_ganti_skindrum_tama_star_cla",
    "result": "NG",
    "date": "2026-09-11",
    "verification": "Supervisor Operasional",
    "division": "Audio",
    "staffName": "Wahyudin",
    "activity": "- ganti skindrum tama star clasic\n- cek mic baru drum sennheiser 3pcs\n- membuat lubang pada tripot untuk sub db\n- memasukan standmic ke hardcase yang baru di buat",
    "status": "Open",
    "followUp": "selesai dengan baik dan sudah bisa di gunakan",
    "_source": "google_sheet",
    "_syncedAt": "2026-09-29T01:44:46.871Z",
    "checklists": {
      "- ganti skindrum tama star clasic\n- cek ": {
        "notes": "selesai dengan baik dan sudah bisa di gunakan",
        "status": "NG"
      }
    },
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    }
  },
  {
    "id": "log-20260912-heri-26",
    "_source": "google_sheet",
    "verification": "Auto-Synced",
    "followUp": "Mixer Tiger Touch: Normal, Stromy: Bersih Normal, Freshnell: Normal, Blinder: Bersih Normal, Parled: Bersih / No. 13 Harus Servic (Merah Mati)",
    "division": "Lighting",
    "staffName": "Heri",
    "date": "2026-09-12",
    "status": "Open",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "Mixer Tiger Touch: Normal, Stromy: Bersih Normal, Freshnell: Normal, Blinder: Bersih Normal, Parled: Bersih / No. 13 Harus Servic (Merah Mati)",
        "status": "NG"
      }
    },
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:19.027Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "result": "NG",
    "activity": "Cek Unit, Cleaning, Cek Colour Parled: Cek Mixer Tiger Touch, Cleaning All Stromy, Cleaning All Freshnell 300 w, Cleaning All blinder 4Cell, Cleaning Parled No. 11,13,14,15,16,17"
  },
  {
    "id": "log-20260912-heri-28-0",
    "activity": "Cek Unit, Cleaning, Cek Colour Parled",
    "_source": "google_sheet",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "division": "Lighting",
    "verification": "Auto-Synced",
    "followUp": "",
    "status": "Close",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.061Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync"
    },
    "result": "OK",
    "staffName": "Heri",
    "date": "2026-09-12"
  },
  {
    "id": "log-20260912-heri-29-0",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "activity": "- Cek Mixer Tiger Touch",
    "_source": "google_sheet",
    "division": "Lighting",
    "verification": "Auto-Synced",
    "date": "2026-09-12",
    "followUp": "Kondisi Normal",
    "status": "Close",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.061Z",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "staffName": "Heri",
    "result": "OK"
  },
  {
    "id": "log-20260912-heri-30-0",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "date": "2026-09-12",
    "verification": "Auto-Synced",
    "followUp": "Kondisi Bersih Normal",
    "division": "Lighting",
    "_source": "google_sheet",
    "result": "OK",
    "status": "Close",
    "staffName": "Heri",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.062Z"
    },
    "activity": "- Cleaning All Stromy"
  },
  {
    "id": "log-20260912-heri-31-0",
    "status": "Close",
    "date": "2026-09-12",
    "verification": "Auto-Synced",
    "result": "OK",
    "followUp": "Kondisi Normal",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.062Z",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "division": "Lighting",
    "staffName": "Heri",
    "activity": "- Cleaning All Freshnell 300 w",
    "_source": "google_sheet"
  },
  {
    "id": "log-20260912-heri-32-0",
    "staffName": "Heri",
    "status": "Close",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.062Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop"
    },
    "result": "OK",
    "followUp": "Kondisi Bersih Normal",
    "date": "2026-09-12",
    "division": "Lighting",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "activity": "- Cleaning All blinder 4Cell",
    "verification": "Auto-Synced",
    "_source": "google_sheet"
  },
  {
    "id": "log-20260912-heri-33-0",
    "followUp": "Kondisi Bersih I No. 13 Harus Servic ( Merah Mati )",
    "date": "2026-09-12",
    "verification": "Auto-Synced",
    "status": "Close",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.062Z",
      "deviceType": "Desktop"
    },
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "activity": "- Cleaning Parled No. 11,13,14,15,16,17",
    "staffName": "Heri",
    "_source": "google_sheet",
    "division": "Lighting",
    "result": "OK"
  },
  {
    "id": "log-gsheet-v2-2026-09-12-Heri--_Cek_Mixer_Tiger_Touch",
    "status": "Close",
    "staffName": "Heri",
    "verification": "Supervisor Operasional",
    "checklists": {
      "- Cek Mixer Tiger Touch": {
        "notes": "Kondisi Normal",
        "status": "OK"
      }
    },
    "followUp": "Kondisi Normal",
    "division": "Lighting",
    "activity": "- Cek Mixer Tiger Touch",
    "date": "2026-09-12",
    "_syncedAt": "2026-09-29T01:32:32.123Z",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "result": "OK",
    "_source": "google_sheet"
  },
  {
    "id": "log-gsheet-v2-2026-09-12-Heri--_Cleaning_All_blinder_4Cell",
    "result": "OK",
    "_source": "google_sheet",
    "verification": "Supervisor Operasional",
    "date": "2026-09-12",
    "staffName": "Heri",
    "followUp": "Kondisi Bersih Normal",
    "checklists": {
      "- Cleaning All blinder 4Cell": {
        "status": "OK",
        "notes": "Kondisi Bersih Normal"
      }
    },
    "division": "Lighting",
    "activity": "- Cleaning All blinder 4Cell",
    "_syncedAt": "2026-09-29T01:32:34.235Z",
    "status": "Close",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T22:43:01.723Z"
    }
  },
  {
    "id": "log-gsheet-v2-2026-09-12-Heri--_Cleaning_All_Freshnell_300_w",
    "result": "OK",
    "activity": "- Cleaning All Freshnell 300 w",
    "division": "Lighting",
    "date": "2026-09-12",
    "staffName": "Heri",
    "checklists": {
      "- Cleaning All Freshnell 300 w": {
        "notes": "Kondisi Normal",
        "status": "OK"
      }
    },
    "verification": "Supervisor Operasional",
    "followUp": "Kondisi Normal",
    "status": "Close",
    "_source": "google_sheet",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.723Z"
    },
    "_syncedAt": "2026-09-29T01:32:33.306Z"
  },
  {
    "id": "log-gsheet-v2-2026-09-12-Heri--_Cleaning_All_Stromy",
    "_source": "google_sheet",
    "status": "Close",
    "activity": "- Cleaning All Stromy",
    "division": "Lighting",
    "_syncedAt": "2026-09-29T01:32:32.677Z",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.723Z"
    },
    "followUp": "Kondisi Bersih Normal",
    "date": "2026-09-12",
    "verification": "Supervisor Operasional",
    "staffName": "Heri",
    "checklists": {
      "- Cleaning All Stromy": {
        "notes": "Kondisi Bersih Normal",
        "status": "OK"
      }
    },
    "result": "OK"
  },
  {
    "id": "log-gsheet-v2-2026-09-12-Heri--_Cleaning_Parled_No__11_13_14",
    "activity": "- Cleaning Parled No. 11,13,14,15,16,17",
    "result": "NG",
    "_source": "google_sheet",
    "division": "Lighting",
    "verification": "Supervisor Operasional",
    "date": "2026-09-12",
    "staffName": "Heri",
    "status": "Open",
    "followUp": "Kondisi Bersih I No. 13 Harus Servic ( Merah Mati )",
    "_syncMeta": {
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "updatedBy": "BatchSync"
    },
    "checklists": {
      "- Cleaning Parled No. 11,13,14,15,16,17": {
        "notes": "Kondisi Bersih I No. 13 Harus Servic ( Merah Mati )",
        "status": "NG"
      }
    },
    "_syncedAt": "2026-09-29T01:32:35.017Z"
  },
  {
    "id": "log-gsheet-v2-2026-09-12-Heri-Cek_Unit__Cleaning__Cek_Colour",
    "_source": "google_sheet",
    "verification": "Supervisor Operasional",
    "staffName": "Heri",
    "activity": "Cek Unit, Cleaning, Cek Colour Parled",
    "status": "Close",
    "division": "Lighting",
    "followUp": "Pengecekan selesai",
    "date": "2026-09-12",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T22:43:01.722Z"
    },
    "_syncedAt": "2026-09-29T01:44:48.087Z",
    "result": "OK",
    "checklists": {
      "Cek Unit, Cleaning, Cek Colour Parled": {
        "status": "OK",
        "notes": "Kondisi operasional normal"
      }
    }
  },
  {
    "id": "log-20260916-ayongsumarsih-28",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "Pelepasan masking kabinet LED",
        "status": "OK"
      }
    },
    "result": "OK",
    "division": "Videotron",
    "_source": "google_sheet",
    "activity": "- Buka Masking Kabinet",
    "status": "Close",
    "verification": "Auto-Synced",
    "staffName": "Ayong Sumarsih",
    "date": "2026-09-16",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:19.027Z"
    },
    "followUp": "Pelepasan masking kabinet LED"
  },
  {
    "id": "log-20260916-dani-39-0",
    "division": "Audio",
    "verification": "Auto-Synced",
    "status": "Close",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "result": "OK",
    "activity": "- Cleaning & Repaint Mic SM58, SM57 & VXT",
    "date": "2026-09-16",
    "followUp": "SM58 ( Bagus 17, Rusak 1 ), SM57 ( Bagus 11, Rusak 4, Hilang 9 ), VXT ( Bagus 8, Rusak 2 )",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.064Z",
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "browser": "Chrome"
    },
    "staffName": "Dani",
    "_source": "google_sheet"
  },
  {
    "id": "log-20260916-heri-41-0",
    "verification": "Auto-Synced",
    "date": "2026-09-16",
    "followUp": "",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.064Z",
      "deviceType": "Desktop"
    },
    "status": "Close",
    "division": "Lighting",
    "_source": "google_sheet",
    "staffName": "Heri",
    "activity": "CLEANING, CEK UNIT",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "result": "OK"
  },
  {
    "id": "log-20260916-heri-43-0",
    "status": "Close",
    "date": "2026-09-16",
    "division": "Lighting",
    "activity": "- Cleaning All Freshnell 200 W",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "result": "OK",
    "_source": "google_sheet",
    "verification": "Auto-Synced",
    "staffName": "Heri",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.064Z",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS"
    },
    "followUp": "Kondisi Normal"
  },
  {
    "id": "log-20260916-heri-44-0",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.064Z",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "status": "Close",
    "followUp": "Smoke No.3 ERORR",
    "staffName": "Heri",
    "date": "2026-09-16",
    "verification": "Auto-Synced",
    "result": "OK",
    "_source": "google_sheet",
    "activity": "- Cek Smoke erorr",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "division": "Lighting"
  },
  {
    "id": "log-20260916-heri-46-0",
    "status": "Close",
    "followUp": "Lancar",
    "date": "2026-09-16",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.065Z",
      "browser": "Chrome"
    },
    "result": "OK",
    "staffName": "Heri",
    "_source": "google_sheet",
    "activity": "- Ganti Roda Box Kabel",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "verification": "Auto-Synced",
    "division": "Lighting"
  },
  {
    "id": "log-20260916-iwankurniawan-32",
    "staffName": "Iwan Kurniawan",
    "followUp": "2 Unit Komponen Speaker 18inc saja untuk di service keluar",
    "date": "2026-09-16",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:19.027Z",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "division": "Audio",
    "status": "Close",
    "_source": "google_sheet",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "2 Unit Komponen Speaker 18inc saja untuk di service keluar",
        "status": "OK"
      }
    },
    "verification": "Auto-Synced",
    "activity": "- Bongkar RCF 8003 Kirim ke sambang",
    "result": "OK"
  },
  {
    "id": "log-20260916-jay-36-0",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.063Z",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "activity": "- Ganti Konektor SDI kabel panjang 1. Kabel pendek 1",
    "staffName": "Jay",
    "result": "OK",
    "division": "Multimedia",
    "status": "Close",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "date": "2026-09-16",
    "followUp": "Sudah selesai dan bisa di gunakan",
    "_source": "google_sheet",
    "verification": "Auto-Synced"
  },
  {
    "id": "log-20260916-jay-37-0",
    "verification": "Auto-Synced",
    "status": "Close",
    "followUp": "",
    "_source": "google_sheet",
    "date": "2026-09-16",
    "result": "OK",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.063Z",
      "browser": "Chrome"
    },
    "activity": "- Cek Kabel SDI Perleng Box",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "staffName": "Jay",
    "division": "Multimedia"
  },
  {
    "id": "log-20260916-kharo-34-0",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.063Z",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome"
    },
    "staffName": "Kharo",
    "_source": "google_sheet",
    "activity": "- Repair Dead Pixel",
    "division": "Videotron",
    "followUp": "selesai",
    "verification": "Auto-Synced",
    "date": "2026-09-16",
    "status": "Close",
    "result": "OK",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    }
  },
  {
    "id": "log-20260916-mulyadi-29",
    "_source": "google_sheet",
    "staffName": "Mulyadi",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "date": "2026-09-16",
    "followUp": "Sudah selesai dan bisa di gunakan",
    "verification": "Auto-Synced",
    "activity": "- Ganti Konektor SDI kabel panjang 1. Kabel pendek 1\n- Cek Kabel SDI Perleng Box",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "Sudah selesai dan bisa di gunakan",
        "status": "OK"
      }
    },
    "result": "OK",
    "status": "Close",
    "division": "Multimedia"
  },
  {
    "id": "log-20260916-mulyana-27",
    "division": "Service",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "Perbaikan dead pixel kabinet LED",
        "status": "OK"
      }
    },
    "activity": "- Repair Dead Pixel",
    "verification": "Auto-Synced",
    "status": "Close",
    "_source": "google_sheet",
    "date": "2026-09-16",
    "result": "OK",
    "followUp": "Perbaikan dead pixel kabinet LED",
    "staffName": "Mulyana",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "deviceType": "Desktop"
    }
  },
  {
    "id": "log-20260916-ramdani-31",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "status": "NG",
        "notes": "SM58 ( Bagus 17, Rusak 1 ), SM57 ( Bagus 11, Rusak 4, Hilang 9 ), VXT ( Bagus 8, Rusak 2 )"
      }
    },
    "result": "NG",
    "followUp": "SM58 ( Bagus 17, Rusak 1 ), SM57 ( Bagus 11, Rusak 4, Hilang 9 ), VXT ( Bagus 8, Rusak 2 )",
    "status": "Open",
    "verification": "Auto-Synced",
    "division": "Audio",
    "_source": "google_sheet",
    "date": "2026-09-16",
    "staffName": "Ramdani",
    "activity": "- Cleaning & Repaint Mic SM58, SM57 & VXT",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.723Z"
    }
  },
  {
    "id": "log-20260916-unyim-38-0",
    "followUp": "Kondisi Bersih dan Normal",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "verification": "Auto-Synced",
    "date": "2026-09-16",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.064Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync"
    },
    "status": "Close",
    "staffName": "Unyim",
    "activity": "- Cleaning Avanda 210 16 Box",
    "_source": "google_sheet",
    "result": "OK",
    "division": "Audio"
  },
  {
    "id": "log-20260916-wahyudin-30",
    "status": "Close",
    "result": "OK",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "status": "OK",
        "notes": "Kondisi Bersih dan Normal"
      }
    },
    "followUp": "Kondisi Bersih dan Normal",
    "division": "Audio",
    "activity": "- Cleaning Avanda 210 16 Box",
    "staffName": "Wahyudin",
    "verification": "Auto-Synced",
    "_source": "google_sheet",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "date": "2026-09-16"
  },
  {
    "id": "log-gsheet-v2-2026-09-16-Ayong_Sumarsih--_Buka_Masking_Kabinet",
    "staffName": "Ayong Sumarsih",
    "date": "2026-09-16",
    "result": "OK",
    "division": "Videotron",
    "activity": "- Buka Masking Kabinet",
    "checklists": {
      "- Buka Masking Kabinet": {
        "notes": "Kondisi operasional normal",
        "status": "OK"
      }
    },
    "verification": "Supervisor Operasional",
    "_syncedAt": "2026-09-30T06:45:35.855Z",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-02T10:00:47.990Z",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "status": "Close",
    "_source": "google_sheet",
    "followUp": "Pengecekan selesai aman"
  },
  {
    "id": "log-gsheet-v2-2026-09-16-Heri--_Cek_Smoke_erorr",
    "followUp": "Smoke No.3 ERORR",
    "staffName": "Heri",
    "status": "Close",
    "date": "2026-09-16",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.723Z"
    },
    "_syncedAt": "2026-09-29T01:32:41.634Z",
    "activity": "- Cek Smoke erorr",
    "result": "OK",
    "division": "Lighting",
    "checklists": {
      "- Cek Smoke erorr": {
        "notes": "Smoke No.3 ERORR",
        "status": "OK"
      }
    },
    "verification": "Supervisor Operasional"
  },
  {
    "id": "log-gsheet-v2-2026-09-16-Heri--_Cleaning_All_Freshnell_200_W",
    "date": "2026-09-16",
    "result": "OK",
    "_syncedAt": "2026-09-29T01:32:40.753Z",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "followUp": "Kondisi Normal",
    "status": "Close",
    "division": "Lighting",
    "activity": "- Cleaning All Freshnell 200 W",
    "checklists": {
      "- Cleaning All Freshnell 200 W": {
        "notes": "Kondisi Normal",
        "status": "OK"
      }
    },
    "staffName": "Heri",
    "verification": "Supervisor Operasional",
    "_source": "google_sheet"
  },
  {
    "id": "log-gsheet-v2-2026-09-16-Heri--_Ganti_Roda_Box_Kabel",
    "checklists": {
      "- Ganti Roda Box Kabel": {
        "status": "NG",
        "notes": "Lancar"
      }
    },
    "result": "NG",
    "followUp": "Lancar",
    "staffName": "Heri",
    "activity": "- Ganti Roda Box Kabel",
    "status": "Open",
    "date": "2026-09-16",
    "division": "Lighting",
    "_source": "google_sheet",
    "verification": "Supervisor Operasional",
    "_syncedAt": "2026-09-29T01:32:43.092Z",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    }
  },
  {
    "id": "log-gsheet-v2-2026-09-16-Heri--_Konek_artnet_ke_Tiger_Touch",
    "status": "Close",
    "staffName": "Heri",
    "date": "2026-09-16",
    "_source": "google_sheet",
    "activity": "- Konek artnet ke Tiger Touch",
    "checklists": {
      "- Konek artnet ke Tiger Touch": {
        "status": "OK",
        "notes": "Kondisi operasional normal"
      }
    },
    "division": "Lighting",
    "_syncedAt": "2026-09-29T01:32:40.016Z",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "followUp": "",
    "verification": "Supervisor Operasional",
    "result": "OK"
  },
  {
    "id": "log-gsheet-v2-2026-09-16-Heri--_Rapihin_Kabel_PerlBox",
    "result": "OK",
    "verification": "Supervisor Operasional",
    "date": "2026-09-16",
    "_syncedAt": "2026-09-29T01:32:42.328Z",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "checklists": {
      "- Rapihin Kabel PerlBox": {
        "status": "OK",
        "notes": "Aman"
      }
    },
    "_source": "google_sheet",
    "followUp": "Aman",
    "division": "Lighting",
    "activity": "- Rapihin Kabel PerlBox",
    "status": "Close",
    "staffName": "Heri"
  },
  {
    "id": "log-gsheet-v2-2026-09-16-Heri-CLEANING__CEK_UNIT",
    "staffName": "Heri",
    "followUp": "Pengecekan selesai",
    "status": "Close",
    "_syncedAt": "2026-09-29T01:44:53.040Z",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "deviceOS": "macOS"
    },
    "verification": "Supervisor Operasional",
    "checklists": {
      "CLEANING, CEK UNIT": {
        "status": "OK",
        "notes": "Kondisi operasional normal"
      }
    },
    "division": "Lighting",
    "_source": "google_sheet",
    "result": "OK",
    "activity": "CLEANING, CEK UNIT",
    "date": "2026-09-16"
  },
  {
    "id": "log-gsheet-v2-2026-09-16-Iwan_Kurniawan--_Bongkar_RCF_8003_Kirim_ke_sa",
    "result": "NG",
    "checklists": {
      "- Bongkar RCF 8003 Kirim ke sambang": {
        "status": "NG",
        "notes": "2 Unit Komponen Speaker 18inc saja untuk di service keluar"
      }
    },
    "division": "Audio",
    "activity": "- Bongkar RCF 8003 Kirim ke sambang",
    "_syncedAt": "2026-09-30T06:45:58.682Z",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-02T10:00:47.990Z"
    },
    "verification": "Supervisor Operasional",
    "_source": "google_sheet",
    "status": "Open",
    "date": "2026-09-16",
    "followUp": "2 Unit Komponen Speaker 18inc saja untuk di service keluar",
    "staffName": "Iwan Kurniawan"
  },
  {
    "id": "log-gsheet-v2-2026-09-16-Mulyadi--_Cek_Kabel_SDI_Perleng_Box",
    "result": "OK",
    "verification": "Supervisor Operasional",
    "followUp": "Pengecekan selesai",
    "staffName": "Mulyadi",
    "checklists": {
      "- Cek Kabel SDI Perleng Box": {
        "status": "OK",
        "notes": "Kondisi operasional normal"
      }
    },
    "_source": "google_sheet",
    "date": "2026-09-16",
    "status": "Close",
    "_syncedAt": "2026-09-29T01:32:37.018Z",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "deviceOS": "macOS"
    },
    "division": "Multimedia",
    "activity": "- Cek Kabel SDI Perleng Box"
  },
  {
    "id": "log-gsheet-v2-2026-09-16-Mulyadi--_Ganti_Konektor_SDI_kabel_pan",
    "result": "NG",
    "verification": "Supervisor Operasional",
    "staffName": "Mulyadi",
    "checklists": {
      "- Ganti Konektor SDI kabel panjang 1. Ka": {
        "status": "NG",
        "notes": "Sudah selesai dan bisa di gunakan"
      }
    },
    "date": "2026-09-16",
    "division": "Multimedia",
    "activity": "- Ganti Konektor SDI kabel panjang 1. Kabel pendek 1",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "_syncedAt": "2026-09-29T01:44:50.545Z",
    "status": "Open",
    "followUp": "Sudah selesai dan bisa di gunakan",
    "_source": "google_sheet"
  },
  {
    "id": "log-gsheet-v2-2026-09-16-Mulyana--_Repair_Dead_Pixel",
    "_source": "google_sheet",
    "activity": "- Repair Dead Pixel",
    "division": "Videotron",
    "verification": "Supervisor Operasional",
    "result": "NG",
    "checklists": {
      "- Repair Dead Pixel": {
        "notes": "Kendala operasional terdeteksi",
        "status": "NG"
      }
    },
    "_syncedAt": "2026-09-29T01:45:46.060Z",
    "date": "2026-09-16",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T22:43:01.721Z",
      "deviceOS": "macOS"
    },
    "followUp": "Perlu perbaikan teknis",
    "staffName": "Mulyana",
    "status": "Open"
  },
  {
    "id": "log-gsheet-v2-2026-09-16-Ramdani--_Cleaning___Repaint_Mic_SM58_",
    "staffName": "Ramdani",
    "status": "Open",
    "division": "Audio",
    "activity": "- Cleaning & Repaint Mic SM58, SM57 & VXT",
    "_source": "google_sheet",
    "checklists": {
      "- Cleaning & Repaint Mic SM58, SM57 & VX": {
        "notes": "SM58 ( Bagus 17, Rusak 1 ), SM57 ( Bagus 11, Rusak 4, Hilang 9 ), VXT ( Bagus 8, Rusak 2 )",
        "status": "NG"
      }
    },
    "_syncedAt": "2026-09-29T01:44:51.727Z",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "deviceOS": "macOS"
    },
    "result": "NG",
    "date": "2026-09-16",
    "verification": "Supervisor Operasional",
    "followUp": "SM58 ( Bagus 17, Rusak 1 ), SM57 ( Bagus 11, Rusak 4, Hilang 9 ), VXT ( Bagus 8, Rusak 2 )"
  },
  {
    "id": "log-gsheet-v2-2026-09-16-Wahyudin--_Cleaning_Avanda_210_16_Box",
    "result": "OK",
    "division": "Audio",
    "activity": "- Cleaning Avanda 210 16 Box",
    "staffName": "Wahyudin",
    "verification": "Supervisor Operasional",
    "date": "2026-09-16",
    "_source": "google_sheet",
    "_syncedAt": "2026-09-29T01:44:51.156Z",
    "status": "Close",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.722Z"
    },
    "checklists": {
      "- Cleaning Avanda 210 16 Box": {
        "status": "OK",
        "notes": "Kondisi Bersih dan Normal"
      }
    },
    "followUp": "Kondisi Bersih dan Normal"
  },
  {
    "id": "log-20260917-dani-53-0",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.065Z",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS"
    },
    "staffName": "Dani",
    "activity": "- Cek Mic  & Jumlahnya",
    "date": "2026-09-17",
    "result": "OK",
    "status": "Close",
    "division": "Audio",
    "followUp": "- Bagus Dan Bersih",
    "_source": "google_sheet",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "verification": "Auto-Synced"
  },
  {
    "id": "log-20260917-jay-51-0",
    "followUp": "- Dari 3 Unit Kabel SDI, 1 Unit Harus Ganti konektor ( 2 Unit Aman )",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.065Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync"
    },
    "staffName": "Jay",
    "_source": "google_sheet",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "verification": "Auto-Synced",
    "activity": "- Cek Kabel SDI 50 Meter Dan Ganti Konektor 3 Unit",
    "status": "Close",
    "date": "2026-09-17",
    "division": "Multimedia",
    "result": "OK"
  },
  {
    "id": "log-20260917-kharo-47-0",
    "division": "Videotron",
    "verification": "Auto-Synced",
    "staffName": "Kharo",
    "activity": "- Ganti Dead Pixel",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.065Z",
      "deviceOS": "macOS"
    },
    "_source": "google_sheet",
    "status": "Close",
    "followUp": "- 5 Box Diluar Blom Beres",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "date": "2026-09-17",
    "result": "OK"
  },
  {
    "id": "log-20260917-mulyadi-35",
    "division": "Multimedia",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.724Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "staffName": "Mulyadi",
    "activity": "- Cek Kabel SDI 50 Meter Dan Ganti Konektor 3 Unit",
    "verification": "Auto-Synced",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "status": "OK",
        "notes": "- Dari 3 Unit Kabel SDI, 1 Unit Harus Ganti konektor ( 2 Unit Aman )"
      }
    },
    "status": "Close",
    "_source": "google_sheet",
    "date": "2026-09-17",
    "followUp": "- Dari 3 Unit Kabel SDI, 1 Unit Harus Ganti konektor ( 2 Unit Aman )",
    "result": "OK"
  },
  {
    "id": "log-20260917-opik-52-0",
    "verification": "Auto-Synced",
    "status": "Close",
    "followUp": "- Udah Aman Diganti baru",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.065Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync"
    },
    "result": "OK",
    "date": "2026-09-17",
    "staffName": "Opik",
    "activity": "- Cek Panel Dan Ganti 3 Unit Indikator",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "_source": "google_sheet",
    "division": "Audio"
  },
  {
    "id": "log-20260917-ramdani-37",
    "verification": "Auto-Synced",
    "result": "OK",
    "followUp": "- Bagus Dan Bersih",
    "status": "Close",
    "date": "2026-09-17",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.724Z"
    },
    "activity": "- Cek Mic  & Jumlahnya",
    "staffName": "Ramdani",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "status": "OK",
        "notes": "- Bagus Dan Bersih"
      }
    },
    "_source": "google_sheet",
    "division": "Audio"
  },
  {
    "id": "log-20260917-taufikdiana-36",
    "result": "OK",
    "division": "Audio",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.724Z"
    },
    "status": "Close",
    "activity": "- Cek Panel Dan Ganti 3 Unit Indikator",
    "date": "2026-09-17",
    "staffName": "Taufik Diana",
    "verification": "Auto-Synced",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "- Udah Aman Diganti baru",
        "status": "OK"
      }
    },
    "_source": "google_sheet",
    "followUp": "- Udah Aman Diganti baru"
  },
  {
    "id": "log-20260917-unyim-54-0",
    "verification": "Auto-Synced",
    "status": "Close",
    "staffName": "Unyim",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.066Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync"
    },
    "date": "2026-09-17",
    "followUp": "- Takel yg 1 Ton LOS 1 Unit wajib di perbaiki",
    "result": "OK",
    "_source": "google_sheet",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "division": "Audio",
    "activity": "- Cek Takel 1 & 2 Ton"
  },
  {
    "id": "log-20260917-wahyudin-38",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.724Z",
      "browser": "Chrome"
    },
    "status": "Open",
    "verification": "Auto-Synced",
    "followUp": "- Takel yg 1 Ton LOS 1 Unit wajib di perbaiki",
    "staffName": "Wahyudin",
    "date": "2026-09-17",
    "_source": "google_sheet",
    "result": "NG",
    "activity": "- Cek Takel 1 & 2 Ton",
    "division": "Audio",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "status": "NG",
        "notes": "- Takel yg 1 Ton LOS 1 Unit wajib di perbaiki"
      }
    }
  },
  {
    "id": "log-20260917-yudis-55-0",
    "division": "Audio",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "date": "2026-09-17",
    "activity": "- Cek Ampeg SVT-4",
    "status": "Close",
    "staffName": "Yudis",
    "verification": "Auto-Synced",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.066Z",
      "deviceType": "Desktop"
    },
    "followUp": "- Harus service dan ganti PTC",
    "result": "OK"
  },
  {
    "id": "log-20260917-yudishtirapurnamaa-39",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "status": "OK",
        "notes": "- Harus service dan ganti PTC"
      }
    },
    "status": "Close",
    "followUp": "- Harus service dan ganti PTC",
    "staffName": "Yudishtira Purnama A",
    "result": "OK",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.724Z"
    },
    "activity": "- Cek Ampeg SVT-4",
    "date": "2026-09-17",
    "verification": "Auto-Synced",
    "division": "Audio"
  },
  {
    "id": "log-gsheet-v2-2026-09-17-Mulyadi--_Cek_Kabel_SDI_50_Meter_Dan_G",
    "verification": "Supervisor Operasional",
    "checklists": {
      "- Cek Kabel SDI 50 Meter Dan Ganti Konek": {
        "notes": "- Dari 3 Unit Kabel SDI, 1 Unit Harus Ganti konektor ( 2 Unit Aman )",
        "status": "NG"
      }
    },
    "date": "2026-09-17",
    "division": "Multimedia",
    "status": "Open",
    "_source": "google_sheet",
    "activity": "- Cek Kabel SDI 50 Meter Dan Ganti Konektor 3 Unit",
    "staffName": "Mulyadi",
    "followUp": "- Dari 3 Unit Kabel SDI, 1 Unit Harus Ganti konektor ( 2 Unit Aman )",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.721Z",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "result": "NG",
    "_syncedAt": "2026-09-29T01:45:49.819Z"
  },
  {
    "id": "log-gsheet-v2-2026-09-17-Mulyana--_Ganti_Dead_Pixel",
    "activity": "- Ganti Dead Pixel",
    "status": "Open",
    "checklists": {
      "- Ganti Dead Pixel": {
        "status": "NG",
        "notes": "- 5 Box Diluar Blom Beres"
      }
    },
    "staffName": "Mulyana",
    "division": "Service",
    "verification": "Supervisor Operasional",
    "date": "2026-09-17",
    "result": "NG",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "_source": "google_sheet",
    "_syncedAt": "2026-09-29T01:32:43.857Z",
    "followUp": "- 5 Box Diluar Blom Beres"
  },
  {
    "id": "log-gsheet-v2-2026-09-17-Mulyana-1_Box_Kerusakan_Berat",
    "_syncedAt": "2026-09-29T01:32:44.623Z",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "deviceType": "Desktop"
    },
    "result": "NG",
    "followUp": "- 1 Box Clear ( 8 Panel Cabinet )",
    "date": "2026-09-17",
    "verification": "Supervisor Operasional",
    "staffName": "Mulyana",
    "status": "Open",
    "checklists": {
      "1 Box Kerusakan Berat": {
        "status": "NG",
        "notes": "- 1 Box Clear ( 8 Panel Cabinet )"
      }
    },
    "division": "Service",
    "activity": "1 Box Kerusakan Berat",
    "_source": "google_sheet"
  },
  {
    "id": "log-gsheet-v2-2026-09-17-Ramdani--_Cek_Mic____Jumlahnya",
    "verification": "Supervisor Operasional",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T22:43:01.721Z",
      "deviceType": "Desktop"
    },
    "date": "2026-09-17",
    "_syncedAt": "2026-09-29T01:45:50.725Z",
    "status": "Close",
    "activity": "- Cek Mic  & Jumlahnya",
    "division": "Audio",
    "followUp": "- Bagus Dan Bersih",
    "_source": "google_sheet",
    "checklists": {
      "- Cek Mic  & Jumlahnya": {
        "status": "OK",
        "notes": "- Bagus Dan Bersih"
      }
    },
    "staffName": "Ramdani",
    "result": "OK"
  },
  {
    "id": "log-gsheet-v2-2026-09-17-Taufik_Diana--_Cek_Panel_Dan_Ganti_3_Unit_I",
    "_syncedAt": "2026-09-29T01:45:50.301Z",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.721Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "date": "2026-09-17",
    "result": "NG",
    "followUp": "- Udah Aman Diganti baru",
    "_source": "google_sheet",
    "status": "Open",
    "staffName": "Taufik Diana",
    "checklists": {
      "- Cek Panel Dan Ganti 3 Unit Indikator": {
        "notes": "- Udah Aman Diganti baru",
        "status": "NG"
      }
    },
    "verification": "Supervisor Operasional",
    "division": "Audio",
    "activity": "- Cek Panel Dan Ganti 3 Unit Indikator"
  },
  {
    "id": "log-gsheet-v2-2026-09-17-Wahyudin--_Cek_Takel_1___2_Ton",
    "verification": "Supervisor Operasional",
    "result": "NG",
    "division": "Audio",
    "activity": "- Cek Takel 1 & 2 Ton",
    "staffName": "Wahyudin",
    "date": "2026-09-17",
    "status": "Open",
    "checklists": {
      "- Cek Takel 1 & 2 Ton": {
        "status": "NG",
        "notes": "- Takel yg 1 Ton LOS 1 Unit wajib di perbaiki"
      }
    },
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.721Z"
    },
    "_source": "google_sheet",
    "followUp": "- Takel yg 1 Ton LOS 1 Unit wajib di perbaiki",
    "_syncedAt": "2026-09-29T01:45:51.208Z"
  },
  {
    "id": "log-gsheet-v2-2026-09-17-Yudishtira_Purnama_A--_Cek_Ampeg_SVT-4",
    "activity": "- Cek Ampeg SVT-4",
    "result": "NG",
    "_source": "google_sheet",
    "division": "Audio",
    "verification": "Supervisor Operasional",
    "staffName": "Yudishtira Purnama A",
    "status": "Open",
    "checklists": {
      "- Cek Ampeg SVT-4": {
        "status": "NG",
        "notes": "- Harus service dan ganti PTC"
      }
    },
    "followUp": "- Harus service dan ganti PTC",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.721Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "date": "2026-09-17",
    "_syncedAt": "2026-09-29T01:45:52.489Z"
  },
  {
    "id": "log-20260918-kharo-58-0",
    "division": "Videotron",
    "verification": "Auto-Synced",
    "staffName": "Kharo",
    "activity": "- Ganti Dead Pixel",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.066Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync"
    },
    "date": "2026-09-18",
    "status": "Close",
    "_source": "google_sheet",
    "followUp": "- 3 Box Belum Beres",
    "result": "OK",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    }
  },
  {
    "id": "log-gsheet-v2-2026-09-18-Mulyana--_Ganti_Dead_Pixel",
    "_source": "google_sheet",
    "verification": "Supervisor Operasional",
    "staffName": "Mulyana",
    "followUp": "- 3 Box Belum Beres",
    "status": "Open",
    "activity": "- Ganti Dead Pixel",
    "division": "Service",
    "checklists": {
      "- Ganti Dead Pixel": {
        "status": "NG",
        "notes": "- 3 Box Belum Beres"
      }
    },
    "result": "NG",
    "date": "2026-09-18",
    "_syncedAt": "2026-09-29T01:32:48.164Z",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "deviceType": "Desktop"
    }
  },
  {
    "id": "log-20260921-heri-62-0",
    "followUp": "",
    "verification": "Auto-Synced",
    "status": "Close",
    "staffName": "Heri",
    "result": "OK",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.066Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync"
    },
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "activity": "Service & Cek Unit",
    "date": "2026-09-21",
    "division": "Lighting"
  },
  {
    "id": "log-20260921-heri-63-0",
    "staffName": "Heri",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.067Z"
    },
    "followUp": "- Smoke Kondisi Normal Semua",
    "date": "2026-09-21",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "verification": "Auto-Synced",
    "division": "Lighting",
    "status": "Close",
    "activity": "- Smoke No 3 Ganti PCB mainboard",
    "result": "OK"
  },
  {
    "id": "log-20260921-heri-67-0",
    "date": "2026-09-21",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "result": "OK",
    "followUp": "- Kabel lengkap , Minus Breket Stromy 1bok",
    "status": "Close",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.067Z",
      "deviceType": "Desktop",
      "updatedBy": "System Canonical Sync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "activity": "- Cek Kabel dan Unit Bekas Sewaan Plaza Festival",
    "staffName": "Heri",
    "verification": "Auto-Synced",
    "division": "Lighting"
  },
  {
    "id": "log-gsheet-v2-2026-09-21-Heri--_Cek_Kabel_dan_Unit_Bekas_Sew",
    "status": "Close",
    "verification": "Supervisor Operasional",
    "staffName": "Heri",
    "checklists": {
      "- Cek Kabel dan Unit Bekas Sewaan Plaza ": {
        "notes": "- Kabel lengkap , Minus Breket Stromy 1bok",
        "status": "OK"
      }
    },
    "_source": "google_sheet",
    "followUp": "- Kabel lengkap , Minus Breket Stromy 1bok",
    "date": "2026-09-21",
    "division": "Lighting",
    "activity": "- Cek Kabel dan Unit Bekas Sewaan Plaza Festival",
    "result": "OK",
    "_syncedAt": "2026-09-29T01:32:55.945Z",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    }
  },
  {
    "id": "log-gsheet-v2-2026-09-21-Heri--_Parled_Eror_No_3_12_13_19_20",
    "division": "Lighting",
    "staffName": "Heri",
    "activity": "- Parled Eror No 3,12,13,19,20,25,27,29,32",
    "result": "OK",
    "verification": "Supervisor Operasional",
    "checklists": {
      "- Parled Eror No 3,12,13,19,20,25,27,29,": {
        "status": "OK",
        "notes": "- Parled Kondisi Normal Semua"
      }
    },
    "date": "2026-09-21",
    "_syncedAt": "2026-09-29T01:32:50.910Z",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    },
    "_source": "google_sheet",
    "status": "Close",
    "followUp": "- Parled Kondisi Normal Semua"
  },
  {
    "id": "log-gsheet-v2-2026-09-21-Heri--_Rapihin_Cover_Bekas_Pakai",
    "activity": "- Rapihin Cover Bekas Pakai",
    "_source": "google_sheet",
    "status": "Close",
    "staffName": "Heri",
    "division": "Lighting",
    "checklists": {
      "- Rapihin Cover Bekas Pakai": {
        "notes": "- Cover2 lengkap",
        "status": "OK"
      }
    },
    "date": "2026-09-21",
    "verification": "Supervisor Operasional",
    "result": "OK",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "deviceType": "Desktop",
      "browser": "Chrome"
    },
    "_syncedAt": "2026-09-29T01:32:54.546Z",
    "followUp": "- Cover2 lengkap"
  },
  {
    "id": "log-gsheet-v2-2026-09-21-Heri--_Smoke_No_3_Ganti_PCB_mainboa",
    "status": "Close",
    "date": "2026-09-21",
    "checklists": {
      "- Smoke No 3 Ganti PCB mainboard": {
        "status": "OK",
        "notes": "- Smoke Kondisi Normal Semua"
      }
    },
    "verification": "Supervisor Operasional",
    "followUp": "- Smoke Kondisi Normal Semua",
    "_source": "google_sheet",
    "_syncedAt": "2026-09-29T01:32:50.053Z",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.723Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "result": "OK",
    "activity": "- Smoke No 3 Ganti PCB mainboard",
    "staffName": "Heri",
    "division": "Lighting"
  },
  {
    "id": "log-gsheet-v2-2026-09-21-Heri-Service___Cek_Unit",
    "_syncedAt": "2026-09-29T01:32:49.087Z",
    "verification": "Supervisor Operasional",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T22:43:01.723Z"
    },
    "status": "Open",
    "division": "Lighting",
    "activity": "Service & Cek Unit",
    "_source": "google_sheet",
    "staffName": "Heri",
    "result": "NG",
    "date": "2026-09-21",
    "followUp": "Perlu perbaikan teknis",
    "checklists": {
      "Service & Cek Unit": {
        "status": "NG",
        "notes": "Kendala operasional terdeteksi"
      }
    }
  },
  {
    "id": "log-gsheet-v2-2026-09-21-Heri-Sudah_NORMAL__Service_Mg_Damri",
    "date": "2026-09-21",
    "result": "NG",
    "staffName": "Heri",
    "division": "Lighting",
    "_source": "google_sheet",
    "activity": "Sudah NORMAL (Service Mg Damri)",
    "status": "Open",
    "checklists": {
      "Sudah NORMAL (Service Mg Damri)": {
        "notes": "Kendala operasional terdeteksi",
        "status": "NG"
      }
    },
    "_syncedAt": "2026-09-29T01:32:52.913Z",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.722Z"
    },
    "followUp": "Perlu perbaikan teknis",
    "verification": "Supervisor Operasional"
  },
  {
    "id": "log-20260922-buluk-69-0",
    "staffName": "Buluk",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.067Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync"
    },
    "status": "Close",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "verification": "Auto-Synced",
    "result": "OK",
    "_source": "google_sheet",
    "followUp": "- Service Modul Sub Kla No.3 ( Kirim Ke PIB )",
    "division": "Audio",
    "activity": "- Cek Sub Kla 4 Unit",
    "date": "2026-09-22"
  },
  {
    "id": "log-gsheet-v2-2026-09-22-Suryana--_Cek_Sub_Kla_4_Unit",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "checklists": {
      "- Cek Sub Kla 4 Unit": {
        "notes": "- Service Modul Sub Kla No.3 ( Kirim Ke PIB )",
        "status": "NG"
      }
    },
    "followUp": "- Service Modul Sub Kla No.3 ( Kirim Ke PIB )",
    "_syncedAt": "2026-09-29T01:32:58.000Z",
    "result": "NG",
    "_source": "google_sheet",
    "verification": "Supervisor Operasional",
    "status": "Open",
    "staffName": "Suryana",
    "date": "2026-09-22",
    "activity": "- Cek Sub Kla 4 Unit",
    "division": "Audio"
  },
  {
    "id": "log-gsheet-v2-2026-09-22-Suryana--_Ngerapihin_Rumbai_Mic",
    "result": "OK",
    "staffName": "Suryana",
    "division": "Audio",
    "activity": "- Ngerapihin Rumbai Mic",
    "verification": "Supervisor Operasional",
    "_syncedAt": "2026-09-29T01:45:54.104Z",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-01T22:43:01.721Z",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    },
    "status": "Close",
    "followUp": "- Beres, Aman Rumbai bisa di gunakan",
    "date": "2026-09-22",
    "_source": "google_sheet",
    "checklists": {
      "- Ngerapihin Rumbai Mic": {
        "notes": "- Beres, Aman Rumbai bisa di gunakan",
        "status": "OK"
      }
    }
  },
  {
    "id": "log-20260923-yudishtirapurnamaa-45",
    "date": "2026-09-23",
    "followUp": "Merapihkan dan menata rak penyimpanan audio gudang",
    "_source": "google_sheet",
    "verification": "Auto-Synced",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:19.027Z"
    },
    "staffName": "Yudishtira Purnama A",
    "result": "OK",
    "activity": "- Merapihkan Rak Penyimpanan",
    "status": "Close",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "Merapihkan dan menata rak penyimpanan audio gudang",
        "status": "OK"
      }
    },
    "division": "Audio"
  },
  {
    "id": "log-gsheet-v2-2026-09-23-Yudishtira_Purnama_A--",
    "status": "Close",
    "staffName": "Yudishtira Purnama A",
    "followUp": "Pengecekan selesai aman",
    "division": "Audio",
    "result": "OK",
    "checklists": {
      "-": {
        "notes": "Kondisi operasional normal",
        "status": "OK"
      }
    },
    "activity": "-",
    "date": "2026-09-23",
    "verification": "Supervisor Operasional",
    "_source": "google_sheet",
    "_syncedAt": "2026-09-30T06:47:40.717Z",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-02T10:00:47.990Z",
      "deviceType": "Desktop",
      "browser": "Chrome"
    }
  },
  {
    "id": "log-gsheet-v2-2026-09-23-Yudishtira_Purnama_A--_Merapihkan_Rak_Penyimpanan",
    "_source": "google_sheet",
    "activity": "- Merapihkan Rak Penyimpanan",
    "division": "Audio",
    "checklists": {
      "- Merapihkan Rak Penyimpanan": {
        "notes": "Kondisi operasional normal",
        "status": "OK"
      }
    },
    "verification": "Supervisor Operasional",
    "result": "OK",
    "staffName": "Yudishtira Purnama A",
    "followUp": "",
    "status": "Close",
    "date": "2026-09-23",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.721Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "_syncedAt": "2026-09-29T01:45:54.527Z"
  },
  {
    "id": "log-20260924-kharo-78-0",
    "status": "Close",
    "followUp": "8 Panel cabinet blm clear",
    "date": "2026-09-24",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "result": "OK",
    "_source": "google_sheet",
    "activity": "- repair 12 kabinet",
    "division": "Videotron",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T10:44:21.068Z"
    },
    "verification": "Auto-Synced",
    "staffName": "Kharo"
  },
  {
    "id": "log-20260924-kharo-82-0",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "activity": "-ganti kuncian kabel",
    "verification": "Auto-Synced",
    "status": "Close",
    "result": "OK",
    "_source": "google_sheet",
    "division": "Videotron",
    "followUp": "selesai di ganti kunci kabel",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T10:44:21.068Z"
    },
    "date": "2026-09-24",
    "staffName": "Kharo"
  },
  {
    "id": "log-20260924-mboh-74-0",
    "status": "Close",
    "date": "2026-09-24",
    "staffName": "Mboh",
    "verification": "Auto-Synced",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.068Z",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "result": "OK",
    "_source": "google_sheet",
    "followUp": "isu komponen KLA problem ngeleker ternyata normal(siap pakai)",
    "division": "Audio",
    "activity": "cek komponen sub KLA",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    }
  },
  {
    "id": "log-20260924-muhamadrahmat-48",
    "_source": "google_sheet",
    "date": "2026-09-24",
    "activity": "cek komponen sub KLA",
    "division": "Audio",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.724Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "followUp": "isu komponen KLA problem ngeleker ternyata normal(siap pakai)",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "isu komponen KLA problem ngeleker ternyata normal(siap pakai)",
        "status": "OK"
      }
    },
    "staffName": "Muhamad Rahmat",
    "result": "OK",
    "status": "Close",
    "verification": "Auto-Synced"
  },
  {
    "id": "log-20260924-taufikdiana-46",
    "activity": "setup layout hardcase gudang",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "1 set backline dalam kondisi normal(siap pakai)",
        "status": "OK"
      }
    },
    "verification": "Auto-Synced",
    "division": "Audio",
    "date": "2026-09-24",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:19.028Z",
      "deviceOS": "macOS"
    },
    "_source": "google_sheet",
    "followUp": "1 set backline dalam kondisi normal(siap pakai)",
    "result": "OK",
    "staffName": "Taufik Diana",
    "status": "Close"
  },
  {
    "id": "log-20260924-yudis-73-0",
    "followUp": "",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "status": "Close",
    "result": "OK",
    "_source": "google_sheet",
    "activity": "cek 1 set backline",
    "_syncMeta": {
      "updatedAt": "2026-10-05T10:44:21.067Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "System Canonical Sync"
    },
    "staffName": "Yudis",
    "date": "2026-09-24",
    "verification": "Auto-Synced",
    "division": "Audio"
  },
  {
    "id": "log-gsheet-v2-2026-09-24-Heri--_Bersih_bersih_bok",
    "staffName": "Heri",
    "_source": "google_sheet",
    "status": "Close",
    "followUp": "Pengecekan selesai aman",
    "division": "Lighting",
    "_syncedAt": "2026-09-30T06:48:26.402Z",
    "activity": "- Bersih bersih bok",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:19.028Z"
    },
    "checklists": {
      "- Bersih bersih bok": {
        "notes": "Kondisi operasional normal",
        "status": "OK"
      }
    },
    "verification": "Supervisor Operasional",
    "date": "2026-09-24",
    "result": "OK"
  },
  {
    "id": "log-gsheet-v2-2026-09-24-Heri--_Mirorrball_Ter_Hardcase",
    "date": "2026-09-24",
    "_syncedAt": "2026-09-29T01:33:05.138Z",
    "division": "Lighting",
    "_syncMeta": {
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "_source": "google_sheet",
    "checklists": {
      "- Mirorrball Ter Hardcase": {
        "status": "OK",
        "notes": "1 Unit Mirror-Ball sudah masuk Hardcase"
      }
    },
    "result": "OK",
    "activity": "- Mirorrball Ter Hardcase",
    "followUp": "1 Unit Mirror-Ball sudah masuk Hardcase",
    "verification": "Supervisor Operasional",
    "staffName": "Heri",
    "status": "Close"
  },
  {
    "id": "log-gsheet-v2-2026-09-24-Heri--_Set_Up_Layout_Gudang",
    "date": "2026-09-24",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-01T22:43:01.721Z",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    },
    "_syncedAt": "2026-09-29T01:45:59.469Z",
    "followUp": "",
    "verification": "Supervisor Operasional",
    "result": "OK",
    "activity": "- Set Up Layout Gudang",
    "_source": "google_sheet",
    "division": "Lighting",
    "staffName": "Heri",
    "status": "Close",
    "checklists": {
      "- Set Up Layout Gudang": {
        "status": "OK",
        "notes": "Kondisi operasional normal"
      }
    }
  },
  {
    "id": "log-gsheet-v2-2026-09-24-Muhamad_Rahmat-cek_komponen_sub_KLA",
    "division": "Audio",
    "date": "2026-09-24",
    "activity": "cek komponen sub KLA",
    "checklists": {
      "cek komponen sub KLA": {
        "notes": "isu komponen KLA problem ngeleker ternyata normal(siap pakai)",
        "status": "OK"
      }
    },
    "verification": "Supervisor Operasional",
    "staffName": "Muhamad Rahmat",
    "result": "OK",
    "status": "Close",
    "_source": "google_sheet",
    "followUp": "isu komponen KLA problem ngeleker ternyata normal(siap pakai)",
    "_syncedAt": "2026-09-29T01:45:58.985Z",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.721Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome"
    }
  },
  {
    "id": "log-gsheet-v2-2026-09-24-Mulyana--_repair_12_kabinet",
    "date": "2026-09-24",
    "followUp": "8 Panel cabinet blm clear",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.721Z"
    },
    "_syncedAt": "2026-09-29T01:45:59.954Z",
    "result": "NG",
    "_source": "google_sheet",
    "checklists": {
      "- repair 12 kabinet": {
        "status": "NG",
        "notes": "8 Panel cabinet blm clear"
      }
    },
    "activity": "- repair 12 kabinet",
    "division": "Videotron",
    "staffName": "Mulyana",
    "status": "Open",
    "verification": "Supervisor Operasional"
  },
  {
    "id": "log-gsheet-v2-2026-09-24-Mulyana--1_kabinet_ilang_jalur",
    "_syncedAt": "2026-09-29T01:33:11.505Z",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "browser": "Chrome"
    },
    "status": "Open",
    "followUp": "3 kabinet ilang jalur",
    "division": "Service",
    "staffName": "Mulyana",
    "date": "2026-09-24",
    "activity": "-1 kabinet ilang jalur",
    "verification": "Supervisor Operasional",
    "_source": "google_sheet",
    "checklists": {
      "-1 kabinet ilang jalur": {
        "status": "NG",
        "notes": "3 kabinet ilang jalur"
      }
    },
    "result": "NG"
  },
  {
    "id": "log-gsheet-v2-2026-09-24-Mulyana--1_kabinet_ngacing",
    "followUp": "5 kabinet kena ic warna",
    "checklists": {
      "-1 kabinet ngacing": {
        "status": "NG",
        "notes": "5 kabinet kena ic warna"
      }
    },
    "staffName": "Mulyana",
    "_source": "google_sheet",
    "verification": "Supervisor Operasional",
    "status": "Open",
    "date": "2026-09-24",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.722Z"
    },
    "_syncedAt": "2026-09-29T01:33:10.058Z",
    "activity": "-1 kabinet ngacing",
    "division": "Service",
    "result": "NG"
  },
  {
    "id": "log-gsheet-v2-2026-09-24-Mulyana--10_kabinet_dead_pixel",
    "verification": "Supervisor Operasional",
    "staffName": "Mulyana",
    "checklists": {
      "-10 kabinet dead pixel": {
        "status": "NG",
        "notes": "Kendala operasional terdeteksi"
      }
    },
    "date": "2026-09-24",
    "activity": "-10 kabinet dead pixel",
    "division": "Service",
    "status": "Open",
    "_source": "google_sheet",
    "followUp": "Perlu perbaikan teknis",
    "_syncedAt": "2026-09-29T01:33:12.969Z",
    "result": "NG",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.722Z"
    }
  },
  {
    "id": "log-gsheet-v2-2026-09-24-Mulyana--ganti_kuncian_kabel",
    "followUp": "selesai di ganti kunci kabel",
    "_source": "google_sheet",
    "checklists": {
      "-ganti kuncian kabel": {
        "notes": "selesai di ganti kunci kabel",
        "status": "NG"
      }
    },
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "browser": "Chrome"
    },
    "verification": "Supervisor Operasional",
    "_syncedAt": "2026-09-29T01:33:14.449Z",
    "status": "Open",
    "date": "2026-09-24",
    "result": "NG",
    "staffName": "Mulyana",
    "activity": "-ganti kuncian kabel",
    "division": "Service"
  },
  {
    "id": "log-gsheet-v2-2026-09-24-Mulyana--sortir_masking",
    "status": "Close",
    "verification": "Supervisor Operasional",
    "division": "Service",
    "activity": "-sortir masking",
    "checklists": {
      "-sortir masking": {
        "notes": "Kondisi operasional normal",
        "status": "OK"
      }
    },
    "_syncedAt": "2026-09-29T01:33:15.947Z",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.722Z"
    },
    "date": "2026-09-24",
    "result": "OK",
    "staffName": "Mulyana",
    "followUp": "",
    "_source": "google_sheet"
  },
  {
    "id": "log-gsheet-v2-2026-09-24-Taufik_Diana-setup_layout_hardcase_gudang",
    "status": "Close",
    "verification": "Supervisor Operasional",
    "_syncedAt": "2026-09-30T06:47:43.375Z",
    "followUp": "1 set backline dalam kondisi normal(siap pakai)",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-02T10:00:47.990Z"
    },
    "_source": "google_sheet",
    "staffName": "Taufik Diana",
    "date": "2026-09-24",
    "result": "OK",
    "division": "Audio",
    "activity": "setup layout hardcase gudang",
    "checklists": {
      "setup layout hardcase gudang": {
        "notes": "1 set backline dalam kondisi normal(siap pakai)",
        "status": "OK"
      }
    }
  },
  {
    "id": "log-gsheet-v2-2026-09-24-Yudishtira_Purnama_A-cek_1_set_backline",
    "activity": "cek 1 set backline",
    "date": "2026-09-24",
    "status": "Close",
    "division": "Audio",
    "checklists": {
      "cek 1 set backline": {
        "notes": "Kondisi operasional normal",
        "status": "OK"
      }
    },
    "staffName": "Yudishtira Purnama A",
    "result": "OK",
    "_source": "google_sheet",
    "verification": "Supervisor Operasional",
    "followUp": "Pengecekan selesai",
    "_syncedAt": "2026-09-29T01:33:02.305Z",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome"
    }
  },
  {
    "id": "log-20260928-iwankurniawan-53",
    "status": "Close",
    "followUp": "*MIC SM58 ORIGINAL 16 PCS, SM 58 KW 1PCS, VXT 7PCS, SAMSON 3PCS, C1000 HITAM 7PCS, C1000 GOLD 8PCS, AUDIX D6 1PCS, SM57 13PCS ( -6 )",
    "result": "OK",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "status": "OK",
        "notes": "*MIC SM58 ORIGINAL 16 PCS, SM 58 KW 1PCS, VXT 7PCS, SAMSON 3PCS, C1000 HITAM 7PCS, C1000 GOLD 8PCS, AUDIX D6 1PCS, SM57 13PCS ( -6 )"
      }
    },
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:19.028Z"
    },
    "activity": "*iventory mic\n*cat mic VXT",
    "date": "2026-09-28",
    "staffName": "Iwan Kurniawan",
    "verification": "Auto-Synced",
    "division": "Audio"
  },
  {
    "id": "log-20260928-jay-95-0",
    "verification": "Auto-Synced",
    "status": "Close",
    "result": "OK",
    "followUp": "Menghitung jumlah Fisik Unit",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "staffName": "Jay",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.069Z"
    },
    "division": "Multimedia",
    "date": "2026-09-28",
    "activity": "Bantu cek  Data Inventory dan cek fisik unit Divisi Sound",
    "_source": "google_sheet"
  },
  {
    "id": "log-20260928-kharo-84-0",
    "division": "Videotron",
    "checklists": {
      "Sync": {
        "status": "OK",
        "notes": "Synced from Google Sheet"
      }
    },
    "date": "2026-09-28",
    "verification": "Auto-Synced",
    "activity": "repair 8 kabinet led",
    "status": "Close",
    "_source": "google_sheet",
    "staffName": "Kharo",
    "followUp": "Selesai 7 kabinet",
    "result": "OK",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "System Canonical Sync",
      "updatedAt": "2026-10-05T10:44:21.068Z"
    }
  },
  {
    "id": "log-20260928-muhamadrahmat-54",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-05T09:22:19.028Z",
      "deviceType": "Desktop"
    },
    "verification": "Auto-Synced",
    "staffName": "Muhamad Rahmat",
    "followUp": "*MIC SM58 ORIGINAL 16 PCS, SM 58 KW 1PCS, VXT 7PCS, SAMSON 3PCS, C1000 HITAM 7PCS, C1000 GOLD 8PCS, AUDIX D6 1PCS, SM57 13PCS ( -6 )",
    "_source": "google_sheet",
    "result": "OK",
    "division": "Audio",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "status": "OK",
        "notes": "*MIC SM58 ORIGINAL 16 PCS, SM 58 KW 1PCS, VXT 7PCS, SAMSON 3PCS, C1000 HITAM 7PCS, C1000 GOLD 8PCS, AUDIX D6 1PCS, SM57 13PCS ( -6 )"
      }
    },
    "date": "2026-09-28",
    "status": "Close",
    "activity": "*iventory mic\n*cat mic VXT"
  },
  {
    "id": "log-20260928-mulyadi-55",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T22:43:01.724Z",
      "browser": "Chrome"
    },
    "verification": "Auto-Synced",
    "staffName": "Mulyadi",
    "activity": "Bantu cek Data Inventory dan cek fisik unit Divisi Sound",
    "status": "Close",
    "division": "Multimedia",
    "result": "OK",
    "followUp": "Menghitung jumlah Fisik Unit",
    "date": "2026-09-28",
    "_source": "google_sheet",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "Menghitung jumlah Fisik Unit",
        "status": "OK"
      }
    }
  },
  {
    "id": "log-20260928-ramdani-52",
    "checklists": {
      "Kesiapan Fisik & Operasional": {
        "notes": "*MIC SM58 ORIGINAL 16 PCS, SM 58 KW 1PCS, VXT 7PCS, SAMSON 3PCS, C1000 HITAM 7PCS, C1000 GOLD 8PCS, AUDIX D6 1PCS, SM57 13PCS ( -6 )",
        "status": "OK"
      }
    },
    "_source": "google_sheet",
    "activity": "*iventory mic\n*cat mic VXT",
    "division": "Audio",
    "verification": "Auto-Synced",
    "followUp": "*MIC SM58 ORIGINAL 16 PCS, SM 58 KW 1PCS, VXT 7PCS, SAMSON 3PCS, C1000 HITAM 7PCS, C1000 GOLD 8PCS, AUDIX D6 1PCS, SM57 13PCS ( -6 )",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:19.028Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "staffName": "Ramdani",
    "status": "Close",
    "result": "OK",
    "date": "2026-09-28"
  },
  {
    "id": "log-gsheet-v2-2026-09-28-Iwan_Kurniawan-_iventory_mic__cat_mic_VXT",
    "date": "2026-09-28",
    "followUp": "*MIC SM 58 KW 1PCS",
    "_syncedAt": "2026-09-30T06:49:03.105Z",
    "_source": "google_sheet",
    "result": "OK",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-02T10:00:47.990Z",
      "deviceType": "Desktop"
    },
    "staffName": "Iwan Kurniawan",
    "division": "Audio",
    "checklists": {
      "*iventory mic\n*cat mic VXT": {
        "status": "OK",
        "notes": "*MIC SM 58 KW 1PCS"
      }
    },
    "status": "Close",
    "verification": "Supervisor Operasional",
    "activity": "*iventory mic\n*cat mic VXT"
  },
  {
    "id": "log-gsheet-v2-2026-09-28-Muhamad_Rahmat-_iventory_mic__cat_mic_VXT",
    "status": "Close",
    "staffName": "Muhamad Rahmat",
    "_source": "google_sheet",
    "followUp": "*MIC VXT 7PCS",
    "division": "Audio",
    "activity": "*iventory mic\n*cat mic VXT",
    "_syncedAt": "2026-09-30T06:49:28.269Z",
    "result": "OK",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-02T10:00:47.990Z"
    },
    "checklists": {
      "*iventory mic\n*cat mic VXT": {
        "notes": "*MIC VXT 7PCS",
        "status": "OK"
      }
    },
    "verification": "Supervisor Operasional",
    "date": "2026-09-28"
  },
  {
    "id": "log-gsheet-v2-2026-09-28-Mulyadi-Bantu_cek__Data_Inventory_dan_",
    "_source": "google_sheet",
    "date": "2026-09-28",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T22:43:01.721Z"
    },
    "_syncedAt": "2026-09-29T01:46:01.352Z",
    "activity": "Bantu cek  Data Inventory dan cek fisik unit Divisi Sound",
    "division": "Multimedia",
    "checklists": {
      "Bantu cek  Data Inventory dan cek fisik ": {
        "notes": "Menghitung jumlah Fisik Unit",
        "status": "OK"
      }
    },
    "result": "OK",
    "followUp": "Menghitung jumlah Fisik Unit",
    "status": "Close",
    "staffName": "Mulyadi",
    "verification": "Supervisor Operasional"
  },
  {
    "id": "log-gsheet-v2-2026-09-28-Mulyana--_1_kabinet_ilang_jalur",
    "_syncedAt": "2026-09-29T01:33:19.786Z",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    },
    "status": "Open",
    "division": "Service",
    "activity": "- 1 kabinet ilang jalur",
    "staffName": "Mulyana",
    "result": "NG",
    "checklists": {
      "- 1 kabinet ilang jalur": {
        "notes": "Kendala operasional terdeteksi",
        "status": "NG"
      }
    },
    "followUp": "Perlu perbaikan teknis",
    "verification": "Supervisor Operasional",
    "_source": "google_sheet",
    "date": "2026-09-28"
  },
  {
    "id": "log-gsheet-v2-2026-09-28-Mulyana--_7_kabinet_dead_pixel",
    "activity": "- 7 kabinet dead pixel",
    "_source": "google_sheet",
    "division": "Service",
    "staffName": "Mulyana",
    "checklists": {
      "- 7 kabinet dead pixel": {
        "status": "NG",
        "notes": "Kendala operasional terdeteksi"
      }
    },
    "verification": "Supervisor Operasional",
    "result": "NG",
    "_syncedAt": "2026-09-29T01:33:18.230Z",
    "_syncMeta": {
      "updatedAt": "2026-10-01T22:43:01.722Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "browser": "Chrome"
    },
    "followUp": "Perlu perbaikan teknis",
    "status": "Open",
    "date": "2026-09-28"
  },
  {
    "id": "log-gsheet-v2-2026-09-28-Mulyana-repair_8_kabinet_led",
    "status": "Open",
    "checklists": {
      "repair 8 kabinet led": {
        "status": "NG",
        "notes": "Kendala operasional terdeteksi"
      }
    },
    "_syncedAt": "2026-09-29T01:46:00.916Z",
    "division": "Videotron",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T22:43:01.721Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "activity": "repair 8 kabinet led",
    "date": "2026-09-28",
    "result": "NG",
    "followUp": "Perlu perbaikan teknis",
    "verification": "Supervisor Operasional",
    "staffName": "Mulyana",
    "_source": "google_sheet"
  },
  {
    "id": "log-gsheet-v2-2026-09-28-Ramdani-_iventory_mic__cat_mic_VXT",
    "activity": "*iventory mic\n*cat mic VXT",
    "checklists": {
      "*iventory mic\n*cat mic VXT": {
        "status": "OK",
        "notes": "*MIC SM58 ORIGINAL 16 PCS"
      }
    },
    "verification": "Supervisor Operasional",
    "division": "Audio",
    "result": "OK",
    "date": "2026-09-28",
    "staffName": "Ramdani",
    "status": "Close",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-02T10:00:47.990Z",
      "deviceOS": "macOS"
    },
    "followUp": "*MIC SM58 ORIGINAL 16 PCS",
    "_syncedAt": "2026-09-30T06:48:58.906Z"
  },
  {
    "id": "log-20260929-unyim-102-0",
    "checklists": {
      "Sync": {
        "notes": "Synced from Google Sheet",
        "status": "OK"
      }
    },
    "activity": "cek laptop baru koneksi ke dlms",
    "result": "OK",
    "_source": "google_sheet",
    "status": "Close",
    "division": "Audio",
    "verification": "Auto-Synced",
    "followUp": "",
    "_syncMeta": {
      "updatedBy": "System Canonical Sync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T10:44:21.069Z"
    },
    "date": "2026-09-29",
    "staffName": "unyim"
  },
  {
    "id": "log-gsheet-v2-2026-09-29-Wahyudin-cek_laptop_baru_koneksi_ke_dlm",
    "status": "Close",
    "staffName": "Wahyudin (Audio)",
    "verification": "Supervisor Operasional",
    "_source": "google_sheet",
    "followUp": "Pengecekan selesai aman",
    "result": "OK",
    "checklists": {
      "cek laptop baru koneksi ke dlms": {
        "status": "OK",
        "notes": "Kondisi operasional normal"
      }
    },
    "division": "Audio",
    "activity": "cek laptop baru koneksi ke dlms",
    "_syncedAt": "2026-09-30T06:50:40.097Z",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-09-30T07:17:45.821Z",
      "deviceOS": "macOS"
    },
    "date": "2026-09-29"
  },
  {
    "id": "log-gsheet-v2-2026-09-29-Wahyudin-kabel_perleng_",
    "status": "Close",
    "staffName": "Wahyudin",
    "date": "2026-09-29",
    "checklists": {
      "kabel perleng.": {
        "status": "OK",
        "notes": "Kondisi operasional normal"
      }
    },
    "verification": "Supervisor Operasional",
    "followUp": "Pengecekan selesai aman",
    "_syncedAt": "2026-09-30T06:50:08.026Z",
    "division": "Audio",
    "_syncMeta": {
      "updatedAt": "2026-09-30T06:50:19.786Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "User"
    },
    "activity": "kabel perleng.",
    "result": "OK",
    "_source": "google_sheet"
  },
  {
    "id": "log-gsheet-v2-2026-09-29-Wahyudin-kabel_snake_16ch",
    "verification": "Supervisor Operasional",
    "result": "OK",
    "division": "Audio",
    "activity": "kabel snake 16ch",
    "_syncedAt": "2026-09-30T06:50:36.760Z",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "User",
      "deviceType": "Desktop",
      "updatedAt": "2026-09-30T06:50:38.276Z"
    },
    "date": "2026-09-29",
    "status": "Close",
    "staffName": "Wahyudin",
    "checklists": {
      "kabel snake 16ch": {
        "status": "OK",
        "notes": "Kondisi operasional normal"
      }
    },
    "_source": "google_sheet",
    "followUp": "Pengecekan selesai aman"
  },
  {
    "id": "log-gsheet-v2-2026-09-29-Wahyudin-kabel_snake_8ch",
    "_source": "google_sheet",
    "followUp": "Pengecekan selesai aman",
    "date": "2026-09-29",
    "verification": "Supervisor Operasional",
    "status": "Close",
    "staffName": "Wahyudin",
    "activity": "kabel snake 8ch",
    "checklists": {
      "kabel snake 8ch": {
        "status": "OK",
        "notes": "Kondisi operasional normal"
      }
    },
    "division": "Audio",
    "result": "OK",
    "_syncMeta": {
      "updatedBy": "User",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-09-30T06:50:34.853Z"
    },
    "_syncedAt": "2026-09-30T06:50:26.243Z"
  },
  {
    "id": "log-gsheet-v2-2026-09-29-Wahyudin-kabel_xlr_",
    "status": "Close",
    "verification": "Supervisor Operasional",
    "_syncedAt": "2026-09-30T06:50:02.783Z",
    "_syncMeta": {
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-09-30T06:50:04.685Z",
      "updatedBy": "User",
      "deviceOS": "macOS"
    },
    "division": "Audio",
    "activity": "kabel xlr.",
    "checklists": {
      "kabel xlr.": {
        "status": "OK",
        "notes": "Kondisi operasional normal"
      }
    },
    "_source": "google_sheet",
    "date": "2026-09-29",
    "followUp": "Pengecekan selesai aman",
    "result": "OK",
    "staffName": "Wahyudin"
  },
  {
    "id": "log-gsheet-v2-2026-09-29-Yudishtira_Purnama_A-inventory_Kabel",
    "status": "Open",
    "_syncedAt": "2026-09-30T06:49:59.216Z",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:19.028Z"
    },
    "followUp": "Menghitung jumlah Fisik Unit/ Sesuai",
    "_source": "google_sheet",
    "division": "Audio",
    "activity": "inventory Kabel",
    "result": "NG",
    "checklists": {
      "inventory Kabel": {
        "notes": "Menghitung jumlah Fisik Unit/ Sesuai",
        "status": "NG"
      }
    },
    "staffName": "Yudishtira Purnama A",
    "verification": "Supervisor Operasional",
    "date": "2026-09-29"
  },
  {
    "id": "log-gsheet-v2-2026-09-30-Heri--_Benerin_Tutup_Jerigen_Smoke",
    "result": "OK",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:19.028Z",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    },
    "_syncedAt": "2026-09-30T10:41:09.498Z",
    "activity": "- Benerin Tutup Jerigen Smoke",
    "verification": "Supervisor Operasional",
    "checklists": {
      "- Benerin Tutup Jerigen Smoke": {
        "notes": "- Sudah di perbaiki",
        "status": "OK"
      }
    },
    "date": "2026-09-30",
    "division": "Lighting",
    "followUp": "- Sudah di perbaiki",
    "_source": "google_sheet",
    "status": "Close",
    "staffName": "Heri"
  },
  {
    "id": "log-gsheet-v2-2026-09-30-Heri--_Cek_smoke_rusak_No__1",
    "activity": "- Cek smoke rusak No. 1",
    "_source": "google_sheet",
    "status": "Open",
    "division": "Lighting",
    "staffName": "Heri",
    "checklists": {
      "- Cek smoke rusak No. 1": {
        "status": "NG",
        "notes": "- Harus Ganti Pompa"
      }
    },
    "date": "2026-09-30",
    "result": "NG",
    "verification": "Supervisor Operasional",
    "_syncMeta": {
      "updatedAt": "2026-09-30T10:40:39.280Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "User",
      "browser": "Chrome"
    },
    "_syncedAt": "2026-09-30T10:40:38.679Z",
    "followUp": "- Harus Ganti Pompa"
  },
  {
    "id": "log-gsheet-v2-2026-09-30-Heri--_Cleaning_Mixer_Tiger_touch_I",
    "result": "OK",
    "staffName": "Heri",
    "division": "Lighting",
    "_source": "google_sheet",
    "activity": "- Cleaning Mixer Tiger touch II , Mixer Titan Quartz",
    "date": "2026-09-30",
    "status": "Close",
    "followUp": "Pengecekan selesai aman",
    "checklists": {
      "- Cleaning Mixer Tiger touch II , Mixer ": {
        "status": "OK",
        "notes": "Kondisi operasional normal"
      }
    },
    "_syncMeta": {
      "updatedBy": "User",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-09-30T10:40:34.140Z",
      "deviceType": "Desktop"
    },
    "_syncedAt": "2026-09-30T10:40:33.577Z",
    "verification": "Supervisor Operasional"
  },
  {
    "id": "log-gsheet-v2-2026-09-30-Heri--_Rapihin_kabel_bekas_pakai_da",
    "staffName": "Heri",
    "date": "2026-09-30",
    "_source": "google_sheet",
    "status": "Close",
    "activity": "- Rapihin kabel bekas pakai dan cover2 bekas pakai",
    "division": "Lighting",
    "verification": "Supervisor Operasional",
    "checklists": {
      "- Rapihin kabel bekas pakai dan cover2 b": {
        "notes": "Kondisi operasional normal",
        "status": "OK"
      }
    },
    "_syncedAt": "2026-09-30T10:40:42.454Z",
    "followUp": "Pengecekan selesai aman",
    "_syncMeta": {
      "updatedBy": "User",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-09-30T10:40:43.013Z",
      "deviceOS": "macOS"
    },
    "result": "OK"
  },
  {
    "id": "log-gsheet-v2-2026-09-30-Heri--_Service_kabel_link",
    "staffName": "Heri",
    "division": "Lighting",
    "date": "2026-09-30",
    "activity": "- Service kabel link",
    "result": "OK",
    "_syncedAt": "2026-09-30T10:40:37.276Z",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedAt": "2026-09-30T10:40:37.820Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "User"
    },
    "verification": "Supervisor Operasional",
    "_source": "google_sheet",
    "status": "Close",
    "followUp": "- Sudah di perbaiki",
    "checklists": {
      "- Service kabel link": {
        "notes": "- Sudah di perbaiki",
        "status": "OK"
      }
    }
  },
  {
    "id": "log-gsheet-v2-2026-09-30-Heri--_servise_1_kabinet_ganti_ic_w",
    "followUp": "Pengecekan selesai aman",
    "checklists": {
      "- servise 1 kabinet ganti ic warna-": {
        "status": "OK",
        "notes": "Kondisi operasional normal"
      }
    },
    "staffName": "Heri",
    "result": "OK",
    "date": "2026-09-30",
    "_syncMeta": {
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-09-30T11:02:38.611Z",
      "updatedBy": "User",
      "deviceOS": "macOS"
    },
    "_source": "google_sheet",
    "_syncedAt": "2026-09-30T11:02:37.997Z",
    "verification": "Supervisor Operasional",
    "activity": "- servise 1 kabinet ganti ic warna-",
    "status": "Close",
    "division": "Videotron"
  },
  {
    "id": "log-gsheet-v2-2026-09-30-Heri--_Set_up_layout_bok_lighting",
    "activity": "- Set up layout bok lighting",
    "verification": "Supervisor Operasional",
    "division": "Lighting",
    "_syncMeta": {
      "updatedAt": "2026-09-30T10:40:41.898Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "User",
      "deviceOS": "macOS"
    },
    "_syncedAt": "2026-09-30T10:40:41.090Z",
    "status": "Close",
    "date": "2026-09-30",
    "_source": "google_sheet",
    "followUp": "Pengecekan selesai aman",
    "result": "OK",
    "staffName": "Heri",
    "checklists": {
      "- Set up layout bok lighting": {
        "status": "OK",
        "notes": "Kondisi operasional normal"
      }
    }
  },
  {
    "id": "log-gsheet-v2-2026-09-30-Heri-Mixer_Ma_Wing__Mixer_GrandMa",
    "followUp": "Pengecekan selesai aman",
    "result": "OK",
    "_source": "google_sheet",
    "_syncedAt": "2026-09-30T10:40:34.714Z",
    "_syncMeta": {
      "updatedAt": "2026-09-30T10:40:35.534Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "User",
      "browser": "Chrome"
    },
    "status": "Close",
    "date": "2026-09-30",
    "activity": "Mixer Ma Wing, Mixer GrandMa",
    "staffName": "Heri",
    "checklists": {
      "Mixer Ma Wing, Mixer GrandMa": {
        "status": "OK",
        "notes": "Kondisi operasional normal"
      }
    },
    "verification": "Supervisor Operasional",
    "division": "Lighting"
  },
  {
    "id": "log-20260901-irfan-0-0",
    "date": "2026-09-01",
    "division": "Videotron",
    "staffName": "Irfan",
    "activity": "- Cek kabel lan",
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
    "id": "log-20260901-ayong-1-0",
    "date": "2026-09-01",
    "division": "Videotron",
    "staffName": "Ayong",
    "activity": "- Bersiin Prosesor dan cek kelengkapan kabel Di Processor",
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
    "id": "log-20260901-kharo-3-0",
    "date": "2026-09-01",
    "division": "Videotron",
    "staffName": "kharo",
    "activity": "1. repair 3 kabinet ic warna  + ganti dead pixel 2 kabinet clear",
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
    "id": "log-20260901-heri-31-0",
    "date": "2026-09-01",
    "division": "Lighting",
    "staffName": "Heri",
    "activity": "Cek Unit Tripot",
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
    "id": "log-20260901-kharo-39-0",
    "date": "2026-09-01",
    "division": "Videotron",
    "staffName": "kharo",
    "activity": "- repair 1 kabinet ganti ic warna + ganti dead pixel",
    "result": "OK",
    "followUp": "1 modul pcb bengkok",
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
    "id": "log-20260901-dani-41-0",
    "date": "2026-09-01",
    "division": "Audio",
    "staffName": "dani",
    "activity": "cleaning up  16 speaker monitor db , LVX 2 unit",
    "result": "OK",
    "followUp": "kondisi baik",
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
    "id": "log-20260901-heri-43-0",
    "date": "2026-09-01",
    "division": "Lighting",
    "staffName": "Heri",
    "activity": "Cleaning All Beam 450 24 Unit (No. 1 - 24)",
    "result": "OK",
    "followUp": "Normal Semua",
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
    "id": "log-rep-20261001-staff-irvan-4",
    "date": "2026-10-01",
    "division": "Videotron",
    "staffName": "Muhamad Irvan",
    "activity": "- Cek kabel lan",
    "result": "OK",
    "followUp": "Aman",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "- Cek kabel lan": {
        "status": "OK",
        "notes": "Aman"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-rep-20261001-staff-ayong-5",
    "date": "2026-10-01",
    "division": "Videotron",
    "staffName": "Ayong Sumarsih",
    "activity": "- Bersiin Prosesor dan cek kelengkapan kabel Di Processor\n- Nyuci pemberat",
    "result": "OK",
    "followUp": "Sudah\nSudah",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "- Bersiin Prosesor dan cek kelengkapan k": {
        "status": "OK",
        "notes": "Sudah\nSudah"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-rep-20261002-staff-mulyana-7",
    "date": "2026-10-02",
    "division": "Videotron",
    "staffName": "Mulyana",
    "activity": "1. repair 3 kabinet ic warna  + ganti dead pixel 2 kabinet clear\n2. cek 11 modul kabinet\n- 2 modul ilang jalur ic\n- 3 modul ilang jalur pixel\n- 3 modul kena ic warna\n- 1 modul arus konslet\n3. copot ic buat kanibal\n4. sortir masking",
    "result": "NG",
    "followUp": "Aman\nBeres\nPerbaikan\nPerbaikan\nPerbaikan\nPerbaikan\nSudah\nSudah",
    "status": "Open",
    "verification": "Auto-Synced",
    "checklists": {
      "1. repair 3 kabinet ic warna  + ganti de": {
        "status": "NG",
        "notes": "Aman\nBeres\nPerbaikan\nPerbaikan\nPerbaikan\nPerbaikan\nSudah\nSudah"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-rep-20261003-staff-heri-35",
    "date": "2026-10-03",
    "division": "Lighting",
    "staffName": "Heri",
    "activity": "Cek Unit Tripot\n- A , Tripot Centurion\n- B , Tripot Centurion\n- C , Tripot Lama (Berat)\n- D , Tripot Lama\n- E , Tripot Lama ( Tipis Enteng )\n- F , Tripot Lama ( Tipis Enteng )\n- G , Tripot Custom",
    "result": "OK",
    "followUp": "Normal\nNormal\nNormal\nNormal\nNormal\nNormal\nKeadaan tidak komplite",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Cek Unit Tripot\n- A , Tripot Centurion\n-": {
        "status": "OK",
        "notes": "Normal\nNormal\nNormal\nNormal\nNormal\nNormal\nKeadaan tidak komplite"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-rep-20261006-staff-rahmat-49",
    "date": "2026-10-06",
    "division": "Audio",
    "staffName": "Muhamad Rahmat",
    "activity": "cek unit AVANDA210",
    "result": "OK",
    "followUp": "-semua unit AVANDA210 kondisi normaL",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "cek unit AVANDA210": {
        "status": "OK",
        "notes": "-semua unit AVANDA210 kondisi normaL"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-rep-20261006-staff-yudish-50",
    "date": "2026-10-06",
    "division": "Audio",
    "staffName": "Yudishtira Purnama A",
    "activity": "cek unit AVANDA210",
    "result": "OK",
    "followUp": "Aman",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "cek unit AVANDA210": {
        "status": "OK",
        "notes": "Aman"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-rep-20261006-staff-suryana-51",
    "date": "2026-10-06",
    "division": "Audio",
    "staffName": "Suryana",
    "activity": "cek unit AVANDA210",
    "result": "OK",
    "followUp": "Kondisi Baik",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "cek unit AVANDA210": {
        "status": "OK",
        "notes": "Kondisi Baik"
      }
    },
    "_source": "google_sheet"
  },
  {
    "id": "log-rep-20261009-staff-irvan-59",
    "date": "2026-10-09",
    "division": "Videotron",
    "staffName": "Muhamad Irvan",
    "activity": "Cek hanging bar gantung",
    "result": "OK",
    "followUp": "- Kondisi Baik",
    "status": "Close",
    "verification": "Auto-Synced",
    "checklists": {
      "Cek hanging bar gantung": {
        "status": "OK",
        "notes": "- Kondisi Baik"
      }
    },
    "_source": "google_sheet"
  }
];

export const CANONICAL_FIRESTORE_FINDINGS: Finding[] = [
  {
    "id": "gsheet-finding-2021-09-21--_Cover2_lengkap",
    "status": "Open",
    "issue": "- Cover2 lengkap",
    "pic": "Heri",
    "dateCreated": "2021-09-21",
    "division": "Lighting",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-05T09:22:42.226Z"
    },
    "priority": "Sedang",
    "targetDate": "2021-09-21",
    "_syncedAt": "2026-09-22T08:07:45.398Z",
    "equipment": "- Rapihin Cover Bekas Pakai",
    "_source": "google_sheet"
  },
  {
    "id": "fd-20260903-mboh-amplifier",
    "status": "Open",
    "date": "2026-09-03",
    "division": "Audio",
    "updatedAt": "2026-09-20T13:23:19.396Z",
    "targetDate": "2026-09-17",
    "issue": "Modul Amplifier bermasalah. Saat terkena beban input besar, suara yang dikeluarkan menjadi serak. Perlu pengecekan modul amplifier dan spare-part tweeter.",
    "pic": "Muhamad Rahmat",
    "_source": "google_sheet_remark",
    "equipment": "DBTech Speaker No.18 — Modul Amplifier",
    "priority": "Sedang",
    "dateCreated": "2026-09-03",
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-02T07:01:43.397Z"
    }
  },
  {
    "id": "find-20260903-dbtech18",
    "_syncMeta": {
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:42.226Z",
      "updatedBy": "BatchSync"
    },
    "equipment": "Speaker dBTech DVA T15 No. 18",
    "priority": "Sedang",
    "issue": "DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasuil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event. Rekomendasi untuk di cek oleh team service terutama pada modul Amplifier.",
    "dateCreated": "2026-09-03",
    "pic": "Team Service / Mboh",
    "date": "2026-09-03",
    "updatedAt": "2026-09-20T13:23:19.396Z",
    "targetDate": "2026-09-08",
    "division": "Audio",
    "status": "Open",
    "_source": "google_sheet_remark"
  },
  {
    "id": "gsheet-finding-2026-09-03--_DB_Tech_No_18_Ada_Kendala_di",
    "equipment": "Amplifier Unit (Audio)",
    "_source": "google_sheet",
    "division": "Audio",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:42.226Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "issue": "- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event.\n-Rekomendasi untuk di cek oleh team service terutama pada modul Amplifier dan pengecekan  spare-part Tweter",
    "_syncedAt": "2026-09-20T13:23:22.579Z",
    "dateCreated": "2026-09-03",
    "priority": "Sedang",
    "status": "Open",
    "targetDate": "2026-09-03",
    "pic": "Muhamad Rahmat"
  },
  {
    "id": "gsheet-finding-2026-09-03--Rekomendasi_untuk_di_cek_oleh",
    "status": "Open",
    "issue": "-Rekomendasi untuk di cek oleh team service terutama pada modul Amplifier dan pengecekan  spare-part Tweter",
    "division": "Audio",
    "dateCreated": "2026-09-03",
    "pic": "Yudishtira Purnama A",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:42.226Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "priority": "Sedang",
    "targetDate": "2026-09-03",
    "_syncedAt": "2026-09-20T08:32:31.627Z",
    "_source": "google_sheet",
    "equipment": "Amplifier Unit (Audio)"
  },
  {
    "id": "find-20260904-panel-audio",
    "targetDate": "2026-09-05",
    "dateCreated": "2026-09-04",
    "status": "Close",
    "equipment": "Panel Distribusi Listrik Audio 3 Phase",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:42.226Z"
    },
    "pic": "Opik / Buluk",
    "division": "Audio",
    "issue": "Pengecekan Panel 3 Unit: 2 panel Sudah OK. 1 Ganti Stop Kontak, 1 Ganti Legran Cewe (Perbaikan selesai dilakukan Opik & Mboh pada 5 Sept, panel aman & siap pakai).",
    "priority": "Sedang",
    "_source": "google_sheet"
  },
  {
    "id": "gsheet-finding-2026-09-04--_1_Ganti_Stop_Kontak__1_Ganti",
    "_syncedAt": "2026-09-20T13:23:24.111Z",
    "status": "Open",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:42.226Z"
    },
    "issue": "- 1 Ganti Stop Kontak, 1 Ganti Legran Cewe",
    "targetDate": "2026-09-04",
    "equipment": "",
    "priority": "Sedang",
    "pic": "Suryana",
    "dateCreated": "2026-09-04",
    "division": "Audio",
    "_source": "google_sheet"
  },
  {
    "id": "fd-20260907-heri-parled-warm-01",
    "targetDate": "2026-09-14",
    "dateCreated": "2026-09-07",
    "approvedBy": "Seno Subroto",
    "issue": "Warm mati total: no.12, 25, 29. Warm hanya separo: no.3, 32. Harus service segera.",
    "pic": "Heri",
    "equipment": "Parled Warm — Unit No.12, 25, 29 (Mati) & No.3, 32 (Separo)",
    "_syncMeta": {
      "updatedAt": "2026-10-02T07:01:43.397Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "division": "Lighting",
    "approvedAt": "2026-09-13",
    "status": "Open",
    "priority": "Tinggi",
    "_source": "google_sheet_remark",
    "updatedAt": "2026-09-20T13:23:19.396Z",
    "date": "2026-09-07"
  },
  {
    "id": "gsheet-finding-2026-09-07-Harus_service_warm_mati_no_12_",
    "dateCreated": "2026-09-07",
    "status": "Open",
    "issue": "Harus service warm mati no 12,25,29 | Warm Separo no 3,32",
    "_source": "google_sheet",
    "division": "Lighting",
    "equipment": "PAR LED (Lighting)",
    "pic": "Heri",
    "targetDate": "2026-09-07",
    "priority": "Sedang",
    "_syncedAt": "2026-09-29T02:35:38.773Z",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-02T07:01:43.397Z"
    }
  },
  {
    "id": "gsheet-finding-2026-09-07-Harus_service_warm_mati_no_12,",
    "equipment": "Cek unit, Cleaning, Cek Colour Parled",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-09-28T11:34:23.572Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "priority": "Sedang",
    "_syncedAt": "2026-09-11T22:46:35.298Z",
    "issue": "Harus service warm mati no 12,25,29 | Warm Separo no 3,32",
    "targetDate": "2026-09-07",
    "_source": "google_sheet",
    "division": "Lighting",
    "pic": "Heri",
    "dateCreated": "2026-09-07",
    "status": "Open"
  },
  {
    "id": "fd-20260910-heri-parled-warm-02",
    "division": "Lighting",
    "status": "Open",
    "date": "2026-09-10",
    "updatedAt": "2026-09-20T13:23:19.396Z",
    "issue": "Warm separo pada unit no.19, 20, 27. Harus service.",
    "targetDate": "2026-09-17",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-02T07:01:43.397Z"
    },
    "equipment": "Parled Warm — Unit No.19, 20, 27 (Separo)",
    "pic": "Heri",
    "_source": "google_sheet_remark",
    "priority": "Tinggi",
    "dateCreated": "2026-09-10"
  },
  {
    "id": "find-20260910-parled",
    "issue": "Harus service warm separo no. 19, 20, 27.",
    "equipment": "PAR LED Warm White (Lighting)",
    "targetDate": "2026-09-12",
    "_source": "google_sheet",
    "division": "Lighting",
    "_syncMeta": {
      "updatedAt": "2026-09-28T11:34:23.572Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "status": "Open",
    "priority": "Sedang",
    "pic": "Heri",
    "dateCreated": "2026-09-10"
  },
  {
    "id": "find-20260910-xlr",
    "priority": "Sedang",
    "_source": "google_sheet",
    "pic": "Heri",
    "issue": "Perbaikan kabel link Beam 450, BSW 550, B-Eye & kabel XLR link.",
    "targetDate": "2026-09-10",
    "equipment": "Kabel XLR Link Lighting",
    "status": "Close",
    "division": "Lighting",
    "dateCreated": "2026-09-10",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:42.226Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    }
  },
  {
    "id": "gsheet-finding-2026-09-10--_Harus_service_warm_separo_no",
    "targetDate": "2026-09-10",
    "pic": "Heri",
    "_source": "google_sheet",
    "priority": "Sedang",
    "dateCreated": "2026-09-10",
    "_syncedAt": "2026-09-29T02:35:38.799Z",
    "division": "Lighting",
    "issue": "- Harus service warm separo no. 19,20,27",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-02T07:01:43.397Z",
      "deviceOS": "macOS"
    },
    "equipment": "- Parled",
    "status": "Open"
  },
  {
    "id": "gsheet-finding-2026-09-10--_Sudah_service",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:42.227Z"
    },
    "pic": "Heri",
    "priority": "Sedang",
    "_syncedAt": "2026-09-20T13:23:29.634Z",
    "status": "Open",
    "equipment": "- XLR (Link)",
    "issue": "- Sudah service",
    "targetDate": "2026-09-10",
    "_source": "google_sheet",
    "dateCreated": "2026-09-10",
    "division": "Lighting"
  },
  {
    "id": "gsheet-finding-2026-09-10-unit_dalam_klondisi_aman_tida_",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:42.227Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "_syncedAt": "2026-09-11T20:27:22.140Z",
    "dateCreated": "2026-09-10",
    "targetDate": "2026-09-10",
    "equipment": "- ngulik fitur DLMS marani MIR480I dan MIR480A\n- CALIBRASI MIC RTA BEHRINGER ECM8000\n- revisi pemasangan BEHRINGER ULTRA LINK",
    "approvedBy": "Seno Subroto",
    "approvedAt": "2026-09-11",
    "pic": "Muhamad Rahmat",
    "division": "Audio",
    "_source": "google_sheet",
    "priority": "Sedang",
    "issue": "unit dalam klondisi aman tida ada kendala",
    "status": "Close"
  },
  {
    "id": "gsheet-finding-2026-09-11-Kondisi_Bersih_I_No__13_Harus_",
    "status": "Open",
    "issue": "Kondisi Bersih I No. 13 Harus Servic ( Merah Mati )",
    "equipment": "- Cleaning Parled No. 11,13,14,15,16,17",
    "_syncedAt": "2026-09-17T01:18:58.288Z",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-09-28T11:34:23.572Z"
    },
    "priority": "Sedang",
    "dateCreated": "2026-09-11",
    "division": "Lighting",
    "pic": "Heri",
    "targetDate": "2026-09-11",
    "_source": "google_sheet"
  },
  {
    "id": "fd-20260912-heri-parled-13",
    "priority": "Tinggi",
    "_source": "google_sheet_remark",
    "targetDate": "2026-09-19",
    "issue": "Parled No.13: LED merah mati total. Harus service segera.",
    "equipment": "Parled No.13 — LED Merah Mati",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-02T07:01:43.397Z"
    },
    "dateCreated": "2026-09-12",
    "date": "2026-09-12",
    "updatedAt": "2026-09-20T13:23:19.396Z",
    "division": "Lighting",
    "status": "Open",
    "pic": "Heri"
  },
  {
    "id": "find-20260907-parled",
    "issue": "Parled Warm mati No. 12, 25, 29 & Warm separo No. 3, 32",
    "approvedAt": "2026-09-14",
    "priority": "Sedang",
    "_source": "google_sheet",
    "dateCreated": "2026-09-12",
    "pic": "Heri",
    "targetDate": "2026-09-09",
    "approvedBy": "Seno",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:42.226Z"
    },
    "_syncedAt": "2026-09-29T02:35:38.826Z",
    "equipment": "PAR LED Warm White (Lighting)",
    "status": "Open",
    "division": "Lighting"
  },
  {
    "id": "find-20260912-parled13",
    "division": "Lighting",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-09-28T11:34:23.572Z"
    },
    "pic": "Heri",
    "equipment": "PAR LED No. 13 (Lighting)",
    "dateCreated": "2026-09-12",
    "_source": "google_sheet",
    "issue": "Harus Service ( Merah Mati ).",
    "status": "Open",
    "priority": "Sedang",
    "targetDate": "2026-09-15"
  },
  {
    "id": "gsheet-finding-2026-09-12-Kondisi_Bersih_I_No__13_Harus_",
    "_syncedAt": "2026-09-29T02:35:38.826Z",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-02T07:01:43.397Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "status": "Open",
    "issue": "Kondisi Bersih I No. 13 Harus Servic ( Merah Mati )",
    "division": "Lighting",
    "equipment": "PAR LED (Lighting)",
    "_source": "google_sheet",
    "priority": "Sedang",
    "pic": "Heri",
    "targetDate": "2026-09-12",
    "dateCreated": "2026-09-12"
  },
  {
    "id": "fd-20260916-dani-sm57",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-05T09:22:42.226Z",
      "deviceType": "Desktop"
    },
    "pic": "Ramdani",
    "equipment": "Mic SM57 — Rusak & Hilang",
    "date": "2026-09-16",
    "division": "Audio",
    "status": "Open",
    "issue": "Hasil inventaris: SM57 Rusak 4 unit, Hilang 9 unit. Perlu tindak lanjut dan pemenuhan unit pengganti.",
    "_source": "google_sheet_remark",
    "priority": "Tinggi",
    "updatedAt": "2026-09-20T13:23:19.396Z",
    "targetDate": "2026-09-23",
    "dateCreated": "2026-09-16"
  },
  {
    "id": "fd-20260916-heri-smoke-03",
    "_source": "google_sheet_remark",
    "updatedAt": "2026-09-20T13:23:19.396Z",
    "division": "Lighting",
    "pic": "Heri",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:42.226Z"
    },
    "equipment": "Smoke Machine No.3",
    "status": "Open",
    "priority": "Sedang",
    "date": "2026-09-16",
    "issue": "Smoke No.3 ERROR — tidak berfungsi normal saat pengecekan.",
    "targetDate": "2026-09-21",
    "dateCreated": "2026-09-16"
  },
  {
    "id": "find-20260916-smoke3",
    "dateCreated": "2026-09-16",
    "targetDate": "2026-09-18",
    "pic": "Heri",
    "division": "Lighting",
    "status": "Open",
    "_source": "google_sheet",
    "equipment": "Smoke Machine No. 3 (Lighting)",
    "issue": "Smoke No.3 ERORR saat dicek.",
    "priority": "Sedang",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:42.226Z",
      "deviceType": "Desktop"
    }
  },
  {
    "id": "gsheet-finding-2026-09-16-2_Unit_Komponen_Speaker_18inc_",
    "issue": "2 Unit Komponen Speaker 18inc saja untuk di service keluar",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:42.227Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "status": "Open",
    "dateCreated": "2026-09-16",
    "priority": "Sedang",
    "_syncedAt": "2026-09-30T06:45:59.849Z",
    "equipment": "Speaker Unit (Audio)",
    "pic": "Iwan Kurniawan",
    "targetDate": "2026-09-16",
    "division": "Audio",
    "_source": "google_sheet"
  },
  {
    "id": "gsheet-finding-2026-09-16-SM58___Bagus_17__Rusak_1____SM",
    "dateCreated": "2026-09-16",
    "status": "Open",
    "priority": "Sedang",
    "pic": "Ramdani",
    "issue": "SM58 ( Bagus 17, Rusak 1 ), SM57 ( Bagus 11, Rusak 4, Hilang 9 ), VXT ( Bagus 8, Rusak 2 )",
    "_syncedAt": "2026-09-20T13:23:33.410Z",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:42.227Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    },
    "division": "Audio",
    "targetDate": "2026-09-16",
    "_source": "google_sheet",
    "equipment": "Peralatan Audio"
  },
  {
    "id": "fd-20260917-unyim-takel",
    "_source": "google_sheet_remark",
    "division": "Audio",
    "dateCreated": "2026-09-17",
    "updatedAt": "2026-09-20T13:23:19.396Z",
    "targetDate": "2026-09-22",
    "date": "2026-09-17",
    "issue": "Takel 1 Ton: 1 unit LOS (Line of Sight failure). Wajib diperbaiki sebelum digunakan untuk event berikutnya.",
    "pic": "Wahyudin",
    "priority": "Tinggi",
    "equipment": "Takel 1 Ton — Unit LOS",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:42.226Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "status": "Open"
  },
  {
    "id": "fd-20260917-yudis-ampeg",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:42.226Z",
      "deviceOS": "macOS"
    },
    "equipment": "Ampeg SVT-4 — Amplifier Bass harus ganti PTC",
    "priority": "Tinggi",
    "issue": "Ampeg SVT-4 harus service dan ganti komponen PTC. Tidak layak pakai sebelum diperbaiki.",
    "pic": "Yudishtira Purnama A",
    "dateCreated": "2026-09-17",
    "date": "2026-09-17",
    "approvedBy": "Seno Subroto",
    "updatedAt": "2026-09-20T13:23:19.396Z",
    "targetDate": "2026-09-22",
    "approvedAt": "2026-09-22",
    "division": "Audio",
    "status": "Open",
    "_source": "google_sheet_remark"
  },
  {
    "id": "find-20260917-ampeg",
    "_source": "google_sheet",
    "dateCreated": "2026-09-17",
    "issue": "Harus service dan ganti PTC.",
    "priority": "Sedang",
    "targetDate": "2026-09-19",
    "equipment": "Ampeg SVT-4 Bass Amplifier (Audio)",
    "status": "Open",
    "division": "Audio",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:42.226Z"
    },
    "pic": "Yudishtira Purnama A"
  },
  {
    "id": "find-20260917-led-box",
    "pic": "Mulyana",
    "status": "Open",
    "priority": "Tinggi",
    "dateCreated": "2026-09-17",
    "issue": "1 Box Kabinet Kerusakan Berat (Perlu perbaikan modul & power supply oleh team teknis)",
    "_source": "google_sheet",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:42.226Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "targetDate": "2026-09-19",
    "_syncedAt": "2026-09-18T15:10:10.007Z",
    "division": "Videotron",
    "equipment": "Modul Kabinet LED Videotron"
  },
  {
    "id": "find-20260917-sdi50m",
    "status": "Open",
    "issue": "Dari 3 Unit Kabel SDI, 1 Unit Harus Ganti konektor ( 2 Unit Aman ).",
    "targetDate": "2026-09-18",
    "division": "Multimedia",
    "pic": "Mulyadi",
    "_source": "google_sheet",
    "equipment": "Kabel SDI 50 Meter (Multimedia)",
    "dateCreated": "2026-09-17",
    "priority": "Sedang",
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-05T09:22:42.226Z",
      "browser": "Chrome"
    }
  },
  {
    "id": "find-20260917-takel1ton",
    "status": "Open",
    "priority": "Tinggi",
    "issue": "Takel yg 1 Ton LOS 1 Unit wajib di perbaiki.",
    "pic": "Wahyudin",
    "dateCreated": "2026-09-17",
    "targetDate": "2026-09-19",
    "equipment": "Takel 1 Ton (Audio / Rigging)",
    "division": "Audio",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:42.226Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "browser": "Chrome"
    },
    "_source": "google_sheet"
  },
  {
    "id": "gsheet-finding-2026-09-17--_1_Box_Baru_Beres_4_Kabinet_s",
    "priority": "Sedang",
    "_source": "google_sheet",
    "division": "Videotron",
    "equipment": "Modul Kabinet LED Videotron",
    "pic": "Mulyana",
    "issue": "- 1 Box Baru Beres 4 Kabinet sisa 4 perbaikan",
    "targetDate": "2026-09-17",
    "_syncedAt": "2026-09-30T06:46:27.449Z",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:42.227Z"
    },
    "dateCreated": "2026-09-17",
    "status": "Open"
  },
  {
    "id": "gsheet-finding-2026-09-17--_1_Box_Kerusakan_Berat",
    "division": "Videotron",
    "status": "Open",
    "pic": "Mulyana",
    "targetDate": "2026-09-17",
    "equipment": "Modul Kabinet LED Videotron",
    "priority": "Sedang",
    "_source": "google_sheet",
    "issue": "- 1 Box Kerusakan Berat",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:42.229Z",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "_syncedAt": "2026-09-20T13:23:35.538Z",
    "dateCreated": "2026-09-17"
  },
  {
    "id": "gsheet-finding-2026-09-17--_1_Box_Kerusakan_Berat_isi_8_",
    "priority": "Sedang",
    "pic": "Mulyana",
    "dateCreated": "2026-09-17",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:42.229Z",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "_source": "google_sheet",
    "_syncedAt": "2026-09-30T06:43:35.586Z",
    "issue": "- 1 Box Kerusakan Berat isi 8 kabinet",
    "status": "Open",
    "division": "Videotron",
    "targetDate": "2026-09-17",
    "equipment": "Modul Kabinet LED Videotron"
  },
  {
    "id": "gsheet-finding-2026-09-17--_Box_Kerusakan_Berat",
    "_syncedAt": "2026-09-18T14:35:34.860Z",
    "issue": "- Box Kerusakan Berat",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:42.229Z",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync"
    },
    "equipment": "Unit Divisi Audio",
    "dateCreated": "2026-09-17",
    "priority": "Sedang",
    "division": "Audio",
    "status": "Open",
    "_source": "google_sheet",
    "pic": "Mulyana",
    "targetDate": "2026-09-17"
  },
  {
    "id": "gsheet-finding-2026-09-17--_Harus_service_dan_ganti_PTC",
    "_syncedAt": "2026-09-20T13:23:37.407Z",
    "issue": "- Harus service dan ganti PTC",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:42.229Z"
    },
    "equipment": "Amplifier Unit (Audio)",
    "priority": "Sedang",
    "dateCreated": "2026-09-17",
    "division": "Audio",
    "status": "Open",
    "_source": "google_sheet",
    "targetDate": "2026-09-17",
    "pic": "Yudishtira Purnama A"
  },
  {
    "id": "gsheet-finding-2026-09-17--_Takel_yg_1_Ton_LOS_1_Unit_wa",
    "targetDate": "2026-09-17",
    "equipment": "Takel Rigging (Audio)",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:42.229Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "division": "Audio",
    "status": "Open",
    "_syncedAt": "2026-09-29T02:35:38.916Z",
    "priority": "Sedang",
    "pic": "Wahyudin",
    "_source": "google_sheet",
    "dateCreated": "2026-09-17",
    "issue": "- Takel yg 1 Ton LOS 1 Unit wajib di perbaiki"
  },
  {
    "id": "fd-1790080139948351",
    "dateCreated": "2026-09-22",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:42.226Z",
      "browser": "Chrome"
    },
    "pic": "Iwan Kurniawan",
    "status": "Open",
    "targetDate": "2026-09-24",
    "priority": "Sedang",
    "equipment": "Audio - Pembersihan & Pengecekan Fader Bermotor, Knob, Port & Showfile Mixer Digital (Midas)",
    "issue": "fader macet"
  },
  {
    "id": "fd-1790080139948967",
    "dateCreated": "2026-09-22",
    "pic": "Iwan Kurniawan",
    "equipment": "Audio - Kebersihan Area Workshop / Gudang Maintenance & Rak Penyimpanan Audio (5R)",
    "targetDate": "2026-09-24",
    "priority": "Sedang",
    "status": "Open",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:42.226Z",
      "deviceType": "Desktop"
    },
    "issue": "sapu rusak"
  },
  {
    "id": "gsheet-finding-2026-09-22--_Service_Modul_Sub_Kla_No_3__",
    "targetDate": "2026-09-22",
    "pic": "Suryana",
    "dateCreated": "2026-09-22",
    "division": "Audio",
    "priority": "Sedang",
    "_source": "google_sheet",
    "issue": "- Service Modul Sub Kla No.3 ( Kirim Ke PIB )",
    "equipment": "Peralatan Audio",
    "status": "Open",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:42.229Z",
      "deviceType": "Desktop"
    },
    "_syncedAt": "2026-09-25T09:21:24.880Z"
  },
  {
    "id": "gsheet-finding-2026-09-24-3_kabinet_ilang_jalur",
    "equipment": "-1 kabinet ilang jalur",
    "division": "Videotron",
    "_syncedAt": "2026-09-26T11:49:32.856Z",
    "pic": "Mulyana",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:42.229Z",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "browser": "Chrome"
    },
    "_source": "google_sheet",
    "priority": "Sedang",
    "dateCreated": "2026-09-24",
    "status": "Open",
    "targetDate": "2026-09-24",
    "issue": "3 kabinet ilang jalur"
  },
  {
    "id": "gsheet-finding-2026-09-28-Menghitung_jumlah_Fisik_Unit",
    "equipment": "Peralatan Multimedia",
    "division": "Multimedia",
    "_syncedAt": "2026-09-30T06:49:47.537Z",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:42.229Z"
    },
    "pic": "Mulyadi",
    "_source": "google_sheet",
    "priority": "Sedang",
    "dateCreated": "2026-09-28",
    "status": "Open",
    "issue": "Menghitung jumlah Fisik Unit",
    "targetDate": "2026-09-28"
  },
  {
    "id": "gsheet-finding-2026-09-28-Menghitung_jumlah_Fisik_Unit__",
    "_source": "google_sheet",
    "equipment": "",
    "_syncedAt": "2026-09-30T06:49:55.611Z",
    "dateCreated": "2026-09-28",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:42.229Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "priority": "Sedang",
    "pic": "Mulyadi",
    "division": "Multimedia",
    "issue": "Menghitung jumlah Fisik Unit/ Sesuai",
    "targetDate": "2026-09-28",
    "status": "Open"
  },
  {
    "id": "gsheet-finding-2026-09-30--_Harus_Ganti_Pompa",
    "dateCreated": "2026-09-30",
    "division": "Lighting",
    "status": "Open",
    "_syncedAt": "2026-09-30T10:40:39.282Z",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:42.229Z",
      "browser": "Chrome"
    },
    "pic": "Heri",
    "targetDate": "2026-09-30",
    "issue": "- Harus Ganti Pompa",
    "_source": "google_sheet",
    "equipment": "Smoke Machine (Lighting)",
    "priority": "Sedang"
  },
  {
    "id": "gsheet-finding-20261002-mulyana-modul-kabinet",
    "dateCreated": "2026-10-02",
    "division": "Videotron",
    "status": "Open",
    "pic": "Mulyana",
    "targetDate": "2026-10-04",
    "issue": "2 modul hilang jalur IC, 3 modul hilang jalur pixel, 3 modul kena IC warna, 1 modul arus konslet",
    "_source": "google_sheet",
    "equipment": "11 Modul Kabinet Videotron",
    "priority": "Tinggi"
  },
  {
    "id": "gsheet-finding-20261003-heri-tripot-custom",
    "dateCreated": "2026-10-03",
    "division": "Lighting",
    "status": "Open",
    "pic": "Heri",
    "targetDate": "2026-10-05",
    "issue": "Tripot Custom keadaan tidak komplite",
    "_source": "google_sheet",
    "equipment": "Tripot Custom (Lighting)",
    "priority": "Sedang"
  }
];

export const CANONICAL_FIRESTORE_WORK_ORDERS: WorkOrder[] = [
  {
    "id": "wo-20260903-amplifier-dbtech",
    "priority": "Sedang",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:46.565Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "dateCreated": "2026-09-03",
    "progress": 0,
    "findingId": "fd-20260903-mboh-amplifier",
    "equipment": "DBTech Speaker No.18",
    "status": "Pending",
    "deadline": "2026-09-17",
    "_source": "google_sheet_remark",
    "title": "Service Modul Amplifier DBTech No.18",
    "pic": "Mulyana",
    "description": "Pengecekan dan perbaikan modul amplifier pada speaker DBTech No.18. Suara serak saat beban input besar. Cek modul amplifier dan spare-part tweeter.",
    "notes": "Rekomendasi dari: Muhamad Rahmat (Mboh) — Audio",
    "division": "Service"
  },
  {
    "id": "wo-20260903-dbtech-service",
    "findingId": "find-20260903-dbtech18",
    "progress": 100,
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:46.564Z",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "status": "Completed",
    "description": "Modul amplifier DB Tech No. 18 serak saat input besar, telah diperbaiki dan distabilkan.",
    "pic": "Mulyana",
    "title": "Inspeksi & Perbaikan Modul Amplifier DB Tech No. 18",
    "division": "Service",
    "dateCreated": "2026-09-03",
    "deadline": "2026-09-05"
  },
  {
    "id": "wo-20260904-panel-01",
    "progress": 100,
    "priority": "Sedang",
    "description": "Perbaikan panel listrik selesai dilakukan Opik & Buluk pada 5 Sept 2026. 1 Ganti Stop Kontak, 1 Ganti Legrand Cewek. Panel listrik dalam kondisi aman dan siap digunakan untuk event.",
    "deadline": "2026-09-05",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:46.564Z"
    },
    "status": "Completed",
    "title": "Perbaikan Panel Listrik Audio 3 Phase (Ganti Stop Kontak & Legrand Cewek)",
    "dateCreated": "2026-09-04",
    "findingId": "find-20260904-panel-audio",
    "equipment": "Panel Distribusi Listrik Audio 3 Phase",
    "pic": "Taufik Diana / Suryana",
    "notes": "Perbaikan panel listrik selesai dilakukan Opik & Mboh pada 5 Sept 2026. 1 Ganti Stop Kontak, 1 Ganti Legrand Cewek. Panel listrik dalam kondisi aman dan siap digunakan untuk event.",
    "division": "Audio"
  },
  {
    "id": "wo-20260907-parled-warm-01",
    "pic": "Mulyana",
    "deadline": "2026-09-14",
    "priority": "Tinggi",
    "progress": 0,
    "description": "Perbaikan Parled Warm: Unit no.12, 25, 29 mati total. Unit no.3, 32 hanya nyala separo. Perlu service menyeluruh.",
    "status": "In Progress",
    "dateCreated": "2026-09-07",
    "equipment": "Parled Warm Lighting",
    "_source": "google_sheet_remark",
    "findingId": "fd-20260907-heri-parled-warm-01",
    "division": "Service",
    "notes": "Ditemukan oleh: Heri — Divisi Lighting",
    "_syncMeta": {
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:46.565Z",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    },
    "title": "Service Parled Warm — Mati No.12,25,29 & Separo No.3,32"
  },
  {
    "id": "wo-20260909-kabel-audio",
    "title": "Perbaikan / Service Mandiri Kabel Snake 8ch, 16ch, Rumbay Drum 8ch & Ganti Spul Mic EWD",
    "dateCreated": "2026-09-09",
    "division": "Audio",
    "deadline": "2026-09-09",
    "description": "Perbaikan mandiri kabel snake 8 ch, 16 ch, rumbay drum 8 ch, dan ganti spul mic EWD selesai dikerjakan bersama tim Audio.",
    "status": "Completed",
    "progress": 100,
    "pic": "Suryana / Taufik Diana / Iwan Kurniawan / Ramdani",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:46.565Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    }
  },
  {
    "id": "wo-20260910-parled-warm-02",
    "priority": "Tinggi",
    "_source": "google_sheet_remark",
    "progress": 0,
    "dateCreated": "2026-09-10",
    "pic": "Mulyana",
    "deadline": "2026-09-17",
    "description": "Perbaikan Parled Warm: Unit no.19, 20, 27 hanya nyala separo. Harus service.",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-05T09:22:46.565Z",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "notes": "Ditemukan oleh: Heri — Divisi Lighting",
    "equipment": "Parled Warm Lighting",
    "findingId": "fd-20260910-heri-parled-warm-02",
    "title": "Service Parled Warm — Separo No.19,20,27",
    "status": "In Progress",
    "division": "Service"
  },
  {
    "id": "wo-20260910-xlr-lighting",
    "progress": 100,
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:46.565Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "status": "Completed",
    "findingId": "find-20260910-xlr",
    "pic": "Heri",
    "dateCreated": "2026-09-10",
    "title": "Service Kabel XLR Link Lighting",
    "description": "Kabel link Beam, BSW, B-Eye dan kabel link XLR selesai diservice dan siap operasi.",
    "deadline": "2026-09-10",
    "division": "Lighting"
  },
  {
    "id": "wo-1789158174449",
    "deadline": "2026-09-09",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:46.565Z",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    },
    "division": "Service",
    "description": "[Temuan QC ID: find-20260907-parled] Parled Warm mati No. 12, 25, 29 & Warm separo No. 3, 32 (Prioritas: Sedang)",
    "title": "Perbaikan: PAR LED Warm White (Lighting)",
    "status": "In Progress",
    "progress": 10,
    "pic": "Damri",
    "dateCreated": "2026-09-11"
  },
  {
    "id": "wo-20260912-parled-13",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:46.565Z",
      "deviceType": "Desktop"
    },
    "dateCreated": "2026-09-12",
    "notes": "Ditemukan oleh: Heri — Divisi Lighting",
    "progress": 0,
    "findingId": "fd-20260912-heri-parled-13",
    "priority": "Tinggi",
    "equipment": "Parled Lighting No.13",
    "deadline": "2026-09-19",
    "title": "Service Parled No.13 — LED Merah Mati",
    "pic": "Mulyana",
    "status": "Pending",
    "description": "Parled No.13 LED merah mati total. Butuh pengecekan dan penggantian modul LED merah.",
    "division": "Service",
    "_source": "google_sheet_remark"
  },
  {
    "id": "wo-20260916-sm57-inventaris",
    "priority": "Tinggi",
    "progress": 0,
    "dateCreated": "2026-09-16",
    "deadline": "2026-09-23",
    "pic": "Ramdani",
    "status": "Pending",
    "notes": "Ditemukan oleh: Ramdani (Dani) — Divisi Audio. SM58: Bagus 17, Rusak 1. VXT: Bagus 8, Rusak 2.",
    "description": "Dari hasil inventaris oleh Ramdani: SM57 rusak 4 unit, hilang 9 unit. Perlu laporan ke manajemen, pengajuan penggantian unit, dan investigasi penyebab kehilangan.",
    "equipment": "Mic Shure SM57",
    "_source": "google_sheet_remark",
    "division": "Audio",
    "findingId": "fd-20260916-dani-sm57",
    "_syncMeta": {
      "updatedAt": "2026-10-05T09:22:46.565Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "title": "Tindak Lanjut SM57 Rusak 4 Unit & Hilang 9 Unit"
  },
  {
    "id": "wo-20260916-smoke-03",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:46.565Z",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "pic": "Mulyana",
    "findingId": "fd-20260916-heri-smoke-03",
    "description": "Smoke Machine No.3 mengalami error saat pengecekan tanggal 16 Sep 2026. Perlu diagnosa dan perbaikan.",
    "status": "Pending",
    "equipment": "Smoke Machine No.3",
    "division": "Service",
    "progress": 0,
    "priority": "Sedang",
    "notes": "Ditemukan oleh: Heri — Divisi Lighting",
    "_source": "google_sheet_remark",
    "title": "Perbaikan Smoke Machine No.3 — ERROR",
    "deadline": "2026-09-21",
    "dateCreated": "2026-09-16"
  },
  {
    "id": "wo-20260917-ampeg-svt4",
    "priority": "Tinggi",
    "progress": 100,
    "description": "Ampeg SVT-4 amplifier bass tidak berfungsi normal. Harus service dan ganti komponen PTC. Tidak layak digunakan sebelum diperbaiki.",
    "title": "Service Ampeg SVT-4 — Ganti Komponen PTC",
    "notes": "Ditemukan oleh: Yudishtira Purnama A (Yudis) — Divisi Audio.",
    "deadline": "2026-09-22",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-05T09:22:46.566Z"
    },
    "approvedAt": "2026-09-22",
    "_source": "google_sheet_remark",
    "findingId": "fd-20260917-yudis-ampeg",
    "equipment": "Ampeg SVT-4 Bass Amplifier",
    "pic": "Mulyana",
    "status": "Completed",
    "division": "Service",
    "dateCreated": "2026-09-17",
    "approvedBy": "Seno Subroto"
  },
  {
    "id": "wo-20260917-takel-1ton",
    "deadline": "2026-09-22",
    "equipment": "Takel Chain Hoist 1 Ton",
    "findingId": "fd-20260917-unyim-takel",
    "status": "In Progress",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-05T09:22:46.566Z",
      "deviceOS": "macOS"
    },
    "dateCreated": "2026-09-17",
    "progress": 0,
    "_source": "google_sheet_remark",
    "priority": "Tinggi",
    "division": "Service",
    "title": "Perbaikan Takel 1 Ton — LOS",
    "description": "Takel kapasitas 1 Ton mengalami LOS (Line of Sight failure / rantai putus). Wajib diperbaiki atau diganti sebelum digunakan pada event.",
    "pic": "Mulyana",
    "notes": "Ditemukan oleh: Wahyudin (Unyim) — Divisi Audio. Safety critical — jangan digunakan sebelum diperbaiki."
  },
  {
    "id": "wo-1789741092379",
    "status": "In Progress",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-05T09:22:46.565Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "deadline": "2026-09-03",
    "title": "Perbaikan: 1*pengecekan semua unit speker DBTtech15, dengan mengunakan smartlive berdasarkan data reference unit yang sehat",
    "dateCreated": "2026-09-18",
    "division": "Service",
    "pic": "Damri",
    "progress": 10,
    "description": "[Temuan QC ID: gsheet-finding-2026-09-03--_DB_Tech_No.18_Ada_Kendala_di] - DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event. (Prioritas: Sedang)"
  },
  {
    "id": "wo-1789741260313",
    "dateCreated": "2026-09-18",
    "title": "Perbaikan: 1*pengecekan semua unit speker DBTtech15, dengan mengunakan smartlive berdasarkan data reference unit yang sehat",
    "division": "Service",
    "deadline": "2026-09-03",
    "description": "[Temuan QC ID: gsheet-finding-2026-09-03--_DB_Tech_No.18_Ada_Kendala_di] - DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event. (Prioritas: Sedang)",
    "status": "In Progress",
    "progress": 10,
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-09-28T11:34:26.537Z",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "pic": "Damri"
  },
  {
    "id": "wo-20261002-mulyana-repair-kabinet",
    "dateCreated": "2026-10-02",
    "title": "Perbaikan: Repair 3 kabinet IC warna + ganti dead pixel",
    "division": "Videotron",
    "deadline": "2026-10-04",
    "description": "Repair 3 kabinet IC warna + ganti dead pixel 2 kabinet clear",
    "status": "Completed",
    "progress": 100,
    "priority": "Tinggi",
    "pic": "Mulyana",
    "_source": "google_sheet"
  }
];
