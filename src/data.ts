/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Staff, Asset, MaintenanceSchedule, WorkOrder, Finding, LogbookEntry, DailyReport, DailyTask, VehicleMaster } from './types';

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
  { id: '17', name: 'Jay', division: 'Multimedia', role: 'Staff' },

  // Videotron
  { id: '19', name: 'Ayong', division: 'Videotron', role: 'Team Leader' },
  { id: '20', name: 'Wigi', division: 'Videotron', role: 'Staff' },
  { id: '21', name: 'Irfan', division: 'Videotron', role: 'Staff' },

  // Service (Perbaikan)
  { id: '23', name: 'Mang Damri', division: 'Service', role: 'Team Leader' },
  { id: '22', name: 'Kharo', division: 'Service', role: 'Staff' },
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

// Clean empty arrays for user input - Data dummy dibersihkan total
export const INITIAL_ASSETS: Asset[] = [];
export const INITIAL_MAINTENANCE_SCHEDULES: MaintenanceSchedule[] = [];
export const INITIAL_WORK_ORDERS: WorkOrder[] = [];
export const INITIAL_FINDINGS: Finding[] = [];
export const INITIAL_LOGBOOK_ENTRIES: LogbookEntry[] = [];
export const INITIAL_DAILY_REPORTS: DailyReport[] = [];
export const INITIAL_DAILY_TASKS: DailyTask[] = [];

// Master Inventaris Armada Kendaraan Resmi PT RIZ-PRODUCTION
export const INITIAL_VEHICLES: VehicleMaster[] = [
  {
    id: 'veh-1',
    name: 'Truk Box Mitsubishi Canter CDD (6 Roda)',
    ownership: 'Internal',
    policeNumber: 'B 9142 SXZ',
    vehicleType: 'Truk Box CDD (6 Roda)',
    tonnageCapacity: 5.0,
    cbmCapacity: 22.5,
    odometerKM: 64200,
    stnkTaxExpiry: '2026-11-18',
    kirExpiry: '2026-09-30',
    status: 'Siap Operasi'
  },
  {
    id: 'veh-2',
    name: 'Truk Box Hino Dutro CDE Engkel (4 Roda)',
    ownership: 'Internal',
    policeNumber: 'B 9804 UYA',
    vehicleType: 'Truk Box CDE Engkel (4 Roda)',
    tonnageCapacity: 3.0,
    cbmCapacity: 14.0,
    odometerKM: 81500,
    stnkTaxExpiry: '2026-10-05',
    kirExpiry: '2026-10-12',
    status: 'Siap Operasi'
  },
  {
    id: 'veh-3',
    name: 'Daihatsu Gran Max Blindvan',
    ownership: 'Internal',
    policeNumber: 'B 2319 POX',
    vehicleType: 'Blindvan Logistik',
    tonnageCapacity: 1.0,
    cbmCapacity: 5.5,
    odometerKM: 43200,
    stnkTaxExpiry: '2027-01-22',
    kirExpiry: '2027-01-20',
    status: 'Siap Operasi'
  },
  {
    id: 'veh-4',
    name: 'Mitsubishi L300 Pick-Up Box',
    ownership: 'Internal',
    policeNumber: 'B 9043 TQB',
    vehicleType: 'Pick-Up Box',
    tonnageCapacity: 1.5,
    cbmCapacity: 7.2,
    odometerKM: 112000,
    stnkTaxExpiry: '2026-12-10',
    kirExpiry: '2026-10-28',
    status: 'Siap Operasi'
  },
  {
    id: 'veh-5',
    name: 'Toyota Avanza Tim Operasional',
    ownership: 'Internal',
    policeNumber: 'B 1874 RIZ',
    vehicleType: 'Mobil Kru / Operasional',
    tonnageCapacity: 0.6,
    cbmCapacity: 2.8,
    odometerKM: 52100,
    stnkTaxExpiry: '2027-04-14',
    kirExpiry: '2027-04-14',
    status: 'Siap Operasi'
  },
  {
    id: 'veh-6',
    name: 'Truk Wingbox Mitra Logistik 9.5M',
    ownership: 'Sewa Mitra',
    policeNumber: 'B 9552 KTN',
    vehicleType: 'Truk Wingbox Tronton',
    tonnageCapacity: 15.0,
    cbmCapacity: 48.0,
    odometerKM: 145000,
    stnkTaxExpiry: '2027-02-10',
    kirExpiry: '2027-01-15',
    status: 'Siap Operasi'
  },
  {
    id: 'veh-7',
    name: 'Truk CDD Long Mitra Logistik',
    ownership: 'Sewa Mitra',
    policeNumber: 'B 9331 JXQ',
    vehicleType: 'Truk CDD Long Box',
    tonnageCapacity: 6.0,
    cbmCapacity: 28.0,
    odometerKM: 98000,
    stnkTaxExpiry: '2026-11-30',
    kirExpiry: '2026-11-15',
    status: 'Siap Operasi'
  }
];
