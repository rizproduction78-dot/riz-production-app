/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Staff, Asset, MaintenanceSchedule, WorkOrder, Finding, LogbookEntry, DailyReport, DailyTask, VehicleMaster, FreelanceWorker, FleetDriver, VehicleMaintenanceRecord } from './types';
import {
  CANONICAL_FIRESTORE_DAILY_REPORTS,
  CANONICAL_FIRESTORE_LOGBOOK_ENTRIES,
  CANONICAL_FIRESTORE_FINDINGS,
  CANONICAL_FIRESTORE_WORK_ORDERS
} from './data/canonicalFirestoreData';

export const STAFF_LIST: Staff[] = [
  // 1. Gudang
  { id: 'staff-absobur', name: 'Aep Saepudin', fullName: 'Aep Saepudin', nickname: 'Aep / Subur', phone: '085778940596', division: 'Gudang', role: 'Staff', level: 3 },
  { id: 'staff-gatot', name: 'Gatot Wiliyanto', fullName: 'Gatot Wiliyanto', nickname: 'Gatot', email: 'gatotwiliyanto397@gmail.com', phone: '083819622172', division: 'Gudang', role: 'Staff', level: 3 },
  { id: 'staff-udin', name: 'Udin Saepudin', fullName: 'Udin Saepudin', nickname: 'Mang ube', email: 'usaepudin1511@gmail.com', phone: '082221948861', division: 'Gudang', role: 'Staff Leader', level: 5 },

  // 2. Admin / Manajemen
  { id: 'director-wahyu', name: 'Wahyu', fullName: 'Wahyu', nickname: 'Wahyu', email: 'zakimau06@gmail.com', phone: '083819947193', division: 'Admin', role: 'Direktur', level: 8 },
  { id: 'staff-agustino', name: 'Agustino Setiawan', fullName: 'Agustino Setiawan', nickname: 'Agus', email: 'agustinostwn@gmail.com', phone: '082128263551', division: 'Admin', role: 'Staff Admin', level: 4 },
  { id: 'staff-fahrul', name: 'M. Fahrulyana . A', fullName: 'M. Fahrulyana . A', nickname: 'Fahrul', email: 'rullyana888@gmail.com', phone: '081287364025', division: 'Admin', role: 'Manager', level: 7 },
  { id: 'staff-syalsa', name: 'Syalsa Sri Hestariana', fullName: 'Syalsa Sri Hestariana', nickname: 'Caca', email: 'Syalsaassh24@gmail.com', phone: '087834180561', division: 'Admin', role: 'Staff Admin', level: 4 },
  { id: 'staff-seno', name: 'Seno Subroto', fullName: 'Seno Subroto', nickname: 'Seno', email: 'seno.subroto78@gmail.com', phone: '081297541980', division: 'Admin', role: 'Staff Admin', level: 4 },

  // 3. Videotron / LED
  { id: 'staff-ayong', name: 'Ayong Sumarsih', fullName: 'Ayong Sumarsih', nickname: 'Ayong', email: 'Prabuam7@gmail.com', phone: '087716184516', division: 'Videotron', role: 'Team Leader', level: 5 },
  { id: 'staff-dedi', name: 'Dedi Agus Wigiantoro', fullName: 'Dedi Agus Wigiantoro', nickname: 'Wigi', email: 'dedy.wigianto@icloud.com', phone: '085772566860', division: 'Videotron', role: 'Staff', level: 3 },
  { id: 'staff-irvan', name: 'Muhamad Irvan', fullName: 'Muhamad Irvan', nickname: 'Irfan', email: 'Irfanthepul29@gmail.com', phone: '085282567132', division: 'Videotron', role: 'Staff', level: 3 },

  // 4. Multimedia
  { id: 'staff-mulyadi', name: 'Mulyadi', fullName: 'Mulyadi', nickname: 'Jay', email: 'Jaymulyadi43@gmail.com', phone: '085813994044', division: 'Multimedia', role: 'Team Leader', level: 5 },

  // 5. Lighting
  { id: 'staff-heri', name: 'Heri', fullName: 'Heri', nickname: 'Heri', email: 'saputraheriansyah2@gmail.com', phone: '085814152061', division: 'Lighting', role: 'Team Leader', level: 5 },

  // 6. Sound (Audio)
  { id: 'staff-iwan', name: 'Iwan Kurniawan', fullName: 'Iwan Kurniawan', nickname: 'Butonk', email: 'Boetonk2785@gmail.com', phone: '083819616123', division: 'Audio', role: 'Staff', level: 3 },
  { id: 'staff-rahmat', name: 'Muhamad Rahmat', fullName: 'Muhamad Rahmat', nickname: 'Mboh', email: 'outsideprojectmboh@gmail.com', phone: '082124722363', division: 'Audio', role: 'Team Leader', level: 5 },
  { id: 'staff-ramdani', name: 'Ramdani', fullName: 'Ramdani', nickname: 'Dani', email: 'ismailramdani133@gmail.com', phone: '082123166002', division: 'Audio', role: 'Staff', level: 3 },
  { id: 'staff-suryana', name: 'Suryana', fullName: 'Suryana', nickname: 'Nana / Buluk', email: 'nia.kurni1930@gmail.com', phone: '083847130366', division: 'Audio', role: 'Staff', level: 3 },
  { id: 'staff-taufik', name: 'Taufik Diana', fullName: 'Taufik Diana', nickname: 'Opik', email: 'Taufikdya8@gmail.com', phone: '085722025295', division: 'Audio', role: 'Staff', level: 3 },
  { id: 'staff-unyin', name: 'Wahyudin', fullName: 'Wahyudin', nickname: 'Unyim', email: 'wahyudin.unyin@gmail.com', phone: '085812345678', division: 'Audio', role: 'Staff', level: 3 },
  { id: 'staff-yudish', name: 'Yudishtira Purnama A', fullName: 'Yudishtira Purnama A', nickname: 'Yudish', email: 'Yudhisintan@gmail.com', phone: '085888137581', division: 'Audio', role: 'Staff', level: 3 },

  // 7. Service
  { id: 'staff-damri', name: 'Damri', fullName: 'Damri', nickname: 'Damri', email: 'damri.service@rizproduction.com', phone: '081288990011', division: 'Service', role: 'Team Leader', level: 5 },
  { id: 'staff-mulyana', name: 'Mulyana', fullName: 'Mulyana', nickname: 'Kharo', email: 'tabitakharo@gmail.com', phone: '089523134060', division: 'Service', secondaryDivision: 'Videotron', divisions: ['Service', 'Videotron'], role: 'Staff', level: 3 }
];

export const MASTER_STAFF: Staff[] = [...STAFF_LIST];

export function normalizeStaffMaster(rawList: any[]): Staff[] {
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return [...STAFF_LIST];
  }

  const staffMap = new Map<string, Staff>();

  for (const s of rawList) {
    if (!s) continue;
    const rawId = String(s.id || '').trim();
    const rawName = String(s.name || '').trim();
    const rawFull = String(s.fullName || '').trim();
    const rawNick = String(s.nickname || '').trim();
    const combinedStr = `${rawId} ${rawName} ${rawFull} ${rawNick} ${s.email || ''}`.toLowerCase();

    // Filter out deleted or non-inhouse freelance workers
    if (
      rawId === 'staff-chandra' ||
      rawId === 'staff-rizky' ||
      (combinedStr.includes('chandra') && !combinedStr.includes('admin')) ||
      (combinedStr.includes('rizky nasrullah'))
    ) {
      continue;
    }

    let canonicalId = rawId;
    let canonicalStaff: Staff = { ...s };

    // 1. Wahyu (Owner / Director)
    if (
      rawId === 'director-wahyu' ||
      rawId === 'staff-wahyu' ||
      rawId === 'admin-wahyu' ||
      (combinedStr.includes('wahyu') && !combinedStr.includes('wahyudin')) ||
      (s.division === 'Admin' && (s.role === 'Owner' || s.role === 'Direktur' || combinedStr.includes('director')))
    ) {
      canonicalId = 'director-wahyu';
      canonicalStaff.id = 'director-wahyu';
    }
    // 2. Suryana / Nana / Buluk (Audio Staff)
    else if (
      rawId === 'staff-suryana' ||
      combinedStr.includes('suryana') ||
      combinedStr.includes('nana') ||
      combinedStr.includes('buluk') ||
      combinedStr.includes('bulux') ||
      combinedStr.includes('nia.kurni')
    ) {
      canonicalId = 'staff-suryana';
      canonicalStaff.id = 'staff-suryana';
    }
    // 2b. Wahyudin / Unyim (Audio Staff)
    else if (
      rawId === 'staff-unyin' ||
      rawId === 'staff-unyim' ||
      rawId === 'staff-wahyudin' ||
      combinedStr.includes('unyim') ||
      combinedStr.includes('unyin') ||
      (combinedStr.includes('wahyudin') && !combinedStr.includes('director-wahyu'))
    ) {
      canonicalId = 'staff-unyin';
      canonicalStaff.id = 'staff-unyin';
    }
    // 3. Seno Subroto (Admin Staff)
    else if (rawId === 'staff-seno' || combinedStr.includes('seno')) {
      canonicalId = 'staff-seno';
      canonicalStaff.id = 'staff-seno';
    }
    // 4. Damri (Service Leader)
    else if (rawId === 'staff-damri' || combinedStr.includes('damri')) {
      canonicalId = 'staff-damri';
      canonicalStaff.id = 'staff-damri';
    }
    // 5. Mulyana (Service Staff)
    else if (rawId === 'staff-mulyana' || combinedStr.includes('mulyana') || combinedStr.includes('kharo')) {
      canonicalId = 'staff-mulyana';
      canonicalStaff.id = 'staff-mulyana';
    }
    // 6. Iwan Kurniawan / Butonk (Audio)
    else if (rawId === 'staff-iwan' || combinedStr.includes('iwan') || combinedStr.includes('butonk') || combinedStr.includes('boetonk')) {
      canonicalId = 'staff-iwan';
      canonicalStaff.id = 'staff-iwan';
    }
    // 7. Muhamad Rahmat / Mboh (Audio Leader)
    else if (rawId === 'staff-rahmat' || combinedStr.includes('rahmat') || combinedStr.includes('mboh')) {
      canonicalId = 'staff-rahmat';
      canonicalStaff.id = 'staff-rahmat';
    }
    // 8. Ramdani / Dani (Audio)
    else if (rawId === 'staff-ramdani' || combinedStr.includes('ramdani') || combinedStr.includes('dani')) {
      canonicalId = 'staff-ramdani';
      canonicalStaff.id = 'staff-ramdani';
    }
    // 9. Taufik Diana / Opik (Audio)
    else if (rawId === 'staff-taufik' || combinedStr.includes('taufik') || combinedStr.includes('opik')) {
      canonicalId = 'staff-taufik';
      canonicalStaff.id = 'staff-taufik';
    }
    // 10. Yudishtira Purnama A / Yudish (Audio)
    else if (rawId === 'staff-yudish' || combinedStr.includes('yudishtira') || combinedStr.includes('yudish')) {
      canonicalId = 'staff-yudish';
      canonicalStaff.id = 'staff-yudish';
    }
    // 11. Heri (Lighting Leader)
    else if (rawId === 'staff-heri' || combinedStr.includes('heri')) {
      canonicalId = 'staff-heri';
      canonicalStaff.id = 'staff-heri';
    }
    // 12. Mulyadi / Jay (Multimedia)
    else if (rawId === 'staff-mulyadi' || combinedStr.includes('mulyadi') || combinedStr.includes('jay')) {
      canonicalId = 'staff-mulyadi';
      canonicalStaff.id = 'staff-mulyadi';
    }
    // 13. Ayong Sumarsih (Videotron Leader)
    else if (rawId === 'staff-ayong' || combinedStr.includes('ayong')) {
      canonicalId = 'staff-ayong';
      canonicalStaff.id = 'staff-ayong';
    }
    // 14. Dedi Agus Wigiantoro / Wigi (Videotron)
    else if (rawId === 'staff-dedi' || combinedStr.includes('dedi') || combinedStr.includes('wigi')) {
      canonicalId = 'staff-dedi';
      canonicalStaff.id = 'staff-dedi';
    }
    // 15. Muhamad Irvan / Irfan (Videotron)
    else if (rawId === 'staff-irvan' || combinedStr.includes('irvan') || combinedStr.includes('irfan')) {
      canonicalId = 'staff-irvan';
      canonicalStaff.id = 'staff-irvan';
    }
    // 16. Aep Saepudin / Aep / Subur (Gudang)
    else if (rawId === 'staff-absobur' || /\b(aep|subur|sobur|absobur)\b/i.test(rawName + ' ' + rawNick)) {
      canonicalId = 'staff-absobur';
      canonicalStaff.id = 'staff-absobur';
    }
    // 17. Gatot Wiliyanto (Gudang)
    else if (rawId === 'staff-gatot' || combinedStr.includes('gatot')) {
      canonicalId = 'staff-gatot';
      canonicalStaff.id = 'staff-gatot';
    }
    // 18. Udin Saepudin / Mang ube (Gudang)
    else if (rawId === 'staff-udin' || /\b(udin|mang ube|ube|ubed)\b/i.test(rawName + ' ' + rawNick)) {
      canonicalId = 'staff-udin';
      canonicalStaff.id = 'staff-udin';
    }
    // 19. Agustino Setiawan (Admin)
    else if (rawId === 'staff-agustino' || combinedStr.includes('agustino')) {
      canonicalId = 'staff-agustino';
      canonicalStaff.id = 'staff-agustino';
    }
    // 20. M. Fahruyana . A / Fahrul (Manager)
    else if (rawId === 'staff-fahrul' || combinedStr.includes('fahruyana') || combinedStr.includes('fahrul') || combinedStr.includes('rullyana')) {
      canonicalId = 'staff-fahrul';
      canonicalStaff.id = 'staff-fahrul';
    }
    // 21. Syalsa Sri Hestariana / Caca (Admin)
    else if (rawId === 'staff-syalsa' || combinedStr.includes('syalsa') || combinedStr.includes('caca')) {
      canonicalId = 'staff-syalsa';
      canonicalStaff.id = 'staff-syalsa';
    }

    // Overwrite or update in staffMap
    // Overwrite or update in staffMap
    staffMap.set(canonicalId, { ...canonicalStaff, id: canonicalId });
  }

  // Remove any legacy obsolete IDs
  staffMap.delete('staff-chandra');
  staffMap.delete('staff-rizky');

  return Array.from(staffMap.values());
}

export function getMasterStaffList(): Staff[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('riz_master_staff_list');
      const deletedRaw = localStorage.getItem('riz_deleted_ids_master_staff');
      const deletedSet = new Set<string>(deletedRaw ? JSON.parse(deletedRaw) : []);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter((s: any) => s && !deletedSet.has(String(s.id || '')));
          return normalizeStaffMaster(filtered);
        }
      }
      return normalizeStaffMaster(STAFF_LIST.filter(s => !deletedSet.has(String(s.id || ''))));
    } catch (e) {
      console.warn('Failed to parse riz_master_staff_list:', e);
    }
  }
  return [...STAFF_LIST];
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
              dailyRate: (w.dailyRate !== undefined && w.dailyRate !== null && !isNaN(Number(w.dailyRate)))
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
export const INITIAL_WORK_ORDERS: WorkOrder[] = CANONICAL_FIRESTORE_WORK_ORDERS;

// Data Temuan QC Resmi (Wh-Logbook-2026 Canonical)
export const INITIAL_FINDINGS: Finding[] = CANONICAL_FIRESTORE_FINDINGS;

// Data Logbook Inspeksi QC Resmi (Wh-Logbook-2026 Canonical)
export const INITIAL_LOGBOOK_ENTRIES: LogbookEntry[] = CANONICAL_FIRESTORE_LOGBOOK_ENTRIES;

// Data Laporan Harian Resmi (Wh-Logbook-2026 Canonical)
export const INITIAL_DAILY_REPORTS: DailyReport[] = CANONICAL_FIRESTORE_DAILY_REPORTS;

// 7 Daily Tasks Resmi dari Reference Google Sheet (1 - 6 September 2026)
export const INITIAL_DAILY_TASKS: DailyTask[] = [
  {
    id: 'dt-20260901-01',
    title: 'Belajar Aplikasi Gemini & Chat GPT',
    description: 'Belajar Aplikasi Gemini dan Belajar Aplikasi Chat GPT.',
    division: 'Multimedia',
    priority: 'Sedang',
    status: 'Done',
    assignedTo: '7',
    assignedName: 'Jay',
    dueDate: '2026-09-01',
    createdAt: '2026-09-01',
    createdBy: 'Jay'
  },
  {
    id: 'dt-20260903-01',
    title: 'Pengecekan Semua Unit Speker DBTech15 SmaartLive & Pembersihan Debu',
    description: '1* Pengecekan semua unit speker DBTtech15 dengan mengunakan smartlive berdasarkan tersebut.\n2* Membersihkan smua unit DBtech dari debu.\nREMARK:\n- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasuil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event.\n- Rekomendasi untuk di cek oleh team service terutama pada modul Amplifier.',
    division: 'Audio',
    priority: 'Sedang',
    status: 'Done',
    assignedTo: '8',
    assignedName: 'Mboh, Yudis, Buluk, Butong',
    dueDate: '2026-09-03',
    createdAt: '2026-09-03',
    createdBy: 'Mboh'
  },
  {
    id: 'dt-20260904-01',
    title: 'Pengecekan Panel 3 Unit',
    description: '- Pengecekan Panel 3 Unit\nREMARK:\n- 2 panel Sudah OK\n- 1 Ganti Stop Kontak, 1 Ganti Legran Cewe',
    division: 'Audio',
    priority: 'Sedang',
    status: 'Done',
    assignedTo: '13',
    assignedName: 'Opik, Buluk',
    dueDate: '2026-09-04',
    createdAt: '2026-09-04',
    createdBy: 'Opik'
  },
  {
    id: 'dt-20260905-01',
    title: 'Perbaikan Panel Listrik & Praktek Sub Cardioid dan End-Fire (Sub T45)',
    description: '- Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire menggunakan Sub T45\nREMARK:\n- Panel listrik dalam kondisi aman dan bisa di gunakan',
    division: 'Audio',
    priority: 'Sedang',
    status: 'Done',
    assignedTo: '13',
    assignedName: 'Opik, Mboh',
    dueDate: '2026-09-05',
    createdAt: '2026-09-05',
    createdBy: 'Opik'
  },
  {
    id: 'dt-20260905-02',
    title: 'Repair Ganti Pixel Kabinet LED 2 Box',
    description: '- Repair Ganti Pixel Kabinet LED 2 Box',
    division: 'Videotron',
    priority: 'Sedang',
    status: 'Done',
    assignedTo: '17',
    assignedName: 'Kharo',
    dueDate: '2026-09-05',
    createdAt: '2026-09-05',
    createdBy: 'Kharo'
  },
  {
    id: 'dt-20260906-01',
    title: 'Repair Ganti Pixel Kabinet LED 2 Box',
    description: '- Repair ganti pixel kabinet led 2 box',
    division: 'Videotron',
    priority: 'Sedang',
    status: 'In Progress',
    assignedTo: '17',
    assignedName: 'Kharo',
    dueDate: '2026-09-06',
    createdAt: '2026-09-06',
    createdBy: 'Kharo'
  },
  {
    id: 'dt-20260906-02',
    title: 'Cek Cable XLR dan Jack to Jack',
    description: 'Cek cable XLR dan Jack to Jack',
    division: 'Audio',
    priority: 'Sedang',
    status: 'Done',
    assignedTo: '10',
    assignedName: 'Dani',
    dueDate: '2026-09-06',
    createdAt: '2026-09-06',
    createdBy: 'Dani'
  },
  {
    id: 'dt-20260907-01',
    title: 'Cek unit, cleaning, cek colour parled',
    description: '- Cek unit, cleaning, cek colour parled\nREMARK:\n- Parled Warm mati No. 12, 25, 29 & Warm separo No. 3, 32',
    division: 'Lighting',
    priority: 'Sedang',
    status: 'Done',
    assignedTo: 'staff-heri',
    assignedName: 'Heri',
    dueDate: '2026-09-07',
    createdAt: '2026-09-07',
    createdBy: 'Heri'
  },
  {
    id: 'dt-20260909-01',
    title: 'Repair dead pixel & Copot Masking',
    description: '- Repair dead pixel\n- Copot Masking',
    division: 'Videotron',
    priority: 'Sedang',
    status: 'In Progress',
    assignedTo: 'staff-mulyana',
    assignedName: 'Kharo, Wigi, Ayong',
    dueDate: '2026-09-09',
    createdAt: '2026-09-09',
    createdBy: 'Kharo'
  },
  {
    id: 'dt-20260909-02',
    title: 'Perbaikan snack 8 ch, 16 ch, rumbay drum, Cek Mic EWD / Ganti Spul',
    description: '- Perbaikan :\n1. snack 8 ch\n2. snack 16 ch\n3. rumbay drum\n4. Cek Mic EWD/ Ganti Spul',
    division: 'Audio',
    priority: 'Tinggi',
    status: 'In Progress',
    assignedTo: 'staff-suryana',
    assignedName: 'Buluk, Opik, Butong, Dani',
    dueDate: '2026-09-09',
    createdAt: '2026-09-09',
    createdBy: 'Buluk'
  }
];

// 50+ Official Freelance & Operator Partners PT RIZ-PRODUCTION - Sorted by Division
export const INITIAL_FREELANCE_WORKERS: FreelanceWorker[] = [
  {
    "id": "fl-1788686708932",
    "address": "",
    "email": "",
    "phone": "085155188909",
    "dailyRate": 200000,
    "skills": "",
    "idCardNumber": "",
    "name": "RIZKY NASRULLAH",
    "specialization": "Multimedia",
    "createdAt": "2026-09-06",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-09-28T11:34:29.783Z",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "bankAccountHolder": "RIZKY NASRULLAH",
    "notes": "",
    "rating": 5,
    "roleTitle": "VIDEO DIRECTOR",
    "status": "Aktif",
    "bankName": "BCA",
    "bankAccountNumber": ""
  },
  {
    "id": "fl-1788686764881",
    "notes": "",
    "skills": "",
    "address": "",
    "roleTitle": "CAMERA-PERSON",
    "idCardNumber": "",
    "bankAccountHolder": "CHANDRA",
    "name": "CHANDRA",
    "dailyRate": 200000,
    "phone": "088225873364",
    "email": "Chandrakakaaja@gmail.com",
    "rating": 5,
    "bankAccountNumber": "",
    "bankName": "BCA",
    "createdAt": "2026-09-06",
    "specialization": "Multimedia",
    "status": "Aktif",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-09-08T23:18:37.535Z"
    }
  },
  {
    "id": "fl-1788686929568",
    "name": "HERIANA",
    "dailyRate": 200000,
    "bankAccountNumber": "",
    "address": "",
    "status": "Aktif",
    "rating": 5,
    "email": "Heriana1905@gmail.com",
    "phone": "085693948411",
    "createdAt": "2026-09-06",
    "_syncMeta": {
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-09-08T23:18:37.535Z",
      "browser": "Chrome"
    },
    "bankName": "BCA",
    "bankAccountHolder": "HERIANA",
    "skills": "",
    "specialization": "Multimedia",
    "notes": "",
    "roleTitle": "CAMERA-PERSON",
    "idCardNumber": ""
  },
  {
    "id": "fl-1788687073193",
    "bankAccountNumber": "",
    "address": "",
    "skills": "",
    "roleTitle": "CAMERA-PERSON",
    "email": "hitmeup.kevinaxl@gmail.com",
    "phone": "081806484747",
    "name": "KEVIN AXL YOHANES WAGEY",
    "idCardNumber": "",
    "rating": 5,
    "bankAccountHolder": "KEVIN AXL YOHANES WAGEY",
    "bankName": "BCA",
    "dailyRate": 200000,
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "updatedAt": "2026-09-08T23:18:37.535Z",
      "browser": "Chrome"
    },
    "status": "Aktif",
    "specialization": "Multimedia",
    "notes": "",
    "createdAt": "2026-09-06"
  },
  {
    "id": "fl-1788687145820",
    "status": "Aktif",
    "address": "",
    "email": "",
    "phone": "08561130189",
    "bankName": "BCA",
    "roleTitle": "Freelance Multimedia",
    "bankAccountNumber": "",
    "rating": 5,
    "dailyRate": 200000,
    "specialization": "Multimedia",
    "notes": "",
    "name": "KEMAL",
    "createdAt": "2026-09-06",
    "idCardNumber": "",
    "bankAccountHolder": "KEMAL",
    "_syncMeta": {
      "updatedAt": "2026-09-08T23:18:37.535Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "skills": ""
  },
  {
    "id": "fl-1788687198428",
    "notes": "",
    "address": "",
    "name": "FERA",
    "idCardNumber": "",
    "roleTitle": "Freelance Multimedia",
    "bankAccountHolder": "FERA",
    "skills": "",
    "bankName": "BCA",
    "dailyRate": 200000,
    "email": "feramaulida34@gmail.com",
    "phone": "08993886831",
    "status": "Aktif",
    "specialization": "Multimedia",
    "createdAt": "2026-09-06",
    "bankAccountNumber": "",
    "rating": 5,
    "_syncMeta": {
      "updatedAt": "2026-09-08T23:18:37.535Z",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome"
    }
  },
  {
    "id": "fl-1788687392609",
    "dailyRate": 350000,
    "bankAccountHolder": "ADIN ANDRIANSYAH",
    "idCardNumber": "",
    "phone": "08561206888",
    "email": "adinandriyansyah@gmail.com",
    "address": "",
    "createdAt": "2026-09-06",
    "skills": "MIDAS HD-96, MIDAS M32,",
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-09-08T23:18:37.535Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "status": "Aktif",
    "bankAccountNumber": "",
    "notes": "",
    "name": "ADIN ANDRIANSYAH (ADIN)",
    "roleTitle": "OPERATOR",
    "rating": 5,
    "specialization": "Audio",
    "bankName": "BCA"
  },
  {
    "id": "fl-1788687512305",
    "notes": "",
    "name": "MOCHAMAD FIRMANSYAH (ACA)",
    "bankAccountHolder": "MOCHAMAD FIRMANSYAH (ACA)",
    "rating": 5,
    "bankName": "BCA",
    "status": "Aktif",
    "roleTitle": "STAGE-CREW",
    "idCardNumber": "",
    "address": "",
    "phone": "085867814398",
    "email": "acafirmansyah@gmail.com",
    "bankAccountNumber": "",
    "specialization": "Audio",
    "skills": "PATCHING, ROUTING",
    "dailyRate": 200000,
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-09-08T23:18:37.535Z"
    },
    "createdAt": "2026-09-06"
  },
  {
    "id": "fl-drv-1",
    "createdAt": "2026-09-01",
    "roleTitle": "FREELANCE",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T07:18:44.500Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "phone": "81291225933",
    "name": "YOSEP",
    "status": "Aktif",
    "dailyRate": 250000,
    "specialization": "Driver"
  },
  {
    "id": "fl-drv-2",
    "createdAt": "2026-09-01",
    "status": "Aktif",
    "roleTitle": "FREELANCE",
    "specialization": "Driver",
    "_syncMeta": {
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T07:18:44.500Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync"
    },
    "phone": "87726355305",
    "dailyRate": 250000,
    "name": "Andri Budiyanto (BUNONK)"
  },
  {
    "id": "fl-light-1",
    "specialization": "Lighting",
    "roleTitle": "OPERATOR",
    "createdAt": "2026-09-01",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "deviceType": "Desktop"
    },
    "name": "ENDANG (GHELE)",
    "dailyRate": 350000,
    "email": "Enda891@gmail.com",
    "phone": "081818653180",
    "status": "Aktif"
  },
  {
    "id": "fl-light-2",
    "roleTitle": "OPERATOR",
    "createdAt": "2026-09-01",
    "specialization": "Lighting",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "updatedBy": "BatchSync"
    },
    "dailyRate": 350000,
    "status": "Aktif",
    "phone": "085782255517",
    "email": "lightingendin@gmail.com",
    "name": "ENDIN"
  },
  {
    "id": "fl-light-3",
    "dailyRate": 200000,
    "status": "Aktif",
    "email": "faisalnugraha11455@gmail.com",
    "phone": "088210979655",
    "specialization": "Lighting",
    "name": "FAISAL NUGRAHA ISKANDAR (ISAL)",
    "roleTitle": "FREELANCE",
    "createdAt": "2026-09-01",
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "browser": "Chrome"
    }
  },
  {
    "id": "fl-light-4",
    "name": "IDRUS MAULANA",
    "phone": "083870557341",
    "email": "iddrusmaulana17@gmail.com",
    "specialization": "Lighting",
    "status": "Aktif",
    "dailyRate": 200000,
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T07:18:44.499Z",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "roleTitle": "FREELANCE",
    "createdAt": "2026-09-01"
  },
  {
    "id": "fl-light-5",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T07:18:44.499Z",
      "deviceType": "Desktop"
    },
    "phone": "088220972242",
    "roleTitle": "FREELANCE",
    "name": "MIING",
    "createdAt": "2026-09-01",
    "status": "Aktif",
    "specialization": "Lighting",
    "dailyRate": 200000
  },
  {
    "id": "fl-light-6",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T07:18:44.499Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop"
    },
    "createdAt": "2026-09-01",
    "roleTitle": "FREELANCE",
    "specialization": "Lighting",
    "name": "UGAN",
    "email": "gilanguganhaziq@gmail.com",
    "phone": "089612152799",
    "status": "Aktif",
    "dailyRate": 200000
  },
  {
    "id": "fl-light-7",
    "createdAt": "2026-09-01",
    "roleTitle": "FREELANCE",
    "name": "KEVIN",
    "_syncMeta": {
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T07:18:44.499Z",
      "updatedBy": "BatchSync"
    },
    "specialization": "Lighting",
    "phone": "083147165162",
    "dailyRate": 200000,
    "status": "Aktif"
  },
  {
    "id": "fl-light-8",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T07:18:44.499Z"
    },
    "createdAt": "2026-09-01",
    "rating": 5,
    "notes": "",
    "status": "Aktif",
    "address": "",
    "dailyRate": 200000,
    "bankAccountHolder": "BOANG",
    "bankName": "BCA",
    "specialization": "Lighting",
    "roleTitle": "FREELANCE",
    "skills": "",
    "email": "",
    "phone": "85695708082",
    "idCardNumber": "",
    "name": "BOANG",
    "bankAccountNumber": ""
  },
  {
    "id": "fl-light-9",
    "status": "Aktif",
    "_syncMeta": {
      "updatedAt": "2026-10-01T07:18:44.499Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "createdAt": "2026-09-01",
    "phone": "",
    "roleTitle": "FREELANCE",
    "dailyRate": 200000,
    "name": "OTANG",
    "specialization": "Lighting"
  },
  {
    "id": "fl-light-ceper",
    "createdAt": "2026-09-01",
    "status": "Aktif",
    "roleTitle": "FREELANCE",
    "phone": "",
    "_syncMeta": {
      "updatedAt": "2026-10-01T07:18:44.499Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "name": "CEPER",
    "dailyRate": 200000,
    "specialization": "Lighting"
  },
  {
    "id": "fl-multi-1",
    "roleTitle": "FREELANCE",
    "createdAt": "2026-09-01",
    "status": "Aktif",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T07:18:44.498Z"
    },
    "dailyRate": 200000,
    "phone": "085156892661",
    "email": "ariqarrobani2@gmail.com",
    "name": "ARIQ",
    "specialization": "Multimedia"
  },
  {
    "id": "fl-multi-10",
    "name": "ZIDAN",
    "specialization": "Multimedia",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T07:18:44.498Z"
    },
    "createdAt": "2026-09-01",
    "roleTitle": "FREELANCE",
    "phone": "",
    "status": "Aktif",
    "dailyRate": 200000
  },
  {
    "id": "fl-multi-11",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "deviceType": "Desktop"
    },
    "name": "RICHARD",
    "phone": "",
    "createdAt": "2026-09-01",
    "roleTitle": "FREELANCE",
    "specialization": "Multimedia",
    "status": "Aktif",
    "dailyRate": 200000
  },
  {
    "id": "fl-multi-12",
    "_syncMeta": {
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "name": "TOPAN",
    "createdAt": "2026-09-01",
    "specialization": "Multimedia",
    "roleTitle": "FREELANCE",
    "phone": "",
    "dailyRate": 200000,
    "status": "Aktif"
  },
  {
    "id": "fl-multi-13",
    "specialization": "Multimedia",
    "dailyRate": 200000,
    "_syncMeta": {
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "roleTitle": "FREELANCE",
    "status": "Aktif",
    "createdAt": "2026-09-01",
    "name": "INDRA",
    "phone": ""
  },
  {
    "id": "fl-multi-14",
    "specialization": "Multimedia",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "deviceType": "Desktop"
    },
    "roleTitle": "FREELANCE",
    "createdAt": "2026-09-01",
    "name": "INU",
    "phone": "",
    "status": "Aktif",
    "dailyRate": 200000
  },
  {
    "id": "fl-multi-2",
    "bankAccountNumber": "",
    "createdAt": "2026-09-01",
    "status": "Aktif",
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T07:18:44.498Z"
    },
    "address": "",
    "idCardNumber": "",
    "dailyRate": 350000,
    "rating": 5,
    "notes": "",
    "bankAccountHolder": "HERIANA",
    "roleTitle": "OPERATOR",
    "bankName": "BCA",
    "skills": "",
    "name": "HERIANA",
    "specialization": "Multimedia",
    "email": "Heriana1905@gmail.com",
    "phone": "085693948411"
  },
  {
    "id": "fl-multi-3",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T07:18:44.498Z"
    },
    "specialization": "Multimedia",
    "createdAt": "2026-09-01",
    "roleTitle": "FREELANCE",
    "name": "IMAN",
    "email": "mhanshungkul@gmail.com",
    "phone": "083896782116",
    "status": "Aktif",
    "dailyRate": 200000
  },
  {
    "id": "fl-multi-4",
    "bankAccountNumber": "",
    "notes": "",
    "address": "",
    "roleTitle": "FREELANCE",
    "idCardNumber": "",
    "skills": "",
    "specialization": "Multimedia",
    "bankAccountHolder": "KEMAL",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "browser": "Chrome"
    },
    "status": "Aktif",
    "phone": "08561130189",
    "email": "",
    "createdAt": "2026-09-01",
    "name": "KEMAL",
    "rating": 5,
    "dailyRate": 200000,
    "bankName": "BCA"
  },
  {
    "id": "fl-multi-5",
    "notes": "",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome"
    },
    "rating": 5,
    "createdAt": "2026-09-01",
    "status": "Aktif",
    "dailyRate": 200000,
    "bankAccountNumber": "",
    "name": "KEVIN AXL YOHANES WAGEY",
    "address": "",
    "email": "hitmeup.kevinaxl@gmail.com",
    "phone": "081806484747",
    "roleTitle": "FREELANCE",
    "skills": "",
    "bankName": "BCA",
    "specialization": "Multimedia",
    "bankAccountHolder": "KEVIN AXL YOHANES WAGEY",
    "idCardNumber": ""
  },
  {
    "id": "fl-multi-6",
    "createdAt": "2026-09-01",
    "specialization": "Multimedia",
    "bankAccountNumber": "",
    "_syncMeta": {
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop"
    },
    "email": "feramaulida34@gmail.com",
    "phone": "8993886831",
    "rating": 5,
    "idCardNumber": "",
    "status": "Aktif",
    "dailyRate": 200000,
    "name": "FERA",
    "roleTitle": "FREELANCE",
    "bankAccountHolder": "FERA",
    "notes": "",
    "skills": "",
    "bankName": "BCA",
    "address": ""
  },
  {
    "id": "fl-multi-7",
    "status": "Aktif",
    "specialization": "Multimedia",
    "dailyRate": 200000,
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    },
    "name": "ANDI",
    "phone": "",
    "createdAt": "2026-09-01",
    "roleTitle": "FREELANCE"
  },
  {
    "id": "fl-multi-8",
    "name": "ALI",
    "createdAt": "2026-09-01",
    "roleTitle": "FREELANCE",
    "specialization": "Multimedia",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "status": "Aktif",
    "phone": "",
    "dailyRate": 200000
  },
  {
    "id": "fl-multi-9",
    "specialization": "Multimedia",
    "dailyRate": 200000,
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "deviceType": "Desktop",
      "browser": "Chrome"
    },
    "name": "ROFIQ",
    "phone": "",
    "createdAt": "2026-09-01",
    "status": "Aktif",
    "roleTitle": "FREELANCE"
  },
  {
    "id": "fl-multi-chandra",
    "roleTitle": "FREELANCE",
    "bankName": "BCA",
    "address": "",
    "skills": "",
    "name": "CHANDRA",
    "bankAccountNumber": "",
    "specialization": "Multimedia",
    "email": "Chandrakakaaja@gmail.com",
    "phone": "088225873364",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop"
    },
    "status": "Aktif",
    "createdAt": "2026-09-01",
    "rating": 5,
    "dailyRate": 200000,
    "bankAccountHolder": "CHANDRA",
    "notes": "",
    "idCardNumber": ""
  },
  {
    "id": "fl-multi-rizky",
    "status": "Aktif",
    "dailyRate": 350000,
    "phone": "085155188909",
    "email": "rizkiuloh@gmail.com",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "browser": "Chrome"
    },
    "specialization": "Multimedia",
    "roleTitle": "FREELANCE",
    "name": "RIZKY NASRULLAH (ULLOH)",
    "createdAt": "2026-09-01"
  },
  {
    "id": "fl-semua-divisi",
    "name": "FREE-LANCE SEMUA DIVISI",
    "specialization": "Umum",
    "dailyRate": 200000,
    "_syncMeta": {
      "updatedAt": "2026-10-01T07:18:44.496Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop"
    },
    "email": "",
    "phone": "",
    "createdAt": "2026-09-01",
    "status": "Aktif",
    "roleTitle": "FREELANCE"
  },
  {
    "id": "fl-sound-1",
    "dailyRate": 350000,
    "notes": "",
    "bankAccountHolder": "ADIN ANDRIANSYAH",
    "bankName": "BCA",
    "name": "ADIN ANDRIANSYAH (ADIN)",
    "createdAt": "2026-09-01",
    "skills": "MIDAS HD-96, MIDAS M32,",
    "specialization": "Audio",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T07:18:44.496Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop"
    },
    "email": "adinandriyansyah@gmail.com",
    "phone": "08561206888",
    "bankAccountNumber": "",
    "status": "Aktif",
    "idCardNumber": "",
    "address": "",
    "roleTitle": "OPERATOR",
    "rating": 4
  },
  {
    "id": "fl-sound-10",
    "skills": "",
    "dailyRate": 200000,
    "createdAt": "2026-09-01",
    "notes": "",
    "bankAccountHolder": "KIKI",
    "_syncMeta": {
      "updatedAt": "2026-10-01T07:18:44.497Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "rating": 5,
    "idCardNumber": "",
    "bankName": "BCA",
    "name": "KIKI",
    "phone": "0895385263310",
    "email": "",
    "roleTitle": "FREELANCE",
    "address": "",
    "bankAccountNumber": "",
    "specialization": "Audio",
    "status": "Aktif"
  },
  {
    "id": "fl-sound-11",
    "createdAt": "2026-09-01",
    "phone": "",
    "roleTitle": "FREELANCE",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T07:18:44.497Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "name": "NANA (KADOT)",
    "specialization": "Audio",
    "status": "Aktif",
    "dailyRate": 200000
  },
  {
    "id": "fl-sound-12",
    "name": "RAMDAN",
    "specialization": "Audio",
    "dailyRate": 200000,
    "status": "Aktif",
    "phone": "",
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T07:18:44.498Z"
    },
    "roleTitle": "FREELANCE",
    "createdAt": "2026-09-01"
  },
  {
    "id": "fl-sound-13",
    "specialization": "Audio",
    "dailyRate": 200000,
    "phone": "",
    "status": "Aktif",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "name": "BOI",
    "createdAt": "2026-09-01",
    "roleTitle": "FREELANCE"
  },
  {
    "id": "fl-sound-14",
    "dailyRate": 200000,
    "status": "Aktif",
    "name": "APLES",
    "createdAt": "2026-09-01",
    "phone": "",
    "roleTitle": "FREELANCE",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "deviceType": "Desktop",
      "browser": "Chrome"
    },
    "specialization": "Audio"
  },
  {
    "id": "fl-sound-16",
    "roleTitle": "OPERATOR",
    "specialization": "Audio",
    "createdAt": "2026-09-01",
    "status": "Aktif",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T07:18:44.498Z",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync"
    },
    "name": "Djunaedi Sugianto (REBINK)",
    "dailyRate": 350000,
    "phone": "0856-1304-448"
  },
  {
    "id": "fl-sound-2",
    "skills": "",
    "address": "",
    "bankName": "BCA",
    "bankAccountHolder": "ARDI",
    "dailyRate": 200000,
    "_syncMeta": {
      "updatedAt": "2026-10-01T07:18:44.496Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop"
    },
    "name": "ARDI",
    "createdAt": "2026-09-01",
    "specialization": "Audio",
    "notes": "",
    "rating": 3,
    "bankAccountNumber": "",
    "status": "Aktif",
    "idCardNumber": "",
    "roleTitle": "FREELANCE",
    "email": "",
    "phone": "085717518337"
  },
  {
    "id": "fl-sound-3",
    "notes": "",
    "skills": "",
    "roleTitle": "OPERATOR",
    "address": "",
    "idCardNumber": "",
    "bankAccountHolder": "ASEP",
    "name": "ASEP",
    "phone": "081294015587",
    "email": "agungprihadie@gmail.com",
    "dailyRate": 350000,
    "rating": 5,
    "bankAccountNumber": "",
    "bankName": "BCA",
    "specialization": "Audio",
    "createdAt": "2026-09-01",
    "status": "Aktif",
    "_syncMeta": {
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T07:18:44.496Z"
    }
  },
  {
    "id": "fl-sound-4",
    "roleTitle": "FREELANCE",
    "createdAt": "2026-09-01",
    "email": "supardihendar320@gmail.com",
    "phone": "085157226126",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T07:18:44.496Z",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "browser": "Chrome"
    },
    "name": "HENDAR SUPARDI (N'DAY)",
    "dailyRate": 200000,
    "status": "Aktif",
    "specialization": "Audio"
  },
  {
    "id": "fl-sound-5",
    "notes": "",
    "roleTitle": "FREELANCE",
    "name": "MOCHAMAD FIRMANSYAH (ACA)",
    "bankAccountHolder": "MOCHAMAD FIRMANSYAH (ACA)",
    "skills": "PATCHING, ROUTING",
    "specialization": "Audio",
    "phone": "085867814398",
    "email": "acafirmansyah@gmail.com",
    "status": "Aktif",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T07:18:44.496Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "address": "",
    "bankName": "BCA",
    "createdAt": "2026-09-01",
    "idCardNumber": "",
    "dailyRate": 200000,
    "bankAccountNumber": "",
    "rating": 5
  },
  {
    "id": "fl-sound-6",
    "phone": "085891456730",
    "email": "onks.rieut@gmail.com",
    "dailyRate": 200000,
    "specialization": "Audio",
    "status": "Aktif",
    "name": "NURDIANSYAH (CI'ONG)",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T07:18:44.497Z",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "roleTitle": "FREELANCE",
    "createdAt": "2026-09-01"
  },
  {
    "id": "fl-sound-7",
    "email": "rchmulyana21@gmail.com",
    "phone": "087770123122",
    "name": "RACHMAT MULYANA (JORDY)",
    "status": "Aktif",
    "dailyRate": 350000,
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-01T07:18:44.497Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "createdAt": "2026-09-01",
    "specialization": "Audio",
    "roleTitle": "OPERATOR"
  },
  {
    "id": "fl-sound-8",
    "roleTitle": "FREELANCE",
    "createdAt": "2026-09-01",
    "_syncMeta": {
      "updatedAt": "2026-10-01T07:18:44.497Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop"
    },
    "dailyRate": 200000,
    "specialization": "Audio",
    "name": "RINALDI KURNIAWAN (INAL)",
    "email": "ak5905856@gmail.com",
    "phone": "085939712262",
    "status": "Aktif"
  },
  {
    "id": "fl-sound-9",
    "specialization": "Audio",
    "dailyRate": 200000,
    "name": "SYARIF HIDAYATULLAH (TIMBUL)",
    "phone": "089670427430",
    "email": "syariftimbul06@gmail.com",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T07:18:44.497Z",
      "browser": "Chrome",
      "deviceType": "Desktop"
    },
    "roleTitle": "FREELANCE",
    "status": "Aktif",
    "createdAt": "2026-09-01"
  },
  {
    "id": "fl-umum-2",
    "name": "RIO",
    "status": "Aktif",
    "dailyRate": 200000,
    "_syncMeta": {
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T07:18:44.500Z",
      "updatedBy": "BatchSync"
    },
    "phone": "",
    "createdAt": "2026-09-01",
    "specialization": "Umum",
    "roleTitle": "FREELANCE"
  },
  {
    "id": "fl-umum-3",
    "phone": "",
    "status": "Aktif",
    "dailyRate": 200000,
    "specialization": "Umum",
    "name": "JAE",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T07:18:44.500Z",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "roleTitle": "FREELANCE",
    "createdAt": "2026-09-01"
  },
  {
    "id": "fl-video-1",
    "name": "ADI",
    "phone": "082210333041",
    "specialization": "Videotron",
    "_syncMeta": {
      "updatedAt": "2026-10-01T07:18:44.499Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "status": "Aktif",
    "roleTitle": "FREELANCE",
    "createdAt": "2026-09-01",
    "dailyRate": 200000
  },
  {
    "id": "fl-video-2",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T07:18:44.499Z",
      "deviceType": "Desktop"
    },
    "roleTitle": "FREELANCE",
    "email": "Vickysatrya1414@gmail.com",
    "phone": "082299245583",
    "specialization": "Videotron",
    "createdAt": "2026-09-01",
    "status": "Aktif",
    "name": "FIKI FAUJI",
    "dailyRate": 200000
  },
  {
    "id": "fl-video-3",
    "_syncMeta": {
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T07:18:44.500Z"
    },
    "specialization": "Videotron",
    "roleTitle": "FREELANCE",
    "createdAt": "2026-09-01",
    "status": "Aktif",
    "dailyRate": 200000,
    "email": "ifpalpadilah170104@gmail.com",
    "phone": "085889915925",
    "name": "IPAL"
  },
  {
    "id": "fl-video-4",
    "phone": "082325343690",
    "email": "Sanambonambon@gmail.com",
    "_syncMeta": {
      "updatedAt": "2026-10-01T07:18:44.500Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "status": "Aktif",
    "name": "SANTOSO (AMBON)",
    "createdAt": "2026-09-01",
    "roleTitle": "FREELANCE",
    "specialization": "Videotron",
    "dailyRate": 200000
  },
  {
    "id": "fl-video-5",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-01T07:18:44.500Z",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop"
    },
    "specialization": "Videotron",
    "createdAt": "2026-09-01",
    "roleTitle": "FREELANCE",
    "status": "Aktif",
    "phone": "082125242340",
    "email": "siswoyo9995@gmail.com",
    "name": "SISWOYO (WOYO)",
    "dailyRate": 200000
  },
  {
    "id": "fl-video-6",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T07:18:44.500Z",
      "deviceType": "Desktop"
    },
    "roleTitle": "FREELANCE",
    "phone": "081288489465",
    "email": "yopiy712@gmail.com",
    "createdAt": "2026-09-01",
    "name": "YOPI SURAHMAN",
    "status": "Aktif",
    "specialization": "Videotron",
    "dailyRate": 200000
  }
];

// Master Driver Armada Resmi
export const INITIAL_FLEET_DRIVERS: FleetDriver[] = [
  {
    "id": "drv-1788687817794",
    "assignedVehicle": "Truk CANTER PS 110",
    "notes": "",
    "createdAt": "2026-09-06",
    "driverType": "Freelance Driver",
    "simExpiry": "2027-09-06",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T08:18:54.425Z",
      "deviceType": "Desktop",
      "deviceOS": "macOS"
    },
    "emergencyContact": "",
    "name": "SISWOYO (WOYO)",
    "phone": "082125242340",
    "idCardNumber": "",
    "address": "",
    "status": "Siap Jalan",
    "simType": "SIM B1"
  },
  {
    "id": "drv-1788687983277",
    "idCardNumber": "",
    "address": "",
    "phone": "081291225933",
    "simType": "SIM A",
    "driverType": "Freelance Driver",
    "simExpiry": "2027-09-06",
    "_syncMeta": {
      "updatedAt": "2026-10-01T08:18:54.425Z",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceOS": "macOS"
    },
    "createdAt": "2026-09-06",
    "notes": "",
    "name": "YOSEP",
    "emergencyContact": "",
    "status": "Siap Jalan",
    "assignedVehicle": "SUZUKI CARRY "
  },
  {
    "id": "drv-1788688088975",
    "idCardNumber": "",
    "driverType": "Freelance Driver",
    "notes": "",
    "emergencyContact": "",
    "createdAt": "2026-09-06",
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T08:18:54.425Z",
      "browser": "Chrome"
    },
    "simExpiry": "2027-09-06",
    "assignedVehicle": "SUZUKI CARRY",
    "status": "Siap Jalan",
    "phone": "087726355305",
    "name": "ANDRI BUDIYANTO (BUNONK)",
    "simType": "SIM A",
    "address": ""
  },
  {
    "id": "drv-1788688161816",
    "idCardNumber": "",
    "assignedVehicle": "SUZUKI CARRY",
    "simExpiry": "2027-09-06",
    "_syncMeta": {
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T08:18:54.425Z"
    },
    "address": "",
    "phone": "089670427430",
    "simType": "SIM A",
    "createdAt": "2026-09-06",
    "status": "Siap Jalan",
    "name": "SYARIF HIDAYATULLAH ( TIMBUL)",
    "notes": "",
    "driverType": "Freelance Driver",
    "emergencyContact": ""
  },
  {
    "id": "drv-1788688270855",
    "address": "",
    "simType": "SIM A",
    "name": "FIKI FAUJI",
    "notes": "",
    "createdAt": "2026-09-06",
    "emergencyContact": "",
    "driverType": "Freelance Driver",
    "simExpiry": "2027-03-16",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T08:18:54.425Z"
    },
    "idCardNumber": "",
    "assignedVehicle": "SUZUKI CARRY",
    "status": "Siap Jalan",
    "phone": "082299245583"
  },
  {
    "id": "drv-1788957001183",
    "simType": "SIM A",
    "driverType": "Freelance Driver",
    "address": "",
    "name": "YOPI SURAHMAN",
    "idCardNumber": "",
    "phone": "081288489465",
    "assignedVehicle": "SUZUKI CARRY",
    "_syncMeta": {
      "browser": "Chrome",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T08:18:54.425Z"
    },
    "simExpiry": "2027-07-28",
    "status": "Siap Jalan",
    "createdAt": "2026-09-09",
    "emergencyContact": "",
    "notes": ""
  },
  {
    "id": "drv-1788959273980",
    "phone": "0895-2695-9199",
    "name": "ANDYAR RAZZAQ ILHAMSYAH (DYAR)",
    "driverType": "Freelance Driver",
    "address": "",
    "status": "Siap Jalan",
    "simType": "SIM A",
    "idCardNumber": "",
    "simExpiry": "2027-09-09",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T08:18:54.426Z",
      "browser": "Chrome"
    },
    "assignedVehicle": "SUZUKI CARRY",
    "notes": "",
    "createdAt": "2026-09-09",
    "emergencyContact": ""
  },
  {
    "id": "drv-2",
    "name": "BUNONK",
    "phone": "087726355305",
    "simExpiry": "2027-10-20",
    "_syncMeta": {
      "browser": "Chrome",
      "updatedAt": "2026-10-01T08:18:54.425Z",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop"
    },
    "simType": "SIM B1",
    "createdAt": "2026-09-01",
    "driverType": "Freelance Driver",
    "assignedVehicle": "Truk Box Hino Dutro CDE Engkel (4 Roda)",
    "status": "Siap Jalan"
  },
  {
    "id": "drv-3",
    "status": "Siap Jalan",
    "notes": "",
    "simExpiry": "2028-03-10",
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T08:18:54.425Z",
      "deviceType": "Desktop",
      "browser": "Chrome"
    },
    "createdAt": "2026-09-01",
    "driverType": "Internal",
    "emergencyContact": "",
    "phone": "083819622172",
    "idCardNumber": "",
    "simType": "SIM B1",
    "assignedVehicle": "Truk Box Mitsubishi Canter CDD (6 Roda)",
    "address": "",
    "name": "Gatot Wiliyanto"
  },
  {
    "id": "drv-4",
    "_syncMeta": {
      "deviceType": "Desktop",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T08:18:54.425Z",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS"
    },
    "simExpiry": "2028-05-12",
    "assignedVehicle": "Blind Van Gran Max Operasional",
    "name": "Udin Saepudin",
    "createdAt": "2026-09-01",
    "status": "Siap Jalan",
    "simType": "SIM A",
    "phone": "082221948861",
    "driverType": "Internal"
  }
];

// Master Inventaris Armada Kendaraan Resmi PT RIZ-PRODUCTION
export const INITIAL_VEHICLES: VehicleMaster[] = [
  {
    "id": "veh-1",
    "name": "SUZUKI CARRY",
    "tonnageCapacity": 1,
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "updatedAt": "2026-10-01T08:18:54.508Z",
      "browser": "Chrome"
    },
    "cbmCapacity": 1.5,
    "stnkTaxExpiry": "2027-09-01",
    "status": "Siap Operasi",
    "odometerKM": 5000,
    "kirExpiry": "2026-09-30",
    "vehicleType": "Truk Box CDD (6 Roda)",
    "policeNumber": "F 8446 BF",
    "ownership": "Internal"
  },
  {
    "id": "veh-2",
    "kirExpiry": "2026-10-12",
    "policeNumber": "F 8433 BF",
    "status": "Siap Operasi",
    "tonnageCapacity": 1,
    "vehicleType": "Truk Box CDE Engkel (4 Roda)",
    "ownership": "Internal",
    "cbmCapacity": 1.5,
    "name": "SUZUKI CARRY",
    "stnkTaxExpiry": "2027-09-01",
    "_syncMeta": {
      "updatedAt": "2026-10-01T08:18:54.511Z",
      "browser": "Chrome",
      "updatedBy": "BatchSync",
      "deviceOS": "macOS",
      "deviceType": "Desktop"
    },
    "odometerKM": 10000
  },
  {
    "id": "veh-3",
    "ownership": "Internal",
    "kirExpiry": "2027-01-20",
    "status": "Siap Operasi",
    "cbmCapacity": 1.5,
    "name": "SUZUKI CARRY",
    "stnkTaxExpiry": "2027-06-01",
    "tonnageCapacity": 1,
    "_syncMeta": {
      "deviceOS": "macOS",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "deviceType": "Desktop",
      "updatedAt": "2026-10-01T08:18:54.511Z"
    },
    "odometerKM": 10000,
    "vehicleType": "Blindvan Logistik",
    "policeNumber": "F 8569 BH"
  },
  {
    "id": "veh-4",
    "odometerKM": 12000,
    "stnkTaxExpiry": "2027-06-01",
    "kirExpiry": "2026-10-28",
    "ownership": "Internal",
    "status": "Siap Operasi",
    "vehicleType": "Pick-Up Box",
    "name": "SUZUKI CARRY ",
    "policeNumber": "F 8594 BH",
    "tonnageCapacity": 1,
    "cbmCapacity": 1.5,
    "_syncMeta": {
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "updatedAt": "2026-10-01T08:18:54.512Z",
      "browser": "Chrome"
    }
  },
  {
    "id": "veh-5",
    "tonnageCapacity": 0.6,
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "BatchSync",
      "browser": "Chrome",
      "updatedAt": "2026-10-01T08:18:54.512Z"
    },
    "name": "DAIHATSU LUXIO  Operasional",
    "cbmCapacity": 2.8,
    "odometerKM": 52100,
    "ownership": "Internal",
    "vehicleType": "Mobil Kru / Operasional",
    "status": "Siap Operasi",
    "policeNumber": "B 2673 TVI",
    "stnkTaxExpiry": "2026-12-01",
    "kirExpiry": "2027-04-14"
  },
  {
    "id": "veh-6",
    "vehicleType": "Truk Wingbox Tronton",
    "stnkTaxExpiry": "2027-01-01",
    "_syncMeta": {
      "updatedAt": "2026-10-01T08:18:54.512Z",
      "updatedBy": "BatchSync",
      "deviceType": "Desktop",
      "deviceOS": "macOS",
      "browser": "Chrome"
    },
    "tonnageCapacity": 3,
    "name": "Truk CANTER PS 110",
    "status": "Siap Operasi",
    "ownership": "Internal",
    "cbmCapacity": 7,
    "kirExpiry": "2027-01-15",
    "policeNumber": "F 8942 BG",
    "odometerKM": 145000
  },
  {
    "id": "veh-7",
    "stnkTaxExpiry": "2026-11-30",
    "kirExpiry": "2026-11-15",
    "name": "Truk CDD Long Mitra Logistik",
    "vehicleType": "Truk CDD Long Box",
    "ownership": "Sewa Mitra",
    "status": "Siap Operasi",
    "policeNumber": "B 9331 JXQ",
    "odometerKM": 98000,
    "tonnageCapacity": 6,
    "_syncMeta": {
      "deviceType": "Desktop",
      "browser": "Chrome",
      "deviceOS": "macOS",
      "updatedBy": "Seno Subroto",
      "updatedAt": "2026-09-13T16:05:47.685Z"
    },
    "cbmCapacity": 28
  }
];
