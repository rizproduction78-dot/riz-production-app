/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Staff, Division, Asset, MaintenanceSchedule, WorkOrder, Finding, LogbookEntry, DailyReport, DailyTask } from './types';

export const STAFF_LIST: Staff[] = [
  // Staff Gudang
  { id: '1', name: 'Mang ube', division: 'Gudang', role: 'Gudang' },
  { id: '2', name: 'Gatot', division: 'Gudang', role: 'Gudang' },
  { id: '3', name: 'Abah Subur', division: 'Gudang', role: 'Gudang' },

  // Admin / Management
  { id: 'director-wahyu', name: 'Wahyu', division: 'Admin', role: 'Admin' },
  { id: '4', name: 'Agus', division: 'Admin', role: 'Supervisor' },
  { id: '5', name: 'Fahrul', division: 'Admin', role: 'Manager' },
  { id: '6', name: 'Caca', division: 'Admin', role: 'Admin' },
  { id: '7', name: 'Seno', division: 'Admin', role: 'Admin' },

  // Sound (Audio)
  { id: '8', name: 'Mboh', division: 'Audio', role: 'Team Leader' },
  { id: '9', name: 'Unyim', division: 'Audio', role: 'Staff' },
  { id: '10', name: 'Dani', division: 'Audio', role: 'Staff' },
  { id: '11', name: 'Butonk', division: 'Audio', role: 'Staff' },
  { id: '12', name: 'Yudish', division: 'Audio', role: 'Staff' },
  { id: '13', name: 'Opik', division: 'Audio', role: 'Staff' },
  { id: '14', name: 'Buluk', division: 'Audio', role: 'Staff' },

  // Lighting
  { id: '15', name: 'Heri', division: 'Lighting', role: 'Team Leader' },

  // Multimedia
  { id: '16', name: 'Ulloh', division: 'Multimedia', role: 'Team Leader' },
  { id: '17', name: 'Jay', division: 'Multimedia', role: 'Staff' },
  { id: '18', name: 'Chandra', division: 'Multimedia', role: 'Staff' },

  // Videotron
  { id: '19', name: 'Ayong', division: 'Videotron', role: 'Team Leader' },
  { id: '20', name: 'Wigi', division: 'Videotron', role: 'Staff' },
  { id: '21', name: 'Irfan', division: 'Videotron', role: 'Staff' },
  { id: '22', name: 'Kharo', division: 'Videotron', role: 'Staff' },

  // Service (Perbaikan)
  { id: '23', name: 'Pak Joko', division: 'Service', role: 'Team Leader' },
  { id: '24', name: 'Slamet', division: 'Service', role: 'Staff' },
  { id: '25', name: 'Muji', division: 'Service', role: 'Staff' },
];

export const MASTER_STAFF: Staff[] = [...STAFF_LIST];

export const QC_ITEMS_BY_DIVISION = {
  Audio: [
    'Kebersihan Area Workshop / Gudang Maintenance & Rak Penyimpanan Audio (5R)',
    'Pembersihan & Pengecekan Fader Bermotor, Knob, Port & Showfile Mixer Digital (Midas)',
    'Inspeksi Fisik, Port Neutrik XLR/EtherCON & Phantom 48V Stage Box / Digital Snake',
    'Pengecekan Fisik, Pin Lock Rigging & Uji Suara Modul Speaker Line Array di Meja Tes Gudang',
    'Pengecekan Fisik Box Subwoofer, Grill, Konektor Speakon/PowerCON & Uji Fungsi di Area Maintenance',
    'Pemeriksaan Modul Power Amp Internal Speaker Aktif, Suhu Heatsink & Proteksi Limiter',
    'Verifikasi Preset DSP Internal Speaker Aktif / Modul DLMS ke Standar Siap Event',
    'Pengecekan Fisik Receiver Wireless Mic, Kelayakan Antena, Sinyal RF & Kompartemen Baterai',
    'Pengecekan Fisik, Spool & Kerapihan Dynamic/Condenser Mic Kabel & Stand Mic di Rak',
    'Pengujian Port Jack, Saklar Ground Lift & Baterai/Phantom DI Box Aktif/Pasif',
    'Pengujian Kontinuitas, Isolasi & Kerapihan Gulungan Kabel Audio (XLR, Speakon, PowerCON)',
    'Pengecekan Fisik & Kelistrikan Panel Distribusi Daya Audio Gudang'
  ],
  Gudang: [
    'Kebersihan Seluruh Lorong Gudang, Rak Penyimpanan, Area Workshop Maintenance & Loading Dock (5R)',
    'Verifikasi Fisik Unit Masuk/Keluar Sesuai Surat Jalan (Loading & Unloading Manifest)',
    'Pemeriksaan Fisik Flightcase (Roda Caster, Handle, Kunci Kupu-kupu & Label Barcode Aset)',
    'Penggulungan Kabel Rapi (Over-Under Method), Inspeksi Isolasi & Pengikatan Velcro di Rak',
    'Inspeksi Keselamatan Rigging Truss, Safety Pin Spigot, Shackle & Webbing Spanset di Rak Rigging',
    'Pengecekan Panel Distribusi Utama 3-Phase (MDP/SDP), Konektor Camlock & ELCB Gudang',
    'Pemeriksaan Fisik & Kuncian Pengaman Barrier Mojo / Barikade di Rak Penyimpanan',
    'Segregasi & Penempatan Unit Rusak di Area Karantina Khusus Bertag Merah (Red Tag)',
    'Pemeriksaan Kelayakan Alat Bantu Angkut (Hand Pallet Hidrolik, Trolley Barang, Lashing Truk)',
    'Keamanan Lingkungan Area Kerja Terutama yang Piket / Absen Malam (Jam: 23.00, 03.00, 04.30 WIB)',
    'Koordinasi dengan Pihak Keamanan Terkait Shift Malam (SATPAM > POLISI dst)'
  ],
  Lighting: [
    'Kebersihan Area Workshop / Gudang Maintenance Lighting, Fixture & Flightcase (5R)',
    'Pengecekan Konsol Lighting (GrandMA/Avolites), Touchscreen, Fader & Port DMX di Meja Uji',
    'Uji Kalibrasi Homing Pan/Tilt, Optik Lensa, Lampu/LED, Gobo & Prism Moving Head di Staging Area Gudang',
    'Pemeriksaan Nyala LED RGBW, Dimmer, Barndoor & Kuncian Bracket PAR LED / Fresnel di Rak',
    'Pemeriksaan Kelancaran Mekanik Pan/Tilt, Iris, Shutter & Filter Warna Follow Spot di Gudang',
    'Pengecekan DMX Splitter/Booster, Node Art-Net & Terminator DMX di Rak Aksesoris',
    'Pengujian Kontinuitas Shielding Kabel DMX 3-Pin/5-Pin, PowerCON & Jumper di Keranjang Kabel',
    'Inspeksi Fisik Aksesoris Rigging Lighting (Clamp C-Hook, Omega Bracket & Safety Wire Baja)',
    'Pengecekan Panel Distribusi Daya Listrik Lighting & Kabel 3-Phase Gudang',
    'Pengecekan Mesin Efek (Hazer / Smoke Machine), Kebersihan Tabung, Nozzle & Stok Liquid'
  ],
  Multimedia: [
    'Kebersihan Area Workshop / Gudang Maintenance Multimedia, Rak Perangkat & Lensa Kamera (5R)',
    'Pengecekan Laptop / PC Streaming (Performa Sistem, Kebersihan Kipas & Storage Bebas Sampah)',
    'Uji Kesiapan Software Playback & Streaming (vMix, OBS, Resolume Arena) di Komputer Gudang',
    'Pengujian Video Switcher (Blackmagic ATEM / DataVideo), Port SDI/HDMI & Adaptor Daya',
    'Pemeriksaan Fisik Camcorder, Kebersihan Lensa Optik, Baterai V-Mount & Charger di Dry Cabinet',
    'Pemeriksaan Tripod Kamera (Fluid Head Pan/Tilt, Kunci Kaki & Quick Release Plate) di Rak',
    'Pengujian Capture Card (DeckLink/Magewell), Converter Signal & HyperDeck Recorder di Meja Uji',
    'Pengecekan Sistem Wireless Video Transmitter/Receiver & Wireless Intercom Clearcom kru',
    'Pengecekan TV Monitor Preview / Display 50" & Stand Bracket Roda di Flightcase'
  ],
  Videotron: [
    'Kebersihan Area Workshop / Gudang Maintenance Videotron, Modul LED & Panel Processor (5R)',
    'Uji Nyala Modul LED di Meja Tes Gudang (Pola RGBWB, Deteksi Dead Pixel & Masker Modul)',
    'Pemeriksaan Kuncian Kabinet Die-Cast (Fast Lock), Pin Alignment & Busa Flightcase',
    'Pengecekan Status Indikator Receiving Card & Flat Ribbon Data Cable Tiap Kabinet',
    'Inspeksi Video Processor / Sending Controller (NovaStar VX600/VX1000) & Port Input/Output',
    'Pengujian & Perapihan Gulungan Kabel LAN Cat6 EtherCON & Jumper Data Antar Kabinet',
    'Pemeriksaan Modul Power Supply 5V DC Internal Kabinet & Kabel Power Jumper',
    'Backup & Verifikasi File Konfigurasi Mapping / RCFG di Komputer Workshop',
    'Pengecekan Rigging Hanging Bar / Ground Base Videotron & Baut Pengunci di Rak Penyimpanan'
  ],
  Admin: [
    'Verifikasi Surat Jalan Resmi & Manifest Pengeluaran Barang Event',
    'Rekonsiliasi Lembar Checklist Kembali Pasca Bongkaran Event',
    'Monitoring & Verifikasi Pengisian Absensi Serta Jam Kerja Crew',
    'Audit Kelengkapan Logbook Harian & Pengajuan Approval Supervisor/Manager',
    'Pengecekan & Pengarsipan Faktur Biaya Operasional Warehouse'
  ],
  Service: [
    'Solder Station, Desoldering Blower & Alat Ukur Terkalibrasi (5R)',
    'Inspeksi & Pengujian Multimeter, Osiloskop Serta DC Power Supply Lab',
    'Diagnosa & Perbaikan Power Supply Unit (PSU) 5V Modul LED',
    'Penyolderan Ulang Konektor Kabel XLR, Speakon, & PowerCON',
    'Penggantian SMD LED Lamp Beads P3.9 / P2.6 dengan Hot Air',
    'Running Test Unit Pasca Servis (Min 2 Jam Uji Beban Kontinu)',
    'Pencatatan Kartu Servis & Update Tiket Temuan Kerusakan'
  ]
};

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'ast-1',
    code: 'AST-AUD-001',
    name: 'Digital Mixer CL5',
    brand: 'Yamaha',
    serialNumber: 'YM-CL5-829',
    division: 'Audio',
    location: 'Gudang Utama A',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-2',
    code: 'AST-AUD-002',
    name: 'Console HD + DL251',
    brand: 'Midas',
    serialNumber: 'MD-HD251-82',
    division: 'Audio',
    location: 'Gudang Utama A',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-3',
    code: 'AST-LGT-001',
    name: 'Beam BSW 550',
    brand: 'RIZ-Lgt',
    serialNumber: 'RL-BSW550-04',
    division: 'Lighting',
    location: 'Gudang Utama B',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-4',
    code: 'AST-LGT-002',
    name: 'Moving Head BSW 380W',
    brand: 'RIZ-Lgt',
    serialNumber: 'RL-BSW380-13',
    division: 'Lighting',
    location: 'Gudang Utama B',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-5',
    code: 'AST-LGT-003',
    name: 'Blinder no.2',
    brand: 'RIZ-Lgt',
    serialNumber: 'RL-BLD-02',
    division: 'Lighting',
    location: 'Gudang Utama B',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-6',
    code: 'AST-MUL-001',
    name: 'Video Switcher',
    brand: 'Roland',
    serialNumber: 'RLD-SW-7721',
    division: 'Multimedia',
    location: 'Gudang Utama C',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-7',
    code: 'AST-VID-001',
    name: 'LED Cabinet P3.9 Outdoor',
    brand: 'RIZ-Vid',
    serialNumber: 'RV-P3.9-923',
    division: 'Videotron',
    location: 'Gudang Utama C',
    condition: 'Baik',
    repairHistory: []
  }
];

export const INITIAL_MAINTENANCE_SCHEDULES: MaintenanceSchedule[] = [
  {
    id: 'ms-1',
    assetName: 'Digital Mixer CL5',
    assetCode: 'AST-AUD-001',
    type: 'Preventive',
    frequency: 'Bulanan',
    lastDate: '2026-06-15',
    nextDate: '2026-07-15',
    status: 'Scheduled',
    notes: 'Pemeriksaan rutin fader motor dan update firmware'
  },
  {
    id: 'ms-2',
    assetName: 'Moving Head BSW 380W',
    assetCode: 'AST-LGT-002',
    type: 'Corrective',
    frequency: 'Insidental',
    lastDate: '2026-06-10',
    nextDate: '2026-07-02',
    status: 'Scheduled',
    notes: 'Kalibrasi sensor pan-tilt'
  },
  {
    id: 'ms-3',
    assetName: 'LED Cabinet P3.9 Outdoor',
    assetCode: 'AST-VID-001',
    type: 'Preventive',
    frequency: 'Bulanan',
    lastDate: '2026-06-15',
    nextDate: '2026-07-15',
    status: 'Scheduled',
    notes: 'Pemeriksaan modul pixel mati dan refresh rate'
  }
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo-1',
    title: 'Perbaikan Indikator Voltage Power Condition',
    description: 'Pengecekan Power Condition: Voltage Indikatornya ga kebaca.',
    pic: 'Mboh',
    division: 'Audio',
    deadline: '2026-06-15',
    progress: 0,
    status: 'Pending',
    dateCreated: '2026-06-03'
  },
  {
    id: 'wo-2',
    title: 'Servis Lampu Beam BSW 550',
    description: 'Pengecekan Beam BSW 550: no. 1,8,13,16 ( Warm Separo ).',
    pic: 'Heri',
    division: 'Lighting',
    deadline: '2026-06-18',
    progress: 20,
    status: 'In Progress',
    dateCreated: '2026-06-04'
  },
  {
    id: 'wo-3',
    title: 'Ganti Power Supply Freshnell 200',
    description: 'Pengecekan Freshnell 200 No. 13 ( Power Supply ).',
    pic: 'Heri',
    division: 'Lighting',
    deadline: '2026-06-15',
    progress: 50,
    status: 'In Progress',
    dateCreated: '2026-06-04'
  },
  {
    id: 'wo-4',
    title: 'Ganti Mika Blinder no.2',
    description: 'Pengecekan Blinder: Blinder no.2 Mika Meleleh 1 Mata.',
    pic: 'Heri',
    division: 'Lighting',
    deadline: '2026-06-20',
    progress: 100,
    status: 'Completed',
    dateCreated: '2026-06-08'
  }
];

export const INITIAL_FINDINGS: Finding[] = [
  {
    id: 'fd-1',
    equipment: 'Power Condition',
    issue: 'Voltage Indikatornya ga kebaca',
    priority: 'Sedang',
    pic: 'Mboh',
    targetDate: '2026-06-10',
    status: 'Open',
    dateCreated: '2026-06-03'
  },
  {
    id: 'fd-2',
    equipment: 'Beam BSW 550',
    issue: 'no. 1,8,13,16 ( Warm Separo )',
    priority: 'Tinggi',
    pic: 'Heri',
    targetDate: '2026-06-12',
    status: 'Open',
    dateCreated: '2026-06-04'
  },
  {
    id: 'fd-3',
    equipment: 'Freshnell 200 No. 13',
    issue: 'Power Supply bermasalah',
    priority: 'Tinggi',
    pic: 'Heri',
    targetDate: '2026-06-12',
    status: 'Open',
    dateCreated: '2026-06-04'
  },
  {
    id: 'fd-4',
    equipment: 'Blinder no.2',
    issue: 'Mika Meleleh 1 Mata',
    priority: 'Sedang',
    pic: 'Heri',
    targetDate: '2026-06-15',
    status: 'Open',
    dateCreated: '2026-06-08'
  }
];

export const INITIAL_LOGBOOK_ENTRIES: LogbookEntry[] = [
  {
    id: 'lg-101',
    date: '2026-06-01',
    division: 'Audio',
    staffName: 'Unyim',
    activity: 'Cleaning ALL RD Series, Service Panel Listrik, Service Stand Mic, Steam Mobil Pick Up',
    result: 'OK',
    followUp: '-',
    status: 'Close',
    verification: 'Agus (Verified)',
    checklists: {
      'RD Series': { status: 'OK', notes: 'Cleaning ALL RD Series' },
      'Panel Listrik': { status: 'OK', notes: 'Service Panel Listrik' },
      'Stand Mic': { status: 'OK', notes: 'Service Stand Mic' },
      'Mobil Pick Up': { status: 'OK', notes: 'Steam Mobil Pick Up' }
    }
  },
  {
    id: 'lg-102',
    date: '2026-06-03',
    division: 'Audio',
    staffName: 'Unyim',
    activity: 'Training System Alur Signal Audio, Cara Line Alignment System RTA, Mengenal Plugin & Tekhnik Mixing, Pengecekan Power Condition',
    result: 'NG',
    followUp: 'Power Condition Voltage Indikatornya ga kebaca',
    status: 'Open',
    verification: 'Agus (Verified)',
    checklists: {
      'System Alur Signal Audio': { status: 'OK', notes: 'Gain Staging Terhadap Signal Matrix to L R Sub Center' },
      'Line Alignment System RTA': { status: 'OK', notes: 'Cara Line Alignment System RTA' },
      'Plugin & Tekhnik Mixing': { status: 'OK', notes: 'Mengenal Plugin & Tekhnik Mixing' },
      'Power Condition': { status: 'NG', notes: 'Power Condition Voltage Indikatornya ga kebaca' }
    }
  },
  {
    id: 'lg-103',
    date: '2026-06-04',
    division: 'Audio',
    staffName: 'Unyim',
    activity: 'Maintenance All Splitter Input/output, Cleaning All box WHM, Cleaning DL251 + Console HD',
    result: 'OK',
    followUp: '-',
    status: 'Close',
    verification: 'Agus (Verified)',
    checklists: {
      'Splitter Input/output': { status: 'OK', notes: 'Maintenance All Splitter Input/output' },
      'box WHM': { status: 'OK', notes: 'Cleaning All box WHM' },
      'DL251 + Console HD': { status: 'OK', notes: 'Cleaning DL251 + Console HD' }
    }
  },
  {
    id: 'lg-104',
    date: '2026-06-04',
    division: 'Lighting',
    staffName: 'Heri',
    activity: 'CLEANING, Pengecekan Beam 450, Beam BSW 550, Parled Trf A64, Perkabelan, Mixer',
    result: 'NG',
    followUp: 'Beam BSW 550 no. 1,8,13,16 ( Warm Separo ), Freshnell 200 No. 13 ( Power Supply )',
    status: 'Open',
    verification: 'Agus (Verified)',
    checklists: {
      'CLEANING': { status: 'OK', notes: 'Kondisi Bersih Dan Normal' },
      'Beam 450': { status: 'OK', notes: 'Ghele - Beam 450' },
      'Beam BSW 550': { status: 'NG', notes: 'no. 1,8,13,16 ( Warm Separo )' },
      'Parled Trf A64 / Freshnell 200': { status: 'NG', notes: 'Freshnell 200 No. 13 ( Power Supply )' },
      'Perkabelan': { status: 'OK', notes: 'Normal' },
      'Mixer': { status: 'OK', notes: 'Normal' }
    }
  },
  {
    id: 'lg-105',
    date: '2026-06-05',
    division: 'Audio',
    staffName: 'Dani',
    activity: 'Pengecekan Roda HC',
    result: 'OK',
    followUp: '-',
    status: 'Close',
    verification: 'Agus (Verified)',
    checklists: {
      'Roda HC': { status: 'OK', notes: 'Pengecekan Roda HC' }
    }
  },
  {
    id: 'lg-106',
    date: '2026-06-06',
    division: 'Audio',
    staffName: 'Opik',
    activity: 'Pengecekan/Solder Sub Snake 8ch & Pengecekan Rumbai Drum 8ch',
    result: 'OK',
    followUp: '-',
    status: 'Close',
    verification: 'Agus (Verified)',
    checklists: {
      'Sub Snake 8ch': { status: 'OK', notes: 'Pengecekan/Solder Sub Snake 8ch' },
      'Rumbai Drum 8ch': { status: 'OK', notes: 'Pengecekan Rumbai Drum 8ch' }
    }
  },
  {
    id: 'lg-107',
    date: '2026-06-06',
    division: 'Lighting',
    staffName: 'Heri',
    activity: 'CLEANING, Freshnell 200, Freshnell 300, All Stromy, Cover Lighting',
    result: 'OK',
    followUp: '-',
    status: 'Close',
    verification: 'Agus (Verified)',
    checklists: {
      'CLEANING': { status: 'OK', notes: 'Stock Liquid Hazzzer 1 Liter Lebih, Smoke 1 Jerigen > 1 Liter' },
      'Freshnell 200': { status: 'OK', notes: 'All Freshnell 200' },
      'Freshnell 300': { status: 'OK', notes: 'All Freshnell 300' },
      'Stromy': { status: 'OK', notes: 'All Stromy' },
      'Cover Lighting': { status: 'OK', notes: 'Cover Lighting' }
    }
  },
  {
    id: 'lg-108',
    date: '2026-06-08',
    division: 'Audio',
    staffName: 'Mboh',
    activity: 'Maintenance Snack Kabel, Cleaning Box Mic, Cek Unit Monitor Trouble & Ngulik Smart 5',
    result: 'OK',
    followUp: '-',
    status: 'Close',
    verification: 'Agus (Verified)',
    checklists: {
      'Snack Kabel': { status: 'OK', notes: 'Maintenance Snack Kabel' },
      'Box Mic': { status: 'OK', notes: 'Cleaning Box Mic' },
      'Unit Monitor': { status: 'OK', notes: 'Cek Unit Monitor Trouble' },
      'Smart 5': { status: 'OK', notes: 'Ngulik Smart 5' }
    }
  },
  {
    id: 'lg-109',
    date: '2026-06-08',
    division: 'Lighting',
    staffName: 'Heri',
    activity: 'CLEANING All Smoke & ALL Blinder',
    result: 'NG',
    followUp: 'Blinder no.2 Mika Meleleh 1 Mata',
    status: 'Open',
    verification: 'Agus (Verified)',
    checklists: {
      'Smoke': { status: 'OK', notes: 'All Smoke' },
      'Blinder': { status: 'NG', notes: 'Blinder no.2 Mika Meleleh 1 Mata' }
    }
  },
  {
    id: 'lg-110',
    date: '2026-06-10',
    division: 'Audio',
    staffName: 'Buluk',
    activity: 'Pengecekan DB No. 15 & 16, Pengambilan STNK & Pembayaran KIR Pick Up Baru',
    result: 'OK',
    followUp: '-',
    status: 'Close',
    verification: 'Agus (Verified)',
    checklists: {
      'DB No. 15 & 16': { status: 'OK', notes: 'Pengecekan DB No. 15 & 16' },
      'STNK & KIR Pick Up Baru': { status: 'OK', notes: 'Pengambilan STNK & Pembayaran KIR Pick Up Baru' }
    }
  },
  {
    id: 'lg-111',
    date: '2026-06-10',
    division: 'Lighting',
    staffName: 'Heri',
    activity: 'Cleaning All B-Eye k10',
    result: 'OK',
    followUp: '-',
    status: 'Close',
    verification: 'Agus (Verified)',
    checklists: {
      'B-Eye k10': { status: 'OK', notes: 'Cleaning All B-Eye k10' }
    }
  },
  {
    id: 'lg-112',
    date: '2026-06-18',
    division: 'Audio',
    staffName: 'Mboh',
    activity: 'Cek DB Service, Pengecatan Stand Mic',
    result: 'OK',
    followUp: '-',
    status: 'Close',
    verification: 'Agus (Verified)',
    checklists: {
      'DB Service': { status: 'OK', notes: 'Cek DB Service' },
      'Pengecatan Stand Mic': { status: 'OK', notes: 'Pengecatan Stand Mic' }
    }
  },
  {
    id: 'lg-113',
    date: '2026-06-19',
    division: 'Audio',
    staffName: 'Mboh',
    activity: 'Pengecekan Art',
    result: 'OK',
    followUp: '-',
    status: 'Close',
    verification: 'Agus (Verified)',
    checklists: {
      'Pengecekan Art': { status: 'OK', notes: 'Pengecekan Art bersama Dani, Yudish, Unyim' }
    }
  },
  {
    id: 'lg-114',
    date: '2026-06-20',
    division: 'Audio',
    staffName: 'Yudish',
    activity: 'Cleaning DL251 + DL32, Cleaning DLMS, WHM EW-D, WHM Shure SLXD, RTA, Repaint Gooseneck',
    result: 'OK',
    followUp: '-',
    status: 'Close',
    verification: 'Agus (Verified)',
    checklists: {
      'DL251 + DL32': { status: 'OK', notes: 'Cleaning DL251 + DL32' },
      'DLMS': { status: 'OK', notes: 'Cleaning DLMS' },
      'WHM EW-D': { status: 'OK', notes: 'Cleaning WHM EW-D' },
      'WHM Shure SLXD': { status: 'OK', notes: 'Cleaning WHM Shure SLXD' },
      'RTA': { status: 'OK', notes: 'Cleaning RTA' },
      'Repaint Gooseneck': { status: 'OK', notes: 'Repaint Gooseneck' }
    }
  },
  {
    id: 'lg-115',
    date: '2026-06-21',
    division: 'Audio',
    staffName: 'Mboh',
    activity: 'Pengecekan Mic Condersor',
    result: 'OK',
    followUp: '-',
    status: 'Close',
    verification: 'Agus (Verified)',
    checklists: {
      'Mic Condersor': { status: 'OK', notes: 'Pengecekan Mic Condersor bersama Opik' }
    }
  },
  {
    id: 'lg-116',
    date: '2026-06-25',
    division: 'Audio',
    staffName: 'Unyim',
    activity: 'Pemasangan dan pengecekan Speaker DB Servisan',
    result: 'OK',
    followUp: '-',
    status: 'Close',
    verification: 'Agus (Verified)',
    checklists: {
      'Speaker DB Servisan': { status: 'OK', notes: 'Pemasangan dan pengecekan Speaker DB Servisan' }
    }
  },
  {
    id: 'lg-117',
    date: '2026-06-25',
    division: 'Multimedia',
    staffName: 'Chandra',
    activity: 'Pengecekan Switcher',
    result: 'OK',
    followUp: '-',
    status: 'Close',
    verification: 'Agus (Verified)',
    checklists: {
      'Switcher': { status: 'OK', notes: 'Pengecekan Switcher' }
    }
  },
  {
    id: 'lg-118',
    date: '2026-06-30',
    division: 'Audio',
    staffName: 'Yudish',
    activity: 'Update Combiner & Antena Distributor, Update Jumlah All Stand',
    result: 'OK',
    followUp: '-',
    status: 'Close',
    verification: 'Agus (Verified)',
    checklists: {
      'Combiner & Antena Distributor': { status: 'OK', notes: 'Distributor shure UA844-1 4Unit, Distributor EWD Senheiser 2 Unit, Combiner 1 Unit' },
      'Jumlah All Stand': { status: 'OK', notes: 'Stand Boox 12, Gitar 6, KeyBoard Single 4 Double 3, Mic Pjg 34 Pndek 18, Tripod 22 + Slongsong 8' }
    }
  },
  {
    id: 'lg-119',
    date: '2026-06-30',
    division: 'Lighting',
    staffName: 'Heri',
    activity: 'Cleaning & Pengecekan All Inventory',
    result: 'OK',
    followUp: '-',
    status: 'Close',
    verification: 'Agus (Verified)',
    checklists: {
      'Inventory Lighting': { status: 'OK', notes: 'Cleaning & Pengecekan All Inventory: Distributor shure UA844-1 4Unit, Distributor EWD Senheiser 2 Unit, Combiner 1 Unit' }
    }
  }
];

export const INITIAL_DAILY_REPORTS: DailyReport[] = [
  {
    id: 'dr-301',
    date: '2026-06-01',
    staffName: 'Unyim',
    division: 'Audio',
    activity: 'Cleaning ALL RD Series',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-302',
    date: '2026-06-01',
    staffName: 'Butonk',
    division: 'Audio',
    activity: 'Service Panel Listrik',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-303',
    date: '2026-06-01',
    staffName: 'Opik',
    division: 'Audio',
    activity: 'Service Stand Mic',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-304',
    date: '2026-06-01',
    staffName: 'Unyim',
    division: 'Audio',
    activity: 'Steam Mobil Pick Up',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-305',
    date: '2026-06-03',
    staffName: 'Unyim',
    division: 'Audio',
    activity: 'Training System Alur Signal Audio',
    notes: 'Gain Staging Terhadap Signal Matrix to L R Sub Center',
    status: 'Submitted'
  },
  {
    id: 'dr-306',
    date: '2026-06-03',
    staffName: 'Yudish',
    division: 'Audio',
    activity: 'Cara Line Alignment System RTA',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-307',
    date: '2026-06-03',
    staffName: 'Cionk',
    division: 'Audio',
    activity: 'Mengenal Plugin & Tekhnik Mixing',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-308',
    date: '2026-06-03',
    staffName: 'Mboh',
    division: 'Audio',
    activity: '-',
    notes: '( Power Condition Voltage Indikatornya ga kebaca )',
    status: 'Submitted'
  },
  {
    id: 'dr-309',
    date: '2026-06-04',
    staffName: 'Unyim',
    division: 'Audio',
    activity: 'Maintenance All Splitter Input/output',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-310',
    date: '2026-06-04',
    staffName: 'Opik',
    division: 'Audio',
    activity: 'Cleaning All box WHM',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-311',
    date: '2026-06-04',
    staffName: 'Butonk',
    division: 'Audio',
    activity: 'Cleaning DL251 + Console HD',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-312',
    date: '2026-06-04',
    staffName: 'Heri',
    division: 'Lighting',
    activity: 'CLEANING',
    notes: 'Kondisi Bersih Dan Normal',
    status: 'Submitted'
  },
  {
    id: 'dr-313',
    date: '2026-06-04',
    staffName: 'Ghele',
    division: 'Lighting',
    activity: 'Beam 450',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-314',
    date: '2026-06-04',
    staffName: 'Ugan',
    division: 'Lighting',
    activity: 'Beam BSW 550',
    notes: 'no. 1,8,13,16 ( Warm Separo )',
    status: 'Submitted'
  },
  {
    id: 'dr-315',
    date: '2026-06-04',
    staffName: 'Idrus',
    division: 'Lighting',
    activity: 'Parled Trf A64',
    notes: 'Freshnell 200 No. 13 ( Power Supply )',
    status: 'Submitted'
  },
  {
    id: 'dr-316',
    date: '2026-06-05',
    staffName: 'Dani',
    division: 'Audio',
    activity: 'Pengecekan Roda HC',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-317',
    date: '2026-06-06',
    staffName: 'Opik',
    division: 'Audio',
    activity: 'Pengecekan/Solder Sub Snake 8ch & Pengecekan Rumbai Drum 8ch',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-318',
    date: '2026-06-06',
    staffName: 'Heri',
    division: 'Lighting',
    activity: 'CLEANING',
    notes: 'Stock Liquid Hazzzer 1 Liter Lebih, Smoke 1 Jerigen > 1 Liter',
    status: 'Submitted'
  },
  {
    id: 'dr-319',
    date: '2026-06-06',
    staffName: 'Heri',
    division: 'Lighting',
    activity: 'Pengecekan Freshnell 200/300, All Stromy, Cover Lighting',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-320',
    date: '2026-06-08',
    staffName: 'Mboh',
    division: 'Audio',
    activity: 'Maintenance Snack Kabel',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-321',
    date: '2026-06-08',
    staffName: 'Dani',
    division: 'Audio',
    activity: 'Cleaning Box Mic',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-322',
    date: '2026-06-08',
    staffName: 'Butonk',
    division: 'Audio',
    activity: 'Cek Unit Monitor Trouble & Ngulik Smart 5',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-323',
    date: '2026-06-08',
    staffName: 'Heri',
    division: 'Lighting',
    activity: 'CLEANING All Smoke & ALL Blinder',
    notes: 'Blinder no.2 Mika Meleleh 1 Mata',
    status: 'Submitted'
  },
  {
    id: 'dr-324',
    date: '2026-06-10',
    staffName: 'Buluk',
    division: 'Audio',
    activity: 'Pengecekan DB No. 15 & 16',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-325',
    date: '2026-06-10',
    staffName: 'Yudish',
    division: 'Audio',
    activity: 'Pengambilan STNK & Pembayaran KIR Pick Up Baru',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-326',
    date: '2026-06-10',
    staffName: 'Heri',
    division: 'Lighting',
    activity: 'Cleaning All B-Eye k10',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-327',
    date: '2026-06-18',
    staffName: 'Mboh',
    division: 'Audio',
    activity: 'Cek DB Service',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-328',
    date: '2026-06-18',
    staffName: 'Buluk',
    division: 'Audio',
    activity: 'Pengecatan Stand Mic',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-329',
    date: '2026-06-19',
    staffName: 'Mboh',
    division: 'Audio',
    activity: 'Pengecekan Art',
    notes: 'Bersama Dani, Yudish, Unyim',
    status: 'Submitted'
  },
  {
    id: 'dr-330',
    date: '2026-06-20',
    staffName: 'Yudish',
    division: 'Audio',
    activity: 'Cleaning DL251 + DL32',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-331',
    date: '2026-06-20',
    staffName: 'Unyim',
    division: 'Audio',
    activity: 'Cleaning DLMS, Cleaning WHM EW-D, Cleaning WHM Shure SLXD, Cleaning RTA, Repaint Gooseneck',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-332',
    date: '2026-06-21',
    staffName: 'Mboh',
    division: 'Audio',
    activity: 'Pengecekan Mic Condersor',
    notes: 'Bersama Opik',
    status: 'Submitted'
  },
  {
    id: 'dr-333',
    date: '2026-06-25',
    staffName: 'Unyim',
    division: 'Audio',
    activity: 'Pemasangan dan pengecekan Speaker DB Servisan',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-334',
    date: '2026-06-25',
    staffName: 'Chandra',
    division: 'Multimedia',
    activity: 'Pengecekan Switcher',
    notes: '-',
    status: 'Submitted'
  },
  {
    id: 'dr-335',
    date: '2026-06-30',
    staffName: 'Yudish',
    division: 'Audio',
    activity: 'Update Combiner & Antena Distributor',
    notes: 'Distributor shure UA844-1 4Unit, Distributor EWD Senheiser 2 Unit, Combiner 1 Unit',
    status: 'Submitted'
  },
  {
    id: 'dr-336',
    date: '2026-06-30',
    staffName: 'Buluk',
    division: 'Audio',
    activity: 'Update Jumlah All Stand',
    notes: 'Stand Boox 12, Gitar 6, KeyBoard Single 4 Double 3, Mic Pjg 34 Pndek 18, Tripod 22 + Slongsong 8',
    status: 'Submitted'
  },
  {
    id: 'dr-337',
    date: '2026-06-30',
    staffName: 'Heri',
    division: 'Lighting',
    activity: 'Cleaning & Pengecekan All Inventory',
    notes: '-',
    status: 'Submitted'
  }
];

export const INITIAL_DAILY_TASKS: DailyTask[] = [
  {
    id: 'dt-1',
    title: 'Pengecekan Rutin Wireless Mic & Frekuensi Audio',
    description: 'Scanning intervensi RF pada semua mic Shure & Sennheiser untuk persiapan weekend event.',
    division: 'Audio',
    priority: 'Tinggi',
    status: 'In Progress',
    assignedName: 'Unyim',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    createdBy: 'Seno'
  },
  {
    id: 'dt-2',
    title: 'Cleaning Filter Lensa & Uji DMX Moving Head',
    description: 'Bongkar cover dan semprot debu optik moving head beam 260W di rak C3.',
    division: 'Lighting',
    priority: 'Sedang',
    status: 'Pending',
    assignedName: 'Heri',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    createdBy: 'Wahyu'
  },
  {
    id: 'dt-3',
    title: 'QC Modul Cabinet Videotron P3.9 Outdoor',
    description: 'Nyalakan test pattern RGBW 100% dan ganti receiving card jika ada flickering bar.',
    division: 'Videotron',
    priority: 'Tinggi',
    status: 'In Progress',
    assignedName: 'Ayong',
    dueDate: new Date(Date.now() + 43200000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    createdBy: 'Agus'
  },
  {
    id: 'dt-4',
    title: 'Kalibrasi White Balance 3 Unit Kamera Studio & PTZ',
    description: 'Set matching profile Sony FX3 & PTZ camera dengan switcher ATEM Mini Pro.',
    division: 'Multimedia',
    priority: 'Sedang',
    status: 'Pending',
    assignedName: 'Ulloh',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    createdBy: 'Caca'
  },
  {
    id: 'dt-5',
    title: 'Stok Opname Kabel Snake, XLR & Box Stage',
    description: 'Hitung ulang jumlah gulungan kabel snake 32 channel dan stand mic di rak A1-A4.',
    division: 'Gudang',
    priority: 'Sedang',
    status: 'Done',
    assignedName: 'Mang ube',
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    createdBy: 'Fahrul'
  },
  {
    id: 'dt-6',
    title: 'Rekapitulasi Surat Jalan & Surat Pengeluaran Barang',
    description: 'Cek kesesuaian checklist barang keluar vs aset kembali pasca konser.',
    division: 'Admin',
    priority: 'Rendah',
    status: 'Done',
    assignedName: 'Caca',
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    createdBy: 'Wahyu'
  },
  {
    id: 'dt-7',
    title: 'Perbaikan Power Supply Modul LED Rusak',
    description: 'Ganti kapasitor kembung pada 2 unit PSU Meanwell 5V 60A.',
    division: 'Service',
    priority: 'Tinggi',
    status: 'In Progress',
    assignedName: 'Pak Joko',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    createdBy: 'Wahyu'
  }
];
