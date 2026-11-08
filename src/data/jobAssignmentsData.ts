/**
 * DATASET RESMI JADWAL PENUGASAN KERJA / JOB EVENT (STAFF & FREELANCE)
 * Sumber Acuan Mutlak: Sistem Penjadwalan Aplikasi & Sinkronisasi Google Calendar PT. Riz Production Multi Kreasi
 * (KOMIT: Jadwal penugasan bukan lagi bersumber dari Google Doc)
 */

import { JobAssignment, JobCrewMember, JobDivisionSection } from '../types';

/**
 * Pemetaan nama panggilan kru ke ID Staff Inhouse resmi (22 personil)
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
 * Pemetaan nama kru Freelance & Mitra
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
 * Pola kata kunci jadwal non-Job / non-Event pada Google Calendar (rizproduction78@gmail.com)
 * yang WAJIB diblokir agar tidak masuk sebagai penugasan Job/Event:
 * 1. Meeting / Tech Meeting / Techmet / Rapat / Meet Up / Kopdar / Zoom
 * 2. Survey / Survei Lokasi / Visit Kantor / Kunjungan Kantor
 * 3. Pajak / Pinjaman / Loan / KUR / Bayar KGS PT / Cicilan
 * 4. Izin / Cuti Personel (contoh: CIONK IJIN)
 * 5. Pengiriman/Bagi Hampers, Undangan Pribadi, Bukber, Training, Livewebinar
 */
export const NON_JOB_CALENDAR_SUMMARY_PATTERNS: RegExp[] = [
  /\b(meeting|tech\s*meet(?:ing)?|techmet|rapat|meet\s*up|met'?up|kopdar|zoom\s+okk)\b/i,
  /\b(survey|survei|visit\s+kantor|kunjungan\s+kantor)\b/i,
  /\b(konsultasi\s+pajak|urus\s+pajak|aulia\s+loan|\bloan\b|bank\s+sumsel\s+kur|\bkur\b|bayar\s+kgs\s+pt)\b/i,
  /\b(cionk\s+ijin|\bijin\b|\bizin\b|\bcuti\b)\b/i,
  /\b(pengiriman\s+hampers|bagi\s+hampers|^undangan\b|adenya\s+meried|bukber\s+gabungan|training\s+grand\s*ma|yamaha\s+training|livewebinar|whitepaperindustrievent)\b/i,
  /^RP\s+\d+\s*-\s*\d+$/i,
];

/**
 * Filter ketat: Mengembalikan `true` HANYA jika entri Google Calendar adalah murni Job / Event Produksi,
 * dan `false` apabila merupakan Meeting, Survey, Visit Kantor, Pajak/Loan/KUR/KGS, Izin, Hampers, Undangan, Training,
 * atau kode catatan internal non-event (seperti "RP 9-16" atau kode "MD" tanpa deskripsi/lampiran event).
 */
export function isStrictJobOrEventCalendarEntry(
  summaryOrVenue: string,
  descriptionOrNotes?: string
): boolean {
  const cleanSummary = String(summaryOrVenue || '')
    .replace(/^\[[^\]]+\]\s*/g, '')
    .replace(/^\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}\s+/i, '')
    .trim();
  if (!cleanSummary) return false;

  for (const pattern of NON_JOB_CALENDAR_SUMMARY_PATTERNS) {
    if (pattern.test(cleanSummary) || pattern.test(String(summaryOrVenue || '').trim())) {
      return false;
    }
  }

  const cleanDesc = String(descriptionOrNotes || '').trim();

  // Kode singkat "MD" tanpa lampiran/catatan spesifikasi event bukan merupakan jadwal Job/Event
  if (/^MD$/i.test(cleanSummary) && !cleanDesc) {
    return false;
  }

  // Cek tambahan bila judul generik tetapi deskripsi murni rapat/webinar/pajak tanpa spek event
  if (cleanDesc && /\b(livewebinar\.com|zoom\.us\/j\/|rapat\s+pengurus)\b/i.test(cleanDesc)) {
    const hasProductionSpec = /\b(sound|led|videotron|lighting|beam|parled|fresnel|genset|backline|multicam|rigging|p2\.\d|p3\.\d)\b/i.test(
      `${cleanSummary} ${cleanDesc}`
    );
    if (!hasProductionSpec) {
      return false;
    }
  }

  return true;
}

const DIVISION_DEFAULT_TEAM_LEADER: Record<
  JobDivisionSection['division'],
  { rawName: string; roleNote: string }
> = {
  Audio: { rawName: 'Mboh', roleNote: 'Team Leader & Koordinator Sound' },
  Videotron: { rawName: 'Ayong', roleNote: 'Team Leader & Koordinator LED Videotron' },
  Lighting: { rawName: 'Heri', roleNote: 'Team Leader & Koordinator Lighting' },
  Multimedia: { rawName: 'Jay', roleNote: 'Team Leader & Koordinator Multimedia' },
  Produksi: { rawName: 'Mang Ube', roleNote: 'Team Leader Gudang & Logistik Event' },
  Umum: { rawName: 'Mang Ube', roleNote: 'Team Leader Gudang & Logistik Event' },
};

const EXPLICIT_CREW_DETECTION_PATTERNS: Array<{
  regex: RegExp;
  rawName: string;
  roleNote: string;
}> = [
  { regex: /\b(rebing)\b/i, rawName: 'Rebing', roleNote: 'Kru / Operator Sound Event' },
  { regex: /\b(mboh|muhamad\s+rahmat)\b/i, rawName: 'Mboh', roleNote: 'Team Leader & Kru Sound' },
  { regex: /\b(unyink|unyim|unyin|wahyudin)\b/i, rawName: 'Unyim', roleNote: 'Kru Sound System' },
  { regex: /\b(butonk|butong|iwan\s+kurniawan|\biwan\b)\b/i, rawName: 'Iwan', roleNote: 'Kru Sound System' },
  { regex: /\b(yudis|yudish|yudishtira)\b/i, rawName: 'Yudis', roleNote: 'Kru Sound System' },
  { regex: /\b(opik|opick|taufik\s+diana)\b/i, rawName: 'Opik', roleNote: 'Kru Sound System' },
  { regex: /\b(buluk|bulux|suryana)\b/i, rawName: 'Buluk', roleNote: 'Kru Sound System' },
  { regex: /\b(ramdani)\b/i, rawName: 'Dani', roleNote: 'Kru Sound System' },
  { regex: /\b(heri|herry)\b/i, rawName: 'Heri', roleNote: 'Team Leader & Incharge Lighting' },
  { regex: /\b(mulyadi|\bjay\b)\b/i, rawName: 'Jay', roleNote: 'Team Leader & Incharge Multimedia' },
  { regex: /\b(ayong)\b/i, rawName: 'Ayong', roleNote: 'Team Leader & Incharge Videotron' },
  { regex: /\b(wigi|wigie|dedi\s+agus)\b/i, rawName: 'Wigi', roleNote: 'Kru Videotron LED' },
  { regex: /\b(irvan|irfan)\b/i, rawName: 'Irvan', roleNote: 'Kru Videotron LED' },
  { regex: /\b(kharo|mulyana)\b/i, rawName: 'Kharo', roleNote: 'Kru Videotron & Service' },
  { regex: /\b(mang\s*ube|udin\s+saepudin)\b/i, rawName: 'Mang Ube', roleNote: 'Team Leader Gudang & Loading' },
  { regex: /\b(gatot\s+wiliyanto|\bgatot\b)\b/i, rawName: 'Gatot', roleNote: 'Staff Gudang & Loading' },
  { regex: /\b(aep\s+saepudin|abah\s+subur|\bsubur\b)\b/i, rawName: 'Subur', roleNote: 'Staff Gudang & Loading' },
  { regex: /\b(damri)\b/i, rawName: 'Damri', roleNote: 'Team Leader Service & Maintenance' },
  { regex: /\b(adin)\b/i, rawName: 'Adin', roleNote: 'Kru Freelance Audio' },
  { regex: /\b(jordy)\b/i, rawName: 'Jordy', roleNote: 'Kru Freelance Audio' },
  { regex: /\b(fiki)\b/i, rawName: 'Fiki', roleNote: 'Kru Freelance Videotron' },
  { regex: /\b(ugan)\b/i, rawName: 'Ugan', roleNote: 'Kru Freelance Lighting' },
  { regex: /\b(ghele)\b/i, rawName: 'Ghele', roleNote: 'Kru Freelance Lighting' },
  { regex: /\b(endin|ndin)\b/i, rawName: 'Endin', roleNote: 'Kru Freelance Lighting' },
  { regex: /\b(isal)\b/i, rawName: 'Isal', roleNote: 'Kru Freelance Lighting' },
  { regex: /\b(uloh|ulloh)\b/i, rawName: 'Uloh', roleNote: 'Kru Freelance Multimedia' },
  { regex: /\b(richad|richard)\b/i, rawName: 'Richad', roleNote: 'Kru Freelance Multimedia' },
  { regex: /\b(ariq)\b/i, rawName: 'Ariq', roleNote: 'Kru Freelance Multimedia' },
  { regex: /\b(timbul)\b/i, rawName: 'Timbul', roleNote: 'Kru Freelance Audio' },
  { regex: /\b(yopy|yopi)\b/i, rawName: 'Yopy', roleNote: 'Kru Freelance Videotron' },
  { regex: /\b(woyo)\b/i, rawName: 'Woyo', roleNote: 'Kru Freelance Audio & Armada' },
];

/**
 * Menghubungkan setiap jadwal Job/Event Google Calendar secara otomatis dengan bentuk
 * penugasan kerja bagi Crew (Freelance) maupun Staff (Inhouse) berdasarkan:
 * 1. Nama kru/staf eksplisit yang tertulis pada judul venue, catatan/notes, atau kolom PIC di Google Calendar.
 * 2. Koordinator / Team Leader struktural resmi divisi terkait (Audio -> Mboh, Videotron -> Ayong,
 *    Lighting -> Heri, Multimedia -> Jay, Produksi -> Mang Ube) apabila seksi divisi belum memiliki staf inhouse.
 */
export function enrichJobAssignmentCrewLinkage(job: JobAssignment): JobAssignment {
  if (!job || !Array.isArray(job.sections) || job.sections.length === 0) {
    return job;
  }

  const combinedText = `${job.venue || ''} | ${job.notes || ''} | ${
    job.pic && job.pic !== 'Admin / Tim Operasional' ? job.pic : ''
  }`;

  const extractedMembers: JobCrewMember[] = [];
  const seenCanonical = new Set<string>();

  for (const pat of EXPLICIT_CREW_DETECTION_PATTERNS) {
    if (pat.regex.test(combinedText)) {
      const resolved = resolveCrewMember(pat.rawName, 'Umum', pat.roleNote);
      if (!seenCanonical.has(resolved.canonicalName)) {
        seenCanonical.add(resolved.canonicalName);
        extractedMembers.push(resolved);
      }
    }
  }

  const enrichedSections: JobDivisionSection[] = job.sections.map((sec, idx) => {
    const existingCrew = Array.isArray(sec.crew) ? [...sec.crew] : [];
    const sectionSeen = new Set<string>(existingCrew.map(c => c.canonicalName));

    // Tambahkan kru eksplisit yang cocok dengan divisi section (atau ke section pertama bila hanya 1 section)
    for (const member of extractedMembers) {
      const matchesDiv =
        job.sections.length === 1 ||
        member.division === sec.division ||
        (sec.division === 'Produksi' && member.division === 'Gudang') ||
        idx === 0;
      if (matchesDiv && !sectionSeen.has(member.canonicalName)) {
        sectionSeen.add(member.canonicalName);
        existingCrew.push(member);
      }
    }

    // Pastikan setiap section divisi pada Job/Event yang belum diedit manual memiliki koordinator Staff Inhouse resmi
    if (!job._userEdited) {
      const hasInhouseStaff = existingCrew.some(c => c.personnelType === 'Staff');
      if (!hasInhouseStaff) {
        const leaderDef =
          DIVISION_DEFAULT_TEAM_LEADER[sec.division] || DIVISION_DEFAULT_TEAM_LEADER.Produksi;
        const leaderMember = resolveCrewMember(leaderDef.rawName, sec.division, leaderDef.roleNote);
        if (!sectionSeen.has(leaderMember.canonicalName)) {
          sectionSeen.add(leaderMember.canonicalName);
          existingCrew.push(leaderMember);
        }
      }
    }

    const sectionPicName =
      sec.sectionPic ||
      (existingCrew.length > 0 ? existingCrew.map(c => c.name).slice(0, 2).join(' & ') : undefined);

    return {
      ...sec,
      crew: existingCrew,
      ...(sectionPicName ? { sectionPic: sectionPicName } : {}),
    };
  });

  let updatedPic = job.pic;
  if (!updatedPic || updatedPic === 'Admin / Tim Operasional' || updatedPic === '-') {
    const allAssignedNames: string[] = [];
    for (const sec of enrichedSections) {
      for (const c of sec.crew) {
        if (!allAssignedNames.includes(c.name)) {
          allAssignedNames.push(c.name);
        }
      }
    }
    if (allAssignedNames.length > 0) {
      updatedPic = allAssignedNames.slice(0, 3).join(', ');
    }
  }

  return {
    ...job,
    pic: updatedPic,
    sections: enrichedSections,
  };
}

/**
 * DATASET RESMI JADWAL PENUGASAN EVENT 2026 (SINKRON LANGSUNG GOOGLE CALENDAR RIZ PRODUCTION: rizproduction78@gmail.com)
 * Unit Alat / Spesifikasi Teknis dan Penugasan Staff / Crew Freelance dapat di-assessment langsung oleh Admin.
 */
const RAW_INITIAL_JOB_ASSIGNMENTS: JobAssignment[] = [
  // ============================================================================
  // BULAN JANUARI 2026 (GOOGLE CALENDAR SYNC)
  // ============================================================================
  {
    id: "gcal-6kp3cc9lcop3ebb1coqjeb9k69gmcbb1c8q62b9n69h3ge1icgqm6cr268",
    monthKey: "2026-01",
    date: "2026-01-05",
    dateLabel: "5 Jan 2026",
    venue: "5 Jan 2026 grand anara",
    loadingSchedule: "Loading tgl 4 malam yah om (Wigie)",
    pic: "Wigi (Dedi Agus Wigiantoro)",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: 5 Jan 2026 grand anara (Menunggu Detail / Assessment Spek Admin)"],
        ["Wigi"],
        []
      ),
    ],
  },
  {
    id: "gcal-c8r62pb16lj66b9n75gjgb9k68om2bb1c4pm4b9m6pgj8p1o6os6aphk6c",
    monthKey: "2026-01",
    date: "2026-01-05",
    dateLabel: "5 Jan 2026",
    venue: "Ugan order",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Center 3,5 x5 (17,5 Meter) *7Jt*\n- Wing 3,5 x 0,5 4Set (7 Meter) *2,8 Jt*\n- Total *9,8Jt*\n- Lighting\nBeam 20\nPar led  22\nHazer 2\nTripod 4",
    sections: [
      createSection(
        "Videotron",
        "Center 3,5 x5 (17,5 Meter) *7Jt",
        ["Center 3,5 x5 (17,5 Meter) *7Jt", "Wing 3,5 x 0,5 4Set (7 Meter)"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Beam 20",
        ["Beam 20", "Par led  22", "Hazer 2", "Tripod 4"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cgqjieb2cco66b9kc8qjib9k6cojibb1cksj2bb2c4oj6chjc4p3ie9lc4",
    monthKey: "2026-01",
    date: "2026-01-06",
    dateLabel: "6 Jan 2026",
    venue: "Kejaksaan",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Kejaksaan (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c9h6cc3174rjib9g71ij0b9kc9ij6b9p6lh34bb2c8om2d9p6cr64d3570",
    monthKey: "2026-01",
    date: "2026-01-07",
    endDate: "2026-01-08",
    dateLabel: "7-8 Jan 2026",
    venue: "Bowo Order",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Siang bos buat tgl 7-8 Januari \nSoundsystem 5rb watt\nBack line + instrument(bass gitar)",
    sections: [
      createSection(
        "Audio",
        "Soundsystem 5rb watt",
        ["Soundsystem 5rb watt", "Back line + instrument(bass gitar)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-75i64opl6hj36b9ocphm4b9kchi38b9p61hjgb9kccqj8p366dgj6ohl60",
    monthKey: "2026-01",
    date: "2026-01-07",
    dateLabel: "7 Jan 2026",
    venue: "Meeting Vendor Bagas, Ronald",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Siapkan bahan pertanyaan harga produksi per Item\n- Siapkan Cofee break\n-",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Meeting Vendor Bagas, Ronald (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-ccr3gd1l71ij0b9l69ijib9k6pi3gbb16sqmcb9n68sj8oj470o6achg60",
    monthKey: "2026-01",
    date: "2026-01-09",
    dateLabel: "9 Jan 2026",
    venue: "Konsultasi Pajak",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Konsultasi Pajak (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2q8cnvosnq9uj33m90nj2tehcq",
    monthKey: "2026-01",
    date: "2026-01-10",
    dateLabel: "10 Jan 2026",
    venue: "PAK ZOEL BPK SLIPI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: PAK ZOEL BPK SLIPI (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-64r66dppc8s6cb9kcgqmab9k69i38bb270sm6b9o6hgj6pb1ccqjec9pc4",
    monthKey: "2026-01",
    date: "2026-01-10",
    dateLabel: "10 Jan 2026",
    venue: "Rio Order",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Minta detail budget utk :\n-led 5x3 (400rb / Meter) *6Jt* (Level LED 200rb / Meter) 5x200 *1Jt*\n-audio system 5000 *3,5Jt*\n-lighting 2 tiang parled kanan kiri *1,5Jt*\n-multicam 3cam, nx100 *4,5Jt*\n-genset 40 KVA *2jt*",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["led 5x3 (400rb / Meter) *6Jt* (Level LED 200rb / Meter) 5x200 *1Jt", "audio system 5000 *3,5Jt"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["lighting 2 tiang parled kanan kiri *1,5Jt"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "multicam 3cam, nx100 *4,5Jt",
        ["multicam 3cam, nx100 *4,5Jt"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "genset 40 KVA *2jt",
        ["genset 40 KVA *2jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2ducpujlpvkiuj0b5dm2mbod12",
    monthKey: "2026-01",
    date: "2026-01-10",
    dateLabel: "10 Jan 2026",
    venue: "TAMAN BUDAYA VACENK",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: TAMAN BUDAYA VACENK (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4bgscm9pnfrl44m4m3tak6khd6",
    monthKey: "2026-01",
    date: "2026-01-10",
    dateLabel: "10 Jan 2026",
    venue: "VERTEX MOTION CAMP HULU CAI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "dp 20jt\nLampiran Google Calendar: QUO_VERTEX MOTION CINEMA_CAMP HULU CAI_10 JANUARI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_VERTEX MOTION CINEMA_CAMP HULU CAI_10 JANUARI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c9gjcohjckom8b9lcoomab9k61h30b9oc5hjebb26gq30cb168rj6dpg6s",
    monthKey: "2026-01",
    date: "2026-01-11",
    dateLabel: "11 Jan 2026",
    venue: "Nengah Dewata",
    loadingSchedule: "Loading 10 Malam",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*11 Jan Shaka Ballroom Sentul*\nLoading 10 Malam\n- Lighting Parled 2bar, Freshnell 2\n- Sound System 3000 Watt",
    sections: [
      createSection(
        "Audio",
        "Sound System 3000 Watt",
        ["Sound System 3000 Watt"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting Parled 2bar, Freshnell 2",
        ["Lighting Parled 2bar, Freshnell 2"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-rpb9siug3r5jvimsha2v8d8ii8",
    monthKey: "2026-01",
    date: "2026-01-12",
    dateLabel: "12 Jan 2026",
    venue: "Rivo Ojk bi lt.25",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tgl 12 sound 3000, lt 25 BI, wireess 15\nKamera wireless 1 unit\nPtz 1 unit",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Tgl 12 sound 3000, lt 25 BI, wireess 15", "Kamera wireless 1 unit", "Ptz 1 unit"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-69uerfu1vr5cl05ep7or9jemic",
    monthKey: "2026-01",
    date: "2026-01-12",
    dateLabel: "12 Jan 2026",
    venue: "Rivo mandarin hotel",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tgl 12 butuh led 6x2,5 dudukan, 1 meter\nGoseneck 1",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["Tgl 12 butuh led 6x2,5 dudukan, 1 meter"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6lj62or3chj32b9l6thj8b9k6cojab9o65ij4bb4c9imao9hcpgm2d1p6k",
    monthKey: "2026-01",
    date: "2026-01-13",
    dateLabel: "13 Jan 2026",
    venue: "Undangan Dani MP Pro",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Dani (Ramdani)",
    status: "Selesai",
    gcalSynced: true,
    notes: "Kepada Yth.\nBapak/Ibu/Saudara/i\n*Bapak Wahyu RIZ*\n_di tempat_\n\n_Bismillahirrahmanirrahim_\n_Assalamu’alaikum Wr. Wb._\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, untuk menghadiri\n\n*Tasyakuran Khitan Anak Kami Yang Bernama*\n*M Andra Adhitama*\n\nYang akan dilaksanakan pada:\n\nhari/tanggal : selasa, 13 januari 2026\npukul :09:00 - selesai\ntempat : kavling century dramaga (gg saluyu neglasari)\n\n*Klik link di bawah ini* untuk informasi lebih lengkap\nhttps://misumoments.webinvit.id/muhammad-andra-adhitama?to=Bapak%20Wahyu%20RIZ\n\nMerupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i dapat berhadir dan memberikan do'a kepada anak kami.\n\nAtas Kehadiran dan Do'a Kami Ucapkan Terimakasih.\n\n_Wassalamu’alaikum Wr. Wb._\n\nHormat Kami,\n*Pengundang*\n\n`Mohon maaf perihal undangan hanya dibagikan melalui pesan ini.`",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, untuk menghadiri", "Tasyakuran Khitan Anak Kami Yang Bernama", "M Andra Adhitama", "Yang akan dilaksanakan pada:", "hari/tanggal : selasa, 13 januari 2026", "pukul :09:00 - selesai", "tempat : kavling century dramaga (gg saluyu neglasari)", "Klik link di bawah ini* untuk informasi lebih lengkap", "https://misumoments.webinvit.id/muhammad-andra-adhitama?to=Bapak%20Wahyu%20RIZ", "Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i dapat berhadir dan memberikan do'a kepada anak kami.", "Atas Kehadiran dan Do'a Kami Ucapkan Terimakasih.", "_Wassalamu’alaikum Wr. Wb._", "Hormat Kami,", "Pengundang", "`Mohon maaf perihal undangan hanya dibagikan melalui pesan ini.`"],
        ["Dani"],
        []
      ),
    ],
  },
  {
    id: "gcal-2u52f0bn4q3ds8eifno8r4rjls",
    monthKey: "2026-01",
    date: "2026-01-14",
    dateLabel: "14 Jan 2026",
    venue: "Mario Novotel",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "jadinya tanggal 14 om, di novotel bogor raya.\n\n1. LED 2.6 ukuran 6x3 10,8jt \n2. Base LED 40 cm 1,2jt \n3. Lighting Parled, fresnel, beam 3,5jt \n4. Sound untuk meeting 1,5jt \n5. Genset 2,5jt\nHeadset 1 unit 1jt",
    sections: [
      createSection(
        "Audio",
        "4. Sound untuk meeting 1,5jt",
        ["4. Sound untuk meeting 1,5jt", "Headset 1 unit 1jt"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "1. LED 2.6 ukuran 6x3 10,8jt",
        ["1. LED 2.6 ukuran 6x3 10,8jt", "2. Base LED 40 cm 1,2jt"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["3. Lighting Parled, fresnel, beam 3,5jt"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "5. Genset 2,5jt",
        ["5. Genset 2,5jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4g3knnjipjp3qov772oa2g0758",
    monthKey: "2026-01",
    date: "2026-01-14",
    endDate: "2026-01-15",
    dateLabel: "14-15 Jan 2026",
    venue: "SYAMSUL Graha Angkasa Pura",
    loadingSchedule: "Syamsul jadinya 14-15 13 Malam Loading 14nya GR harganya",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Syamsul jadinya 14-15 13 Malam Loading 14nya GR harganya \nLed \n4x8 (Gantung) 21jt",
    sections: [
      createSection(
        "Videotron",
        "4x8 (Gantung) 21jt",
        ["4x8 (Gantung) 21jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2ajcoeffuitko65386a0bd9tlr",
    monthKey: "2026-01",
    date: "2026-01-15",
    dateLabel: "15 Jan 2026",
    venue: "KCK",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_KCK_15 JAN 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_KCK_15 JAN 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3lpd6n10lt6hq3ls01inpjcqur",
    monthKey: "2026-01",
    date: "2026-01-15",
    dateLabel: "15 Jan 2026",
    venue: "SURVEI BRINS PULLMAN, BTN GANDUL",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: SURVEI BRINS PULLMAN, BTN GANDUL (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-chhmce1jc4p3abb46kr3eb9k74pjibb2chj3ibb664pmce32cgrjec1gc8",
    monthKey: "2026-01",
    date: "2026-01-15",
    dateLabel: "15 Jan 2026",
    venue: "Survei iwan Cilengsi jam 10",
    loadingSchedule: "jam 10",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Survei iwan Cilengsi jam 10 (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-062m16n3qni3j1osajoa02kver",
    monthKey: "2026-01",
    date: "2026-01-16",
    dateLabel: "16 Jan 2026",
    venue: "PAK MARIO JSI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tanggal 16 Januari\n1. Sound (kebutuhan talkshow dan elektone)\n2. Lighting simple parled saja",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["1. Sound (kebutuhan talkshow dan elektone)"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "2. Lighting simple parled saja",
        ["2. Lighting simple parled saja"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6dim2c9ic4rj8b9l68q64b9kckpm6bb269h64bb36ksjaohl61j3adpnck",
    monthKey: "2026-01",
    date: "2026-01-17",
    dateLabel: "17 Jan 2026",
    venue: "Bowo SMU 3 LOADING JAM 16.00",
    loadingSchedule: "LOADING JAM 16.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*PA 10.000Watt*\n- AudioCenter Avanda 210 4Pcs\n- Audio Center Avanda 218 2 Pcs\n- Marani MIR 480I\n- Midas M32+DL32\n*MONITOR*\n- RCF Art 315 / Db Opera 15 8Pcs\n*MICROPHONE*\n- WHM Sennheiser EWD835 4Pcs\n- Drum Set Senheiser E604\n- AKG C1000 3Pcs\n- Shure Beta 91\n- DI BoX set \n*BACKLINE*\n- Drum Yamaha Tour custom\n- Bass GK 1001 RB + Cab 4x10\n- Marshall JCM 900 1Pcs\n- Roland Jazz Choruss JC120 1Pcs\n- Roland KC 550 1Pcs\n- Roland RD 700 NX 1Pcs\n*Mic Codensor 6*\n*Guitar Bass, Electrik*",
    sections: [
      createSection(
        "Audio",
        "PA 10.000Watt",
        ["PA 10.000Watt", "Midas M32+DL32", "MONITOR", "RCF Art 315 / Db Opera 15 8Pcs", "MICROPHONE", "WHM Sennheiser EWD835 4Pcs", "Drum Set Senheiser E604", "AKG C1000 3Pcs", "Shure Beta 91", "DI BoX set", "Drum Yamaha Tour custom", "Marshall JCM 900 1Pcs", "Roland Jazz Choruss JC120 1Pcs", "Roland KC 550 1Pcs", "Roland RD 700 NX 1Pcs", "Mic Codensor 6", "Guitar Bass, Electrik"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "AudioCenter Avanda 210 4Pcs",
        ["AudioCenter Avanda 210 4Pcs", "Audio Center Avanda 218 2 Pcs", "Marani MIR 480I", "Bass GK 1001 RB + Cab 4x10"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1d7p9j7si1pm5mnv1akq9ar9k3",
    monthKey: "2026-01",
    date: "2026-01-17",
    dateLabel: "17 Jan 2026",
    venue: "PAK MARIO JSI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tanggal 17 Januari\n1. Sound (kebutuhan band)\n2. Lighting (8 parled, 2 fresnel, 4 beam)",
    sections: [
      createSection(
        "Audio",
        "1. Sound (kebutuhan band)",
        ["1. Sound (kebutuhan band)"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["2. Lighting (8 parled, 2 fresnel, 4 beam)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-144dhvq030i43t34uf6ekrsthf",
    monthKey: "2026-01",
    date: "2026-01-19",
    endDate: "2026-01-20",
    dateLabel: "19-20 Jan 2026",
    venue: "EDO EVO Pullman",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_PAK EDO_PULLMAN CENTRAL PARK_19-20 Jan (REV1).xlsx",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_PAK EDO_PULLMAN CENTRAL PARK_19-20 Jan (REV1).xlsx"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6com4dpjc4smab9n6sq6cb9k60o3cbb1ccoj0b9pc9i66e9p69hj2phg6c",
    monthKey: "2026-01",
    date: "2026-01-19",
    dateLabel: "19 Jan 2026",
    venue: "Muhyi BTN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound system\nlighting\nwingbackdrop\nkey visual\nbumper (opening, pembicara)\ndokumentasi (foto, video)",
    sections: [
      createSection(
        "Produksi",
        "wingbackdrop",
        ["wingbackdrop", "key visual", "bumper (opening, pembicara)", "dokumentasi (foto, video)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-61gjie9i6gr3eb9jcgsm8b9k61i3cb9o68o3eb9lclhj0d1jcdh6ae9pco",
    monthKey: "2026-01",
    date: "2026-01-19",
    dateLabel: "19 Jan 2026",
    venue: "Rio Order Hotel Bigland",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Lighting 4jt\n- TV 50\" 650 rb x 2 (HDMI Panjang) 1,3jt\nLUNAS 5JT ( 14 JANUARI 2026)",
    sections: [
      createSection(
        "Lighting",
        "Lighting 4jt",
        ["Lighting 4jt"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "Multimedia, Cam & Live Stream",
        ["TV 50\" 650 rb x 2 (HDMI Panjang) 1,3jt", "LUNAS 5JT ( 14 JANUARI 2026)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7t0t2lslkmu38rahoh1ktmg3o6",
    monthKey: "2026-01",
    date: "2026-01-21",
    dateLabel: "21 Jan 2026",
    venue: "Andi Infinite",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "21 Jan MSIG Tower \nSound 3000 - speaker collum",
    sections: [
      createSection(
        "Audio",
        "Sound 3000 - speaker collum",
        ["Sound 3000 - speaker collum"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-n8b6g453rr66s8b6h0ujn60rug",
    monthKey: "2026-01",
    date: "2026-01-21",
    dateLabel: "21 Jan 2026",
    venue: "Rivo",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound 3rb \nLed\n\nGenset",
    sections: [
      createSection(
        "Audio",
        "Sound 3rb",
        ["Sound 3rb"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-61i30chk6pij8b9pcoo34b9k6thm2bb2cgp38bb175i32opm6kq3ip1jc8",
    monthKey: "2026-01",
    date: "2026-01-23",
    dateLabel: "23 Jan 2026",
    venue: "Edo Evo pullman Ciawi",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound 5rb\nGenset 40KVA",
    sections: [
      createSection(
        "Audio",
        "Sound 5rb",
        ["Sound 5rb"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Genset 40KVA",
        ["Genset 40KVA"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6sq36cpichj38b9j70s68b9k6kq3ibb2cosmabb2cgoj0e1h64r62c1i6s",
    monthKey: "2026-01",
    date: "2026-01-23",
    dateLabel: "23 Jan 2026",
    venue: "Ipoel Padi Intercon PIM",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "DP 14.250.000 ( TGL 12 JANUARI 2026)\nLampiran Google Calendar: QUO_PAK FENZA_INTERCOM PIM_23 JANUARI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_PAK FENZA_INTERCOM PIM_23 JANUARI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c8sj2p1j6pj3cb9k6dhj4b9kccq66b9ocgs3abb36cs66p9p6tj3ed9n74",
    monthKey: "2026-01",
    date: "2026-01-23",
    dateLabel: "23 Jan 2026",
    venue: "Keong softunes",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "tgl 23 JANUARI\n5000 watt\nDi JW mariot",
    sections: [
      createSection(
        "Audio",
        "5000 watt",
        ["5000 watt", "Di JW mariot"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cdh3ec316hgjgb9h68oj8b9kclhj4b9pc8r30b9h75j38cb5c5j6adhp6o",
    monthKey: "2026-01",
    date: "2026-01-24",
    dateLabel: "24 Jan 2026",
    venue: "Angga Gereja HKBP Aula Sopo Praja Gereja HKBP",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound System \nEvent Natal PP\nVenue:\nGereja HKBP\nGedung Sopo\nJl. Praja Kebayoran Lama\n\nMain PA:\n2 Unit RCF 6001\n2 Unit Sub RCF 8001\n\nSide Fill:\n2 Unit RCF315 \n\nMonitor:\n6 Unit RCF315 \n8 Unit DI Box\n1 Unit Stand Keyboard Double \n1 Unit Stand Keyboard Single \n2 Unit Standbook \n \n\n6 Unit Mic Wireless Sennheiser EWD \n4 Unit Mic Condenser (Padus)\n10 Unit Stand Mic\n\n1 Unit Mixing Console Midas M32\n1 Unit Midas DL32\n\nAudio Equipment \nCable System \nElectricity Equipment\n\n4,5Jt",
    sections: [
      createSection(
        "Audio",
        "Event Natal PP",
        ["Event Natal PP", "Gereja HKBP", "Gedung Sopo", "Jl. Praja Kebayoran Lama", "Main PA:", "2 Unit RCF 6001", "2 Unit Sub RCF 8001", "Side Fill:", "2 Unit RCF315", "Monitor:", "6 Unit RCF315", "8 Unit DI Box", "1 Unit Stand Keyboard Double", "1 Unit Stand Keyboard Single", "2 Unit Standbook", "6 Unit Mic Wireless Sennheiser EWD", "4 Unit Mic Condenser (Padus)", "10 Unit Stand Mic", "1 Unit Mixing Console Midas M32", "1 Unit Midas DL32", "Audio Equipment", "Cable System", "Electricity Equipment", "4,5Jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-65i36pj6clgj8bb36kpm8b9kcormabb274o6abb36grmcc9h75gm2d316s",
    monthKey: "2026-01",
    date: "2026-01-24",
    dateLabel: "24 Jan 2026",
    venue: "Bowo RP (Riders Tulus)",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Sound system 20rb + Side Fill (Mixer FOH + Mon M32) *15Jt*\n- Backline Band Lokal + Instrument set *3Jt*\n- Riders Tulus *2,5Jt*\n*PA 20.000Watt*\n- AudioCenter Avanda 210 8Pcs\n- Audio Center Avanda 218 6 Pcs\n- Marani MIR 480I\n- Midas M32 + DL32\n*MONITOR & SIDEFILL*\n- RCF Art 315 10Pcs\n- RCF 6001 3Way 2Pcs\n- RCF 8003 2Pcs\n- RCF 8003 1 Pcs Sub Fill Drum\n- Spliter 32Ch \n- Midas M32 1Pcs\n*MICROPHONE*\n- WHM Sennheiser EWD835 6Pcs\n- Combiner Ant Sennheiser 1Pcs\n- Shure SM58 6Pcs\n- Shure SM57 6Pcs\n- Drum Set Senheiser E604\n- Shure SM81c\n- AKG C1000\n- Shure Beta 91\n- Audix D3\n- DI BoX Clark Teknik D100 set \n*BACKLINE*\n- Drum Yamaha Tour custom\n- Bass GK 1001 RB + Cab 4x10\n- Marshall JCM 900 1Pcs\n- Roland Jazz Choruss JC120\n- Roland KC 550 1Pcs\n- Roland RD 700 GX 1Pcs\n*RIDERS TULUS*\n- Drum Yamaha Tour Custom\n- Roland RD700 NX\n- IEM Sennheiser G4 2Pcs\n\n- Led 8x3\n- Lighting nanti di update",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Sound system 20rb + Side Fill (Mixer FOH + Mon M32) *15Jt", "Backline Band Lokal + Instrument set *3Jt", "Riders Tulus *2,5Jt", "PA 20.000Watt", "Midas M32 + DL32", "MONITOR & SIDEFILL", "RCF Art 315 10Pcs", "RCF 6001 3Way 2Pcs", "RCF 8003 2Pcs", "RCF 8003 1 Pcs Sub Fill Drum", "Spliter 32Ch", "Midas M32 1Pcs", "MICROPHONE", "WHM Sennheiser EWD835 6Pcs", "Combiner Ant Sennheiser 1Pcs", "Shure SM58 6Pcs", "Shure SM57 6Pcs", "Drum Set Senheiser E604", "Shure SM81c", "AKG C1000", "Shure Beta 91", "Audix D3", "DI BoX Clark Teknik D100 set", "Drum Yamaha Tour custom", "Marshall JCM 900 1Pcs", "Roland Jazz Choruss JC120", "Roland KC 550 1Pcs", "Roland RD 700 GX 1Pcs", "RIDERS TULUS", "Drum Yamaha Tour Custom", "Roland RD700 NX", "IEM Sennheiser G4 2Pcs"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "AudioCenter Avanda 210 8Pcs",
        ["AudioCenter Avanda 210 8Pcs", "Audio Center Avanda 218 6 Pcs", "Marani MIR 480I", "Bass GK 1001 RB + Cab 4x10", "Led 8x3"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting nanti di update",
        ["Lighting nanti di update"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-53pddi83hk37650uim2brhjmoo",
    monthKey: "2026-01",
    date: "2026-01-24",
    dateLabel: "24 Jan 2026",
    venue: "Epiz Royal tulip",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "DP 8JT (7 Jan 2026)\nLampiran Google Calendar: INV_EPIZ_ROYAL TULIP_24 JANUARI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_EPIZ_ROYAL TULIP_24 JANUARI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-hic0m6avqmmh95qk1466ki66ss",
    monthKey: "2026-01",
    date: "2026-01-24",
    dateLabel: "24 Jan 2026",
    venue: "Hidew caffe sound 3rb",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Hidew caffe sound 3rb",
        ["Hidew caffe sound 3rb"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-oion3iof13h0n8tvpcfui1lsn0",
    monthKey: "2026-01",
    date: "2026-01-24",
    dateLabel: "24 Jan 2026",
    venue: "Vacenk tambud POSTPONE",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Vacenk tambud POSTPONE (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4f9jnnobc8mn2pb9ugsbgf3l58",
    monthKey: "2026-01",
    date: "2026-01-26",
    dateLabel: "26 Jan 2026",
    venue: "INFINITE",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Raffless 20 Januari- Sound 5000 - Lighting Fresnel 4Moving Beam 6 Parled 4",
    sections: [
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["Raffless 20 Januari- ⁠Sound 5000 - Lighting Fresnel 4Moving Beam 6 Parled 4"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6kp3gchgcor3eb9k68o66b9kc8o38b9ocgs36bb575h3gohg6kpjidr36c",
    monthKey: "2026-01",
    date: "2026-01-26",
    dateLabel: "26 Jan 2026",
    venue: "MEETING IWAN JAMSOSTEK",
    loadingSchedule: "JAM 1 SIANG",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "bos senin ada undangan rapat tapi di menara Jamsostek, buat acara PRJ infonya 3 day yg mereka sewa sound/ led \nJAM 1 SIANG",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["bos senin ada undangan rapat tapi di menara Jamsostek, buat acara PRJ infonya 3 day yg mereka sewa sound/ led", "JAM 1 SIANG"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6lgm8d1p69i66b9lckrjcb9k64p3ebb26cp6cb9hcpijac9nclhjaob2c8",
    monthKey: "2026-01",
    date: "2026-01-26",
    endDate: "2026-01-27",
    dateLabel: "26-27 Jan 2026",
    venue: "Rakernas RI Green Forest",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*Sound 2000*\n- Art 4\n- EWD 6\n- M32R",
    sections: [
      createSection(
        "Audio",
        "Sound 2000",
        ["Sound 2000", "Art 4", "EWD 6", "M32R"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-khrfsskrr1v4adf7d34d7mtc3o",
    monthKey: "2026-01",
    date: "2026-01-26",
    endDate: "2026-01-27",
    dateLabel: "26-27 Jan 2026",
    venue: "Syamsul ROYAL TULIP",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Led 7x4",
    sections: [
      createSection(
        "Videotron",
        "Led 7x4",
        ["Led 7x4"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1abirb8ce8dvo9gpob5qvesop5",
    monthKey: "2026-01",
    date: "2026-01-28",
    dateLabel: "28 Jan 2026",
    venue: "IWAN PT. GOSION",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "DP 15JT 23 JAN 2026\nPODIUM TAKE OUT\nLampiran Google Calendar: QUO_PAK IWAN JR.VISUAL_PT GOSION GREEN ENERGY_28 Januari 2026.Rev1.pdf",
    sections: [
      createSection(
        "Produksi",
        "PODIUM TAKE OUT",
        ["PODIUM TAKE OUT"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-corm8o9hccp30b9gcgpm2b9k6gp3eb9p6csjab9g75hj2dpmcdijeor3ck",
    monthKey: "2026-01",
    date: "2026-01-29",
    dateLabel: "29 Jan 2026",
    venue: "Adin",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Adin",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tgl 29 januari di hotel borobudur 15rb",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Adin (Menunggu Detail / Assessment Spek Admin)"],
        ["Adin"],
        []
      ),
    ],
  },
  {
    id: "gcal-70pjid36cpj3eb9n74p68b9k6lgmcb9pccsj6b9m6grjechp69i32p1o6o",
    monthKey: "2026-01",
    date: "2026-01-29",
    dateLabel: "29 Jan 2026",
    venue: "Meeting deboer jam 9",
    loadingSchedule: "jam 9",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "https://share.google/SnkKIkSE4v2LduN9j",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Meeting deboer jam 9 (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2hn7r1794tkkfadjfsuepgu2h0",
    monthKey: "2026-01",
    date: "2026-01-30",
    dateLabel: "30 Jan 2026",
    venue: "ANGGA PAK AKBAR RAGUNAN (jgn pake baju riz)",
    loadingSchedule: "Loading time: | Jam 19.30",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Loading time:\nKamis, 29 Januari 2026\nJam 19.30\n\nJadinya masuk malam gak jadi pagi\nBawain Kabel MIC 20pcs\nLampiran Google Calendar: INV_PAK AKBAR SHERE KHAN_RAGUNAN_30 JANUARI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Bawain Kabel MIC 20pcs",
        ["Bawain Kabel MIC 20pcs"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2fqm3583ucjeji22oo882eblj0",
    monthKey: "2026-01",
    date: "2026-01-31",
    dateLabel: "31 Jan 2026",
    venue: "Andara Tsi",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Andara Tsi (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-68rjao9n74pj6b9gcdgj6b9k6gs6cb9o68o66b9i6dj62d9gclgj6c1k6k",
    monthKey: "2026-01",
    date: "2026-01-31",
    dateLabel: "31 Jan 2026",
    venue: "Raka booking",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound 10.000 + backline + 6 IEM + lighting (Beam 4/6) 15.000.000 \nGak usah pake JC\nRequest RD700NX\nDP Masuk Tgl 17 8.175.000",
    sections: [
      createSection(
        "Audio",
        "Request RD700NX",
        ["Request RD700NX", "DP Masuk Tgl 17 8.175.000"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["Sound 10.000 + backline + 6 IEM + lighting (Beam 4/6) 15.000.000", "Gak usah pake JC"],
        [],
        []
      ),
    ],
  },
  // ============================================================================
  // BULAN FEBRUARI 2026 (GOOGLE CALENDAR SYNC)
  // ============================================================================
  {
    id: "gcal-74pjep35c8rjcb9lcorj8b9k65gmab9o6go64b9h64oj8cr66grjed326g",
    monthKey: "2026-02",
    date: "2026-02-02",
    dateLabel: "2 Feb 2026",
    venue: "Rebing grand Cempaka",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tgl 2 Feb\nWedding Siva & Karim\nThe Tavia Riverside Resort \nSound 5000 watt\nStand gitar",
    sections: [
      createSection(
        "Audio",
        "Sound 5000 watt",
        ["Sound 5000 watt", "Stand gitar"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2krktovc1a1j520m5e02u79m1q",
    monthKey: "2026-02",
    date: "2026-02-02",
    dateLabel: "2 Feb 2026",
    venue: "rivo",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "rul tgl 2 pullman HI, jadinya Streaming 1 kamera, 1 ptz, lighting, LED 6x3, dudukan 1 m, sound 3rb, genset",
    sections: [
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["rul tgl 2 pullman HI, jadinya Streaming 1 kamera, 1 ptz, lighting, LED 6x3, dudukan 1 m, sound 3rb, genset"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0k35mahrnf5hn4olmuibukrikt",
    monthKey: "2026-02",
    date: "2026-02-04",
    dateLabel: "4 Feb 2026",
    venue: "Andry BTN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_ PAK ANDRY LESMANA_MENARA BTN_5 FEB 2026 REV 1.xlsx",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_ PAK ANDRY LESMANA_MENARA BTN_5 FEB 2026 REV 1.xlsx"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4uvn57vqtiu7holfnfp7p37ui6",
    monthKey: "2026-02",
    date: "2026-02-04",
    dateLabel: "4 Feb 2026",
    venue: "Sasta",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Sasta (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3khavckpfb2kp7ltt7srkqma9l",
    monthKey: "2026-02",
    date: "2026-02-04",
    endDate: "2026-02-05",
    dateLabel: "4-5 Feb 2026",
    venue: "Vacenk Order Alana",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "'- LED Ukuran Menyusul",
    sections: [
      createSection(
        "Videotron",
        "'- LED Ukuran Menyusul",
        ["'- LED Ukuran Menyusul"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6pi66d9p6pgjcb9mchgm6b9k64sjabb270s3gb9ncor6ap9j6kqjcdr26s",
    monthKey: "2026-02",
    date: "2026-02-05",
    endDate: "2026-02-08",
    dateLabel: "5-8 Feb 2026",
    venue: "Andreas R2R ICE BSD",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_PT. ONE HUNDRED PERCENT PRODUCTION_ICE BSD_5-8 Februari 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_PT. ONE HUNDRED PERCENT PRODUCTION_ICE BSD_5-8 Februari 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c9gj6c9pchh62bb360o3ab9k60smcbb2cph38bb6cgr6ae1j6gr6ae9jc4",
    monthKey: "2026-02",
    date: "2026-02-05",
    dateLabel: "5 Feb 2026",
    venue: "Ari Lotus",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "* HD96 + 2 DL + Optic\n* RD2000",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Ari Lotus (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0li0divtfav91bf7mvcgpssoro",
    monthKey: "2026-02",
    date: "2026-02-05",
    dateLabel: "5 Feb 2026",
    venue: "FIRMAN BACKLIGHT TMII Loading jam 13.00 dilokasi",
    loadingSchedule: "Loading jam 13.00 dilokasi",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_PAK FIRMAN BACKLIGHT_SASONO LENGGON BUDOYO TMII_5 FEBRUARI 2026.pdf",
    sections: [
      createSection(
        "Multimedia",
        "Multimedia, Cam & Live Stream",
        ["FIRMAN BACKLIGHT TMII Loading jam 13.00 dilokasi"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-42dbuou5ml2hakr32tn4igg0g0",
    monthKey: "2026-02",
    date: "2026-02-05",
    dateLabel: "5 Feb 2026",
    venue: "Fuad simplemice",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Mas aku ada kebutuhan sound lighting vj sama genset.\n5 feb. \nSound 5rb watt,\n\nLighting \nParled 2\nMoving beam 4\nFreshnel 4\n\nBackdrop 2,44 x 3,66 flooring karpet \nAbu abu\nLokasi di Kemenkes pusat di Jl Rasunasaid\nLampiran Google Calendar: QUO_PAK FUAD SIMPLE EVENT_KEMENKES_5 FEBRUARI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound 5rb watt,",
        ["Sound 5rb watt,"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["Mas aku ada kebutuhan sound lighting vj sama genset.", "5 feb.", "Parled 2", "Moving beam 4", "Freshnel 4"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Backdrop 2,44 x 3,66 flooring karpet",
        ["Backdrop 2,44 x 3,66 flooring karpet", "Abu abu", "Lokasi di Kemenkes pusat di Jl Rasunasaid"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-06rfeoek9on6nsg6stsvkgf1ne",
    monthKey: "2026-02",
    date: "2026-02-06",
    dateLabel: "6 Feb 2026",
    venue: "BTN HILTON BANDNG",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Holly land5 pcs team show\nLampiran Google Calendar: QUO_PAK MUHYI_HILTON BANDUNG_6FEB06.xlsx",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_PAK MUHYI_HILTON BANDUNG_6FEB06.xlsx"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-597uu9jh2jrbta4vtmuntdalu6",
    monthKey: "2026-02",
    date: "2026-02-06",
    dateLabel: "6 Feb 2026",
    venue: "FAUZI HOTEL LUMINOR",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- LED 3X5,5 6,6JT\n- LEVEL TINGGI 100CM 1,2JT\n- 50\" 2Standing 1,3Jt\n- Operator Sound 650rb\n- Pasang karpet\nLampiran Google Calendar: QUO_PAK FAUZI KROINDO_HOTEL LUMINOR_6 FEBRUARI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Operator Sound 650rb",
        ["Operator Sound 650rb", "Pasang karpet"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "LED 3X5,5 6,6JT",
        ["LED 3X5,5 6,6JT", "LEVEL TINGGI 100CM 1,2JT", "50\" 2Standing 1,3Jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-umis4ha3v44lqhb6s0ln0tec7g",
    monthKey: "2026-02",
    date: "2026-02-06",
    dateLabel: "6 Feb 2026",
    venue: "Rivo",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound streaming 3 cam",
    sections: [
      createSection(
        "Multimedia",
        "Sound streaming 3 cam",
        ["Sound streaming 3 cam"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6thj0e9l6tgjib9mc4r64b9k60qjab9pc9h64bb36ko3adb46oqj8d9mcc",
    monthKey: "2026-02",
    date: "2026-02-08",
    dateLabel: "8 Feb 2026",
    venue: "Rebing TMII",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Drum Yamaha Tour custom \n- Bass GK 1001 RB + Cab 4x10 \n- Marshall JCM 900 2 unit\n- Mic Drum Set Senn E604 \n- Di Box 8 unit\n- Mic Shure SLXD Beta58 4 unit\n- stand micr 8\n- *Total 5jt",
    sections: [
      createSection(
        "Audio",
        "Drum Yamaha Tour custom",
        ["Drum Yamaha Tour custom", "Marshall JCM 900 2 unit", "Mic Drum Set Senn E604", "Di Box 8 unit", "Mic Shure SLXD Beta58 4 unit", "stand micr 8", "Total 5jt"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "Bass GK 1001 RB + Cab 4x10",
        ["Bass GK 1001 RB + Cab 4x10"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2ilpeq68hna15oomehobt5q6hg",
    monthKey: "2026-02",
    date: "2026-02-09",
    dateLabel: "9 Feb 2026",
    venue: "Pak Winardy",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*PA 10.000Watt*\n- AudioCenter Avanda 210 4Pcs\n- Audio Center Avanda 218 2 Pcs\n- Marani MIR 480I\n- Midas M32+DL32\n*MONITOR*\n- RCF Art 315 8Pcs\n*MICROPHONE*\n- WHM Sennheiser EWD835 / Shure SLXD / Beta58  4Pcs\n- Drum Set Senheiser E604\n- AKG C1000 3Pcs\n- Shure Beta 91\n- DI BoX set \n*BACKLINE*\n- Drum Yamaha Tour custom\n- Roland RD 700 NX 1Pcs\n*OTHER*\n- IEM Sennheiser G4 4Pcs\n- Combinner AC 41 1Pcs\n- Genset 60KVA + Kabel\nLampiran Google Calendar: INV_BAPAK WINARDY_GADOG_9 FEBBRUARI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "PA 10.000Watt",
        ["PA 10.000Watt", "Midas M32+DL32", "MONITOR", "RCF Art 315 8Pcs", "MICROPHONE", "WHM Sennheiser EWD835 / Shure SLXD / Beta58  4Pcs", "Drum Set Senheiser E604", "AKG C1000 3Pcs", "Shure Beta 91", "DI BoX set", "Drum Yamaha Tour custom", "Roland RD 700 NX 1Pcs", "OTHER", "IEM Sennheiser G4 4Pcs", "Combinner AC 41 1Pcs"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "AudioCenter Avanda 210 4Pcs",
        ["AudioCenter Avanda 210 4Pcs", "Audio Center Avanda 218 2 Pcs", "Marani MIR 480I"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Genset 60KVA + Kabel",
        ["Genset 60KVA + Kabel"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4mqbc70h0gdn1d79602sptad3c",
    monthKey: "2026-02",
    date: "2026-02-09",
    dateLabel: "9 Feb 2026",
    venue: "Rivo Westin",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tfl 9 westin, \n- streaming 3 Cam  \n- soumd 5rb \n- led 6x3 Level tinggi 1,5 \n-  lighting beam 4 , parled 8, freshnel 4 \n- genset 60Kva",
    sections: [
      createSection(
        "Videotron",
        "led 6x3 Level tinggi 1,5",
        ["led 6x3 Level tinggi 1,5"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["lighting beam 4 , parled 8, freshnel 4"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "streaming 3 Cam",
        ["streaming 3 Cam", "soumd 5rb"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "genset 60Kva",
        ["genset 60Kva"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-n9n6khd7m7vdhtitaa1ne9e118",
    monthKey: "2026-02",
    date: "2026-02-09",
    dateLabel: "9 Feb 2026",
    venue: "Rivo Wismul",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tgl 9 wismul, streaming 3 Cam, sound 3000, Lighting par 8, Fresnel 2",
    sections: [
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["Tgl 9 wismul, streaming 3 Cam, sound 3000, Lighting par 8, Fresnel 2"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-65h7iltes7q2ce0383e679008c",
    monthKey: "2026-02",
    date: "2026-02-10",
    endDate: "2026-02-12",
    dateLabel: "10-12 Feb 2026",
    venue: "Syamsul le eminance",
    loadingSchedule: "Loading 9 Feb Malam jam 19.00",
    pic: "Wigi (Dedi Agus Wigiantoro)",
    status: "Selesai",
    gcalSynced: true,
    notes: "*10-11 Feb Le Eminance Hotel Bogor* Wigi & Team\n- Loading 9 Feb Malam jam 19.00\n- LED 4x7 Meter\nLampiran Google Calendar: INV_PAK SYAMSUL_LE EMINANCE_10-12 FEBRUARI 2026.pdf",
    sections: [
      createSection(
        "Videotron",
        "LED 4x7 Meter",
        ["LED 4x7 Meter"],
        ["Wigi"],
        []
      ),
    ],
  },
  {
    id: "gcal-6setiel0ktl1m4c5aeajr8e2qq",
    monthKey: "2026-02",
    date: "2026-02-10",
    dateLabel: "10 Feb 2026",
    venue: "TMII (ALVIAN)",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: TMII (ALVIAN) (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-jeca1e488nodcsfbej29evgtc4",
    monthKey: "2026-02",
    date: "2026-02-11",
    dateLabel: "11 Feb 2026",
    venue: "Halim kawah do",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Halim kawah do (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4nj9dcfo845f84k9sqs56dhsqg",
    monthKey: "2026-02",
    date: "2026-02-11",
    endDate: "2026-02-12",
    dateLabel: "11-12 Feb 2026",
    venue: "MAXINDO (PULLMAN GADOG)",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: MAXINDO (PULLMAN GADOG) (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1e364rmtqnqneq8pisnqt9k8a1",
    monthKey: "2026-02",
    date: "2026-02-11",
    dateLabel: "11 Feb 2026",
    venue: "evo aston puncak",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: evo aston puncak (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5n1mmudtgai3k12uu19pdk7r61",
    monthKey: "2026-02",
    date: "2026-02-12",
    dateLabel: "12 Feb 2026",
    venue: "DEBOER AROEM MAHAKAM",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: DEBOER AROEM MAHAKAM (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-20hnhdhptma6ju5k003bei0tfr",
    monthKey: "2026-02",
    date: "2026-02-12",
    dateLabel: "12 Feb 2026",
    venue: "INDRA RPN PESONA ALAM",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "LED = 24 x 600.000 = 14.400.000\nLevel = 8 x 250.000 = 2.000.000\nLighting = 2.000.000\nGenset = 3.000.000\nTotal = 21.400.000\nLampiran Google Calendar: INV_RPN_PESONA ALAM_12 FEBRUARI 2026.pdf",
    sections: [
      createSection(
        "Videotron",
        "LED  x 600.000",
        ["LED  x 600.000", "Level  x 250.000"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting",
        ["Lighting"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Genset",
        ["Genset", "Total"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3pknpdsj1d6d1m64ccetlnl2po",
    monthKey: "2026-02",
    date: "2026-02-12",
    dateLabel: "12 Feb 2026",
    venue: "MAS DEDI DUMECA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_DEDI DUMECA_SAHID HOTEL CIKARANG_12 FEBRUARI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_DEDI DUMECA_SAHID HOTEL CIKARANG_12 FEBRUARI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-ce8hcabhnvbf7vdje6o8i84538",
    monthKey: "2026-02",
    date: "2026-02-12",
    dateLabel: "12 Feb 2026",
    venue: "Rebing tavia",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Rebing tavia (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-k8e4agns7eal42p1km4p0guqhs",
    monthKey: "2026-02",
    date: "2026-02-13",
    dateLabel: "13 Feb 2026",
    venue: "Bagas Novotel Bogor",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Bagas Novotel Bogor (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-te3hs4tqacm38ke9hc4fr9i5q4",
    monthKey: "2026-02",
    date: "2026-02-13",
    dateLabel: "13 Feb 2026",
    venue: "Bara Pullman",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tv 50” 2 unit",
    sections: [
      createSection(
        "Multimedia",
        "Tv 50” 2 unit",
        ["Tv 50” 2 unit"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-en5pmong1ftufb2essdg58d5bk",
    monthKey: "2026-02",
    date: "2026-02-13",
    dateLabel: "13 Feb 2026",
    venue: "Sasta rs mitra keluarga Cibubur",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Led 4 x 2 \nLevel 50 cm \nSound 1000 Whm 4",
    sections: [
      createSection(
        "Audio",
        "Sound 1000 Whm 4",
        ["Sound 1000 Whm 4"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "Led 4 x 2",
        ["Led 4 x 2", "Level 50 cm"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-spq3se3ec1i6d5cm9on68duols",
    monthKey: "2026-02",
    date: "2026-02-14",
    dateLabel: "14 Feb 2026",
    venue: "Ghele",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lighting 34jt\nDP 15JT \n\n*LIGHTING*\n- BEAM / BSW 30 unit\n- STORMY 26 unit\n- BEYE 12 unit\n- PARLED FULL COLOR 16 unit\n- FRESNEL 12 unit\n- MINI BRUTE/BLINDER 4 eye 16 unit\n- HAZE MACHINE 4 unit\n- SMOKE MACHINE 2 unit\n- FOLLOW SPOT 1 unit\n- CONSOLE by MA",
    sections: [
      createSection(
        "Lighting",
        "Lighting 34jt",
        ["Lighting 34jt", "BEAM / BSW 30 unit", "STORMY 26 unit", "BEYE 12 unit", "PARLED FULL COLOR 16 unit", "FRESNEL 12 unit", "MINI BRUTE/BLINDER 4 eye 16 unit", "HAZE MACHINE 4 unit", "SMOKE MACHINE 2 unit", "FOLLOW SPOT 1 unit", "CONSOLE by MA"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1dflbpho7fj8gv9cc74sus20b3",
    monthKey: "2026-02",
    date: "2026-02-14",
    endDate: "2026-02-15",
    dateLabel: "14-15 Feb 2026",
    venue: "JIEXPO MAXINDO",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "P3.9 outdoor 4x6\n14-15 jiexpo",
    sections: [
      createSection(
        "Videotron",
        "P3.9 outdoor 4x6",
        ["P3.9 outdoor 4x6", "14-15 jiexpo"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-adadvun88pk44kvvlrj7jol4g8",
    monthKey: "2026-02",
    date: "2026-02-14",
    dateLabel: "14 Feb 2026",
    venue: "Kck equity tower",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Kck equity tower (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-coq38phh6hj3gb9g6somab9kc8o38b9oc8s3gb9k6ti62p9lc8q32eb26g",
    monthKey: "2026-02",
    date: "2026-02-15",
    dateLabel: "15 Feb 2026",
    venue: "Boy order loading jam 22.00",
    loadingSchedule: "loading jam 22.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*Spek Lighting 1.7Jt*\n- Parled 2Bar (8Pcs)\n- Standing Lighting \n- Smoke Machine",
    sections: [
      createSection(
        "Lighting",
        "Spek Lighting 1.7Jt",
        ["Spek Lighting 1.7Jt", "Parled 2Bar (8Pcs)", "Standing Lighting", "Smoke Machine"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-ef5fsnlodda5dafn8m9gip8od4",
    monthKey: "2026-02",
    date: "2026-02-26",
    dateLabel: "26 Feb 2026",
    venue: "Firman Trisakti",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound 5rb \nLighting godox",
    sections: [
      createSection(
        "Audio",
        "Sound 5rb",
        ["Sound 5rb"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting godox",
        ["Lighting godox"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0p6ch9c3rd08upmvib9l18d5ac",
    monthKey: "2026-02",
    date: "2026-02-26",
    dateLabel: "26 Feb 2026",
    venue: "Ps BDX",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Ps BDX (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-ikujmm1f2b7pg9deb2217ouid0",
    monthKey: "2026-02",
    date: "2026-02-27",
    dateLabel: "27 Feb 2026",
    venue: "Bagas hotel sultan",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Bagas hotel sultan (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c93ose5nr34l3udad52685uehs",
    monthKey: "2026-02",
    date: "2026-02-27",
    dateLabel: "27 Feb 2026",
    venue: "Evo Pullman Gadog",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "tgl 27 Februari Pullman Hotel / Lokasi Terrace Garden / batas listrik hotel 3000 watt / loading tgl 26 Februari 2026. \n\nSound 3000 watt \nLignting standar \nGenset kecil aja \nPhotoboth 2,5*3 meter \n\nmas ini udh confirm ia..",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["tgl 27 Februari Pullman Hotel / Lokasi Terrace Garden / batas listrik hotel 3000 watt / loading tgl 26 Februari 2026.", "Sound 3000 watt", "Lignting standar"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Genset kecil aja",
        ["Genset kecil aja", "Photoboth 2,5*3 meter", "mas ini udh confirm ia.."],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-okjn2mqb4avvi6oovsdp8dt2tg",
    monthKey: "2026-02",
    date: "2026-02-27",
    dateLabel: "27 Feb 2026",
    venue: "Meeting pak firman uqi",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Meeting pak firman uqi (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2csbn8j543qs91ou3kmvc5t67s",
    monthKey: "2026-02",
    date: "2026-02-27",
    endDate: "2026-02-28",
    dateLabel: "27-28 Feb 2026",
    venue: "Syamsul (TENTATIVE)",
    loadingSchedule: "Loading 10 Malam jam 19:00",
    pic: "Wigi (Dedi Agus Wigiantoro)",
    status: "Selesai",
    gcalSynced: true,
    notes: "*11-12 Feb Aston Kemayoran (Syamsul)* \nLoading 10 Malam jam 19:00 \n- *Led*\n- Led 2x5 \n- Level tinggi 50 cm \n- Crew : Wigi, Kharo, woyo\n- Crew Standby : Wigi, Kharo\n- Mobil : Riz",
    sections: [
      createSection(
        "Videotron",
        "Led 2x5",
        ["Led 2x5", "Level tinggi 50 cm", "Crew : Wigi, Kharo, woyo", "Crew Standby : Wigi, Kharo", "Mobil : Riz"],
        ["Wigi", "Kharo"],
        []
      ),
    ],
  },
  // ============================================================================
  // BULAN MARET 2026 (GOOGLE CALENDAR SYNC)
  // ============================================================================
  {
    id: "gcal-0ltqkqudogo2bv63di5th7kva0",
    monthKey: "2026-03",
    date: "2026-03-01",
    dateLabel: "1 Mar 2026",
    venue: "Bowo",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Siang bos buat tgl 1 Maret \nSound 5rb + drum set + RD 700 NX + 3 IEM\n\nbrp buat di warkopolim bogor",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Sound 5rb + drum set + RD 700 NX + 3 IEM", "brp buat di warkopolim bogor"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4u0eud0rjd8dgabcu7okuvai2e",
    monthKey: "2026-03",
    date: "2026-03-02",
    dateLabel: "2 Mar 2026",
    venue: "BRINS BUKBER MB.LT3",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_PAK EDO_BRILIANT_BUKBER_2MAR2026.xlsx",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_PAK EDO_BRILIANT_BUKBER_2MAR2026.xlsx"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-tv6b0s1hp927jn0uasuk04ecp0",
    monthKey: "2026-03",
    date: "2026-03-02",
    dateLabel: "2 Mar 2026",
    venue: "Revo bi",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Revo bi (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6tij6c1mcgpj8b9pc9i64b9kc4sm6bb1chgj2b9ncco6ap9g6sqm4ob174",
    monthKey: "2026-03",
    date: "2026-03-04",
    dateLabel: "4 Mar 2026",
    venue: "Bukber Gabungan RI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Bukber Gabungan RI (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6him6d9n6sqm8b9ockom4b9k71gj6bb1cksj8b9ic8o30cpgckojgor264",
    monthKey: "2026-03",
    date: "2026-03-07",
    dateLabel: "7 Mar 2026",
    venue: "Andreas",
    loadingSchedule: "Loading 7 pagi jam 09.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*7 Maret GPIB Imanuel Bekasi*\n- Loading 7 pagi jam 09.00\n- Parled RGBW 20x10watt 4Pcs\n- Moving Beam 450Watt 4Pcs\n- Minibrute 3Pcs\n- Smoke Machine\n- Avolite Tiger Touch\n- Tripod Lighting 2Pcs",
    sections: [
      createSection(
        "Lighting",
        "Parled RGBW 20x10watt 4Pcs",
        ["Parled RGBW 20x10watt 4Pcs", "Moving Beam 450Watt 4Pcs", "Minibrute 3Pcs", "Smoke Machine", "Avolite Tiger Touch", "Tripod Lighting 2Pcs"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-58851rfctdtosemrd4vmljlee9",
    monthKey: "2026-03",
    date: "2026-03-07",
    dateLabel: "7 Mar 2026",
    venue: "GPIB",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_GPIB_IMANUEL BEKASI_7 MARET 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_GPIB_IMANUEL BEKASI_7 MARET 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-mikhqcms6cren15l8cuog9dahg",
    monthKey: "2026-03",
    date: "2026-03-08",
    dateLabel: "8 Mar 2026",
    venue: "Andara",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tb Simatupang",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Andara (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-ic563eoselgibv9trqp4uhnm2g",
    monthKey: "2026-03",
    date: "2026-03-09",
    dateLabel: "9 Mar 2026",
    venue: "Adin kuningan",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Adin",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Adin kuningan (Menunggu Detail / Assessment Spek Admin)"],
        ["Adin"],
        []
      ),
    ],
  },
  {
    id: "gcal-brqhk23jgpr9gsruf2q912a4ic",
    monthKey: "2026-03",
    date: "2026-03-09",
    dateLabel: "9 Mar 2026",
    venue: "Syamsul",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "LED 5x2 (Sainath Tower LT 11) Tgl 9 Maret",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["LED 5x2 (Sainath Tower LT 11) Tgl 9 Maret"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-a9ni6g0n88rcgks0i724k0a53g",
    monthKey: "2026-03",
    date: "2026-03-10",
    dateLabel: "10 Mar 2026",
    venue: "R2R Mercure Gatsu",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Led 3x2\nLampiran Google Calendar: INV_KARIMAKE_PAK REZKA RAINALDI_MERCURE GATOT SUBROTO_10 MARET 2026.pdf",
    sections: [
      createSection(
        "Videotron",
        "Led 3x2",
        ["Led 3x2"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3r36hcffabfaujhn8hsibgb91c",
    monthKey: "2026-03",
    date: "2026-03-10",
    dateLabel: "10 Mar 2026",
    venue: "Tyo",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Tyo (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-kn91iu1qsme75rpo7gjp06tpgc",
    monthKey: "2026-03",
    date: "2026-03-11",
    dateLabel: "11 Mar 2026",
    venue: "Aldo",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Aldo (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-helbhr20dgt8t22stsv64tu3kk",
    monthKey: "2026-03",
    date: "2026-03-11",
    dateLabel: "11 Mar 2026",
    venue: "Digipro (https://maps.google.com/maps/place//data=!4m2!3m1!1s0x2e69f1de8daed21f:0xac9ec6d696b52ed?entry=s&sa=X&ved=2ahUKEwiOqtSWo4uTAxV_zTgGHUzbMzUQ4kB6BAgVEAA&hl=en)",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound 3.000 ( untuk band acuistik)\n\nLighting : Parled 2bar, Freshnell 4, Beam 2",
    sections: [
      createSection(
        "Audio",
        "Sound 3.000 ( untuk band acuistik)",
        ["Sound 3.000 ( untuk band acuistik)"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["Lighting : Parled 2bar, Freshnell 4, Beam 2"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c8ojadb4c4o3cb9oc8pj8b9kcoqmcbb1cdj3ab9m60p30e1l74rmcd9p74",
    monthKey: "2026-03",
    date: "2026-03-12",
    dateLabel: "12 Mar 2026",
    venue: "Juntow",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "tanggal 12 pengen pinjem om,\nkena berapa ya om\nmixer M32r\nDI box 4 unit\nsama cable mic dan jack to jack 10 unit gitu om.",
    sections: [
      createSection(
        "Audio",
        "kena berapa ya om",
        ["kena berapa ya om", "mixer M32r", "DI box 4 unit", "sama cable mic dan jack to jack 10 unit gitu om."],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-g9j4j51s0ccgn9u27m2ffjp9fk",
    monthKey: "2026-03",
    date: "2026-03-12",
    dateLabel: "12 Mar 2026",
    venue: "Syamsul",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "LED 4x2 + Level T. 100cm (Grand Anara) 12 Maret",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["LED 4x2 + Level T. 100cm (Grand Anara) 12 Maret"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-kiatuqekva3durh979iqr2985o",
    monthKey: "2026-03",
    date: "2026-03-13",
    dateLabel: "13 Mar 2026",
    venue: "Ghele Jagakarsa",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Ghele Jagakarsa (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-51aa241kto9o5nsdjgcuam9jvh",
    monthKey: "2026-03",
    date: "2026-03-13",
    dateLabel: "13 Mar 2026",
    venue: "PENGIRIMAN HAMPERS CLIENT",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: PENGIRIMAN HAMPERS CLIENT (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-13ch8qmbs2h57i1a2cnocr0pvn",
    monthKey: "2026-03",
    date: "2026-03-14",
    dateLabel: "14 Mar 2026",
    venue: "ANGGA ORDER",
    loadingSchedule: "Loading",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Event pameran\nSabtu, 14 Maret 2026\n15.00 s.d. 21.00\nIntermoda \nBSD\nLoading\n06.00\n\nA. Sound 10rb watt\nMain PA:\n2 Unit 3way RCF 6001\n2 Unit Sub AudioCentre KLA 218\n\nDelay:\n2 Unit dBTech Opera15 \n\nMonitor:\n2 Unit dBTech Opera15 \n\n\n1 Unit Mixer Digital M32R\n1 Unit DL32 \n\n4 Unit Mic Wireless \n1 Set Anthena Directional \n2 Unit Mic Cable \n\nAudio Equipment\n4,5Jt",
    sections: [
      createSection(
        "Audio",
        "A. Sound 10rb watt",
        ["A. Sound 10rb watt", "Main PA:", "2 Unit 3way RCF 6001", "2 Unit Sub AudioCentre KLA 218", "Delay:", "2 Unit dBTech Opera15", "Monitor:", "1 Unit Mixer Digital M32R", "1 Unit DL32", "4 Unit Mic Wireless", "1 Set Anthena Directional", "2 Unit Mic Cable", "Audio Equipment", "4,5Jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-g5cuqhdc5fbj2affvi4fh8v59k",
    monthKey: "2026-03",
    date: "2026-03-14",
    dateLabel: "14 Mar 2026",
    venue: "Epiz botani",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Epiz botani (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6aise0t7j98ubon4urr6b3nmn1",
    monthKey: "2026-03",
    date: "2026-03-16",
    dateLabel: "16 Mar 2026",
    venue: "bagi hampers crew",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: bagi hampers crew (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2n5ejha8bquip9htjud8kbgpl0",
    monthKey: "2026-03",
    date: "2026-03-30",
    dateLabel: "30 Mar 2026",
    venue: "MD",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: MD (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  // ============================================================================
  // BULAN APRIL 2026 (GOOGLE CALENDAR SYNC)
  // ============================================================================
  {
    id: "gcal-5sidoa1r8le6ohqol730ouko2f",
    monthKey: "2026-04",
    date: "2026-04-01",
    dateLabel: "1 Apr 2026",
    venue: "PAK JOSE IPB",
    loadingSchedule: "Loading 31 Malam",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Loading 31 Malam\n- Parled RGBW 20x10 6Pcs\n- Freshnell 300 Watt 4Pcs\n- Tripod 2Pcs\n- Avolite Quartz\nLampiran Google Calendar: INV_PAK JOSE_IPB_1 APRIL 2026.pdf",
    sections: [
      createSection(
        "Lighting",
        "Parled RGBW 20x10 6Pcs",
        ["Parled RGBW 20x10 6Pcs", "Freshnell 300 Watt 4Pcs", "Tripod 2Pcs", "Avolite Quartz"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1h6t13qiossdif46vis1jv9sqp",
    monthKey: "2026-04",
    date: "2026-04-01",
    dateLabel: "1 Apr 2026",
    venue: "PAK RIZKY INDOTWIN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_PAK RIZKY CV INDOTWIN_CITEUREUP_1 APRIL 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_PAK RIZKY CV INDOTWIN_CITEUREUP_1 APRIL 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2j0s13r4b1a4p2dk973glkgheh",
    monthKey: "2026-04",
    date: "2026-04-02",
    dateLabel: "2 Apr 2026",
    venue: "PAK WYN DEPOK",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: PAK WYN DEPOK (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7ct4aqo5vjqjb8njjhbdie1ol2",
    monthKey: "2026-04",
    date: "2026-04-02",
    dateLabel: "2 Apr 2026",
    venue: "Prasasti BRI Corpu",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Prasasti BRI Corpu (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-n72ph0tbicd1or4savjp2sklt0",
    monthKey: "2026-04",
    date: "2026-04-03",
    dateLabel: "3 Apr 2026",
    venue: "Nako alsut",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_PT NAKO KREASI BERSAMA_NAKO ALAM SUTRA_3 APRIL 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_PT NAKO KREASI BERSAMA_NAKO ALAM SUTRA_3 APRIL 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7mllftb71js8fm2uqi8tv4i10a",
    monthKey: "2026-04",
    date: "2026-04-04",
    dateLabel: "4 Apr 2026",
    venue: "PAK FIRMAN UMMUL QURO",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "DP 11JT (25 FEB 2026)\nCREW PAKAI KOKO PUTIH DAN CELANA PANJANG\nLampiran Google Calendar: INV_PAK FIRMAN FERDIAN_UMMUL QURRO_4 APRIL 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_PAK FIRMAN FERDIAN_UMMUL QURRO_4 APRIL 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-idqskmlv1pu6uci26dp5gcbk9k",
    monthKey: "2026-04",
    date: "2026-04-04",
    dateLabel: "4 Apr 2026",
    venue: "Pa Nengah",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*4 April Plaza Balai kota*\n- Sound System 5000 watt\n- Lighting : Parled 2bar, beam 6, Freshnell 4, Smoke \n- LED P3.9 2x3 + Level Tinggi 1,2 Meter  2Unit\nLampiran Google Calendar: QUO_PAK NENGAH_PLAZA BALAI KOTA_4 APRIL 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System 5000 watt",
        ["Sound System 5000 watt"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["LED P3.9 2x3 + Level Tinggi 1,2 Meter  2Unit"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["Lighting : Parled 2bar, beam 6, Freshnell 4, Smoke"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5peiqrhoa9ne6pinkaoqtmum4q",
    monthKey: "2026-04",
    date: "2026-04-04",
    dateLabel: "4 Apr 2026",
    venue: "Rebing Jatibening",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Rebing Jatibening (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3mcvk0l9dujuuabh0aafsrkdgk",
    monthKey: "2026-04",
    date: "2026-04-06",
    dateLabel: "6 Apr 2026",
    venue: "REVO INTERCON",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "SOUND 3RB",
    sections: [
      createSection(
        "Audio",
        "SOUND 3RB",
        ["SOUND 3RB"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6js10pq96ib8gb2bjndlrodj8j",
    monthKey: "2026-04",
    date: "2026-04-07",
    dateLabel: "7 Apr 2026",
    venue: "KCK",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_KCK_GRAHA PHONSKA_7 APRIL 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_KCK_GRAHA PHONSKA_7 APRIL 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3j0fsvi1ttlg91i3vmee0mju5o",
    monthKey: "2026-04",
    date: "2026-04-08",
    endDate: "2026-04-10",
    dateLabel: "8-10 Apr 2026",
    venue: "Pak donny Flow",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Pak donny Flow (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-71i3coj6cpj6cbb1cgr3ib9kcooj4bb2cks3ibb1c5j32d35cop68ob374",
    monthKey: "2026-04",
    date: "2026-04-08",
    dateLabel: "8 Apr 2026",
    venue: "Rapat Pengurus RI KAS pro jam 12.00",
    loadingSchedule: "jam 12.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Rapat Pengurus RI KAS pro jam 12.00 (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6csmcpb268sm6b9mc8r3ab9k71i36b9o6hhmcbb675hm4cb2c4p6aopp74",
    monthKey: "2026-04",
    date: "2026-04-08",
    endDate: "2026-04-10",
    dateLabel: "8-10 Apr 2026",
    venue: "Sasta",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_SASTA_PENDOPO GUBERNUR BANTEN_10 APRIL 2026.pdf, QUO_SASTA_UNIV TIRTAYASA BANTEN_8-9 APRIL 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_SASTA_PENDOPO GUBERNUR BANTEN_10 APRIL 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4hq5kdhu687p2tmdvi8v0o307i",
    monthKey: "2026-04",
    date: "2026-04-09",
    dateLabel: "9 Apr 2026",
    venue: "PAK SYAMSUL PLATARAN SENAYAN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "LED 8x3 Level T.100cm",
    sections: [
      createSection(
        "Videotron",
        "LED 8x3 Level T.100cm",
        ["LED 8x3 Level T.100cm"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6th38c346gsm6b9ncorj0b9k74q68bb175ij8b9o6pgmadpn6pj38oph6o",
    monthKey: "2026-04",
    date: "2026-04-10",
    dateLabel: "10 Apr 2026",
    venue: "Evan taman Ismail Marzuki",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Evan taman Ismail Marzuki (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6gq32e9g69hjgb9m70s34b9kc8r30bb16srj0b9n6ph62cpkcks3cdhhck",
    monthKey: "2026-04",
    date: "2026-04-10",
    dateLabel: "10 Apr 2026",
    venue: "Evo pullman Ciawi TBC",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Evo pullman Ciawi TBC (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6cp3cd9mcoq64b9jc4pj0b9k6orj0bb271j3ebb4cdij2dr3cdimco9gcc",
    monthKey: "2026-04",
    date: "2026-04-10",
    dateLabel: "10 Apr 2026",
    venue: "INDRA Aston Kemayoran",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "videotron 3x6\n\nbeam 4\nparled 8\nStromy RGB\noperator",
    sections: [
      createSection(
        "Videotron",
        "videotron 3x6",
        ["videotron 3x6"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "beam 4",
        ["beam 4", "parled 8", "Stromy RGB", "operator"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6vuj5abft5la2ijthli56j2n20",
    monthKey: "2026-04",
    date: "2026-04-10",
    dateLabel: "10 Apr 2026",
    venue: "KCK NEO TENIS TOMANG",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tennis (9 April)\n1. Speaker 2 unit + WHM 2 unit + Mini mixer - Area Prescon\n\nTennis (9-10 April)\n1. Main Speaker Stage \n2. Delay Speaker 4 court 8 unit\n3. WHM 2 unit\n4. Skintone Mic 4 unit",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["1. Speaker 2 unit + WHM 2 unit + Mini mixer - Area Prescon", "Tennis (9-10 April)", "2. ⁠Delay Speaker 4 court 8 unit", "3. ⁠WHM 2 unit", "4. ⁠Skintone Mic 4 unit"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "1. Main Speaker Stage",
        ["1. Main Speaker Stage"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3ipqq5lpl2qaodlel6ci6kn4cb",
    monthKey: "2026-04",
    date: "2026-04-10",
    dateLabel: "10 Apr 2026",
    venue: "Syamsul Graha angkasa pura",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "led 7 x 3 level 100cm",
    sections: [
      createSection(
        "Videotron",
        "led 7 x 3 level 100cm",
        ["led 7 x 3 level 100cm"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-chimce3474pjgbb370ojib9k70qj4bb26or3ab9l74p3gohkc9h36oppc4",
    monthKey: "2026-04",
    date: "2026-04-10",
    dateLabel: "10 Apr 2026",
    venue: "Vacenk Neo",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "tgl 10 april Led 2x3m buat di sentul neo hotel aman?\nBudget 3Jt",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["tgl 10 april Led 2x3m buat di sentul neo hotel aman?"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1u9hb6c8emb7pt5ho19n96a0ak",
    monthKey: "2026-04",
    date: "2026-04-11",
    dateLabel: "11 Apr 2026",
    venue: "KCK LUBANA SENGKOL BSD",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Mancing (11 April)\n1. Main Speaker Stage Groundstack - Home Band (dibox)\n2. Keyboard + Stand\n3. WHM 4 unit\n4. Monitor Speaker\n\nGames Mancing \n1. Main control di area Juri posisi tengah/dekat pintu\n2. Sebaran Speaker 8 unit (area total sekitar 40m kanan kiri) jarak antara speaker 10m",
    sections: [
      createSection(
        "Audio",
        "2. ⁠Keyboard + Stand",
        ["2. ⁠Keyboard + Stand", "3. ⁠WHM 4 unit", "4. ⁠Monitor Speaker", "Games Mancing", "1. Main control di area Juri posisi tengah/dekat pintu", "2. ⁠Sebaran Speaker 8 unit (area total sekitar 40m kanan kiri) jarak antara speaker 10m"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Produksi, Rigging & Genset",
        ["1. Main Speaker Stage Groundstack - Home Band (dibox)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-30gdkrtvi7emo7ccimvp1tdl2c",
    monthKey: "2026-04",
    date: "2026-04-11",
    dateLabel: "11 Apr 2026",
    venue: "SOFTUNES CILANDAK",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "SOUND 5000",
    sections: [
      createSection(
        "Audio",
        "SOUND 5000",
        ["SOUND 5000"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-fdmk94q7pq6gq1g2vqf9t23fqk",
    monthKey: "2026-04",
    date: "2026-04-11",
    dateLabel: "11 Apr 2026",
    venue: "Unyink",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Unyim (Wahyudin)",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound 5rb + Dtx\nDP 2JT (22 FEB 2026)\nLighting\nParled 8\nBeam 4\nFresnel 2",
    sections: [
      createSection(
        "Audio",
        "Sound 5rb + Dtx",
        ["Sound 5rb + Dtx"],
        ["Unyim"],
        []
      ),
      createSection(
        "Lighting",
        "Parled 8",
        ["Parled 8", "Beam 4", "Fresnel 2"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6dim2pb2cks32b9i68o3cb9k74s3ebb269j30bb474r36eb164rj2dhp74",
    monthKey: "2026-04",
    date: "2026-04-12",
    dateLabel: "12 Apr 2026",
    venue: "Adin",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Adin",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Adin (Menunggu Detail / Assessment Spek Admin)"],
        ["Adin"],
        []
      ),
    ],
  },
  {
    id: "gcal-6so32p1l70sjcb9l6tj6cb9kc5h30bb1cko66b9kchi38c1l6hgmco9nco",
    monthKey: "2026-04",
    date: "2026-04-12",
    dateLabel: "12 Apr 2026",
    venue: "Rebing",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Mercure ancol \nSound 5000 + lighting paket standar",
    sections: [
      createSection(
        "Lighting",
        "Sound 5000 + lighting paket standar",
        ["Sound 5000 + lighting paket standar"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7qecoooiogkjikg1tjuvhl8me6",
    monthKey: "2026-04",
    date: "2026-04-13",
    dateLabel: "13 Apr 2026",
    venue: "REVO RITZ CARLTON",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_REVO_RITZCARLTON_13 April 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_REVO_RITZCARLTON_13 April 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cdi62o9h60r3eb9o6lgm8b9k6sojcbb26ti30b9l65i62e1l60s66e9ico",
    monthKey: "2026-04",
    date: "2026-04-13",
    dateLabel: "13 Apr 2026",
    venue: "Survey Ecolab jam 10.30 (PT.Ecolab international indonesia, Jl. Pahlawan No.25, Karang Asem Tim., Kec. Citeureup, Kabupaten Bogor, Jawa Barat 16810, Indonesia)",
    loadingSchedule: "jam 10.30 (PT.Ecolab international indonesia, Jl. Pahlawan No.25, Karang Asem Tim., Kec. Citeureup, Kabupaten Bogor, Jawa Barat 16810, Indonesia)",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Bawa meteran roll",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Survey Ecolab jam 10.30 (PT.Ecolab international indonesia, Jl. Pahlawan No.25, Karang Asem Tim., Kec. Citeureup, Kabupaten Bogor, Jawa Barat 16810, Indonesia) (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-28926r9smru9otm7sqr2hfc490",
    monthKey: "2026-04",
    date: "2026-04-14",
    dateLabel: "14 Apr 2026",
    venue: "ANDARA UNITED TRACTOR",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: ANDARA UNITED TRACTOR (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3sdscij1jpasuvpcbkvdt9cnfg",
    monthKey: "2026-04",
    date: "2026-04-15",
    endDate: "2026-04-17",
    dateLabel: "15-17 Apr 2026",
    venue: "PAK SYAMSUL ASTON KEMAYORAN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "LED 5x2 + Level T. 100cm",
    sections: [
      createSection(
        "Videotron",
        "LED 5x2 + Level T. 100cm",
        ["LED 5x2 + Level T. 100cm"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1j900g8isggkfmfvb2rhvp2ifu",
    monthKey: "2026-04",
    date: "2026-04-15",
    dateLabel: "15 Apr 2026",
    venue: "Pak Angga",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Event meeting\nRabu, 15 April 2026\nBallroom Grand Mercure \nAncol\n\nArtist:\nSaung Angklung Udjo\n\n\nPA: \n2 Unit RCF315 \n2 Unit Stand speaker \n\nMonitor:\n3 Unit Speaker RCF315 \n\nBackline:\n1 Set Drum Akustik Yamaha Stage/Tour\n1 Set Mic Drum\n2 Unit DI  BOX\n\nMixer:\nMidas M32R\nDL32\n\nMicrophone:\n2 Unit Mic Wireless Sennheiser EWD \n2 Unit Mic Cable SM58\n4 Unit Mic Cable SM57\n1 Lot Stand Mic\n\nMiscellaneous:\nAudio Equipment \nCable System \nElectricity System",
    sections: [
      createSection(
        "Audio",
        "Backline:",
        ["Backline:", "1 Set Drum Akustik Yamaha Stage/Tour", "1 Set Mic Drum", "2 Unit DI  BOX", "Mixer:", "Midas M32R", "DL32", "Microphone:", "2 Unit Mic Wireless Sennheiser EWD", "2 Unit Mic Cable SM58", "4 Unit Mic Cable SM57", "1 Lot Stand Mic", "Miscellaneous:", "Audio Equipment", "Cable System", "Electricity System"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-60o64d9jc4rjcb9l74rj8b9k61h38b9o6hij8b9l71ij0c9occqmaoj168",
    monthKey: "2026-04",
    date: "2026-04-16",
    endDate: "2026-04-17",
    dateLabel: "16-17 Apr 2026",
    venue: "RPN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_PTPN III_RPN_14-16 APRIL 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_PTPN III_RPN_14-16 APRIL 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6rtfopofv3naftnfq7aopijs86",
    monthKey: "2026-04",
    date: "2026-04-17",
    endDate: "2026-04-18",
    dateLabel: "17-18 Apr 2026",
    venue: "FIRMAN BACKLIGHT",
    loadingSchedule: "Loading 17 Pagi Jam 09.00 (GR jam 14.00)",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*18 April PT.HM Sampoerna Bogor*\nLoading 17 Pagi Jam 09.00 (GR jam 14.00)\n- Sound System 2000watt , Wireless Mic 8Pcs\n- Freshnell 4Unit\n- TV Matador 50\" 2Unit\n- Kabel Panel 50Meter + Panel",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Sound System 2000watt , Wireless Mic 8Pcs"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Freshnell 4Unit",
        ["Freshnell 4Unit"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "TV Matador 50\" 2Unit",
        ["TV Matador 50\" 2Unit", "Kabel Panel 50Meter + Panel"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-ckp3ed1pc4r68bb36krjib9k60s32bb1cos30b9m6grjgob4cko6ccb1ck",
    monthKey: "2026-04",
    date: "2026-04-17",
    endDate: "2026-04-18",
    dateLabel: "17-18 Apr 2026",
    venue: "Indra MPI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "day 1 2x4 = 8m2 x 600.000 = 4.800.000\nday 2 8m2 x 300.000 = 2.400.000\ntotal 7.200.000\nlevelingnya menyusul ya om bos, mereka bilang sih ga pake, tp masih belum tau dikabari senin depan pas udah masuk katanya\ntp mau dp dulu nih\n\nDP 3.2 JT\nLampiran Google Calendar: INV_PAK INDRA MPI_ALAM NGARIUNG RESORT_17 APRIL 2026.pdf",
    sections: [
      createSection(
        "Videotron",
        "day 1 2x4 m2 x 600.000",
        ["day 1 2x4 m2 x 600.000", "day 2 8m2 x 300.000", "total 7.200.000", "levelingnya menyusul ya om bos, mereka bilang sih ga pake, tp masih belum tau dikabari senin depan pas udah masuk katanya", "tp mau dp dulu nih"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6hh68ob2c4qj8b9kccrjab9kcks3ibb171j34b9h6gsjgo9m75h3ap1hco",
    monthKey: "2026-04",
    date: "2026-04-18",
    dateLabel: "18 Apr 2026",
    venue: "Divaga Sewa NX + IEM 1",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Divaga Sewa NX + IEM 1",
        ["Divaga Sewa NX + IEM 1"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6os64c336ph38b9icdi3eb9kckp34b9pcdj3cb9o69ij2c9mcdh68e9o68",
    monthKey: "2026-04",
    date: "2026-04-20",
    dateLabel: "20 Apr 2026",
    venue: "Bowo SMA 1 (Minta jordy)",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Jordy",
    status: "Selesai",
    gcalSynced: true,
    notes: "Bos tgl 20 april pagi 5rb watt + drum + keyboard loading 19 april bisa? buat di sman 1 bogor",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Bos tgl 20 april pagi 5rb watt + drum + keyboard loading 19 april bisa? buat di sman 1 bogor"],
        ["Jordy"],
        []
      ),
    ],
  },
  {
    id: "gcal-6csjgdb66gpm8bb46lj3ib9kc8oj2b9oc8smcb9k6oqj8c9p70r3iopo6g",
    monthKey: "2026-04",
    date: "2026-04-20",
    dateLabel: "20 Apr 2026",
    venue: "GS Battery Prasasti",
    loadingSchedule: "Live Streaming Package 3 cam + GR",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Live Streaming Package 3 cam + GR \nSoundsystem 5000 watt \nVideotron 2,5x 5 m \nDudukan led 20 cm di atas panggung\n\nLighting : \nPar Led - Par 54 full color 2 Bar (- Per Bar @4Par Led )\nFreshnell - Freshnell LED 200 4 unit\nMoving Head - Moving Beam 280 2 unit\nFogger - Smoke Machine 1200 1 unit\nStanding - Standing Lighting 4Meter 2 unit\nMixer - Mixer Avolites Quart 1 unit\nCabeling - Cabeling\nLampiran Google Calendar: QUO_PRASASTI_GS BATTERY KARAWANG_20 APRIL 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Soundsystem 5000 watt",
        ["Soundsystem 5000 watt", "Mixer - Mixer Avolites Quart 1 unit", "Cabeling - Cabeling"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "Videotron 2,5x 5 m",
        ["Videotron 2,5x 5 m", "Dudukan led 20 cm di atas panggung"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["Par Led - Par 54 full color 2 Bar (- Per Bar @4Par Led )", "Freshnell - Freshnell LED 200 4 unit", "Moving Head - Moving Beam 280 2 unit", "Fogger - Smoke Machine 1200 1 unit", "Standing - Standing Lighting 4Meter 2 unit"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "Live Streaming Package 3 cam + GR",
        ["Live Streaming Package 3 cam + GR"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-69i64opp69ij8bb6ckp3gb9kcphm8b9p65hjgbb361gm6p1lc8omcd9gcc",
    monthKey: "2026-04",
    date: "2026-04-20",
    endDate: "2026-04-21",
    dateLabel: "20-21 Apr 2026",
    venue: "KCK",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: KCK (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7ch31o672eaifibgdta153inms",
    monthKey: "2026-04",
    date: "2026-04-20",
    dateLabel: "20 Apr 2026",
    venue: "meet up Novri siang",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: meet up Novri siang (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-ccq3ge32ckrm2b9k68pj6b9k68pjeb9o6di36b9l71i36db56hgj8c9h68",
    monthKey: "2026-04",
    date: "2026-04-21",
    endDate: "2026-04-23",
    dateLabel: "21-23 Apr 2026",
    venue: "Ricky aksara",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Ricky aksara (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1vem679g05lre9uiovk16e96nq",
    monthKey: "2026-04",
    date: "2026-04-22",
    dateLabel: "22 Apr 2026",
    venue: "DEBOER ESSILOR",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: DEBOER ESSILOR (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2s5e8vr1ppi61hm77a5coreo0b",
    monthKey: "2026-04",
    date: "2026-04-22",
    dateLabel: "22 Apr 2026",
    venue: "RIO VERTEX JIEXPO",
    loadingSchedule: "Multicam 4Cam Loading H-1 Sore",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Multicam 4Cam Loading H-1 Sore",
    sections: [
      createSection(
        "Multimedia",
        "Multicam 4Cam Loading H-1 Sore",
        ["Multicam 4Cam Loading H-1 Sore"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-64qj4phocor6ab9hcgoj4b9k70oj8b9p6som8b9ic9i32chlcli64cj368",
    monthKey: "2026-04",
    date: "2026-04-22",
    dateLabel: "22 Apr 2026",
    venue: "Undangan Kairos Jiexpo",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Kepada Yth. Bapak WAHYU\nKairos Multi Jaya mengharapkan kehadiran Bapak/Ibu yang terhormat dalam acara: \n\nSymphony of Resonance\nwith Kairos Multi Jaya\n\nSebuah pengalaman eksklusif untuk merasakan langsung inovasi terbaru dari TT+ Audio—menghadirkan perpaduan clarity, percision & power dari sistem audio dalam satu pengalaman yang berkesan.\n\nDetail Acara\n📅 Rabu, 22 April 2026\n🕒 17.00 – 22.00 WIB\n(Registrasi dibuka pukul 16.30 WIB)\n📍 Gambir Expo, JIExpo Kemayoran\n\nKode Registrasi : KMJS393019\nMohon konfirmasi kehadiran Bapak/Ibu dengan memindai QR code atau melalui tautan berikut:\n🔗 https://www.kairosmultijaya.com/events/",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Undangan Kairos Jiexpo (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-04s0tk6o7utad1000kc8601511",
    monthKey: "2026-04",
    date: "2026-04-23",
    dateLabel: "23 Apr 2026",
    venue: "DEBOER ESSILOR",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: DEBOER ESSILOR (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-69im4e9gcgq3gbb2ccs6cb9k6spm8b9pckoj8b9ichi3cp1nc9ij0e1m70",
    monthKey: "2026-04",
    date: "2026-04-23",
    endDate: "2026-04-24",
    dateLabel: "23-24 Apr 2026",
    venue: "Pak winardi",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Pak winardi (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4erbplgkuocdgfplv89pmcmukj",
    monthKey: "2026-04",
    date: "2026-04-24",
    dateLabel: "24 Apr 2026",
    venue: "RIVO OJK BI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: RIVO OJK BI (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4ncr9ffinu7sp63d7f6iguvst1",
    monthKey: "2026-04",
    date: "2026-04-25",
    dateLabel: "25 Apr 2026",
    venue: "CENTRAL EVENT BOOKING SUVARNA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: CENTRAL EVENT BOOKING SUVARNA (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-68s36db1c8qm8b9k64ojib9kckq30bb16gqm6b9o6lgjcpj3c4s36e1n6g",
    monthKey: "2026-04",
    date: "2026-04-26",
    dateLabel: "26 Apr 2026",
    venue: "Angga Order",
    loadingSchedule: "Jam 08.00 s.d. 14.00 | Loading: | Jam 20.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Ini jadi\nHalal Bihalal\nAcara hari Minggu 26 April\n2026\nJam 08.00 s.d. 14.00\n\nLoading:\nSabtu, 25 April 2026\nJam 20.00\n\nVenue: Citywalk Sudirman Function Hall lantai 5\nJl. KH. Mas Mansyur\n\nEvent meeting\n\nPA: \n2 Unit RCF 6001\n2 Unit Sub RCF 8001\n\nMonitor:\n4 Unit Speaker RCF315 \n\nBackline:\n1 Set Drum Akustik Yamaha Stage/Tour\n1 Set Mic Drum\n1 Unit Keyboard RD700NX \n4 Unit DI  BOX\n1 Unit Stand Keyboard Double \n\nMixer:\nMidas M32R\nDL32\n\nMicrophone:\n3 Unit Mic Wireless Sennheiser EWD \n2 Unit Mic Cable SM58\n4 Unit Mic Cable SM57\n1 Lot Stand Mic\n\nMiscellaneous:\nAudio Equipment \nCable System \nElectricity System",
    sections: [
      createSection(
        "Audio",
        "2 Unit RCF 6001",
        ["2 Unit RCF 6001", "2 Unit Sub RCF 8001", "Monitor:", "4 Unit Speaker RCF315", "Backline:", "1 Set Drum Akustik Yamaha Stage/Tour", "1 Set Mic Drum", "1 Unit Keyboard RD700NX", "4 Unit DI  BOX", "1 Unit Stand Keyboard Double", "Mixer:", "Midas M32R", "DL32", "Microphone:", "3 Unit Mic Wireless Sennheiser EWD", "2 Unit Mic Cable SM58", "4 Unit Mic Cable SM57", "1 Lot Stand Mic", "Miscellaneous:", "Audio Equipment", "Cable System", "Electricity System"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-68p6adr46lhjib9l6co3gb9kcgrj6bb16crmcbb1ckqm2p34ckpj0dplco",
    monthKey: "2026-04",
    date: "2026-04-26",
    dateLabel: "26 Apr 2026",
    venue: "Ayong",
    loadingSchedule: "Bos ada jdwal masuk di buat tgl 26 loading 25 bulan ini",
    pic: "Ayong Sumarsih",
    status: "Selesai",
    gcalSynced: true,
    notes: "Bos ada jdwal masuk di buat tgl 26 loading 25 bulan ini\nSpek : \n•Sound 5rb watt + klip on 2 dan wireles 6\n\n•Lighting : 2 bar parled + frenel 6",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Sound 5rb watt + klip on 2 dan wireles 6"],
        ["Ayong"],
        []
      ),
      createSection(
        "Lighting",
        "Lighting : 2 bar parled + frenel 6",
        ["Lighting : 2 bar parled + frenel 6"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6pi6cp1h6pi6cb9ic8sjab9k64o6cbb2clh34bb1cgp66pj6ccoj4o9pck",
    monthKey: "2026-04",
    date: "2026-04-26",
    dateLabel: "26 Apr 2026",
    venue: "DIVAGA order Puribegawan",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*26 April*\nRD700NX *650rb*\nIEM G4: 8 unit  *4Jt*\n*Mic Drum Set 1jt*\nSHURE BETA 91A\nSHURE BETA 52A\nAKG C1000 3 Unit\nSENNHEISER E604 4 unit\nSplitter 32Ch *500rb*\n*Stand Yamaha 150rb*\nStand Cymbal 2 unit\nStand Snare 1 unit\n*Total 6,3Jt*",
    sections: [
      createSection(
        "Audio",
        "RD700NX *650rb",
        ["RD700NX *650rb", "IEM G4: 8 unit  *4Jt", "Mic Drum Set 1jt", "SHURE BETA 91A", "SHURE BETA 52A", "AKG C1000 3 Unit", "SENNHEISER E604 4 unit", "Splitter 32Ch *500rb", "Stand Yamaha 150rb", "Stand Cymbal 2 unit", "Stand Snare 1 unit", "Total 6,3Jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-70sjco9g6cpm4b9n6go3ab9k68pjibb275j38b9hc4pj8o9p74q36e1l6s",
    monthKey: "2026-04",
    date: "2026-04-26",
    endDate: "2026-04-27",
    dateLabel: "26-27 Apr 2026",
    venue: "Rivo",
    loadingSchedule: "Loading 26 pagi ada GR 26 sore",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Acara tgl 27 \nLoading 26 pagi ada GR 26 sore\nLed 8x2, sama 2x5 2 set, sound 5rb, lighting, streaming",
    sections: [
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["Led 8x2, sama 2x5 2 set, sound 5rb, lighting, streaming"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6com4ohlccoj6bb4cgo34b9k6kq34bb26lh36bb66cpjec31c8qj8d9n6g",
    monthKey: "2026-04",
    date: "2026-04-28",
    dateLabel: "28 Apr 2026",
    venue: "Adin",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Adin",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sewa headset 1",
    sections: [
      createSection(
        "Audio",
        "Sewa headset 1",
        ["Sewa headset 1"],
        ["Adin"],
        []
      ),
    ],
  },
  {
    id: "gcal-c8q6aor56crm4b9p69hj2b9kclhj0b9oc9hj2b9hcph38p1n68q68ohi60",
    monthKey: "2026-04",
    date: "2026-04-28",
    dateLabel: "28 Apr 2026",
    venue: "DEDI Armada PELNI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- PA 30rb\n- Monitor dari Armada",
    sections: [
      createSection(
        "Audio",
        "PA 30rb",
        ["PA 30rb", "Monitor dari Armada"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-61i3aor36cqjgb9icdhm8b9k71hjibb269ijeb9pcorjco9h6kq62d1i6s",
    monthKey: "2026-04",
    date: "2026-04-28",
    dateLabel: "28 Apr 2026",
    venue: "KCK GRAHA PHONSKA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: KCK GRAHA PHONSKA (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-64sj8cpgclh3ebb474pj2b9kcph34bb260sjib9jclgmcoj668o6ap9m60",
    monthKey: "2026-04",
    date: "2026-04-29",
    dateLabel: "29 Apr 2026",
    venue: "Angga Order",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Rabu, 29 April 2026\nBallroom Hotel Pullman Thamrin \nJakarta \n\nLED Videotron Indoor \n3m x 6m 18meter x 400rb \n\nDudukan 80cm x 6mx 200rb \n\nSystem + Operator\n\nAll in 8jt\n\n4 Unit Mic Wireless",
    sections: [
      createSection(
        "Audio",
        "4 Unit Mic Wireless",
        ["4 Unit Mic Wireless"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "LED Videotron Indoor",
        ["LED Videotron Indoor", "3m x 6m 18meter x 400rb", "Dudukan 80cm x 6mx 200rb", "System + Operator", "All in 8jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0th43qgem6jjnumvte8t9g9h3k",
    monthKey: "2026-04",
    date: "2026-04-29",
    dateLabel: "29 Apr 2026",
    venue: "EVO PESONA ALAM TBC",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: EVO PESONA ALAM TBC (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5639o4geqfvnm33qer1n7alrhs",
    monthKey: "2026-04",
    date: "2026-04-29",
    dateLabel: "29 Apr 2026",
    venue: "JOHANES CENTRAL EVENT",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: CENTRAL EVENT_TRANS CIBUBUR_29 APR 2026 (1).xlsx",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: CENTRAL EVENT_TRANS CIBUBUR_29 APR 2026 (1).xlsx"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-00s3otdt25601vjvk67iiho8s8",
    monthKey: "2026-04",
    date: "2026-04-30",
    dateLabel: "30 Apr 2026",
    venue: "DEBOER ESSILOR",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: DEBOER ESSILOR (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6hgj6e1ichijgbb575hj6b9k6di32b9oc8pjib9lcgomac336cs3cor36o",
    monthKey: "2026-04",
    date: "2026-04-30",
    dateLabel: "30 Apr 2026",
    venue: "IWAN MANDIRI WALKING DRUM",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- LED 2,5x4 10x400 *4Jt*\n- Stage 3x6 Fin Karpet *1,8Jt*",
    sections: [
      createSection(
        "Videotron",
        "LED 2,5x4 10x400 *4Jt",
        ["LED 2,5x4 10x400 *4Jt"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Stage 3x6 Fin Karpet *1,8Jt",
        ["Stage 3x6 Fin Karpet *1,8Jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cgpjcpb5cgp3gb9m64o30b9k75im4b9ocgs68bb26oq36o9n64rj8d1mck",
    monthKey: "2026-04",
    date: "2026-04-30",
    dateLabel: "30 Apr 2026",
    venue: "Idris EO Holiday in Cikarang",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Sound 10rb 2Mixer\n- Backline\n- Budget 10Jt\nLampiran Google Calendar: INV_PAK IDRIS EO_HOLIDAY INN JABABEKA_30 APRIL 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound 10rb 2Mixer",
        ["Sound 10rb 2Mixer"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-65h6coho6srjcb9i60r32b9k6cqm4b9o6kp6cb9m6tijge1hcgs3ge36cg",
    monthKey: "2026-04",
    date: "2026-04-30",
    dateLabel: "30 Apr 2026",
    venue: "Kck",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Kck (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0v57msts35rj7ka73h0q8gesmo",
    monthKey: "2026-04",
    date: "2026-04-30",
    dateLabel: "30 Apr 2026",
    venue: "PAK RIO VERTEX PENISULA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_PAK RIO VERTEX_PENISULA_30 APRIL 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_PAK RIO VERTEX_PENISULA_30 APRIL 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0ipfvvj6pksmmj0r6hkuee4vtm",
    monthKey: "2026-04",
    date: "2026-04-30",
    dateLabel: "30 Apr 2026",
    venue: "REVO MRP",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "MULTICAM 3 CAM \nGODOX 4",
    sections: [
      createSection(
        "Multimedia",
        "MULTICAM 3 CAM",
        ["MULTICAM 3 CAM", "GODOX 4"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0auti74n5aomstaoji2kot4gg6",
    monthKey: "2026-04",
    date: "2026-04-30",
    dateLabel: "30 Apr 2026",
    venue: "SASTA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: SASTA (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  // ============================================================================
  // BULAN MEI 2026 (GOOGLE CALENDAR SYNC)
  // ============================================================================
  {
    id: "gcal-15o5ed2h0vhkcqfrl8bh4dk73l",
    monthKey: "2026-05",
    date: "2026-05-01",
    dateLabel: "1 Mei 2026",
    venue: "EVO",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tgl 1 mei sudah confirm pesona alam\nBackdrop 3x5 \nBooth 2.5x3 \nSound 3000 watt \nLighting standar \nGenset",
    sections: [
      createSection(
        "Audio",
        "Sound 3000 watt",
        ["Sound 3000 watt"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "Booth 2.5x3",
        ["Booth 2.5x3"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting standar",
        ["Lighting standar"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Backdrop 3x5",
        ["Backdrop 3x5"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5atccmkp3u6asp9t0c03fnqqhj",
    monthKey: "2026-05",
    date: "2026-05-01",
    dateLabel: "1 Mei 2026",
    venue: "NAKO ALSUT",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_PT NAKO KREASI_KOPI NAKO ALSUT_1 MEI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_PT NAKO KREASI_KOPI NAKO ALSUT_1 MEI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6n3picajb27kpggfufdo62o4jk",
    monthKey: "2026-05",
    date: "2026-05-01",
    dateLabel: "1 Mei 2026",
    venue: "Ridwan Snowville Sound 3rb",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Ridwan Snowville Sound 3rb",
        ["Ridwan Snowville Sound 3rb"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-coqj2eb161h64b9hckojab9k65i6cbb261gjgb9k71h34e9n65i66dhi6k",
    monthKey: "2026-05",
    date: "2026-05-03",
    dateLabel: "3 Mei 2026",
    venue: "Ricky CFD Wisma BNI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Led, broadcast, sm kamera 2",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Ricky CFD Wisma BNI (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6oq6ao9ncpgm6bb260ojeb9k6oo30b9o6ss3ib9n6srm6c35c5ijeohpc8",
    monthKey: "2026-05",
    date: "2026-05-03",
    dateLabel: "3 Mei 2026",
    venue: "Shaly Mang unus",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "acara tanggal 3 mei 2026 di dammara space. kebutuhan:\n1. genzet 40kva\n2. ac standing 5pk 3 unit\n3. sound 5rb watt \n4. lighting beam 6",
    sections: [
      createSection(
        "Audio",
        "3. sound 5rb watt",
        ["3. sound 5rb watt"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "4. lighting beam 6",
        ["4. lighting beam 6"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "1. genzet 40kva",
        ["1. genzet 40kva", "2. ⁠ac standing 5pk 3 unit"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4u58p0jvj8eqn5ih8kev0ij6fn",
    monthKey: "2026-05",
    date: "2026-05-04",
    dateLabel: "4 Mei 2026",
    venue: "Firman trisakti",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tgl 4 mei mau ada acara wisuda, bisa support:\n- 4 camera \n- 3 campers\n- 1 VJ\n- 2 lighting godox",
    sections: [
      createSection(
        "Lighting",
        "2 lighting godox",
        ["2 lighting godox"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "4 camera",
        ["4 camera", "3 campers", "1 VJ"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c9ijed336osj8bb364sm2b9k70rj8bb161ijcb9j6lh6ad1g6ss3ed33ck",
    monthKey: "2026-05",
    date: "2026-05-04",
    dateLabel: "4 Mei 2026",
    venue: "Revo mulia",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Revo mulia (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-68p62pj26srj0b9kc8rm6b9k6pgmcb9o6krmcbb3cdj64dj2cdgm8p9g6k",
    monthKey: "2026-05",
    date: "2026-05-05",
    dateLabel: "5 Mei 2026",
    venue: "Rivo Sumitro",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Rivo Sumitro (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-60sj6p366thj6b9gclj36b9k6thj4bb268qm6b9m6comaeb3c9im6p36c8",
    monthKey: "2026-05",
    date: "2026-05-08",
    endDate: "2026-05-10",
    dateLabel: "8-10 Mei 2026",
    venue: "Flow Pasific Garden",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "3x4 level naik 1 meter\n\nTgl 8 - 10 mei\nTotal idr 10.600 ya",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Flow Pasific Garden (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c8q68c1j60q3eb9k6gqmab9kcph32bb2c9hj4b9pcli32oplckr62pj264",
    monthKey: "2026-05",
    date: "2026-05-09",
    dateLabel: "9 Mei 2026",
    venue: "Flow 301 westin",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Westin led 3x5 indoor \nLevel 1,5 meter ya\n\n9 mei 2026",
    sections: [
      createSection(
        "Videotron",
        "Westin led 3x5 indoor",
        ["Westin led 3x5 indoor", "Level 1,5 meter ya", "9 mei 2026"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1h3kneud78go1ou07iiivnj54v",
    monthKey: "2026-05",
    date: "2026-05-09",
    dateLabel: "9 Mei 2026",
    venue: "PAK DEWANGGA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_PAK DEWANGGA 86 PRODUCTION_9 MEI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_PAK DEWANGGA 86 PRODUCTION_9 MEI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cgo68c3369j34b9i6ksm2b9k75gmcbb270q6cb9k70sm2opn65j38d9gc8",
    monthKey: "2026-05",
    date: "2026-05-09",
    dateLabel: "9 Mei 2026",
    venue: "UGAN BOOKING",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Assalamu'alaikum bos,\nBeam 12\nStromy 8\nMixer 1\nSmoke 1\nEvent 9 Mei d pondok labu\nBudget 6jt\n\nDP 3.5JT",
    sections: [
      createSection(
        "Audio",
        "Mixer 1",
        ["Mixer 1"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Beam 12",
        ["Beam 12", "Stromy 8", "Smoke 1", "Event 9 Mei d pondok labu"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4eoosiu24vhacrs5qvat27u57e",
    monthKey: "2026-05",
    date: "2026-05-11",
    endDate: "2026-05-12",
    dateLabel: "11-12 Mei 2026",
    venue: "BIDAKARA RIVO",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Streaming ptz 1, camcorder 1, utk tgl 11, tgl 12 sama plus sound 3rb",
    sections: [
      createSection(
        "Multimedia",
        "Multimedia, Cam & Live Stream",
        ["Streaming ptz 1, camcorder 1, utk tgl 11, tgl 12 sama plus sound 3rb"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7osb7i2v167q22tjo0u68tqhl5",
    monthKey: "2026-05",
    date: "2026-05-11",
    endDate: "2026-05-17",
    dateLabel: "11-17 Mei 2026",
    venue: "FIRMAN BACKLIGHT MALL KELAPA GADING",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*11-17 Mall Kelapa Gading Backlight*\n11- 17 Mei SOUND 8000 WATT, WHM 6 (Budget 25Jt)\n- KLA + 6001 \n- Mon RCF 6\n\n17 Mei \n- Lighting : Parled 8, Stromy 4, Moving 4, Freshnell 4, Hazzer \n- LED : P 2.6 3x8 (24 Meter ) 13,2 Jt\nLampiran Google Calendar: INV_PAK FIRMAN BACKLIGHT_MALL KELAPA GADING_11-17 Mei 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "11-17 Mall Kelapa Gading Backlight",
        ["11-17 Mall Kelapa Gading Backlight", "11- 17 Mei SOUND 8000 WATT, WHM 6", "KLA + 6001", "Mon RCF 6", "17 Mei"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "LED : P 2.6 3x8 (24 Meter ) 13,2 Jt",
        ["LED : P 2.6 3x8 (24 Meter ) 13,2 Jt"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["Lighting : Parled 8, Stromy 4, Moving 4, Freshnell 4, Hazzer"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5sf0orfpa9f8hslv5mp18visnd",
    monthKey: "2026-05",
    date: "2026-05-11",
    dateLabel: "11 Mei 2026",
    venue: "Vacenk Sentul Highland",
    loadingSchedule: "Loading Minggu 10 Siang jam 14.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "11 Mei Sentul Highland (3Jt)\nLoading Minggu 10 Siang jam 14.00\n- Freshnell 200 4Pcs\n- Parled 8Pcs\n- Minibrute 2Pcs\n- Stand",
    sections: [
      createSection(
        "Lighting",
        "Freshnell 200 4Pcs",
        ["Freshnell 200 4Pcs", "Parled 8Pcs", "Minibrute 2Pcs", "Stand"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-ckr3idpl64sjib9k6hgm8b9k68p68bb1c4rjgbb561ijcor6chi3cpj36o",
    monthKey: "2026-05",
    date: "2026-05-12",
    dateLabel: "12 Mei 2026",
    venue: "Meeting Botani jam 13.00",
    loadingSchedule: "jam 13.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Meeting Botani jam 13.00 (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5hc1pc8jsol04v89oqqh569dqg",
    monthKey: "2026-05",
    date: "2026-05-12",
    dateLabel: "12 Mei 2026",
    venue: "PAK FAUZI INTERCON PI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_PAK FAUZI_AKSAPEDIA_INTERCON PONDOK INDAH_12 MEI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_PAK FAUZI_AKSAPEDIA_INTERCON PONDOK INDAH_12 MEI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cgsjcdr565gjcb9g6op3cb9kccrjibb268o64bb169im4ob46thj4dpnck",
    monthKey: "2026-05",
    date: "2026-05-13",
    dateLabel: "13 Mei 2026",
    venue: "Angga Order",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound System \nRabu, 13 Mei 2026\n\nRiverside Golf Club\nCimanggis\n\nMain PA\n2 Unit RCF 3way 6001\nStand Speaker \n2 Unit Sub AudioCentre KLA 218\n\nCenter fill:\n2 Unit dBTech Opera15 \n\nDelay:\n2 Unit dBTech LVX15 \n2 Stand Speaker \n\nOn stage Band:\n6 Unit dBTech Opera15/RCF315 \n1 Unit Stand Keyboard \n2 Unit Stand Guitar\n6 Unit DI Box \n2 Unit Standbook \n\nMonitor DJ:\n1 Unit RCF315 \n1 Unit Sub RCF 8001\n\nConsole\n1 Unit Midas M32R \n1 Unit DL32\n\nMicrophone:\n4 Unit Mic Wireless QA \n2 Unit Mic Cable \n\nMiscellaneous:\n2 Unit Stand speaker \nCable System \nAudio Equipment \nElectricity Equipment",
    sections: [
      createSection(
        "Audio",
        "Rabu, 13 Mei 2026",
        ["Rabu, 13 Mei 2026", "Riverside Golf Club", "Cimanggis", "Main PA", "2 Unit RCF 3way 6001", "Stand Speaker", "2 Unit Sub AudioCentre KLA 218", "Delay:", "2 Unit dBTech LVX15", "2 Stand Speaker", "6 Unit DI Box", "2 Unit Standbook", "Monitor DJ:", "1 Unit RCF315", "1 Unit Sub RCF 8001", "Console", "1 Unit Midas M32R", "1 Unit DL32", "Microphone:", "4 Unit Mic Wireless QA", "2 Unit Mic Cable", "Miscellaneous:", "2 Unit Stand speaker", "Cable System", "Audio Equipment", "Electricity Equipment"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "Center fill:",
        ["Center fill:", "2 Unit dBTech Opera15"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "On stage Band:",
        ["On stage Band:", "6 Unit dBTech Opera15/RCF315", "1 Unit Stand Keyboard", "2 Unit Stand Guitar"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3jaq3skj3238ncrkgqueg9t238",
    monthKey: "2026-05",
    date: "2026-05-13",
    dateLabel: "13 Mei 2026",
    venue: "SYAMSUL RAJAWALI ASTON",
    loadingSchedule: "LED 3x7 + Level T. 1 Meter (Aston Kemayoran LT 25) Tgl 13 Mei (WIGI) jam 20.00 di lokasi",
    pic: "Wigi (Dedi Agus Wigiantoro)",
    status: "Selesai",
    gcalSynced: true,
    notes: "Event: IAS\nLED 3x7 + Level T. 1 Meter (Aston Kemayoran LT 25) Tgl 13 Mei (WIGI) jam 20.00 di lokasi",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["LED 3x7 + Level T. 1 Meter (Aston Kemayoran LT 25) Tgl 13 Mei (WIGI) jam 20.00 di lokasi"],
        ["Wigi"],
        []
      ),
    ],
  },
  {
    id: "gcal-5tve6os0sjur9bb9dalibpdvsb",
    monthKey: "2026-05",
    date: "2026-05-14",
    endDate: "2026-05-15",
    dateLabel: "14-15 Mei 2026",
    venue: "DEBOER KEBUNSU",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_DEBOER_KEBUNSU_14-15 Mei 2026_REV1.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_DEBOER_KEBUNSU_14-15 Mei 2026_REV1.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0525nuiq7cp96eg86f0fi8ekuh",
    monthKey: "2026-05",
    date: "2026-05-14",
    dateLabel: "14 Mei 2026",
    venue: "Survei Central",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Survei Central (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-71hj2cphcgs62b9h65i3eb9kcco64bb174pm8b9p69hmccr2c9j3idr270",
    monthKey: "2026-05",
    date: "2026-05-15",
    endDate: "2026-05-16",
    dateLabel: "15-16 Mei 2026",
    venue: "Angga booking",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Dalam pengajuan\n\nJum'at-Sabtu, 15-16 Mei 2026\nDeheng House Kemang Jakarta \n\nSewa 2 hari\n4 Unit Speaker dBTech Opera15",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Angga booking (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cphm6p9i71ij2bb570q66b9kc4p3cb9pc4qm6b9l6pimcdhk70pmae1m64",
    monthKey: "2026-05",
    date: "2026-05-15",
    dateLabel: "15 Mei 2026",
    venue: "IWAN E covention",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Rigging Gawangan 7x2 2Set *3,5*\n- LED P3.9 4x15 plus dudukan (60x450rb) *24Jt*\n- Dudukan + Rigging 15x700rb *8,5 jt*\n- Lighting Beam 450 8Pcs, Followspot 1 *4,5Jt*\n*TOTAL 40,5Jt*",
    sections: [
      createSection(
        "Videotron",
        "Rigging Gawangan 7x2 2Set *3,5",
        ["Rigging Gawangan 7x2 2Set *3,5", "LED P3.9 4x15 plus dudukan (60x450rb) *24Jt"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["Lighting Beam 450 8Pcs, Followspot 1 *4,5Jt", "TOTAL 40,5Jt"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Dudukan + Rigging 15x700rb",
        ["Dudukan + Rigging 15x700rb"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7fpe5emku81bbrar43m02vgkjk",
    monthKey: "2026-05",
    date: "2026-05-15",
    dateLabel: "15 Mei 2026",
    venue: "KOPI NAKO BSD",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_PT NAKO KREASI_KOPI NAKO BSD_15 MEI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_PT NAKO KREASI_KOPI NAKO BSD_15 MEI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6cq3ge9g70p64bb174p3cb9kckp6cbb175j66bb261j62e9o6timad31co",
    monthKey: "2026-05",
    date: "2026-05-15",
    dateLabel: "15 Mei 2026",
    venue: "Survei Prasasti Westin",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "15 Mei 2026  di The Westin pukul 14:00-15:30 om",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Survei Prasasti Westin (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6gp66p326opmabb1cgo34b9k6dij8bb2c4pm8bb16kojcohp64s64or470",
    monthKey: "2026-05",
    date: "2026-05-16",
    dateLabel: "16 Mei 2026",
    venue: "Bagas adenya meried",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Bagas adenya meried (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cdhm6p9n71j3gbb36ph68b9k6kojib9p68s6ab9i75i3gp9pc5hjao9m60",
    monthKey: "2026-05",
    date: "2026-05-16",
    dateLabel: "16 Mei 2026",
    venue: "Insantama Rizki Indotwin",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "LED 2x4 + Level 1 Meter *3Jt*",
    sections: [
      createSection(
        "Videotron",
        "LED 2x4 + Level 1 Meter *3Jt",
        ["LED 2x4 + Level 1 Meter *3Jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-corjcopg60q32b9mclj3ib9k6gq62b9o71j3ibb56go3ee326lhmae1oc4",
    monthKey: "2026-05",
    date: "2026-05-17",
    dateLabel: "17 Mei 2026",
    venue: "FIRMAN BACKLIGHT KELAPA GADING",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*Kelapa Gading*\n*11-17 Mei*\n- Sound 8000\n*17 Mei*\n- Sound 8000\n- Lighting (Parled 8, Beam 4, Strobe 4, Freshnell 4, Hazzer)\n- Led P2.6 3x8",
    sections: [
      createSection(
        "Audio",
        "Kelapa Gading",
        ["Kelapa Gading", "11-17 Mei", "Sound 8000", "17 Mei"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "Led P2.6 3x8",
        ["Led P2.6 3x8"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["Lighting (Parled 8, Beam 4, Strobe 4, Freshnell 4, Hazzer)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6n6sqb8fflrtr7enkuinj3561j",
    monthKey: "2026-05",
    date: "2026-05-18",
    endDate: "2026-05-22",
    dateLabel: "18-22 Mei 2026",
    venue: "SYAMSUL RAJAWALI SWISS BELL KEMAYORAN",
    loadingSchedule: "LED 5x2 + Level T. 1Meter (SwisBellin Kemayoran) 18-22 Mei (Jam 19.00 Dilokasi)",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Event: APS\nLED 5x2 + Level T. 1Meter (SwisBellin Kemayoran) 18-22 Mei (Jam 19.00 Dilokasi)",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["LED 5x2 + Level T. 1Meter (SwisBellin Kemayoran) 18-22 Mei (Jam 19.00 Dilokasi)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6gpj6cj6c8rjib9hc8pj6b9k6tij8bb1c8qjeb9g70o34eb46li64oj66k",
    monthKey: "2026-05",
    date: "2026-05-19",
    dateLabel: "19 Mei 2026",
    venue: "ANGGA ORDER",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound System & Lighting \nJum'at, 19 Juni \n\nClub House\nCimanggis\n\nMain PA\n2 Unit RCF 3way 6001\nStand Speaker \n2 Unit Sub AudioCentre KLA 218\n\nDelay Venue\n4 Unit RCF315 \n4 Unit Stand speaker \n\nOn stage Band:\n4 Unit RCF315 \n1 Unit Stand Keyboard \n2 Unit Stand Guitar\n6 Unit DI Box \n2 Unit Standbook \n4 Unit IEM Sennheiser G4 \n\nBackline:\n1 Set Drum Akustik Yamaha Tourcustom \nStand Cymbal \n2 Stand Snare\n1 Unit Keyboard RD700NX \n1 Unit Stand Keyboard Double \n\nConsole\n1 Unit Midas HD96-24 \n1 Unit DL251\n\nMicrophone:\n4 Unit Mic Sennheiser EWD \n1 Set Anthena Directional Unit \n1 Lot Microphone Cable\n\nMiscellaneous:\nCable System \nAudio Equipment \nElectricity Equipment\n\n\nLighting:\n\n4 Unit Moving Beam \n8 Unit Parled \n4 Unit Freshnell \n2 Stand Lighting \n1 Unit Mixer Lighting",
    sections: [
      createSection(
        "Audio",
        "2 Unit RCF 3way 6001",
        ["2 Unit RCF 3way 6001", "Stand Speaker", "2 Unit Sub AudioCentre KLA 218", "Delay Venue", "4 Unit RCF315", "4 Unit Stand speaker", "6 Unit DI Box", "2 Unit Standbook", "4 Unit IEM Sennheiser G4", "Backline:", "1 Set Drum Akustik Yamaha Tourcustom", "Stand Cymbal", "2 Stand Snare", "1 Unit Keyboard RD700NX", "1 Unit Stand Keyboard Double", "Console", "1 Unit Midas HD96-24", "1 Unit DL251", "Microphone:", "4 Unit Mic Sennheiser EWD", "1 Set Anthena Directional Unit", "1 Lot Microphone Cable", "Miscellaneous:", "Cable System", "Audio Equipment", "Electricity Equipment"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Sound System & Lighting",
        ["Sound System & Lighting", "Jum'at, 19 Juni", "Club House", "Cimanggis", "Main PA", "Lighting:", "4 Unit Moving Beam", "8 Unit Parled", "4 Unit Freshnell", "2 Stand Lighting", "1 Unit Mixer Lighting"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "On stage Band:",
        ["On stage Band:", "4 Unit RCF315", "1 Unit Stand Keyboard", "2 Unit Stand Guitar"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2kv8e8s6s3d5hpdo3d9l443ss6",
    monthKey: "2026-05",
    date: "2026-05-19",
    dateLabel: "19 Mei 2026",
    venue: "ECOLAB EVO CENTRO",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: ECOLAB EVO CENTRO (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-12l2ed5rmns0spkrbesblm7gm3",
    monthKey: "2026-05",
    date: "2026-05-19",
    dateLabel: "19 Mei 2026",
    venue: "GILANG SIXEO",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: GILANG SIXEO (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5gm95rgc6l836n4nqqn2sh7pck",
    monthKey: "2026-05",
    date: "2026-05-19",
    dateLabel: "19 Mei 2026",
    venue: "MD",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_MD PICTURES_PRESS CONFERENCE FILM 402 RUMAH SAKIT ANGKER _19 MEI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_MD PICTURES_PRESS CONFERENCE FILM 402 RUMAH SAKIT ANGKER _19 MEI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-73hgt6jft3ptjjimuueu2gt91a",
    monthKey: "2026-05",
    date: "2026-05-19",
    dateLabel: "19 Mei 2026",
    venue: "PRASASTI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_PRASASTI_WESTIN HOTEL_19 MEI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_PRASASTI_WESTIN HOTEL_19 MEI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-61h3cdr6c9ijgb9nc8omcb9kc8o3abb261j3ebb36pgjae1i68o62cb468",
    monthKey: "2026-05",
    date: "2026-05-20",
    dateLabel: "20 Mei 2026",
    venue: "Edo evo",
    loadingSchedule: "Loading 19 malam",
    pic: "Unyim (Wahyudin)",
    status: "Selesai",
    gcalSynced: true,
    notes: "*20 Mei BRI Mampang (Edo)* \nLoading 19 malam \n*Sound* \n- Db 6, Whm 4, Condenser 4, M32R, Headset 2, Gooseneck \n- Crew : Unyink, Aca, Bunonk\n- Mobil : Riz\n*Produksi Bagas*\n- Backdrop 2,4x6,1\n- Flooring 1,22 x 6,1 Karpet HItam",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Db 6, Whm 4, Condenser 4, M32R, Headset 2, Gooseneck", "Crew : Unyink, Aca, Bunonk", "Mobil : Riz", "Produksi Bagas"],
        ["Unyim", "ACA"],
        []
      ),
      createSection(
        "Videotron",
        "Flooring 1,22 x 6,1 Karpet HItam",
        ["Flooring 1,22 x 6,1 Karpet HItam"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Backdrop 2,4x6,1",
        ["Backdrop 2,4x6,1"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6a962mo60sqkn4fcn24du8i17t",
    monthKey: "2026-05",
    date: "2026-05-20",
    dateLabel: "20 Mei 2026",
    venue: "MEETING KE 2 REYRALABS",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: MEETING KE 2 REYRALABS (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-76nt8t8qkfr0ifop6vo09chkh0",
    monthKey: "2026-05",
    date: "2026-05-20",
    dateLabel: "20 Mei 2026",
    venue: "SAMSUL RAJAWALI IAS ASTON KEMAYORAN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Wigi (Dedi Agus Wigiantoro)",
    status: "Selesai",
    gcalSynced: true,
    notes: "Event: IAS 20 Mei\nLED 5x2 + Level T. 1Meter (Aston Kemayoran Hermina Ballroom) 19 Mei (Jam 19.00 Dilokasi) Wigi/Ayong",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["LED 5x2 + Level T. 1Meter (Aston Kemayoran Hermina Ballroom) 19 Mei (Jam 19.00 Dilokasi) Wigi/Ayong"],
        ["Wigi", "Ayong"],
        []
      ),
    ],
  },
  {
    id: "gcal-64ojcp9i64r66bb36csjib9k6gp3gb9p6tijebb474r34eb56so68d1m60",
    monthKey: "2026-05",
    date: "2026-05-20",
    dateLabel: "20 Mei 2026",
    venue: "Undangan Gracia jam 13.00",
    loadingSchedule: "jam 13.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: Foto dari Wahyu Riz Production",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: Foto dari Wahyu Riz Production"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-19s5jtljmsoum5bnhs5m1t0lgg",
    monthKey: "2026-05",
    date: "2026-05-21",
    endDate: "2026-05-22",
    dateLabel: "21-22 Mei 2026",
    venue: "SMANSA BOWO Req Jordy",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Jordy",
    status: "Selesai",
    gcalSynced: true,
    notes: "- SOUND 5RB \n- DRUM , KEY, BASS, GITAR",
    sections: [
      createSection(
        "Audio",
        "SOUND 5RB",
        ["SOUND 5RB", "DRUM , KEY, BASS, GITAR"],
        ["Jordy"],
        []
      ),
    ],
  },
  {
    id: "gcal-71gm6dhg6pj66b9ocpgm4b9k6cqj6b9pcdij8b9hcpi36ohjckr6acb36g",
    monthKey: "2026-05",
    date: "2026-05-21",
    endDate: "2026-05-22",
    dateLabel: "21-22 Mei 2026",
    venue: "Vacenk nawana",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "bosku led 2 x 3m buat tgl 21-22 harga 4jt boleh ? buat di nawana sentul",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["bosku led 2 x 3m buat tgl 21-22 harga 4jt boleh ? buat di nawana sentul"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c4pmachk64o3gbb36lj3eb9k60s36b9o68o68bb271gjepj2ccojcob5cg",
    monthKey: "2026-05",
    date: "2026-05-22",
    dateLabel: "22 Mei 2026",
    venue: "Indra Indka",
    loadingSchedule: "Loading 21 malam",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*22 Mei Bidakara*\nLoading 21 malam\nVideotron 4x8\nLevel 1,2 meter + gawangan\nPA 10.000 watt (Unit aja)",
    sections: [
      createSection(
        "Audio",
        "PA 10.000 watt (Unit aja)",
        ["PA 10.000 watt (Unit aja)"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "Videotron 4x8",
        ["Videotron 4x8", "Level 1,2 meter + gawangan"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cko62d1i6co36b9ichgjcb9k6opjgb9pcks3eb9g69im8p1jcgr68phj6o",
    monthKey: "2026-05",
    date: "2026-05-22",
    dateLabel: "22 Mei 2026",
    venue: "Pura Rawamangun",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound 2000 Akad",
    sections: [
      createSection(
        "Audio",
        "Sound 2000 Akad",
        ["Sound 2000 Akad"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7d9asl8ufrtfnt0nud1hnbi67k",
    monthKey: "2026-05",
    date: "2026-05-23",
    dateLabel: "23 Mei 2026",
    venue: "WhitepaperIndustriEvent (https://livewebinar.com/whitepaperindustrievent/r/vMxJKRZO4WWZRBhUgxulHL86KEqKI0QXzbxWlqSRKKsdZ1uXKCYObgoPtwzf)",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Room ID: 422-187-596\n\nSUSUNAN ACARA WEBINAR\"Dari Tidak Terlihat, Menjadi Tak Tergantikan\"Sosialisasi Whitepaper Industri Event 2026–2030\r\nBAGIAN 1: KENAPA INDUSTRI KITA KAYAK HANTU?\"Tiga Krisis yang Bikin Kita Nggak Diangg...",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["BAGIAN 1: KENAPA INDUSTRI KITA KAYAK HANTU?\"Tiga Krisis yang Bikin Kita Nggak Diangg..."],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c8p6aohkc4qm2bb1c5h32b9k6gomcb9p6srm2b9p68rjgd1o60s62d1o6s",
    monthKey: "2026-05",
    date: "2026-05-24",
    dateLabel: "24 Mei 2026",
    venue: "RAKA EO",
    loadingSchedule: "Acara Pagi Tanggal 24 Mei 2026",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Mau Pesan :\n- IEM G4 4 Pcs Untuk Band VIERRA\n- Midas M32 \n- Acara Pagi Tanggal 24 Mei 2026\n- Sound cek Sore/Malam Tgl 23 Mei 2026\n- Lokasi Stadion Benteng Tangerang",
    sections: [
      createSection(
        "Audio",
        "IEM G4 4 Pcs Untuk Band VIERRA",
        ["IEM G4 4 Pcs Untuk Band VIERRA", "Midas M32", "Acara Pagi Tanggal 24 Mei 2026", "Sound cek Sore/Malam Tgl 23 Mei 2026", "Lokasi Stadion Benteng Tangerang"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4u07euv1k37fdbeg5vr9ir9gtp",
    monthKey: "2026-05",
    date: "2026-05-25",
    dateLabel: "25 Mei 2026",
    venue: "Sasta balai kartini",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Sasta balai kartini (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6kp3cp9l68o6ab9i65j3cb9kc8pm4bb1c8rjib9i69gj6ohnc9i36o9pcc",
    monthKey: "2026-05",
    date: "2026-05-25",
    dateLabel: "25 Mei 2026",
    venue: "Techmet ice wawan jam 13.00",
    loadingSchedule: "jam 13.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Techmet ice wawan jam 13.00 (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-tp6rvk3itj5jbv613s3vh6hjdo",
    monthKey: "2026-05",
    date: "2026-05-28",
    dateLabel: "28 Mei 2026",
    venue: "MONITYOR",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: MONITYOR (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6op30opg69j3abb2cos3ab9k65i3ab9p71ij0bb5c8sjip1n70q3cpb660",
    monthKey: "2026-05",
    date: "2026-05-28",
    endDate: "2026-05-29",
    dateLabel: "28-29 Mei 2026",
    venue: "Ronald Shooting",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Beam 12Pcs\n- Grand MA",
    sections: [
      createSection(
        "Lighting",
        "Beam 12Pcs",
        ["Beam 12Pcs", "Grand MA"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6ksm8p1l6cqm2bb374s3eb9k6gpjeb9pcpj3cbb3copj4d1g60q66opk74",
    monthKey: "2026-05",
    date: "2026-05-30",
    dateLabel: "30 Mei 2026",
    venue: "Endin SIP INSAN RABANI TIGA RAKSA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lighthing\n1. Beam 8\n2. Freshnel 6\n3. Stromi 6\n4. Parled 8\n5. hazer 1 \nBudget 5jt non fee",
    sections: [
      createSection(
        "Lighting",
        "1. Beam 8",
        ["1. Beam 8", "2. Freshnel 6", "3. Stromi 6", "4. Parled 8", "5. ⁠hazer 1"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3m9apmk5n5aj4hc715tgg5ub99",
    monthKey: "2026-05",
    date: "2026-05-30",
    dateLabel: "30 Mei 2026",
    venue: "IQBAL KPK",
    loadingSchedule: "Loading Hari H jam 14.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Loading Hari H jam 14.00\n- Sound \n- LIghting",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: IQBAL KPK (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1du5g4knj907jsr5qqov0esva4",
    monthKey: "2026-05",
    date: "2026-05-30",
    endDate: "2026-05-31",
    dateLabel: "30-31 Mei 2026",
    venue: "ucok dumeca",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_PAK DEDI DUMECA_RA SUITE TB SIMATUPANG_30-31 MEI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_PAK DEDI DUMECA_RA SUITE TB SIMATUPANG_30-31 MEI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2mb1pk54kssdfmkv03qeu3avsr",
    monthKey: "2026-05",
    date: "2026-05-31",
    dateLabel: "31 Mei 2026",
    venue: "Rivo Aston Anyer",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Rivo Aston Anyer (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-mj5nkgefgvrcq0bco316fev5pg",
    monthKey: "2026-05",
    date: "2026-05-31",
    dateLabel: "31 Mei 2026",
    venue: "Softunes",
    loadingSchedule: "Loading agak subuh yah.. | Jam 7.30 mau di pakai AKAD NIKAH dulu sound nya..",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tgl 31 di Hotel LEMO HOTEL SERPONG ( WEDDING )\nPakai drum seperti biasa\nTambah RD ( tambah fee 500 rb )\n\nLoading agak subuh yah..\nJam 7.30 mau di pakai AKAD NIKAH dulu sound nya..\nBand soundcek after Akad..",
    sections: [
      createSection(
        "Audio",
        "Pakai drum seperti biasa",
        ["Pakai drum seperti biasa", "Tambah RD ( tambah fee 500 rb )", "Loading agak subuh yah..", "Jam 7.30 mau di pakai AKAD NIKAH dulu sound nya..", "Band soundcek after Akad.."],
        [],
        []
      ),
    ],
  },
  // ============================================================================
  // BULAN JUNI 2026 (GOOGLE CALENDAR SYNC)
  // ============================================================================
  {
    id: "gcal-2gd3pamthos9fh2l2imn2bei7t",
    monthKey: "2026-06",
    date: "2026-06-01",
    dateLabel: "1 Jun 2026",
    venue: "PRASASTI RUPS BAKRIE",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_PRASASTI_HORISON SUITES_RUPS BAKRIE_25 MEI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_PRASASTI_HORISON SUITES_RUPS BAKRIE_25 MEI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6dj3copn75h36bb371hjgb9kcksjib9oclhjeb9i60p62p9l6grj8e1lc8",
    monthKey: "2026-06",
    date: "2026-06-02",
    dateLabel: "2 Jun 2026",
    venue: "Robby RB",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Led 3x7\n- Drone live\n\nDP 3JT",
    sections: [
      createSection(
        "Videotron",
        "Led 3x7",
        ["Led 3x7", "Drone live"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-006pv1bc36o7mkn3u1oo2mcp8v",
    monthKey: "2026-06",
    date: "2026-06-02",
    dateLabel: "2 Jun 2026",
    venue: "YW PRO Botanica Sanctuary",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sore pak, bisa sewa dgn kebutuhan berikut berapa ya?\n- Drumset + mic drum + cable\n- Di-Box 2 unit\n- stand keyboard 1 unit\n- stand book 1 unit\n- cabel jack 5 unit\n- Clip on G3\nBudget 1,5Jt",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Sore pak, bisa sewa dgn kebutuhan berikut berapa ya?", "Drumset + mic drum + cable", "Di-Box 2 unit", "stand keyboard 1 unit", "stand book 1 unit", "cabel jack 5 unit", "Clip on G3"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5eo51s3qalmdumac3qup0o42va",
    monthKey: "2026-06",
    date: "2026-06-03",
    dateLabel: "3 Jun 2026",
    venue: "EDO BRINS",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_PAK EDO_MENARA BRILIAN_3 JUNI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_PAK EDO_MENARA BRILIAN_3 JUNI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-63q8di293em8m9jpp1isfv10v9",
    monthKey: "2026-06",
    date: "2026-06-05",
    dateLabel: "5 Jun 2026",
    venue: "Dina Simprug",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Dina Simprug (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-55ug7066v50mophksim6eiipl2",
    monthKey: "2026-06",
    date: "2026-06-05",
    dateLabel: "5 Jun 2026",
    venue: "NAko depok",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: NAko depok (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-71j22jgrui7uc7kf6clc1bfane",
    monthKey: "2026-06",
    date: "2026-06-05",
    dateLabel: "5 Jun 2026",
    venue: "Rivo Sumitro",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Rivo Sumitro (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6os3ec9lcgr3ab9p68p3eb9kclgm8b9p64p3abb475hm4cr270p6ccr16o",
    monthKey: "2026-06",
    date: "2026-06-05",
    dateLabel: "5 Jun 2026",
    venue: "Wulan GBR",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Parled 8\nFreshnell 4 \nBeam 6\n4,5 jt",
    sections: [
      createSection(
        "Lighting",
        "Parled 8",
        ["Parled 8", "Freshnell 4", "Beam 6", "4,5 jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4ttoj111qkso4don45e0uoe5sg",
    monthKey: "2026-06",
    date: "2026-06-06",
    dateLabel: "6 Jun 2026",
    venue: "AYONG CIBUBUR",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Kharo (Mulyana)",
    status: "Selesai",
    gcalSynced: true,
    notes: "<p dir=\"ltr\">*6 Juni Cibubur*</p><p dir=\"ltr\">Loading tgl 5 malam jam 18:00 dilokasi  </p><p dir=\"ltr\">- *Led* </p><p dir=\"ltr\">- Led 2 x 5 </p><p dir=\"ltr\">- Crew : Ayong, Kharo, woyo </p><p dir=\"ltr\">- Mobil : Engkel riz </p>",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["<p dir=\"ltr\">*6 Juni Cibubur*</p><p dir=\"ltr\">Loading tgl 5 malam jam 18:00 dilokasi  </p><p dir=\"ltr\">- *Led* </p><p dir=\"ltr\">- Led 2 x 5 </p><p dir=\"ltr\">- Crew : Ayong, Kharo, woyo </p><p dir=\"ltr\">- Mobil : Engkel riz </p>"],
        ["Kharo", "Ayong"],
        []
      ),
    ],
  },
  {
    id: "gcal-c9hm2pb26thjgbb270pjgb9kcksj0b9o6gq3cbb674pjcob1cdgj0chn60",
    monthKey: "2026-06",
    date: "2026-06-06",
    dateLabel: "6 Jun 2026",
    venue: "Angga order",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Wedding\nSound System\nSabtu, 6 Juni 2026\nVan Hoeis\n\nFormat wedding entertainment:\nVocal \nBass\nBiola\nKeyboard \nDrum Akustik \n\n5000 watt\n\nMain PA\n4 Unit dBTech Opera15 \nStand Speaker \n2 Unit Sub RCF 8001\n\nDelay Venue\n2 Unit dBTech/RCF315 \n2 Unit Stand speaker \n\nOn stage Band:\n1 Set Mic Drum AKG\n4 Unit dBTech/RCF315 \n2 Unit Stand Book\n1 Unit Stand Keyboard Single \n4 Unit DI Box \n\nConsole\n1 Unit Midas M32R \n1 Unit DL32\n\nMicrophone:\n4 Unit Mic QA Electronic \n1 Lot Microphone Cable\n\nMiscellaneous:\nCable System \nAudio Equipment \nElectricity Equipment",
    sections: [
      createSection(
        "Audio",
        "Sabtu, 6 Juni 2026",
        ["Sabtu, 6 Juni 2026", "Van Hoeis", "Format wedding entertainment:", "Vocal", "Bass", "Biola", "Keyboard", "Drum Akustik", "5000 watt", "Main PA", "4 Unit dBTech Opera15", "Stand Speaker", "2 Unit Sub RCF 8001", "Delay Venue", "2 Unit dBTech/RCF315", "2 Unit Stand speaker", "1 Set Mic Drum AKG", "4 Unit dBTech/RCF315", "2 Unit Stand Book", "1 Unit Stand Keyboard Single", "4 Unit DI Box", "Console", "1 Unit Midas M32R", "1 Unit DL32", "Microphone:", "4 Unit Mic QA Electronic", "1 Lot Microphone Cable", "Miscellaneous:", "Cable System", "Audio Equipment", "Electricity Equipment"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "On stage Band:",
        ["On stage Band:"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-39ei9ebvd2psjaqq7nlfckshj8",
    monthKey: "2026-06",
    date: "2026-06-06",
    dateLabel: "6 Jun 2026",
    venue: "Dina GBK",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Dina GBK (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0vit3j9k75difnd2nk72p5de64",
    monthKey: "2026-06",
    date: "2026-06-06",
    dateLabel: "6 Jun 2026",
    venue: "KEVIN RR",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "<p dir=\"ltr\">*6 Juni Tennis Indoor (Kevin RR)*</p><p dir=\"ltr\">Loading </p><p dir=\"ltr\">- Shure SLXD 16 Unit</p><p dir=\"ltr\">- Distributor 4 Unit</p><p dir=\"ltr\">- Midas M32 2Unit</p><p dir=\"ltr\">- Crew : Asep, Inal </p><p dir=\"ltr\">- Mobil : Luxio </p>",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["<p dir=\"ltr\">*6 Juni Tennis Indoor (Kevin RR)*</p><p dir=\"ltr\">Loading </p><p dir=\"ltr\">- Shure SLXD 16 Unit</p><p dir=\"ltr\">- Distributor 4 Unit</p><p dir=\"ltr\">- Midas M32 2Unit</p><p dir=\"ltr\">- Crew : Asep, Inal </p><p dir=\"ltr\">- Mobil : Luxio </p>"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7k56u9eb7l3ir7nte7kdhc15nt",
    monthKey: "2026-06",
    date: "2026-06-07",
    dateLabel: "7 Jun 2026",
    venue: "AYONG Grand Paragon",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Wigi (Dedi Agus Wigiantoro)",
    status: "Selesai",
    gcalSynced: true,
    notes: "<p dir=\"ltr\">*7 Juni Grand Paragon*</p><p dir=\"ltr\">Loading loading tgl 6 jam 20:00 dilokasi  </p><p dir=\"ltr\">- *Led*</p><p dir=\"ltr\">- Led 3,5 x 7 </p><p dir=\"ltr\">- Level tinggi 1 meter</p><p dir=\"ltr\">- Crew : Ayong, kharo, woyo, Wigi, yopi </p><p dir=\"ltr\">- Mobil : Engkel riz, RIZ</p>",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["<p dir=\"ltr\">*7 Juni Grand Paragon*</p><p dir=\"ltr\">Loading loading tgl 6 jam 20:00 dilokasi  </p><p dir=\"ltr\">- *Led*</p><p dir=\"ltr\">- Led 3,5 x 7 </p><p dir=\"ltr\">- Level tinggi 1 meter</p><p dir=\"ltr\">- Crew : Ayong, kharo, woyo, Wigi, yopi </p><p dir=\"ltr\">- Mobil : Engkel riz, RIZ</p>"],
        ["Wigi", "Kharo", "Yopy", "Ayong"],
        []
      ),
    ],
  },
  {
    id: "gcal-2b0mh7hqp17cajrql5t48s0g31",
    monthKey: "2026-06",
    date: "2026-06-07",
    dateLabel: "7 Jun 2026",
    venue: "KEVIN RR",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Shure / Sennheiser 16Pcs \n-",
    sections: [
      createSection(
        "Audio",
        "Shure / Sennheiser 16Pcs",
        ["Shure / Sennheiser 16Pcs"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6vnt20d8o62pietpq5d67agoru",
    monthKey: "2026-06",
    date: "2026-06-08",
    endDate: "2026-06-12",
    dateLabel: "8-12 Jun 2026",
    venue: "Syamsul Rajawali req Irvan sama Fiki",
    loadingSchedule: "Loading jam 18.00",
    pic: "Irvan (Muhamad Irvan)",
    status: "Selesai",
    gcalSynced: true,
    notes: "Loading jam 18.00\nLED 2x5 + Level 1Meter",
    sections: [
      createSection(
        "Videotron",
        "LED 2x5 + Level 1Meter",
        ["LED 2x5 + Level 1Meter"],
        ["Irvan", "Fiki"],
        []
      ),
    ],
  },
  {
    id: "gcal-0j8186gu7v60curff1u1839pq4",
    monthKey: "2026-06",
    date: "2026-06-08",
    endDate: "2026-06-10",
    dateLabel: "8-10 Jun 2026",
    venue: "shooting star paragon",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: shooting star paragon (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-442866aht334innu5hjiam4je7",
    monthKey: "2026-06",
    date: "2026-06-09",
    dateLabel: "9 Jun 2026",
    venue: "MD",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: MD (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6o8rkcunt84lll7os50uc49e7s",
    monthKey: "2026-06",
    date: "2026-06-09",
    dateLabel: "9 Jun 2026",
    venue: "Ngopi Lagi Malang",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Ngopi Lagi Malang (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0rbfsmbohjpokp6cerqe9t6dmp",
    monthKey: "2026-06",
    date: "2026-06-10",
    dateLabel: "10 Jun 2026",
    venue: "FAHRI THAMRIN NINE",
    loadingSchedule: "Loading Selasa 9 Juni 2026, Jam 10 Malam (Acara Rabu). Lokasi Thamrin Nine Ballroom",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Loading Selasa 9 Juni 2026, Jam 10 Malam (Acara Rabu). Lokasi Thamrin Nine Ballroom\n\nLED P 2.6 6mx3m\nPeninggian LED 1m\nFresnel 4 Unit (Tripod 2 Unit)",
    sections: [
      createSection(
        "Videotron",
        "LED P 2.6 6mx3m",
        ["LED P 2.6 6mx3m", "Peninggian LED 1m"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Fresnel 4 Unit (Tripod 2 Unit)",
        ["Fresnel 4 Unit (Tripod 2 Unit)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0a59jklcrjtm6cd625l6ikgf17",
    monthKey: "2026-06",
    date: "2026-06-11",
    dateLabel: "11 Jun 2026",
    venue: "Event: IAS 11 juni LED 7x3 + Level T. 1Meter (Surabaya) 10 Juni (Jam Dilokasi) WIGI",
    loadingSchedule: "Jam Dilokasi) WIGI",
    pic: "Wigi (Dedi Agus Wigiantoro)",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["Event: IAS 11 juni LED 7x3 + Level T. 1Meter (Surabaya) 10 Juni (Jam Dilokasi) WIGI"],
        ["Wigi"],
        []
      ),
    ],
  },
  {
    id: "gcal-04fkod4sjrp249mj0p6khijrgi",
    monthKey: "2026-06",
    date: "2026-06-11",
    dateLabel: "11 Jun 2026",
    venue: "MORRISSEY Menteng Andara",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: MORRISSEY Menteng Andara (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7h2anlngi5ejm5kqq2jaf0sac7",
    monthKey: "2026-06",
    date: "2026-06-11",
    dateLabel: "11 Jun 2026",
    venue: "SURVEY PAK FAUZI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: SURVEY PAK FAUZI (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7ch6lob8h7rd9bo6p5da9k8l1s",
    monthKey: "2026-06",
    date: "2026-06-12",
    dateLabel: "12 Jun 2026",
    venue: "SHUTTSOOT",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Audio ;\n- Mic Cable 58 3pc\n- Mic Cable 57 2pc\n- P2 Monitor Cable 3pc\n- Stand Gitar 1pc (isi 3) \n- Stand Book 3pc\n- Stand Keyboard Single 2pc\n- Stand Keyboard Double 1pc\n- DI BOX 6pc\n- TS to TS cable 10pc (Jack gitar)\n- XLR cable 30pc\n\nLighting : \n- Stormy 18 Unit (Ambience)",
    sections: [
      createSection(
        "Audio",
        "Mic Cable 58 3pc",
        ["Mic Cable 58 3pc", "Mic Cable 57 2pc", "P2 Monitor Cable 3pc", "Stand Gitar 1pc (isi 3)", "Stand Book 3pc", "Stand Keyboard Single 2pc", "Stand Keyboard Double 1pc", "DI BOX 6pc", "TS to TS cable 10pc (Jack gitar)", "XLR cable 30pc"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Stormy 18 Unit (Ambience)",
        ["Stormy 18 Unit (Ambience)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cpgjie9mcphjabb3c8q64b9kcor3gbb1clhm6b9l6kpj6db6c8s34cpp74",
    monthKey: "2026-06",
    date: "2026-06-12",
    endDate: "2026-06-14",
    dateLabel: "12-14 Jun 2026",
    venue: "Wawan Ice",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Wawan Ice (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7sgt8d5dljf08chsabbdkt6kqt",
    monthKey: "2026-06",
    date: "2026-06-13",
    dateLabel: "13 Jun 2026",
    venue: "ANDREAS R2R gereja cakung loading jam",
    loadingSchedule: "loading jam",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Moving 2 \n- Parled 8\n- Freshnell 2\n- Hazzer \n- Budget 3Jt\n\n- Processor VX1000 2 UNit\n- Man POwer + Supervisi\n- Budget 2,5Jt",
    sections: [
      createSection(
        "Lighting",
        "Parled 8",
        ["Parled 8", "Freshnell 2", "Hazzer", "Processor VX1000 2 UNit", "Man POwer + Supervisi"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0mg0dag3smio5ndcut1ri2pvt0",
    monthKey: "2026-06",
    date: "2026-06-13",
    endDate: "2026-06-14",
    dateLabel: "13-14 Jun 2026",
    venue: "DINA V3 SIMPRUG BALL ROOM & GORPERTAMINA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: DINA V3 SIMPRUG BALL ROOM & GORPERTAMINA (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6j3i7taad0i0oqo6905jogu86e",
    monthKey: "2026-06",
    date: "2026-06-13",
    dateLabel: "13 Jun 2026",
    venue: "SAMSU PROGRESS VISUAL",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "SWISSBELL KALIBATA\n\nP2.6 5 X 2,5 Meter",
    sections: [
      createSection(
        "Videotron",
        "P2.6 5 X 2,5 Meter",
        ["P2.6 5 X 2,5 Meter"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-25iljdc05i6sl52dmq215hdt1l",
    monthKey: "2026-06",
    date: "2026-06-14",
    dateLabel: "14 Jun 2026",
    venue: "Gor Padjajaran Aca",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "ACA",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound 5rb \nMonitor Sebaran Stand\nDP 1 JT\nLampiran Google Calendar: QUO_ARIYA_GOR PADJADJARAN_14 JUNI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound 5rb",
        ["Sound 5rb", "Monitor Sebaran Stand"],
        ["ACA"],
        []
      ),
    ],
  },
  {
    id: "gcal-367117f7f67q07uho59ljtkg2u",
    monthKey: "2026-06",
    date: "2026-06-14",
    dateLabel: "14 Jun 2026",
    venue: "IBU MEY MEY BIGLAND HOTEL",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "DP 1 JT \n\nLighting \nParled 2 bar\nFresnell 4\nTripod 2\nSmoke",
    sections: [
      createSection(
        "Lighting",
        "Parled 2 bar",
        ["Parled 2 bar", "Fresnell 4", "Tripod 2", "Smoke"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-coq34e316spjab9k71h30b9k6dj38bb1ckp66b9k61ijeopocko3ap1l60",
    monthKey: "2026-06",
    date: "2026-06-14",
    dateLabel: "14 Jun 2026",
    venue: "IPoel Padi Amaris cisarua",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*14 Juni Villa Amarillis Cisarua*\n- Sound 20rb Midas HD 2, Riders Padi, Backline Home Band *35Jt*\n- Lighting Spek *18Jt*\n- LED 4x7 @600rb \n- VJ LED 3,5jt\n- Level + Gawangan LED \n- Gawangan Lighting 5 x 8 Meter\n- Tower T 2\n- Genset 80 KVA 3 Unit @4Jt",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Sound 20rb Midas HD 2, Riders Padi, Backline Home Band *35Jt"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "LED 4x7 @600rb",
        ["LED 4x7 @600rb", "VJ LED 3,5jt", "Level + Gawangan LED"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting Spek *18Jt",
        ["Lighting Spek *18Jt", "Gawangan Lighting 5 x 8 Meter", "Tower T 2"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Genset 80 KVA 3 Unit @4Jt",
        ["Genset 80 KVA 3 Unit @4Jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6btsesh8gn5rqocb0mfbncqv81",
    monthKey: "2026-06",
    date: "2026-06-15",
    dateLabel: "15 Jun 2026",
    venue: "MEETING HUABAO BSD EVO",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: MEETING HUABAO BSD EVO (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1ml4d3r16kk2frpte7e55sgi6r",
    monthKey: "2026-06",
    date: "2026-06-16",
    dateLabel: "16 Jun 2026",
    venue: "Ayong SMESCO",
    loadingSchedule: "Jam 18.00 udh dilokasi",
    pic: "Ayong Sumarsih",
    status: "Selesai",
    gcalSynced: true,
    notes: "Event tgl 16 juni 2026 venue smesco\nJam 18.00 udh dilokasi\n\nSpek : \nSound system 15rb watt\n• wireles 9 + 1 unit clip on \n\nLighting : 10 beam, 4 barparled, 6 fresnel, 4 unit minibrut, 1 unit follow spot + gunsmoke + tripot 4 uniy",
    sections: [
      createSection(
        "Audio",
        "Sound system 15rb watt",
        ["Sound system 15rb watt", "wireles 9 + 1 unit clip on"],
        ["Ayong"],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["Lighting : 10 beam, 4 barparled, 6 fresnel, 4 unit minibrut, 1 unit follow spot + gunsmoke + tripot 4 uniy"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3gf2d73s98es1et4rofhjehb6k",
    monthKey: "2026-06",
    date: "2026-06-16",
    dateLabel: "16 Jun 2026",
    venue: "Fery Softunes",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Sound 15.000 11jt\n- Backline 3,5jt\n- Lighting (Parled 12, Beam 4, Freshnell 4, Followspot, Hazzer 4jt",
    sections: [
      createSection(
        "Audio",
        "Sound 15.000 11jt",
        ["Sound 15.000 11jt", "Backline 3,5jt"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["Lighting (Parled 12, Beam 4, Freshnell 4, Followspot, Hazzer 4jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-727708k97rfsauro524krklh7r",
    monthKey: "2026-06",
    date: "2026-06-16",
    dateLabel: "16 Jun 2026",
    venue: "Ghita Tmii",
    loadingSchedule: "Loading 15 Sore jam 16.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "16 Juni TMII Sasana Kriya\nLoading 15 Sore jam 16.00\n- LED P3.9 Indoor 4x8 32x400 12,8\n- Level T.1,5 8Meter x200Rb 1,6Jt\n- Total 14,4Jt\n- Disc 400\n- Grand Total 14Jt\n\nMasuk DP 4 Jt Tgl 14 Juni 2026",
    sections: [
      createSection(
        "Videotron",
        "LED P3.9 Indoor 4x8 32x400 12,8",
        ["LED P3.9 Indoor 4x8 32x400 12,8", "Level T.1,5 8Meter x200Rb 1,6Jt", "Total 14,4Jt", "Disc 400", "Grand Total 14Jt", "Masuk DP 4 Jt Tgl 14 Juni 2026"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7q5d19fjjdsuunb7pn3l29a7a9",
    monthKey: "2026-06",
    date: "2026-06-16",
    dateLabel: "16 Jun 2026",
    venue: "SAMSU PROGRESS (asslm. om led p 3.9 utk tgl 16 juni loading 15 juni sore  ukuran 2x3 mtr (2 unit))",
    loadingSchedule: "loading 15 juni sore  ukuran 2x3 mtr (2 unit))",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["SAMSU PROGRESS (asslm. om led p 3.9 utk tgl 16 juni loading 15 juni sore  ukuran 2x3 mtr (2 unit))"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3d5fcsg8it2hthe0r38gb5ogut",
    monthKey: "2026-06",
    date: "2026-06-17",
    dateLabel: "17 Jun 2026",
    venue: "PAK FIRMAN PERPISAHAN UMMUL QURO",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Ayong Sumarsih",
    status: "Selesai",
    gcalSynced: true,
    notes: "DP 9JT 27 APRIL 2026\nreq Ayong\nLampiran Google Calendar: QUO_PAK FIRMAN FERDIAN_GEDUNG HARMONY YASMIN_17 JUNI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_PAK FIRMAN FERDIAN_GEDUNG HARMONY YASMIN_17 JUNI 2026.pdf"],
        ["Ayong"],
        []
      ),
    ],
  },
  {
    id: "gcal-58tp955uol7bv5ng5tjnd052la",
    monthKey: "2026-06",
    date: "2026-06-18",
    dateLabel: "18 Jun 2026",
    venue: "MAXINDO RAFLESS",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: MAXINDO RAFLESS (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5g069abls2iotul7chp2t9ra7l",
    monthKey: "2026-06",
    date: "2026-06-18",
    endDate: "2026-06-19",
    dateLabel: "18-19 Jun 2026",
    venue: "SIMPLE EVENT MANHATTAN KUNINGAN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: SIMPLE EVENT MANHATTAN KUNINGAN (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6t2mevjafufcaqpg54lp9p3ptk",
    monthKey: "2026-06",
    date: "2026-06-18",
    dateLabel: "18 Jun 2026",
    venue: "Sumdok Pullman CP",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Sumdok Pullman CP (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0a4d4o40n0kbgbbb6is1q9kkkt",
    monthKey: "2026-06",
    date: "2026-06-19",
    dateLabel: "19 Jun 2026",
    venue: "DEBOER ESSILOR",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: DEBOER ESSILOR (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6kom4cr26phmabb274o3eb9k64s30b9oc4rj6bb16or3gdpkcorjcp336o",
    monthKey: "2026-06",
    date: "2026-06-20",
    dateLabel: "20 Jun 2026",
    venue: "Bowo Smansa",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Bos buat tgl 20 juni di Smansa yah 10rb watt atau 15rb watt\nLED 3x6 + bantalan",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Bos buat tgl 20 juni di Smansa yah 10rb watt atau 15rb watt"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "LED 3x6 + bantalan",
        ["LED 3x6 + bantalan"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-60r64phgcpi38b9n6thm2b9kc4q3ibb2ckpm8bb36gpj2o9j6hhjcdhmcg",
    monthKey: "2026-06",
    date: "2026-06-20",
    dateLabel: "20 Jun 2026",
    venue: "BuitenJazz Ogi Puri begawan",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Center 4x10\n- Wing 3x4,5 (67 Meter)\n- Lighting",
    sections: [
      createSection(
        "Videotron",
        "Center 4x10",
        ["Center 4x10", "Wing 3x4,5 (67 Meter)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0jlvuhcd428n1lg3bn2nq65o8n",
    monthKey: "2026-06",
    date: "2026-06-20",
    dateLabel: "20 Jun 2026",
    venue: "MANG UUS MI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Sound 3000\n- Lighting",
    sections: [
      createSection(
        "Audio",
        "Sound 3000",
        ["Sound 3000"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-ccq64pb3c8qjebb46dhj2b9k71gmab9p68pm2bb16ks3iphmcpj3cpj4cc",
    monthKey: "2026-06",
    date: "2026-06-20",
    dateLabel: "20 Jun 2026",
    venue: "Mami ratna pakansari loading jam 06.00",
    loadingSchedule: "loading jam 06.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "promter 43\" 2unit utk tgl 20 - 21 Juni di Pakansari\n1,6JtAssalamualaikum",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Mami ratna pakansari loading jam 06.00 (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1se3gbgm3drmsj267qqm8nid29",
    monthKey: "2026-06",
    date: "2026-06-20",
    dateLabel: "20 Jun 2026",
    venue: "Vacenk Sewa Cable Protector 25M",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Vacenk Sewa Cable Protector 25M (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-70rj8e9ic8o3ibb470pjeb9kckpjibb1cphm8bb275ij2ohhclij6eb474",
    monthKey: "2026-06",
    date: "2026-06-22",
    dateLabel: "22 Jun 2026",
    venue: "Meeting RI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Assalamu’alaikum wr wb bapak2 dan kakak2 pengurus yang terhormat\n\nMengingatkan bahwa BESOK, Senin 22 Juni 2026\nPukul 13.00\nDi Sekretariat Rental Indonesia\n(Kantor KAS Pro)\n\nKita akan mengadakan rapat Pengurus DPP Rental Indonesia\n\nDimohon untuk membawa Laptop / Tab, karena akan sosialisasi Website baru\n\nDan mengenakan Polo Rental Indonesia\n\nDemikian, atas perhatiannya kami ucapkan terimakasih\n\nWassalamu'alaikum wr wb",
    sections: [
      createSection(
        "Multimedia",
        "Multimedia, Cam & Live Stream",
        ["Dimohon untuk membawa Laptop / Tab, karena akan sosialisasi Website baru", "Dan mengenakan Polo Rental Indonesia", "Demikian, atas perhatiannya kami ucapkan terimakasih", "Wassalamu'alaikum wr wb"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-ccs3gd1i6ko66b9h6ko3eb9kc8o38bb26oq68b9iccp3cc1m70oj6cr370",
    monthKey: "2026-06",
    date: "2026-06-23",
    dateLabel: "23 Jun 2026",
    venue: "Backlinght Astra Grand platinum",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_PAK FIRMAN_ASTRA BACKLIGHT_GRAND PLATINUM KEMAYORAN_23 JUNI 2026.pdf",
    sections: [
      createSection(
        "Multimedia",
        "Backlinght Astra Grand platinum",
        ["Backlinght Astra Grand platinum"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cor3go9m69j62b9ncdgmab9k70rm2bb1c4rm2b9p6tgjae1oclhjeeb56c",
    monthKey: "2026-06",
    date: "2026-06-24",
    endDate: "2026-06-25",
    dateLabel: "24-25 Jun 2026",
    venue: "Angga Order Shangrilla",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- LED P3.9 Indoor 3x6\n- 18 x 400rb : 7,2jt\n- Dudukan 6m Tinggi 80Cm x 200rb : 1,2jt\nTotal: 8,4jt x 1,5 hari\n12,6jt\n3 Unit x 500,000 x 1,5 hari\n2,250,000",
    sections: [
      createSection(
        "Videotron",
        "LED P3.9 Indoor 3x6",
        ["LED P3.9 Indoor 3x6", "18 x 400rb : 7,2jt", "Dudukan 6m Tinggi 80Cm x 200rb : 1,2jt", "Total: 8,4jt x 1,5 hari", "12,6jt", "3 Unit x 500,000 x 1,5 hari", "2,250,000"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6tj3idhjcgs62b9pcorm6b9k75hjab9ockrm6bb4cos66c9hc8s6achg64",
    monthKey: "2026-06",
    date: "2026-06-25",
    dateLabel: "25 Jun 2026",
    venue: "Ghita Tribrata",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- LED P3.9 3x6 18x400rb *7,2Jt*\n- Level T.120 Cm 6Meterx200 *1,2Jt*\n- Total *8,4Jt*\n- Cabling HDMI + Splitter 250rb",
    sections: [
      createSection(
        "Videotron",
        "LED P3.9 3x6 18x400rb *7,2Jt",
        ["LED P3.9 3x6 18x400rb *7,2Jt", "Level T.120 Cm 6Meterx200 *1,2Jt", "Cabling HDMI + Splitter 250rb"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-coojgd9p6op3ibb66oqj6b9k6th68bb16or3eb9i6pim8or465j3ap1p6c",
    monthKey: "2026-06",
    date: "2026-06-25",
    dateLabel: "25 Jun 2026",
    venue: "WAVE Brother Darmawangsa Loading jam 22.00",
    loadingSchedule: "Loading jam 22.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "SOUND SYSTEM SPESIFIKASI EQUIPMENT 5.000 WATT\n1. Main House\n- RCF 6001 + Sub 8001 \nMonitoring System & Delay\n- RCF ART 315 (Floor Monitor) 2Pcs\n- RCF ART 315 (Delay) Pcs\nMixing Console & Processor System\n- Midas M32 + DL32 \nMiking System & Direct\n- Seenheiser EWD 7Pcs\n- shure SM 58 3Pcs\n- Shure SM57 3Pcs\n- DI Box 4Pcs\nETC \n- Stand Mic Long 6Pcs\n- Stand Speaker 4Pcs\n- Stand book 1\n- Stand Double 1\nBAND EQUIPMENT\n- RD700 GX 1Unit",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["SOUND SYSTEM SPESIFIKASI EQUIPMENT 5.000 WATT", "1. Main House", "RCF 6001 + Sub 8001", "Monitoring System & Delay", "RCF ART 315 (Floor Monitor) 2Pcs", " RCF ART 315 (Delay) Pcs", "Mixing Console & Processor System", "Midas M32 + DL32", "Miking System & Direct", "Seenheiser EWD 7Pcs", "shure SM 58 3Pcs", "Shure SM57 3Pcs", "DI Box 4Pcs", "ETC", "Stand Mic Long 6Pcs", "Stand Speaker 4Pcs", "Stand book 1", "Stand Double 1", "BAND EQUIPMENT", "RD700 GX 1Unit"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cgpm8p9o6sq34bb564rm8b9k68q3abb16gpjgb9kckom2p1o60o30cpo6g",
    monthKey: "2026-06",
    date: "2026-06-25",
    dateLabel: "25 Jun 2026",
    venue: "WAVE Brother Kayu Menjangan Loading 24 Malam Jam 22.30",
    loadingSchedule: "Loading 24 Malam Jam 22.30",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "SOUND SYSTEM SPESIFIKASI EQUIPMENT 5.000 WATT\n1. Main House\n- RCF 6001 + Sub 8001 \nMonitoring System & Delay\n- DB Tech Opera 15\"  (Floor Monitor) 6Pcs\nMixing Console & Processor System\n- Midas M32R + DL32 \nMiking System & Direct\n- Seenheiser EWD 4Pcs\n- Sennheiser G3 Headset 2 (Skin tone) \n- shure SM 58 3Pcs\n- Shure SM57 3Pcs\n- DI Box 4Pcs\nETC \n- Stand Mic Long 6Pcs\n- Stand Speaker 4Pcs\n- Stand book 1\n- Stand Double 1",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["SOUND SYSTEM SPESIFIKASI EQUIPMENT 5.000 WATT", "1. Main House", "RCF 6001 + Sub 8001", "Monitoring System & Delay", "DB Tech Opera 15\"  (Floor Monitor) 6Pcs", "Mixing Console & Processor System", "Midas M32R + DL32", "Miking System & Direct", "Seenheiser EWD 4Pcs", "Sennheiser G3 Headset 2 (Skin tone)", "shure SM 58 3Pcs", "Shure SM57 3Pcs", "DI Box 4Pcs", "ETC", "Stand Mic Long 6Pcs", "Stand Speaker 4Pcs", "Stand book 1", "Stand Double 1"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-50lanb8g7sdd6hf3pdn2lap9o4",
    monthKey: "2026-06",
    date: "2026-06-26",
    endDate: "2026-06-28",
    dateLabel: "26-28 Jun 2026",
    venue: "FLOW 301 DOME SPIKE NICE PIK",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- TV 42\" 2 + System Cabling\n- WHM SLXD 8Pcs + Antena\nLampiran Google Calendar: QUO_301 MUSIC_SPIKE AIR DOME NICE (DOME A)_27-28 Juni 2026.Rev.xlsx, QUO_301 MUSIC_SPIKE AIR DOME NICE (DOME B)_27-28 Juni 2026_REV 2.xlsx",
    sections: [
      createSection(
        "Audio",
        "WHM SLXD 8Pcs + Antena",
        ["WHM SLXD 8Pcs + Antena"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "TV 42\" 2 + System Cabling",
        ["TV 42\" 2 + System Cabling"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4bd7p0r8nnf0q5396t1qlsa5ph",
    monthKey: "2026-06",
    date: "2026-06-26",
    dateLabel: "26 Jun 2026",
    venue: "Nako Bekasi",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_PT NAKO KREASI_KOPI NAKO SMB_26 JUNI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_PT NAKO KREASI_KOPI NAKO SMB_26 JUNI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-ckr64p1jckp3eb9mcopj6b9k74s6ab9oc4p64bb2c5hm6d1k70s38c1l70",
    monthKey: "2026-06",
    date: "2026-06-27",
    dateLabel: "27 Jun 2026",
    venue: "Mesjid Mekah tablig Sound 3000",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Mesjid Mekah tablig Sound 3000",
        ["Mesjid Mekah tablig Sound 3000"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6phm6pj169h38b9i6op3cb9kccpjcbb26tgj2b9k6lhm6d1icgq3cp9kc8",
    monthKey: "2026-06",
    date: "2026-06-27",
    dateLabel: "27 Jun 2026",
    venue: "Tata MC",
    loadingSchedule: "Loading 26 Malam",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*27 Juni Aston Sentul*\n- Loading 26 Malam\n- Sound 5.000 watt\n- Backline Set",
    sections: [
      createSection(
        "Audio",
        "Sound 5.000 watt",
        ["Sound 5.000 watt", "Backline Set"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-75ij6ohp6pgm4bb264s64b9kccsj2bb275i3ab9lcoojepb6chgjcdr66g",
    monthKey: "2026-06",
    date: "2026-06-27",
    dateLabel: "27 Jun 2026",
    venue: "Yudis Pesona alam",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Yudis (Yudishtira)",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Yudis Pesona alam (Menunggu Detail / Assessment Spek Admin)"],
        ["Yudis"],
        []
      ),
    ],
  },
  {
    id: "gcal-1i4dao78kbqn6ive87n2tlm5og",
    monthKey: "2026-06",
    date: "2026-06-28",
    dateLabel: "28 Jun 2026",
    venue: "AIR EO JUNGLELAND",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "EVENT ORDER AIR EO\nSOUND 15RB Ground Stack\nTV stand 55\"\nHari/tgl : Minggu, 28 Juni 2026\nVenue : Jungleland - Amphitheater",
    sections: [
      createSection(
        "Audio",
        "SOUND 15RB Ground Stack",
        ["SOUND 15RB Ground Stack"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "TV stand 55\"",
        ["TV stand 55\"", "Hari/tgl : Minggu, 28 Juni 2026", "Venue : Jungleland - Amphitheater"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-24rn7c9ipsi7l9q6eio8i54qqb",
    monthKey: "2026-06",
    date: "2026-06-30",
    dateLabel: "30 Jun 2026",
    venue: "PS RUPS BAKRIE",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_PRASASTI_HORISON SUITES_RUPS BAKRIE_25 MEI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_PRASASTI_HORISON SUITES_RUPS BAKRIE_25 MEI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  // ============================================================================
  // BULAN JULI 2026 (GOOGLE CALENDAR SYNC)
  // ============================================================================
  {
    id: "gcal-65imadb1chi64b9g6os3ib9k6ko6cbb174o3ebb5cpi34e1o6tj68e1k6k",
    monthKey: "2026-07",
    date: "2026-07-01",
    dateLabel: "1 Jul 2026",
    venue: "Ayong Gowet",
    loadingSchedule: "Loading : tgl 30 juni",
    pic: "Ayong Sumarsih",
    status: "Selesai",
    gcalSynced: true,
    notes: "Event tgl 1 juli 2026\n\nSpek : sound 10rb + backline\n\nLoading : tgl 30 juni\n\nVenue : BSD",
    sections: [
      createSection(
        "Audio",
        "Spek : sound 10rb + backline",
        ["Spek : sound 10rb + backline", "Loading : tgl 30 juni", "Venue : BSD"],
        ["Ayong"],
        []
      ),
    ],
  },
  {
    id: "gcal-cgpmcoj471i3ib9i6ko6ab9k70o3eb9pc5gmcbb4chgj6p3170s6cd1gcc",
    monthKey: "2026-07",
    date: "2026-07-03",
    dateLabel: "3 Jul 2026",
    venue: "RUPS BAKRIE TBC",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: RUPS BAKRIE TBC (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-75ijadb46dij6b9ocgrmab9kcpij8b9pcph36bb564o30e1iclgj8c9p74",
    monthKey: "2026-07",
    date: "2026-07-04",
    dateLabel: "4 Jul 2026",
    venue: "Andara Societieit",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Pasang sticker",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Andara Societieit (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-65im6e9hclj36b9m6ksm2b9kc9j3eb9p6sq66bb5c8ojcopmc9i68p1l68",
    monthKey: "2026-07",
    date: "2026-07-04",
    dateLabel: "4 Jul 2026",
    venue: "Denny WK",
    loadingSchedule: "Loading 3 Juli Malam",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*4 Juli Water Kingdom*\nLoading 3 Juli Malam\n- Sound System 10rb Watt *6Jt*\n- Drum, Key, Gitar 2, Bass 1 *1,5Jt*",
    sections: [
      createSection(
        "Audio",
        "Sound System 10rb Watt *6Jt",
        ["Sound System 10rb Watt *6Jt", "Drum, Key, Gitar 2, Bass 1 *1,5Jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6lj3eohi6lgm6bb56hgj8b9k6so32bb16gqjebb56opj8pj3ccp3acr560",
    monthKey: "2026-07",
    date: "2026-07-04",
    dateLabel: "4 Jul 2026",
    venue: "Oky Balai Sudirman",
    loadingSchedule: "Loading 3 Malam jam 22.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*4 Juli Balai Sudirman (Okky Yani & Friends)*\nLoading 3 Malam jam 22.00\n*PA 5000 Watt*\n*MAIN PA*\n- RCF 6001 2Pcs\n- Sub RCF 8001 2Pcs\n- XILICA XP4080\n*MON*\n- RCF Art315 6Pcs\n*CONSOLE*\n- Midas M32 + DL32\n*MICELLANIOUS*\n- WHM Sennheiser EWD / Shure SLXD 4Pcs\n- DI box 6Pcs\n- Wired Mic 4Pcs\n- Stand Set\n- Cabling 1 Lot\n*BACKLINE*\n- Drum Yamaha Stage custom",
    sections: [
      createSection(
        "Audio",
        "PA 5000 Watt",
        ["PA 5000 Watt", "MAIN PA", "RCF 6001 2Pcs", "Sub RCF 8001 2Pcs", "XILICA XP4080", "MON", "RCF Art315 6Pcs", "CONSOLE", "Midas M32 + DL32", "MICELLANIOUS", "WHM Sennheiser EWD / Shure SLXD 4Pcs", "DI box 6Pcs", "Wired Mic 4Pcs", "Stand Set", "Cabling 1 Lot", "Drum Yamaha Stage custom"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-08j80g92duosclu28ord6aht0r",
    monthKey: "2026-07",
    date: "2026-07-04",
    dateLabel: "4 Jul 2026",
    venue: "PAK BAMBANG PARLE SENAYAN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_BPK. BAMBANG PARLE SENAYAN_4 JULI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_BPK. BAMBANG PARLE SENAYAN_4 JULI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-74pj8c1j6osm8b9jcop66b9kccom6b9pcdi34bb46hhjichi6pgjic9i6g",
    monthKey: "2026-07",
    date: "2026-07-04",
    dateLabel: "4 Jul 2026",
    venue: "Winardi YW",
    loadingSchedule: "Loading 3 Malam jam 22.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*4 Juli Bulungan*\nLoading 3 Malam jam 22.00\n- Marshall JCM 900 HC\n- Ampeq SVT4 Pro + Cab 4x10\n- Drum Tama StarClassic Walnutt 1Set\n- Mic Drum set",
    sections: [
      createSection(
        "Audio",
        "Marshall JCM 900 HC",
        ["Marshall JCM 900 HC", "Drum Tama StarClassic Walnutt 1Set", "Mic Drum set"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "Ampeq SVT4 Pro + Cab 4x10",
        ["Ampeq SVT4 Pro + Cab 4x10"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c5i3icphc8smab9oc5gm8b9k71hj2b9p61j66b9j6goj6phpckpjee1jck",
    monthKey: "2026-07",
    date: "2026-07-05",
    dateLabel: "5 Jul 2026",
    venue: "Epiz Ancol",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Om tgl 27 Juni sound 10 RB watt ya di Ancol..",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Om tgl 27 Juni sound 10 RB watt ya di Ancol.."],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1kqfpr0glckjebbacsivfia585",
    monthKey: "2026-07",
    date: "2026-07-06",
    dateLabel: "6 Jul 2026",
    venue: "REVO DOUBLE TREE",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "2. Soundsystem,  5rb Mic wireless 25 pcs\n3. Doorstop Backdrop, sound 1500 Mic Standing 5 pcs",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["2. ⁠Soundsystem,  5rb Mic wireless 25 pcs", "3. ⁠Doorstop Backdrop, sound 1500 Mic Standing 5 pcs"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cosj0p9o6sr3cbb360o6ab9k74r66bb170pj8b9gc4o66or4chijepj46k",
    monthKey: "2026-07",
    date: "2026-07-07",
    dateLabel: "7 Jul 2026",
    venue: "Fahri Medina RDTX Square Semnggi",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Sound System 5000w =\n- Lighting: Fresnel 4 Unit, Beam 4 Unit, Parled 13 Unit =",
    sections: [
      createSection(
        "Audio",
        "Sound System 5000w =",
        ["Sound System 5000w ="],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["Lighting: Fresnel 4 Unit, Beam 4 Unit, Parled 13 Unit ="],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4a4p5se8o47flqussltut51cgm",
    monthKey: "2026-07",
    date: "2026-07-07",
    dateLabel: "7 Jul 2026",
    venue: "NOVRI SPARTAN TECH MEET",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Assalamualaikum mas wahyu... Panita LTL memanggil utk TM hari Selasa tgl. 7 July jam 14.00 s.d 17.00.  Bisa dibantu perwakilan nya ya mas.",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: NOVRI SPARTAN TECH MEET (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-64r62cpmcgs30bb6clhm2b9k6ks68b9pc9hj6bb26hhmae336ksmachg74",
    monthKey: "2026-07",
    date: "2026-07-09",
    dateLabel: "9 Jul 2026",
    venue: "Mus es3",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sewa Power tx 52, Beam 2",
    sections: [
      createSection(
        "Lighting",
        "Sewa Power tx 52, Beam 2",
        ["Sewa Power tx 52, Beam 2"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-036mka5c3unkvrldljre7kklrf",
    monthKey: "2026-07",
    date: "2026-07-11",
    dateLabel: "11 Jul 2026",
    venue: "AIR EO TRASERA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "<span><span>Hari/tgl : Sabtu, 11 Juli 2026<br>Venue : Transera<br><br>- Sound 7rb watt<br>- Drum set</span></span>",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["<span><span>Hari/tgl : Sabtu, 11 Juli 2026<br>Venue : Transera<br><br>- Sound 7rb watt<br>- Drum set</span></span>"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6hgmad9gclim2b9j6th64b9k6lhj6bb160pj2b9k61ij2e9k6oo66d9m68",
    monthKey: "2026-07",
    date: "2026-07-11",
    dateLabel: "11 Jul 2026",
    venue: "Dedy Armada RSPAD",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- PA 30rb\n- Mixer 2\n- IEM 5\n- WHM 6\n- Budget 21jt\nDP 5Jt",
    sections: [
      createSection(
        "Audio",
        "PA 30rb",
        ["PA 30rb", "Mixer 2", "IEM 5", "WHM 6"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5g25ierqni768r3llsa4vi2b95",
    monthKey: "2026-07",
    date: "2026-07-11",
    dateLabel: "11 Jul 2026",
    venue: "PAK NOVRI PRODUKSI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "41JT",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: PAK NOVRI PRODUKSI (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6gr66d1j6cs6cbb46hij4b9k70q38b9p74p32b9m61gmcopo6pi38e9k70",
    monthKey: "2026-07",
    date: "2026-07-15",
    endDate: "2026-07-18",
    dateLabel: "15-18 Jul 2026",
    venue: "PS PIP Jogja",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: Produksi RIZ PRO pip pasar rakyat 2026_ISI BUDGET VENDOR",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: Produksi RIZ PRO pip pasar rakyat 2026_ISI BUDGET VENDOR"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2qbf3kp04m8gnd05u6erdajlo6",
    monthKey: "2026-07",
    date: "2026-07-17",
    dateLabel: "17 Jul 2026",
    venue: "EDO",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: EDO (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3d3qg5hefis5hs1l5d8l4jnisq",
    monthKey: "2026-07",
    date: "2026-07-17",
    dateLabel: "17 Jul 2026",
    venue: "NOVRI SPARTAN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "DP 15JT 21 JUNI\nDP 3 JULI 6JT\nGenset 40 KVA \nlevel led Tinggi 30 Pajang 6 Meter\nLed jadinya tengah 2x4 Wing 1x2 2pcs\nKabel Protector 20 Meter\nLampiran Google Calendar: INV_NOVRI SPARTAN_LAUTAN LUAS_17 JULI 2026.pdf",
    sections: [
      createSection(
        "Videotron",
        "level led Tinggi 30 Pajang 6 Meter",
        ["level led Tinggi 30 Pajang 6 Meter", "Led jadinya tengah 2x4 Wing 1x2 2pcs"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Genset 40 KVA",
        ["Genset 40 KVA", "Kabel Protector 20 Meter"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6ko6cdb6cdh64b9mchj64b9k64qm8b9p6dh6ab9l6grjad346csmaopm70",
    monthKey: "2026-07",
    date: "2026-07-18",
    dateLabel: "18 Jul 2026",
    venue: "PS Shankei Dharma",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_ PRASASTI_BCC_PT. SHANKEI DHARM_18 JULI 2026_REV1.xlsx",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_ PRASASTI_BCC_PT. SHANKEI DHARM_18 JULI 2026_REV1.xlsx"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c5j3cd9m6kr38b9mc5i3ab9k65gj4b9o68qjeb9nc8r3gp9j65im8dj16o",
    monthKey: "2026-07",
    date: "2026-07-18",
    dateLabel: "18 Jul 2026",
    venue: "Unyink",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Unyim (Wahyudin)",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound 5rb watt \nDrum dtx, Rd\nLighting beam 4, parled 8, fresnel 4",
    sections: [
      createSection(
        "Audio",
        "Sound 5rb watt",
        ["Sound 5rb watt", "Drum dtx, Rd"],
        ["Unyim"],
        []
      ),
      createSection(
        "Lighting",
        "Lighting beam 4, parled 8, fresnel 4",
        ["Lighting beam 4, parled 8, fresnel 4"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5f74nspiqtvq47is7hb2a3cbl6",
    monthKey: "2026-07",
    date: "2026-07-19",
    dateLabel: "19 Jul 2026",
    venue: "BOWO PUSDIK ZENI LAWANG GINTUNG",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- SOUND 40RB",
    sections: [
      createSection(
        "Audio",
        "SOUND 40RB",
        ["SOUND 40RB"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c4o3ic9hckp34bb170sjab9k6gojgb9pclh6cb9pc8s3ecpiccs6ce1ncg",
    monthKey: "2026-07",
    date: "2026-07-21",
    dateLabel: "21 Jul 2026",
    venue: "Angga Kementan",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Event Rakernas & Pelantikan\n\nSelasa, 21 Juli 2026\n\nVenue:\nAuditorium Kementan\nRagunan Pasar Minggu\n\nMain PA:\n2 Unit RCF 6001\n2 Unit Sub RCF 8001\n\nCenter fill:\n2 Unit RCF315\n\nDelay:\n4 Unit RCF315\n4 Unit Stand Speaker\n\nMonitor on Stage:\n2 Unit RCF 312\n\nConsole:\n1 Unit Midas M32R\n1 Unit DL32\n\n4 Mic Wireless\n4 Mic Cable\n1 Mic Podium\n\nAudio Equipment\nCable System\nElectricity Equipment",
    sections: [
      createSection(
        "Audio",
        "2 Unit RCF 6001",
        ["2 Unit RCF 6001", "2 Unit Sub RCF 8001", "Delay:", "4 Unit RCF315", "4 Unit Stand Speaker", "1 Unit Midas M32R", "1 Unit DL32", "4 Mic Wireless", "4 Mic Cable", "1 Mic Podium", "Audio Equipment", "Cable System", "Electricity Equipment"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "Center fill:",
        ["Center fill:", "2 Unit RCF315"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Monitor on Stage:",
        ["Monitor on Stage:", "2 Unit RCF 312", "Console:"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6ss32db36cpj6b9o70o30b9k6cp6cbb26co64b9hchgjcopi64o68phnc4",
    monthKey: "2026-07",
    date: "2026-07-21",
    dateLabel: "21 Jul 2026",
    venue: "INDRA RPN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_RPN_KANTOR RPN_20 JULI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_RPN_KANTOR RPN_20 JULI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-70s3cohk6him4b9i60om2b9k60pmcb9o6dh3gb9ocdijidr475i30chpcg",
    monthKey: "2026-07",
    date: "2026-07-23",
    dateLabel: "23 Jul 2026",
    venue: "EDO FOUR SEASASON",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "DI HOLD\nLampiran Google Calendar: QUO_PAK EDO_FOURSEASON_23 JULI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_PAK EDO_FOURSEASON_23 JULI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3fm2jjbsb3ma6oq8fvi42mm1bc",
    monthKey: "2026-07",
    date: "2026-07-23",
    dateLabel: "23 Jul 2026",
    venue: "MEETING OKK SESI 2",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "<a href=\"https://us06web.zoom.us/launch/jc/88281134602\">https://us06web.zoom.us/launch/jc/88281134602</a>",
    sections: [
      createSection(
        "Multimedia",
        "Multimedia, Cam & Live Stream",
        ["<a href=\"https://us06web.zoom.us/launch/jc/88281134602\">https://us06web.zoom.us/launch/jc/88281134602</a>"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6rpqebuua50jg4mmpmrp23v34h",
    monthKey: "2026-07",
    date: "2026-07-23",
    dateLabel: "23 Jul 2026",
    venue: "MEETING ZOOM OKK SESI 1",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "<a href=\"https://us06web.zoom.us/launch/jc/88281134602\">https://us06web.zoom.us/launch/jc/88281134602</a>",
    sections: [
      createSection(
        "Multimedia",
        "Multimedia, Cam & Live Stream",
        ["<a href=\"https://us06web.zoom.us/launch/jc/88281134602\">https://us06web.zoom.us/launch/jc/88281134602</a>"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0g4h7kun19aeu9og43ktmlmm1q",
    monthKey: "2026-07",
    date: "2026-07-23",
    dateLabel: "23 Jul 2026",
    venue: "RAE SAMIRASA BALLROOM",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "SOUND 10RB + Mic lidi 4 Unit",
    sections: [
      createSection(
        "Audio",
        "SOUND 10RB + Mic lidi 4 Unit",
        ["SOUND 10RB + Mic lidi 4 Unit"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-coq68dpicdhmabb169gm6b9k68q38bb26os3ibb471i3co9k6dgmceb6cc",
    monthKey: "2026-07",
    date: "2026-07-24",
    dateLabel: "24 Jul 2026",
    venue: "Flow Double tree Kemayoran",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "12 x 4,5\n\nTotal 54 meter \n\nIdr 18.9 jt\n\nDp masuk 11 jt\n\nLokasi double 3 kemayoran \nJakpus",
    sections: [
      createSection(
        "Videotron",
        "12 x 4,5",
        ["12 x 4,5", "Total 54 meter", "Idr 18.9 jt", "Dp masuk 11 jt", "Lokasi double 3 kemayoran", "Jakpus"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-01jbes8pc4b7haai9alvtvseep",
    monthKey: "2026-07",
    date: "2026-07-25",
    dateLabel: "25 Jul 2026",
    venue: "ANANG BIG LAND",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Sound 10rb\n- Lighting\nLampiran Google Calendar: Quo_ Anank_ Bigland 25 JUli_REV1.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound 10rb",
        ["Sound 10rb"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6sr32o9o68q34b9i61i38b9kcgomab9oc4o68b9p6sqm8phi69j6cohpcc",
    monthKey: "2026-07",
    date: "2026-07-25",
    dateLabel: "25 Jul 2026",
    venue: "Adin Bogor",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Adin",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound 3rb",
    sections: [
      createSection(
        "Audio",
        "Sound 3rb",
        ["Sound 3rb"],
        ["Adin"],
        []
      ),
    ],
  },
  {
    id: "gcal-6orj6chj6pj66bb660pm4b9k61hj4bb1cdgm4b9o74sjce9ic8sjgdj16g",
    monthKey: "2026-07",
    date: "2026-07-25",
    dateLabel: "25 Jul 2026",
    venue: "Adin depok",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Adin",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound 5rb",
    sections: [
      createSection(
        "Audio",
        "Sound 5rb",
        ["Sound 5rb"],
        ["Adin"],
        []
      ),
    ],
  },
  {
    id: "gcal-3vqhope1l82d9tmo9cngmou0it",
    monthKey: "2026-07",
    date: "2026-07-25",
    dateLabel: "25 Jul 2026",
    venue: "BARA EO ASTON BOGOR",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_BARA EO_ASTON BOGOR_25 JULI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_BARA EO_ASTON BOGOR_25 JULI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4io2i2tern257s7q6k6ttvi5nf",
    monthKey: "2026-07",
    date: "2026-07-25",
    dateLabel: "25 Jul 2026",
    venue: "RESPATI EO",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "LUNAS\n- HIDRAULIC PODIUM 7JT (DP 3.5JT 17 JULI 2026)\nLampiran Google Calendar: INV_RESPATI_TAMAN SAFARI INDONESIA_25 JULI 2026.pdf",
    sections: [
      createSection(
        "Produksi",
        "Produksi, Rigging & Genset",
        ["HIDRAULIC PODIUM 7JT (DP 3.5JT 17 JULI 2026)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7cdovvm7kn703hieg4var51ge4",
    monthKey: "2026-07",
    date: "2026-07-27",
    endDate: "2026-07-28",
    dateLabel: "27-28 Jul 2026",
    venue: "DUMECA KPPN BOGOR",
    loadingSchedule: "26 juli 2026 loading",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "event : rapim djpb kemenkeu \nvenue : kantor kppn bogor\ntanggal :\n- 26 juli 2026 loading \n- 27 & 28 juli acara\nequipment :\nA. AULA\n- sound 5000 watt \n- equipment Tband (backline gears dari kemenkeu, tinggal DI box)\n- 8 WHM\n- 1 mic podium\nB. AREA EXPO (parkiran depan Gedung)\n- 4 standing monitor\n- mini mixer\n- 4 WHM\nC. genset 60kva\nLampiran Google Calendar: INV_PAK DEDI DUMECA_KANTOR KPPN BOGOR_27-28 JULI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "sound 5000 watt",
        ["sound 5000 watt", "equipment Tband (backline gears dari kemenkeu, tinggal DI box)", "8 WHM", "1 mic podium", "B. AREA EXPO (parkiran depan Gedung)", "4 standing monitor", "mini mixer", "4 WHM"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "C. genset 60kva",
        ["C. genset 60kva"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1s4l9hnjrbqbfeuukjm9b6rssd",
    monthKey: "2026-07",
    date: "2026-07-27",
    dateLabel: "27 Jul 2026",
    venue: "SYAMSUL RAJAWALI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Wigi (Dedi Agus Wigiantoro)",
    status: "Selesai",
    gcalSynced: true,
    notes: "Event: RAPIM IAS 27 JULI\nLED 7x3 + Level T. 1Meter (Grha Angkasa Pura Kemayoran) Loading 26 Juii (Jam 16.00 Dilokasi) WIGI",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["LED 7x3 + Level T. 1Meter (Grha Angkasa Pura Kemayoran) Loading 26 Juii (Jam 16.00 Dilokasi) WIGI"],
        ["Wigi"],
        []
      ),
    ],
  },
  {
    id: "gcal-65hjcd1icgsj2bb36ksm6b9k70q6cbb26hijgbb268o6ae1o68qjgc356s",
    monthKey: "2026-07",
    date: "2026-07-30",
    dateLabel: "30 Jul 2026",
    venue: "Erie",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Led P2. 6\nGenset",
    sections: [
      createSection(
        "Videotron",
        "Led P2. 6",
        ["Led P2. 6"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-61j6aphlclj3gb9h64pm4b9k71j38bb26dh66bb26osj2p9jcks3ad9ic8",
    monthKey: "2026-07",
    date: "2026-07-30",
    dateLabel: "30 Jul 2026",
    venue: "Iwar JR Fairmont",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_PAK IWAN JR_FAIRMONT HOTEL_30 JULI 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_PAK IWAN JR_FAIRMONT HOTEL_30 JULI 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3bna458a7mop5fg0pcfesiuuq8",
    monthKey: "2026-07",
    date: "2026-07-31",
    endDate: "2026-08-02",
    dateLabel: "31 Jul - 2 Agu 2026",
    venue: "MAMIH RATNA BLOK M",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_MAMIH RATNA_BLOK M_31 JULI -1-2 AGUSTUS 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_MAMIH RATNA_BLOK M_31 JULI -1-2 AGUSTUS 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6or6co9pckqj4bb66lh64b9k6os66b9o6spjeb9ockr6adpg71i66ohmck",
    monthKey: "2026-07",
    date: "2026-07-31",
    endDate: "2026-08-01",
    dateLabel: "31 Jul - 1 Agu 2026",
    venue: "Permata Artotel Prasasti",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: PRASASTI_PERMATA_ARTOTEL_31 -1 Agustus.xlsx",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: PRASASTI_PERMATA_ARTOTEL_31 -1 Agustus.xlsx"],
        [],
        []
      ),
    ],
  },
  // ============================================================================
  // BULAN AGUSTUS 2026 (GOOGLE CALENDAR SYNC)
  // ============================================================================
  {
    id: "gcal-6srmae3665hj8b9jcoo64b9kc4pm6bb16cqmcb9k60r38db36dijior370",
    monthKey: "2026-08",
    date: "2026-08-01",
    dateLabel: "1 Agu 2026",
    venue: "Evo pesona alam",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "mas acara tgl 1 : \nPEsona alam \n\nBackdrop 3*6 \nBooth 2,5X3 \nSound 5000 \nLighting standar",
    sections: [
      createSection(
        "Audio",
        "Sound 5000",
        ["Sound 5000"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "Booth 2,5X3",
        ["Booth 2,5X3"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting standar",
        ["Lighting standar"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Backdrop 3*6",
        ["Backdrop 3*6"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1bp6fhnruj38li0q28t918eaoo",
    monthKey: "2026-08",
    date: "2026-08-01",
    dateLabel: "1 Agu 2026",
    venue: "Survey Qbig jam",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Survey Qbig jam (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-79c6tjou0vmcg1oj8v2u3iei36",
    monthKey: "2026-08",
    date: "2026-08-01",
    dateLabel: "1 Agu 2026",
    venue: "Zaki Sound + LIghting",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Lighting",
        "Zaki Sound + LIghting",
        ["Zaki Sound + LIghting"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1vpsnufghtdh5l1vo9r3371p8m",
    monthKey: "2026-08",
    date: "2026-08-03",
    dateLabel: "3 Agu 2026",
    venue: "Ronald Shooting star LED 2x3",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Videotron",
        "Ronald Shooting star LED 2x3",
        ["Ronald Shooting star LED 2x3"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6ooj8ohhcdimab9m61j38b9k60pm8b9ocpi3gb9h71h64e3664qj8o9m6c",
    monthKey: "2026-08",
    date: "2026-08-03",
    dateLabel: "3 Agu 2026",
    venue: "Sasta",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Kebutuhannya: \n- sound system 5000 watt \n- lighting set \n- ac standing 4 pcs \n- genset 40 kva 1 pcs",
    sections: [
      createSection(
        "Audio",
        "sound system 5000 watt",
        ["sound system 5000 watt"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "ac standing 4 pcs",
        ["ac standing 4 pcs"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "genset 40 kva 1 pcs",
        ["genset 40 kva 1 pcs"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6koj6d9n75gjcbb26co3gb9k68p32b9p68o68b9g65im8d9kc8oj6e1n74",
    monthKey: "2026-08",
    date: "2026-08-04",
    dateLabel: "4 Agu 2026",
    venue: "Bongkar Produksi lautan luas",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Bongkar Produksi lautan luas (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4alhh839vm4rsmqem0guaclqbp",
    monthKey: "2026-08",
    date: "2026-08-04",
    dateLabel: "4 Agu 2026",
    venue: "Training Grand MA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Training Grand MA (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3kivot29m6uubmsnh7rj3ocgbk",
    monthKey: "2026-08",
    date: "2026-08-05",
    endDate: "2026-08-06",
    dateLabel: "5-6 Agu 2026",
    venue: "FIRMAN BACKLIGHT POSHBLOCK",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_PAK FIRMAN BACKLIGHT_POSHBLOC_6 AGUSTUS 2026.pdf",
    sections: [
      createSection(
        "Multimedia",
        "FIRMAN BACKLIGHT POSHBLOCK",
        ["FIRMAN BACKLIGHT POSHBLOCK"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6csm2c1mc8sm2b9pcgp3eb9k68r3gb9pcoom8bb36cpjcdr6ckr36p1mc8",
    monthKey: "2026-08",
    date: "2026-08-05",
    endDate: "2026-08-07",
    dateLabel: "5-7 Agu 2026",
    venue: "Prasasti PLW",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Prasasti PLW (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0uf9lug4l305dgi52ufre21lrm",
    monthKey: "2026-08",
    date: "2026-08-06",
    dateLabel: "6 Agu 2026",
    venue: "Tech meeting Sarinah Indka",
    loadingSchedule: "6 Agustus Jam 14.00 Sarinah | Loading : tgl 8 agt jam 22.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*6 Agustus Jam 14.00 Sarinah*\n- Technical Meeting \n- Event : \n- Tgl 9 agustus 2026\nRequest : sound 10.000 watt\nLokasi : Sarinah, jl jend Sudirman\nLoading : tgl 8 agt jam 22.00\n\nChannelist :\n- drum electric\n- gitar electric\n- bass electric\n- keyboard\n- Saxo \n- 2 vocal\n- 1 MC\n-------\n- stand mic 3\n- standbook 1\n- ear monitor (dari band)\n\nKabel 4x4 tunggal (panel)",
    sections: [
      createSection(
        "Audio",
        "Request : sound 10.000 watt",
        ["Request : sound 10.000 watt", "Lokasi : Sarinah, jl jend Sudirman", "Loading : tgl 8 agt jam 22.00", "Channelist :", "drum electric", "gitar electric", "bass electric", "keyboard", "Saxo", "2 vocal", "1 MC", "stand mic 3", "standbook 1", "ear monitor (dari band)"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "Kabel 4x4 tunggal (panel)",
        ["Kabel 4x4 tunggal (panel)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-38hqimve0r4v489d5ble5t7k85",
    monthKey: "2026-08",
    date: "2026-08-07",
    dateLabel: "7 Agu 2026",
    venue: "PAK DEDI DUMECA CITRA RAYA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: PAK DEDI DUMECA CITRA RAYA (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-20o6i5v5tkfc8tgpf9cl1buve4",
    monthKey: "2026-08",
    date: "2026-08-08",
    dateLabel: "8 Agu 2026",
    venue: "RESPATI EO",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "DP 13.750.000 TGL 17 JULI 2026\nLampiran Google Calendar: INV_RESPATI_TAMAN SAFARI INDONESIA_8 AGUSTUS 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_RESPATI_TAMAN SAFARI INDONESIA_8 AGUSTUS 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2g98ppcei4lf66flaoe3t6jba0",
    monthKey: "2026-08",
    date: "2026-08-08",
    dateLabel: "8 Agu 2026",
    venue: "ROFIQ DIGIPRO",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_PAK ROFIQ_PIK_8 AGUSTUS 2026_REV2.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_PAK ROFIQ_PIK_8 AGUSTUS 2026_REV2.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-ckr6cd1g6dh3abb46kom2b9kcop62b9o64q6ab9kchh62cr66kqjio9n74",
    monthKey: "2026-08",
    date: "2026-08-09",
    dateLabel: "9 Agu 2026",
    venue: "Indra Indka",
    loadingSchedule: "Loading : tgl 8 agt jam 22.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tgl 9 agustus 2026\n\nRequest : sound 10.000 watt\nLokasi : Sarinah, jl jend Sudirman\nLoading : tgl 8 agt jam 22.00\n\nChannelist :\n- drum electric\n- gitar electric\n- bass electric\n- keyboard\n- Saxo \n- 2 vocal\n- 1 MC\n-------\n- stand mic 3\n- standbook 1\n- ear monitor (dari band)\n\nKabel 4x4 tunggal (panel)",
    sections: [
      createSection(
        "Audio",
        "Request : sound 10.000 watt",
        ["Request : sound 10.000 watt", "Lokasi : Sarinah, jl jend Sudirman", "Loading : tgl 8 agt jam 22.00", "Channelist :", "drum electric", "gitar electric", "bass electric", "keyboard", "Saxo", "2 vocal", "1 MC", "stand mic 3", "standbook 1", "ear monitor (dari band)"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "Kabel 4x4 tunggal (panel)",
        ["Kabel 4x4 tunggal (panel)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6sp32e9l6cq30b9h6ssm2b9kc5gj6b9pccrjib9n70r38or164o36d9l6k",
    monthKey: "2026-08",
    date: "2026-08-10",
    dateLabel: "10 Agu 2026",
    venue: "Fahri",
    loadingSchedule: "Loading Minggu 9 Agustus 2026 (Acara Senin). Lokasi Plaza 89 Kuningan, Jakarta",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Loading Minggu 9 Agustus 2026 (Acara Senin). Lokasi Plaza 89 Kuningan, Jakarta\n\n- LED Videotron P2.6 8mx2m\n- Peninggian LED 50cm\n- Lighting: Fresnel 4 Unit, Beam 4 Unit",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron P2.6 8mx2m",
        ["LED Videotron P2.6 8mx2m", "Peninggian LED 50cm"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["Lighting: Fresnel 4 Unit, Beam 4 Unit"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2go0s6njcbkuk7a7n4g2ctrotf",
    monthKey: "2026-08",
    date: "2026-08-11",
    dateLabel: "11 Agu 2026",
    venue: "STAFF MEETING JAM 09.00",
    loadingSchedule: "JAM 09.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: STAFF MEETING JAM 09.00 (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c8p68eb360omcb9n6co36b9k65j6cbb26dhjebb670qm6c9k75i3id1p6o",
    monthKey: "2026-08",
    date: "2026-08-11",
    dateLabel: "11 Agu 2026",
    venue: "Woyo urus pajak engkel",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Woyo",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Woyo urus pajak engkel (Menunggu Detail / Assessment Spek Admin)"],
        ["Woyo"],
        []
      ),
    ],
  },
  {
    id: "gcal-6ssm6dj56lhmab9jcph38b9k6cqj4b9pc8s3eb9i6dij2p32coqmaob66s",
    monthKey: "2026-08",
    date: "2026-08-12",
    dateLabel: "12 Agu 2026",
    venue: "Dina V3",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Sound 15rb\n- WHM 8",
    sections: [
      createSection(
        "Audio",
        "Sound 15rb",
        ["Sound 15rb", "WHM 8"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0ebjlagg08t1k1kgg6p545e7jn",
    monthKey: "2026-08",
    date: "2026-08-12",
    dateLabel: "12 Agu 2026",
    venue: "YOYO NAWASENA BPDLH loading 11 sore jam 16.00",
    loadingSchedule: "loading 11 sore jam 16.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- SOUND 5000\n- MIC 4\n- Gooseneck\n\n- Sound Doorstop 2rb watt",
    sections: [
      createSection(
        "Audio",
        "SOUND 5000",
        ["SOUND 5000", "MIC 4", "Gooseneck", "Sound Doorstop 2rb watt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6i7icggovpue1q9cgjs2l0lc0f",
    monthKey: "2026-08",
    date: "2026-08-12",
    dateLabel: "12 Agu 2026",
    venue: "ZUL",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: ZUL (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6ph3ccr671h36bb1cks34b9kc8q62bb1c4oj4b9h6tgm4dhgcdhmac34cg",
    monthKey: "2026-08",
    date: "2026-08-13",
    dateLabel: "13 Agu 2026",
    venue: "FAHRI MEDINA",
    loadingSchedule: "Loading Rabu 12 Agustus 2026, Jam 12 Siang (Acara Kamis). Lokasi Plaza 89, Kuningan",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "13 Agust Fahri Medina\nLoading Rabu 12 Agustus 2026, Jam 12 Siang (Acara Kamis). Lokasi Plaza 89, Kuningan\n\n•  Lighting: Fresnel 12, Parled 4, Beam 4 (Tripod 6)",
    sections: [
      createSection(
        "Lighting",
        "Lighting System & Effect",
        [" ⁠Lighting: Fresnel 12, Parled 4, Beam 4 (Tripod 6)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-64qmaphkc4p6ab9j6hhmcb9k6cs6abb1cgr64b9o74p6ad9kc8sj8cj570",
    monthKey: "2026-08",
    date: "2026-08-13",
    endDate: "2026-08-14",
    dateLabel: "13-14 Agu 2026",
    venue: "Fahri Medina Lido",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*PA 5000 Watt*\n*MAIN PA*\n- AudioCenter T45 4Pcs\n- AudioCenter MA18 2Pcs\n*MON*\n- Dbtech Opera 6Pcs\n*CONSOLE*\n- Midas M32 + DL32\n*MICELLANIOUS*\n- WHM Sennheiser EWD / Shure SLXD 4Pcs\n- DI box 6Pcs\n- Wired Mic 4Pcs\n- Stand Set\n- Cabling 1 Lot\n*TEAM*\n- Operator 1Prs\n- Crew 2Prs",
    sections: [
      createSection(
        "Audio",
        "PA 5000 Watt",
        ["PA 5000 Watt", "MAIN PA", "Midas M32 + DL32", "MICELLANIOUS", "WHM Sennheiser EWD / Shure SLXD 4Pcs", "DI box 6Pcs", "Wired Mic 4Pcs", "Stand Set", "Cabling 1 Lot", "TEAM", "Operator 1Prs", "Crew 2Prs"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "AudioCenter T45 4Pcs",
        ["AudioCenter T45 4Pcs", "AudioCenter MA18 2Pcs", "MON", "Dbtech Opera 6Pcs", "CONSOLE"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c4sjep9n6kr36b9mc4r3gb9kcoomabb16li62b9nc9i68c9p6kqm6pho6s",
    monthKey: "2026-08",
    date: "2026-08-13",
    endDate: "2026-08-17",
    dateLabel: "13-17 Agu 2026",
    venue: "Infinite Monas loading 13 Dini hari",
    loadingSchedule: "loading 13 Dini hari",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- LED 80 Meter\n- 2x4 10Set\nLampiran Google Calendar: INV_INFINITE LIVE PRODUCTION_MONAS_17 AGUSTUS 2026.pdf",
    sections: [
      createSection(
        "Videotron",
        "LED 80 Meter",
        ["LED 80 Meter", "2x4 10Set"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6ssj0pb16lj3gb9gcdijab9k6gsjibb26sp30b9i6hijcohg6oomcc9p74",
    monthKey: "2026-08",
    date: "2026-08-13",
    dateLabel: "13 Agu 2026",
    venue: "Meeting Botani 13.00",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Meeting Botani 13.00 (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7crphl5bpom6186d41or74tfag",
    monthKey: "2026-08",
    date: "2026-08-13",
    dateLabel: "13 Agu 2026",
    venue: "Wave Brother Mulya sound 5rb",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Wave Brother Mulya sound 5rb",
        ["Wave Brother Mulya sound 5rb"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-40or3c5l0v6o3mnpasq1ho5bct",
    monthKey: "2026-08",
    date: "2026-08-13",
    dateLabel: "13 Agu 2026",
    venue: "rofiq Digipro",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "1. Soundsytem 5000 watt\n2. Backdrop 5 x 3\n3. Ornamen Bendera segitiga merah putih untuk ukuran ruangan 14 mx 25m pasangnya zigzag",
    sections: [
      createSection(
        "Audio",
        "1.⁠ ⁠Soundsytem 5000 watt",
        ["1.⁠ ⁠Soundsytem 5000 watt"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "2.⁠ ⁠Backdrop 5 x 3",
        ["2.⁠ ⁠Backdrop 5 x 3", "3.⁠ ⁠Ornamen Bendera segitiga merah putih untuk ukuran ruangan 14 mx 25m pasangnya zigzag"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3lfc4egiohd0uf5h7sitq1gni8",
    monthKey: "2026-08",
    date: "2026-08-14",
    dateLabel: "14 Agu 2026",
    venue: "Adin Booking 5000 Watt",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Adin",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Adin Booking 5000 Watt",
        ["Adin Booking 5000 Watt"],
        ["Adin"],
        []
      ),
    ],
  },
  {
    id: "gcal-1hpipcg61e4i5uv3uaufcpkvmb",
    monthKey: "2026-08",
    date: "2026-08-14",
    dateLabel: "14 Agu 2026",
    venue: "EVO CENTRO PTIK LAPANGAN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_EVO CENTRO_PTIK LAPANGAN_14 AGUSTUS 2026.xlsx",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_EVO CENTRO_PTIK LAPANGAN_14 AGUSTUS 2026.xlsx"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-47u1a97800asimu72i8ftlv55t",
    monthKey: "2026-08",
    date: "2026-08-14",
    dateLabel: "14 Agu 2026",
    venue: "Edo Brins Mampang",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Streeming \n- 1 Cam",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Edo Brins Mampang (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-70pjgcpoccom2bb16csm6b9k70rj2b9p6kpj8b9o68pj6d9hccrj6c1o6s",
    monthKey: "2026-08",
    date: "2026-08-14",
    dateLabel: "14 Agu 2026",
    venue: "Fahri medina Lido Pool",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*PA 20.000Watt*\n- AudioCenter Avanda 210 8Pcs\n- Audio Center Avanda 218 4Pcs\n- Marani MIR 480I\n- Midas M32 + DL 32\n*MONITOR & SIDEFILL*\n- RCF Art 315 10Pcs\n- Spliter 32Ch \n- Midas M32 1Pcs\n*MICROPHONE*\n- WHM Sennheiser EWD835 6Pcs\n- Distributor Ant Sennheiser 1Pcs\n- Drum Set Senheiser E604\n- Shure SM81c\n- AKG C1000\n- Shure Beta 91\n- DI BoX set \n*BACKLINE*\n- Drum Yamaha Tour custom\n- Roland RD 700 NX /RD 800 1Pcs\n*ADDITIONAL*\n- IEM Sennheiser G4 3Pcs\n\n*LIGHTING*\n- Parled 20x10watt 8Pcs\n- Moving Beam 450 4Pcs\n- Freshnell 300 4Pcs\n- Smoke Machine / Hazzer 1pcs\n- Mini GrandMa2",
    sections: [
      createSection(
        "Audio",
        "PA 20.000Watt",
        ["PA 20.000Watt", "Midas M32 + DL 32", "MONITOR & SIDEFILL", "RCF Art 315 10Pcs", "Spliter 32Ch", "Midas M32 1Pcs", "MICROPHONE", "WHM Sennheiser EWD835 6Pcs", "Distributor Ant Sennheiser 1Pcs", "Drum Set Senheiser E604", "Shure SM81c", "AKG C1000", "Shure Beta 91", "DI BoX set", "Drum Yamaha Tour custom", "Roland RD 700 NX /RD 800 1Pcs", "ADDITIONAL", "IEM Sennheiser G4 3Pcs"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "AudioCenter Avanda 210 8Pcs",
        ["AudioCenter Avanda 210 8Pcs", "Audio Center Avanda 218 4Pcs", "Marani MIR 480I"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Parled 20x10watt 8Pcs",
        ["Parled 20x10watt 8Pcs", "Moving Beam 450 4Pcs", "Freshnell 300 4Pcs", "Smoke Machine / Hazzer 1pcs", "Mini GrandMa2"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0dm2gr3gfri8v6jt7bhm4pjp1t",
    monthKey: "2026-08",
    date: "2026-08-15",
    dateLabel: "15 Agu 2026",
    venue: "MEETING PS (https://share.google/tJbi4L19IhN6YS08s)",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: MEETING PS (https://share.google/tJbi4L19IhN6YS08s) (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cksjcchlccsjgb9i6dj38b9k6gq68b9o6sojgb9g70r6ccr36gpm8dr370",
    monthKey: "2026-08",
    date: "2026-08-15",
    endDate: "2026-08-16",
    dateLabel: "15-16 Agu 2026",
    venue: "Nengah dewata PURA PARAHYANGAN AGUNG JAGAT KARTA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Invoce atas nama Ibu Murwanti\n- Acara : Hindu Youth Leadership Camp 2026\nLED 4x6\nLevel 1,2m\nGenzet \nUntuk tgl 15 dan 16 agustus\nBudget 22Jt",
    sections: [
      createSection(
        "Videotron",
        "LED 4x6",
        ["LED 4x6", "Level 1,2m", "Genzet"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-65gjidpo6lj3cbb6cgq34b9k70sj6b9pcgrj8bb670sjidb46hh34cpk6c",
    monthKey: "2026-08",
    date: "2026-08-16",
    dateLabel: "16 Agu 2026",
    venue: "Didi softunes sound 10rb",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Didi softunes sound 10rb",
        ["Didi softunes sound 10rb"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-47a7tl85q1motdsep9avrobusp",
    monthKey: "2026-08",
    date: "2026-08-16",
    dateLabel: "16 Agu 2026",
    venue: "YOYO NAWASENA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- SOUND 20RB\n- BACKLINE DRUM + RD\n- CODENSOR 8",
    sections: [
      createSection(
        "Audio",
        "SOUND 20RB",
        ["SOUND 20RB", "BACKLINE DRUM + RD", "CODENSOR 8"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c8s30e3665im6b9mc5j36b9kc4sjgb9p6th6cbb6cgsj2oho75ijceb26k",
    monthKey: "2026-08",
    date: "2026-08-17",
    endDate: "2026-08-18",
    dateLabel: "17-18 Agu 2026",
    venue: "Denny Bayer",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "12x2m P2.6 level 50cm\nsound 3000-5000watt (prepare mixer midas yg kecil) fohna heurin\nlighting flesnel 4 biji stand kecil kalo ada mah\nKabel protector 16 Meter",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["sound 3000-5000watt (prepare mixer midas yg kecil) fohna heurin"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["lighting flesnel 4 biji stand kecil kalo ada mah"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Kabel protector 16 Meter",
        ["Kabel protector 16 Meter"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-52cmuno6b0vo2ujr3mqtnsg8s1",
    monthKey: "2026-08",
    date: "2026-08-17",
    dateLabel: "17 Agu 2026",
    venue: "RIVO LAP.BANTENG",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound 15rb",
    sections: [
      createSection(
        "Audio",
        "Sound 15rb",
        ["Sound 15rb"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6sq3ae33c9i62b9j70qm8b9kclgjgbb26oojib9i64pm8p9m6hijec9pc4",
    monthKey: "2026-08",
    date: "2026-08-18",
    dateLabel: "18 Agu 2026",
    venue: "Meeting RI sekretariat",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Assalamu’alaikum Warahmatullahi Wabarakatuh.\n\nYth. Bapak/Ibu Pengurus DPP Rental Indonesia,\n\nKami sampaikan undangan Rapat Pengurus DPP Rental Indonesia yang akan dilaksanakan:\n\n📅 Selasa, 18 Agustus 2026\n⏰ Pukul 13.00 WIB s.d. selesai\n📍 Kantor Sekretariat Rental Indonesia\nKas Production, Komplek Pajak\nJl. Nuri No. 09, RT.004/RW.003\nCipadu Jaya, Larangan\nKota Tangerang, Banten 15155\n\n📍 Google Maps:\nhttps://maps.app.goo.gl/ZAqMr6Kuh17LcFYW7\n\nAgenda Rapat:\n\nRapat Badan Pengurus Pusat (DPP) Rental Indonesia\nUpdate keanggotaan member Rental Indonesia\nKelanjutan pembentukan dan pengangkatan DPC\n\nMengingat pentingnya agenda tersebut bagi kesinambungan organisasi, kami sangat mengharapkan kehadiran dan partisipasi Bapak/Ibu Pengurus.\n\nBagi yang berhalangan hadir, mohon dapat menginformasikan kepada Sekretariat.\n\nTerima kasih atas perhatian dan kerja samanya.\n\nWassalamu’alaikum Warahmatullahi Wabarakatuh.",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Meeting RI sekretariat (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-chgj6d9p71j3ab9jc4pjcb9k6op34b9p6crm6b9mcoq66cpk6hi34pj36c",
    monthKey: "2026-08",
    date: "2026-08-19",
    dateLabel: "19 Agu 2026",
    venue: "Adin",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Adin",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Adin (Menunggu Detail / Assessment Spek Admin)"],
        ["Adin"],
        []
      ),
    ],
  },
  {
    id: "gcal-6q0eg6774gpu5r6pb5ehubmivg",
    monthKey: "2026-08",
    date: "2026-08-19",
    dateLabel: "19 Agu 2026",
    venue: "BAGAS",
    loadingSchedule: "tgl 19 loading 18 sound 5rb watt",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "pabrik\ntgl 19 loading 18 sound 5rb watt\ntgl 20,21 agustus sound monitor 4pcs",
    sections: [
      createSection(
        "Audio",
        "tgl 19 loading 18 sound 5rb watt",
        ["tgl 19 loading 18 sound 5rb watt", "tgl 20,21 agustus sound monitor 4pcs"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7p92o89g5afulq5v251cqpmgqd",
    monthKey: "2026-08",
    date: "2026-08-19",
    dateLabel: "19 Agu 2026",
    venue: "BAGAS HOLLIDAY INN",
    loadingSchedule: "tgl 19 loading 18 sound 5rb watt",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "holiday inn cikarang\ntgl 19 loading 18 sound 5rb watt",
    sections: [
      createSection(
        "Audio",
        "tgl 19 loading 18 sound 5rb watt",
        ["tgl 19 loading 18 sound 5rb watt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-22s3df0sc6bmo2l0ok96rj93st",
    monthKey: "2026-08",
    date: "2026-08-20",
    dateLabel: "20 Agu 2026",
    venue: "SYAMSUL RAJAWALI OPENING",
    loadingSchedule: "LED 8x4 (Center) Lokasi GOR UNJ Loading 28 Agustus (Jam 05.00 Pagi Dilokasi) WIGI",
    pic: "Wigi (Dedi Agus Wigiantoro)",
    status: "Selesai",
    gcalSynced: true,
    notes: "Event: Opening PKKMB UNJ 2026 (20 Agustus)\nLED 9x4 (Center) & 2x4 (2) Lokasi Jakarta Internasional veledrome Loading 19 Agustus (Jam 05.00 Pagi Dilokasi) WIGI\n\nEvent: Closing PKKMB UNJ 2026 (29 Agustus)\nLED 8x4 (Center) Lokasi GOR UNJ Loading 28 Agustus (Jam 05.00 Pagi Dilokasi) WIGI\nLampiran Google Calendar: Gaker Velodrom Rajawali",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["LED 9x4 (Center) & 2x4 (2) Lokasi Jakarta Internasional veledrome Loading 19 Agustus (Jam 05.00 Pagi Dilokasi) WIGI", "LED 8x4 (Center) Lokasi GOR UNJ Loading 28 Agustus (Jam 05.00 Pagi Dilokasi) WIGI"],
        ["Wigi"],
        []
      ),
    ],
  },
  {
    id: "gcal-75i3edb364s38bb368s30b9k61gjgbb2ckqj4bb36ti3apb464r36o9n6k",
    monthKey: "2026-08",
    date: "2026-08-21",
    dateLabel: "21 Agu 2026",
    venue: "Ayong TMII",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Ayong Sumarsih",
    status: "Selesai",
    gcalSynced: true,
    notes: "21 ada event lagi di TMII bos Sound lighting",
    sections: [
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["21 ada event lagi di TMII bos Sound lighting"],
        ["Ayong"],
        []
      ),
    ],
  },
  {
    id: "gcal-71i34cpo6hh6cb9hc8pjeb9k70pmcbb264o3ab9l74r62p9pcgo30e1m6k",
    monthKey: "2026-08",
    date: "2026-08-21",
    dateLabel: "21 Agu 2026",
    venue: "Nako Citra",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "21 Agustus nako BSD (sound aja 3rb Dj)\nLampiran Google Calendar: INV_PT JENDELA CITRA DELAPAN_KOPI NAKO CITRA_21 AGUSTUS 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["21 Agustus nako BSD (sound aja 3rb Dj)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2t0nmcavfdjk8ovr5ovt93etc6",
    monthKey: "2026-08",
    date: "2026-08-22",
    dateLabel: "22 Agu 2026",
    venue: "AIR EO Jungle Loading tgl 21 sore",
    loadingSchedule: "Loading tgl 21 sore",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_AIR EO_22 AGUSTUS 2026 (1).pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_AIR EO_22 AGUSTUS 2026 (1).pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0ihurde6rlpilltph2m2ud6k0l",
    monthKey: "2026-08",
    date: "2026-08-22",
    dateLabel: "22 Agu 2026",
    venue: "DUMECA MELAWAI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_PAK DEDI DUMECA_MELAWAI_22 AGUSTUS 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_PAK DEDI DUMECA_MELAWAI_22 AGUSTUS 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-clj64cr2c9gj6b9ncop6cb9kchimcbb2cgs3eb9k6dim6d1l6gpm2e1n6s",
    monthKey: "2026-08",
    date: "2026-08-22",
    dateLabel: "22 Agu 2026",
    venue: "Denny wk",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Denny wk (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-65gjee9p61h3gb9h6sqm4b9k70s34b9ochj3ebb5ccpj8oho75h64d1jc4",
    monthKey: "2026-08",
    date: "2026-08-22",
    dateLabel: "22 Agu 2026",
    venue: "Indra Indka Fortune Star Request Adin",
    loadingSchedule: "Loading :* tgl 22 agt jam 01.00 dini hari",
    pic: "Adin",
    status: "Selesai",
    gcalSynced: true,
    notes: "*Tgl :* 22 agustus 2026\n*Lokasi :* Fortune star function hall\n*Loading :* tgl 22 agt jam 01.00 dini hari\n\n*Videotron :*\n- 3x6\n- level 40cm\n\n*BACKLINE*\n- Drum Yamaha Tour Custom *750*\n- Mic Drum Set *750*\n- Keybord RD700NX + Stand *750*\n- IEM Sennheiser G4 6Pcs x 500rb *3Jt*\n- DIBox 6x100rb *600rb*\n- Total *5.850*\n- Disc *850*\n- Grand Total *5Jt*\n\n*Lighting :*\n- 8 beam\n- 4 fresnell\n- 8 parled\n- 4 tripot",
    sections: [
      createSection(
        "Audio",
        "Drum Yamaha Tour Custom *750",
        ["Drum Yamaha Tour Custom *750", "Mic Drum Set *750", "Keybord RD700NX + Stand *750", "IEM Sennheiser G4 6Pcs x 500rb *3Jt", "DIBox 6x100rb *600rb", "Disc *850", "Grand Total *5Jt"],
        ["Adin"],
        []
      ),
      createSection(
        "Videotron",
        "Videotron :",
        ["Videotron :", "3x6", "level 40cm"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "8 beam",
        ["8 beam", "4 fresnell", "8 parled", "4 tripot"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2gsupl6un2krrieksorrh6kv8g",
    monthKey: "2026-08",
    date: "2026-08-22",
    dateLabel: "22 Agu 2026",
    venue: "PS TM CLUB IMPERIAL GOLF",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: PS TM CLUB IMPERIAL GOLF (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1e4mfc8o7e2mpp9i3b7j631jr5",
    monthKey: "2026-08",
    date: "2026-08-22",
    dateLabel: "22 Agu 2026",
    venue: "RAKA EO SEWA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Assalamualaikum\n\nSiang mas..\nMau pesen \n\nM32 1 Pcs 2 Hari \nG4 4 Pcs 1 Hari\nSirip Combiner G4 1 Hari\n\nTanggal 21 Sore Ceksound\nTanggal 22-23 Agustus Acara\nBogor\n\nIya mas\n\nMixer\n21 ceksound\n22 acara\n23 acara \n\nIEM\n22 Malam Ceksound (Sepertinya)\n23 Acara",
    sections: [
      createSection(
        "Audio",
        "M32 1 Pcs 2 Hari",
        ["M32 1 Pcs 2 Hari", "G4 4 Pcs 1 Hari", "Sirip Combiner G4 1 Hari", "Tanggal 21 Sore Ceksound", "Bogor", "Iya mas", "Mixer", "21 ceksound", "22 acara", "23 acara", "IEM", "22 Malam Ceksound (Sepertinya)", "23 Acara"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-76jrhq9putdmulncj0d519redr",
    monthKey: "2026-08",
    date: "2026-08-22",
    dateLabel: "22 Agu 2026",
    venue: "VACENK",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "PADI RESORT PANCAWATI \nWING 2.5 X 1.5 2 SET\nMAIN 2X3 METER",
    sections: [
      createSection(
        "Videotron",
        "WING 2.5 X 1.5 2 SET",
        ["WING 2.5 X 1.5 2 SET", "MAIN 2X3 METER"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6dh3gc1mc8sjib9j74qm6b9kckq3cb9oc8ojibb665im6cpj74q6ce1k64",
    monthKey: "2026-08",
    date: "2026-08-22",
    dateLabel: "22 Agu 2026",
    venue: "nako Citra 8",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Spek Nako SMB",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: nako Citra 8 (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-11edglsihac166embmvb5c16j9",
    monthKey: "2026-08",
    date: "2026-08-24",
    endDate: "2026-08-29",
    dateLabel: "24-29 Agu 2026",
    venue: "HUT Botani Square",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_PT BOGOR ANGGANA CENDEKIA_HUT BOTANI SQUARE_24-30 AGUSTUS 2026 (OPSI 2 DENGAN LED)_REV2.xlsx",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_PT BOGOR ANGGANA CENDEKIA_HUT BOTANI SQUARE_24-30 AGUSTUS 2026 (OPSI 2 DENGAN LED)_REV2.xlsx"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7p4ld01lkld57543q4pa7utk92",
    monthKey: "2026-08",
    date: "2026-08-25",
    dateLabel: "25 Agu 2026",
    venue: "ARIQ EMPANG",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: ARIQ EMPANG (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c8q64c1lc4rj2bb5c4om4b9kc4q3eb9o6gom6bb66spjgc1lcpi30cpkck",
    monthKey: "2026-08",
    date: "2026-08-25",
    dateLabel: "25 Agu 2026",
    venue: "Respati TSI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Respati TSI (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6th38ob66gsjab9m68pjeb9k70pjgb9p70s6abb6ccpm4ophc5gjgdpl6o",
    monthKey: "2026-08",
    date: "2026-08-26",
    endDate: "2026-08-28",
    dateLabel: "26-28 Agu 2026",
    venue: "Ahmad Grenada",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- LED 2x4\n- Level T. 1Meter\nDP 4JT\nLampiran Google Calendar: INV_GRENADA_DARMAWAN PARK_26-28 AGUSTUS 2026.pdf",
    sections: [
      createSection(
        "Videotron",
        "LED 2x4",
        ["LED 2x4", "Level T. 1Meter"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7vlkmeb51iseei479de714kt7h",
    monthKey: "2026-08",
    date: "2026-08-27",
    dateLabel: "27 Agu 2026",
    venue: "K AUDIO RAFLESS",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_K AUDIO_RAFLLES JAKARTA_27 AGUSTUS 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_K AUDIO_RAFLLES JAKARTA_27 AGUSTUS 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-27l9bdo4tpa374rahjlpvooboj",
    monthKey: "2026-08",
    date: "2026-08-27",
    dateLabel: "27 Agu 2026",
    venue: "Om Nengah Order Lighting",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- parled 2 bar\n- beam 4 \n- Freshnell 2",
    sections: [
      createSection(
        "Lighting",
        "parled 2 bar",
        ["parled 2 bar", "beam 4", "Freshnell 2"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6cr32dpncoq6ab9gckrm4b9kc4omcbb261hjebb46cp6ap1lcoo34p316g",
    monthKey: "2026-08",
    date: "2026-08-27",
    dateLabel: "27 Agu 2026",
    venue: "Om erie",
    loadingSchedule: "Loading 26 Agustus Sore",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*27 Agustus Oakwood Kuningan*\nLoading 26 Agustus Sore\n4 kamera \n4 godox + softbox\n1 laptop streaming ke instagram\n1 laptop vj \nmodem \ncrew 3\n1 operator",
    sections: [
      createSection(
        "Multimedia",
        "1 laptop streaming ke instagram",
        ["1 laptop streaming ke instagram", "1 laptop vj", "modem", "crew 3", "1 operator"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-23b3l4pea7et96vsk6inplp9ot",
    monthKey: "2026-08",
    date: "2026-08-28",
    endDate: "2026-08-30",
    dateLabel: "28-30 Agu 2026",
    venue: "ANDARA PVJ",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Multimedia",
        "ANDARA PVJ",
        ["ANDARA PVJ"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0cnhgl3aviltvl2qc97kqvqh6m",
    monthKey: "2026-08",
    date: "2026-08-28",
    dateLabel: "28 Agu 2026",
    venue: "SHUTTSHOOT BANDUNG 15RB",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: SHUTTSHOOT BANDUNG 15RB (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-ckqm4chj65j64b9lc4pj4b9k64p36b9ocli3cb9lccsj8p9h6hh64c9gcc",
    monthKey: "2026-08",
    date: "2026-08-28",
    endDate: "2026-08-30",
    dateLabel: "28-30 Agu 2026",
    venue: "Shuttshoot GATF JICC",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Shuttshoot GATF JICC (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c8pj2e1h6hhm6bb675j66b9kckp3ibb26gqmcb9icgr34chg74o3aohm70",
    monthKey: "2026-08",
    date: "2026-08-29",
    dateLabel: "29 Agu 2026",
    venue: "Ecopark PS",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Mom survei ecopark\nTgl 29 Agustus \n- Stage 8 x 6 tinggi 80cm\n- Sound 10rb\n- AC 3 unit \n- Genset 40kva 2 unit",
    sections: [
      createSection(
        "Audio",
        "Sound 10rb",
        ["Sound 10rb", "AC 3 unit"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Stage 8 x 6 tinggi 80cm",
        ["Stage 8 x 6 tinggi 80cm", "Genset 40kva 2 unit"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2s0gv5a6m1voq9mf4h8482s3c2",
    monthKey: "2026-08",
    date: "2026-08-29",
    dateLabel: "29 Agu 2026",
    venue: "SYAMSUL RAJAWALI CLOSING",
    loadingSchedule: "LED 8x4 (Center) Lokasi GOR UNJ Loading 28 Agustus (Jam 05.00 Pagi Dilokasi) WIGI",
    pic: "Wigi (Dedi Agus Wigiantoro)",
    status: "Selesai",
    gcalSynced: true,
    notes: "Event: Opening PKKMB UNJ 2026 (20 Agustus)\nLED 9x4 (Center) &amp; 2x4 (2) Lokasi Jakarta Internasional veledrome Loading 19 Agustus (Jam 05.00 Pagi Dilokasi) WIGI\n\nEvent: Closing PKKMB UNJ 2026 (29 Agustus)\nLED 8x4 (Center) Lokasi GOR UNJ Loading 28 Agustus (Jam 05.00 Pagi Dilokasi) WIGI",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["LED 9x4 (Center) &amp; 2x4 (2) Lokasi Jakarta Internasional veledrome Loading 19 Agustus (Jam 05.00 Pagi Dilokasi) WIGI", "LED 8x4 (Center) Lokasi GOR UNJ Loading 28 Agustus (Jam 05.00 Pagi Dilokasi) WIGI"],
        ["Wigi"],
        []
      ),
    ],
  },
  {
    id: "gcal-c5ij0p3165hj6bb268s3eb9k6grj8bb26ti36bb16op6cdb160r38o9i74",
    monthKey: "2026-08",
    date: "2026-08-30",
    dateLabel: "30 Agu 2026",
    venue: "Blok R Acara Pagi",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Blok R Acara Pagi (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3e4qepve8i2uc4fcvmpu0gobct",
    monthKey: "2026-08",
    date: "2026-08-30",
    dateLabel: "30 Agu 2026",
    venue: "Evan Aloft",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Evan Aloft (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1gk75gmjmsofjehr6njm5ihvri",
    monthKey: "2026-08",
    date: "2026-08-30",
    dateLabel: "30 Agu 2026",
    venue: "GRENADA DUFAN",
    loadingSchedule: "Loading 29 Malam",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*30 Agustus Dufan Hysteria (Grenada)*\nLoading 29 Malam\n- LED P3.9 Indoor 4x7 (28Sqm)  x 400rb \n- Total 11,2Jt",
    sections: [
      createSection(
        "Videotron",
        "LED P3.9 Indoor 4x7 (28Sqm)  x 400rb",
        ["LED P3.9 Indoor 4x7 (28Sqm)  x 400rb", "Total 11,2Jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0n22juattvmvhp3bcjjiktisc1",
    monthKey: "2026-08",
    date: "2026-08-30",
    dateLabel: "30 Agu 2026",
    venue: "Prasasti NTC Dufan Loading jam 29 Siang",
    loadingSchedule: "Loading jam 29 Siang",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Mom survei dufan\nNTC tgl 30 Agustus \n- Stage 10 x 8 tinggi 80cm (Full Paranet) a\n- Rigging cover sound \n- sound 20rb (Gantung) \n- led 6 x 3 Ground stack \n- Level tinggi 2 meter + Gawangan\n- Genset 60kva 3 unit",
    sections: [
      createSection(
        "Audio",
        "Rigging cover sound",
        ["Rigging cover sound", "sound 20rb (Gantung)"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "led 6 x 3 Ground stack",
        ["led 6 x 3 Ground stack", "Level tinggi 2 meter + Gawangan"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Produksi, Rigging & Genset",
        ["Stage 10 x 8 tinggi 80cm (Full Paranet) a", "Genset 60kva 3 unit"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-69im6p1g74om8b9k6cpm4b9kcpj6ab9p68qm8bb66di6aor6c9h36p36co",
    monthKey: "2026-08",
    date: "2026-08-30",
    dateLabel: "30 Agu 2026",
    venue: "Yudis",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Yudis (Yudishtira)",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Yudis (Menunggu Detail / Assessment Spek Admin)"],
        ["Yudis"],
        []
      ),
    ],
  },
  // ============================================================================
  // BULAN SEPTEMBER 2026 (GOOGLE CALENDAR SYNC)
  // ============================================================================
  {
    id: "gcal-70p32dj5cos66bb66so3ib9k6cqm4b9ocgpj8b9nchhj8dj36thj2db66o",
    monthKey: "2026-09",
    date: "2026-09-01",
    endDate: "2026-09-05",
    dateLabel: "1-5 Sep 2026",
    venue: "Richad sewa PC",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Richad sewa PC (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3ani1sici4uim2gi93pvhqoic3",
    monthKey: "2026-09",
    date: "2026-09-01",
    dateLabel: "1 Sep 2026",
    venue: "TURANGGA ANDARA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: TURANGGA ANDARA (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6or32c1k6lgmcbb36dj68b9k74rjcbb1c4qj2bb36tgj2cj16sqj6phj68",
    monthKey: "2026-09",
    date: "2026-09-01",
    dateLabel: "1 Sep 2026",
    venue: "Ugan Sewa barang aja",
    loadingSchedule: "Loading tgl 1 September",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Assalamu'alaikum bos\nB eye 10\nWalwaasr 12\nHazer 1\nMixer tiger \nLoading tgl 1 September\nAcr tgl 3 ama 4\n11,5 masuk kg bos\nSI UGAN AJA SAMA CEPER YG JALAN",
    sections: [
      createSection(
        "Audio",
        "Mixer tiger",
        ["Mixer tiger", "Loading tgl 1 September", "Acr tgl 3 ama 4", "11,5 masuk kg bos", "SI UGAN AJA SAMA CEPER YG JALAN"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Hazer 1",
        ["Hazer 1"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4vevagmvhftl5csppqfqsatvri",
    monthKey: "2026-09",
    date: "2026-09-03",
    dateLabel: "3 Sep 2026",
    venue: "KRISNA K AUDIO LPDB",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "<p dir=\"ltr\">*4 Sep LPDB Pancoran (K-Audio)*</p><p dir=\"ltr\">- Loading 3 Malam jam 22.00</p><p dir=\"ltr\">- *Led*</p><p dir=\"ltr\">- Led 3x9 Meter</p>",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["<p dir=\"ltr\">*4 Sep LPDB Pancoran (K-Audio)*</p><p dir=\"ltr\">- Loading 3 Malam jam 22.00</p><p dir=\"ltr\">- *Led*</p><p dir=\"ltr\">- Led 3x9 Meter</p>"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-ccr68o9occs30b9icgsjab9kcks38bb161hjab9jc9hm8p9icdijacpj6k",
    monthKey: "2026-09",
    date: "2026-09-03",
    dateLabel: "3 Sep 2026",
    venue: "M Block",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Cie imam minta \n1.beam 4\n2.stromy 6\n3.bruut 2\n4.presnel 2\n5.hezer",
    sections: [
      createSection(
        "Lighting",
        "1.beam 4",
        ["1.beam 4", "2.stromy 6", "3.bruut 2", "4.presnel 2", "5.hezer"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0g8343hbbanhkp05cadupi4msp",
    monthKey: "2026-09",
    date: "2026-09-04",
    dateLabel: "4 Sep 2026",
    venue: "FAHRI MEDINA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: FAHRI MEDINA (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5bd794e6bbgv0iklcunniru1gm",
    monthKey: "2026-09",
    date: "2026-09-04",
    endDate: "2026-09-05",
    dateLabel: "4-5 Sep 2026",
    venue: "Indra Indka SHANGRILA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tgl 4-5 sept juga rul PA 10rb wabtt + system",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Tgl 4-5 sept juga rul PA 10rb wabtt + system"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1dgesdcpqg054qlqh8gj98q0j7",
    monthKey: "2026-09",
    date: "2026-09-04",
    dateLabel: "4 Sep 2026",
    venue: "K AUDIO PANCORAN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: K AUDIO PANCORAN (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-71j34d3274qj8bb26dijgb9k6grm8bb16pi66b9p6di6aeb169gm8d1gcc",
    monthKey: "2026-09",
    date: "2026-09-05",
    dateLabel: "5 Sep 2026",
    venue: "Aduh GYMNASIUM",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "5 September 2026 Lokasi Gymnasium IPB Dramaga:\n\n1. Gitar 2 unit\n2. Bass 1 Unit\n3. RD 700 + Stand\n4. Drum Yamaha Stage Costum + Kursi + Stik\n5. Mic Drum",
    sections: [
      createSection(
        "Audio",
        "3. ⁠RD 700 + Stand",
        ["3. ⁠RD 700 + Stand", "4. ⁠Drum Yamaha Stage Costum + Kursi + Stik", "5. ⁠Mic Drum"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3dp8r459mstrsdqej73cce25jb",
    monthKey: "2026-09",
    date: "2026-09-05",
    dateLabel: "5 Sep 2026",
    venue: "PAK INDRA RPN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_RPN_KANTOR RPN_5 SEPTEMBER 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_RPN_KANTOR RPN_5 SEPTEMBER 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4djfdppurmqs21f45gb40d7eem",
    monthKey: "2026-09",
    date: "2026-09-06",
    dateLabel: "6 Sep 2026",
    venue: "SASTA MILOS PADEL",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: SASTA MILOS PADEL (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7scuvu07ss056r0iechs4p0dg2",
    monthKey: "2026-09",
    date: "2026-09-07",
    dateLabel: "7 Sep 2026",
    venue: "RIO SERUNI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Masuk DP Tgl 4 September 55.696.000\nSisa 40jt\nLampiran Google Calendar: INV_PAK RIO VERTEX_SERUNI HOTEL_7 September 2026.pdf, QUO_PAK RIO VERTEX_7 SEPTEMBER 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_PAK RIO VERTEX_SERUNI HOTEL_7 September 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-68b5c3sf8k8p5t0gjn0igccvd4",
    monthKey: "2026-09",
    date: "2026-09-07",
    dateLabel: "7 Sep 2026",
    venue: "RIVO SUMITRO",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "STREAMING GREENSCREEN + MULTICAM 2",
    sections: [
      createSection(
        "Multimedia",
        "STREAMING GREENSCREEN + MULTICAM 2",
        ["STREAMING GREENSCREEN + MULTICAM 2"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-58425n18q76fnuj9oc15b2vfe1",
    monthKey: "2026-09",
    date: "2026-09-08",
    dateLabel: "8 Sep 2026",
    venue: "Kalog Andara",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_ANDARA_KALOG_8 September 2026.xlsx",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_ANDARA_KALOG_8 September 2026.xlsx"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-42pdqs06g41a4v55e42c0uncbm",
    monthKey: "2026-09",
    date: "2026-09-08",
    dateLabel: "8 Sep 2026",
    venue: "RIVO WISMUL",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "SOUND 1RB \nSTREAMING \nPTZ 1, CAM 1",
    sections: [
      createSection(
        "Audio",
        "SOUND 1RB",
        ["SOUND 1RB"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "PTZ 1, CAM 1",
        ["PTZ 1, CAM 1"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7t0qesri49vgbftnl7h8bv2fvf",
    monthKey: "2026-09",
    date: "2026-09-08",
    dateLabel: "8 Sep 2026",
    venue: "SASTA BANTEN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: SASTA BANTEN (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-74q62d36c8p36bb1ccp3ab9k61ijcbb16gsjgb9k6gpjaopn6gojgphj70",
    monthKey: "2026-09",
    date: "2026-09-09",
    dateLabel: "9 Sep 2026",
    venue: "Rivo wismul",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Rivo wismul (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-61i3mpfl17oaev49ev90j5acdj",
    monthKey: "2026-09",
    date: "2026-09-10",
    dateLabel: "10 Sep 2026",
    venue: "Ghele fatmawati",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Ghele fatmawati (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0hq7lc2bqlh15jp8enropru4hf",
    monthKey: "2026-09",
    date: "2026-09-10",
    dateLabel: "10 Sep 2026",
    venue: "PAK DEDI HOTEL MULIA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Standbook 6, MIc Saxo\nLampiran Google Calendar: QUO_PAK DEDI DUMECA_HOTEL MULIA_10 SEPTEMBER 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Standbook 6, MIc Saxo",
        ["Standbook 6, MIc Saxo"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-60r3ep9k70o3eb9j6lijcb9kcph6cb9ocdgm2b9n75i3ichn6ko32e33c4",
    monthKey: "2026-09",
    date: "2026-09-10",
    dateLabel: "10 Sep 2026",
    venue: "Simple mice Jsi resort",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Jsi resort 10 september 2026 :\n- sound 3rb watt\n- Parled 2, moving beam 4, freshnel 4\n- sma genset.",
    sections: [
      createSection(
        "Audio",
        "sound 3rb watt",
        ["sound 3rb watt"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Parled 2, moving beam 4, freshnel 4",
        ["Parled 2, moving beam 4, freshnel 4"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "sma genset.",
        ["sma genset."],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-440sut5rqihlt5efil3opar5oj",
    monthKey: "2026-09",
    date: "2026-09-11",
    dateLabel: "11 Sep 2026",
    venue: "ADIN JW MARRIOT",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Adin",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound  10 rb, \nDrum+rd \nTambhan 4 speaker monitor buat delay\n4 beam ,2 bar 4 fresnel 3 jt kan nya",
    sections: [
      createSection(
        "Audio",
        "Sound  10 rb,",
        ["Sound  10 rb,", "Drum+rd", "Tambhan 4 speaker monitor buat delay"],
        ["Adin"],
        []
      ),
      createSection(
        "Lighting",
        "4 beam ,2 bar 4 fresnel 3 jt kan nya",
        ["4 beam ,2 bar 4 fresnel 3 jt kan nya"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4s5jkco54i818iss39ib98ledl",
    monthKey: "2026-09",
    date: "2026-09-11",
    endDate: "2026-09-13",
    dateLabel: "11-13 Sep 2026",
    venue: "ONE HUNDRED PERCENT",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_PT. ONE HUNDRED PERCENT PRODUCTION_PAK YOGA_ICE BSD_11-13 September 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_PT. ONE HUNDRED PERCENT PRODUCTION_PAK YOGA_ICE BSD_11-13 September 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-693hiphko2jg11gnd7fm8un0a6",
    monthKey: "2026-09",
    date: "2026-09-12",
    dateLabel: "12 Sep 2026",
    venue: "RD PIETER SENTUL",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "SEWA IEM 2 UNIT",
    sections: [
      createSection(
        "Audio",
        "SEWA IEM 2 UNIT",
        ["SEWA IEM 2 UNIT"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-60rm8dpi6go3gb9lcphjgb9kcpj6cb9ocoq32b9n6grj2ohkc8p66p9lck",
    monthKey: "2026-09",
    date: "2026-09-12",
    dateLabel: "12 Sep 2026",
    venue: "Respati 5000 watt Jungle Water park",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Respati 5000 watt Jungle Water park",
        ["Respati 5000 watt Jungle Water park"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cgsj2o9ic5h6cbb1c5h30b9k6co6cbb16pj3eb9p6lgm2p1kcpgj2phm70",
    monthKey: "2026-09",
    date: "2026-09-12",
    dateLabel: "12 Sep 2026",
    venue: "Wk denny",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "SOUND 10RB + DRUM",
    sections: [
      createSection(
        "Audio",
        "SOUND 10RB + DRUM",
        ["SOUND 10RB + DRUM"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3vg6efs15nnvu1c98ried5qfg2",
    monthKey: "2026-09",
    date: "2026-09-13",
    dateLabel: "13 Sep 2026",
    venue: "ADIN SENAYAN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Adin",
    status: "Selesai",
    gcalSynced: true,
    notes: "SOUND 10RB",
    sections: [
      createSection(
        "Audio",
        "SOUND 10RB",
        ["SOUND 10RB"],
        ["Adin"],
        []
      ),
    ],
  },
  {
    id: "gcal-3ol68cc55snfh7nsdk83gju7c3",
    monthKey: "2026-09",
    date: "2026-09-13",
    dateLabel: "13 Sep 2026",
    venue: "BACKLIGHT CIBUBUR",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_PAK FIRMAN BACKLIGHT_CIBUBUR_13 OKTOBER 2026_REV2.pdf",
    sections: [
      createSection(
        "Multimedia",
        "BACKLIGHT CIBUBUR",
        ["BACKLIGHT CIBUBUR"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-64pm2dr56hh6cb9mccojeb9kccojcbb1cgp30b9h60r30chi61im8cb16g",
    monthKey: "2026-09",
    date: "2026-09-14",
    endDate: "2026-09-16",
    dateLabel: "14-16 Sep 2026",
    venue: "Om ino Jambuluwuk",
    loadingSchedule: "Loading tgl 13 pagi jam 10:00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "siang om, jadi saya ordernya utk tgl 14-16 Sept 2026, ini aja ya jadinya :\nLoading tgl 13 pagi jam 10:00\n1. LED 4x2,5 m P 2.6\n2. Operator",
    sections: [
      createSection(
        "Videotron",
        "1. LED 4x2,5 m P 2.6",
        ["1. LED 4x2,5 m P 2.6", "2. Operator"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-68o3aphi60q3ib9gccsjib9k6cp3ebb2ccsm8b9m70sm8e9m6orjepb160",
    monthKey: "2026-09",
    date: "2026-09-14",
    dateLabel: "14 Sep 2026",
    venue: "Rio seruni",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Rio seruni (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1pfjno9sf71qfdgoorouf8blbv",
    monthKey: "2026-09",
    date: "2026-09-15",
    dateLabel: "15 Sep 2026",
    venue: "Firman Trisakti",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Firman Trisakti (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7m164rhniaih4rhqlt7q22ea48",
    monthKey: "2026-09",
    date: "2026-09-15",
    dateLabel: "15 Sep 2026",
    venue: "JOSE UI DEPOK",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*15 Sep Felfest UI Depok (Jose)*\n*Sound 8rb Sebaran* *6,5jt*\n- Db 6 + Stand\n- Sub Db 2\n- Db 8 (Melingkar Floor to Audience*\n- Db 4 (Floor Monitor)\n- M32 + Dl\n- WHM 8\n- Add Codensor C1000 4x150 *600*\n*Lighting* *3,6Jt*\n- Parled 8\n- Freshnell 6\n- Stromy 6 \n*TV 50\" 650rb*",
    sections: [
      createSection(
        "Audio",
        "Sound 8rb Sebaran* *6,5jt",
        ["Sound 8rb Sebaran* *6,5jt", "Db 6 + Stand", "Sub Db 2", "Db 8 (Melingkar Floor to Audience", "Db 4 (Floor Monitor)", "M32 + Dl", "WHM 8"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "Add Codensor C1000 4x150 *600",
        ["Add Codensor C1000 4x150 *600"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting* *3,6Jt",
        ["Lighting* *3,6Jt", "Parled 8", "Freshnell 6", "Stromy 6"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "TV 50\" 650rb",
        ["TV 50\" 650rb"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6qm0lo8hjg25s88jm8r7qh41hu",
    monthKey: "2026-09",
    date: "2026-09-17",
    dateLabel: "17 Sep 2026",
    venue: "SASTA WISMUL",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: SASTA WISMUL (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-60p62d3568omcbb2coo38b9k64r36bb26cr32bb474r6ce1o6oo6ac9o6g",
    monthKey: "2026-09",
    date: "2026-09-18",
    dateLabel: "18 Sep 2026",
    venue: "Isal sewa Iem 2",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Isal",
    status: "Selesai",
    gcalSynced: true,
    notes: "Iem G4 2 unit",
    sections: [
      createSection(
        "Audio",
        "Iem G4 2 unit",
        ["Iem G4 2 unit"],
        ["Isal"],
        []
      ),
    ],
  },
  {
    id: "gcal-4bt5n3bioe3j1i8hc571ul8361",
    monthKey: "2026-09",
    date: "2026-09-18",
    dateLabel: "18 Sep 2026",
    venue: "PS KPP",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: PS KPP (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-77fh3sd0ga51oag0u44loquqs2",
    monthKey: "2026-09",
    date: "2026-09-19",
    dateLabel: "19 Sep 2026",
    venue: "AYONG ORDER ATLANTIS ANCOL",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Ayong Sumarsih",
    status: "Selesai",
    gcalSynced: true,
    notes: "Bos\nTgl 19 ada event masuk\nStage utama\n*Sound 30rb + backline*\n*Led 3x6*\n*lighting nnti di update kbtuhannya*\n\nStage 2\n*sound 5rb*\n*led 3x4*",
    sections: [
      createSection(
        "Audio",
        "Sound 30rb + backline",
        ["Sound 30rb + backline", "sound 5rb"],
        ["Ayong"],
        []
      ),
      createSection(
        "Videotron",
        "Led 3x6",
        ["Led 3x6", "led 3x4"],
        ["Ayong"],
        []
      ),
      createSection(
        "Lighting",
        "lighting nnti di update kbtuhannya",
        ["lighting nnti di update kbtuhannya"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Stage utama",
        ["Stage utama", "Stage 2"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6hj62d1lc8rj2bb26oqm4b9kc4rj8b9o6grj2b9g6os6ccpkchj3adb3co",
    monthKey: "2026-09",
    date: "2026-09-19",
    endDate: "2026-09-20",
    dateLabel: "19-20 Sep 2026",
    venue: "DIDI MONAS",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Sound 30rb\n- Lighting \n- Backdrop\nLampiran Google Calendar: QUO_ TNI AU FAIR_MONAS_19-20 Sep 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound 30rb",
        ["Sound 30rb"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Backdrop",
        ["Backdrop"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6orm4e9jccq36bb1c8s6cb9k60r66bb26oo32b9g6gs6acpicli64cr460",
    monthKey: "2026-09",
    date: "2026-09-20",
    dateLabel: "20 Sep 2026",
    venue: "Adun ipb",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sewa RD700 \nStand double\nShure sm91a",
    sections: [
      createSection(
        "Audio",
        "Sewa RD700",
        ["Sewa RD700", "Stand double", "Shure sm91a"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-68sjipj66hh66b9kcksjgb9kcosmcbb16gsmab9nc9h3gd1l60r34c34c8",
    monthKey: "2026-09",
    date: "2026-09-20",
    dateLabel: "20 Sep 2026",
    venue: "Boy line dance Orchad",
    loadingSchedule: "Loading 19 Malam jam 22.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "*20 Sep Hotel Orchad*\n- Loading 19 Malam jam 22.00\n- Lighting : Parled 8Pcs, Beam 4Pcs, Freshnell 4, Hazzer 1, Mixer Avolites Quartz , mirror ball *3,5Jt*\n- genset 40/kva *2,5Jt*\n- 3x8 total 24Sqm x 450rb *10.8Jt*\n- Grand Total *16,8Jt*\n- Disc 800\n- Total *16Jt*\n\n\nDP 8JT\nLampiran Google Calendar: INV_PAK BOY_HOTEL ORCHAD_20 SEPTEMBER 2026.pdf",
    sections: [
      createSection(
        "Videotron",
        "3x8 total 24Sqm x 450rb *10.8Jt",
        ["3x8 total 24Sqm x 450rb *10.8Jt", "Grand Total *16,8Jt", "Disc 800"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["Lighting : Parled 8Pcs, Beam 4Pcs, Freshnell 4, Hazzer 1, Mixer Avolites Quartz , mirror ball *3,5Jt"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "genset 40/kva *2,5Jt",
        ["genset 40/kva *2,5Jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2niv5akgmminj67jiu1h34td3f",
    monthKey: "2026-09",
    date: "2026-09-20",
    dateLabel: "20 Sep 2026",
    venue: "IVAN DIVAGA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "SEWA IEM G4  6 UNIT",
    sections: [
      createSection(
        "Audio",
        "SEWA IEM G4  6 UNIT",
        ["SEWA IEM G4  6 UNIT"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0cd27kj9qsvbsfu15enmmmd6hp",
    monthKey: "2026-09",
    date: "2026-09-21",
    dateLabel: "21 Sep 2026",
    venue: "KOPI THE DAUN (SEKAL)",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "SOUND 5RB + DRUM ELECTRIC \n5.750.000\nDP 2.875.000\nPelunasan Tanggal 17 Sept'2026\nRp. 2.875.000\nLampiran Google Calendar: QUO_PAK SANDY_DEDAUN COFFEE_21 September 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "SOUND 5RB + DRUM ELECTRIC",
        ["SOUND 5RB + DRUM ELECTRIC", "5.750.000", "Pelunasan Tanggal 17 Sept'2026", "Rp. 2.875.000"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c8rjac3270qm6b9kchhjcb9k64pj4b9ocph36b9o60s62p1icdi3adhn64",
    monthKey: "2026-09",
    date: "2026-09-22",
    dateLabel: "22 Sep 2026",
    venue: "Backlight Lotte Avenue",
    loadingSchedule: "Tgl 22 sept, loading tgl 21 sept",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Next event\nTgl 22 sept, loading tgl 21 sept \nVenue lotte shopping avenue\n- LED p3.9\n- sound system\n- lighting",
    sections: [
      createSection(
        "Videotron",
        "LED p3.9",
        ["LED p3.9"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2uggj61cm072ukg0utk1osld9h",
    monthKey: "2026-09",
    date: "2026-09-23",
    endDate: "2026-09-24",
    dateLabel: "23-24 Sep 2026",
    venue: "ANDARA PLN ICE BSD",
    loadingSchedule: "Loading tgl 21",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Loading tgl 21",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: ANDARA PLN ICE BSD (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-71hj4dpg64r32bb5coqjib9k64p6ab9ocph38b9o64pm8cpg6krm6e1oco",
    monthKey: "2026-09",
    date: "2026-09-23",
    endDate: "2026-09-24",
    dateLabel: "23-24 Sep 2026",
    venue: "Backlight OJK Loading 22",
    loadingSchedule: "Loading 22 | Tgl 24 sept, loading tgl 22 sept, GR tgl 23 sept dari pagi",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tgl 24 sept, loading tgl 22 sept, GR tgl 23 sept dari pagi\nVenue kemendikdasmen\n•  sound system\nballroom utama : sound 10rb watt + mic delegate 9pcs\ndoorstop : sound 2 speaker + 4 mic standing\n*Lighting*\n- Parled 4 Bar\n- Beam 6\n- Freshell 300 4\n- Stromy 4\n- Follow Spot \n- Wing MA",
    sections: [
      createSection(
        "Audio",
        " ⁠sound system",
        [" ⁠sound system", "ballroom utama : sound 10rb watt + mic delegate 9pcs", "doorstop : sound 2 speaker + 4 mic standing"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "Wing MA",
        ["Wing MA"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Parled 4 Bar",
        ["Parled 4 Bar", "Beam 6", "Freshell 300 4", "Stromy 4", "Follow Spot"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-51io7s6bcnah1qhfnhi9gmtepn",
    monthKey: "2026-09",
    date: "2026-09-24",
    dateLabel: "24 Sep 2026",
    venue: "RAE SHERATON",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: RAE SHERATON (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1cree2g7o4aib1pnkta7odil7q",
    monthKey: "2026-09",
    date: "2026-09-25",
    dateLabel: "25 Sep 2026",
    venue: "ANDARA KIDECO",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: ANDARA KIDECO (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cop30d1j69i62b9g6dij6b9k6kqj8bb1c9gjabb6c8q32p9lc9h64chm60",
    monthKey: "2026-09",
    date: "2026-09-26",
    endDate: "2026-09-27",
    dateLabel: "26-27 Sep 2026",
    venue: "Central Event, IMI Fest (Dir Imigrasi Jkt)",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Sound 20rb (Riders Hivi) minta Lifter\n- Sound 5rb\n- Sound 2rb",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Sound 20rb (Riders Hivi) minta Lifter", "Sound 5rb", "Sound 2rb"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-e7e74gurbmtfn5321nam9t32oc",
    monthKey: "2026-09",
    date: "2026-09-26",
    dateLabel: "26 Sep 2026",
    venue: "EVENT ANDARA — REYRA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: EVENT ANDARA — REYRA (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2i8pu21loi81gnqsqgt3iiqtls",
    monthKey: "2026-09",
    date: "2026-09-26",
    dateLabel: "26 Sep 2026",
    venue: "KOPDES MERAH PUTIH — ACUY",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: KOPDES MERAH PUTIH — ACUY (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7nafl6jc602d5i3csk4eb4sdpo",
    monthKey: "2026-09",
    date: "2026-09-26",
    endDate: "2026-09-27",
    dateLabel: "26-27 Sep 2026",
    venue: "VACENK SENTUL",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: VACENK SENTUL (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c9j36or6cdgm8bb66kq36b9k6opjib9ocgsm6bb171hm2dhj6cpj4eb674",
    monthKey: "2026-09",
    date: "2026-09-27",
    dateLabel: "27 Sep 2026",
    venue: "Softune Gn. Geulis Loading pagi",
    loadingSchedule: "Loading pagi",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Sound 5rb\n- Drum",
    sections: [
      createSection(
        "Audio",
        "Sound 5rb",
        ["Sound 5rb", "Drum"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cgrj4c33cgs62bb268p6cb9k6oq62b9p6koj8bb5clgj4dho6gp3ac3564",
    monthKey: "2026-09",
    date: "2026-09-29",
    dateLabel: "29 Sep 2026",
    venue: "Fahri Medina",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Fahri Medina (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4lkmisdoh7l1o3an3bednjhlk4",
    monthKey: "2026-09",
    date: "2026-09-30",
    dateLabel: "30 Sep 2026",
    venue: "RAE IHSAN",
    loadingSchedule: "Tanggal Loading : 29 September 2026 | Jam Loading : 20:00 WIB",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "SOUND 15RB \nLANGGENG SASONO BUDOYO\n*LIST ORDER* \n\nNama Event : DSNG AWARD \nLokasi : TMII Langgeng Sasono Budoyo\nTanggal Event : 30 September 2026\nTanggal Loading : 29 September 2026 \nJam Loading : 20:00 WIB \nJam Acara :  \nPIC : \n\nKebutuhan : \n* Sound System 15.000 Watt \n* Mic Condensor 4 Unit\n- Mic wireless 8 Unit \n- Mic Lidi 4 Unit",
    sections: [
      createSection(
        "Audio",
        "SOUND 15RB",
        ["SOUND 15RB", "LANGGENG SASONO BUDOYO", "LIST ORDER", "Nama Event : DSNG AWARD", "Lokasi : TMII Langgeng Sasono Budoyo", "Jam Loading : 20:00 WIB", "Jam Acara :", "PIC :", "Sound System 15.000 Watt", "Mic Condensor 4 Unit", "Mic wireless 8 Unit", "Mic Lidi 4 Unit"],
        [],
        []
      ),
    ],
  },
  // ============================================================================
  // BULAN OKTOBER 2026 (GOOGLE CALENDAR SYNC)
  // ============================================================================
  {
    id: "gcal-68r6aor2clijebb16op30b9k6kpm4bb16kp3abb4cpij2c9l74pmae9m60",
    monthKey: "2026-10",
    date: "2026-10-01",
    dateLabel: "1 Okt 2026",
    venue: "Om Nengah sound 2000 jkt",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Om Nengah sound 2000 jkt",
        ["Om Nengah sound 2000 jkt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1ltff9anop2op2ah5dqkguvqkm",
    monthKey: "2026-10",
    date: "2026-10-01",
    dateLabel: "1 Okt 2026",
    venue: "PAK DEDI MOVENPICK",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: PAK DEDI MOVENPICK (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5cqafqjs56ao9cj09gd3g7cmck",
    monthKey: "2026-10",
    date: "2026-10-01",
    dateLabel: "1 Okt 2026",
    venue: "SURVEY ITHACA FAHRUL",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Fahrul (M. Fahrulyana A)",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: SURVEY ITHACA FAHRUL (Menunggu Detail / Assessment Spek Admin)"],
        ["Fahrul"],
        []
      ),
    ],
  },
  {
    id: "gcal-cdgjaopmcdi3cbb670qj0b9k70q3ib9p6li64b9k61h38c9n68r34eb274",
    monthKey: "2026-10",
    date: "2026-10-03",
    dateLabel: "3 Okt 2026",
    venue: "Angga MKG",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Untuk Sabtu, 3 Oktober 2026\nVenue:\nMall Kelapa Gading (MKG) 3\n1 Unit RD700NX + Stand\n6 Unit IEM Sennheiser G4\n \n- 1 Unit RD700NX + Stand *750rb*\n- 6 Unit IEM Sennheiser G4 *2,4jt*\nTotal *3,150rb*",
    sections: [
      createSection(
        "Audio",
        "Mall Kelapa Gading (MKG) 3",
        ["Mall Kelapa Gading (MKG) 3", "1 Unit RD700NX + Stand", "6 Unit IEM Sennheiser G4", "1 Unit RD700NX + Stand *750rb", "6 Unit IEM Sennheiser G4 *2,4jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-chi66d9pcpi3cb9jcdimcb9k70q66b9o70o34bb66sp3ce9pclh36p9i6c",
    monthKey: "2026-10",
    date: "2026-10-03",
    dateLabel: "3 Okt 2026",
    venue: "Ps episode hotel",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Led p3.9 6x3 \nLevel tinggi 1 meter",
    sections: [
      createSection(
        "Videotron",
        "Led p3.9 6x3",
        ["Led p3.9 6x3", "Level tinggi 1 meter"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0m7mv5ptdv796utcatqie4ov10",
    monthKey: "2026-10",
    date: "2026-10-03",
    dateLabel: "3 Okt 2026",
    venue: "VACENK",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: VACENK (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1n2ddfm12lr9t1kj8pafc6nq1n",
    monthKey: "2026-10",
    date: "2026-10-04",
    dateLabel: "4 Okt 2026",
    venue: "ANDARA ITHACA CHILAX SUDIRMAN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: ANDARA ITHACA CHILAX SUDIRMAN (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-40in2lrjqbrp7sjnkugbd0ckdq",
    monthKey: "2026-10",
    date: "2026-10-05",
    dateLabel: "5 Okt 2026",
    venue: "Rivo Sumitro",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Rivo Sumitro (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4fgdcfmrlma79kmv8s908k6tni",
    monthKey: "2026-10",
    date: "2026-10-05",
    dateLabel: "5 Okt 2026",
    venue: "SASTA WISMUL",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Sound 3000\n- VJ",
    sections: [
      createSection(
        "Audio",
        "Sound 3000",
        ["Sound 3000"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "VJ",
        ["VJ"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6os6cc1ncgr64b9lchi6ab9kcgp30bb261gj2bb2c5j62pb26op3ephp70",
    monthKey: "2026-10",
    date: "2026-10-06",
    dateLabel: "6 Okt 2026",
    venue: "Ibu Olive new Capture sound 2000 yg bagus , request incharge Adin / mboh",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Mboh (Muhamad Rahmat)",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Ibu Olive new Capture sound 2000 yg bagus , request incharge Adin / mboh"],
        ["Mboh", "Adin"],
        []
      ),
    ],
  },
  {
    id: "gcal-c8r3gdpgc9hm6b9ncpi66b9kclim4b9p6opm2bb2c4rjicj674r3gc346c",
    monthKey: "2026-10",
    date: "2026-10-06",
    dateLabel: "6 Okt 2026",
    venue: "Sasta westin",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "tgl 6 Oktober kosong? butuh:\n- Streaming + Cam 4\n- Lighting\n- Sound System 5000 watt\n- Matador 2 pcs\n- Led Cube",
    sections: [
      createSection(
        "Audio",
        "Sound System 5000 watt",
        ["Sound System 5000 watt"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "Led Cube",
        ["Led Cube"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "Streaming + Cam 4",
        ["Streaming + Cam 4", "Matador 2 pcs"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-68qjgpb4cor3ib9p6hgj4b9k6oq6cbb16so64b9o64ojgdpj69i3ipb5cc",
    monthKey: "2026-10",
    date: "2026-10-07",
    endDate: "2026-10-08",
    dateLabel: "7-8 Okt 2026",
    venue: "Om nengah lighting Grand Sahid",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Lighting",
        "Om nengah lighting Grand Sahid",
        ["Om nengah lighting Grand Sahid"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-64o68or475j64b9p60oj2b9k75j62bb270sm4bb66pj3ee9kc9hm2cj2c4",
    monthKey: "2026-10",
    date: "2026-10-08",
    dateLabel: "8 Okt 2026",
    venue: "Meeting ST Regist jam 15.00",
    loadingSchedule: "jam 15.00",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Meeting ST Regist jam 15.00 (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4sd7u2heomchmjtk84rlim0n0a",
    monthKey: "2026-10",
    date: "2026-10-10",
    dateLabel: "10 Okt 2026",
    venue: "RESPATI OGAWA PULLMAN THAM,RIN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "DP 30JT (2 OKTOBER 2026)\nLampiran Google Calendar: QUO_RESPATI_PULLMAN THAMRIN_PT.OGAWA_10 OKTOBER 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_RESPATI_PULLMAN THAMRIN_PT.OGAWA_10 OKTOBER 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5kehbcghu5pctcejv6dvlt6r6j",
    monthKey: "2026-10",
    date: "2026-10-10",
    dateLabel: "10 Okt 2026",
    venue: "RONALD NICE",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- FRESHNELL 8\n- PARLED 16\n- BEAM 10\n- BRUTE 8\n- HAZZER 2\n- BSW 4\n- Kabel Protector 30pcs\n- Scafolding",
    sections: [
      createSection(
        "Lighting",
        "FRESHNELL 8",
        ["FRESHNELL 8", "PARLED 16", "BEAM 10", "BRUTE 8", "HAZZER 2", "BSW 4"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Kabel Protector 30pcs",
        ["Kabel Protector 30pcs", "Scafolding"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-75i3iob6c8o66b9lc4s3ib9kcdj3ebb16gpjgb9k6phm6pj360sm6c9i6c",
    monthKey: "2026-10",
    date: "2026-10-10",
    dateLabel: "10 Okt 2026",
    venue: "Sasta Penutupan LJK",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Sasta Penutupan LJK (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5m2cqhe1stgmtt2219k60mjqmg",
    monthKey: "2026-10",
    date: "2026-10-11",
    dateLabel: "11 Okt 2026",
    venue: "Om Kevin PIK",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "LED P3.9 3x6",
    sections: [
      createSection(
        "Videotron",
        "LED P3.9 3x6",
        ["LED P3.9 3x6"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0n3tnomq426vs6r2jk67o9na29",
    monthKey: "2026-10",
    date: "2026-10-11",
    dateLabel: "11 Okt 2026",
    venue: "PAK NENGAH SAHID",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: PAK NENGAH SAHID (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-68oj2ob1clgjeb9n6gqj0b9kcoojib9o6dhmcb9g6cq62opm71gmap9kco",
    monthKey: "2026-10",
    date: "2026-10-12",
    dateLabel: "12 Okt 2026",
    venue: "Bagas",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Thamrin nine \nSound system 10rb",
    sections: [
      createSection(
        "Audio",
        "Sound system 10rb",
        ["Sound system 10rb"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7m286d5k6bqvmi4a8ek16u3j2d",
    monthKey: "2026-10",
    date: "2026-10-14",
    endDate: "2026-10-18",
    dateLabel: "14-18 Okt 2026",
    venue: "RAMSES ALPHA PERSEWAAN",
    loadingSchedule: "Loading 14 okt",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Booking \nevent tgl 18 okt\nLoading 14 okt\n\n- AVANDA 210 12BOX\n- AVANDA 218 8BOX\n- MIXER HD + DL2\n- PANEL LISTRIK\n- DN 9680 + Optic",
    sections: [
      createSection(
        "Audio",
        "AVANDA 210 12BOX",
        ["AVANDA 210 12BOX", "AVANDA 218 8BOX", "MIXER HD + DL2", "DN 9680 + Optic"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "PANEL LISTRIK",
        ["PANEL LISTRIK"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-68q66ob56cp3cbb374q3ib9k6hh34b9pc9hj0b9mc5i3gpb460r30e1jck",
    monthKey: "2026-10",
    date: "2026-10-15",
    endDate: "2026-10-16",
    dateLabel: "15-16 Okt 2026",
    venue: "Bara intercon bandung",
    loadingSchedule: "Loading 14 Okt",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound System\n- PA 5000watt\n- 2x delay\n- 4x floor Mon\n- 8x WHM\n- Mixer M32\n\nAlat Band\n- Drum Electric\n- RD700 + Stand double\n- DI Box Gtr & Bass\n- 4x IEM musisi Behringer P2\n\nLighting\n- 4x Beam\n- 8x Par Led sebaran stage\n- 4x Par (tripod)\n- 4x Fresnel (tripod)\n- 2x Tripod\n- 1x hazer\n\nVideotrom\n- P3.9 uk: 6x3 mtr\n- riser 120cm\n\nEvent: 15-16 Okt 2026\nLoading 14 Okt\nVenue: Intercontinental Bandung\n\nBuatin Quotation nya yah om, kirim ke finance Bara besok pagi yah 🙏\nLampiran Google Calendar: QUO_BARA KREASI GEMILANG_CONTINENTAL BANDUNG_15-16 Oktober 2026.Rev.xlsx",
    sections: [
      createSection(
        "Audio",
        "PA 5000watt",
        ["PA 5000watt", "2x delay", "4x floor Mon", "8x WHM", "Mixer M32", "Drum Electric", "RD700 + Stand double", "DI Box Gtr & Bass", "4x IEM musisi Behringer P2"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "P3.9 uk: 6x3 mtr",
        ["P3.9 uk: 6x3 mtr", "riser 120cm", "Loading 14 Okt", "Venue: Intercontinental Bandung", "Buatin Quotation nya yah om, kirim ke finance Bara besok pagi yah 🙏"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "4x Beam",
        ["4x Beam", "8x Par Led sebaran stage", "4x Par (tripod)", "4x Fresnel (tripod)", "2x Tripod", "1x hazer", "Videotrom"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5cj2u253vnghtqj2pecpmv7jgj",
    monthKey: "2026-10",
    date: "2026-10-15",
    dateLabel: "15 Okt 2026",
    venue: "Survey TMII EVO jam 10 Pagi",
    loadingSchedule: "jam 10 Pagi",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Survey TMII EVO jam 10 Pagi (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2c5lfvrdhcm6vvc71laa14u0pe",
    monthKey: "2026-10",
    date: "2026-10-16",
    dateLabel: "16 Okt 2026",
    venue: "ANDARA ITHACA ST REGIST",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_ANDARA_ITHACA_ST.REGIST_16 OKTOBER 2026_FINAL.xlsx",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_ANDARA_ITHACA_ST.REGIST_16 OKTOBER 2026_FINAL.xlsx"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cgpjgohp74p66b9lclgj0b9k75gj4bb16ti38b9i6co6ac3265gj6cpn64",
    monthKey: "2026-10",
    date: "2026-10-16",
    endDate: "2026-10-18",
    dateLabel: "16-18 Okt 2026",
    venue: "Andreas R2R Xchange Bintaro",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Selamat siang, mohon penawaran sbb:\n- LED Indoor P 2.9\n- UK 3x4 Meter\n- incld player + operator (vmix)\n- venue : Bintaro Exchange Mall 2. Main atrium\n- tanggal event : 16-18 Oktober 2026 (3 hari)\n- waktu : full day, 09.00WIB - 22.00 WIB",
    sections: [
      createSection(
        "Videotron",
        "LED Indoor P 2.9",
        ["LED Indoor P 2.9", "UK 3x4 Meter"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "incld player + operator (vmix)",
        ["incld player + operator (vmix)", "venue : Bintaro Exchange Mall 2. Main atrium", "waktu : full day, 09.00WIB - 22.00 WIB"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0ei98nbpmmclmurmluah1nrspk",
    monthKey: "2026-10",
    date: "2026-10-17",
    dateLabel: "17 Okt 2026",
    venue: "ANDARA TSI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: ANDARA TSI (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cdgjip1p71gj2b9o64q3cb9kc5h38bb16kq6cbb375j36c34cgrjcp9o68",
    monthKey: "2026-10",
    date: "2026-10-17",
    dateLabel: "17 Okt 2026",
    venue: "Ayong TSI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Ayong Sumarsih",
    status: "Selesai",
    gcalSynced: true,
    notes: "Ada event masuk nih bos\n\nTgl 17 Oktober 2026\n*Spek : Sound 5rb watt + Co2 2unit*\n\nLokasi : Taman safari",
    sections: [
      createSection(
        "Lighting",
        "Spek : Sound 5rb watt + Co2 2unit",
        ["Spek : Sound 5rb watt + Co2 2unit", "Lokasi : Taman safari"],
        ["Ayong"],
        []
      ),
    ],
  },
  {
    id: "gcal-c8oj4dphc4q68bb46gq68b9k74s6cb9ocgp68b9ic8p3ed9kc4qjip33c8",
    monthKey: "2026-10",
    date: "2026-10-18",
    dateLabel: "18 Okt 2026",
    venue: "Adun sewa Rd",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Adun sewa Rd (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-65ijcdpg6spj2b9g64q30b9k6krm6bb2cdi36bb174o32p9ocdh3acj3cg",
    monthKey: "2026-10",
    date: "2026-10-18",
    dateLabel: "18 Okt 2026",
    venue: "Ayong Dufan",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Ayong Sumarsih",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tgl 18 Oktober 2026\n*Spek : Sound 10rb watt + Backline*\n\nLokasi : Dufan",
    sections: [
      createSection(
        "Audio",
        "Spek : Sound 10rb watt + Backline",
        ["Spek : Sound 10rb watt + Backline", "Lokasi : Dufan"],
        ["Ayong"],
        []
      ),
    ],
  },
  {
    id: "gcal-coqjccr16di34b9mcop3gb9k6srjibb175j3gb9o6grj0e35cksmac32cc",
    monthKey: "2026-10",
    date: "2026-10-19",
    endDate: "2026-10-20",
    dateLabel: "19-20 Okt 2026",
    venue: "19-20 Anggga LED 3x6 Minta cover kain  samping nya",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "DP 5JT",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["Order Event: 19-20 Anggga LED 3x6 Minta cover kain  samping nya (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1dosmnop8u84qkthjacjokc8sc",
    monthKey: "2026-10",
    date: "2026-10-20",
    dateLabel: "20 Okt 2026",
    venue: "Angga Bumi aki",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "LED\nSelasa, 20 Oktober 2026\nVenue:\nBumi Aki Heritage\nKemang Jakarta\n\nLED Videotron \nSpec P3.9 indoor\n\nSize: Tinggi 2.5m x Panjang 3m\n\n\nInclude:\n1 Unit Processor Novastar\n1 Unit Laptop\n1 Pax Operator LED\n\n2 Unit TV 55\" + Stand\n\nDP 2.3JT",
    sections: [
      createSection(
        "Videotron",
        "Selasa, 20 Oktober 2026",
        ["Selasa, 20 Oktober 2026", "Bumi Aki Heritage", "Kemang Jakarta", "Spec P3.9 indoor", "Size: Tinggi 2.5m x Panjang 3m", "Include:", "1 Unit Processor Novastar"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "1 Unit Laptop",
        ["1 Unit Laptop", "1 Pax Operator LED", "2 Unit TV 55\" + Stand"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6cojge9lcpi3gb9kc8pjgb9k65i3ibb169j66b9j68q3ccj16hj3iphlc8",
    monthKey: "2026-10",
    date: "2026-10-21",
    dateLabel: "21 Okt 2026",
    venue: "Fahri JS Luwansa",
    loadingSchedule: "bantuin ya loading tanggal 20 di luwansa kuningan jakarta",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "bantuin ya loading tanggal 20 di luwansa kuningan jakarta\n\nLED 4.5mx14m\nsound system 10.000 watt\nlighting (6 beam, 8 ParLED, freshnell 4, gunsmoke 1) Include Tripod\n- Sound Dorstop 1000watt",
    sections: [
      createSection(
        "Audio",
        "sound system 10.000 watt",
        ["sound system 10.000 watt", "Sound Dorstop 1000watt"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "LED 4.5mx14m",
        ["LED 4.5mx14m"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["lighting (6 beam, 8 ParLED, freshnell 4, gunsmoke 1) Include Tripod"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6t271ige5osh768p77i4cq138a",
    monthKey: "2026-10",
    date: "2026-10-21",
    dateLabel: "21 Okt 2026",
    venue: "PAK DEDI DUMECA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: PAK DEDI DUMECA (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-74rjad1n64qmcbb5c8pj6b9k61j3ebb260qj0b9n6gqmcopn70s66dpkco",
    monthKey: "2026-10",
    date: "2026-10-21",
    dateLabel: "21 Okt 2026",
    venue: "Pak Ari Rigging Yasmin",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Sound 10rb",
    sections: [
      createSection(
        "Audio",
        "Sound 10rb",
        ["Sound 10rb"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cgr3ie9p60rjabb468o30b9kccrmcbb1chh34b9ockojgdhhc8sm6d336c",
    monthKey: "2026-10",
    date: "2026-10-21",
    endDate: "2026-10-23",
    dateLabel: "21-23 Okt 2026",
    venue: "Pak wirya GGP Imanuel",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sewa HT 15 pcs",
    sections: [
      createSection(
        "Multimedia",
        "Sewa HT 15 pcs",
        ["Sewa HT 15 pcs"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1re4ked9his5kvujvq322j0nus",
    monthKey: "2026-10",
    date: "2026-10-22",
    dateLabel: "22 Okt 2026",
    venue: "EVO CENTRO HARRIS",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_EVO CENTRO_HOTEL HARRIS CCM_22 Oktober 2026.Rev2.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_EVO CENTRO_HOTEL HARRIS CCM_22 Oktober 2026.Rev2.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4hpl5jac8dribgrbsv7hb7087s",
    monthKey: "2026-10",
    date: "2026-10-22",
    dateLabel: "22 Okt 2026",
    venue: "IFG Life Central Event (Masjid Baiturahman Jiwasraya)",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUOT_IFG LIFE_CENTRAL EVENT 22 OKT.xlsx",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUOT_IFG LIFE_CENTRAL EVENT 22 OKT.xlsx"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6kr32pb5c8q66b9oc5j38b9k6oq64b9o6oomcb9g6hj30cj461hjiohncg",
    monthKey: "2026-10",
    date: "2026-10-22",
    dateLabel: "22 Okt 2026",
    venue: "Survei Titik seduh cibinong",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Survei Titik seduh cibinong (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1f5c29bpv4fco9ak39ofo576bd",
    monthKey: "2026-10",
    date: "2026-10-23",
    dateLabel: "23 Okt 2026",
    venue: "IREN LED 4X7 CIPUTRA HOTEL",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Videotron",
        "IREN LED 4X7 CIPUTRA HOTEL",
        ["IREN LED 4X7 CIPUTRA HOTEL"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-18jeruirmrn4i23ua8q8f8ek19",
    monthKey: "2026-10",
    date: "2026-10-23",
    endDate: "2026-10-24",
    dateLabel: "23-24 Okt 2026",
    venue: "PT LOKOMOTIF",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_PT LOKOMITIF KONTEN DIGITAL_CIPUTRA ART PRENEUR_23-24 OKTOBER 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_PT LOKOMITIF KONTEN DIGITAL_CIPUTRA ART PRENEUR_23-24 OKTOBER 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-64p66dr460p36b9icph3eb9kcgrj6bb16spjcbb5c9i36ob264rm4o9nc4",
    monthKey: "2026-10",
    date: "2026-10-23",
    endDate: "2026-10-24",
    dateLabel: "23-24 Okt 2026",
    venue: "Sasta blok m",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sementara yg fix kebutuhannya: \n- sound 20.000 watt \n- alat band\n- lighting set paket 5 jt \n- stage 7x4x 0,6 m (tangga 2 depan kanan kiri) \n- LED 5 x 2,5 m \n- dudukan led 1,2 m\n- VJ \n- matador 55\" 1 pcs\n- genset 60 kva 2 unit \n- genset 100 kva 1 unit *TBC*",
    sections: [
      createSection(
        "Audio",
        "sound 20.000 watt",
        ["sound 20.000 watt"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "LED 5 x 2,5 m",
        ["LED 5 x 2,5 m", "dudukan led 1,2 m"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "lighting set paket 5 jt",
        ["lighting set paket 5 jt"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "VJ",
        ["VJ", "matador 55\" 1 pcs"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Produksi, Rigging & Genset",
        ["stage 7x4x 0,6 m (tangga 2 depan kanan kiri)", "genset 60 kva 2 unit", "genset 100 kva 1 unit *TBC"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6k27rvv2eu5ju7fgd5gha3qeo1",
    monthKey: "2026-10",
    date: "2026-10-23",
    endDate: "2026-10-24",
    dateLabel: "23-24 Okt 2026",
    venue: "TRIZIVEN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_TRIZIVEN_PRIUK_SEWA SENNHEISER G3_23-24 OKTOBER 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_TRIZIVEN_PRIUK_SEWA SENNHEISER G3_23-24 OKTOBER 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5v4rsibpajimk8kmvjhei4fpin",
    monthKey: "2026-10",
    date: "2026-10-24",
    endDate: "2026-10-25",
    dateLabel: "24-25 Okt 2026",
    venue: "IBU USSY DEHENG HOUSE",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_IBU USSY PIETERS_DEHENG HOUSE_24-25 OKTOBER 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_IBU USSY PIETERS_DEHENG HOUSE_24-25 OKTOBER 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3mj5vddhpko1tt3fn4pgqq4lci",
    monthKey: "2026-10",
    date: "2026-10-24",
    dateLabel: "24 Okt 2026",
    venue: "PRASASTI KARAWANG",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_PRASASTI_MERCURE KARAWANG_24 OKTOBER 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_PRASASTI_MERCURE KARAWANG_24 OKTOBER 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6oq3cphh6di3ib9mc8om2b9kc9im8bb2clh3ibb16sqjcohgcgpm4chk68",
    monthKey: "2026-10",
    date: "2026-10-24",
    dateLabel: "24 Okt 2026",
    venue: "RESPATI SUMITOMO",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "DP 20JT (15 OKTOBER 2026)\nLampiran Google Calendar: INV_RESPATI_PABRIK SUMITOMO_24 OKTOBER 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_RESPATI_PABRIK SUMITOMO_24 OKTOBER 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1fgsqpds0e25amqk0t9euj0h8f",
    monthKey: "2026-10",
    date: "2026-10-24",
    dateLabel: "24 Okt 2026",
    venue: "ZUL Good School",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "DP 6JT",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: ZUL Good School (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-52t3s2craftkgqencbqbmm9nf2",
    monthKey: "2026-10",
    date: "2026-10-27",
    endDate: "2026-10-31",
    dateLabel: "27-31 Okt 2026",
    venue: "DEDI DUMECA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: DEDI DUMECA (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1qmfn5h0eop64i6883bej4jfj3",
    monthKey: "2026-10",
    date: "2026-10-27",
    dateLabel: "27 Okt 2026",
    venue: "Yamaha training DM5",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Siapin HS8 \n- TV 50inch 2 unit",
    sections: [
      createSection(
        "Audio",
        "Siapin HS8",
        ["Siapin HS8"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "TV 50inch 2 unit",
        ["TV 50inch 2 unit"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0kkmp3flia7gee36ertjs59rn3",
    monthKey: "2026-10",
    date: "2026-10-28",
    dateLabel: "28 Okt 2026",
    venue: "JUAN ONE TOWER",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_PAK JUAN FERDINANT EO_INDONESIA ONE TOWER_26 OKTOBER 2026.xlsx",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_PAK JUAN FERDINANT EO_INDONESIA ONE TOWER_26 OKTOBER 2026.xlsx"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-70nevhm8pbcgpb4vd1epdkqjl0",
    monthKey: "2026-10",
    date: "2026-10-28",
    dateLabel: "28 Okt 2026",
    venue: "Medina Plaza 89",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "* LED Videotron P2.6 2.5mx3m 2 Unit\n* Peninggian LED 50cm\n* Lighting: Moving Beam 4 Unit, Parled 8 Unit, Fresnel 4 Unit",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron P2.6 2.5mx3m 2 Unit",
        ["LED Videotron P2.6 2.5mx3m 2 Unit", "Peninggian LED 50cm"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["Lighting: Moving Beam 4 Unit, Parled 8 Unit, Fresnel 4 Unit"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c8rjephncli6cb9m65imcb9k64p3abb1cdim4b9o6comap9l6cs30cpgcc",
    monthKey: "2026-10",
    date: "2026-10-28",
    dateLabel: "28 Okt 2026",
    venue: "Prasasti Intercon",
    loadingSchedule: "Acara sore",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "PLN 28 Oktober \nIntercontinental Pondok Indah \nAcara sore \n\nMulticam 3 cam = 6.000.000\nLED wall 7 x 3 m P 2.6 = 12.600.000\nDudukan LED 1 x 7 m =1.400.000\nLighting - Lighting Package\r\n- Parled 12\r\n- Moving Beam 8\r\n- Stormy 8\r\n- Fresnel 6\r\n- Follow Spot 1\r\n- Mixer \n= 7.500.000\nSoundsystem 10.000 watt =6.000.000\nBackline = 3.000.000 \n\nDiscount\nTotal : 36.000.000",
    sections: [
      createSection(
        "Audio",
        "Mixer",
        ["Mixer", "Soundsystem 10.000 watt", "Backline", "Discount", "Total : 36.000.000"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "LED wall 7 x 3 m P 2.6",
        ["LED wall 7 x 3 m P 2.6", "Dudukan LED 1 x 7 m"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting - Lighting Package",
        ["Lighting - Lighting Package", "Parled 12", "Moving Beam 8", "Stormy 8", "Fresnel 6", "Follow Spot 1"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "Multicam 3 cam",
        ["Multicam 3 cam"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3o6l32efvk0osdj9afv83od838",
    monthKey: "2026-10",
    date: "2026-10-28",
    dateLabel: "28 Okt 2026",
    venue: "SIMPLE MICE HOLLYDAY INN",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: SIMPLE MICE HOLLYDAY INN (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-61i66eb164q30bb474rm8b9k6crj6b9p6oqjeb9iclijieb365j32p32co",
    monthKey: "2026-10",
    date: "2026-10-29",
    dateLabel: "29 Okt 2026",
    venue: "Edo Evo",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "pak untuk tanggal 29\nruang menara brillian island lt 1\n\n- projector x2\n- zoom 1 cam internet portable\n- sound system",
    sections: [
      createSection(
        "Multimedia",
        "projector x2",
        ["projector x2", "zoom 1 cam internet portable"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3joa2kkptvceg8qerhc1hk0ke8",
    monthKey: "2026-10",
    date: "2026-10-29",
    dateLabel: "29 Okt 2026",
    venue: "RIVO CGV GI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "STREAMING Multicam 3 (Acara launching OJK)\nWHM 6",
    sections: [
      createSection(
        "Audio",
        "WHM 6",
        ["WHM 6"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "Multimedia, Cam & Live Stream",
        ["STREAMING Multicam 3 (Acara launching OJK)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-361lph1b6kclkbfsvrkvph665q",
    monthKey: "2026-10",
    date: "2026-10-29",
    endDate: "2026-10-30",
    dateLabel: "29-30 Okt 2026",
    venue: "Simple mice Swissotel Pik",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "- Sound 8rb\n- lighting par 2bar, fresnel 8, beam 4, Hazzer \n- Led P2.6 7 x 3 + Level tinggi 1,5 meter \n- Matador 43\" 2 unit \n- Genset 60kva, 40 kva \n-",
    sections: [
      createSection(
        "Audio",
        "Sound 8rb",
        ["Sound 8rb"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["Led P2.6 7 x 3 + Level tinggi 1,5 meter"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting System & Effect",
        ["lighting par 2bar, fresnel 8, beam 4, Hazzer"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "Matador 43\" 2 unit",
        ["Matador 43\" 2 unit"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Genset 60kva, 40 kva",
        ["Genset 60kva, 40 kva"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-33ins8qle0beberkb0m735sm4m",
    monthKey: "2026-10",
    date: "2026-10-30",
    dateLabel: "30 Okt 2026",
    venue: "Pak Franky Green Forest VJ",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Multimedia",
        "Pak Franky Green Forest VJ",
        ["Pak Franky Green Forest VJ"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1003b5ikrq4tpikjdbldf97p48",
    monthKey: "2026-10",
    date: "2026-10-31",
    dateLabel: "31 Okt 2026",
    venue: "ANDARA MANE",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: ANDARA MANE (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6gsmcd366ssmabb46tgj4b9k6cr3ab9p6co30bb370q6cchoccr3icho6c",
    monthKey: "2026-10",
    date: "2026-10-31",
    dateLabel: "31 Okt 2026",
    venue: "Jungle arief sewa Backline",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_PT JUNGLE ASIA_JUNGLELAND_AMPHY THEATRE 31 OKT 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Jungle arief sewa Backline",
        ["Jungle arief sewa Backline"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6csj6chm68sj6b9kccqjib9k6kom2bb2c8rjib9p74rm8e9h69hj8e35cc",
    monthKey: "2026-10",
    date: "2026-10-31",
    dateLabel: "31 Okt 2026",
    venue: "Ps dufan",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Sound 20rb\nLed 6 x 3 + Level LED + Gawangan \nGenset 60kva 1 unit\nGenset 40kva 1 unit",
    sections: [
      createSection(
        "Audio",
        "Sound 20rb",
        ["Sound 20rb"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "Led 6 x 3 + Level LED + Gawangan",
        ["Led 6 x 3 + Level LED + Gawangan"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Genset 60kva 1 unit",
        ["Genset 60kva 1 unit", "Genset 40kva 1 unit"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-18vcrvcfnpmeccmr80ph50plhd",
    monthKey: "2026-10",
    date: "2026-10-31",
    dateLabel: "31 Okt 2026",
    venue: "Rebing SMP Khalifa bintaro",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    notes: "Tgl 31 oktober\nSMP Khalifa IMS (Bintaro)\n- led 2x4\n- level led 4 x 40cm\n- Lighting paket standar",
    sections: [
      createSection(
        "Videotron",
        "led 2x4",
        ["led 2x4", "level led 4 x 40cm"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting paket standar",
        ["Lighting paket standar"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-61imacpn68s6cb9m6oq32b9k61ijabb270qjib9j64s38cphchim4dhjco",
    monthKey: "2026-10",
    date: "2026-10-31",
    dateLabel: "31 Okt 2026",
    venue: "Robby RB Sewa Monitor RCF 6",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Selesai",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Robby RB Sewa Monitor RCF 6 (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  // ============================================================================
  // BULAN NOVEMBER 2026 (GOOGLE CALENDAR SYNC)
  // ============================================================================
  {
    id: "gcal-0738iac1aaemu025bvr7shpnvr",
    monthKey: "2026-11",
    date: "2026-11-04",
    endDate: "2026-11-07",
    dateLabel: "4-7 Nov 2026",
    venue: "IWAN JR PIK Loading jam 19.00",
    loadingSchedule: "Loading jam 19.00",
    pic: "Admin / Tim Operasional",
    status: "Berlangsung (Show)",
    gcalSynced: true,
    notes: "led P 1.9 2X2 Meter\nBudget 17,5Jt\nLampiran Google Calendar: INV_JR VISUAL_NICE PIK_4-7 NOVEMBER 2026.pdf",
    sections: [
      createSection(
        "Videotron",
        "led P 1.9 2X2 Meter",
        ["led P 1.9 2X2 Meter"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6oo3eohk61im8b9lclhj0b9k75i3gb9p6gr34b9jcks66cj170sjao9i60",
    monthKey: "2026-11",
    date: "2026-11-04",
    dateLabel: "4 Nov 2026",
    venue: "Rebing Novotel bogor",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Berlangsung (Show)",
    gcalSynced: true,
    notes: "- Sound 5rb\nLampiran Google Calendar: INV_REBING_NOVOTEL BOGOR_4 NOVEMBER 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound 5rb",
        ["Sound 5rb"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-0vka658e42aus9o7dm2nae74qs",
    monthKey: "2026-11",
    date: "2026-11-04",
    dateLabel: "4 Nov 2026",
    venue: "Rony Satu rumah Sound 10rb Sis Cilandak request GR jam 15.00",
    loadingSchedule: "GR jam 15.00",
    pic: "Admin / Tim Operasional",
    status: "Berlangsung (Show)",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_RONY_SIS CILANDAK_4NOV.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Rony Satu rumah Sound 10rb Sis Cilandak request GR jam 15.00"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4b6sjqs51u2k51u1j38uc25vnj",
    monthKey: "2026-11",
    date: "2026-11-06",
    endDate: "2026-11-08",
    dateLabel: "6-8 Nov 2026",
    venue: "BU GHITA CCM",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_IBU GHITA_CIBINONG CITY MALL_6-8 NOVEMBER 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_IBU GHITA_CIBINONG CITY MALL_6-8 NOVEMBER 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6cq6coppcdj64b9n6hgj2b9k75i36bb270qj8b9lcoom6dpg75gm4dhpcc",
    monthKey: "2026-11",
    date: "2026-11-06",
    endDate: "2026-11-07",
    dateLabel: "6-7 Nov 2026",
    venue: "Pak juang R hotel",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "Led P3.9 Uk 4 x 2,5 x 500rb : 5jt x 1,5 hari 7,5jt\nLevel led 200rb/ Meter x 5 : 1jt x 1,5 hari 1,5jt \nGenset 40kva 2,5jt x 2 hari 5jt\nLampiran Google Calendar: INV_PAK JUANG_R HOTEL_6-7 NOVEMBER 2026.pdf",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["Led P3.9 Uk 4 x 2,5 x 500rb : 5jt x 1,5 hari 7,5jt", "Level led 200rb/ Meter x 5 : 1jt x 1,5 hari 1,5jt"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Genset 40kva 2,5jt x 2 hari 5jt",
        ["Genset 40kva 2,5jt x 2 hari 5jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6ddgod8b0t4gso5eompmb52k2v",
    monthKey: "2026-11",
    date: "2026-11-06",
    dateLabel: "6 Nov 2026",
    venue: "RAKKAN PUTRA KKUWA COFFE",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: INV_RAKAN PUTRA_KKUWA KOFFIE_6 NOVEMBER 2026_UPDATE.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: INV_RAKAN PUTRA_KKUWA KOFFIE_6 NOVEMBER 2026_UPDATE.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c4q38ohi6dhjib9p6him4b9kc4sm8bb165j34bb474p68d1i6pij8phgco",
    monthKey: "2026-11",
    date: "2026-11-07",
    dateLabel: "7 Nov 2026",
    venue: "EVO TMII",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: EVO TMII (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5e7k568i7hb7qqted7c41tndur",
    monthKey: "2026-11",
    date: "2026-11-07",
    dateLabel: "7 Nov 2026",
    venue: "REY & Andara",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "Tgl 7 November 2026\nClient : Ajinomoto (cc. Andara)\nVenue : Viyata Stadion, Kelapa Gading\nKebutuhan :\n- 2 Monitor (tv 50inch)\n- Backdrop 2,44 x 2,44 \n- Backdrop 3,66 x 2,44",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Venue : Viyata Stadion, Kelapa Gading"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "2 Monitor (tv 50inch)",
        ["2 Monitor (tv 50inch)"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Backdrop 2,44 x 2,44",
        ["Backdrop 2,44 x 2,44", "Backdrop 3,66 x 2,44"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-cgqm6e9j71h64b9o6ss62b9k60sj4b9pckqj2b9nc8qj0c1p6gr30o9k60",
    monthKey: "2026-11",
    date: "2026-11-07",
    dateLabel: "7 Nov 2026",
    venue: "Respati TSI theatre",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "*New order :*\n\n- Event : PT Kalventis Sinergi Farma\n- Date : Sabtu, 7 November 2026\n- Pax: 800 Pax \n- Venue : Safari Theater - TSI \n\n*Kebutuhan:*\n- LED P 3.9 indoor uk.6 x 3 M\n- Level LED tinggi 1 M\n- Genset 60 KVA 1 unit\n- Sound System cocok  5.000 Watt\n\nDP 10JT 30 OKTOBER 2026\nLampiran Google Calendar: QUO_RESPATI_SAFARI THEATER_7 NOVEMBER 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound System cocok  5.000 Watt",
        ["Sound System cocok  5.000 Watt"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "LED P 3.9 indoor uk.6 x 3 M",
        ["LED P 3.9 indoor uk.6 x 3 M", "Level LED tinggi 1 M"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Genset 60 KVA 1 unit",
        ["Genset 60 KVA 1 unit"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-33mhg590h4sq0337q520bb464u",
    monthKey: "2026-11",
    date: "2026-11-07",
    dateLabel: "7 Nov 2026",
    venue: "Rony Satu rumah",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_RONY_VELODROME_07 NOV.xlsx",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_RONY_VELODROME_07 NOV.xlsx"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6ib3anr6np9u6r7125qfjr6c1m",
    monthKey: "2026-11",
    date: "2026-11-08",
    dateLabel: "8 Nov 2026",
    venue: "Wulan Bogor raya",
    loadingSchedule: "Event di tenda acara pagi.. Jadi sabtu malam nya setting ya",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "Kang.. Untuk minggu 8 November jadi ya sewa:\nPar LED 2 pcs\nFreshnell 2 pcs\nEvent di tenda acara pagi.. Jadi sabtu malam nya setting ya\nBudget 1,5 Jt",
    sections: [
      createSection(
        "Lighting",
        "Par LED 2 pcs",
        ["Par LED 2 pcs", "Freshnell 2 pcs"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Produksi, Rigging & Genset",
        ["Event di tenda acara pagi.. Jadi sabtu malam nya setting ya"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6thj4d9oc8qm6bb4c4o66b9k74pjabb1c8pjibb46th30or2chij2o9hcc",
    monthKey: "2026-11",
    date: "2026-11-09",
    dateLabel: "9 Nov 2026",
    venue: "Akew Sarifan Pasific",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "Lighting 4 beam",
    sections: [
      createSection(
        "Lighting",
        "Lighting 4 beam",
        ["Lighting 4 beam"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-3orf0de8ntuqq19k5nq8tg50cp",
    monthKey: "2026-11",
    date: "2026-11-09",
    dateLabel: "9 Nov 2026",
    venue: "RIO vertex grand Orchad",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: 090_SURAT LOADING LPPOM MUI 08 NOV 2026.pdf, QUO_PAK RIO VERTEX_GRAND BALLROOM ORCHAD_9 NOVEMBER 2026_REV1.xlsx",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: 090_SURAT LOADING LPPOM MUI 08 NOV 2026.pdf"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-17n6ncj3djer8b7mntstonrq9h",
    monthKey: "2026-11",
    date: "2026-11-09",
    dateLabel: "9 Nov 2026",
    venue: "RP 9-16",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: RP 9-16 (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-60fcmrlk0bt7dui7g6n7uqve33",
    monthKey: "2026-11",
    date: "2026-11-10",
    dateLabel: "10 Nov 2026",
    venue: "RONAL LOADING 9 SIANG",
    loadingSchedule: "LOADING 9 SIANG",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "Sound System 20.000 Watt Flying Full Set Alat Band. Artisnya Rizky Febrian. Acara tgl 10 November, GR tgl 9 November jam 7 malam.\nLighting :\n\n*Par Led : 20 Unit.\n\n*Fresnell : 10 Unit.\n\n*Moving Beam 380 : 16 Unit.\n\n*Stromy LED : 10 Unit.\n\n*Hazer : 2 Unit.\nSama Led Screen Nal :\n\n*Led Screen Center P2,9 Indoor Ukuran 12m x 4m. Tinggi Modul 100cm.\n\n*Led Screen Wings Kiri Kanan P3,9 Indoor Ukuran 6m x 4m x 2 sisi. Tinggi Modul 100cm.\n\n- Sound 20rb Riders Rizky 20Jt\n- Lighting : 15Jt\n- Led P2.9 48Sqm 24Jt\n- Total *59Jt*",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Sound System 20.000 Watt Flying Full Set Alat Band. Artisnya Rizky Febrian. Acara tgl 10 November, GR tgl 9 November jam 7 malam.", "Sound 20rb Riders Rizky 20Jt"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "Stromy LED : 10 Unit.",
        ["Stromy LED : 10 Unit.", "Sama Led Screen Nal :", "Led Screen Center P2,9 Indoor Ukuran 12m x 4m. Tinggi Modul 100cm.", "Led Screen Wings Kiri Kanan P3,9 Indoor Ukuran 6m x 4m x 2 sisi. Tinggi Modul 100cm.", "Led P2.9 48Sqm 24Jt"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Par Led : 20 Unit.",
        ["Par Led : 20 Unit.", "Fresnell : 10 Unit.", "Moving Beam 380 : 16 Unit.", "Hazer : 2 Unit.", "Lighting : 15Jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6gpjepb4c9im2b9hc8rm4b9k6cr6abb1c4r32bb5c5h3gdr3cpi62cj3co",
    monthKey: "2026-11",
    date: "2026-11-11",
    dateLabel: "11 Nov 2026",
    venue: "Roby sewa Headset",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "11.12 Nov\nBooking dlu clip on Sennheiser ya  6 unit \nSirip phaselab\n\nRabu d kabarin lg",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Booking dlu clip on Sennheiser ya  6 unit", "Sirip phaselab"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-c8p6ae33ckrmcbb56lh36b9k6oo30bb1c4s36b9hcdijaob36srj6ohjc4",
    monthKey: "2026-11",
    date: "2026-11-12",
    dateLabel: "12 Nov 2026",
    venue: "Zul",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Zul (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-06jitsd9odg8s0e79j9eg73m5q",
    monthKey: "2026-11",
    date: "2026-11-13",
    dateLabel: "13 Nov 2026",
    venue: "REY",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "Tgl 13 November 2026\nClient : Godbless Concert\nVenue : Glizt Inclusive Club, Kuningan\nKebutuhan :\n- 2 Laptop (yang ambil Reyhan)",
    sections: [
      createSection(
        "Multimedia",
        "2 Laptop (yang ambil Reyhan)",
        ["2 Laptop (yang ambil Reyhan)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6abhpjh0edgs1steb9n4b7jo5s",
    monthKey: "2026-11",
    date: "2026-11-13",
    endDate: "2026-11-14",
    dateLabel: "13-14 Nov 2026",
    venue: "Shutt Shoot Brick Hall 15rb",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "- Sound System 15rb \n- Riders RAN",
    sections: [
      createSection(
        "Audio",
        "Sound System 15rb",
        ["Sound System 15rb", "Riders RAN"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6kqjic1m6gqmab9o6gsmcb9k64qj2b9p70sj8b9lc4s3apb6ckpm8d3274",
    monthKey: "2026-11",
    date: "2026-11-16",
    dateLabel: "16 Nov 2026",
    venue: "Sani BGR",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Sani BGR (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-74sj0cj468p34bb16gpmcb9k6osmcbb26komcbb46ss3ie9h70pjidb5cg",
    monthKey: "2026-11",
    date: "2026-11-17",
    dateLabel: "17 Nov 2026",
    venue: "Discovery Evocentro",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Discovery Evocentro (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7u26f91adf0slh4gsme53icata",
    monthKey: "2026-11",
    date: "2026-11-17",
    dateLabel: "17 Nov 2026",
    venue: "SMAN 1 CIAWI",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: SMAN 1 CIAWI (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-1vdrbg30al8uk7qs8qgtibo7sn",
    monthKey: "2026-11",
    date: "2026-11-18",
    dateLabel: "18 Nov 2026",
    venue: "Herry 40rb Watt Banten",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "40 Jt All in \n- PA 40rb\n- Side Fill 5Rb\n- Mixer FOH + Mon Midas HD\n- IEM 6 Pcs",
    sections: [
      createSection(
        "Audio",
        "PA 40rb",
        ["PA 40rb", "Side Fill 5Rb", "Mixer FOH + Mon Midas HD", "IEM 6 Pcs"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2pdh2mftmfubp9s6v0s415rph6",
    monthKey: "2026-11",
    date: "2026-11-18",
    endDate: "2026-11-19",
    dateLabel: "18-19 Nov 2026",
    venue: "IVEST SAHID",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: IVEST SAHID (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-78rqe2ag1l5pc36jrk3cm3sugf",
    monthKey: "2026-11",
    date: "2026-11-19",
    dateLabel: "19 Nov 2026",
    venue: "Bu Ghita The Adrres Cibubur",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "led p3,9 Ukuran 2x3 Meter \nlevel tinggi 1,5 Meter",
    sections: [
      createSection(
        "Videotron",
        "LED P3.9 Ukuran 2x3 Meter",
        ["led p3,9 Ukuran 2x3 Meter", "level tinggi 1,5 Meter"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6so3ephic4pjcb9j74sjcb9k61h3cb9pcgpj8b9h6grj0phj6sr3cdb16g",
    monthKey: "2026-11",
    date: "2026-11-19",
    dateLabel: "19 Nov 2026",
    venue: "Rebing Harris Cibinong",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "- Sound 5rb \n- Lighting 4 beam (Budget 3Jt)",
    sections: [
      createSection(
        "Audio",
        "Sound 5rb",
        ["Sound 5rb"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting 4 beam",
        ["Lighting 4 beam"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2oi25ii33p9s8pjiclek53h2jh",
    monthKey: "2026-11",
    date: "2026-11-20",
    endDate: "2026-11-22",
    dateLabel: "20-22 Nov 2026",
    venue: "BROTHER BOOKING",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: BROTHER BOOKING (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-5abeh08spshtjrg0age00r2lkj",
    monthKey: "2026-11",
    date: "2026-11-20",
    dateLabel: "20 Nov 2026",
    venue: "Keanu Bucketlist",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "- Sound 7000\n- LED 3x10\n- Lighting Beam\n- Gate\n- Backdrop\n- Photobooth 360\n- Genset",
    sections: [
      createSection(
        "Audio",
        "Sound 7000",
        ["Sound 7000"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "LED 3x10",
        ["LED 3x10"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting Beam",
        ["Lighting Beam"],
        [],
        []
      ),
      createSection(
        "Multimedia",
        "Photobooth 360",
        ["Photobooth 360"],
        [],
        []
      ),
      createSection(
        "Produksi",
        "Gate & Genset",
        ["Gate", "Backdrop", "Genset"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6dc2o88krcep08kh1jpi6m250g",
    monthKey: "2026-11",
    date: "2026-11-22",
    dateLabel: "22 Nov 2026",
    venue: "IMI Fest Central",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: IMI Fest Central (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7qnpblce1gpl2dpv2s7in73kil",
    monthKey: "2026-11",
    date: "2026-11-22",
    dateLabel: "22 Nov 2026",
    venue: "KEVIN RR",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: KEVIN RR (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-60qj4ohh6hj68b9ocosm6b9k64rjgbb161h64b9n70qjiob5cko36e1o68",
    monthKey: "2026-11",
    date: "2026-11-24",
    dateLabel: "24 Nov 2026",
    venue: "Rebing Novotel bogor",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "- Sound 5rb",
    sections: [
      createSection(
        "Audio",
        "Sound 5rb",
        ["Sound 5rb"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-ccs62c1p74q3cb9ocdijeb9k60q6cb9pckrj6b9ncko34dr46lij6cpg6c",
    monthKey: "2026-11",
    date: "2026-11-28",
    dateLabel: "28 Nov 2026",
    venue: "DENNY WK",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "Om saya mau ordr sound system 10 rb watt  + Drum utk tgl 28/11/2026",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Om saya mau ordr sound system 10 rb watt  + Drum utk tgl 28/11/2026"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-ckp6cp9lc4p3cbb3c9imab9k70o32bb2cdh6cb9j6tgm2p1i69im4d1o60",
    monthKey: "2026-11",
    date: "2026-11-28",
    dateLabel: "28 Nov 2026",
    venue: "Iqbal MBG Cafe Titik Seduh Cibinong",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "- Sound 15rb *11Jt* (Pake HD 13,5Jt)\n- Backline *3Jt*\n- IEM *2,4Jt*\n- LED P3.9 Outdoor 9Sqm x450 *4.050rb*\n- Lighting *9Jt*\n- Total *29,450rb*\nLampiran Google Calendar: QUO_PAK IQBAL KPK_TITIK SEDUH_28 NOVEMBER 2026.pdf",
    sections: [
      createSection(
        "Audio",
        "Sound 15rb *11Jt* (Pake HD 13,5Jt)",
        ["Sound 15rb *11Jt* (Pake HD 13,5Jt)", "Backline *3Jt", "IEM *2,4Jt"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "LED P3.9 Outdoor 9Sqm x450 *4.050rb",
        ["LED P3.9 Outdoor 9Sqm x450 *4.050rb"],
        [],
        []
      ),
      createSection(
        "Lighting",
        "Lighting *9Jt",
        ["Lighting *9Jt"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-7r5e80igd4qdjhql499c7dq2t8",
    monthKey: "2026-11",
    date: "2026-11-28",
    dateLabel: "28 Nov 2026",
    venue: "PAK DEDI DUMECA DANAREKSA JKT",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "SOUND 5RB (HYBRID)\nLED P2.6 6x3.5 Meter",
    sections: [
      createSection(
        "Audio",
        "SOUND 5RB (HYBRID)",
        ["SOUND 5RB (HYBRID)"],
        [],
        []
      ),
      createSection(
        "Videotron",
        "LED P2.6 6x3.5 Meter",
        ["LED P2.6 6x3.5 Meter"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4ut51c9rmicn8i8eicu46bcrni",
    monthKey: "2026-11",
    date: "2026-11-29",
    dateLabel: "29 Nov 2026",
    venue: "ZUL",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "BABLAS KEMANG \nList peminjaman alat: \n\nDrum yamaha tour custom\nAmpli gitar marshall 900 (3 pcs)\nAmpli bass ampeg svt 4pro\nMic drum\nDi box (4pcs)\nCabel 1 LOT",
    sections: [
      createSection(
        "Audio",
        "Drum yamaha tour custom",
        ["Drum yamaha tour custom", "Ampli gitar marshall 900 (3 pcs)", "Ampli bass ampeg svt 4pro", "Mic drum", "Di box (4pcs)", "Cabel 1 LOT"],
        [],
        []
      ),
    ],
  },
  // ============================================================================
  // BULAN DESEMBER 2026 (GOOGLE CALENDAR SYNC)
  // ============================================================================
  {
    id: "gcal-74o32p1k6crm2b9p68s36b9kc4sjib9p6pim2b9i6pimadr36krm8p1jcc",
    monthKey: "2026-12",
    date: "2026-12-03",
    dateLabel: "3 Des 2026",
    venue: "Pak Aip",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "3 desember masih avaliable nga? sound 10 rb organ tunggal bagus 2 singer,  led 3x5",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["3 desember masih avaliable nga? sound 10 rb organ tunggal bagus 2 singer,  led 3x5"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6gpmce1i6dhm4bb575h3ab9kclgjcb9o68r30b9lcoojidb4cpgjad9n64",
    monthKey: "2026-12",
    date: "2026-12-04",
    dateLabel: "4 Des 2026",
    venue: "Ricky aksara",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Ricky aksara (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-2jtfbiffkatgntq7u9kclttqpa",
    monthKey: "2026-12",
    date: "2026-12-04",
    dateLabel: "4 Des 2026",
    venue: "VACENK Sentul Golf",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: VACENK Sentul Golf (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-6cqmacj3c8omab9oc4q68b9kccomabb2ckpjab9o6ti3apj165j64p9oc4",
    monthKey: "2026-12",
    date: "2026-12-05",
    dateLabel: "5 Des 2026",
    venue: "Denny WK",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "Om saya mau ordr sound system 10 rb watt utk tgl 5/12/2026",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Om saya mau ordr sound system 10 rb watt utk tgl 5/12/2026"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-62pgis1pd6dhqkuvnr6n0lullg",
    monthKey: "2026-12",
    date: "2026-12-06",
    dateLabel: "6 Des 2026",
    venue: "WEDDING AUDITORIUM KRC",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "LED 2x3 Meter \nLevel 1 Meter\nLighting",
    sections: [
      createSection(
        "Videotron",
        "LED 2x3 Meter",
        ["LED 2x3 Meter", "Level 1 Meter"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-ccp34phl70sjeb9n74s3ib9k6krj0b9o6lh68bb56oo30d1lcks6cc33c8",
    monthKey: "2026-12",
    date: "2026-12-08",
    dateLabel: "8 Des 2026",
    venue: "Denny Bayer Bandung",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Order Event: Denny Bayer Bandung (Menunggu Detail / Assessment Spek Admin)"],
        [],
        []
      ),
    ],
  },
  {
    id: "gcal-4mfugs1mtgfm6ht6cdao0doq6r",
    monthKey: "2026-12",
    date: "2026-12-14",
    endDate: "2026-12-15",
    dateLabel: "14-15 Des 2026",
    venue: "REVO SHERATON GANCIT",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "Sound 10rb, led.p 2.6 8x4 mic wirelss tambahan 20, genset yah",
    sections: [
      createSection(
        "Videotron",
        "LED Videotron & Visual",
        ["Sound 10rb, led.p 2.6 8x4 mic wirelss tambahan 20, genset yah"],
        [],
        []
      ),
    ],
  },
  // ============================================================================
  // BULAN JANUARI 2027 (GOOGLE CALENDAR SYNC)
  // ============================================================================
  {
    id: "gcal-7cts6rbv7dsf36o11ni4pigorm",
    monthKey: "2027-01",
    date: "2027-01-01",
    dateLabel: "1 Jan 2027",
    venue: "GILANG HMMI NUANZA",
    loadingSchedule: "Sesuai Jadwal Google Calendar",
    pic: "Admin / Tim Operasional",
    status: "Terjadwal",
    gcalSynced: true,
    notes: "Lampiran Google Calendar: QUO_PAK.GILANG SIX ORGANIZER_HMMI_NUANZA HOTEL_25 NOVEMBER 2026 (REV BUDGET) (1).xlsx",
    sections: [
      createSection(
        "Audio",
        "Sound System & Backline",
        ["Lampiran Order/Quotation: QUO_PAK.GILANG SIX ORGANIZER_HMMI_NUANZA HOTEL_25 NOVEMBER 2026 (REV BUDGET) (1).xlsx"],
        [],
        []
      ),
    ],
  },
];

/**
 * Dataset Resmi Job/Event yang telah difilter ketat (HANYA Job/Event produksi,
 * mengecualikan Meeting, Tech Meeting, Rapat, Survey/Survei, Visit Kantor, Pajak, Loan/KUR/KGS, Izin, Hampers, Undangan, Training)
 * serta dihubungkan otomatis dengan penugasan kerja Crew Freelance & Staff Inhouse per divisi.
 */
export const INITIAL_JOB_ASSIGNMENTS: JobAssignment[] = RAW_INITIAL_JOB_ASSIGNMENTS.filter(item =>
  isStrictJobOrEventCalendarEntry(item.venue || item.dateLabel || '', item.notes)
).map(enrichJobAssignmentCrewLinkage);

/**
 * Normalisasi & Sinkronisasi Master Jadwal Event Google Calendar (rizproduction78@gmail.com)
 * Memastikan:
 * 1. Hanya jadwal yang bersifat Job/Event yang masuk (Meeting, Survey, Visit, Loan/Pajak/Izin/Undangan otomatis diblokir).
 * 2. Jadwal lama dari Google Doc otomatis dibersihkan dan digantikan oleh jadwal resmi Google Calendar.
 * 3. Hasil Assessment Admin (Unit Alat / Spesifikasi Teknis & Penugasan Staff / Freelance) tetap dipertahankan 100%.
 * 4. Setiap Job/Event memiliki keterkaitan penugasan kerja Crew/Staff terstruktur di `sections[].crew`.
 */
export function normalizeJobAssignmentsMaster(rawItems?: JobAssignment[] | null): JobAssignment[] {
  const canonicalMap = new Map<string, JobAssignment>();
  for (const item of INITIAL_JOB_ASSIGNMENTS) {
    if (!isStrictJobOrEventCalendarEntry(item.venue || item.dateLabel || '', item.notes)) continue;
    canonicalMap.set(item.id, item);
  }

  if (Array.isArray(rawItems) && rawItems.length > 0) {
    for (const raw of rawItems) {
      if (!raw || typeof raw !== 'object' || !raw.id) continue;
      // Blokir entri non-Job/Event (Meeting, Survey, Visit, Loan, Pajak, Izin, Hampers, Undangan, Training)
      if (!isStrictJobOrEventCalendarEntry(raw.venue || raw.dateLabel || '', raw.notes)) {
        canonicalMap.delete(String(raw.id));
        continue;
      }
      const idStr = String(raw.id);
      // Blokir seluruh ID jadwal lama yang bersumber dari Google Doc (job-20261103-qbig-bsd, job-20261119-japfa-gadog, dll.)
      const isLegacyGoogleDocJob =
        idStr.startsWith('job-2026') && !canonicalMap.has(idStr) && !idStr.startsWith('job-custom-');
      if (isLegacyGoogleDocJob) {
        continue;
      }
      if (canonicalMap.has(idStr)) {
        // Pertahankan jika sudah di-assessment / diedit oleh Admin
        if (
          raw._userEdited ||
          raw.adminAssessmentStatus ||
          raw.adminAssessedBy ||
          (Array.isArray(raw.sections) &&
            raw.sections.some(
              s =>
                s.specAssessmentStatus ||
                s.crewAssessmentStatus ||
                (s.equipmentAssessments && Object.keys(s.equipmentAssessments).length > 0)
            ))
        ) {
          canonicalMap.set(
            idStr,
            enrichJobAssignmentCrewLinkage({
              ...canonicalMap.get(idStr)!,
              ...raw,
              gcalSynced: true,
            })
          );
        }
      } else if (raw._userEdited || idStr.startsWith('gcal-') || idStr.startsWith('job-custom-')) {
        canonicalMap.set(idStr, enrichJobAssignmentCrewLinkage({ ...raw, gcalSynced: true }));
      }
    }
  }

  return Array.from(canonicalMap.values()).sort((a, b) =>
    String(a.date || '').localeCompare(String(b.date || ''))
  );
}
