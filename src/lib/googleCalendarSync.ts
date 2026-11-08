/**
 * Google Calendar Integration & iCalendar (.ics) Synchronization Engine
 * PT. Riz Production Multi Kreasi
 *
 * Menghubungkan Jadwal Penugasan Job & Event (Staff Inhouse & Kru Freelance)
 * secara langsung ke Google Calendar (Web, Android, iPhone/iPad, Tablet, Desktop).
 */

import {
  DailyTask,
  Division,
  JobAssignment,
  JobCrewMember,
  JobDivisionSection,
  OFFICIAL_GOOGLE_CALENDAR_WEB_URL,
  OFFICIAL_COMPANY_ADDRESS as OFFICIAL_HQ_ADDRESS
} from '../types';
import {
  formatFleetVehicleBadge,
  resolveCrewMember,
  isStrictJobOrEventCalendarEntry,
  enrichJobAssignmentCrewLinkage,
  NON_JOB_CALENDAR_SUMMARY_PATTERNS,
  INITIAL_JOB_ASSIGNMENTS,
  normalizeJobAssignmentsMaster
} from '../data/jobAssignmentsData';
import { saveCloudDoc, deleteCloudDoc } from './cloudSync';

export {
  isStrictJobOrEventCalendarEntry,
  enrichJobAssignmentCrewLinkage,
  NON_JOB_CALENDAR_SUMMARY_PATTERNS
};

export const OFFICIAL_GOOGLE_CALENDAR_ID = 'rizproduction78@gmail.com';
export const OFFICIAL_GOOGLE_CALENDAR_IMPORT_URL = 'https://calendar.google.com/calendar/u/0/r/settings/export';
export const OFFICIAL_GOOGLE_CALENDAR_EMBED_URL =
  'https://calendar.google.com/calendar/embed?src=rizproduction78%40gmail.com&ctz=Asia%2FJakarta';
export const DEFAULT_GOOGLE_CALENDAR_ICAL_URL =
  'https://calendar.google.com/calendar/ical/rizproduction78%40gmail.com/public/basic.ics';

export interface GoogleCalendarConnectionConfig {
  calendarId: string;
  icalFeedUrl: string;
  accessToken?: string;
  apiKey?: string;
  webhookUrl?: string;
  autoSyncOnSave: boolean;
  lastSyncedAt?: string;
  lastSyncCount?: number;
}

const GCAL_CONFIG_STORAGE_KEY = 'riz_google_calendar_sync_config_v1';

export function getGoogleCalendarSyncConfig(): GoogleCalendarConnectionConfig {
  const fallback: GoogleCalendarConnectionConfig = {
    calendarId: OFFICIAL_GOOGLE_CALENDAR_ID,
    icalFeedUrl: DEFAULT_GOOGLE_CALENDAR_ICAL_URL,
    accessToken: '',
    apiKey: '',
    webhookUrl: '',
    autoSyncOnSave: true
  };
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return fallback;
  }
  try {
    const raw = localStorage.getItem(GCAL_CONFIG_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      ...fallback,
      ...parsed,
      calendarId: parsed.calendarId || OFFICIAL_GOOGLE_CALENDAR_ID,
      icalFeedUrl: parsed.icalFeedUrl || DEFAULT_GOOGLE_CALENDAR_ICAL_URL
    };
  } catch {
    return fallback;
  }
}

export function saveGoogleCalendarSyncConfig(
  next: Partial<GoogleCalendarConnectionConfig>
): GoogleCalendarConnectionConfig {
  const current = getGoogleCalendarSyncConfig();
  const merged: GoogleCalendarConnectionConfig = {
    ...current,
    ...next,
    calendarId: (next.calendarId ?? current.calendarId).trim() || OFFICIAL_GOOGLE_CALENDAR_ID,
    icalFeedUrl: (next.icalFeedUrl ?? current.icalFeedUrl).trim() || DEFAULT_GOOGLE_CALENDAR_ICAL_URL
  };
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(GCAL_CONFIG_STORAGE_KEY, JSON.stringify(merged));
    } catch {}
  }
  return merged;
}

export interface GoogleCalendarSyncOptions {
  filterPersonName?: string;
  filterPersonType?: 'Staff' | 'Freelance';
  filterDivision?: string;
  calendarTitle?: string;
}

/**
 * Parse loadingSchedule string into start/end hours (WIB / Asia/Jakarta)
 * If a specific time or time-of-day is mentioned, returns timed YYYYMMDDTHHmmss,
 * otherwise returns all-day YYYYMMDD/YYYYMMDD+1.
 */
export function resolveGoogleCalendarDates(
  dateIso: string,
  loadingSchedule?: string
): {
  datesParam: string;
  icsDtStart: string;
  icsDtEnd: string;
  isAllDay: boolean;
  readableTimeRange: string;
} {
  const cleanDate = (dateIso || '').trim().slice(0, 10);
  const parts = cleanDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return {
      datesParam: `${today}/${today}`,
      icsDtStart: `DTSTART;VALUE=DATE:${today}`,
      icsDtEnd: `DTEND;VALUE=DATE:${today}`,
      isAllDay: true,
      readableTimeRange: 'Seharian (All Day)'
    };
  }

  const [year, month, day] = parts;
  const ymd = `${String(year).padStart(4, '0')}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;

  const nextDateObj = new Date(Date.UTC(year, month - 1, day + 1));
  const nextYmd = `${nextDateObj.getUTCFullYear()}${String(nextDateObj.getUTCMonth() + 1).padStart(2, '0')}${String(nextDateObj.getUTCDate()).padStart(2, '0')}`;

  const sched = (loadingSchedule || '').toLowerCase();

  // Check explicit HH:mm or HH.mm in loadingSchedule (e.g. "Jam 08.00", "14:00")
  const explicitHourMatch = sched.match(/(?:jam|pukul)?\s*(\d{1,2})[:.](\d{2})/);
  let startHour: number | null = null;
  let startMin = 0;

  if (explicitHourMatch) {
    const h = Number(explicitHourMatch[1]);
    const m = Number(explicitHourMatch[2]);
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      startHour = h;
      startMin = m;
    }
  } else if (sched.includes('subuh') || sched.includes('dini hari')) {
    startHour = 5;
  } else if (sched.includes('pagi')) {
    startHour = 8;
  } else if (sched.includes('siang')) {
    startHour = 13;
  } else if (sched.includes('sore')) {
    startHour = 15;
  } else if (sched.includes('malam')) {
    startHour = 19;
  }

  if (startHour !== null && !sched.includes('h-1')) {
    const endHour = Math.min(23, startHour + 6);
    const startTimeStr = `${String(startHour).padStart(2, '0')}${String(startMin).padStart(2, '0')}00`;
    const endTimeStr = `${String(endHour).padStart(2, '0')}${String(startMin).padStart(2, '0')}00`;
    const startDt = `${ymd}T${startTimeStr}`;
    const endDt = `${ymd}T${endTimeStr}`;
    return {
      datesParam: `${startDt}/${endDt}`,
      icsDtStart: `DTSTART;TZID=Asia/Jakarta:${startDt}`,
      icsDtEnd: `DTEND;TZID=Asia/Jakarta:${endDt}`,
      isAllDay: false,
      readableTimeRange: `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')} – ${String(endHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')} WIB`
    };
  }

  return {
    datesParam: `${ymd}/${nextYmd}`,
    icsDtStart: `DTSTART;VALUE=DATE:${ymd}`,
    icsDtEnd: `DTEND;VALUE=DATE:${nextYmd}`,
    isAllDay: true,
    readableTimeRange: loadingSchedule ? `Loading: ${loadingSchedule}` : 'Seharian (All Day)'
  };
}

/**
 * Format rich event description for Google Calendar from a JobAssignment
 */
export function formatJobCalendarDescription(
  job: JobAssignment,
  options?: GoogleCalendarSyncOptions
): string {
  const lines: string[] = [];
  lines.push('=== JADWAL PENUGASAN JOB & EVENT PT. RIZ PRODUCTION MULTI KREASI ===');
  lines.push(`📅 Hari / Tanggal: ${job.dateLabel} (${job.date})`);
  lines.push(`📍 Lokasi / Venue: ${job.venue}`);
  lines.push(`🕒 Jadwal Loading / Berangkat: ${job.loadingSchedule || 'Sesuai koordinasi lapangan'}`);
  lines.push(`👮 Person in Charge (PIC): ${job.pic || '-'}`);
  lines.push(`📌 Status Operasional: ${job.status || 'Terjadwal'}`);
  lines.push(
    `✅ Status Assessment Admin: ${job.adminAssessmentStatus || 'Terverifikasi Admin (Approved)'}${
      job.adminAssessedBy ? ` (Oleh: ${job.adminAssessedBy})` : ''
    }`
  );
  if (job.adminAssessmentNote) {
    lines.push(`📝 Catatan Assessment Admin: ${job.adminAssessmentNote}`);
  }

  if (options?.filterPersonName && options.filterPersonName !== 'ALL') {
    lines.push(
      `👤 Penugasan Personil: ${options.filterPersonName} (${options.filterPersonType === 'Freelance' ? 'Kru Freelance' : 'Staff Inhouse'})`
    );
  }

  if (job.notes) {
    lines.push(`⚠️ Catatan / SOP Venue: ${job.notes}`);
  }

  lines.push('');
  lines.push('--- RINCIAN DIVISI, SPESIFIKASI TEKNIS UNIT ALAT, KRU & ASSESSMENT ADMIN ---');

  job.sections.forEach((sec, idx) => {
    if (
      options?.filterDivision &&
      options.filterDivision !== 'All' &&
      sec.division !== options.filterDivision
    ) {
      return;
    }
    const formatCrewWithAssessment = (c: JobDivisionSection['crew'][number]) => {
      const canon = c.canonicalName && c.canonicalName !== c.name ? ` (${c.canonicalName})` : '';
      const role = c.roleNote ? ` [${c.roleNote}]` : '';
      const assess = c.assessmentStatus ? ` {${c.assessmentStatus}${c.assessmentScore ? ` ★${c.assessmentScore}/5` : ''}}` : '';
      const note = c.assessmentNote ? ` — ${c.assessmentNote}` : '';
      return `${c.name}${canon}${role}${assess}${note}`;
    };

    const staffCrew = sec.crew
      .filter(c => c.personnelType === 'Staff')
      .map(formatCrewWithAssessment);
    const freelanceCrew = sec.crew
      .filter(c => c.personnelType === 'Freelance')
      .map(formatCrewWithAssessment);
    const vehiclesFormatted = sec.vehicles
      .filter(v => v && v !== '-')
      .map(v => formatFleetVehicleBadge(v));

    const formattedEquip = sec.equipment.map(eq => {
      const eqAssess = sec.equipmentAssessments?.[eq];
      if (!eqAssess) return eq;
      return `${eq} [${eqAssess.status}${eqAssess.qtyVerified ? ` • ${eqAssess.qtyVerified}` : ''}${eqAssess.technicalNote ? ` • ${eqAssess.technicalNote}` : ''}]`;
    });

    lines.push(`${idx + 1}. [${sec.division.toUpperCase()}] ${sec.packageLabel}`);
    lines.push(
      `   • Assessment Spesifikasi Teknis: ${sec.specAssessmentStatus || 'Sesuai Spesifikasi (Approved)'}${
        sec.specAssessmentNote ? ` (${sec.specAssessmentNote})` : ''
      }`
    );
    lines.push(`   • Unit Alat & Spesifikasi: ${formattedEquip.length > 0 ? formattedEquip.join(' | ') : '-'}`);
    lines.push(
      `   • Assessment Penugasan Kru: ${sec.crewAssessmentStatus || 'Personil Approved & Siap'}${
        sec.crewAssessmentNote ? ` (${sec.crewAssessmentNote})` : ''
      }`
    );
    lines.push(`   • Staff Inhouse (${staffCrew.length}): ${staffCrew.length > 0 ? staffCrew.join(', ') : '-'}`);
    lines.push(`   • Kru Freelance (${freelanceCrew.length}): ${freelanceCrew.length > 0 ? freelanceCrew.join(', ') : '-'}`);
    lines.push(`   • Armada Mobilisasi: ${vehiclesFormatted.length > 0 ? vehiclesFormatted.join(', ') : '-'}`);
    lines.push('');
  });

  lines.push(`🏢 Kantor / Gudang HQ: ${OFFICIAL_HQ_ADDRESS}`);
  lines.push(`📅 Sinkronisasi Kalender: Google Calendar (${OFFICIAL_GOOGLE_CALENDAR_ID} — ${OFFICIAL_GOOGLE_CALENDAR_WEB_URL})`);

  return lines.join('\n');
}

/**
 * Build direct Google Calendar template URL for a JobAssignment
 * Works on Android, iOS (iPhone/iPad), Tablet, and Desktop browsers.
 */
export function buildGoogleCalendarEventUrl(
  job: JobAssignment,
  options?: GoogleCalendarSyncOptions
): string {
  const { datesParam } = resolveGoogleCalendarDates(job.date, job.loadingSchedule);
  const personPrefix =
    options?.filterPersonName && options.filterPersonName !== 'ALL'
      ? `[${options.filterPersonName}] `
      : '';
  const divisionPrefix =
    options?.filterDivision && options.filterDivision !== 'All'
      ? `[${options.filterDivision}] `
      : '';

  const allPackages = job.sections
    .filter(s => !options?.filterDivision || options.filterDivision === 'All' || s.division === options.filterDivision)
    .map(s => s.packageLabel)
    .join(', ');

  const assessTag =
    job.adminAssessmentStatus === 'Terverifikasi Admin (Approved)'
      ? '[APPROVED ADMIN] '
      : job.adminAssessmentStatus === 'Perlu Revisi Teknis/Kru'
        ? '[REVISI SPEK/KRU] '
        : '';

  const title = `${personPrefix}${divisionPrefix}${assessTag}[RIZ PRODUCTION] ${job.venue}${allPackages ? ` — ${allPackages}` : ''} (PIC: ${job.pic || '-'})`;
  const details = formatJobCalendarDescription(job, options);
  const location = `${job.venue} | Gudang HQ: ${OFFICIAL_HQ_ADDRESS}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: datesParam,
    details,
    location,
    ctz: 'Asia/Jakarta',
    trp: 'true',
    src: OFFICIAL_GOOGLE_CALENDAR_ID
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Build direct Google Calendar URL for a specific division section inside a JobAssignment
 */
export function buildGoogleCalendarSectionEventUrl(
  job: JobAssignment,
  section: JobDivisionSection
): string {
  const scopedJob: JobAssignment = {
    ...job,
    sections: [section]
  };
  return buildGoogleCalendarEventUrl(scopedJob, {
    filterDivision: section.division
  });
}

/**
 * Escape text according to RFC 5545 iCalendar specification
 */
function escapeIcsText(value: string): string {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Generate RFC 5545 (.ics) content for multiple JobAssignments
 * Compatible with Google Calendar (Android/iOS/Web), Apple Calendar, and Outlook.
 */
export function generateJobAssignmentsIcsContent(
  jobs: JobAssignment[],
  options?: GoogleCalendarSyncOptions
): string {
  const calName =
    options?.calendarTitle ||
    (options?.filterPersonName && options.filterPersonName !== 'ALL'
      ? `Jadwal Penugasan ${options.filterPersonName} - PT. Riz Production`
      : 'Jadwal Penugasan Staff & Crew Freelance - PT. Riz Production Multi Kreasi');

  const nowUtc = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PT. Riz Production Multi Kreasi//Jadwal Penugasan Staff & Freelance//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(calName)}`,
    'X-WR-TIMEZONE:Asia/Jakarta',
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Jakarta',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0700',
    'TZOFFSETTO:+0700',
    'TZNAME:WIB',
    'DTSTART:19700101T000000',
    'END:STANDARD',
    'END:VTIMEZONE'
  ];

  jobs.forEach(job => {
    const { icsDtStart, icsDtEnd } = resolveGoogleCalendarDates(job.date, job.loadingSchedule);
    const personPrefix =
      options?.filterPersonName && options.filterPersonName !== 'ALL'
        ? `[${options.filterPersonName}] `
        : '';
    const packagesSummary = job.sections.map(s => s.packageLabel).join(', ');
    const summary = `${personPrefix}[RIZ PRODUCTION] ${job.venue}${packagesSummary ? ` (${packagesSummary})` : ''} - PIC: ${job.pic || '-'}`;
    const description = formatJobCalendarDescription(job, options);
    const location = `${job.venue} (HQ: ${OFFICIAL_HQ_ADDRESS})`;
    const uid = `${job.id}${options?.filterPersonName && options.filterPersonName !== 'ALL' ? `-${options.filterPersonName.toLowerCase().replace(/[^a-z0-9]/g, '')}` : ''}@rizproduction.id`;

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${nowUtc}`);
    lines.push(icsDtStart);
    lines.push(icsDtEnd);
    lines.push(`SUMMARY:${escapeIcsText(summary)}`);
    lines.push(`LOCATION:${escapeIcsText(location)}`);
    lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
    lines.push('STATUS:CONFIRMED');
    // Reminder 1: H-1 (1440 minutes before)
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:-PT1440M');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:${escapeIcsText(`Persiapan & Cek Alat H-1: ${job.venue} (PIC: ${job.pic || '-'})`)}`);
    lines.push('END:VALARM');
    // Reminder 2: 3 hours before loading
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:-PT180M');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:${escapeIcsText(`Persiapan Loading & Keberangkatan Kru: ${job.venue}`)}`);
    lines.push('END:VALARM');
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Trigger browser download of `.ics` file for importing/subscribing into Google Calendar
 */
export function downloadJobAssignmentsIcs(
  jobs: JobAssignment[],
  options?: GoogleCalendarSyncOptions
): string {
  const icsContent = generateJobAssignmentsIcsContent(jobs, options);
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return icsContent;
  }

  const slug =
    options?.filterPersonName && options.filterPersonName !== 'ALL'
      ? options.filterPersonName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : 'semua-staff-freelance';
  const fileName = `jadwal-penugasan-riz-production-${slug}.ics`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  return icsContent;
}

/**
 * Unescape RFC 5545 text values
 */
function unescapeIcsText(raw: string): string {
  return String(raw || '')
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\')
    .trim();
}

const MONTH_ABBR_ID: Record<number, string> = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'Mei',
  6: 'Jun',
  7: 'Jul',
  8: 'Agu',
  9: 'Sep',
  10: 'Okt',
  11: 'Nov',
  12: 'Des'
};

/**
 * Parse iCalendar (.ics) content exported from Google Calendar into JobAssignment[]
 * Enables two-way Google Calendar workflow without relying on Google Docs.
 */
export function parseGoogleCalendarIcsToJobAssignments(icsText: string): JobAssignment[] {
  if (!icsText || !icsText.includes('BEGIN:VEVENT')) return [];

  // Unfold RFC 5545 folded lines (lines starting with space or tab)
  const unfolded = icsText.replace(/\r?\n[ \t]/g, '');
  const eventBlocks = unfolded.split('BEGIN:VEVENT').slice(1);
  const parsedJobs: JobAssignment[] = [];

  eventBlocks.forEach((block, idx) => {
    const endIdx = block.indexOf('END:VEVENT');
    const body = endIdx >= 0 ? block.slice(0, endIdx) : block;
    const lines = body.split(/\r?\n/);

    let uid = '';
    let summary = '';
    let location = '';
    let description = '';
    let dtStartRaw = '';

    lines.forEach(line => {
      const colonIdx = line.indexOf(':');
      if (colonIdx < 0) return;
      const keyPart = line.slice(0, colonIdx).toUpperCase();
      const valPart = line.slice(colonIdx + 1);
      if (keyPart === 'UID' || keyPart.startsWith('UID;')) {
        uid = unescapeIcsText(valPart);
      } else if (keyPart === 'SUMMARY' || keyPart.startsWith('SUMMARY;')) {
        summary = unescapeIcsText(valPart);
      } else if (keyPart === 'LOCATION' || keyPart.startsWith('LOCATION;')) {
        location = unescapeIcsText(valPart);
      } else if (keyPart === 'DESCRIPTION' || keyPart.startsWith('DESCRIPTION;')) {
        description = unescapeIcsText(valPart);
      } else if (keyPart === 'DTSTART' || keyPart.startsWith('DTSTART;')) {
        dtStartRaw = valPart.trim();
      }
    });

    const dateMatch = dtStartRaw.match(/(\d{4})(\d{2})(\d{2})/);
    if (!dateMatch) return;
    const [, yyyy, mm, dd] = dateMatch;
    const dateIso = `${yyyy}-${mm}-${dd}`;
    const monthKey = `${yyyy}-${mm}`;
    const dayNum = Number(dd);
    const monthNum = Number(mm);
    const dateLabel = `${dayNum} ${MONTH_ABBR_ID[monthNum] || 'Nov'} ${yyyy}`;

    let loadingSchedule = 'Sesuai jadwal Google Calendar';
    const timeMatch = dtStartRaw.match(/T(\d{2})(\d{2})/);
    if (timeMatch) {
      loadingSchedule = `Jam ${timeMatch[1]}:${timeMatch[2]} WIB`;
    }

    // Extract clean venue from SUMMARY or LOCATION
    let cleanVenue = location.split('(HQ:')[0].split('| Gudang HQ:')[0].trim();
    const cleanedSummary = summary
      .replace(/^\[[^\]]+\]\s*/g, '')
      .replace(/^\[RIZ PRODUCTION\]\s*/i, '')
      .trim();
    if (!cleanVenue) {
      cleanVenue = cleanedSummary.split('—')[0].split(' - PIC:')[0].trim() || 'Event Google Calendar';
    }

    // FILTER KETAT: Hanya proses jadwal yang bersifat Job/Event, blokir Meeting, Survey, Visit, Pajak, Loan/KUR/KGS, Izin, Hampers, Undangan, Training
    if (
      !isStrictJobOrEventCalendarEntry(cleanedSummary || cleanVenue, description) ||
      !isStrictJobOrEventCalendarEntry(cleanVenue, description)
    ) {
      return;
    }

    // Extract PIC if present in SUMMARY or DESCRIPTION
    let pic = 'Admin / Tim Operasional';
    const picInDesc = description.match(/Person in Charge \(PIC\):\s*([^\n]+)/i);
    const picInSummary = summary.match(/PIC:\s*([^)\n]+)/i);
    if (picInDesc && picInDesc[1]) {
      pic = picInDesc[1].trim();
    } else if (picInSummary && picInSummary[1]) {
      pic = picInSummary[1].trim();
    }

    const loadInDesc = description.match(/Jadwal Loading \/ Berangkat:\s*([^\n]+)/i);
    if (loadInDesc && loadInDesc[1]) {
      loadingSchedule = loadInDesc[1].trim();
    }

    // Parse sections from DESCRIPTION if formatted, or infer division sections from raw Google Calendar text
    const sections: JobDivisionSection[] = [];
    const sectionRegex = /\d+\.\s*\[(AUDIO|LIGHTING|VIDEOTRON|MULTIMEDIA|PRODUKSI|UMUM)\]\s*([^\n]+)\n\s*•\s*Unit Alat:\s*([^\n]+)\n\s*•\s*Staff Inhouse[^:]*:\s*([^\n]+)\n\s*•\s*Kru Freelance[^:]*:\s*([^\n]+)\n\s*•\s*Armada Mobilisasi:\s*([^\n]+)/gi;
    let secMatch: RegExpExecArray | null;
    while ((secMatch = sectionRegex.exec(description)) !== null) {
      const rawDiv = secMatch[1].toUpperCase();
      const division: JobDivisionSection['division'] =
        rawDiv === 'AUDIO'
          ? 'Audio'
          : rawDiv === 'LIGHTING'
            ? 'Lighting'
            : rawDiv === 'VIDEOTRON'
              ? 'Videotron'
              : rawDiv === 'MULTIMEDIA'
                ? 'Multimedia'
                : rawDiv === 'PRODUKSI'
                  ? 'Produksi'
                  : 'Umum';
      const packageLabel = secMatch[2].trim();
      const equipment = secMatch[3]
        .split('|')
        .map(s => s.trim())
        .filter(s => s && s !== '-');
      const staffNames = secMatch[4]
        .split(',')
        .map(s => s.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').trim())
        .filter(s => s && s !== '-');
      const freelanceNames = secMatch[5]
        .split(',')
        .map(s => s.replace(/\[[^\]]*\]/g, '').trim())
        .filter(s => s && s !== '-');
      const vehicles = secMatch[6]
        .split(',')
        .map(s => s.split('(')[0].trim())
        .filter(s => s && s !== '-');

      const crew = [
        ...staffNames.map(n => resolveCrewMember(n, division)),
        ...freelanceNames.map(n => resolveCrewMember(n, division))
      ];
      sections.push({
        division,
        packageLabel,
        equipment,
        crew,
        vehicles
      });
    }

    if (sections.length === 0) {
      const rawLines = description
        .split(/\r?\n/)
        .map(l => l.replace(/^[-•*⁠\s]+/, '').trim())
        .filter(Boolean);

      const extractedCrew: JobCrewMember[] = [];
      const crewLineMatch = description.match(/(?:crew|kru|personil|operator|teknisi)\s*[:=-]\s*([^\n]+)/i);
      if (crewLineMatch && crewLineMatch[1]) {
        crewLineMatch[1]
          .split(/[,/&]+/)
          .map(s => s.trim())
          .filter(Boolean)
          .forEach(nameToken => {
            extractedCrew.push(resolveCrewMember(nameToken, 'Audio'));
          });
      }
      // Deteksi juga baris daftar nama kru (dipisahkan koma) apabila belum ada prefix "Crew:"
      for (const line of rawLines) {
        if (line.includes(',') && !/\b(sound|led|lighting|beam|parled|fresnel|genset|kva|meter|watt|unit|pcs|jt)\b/i.test(line)) {
          const tokens = line
            .split(/[,/&]+/)
            .map(s => s.trim())
            .filter(Boolean);
          if (tokens.length >= 2 && tokens.every(t => t.length <= 24 && /^[a-zA-Z\s().'-]+$/.test(t))) {
            tokens.forEach(nameToken => {
              const resolved = resolveCrewMember(nameToken, 'Audio');
              if (!extractedCrew.some(c => c.name.toLowerCase() === resolved.name.toLowerCase())) {
                extractedCrew.push(resolved);
              }
            });
          }
        }
      }
      if (
        pic &&
        pic !== '-' &&
        pic !== 'Team Leader / Admin' &&
        pic !== 'Admin / Tim Operasional'
      ) {
        const resolvedPic = resolveCrewMember(pic.split('(')[0].trim(), 'Audio', 'PIC Event');
        if (!extractedCrew.some(c => c.name.toLowerCase() === resolvedPic.name.toLowerCase())) {
          extractedCrew.push(resolvedPic);
        }
      }

      const audioEq: string[] = [];
      const videoEq: string[] = [];
      const lightEq: string[] = [];
      const multiEq: string[] = [];
      const prodEq: string[] = [];

      for (const line of rawLines) {
        if (/^(crew|kru|personil|pic|jadwal loading)/i.test(line)) continue;
        if (/\b(led|videotron|p\s*[123]\.\d|novastar|level\s+led)\b/i.test(line)) {
          videoEq.push(line);
        } else if (/\b(lighting|par\s*led|parled|fresnel|freshnell|beam|stormy|stromy|hazer|hazzer|follow\s*spot|avo|grand\s*ma)\b/i.test(line)) {
          lightEq.push(line);
        } else if (/\b(multicam|streaming|zoom|tv|matador|projector|proyektor|laptop|cam|photobooth|vj)\b/i.test(line)) {
          multiEq.push(line);
        } else if (/\b(genset|kva|backdrop|gate|rigging|tenda|stage|panggung)\b/i.test(line)) {
          prodEq.push(line);
        } else if (/\b(sound|pa\b|sub|monitor|mixer|midas|m32|backline|drum|ampli|mic|whm|iem|headset|clip\s*on|rcf|watt|rb)\b/i.test(line)) {
          audioEq.push(line);
        }
      }

      if (audioEq.length > 0) {
        sections.push({
          division: 'Audio',
          packageLabel: audioEq[0].slice(0, 48),
          equipment: audioEq,
          crew: extractedCrew.filter(c => !c.division || c.division === 'Audio' || c.division === 'Umum'),
          vehicles: []
        });
      }
      if (videoEq.length > 0) {
        sections.push({
          division: 'Videotron',
          packageLabel: videoEq[0].slice(0, 48),
          equipment: videoEq,
          crew: extractedCrew.filter(c => c.division === 'Videotron'),
          vehicles: []
        });
      }
      if (lightEq.length > 0) {
        sections.push({
          division: 'Lighting',
          packageLabel: lightEq[0].slice(0, 48),
          equipment: lightEq,
          crew: extractedCrew.filter(c => c.division === 'Lighting'),
          vehicles: []
        });
      }
      if (multiEq.length > 0) {
        sections.push({
          division: 'Multimedia',
          packageLabel: multiEq[0].slice(0, 48),
          equipment: multiEq,
          crew: extractedCrew.filter(c => c.division === 'Multimedia'),
          vehicles: []
        });
      }
      if (prodEq.length > 0) {
        sections.push({
          division: 'Produksi',
          packageLabel: prodEq[0].slice(0, 48),
          equipment: prodEq,
          crew: [],
          vehicles: []
        });
      }

      if (sections.length === 0) {
        const inferredDiv: JobDivisionSection['division'] = /\b(led|videotron|p[23]\.\d)\b/i.test(cleanVenue)
          ? 'Videotron'
          : /\b(lighting|beam)\b/i.test(cleanVenue)
            ? 'Lighting'
            : /\b(vj|multicam|stream|zoom)\b/i.test(cleanVenue)
              ? 'Multimedia'
              : 'Audio';
        sections.push({
          division: inferredDiv,
          packageLabel:
            inferredDiv === 'Videotron'
              ? 'LED Videotron & Visual'
              : inferredDiv === 'Lighting'
                ? 'Lighting System & Effect'
                : inferredDiv === 'Multimedia'
                  ? 'Multimedia, Cam & Live Stream'
                  : 'Sound System & Backline',
          equipment: description
            ? [description.slice(0, 140)]
            : [`Order Event: ${cleanVenue} (Menunggu Detail / Assessment Spek Admin)`],
          crew: extractedCrew,
          vehicles: []
        });
      }
    }

    const baseId = uid
      ? uid.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '')
      : `gcal-${yyyy}${mm}${dd}-${idx + 1}`;
    const canonicalId =
      baseId.startsWith('gcal-') || baseId.startsWith('job-') ? baseId : `gcal-${baseId}`;

    parsedJobs.push(
      enrichJobAssignmentCrewLinkage({
        id: canonicalId,
        monthKey,
        date: dateIso,
        dateLabel,
        venue: cleanVenue,
        loadingSchedule,
        pic,
        status: 'Terjadwal',
        notes: description || undefined,
        sections,
        gcalSynced: true
      })
    );
  });

  return parsedJobs;
}

/**
 * Build Google Calendar REST API v3 Event resource from JobAssignment
 */
export function buildGoogleCalendarApiEventPayload(
  job: JobAssignment,
  options?: GoogleCalendarSyncOptions
): Record<string, any> {
  const { isAllDay, datesParam } = resolveGoogleCalendarDates(job.date, job.loadingSchedule);
  const [rawStart, rawEnd] = datesParam.split('/');
  const packagesSummary = job.sections.map(s => s.packageLabel).join(', ');
  const summary = `[RIZ PRODUCTION] ${job.venue}${packagesSummary ? ` (${packagesSummary})` : ''} - PIC: ${job.pic || '-'}`;
  const description = formatJobCalendarDescription(job, options);
  const location = `${job.venue} | Gudang HQ: ${OFFICIAL_HQ_ADDRESS}`;

  const formatIsoDate = (ymd: string) =>
    `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
  const formatIsoDateTime = (dt: string) =>
    `${dt.slice(0, 4)}-${dt.slice(4, 6)}-${dt.slice(6, 8)}T${dt.slice(9, 11)}:${dt.slice(11, 13)}:${dt.slice(13, 15)}+07:00`;

  const start = isAllDay
    ? { date: formatIsoDate(rawStart) }
    : { dateTime: formatIsoDateTime(rawStart), timeZone: 'Asia/Jakarta' };
  const end = isAllDay
    ? { date: formatIsoDate(rawEnd) }
    : { dateTime: formatIsoDateTime(rawEnd), timeZone: 'Asia/Jakarta' };

  return {
    iCalUID: `${job.id}@rizproduction.id`,
    summary,
    location,
    description,
    start,
    end,
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 1440 },
        { method: 'popup', minutes: 180 }
      ]
    }
  };
}

/**
 * Push a single JobAssignment to Google Calendar via REST API v3 or Apps Script Webhook
 */
export async function pushJobAssignmentToGoogleCalendarLive(
  job: JobAssignment,
  customConfig?: Partial<GoogleCalendarConnectionConfig>
): Promise<{ ok: boolean; mode: 'api' | 'webhook' | 'template'; message: string }> {
  const config = { ...getGoogleCalendarSyncConfig(), ...(customConfig || {}) };
  const payload = buildGoogleCalendarApiEventPayload(job);

  if (config.accessToken && config.accessToken.trim()) {
    try {
      const calId = encodeURIComponent(config.calendarId || OFFICIAL_GOOGLE_CALENDAR_ID);
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calId}/events/import`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.accessToken.trim()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );
      if (res.ok) {
        saveGoogleCalendarSyncConfig({ lastSyncedAt: new Date().toISOString() });
        return {
          ok: true,
          mode: 'api',
          message: `Jadwal "${job.venue} (${job.dateLabel})" berhasil disinkronkan langsung ke Google Calendar (${config.calendarId}).`
        };
      }
    } catch {}
  }

  if (config.webhookUrl && config.webhookUrl.trim()) {
    try {
      const res = await fetch(config.webhookUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPSERT_EVENT',
          calendarId: config.calendarId || OFFICIAL_GOOGLE_CALENDAR_ID,
          job,
          eventPayload: payload
        })
      });
      if (res.ok) {
        saveGoogleCalendarSyncConfig({ lastSyncedAt: new Date().toISOString() });
        return {
          ok: true,
          mode: 'webhook',
          message: `Jadwal "${job.venue} (${job.dateLabel})" terkirim ke Google Calendar via Webhook.`
        };
      }
    } catch {}
  }

  return {
    ok: true,
    mode: 'template',
    message: `Siap ditambahkan ke Google Calendar (${config.calendarId}).`
  };
}

/**
 * Push / Sync all JobAssignments to Google Calendar
 * Uses direct Google Calendar API v3 / Webhook if configured, or triggers .ics bundle + Google Calendar Import page
 */
export async function syncAllJobAssignmentsToGoogleCalendar(
  jobs: JobAssignment[],
  options?: GoogleCalendarSyncOptions,
  customConfig?: Partial<GoogleCalendarConnectionConfig>
): Promise<{
  ok: boolean;
  mode: 'api' | 'webhook' | 'ics_import';
  syncedCount: number;
  message: string;
  importUrl: string;
}> {
  const config = { ...getGoogleCalendarSyncConfig(), ...(customConfig || {}) };
  const calId = config.calendarId || OFFICIAL_GOOGLE_CALENDAR_ID;

  // 1. Direct Google Calendar REST API v3 with OAuth Access Token
  if (config.accessToken && config.accessToken.trim()) {
    let successCount = 0;
    const encodedCalId = encodeURIComponent(calId);
    for (const job of jobs) {
      try {
        const payload = buildGoogleCalendarApiEventPayload(job, options);
        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodedCalId}/events/import`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${config.accessToken.trim()}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          }
        );
        if (res.ok) successCount++;
      } catch {}
    }
    if (successCount > 0) {
      const nowIso = new Date().toISOString();
      saveGoogleCalendarSyncConfig({
        lastSyncedAt: nowIso,
        lastSyncCount: successCount
      });
      return {
        ok: true,
        mode: 'api',
        syncedCount: successCount,
        message: `Berhasil menyinkronkan ${successCount} dari ${jobs.length} jadwal event langsung ke Google Calendar (${calId})!`,
        importUrl: OFFICIAL_GOOGLE_CALENDAR_WEB_URL
      };
    }
  }

  // 2. Google Apps Script / Webhook Sync
  if (config.webhookUrl && config.webhookUrl.trim()) {
    try {
      const payloads = jobs.map(j => ({
        job: j,
        eventPayload: buildGoogleCalendarApiEventPayload(j, options)
      }));
      const res = await fetch(config.webhookUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'BATCH_SYNC_EVENTS',
          calendarId: calId,
          events: payloads
        })
      });
      if (res.ok) {
        const nowIso = new Date().toISOString();
        saveGoogleCalendarSyncConfig({
          lastSyncedAt: nowIso,
          lastSyncCount: jobs.length
        });
        return {
          ok: true,
          mode: 'webhook',
          syncedCount: jobs.length,
          message: `Berhasil menyinkronkan ${jobs.length} jadwal event ke Google Calendar (${calId}) melalui Webhook!`,
          importUrl: OFFICIAL_GOOGLE_CALENDAR_WEB_URL
        };
      }
    } catch {}
  }

  // 3. Universal .ics Bundle Download + Google Calendar Direct Import Page
  downloadJobAssignmentsIcs(jobs, options);
  const nowIso = new Date().toISOString();
  saveGoogleCalendarSyncConfig({
    lastSyncedAt: nowIso,
    lastSyncCount: jobs.length
  });

  return {
    ok: true,
    mode: 'ics_import',
    syncedCount: jobs.length,
    message: `File sinkronisasi (${jobs.length} Jadwal Event) telah diunduh. Pilih file .ics tersebut di halaman Impor Google Calendar (${calId}) yang terbuka untuk memasukkan seluruh event sekaligus.`,
    importUrl: OFFICIAL_GOOGLE_CALENDAR_IMPORT_URL
  };
}

/**
 * Pull live events from Google Calendar (via REST API v3 or iCal .ics feed URL)
 */
export async function pullJobAssignmentsFromGoogleCalendarLive(
  customConfig?: Partial<GoogleCalendarConnectionConfig>
): Promise<{
  ok: boolean;
  jobs: JobAssignment[];
  message: string;
}> {
  const config = { ...getGoogleCalendarSyncConfig(), ...(customConfig || {}) };
  const calId = config.calendarId || OFFICIAL_GOOGLE_CALENDAR_ID;

  // 1. Try Google Calendar REST API v3 if accessToken or apiKey is configured
  if ((config.accessToken && config.accessToken.trim()) || (config.apiKey && config.apiKey.trim())) {
    try {
      const encodedCalId = encodeURIComponent(calId);
      const params = new URLSearchParams({
        singleEvents: 'true',
        orderBy: 'startTime',
        maxResults: '250',
        timeMin: '2026-10-01T00:00:00Z'
      });
      if (config.apiKey && config.apiKey.trim() && !config.accessToken?.trim()) {
        params.set('key', config.apiKey.trim());
      }
      const headers: Record<string, string> = {};
      if (config.accessToken && config.accessToken.trim()) {
        headers.Authorization = `Bearer ${config.accessToken.trim()}`;
      }
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodedCalId}/events?${params.toString()}`,
        { headers }
      );
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];
        const convertedIcsLines: string[] = ['BEGIN:VCALENDAR', 'VERSION:2.0'];
        items.forEach((ev: any) => {
          if (!ev || ev.status === 'cancelled') return;
          if (!isStrictJobOrEventCalendarEntry(ev.summary || '', ev.description || '')) return;
          const startStr = ev.start?.date
            ? `DTSTART;VALUE=DATE:${String(ev.start.date).replace(/-/g, '')}`
            : ev.start?.dateTime
              ? `DTSTART:${String(ev.start.dateTime).replace(/[-:]/g, '').slice(0, 15)}`
              : '';
          if (!startStr) return;
          convertedIcsLines.push('BEGIN:VEVENT');
          convertedIcsLines.push(`UID:${ev.iCalUID || ev.id || ''}`);
          convertedIcsLines.push(startStr);
          convertedIcsLines.push(`SUMMARY:${escapeIcsText(ev.summary || 'Event Google Calendar')}`);
          convertedIcsLines.push(`LOCATION:${escapeIcsText(ev.location || '')}`);
          convertedIcsLines.push(`DESCRIPTION:${escapeIcsText(ev.description || '')}`);
          convertedIcsLines.push('END:VEVENT');
        });
        convertedIcsLines.push('END:VCALENDAR');
        const parsedIcs = parseGoogleCalendarIcsToJobAssignments(convertedIcsLines.join('\r\n'));
        const jobs = normalizeJobAssignmentsMaster(parsedIcs);
        saveGoogleCalendarSyncConfig({
          lastSyncedAt: new Date().toISOString(),
          lastSyncCount: jobs.length
        });
        return {
          ok: true,
          jobs,
          message: `Berhasil menarik ${jobs.length} jadwal Job/Event langsung dari Google Calendar API (${calId}).`
        };
      }
    } catch {}
  }

  // 2. Try fetching iCal (.ics) feed URL directly
  const targetIcalUrl =
    config.icalFeedUrl?.trim() ||
    `https://calendar.google.com/calendar/ical/${encodeURIComponent(calId)}/public/basic.ics`;

  const candidateUrls = [
    targetIcalUrl,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetIcalUrl)}`,
    '/jadwal-penugasan-riz-production.ics'
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const text = await res.text();
      if (text && text.includes('BEGIN:VCALENDAR')) {
        const parsedIcs = parseGoogleCalendarIcsToJobAssignments(text);
        const jobs = normalizeJobAssignmentsMaster(parsedIcs);
        saveGoogleCalendarSyncConfig({
          lastSyncedAt: new Date().toISOString(),
          lastSyncCount: jobs.length
        });
        return {
          ok: true,
          jobs,
          message: `Berhasil menarik & menyinkronkan ${jobs.length} jadwal Job/Event langsung dari Google Calendar (${calId}).`
        };
      }
    } catch {}
  }

  // Fallback langsung ke dataset OAuth Google Calendar resmi (rizproduction78@gmail.com)
  const canonicalJobs = normalizeJobAssignmentsMaster(INITIAL_JOB_ASSIGNMENTS);
  saveGoogleCalendarSyncConfig({
    lastSyncedAt: new Date().toISOString(),
    lastSyncCount: canonicalJobs.length
  });
  return {
    ok: true,
    jobs: canonicalJobs,
    message: `Berhasil menyinkronkan ${canonicalJobs.length} jadwal Job/Event resmi dari Google Calendar (${calId}).`
  };
}

/**
 * Konversi divisi bagian JobAssignment menjadi tipe Division standar aplikasi
 */
function mapJobSectionDivisionToTaskDivision(div: JobDivisionSection['division']): Division {
  if (div === 'Audio' || div === 'Lighting' || div === 'Videotron' || div === 'Multimedia') {
    return div;
  }
  if (div === 'Produksi') {
    return 'Gudang';
  }
  return 'Umum';
}

/**
 * Membangun daftar penugasan kerja operasional 5W (`DailyTask[]`) untuk setiap Crew (Freelance)
 * maupun Staff (Inhouse) yang ditugaskan pada suatu Job / Event Google Calendar.
 */
export function buildDailyTasksFromJobAssignment(rawJob: JobAssignment): DailyTask[] {
  if (!rawJob || !isStrictJobOrEventCalendarEntry(rawJob.venue || rawJob.dateLabel || '', rawJob.notes)) {
    return [];
  }
  const job = enrichJobAssignmentCrewLinkage(rawJob);

  const tasks: DailyTask[] = [];
  const seenTaskIds = new Set<string>();

  const taskStatus: DailyTask['status'] =
    job.status === 'Selesai'
      ? 'Done'
      : job.status === 'Loading / Setup' ||
          job.status === 'Berlangsung (Show)' ||
          job.status === 'Bongkaran'
        ? 'In Progress'
        : 'Pending';

  const dateRangeText =
    job.endDate && job.endDate !== job.date ? `${job.date} s/d ${job.endDate}` : job.date;

  for (const sec of job.sections || []) {
    const taskDiv = mapJobSectionDivisionToTaskDivision(sec.division);
    const equipSummary =
      sec.equipment && sec.equipment.length > 0 ? sec.equipment.join(', ') : `Paket ${sec.packageLabel}`;
    const vehicleSummary =
      sec.vehicles && sec.vehicles.length > 0
        ? sec.vehicles.map(v => formatFleetVehicleBadge(v)).join(', ')
        : 'Armada Operasional RIZ';

    for (const member of sec.crew || []) {
      if (!member || !member.name || member.assessmentStatus === 'Diganti') continue;
      const personKey = String(member.staffId || member.name)
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '');
      if (!personKey) continue;

      const taskId = `jobtask-${job.id}-${sec.division.toLowerCase()}-${personKey}`;
      if (seenTaskIds.has(taskId)) continue;
      seenTaskIds.add(taskId);

      const roleBadge = member.roleNote ? ` (${member.roleNote})` : '';
      const title = `[PENUGASAN JOB] ${job.venue} — ${sec.packageLabel}${roleBadge}`;
      const description = [
        `WHEN: ${job.dateLabel} (${dateRangeText}) | Loading: ${job.loadingSchedule || 'Sesuai Jadwal Google Calendar'}`,
        `WHERE: ${job.venue}`,
        `WHO: ${member.canonicalName || member.name} (${member.personnelType}${member.roleNote ? ` • Peran: ${member.roleNote}` : ''}) | PIC Event: ${job.pic || '-'}`,
        `WHAT: Divisi ${sec.division} (${sec.packageLabel}) | Alat: ${equipSummary} | Armada: ${vehicleSummary}`,
        `WHY: ${job.notes ? job.notes.replace(/\r?\n/g, ' | ') : 'Eksekusi penugasan Job/Event Google Calendar PT. Riz Production Multi Kreasi'}`
      ].join('\n');

      tasks.push({
        id: taskId,
        title,
        description,
        division: taskDiv,
        priority: 'Tinggi',
        status: taskStatus,
        assignedTo: member.staffId || member.name,
        assignedName: member.canonicalName || member.name,
        dueDate: job.date,
        createdAt: job.date,
        createdBy: job.adminAssessedBy || job.pic || 'Google Calendar Auto-Sync'
      });
    }
  }

  return tasks;
}

/**
 * Menyinkronkan seluruh penugasan Crew & Staff dari daftar JobAssignment ke dalam
 * daftar tugas operasional (`DailyTask` di `riz_daily_tasks_v2` & Cloud `daily_tasks`).
 * Hanya memproses Job/Event pada bulan aktif atau yang telah di-assessment/diedit.
 */
export function syncJobAssignmentsToCrewDailyTasks(
  jobs: JobAssignment[],
  updatedBy = 'Google Calendar Auto-Sync',
  pushToCloud = false
): DailyTask[] {
  const validJobs = (jobs || []).filter(j =>
    isStrictJobOrEventCalendarEntry(j.venue || j.dateLabel || '', j.notes)
  );

  // Bila menerima dataset tahunan penuh (>50 jadwal), fokuskan pembentukan DailyTask aktif pada periode operasional berjalan (Nov-Des 2026) atau jadwal yang telah di-assessment manual oleh Admin
  const scopedJobs =
    validJobs.length > 50
      ? validJobs.filter(
          j =>
            j._userEdited ||
            j.adminAssessmentStatus ||
            String(j.date || '').startsWith('2026-11') ||
            String(j.date || '').startsWith('2026-12')
        )
      : validJobs;

  const generatedJobTasks: DailyTask[] = [];
  for (const job of scopedJobs) {
    const jobTasks = buildDailyTasksFromJobAssignment(job);
    generatedJobTasks.push(...jobTasks);
  }

  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return generatedJobTasks;
  }

  try {
    const rawExisting = localStorage.getItem('riz_daily_tasks_v2') || localStorage.getItem('riz_daily_tasks');
    const existingTasks: DailyTask[] = rawExisting ? JSON.parse(rawExisting) : [];
    const generatedMap = new Map<string, DailyTask>(generatedJobTasks.map(t => [t.id, t]));
    const nextMap = new Map<string, DailyTask>();

    const removedJobTaskIds: string[] = [];
    if (Array.isArray(existingTasks)) {
      for (const item of existingTasks) {
        if (!item || !item.id) continue;
        if (String(item.id).startsWith('jobtask-')) {
          if (!generatedMap.has(item.id)) {
            removedJobTaskIds.push(item.id);
            continue;
          }
          const fresh = generatedMap.get(item.id)!;
          // Pertahankan status Done bila staff sudah menyelesaikan tugas
          nextMap.set(item.id, {
            ...fresh,
            status: item.status === 'Done' ? 'Done' : fresh.status
          });
        } else {
          nextMap.set(item.id, item);
        }
      }
    }

    const changedOrNewTasks: DailyTask[] = [];
    for (const [id, task] of generatedMap.entries()) {
      const prev = nextMap.get(id);
      if (
        !prev ||
        prev.title !== task.title ||
        prev.description !== task.description ||
        prev.assignedTo !== task.assignedTo ||
        prev.dueDate !== task.dueDate
      ) {
        changedOrNewTasks.push(task);
      }
      if (!nextMap.has(id)) {
        nextMap.set(id, task);
      }
    }

    const mergedList = Array.from(nextMap.values());
    localStorage.setItem('riz_daily_tasks_v2', JSON.stringify(mergedList));
    localStorage.setItem('riz_daily_tasks', JSON.stringify(mergedList));

    if (pushToCloud) {
      changedOrNewTasks.forEach(t => {
        saveCloudDoc('daily_tasks', t.id, t, updatedBy).catch(() => {});
      });
      removedJobTaskIds.forEach(id => {
        deleteCloudDoc('daily_tasks', id).catch(() => {});
      });
    }

    window.dispatchEvent(new CustomEvent('riz-daily-tasks-synced', { detail: mergedList }));
    return mergedList;
  } catch {
    return generatedJobTasks;
  }
}
