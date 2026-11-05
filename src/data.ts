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
import {
  INITIAL_INVENTORY_ASSETS,
  getInventoryAssetTypeInfo,
  groupInventoryAssetsByType,
  stripInventoryNominalText,
  calculateInventoryAssetAvailability,
  calculateInventorySummaryMetrics
} from './data/inventoryAssetsData';
export type {
  InventoryAssetTypeInfo,
  InventoryTypeGroupBucket,
  InventoryTypeIconKey,
  InventoryAssetAvailability,
  InventorySummaryMetrics,
  InventoryCalculationContext
} from './data/inventoryAssetsData';
export {
  getInventoryAssetTypeInfo,
  groupInventoryAssetsByType,
  stripInventoryNominalText,
  calculateInventoryAssetAvailability,
  calculateInventorySummaryMetrics
};

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

    // Ensure baseStaff canonical properties are preserved if blanked or corrupted
    const baseStaff = STAFF_LIST.find(def => def.id === canonicalId);
    if (baseStaff) {
      const rawMeta = (canonicalStaff as any)._syncMeta;
      const isUserEdited = Boolean((canonicalStaff as any)._userEdited || rawMeta?._userEdited) || (
        rawMeta?.updatedBy &&
        !['System', 'System Auto-Sync', 'System Canonical Sync', 'BatchSync', 'Supabase Cloud Sync'].includes(rawMeta.updatedBy)
      );
      canonicalStaff = {
        ...baseStaff,
        ...canonicalStaff,
        id: canonicalId,
        name: (canonicalStaff.name && canonicalStaff.name.trim().length > 0) ? canonicalStaff.name : baseStaff.name,
        fullName: (canonicalStaff.fullName && canonicalStaff.fullName.trim().length > 0) ? canonicalStaff.fullName : baseStaff.fullName,
        nickname: canonicalStaff.nickname || baseStaff.nickname,
        division: (canonicalStaff.division && canonicalStaff.division !== 'Umum') ? canonicalStaff.division : baseStaff.division,
        role: isUserEdited && canonicalStaff.role ? canonicalStaff.role : ((canonicalStaff.role && canonicalStaff.role !== 'Staff') ? canonicalStaff.role : baseStaff.role),
        level: canonicalStaff.level || baseStaff.level,
        email: canonicalStaff.email !== undefined ? canonicalStaff.email : baseStaff.email,
        phone: canonicalStaff.phone !== undefined ? canonicalStaff.phone : baseStaff.phone,
      };
    }

    if (staffMap.has(canonicalId)) {
      const existing = staffMap.get(canonicalId)!;
      const effectivePassword = (canonicalStaff.password && canonicalStaff.password !== 'riz123')
        ? canonicalStaff.password
        : (existing.password || canonicalStaff.password || 'riz123');
      const effectivePasswordRequest = (canonicalStaff.passwordRequest !== undefined && canonicalStaff.passwordRequest !== null)
        ? canonicalStaff.passwordRequest
        : (existing.passwordRequest || '');

      canonicalStaff = {
        ...existing,
        ...canonicalStaff,
        password: effectivePassword,
        passwordRequest: effectivePasswordRequest,
      };
    }

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
export const INITIAL_ASSETS: Asset[] = INITIAL_INVENTORY_ASSETS;
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
  },
  // Official Oktober 2026 Tasks (GID: 1340328886)
  {
    id: 'dt-20261002-01',
    title: 'Repair 3 Kabinet IC Warna + Ganti Dead Pixel & Cek 11 Modul Kabinet',
    description: '1. repair 3 kabinet ic warna + ganti dead pixel 2 kabinet clear (Aman)\n2. cek 11 modul kabinet (2 modul ilang jalur ic, 3 modul ilang jalur pixel, 3 modul kena ic warna, 1 modul arus konslet)\n3. copot ic buat kanibal\n4. sortir masking',
    division: 'Videotron',
    priority: 'Tinggi',
    status: 'Done',
    assignedTo: 'staff-mulyana',
    assignedName: 'Mulyana',
    dueDate: '2026-10-02',
    createdAt: '2026-10-02',
    createdBy: 'Mulyana'
  },
  {
    id: 'dt-20261019-01',
    title: 'Maintenance & Pengecekan Unit Sub / Avanda 210',
    description: 'Membersihkan / pengecekan unit sub dan avanda210 yg disewa kondisi bersih dan aman.',
    division: 'Audio',
    priority: 'Sedang',
    status: 'Done',
    assignedTo: 'staff-rahmat',
    assignedName: 'Muhamad Rahmat, Taufik Diana, Iwan Kurniawan, Ramdani, Wahyudin',
    dueDate: '2026-10-19',
    createdAt: '2026-10-19',
    createdBy: 'Muhamad Rahmat'
  },
  {
    id: 'dt-20261026-01',
    title: 'Cek Unit Monitor DB18, DB15, LVX15 & Cleaning All Hazer',
    description: '- Unyim: cek unit monitor DB18 (-DB NO18 twiter mati)\n- Butonk: cek unit monitor DB15 (-DB NO15 twitwe kecil/lemah)\n- Mboh: cek unit monitor LVX15 (-mesin mati /dalam penegecekan mang damri)\n- Heri: Cek unit & Cleaning All Hazer (Kondisi Oke Semua)',
    division: 'Audio',
    priority: 'Tinggi',
    status: 'Done',
    assignedTo: 'staff-rahmat',
    assignedName: 'Wahyudin, Iwan Kurniawan, Muhamad Rahmat, Heri',
    dueDate: '2026-10-26',
    createdAt: '2026-10-26',
    createdBy: 'Muhamad Rahmat'
  },
  // Official November 2026 Tasks (GID: 7916507)
  {
    id: 'dt-20261101-01',
    title: 'Cek & Service 12 Roll LED Strip + Buat Dudukan Power Supply LED Strip',
    description: '- cek & servise 12 roll led strip\n- buat dudukan power suplly led strip\nREMARK:\n- Bagus\n- Done',
    division: 'Videotron',
    priority: 'Sedang',
    status: 'Done',
    assignedTo: 'staff-mulyana',
    assignedName: 'Mulyana',
    dueDate: '2026-11-01',
    createdAt: '2026-11-01',
    createdBy: 'Mulyana'
  },
  {
    id: 'dt-20261102-01',
    title: 'Bersih-Bersih & Cek Nyala Stagebox DL32 (No. 1-4) & Mixer Midas HD No. 1',
    description: 'bersih" dl 32\nDL 32 no 1\nDL 32 no 2\nDL 32 no 3\nDL 32 no 4\nmixer HD no 1\nREMARK:\nCEK NYALA AMAN — OK semua',
    division: 'Audio',
    priority: 'Sedang',
    status: 'Done',
    assignedTo: 'staff-unyin',
    assignedName: 'Wahyudin',
    dueDate: '2026-11-02',
    createdAt: '2026-11-02',
    createdBy: 'Wahyudin'
  },
  {
    id: 'dt-20261102-02',
    title: 'Cleaning DL251, Marani MIR480I, Mixer HD967 & Cek All Kabel LAN',
    description: '-cleaning dl251 (-BERSIH)\n-cleaning marani mir4801 (-BERSIH)\n-cek all kabel LAN (-ALL terkoneksi dgn baik)\n-cleaning mixer HD967',
    division: 'Audio',
    priority: 'Sedang',
    status: 'Done',
    assignedTo: 'staff-rahmat',
    assignedName: 'Muhamad Rahmat',
    dueDate: '2026-11-02',
    createdAt: '2026-11-02',
    createdBy: 'Muhamad Rahmat'
  },
  {
    id: 'dt-20261102-03',
    title: 'Cek UPS, Cleaning Rak Kantor, Tas Kamera & Cek Box 1 Perlenk, SDI, HDMI',
    description: 'Cek UPS\nCleaning Rak Kantor\nCleaning Tas Kamera\nCek Box 1 Perlenk, SDI, HDMI\nREMARK:\nUdah Ga bisa ngisi (UPS)',
    division: 'Multimedia',
    priority: 'Tinggi',
    status: 'In Progress',
    assignedTo: 'staff-mulyadi',
    assignedName: 'Mulyadi',
    dueDate: '2026-11-02',
    createdAt: '2026-11-02',
    createdBy: 'Mulyadi'
  },
  {
    id: 'dt-20261103-01',
    title: 'Cleaning & Check Kelengkapan WHM EWD, Shure SLXD-QLXD, IEM G4 & Repack Box 2U',
    description: 'cleaning and check kelengkapan WHM EWD (no. 5-8, 9-12, 15-16, 17-18) dan Shure SLXD (no. 1-4, 5-8) - QLXD (no. 9-12)\ncleaning and check kelengkapan IEM Sennheisser G4 no. 1 - 8\nrepack WHM QLXD menjadi 2 box ukuran 2U (baru) masing2 menjadi 2 WHM dalam 1 box\nREMARK:\nWHM & IEM semua dalam kondisi normal, lengkap dan siap dipakai untuk event.',
    division: 'Audio',
    priority: 'Sedang',
    status: 'Done',
    assignedTo: 'staff-yudish',
    assignedName: 'Yudishtira Purnama A',
    dueDate: '2026-11-03',
    createdAt: '2026-11-03',
    createdBy: 'Yudishtira Purnama A'
  },
  {
    id: 'dt-20261103-02',
    title: 'Rapih Kabel Perbok, Benerin Kabel Power 4x2.5 (25M), Cleaning All Beam 450 (1-24) & Parled Trf A64 (1-48)',
    description: '-Rapih2 Kabel Bekas Pakai Perbok (- Rapih Sesuai Tulisan Dibok)\n-Benerin Kabel Power 4x2.5 (25M) (- Sudah Kepasang Kembali Steker Nya)\n-Cleaning All Beam 450 No. 1-24 (-Bersih & Normal)\n-Cleaning All Parled Trf A64 No. 1-48 (- Bersih & Normal KECUALI NO. 5-12-19-33 Eror: No. 5 Warm Separo, No. 12 Red Mati 1 Mata, No. 19 Warm Separo, No. 33 Red Separo)',
    division: 'Lighting',
    priority: 'Sedang',
    status: 'In Progress',
    assignedTo: 'staff-heri',
    assignedName: 'Heri',
    dueDate: '2026-11-03',
    createdAt: '2026-11-03',
    createdBy: 'Heri'
  },
  {
    id: 'dt-20261103-03',
    title: 'Service 8 Kabinet LED (6 Dead Pixel, 1 IC Warna, 1 Jalur)',
    description: 'servise 8 kabinet led\n- 6 kabinet ganti dead pixel\n-1 kabinet ganti ic warna\n- 1 kabinet ganti jalur\nREMARK:\n2 unit minta ganti recieving card',
    division: 'Videotron',
    priority: 'Tinggi',
    status: 'In Progress',
    assignedTo: 'staff-mulyana',
    assignedName: 'Mulyana',
    dueDate: '2026-11-03',
    createdAt: '2026-11-03',
    createdBy: 'Mulyana'
  },
  {
    id: 'dt-20261104-01',
    title: 'Ganti Tweeter & Speaker DB Tech (No. 5, 15, 18), Test Unit DB Tech & Service Bracket Drum TAMA',
    description: 'Ganti twitter DB No 15\nGanti twitter DB No 18\nGanti twitter DB No 5\nGanti Speaker DB no 5\nProses  Test Unit DB tech maintenance\nService Bracket Drum TAMA\nREMARK:\nRekon-Kit Twitter masih bermasalah, suara kecil\nKondisi unit sudah OK\nKondisi unit sudah OK\nKondisi unit sudah OK\nService ulang, DB no 15 belum normal\nKondisi unit sudah OK',
    division: 'Audio',
    priority: 'Tinggi',
    status: 'In Progress',
    assignedTo: 'staff-iwan',
    assignedName: 'Iwan Kurniawan',
    dueDate: '2026-11-04',
    createdAt: '2026-11-04',
    createdBy: 'Iwan Kurniawan'
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

// Master Inventaris Armada Kendaraan Resmi PT RIZ-PRODUCTION (Sumber: Google Sheet 1YuJ_rVhvYUTKKujiHNFOydVWAeCDz5H4ui7pDLvXxUs)
// Riwayat servis disusun berurutan dari tanggal, bulan, tahun aktual terkini (paling atas) ke terlama
export const INITIAL_VEHICLES: VehicleMaster[] = [
  {
    "id": "veh-1",
    "name": "Pick Up Suzuki Carry / 011",
    "unitCode": "011",
    "ownership": "Internal",
    "policeNumber": "F 8433 BF",
    "vehicleType": "Pick Up Operasional (011)",
    "tonnageCapacity": 1,
    "cbmCapacity": 1.5,
    "odometerKM": 10000,
    "stnkTaxExpiry": "2027-09-01",
    "kirExpiry": "2027-02-26",
    "status": "Siap Operasi",
    "sheetGid": "1966942424",
    "totalMaintenanceCost": 6445565,
    "maintenanceHistory": [
      {
        "id": "vm-8433-8",
        "vehicleId": "veh-1",
        "date": "2026-08-20",
        "type": "Ganti Oli",
        "description": "Filter Oli (Rp 43.694), Ecstar 10W-40 (Rp 307.433 + Jasa Rp 162.000), Xlerator Engine Flush (Rp 106.000), Belt Water Pump (Rp 59.009 + Jasa Rp 74.595)",
        "cost": 752731,
        "technician": "Bengkel Resmi Suzuki"
      },
      {
        "id": "vm-8433-7",
        "vehicleId": "veh-1",
        "date": "2026-05-26",
        "type": "Perbaikan",
        "description": "Ganti AKI GS (Tukar Aki Lama Shop&Drive)",
        "cost": 680010,
        "technician": "Shop&Drive"
      },
      {
        "id": "vm-8433-6",
        "vehicleId": "veh-1",
        "date": "2026-03-10",
        "type": "Ganti Ban",
        "description": "Ganti Ban 2 Pcs (Dunlop)",
        "cost": 1320000,
        "technician": "Vendor Ban"
      },
      {
        "id": "vm-8433-5",
        "vehicleId": "veh-1",
        "date": "2026-01-09",
        "type": "Service Rutin",
        "description": "Perawatan Berkala (Rp 350.000), Oil Filter (Rp 33.333), Ecstar 10W-40 (Rp 233.333), Xlerator Engine Conditioner (Rp 115.766), Xlerator Engine Flush (Rp 81.532), Catalitic Cleaner (Rp 300.000) + Cost Work (Rp 122.536)",
        "cost": 1236500,
        "technician": "Bengkel Resmi Suzuki"
      },
      {
        "id": "vm-8433-4",
        "vehicleId": "veh-1",
        "date": "2025-07-02",
        "type": "Ganti Ban",
        "description": "Ganti Ban 1 Pcs (Hankook)",
        "cost": 475000,
        "technician": "Vendor Ban"
      },
      {
        "id": "vm-8433-3",
        "vehicleId": "veh-1",
        "date": "2025-07-02",
        "type": "Service Rutin",
        "description": "Ecstar Grease MP3 (Rp 9.010), Throttle Body Cleaner (Rp 95.495), Ecstar Brake Cleaner (Rp 55.405), Oil Cleaner 325ML (Rp 72.072), Turbo Carbon Cleaner (Rp 220.000) + Cost Work (Rp 49.163)",
        "cost": 496100,
        "technician": "Bengkel Resmi Suzuki"
      },
      {
        "id": "vm-8433-2",
        "vehicleId": "veh-1",
        "date": "2025-01-02",
        "type": "Ganti Oli",
        "description": "Ganti Oli Mesin + Transmisi (Rp 65.100), Spark Plug KR6A-10 (Rp 149.548), Ecstar MT 75W-80 (Rp 163.514), Ecstar MT75W-90 GL (Rp 171.172), Oil Cleaner 325 ML (Rp 72.072), Part Degreaser (Rp 83.784), Engine Conditioner (Rp 95.495) + Cost Work (Rp 88.075)",
        "cost": 888760,
        "technician": "Bengkel Resmi Suzuki"
      },
      {
        "id": "vm-8433-1",
        "vehicleId": "veh-1",
        "date": "2024-05-07",
        "type": "Service Rutin",
        "description": "Oil Cleaner 325Ml (Rp 72.072), Part Degreaser (Rp 83.784), Engine Conditioner (Rp 96.364), Spooring (Rp 150.000), Baud Chamber (Rp 150.000) + Cost Work & PPN (Rp 44.244)",
        "cost": 596464,
        "technician": "Bengkel Resmi Suzuki",
        "notes": "Spooring & Baud Chamber"
      }
    ],
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "OfficialSheetSync",
      "updatedAt": "2026-11-04T06:45:00.000Z",
      "browser": "Chrome"
    }
  },
  {
    "id": "veh-2",
    "name": "Pick Up Suzuki Carry / 012",
    "unitCode": "012",
    "ownership": "Internal",
    "policeNumber": "F 8446 BF",
    "vehicleType": "Pick Up Operasional (012)",
    "tonnageCapacity": 1,
    "cbmCapacity": 1.5,
    "odometerKM": 65000,
    "stnkTaxExpiry": "2027-09-01",
    "kirExpiry": "2027-03-08",
    "status": "Siap Operasi",
    "sheetGid": "154320656",
    "totalMaintenanceCost": 8735077,
    "maintenanceHistory": [
      {
        "id": "vm-8446-6",
        "vehicleId": "veh-2",
        "date": "2026-09-08",
        "type": "Service Rutin",
        "description": "Jasa Perawatan Berkala 65.000 KM (Rp 182.280), Gasket, Oil Filter, VBelt WaterPump, Ecstar 10W-40 SL 3.6L, Air Accu 1000ML, Oil Cleanser 325Ml, Part Degreaser + PPN",
        "cost": 800085,
        "technician": "Bengkel Resmi Suzuki"
      },
      {
        "id": "vm-8446-5",
        "vehicleId": "veh-2",
        "date": "2026-09-08",
        "type": "Ganti Ban",
        "description": "Ganti Ban 1 Pcs (Dunlop)",
        "cost": 710000,
        "technician": "Vendor Ban"
      },
      {
        "id": "vm-8446-4",
        "vehicleId": "veh-2",
        "date": "2026-03-06",
        "type": "Ganti Ban",
        "description": "Ganti Ban 3 Pcs (Dunlop)",
        "cost": 1980000,
        "technician": "Vendor Ban"
      },
      {
        "id": "vm-8446-3",
        "vehicleId": "veh-2",
        "date": "2025-01-15",
        "type": "Perbaikan",
        "description": "Overhaul Kopling, Perawatan Berkala, Seal Crankshaft Rear Oil, Bearing, Oil Filter, Cover Assy Clutch, Disc Comp Clutch, Clip Clutch Release, Bearing Release, Cable Assy, Ecstar 10W-40 SL, Ecstar Gear Oil, Brake Cleanser, Engine Conditioner, Engine Flush, Catalitic Cleaner, Engine Treatment",
        "cost": 4489026,
        "technician": "Bengkel Resmi Suzuki"
      },
      {
        "id": "vm-8446-2",
        "vehicleId": "veh-2",
        "date": "2025-01-02",
        "type": "Ganti Oli",
        "description": "Ecstar Grease MP3 1pcs (Rp 4.505), Ecstar MT 75W-80 1L 2pcs (Rp 218.018), Xlerator Engine Conditioner (Rp 115.766), Xlerator Engine Flush (Rp 81.532) + Cost Work (Rp 46.180)",
        "cost": 466001,
        "technician": "Bengkel Resmi Suzuki"
      },
      {
        "id": "vm-8446-1",
        "vehicleId": "veh-2",
        "date": "2024-05-08",
        "type": "Service Rutin",
        "description": "Ecstar Grease MP3 2Pcs (Rp 9.010), Oil Cleanser 325Ml (Rp 72.072), Part Degreaser (Rp 83.784), Engine Conditioner 330GMS (Rp 96.364) + Cost Work (Rp 28.735)",
        "cost": 289965,
        "technician": "Bengkel Resmi Suzuki"
      }
    ],
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "OfficialSheetSync",
      "updatedAt": "2026-11-04T06:45:00.000Z",
      "browser": "Chrome"
    }
  },
  {
    "id": "veh-3",
    "name": "Pick Up Suzuki Carry / 013",
    "unitCode": "013",
    "ownership": "Internal",
    "policeNumber": "F 8569 BH",
    "vehicleType": "Pick Up Operasional (013)",
    "tonnageCapacity": 1,
    "cbmCapacity": 1.5,
    "odometerKM": 10000,
    "stnkTaxExpiry": "2027-06-01",
    "kirExpiry": "2026-12-10",
    "status": "Siap Operasi",
    "sheetGid": "179065953",
    "totalMaintenanceCost": 1515970,
    "maintenanceHistory": [
      {
        "id": "vm-8569-2",
        "vehicleId": "veh-3",
        "date": "2026-08-26",
        "type": "Perbaikan",
        "description": "Ganti Kopling Set: Bearing Input Shaft (Rp 44.595), Cover Assy Clutch (Rp 495.946), Disc Comp Clutch (Rp 432.883), Bearing Clutch Release (Rp 244.595), Ecstar Grease MP3 (Rp 10.810), OH Kopling (Rp 416.640) — Total Ganti Kopling Set",
        "cost": 1515970,
        "technician": "Bengkel Resmi Suzuki"
      },
      {
        "id": "vm-8569-1",
        "vehicleId": "veh-3",
        "date": "2026-06-03",
        "type": "Service Rutin",
        "description": "Pengecekan & Perbaikan Kopling (Service 1.000 KM - Free Service)",
        "cost": 0,
        "technician": "Bengkel Resmi Suzuki"
      }
    ],
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "OfficialSheetSync",
      "updatedAt": "2026-11-04T06:45:00.000Z",
      "browser": "Chrome"
    }
  },
  {
    "id": "veh-4",
    "name": "Pick Up Suzuki Carry / 014",
    "unitCode": "014",
    "ownership": "Internal",
    "policeNumber": "F 8594 BH",
    "vehicleType": "Pick Up Operasional (014)",
    "tonnageCapacity": 1,
    "cbmCapacity": 1.5,
    "odometerKM": 10000,
    "stnkTaxExpiry": "2027-06-01",
    "kirExpiry": "2026-12-15",
    "status": "Siap Operasi",
    "sheetGid": "560717247",
    "totalMaintenanceCost": 0,
    "maintenanceHistory": [
      {
        "id": "vm-8594-1",
        "vehicleId": "veh-4",
        "date": "2026-06-02",
        "type": "Service Rutin",
        "description": "Pengecekan Fungsi Mobil (Service 1.000 KM - Free Service)",
        "cost": 0,
        "technician": "Bengkel Resmi Suzuki"
      }
    ],
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "OfficialSheetSync",
      "updatedAt": "2026-11-04T06:45:00.000Z",
      "browser": "Chrome"
    }
  },
  {
    "id": "veh-5",
    "name": "Truk Engkel Mitsubishi Canter PS 110",
    "ownership": "Internal",
    "policeNumber": "F 8942 BG",
    "vehicleType": "Truk Engkel PS 110",
    "tonnageCapacity": 3,
    "cbmCapacity": 12,
    "odometerKM": 145000,
    "stnkTaxExpiry": "2027-05-01",
    "kirExpiry": "2027-03-01",
    "status": "Siap Operasi",
    "sheetGid": "744126287",
    "totalMaintenanceCost": 14164000,
    "maintenanceHistory": [
      {
        "id": "veh-8942-9",
        "vehicleId": "veh-5",
        "date": "2026-09-28",
        "type": "Ganti Oli",
        "description": "Ganti Oli (Rimula)",
        "cost": 560000,
        "technician": "Internal"
      },
      {
        "id": "vm-8942-8",
        "vehicleId": "veh-5",
        "date": "2026-08-25",
        "type": "Perbaikan",
        "description": "Cover Spion LH (Hilang) Rp 60.000, Ganti Lampu Depan H4 1 Pcs Rp 70.000",
        "cost": 130000,
        "technician": "Internal"
      },
      {
        "id": "vm-8942-7",
        "vehicleId": "veh-5",
        "date": "2026-06-08",
        "type": "Ganti Oli",
        "description": "Ganti Oli (Rimula)",
        "cost": 490000,
        "technician": "Agus"
      },
      {
        "id": "vm-8942-6",
        "vehicleId": "veh-5",
        "date": "2026-02-10",
        "type": "Ganti Oli",
        "description": "Ganti Oli (Rimula)",
        "cost": 495000,
        "technician": "Agus"
      },
      {
        "id": "vm-8942-5",
        "vehicleId": "veh-5",
        "date": "2025-11-04",
        "type": "Service Rutin",
        "description": "Oli Rimula 2 Galon (Rp 540.000), Filter Oli (Rp 110.000), Shock Front 2 (Rp 560.000), Water Outlet (Rp 250.000), Tutup Radiator (Rp 60.000), Selang Radiator (Rp 125.000), Bohlam 3 Pcs (Rp 39.000), Gemuk Rotori 2 (Rp 100.000) + Jasa Periksa Rem & Kelistrikan (Rp 600.000)",
        "cost": 2384000,
        "technician": "Woyo"
      },
      {
        "id": "vm-8942-4",
        "vehicleId": "veh-5",
        "date": "2025-09-16",
        "type": "Perbaikan",
        "description": "Pedal Kopling 1 Set Specia (Rp 750.000), Master Rem Atas Dalam (Rp 150.000), Minyak Rem Preston (Rp 85.000), Pen Pedal Kopling (Rp 75.000), Switch Brake Kopling (Rp 100.000), Bohlam Bemper (Rp 5.000), Mur 12 (Rp 30.000), Tutup Oli 16\" (Rp 215.000) + Jasa Central Master Kopling (Rp 550.000)",
        "cost": 1960000,
        "technician": "Woyo"
      },
      {
        "id": "vm-8942-3",
        "vehicleId": "veh-5",
        "date": "2025-08-08",
        "type": "Perbaikan",
        "description": "1 AS Jantan (Rp 250.000), Join Kopel Matsuba (Rp 275.000), Flang Join (Rp 275.000), Baut Yoke Ulir (Rp 175.000), Batang Spion (Rp 265.000), Spion Bulat 6\" (Rp 50.000), Baut Soloy Saringan (Rp 180.000), 4 Baut Kopel (Rp 40.000), 2 Kepala Aki (Rp 25.000), Potong Sambung Kopel 2 Sisi Bubut (Rp 400.000) + Jasa Bongkar Pasang Tangki Solar (Rp 550.000)",
        "cost": 2485000,
        "technician": "Agus & Woyo"
      },
      {
        "id": "vm-8942-2",
        "vehicleId": "veh-5",
        "date": "2025-08-01",
        "type": "Perbaikan",
        "description": "12 Pcs Baut Roda Depan T200 L/R (Rp 360.000), 2 Unit Tromol Depan L/R (Rp 1.250.000) + Jasa (Rp 300.000)",
        "cost": 1910000,
        "technician": "Agus"
      },
      {
        "id": "vm-8942-1",
        "vehicleId": "veh-5",
        "date": "2025-07-29",
        "type": "Perbaikan",
        "description": "4 Pcs Per Pirodo Front (Rp 540.000), 4 Gentong Rem Front Luar (Rp 700.000), 2 Laher Belakang Dalam (Rp 400.000), 4 Sil Roda Belakang (Rp 450.000), 1 Pompa Solar Pull Pam (Rp 275.000), Silen (Rp 30.000), Minyak Rem Preston (Rp 85.000), 8 Pcs Bohlam 24W (Rp 40.000), Filter Udara (Rp 190.000), 2 Gemuk TOP1 (Rp 150.000), Oli Gardan (Rp 90.000) + Jasa (Rp 800.000)",
        "cost": 3750000,
        "technician": "Agus & Woyo"
      }
    ],
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "OfficialSheetSync",
      "updatedAt": "2026-11-04T06:45:00.000Z",
      "browser": "Chrome"
    }
  },
  {
    "id": "veh-6",
    "name": "Daihatsu Luxio Operasional",
    "ownership": "Internal",
    "policeNumber": "B 2673 TVI",
    "vehicleType": "Mobil Kru / Operasional",
    "tonnageCapacity": 0.6,
    "cbmCapacity": 2.8,
    "odometerKM": 52100,
    "stnkTaxExpiry": "2026-12-01",
    "kirExpiry": "-",
    "status": "Siap Operasi",
    "sheetGid": "2000397466",
    "totalMaintenanceCost": 8540000,
    "maintenanceHistory": [
      {
        "id": "vm-2673-10",
        "vehicleId": "veh-6",
        "date": "2026-10-23",
        "type": "Perbaikan",
        "description": "Mogok Gigi Transmisi ga mau maju dan mundur (22 Oktober 2026): Ganti Oli Gardan 8 Liter + Filter (Rp 1.700.000)",
        "cost": 1700000,
        "technician": "Bengkel Transmisi"
      },
      {
        "id": "vm-2673-9",
        "vehicleId": "veh-6",
        "date": "2026-10-07",
        "type": "Ganti Oli",
        "description": "Ganti Oli HX-6 Shell (Rp 380.000), Jasa Pasang Wiper Belakang (Rp 20.000)",
        "cost": 400000,
        "technician": "Agus"
      },
      {
        "id": "vm-2673-8",
        "vehicleId": "veh-6",
        "date": "2026-08-25",
        "type": "Perbaikan",
        "description": "Ganti Lampu Utama (Rp 75.000), Pengisian Minyak Rem (Rp 35.000)",
        "cost": 110000,
        "technician": "Agus"
      },
      {
        "id": "vm-2673-7",
        "vehicleId": "veh-6",
        "date": "2026-06-08",
        "type": "Ganti Oli",
        "description": "Ganti Oli HX-6 SHELL (Rp 380.000), Ganti Filter Oli (Rp 50.000), Ganti Bohlam Foglamp Kiri (Rp 60.000)",
        "cost": 490000,
        "technician": "Agus"
      },
      {
        "id": "vm-2673-6",
        "vehicleId": "veh-6",
        "date": "2026-04-12",
        "type": "Service Rutin",
        "description": "Ganti Tutup Radiator (Rp 65.000), Service Kuras Radiator (Rp 200.000)",
        "cost": 265000,
        "technician": "Agus"
      },
      {
        "id": "vm-2673-5",
        "vehicleId": "veh-6",
        "date": "2026-01-27",
        "type": "Ganti Oli",
        "description": "Ganti Oli HX-6 SHELL (Rp 320.000), Motor Washer Wiper (Rp 135.000)",
        "cost": 455000,
        "technician": "Agus"
      },
      {
        "id": "vm-2673-4",
        "vehicleId": "veh-6",
        "date": "2026-01-13",
        "type": "Perbaikan",
        "description": "Service Radiator (Rp 350.000), Ganti Selang Water Pump (Rp 250.000), Ganti Selang Bypass (Rp 100.000), Ganti Upper Tank (Rp 350.000) - Garansi 3 Bulan",
        "cost": 1050000,
        "technician": "Agus"
      },
      {
        "id": "vm-2673-3",
        "vehicleId": "veh-6",
        "date": "2026-01-03",
        "type": "Perbaikan",
        "description": "Service Double Blower AC (Yoyo AC Jl. Baru, Garansi 3 Bulan)",
        "cost": 1400000,
        "technician": "Agus / Yoyo AC"
      },
      {
        "id": "vm-2673-2",
        "vehicleId": "veh-6",
        "date": "2025-11-04",
        "type": "Perbaikan",
        "description": "Service Dinamo Starter (Rp 250.000), Biaya Storing + Pengecekan Pekalongan (Rp 250.000)",
        "cost": 500000,
        "technician": "Agus"
      },
      {
        "id": "vm-2673-1",
        "vehicleId": "veh-6",
        "date": "2025-11-03",
        "type": "Service Rutin",
        "description": "Tune Up + Ganti Oli dan Filter (Rp 1.210.000), Ganti AKI GS Tukar Aki Lama Shop&Drive (Rp 960.000)",
        "cost": 2170000,
        "technician": "Agus"
      }
    ],
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "OfficialSheetSync",
      "updatedAt": "2026-11-04T06:45:00.000Z",
      "browser": "Chrome"
    }
  },
  {
    "id": "veh-7",
    "name": "Motor Honda Beat Operasional",
    "ownership": "Internal",
    "policeNumber": "F 2215 EO",
    "vehicleType": "Motor Operasional",
    "tonnageCapacity": 0.1,
    "cbmCapacity": 0.2,
    "odometerKM": 15000,
    "stnkTaxExpiry": "2027-08-01",
    "kirExpiry": "-",
    "status": "Siap Operasi",
    "sheetGid": "489515035",
    "totalMaintenanceCost": 307000,
    "maintenanceHistory": [
      {
        "id": "vm-2215-1",
        "vehicleId": "veh-7",
        "date": "2026-11-03",
        "type": "Service Rutin",
        "description": "Tune Up: Oli MPX 0,8L (Rp 80.000), Oli Gardan (Rp 22.000), Filter Udara (Rp 60.000), Kampas Rem Depan (Rp 45.000), Seal Master Rem Depan (Rp 50.000), Service Injection (Rp 50.000)",
        "cost": 307000,
        "technician": "Agus"
      }
    ],
    "_syncMeta": {
      "deviceOS": "macOS",
      "deviceType": "Desktop",
      "updatedBy": "OfficialSheetSync",
      "updatedAt": "2026-11-04T06:45:00.000Z",
      "browser": "Chrome"
    }
  }
];

export const INITIAL_VEHICLE_MAINTENANCE_RECORDS: VehicleMaintenanceRecord[] = INITIAL_VEHICLES.flatMap(
  (v) => v.maintenanceHistory || []
);

const INDONESIAN_MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/**
 * Memformat tanggal YYYY-MM-DD menjadi format tanggal, bulan, tahun Bahasa Indonesia (contoh: "20 Agustus 2026")
 */
export function formatServiceDateIndonesian(isoDate?: string): string {
  if (!isoDate) return '-';
  const clean = isoDate.trim().slice(0, 10);
  const parts = clean.split('-');
  if (parts.length !== 3) return isoDate;
  const year = Number(parts[0]);
  const monthIdx = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  if (!year || monthIdx < 0 || monthIdx > 11 || !day) return isoDate;
  return `${day} ${INDONESIAN_MONTH_NAMES[monthIdx]} ${year}`;
}

/**
 * Mengurutkan riwayat servis dari tanggal, bulan, tahun aktual terkini (paling atas) ke terlama
 */
export function sortMaintenanceHistoryDesc(records?: VehicleMaintenanceRecord[]): VehicleMaintenanceRecord[] {
  if (!Array.isArray(records)) return [];
  return [...records].sort((a, b) => String(b?.date || '').localeCompare(String(a?.date || '')));
}

/**
 * Membatasi riwayat servis hanya untuk 1 tahun berjalan (tahun terkini, default 2026)
 * dan menghitung total biaya serta jumlah catatan servis pada tahun tersebut.
 */
export function filterMaintenanceHistoryByCurrentYear(
  records?: VehicleMaintenanceRecord[],
  targetYear?: string
): { year: string; records: VehicleMaintenanceRecord[]; totalCost: number } {
  const sorted = sortMaintenanceHistoryDesc(records);
  const effectiveYear =
    targetYear ||
    (sorted.length > 0 && /^\d{4}/.test(String(sorted[0]?.date || '').trim())
      ? String(sorted[0].date).trim().slice(0, 4)
      : '2026');
  const filtered = sorted.filter(rec => String(rec?.date || '').trim().startsWith(effectiveYear));
  const totalCost = filtered.reduce((sum, rec) => sum + (Number(rec?.cost) || 0), 0);
  return { year: effectiveYear, records: filtered, totalCost };
}

/**
 * Membatasi ringkasan riwayat servis maksimal 1 catatan servis terkini per tahun
 * (diurutkan dari tahun terbaru ke tahun sebelumnya).
 */
export function limitMaintenanceHistoryOnePerYear(records?: VehicleMaintenanceRecord[]): VehicleMaintenanceRecord[] {
  return filterMaintenanceHistoryByCurrentYear(records, '2026').records;
}

/**
 * Menormalisasi daftar kendaraan armada dari LocalStorage / Cloud agar selalu sinkron
 * dengan 7 unit resmi Google Sheet PT. Riz Production Multi Kreasi.
 */
export function normalizeVehiclesMaster(rawList: any[]): VehicleMaster[] {
  const FAKE_PLATES = ['B 9142 SXZ', 'B 9804 UYA', 'B 2319 POX', 'B 9043 TQB', 'B 1874 RIZ', 'B 9552 KTN', 'B 9331 JXQ'];
  let deletedIds = new Set<string>();
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const rawDel = localStorage.getItem('riz_deleted_ids_master_vehicles');
      if (rawDel) {
        const parsedDel = JSON.parse(rawDel);
        if (Array.isArray(parsedDel)) deletedIds = new Set(parsedDel.map(String));
      }
    } catch {}
  }

  const canonicalById = new Map<string, VehicleMaster>();
  const canonicalByPlate = new Map<string, VehicleMaster>();
  INITIAL_VEHICLES.forEach(v => {
    const sorted = {
      ...v,
      maintenanceHistory: sortMaintenanceHistoryDesc(v.maintenanceHistory)
    };
    canonicalById.set(v.id, sorted);
    canonicalByPlate.set(v.policeNumber.toUpperCase().trim(), sorted);
  });

  const resultById = new Map<string, VehicleMaster>();
  // Masukkan 7 unit resmi sebagai basis utama kecuali bila telah dihapus eksplisit oleh user
  INITIAL_VEHICLES.forEach(v => {
    const plate = v.policeNumber.toUpperCase().trim();
    if (!deletedIds.has(v.id) && !deletedIds.has(plate)) {
      resultById.set(v.id, {
        ...v,
        maintenanceHistory: sortMaintenanceHistoryDesc(v.maintenanceHistory)
      });
    }
  });

  if (Array.isArray(rawList)) {
    const flat = rawList.flatMap(item => (item && Array.isArray(item.list)) ? item.list : [item]);
    flat.forEach(item => {
      if (!item || typeof item !== 'object' || item._deleted) return;
      const plate = String(item.policeNumber || '').toUpperCase().trim();
      if (!plate || FAKE_PLATES.includes(plate)) return;
      const itemId = String(item.id || '').trim();
      if ((itemId && deletedIds.has(itemId)) || deletedIds.has(plate)) return;

      const canonical = (itemId ? canonicalById.get(itemId) : undefined) || canonicalByPlate.get(plate);
      if (canonical) {
        const isStaleLegacyStub =
          !item._userEdited &&
          (!Array.isArray(item.maintenanceHistory) || item.maintenanceHistory.length === 0) &&
          (!item._syncMeta?.updatedAt || String(item._syncMeta.updatedAt) < '2026-11-04T06:45:00.000Z');

        if (isStaleLegacyStub) {
          resultById.set(canonical.id, {
            ...item,
            id: canonical.id,
            name: canonical.name,
            unitCode: canonical.unitCode,
            ownership: canonical.ownership,
            policeNumber: canonical.policeNumber,
            vehicleType: canonical.vehicleType,
            tonnageCapacity: canonical.tonnageCapacity,
            cbmCapacity: canonical.cbmCapacity,
            odometerKM: Math.max(Number(item.odometerKM || 0), canonical.odometerKM),
            stnkTaxExpiry: canonical.stnkTaxExpiry,
            kirExpiry: canonical.kirExpiry,
            status: item.status || canonical.status,
            sheetGid: canonical.sheetGid,
            totalMaintenanceCost: canonical.totalMaintenanceCost,
            maintenanceHistory: sortMaintenanceHistoryDesc(canonical.maintenanceHistory)
          });
        } else {
          const mergedHistory = sortMaintenanceHistoryDesc(
            Array.isArray(item.maintenanceHistory) ? item.maintenanceHistory : canonical.maintenanceHistory
          );
          const computedCost = Array.isArray(item.maintenanceHistory)
            ? mergedHistory.reduce((sum, mh) => sum + Number(mh?.cost || 0), 0)
            : (typeof item.totalMaintenanceCost === 'number' ? item.totalMaintenanceCost : canonical.totalMaintenanceCost);

          resultById.set(canonical.id, {
            ...canonical,
            ...item,
            id: canonical.id,
            name: item.name || canonical.name,
            unitCode: item.unitCode || canonical.unitCode,
            ownership: item.ownership || canonical.ownership,
            policeNumber: (item.policeNumber || canonical.policeNumber).toUpperCase().trim(),
            vehicleType: item.vehicleType || canonical.vehicleType,
            tonnageCapacity: item.tonnageCapacity !== undefined && !isNaN(Number(item.tonnageCapacity)) ? Number(item.tonnageCapacity) : canonical.tonnageCapacity,
            cbmCapacity: item.cbmCapacity !== undefined && !isNaN(Number(item.cbmCapacity)) ? Number(item.cbmCapacity) : canonical.cbmCapacity,
            odometerKM: item.odometerKM !== undefined && !isNaN(Number(item.odometerKM)) ? Number(item.odometerKM) : canonical.odometerKM,
            stnkTaxExpiry: item.stnkTaxExpiry || canonical.stnkTaxExpiry,
            kirExpiry: item.kirExpiry || canonical.kirExpiry,
            status: item.status || canonical.status,
            sheetGid: item.sheetGid || canonical.sheetGid,
            totalMaintenanceCost: computedCost,
            maintenanceHistory: mergedHistory
          });
        }
      } else {
        const key = itemId || plate;
        const sortedHist = sortMaintenanceHistoryDesc((item as VehicleMaster).maintenanceHistory);
        const computedCost = Array.isArray(item.maintenanceHistory) && item.maintenanceHistory.length > 0
          ? sortedHist.reduce((sum, mh) => sum + Number(mh?.cost || 0), 0)
          : (typeof item.totalMaintenanceCost === 'number' ? item.totalMaintenanceCost : 0);
        resultById.set(key, {
          ...(item as VehicleMaster),
          id: itemId || `veh-${plate.replace(/\s+/g, '-')}`,
          policeNumber: plate,
          totalMaintenanceCost: computedCost,
          maintenanceHistory: sortedHist
        });
      }
    });
  }

  return Array.from(resultById.values());
}

/**
 * Normalisasi Master Inventaris Aset Gudang Resmi (133 Kelompok Aset dari Google Sheet 1lZ9Ja-GWY7BMn7l9uUM4p5Q97DXeKy0O):
 * Menggabungkan INITIAL_ASSETS resmi dengan perubahan atau penambahan user di localStorage / Cloud Sync.
 */
export function normalizeAssetsMaster(rawList: any[]): Asset[] {
  const resultById = new Map<string, Asset>();
  const canonicalByCode = new Map<string, Asset>();

  INITIAL_ASSETS.forEach(asset => {
    resultById.set(asset.id, {
      ...asset,
      serialNumber: stripInventoryNominalText(asset.serialNumber),
      repairHistory: Array.isArray(asset.repairHistory) ? asset.repairHistory : []
    });
    canonicalByCode.set(asset.code.toUpperCase().trim(), asset);
  });

  if (Array.isArray(rawList)) {
    const flat = rawList.flatMap(item => (item && Array.isArray(item.list)) ? item.list : [item]);
    flat.forEach(item => {
      if (!item || typeof item !== 'object' || item._deleted) return;
      const itemId = String(item.id || '').trim();
      const itemCode = String(item.code || '').toUpperCase().trim();
      if (!itemId && !itemCode) return;

      const canonical = (itemId ? resultById.get(itemId) : undefined) || (itemCode ? canonicalByCode.get(itemCode) : undefined);
      if (canonical) {
        resultById.set(canonical.id, {
          ...canonical,
          ...item,
          id: canonical.id,
          code: item.code || canonical.code,
          name: item.name || canonical.name,
          brand: item.brand || canonical.brand,
          serialNumber: stripInventoryNominalText(item.serialNumber || canonical.serialNumber),
          division: item.division || canonical.division,
          location: item.location || canonical.location,
          condition: item.condition || canonical.condition,
          repairHistory: Array.isArray(item.repairHistory) && item.repairHistory.length > 0
            ? item.repairHistory
            : canonical.repairHistory
        });
      } else {
        const key = itemId || `ast-custom-${itemCode}`;
        resultById.set(key, {
          ...(item as Asset),
          id: key,
          code: itemCode || key.toUpperCase(),
          serialNumber: stripInventoryNominalText(item.serialNumber || '-'),
          repairHistory: Array.isArray(item.repairHistory) ? item.repairHistory : []
        });
      }
    });
  }

  return Array.from(resultById.values());
}

export {
  INITIAL_JOB_ASSIGNMENTS,
  OFFICIAL_FREELANCE_CREW_LIST,
  resolveCrewMember,
  buildCrewList,
  formatFleetVehicleBadge
} from './data/jobAssignmentsData';

