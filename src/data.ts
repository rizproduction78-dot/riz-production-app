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
  { id: 'director-wahyu', name: 'Wahyu', fullName: 'Wahyu', nickname: 'Wahyu', email: 'zakimau06@gmail.com', phone: '083819947193', division: 'Admin', role: 'Owner', level: 8 },
  { id: 'staff-agustino', name: 'Agustino Setiawan', fullName: 'Agustino Setiawan', nickname: 'Agustino', email: 'agustinostwn@gmail.com', phone: '082128263551', division: 'Admin', role: 'Admin', level: 4 },
  { id: 'staff-fahrul', name: 'M. Fahruyana . A', fullName: 'M. Fahruyana . A', nickname: 'Fahrul', email: 'rullyana888@gmail.com', phone: '081287364025', division: 'Admin', role: 'Manager', level: 6 },
  { id: 'staff-syalsa', name: 'Syalsa Sri Hestariana', fullName: 'Syalsa Sri Hestariana', nickname: 'Caca', email: 'Syalsaassh24@gmail.com', phone: '087834180561', division: 'Admin', role: 'Admin', level: 4 },
  { id: 'staff-seno', name: 'Seno Subroto', fullName: 'Seno Subroto', nickname: 'Seno', email: 'seno.subroto78@gmail.com', phone: '081297541980', division: 'Admin', role: 'Staff', level: 4 },

  // 3. Videotron / LED
  { id: 'staff-ayong', name: 'Ayong Sumarsih', fullName: 'Ayong Sumarsih', nickname: 'Ayong', email: 'Prabuam7@gmail.com', phone: '087716184516', division: 'Videotron', role: 'Team Leader', level: 5 },
  { id: 'staff-dedi', name: 'Dedi Agus Wigiantoro', fullName: 'Dedi Agus Wigiantoro', nickname: 'Wigi', email: 'dedy.wigianto@icloud.com', phone: '085772566860', division: 'Videotron', role: 'Staff', level: 3 },
  { id: 'staff-irvan', name: 'Muhamad Irvan', fullName: 'Muhamad Irvan', nickname: 'Irfan', email: 'Irfanthepul29@gmail.com', phone: '085282567132', division: 'Videotron', role: 'Staff', level: 3 },

  // 4. Multimedia
  { id: 'staff-mulyadi', name: 'Mulyadi', fullName: 'Mulyadi', nickname: 'Jay', email: 'Jaymulyadi43@gmail.com', phone: '085813994044', division: 'Multimedia', role: 'Staff', level: 3 },

  // 5. Lighting
  { id: 'staff-heri', name: 'Heri', fullName: 'Heri', nickname: 'Heri', email: 'saputraheriansyah2@gmail.com', phone: '085814152061', division: 'Lighting', role: 'Team Leader', level: 5 },

  { id: 'staff-iwan', name: 'Iwan Kurniawan', fullName: 'Iwan Kurniawan', nickname: 'Butonk', email: 'Boetonk2785@gmail.com', phone: '083819616123', division: 'Audio', role: 'Staff', level: 3 },
  { id: 'staff-rahmat', name: 'Muhamad Rahmat', fullName: 'Muhamad Rahmat', nickname: 'Mboh', email: 'outsideprojectmboh@gmail.com', phone: '082124722363', division: 'Audio', role: 'Team Leader', level: 5 },
  { id: 'staff-ramdani', name: 'Ramdani', fullName: 'Ramdani', nickname: 'Dani', email: 'ismailramdani133@gmail.com', phone: '082123166002', division: 'Audio', role: 'Staff', level: 3 },
  { id: 'staff-suryana', name: 'Suryana', fullName: 'Suryana', nickname: 'Nana / Buluk', email: 'nia.kurni1930@gmail.com', phone: '083847130366', division: 'Audio', role: 'Staff', level: 3 },
  { id: 'staff-taufik', name: 'Taufik Diana', fullName: 'Taufik Diana', nickname: 'Opik', email: 'Taufikdya8@gmail.com', phone: '085722025295', division: 'Audio', role: 'Staff', level: 3 },
  { id: 'staff-unyin', name: 'Wahyudin', fullName: 'Wahyudin', nickname: 'Unyim', email: 'wahyudin.unyin@gmail.com', phone: '085812345678', division: 'Audio', role: 'Staff', level: 3 },
  { id: 'staff-yudish', name: 'Yudishtira Purnama A', fullName: 'Yudishtira Purnama A', nickname: 'Yudish', email: 'Yudhisintan@gmail.com', phone: '085888137581', division: 'Audio', role: 'Staff', level: 3 },

  // 7. Service
  { id: 'staff-damri', name: 'Damri', fullName: 'Damri', nickname: 'Mang Damri', email: 'damri.service@rizproduction.com', phone: '081288990011', division: 'Service', role: 'Team Leader', level: 5 },
  { id: 'staff-mulyana', name: 'Mulyana', fullName: 'Mulyana', nickname: 'Kharo', email: 'tabitakharo@gmail.com', phone: '089523134060', division: 'Service', role: 'Staff', level: 3 }
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
      canonicalStaff = {
        ...s,
        id: 'director-wahyu',
        name: 'Wahyu',
        fullName: 'Wahyu',
        nickname: 'Wahyu',
        division: 'Admin',
        role: 'Owner',
        level: 8,
        email: s.email || 'zakimau06@gmail.com',
        phone: s.phone || '083819947193'
      };
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
      canonicalStaff = {
        ...s,
        id: 'staff-suryana',
        name: 'Suryana',
        fullName: 'Suryana',
        nickname: 'Nana / Buluk',
        division: 'Audio',
        role: 'Staff',
        level: 3,
        email: 'nia.kurni1930@gmail.com',
        phone: '083847130366'
      };
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
      canonicalStaff = {
        ...s,
        id: 'staff-unyin',
        name: 'Wahyudin',
        fullName: 'Wahyudin',
        nickname: 'Unyim',
        division: 'Audio',
        role: 'Staff',
        level: 3,
        email: 'wahyudin.unyin@gmail.com',
        phone: '085812345678'
      };
    }
    // 3. Seno Subroto (Admin Staff)
    else if (rawId === 'staff-seno' || combinedStr.includes('seno')) {
      canonicalId = 'staff-seno';
      canonicalStaff = {
        ...s,
        id: 'staff-seno',
        name: 'Seno Subroto',
        fullName: 'Seno Subroto',
        nickname: 'Seno',
        division: 'Admin',
        role: 'Staff',
        level: 4
      };
    }
    // 4. Damri (Service Leader)
    else if (rawId === 'staff-damri' || combinedStr.includes('damri')) {
      canonicalId = 'staff-damri';
      canonicalStaff = {
        ...s,
        id: 'staff-damri',
        name: 'Damri',
        fullName: 'Damri',
        nickname: 'Mang Damri',
        division: 'Service',
        role: 'Team Leader',
        level: 5
      };
    }
    // 5. Mulyana (Service Staff)
    else if (rawId === 'staff-mulyana' || combinedStr.includes('mulyana') || combinedStr.includes('kharo')) {
      canonicalId = 'staff-mulyana';
      canonicalStaff = {
        ...s,
        id: 'staff-mulyana',
        name: 'Mulyana',
        fullName: 'Mulyana',
        nickname: 'Kharo',
        division: 'Service',
        role: 'Staff',
        level: 3
      };
    }
    // 6. Iwan Kurniawan / Butonk (Audio)
    else if (rawId === 'staff-iwan' || combinedStr.includes('iwan') || combinedStr.includes('butonk') || combinedStr.includes('boetonk')) {
      canonicalId = 'staff-iwan';
      canonicalStaff = { ...s, id: 'staff-iwan', name: 'Iwan Kurniawan', fullName: 'Iwan Kurniawan', nickname: 'Butonk', division: 'Audio', role: 'Staff', level: 3 };
    }
    // 7. Muhamad Rahmat / Mboh (Audio Leader)
    else if (rawId === 'staff-rahmat' || combinedStr.includes('rahmat') || combinedStr.includes('mboh')) {
      canonicalId = 'staff-rahmat';
      canonicalStaff = { ...s, id: 'staff-rahmat', name: 'Muhamad Rahmat', fullName: 'Muhamad Rahmat', nickname: 'Mboh', division: 'Audio', role: 'Team Leader', level: 5 };
    }
    // 8. Ramdani / Dani (Audio)
    else if (rawId === 'staff-ramdani' || combinedStr.includes('ramdani') || combinedStr.includes('dani')) {
      canonicalId = 'staff-ramdani';
      canonicalStaff = { ...s, id: 'staff-ramdani', name: 'Ramdani', fullName: 'Ramdani', nickname: 'Dani', division: 'Audio', role: 'Staff', level: 3 };
    }
    // 9. Taufik Diana / Opik (Audio)
    else if (rawId === 'staff-taufik' || combinedStr.includes('taufik') || combinedStr.includes('opik')) {
      canonicalId = 'staff-taufik';
      canonicalStaff = { ...s, id: 'staff-taufik', name: 'Taufik Diana', fullName: 'Taufik Diana', nickname: 'Opik', division: 'Audio', role: 'Staff', level: 3 };
    }
    // 10. Yudishtira Purnama A / Yudish (Audio)
    else if (rawId === 'staff-yudish' || combinedStr.includes('yudishtira') || combinedStr.includes('yudish')) {
      canonicalId = 'staff-yudish';
      canonicalStaff = { ...s, id: 'staff-yudish', name: 'Yudishtira Purnama A', fullName: 'Yudishtira Purnama A', nickname: 'Yudish', division: 'Audio', role: 'Staff', level: 3 };
    }
    // 11. Heri (Lighting Leader)
    else if (rawId === 'staff-heri' || combinedStr.includes('heri')) {
      canonicalId = 'staff-heri';
      canonicalStaff = { ...s, id: 'staff-heri', name: 'Heri', fullName: 'Heri', nickname: 'Heri', division: 'Lighting', role: 'Team Leader', level: 5 };
    }
    // 12. Mulyadi / Jay (Multimedia)
    else if (rawId === 'staff-mulyadi' || combinedStr.includes('mulyadi') || combinedStr.includes('jay')) {
      canonicalId = 'staff-mulyadi';
      canonicalStaff = { ...s, id: 'staff-mulyadi', name: 'Mulyadi', fullName: 'Mulyadi', nickname: 'Jay', division: 'Multimedia', role: 'Staff', level: 3 };
    }
    // 13. Ayong Sumarsih (Videotron Leader)
    else if (rawId === 'staff-ayong' || combinedStr.includes('ayong')) {
      canonicalId = 'staff-ayong';
      canonicalStaff = { ...s, id: 'staff-ayong', name: 'Ayong Sumarsih', fullName: 'Ayong Sumarsih', nickname: 'Ayong', division: 'Videotron', role: 'Team Leader', level: 5 };
    }
    // 14. Dedi Agus Wigiantoro / Wigi (Videotron)
    else if (rawId === 'staff-dedi' || combinedStr.includes('dedi') || combinedStr.includes('wigi')) {
      canonicalId = 'staff-dedi';
      canonicalStaff = { ...s, id: 'staff-dedi', name: 'Dedi Agus Wigiantoro', fullName: 'Dedi Agus Wigiantoro', nickname: 'Wigi', division: 'Videotron', role: 'Staff', level: 3 };
    }
    // 15. Muhamad Irvan / Irfan (Videotron)
    else if (rawId === 'staff-irvan' || combinedStr.includes('irvan') || combinedStr.includes('irfan')) {
      canonicalId = 'staff-irvan';
      canonicalStaff = { ...s, id: 'staff-irvan', name: 'Muhamad Irvan', fullName: 'Muhamad Irvan', nickname: 'Irfan', division: 'Videotron', role: 'Staff', level: 3 };
    }
    // 16. Abah Sobur (Gudang)
    else if (rawId === 'staff-absobur' || combinedStr.includes('sobur')) {
      canonicalId = 'staff-absobur';
      canonicalStaff = { ...s, id: 'staff-absobur', name: 'Abah Sobur', fullName: 'Abah Sobur', nickname: 'Abah Sobur', division: 'Gudang', role: 'Gudang', level: 3 };
    }
    // 17. Gatot Wiliyanto (Gudang)
    else if (rawId === 'staff-gatot' || combinedStr.includes('gatot')) {
      canonicalId = 'staff-gatot';
      canonicalStaff = { ...s, id: 'staff-gatot', name: 'Gatot Wiliyanto', fullName: 'Gatot Wiliyanto', nickname: 'Gatot', division: 'Gudang', role: 'Gudang', level: 3 };
    }
    // 18. Udin Saepudin / Mang ube (Gudang)
    else if (rawId === 'staff-udin' || combinedStr.includes('saepudin') || combinedStr.includes('mang ube') || combinedStr.includes('udin')) {
      canonicalId = 'staff-udin';
      canonicalStaff = { ...s, id: 'staff-udin', name: 'Udin Saepudin', fullName: 'Udin Saepudin', nickname: 'Mang ube', division: 'Gudang', role: 'Gudang', level: 3 };
    }
    // 19. Agustino Setiawan (Admin)
    else if (rawId === 'staff-agustino' || combinedStr.includes('agustino')) {
      canonicalId = 'staff-agustino';
      canonicalStaff = { ...s, id: 'staff-agustino', name: 'Agustino Setiawan', fullName: 'Agustino Setiawan', nickname: 'Agustino', division: 'Admin', role: 'Admin', level: 4 };
    }
    // 20. M. Fahruyana . A / Fahrul (Manager)
    else if (rawId === 'staff-fahrul' || combinedStr.includes('fahruyana') || combinedStr.includes('fahrul') || combinedStr.includes('rullyana')) {
      canonicalId = 'staff-fahrul';
      canonicalStaff = { ...s, id: 'staff-fahrul', name: 'M. Fahruyana . A', fullName: 'M. Fahruyana . A', nickname: 'Fahrul', division: 'Admin', role: 'Manager', level: 6 };
    }
    // 21. Syalsa Sri Hestariana / Caca (Admin)
    else if (rawId === 'staff-syalsa' || combinedStr.includes('syalsa') || combinedStr.includes('caca')) {
      canonicalId = 'staff-syalsa';
      canonicalStaff = { ...s, id: 'staff-syalsa', name: 'Syalsa Sri Hestariana', fullName: 'Syalsa Sri Hestariana', nickname: 'Caca', division: 'Admin', role: 'Admin', level: 4 };
    }

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
export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo-20260904-panel-01',
    findingId: 'find-20260904-panel-audio',
    title: 'Perbaikan Panel Listrik Audio 3 Phase (Ganti Stop Kontak & Legrand Cewek)',
    equipment: 'Panel Distribusi Listrik Audio 3 Phase',
    priority: 'Sedang',
    pic: 'Opik / Mboh',
    dateCreated: '2026-09-04',
    deadline: '2026-09-05',
    status: 'Completed',
    notes: 'Perbaikan panel listrik selesai dilakukan Opik & Mboh pada 5 Sept 2026. 1 Ganti Stop Kontak, 1 Ganti Legrand Cewek. Panel listrik dalam kondisi aman dan siap digunakan untuk event.',
    division: 'Audio'
  }
];

// Data Temuan QC Resmi dari Reference Daily Task Sheet
export const INITIAL_FINDINGS: Finding[] = [
  {
    id: 'find-20260903-dbtech18',
    equipment: 'Speaker dBTech DVA T15 No. 18',
    issue: 'DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasuil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event. Rekomendasi untuk di cek oleh team service terutama pada modul Amplifier.',
    priority: 'Sedang',
    pic: 'Team Service / Mboh',
    division: 'Audio',
    targetDate: '2026-09-08',
    status: 'Open',
    dateCreated: '2026-09-03'
  },
  {
    id: 'find-20260904-panel-audio',
    equipment: 'Panel Distribusi Listrik Audio 3 Phase',
    issue: 'Pengecekan Panel 3 Unit: 2 panel Sudah OK. 1 Ganti Stop Kontak, 1 Ganti Legran Cewe (Perbaikan selesai dilakukan Opik & Mboh pada 5 Sept, panel aman & siap pakai).',
    priority: 'Sedang',
    pic: 'Opik / Buluk',
    division: 'Audio',
    targetDate: '2026-09-05',
    status: 'Close',
    dateCreated: '2026-09-04'
  }
];

// Data Logbook Inspeksi Resmi dari Reference Daily Task Sheet (gid=198998470)
export const INITIAL_LOGBOOK_ENTRIES: LogbookEntry[] = [
  {
    id: 'log-20260901-01',
    date: '2026-09-01',
    division: 'Multimedia',
    staffName: 'Jay',
    activity: 'Belajar Aplikasi Gemini & Chat GPT',
    result: 'OK',
    followUp: 'Penerapan pembuatan prompt logbook & format SOP administrasi',
    status: 'Close',
    verification: 'Fahrul (Manager)',
    checklists: {
      'Belajar Aplikasi Gemini': { status: 'OK', notes: 'Eksplorasi prompt dan tools AI' },
      'Belajar Aplikasi Chat GPT': { status: 'OK', notes: 'Pembuatan template administrasi & laporan otomatis' }
    }
  },
  {
    id: 'log-20260903-01',
    date: '2026-09-03',
    division: 'Audio',
    staffName: 'Mboh',
    activity: 'Pengecekan Semua Unit Speker DBTtech15 SmaartLive & Pembersihan Debu',
    result: 'OK',
    followUp: 'DB Tech No.18 ada kendala modul amplifier serak saat beban input besar (masih aman untuk event). Rekomendasi cek team service.',
    status: 'Open',
    verification: 'Agustino (Admin)',
    checklists: {
      'Pengecekan Speker DBTech15 SmaartLive': { status: 'OK', notes: 'Pengecekan semua unit speaker dBTech15 dengan SmaartLive' },
      'Pembersihan Debu Box DBTech': { status: 'OK', notes: 'Membersihkan semua unit dBTech dari debu selesai' },
      'Modul Amplifier DB Tech No. 18': { status: 'NG', notes: 'Suara serak saat beban besar, aman untuk event, rekomendasi cek team service' }
    }
  },
  {
    id: 'log-20260903-02',
    date: '2026-09-03',
    division: 'Audio',
    staffName: 'Yudis',
    activity: 'Pengecekan Semua Unit Speker DBTtech15 SmaartLive & Pembersihan Debu',
    result: 'OK',
    followUp: 'Pembersihan debu dan pengecekan box speaker dBTech bersama Mboh, Buluk & Butong',
    status: 'Open',
    verification: 'Agustino (Admin)',
    checklists: {
      'Pembersihan Debu Box DBTech': { status: 'OK', notes: 'Pembersihan fisik box speaker dBTech selesai' }
    }
  },
  {
    id: 'log-20260903-03',
    date: '2026-09-03',
    division: 'Audio',
    staffName: 'Buluk',
    activity: 'Pengecekan Semua Unit Speker DBTtech15 SmaartLive & Pembersihan Debu',
    result: 'OK',
    followUp: 'Pembersihan debu dan uji pengukuran SmaartLive line array dBTech',
    status: 'Open',
    verification: 'Agustino (Admin)',
    checklists: {
      'Pengecekan Speker DBTech15 SmaartLive': { status: 'OK', notes: 'Pengukuran respon frekuensi modul dBTech' }
    }
  },
  {
    id: 'log-20260903-04',
    date: '2026-09-03',
    division: 'Audio',
    staffName: 'Butong',
    activity: 'Pengecekan Semua Unit Speker DBTtech15 SmaartLive & Pembersihan Debu',
    result: 'OK',
    followUp: 'Pembersihan debu dan pengecekan box speaker dBTech bersama Mboh, Yudis & Buluk',
    status: 'Open',
    verification: 'Agustino (Admin)',
    checklists: {
      'Pengecekan Speker DBTech15 SmaartLive': { status: 'OK', notes: 'Pembersihan dan pengecekan unit speaker dBTech' }
    }
  },
  {
    id: 'log-20260904-01',
    date: '2026-09-04',
    division: 'Audio',
    staffName: 'Opik',
    activity: 'Pengecekan Panel 3 Unit',
    result: 'OK',
    followUp: '2 panel Sudah OK. 1 Ganti Stop Kontak, 1 Ganti Legran Cewe',
    status: 'Close',
    verification: 'Agustino (Admin)',
    checklists: {
      'Pengecekan Panel 3 Unit': { status: 'OK', notes: '2 panel Sudah OK, 1 unit perbaikan stop kontak & Legrand cewek' }
    }
  },
  {
    id: 'log-20260904-02',
    date: '2026-09-04',
    division: 'Audio',
    staffName: 'Buluk',
    activity: 'Pengecekan Panel 3 Unit',
    result: 'OK',
    followUp: 'Pengecekan panel 3 unit & penggantian stop kontak bersama Opik',
    status: 'Close',
    verification: 'Agustino (Admin)',
    checklists: {
      'Pengecekan Panel 3 Unit': { status: 'OK', notes: '2 panel Sudah OK, 1 ganti stop kontak & Legrand cewek' }
    }
  },
  {
    id: 'log-20260905-01',
    date: '2026-09-05',
    division: 'Audio',
    staffName: 'Opik',
    activity: 'Perbaikan Panel Listrik & Praktek Penggabungan Metode Sub Cardioid dan End-Fire (Sub T45)',
    result: 'OK',
    followUp: 'Panel listrik dalam kondisi aman dan bisa di gunakan',
    status: 'Close',
    verification: 'Fahrul (Manager)',
    checklists: {
      'Perbaikan Panel Listrik': { status: 'OK', notes: 'Panel listrik dalam kondisi aman dan bisa di gunakan' },
      'Praktek Sub Cardioid & End-Fire': { status: 'OK', notes: 'Praktikum setup Sub Cardioid & End-Fire dengan Sub T45 sukses' }
    }
  },
  {
    id: 'log-20260905-02',
    date: '2026-09-05',
    division: 'Audio',
    staffName: 'Mboh',
    activity: 'Perbaikan Panel Listrik & Praktek Penggabungan Metode Sub Cardioid dan End-Fire (Sub T45)',
    result: 'OK',
    followUp: 'Pengujian panel dan setting delay/fasa sub cardioid bersama Opik',
    status: 'Close',
    verification: 'Fahrul (Manager)',
    checklists: {
      'Praktek Sub Cardioid & End-Fire': { status: 'OK', notes: 'Verifikasi pembatalan radiasi belakang polar pattern sub cardioid' }
    }
  },
  {
    id: 'log-20260905-03',
    date: '2026-09-05',
    division: 'Videotron',
    staffName: 'Kharo',
    activity: 'Repair Ganti Pixel Kabinet LED 2 Box',
    result: 'OK',
    followUp: 'Repair dan penggantian pixel kabinet LED 2 box selesai',
    status: 'Close',
    verification: 'Ayong (Team Leader)',
    checklists: {
      'Repair Ganti Pixel Kabinet LED 2 Box': { status: 'OK', notes: 'Penggantian pixel modul SMD 2 box selesai diuji' }
    }
  },
  {
    id: 'log-20260906-01',
    date: '2026-09-06',
    division: 'Videotron',
    staffName: 'Kharo',
    activity: 'Repair Ganti Pixel Kabinet LED 2 Box (Lanjutan)',
    result: 'In Progress',
    followUp: 'Repair ganti pixel kabinet led 2 box lanjutan sedang dalam pengerjaan',
    status: 'Open',
    verification: 'Ayong (Team Leader)',
    checklists: {
      'Repair Ganti Pixel Kabinet LED 2 Box': { status: 'OK', notes: 'Penyolderan modul 2 box kabinet LED lanjutan' }
    }
  },
  {
    id: 'log-20260906-02',
    date: '2026-09-06',
    division: 'Audio',
    staffName: 'Dani',
    activity: 'Cek Cable XLR dan Jack to Jack',
    result: 'OK',
    followUp: 'Cek cable XLR dan Jack to Jack selesai dan siap digunakan',
    status: 'Close',
    verification: 'Mboh (Team Leader)',
    checklists: {
      'Cek Cable XLR': { status: 'OK', notes: 'Kontinuitas kabel XLR mikrofon dan snake normal' },
      'Cek Cable Jack to Jack': { status: 'OK', notes: 'Kontinuitas kabel instrumen Jack to Jack normal' }
    }
  }
];

// Laporan Harian Resmi dari Reference Daily Task Sheet (gid=198998470)
export const INITIAL_DAILY_REPORTS: DailyReport[] = [
  {
    id: 'rep-20260901-jay',
    date: '2026-09-01',
    staffName: 'Jay',
    division: 'Multimedia',
    activity: 'Belajar Aplikasi Gemini & Chat GPT',
    notes: '- Belajar Aplikasi Gemini\n- Belajar Aplikasi Chat GPT',
    status: 'Submitted',
    photos: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rep-20260903-mboh',
    date: '2026-09-03',
    staffName: 'Mboh',
    division: 'Audio',
    activity: 'Pengecekan Semua Unit Speker DBTtech15 SmaartLive & Pembersihan Debu',
    notes: '1* Pengecekan semua unit speker DBTtech15 dengan mengunakan smartlive berdasarkan tersebut.\n2* Membersihkan smua unit DBtech dari debu.\nREMARK:\n- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasuil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event.\n- Rekomendasi untuk di cek oleh team service terutama pada modul Amplifier.',
    status: 'Submitted',
    photos: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rep-20260903-yudis',
    date: '2026-09-03',
    staffName: 'Yudis',
    division: 'Audio',
    activity: 'Pengecekan Semua Unit Speker DBTtech15 SmaartLive & Pembersihan Debu',
    notes: '1* Pengecekan semua unit speker DBTtech15 dengan mengunakan smartlive.\n2* Membersihkan semua unit DBtech dari debu bersama Mboh & Buluk.',
    status: 'Submitted',
    photos: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rep-20260903-buluk',
    date: '2026-09-03',
    staffName: 'Buluk',
    division: 'Audio',
    activity: 'Pengecekan Semua Unit Speker DBTtech15 SmaartLive & Pembersihan Debu',
    notes: '1* Pengecekan semua unit speker DBTtech15 dengan mengunakan smartlive.\n2* Membersihkan smua unit DBtech dari debu bersama Mboh & Yudis.',
    status: 'Submitted',
    photos: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rep-20260903-butong',
    date: '2026-09-03',
    staffName: 'Butong',
    division: 'Audio',
    activity: 'Pengecekan Semua Unit Speker DBTtech15 SmaartLive & Pembersihan Debu',
    notes: '1* Pengecekan semua unit speker DBTtech15 dengan mengunakan smartlive berdasarkan tersebut.\n2* Membersihkan smua unit DBtech dari debu bersama Mboh, Yudis, Buluk.\nREMARK:\n- DB Tech No.18 Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasuil suara yang di keluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event.\n- Rekomendasi untuk di cek oleh team service terutama pada modul Amplifier.',
    status: 'Submitted',
    photos: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rep-20260904-opik',
    date: '2026-09-04',
    staffName: 'Opik',
    division: 'Audio',
    activity: 'Pengecekan Panel 3 Unit',
    notes: '- Pengecekan Panel 3 Unit\nREMARK:\n- 2 panel Sudah OK\n- 1 Ganti Stop Kontak, 1 Ganti Legran Cewe',
    status: 'Submitted',
    photos: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rep-20260904-buluk',
    date: '2026-09-04',
    staffName: 'Buluk',
    division: 'Audio',
    activity: 'Pengecekan Panel 3 Unit',
    notes: '- Pengecekan Panel 3 Unit bersama Opik\nREMARK:\n- 2 panel Sudah OK\n- 1 Ganti Stop Kontak, 1 Ganti Legran Cewe',
    status: 'Submitted',
    photos: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rep-20260905-opik',
    date: '2026-09-05',
    staffName: 'Opik',
    division: 'Audio',
    activity: 'Perbaikan Panel Listrik & Praktek Sub Cardioid dan End-Fire (Sub T45)',
    notes: '- Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire menggunakan Sub T45\nREMARK:\n- Panel listrik dalam kondisi aman dan bisa di gunakan',
    status: 'Submitted',
    photos: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rep-20260905-mboh',
    date: '2026-09-05',
    staffName: 'Mboh',
    division: 'Audio',
    activity: 'Perbaikan Panel Listrik & Praktek Sub Cardioid dan End-Fire (Sub T45)',
    notes: '- Perbaikan panel listrik dan praktek penggabungan metode sub cardioid dan End-Fire bersama Opik\nREMARK:\n- Panel listrik dalam kondisi aman dan siap event',
    status: 'Submitted',
    photos: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rep-20260905-kharo',
    date: '2026-09-05',
    staffName: 'Kharo',
    division: 'Videotron',
    activity: 'Repair Ganti Pixel Kabinet LED 2 Box',
    notes: '- Repair Ganti Pixel Kabinet LED 2 Box',
    status: 'Submitted',
    photos: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rep-20260906-kharo',
    date: '2026-09-06',
    staffName: 'Kharo',
    division: 'Videotron',
    activity: 'Repair Ganti Pixel Kabinet LED 2 Box',
    notes: '- Repair ganti pixel kabinet led 2 box',
    status: 'Draft',
    photos: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rep-20260906-dani',
    date: '2026-09-06',
    staffName: 'Dani',
    division: 'Audio',
    activity: 'Cek Cable XLR dan Jack to Jack',
    notes: 'Cek cable XLR dan Jack to Jack',
    status: 'Submitted',
    photos: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80'
    ]
  }
];

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
  }
];

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
  { id: 'fl-multi-chandra', name: 'CHANDRA', email: 'Chandrakakaaja@gmail.com', phone: '088225873364', specialization: 'Multimedia', roleTitle: 'CAMERA-PERSON', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
  { id: 'fl-multi-rizky', name: 'RIZKY NASRULLAH', email: 'rizkiuloh@gmail.com', phone: '085155188909', specialization: 'Multimedia', roleTitle: 'VIDEO DIRECTOR', dailyRate: 350000, status: 'Aktif', createdAt: '2026-09-01' },
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
