/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Staff, Asset, MaintenanceSchedule, WorkOrder, Finding, LogbookEntry, DailyReport, DailyTask, VehicleMaster, FreelanceWorker, FleetDriver } from './types';

export const STAFF_LIST: Staff[] = [
  // 1. Gudang
  { id: 'staff-absobur', name: 'Abah Sobur', fullName: 'Abah Sobur', nickname: 'Abah Sobur', phone: '085778940596', division: 'Gudang', role: 'Gudang', level: 3 },
  { id: 'staff-gatot', name: 'Gatot Wiliyanto', fullName: 'Gatot Wiliyanto', nickname: 'Gatot', email: 'gatotwiliyanto397@gmail.com', phone: '083819622172', division: 'Gudang', role: 'Gudang', level: 3 },
  { id: 'staff-udin', name: 'Udin Saepudin', fullName: 'Udin Saepudin', nickname: 'Mang ube', email: 'usaepudin1511@gmail.com', phone: '082221948861', division: 'Gudang', role: 'Gudang', level: 3 },

  // 2. Admin / Manajemen
  { id: 'director-wahyu', name: 'Wahyudin', fullName: 'Wahyudin', nickname: 'Wahyu', email: 'zakimau06@gmail.com', phone: '083819947193', division: 'Admin', role: 'Admin', level: 7 },
  { id: 'staff-agustino', name: 'Agustino Setiawan', fullName: 'Agustino Setiawan', nickname: 'Agustino', email: 'agustinostwn@gmail.com', phone: '082128263551', division: 'Admin', role: 'Admin', level: 4 },
  { id: 'staff-fahrul', name: 'M. Fahruyana . A', fullName: 'M. Fahruyana . A', nickname: 'Fahrul', email: 'rullyana888@gmail.com', phone: '081287364025', division: 'Admin', role: 'Manager', level: 6 },
  { id: 'staff-syalsa', name: 'Syalsa Sri Hestariana', fullName: 'Syalsa Sri Hestariana', nickname: 'Caca', email: 'Syalsaassh24@gmail.com', phone: '087834180561', division: 'Admin', role: 'Admin', level: 4 },

  // 3. Videotron / LED
  { id: 'staff-ayong', name: 'Ayong Sumarsih', fullName: 'Ayong Sumarsih', nickname: 'Ayong', email: 'Prabuam7@gmail.com', phone: '087716184516', division: 'Videotron', role: 'Team Leader', level: 5 },
  { id: 'staff-dedi', name: 'Dedi Agus Wigiantoro', fullName: 'Dedi Agus Wigiantoro', nickname: 'Wigi', email: 'dedy.wigianto@icloud.com', phone: '085772566860', division: 'Videotron', role: 'Staff', level: 3 },
  { id: 'staff-mulyana', name: 'Mulyana', fullName: 'Mulyana', nickname: 'Kharo', email: 'tabitakharo@gmail.com', phone: '089523134060', division: 'Videotron', role: 'Staff', level: 3 },
  { id: 'staff-irvan', name: 'Muhamad Irvan', fullName: 'Muhamad Irvan', nickname: 'Irfan', email: 'Irfanthepul29@gmail.com', phone: '085282567132', division: 'Videotron', role: 'Staff', level: 3 },

  // 4. Multimedia
  { id: 'staff-chandra', name: 'Chandra', fullName: 'Chandra', nickname: 'Chandra', email: 'Chandrakakaaja@gmail.com', phone: '088225873364', division: 'Multimedia', role: 'Staff', level: 3 },
  { id: 'staff-mulyadi', name: 'Mulyadi', fullName: 'Mulyadi', nickname: 'Jay', email: 'Jaymulyadi43@gmail.com', phone: '085813994044', division: 'Multimedia', role: 'Staff', level: 3 },
  { id: 'staff-rizky', name: 'Rizky Nasrullah', fullName: 'Rizky Nasrullah', nickname: 'Rizky', email: 'rizkiuloh@gmail.com', phone: '085155188909', division: 'Multimedia', role: 'Staff', level: 3 },

  // 5. Lighting
  { id: 'staff-heri', name: 'Heri', fullName: 'Heri', nickname: 'Heri', email: 'saputraheriansyah2@gmail.com', phone: '085814152061', division: 'Lighting', role: 'Team Leader', level: 5 },

  // 6. Sound / Audio
  { id: 'staff-iwan', name: 'Iwan Kurniawan', fullName: 'Iwan Kurniawan', nickname: 'Butonk', email: 'Boetonk2785@gmail.com', phone: '083819616123', division: 'Audio', role: 'Staff', level: 3 },
  { id: 'staff-rahmat', name: 'Muhamad Rahmat', fullName: 'Muhamad Rahmat', nickname: 'Mboh', email: 'outsideprojectmboh@gmail.com', phone: '082124722363', division: 'Audio', role: 'Team Leader', level: 5 },
  { id: 'staff-ramdani', name: 'Ramdani', fullName: 'Ramdani', nickname: 'Dani', email: 'ismailramdani133@gmail.com', phone: '082123166002', division: 'Audio', role: 'Staff', level: 3 },
  { id: 'staff-suryana', name: 'Suryana', fullName: 'Suryana', nickname: 'Unyim', email: 'nia.kurni1930@gmail.com', phone: '083847130366', division: 'Audio', role: 'Staff', level: 4 },
  { id: 'staff-taufik', name: 'Taufik Diana', fullName: 'Taufik Diana', nickname: 'Opik', email: 'Taufikdya8@gmail.com', phone: '085722025295', division: 'Audio', role: 'Staff', level: 3 },
  { id: 'staff-yudish', name: 'Yudishtira Purnama A', fullName: 'Yudishtira Purnama A', nickname: 'Yudish', email: 'Yudhisintan@gmail.com', phone: '085888137581', division: 'Audio', role: 'Staff', level: 3 },
  { id: 'staff-seno', name: 'Seno Subroto', fullName: 'Seno Subroto', nickname: 'Seno', email: 'seno.subroto78@gmail.com', phone: '081297541980', division: 'Audio', role: 'Staff', level: 4 }
];

export const MASTER_STAFF: Staff[] = [...STAFF_LIST];

export function getMasterStaffList(): Staff[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('riz_master_staff_list');
      const deletedRaw = localStorage.getItem('riz_deleted_ids_master_staff');
      const deletedSet = new Set<string>(deletedRaw ? JSON.parse(deletedRaw) : []);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((s: any) => s && !deletedSet.has(String(s.id || '')));
        }
      }
      return STAFF_LIST.filter(s => !deletedSet.has(String(s.id || '')));
    } catch (e) {
      console.warn('Failed to parse riz_master_staff_list:', e);
    }
  }
  return STAFF_LIST;
}

export function getMasterFreelanceList(): FreelanceWorker[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('riz_freelance_workers');
      const deletedRaw = localStorage.getItem('riz_deleted_ids_freelance_workers');
      const deletedSet = new Set<string>(deletedRaw ? JSON.parse(deletedRaw) : []);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
            .filter((w: any) => w && !deletedSet.has(String(w.id || '')))
            .map((w: any) => ({
              ...w,
              dailyRate: (w.dailyRate && Number(w.dailyRate) > 0)
                ? Number(w.dailyRate)
                : (w.roleTitle?.toLowerCase().includes('operator') ? 350000 : w.specialization === 'Driver' ? 250000 : 200000)
            }));
        }
      }
      return INITIAL_FREELANCE_WORKERS.filter(w => !deletedSet.has(String(w.id || '')));
    } catch (e) {
      console.warn('Failed to parse riz_freelance_workers:', e);
    }
  }
  return INITIAL_FREELANCE_WORKERS;
}

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

export const INITIAL_VEHICLE_MAINTENANCES: VehicleMaintenanceRecord[] = [];
export const INITIAL_ASSETS: Asset[] = [];
export const INITIAL_MAINTENANCE_SCHEDULES: MaintenanceSchedule[] = [];
export const INITIAL_WORK_ORDERS: WorkOrder[] = [];
export const INITIAL_FINDINGS: Finding[] = [];
export const INITIAL_LOGBOOK_ENTRIES: LogbookEntry[] = [];
export const INITIAL_DAILY_REPORTS: DailyReport[] = [];
export const INITIAL_DAILY_TASKS: DailyTask[] = [];

// 50+ Official Freelance & Operator Partners PT RIZ-PRODUCTION - Sorted by Division
export const INITIAL_FREELANCE_WORKERS: FreelanceWorker[] = [
  // ── 1. DIVISI SOUND / AUDIO ───────────────────────────
  { id: 'fl-sound-1', name: 'ADIN ANDRIANSYAH', email: 'adinandriyansyah@gmail.com', phone: '08561206888', specialization: 'Audio', roleTitle: 'Operator Sound', dailyRate: 350000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-sound-2', name: 'ARDI', phone: '085717518337', specialization: 'Audio', roleTitle: 'Freelance Sound Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-sound-3', name: 'ASEP', email: 'agungprihadie@gmail.com', phone: '081294015587', specialization: 'Audio', roleTitle: 'Operator Sound', dailyRate: 350000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-sound-4', name: 'HENDAR SUPARDI', email: 'supardihendar320@gmail.com', phone: '085157226126', specialization: 'Audio', roleTitle: 'Freelance Sound Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-sound-5', name: 'MOCHAMAD FIRMANSYAH', email: 'acafirmansyah@gmail.com', phone: '085867814398', specialization: 'Audio', roleTitle: 'Freelance Sound Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-sound-6', name: 'NURDIANSYAH', email: 'onks.rieut@gmail.com', phone: '085891456730', specialization: 'Audio', roleTitle: 'Freelance Sound Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-sound-7', name: 'RACHMAT MULYANA', email: 'rchmulyana21@gmail.com', phone: '087770123122', specialization: 'Audio', roleTitle: 'Operator Sound', dailyRate: 350000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-sound-8', name: 'RINALDI KURNIAWAN', email: 'ak5905856@gmail.com', phone: '085939712262', specialization: 'Audio', roleTitle: 'Freelance Sound Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-sound-9', name: 'SYARIF HIDAYATULLAH', email: 'syariftimbul06@gmail.com', phone: '089670427430', specialization: 'Audio', roleTitle: 'Freelance Sound Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-sound-10', name: 'KIKI', phone: '0895385263310', specialization: 'Audio', roleTitle: 'Freelance Sound Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-sound-11', name: 'KADOT', phone: '', specialization: 'Audio', roleTitle: 'Freelance Sound Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-sound-12', name: 'RAMDAN', phone: '', specialization: 'Audio', roleTitle: 'Freelance Sound Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-sound-13', name: 'BOI', phone: '', specialization: 'Audio', roleTitle: 'Freelance Sound Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-sound-14', name: 'APLES', phone: '', specialization: 'Audio', roleTitle: 'Freelance Sound Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-sound-15', name: 'CEPER', phone: '', specialization: 'Audio', roleTitle: 'Freelance Sound Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-sound-16', name: 'REBINK', phone: '', specialization: 'Audio', roleTitle: 'Operator Sound', dailyRate: 350000, status: 'Aktif', createdAt: '2026-09-01' },

  // ── 2. DIVISI MULTIMEDIA ──────────────────────────────
  { id: 'fl-multi-1', name: 'ARIQ', email: 'ariqarrobani2@gmail.com', phone: '085156892661', specialization: 'Multimedia', roleTitle: 'Freelance Multimedia Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-multi-2', name: 'HERIANA', email: 'Heriana1905@gmail.com', phone: '085693948411', specialization: 'Multimedia', roleTitle: 'Operator Multimedia', dailyRate: 350000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-multi-3', name: 'IMAN', email: 'mhanshungkul@gmail.com', phone: '083896782116', specialization: 'Multimedia', roleTitle: 'Freelance Multimedia Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-multi-4', name: 'KEMAL', phone: '08561130189', specialization: 'Multimedia', roleTitle: 'Freelance Multimedia Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-multi-5', name: 'KEVIN AXL YOHANES WAGEY', email: 'hitmeup.kevinaxl@gmail.com', phone: '081806484747', specialization: 'Multimedia', roleTitle: 'Freelance Multimedia Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-multi-6', name: 'FERA', email: 'feramaulida34@gmail.com', phone: '08993886831', specialization: 'Multimedia', roleTitle: 'Freelance Multimedia Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-multi-7', name: 'ANDI', phone: '', specialization: 'Multimedia', roleTitle: 'Freelance Multimedia Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-multi-8', name: 'ALI', phone: '', specialization: 'Multimedia', roleTitle: 'Freelance Multimedia Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-multi-9', name: 'ROFIQ', phone: '', specialization: 'Multimedia', roleTitle: 'Freelance Multimedia Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-multi-10', name: 'ZIDAN', phone: '', specialization: 'Multimedia', roleTitle: 'Freelance Multimedia Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-multi-11', name: 'RICHARD', phone: '', specialization: 'Multimedia', roleTitle: 'Freelance Multimedia Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-multi-12', name: 'TOPAN', phone: '', specialization: 'Multimedia', roleTitle: 'Freelance Multimedia Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-multi-13', name: 'INDRA', phone: '', specialization: 'Multimedia', roleTitle: 'Freelance Multimedia Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-multi-14', name: 'INU', phone: '', specialization: 'Multimedia', roleTitle: 'Freelance Multimedia Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },

  // ── 3. DIVISI LIGHTING ────────────────────────────────
  { id: 'fl-light-1', name: 'ENDANG', email: 'Enda891@gmail.com', phone: '081818653180', specialization: 'Lighting', roleTitle: 'Operator Lighting', dailyRate: 350000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-light-2', name: 'ENDIN', email: 'lightingendin@gmail.com', phone: '085782255517', specialization: 'Lighting', roleTitle: 'Operator Lighting', dailyRate: 350000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-light-3', name: 'FAISAL NUGRAHA ISKANDAR', email: 'faisalnugraha11455@gmail.com', phone: '088210979655', specialization: 'Lighting', roleTitle: 'Freelance Lighting Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-light-4', name: 'IDRUS MAULANA', email: 'iddrusmaulana17@gmail.com', phone: '083870557341', specialization: 'Lighting', roleTitle: 'Freelance Lighting Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-light-5', name: 'MIING', phone: '088220972242', specialization: 'Lighting', roleTitle: 'Freelance Lighting Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-light-6', name: 'UGAN', email: 'gilanguganhaziq@gmail.com', phone: '089612152799', specialization: 'Lighting', roleTitle: 'Freelance Lighting Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-light-7', name: 'KEVIN', phone: '083147165162', specialization: 'Lighting', roleTitle: 'Freelance Lighting Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-light-8', name: 'BOANG', phone: '085695708082', specialization: 'Lighting', roleTitle: 'Freelance Lighting Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-light-9', name: 'OTANG', phone: '', specialization: 'Lighting', roleTitle: 'Freelance Lighting Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },

  // ── 4. DIVISI VIDEOTRON / LED ─────────────────────────
  { id: 'fl-video-1', name: 'ADI', phone: '082210333041', specialization: 'Videotron', roleTitle: 'Freelance LED Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-video-2', name: 'FIKI FAUJI', email: 'Vickysatrya1414@gmail.com', phone: '082299245583', specialization: 'Videotron', roleTitle: 'Freelance LED Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-video-3', name: 'IPAL', email: 'ifpalpadilah170104@gmail.com', phone: '085889915925', specialization: 'Videotron', roleTitle: 'Freelance LED Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-video-4', name: 'SANTOSO', email: 'Sanambonambon@gmail.com', phone: '082325343690', specialization: 'Videotron', roleTitle: 'Freelance LED Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-video-5', name: 'SISWOYO', email: 'siswoyo9995@gmail.com', phone: '082125242340', specialization: 'Videotron', roleTitle: 'Freelance LED Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-video-6', name: 'YOPI SURAHMAN', email: 'yopiy712@gmail.com', phone: '081288489465', specialization: 'Videotron', roleTitle: 'Freelance LED Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },

  // ── 5. DIVISI DRIVER / ARMADA ─────────────────────────
  { id: 'fl-drv-1', name: 'YOSEP', phone: '081291225933', specialization: 'Driver', roleTitle: 'Freelance Driver', dailyRate: 250000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-drv-2', name: 'BUNONK', phone: '087726355305', specialization: 'Driver', roleTitle: 'Freelance Driver', dailyRate: 250000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-drv-3', name: 'SISWOYO (WOYO)', phone: '082125242340', specialization: 'Driver', roleTitle: 'Freelance Driver', dailyRate: 250000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-drv-4', name: 'SYARIF HIDAYATULLAH (TIMBUL)', phone: '089670427430', specialization: 'Driver', roleTitle: 'Freelance Driver', dailyRate: 250000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-drv-5', name: 'FIKI FAUJI', phone: '082299245583', specialization: 'Driver', roleTitle: 'Freelance Driver', dailyRate: 250000, status: 'Aktif', createdAt: '2026-09-01' },

  // ── 6. DIVISI UMUM / LAPANGAN ─────────────────────────
  { id: 'fl-umum-1', name: 'BLAHEM', phone: '', specialization: 'Umum', roleTitle: 'Freelance Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-umum-2', name: 'RIO', phone: '', specialization: 'Umum', roleTitle: 'Freelance Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-umum-3', name: 'JAE', phone: '', specialization: 'Umum', roleTitle: 'Freelance Crew', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' }
];

// Master Driver Armada Resmi
export const INITIAL_FLEET_DRIVERS: FleetDriver[] = [
  {
    id: 'drv-1',
    name: 'YOSEP',
    phone: '081291225933',
    driverType: 'Freelance Driver',
    simType: 'SIM B1',
    simExpiry: '2027-08-15',
    assignedVehicle: 'Truk Box Mitsubishi Canter CDD (6 Roda)',
    status: 'Siap Jalan',
    createdAt: '2026-09-01'
  },
  {
    id: 'drv-2',
    name: 'BUNONK',
    phone: '087726355305',
    driverType: 'Freelance Driver',
    simType: 'SIM B1',
    simExpiry: '2027-10-20',
    assignedVehicle: 'Truk Box Hino Dutro CDE Engkel (4 Roda)',
    status: 'Siap Jalan',
    createdAt: '2026-09-01'
  },
  {
    id: 'drv-3',
    name: 'Gatot Wiliyanto',
    phone: '083819622172',
    driverType: 'Internal',
    simType: 'SIM B1',
    simExpiry: '2028-03-10',
    assignedVehicle: 'Truk Box Mitsubishi Canter CDD (6 Roda)',
    status: 'Siap Jalan',
    createdAt: '2026-09-01'
  },
  {
    id: 'drv-4',
    name: 'Udin Saepudin',
    phone: '082221948861',
    driverType: 'Internal',
    simType: 'SIM A',
    simExpiry: '2028-05-12',
    assignedVehicle: 'Blind Van Gran Max Operasional',
    status: 'Siap Jalan',
    createdAt: '2026-09-01'
  }
];

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
