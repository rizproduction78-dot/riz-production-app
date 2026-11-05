/**
 * DATASET RESMI JADWAL PENUGASAN KERJA / JOB EVENT (STAFF & FREELANCE)
 * Sumber Acuan Mutlak: Google Docs Resmi PT. Riz Production Multi Kreasi
 * Document ID: 1Lwti9V2-5P4WwwkMPupR5stuXNc1Y02W
 * URL: https://docs.google.com/document/d/1Lwti9V2-5P4WwwkMPupR5stuXNc1Y02W/edit#heading=h.nf6ix777sh6z
 */

import { JobAssignment, JobCrewMember, JobDivisionSection } from '../types';

/**
 * Pemetaan nama panggilan kru di Google Docs ke ID Staff Inhouse resmi (22 personil)
 */
const STAFF_NICKNAME_MAP: Record<string, { id: string; canonicalName: string; division: string }> = {
  wahyu: { id: 'director-wahyu', canonicalName: 'Wahyu', division: 'Admin' },
  fahrul: { id: 'staff-fahrul', canonicalName: 'M. Fahrulyana . A (Fahrul)', division: 'Admin' },
  fahrulyana: { id: 'staff-fahrul', canonicalName: 'M. Fahrulyana . A (Fahrul)', division: 'Admin' },
  mfahrulyana: { id: 'staff-fahrul', canonicalName: 'M. Fahrulyana . A (Fahrul)', division: 'Admin' },
  mfahrulyanaa: { id: 'staff-fahrul', canonicalName: 'M. Fahrulyana . A (Fahrul)', division: 'Admin' },
  agus: { id: 'staff-agustino', canonicalName: 'Agustino Setiawan (Agus)', division: 'Admin' },
  agustino: { id: 'staff-agustino', canonicalName: 'Agustino Setiawan (Agus)', division: 'Admin' },
  agustinosetiawan: { id: 'staff-agustino', canonicalName: 'Agustino Setiawan (Agus)', division: 'Admin' },
  caca: { id: 'staff-syalsa', canonicalName: 'Syalsa Sri Hestariana (Caca)', division: 'Admin' },
  syalsa: { id: 'staff-syalsa', canonicalName: 'Syalsa Sri Hestariana (Caca)', division: 'Admin' },
  syalsasrihestariana: { id: 'staff-syalsa', canonicalName: 'Syalsa Sri Hestariana (Caca)', division: 'Admin' },
  seno: { id: 'staff-seno', canonicalName: 'Seno Subroto', division: 'Admin' },
  senosubroto: { id: 'staff-seno', canonicalName: 'Seno Subroto', division: 'Admin' },
  udin: { id: 'staff-udin', canonicalName: 'Udin Saepudin (Mang Ube)', division: 'Gudang' },
  udinsaepudin: { id: 'staff-udin', canonicalName: 'Udin Saepudin (Mang Ube)', division: 'Gudang' },
  ube: { id: 'staff-udin', canonicalName: 'Udin Saepudin (Mang Ube)', division: 'Gudang' },
  mangube: { id: 'staff-udin', canonicalName: 'Udin Saepudin (Mang Ube)', division: 'Gudang' },
  gatot: { id: 'staff-gatot', canonicalName: 'Gatot Wiliyanto', division: 'Gudang' },
  gatotwiliyanto: { id: 'staff-gatot', canonicalName: 'Gatot Wiliyanto', division: 'Gudang' },
  aep: { id: 'staff-absobur', canonicalName: 'Aep Saepudin (Subur)', division: 'Gudang' },
  aepsaepudin: { id: 'staff-absobur', canonicalName: 'Aep Saepudin (Subur)', division: 'Gudang' },
  aepsubur: { id: 'staff-absobur', canonicalName: 'Aep Saepudin (Subur)', division: 'Gudang' },
  subur: { id: 'staff-absobur', canonicalName: 'Aep Saepudin (Subur)', division: 'Gudang' },
  abahsubur: { id: 'staff-absobur', canonicalName: 'Aep Saepudin (Subur)', division: 'Gudang' },
  mboh: { id: 'staff-rahmat', canonicalName: 'Muhamad Rahmat (Mboh)', division: 'Audio' },
  rahmat: { id: 'staff-rahmat', canonicalName: 'Muhamad Rahmat (Mboh)', division: 'Audio' },
  muhamadrahmat: { id: 'staff-rahmat', canonicalName: 'Muhamad Rahmat (Mboh)', division: 'Audio' },
  unyink: { id: 'staff-unyin', canonicalName: 'Wahyudin (Unyim)', division: 'Audio' },
  unyim: { id: 'staff-unyin', canonicalName: 'Wahyudin (Unyim)', division: 'Audio' },
  unyin: { id: 'staff-unyin', canonicalName: 'Wahyudin (Unyim)', division: 'Audio' },
  wahyudin: { id: 'staff-unyin', canonicalName: 'Wahyudin (Unyim)', division: 'Audio' },
  dani: { id: 'staff-ramdani', canonicalName: 'Ramdani (Dani)', division: 'Audio' },
  ramdani: { id: 'staff-ramdani', canonicalName: 'Ramdani (Dani)', division: 'Audio' },
  butonk: { id: 'staff-iwan', canonicalName: 'Iwan Kurniawan (Butonk)', division: 'Audio' },
  butong: { id: 'staff-iwan', canonicalName: 'Iwan Kurniawan (Butonk)', division: 'Audio' },
  iwan: { id: 'staff-iwan', canonicalName: 'Iwan Kurniawan (Butonk)', division: 'Audio' },
  iwankurniawan: { id: 'staff-iwan', canonicalName: 'Iwan Kurniawan (Butonk)', division: 'Audio' },
  yudis: { id: 'staff-yudish', canonicalName: 'Yudishtira Purnama A (Yudis)', division: 'Audio' },
  yudish: { id: 'staff-yudish', canonicalName: 'Yudishtira Purnama A (Yudis)', division: 'Audio' },
  yudishtira: { id: 'staff-yudish', canonicalName: 'Yudishtira Purnama A (Yudis)', division: 'Audio' },
  yudishtirapurnamaa: { id: 'staff-yudish', canonicalName: 'Yudishtira Purnama A (Yudis)', division: 'Audio' },
  opik: { id: 'staff-taufik', canonicalName: 'Taufik Diana (Opik)', division: 'Audio' },
  opick: { id: 'staff-taufik', canonicalName: 'Taufik Diana (Opik)', division: 'Audio' },
  opik165: { id: 'staff-taufik', canonicalName: 'Taufik Diana (Opik)', division: 'Audio' },
  taufik: { id: 'staff-taufik', canonicalName: 'Taufik Diana (Opik)', division: 'Audio' },
  taufikdiana: { id: 'staff-taufik', canonicalName: 'Taufik Diana (Opik)', division: 'Audio' },
  bulux: { id: 'staff-suryana', canonicalName: 'Suryana (Buluk)', division: 'Audio' },
  buluk: { id: 'staff-suryana', canonicalName: 'Suryana (Buluk)', division: 'Audio' },
  nana: { id: 'staff-suryana', canonicalName: 'Suryana (Buluk)', division: 'Audio' },
  nanabuluk: { id: 'staff-suryana', canonicalName: 'Suryana (Buluk)', division: 'Audio' },
  suryana: { id: 'staff-suryana', canonicalName: 'Suryana (Buluk)', division: 'Audio' },
  heri: { id: 'staff-heri', canonicalName: 'Heri', division: 'Lighting' },
  herry: { id: 'staff-heri', canonicalName: 'Heri', division: 'Lighting' },
  jay: { id: 'staff-mulyadi', canonicalName: 'Mulyadi (Jay)', division: 'Multimedia' },
  mulyadi: { id: 'staff-mulyadi', canonicalName: 'Mulyadi (Jay)', division: 'Multimedia' },
  ayong: { id: 'staff-ayong', canonicalName: 'Ayong Sumarsih', division: 'Videotron' },
  ayongsumarsih: { id: 'staff-ayong', canonicalName: 'Ayong Sumarsih', division: 'Videotron' },
  wigi: { id: 'staff-dedi', canonicalName: 'Dedi Agus Wigiantoro (Wigi)', division: 'Videotron' },
  dedi: { id: 'staff-dedi', canonicalName: 'Dedi Agus Wigiantoro (Wigi)', division: 'Videotron' },
  dediaguswigiantoro: { id: 'staff-dedi', canonicalName: 'Dedi Agus Wigiantoro (Wigi)', division: 'Videotron' },
  irvan: { id: 'staff-irvan', canonicalName: 'Muhamad Irvan', division: 'Videotron' },
  irfan: { id: 'staff-irvan', canonicalName: 'Muhamad Irvan', division: 'Videotron' },
  muhamadirvan: { id: 'staff-irvan', canonicalName: 'Muhamad Irvan', division: 'Videotron' },
  kharo: { id: 'staff-mulyana', canonicalName: 'Mulyana (Kharo)', division: 'Videotron' },
  karo: { id: 'staff-mulyana', canonicalName: 'Mulyana (Kharo)', division: 'Videotron' },
  mulyana: { id: 'staff-mulyana', canonicalName: 'Mulyana (Kharo)', division: 'Videotron' },
  mulyanakharo: { id: 'staff-mulyana', canonicalName: 'Mulyana (Kharo)', division: 'Videotron' },
  damri: { id: 'staff-damri', canonicalName: 'Damri', division: 'Service' },
  mangdamri: { id: 'staff-damri', canonicalName: 'Damri', division: 'Service' },
};

/**
 * Pemetaan nama kru Freelance & Mitra di Google Docs
 */
const FREELANCE_NICKNAME_MAP: Record<string, { canonicalName: string; division: string }> = {
  adin: { canonicalName: 'ADIN ANDRIANSYAH (ADIN)', division: 'Audio' },
  aca: { canonicalName: 'MOCHAMAD FIRMANSYAH (ACA)', division: 'Audio' },
  enday: { canonicalName: 'ENDAY', division: 'Audio' },
  woyo: { canonicalName: 'WOYO', division: 'Audio' },
  dyar: { canonicalName: 'DYAR', division: 'Audio' },
  jordy: { canonicalName: 'JORDY', division: 'Audio' },
  isal: { canonicalName: 'FAISAL NUGRAHA ISKANDAR (ISAL)', division: 'Lighting' },
  timbul: { canonicalName: 'TIMBUL', division: 'Audio' },
  uloh: { canonicalName: 'ULOH', division: 'Multimedia' },
  ulloh: { canonicalName: 'ULOH', division: 'Multimedia' },
  bunda: { canonicalName: 'BUNDA', division: 'Videotron' },
  yopy: { canonicalName: 'YOPY', division: 'Videotron' },
  yopi: { canonicalName: 'YOPY', division: 'Videotron' },
  ambon: { canonicalName: 'AMBON', division: 'Videotron' },
  fiki: { canonicalName: 'FIKI', division: 'Videotron' },
  adi: { canonicalName: 'ADI', division: 'Videotron' },
  ipal: { canonicalName: 'IPAL', division: 'Videotron' },
  dian: { canonicalName: 'DIAN', division: 'Driver' },
  narso: { canonicalName: 'NARSO', division: 'Driver' },
  ndin: { canonicalName: 'ENDIN', division: 'Lighting' },
  endin: { canonicalName: 'ENDIN', division: 'Lighting' },
  inal: { canonicalName: 'INAL', division: 'Audio' },
  rebing: { canonicalName: 'REBING', division: 'Audio' },
  cionk: { canonicalName: 'CIONK', division: 'Audio' },
  ardi: { canonicalName: 'ARDI', division: 'Audio' },
  idrus: { canonicalName: 'IDRUS MAULANA', division: 'Lighting' },
  moa: { canonicalName: 'MOA', division: 'Multimedia' },
  richad: { canonicalName: 'RICHARD', division: 'Multimedia' },
  richard: { canonicalName: 'RICHARD', division: 'Multimedia' },
  chandra: { canonicalName: 'CHANDRA', division: 'Multimedia' },
  ugan: { canonicalName: 'UGAN', division: 'Lighting' },
  iman: { canonicalName: 'IMAN', division: 'Multimedia' },
  bule: { canonicalName: 'BULE', division: 'Multimedia' },
  ghele: { canonicalName: 'ENDANG (GHELE)', division: 'Lighting' },
  rizki: { canonicalName: 'RIZKI', division: 'Lighting' },
  otang: { canonicalName: 'OTANG', division: 'Lighting' },
  okis: { canonicalName: 'OKIS', division: 'Multimedia' },
  wildan: { canonicalName: 'WILDAN', division: 'Videotron' },
  ucup: { canonicalName: 'UCUP', division: 'Multimedia' },
  fera: { canonicalName: 'FERA', division: 'Multimedia' },
  hamid: { canonicalName: 'HAMID', division: 'Lighting' },
  kemal: { canonicalName: 'KEMAL', division: 'Multimedia' },
  dedy: { canonicalName: 'DEDY', division: 'Multimedia' },
  bacil: { canonicalName: 'BACIL', division: 'Multimedia' },
  rifki: { canonicalName: 'RIFKI', division: 'Lighting' },
  arul: { canonicalName: 'ARUL', division: 'Audio' },
  zuhri: { canonicalName: 'ZUHRI', division: 'Audio' },
  ariq: { canonicalName: 'ARIQ', division: 'Multimedia' },
  tofan: { canonicalName: 'TOFAN', division: 'Multimedia' },
  fajar: { canonicalName: 'FAJAR', division: 'Multimedia' },
  maul: { canonicalName: 'MAUL', division: 'Audio' },
  tile: { canonicalName: 'TILE', division: 'Multimedia' },
  rio: { canonicalName: 'RIO', division: 'Lighting' },
  cahyo: { canonicalName: 'CAHYO', division: 'Multimedia' },
  delon: { canonicalName: 'DELON', division: 'Audio' },
  kote: { canonicalName: 'KOTE', division: 'Lighting' },
  yosep: { canonicalName: 'YOSEP', division: 'Driver' },
};

export interface OfficialFreelanceOption {
  id: string;
  name: string;
  canonicalName: string;
  division: string;
}

export const OFFICIAL_FREELANCE_CREW_LIST: OfficialFreelanceOption[] = (() => {
  const seenCanon = new Set<string>();
  const list: OfficialFreelanceOption[] = [];
  for (const [key, val] of Object.entries(FREELANCE_NICKNAME_MAP)) {
    if (seenCanon.has(val.canonicalName)) continue;
    seenCanon.add(val.canonicalName);
    const display = key.charAt(0).toUpperCase() + key.slice(1);
    list.push({
      id: `fl-${key}`,
      name: display === 'Aca' ? 'ACA' : display,
      canonicalName: val.canonicalName,
      division: val.division,
    });
  }
  return list;
})();

/**
 * Helper mengubah daftar string nama kru menjadi objek JobCrewMember terstruktur
 */
export function resolveCrewMember(rawNameInput: string, defaultDivision = 'Umum', roleNote?: string): JobCrewMember {
  const cleanRaw = rawNameInput.trim();
  const parenMatch = cleanRaw.match(/^([^(]+)\(([^)]+)\)$/);
  const baseName = (parenMatch ? parenMatch[1] : cleanRaw).trim();
  const extractedNote = parenMatch ? parenMatch[2].trim() : roleNote;

  const key = baseName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const staffMatch = STAFF_NICKNAME_MAP[key];
  if (staffMatch) {
    return {
      name: baseName,
      canonicalName: staffMatch.canonicalName,
      personnelType: 'Staff',
      staffId: staffMatch.id,
      division: staffMatch.division,
      ...(extractedNote ? { roleNote: extractedNote } : {}),
    };
  }

  const freelanceMatch = FREELANCE_NICKNAME_MAP[key];
  if (freelanceMatch) {
    return {
      name: baseName,
      canonicalName: freelanceMatch.canonicalName,
      personnelType: 'Freelance',
      staffId: `fl-${key}`,
      division: freelanceMatch.division,
      ...(extractedNote ? { roleNote: extractedNote } : {}),
    };
  }

  return {
    name: baseName,
    canonicalName: baseName.toUpperCase(),
    personnelType: 'Freelance',
    staffId: `fl-${key}`,
    division: defaultDivision,
    ...(extractedNote ? { roleNote: extractedNote } : {}),
  };
}

export function buildCrewList(names: string[], division = 'Umum', roleNote?: string): JobCrewMember[] {
  return names
    .map(n => n.trim())
    .filter(Boolean)
    .map(n => resolveCrewMember(n, division, roleNote));
}

/**
 * Helper memetakan nama armada singkat di jadwal ke label armada resmi
 */
export function formatFleetVehicleBadge(rawVehicle: string): string {
  const v = rawVehicle.trim();
  const lower = v.toLowerCase();
  if (lower === 'truck' || lower === 'truk') return 'Truck Operasional';
  if (lower === 'engkel riz' || lower === 'engkel') return 'Truk Engkel PS 110 (F 8942 BG)';
  if (lower === 'riz 1' || lower === 'riz1') return 'Pick Up Carry 011 (F 8433 BF)';
  if (lower === 'riz 2' || lower === 'riz2') return 'Pick Up Carry 012 (F 8446 BF)';
  if (lower === 'riz') return 'Pick Up Carry RIZ (011/012/013/014)';
  if (lower === 'serena') return 'Mobil Kru / Serena (Luxio B 2673 TVI)';
  if (lower.startsWith('yosep')) return `${v} (Armada Mitra Yosep)`;
  if (lower.includes('woyo')) return `${v} (Armada Mitra Woyo)`;
  return v;
}

function createSection(
  division: JobDivisionSection['division'],
  packageLabel: string,
  equipment: string[],
  crewNames: string[],
  vehicles: string[],
  sectionPic?: string
): JobDivisionSection {
  return {
    division,
    packageLabel,
    equipment,
    crew: buildCrewList(crewNames, division),
    vehicles,
    ...(sectionPic ? { sectionPic } : {}),
  };
}

/**
 * DATASET KANONIKAL JADWAL PENUGASAN JOB NOVEMBER & DESEMBER 2026
 * Sesuai 100% dengan dokumen Google Docs 1Lwti9V2-5P4WwwkMPupR5stuXNc1Y02W
 */
export const INITIAL_JOB_ASSIGNMENTS: JobAssignment[] = [
  // ============================================================================
  // BULAN NOVEMBER 2026
  // ============================================================================
  {
    id: 'job-20261103-qbig-bsd',
    monthKey: '2026-11',
    date: '2026-11-03',
    dateLabel: '3 Nov 2026',
    venue: 'Qbig BSD',
    loadingSchedule: 'Packing Malam Jalan jam 06.00 Pagi',
    pic: 'Jay (Mulyadi)',
    status: 'Selesai',
    sections: [
      createSection(
        'Audio',
        'Sound 20rb',
        [
          'Avanda 210 8, Sub Kla 6, Drum Sub 8001 1, DB 8, Lvx 2, EWD 4, QA 4, Headset 2',
          'Side Fill 8001 + 6001 2set',
          'Digital Mixer Midas HERITAGE D + DL 251',
          'Digital Mixer Midas HERITAGE D + DL 251 (Sewa Flow)',
          'DI Box Set',
          'IEM Sennheiser G4 8 (Flow)',
          'Stand Set & Backline Set',
        ],
        ['Adin', 'Bulux', 'Dani', 'Opik', 'ACA', 'Enday', 'Woyo', 'Dyar'],
        ['Truck', 'Riz 2']
      ),
      createSection(
        'Audio',
        'Sound 5rb',
        ['6001 2, Sub Double 2, ART4, M32 + DL 32 1, WHM 4', 'Stand Set'],
        ['Jordy (Dateng Malam)', 'Isal', 'Timbul'],
        ['Yosep']
      ),
      createSection(
        'Videotron',
        'LED 48Meter (Victor)',
        ['LED Stage 8x4', 'LED Gate 4x2 (2 set)', 'Laptop MSI'],
        ['Ayong', 'Uloh'],
        ['Serena'],
        'Jay'
      ),
    ],
  },
  {
    id: 'job-20261104-parkir-timur-senayan',
    monthKey: '2026-11',
    date: '2026-11-04',
    dateLabel: '4 Nov 2026',
    venue: 'Parkir Timur Senayan (Main Stage)',
    loadingSchedule: 'Setup & Bongkaran Main Stage',
    pic: 'Ayong Sumarsih',
    status: 'Berlangsung (Show)',
    sections: [
      createSection(
        'Videotron',
        'LED Main Stage',
        ['Center 4,5x8 Dudukan', 'Wing 2,5x4 2Set Gantung (Yg ada gak Usah Dibongkar)'],
        [
          'Ayong',
          'Wigi',
          'Bunda',
          'Yopy',
          'Ambon',
          'Fiki',
          'Irvan (Pasang)',
          'Adi (Pasang)',
          'Ipal (Pasang)',
          'Woyo (Bongkaran)',
          'Dian (Driver Truck - Bongkaran)',
          'Narso (Bantu Bongkaran)',
        ],
        ['Engkel Riz', 'Truck']
      ),
    ],
  },
  {
    id: 'job-20261104-js-luwansa',
    monthKey: '2026-11',
    date: '2026-11-04',
    dateLabel: '4 Nov 2026',
    venue: 'JS Luwansa',
    loadingSchedule: 'Loading 3 Malam',
    pic: 'Heri',
    status: 'Berlangsung (Show)',
    sections: [
      createSection(
        'Audio',
        'Sound & Lighting + LED 4x6 (Victor)',
        [
          'LVX 2, 8003 2, Db 4 (2 Delay + Stand), M32R+DL, WHM 6, Gooseneck 1',
          'Stand Set',
          'Fresnel 4, Quartz',
          'LED 4x6 (Victor)',
        ],
        ['Heri', 'Isal'],
        ['Serena']
      ),
    ],
  },
  {
    id: 'job-20261104-tsi',
    monthKey: '2026-11',
    date: '2026-11-04',
    dateLabel: '4 Nov 2026',
    venue: 'TSI (Taman Safari Indonesia)',
    loadingSchedule: 'Loading tgl 3 Malam',
    pic: 'Jordy / Oce',
    status: 'Berlangsung (Show)',
    sections: [
      createSection(
        'Audio',
        'Sound System',
        ['6001 2, 8003 2, Db 6, M32+DL, WHM 6, Gooseneck', 'Stand Set'],
        ['Jordy', 'ACA', 'Timbul'],
        ['Yosep']
      ),
      createSection(
        'Lighting',
        'Lighting & Genset',
        ['Beam 2, Par 8, Fresnel 4, Smoke 1, Quartz', 'Genset 60KVA (Bogor Genset)'],
        ['Ndin', 'Dyar'],
        ['Yosep']
      ),
      createSection(
        'Produksi',
        'Produksi (Oce)',
        ['Totem Banner 1,2x2,44 2Pcs (Oce)'],
        [],
        []
      ),
    ],
  },
  {
    id: 'job-20261104-ancol',
    monthKey: '2026-11',
    date: '2026-11-04',
    endDate: '2026-11-05',
    dateLabel: '4-5 Nov 2026',
    venue: 'Ancol',
    loadingSchedule: 'Loading 3 Malam (Beres Parkir Timur Senayan)',
    pic: 'Unyim (Wahyudin)',
    status: 'Berlangsung (Show)',
    sections: [
      createSection(
        'Audio',
        'Sound 5rb',
        ['Avanda 2, Sub Kla 2, DB6, M32+DL, WHM 4, Gooseneck', 'Stand Set', 'Drum'],
        ['Unyink', 'Butonk', 'Inal', 'Yudis'],
        ['Riz 2']
      ),
    ],
  },
  {
    id: 'job-20261104-telkom',
    monthKey: '2026-11',
    date: '2026-11-04',
    dateLabel: '4 Nov 2026',
    venue: 'Telkom',
    loadingSchedule: 'Loading 4 Subuh',
    pic: 'Jay (Mulyadi)',
    status: 'Berlangsung (Show)',
    sections: [
      createSection(
        'Audio',
        'Sound System',
        ['Art 6, WHM 6, TF 1'],
        ['Yudis', 'Cionk'],
        ['Yosep']
      ),
      createSection(
        'Multimedia',
        'Stream + 2 Cam',
        ['PC + Acc', 'PXW 2 + Tripod', 'Switcher + Record', 'Laptop 3'],
        ['Uloh (VJ + Zoom)', 'Okis (VJ + Zoom)', 'Heri (VD)', 'Jay (Campers)', 'Chandra (Campers)', 'Richard (Campers)'],
        ['Serena']
      ),
    ],
  },
  {
    id: 'job-20261105-tribrata',
    monthKey: '2026-11',
    date: '2026-11-05',
    dateLabel: '5 Nov 2026',
    venue: 'Tribrata',
    loadingSchedule: 'Loading Sound 4 Sore jam 15.00',
    pic: 'Buluk (Suryana) & Irvan',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 5rb',
        ['6001, 8001, Art6, M32+DL, WHM 6, Gooseneck', 'Stand Set'],
        ['Bulux', 'Opik', 'Dyar', 'Gatot (Beres setup pulang ganti Dyar)'],
        ['Yosep']
      ),
      createSection(
        'Videotron',
        'LED 3x4 + Level 30Cm',
        ['LED 3x4 + Level 30Cm'],
        ['Irvan', 'Adi', 'Ipal'],
        ['Jay']
      ),
      createSection(
        'Produksi',
        'Produksi (Hafiz)',
        ['Mini Garden 10 Meter (Hafiz)'],
        [],
        []
      ),
    ],
  },
  {
    id: 'job-20261105-bsd',
    monthKey: '2026-11',
    date: '2026-11-05',
    dateLabel: '5 Nov 2026',
    venue: 'BSD',
    loadingSchedule: 'Loading 4 Malam',
    pic: 'Adin Andriansyah',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 5rb',
        ['6001 2, Sub Double 2, DB 6, M32 + DL 32 1, WHM 6', 'Stand Set', 'Drum Set'],
        ['Adin', 'Rebing', 'Cionk', 'Enday'],
        ['Yosep']
      ),
    ],
  },
  {
    id: 'job-20261105-thamrin-nine',
    monthKey: '2026-11',
    date: '2026-11-05',
    endDate: '2026-11-06',
    dateLabel: '5-6 Nov 2026',
    venue: 'Thamrin Nine',
    loadingSchedule: 'Loading Sound 4 Malam',
    pic: 'Mboh (Muhamad Rahmat) & Ayong',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 10rb',
        ['HDL 4, Sub Double 2, ART8, M32+DL, WHM 6, Gooseneck', 'Stand Set'],
        ['Mboh', 'Dani', 'Timbul', 'ACA', 'Ardi (Ngedrop - Dijemput Gatot)'],
        ['Yosep']
      ),
      createSection(
        'Produksi',
        'Produksi Tgl 5 (Oce)',
        ['Totem (60x60x300) cm 6 unit', 'Backdrop 2,44 x 5m'],
        [],
        []
      ),
      createSection(
        'Videotron',
        'Tgl 6 LED (12x4)',
        ['LED uk 12 x 4'],
        ['Ayong', 'Wigi', 'Bunda', 'Yopi', 'Woyo', 'Dian'],
        ['Engkel Riz', 'Engkel Woyo']
      ),
    ],
  },
  {
    id: 'job-20261106-episode-hotel',
    monthKey: '2026-11',
    date: '2026-11-06',
    dateLabel: '6 Nov 2026',
    venue: 'Episode Hotel',
    loadingSchedule: 'Loading 5 Malam',
    pic: 'Heri & Buluk (Suryana)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 3rb',
        ['8003 2, Db 8 (2 Delay + Stand), TF1, WHM 8, Gooseneck 1', 'Stand Set'],
        ['Bulux', 'Opick', 'Dyar'],
        ['Yosep']
      ),
      createSection(
        'Lighting',
        'Lighting',
        ['Par 8, Beam 4, Fresnel 4, Tiger'],
        ['Heri', 'Idrus', 'Isal'],
        ['Riz']
      ),
      createSection(
        'Videotron',
        'LED 6x3 Level 100Cm',
        ['LED 6x3 level 100Cm (Bawa 3box dari gudang, 7box ambil di Maxindo)', 'Matador 42" 1Pcs (Rae)'],
        ['Irfan', 'Ambon', 'Ipal'],
        ['Riz']
      ),
      createSection(
        'Produksi',
        'Produksi (Oce)',
        ['Photobooth 2,44x3,66', 'Backdrop 6x3'],
        [],
        []
      ),
    ],
  },
  {
    id: 'job-20261107-kemendikbud',
    monthKey: '2026-11',
    date: '2026-11-07',
    dateLabel: '7 Nov 2026',
    venue: 'Kemendikbud',
    loadingSchedule: 'Loading 15:00 di Lokasi',
    pic: 'Jay (Mulyadi)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Audio Streaming',
        ['AD 2, TF1, Clipon 4 unit, WHM 2'],
        ['Unyink'],
        ['Serena']
      ),
      createSection(
        'Multimedia',
        'Streaming & Green Screen (Camera 3)',
        ['Streaming Set', 'Green Screen', 'Camera 3 Unit'],
        ['Moa', 'Richad', 'Jay', 'Chandra'],
        ['Serena']
      ),
    ],
  },
  {
    id: 'job-20261108-bowo-sentul',
    monthKey: '2026-11',
    date: '2026-11-08',
    dateLabel: '8 Nov 2026',
    venue: 'Bowo Sentul',
    loadingSchedule: 'Loading 7 Siang Jam 14:00 di Lokasi',
    pic: 'Ayong & Jay (Mulyadi)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 20rb',
        [
          'Avanda 210 8, Sub Avanda 4, KLA 2, Drum Sub 8001 1, DB 8, EWD 4, QA 2, M32+DL251, M32+Splitter',
          'DI Box Set & Side Fill 8003+Lvx',
          'Stand Set',
          'Backline (Drum Yamaha Tour Custom, Drum PDP Concept Maple, Roland RD 700 NX)',
          'EAR 4 Unit (Jumeno)',
        ],
        ['Adin', 'Bulux', 'Dani', 'Opik', 'Cionk', 'Enday', 'Dyar', 'Woyo', 'Rebing'],
        ['Truck', 'Riz 1']
      ),
      createSection(
        'Videotron',
        'LED Center & Wing Gantung',
        ['LED Center 4x8 Gantung (Bawa Truss Tackle)', 'LED Wing 3x4 2Set Gantung (Bawa Truss Tackle)'],
        ['Ayong', 'Irvan', 'Ambon', 'Yopi', 'Fiki', 'Ugan'],
        ['Engkel Riz', 'Engkel Woyo']
      ),
      createSection(
        'Multimedia',
        'Multicam 3 Cam',
        ['PXW', 'SE1200'],
        ['Chandra', 'Jay', 'Richad', 'Iman', 'Bule'],
        ['Serena']
      ),
    ],
  },
  {
    id: 'job-20261108-karawang',
    monthKey: '2026-11',
    date: '2026-11-08',
    dateLabel: '8 Nov 2026',
    venue: 'Karawang',
    loadingSchedule: 'Loading 7 Malam (Sekalian bawa barang buat ke Danapala)',
    pic: 'Unyim (Wahyudin)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 5rb',
        ['HDL 2, Sub Kla 2, Art 6, M32 + DL 32 1, WHM 4', 'Stand Set', 'RD GX', 'Drum'],
        ['Unyink', 'Butonk', 'Inal', 'Timbul'],
        ['Yosep 2']
      ),
    ],
  },
  {
    id: 'job-20261108-mardi-waluya',
    monthKey: '2026-11',
    date: '2026-11-08',
    dateLabel: '8 Nov 2026',
    venue: 'Mardi Waluya',
    loadingSchedule: 'Loading 7 Pagi',
    pic: 'Mboh (Muhamad Rahmat)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 5rb',
        ['6001 2, Sub Double 2, DB 6, M32 + DL 32 1, WHM 8', 'Stand Set', 'Backline'],
        ['Mboh', 'ACA', 'Yudis', 'Isal', 'Heri'],
        ['Yosep', 'Jay']
      ),
    ],
  },
  {
    id: 'job-20261109-andara-jsi',
    monthKey: '2026-11',
    date: '2026-11-09',
    dateLabel: '9 Nov 2026',
    venue: 'Andara JSI (Ballroom & Kencana Room)',
    loadingSchedule: 'Loading 8 Malam Jam 22.00',
    pic: 'Mboh (Muhamad Rahmat)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 25rb Ballroom',
        [
          'Avanda 8, Sub KLA 4, Db10, LVX2, WHM EWD 4, QA4 (Booster), Midas HD',
          'M32+Splitter, 6001 + 8001, 6001 + 8002 Delay',
          'Backline Set (Limiter) & Backline Set Project Pop (Drum + RD Aja)',
          'Headset 1, EAR 6 (Jumeno), EAR Mipro + WHM buat MC (Mipro & G4)',
          'DI Set & Stand Set',
        ],
        ['Mboh', 'Adin', 'ACA', 'Opik', 'Dani', 'Bulux', 'Dyar', 'Woyo', 'Rebing'],
        ['Truck', 'Jay', 'Riz']
      ),
      createSection(
        'Lighting',
        'Lighting Ballroom',
        ['Parled 12, Beam 20, Fresnel 8, Stromy 20, Wall Washer 6, Mini Brute 4, Follow Spot, Hazer 2, GrandMA'],
        ['Ghele', 'Ugan', 'Idrus', 'Rizki', 'Otang'],
        ['Yosep 2']
      ),
      createSection(
        'Audio',
        'Sound 2rb (Kencana Room)',
        ['ART 2, TF1, WHM 2'],
        ['Yudis', 'Enday'],
        ['Riz']
      ),
    ],
  },
  {
    id: 'job-20261109-ui-depok',
    monthKey: '2026-11',
    date: '2026-11-09',
    dateLabel: '9 Nov 2026',
    venue: 'UI Depok',
    loadingSchedule: 'LED Loading 8 Subuh | Lighting Loading 8 Malam',
    pic: 'Wigi & Heri',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'LED 3x6',
        ['LED 3x6'],
        ['Wigi', 'Bunda', 'Ipal'],
        ['Yosep']
      ),
      createSection(
        'Lighting',
        'Lighting (Sekalian bawa barang buat ke Ancol)',
        ['Parled 2bar, Fresnel 4, Beam 2, Tiger'],
        ['Heri', 'Isal', 'Inal'],
        ['Jay']
      ),
    ],
  },
  {
    id: 'job-20261109-danapala',
    monthKey: '2026-11',
    date: '2026-11-09',
    dateLabel: '9 Nov 2026',
    venue: 'Danapala',
    loadingSchedule: 'Loading 9 Pagi',
    pic: 'Unyim (Wahyudin)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 10rb',
        ['HDL 4, Sub Double 2, Art 10, M32 + DL, WHM 6', 'Stand Set', 'Drum Set Yamaha'],
        ['Unyink', 'Butonk', 'Cionk', 'Timbul'],
        ['Riz', 'Yosep']
      ),
    ],
  },
  {
    id: 'job-20261109-mall-boxis',
    monthKey: '2026-11',
    date: '2026-11-09',
    endDate: '2026-11-10',
    dateLabel: '9-10 Nov 2026',
    venue: 'Mall Boxies',
    loadingSchedule: 'Loading 8 Malam',
    pic: 'Irvan',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'LED / Level 2x3',
        ['Level 2x3 Tinggi 1m'],
        ['Irvan', 'Fiki'],
        ['Yosep']
      ),
    ],
  },
  {
    id: 'job-20261110-spartan-putri-duyung',
    monthKey: '2026-11',
    date: '2026-11-10',
    dateLabel: '10 Nov 2026',
    venue: 'Spartan Putri Duyung Ancol',
    loadingSchedule: 'Loading 9 Malam jam 20.00 di Lokasi',
    pic: 'Ayong & Heri',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'LED 24 Meter',
        ['LED Center 3x5', 'Pilar 1,5x3 2set', 'Level 5 Meter Tinggi 40Cm'],
        ['Ayong', 'Wigi', 'Bunda', 'Ambon', 'Ipal', 'Yopy'],
        ['Engkel Riz', 'Yosep']
      ),
      createSection(
        'Lighting',
        'Lighting',
        ['Parled 12, Fresnel 4, Beam 6, Hazer, Smoke, Tiger'],
        ['Heri', 'Isal', 'Inal'],
        ['Jay']
      ),
    ],
  },
  {
    id: 'job-20261110-pesona-alam',
    monthKey: '2026-11',
    date: '2026-11-10',
    dateLabel: '10 Nov 2026',
    venue: 'Pesona Alam',
    loadingSchedule: 'Loading 9 Malam',
    pic: 'Dani (Ramdani)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 5rb',
        ['6001 2, Sub KLA 2, DB 6, M32 + DL 32, WHM 4, Gooseneck', 'Stand Set', 'Drum Yamaha', 'Clicker titip Jordy'],
        ['Jordy', 'Enday', 'Dani'],
        ['Riz']
      ),
      createSection(
        'Lighting',
        'Lighting & Genset',
        ['Par 2 bar, Beam 4, Fresnel 4, Smoke, Tiger', 'Genset (Bogor Genset)'],
        ['Ghele', 'Ugan', 'Ndin'],
        ['Yosep']
      ),
    ],
  },
  {
    id: 'job-20261111-kebun-raya-bogor',
    monthKey: '2026-11',
    date: '2026-11-11',
    dateLabel: '11 Nov 2026',
    venue: 'Kebun Raya Bogor',
    loadingSchedule: 'Loading 10 Siang Jam 14.00 di Lokasi',
    pic: 'Unyim (Wahyudin)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 10rb',
        ['Avanda 4, Sub Kla 2, Art 8, M32+DL, WHM 6, Gooseneck', 'Stand Set', 'Backline'],
        ['Unyink', 'Butonk', 'Opik', 'ACA', 'Gatot (Anter Jemput)'],
        ['Riz', 'Yosep']
      ),
    ],
  },
  {
    id: 'job-20261111-habitate-kuningan',
    monthKey: '2026-11',
    date: '2026-11-11',
    dateLabel: '11 Nov 2026',
    venue: 'Habitate Kuningan',
    loadingSchedule: 'Loading 10 Malam',
    pic: 'Heri',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 3rb',
        ['Lvx 2, 8003 2, Db 4, TF1, WHM 4, Gooseneck', 'Stand Set'],
        ['Ardi', 'Cionk'],
        ['Yosep']
      ),
      createSection(
        'Lighting',
        'Lighting & Produksi',
        ['Parled 2 bar, Beam 2, Fresnel 2', 'Kursi Futura Cover Hitam 50Pcs (Saepi Asa Multi)'],
        ['Heri', 'Isal'],
        ['Jay']
      ),
    ],
  },
  {
    id: 'job-20261111-tribrata',
    monthKey: '2026-11',
    date: '2026-11-11',
    dateLabel: '11 Nov 2026',
    venue: 'Tribrata',
    loadingSchedule: 'Loading 11 Dini Hari jam 00:00',
    pic: 'Buluk (Suryana) & Wigi',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 10rb',
        ['HDL 4, Sub KLA 2, DB 8, QA 6, M32+DL, Gooseneck', 'Stand Set'],
        ['Jordy', 'Bulux', 'Inal', 'Enday', 'Timbul'],
        ['Riz', 'Yosep']
      ),
      createSection(
        'Lighting',
        'Lighting',
        ['Beam 4, Par 2 bar, Fresnel 4, Hazer, Tiger Touch'],
        ['Ghele', 'Ugan', 'Ndin'],
        ['Yosep']
      ),
      createSection(
        'Videotron',
        'LED 3x6 + Level 1Meter',
        ['LED 3x6 + Level 1Meter', 'Mini Garden 10 Meter (Hafiz)'],
        ['Wigi', 'Ambon', 'Ipal'],
        ['Engkel Riz']
      ),
    ],
  },
  {
    id: 'job-20261112-pullman-ciawi',
    monthKey: '2026-11',
    date: '2026-11-12',
    dateLabel: '12 Nov 2026',
    venue: 'Pullman Ciawi',
    loadingSchedule: 'Loading sesuai jadwal venue',
    pic: 'Agus (Agustino Setiawan)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Multimedia',
        'TV Display',
        ['Standing TV + TV 50"'],
        ['Agus', 'Uloh'],
        ['Serena']
      ),
    ],
  },
  {
    id: 'job-20261112-tmii',
    monthKey: '2026-11',
    date: '2026-11-12',
    dateLabel: '12 Nov 2026',
    venue: 'TMII (Taman Mini Indonesia Indah)',
    loadingSchedule: 'Loading 11 Jam 15:00 di Lokasi',
    pic: 'Ayong Sumarsih',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'LED 4x16',
        ['LED 4x16'],
        ['Ayong', 'Adi', 'Ambon', 'Bunda', 'Yopy', 'Woyo', 'Irvan (Drop)', 'Fiki (Drop)'],
        ['Engkel Riz', 'Engkel Woyo', 'Yosep']
      ),
    ],
  },
  {
    id: 'job-20261112-kelapa-gading',
    monthKey: '2026-11',
    date: '2026-11-12',
    endDate: '2026-11-13',
    dateLabel: '12-13 Nov 2026',
    venue: 'Kelapa Gading',
    loadingSchedule: 'Loading 11 Malam',
    pic: 'Irvan',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'LED 3x6 Outdoor (Victor)',
        ['LED 3x6 Outdoor (Victor)', 'Level + Gawangan (Farid)'],
        ['Irvan (VJ)', 'Fiki (VJ)'],
        ['Yosep']
      ),
    ],
  },
  {
    id: 'job-20261112-bara-royal-tulip',
    monthKey: '2026-11',
    date: '2026-11-12',
    endDate: '2026-11-13',
    dateLabel: '12-13 Nov 2026',
    venue: 'Bara Royal Tulip',
    loadingSchedule: 'Loading 11 Malam',
    pic: 'Mboh (Muhamad Rahmat)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 3rb',
        ['Lvx 2, 8003 2, Art 4 (2 Delay), M32+DL, WHM 8, Gooseneck', 'Stand Set OT'],
        ['Mboh', 'Yudis'],
        ['Jay']
      ),
      createSection(
        'Lighting',
        'Lighting & Genset',
        ['Fresnel 4, Quartz', 'Genset 60 KVA (Yadi)'],
        ['Isal'],
        ['Jay']
      ),
    ],
  },
  {
    id: 'job-20261113-gor-tanjung-duren',
    monthKey: '2026-11',
    date: '2026-11-13',
    dateLabel: '13 Nov 2026',
    venue: 'GOR Tanjung Duren',
    loadingSchedule: 'Loading 12 Malam',
    pic: 'Agus (Agustino Setiawan)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 10rb',
        ['6001 4, Sub Avanda 2, DB 8, QA 6, M32+DL, Gooseneck', 'Stand Set'],
        ['Unyink', 'Dani', 'Enday', 'Inal', 'Dyar', 'Agus'],
        ['Riz 2']
      ),
      createSection(
        'Produksi',
        'Produksi (Yadi, RAE, Saepi Asa Multi)',
        [
          'Genset 60 KVA 2Unit & AC 5PK 4Unit (Yadi)',
          'Projector 8000AL + Screen 3x4 2Unit & Laptop 2 (RAE)',
          'Sofa Hitam 10Pcs, Coffee Table 5Pcs, Kursi Futura + Cover Hitam 50Pcs, Long Table IBM 6Pcs, Sofa Scandiv 3Pcs (Saepi Asa Multi)',
        ],
        ['Agus'],
        []
      ),
    ],
  },
  {
    id: 'job-20261114-margo-city-depok',
    monthKey: '2026-11',
    date: '2026-11-14',
    dateLabel: '14 Nov 2026',
    venue: 'Margo City Depok',
    loadingSchedule: 'Loading 13 Malam jam 18.00',
    pic: 'Unyim (Wahyudin)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 5rb',
        ['6001 2, 8003 2, DB2, DB7+Stand Delay, M32 + DL 32, WHM 6, Gooseneck', 'Stand Set'],
        ['Unyink', 'Inal', 'Butonk'],
        ['Riz']
      ),
    ],
  },
  {
    id: 'job-20261114-bri-briliant',
    monthKey: '2026-11',
    date: '2026-11-14',
    dateLabel: '14 Nov 2026',
    venue: 'BRI Briliant',
    loadingSchedule: 'Loading 13 Jalan jam 15:00',
    pic: 'Jay (Mulyadi)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Multimedia',
        'Audio & Streaming Set',
        [
          'Flat AD, Art 2, QA 2, Headset 4, TF1, Gooseneck',
          'PC Intel + Acc, Switcher + Recorder, Eartec 4, Laptop 4',
        ],
        ['Heri', 'Uloh', 'Okis', 'Jay', 'Chandra', 'Richard', 'Ardi'],
        ['APV']
      ),
    ],
  },
  {
    id: 'job-20261114-ritz-carlton',
    monthKey: '2026-11',
    date: '2026-11-14',
    dateLabel: '14 Nov 2026',
    venue: 'Ritz Carlton',
    loadingSchedule: 'Loading 13 Malam Jam 21:00 di Lokasi',
    pic: 'Ayong Sumarsih',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'LED 3x10',
        ['LED 3x10'],
        ['Ayong', 'Irfan', 'Bunda', 'Ambon', 'Woyo', 'Wildan'],
        ['Engkel Riz', 'Yosep']
      ),
    ],
  },
  {
    id: 'job-20261114-sukabumi',
    monthKey: '2026-11',
    date: '2026-11-14',
    dateLabel: '14 Nov 2026',
    venue: 'Sukabumi',
    loadingSchedule: 'Loading 13 Malam',
    pic: 'Heri',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Lighting',
        'Lighting & TV Display',
        ['Fresnel 4, Quartz', 'TV 50" 2 Unit, TV 65" 1 Unit (Standing)'],
        ['Ghele', 'Ugan', 'Heri'],
        ['Serena']
      ),
    ],
  },
  {
    id: 'job-20261115-ojk-sumitro',
    monthKey: '2026-11',
    date: '2026-11-15',
    dateLabel: '15 Nov 2026',
    venue: 'OJK Sumitro',
    loadingSchedule: 'Loading 14 Malam',
    pic: 'Dani (Ramdani) & Heri',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 5rb',
        [
          '6001 2, 8003 2, DB 6, M32 + DL 32, WHM 4, Gooseneck',
          'Backline Set (Pake Drum Electric) - Bawain Gitar - Condenser 3',
          'Stand Set',
        ],
        ['Jordy', 'Enday', 'Dani', 'ACA', 'Dyar'],
        ['Riz', 'Jay']
      ),
      createSection(
        'Multimedia',
        'Streaming 3 Cam',
        ['PC Ryzen + Acc', 'Laptop 3', 'Cam PXW 3', 'Switcher + Recorder'],
        ['Heri (VJ & Zoom)', 'Richard (VJ & Zoom)', 'Chandra (Switcher)', 'Ucup (Campers)', 'Fera (Campers)'],
        ['APV']
      ),
      createSection(
        'Lighting',
        'Lighting (Sekalian bawa keperluan GOR Otista)',
        ['Parled 2 bar, Beam 2, Fresnel 2, Smoke 1, Tiger', 'Genset 60KVA (Yadi)'],
        ['Ndin', 'Hamid'],
        ['Yosep']
      ),
    ],
  },
  {
    id: 'job-20261115-bogor-icon',
    monthKey: '2026-11',
    date: '2026-11-15',
    dateLabel: '15 Nov 2026',
    venue: 'Bogor Icon',
    loadingSchedule: 'Loading 14 Malam',
    pic: 'Jay (Mulyadi) & Heri',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Multimedia',
        'Streaming',
        [
          'PC Intel + Acc, Laptop 3, Cam NX 2, PXW 1',
          'Switcher, TV Matador 50" 2 Unit, Godox 4, Eartec 3 pcs (Buat Ricky)',
        ],
        ['Uloh (VJ & Zoom)', 'Kemal (VJ & Zoom)', 'Okis (Switcher)', 'Jay (Cam)', 'Bule (Cam)'],
        ['Serena']
      ),
      createSection(
        'Lighting',
        'Lighting',
        ['Parled 2 bar, Beam 2, Fresnel 2, Smoke 1, Quartz'],
        ['Heri', 'Isal'],
        ['Yosep']
      ),
    ],
  },
  {
    id: 'job-20261115-pullman',
    monthKey: '2026-11',
    date: '2026-11-15',
    dateLabel: '15 Nov 2026',
    venue: 'Pullman',
    loadingSchedule: 'Loading 14 Malam',
    pic: 'Wigi (Dedi Agus Wigiantoro)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'LED 4x2 Level 1m',
        ['LED 4x2 Level 1m'],
        ['Wigi', 'Ipal', 'Ambon'],
        ['Riz']
      ),
    ],
  },
  {
    id: 'job-20261116-gor-otista-ljk',
    monthKey: '2026-11',
    date: '2026-11-16',
    dateLabel: '16 Nov 2026',
    venue: 'GOR Otista LJK',
    loadingSchedule: 'Loading 15 Malam',
    pic: 'Heri',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 5rb',
        ['6001 2, 8003 2, Db6, M32 + DL 32, WHM 4, Gooseneck, Condenser 2 Pcs', 'Stand Set'],
        ['Jordy', 'Enday', 'ACA'],
        ['Riz']
      ),
      createSection(
        'Lighting',
        'Lighting',
        ['Par 2 bar, Beam 6, Fresnel 4, Followspot 2, Smoke 2, Tiger'],
        ['Ndin', 'Hamid', 'Idrus'],
        ['Yosep']
      ),
      createSection(
        'Multimedia',
        'Streaming Set Basket',
        ['Streaming Set Basket', 'Laptop 2'],
        ['Heri', 'Ulloh', 'Iman', 'Okis', 'Dedy', 'Bacil'],
        ['Serena', 'APV']
      ),
    ],
  },
  {
    id: 'job-20261116-andara-jsi',
    monthKey: '2026-11',
    date: '2026-11-16',
    dateLabel: '16 Nov 2026',
    venue: 'Andara JSI Ballroom',
    loadingSchedule: 'Loading 15 Siang jam 14.00',
    pic: 'Fahrul (M. Fahrulyana . A)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 20rb Ballroom',
        [
          'Avanda 8, Sub Avanda 4, DB 10, LVX2, WHM EWD 4, QA4 (Booster), Midas HD+DL251, M32+Splitter',
          '6001 + 8002 Sidefill',
          'Backline Set (2nd Born) Drum Tour Custom & Backline Set (Limiter Flow, Drum PDP)',
          'EAR 2 (Jumeno), EAR Mipro + WHM buat MC, DI Set, Stand Set',
        ],
        ['Mboh', 'Adin', 'Opik', 'Bulux', 'Timbul', 'Woyo', 'Dani', 'Dyar', 'Yudis (Bantu Setup)', 'Cionk (Bantu Setup)'],
        ['Truck', 'Yosep', 'Jay']
      ),
      createSection(
        'Lighting',
        'Lighting Ballroom',
        ['Par 4 Bar, Fresnel 4, Beam 18, Wallwasher 8, Stromy 12, Hazer 2, Minibrute 4, Follow Spot, GrandMA', 'TV 50" + Stand (Fahrul)'],
        ['Ghele', 'Heri', 'Ugan', 'Rifki'],
        ['Yosep'],
        'Fahrul'
      ),
    ],
  },
  {
    id: 'job-20261116-bgr',
    monthKey: '2026-11',
    date: '2026-11-16',
    dateLabel: '16 Nov 2026',
    venue: 'BGR',
    loadingSchedule: 'Loading 15 Malam',
    pic: 'Agus (Agustino Setiawan)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 10rb',
        ['Avanda 4, Sub KLA 2, ART 8, QA 6, M32+DL, Gooseneck', 'Stand Setting', 'Backline Set RIZ'],
        ['Unyink', 'Butonk', 'Inal', 'Isal', 'Arul'],
        ['Riz', 'Yosep']
      ),
      createSection(
        'Produksi',
        'Rigging 6x6',
        ['Rigging 6x6'],
        ['Agus'],
        [],
        'Agus'
      ),
    ],
  },
  {
    id: 'job-20261116-padepokan-volly-sentul',
    monthKey: '2026-11',
    date: '2026-11-16',
    dateLabel: '16 Nov 2026',
    venue: 'Padepokan Volly Sentul',
    loadingSchedule: 'Loading 16 Pagi jam 06.00',
    pic: 'Yudis (Yudishtira Purnama A)',
    notes: 'Wajib Pake Kemeja RIZ. Beres acara bantu JSI.',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 3rb',
        ['ART 15 2, 8003 2, ART12 4, TF1, WHM 4, Gooseneck', 'Stand Set OT'],
        ['Yudis', 'Cionk'],
        ['Jay']
      ),
    ],
  },
  {
    id: 'job-20261117-intercon-pim',
    monthKey: '2026-11',
    date: '2026-11-17',
    dateLabel: '17 Nov 2026',
    venue: 'InterContinental PIM',
    loadingSchedule: 'Loading 16 Jam 19.00 (Packing jam 15.00)',
    pic: 'Ayong Sumarsih',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'LED 4x10 Indoor',
        ['LED 4x10 Indoor'],
        ['Ayong', 'Irfan', 'Ambon', 'Adi', 'Ipal', 'Fiki'],
        ['Engkel Woyo', 'Yosep']
      ),
    ],
  },
  {
    id: 'job-20261117-tsi',
    monthKey: '2026-11',
    date: '2026-11-17',
    dateLabel: '17 Nov 2026',
    venue: 'TSI (Taman Safari Indonesia)',
    loadingSchedule: 'Loading 16 Sore',
    pic: 'Jay (Mulyadi) & Heri',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 10rb',
        ['Avanda 4, Sub Avanda 2, ART 8, QA 6, M32+DL, Gooseneck', 'Stand Set', 'Backline Set RIZ'],
        ['Unyink', 'Butonk', 'Inal', 'Isal', 'Arul'],
        ['Riz', 'Yosep']
      ),
      createSection(
        'Lighting',
        'Lighting',
        ['Beam 2, Par 8, Fresnel 4, Smoke, Tiger'],
        ['Ghele', 'Ugan', 'Heri'],
        ['Yosep']
      ),
      createSection(
        'Videotron',
        'LED 3x6 Level Tinggi 1M',
        ['LED 3x6 Level Tinggi 1M'],
        ['Wigi', 'Bunda', 'Yopi'],
        ['Engkel Riz']
      ),
      createSection(
        'Multimedia',
        'Multicam',
        ['PXW 2 + Tripod', 'Switcher + Recorder'],
        ['Heri', 'Jay', 'Okis', 'Bacil'],
        ['Serena']
      ),
    ],
  },
  {
    id: 'job-20261118-patra-jasa',
    monthKey: '2026-11',
    date: '2026-11-18',
    dateLabel: '18 Nov 2026',
    venue: 'Patra Jasa',
    loadingSchedule: 'Loading 17 Malam jam 20.00',
    pic: 'Fahrul (M. Fahrulyana . A)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 15rb',
        [
          'Avanda 6, Sub Avanda 4, DB 8, LVX 2, EWD 4, QA 4, HD + DL 251, Gooseneck, Midas M32+Splitter',
          'Stand Set & Backline Set Drum Tour Custom',
          'Yamaha Montage 8 (BBA) & Yamaha Montage 7 (BBA)',
          'IEM 10 (Jumeno), Senn AC3 Antenna Combiner 2, DI Box 12',
          'Stand Keyboard Double 4, Stand Keyboard Single 3, Stand Book 5',
        ],
        ['Mboh', 'Adin', 'Buluk', 'Dani', 'Opik', 'Cionk (Ambil barang BBA)', 'Timbul (Ambil barang BBA)', 'Woyo'],
        ['Truck', 'Yosep', 'Riz']
      ),
      createSection(
        'Lighting',
        'Lighting',
        ['Parled 16, Beam 12, Fresnel 8, Stromy 8, Hazer 2, Follow Spot, Brute 2, GrandMA'],
        ['Ghele', 'Ugan', 'Heri', 'Rizki'],
        ['Yosep']
      ),
      createSection(
        'Videotron',
        'LED Total 44 Meter',
        ['LED Center 4x8', 'LED Wing 1,5x4 2Set (Bawain Pemberat Banyakan)'],
        ['Ayong', 'Irfan', 'Ambon', 'Adi', 'Ipal', 'Fiki', 'Wigi', 'Yopi'],
        ['Engkel Woyo', 'Yosep', 'Engkel Riz']
      ),
      createSection(
        'Produksi',
        'Produksi (Ronald)',
        ['Gawangan Lighting 5,5x10 Meter', 'Level LED tinggi 1 Meter', 'Gawangan LED 6x3,4'],
        ['Fahrul'],
        ['Serena'],
        'Fahrul'
      ),
    ],
  },
  {
    id: 'job-20261119-japfa-gadog',
    monthKey: '2026-11',
    date: '2026-11-19',
    endDate: '2026-11-20',
    dateLabel: '19-20 Nov 2026',
    venue: 'Japfa Gadog',
    loadingSchedule: 'Sound Loading 18 Siang jam 11.00 | LED Loading Sore jam 16.00',
    pic: 'Unyim (Wahyudin) & Wigi',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 5rb',
        ['6001 2, 8002 2, Art6, WHM 6, Clipon 2, M32+DL, Gooseneck', 'Stand Set'],
        ['Unyink', 'Butonk', 'Inal'],
        ['Yosep']
      ),
      createSection(
        'Videotron',
        'LED 3x4 + Level Tinggi 1 Meter 2Set',
        ['LED 3x4 + Level Tinggi 1 Meter 2Set'],
        ['Wigi', 'Yopi', 'Ipal (Drop)', 'Fiki (Drop)', 'Woyo (Jemput Bongkaran)'],
        ['Engkel Riz', 'Yosep']
      ),
    ],
  },
  {
    id: 'job-20261119-aston-sentul',
    monthKey: '2026-11',
    date: '2026-11-19',
    dateLabel: '19 Nov 2026',
    venue: 'Aston Sentul',
    loadingSchedule: 'Loading 18 Malam',
    pic: 'Jay (Mulyadi)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 3rb',
        ['Lvx 2, 8003 2, Art 4 (2 Delay), M32R+DL, WHM 8, Gooseneck', 'Stand Set'],
        ['Ardi', 'Zuhri'],
        ['Jay']
      ),
      createSection(
        'Multimedia',
        'Streaming 3 Cam',
        ['PC Intel + Acc, Laptop 3, Cam PXW 3, Switcher', 'TV Matador 50" 2 Unit, Godox 4'],
        ['Heri (VJ & Zoom)', 'Okis (VJ & Zoom)', 'Ulloh (Switcher)', 'Jay (Cam)', 'Chandra (Cam)', 'Richad (Cam)'],
        ['APV'],
        'Jay'
      ),
    ],
  },
  {
    id: 'job-20261119-aston-radio-dalem',
    monthKey: '2026-11',
    date: '2026-11-19',
    dateLabel: '19 Nov 2026',
    venue: 'Aston Radio Dalem',
    loadingSchedule: 'Loading 18 Malam Jam 21:00 di Lokasi',
    pic: 'Yudis & Irvan',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 3rb',
        ['K-Array, Db 4, WHM 6, TF1, Gooseneck', 'Stand Set'],
        ['Yudis', 'Arul'],
        ['Yosep']
      ),
      createSection(
        'Videotron',
        'LED 5x2,5 + Level 1M',
        ['LED 5x2,5', 'Level 1M', 'TV 65" x 2 (Rae)'],
        ['Irvan', 'Adi', 'Ipal'],
        ['Yosep']
      ),
      createSection(
        'Lighting',
        'Lighting & Genset',
        ['Par 2 Bar, Beam 4, Fresnel 4, Smoke, Wing', 'Genset 40KVA (Bogor Genset)', 'Mini Garden 6m (Hafiz)'],
        ['Ghele', 'Ugan', 'Rifki'],
        ['Yosep']
      ),
    ],
  },
  {
    id: 'job-20261120-mambruk-anyer',
    monthKey: '2026-11',
    date: '2026-11-20',
    dateLabel: '20 Nov 2026',
    venue: 'Mambruk Anyer',
    loadingSchedule: 'Loading 19 Pagi',
    pic: 'Fahrul (M. Fahrulyana . A)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 15rb',
        [
          'HDL 4, Sub KLA 2, DB 12, Mipro 4, QA 4, M32+DL, M32+Splitter, Gooseneck',
          'Backline 2 Set, Stand Set, IEM 5 Unit (Jumeno)',
        ],
        ['Mboh', 'Jordy', 'ACA', 'Cionk', 'Enday', 'Dyar', 'Wildan'],
        ['Engkel Riz', 'Riz 2']
      ),
      createSection(
        'Lighting',
        'Lighting',
        ['Parled 12, Beam 8, Fresnel 4, Smoke 1, Stromy 12, Hazer 1, Tiger'],
        ['Endin', 'Idrus', 'Timbul'],
        ['Yosep']
      ),
      createSection(
        'Produksi',
        'Produksi',
        ['Koordinasi Produksi & Backline Anyer'],
        ['Fahrul'],
        ['Serena'],
        'Fahrul'
      ),
    ],
  },
  {
    id: 'job-20261120-kemenkes-hang-jebat',
    monthKey: '2026-11',
    date: '2026-11-20',
    dateLabel: '20 Nov 2026',
    venue: 'Kemenkes Hang Jebat',
    loadingSchedule: 'LED Loading 19 Malam Jam 21:00 | Multicam Loading Subuh jam 05.00',
    pic: 'Jay (Mulyadi) & Ayong',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Multimedia',
        'Multicam',
        ['PXW 1, NX 2 + Tripod', 'Switcher + Recorder', 'Wireless'],
        ['Uloh', 'Iman', 'Jay', 'Ariq'],
        ['Serena']
      ),
      createSection(
        'Videotron',
        'LED 2x3 Meter (Portrait)',
        ['LED 2x3 Meter (Portrait) + Level Tinggi 1 Meter'],
        ['Ayong', 'Ambon', 'Fiki'],
        ['Jay']
      ),
    ],
  },
  {
    id: 'job-20261120-sedayu-indo-golf',
    monthKey: '2026-11',
    date: '2026-11-20',
    dateLabel: '20 Nov 2026',
    venue: 'Sedayu Indo Golf',
    loadingSchedule: 'Loading 19 Malam',
    pic: 'Irvan',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'LED 2x5 + Level 80cm',
        ['LED 2x5 + Level 80cm'],
        ['Irvan', 'Adi', 'Ipal'],
        ['Yosep']
      ),
    ],
  },
  {
    id: 'job-20261120-raffles',
    monthKey: '2026-11',
    date: '2026-11-20',
    endDate: '2026-11-21',
    dateLabel: '20-21 Nov 2026',
    venue: 'Raffles Hotel',
    loadingSchedule: 'Loading 19 Malam',
    pic: 'Heri',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Multimedia',
        'Multicam & YouTube Stream',
        ['PXW 3 + Tripod (1 Sewa)', 'Switcher + Record', 'Day 2 Ada YouTube 2 Laptop'],
        ['Heri', 'Chandra', 'Okis', 'Bule'],
        ['APV']
      ),
    ],
  },
  {
    id: 'job-20261121-prasasti-westin',
    monthKey: '2026-11',
    date: '2026-11-21',
    dateLabel: '21 Nov 2026',
    venue: 'Prasasti Westin',
    loadingSchedule: 'Loading 20 Malam',
    pic: 'Agus (Agustino Setiawan)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 10rb',
        ['Avanda 4, Sub KLA 2, DB 8, WHM 6, M32 + DL, Gooseneck'],
        ['Unyink', 'Butonk', 'Dani', 'Opik', 'Woyo'],
        ['Yosep 2']
      ),
      createSection(
        'Lighting',
        'Lighting',
        ['Par 12 Bar, Beam 12, Fresnel 6, Hazer 1, Followspot, Minibrute 2, Stromy 8, Wall Washer 4, GrandMA'],
        ['Ghele', 'Ugan', 'Heri', 'Rizki'],
        ['Yosep']
      ),
      createSection(
        'Multimedia',
        'Multicam',
        ['PXW 2, NX 2 + Tripod (PXW 1 Sewa)', 'Switcher + Recorder', 'Wireless'],
        ['Uloh', 'Iman', 'Jay', 'Ariq'],
        ['Serena']
      ),
      createSection(
        'Videotron',
        'LED 4x8',
        ['LED 4x8 (12 Meter dari Team Hang Jebat, Sisa 20 dibawa dari gudang)'],
        ['Ayong', 'Ambon', 'Bunda', 'Yopy', 'Fiki'],
        ['Engkel Woyo', 'Jay']
      ),
      createSection(
        'Produksi',
        'Produksi & Genset',
        ['Genset 60KVA 2 Unit (Yadi)', 'Backdrop (Edi)', 'Rigging (Ronald)'],
        ['Agus'],
        [],
        'Agus'
      ),
    ],
  },
  {
    id: 'job-20261121-kemendikbud',
    monthKey: '2026-11',
    date: '2026-11-21',
    dateLabel: '21 Nov 2026',
    venue: 'Kemendikbud',
    loadingSchedule: 'Loading 20 Sore (Sekalian bawa barang buat MRP)',
    pic: 'Yudis (Yudishtira Purnama A)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Multimedia',
        'Audio & Green Screen Stream',
        ['AD 2, TF1, Clipon 4 unit, WHM 2', 'Greenscreen (Riz)', 'TV Matador (Riz)', 'Stream Moa'],
        ['Ardi', 'Yudis'],
        ['Yosep']
      ),
    ],
  },
  {
    id: 'job-20261122-british-school',
    monthKey: '2026-11',
    date: '2026-11-22',
    endDate: '2026-11-28',
    dateLabel: '22-28 Nov 2026',
    venue: 'British School',
    loadingSchedule: 'Loading 21 Siang (Bawa motor buat bolak-balik selama disana)',
    pic: 'Wigi & Irvan',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'LED 3,5x7 (26M)',
        ['LED 3,5x7 (26M)'],
        ['Wigi', 'Irvan', 'Adi (Drop)', 'Ipal (Drop)'],
        ['Engkel Riz']
      ),
    ],
  },
  {
    id: 'job-20261122-mrp-wismul',
    monthKey: '2026-11',
    date: '2026-11-22',
    dateLabel: '22 Nov 2026',
    venue: 'MRP & Wismul (Set 1 MRP & Set 2 Wismul)',
    loadingSchedule: 'Loading 21 Malam',
    pic: 'Jay (Mulyadi) & Heri',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Set 1 MRP — Sound 3rb',
        ['K-Array, Db 4, WHM 6, M32, Gooseneck', 'Stand Set'],
        ['Yudis', 'Cionk'],
        ['Yosep']
      ),
      createSection(
        'Multimedia',
        'Set 1 MRP — Stream + 4 Cam',
        ['PC + Acc', 'PXW 4 + Tripod', 'Switcher + Record', 'Laptop 3'],
        ['Uloh', 'Ariq', 'Tofan', 'Iman', 'Jay'],
        ['Richard']
      ),
      createSection(
        'Lighting',
        'Set 1 MRP — Lighting',
        ['Par 2 Bar, Fresnel 4, Quartz'],
        ['Heri', 'Isal'],
        ['Riz']
      ),
      createSection(
        'Multimedia',
        'Set 2 Wismul — Stream + 2 Cam Wireless',
        ['PC Ryzen + Acc', 'NX 2 + Tripod', 'Wireless', 'Laptop 2'],
        ['Heri', 'Chandra', 'Okis', 'Fajar'],
        ['APV']
      ),
      createSection(
        'Audio',
        'Set 2 Wismul — Sound 1rb',
        ['Art 2, Clipon 2, WHM 2, TF', 'Stand Set'],
        ['Ardi'],
        ['Serena']
      ),
    ],
  },
  {
    id: 'job-20261123-tanah-baru-asogiri',
    monthKey: '2026-11',
    date: '2026-11-23',
    dateLabel: '23 Nov 2026',
    venue: 'Tanah Baru Lapangan Asogiri',
    loadingSchedule: 'Loading 22 Siang jam 09.00',
    pic: 'Mboh (Muhamad Rahmat) & Ayong',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 20rb',
        [
          'Avanda 8, Sub Avanda 6, ART10, LVX 2, Mipro 4, QA 4, M32+DL, M32+Splitter, Gooseneck, Headset 2',
          'Backline (Drum 2, RD 1) Stage Custom + Pearl',
          'Stand Set',
        ],
        ['Mboh', 'Unyink', 'Butonk', 'Opik', 'Enday', 'Inal', 'Maul', 'Arul'],
        ['Engkel Riz', 'Yosep', 'Jay']
      ),
      createSection(
        'Videotron',
        'LED 42 Meter',
        ['Center 3x7,5 (8 Meter Pinjem Maxindo)', 'Wing 3x3 2Set', 'PC Ryzen'],
        ['Ayong', 'Bunda', 'Ambon', 'Yopi', 'Ugan', 'Ipal', 'Fiki'],
        ['Engkel Riz', 'Yosep']
      ),
      createSection(
        'Multimedia',
        'Multicam',
        ['PXW Z190 4', 'SE 1200', 'Laptop Stream YouTube'],
        ['Herry', 'Ulloh', 'Chandra', 'Okis', 'Jay'],
        ['Serena']
      ),
    ],
  },
  {
    id: 'job-20261123-pesona-alam',
    monthKey: '2026-11',
    date: '2026-11-23',
    dateLabel: '23 Nov 2026',
    venue: 'Pesona Alam (Riders RAN)',
    loadingSchedule: 'Loading 22 Malam',
    pic: 'Buluk (Suryana) & Dani',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 20rb (Riders RAN)',
        [
          'Avanda 8, Sub KLA 4, DB 10, EWD 4, QA 4, Midas HD+DL 251, Midas HD+Splitter, Gooseneck',
          'Backline (Drum 2 + RD 1) (Tour Custom, PDP)',
          'Stand Set & IEM Senn G4 8 Unit',
        ],
        ['Adin', 'Bulux', 'Rebing', 'Dani', 'Yudis', 'ACA', 'Cionk', 'Dyar', 'Woyo'],
        ['Truck', 'Riz 2']
      ),
    ],
  },
  {
    id: 'job-20261124-sukabumi',
    monthKey: '2026-11',
    date: '2026-11-24',
    dateLabel: '24 Nov 2026',
    venue: 'Sukabumi',
    loadingSchedule: 'Loading 23 Malam',
    pic: 'Heri',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Lighting',
        'Lighting',
        ['Parled 2bar, Fresnel 4, Quartz'],
        ['Heri', 'Isal'],
        ['Yosep']
      ),
    ],
  },
  {
    id: 'job-20261124-tsi',
    monthKey: '2026-11',
    date: '2026-11-24',
    dateLabel: '24 Nov 2026',
    venue: 'TSI (Taman Safari Indonesia)',
    loadingSchedule: 'Loading 23 Sore',
    pic: 'Unyim (Wahyudin)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 5rb',
        ['6001 2, 8002 2, Art6, WHM 6, M32+DL, Gooseneck', 'Stand Set OT'],
        ['Unyink', 'Butonk', 'Inal'],
        ['Yosep']
      ),
      createSection(
        'Lighting',
        'Lighting',
        ['Par 2 bar, Beam 4, Fresnel 4, Smoke 1, Tiger'],
        ['Endin', 'Dyar', 'Gatot (Drop ke TSI)'],
        ['Jay']
      ),
    ],
  },
  {
    id: 'job-20261125-westin',
    monthKey: '2026-11',
    date: '2026-11-25',
    dateLabel: '25 Nov 2026',
    venue: 'Westin Hotel',
    loadingSchedule: 'Loading 24 Malam Jam 00:00',
    pic: 'Mboh, Ayong, & Jay',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 5rb & Sound Presscon',
        ['6001 2, 8002 2, Art6, WHM 6, M32+DL, Gooseneck, Stand Set', 'Sound Presscon: Art 3, WHM 6, TF 1'],
        ['Mboh', 'Yudis', 'ACA', 'Isal (Presscon)'],
        ['Riz']
      ),
      createSection(
        'Lighting',
        'Lighting',
        ['Beam 14, Parled 3 bar, Stromy 8, Fresnel 4, Followspot, Minibrute 2, Hazer, GrandMA'],
        ['Ghele', 'Endin', 'Ugan', 'Heri'],
        ['Yosep']
      ),
      createSection(
        'Videotron',
        'LED 12x4 (Sewa Maxindo 15Meter)',
        ['LED 12x4 (Sewa Maxindo 15Meter)'],
        ['Ayong', 'Ambon', 'Bunda', 'Adi', 'Woyo', 'Yopi'],
        ['Engkel Riz', 'Engkel Woyo']
      ),
      createSection(
        'Multimedia',
        'Stream + 4 Cam',
        ['PC + Acc', 'PXW 4 + Tripod', 'Switcher + Record', 'Laptop 3'],
        ['Heri', 'Uloh', 'Okis', 'Jay', 'Chandra', 'Iman'],
        ['Serena']
      ),
      createSection(
        'Produksi',
        'Produksi (Ronald)',
        ['Level 12m tinggi 1m', 'Gawangan LED 10x4', 'Gawangan Lighting 13x6,8'],
        [],
        []
      ),
    ],
  },
  {
    id: 'job-20261125-bellatera-kelapa-gading',
    monthKey: '2026-11',
    date: '2026-11-25',
    dateLabel: '25 Nov 2026',
    venue: 'Bellatera Kelapa Gading',
    loadingSchedule: 'Loading 24 Malam',
    pic: 'Ardi',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound & Backline Set',
        ['Art 2', 'Backline Set', 'Mic Drum', 'Stand Set', 'Gitar-gitar'],
        ['Ardi', 'Enday'],
        ['Yosep']
      ),
    ],
  },
  {
    id: 'job-20261126-telkom',
    monthKey: '2026-11',
    date: '2026-11-26',
    dateLabel: '26 Nov 2026',
    venue: 'Telkom',
    loadingSchedule: 'Loading 25 Sore jam 15.00',
    pic: 'Buluk (Suryana)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 3rb',
        ['K-Array, Db 4, WHM 6, TF1, Gooseneck', 'Stand Set'],
        ['Bulux', 'Cionk', 'Dyar'],
        ['Jay']
      ),
      createSection(
        'Lighting',
        'Lighting',
        ['Beam 4, Par 2Bar, Fresnel 2'],
        ['Ndin', 'Isal'],
        ['Riz']
      ),
    ],
  },
  {
    id: 'job-20261128-flow-ritz-carlton',
    monthKey: '2026-11',
    date: '2026-11-28',
    dateLabel: '28 Nov 2026',
    venue: 'Flow Ritz Carlton',
    loadingSchedule: 'Loading 27 Sore jam 17.00',
    pic: 'Agus & Ayong',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'LED 4x7 2 Set (Victor) & TV 50"',
        ['LED 4x7 2 Set (2 Set Victor)', 'TV 50" 4Pcs (Rae)'],
        ['Agus', 'Ayong'],
        ['Serena'],
        'Agus, Ayong'
      ),
    ],
  },
  {
    id: 'job-20261128-sheraton',
    monthKey: '2026-11',
    date: '2026-11-28',
    endDate: '2026-11-30',
    dateLabel: '28-30 Nov 2026',
    venue: 'Sheraton Hotel',
    loadingSchedule: 'Loading 27 Malam (28 GR)',
    pic: 'Fahrul & Agus',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Multimedia',
        'Stream + 4 Cam',
        ['PC + Acc', 'PXW 4 + Tripod', 'Switcher + Record', 'Laptop 3'],
        ['Uloh (VJ + Zoom)', 'Kemal (VJ + Zoom)', 'Chandra (VD)', 'Iman (Campers)', 'Tile (Campers)', 'Fera (Campers)'],
        ['Serena']
      ),
      createSection(
        'Audio',
        'Sound 10rb',
        ['Avanda 4, Sub KLA 2, DB 8, EWD 4, QA 2, Midas HD+DL 251, Gooseneck', 'WHM 35 Unit', 'Combiner 8 Unit', 'Stand Set'],
        ['Adin', 'Dani', 'Opick', 'Dyar'],
        ['Riz']
      ),
      createSection(
        'Lighting',
        'Lighting',
        ['Par 2bar, Fresnel 4, Smoke, Mixer Ndin'],
        ['Rio', 'Dyar'],
        ['Riz']
      ),
      createSection(
        'Videotron',
        'LED P2.6 4,5x9 Meter',
        [
          'LED P2.6 4,5x9 Meter (Ambil di R2R Serpong)',
          'Level 9 Meter Tinggi 1,5m (Farid)',
          'Gawangan LED 6x4,3 (Farid)',
        ],
        [
          'Ayong (Setup & Standby)',
          'Bunda (Setup & Standby)',
          'Irvan (Setup & Bongkaran)',
          'Wigi (Setup)',
          'Ambon (Setup)',
          'Adi (Setup & Bongkaran)',
          'Fiki (Setup)',
          'Ipal (Setup & Bongkaran)',
          'Dian (Bongkaran)',
        ],
        ['Engkel Riz', 'Yosep 2', 'Rush'],
        'Fahrul, Agus'
      ),
    ],
  },
  {
    id: 'job-20261128-telkom-hub',
    monthKey: '2026-11',
    date: '2026-11-28',
    endDate: '2026-11-29',
    dateLabel: '28-29 Nov 2026',
    venue: 'Telkom Hub',
    loadingSchedule: 'Loading & GR 27 Pagi jam 09:00 di Lokasi',
    pic: 'Jay (Mulyadi) & Heri',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Multimedia',
        'Stream + 3 Cam',
        [
          'PC + Acc, NX 3 + Tripod (Sewa 1), Switcher + Record, Laptop 3',
          'Clearcom 5 unit buat SM, Perfect Cue',
        ],
        ['Moa (VJ Resolume)', 'Cahyo (GR & Setup)', 'Heri (VJ vMix + Zoom & Setup)', 'Okis (VJ vMix + Zoom & Setup)', 'Tofan (VD & Setup)', 'Jay (Campers)', 'Dedy (Campers)', 'Iman (Setup)'],
        ['APV']
      ),
    ],
  },
  {
    id: 'job-20261129-mabes-al',
    monthKey: '2026-11',
    date: '2026-11-29',
    dateLabel: '29 Nov 2026',
    venue: 'Mabes AL',
    loadingSchedule: 'Loading 29 Pagi Jam 06.00 di Lokasi',
    pic: 'Unyim (Wahyudin)',
    notes: 'WAJIB PAKAI KEMEJA. Tidak boleh memakai celana pendek, kaos, jaket, sweater, atau sandal.',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 5rb',
        [
          'HDL 4, Sub Double 2, Art6, WHM 6, M32+DL, Gooseneck (M32 dari Oki)',
          'Stand Set',
          'Drum (Sekalian bawa backline buat Kemenkes)',
        ],
        ['Unyink', 'Butonk', 'Opik165', 'Timbul', 'Yopi'],
        ['Yosep', 'Jay']
      ),
    ],
  },
  {
    id: 'job-20261129-pesona-alam',
    monthKey: '2026-11',
    date: '2026-11-29',
    dateLabel: '29 Nov 2026',
    venue: 'Pesona Alam',
    loadingSchedule: 'Loading 28 Malam',
    pic: 'Agus (Agustino Setiawan)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 5rb',
        ['HDL 4, Sub Double 2, Art6, WHM 6, M32+DL, Gooseneck', 'Stand Set', 'Drum'],
        ['Rebing', 'Arul', 'Inal'],
        ['Yosep']
      ),
      createSection(
        'Lighting',
        'Lighting & TV Matador',
        ['Lighting: Team Ronny STV', 'Genset 60KVA (Yadi)', 'TV Matador (Agus)'],
        ['Agus'],
        [],
        'Agus'
      ),
    ],
  },
  {
    id: 'job-20261129-bucketlist',
    monthKey: '2026-11',
    date: '2026-11-29',
    endDate: '2026-11-30',
    dateLabel: '29-30 Nov 2026',
    venue: 'Bucketlist Bogor',
    loadingSchedule: 'Loading 28 Malam jam 22:00',
    pic: 'Mboh (Muhamad Rahmat) & Heri',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 15rb + Sound 3rb LT.2 + Sound 1rb',
        [
          'Utama: Avanda 6, Sub Avanda 4, DB 6, LVX 2, WHM 6, M32+DL, M32+Splitter, Gooseneck, Stand Set, Mic Set, Backline (Drum, RD Hari Kedua), IEM G4 7 Unit (Jumeno)',
          'LT.2 (Sound 3rb): 8002 1, Art4, WHM 2, TF1',
          'Sound 1rb: DB 2, Headset 2, MG12',
        ],
        ['Mboh', 'Bulux', 'ACA', 'Cionk', 'Enday', 'Isal', 'Woyo', 'Yudis (LT.2)', 'Delon (LT.2)'],
        ['Engkel Riz', 'Yosep', 'Jay']
      ),
      createSection(
        'Lighting',
        'Lighting & Genset',
        ['Par 3 bar, Beam 4, Fresnel 4, Minibrute 2, Hazer, Mirror Ball, Tiger', 'Genset 60KVA (Yadi)'],
        ['Heri', 'Idrus', 'Kote'],
        ['Riz']
      ),
    ],
  },
  {
    id: 'job-20261130-sawangan-begawan-taman-budaya',
    monthKey: '2026-11',
    date: '2026-11-30',
    dateLabel: '30 Nov 2026',
    venue: 'Alun-Alun Sawangan, Puri Begawan & Vaceng Taman Budaya',
    loadingSchedule: 'Loading 29 Malam',
    pic: 'Irvan & Jay (Mulyadi)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'LED Vaceng Taman Budaya (2,5x4) & Sub-Vendor Sawangan/Begawan',
        [
          'Vaceng Taman Budaya: LED 2,5 x 4',
          'Alun-Alun Sawangan: LED 3x4 meter P3.9 (Lempar Yanto)',
          'Puri Begawan: LED 3x4 + Level 1 meter (Lempar Parman)',
        ],
        ['Irvan', 'Jay', 'Ipal (Beres langsung Bongkaran Sheraton)'],
        ['Yosep']
      ),
    ],
  },
  {
    id: 'job-20261130-kemenkes-rasuna-said',
    monthKey: '2026-11',
    date: '2026-11-30',
    dateLabel: '30 Nov 2026',
    venue: 'Kemenkes Rasuna Said',
    loadingSchedule: 'LED Loading 29 Siang | Sound Loading 29 Malam',
    pic: 'Fahrul (M. Fahrulyana . A)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 15rb',
        ['HDL 6, Sub Double 4, Art 8, WHM 6, M32+DL (Oky), M32+Splitter, Gooseneck', 'Stand Set, Mic Set, Backline'],
        ['Unyink', 'Rebing', 'Butonk', 'Opik165', 'Inal', 'Timbul', 'Yopy'],
        ['Yosep 2', 'Jay']
      ),
      createSection(
        'Videotron',
        'LED 10x3',
        ['LED 10x3 (LED sisa Kemenkes Lalamove)'],
        ['Wigi', 'Ambon', 'Adi', 'Irvan', 'Ipal', 'Fiki'],
        ['Engkel Riz', 'Yosep']
      ),
      createSection(
        'Produksi',
        'Rigging (Jabrig), Sarnaville (Mandiri Tenda), Genset (Yadi) & Produksi (Bagas)',
        [
          'Rigging Jabrig: Panggung 10x8 + Coversound, Level LED T 2,20m x L 10m, Gawangan LED T 5x8m, FOH Single Deck 5x5',
          'Sarnaville 3x3 10Pcs, Genset 60KVA 1, Genset 80KVA 1, AC 5PK 3, Misty Fan 6 (Yadi)',
          'Backdrop 2,44x3,66 + Flooring Karpet (Bagas)',
        ],
        ['Fahrul'],
        [],
        'Fahrul'
      ),
    ],
  },

  // ============================================================================
  // BULAN DESEMBER 2026 (MINGGU 1)
  // ============================================================================
  {
    id: 'job-20261201-kelapa-gading',
    monthKey: '2026-12',
    date: '2026-12-01',
    dateLabel: '1 Des 2026',
    venue: 'Kelapa Gading',
    loadingSchedule: 'Loading 30 Nov Malam',
    pic: 'Wigi (Dedi Agus Wigiantoro)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'LED 3x6',
        ['LED 3x6'],
        ['Wigi', 'Ambon', 'Fiki'],
        ['Engkel Riz']
      ),
    ],
  },
  {
    id: 'job-20261202-mambruk-anyer',
    monthKey: '2026-12',
    date: '2026-12-02',
    dateLabel: '2 Des 2026',
    venue: 'Mambruk Anyer',
    loadingSchedule: 'Loading 1 Des Siang',
    pic: 'Fahrul (M. Fahrulyana . A)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 15rb',
        [
          'HDL 4, Sub Avanda 2, DB 12, Lvx 2, Mipro 4, QA 4, HD + DL251, M32+Splitter, Gooseneck',
          'Backline 2 Set, Stand Set, IEM 5 Unit (Jumeno)',
        ],
        ['Mboh', 'Yudis', 'ACA', 'Cionk', 'Enday', 'Dyar', 'Woyo'],
        ['Riz 2']
      ),
      createSection(
        'Lighting',
        'Lighting',
        ['Parled 12, Beam 8, Fresnel 4, Smoke 1, Stromy 12, Hazer 1, Tiger'],
        ['Ghele', 'Endin', 'Ugan'],
        ['Yosep']
      ),
      createSection(
        'Produksi',
        'Produksi',
        ['Koordinasi Produksi Anyer'],
        ['Fahrul'],
        [],
        'Fahrul'
      ),
    ],
  },
  {
    id: 'job-20261202-holiday-inn',
    monthKey: '2026-12',
    date: '2026-12-02',
    endDate: '2026-12-03',
    dateLabel: '2-3 Des 2026',
    venue: 'Holiday Inn',
    loadingSchedule: 'Loading 1 Des Malam',
    pic: 'Irvan & Heri',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'LED 2x6 + Level 6m T 120cm',
        ['LED 2x6', 'Level 6 Meter Tinggi 120cm'],
        ['Irvan', 'Heri', 'Yopi'],
        ['Yosep']
      ),
      createSection(
        'Lighting',
        'Lighting',
        ['Fresnel 4 Unit'],
        ['Heri'],
        ['Yosep']
      ),
    ],
  },
  {
    id: 'job-20261202-harris-summarecon-bekasi',
    monthKey: '2026-12',
    date: '2026-12-02',
    endDate: '2026-12-04',
    dateLabel: '2-4 Des 2026',
    venue: 'Harris Summarecon Bekasi',
    loadingSchedule: 'Loading 1 Des Malam',
    pic: 'Unyim (Wahyudin)',
    notes: 'Jangan pakai baju RIZ — Hitam Polos Saja.',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound System',
        ['Avanda 4, Sub Avanda 2, DB 8, WHM 8, M32+DL, Gooseneck', 'Stand Set'],
        ['Unyink', 'Butonk', 'Inal', 'Timbul (Drop)'],
        ['Yosep', 'Jay']
      ),
    ],
  },
  {
    id: 'job-20261203-pullman-cp',
    monthKey: '2026-12',
    date: '2026-12-03',
    dateLabel: '3 Des 2026',
    venue: 'Pullman Central Park (CP)',
    loadingSchedule: 'Loading 2 Des Sore jam 17.00',
    pic: 'Ayong Sumarsih',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'LED 2x4 + Level Tinggi 1 Meter 2Set',
        ['LED 2x4 + Level Tinggi 1 Meter 2Set'],
        ['Ayong (Geser R Hotel)', 'Ambon (Geser R Hotel)', 'Ipal (Geser R Hotel)'],
        ['Engkel Riz']
      ),
    ],
  },
  {
    id: 'job-20261204-tribrata',
    monthKey: '2026-12',
    date: '2026-12-04',
    dateLabel: '4 Des 2026',
    venue: 'Tribrata',
    loadingSchedule: 'Loading 3 Des Sore jam 15.00',
    pic: 'Dani, Heri, & Wigi',
    notes: 'Jangan pakai baju RIZ — Hitam Polos Saja.',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound & Split Room',
        [
          'HDL 6, KLA 4, Art 8, WHM 8, M32+DL, Gooseneck',
          'Mixer Analog 3 (Split Room Jam 12.00, 2 Spkr + 2 Mic / Ruangan) + Condenser 6',
        ],
        ['Jordy', 'Dani', 'Opik', 'Timbul', 'Adin'],
        ['Riz 2']
      ),
      createSection(
        'Lighting',
        'Lighting',
        ['Parled 2bar, Beam 6, Fresnel 4, Smoke, Tiger'],
        ['Heri', 'Idrus', 'Dyar'],
        ['Yosep']
      ),
      createSection(
        'Videotron',
        'LED 3x4 + Level Tinggi 1,2 Meter 2Set',
        ['LED 3x4 + Level Tinggi 1,2 Meter 2Set', 'Level dari Ari'],
        ['Wigi', 'Adi', 'Fiki', 'Ugan (Bantu Setup+Bongkaran)', 'Woyo (Bantu Setup+Bongkaran)'],
        ['Engkel Woyo', 'Yosep']
      ),
      createSection(
        'Produksi',
        'Produksi (Kenrich & Hafiz)',
        ['Black Curtain Starlight 27 Meter (Kenrich)', 'Mini Garden 12 Meter (2 Meter pake daun stock - Hafiz)'],
        [],
        []
      ),
    ],
  },
  {
    id: 'job-20261204-r-hotel',
    monthKey: '2026-12',
    date: '2026-12-04',
    dateLabel: '4 Des 2026',
    venue: 'R Hotel Rancamaya',
    loadingSchedule: 'Loading 3 Des Malam Jam 21.00',
    pic: 'Buluk (Suryana) & Ayong',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 5rb',
        ['6001, 8001 2, ART 6, WHM 4, M32+DL, Gooseneck', 'Stand Set', 'Clipon 1'],
        ['Bulux', 'Isal', 'Enday'],
        ['Yosep']
      ),
      createSection(
        'Videotron',
        'LED Center 4x2,5 + Wing 1x2,5 2Set',
        [
          'LED 4x2,5 Center & LED 1x2,5 Wing 2Set',
          'Level 7 Meter Tinggi 1,5 Meter (Ari)',
          'Genset 40 KVA (Bogor Genset)',
          'Matador 50" (Jay)',
        ],
        ['Ayong', 'Ambon', 'Ipal'],
        ['Engkel Riz']
      ),
    ],
  },
  {
    id: 'job-20261204-manggala-wanabakti',
    monthKey: '2026-12',
    date: '2026-12-04',
    dateLabel: '4 Des 2026',
    venue: 'Manggala Wanabakti',
    loadingSchedule: 'Loading 3 Des Malam',
    pic: 'Irvan',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'LED 2,5x6,5 + Level 7m',
        ['LED 2,5x6,5', 'Level 7 Meter Tinggi 40Cm', 'Genset 40KVA Bogor Genset (Geseran dari Holiday Inn)'],
        ['Irvan', 'Yopi', 'Ugan', 'Woyo'],
        ['Yosep 2']
      ),
    ],
  },
  {
    id: 'job-20261205-pullman-thamrin',
    monthKey: '2026-12',
    date: '2026-12-05',
    dateLabel: '5 Des 2026',
    venue: 'Pullman Thamrin',
    loadingSchedule: 'Loading 4 Des Malam Jam 21.00',
    pic: 'Mboh, Wigi, & Jay',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 5rb',
        ['6001 2, 8003 2, Art 6, M32+DL, Gooseneck', 'Stand Set'],
        ['Mboh', 'ACA', 'Isal'],
        ['Yosep']
      ),
      createSection(
        'Lighting',
        'Lighting',
        ['Fresnel 4, Parled 4, Quartz'],
        ['Isal'],
        ['Yosep']
      ),
      createSection(
        'Videotron',
        'LED 3x6 + Level Tinggi 1Meter',
        ['LED 3x6 + Level Tinggi 1Meter'],
        ['Wigi', 'Adi', 'Fiki'],
        ['Engkel Woyo']
      ),
      createSection(
        'Multimedia',
        'Stream + 2 Cam & Genset',
        ['PC + Acc, 2 Cam PXW, Switcher + Record, Laptop 3', 'Genset 60KVA (Yadi)'],
        ['Heri (VJ vMix + Zoom)', 'Okis (VJ vMix + Zoom)', 'Uloh (VD)', 'Jay (Campers)', 'Chandra (Campers)', 'Richard (Campers)'],
        ['Serena']
      ),
    ],
  },
  {
    id: 'job-20261206-giga-culinary-cianjur',
    monthKey: '2026-12',
    date: '2026-12-06',
    dateLabel: '6 Des 2026',
    venue: 'Giga Culinary Cianjur',
    loadingSchedule: 'Loading 5 Des Siang jam 13.00 (Packing Pagi Jam 07.00 Jalan Jam 10.00)',
    pic: 'Dani, Opik, Buluk & Heri',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 40rb',
        [
          'Avanda 16, Sub Avanda 8, KLA 4, DB 10, WHM 6, HD+DL251, M32+Splitter, Gooseneck',
          '6001 + 8002, Stand Set, Cable Protector',
          'Backline: Drum Yamaha Tour, Drum PDP, RD 700NX',
          'IEM 4 (Jumeno)',
        ],
        ['Adin', 'Rebing', 'Dani', 'Opik', 'Bulux', 'Cionk', 'Enday', 'Timbul', 'Woyo'],
        ['Truck', 'Riz 2']
      ),
      createSection(
        'Lighting',
        'Lighting Concert',
        ['Parled 16, Beam 20, Fresnel 8, Stromy 12, Beye 8, Mini Brute 4, Smoke 2, Follow Spot, GrandMA'],
        ['Ghele', 'Ugan', 'Endin', 'Heri', 'Idrus', 'Dyar'],
        ['Yosep 2']
      ),
    ],
  },
  {
    id: 'job-20261206-mulia',
    monthKey: '2026-12',
    date: '2026-12-06',
    dateLabel: '6 Des 2026',
    venue: 'Hotel Mulia Senayan',
    loadingSchedule: 'Loading 5 Des Malam jam 22:00',
    pic: 'Mboh (Muhamad Rahmat)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound Ballroom & Genset',
        [
          'HDL 8, Sub Double 4, Art 12 (2 Delay, 2 Foyer + Stand), WHM EWD 4, QA4, M32+DL, M32+Splitter, Gooseneck',
          'Drum Yamaha, RD 700GX (Agus & Fahrul bawa backline buat TSI)',
          'Headset Sennheiser (Hitam 1, Spare Skin Tone 1 - Jumeno)',
          'Stand Set, Side Fill 2 Set 6001+8002, Perfect Cue (Dina)',
          'Genset 100 KVA 1 Unit & Genset 80 KVA 2 Unit (Yadi)',
        ],
        ['Mboh', 'ACA', 'Isal', 'Unyink', 'Butonk', 'Inal', 'Jordy', 'Yudis'],
        ['Yosep 3']
      ),
    ],
  },
  {
    id: 'job-20261206-uob-south-quarter',
    monthKey: '2026-12',
    date: '2026-12-06',
    dateLabel: '6 Des 2026',
    venue: 'UOB South Quarter',
    loadingSchedule: 'Loading 5 Des Malam',
    pic: 'Irvan',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'LED 2x3 + Level Tinggi 40cm',
        ['LED 2x3 + Level Tinggi 40cm'],
        ['Irvan', 'Ipal'],
        ['Jay']
      ),
    ],
  },
  {
    id: 'job-20261207-tsi',
    monthKey: '2026-12',
    date: '2026-12-07',
    dateLabel: '7 Des 2026',
    venue: 'TSI (Utama & Panggung Terbuka)',
    loadingSchedule: 'Loading 6 Des Sore jam 17.00 & Malam',
    pic: 'Agus (Agustino Setiawan)',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Audio',
        'Sound 10rb (Utama)',
        ['HDL 4, Sub Double 2, Art 8, QA6, M32+DL, Gooseneck', 'Backline', 'Stand Set'],
        ['Mboh', 'ACA', 'Isal', 'Jordy', 'Yudis'],
        ['Yosep 2']
      ),
      createSection(
        'Videotron',
        'LED 3x6 + Level Tinggi 1 Meter',
        ['LED 3x6', 'Level Tinggi 1 Meter', 'Podium Sirine', 'Genset (Bogor Genset)'],
        ['Ayong', 'Ambon', 'Bunda', 'Fiki', 'Agus (PIC)'],
        ['Engkel Riz', 'Serena'],
        'Agus'
      ),
      createSection(
        'Audio',
        'TSI Panggung Terbuka',
        ['HDL 2, Sub Double 2, Art 6, M32+DL, WHM 4', 'Stand Set'],
        ['Unyink', 'Butonk', 'Inal'],
        ['Yosep']
      ),
    ],
  },
  {
    id: 'job-20261207-ahmad-yani-taman-budaya',
    monthKey: '2026-12',
    date: '2026-12-07',
    dateLabel: '7 Des 2026',
    venue: 'Ahmad Yani & Taman Budaya',
    loadingSchedule: 'Loading 6 Des Sore & Malam',
    pic: 'Irvan & Wigi',
    status: 'Terjadwal',
    sections: [
      createSection(
        'Videotron',
        'Ahmad Yani — LED 2x3 + Level 1 Meter',
        ['LED 2x3 + Level 1 Meter'],
        ['Irvan', 'Yopi'],
        ['Jay']
      ),
      createSection(
        'Videotron',
        'Taman Budaya — LED 3x5',
        ['LED 3x5'],
        ['Wigi', 'Adi', 'Ipal'],
        ['Yosep']
      ),
    ],
  },
];

