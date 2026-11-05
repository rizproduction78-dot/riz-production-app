import React, { useState, useEffect, useRef } from 'react';
import {
  Staff,
  Asset,
  AttendanceLog,
  WorkSchedule,
  JobAssignment,
  JobCrewMember,
  JobDivisionSection,
  OFFICIAL_GOOGLE_DRIVE_EVIDENCE_FOLDER_URL,
  OFFICIAL_GOOGLE_DRIVE_ATTENDANCE_FOLDER_URL,
  OFFICIAL_GOOGLE_CALENDAR_WEB_URL,
  OFFICIAL_ARMADA_SPREADSHEET_URL,
  OFFICIAL_COMPANY_ADDRESS,
  OFFICIAL_COMPANY_PLUS_CODE,
  OFFICIAL_COMPANY_GPS_COORDINATES,
  OFFICIAL_COMPANY_GOOGLE_MAPS_URL
} from '../types';
import {
  STAFF_LIST,
  getMasterStaffList,
  INITIAL_ASSETS,
  normalizeAssetsMaster,
  getInventoryAssetTypeInfo,
  INITIAL_JOB_ASSIGNMENTS,
  OFFICIAL_FREELANCE_CREW_LIST,
  resolveCrewMember,
  buildCrewList,
  formatFleetVehicleBadge,
  normalizeJobAssignmentsMaster
} from '../data';
import {
  SHIFT_LEGEND,
  SCHEDULE_NOTE,
  StaffScheduleRow,
  ALL_MONTHLY_SCHEDULES,
  getScheduleByKey,
  generateMonthDays,
  getActiveMonthKey
} from '../data/staffSchedules';
import {
  Calendar,
  Clock,
  MapPin,
  Camera,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  Check,
  Edit,
  CheckCircle,
  Search,
  User,
  Zap,
  Award,
  BookOpen,
  CheckSquare,
  Square,
  ThumbsUp,
  HelpCircle,
  Wrench,
  Plus,
  Trash2,
  Printer,
  X,
  Truck,
  Package,
  Briefcase,
  Users,
  ExternalLink,
  ShieldCheck,
  ClipboardList
} from 'lucide-react';
import { subscribeCloudCollection, saveCloudDoc, deleteCloudDoc, pushCollectionToCloud } from '../lib/cloudSync';
import {
  OFFICIAL_GOOGLE_CALENDAR_ID,
  OFFICIAL_GOOGLE_CALENDAR_IMPORT_URL,
  OFFICIAL_GOOGLE_CALENDAR_EMBED_URL,
  GoogleCalendarConnectionConfig,
  getGoogleCalendarSyncConfig,
  saveGoogleCalendarSyncConfig,
  buildGoogleCalendarEventUrl,
  buildGoogleCalendarSectionEventUrl,
  downloadJobAssignmentsIcs,
  parseGoogleCalendarIcsToJobAssignments,
  pushJobAssignmentToGoogleCalendarLive,
  syncAllJobAssignmentsToGoogleCalendar,
  pullJobAssignmentsFromGoogleCalendarLive
} from '../lib/googleCalendarSync';
import {
  startUniversalCameraStream,
  captureSnapshotFromVideo
} from '../lib/universalBarcodeScanner';

export const WAJIB_ABSEN_NAMES = [
  'Agus', 'Fahrul', 'Caca', 'Seno',
  'Mboh', 'Unyim', 'Dani', 'Butonk', 'Yudish', 'Opik', 'Buluk',
  'Heri',
  'Jay',
  'Ayong', 'Wigi', 'Irfan',
  'Mang Damri', 'Kharo',
  'Mang ube', 'Gatot', 'Abah Subur'
];

export const isWajibAbsen = (name: string) => {
  const normalized = name.toLowerCase().trim();
  if (normalized.includes('wahyu (owner)') || normalized === 'wahyu') return false;
  return true; // Semua staff, admin, team leader, dan staff gudang wajib absen kecuali Wahyu
};

export const ELECTRICAL_COMPETENCIES = [
  {
    key: 'comp_safety',
    title: 'AC/DC Safety & K3 Kelistrikan',
    desc: 'Pemahaman keselamatan kerja listrik, pertolongan pertama sengatan, pencegahan hubungan pendek, dan pemakaian alat pelindung diri (sarung tangan/sepatu isolasi).',
    iconName: 'Safety'
  },
  {
    key: 'comp_multimeter',
    title: 'Pengukuran dengan Multimeter',
    desc: 'Bisa mengukur voltase AC/DC, kontinuitas kabel (buzzer test), serta tahanan hambatan (ohm) sirkuit secara akurat tanpa merusak multimeter.',
    iconName: 'Multimeter'
  },
  {
    key: 'comp_soldering',
    title: 'Solder & Perakitan Konektor',
    desc: 'Mahir menyolder konektor standar event (XLR, Speakon, Powercon, RJ45) dengan rapi, matang, dan tanpa ada serabut hubung singkat (short).',
    iconName: 'Solder'
  },
  {
    key: 'comp_phase_load',
    title: 'Kalkulasi Beban & Phase Listrik',
    desc: 'Paham pembagian phase seimbang (R-S-T) genset, menghitung kebutuhan beban daya (Watt = Volt x Ampere) untuk mencegah MCB trip/overload.',
    iconName: 'Phase'
  },
  {
    key: 'comp_grounding',
    title: 'Grounding & Deteksi Arus Bocor',
    desc: 'Mampu memasang grounding pasak tanah, mengukur tegangan ground-to-neutral (< 2V), dan mengatasi kebocoran listrik bodi mixer/mic/lighting.',
    iconName: 'Grounding'
  },
  {
    key: 'comp_troubleshoot',
    title: 'Troubleshooting Korsleting & Fuse',
    desc: 'Cepat mengisolasi jalur kabel/alat yang korslet dan melakukan penggantian sekring/fuse pengaman sirkuit sesuai rating ampere.',
    iconName: 'Troubleshoot'
  }
];

export const QUIZ_QUESTIONS = [
  {
    question: 'Jika sebuah sistem audio atau lighting membutuhkan total daya sebesar 4.400 Watt pada tegangan listrik standar Indonesia yaitu 220 Volt, berapa kapasitas MCB (ampere) minimum yang harus kita gunakan untuk memproteksi sirkuit tersebut?',
    options: [
      'A. 6 Ampere',
      'B. 10 Ampere',
      'C. 20 Ampere',
      'D. 32 Ampere'
    ],
    correctIndex: 2, // 20 Ampere
    explanation: 'Sesuai hukum Ohm, Daya (P) = Volt (V) x Arus (I). Maka Arus (I) = 4400W / 220V = 20 Ampere. MCB minimum yang harus digunakan adalah 20 Ampere.'
  },
  {
    question: 'Apa indikasi utama jika kabel grounding (pentanahan) pada peralatan sound system panggung tidak terpasang dengan baik atau terputus?',
    options: [
      'A. Layar mixer digital tidak mau menyala sama sekali',
      'B. Terasa sengatan listrik / nyetrum saat memegang body mixer besi atau microphone logam, serta suara dengung (humming) keras di speaker',
      'C. Lampu lampu panggung mati mendadak',
      'D. Genset akan langsung overload dan trip otomatis'
    ],
    correctIndex: 1, // Terasa sengatan listrik
    explanation: 'Fungsi grounding adalah membuang arus bocor ke tanah. Jika grounding putus, bodi peralatan logam akan mengalirkan listrik statis yang terasa menyengat saat disentuh dan menimbulkan interferensi suara dengung (hum).'
  },
  {
    question: 'Dalam kelistrikan 3-Phase genset event, jika beban ditarik sangat tidak seimbang (misal Phase R = 60A, Phase S = 55A, sedangkan Phase T hanya 2A), risiko fatal apa yang paling membahayakan peralatan elektronik sensitif?',
    options: [
      'A. Tegangan di semua phase akan turun ke 0 Volt',
      'B. Terjadi ketidakseimbangan beban yang mengakibatkan munculnya tegangan tinggi pada jalur Netral (kebocoran Netral) yang bisa merusak mixer digital atau LED screen',
      'C. Frekuensi listrik akan melonjak tinggi dari 50 Hz ke 200 Hz',
      'D. Seluruh lampu panggung akan berubah warna secara acak'
    ],
    correctIndex: 1, // Netral bocor
    explanation: 'Ketidakseimbangan beban ekstrem pada sistem 3-Phase dapat menyebabkan pergeseran titik netral (neutral drift), menghasilkan tegangan netral-ke-ground yang tinggi dan merusak komponen mikroprosesor sensitif seperti mixer, laptop, dan kontroler.'
  },
  {
    question: 'Saat ingin memeriksa kontinuitas kabel (apakah kabel serabut di dalam terluka, putus, atau korslet) menggunakan Multimeter digital, ke arah posisi saklar selektor mana yang paling tepat diarahkan?',
    options: [
      'A. AC Voltage (V~)',
      'B. DC Amperage (A=)',
      'C. Diode / Buzzer (Continuity/Sound)',
      'D. Kilo Ohm (kΩ) skala besar'
    ],
    correctIndex: 2, // Diode / Buzzer
    explanation: 'Mode Diode/Buzzer (Continuity) pada multimeter akan mengeluarkan suara beep nyaring jika sirkuit terhubung (kontinu). Ini adalah cara tercepat mengecek kabel putus atau korsleting antar-pin.'
  },
  {
    question: 'Berdasarkan standar warna kabel PUIL terbaru di Indonesia, apa penugasan warna kabel yang benar untuk fasa Line (L), Neutral (N), dan Ground (G)?',
    options: [
      'A. Line = Biru, Neutral = Hitam, Ground = Hijau-Kuning',
      'B. Line = Cokelat/Hitam/Abu, Neutral = Biru, Ground = Hijau-Kuning',
      'C. Line = Merah, Neutral = Hijau, Ground = Hitam',
      'D. Line = Kuning, Neutral = Merah, Ground = Biru'
    ],
    correctIndex: 1, // Line = Cokelat/Hitam/Abu, Neutral = Biru, Ground = Hijau-Kuning
    explanation: 'Berdasarkan aturan PUIL, kabel Fasa (Line) diberi warna Cokelat, Hitam, atau Abu-abu; kabel Netral selalu berwarna Biru; dan kabel Grounding (Earth) wajib bermotif Hijau-Kuning.'
  }
];

export const getInitialCompetencyData = () => {
  const data: { [staffId: string]: { [compKey: string]: { verified: boolean; verifiedBy?: string; dateVerified?: string } } } = {};

  // RESET TOTAL SEMUA STAFF KE 0% (BELUM LULUS / UNVERIFIED)
  getMasterStaffList().forEach(staff => {
    data[staff.id] = {
      comp_safety: { verified: false },
      comp_multimeter: { verified: false },
      comp_soldering: { verified: false },
      comp_phase_load: { verified: false },
      comp_grounding: { verified: false },
      comp_troubleshoot: { verified: false }
    };
  });

  return data;
};

interface AbsensiProps {
  currentUser: Staff;
  onLogActivity: (username: string, role: string, action: string) => void;
  forceSubTab?: 'self' | 'schedule' | 'progress' | 'maintenance_dashboard';
  initialScheduleViewMode?: 'official' | 'job_assignments' | 'custom';
  activeMonth?: string;
  onActiveMonthChange?: (monthKey: string) => void;
  scheduleData?: StaffScheduleRow[];
}

export default function Absensi({ currentUser, onLogActivity, forceSubTab, initialScheduleViewMode, activeMonth: propActiveMonth = getActiveMonthKey(), onActiveMonthChange, scheduleData: propScheduleData }: AbsensiProps) {
  const activeMonth = propActiveMonth === 'all' ? getActiveMonthKey() : propActiveMonth;
  const [scheduleData, setScheduleData] = useState<StaffScheduleRow[]>(() => {
    if (propScheduleData && propScheduleData.length > 0) return propScheduleData;
    try {
      const saved = localStorage.getItem(`riz_schedule_${activeMonth}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { }
    return getScheduleByKey(activeMonth)?.rows || [];
  });

  useEffect(() => {
    if (propScheduleData && propScheduleData.length > 0) {
      setScheduleData(propScheduleData);
      return;
    }
    const fallbackRows = getScheduleByKey(activeMonth)?.rows || [];
    const unsubSched = subscribeCloudCollection<any>(
      `schedule_${activeMonth}`,
      `riz_schedule_${activeMonth}`,
      (data) => {
        if (data && data.length > 0) {
          const flatItems = data.flatMap((item: any) => (item && Array.isArray(item.list) ? item.list : item));
          const validItems = flatItems.filter((i: any) => i && typeof i === 'object' && i.no);
          if (validItems.length > 0) {
            validItems.sort((a: any, b: any) => (a.no || 0) - (b.no || 0));
            setScheduleData(validItems);
            return;
          }
        }
        setScheduleData(fallbackRows);
      },
      fallbackRows
    );
    return () => unsubSched();
  }, [activeMonth, propScheduleData]);
  // Tabs: 'self' (Check In/Out), 'schedule' (1-31 Scheduling Grid), 'progress' (Kenaikan Status & Kelistrikan), or 'maintenance_dashboard'
  const [activeSubTab, setActiveSubTab] = useState<'self' | 'schedule' | 'progress' | 'maintenance_dashboard'>(
    forceSubTab || 'self'
  );

  // Dynamic Master Staff State with Cloud Subscription
  const [staffList, setStaffList] = useState<Staff[]>(() => getMasterStaffList());

  useEffect(() => {
    const unsub = subscribeCloudCollection<Staff>(
      'master_staff',
      'riz_master_staff_list',
      setStaffList,
      STAFF_LIST
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    if (forceSubTab) {
      setActiveSubTab(forceSubTab);
    }
  }, [forceSubTab]);

  // Maintenance & Repair states - Bersih dari data dummy
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<any[]>(() => {
    const saved = localStorage.getItem('riz_schedules');
    if (saved) {
      try {
        const parsed: any[] = JSON.parse(saved);
        const cleaned = parsed.filter(s => !['ms-1', 'ms-2', 'ms-3'].includes(s.id));
        if (cleaned.length !== parsed.length) {
          localStorage.setItem('riz_schedules', JSON.stringify(cleaned));
        }
        return cleaned;
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [localWorkOrders, setLocalWorkOrders] = useState<any[]>(() => {
    const saved = localStorage.getItem('riz_work_orders_v2') || localStorage.getItem('riz_work_orders');
    if (saved) {
      try {
        const parsed: any[] = JSON.parse(saved);
        const cleaned = parsed.filter(w => !['wo-1', 'wo-2', 'wo-3', 'wo-4'].includes(w.id));
        if (cleaned.length !== parsed.length) {
          localStorage.setItem('riz_work_orders_v2', JSON.stringify(cleaned));
          localStorage.setItem('riz_work_orders', JSON.stringify(cleaned));
        }
        return cleaned;
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [maintenanceSearch, setMaintenanceSearch] = useState('');
  const [maintenanceFilterDivision, setMaintenanceFilterDivision] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // Add form fields
  const [newEquipName, setNewEquipName] = useState('');
  const [newEquipCode, setNewEquipCode] = useState('');
  const [newType, setNewType] = useState<'Routine' | 'SelfRepair' | 'Service'>('Routine');
  const [newDesc, setNewDesc] = useState('');
  const [newPic, setNewPic] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newPriority, setNewPriority] = useState<'Tinggi' | 'Sedang' | 'Rendah'>('Sedang');

  // Electrical Competencies State - RESET ALL STAFF TO 0%
  const [electricalCompetencies, setElectricalCompetencies] = useState<{ [staffId: string]: { [compKey: string]: { verified: boolean; verifiedBy?: string; dateVerified?: string } } }>(() => {
    const isReset = localStorage.getItem('riz_staff_competencies_reset_all_zero_v3');
    if (!isReset) {
      localStorage.setItem('riz_staff_competencies_reset_all_zero_v3', 'true');
      const cleanData = getInitialCompetencyData();
      localStorage.setItem('riz_staff_electrical_competencies', JSON.stringify(cleanData));
      return cleanData;
    }
    const saved = localStorage.getItem('riz_staff_electrical_competencies');
    return saved ? JSON.parse(saved) : getInitialCompetencyData();
  });

  // Handler to reset all staff competencies to 0%
  const handleResetAllCompetencies = () => {
    if (currentUser.role !== 'Admin' && currentUser.role !== 'Supervisor' && currentUser.role !== 'Manager') {
      alert('Hanya Admin atau Supervisor yang memiliki hak akses mereset kompetensi seluruh staff.');
      return;
    }

    if (window.confirm('PERINGATAN RESMI:\nApakah Anda yakin ingin MERESET SEMUA HASIL KOMPETENSI STAFF ke 0%?\n\nSemua verifikasi kelayakan, status sertifikasi, dan centang uji kompetensi seluruh staff divisi akan dikosongkan kembali ke awal (0%).')) {
      const cleanData = getInitialCompetencyData();
      setElectricalCompetencies(cleanData);
      localStorage.setItem('riz_staff_electrical_competencies', JSON.stringify(cleanData));
      onLogActivity(currentUser.name, currentUser.role, 'Admin / Supervisor melakukan RESET TOTAL seluruh hasil kompetensi staff ke 0% (Clean Slate)');
      alert('Berhasil! Seluruh hasil kompetensi staff telah di-reset ke 0%.');
    }
  };

  // Competency Progress tracking states
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [progressSearch, setProgressSearch] = useState('');
  const [progressFilterDivision, setProgressFilterDivision] = useState<string>('All');

  // Quiz interactive states
  const [quizActive, setQuizActive] = useState(false);
  const [quizCurrentIndex, setQuizCurrentIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Attendance Logs State
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(() => {
    const saved = localStorage.getItem('riz_attendance_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Current Month Schedule State
  const [schedule, setSchedule] = useState<WorkSchedule | null>(() => {
    const saved = localStorage.getItem('riz_work_schedule');
    return saved ? JSON.parse(saved) : null;
  });

  // Official Schedule State
  const [scheduleViewMode, setScheduleViewMode] = useState<'official' | 'job_assignments' | 'custom'>(
    initialScheduleViewMode || 'official'
  );
  const [divisionFilter, setDivisionFilter] = useState<string>('All');

  // Job Assignments State (Staff & Freelance Event / Job Schedule — Synced from Google Calendar rizproduction78@gmail.com)
  const [jobAssignments, setJobAssignments] = useState<JobAssignment[]>(() => {
    try {
      const saved = localStorage.getItem('riz_job_assignments_gcal_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return normalizeJobAssignmentsMaster(parsed);
        }
      }
    } catch {}
    return INITIAL_JOB_ASSIGNMENTS;
  });
  const isManagementOrOwner =
    currentUser.division === 'Admin' ||
    currentUser.role === 'Owner' ||
    currentUser.role === 'Direktur' ||
    currentUser.role === 'Manager' ||
    currentUser.role === 'Admin' ||
    currentUser.role === 'Supervisor' ||
    currentUser.id === 'director-wahyu';

  const [jobMonthFilter, setJobMonthFilter] = useState<string>(() => {
    if (activeMonth && /^2026-\d{2}$/.test(activeMonth)) return activeMonth;
    return '2026-11';
  });
  const [jobWeekFilter, setJobWeekFilter] = useState<'ALL' | 'W1' | 'W2' | 'W3' | 'W4' | 'W5'>('ALL');
  const [jobSelectedStaffId, setJobSelectedStaffId] = useState<string>(() =>
    isManagementOrOwner ? 'ALL' : currentUser.id
  );
  const [jobSelectedFreelanceName, setJobSelectedFreelanceName] = useState<string>('ALL');
  const [showFreelanceFilterPills, setShowFreelanceFilterPills] = useState<boolean>(false);
  const [jobDivisionFilter, setJobDivisionFilter] = useState<string>('All');
  const [jobCrewTypeFilter, setJobCrewTypeFilter] = useState<'All' | 'Staff' | 'Freelance'>('All');
  const [jobSearchQuery, setJobSearchQuery] = useState<string>('');

  // Master Inventory Assets state (133 Kelompok Aset Gudang Resmi)
  const [inventoryAssets, setInventoryAssets] = useState<Asset[]>(() => {
    try {
      const raw = localStorage.getItem('riz_assets');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return normalizeAssetsMaster(parsed);
        }
      }
    } catch {}
    return INITIAL_ASSETS;
  });

  // Inline Crew Picker / Editor state per Job Section (Admin)
  const [activeCrewPickerKey, setActiveCrewPickerKey] = useState<string | null>(null);
  const [crewPickerTab, setCrewPickerTab] = useState<'Staff' | 'Freelance'>('Staff');
  const [crewPickerSearch, setCrewPickerSearch] = useState<string>('');
  const [crewPickerRoleNote, setCrewPickerRoleNote] = useState<string>('');
  const [crewPickerCustomName, setCrewPickerCustomName] = useState<string>('');
  const [editingCrewBadgeKey, setEditingCrewBadgeKey] = useState<string | null>(null);
  const [editingCrewPersonName, setEditingCrewPersonName] = useState<string>('');
  const [editingCrewRoleNote, setEditingCrewRoleNote] = useState<string>('');
  const [editingCrewAssessmentStatus, setEditingCrewAssessmentStatus] = useState<
    NonNullable<JobCrewMember['assessmentStatus']>
  >('Approved');
  const [editingCrewAssessmentScore, setEditingCrewAssessmentScore] = useState<number>(5);
  const [editingCrewAssessmentNote, setEditingCrewAssessmentNote] = useState<string>('');
  const [editingPicJobId, setEditingPicJobId] = useState<string | null>(null);
  const [editingPicValue, setEditingPicValue] = useState<string>('');

  // Inline Equipment Picker (Inventory + Manual) & Editor state per Job Section (Admin)
  const [activeEquipPickerKey, setActiveEquipPickerKey] = useState<string | null>(null);
  const [equipPickerDivFilter, setEquipPickerDivFilter] = useState<'ALL' | 'Sound' | 'Lighting' | 'Multimedia' | 'Videotron'>('ALL');
  const [equipPickerSearch, setEquipPickerSearch] = useState<string>('');
  const [equipPickerQty, setEquipPickerQty] = useState<string>('');
  const [equipPickerManualText, setEquipPickerManualText] = useState<string>('');
  const [editingEquipBadgeKey, setEditingEquipBadgeKey] = useState<string | null>(null);
  const [editingEquipValue, setEditingEquipValue] = useState<string>('');
  const [editingEquipAssessmentStatus, setEditingEquipAssessmentStatus] = useState<
    'Sesuai Spek' | 'Perlu Penyesuaian' | 'Backup / Sub-Vendor' | 'Pending Cek'
  >('Sesuai Spek');
  const [editingEquipQtyVerified, setEditingEquipQtyVerified] = useState<string>('');
  const [editingEquipTechnicalNote, setEditingEquipTechnicalNote] = useState<string>('');

  // Admin Comprehensive Event Assessment Modal state (Unit Alat/Spek Teknis & Penugasan Staff/Freelance)
  const [assessmentModalJob, setAssessmentModalJob] = useState<JobAssignment | null>(null);
  const [assessmentModalAddEquipText, setAssessmentModalAddEquipText] = useState<Record<number, string>>({});
  const [assessmentModalAddCrewName, setAssessmentModalAddCrewName] = useState<Record<number, string>>({});
  const [assessmentModalAddCrewRole, setAssessmentModalAddCrewRole] = useState<Record<number, string>>({});

  // Modal Equipment Picker (Inventory + Manual) state
  const [modalEquipDivFilter, setModalEquipDivFilter] = useState<'ALL' | 'Sound' | 'Lighting' | 'Multimedia' | 'Videotron'>('ALL');
  const [modalEquipSearch, setModalEquipSearch] = useState<string>('');
  const [modalEquipQty, setModalEquipQty] = useState<string>('');
  const [modalEquipManualInput, setModalEquipManualInput] = useState<string>('');

  // Quick-Schedule Selected Staff/Freelance to an existing Job
  const [quickAssignJobId, setQuickAssignJobId] = useState<string>('');
  const [quickAssignSectionIdx, setQuickAssignSectionIdx] = useState<number>(0);
  const [quickAssignRoleNote, setQuickAssignRoleNote] = useState<string>('');

  useEffect(() => {
    setJobSelectedStaffId(isManagementOrOwner ? 'ALL' : currentUser.id);
    setJobSelectedFreelanceName('ALL');
    setJobWeekFilter('ALL');
  }, [currentUser.id, isManagementOrOwner]);

  useEffect(() => {
    if (initialScheduleViewMode) {
      setScheduleViewMode(initialScheduleViewMode);
    }
  }, [initialScheduleViewMode]);
  const [showJobFormModal, setShowJobFormModal] = useState<boolean>(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobFormDate, setJobFormDate] = useState<string>('2026-11-05');
  const [jobFormDateLabel, setJobFormDateLabel] = useState<string>('');
  const [jobFormVenue, setJobFormVenue] = useState<string>('');
  const [jobFormLoadingSchedule, setJobFormLoadingSchedule] = useState<string>('');
  const [jobFormPic, setJobFormPic] = useState<string>('');
  const [jobFormStatus, setJobFormStatus] = useState<JobAssignment['status']>('Terjadwal');
  const [jobFormNotes, setJobFormNotes] = useState<string>('');
  const [jobFormSectionIdx, setJobFormSectionIdx] = useState<number>(0);
  const [jobFormSectionsDraft, setJobFormSectionsDraft] = useState<JobDivisionSection[]>([]);
  const [jobFormDivision, setJobFormDivision] = useState<JobDivisionSection['division']>('Audio');
  const [jobFormPackageLabel, setJobFormPackageLabel] = useState<string>('');
  const [jobFormEquipmentText, setJobFormEquipmentText] = useState<string>('');
  const [jobFormCrewText, setJobFormCrewText] = useState<string>('');
  const [jobFormVehiclesText, setJobFormVehiclesText] = useState<string>('');
  const [jobFormOpenGcalOnSave, setJobFormOpenGcalOnSave] = useState<boolean>(true);

  // Google Calendar Live Connection & Interactive Calendar Grid states
  const [gcalConfig, setGcalConfig] = useState<GoogleCalendarConnectionConfig>(() =>
    getGoogleCalendarSyncConfig()
  );
  const [showGcalSyncPanel, setShowGcalSyncPanel] = useState<boolean>(false);
  const [showGcalVisualCalendar, setShowGcalVisualCalendar] = useState<boolean>(false);
  const [isSyncingGcal, setIsSyncingGcal] = useState<boolean>(false);
  const [gcalSyncFeedback, setGcalSyncFeedback] = useState<{
    type: 'success' | 'info' | 'warning';
    text: string;
    importUrl?: string;
  } | null>(null);

  useEffect(() => {
    if (activeMonth && /^2026-\d{2}$/.test(activeMonth)) {
      setJobMonthFilter(activeMonth);
    }
  }, [activeMonth]);

  useEffect(() => {
    const unsubJobs = subscribeCloudCollection<JobAssignment>(
      'job_assignments_gcal',
      'riz_job_assignments_gcal_v2',
      (data) => {
        if (Array.isArray(data) && data.length > 0) {
          setJobAssignments(normalizeJobAssignmentsMaster(data));
        } else {
          setJobAssignments(INITIAL_JOB_ASSIGNMENTS);
        }
      },
      INITIAL_JOB_ASSIGNMENTS
    );
    const unsubAssets = subscribeCloudCollection<Asset>(
      'assets',
      'riz_assets',
      (data) => {
        if (Array.isArray(data) && data.length > 0) {
          setInventoryAssets(normalizeAssetsMaster(data));
        } else {
          setInventoryAssets(INITIAL_ASSETS);
        }
      },
      INITIAL_ASSETS
    );
    return () => {
      unsubJobs();
      unsubAssets();
    };
  }, []);

  const canManageJobSchedule =
    isManagementOrOwner ||
    currentUser.division === 'Admin' ||
    currentUser.role === 'Staff Admin' ||
    currentUser.role === 'Owner' ||
    currentUser.role === 'Direktur' ||
    currentUser.role === 'Manager' ||
    currentUser.role === 'Admin' ||
    currentUser.role === 'Supervisor' ||
    currentUser.role === 'Team Leader' ||
    currentUser.role === 'Staff Leader';

  const persistUpdatedJobAssignment = (updatedJob: JobAssignment, activityMessage?: string) => {
    const nowIso = new Date().toISOString();
    const finalJob: JobAssignment & { _userEdited?: boolean } = {
      ...updatedJob,
      gcalSynced: true,
      gcalLastSyncedAt: nowIso,
      _userEdited: true
    };
    setJobAssignments(prev => {
      const exists = prev.some(j => j.id === finalJob.id);
      const next = exists ? prev.map(j => (j.id === finalJob.id ? finalJob : j)) : [finalJob, ...prev];
      const sorted = normalizeJobAssignmentsMaster(next);
      try {
        localStorage.setItem('riz_job_assignments_gcal_v2', JSON.stringify(sorted));
      } catch {}
      const nextCfg = saveGoogleCalendarSyncConfig({
        lastSyncedAt: nowIso,
        lastSyncCount: sorted.length
      });
      setGcalConfig(nextCfg);
      return sorted;
    });
    saveCloudDoc('job_assignments_gcal', finalJob.id, finalJob, currentUser.name);
    if (gcalConfig.autoSyncOnSave) {
      pushJobAssignmentToGoogleCalendarLive(finalJob, gcalConfig).catch(() => {});
    }
    if (activityMessage) {
      onLogActivity(currentUser.name, currentUser.role, activityMessage);
    }
  };

  const handleToggleCrewInJobSection = (
    job: JobAssignment,
    sectionIdx: number,
    personDisplayName: string,
    roleNoteInput?: string
  ) => {
    const sec = job.sections[sectionIdx];
    if (!sec) return;
    const resolved = resolveCrewMember(
      personDisplayName,
      sec.division,
      roleNoteInput?.trim() || undefined
    );
    const existingIndex = sec.crew.findIndex(c => {
      if (resolved.staffId && c.staffId && c.staffId === resolved.staffId) return true;
      return c.name.toLowerCase().trim() === resolved.name.toLowerCase().trim();
    });

    let nextCrew: JobCrewMember[];
    let actionLabel: string;
    if (existingIndex >= 0) {
      nextCrew = sec.crew.filter((_, idx) => idx !== existingIndex);
      actionLabel = `Menghapus ${resolved.name} dari jadwal ${job.dateLabel} (${sec.division})`;
    } else {
      nextCrew = [
        ...sec.crew,
        {
          ...resolved,
          assessmentStatus: 'Approved',
          assessmentScore: 5,
          assessedBy: currentUser.name,
          assessedAt: new Date().toISOString()
        }
      ];
      actionLabel = `Menjadwalkan & verifikasi ${resolved.name} (${resolved.personnelType}) ke ${job.dateLabel} (${sec.division})`;
    }

    const nextSections = job.sections.map((s, idx) =>
      idx === sectionIdx ? { ...s, crew: nextCrew } : s
    );
    persistUpdatedJobAssignment({ ...job, sections: nextSections }, actionLabel);
  };

  const handleRemoveCrewFromSection = (job: JobAssignment, sectionIdx: number, memberIdx: number) => {
    const sec = job.sections[sectionIdx];
    if (!sec) return;
    const targetMember = sec.crew[memberIdx];
    const nextCrew = sec.crew.filter((_, idx) => idx !== memberIdx);
    const nextSections = job.sections.map((s, idx) =>
      idx === sectionIdx ? { ...s, crew: nextCrew } : s
    );
    persistUpdatedJobAssignment(
      { ...job, sections: nextSections },
      `Menghapus ${targetMember?.name || 'Personil'} dari jadwal ${job.dateLabel} (${sec.division})`
    );
  };

  const handleUpdateCrewMemberInSection = (
    job: JobAssignment,
    sectionIdx: number,
    memberIdx: number,
    nextPersonName: string,
    nextRoleNote: string,
    assessmentStatusInput?: JobCrewMember['assessmentStatus'],
    assessmentScoreInput?: number,
    assessmentNoteInput?: string
  ) => {
    const sec = job.sections[sectionIdx];
    if (!sec || !nextPersonName.trim()) return;
    const prevMember = sec.crew[memberIdx];
    const resolved = resolveCrewMember(
      nextPersonName.trim(),
      sec.division,
      nextRoleNote.trim() || undefined
    );
    const updatedMember: JobCrewMember = {
      ...prevMember,
      ...resolved,
      assessmentStatus: assessmentStatusInput || prevMember?.assessmentStatus || 'Approved',
      assessmentScore: assessmentScoreInput ?? prevMember?.assessmentScore ?? 5,
      assessmentNote:
        assessmentNoteInput !== undefined
          ? assessmentNoteInput.trim() || undefined
          : prevMember?.assessmentNote,
      assessedBy: currentUser.name,
      assessedAt: new Date().toISOString()
    };
    const nextCrew = sec.crew.map((c, idx) => (idx === memberIdx ? updatedMember : c));
    const nextSections = job.sections.map((s, idx) =>
      idx === sectionIdx ? { ...s, crew: nextCrew } : s
    );
    persistUpdatedJobAssignment(
      { ...job, sections: nextSections },
      `Assessment & update personil ${updatedMember.name} (${updatedMember.personnelType} • ${updatedMember.assessmentStatus}) pada jadwal ${job.dateLabel} (${sec.division})`
    );
    setEditingCrewBadgeKey(null);
  };

  const handleUpdateJobPic = (job: JobAssignment, nextPic: string) => {
    if (!nextPic.trim()) return;
    persistUpdatedJobAssignment(
      { ...job, pic: nextPic.trim() },
      `Mengubah PIC Jadwal "${job.dateLabel}" menjadi ${nextPic.trim()}`
    );
    setEditingPicJobId(null);
  };

  const mapSectionDivToAssetDiv = (
    div: JobDivisionSection['division'] | undefined
  ): 'ALL' | 'Sound' | 'Lighting' | 'Multimedia' | 'Videotron' => {
    if (div === 'Audio') return 'Sound';
    if (div === 'Lighting') return 'Lighting';
    if (div === 'Multimedia') return 'Multimedia';
    if (div === 'Videotron') return 'Videotron';
    return 'ALL';
  };

  const getBaseInventoryAssetName = (assetName: string): string => {
    return assetName.replace(/\s*\(\d+[^)]*\)\s*$/, '').trim();
  };

  const formatInventoryEquipmentLabel = (asset: Asset, customQty?: string): string => {
    const cleanQty = (customQty || '').trim();
    if (!cleanQty) return asset.name;
    const baseName = getBaseInventoryAssetName(asset.name);
    const formattedQty = /^\d+$/.test(cleanQty) ? `${cleanQty} Unit` : cleanQty;
    return `${baseName} (${formattedQty})`;
  };

  const findMatchingAssetIndexInEquipment = (asset: Asset, equipmentList: string[]): number => {
    const fullLower = asset.name.toLowerCase().trim();
    const baseLower = getBaseInventoryAssetName(asset.name).toLowerCase();
    return equipmentList.findIndex(item => {
      const itemLower = item.toLowerCase().trim();
      const itemBaseLower = getBaseInventoryAssetName(item).toLowerCase();
      return itemLower === fullLower || (baseLower.length > 0 && itemBaseLower === baseLower);
    });
  };

  const handleToggleInventoryAssetInSection = (
    job: JobAssignment,
    sectionIdx: number,
    asset: Asset,
    customQty?: string
  ) => {
    const sec = job.sections[sectionIdx];
    if (!sec) return;
    const formattedLabel = formatInventoryEquipmentLabel(asset, customQty);
    const existingIdx = findMatchingAssetIndexInEquipment(asset, sec.equipment);
    const hasCustomQty = Boolean(customQty && customQty.trim());

    let nextEquipment: string[];
    let actionLabel: string;
    if (existingIdx >= 0) {
      if (hasCustomQty && sec.equipment[existingIdx] !== formattedLabel) {
        nextEquipment = sec.equipment.map((eq, i) => (i === existingIdx ? formattedLabel : eq));
        actionLabel = `Memperbarui unit alat inventory "${formattedLabel}" pada jadwal ${job.dateLabel} (${sec.division})`;
      } else {
        nextEquipment = sec.equipment.filter((_, i) => i !== existingIdx);
        actionLabel = `Menghapus unit alat "${sec.equipment[existingIdx]}" dari jadwal ${job.dateLabel} (${sec.division})`;
      }
    } else {
      nextEquipment = [...sec.equipment, formattedLabel];
      actionLabel = `Menambahkan unit alat inventory "${formattedLabel}" ke jadwal ${job.dateLabel} (${sec.division})`;
    }

    const nextSections = job.sections.map((s, idx) =>
      idx === sectionIdx ? { ...s, equipment: nextEquipment } : s
    );
    persistUpdatedJobAssignment({ ...job, sections: nextSections }, actionLabel);
  };

  const handleAddManualEquipmentToSection = (
    job: JobAssignment,
    sectionIdx: number,
    manualInput: string
  ) => {
    const sec = job.sections[sectionIdx];
    const cleanedItems = manualInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    if (!sec || cleanedItems.length === 0) return;

    const nextEquipment = [...sec.equipment, ...cleanedItems];
    const nextSections = job.sections.map((s, idx) =>
      idx === sectionIdx ? { ...s, equipment: nextEquipment } : s
    );
    persistUpdatedJobAssignment(
      { ...job, sections: nextSections },
      `Menambahkan unit alat manual "${cleanedItems.join(', ')}" ke jadwal ${job.dateLabel} (${sec.division})`
    );
  };

  const handleRemoveEquipmentFromSection = (
    job: JobAssignment,
    sectionIdx: number,
    eqIdx: number
  ) => {
    const sec = job.sections[sectionIdx];
    if (!sec) return;
    const removedItem = sec.equipment[eqIdx];
    const nextEquipment = sec.equipment.filter((_, idx) => idx !== eqIdx);
    const nextSections = job.sections.map((s, idx) =>
      idx === sectionIdx ? { ...s, equipment: nextEquipment } : s
    );
    persistUpdatedJobAssignment(
      { ...job, sections: nextSections },
      `Menghapus unit alat "${removedItem || 'Alat'}" dari jadwal ${job.dateLabel} (${sec.division})`
    );
  };

  const handleUpdateEquipmentInSection = (
    job: JobAssignment,
    sectionIdx: number,
    eqIdx: number,
    nextValue: string,
    assessmentStatusInput?: 'Sesuai Spek' | 'Perlu Penyesuaian' | 'Backup / Sub-Vendor' | 'Pending Cek',
    qtyVerifiedInput?: string,
    technicalNoteInput?: string
  ) => {
    const sec = job.sections[sectionIdx];
    const trimmed = nextValue.trim();
    if (!sec || !trimmed) return;
    const prevLabel = sec.equipment[eqIdx];
    const nextEquipment = sec.equipment.map((eq, idx) => (idx === eqIdx ? trimmed : eq));
    const prevAssessMap = { ...(sec.equipmentAssessments || {}) };
    const existingAssess = prevAssessMap[prevLabel] || prevAssessMap[trimmed];
    if (prevLabel && prevLabel !== trimmed) {
      delete prevAssessMap[prevLabel];
    }
    prevAssessMap[trimmed] = {
      itemLabel: trimmed,
      status: assessmentStatusInput || existingAssess?.status || 'Sesuai Spek',
      qtyVerified:
        qtyVerifiedInput !== undefined
          ? qtyVerifiedInput.trim() || undefined
          : existingAssess?.qtyVerified,
      technicalNote:
        technicalNoteInput !== undefined
          ? technicalNoteInput.trim() || undefined
          : existingAssess?.technicalNote,
      assessedBy: currentUser.name,
      assessedAt: new Date().toISOString()
    };

    const nextSections = job.sections.map((s, idx) =>
      idx === sectionIdx
        ? { ...s, equipment: nextEquipment, equipmentAssessments: prevAssessMap }
        : s
    );
    persistUpdatedJobAssignment(
      { ...job, sections: nextSections },
      `Assessment & update unit alat "${trimmed}" (${prevAssessMap[trimmed].status}) pada jadwal ${job.dateLabel} (${sec.division})`
    );
    setEditingEquipBadgeKey(null);
  };

  const handleCycleEquipmentAssessmentStatus = (
    job: JobAssignment,
    sectionIdx: number,
    eqLabel: string
  ) => {
    const sec = job.sections[sectionIdx];
    if (!sec) return;
    const prevMap = { ...(sec.equipmentAssessments || {}) };
    const currentStatus = prevMap[eqLabel]?.status || 'Sesuai Spek';
    const order: Array<'Sesuai Spek' | 'Perlu Penyesuaian' | 'Backup / Sub-Vendor' | 'Pending Cek'> = [
      'Sesuai Spek',
      'Perlu Penyesuaian',
      'Backup / Sub-Vendor',
      'Pending Cek'
    ];
    const nextStatus = order[(order.indexOf(currentStatus) + 1) % order.length];
    prevMap[eqLabel] = {
      ...(prevMap[eqLabel] || { itemLabel: eqLabel }),
      itemLabel: eqLabel,
      status: nextStatus,
      assessedBy: currentUser.name,
      assessedAt: new Date().toISOString()
    };
    const nextSections = job.sections.map((s, idx) =>
      idx === sectionIdx ? { ...s, equipmentAssessments: prevMap } : s
    );
    persistUpdatedJobAssignment(
      { ...job, sections: nextSections },
      `Assessment spesifikasi unit alat "${eqLabel}" -> ${nextStatus} pada ${job.dateLabel} (${sec.division})`
    );
  };

  const handleUpdateSectionSpecAssessment = (
    job: JobAssignment,
    sectionIdx: number,
    specStatus: NonNullable<JobDivisionSection['specAssessmentStatus']>,
    specNote?: string
  ) => {
    const sec = job.sections[sectionIdx];
    if (!sec) return;
    const nextSections = job.sections.map((s, idx) =>
      idx === sectionIdx
        ? {
            ...s,
            specAssessmentStatus: specStatus,
            specAssessmentNote: specNote !== undefined ? specNote : s.specAssessmentNote,
            assessedBy: currentUser.name,
            assessedAt: new Date().toISOString()
          }
        : s
    );
    persistUpdatedJobAssignment(
      { ...job, sections: nextSections },
      `Assessment Spesifikasi Teknis (${sec.division}) pada ${job.dateLabel}: ${specStatus}`
    );
  };

  const handleUpdateSectionCrewAssessment = (
    job: JobAssignment,
    sectionIdx: number,
    crewStatus: NonNullable<JobDivisionSection['crewAssessmentStatus']>,
    crewNote?: string
  ) => {
    const sec = job.sections[sectionIdx];
    if (!sec) return;
    const nextSections = job.sections.map((s, idx) =>
      idx === sectionIdx
        ? {
            ...s,
            crewAssessmentStatus: crewStatus,
            crewAssessmentNote: crewNote !== undefined ? crewNote : s.crewAssessmentNote,
            assessedBy: currentUser.name,
            assessedAt: new Date().toISOString()
          }
        : s
    );
    persistUpdatedJobAssignment(
      { ...job, sections: nextSections },
      `Assessment Penugasan Crew (${sec.division}) pada ${job.dateLabel}: ${crewStatus}`
    );
  };

  const handleQuickApproveEventAssessment = (job: JobAssignment, openGcalAfter = false) => {
    const nowIso = new Date().toISOString();
    const nextSections: JobDivisionSection[] = job.sections.map(sec => {
      const nextEquipMap = { ...(sec.equipmentAssessments || {}) };
      sec.equipment.forEach(eq => {
        nextEquipMap[eq] = {
          ...(nextEquipMap[eq] || { itemLabel: eq }),
          itemLabel: eq,
          status: nextEquipMap[eq]?.status || 'Sesuai Spek',
          assessedBy: currentUser.name,
          assessedAt: nowIso
        };
      });
      const nextCrew = sec.crew.map(c => ({
        ...c,
        assessmentStatus: c.assessmentStatus || ('Approved' as const),
        assessmentScore: c.assessmentScore || 5,
        assessedBy: currentUser.name,
        assessedAt: nowIso
      }));
      return {
        ...sec,
        specAssessmentStatus: 'Sesuai Spesifikasi (Approved)',
        crewAssessmentStatus: 'Personil Approved & Siap',
        equipmentAssessments: nextEquipMap,
        crew: nextCrew,
        assessedBy: currentUser.name,
        assessedAt: nowIso
      };
    });

    const approvedJob: JobAssignment = {
      ...job,
      sections: nextSections,
      adminAssessmentStatus: 'Terverifikasi Admin (Approved)',
      adminAssessedBy: currentUser.name,
      adminAssessedAt: nowIso,
      gcalSynced: true,
      gcalLastSyncedAt: nowIso
    };

    persistUpdatedJobAssignment(
      approvedJob,
      `Admin (${currentUser.name}) melakukan Assessment & Approval Unit Alat/Spesifikasi Teknis & Penugasan Staff/Freelance pada Event "${job.dateLabel} - ${job.venue}" serta Sync ke Google Calendar`
    );

    setGcalSyncFeedback({
      type: 'success',
      text: `Assessment Admin untuk Event "${job.venue} (${job.dateLabel})" telah disetujui (Unit Alat & Kru Approved) dan disinkronkan ke Google Calendar (${gcalConfig.calendarId}).`
    });

    if (openGcalAfter && typeof window !== 'undefined') {
      window.open(buildGoogleCalendarEventUrl(approvedJob), '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenAssessmentModal = (job: JobAssignment) => {
    const nowIso = new Date().toISOString();
    const cloned: JobAssignment = {
      ...job,
      adminAssessmentStatus: job.adminAssessmentStatus || 'Terverifikasi Admin (Approved)',
      sections: job.sections.map(sec => {
        const eqMap = { ...(sec.equipmentAssessments || {}) };
        sec.equipment.forEach(eq => {
          if (!eqMap[eq]) {
            eqMap[eq] = {
              itemLabel: eq,
              status: 'Sesuai Spek',
              assessedBy: currentUser.name,
              assessedAt: nowIso
            };
          }
        });
        return {
          ...sec,
          specAssessmentStatus: sec.specAssessmentStatus || 'Sesuai Spesifikasi (Approved)',
          crewAssessmentStatus: sec.crewAssessmentStatus || 'Personil Approved & Siap',
          equipment: [...sec.equipment],
          equipmentAssessments: eqMap,
          crew: sec.crew.map(c => ({
            ...c,
            assessmentStatus: c.assessmentStatus || 'Approved',
            assessmentScore: c.assessmentScore ?? 5
          })),
          vehicles: [...sec.vehicles]
        };
      })
    };
    setAssessmentModalJob(cloned);
    setAssessmentModalAddEquipText({});
    setAssessmentModalAddCrewName({});
    setAssessmentModalAddCrewRole({});
  };

  const handleSaveAssessmentModal = (openGcalTabAfter = false) => {
    if (!assessmentModalJob) return;
    const nowIso = new Date().toISOString();
    const finalized: JobAssignment = {
      ...assessmentModalJob,
      adminAssessedBy: currentUser.name,
      adminAssessedAt: nowIso,
      gcalSynced: true,
      gcalLastSyncedAt: nowIso
    };
    persistUpdatedJobAssignment(
      finalized,
      `Admin (${currentUser.name}) menyimpan hasil Assessment Spesifikasi Teknis & Penugasan Staff/Freelance pada Event "${finalized.dateLabel} - ${finalized.venue}"`
    );
    setAssessmentModalJob(null);
    setGcalSyncFeedback({
      type: 'success',
      text: `Hasil Assessment Admin (Unit Alat/Spesifikasi Teknis & Penugasan Staff/Freelance) untuk "${finalized.venue}" berhasil disimpan & tersinkronisasi dengan Google Calendar (${gcalConfig.calendarId}).`
    });
    if (openGcalTabAfter && typeof window !== 'undefined') {
      window.open(buildGoogleCalendarEventUrl(finalized), '_blank', 'noopener,noreferrer');
    }
  };

  const handleToggleInventoryAssetInModalText = (asset: Asset, customQty?: string) => {
    const lines = jobFormEquipmentText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    const formattedLabel = formatInventoryEquipmentLabel(asset, customQty);
    const existingIdx = findMatchingAssetIndexInEquipment(asset, lines);
    const hasCustomQty = Boolean(customQty && customQty.trim());

    let nextLines: string[];
    if (existingIdx >= 0) {
      if (hasCustomQty && lines[existingIdx] !== formattedLabel) {
        nextLines = lines.map((line, idx) => (idx === existingIdx ? formattedLabel : line));
      } else {
        nextLines = lines.filter((_, idx) => idx !== existingIdx);
      }
    } else {
      nextLines = [...lines, formattedLabel];
    }
    setJobFormEquipmentText(nextLines.join('\n'));
  };

  const handleAddManualEquipmentToModalText = (manualInput: string) => {
    const trimmed = manualInput.trim();
    if (!trimmed) return;
    const lines = jobFormEquipmentText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    setJobFormEquipmentText([...lines, trimmed].join('\n'));
  };

  const syncCurrentModalSectionToDraft = (draftList: JobDivisionSection[], idx: number): JobDivisionSection[] => {
    const rawCrewTokens = jobFormCrewText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const resolvedCrew = buildCrewList(rawCrewTokens, jobFormDivision);
    const equipmentList = jobFormEquipmentText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    const vehicleList = jobFormVehiclesText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const updatedSec: JobDivisionSection = {
      division: jobFormDivision,
      packageLabel: jobFormPackageLabel.trim() || jobFormDivision,
      equipment: equipmentList,
      crew: resolvedCrew,
      vehicles: vehicleList
    };

    const next = [...draftList];
    if (idx >= 0 && idx < next.length) {
      next[idx] = { ...next[idx], ...updatedSec };
    } else {
      next.push(updatedSec);
    }
    return next;
  };

  const loadSectionIntoModalFields = (sec: JobDivisionSection | undefined) => {
    const div = sec?.division || 'Audio';
    setJobFormDivision(div);
    setJobFormPackageLabel(sec?.packageLabel || '');
    setJobFormEquipmentText((sec?.equipment || []).join('\n'));
    setJobFormCrewText(
      (sec?.crew || [])
        .map(c => (c.roleNote ? `${c.name} (${c.roleNote})` : c.name))
        .join(', ')
    );
    setJobFormVehiclesText((sec?.vehicles || []).join(', '));
    setModalEquipDivFilter(mapSectionDivToAssetDiv(div));
    setModalEquipSearch('');
    setModalEquipQty('');
    setModalEquipManualInput('');
  };

  const handleSelectModalSection = (targetIdx: number) => {
    const synced = syncCurrentModalSectionToDraft(jobFormSectionsDraft, jobFormSectionIdx);
    setJobFormSectionsDraft(synced);
    setJobFormSectionIdx(targetIdx);
    loadSectionIntoModalFields(synced[targetIdx]);
  };

  const handleAddModalSection = () => {
    const synced = syncCurrentModalSectionToDraft(jobFormSectionsDraft, jobFormSectionIdx);
    const newSec: JobDivisionSection = {
      division: 'Multimedia',
      packageLabel: 'Paket Baru',
      equipment: [],
      crew: [],
      vehicles: []
    };
    const next = [...synced, newSec];
    const nextIdx = next.length - 1;
    setJobFormSectionsDraft(next);
    setJobFormSectionIdx(nextIdx);
    loadSectionIntoModalFields(newSec);
  };

  const handleTogglePersonInModalCrewText = (personName: string) => {
    const tokens = jobFormCrewText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const lowerTarget = personName.toLowerCase().trim();
    const exists = tokens.some(t => {
      const base = t.replace(/\([^)]*\)/g, '').trim().toLowerCase();
      return base === lowerTarget;
    });
    const nextTokens = exists
      ? tokens.filter(t => t.replace(/\([^)]*\)/g, '').trim().toLowerCase() !== lowerTarget)
      : [...tokens, personName];
    setJobFormCrewText(nextTokens.join(', '));
  };

  const handleOpenAddJobModal = () => {
    setEditingJobId(null);
    const defaultDate = jobMonthFilter === '2026-12' ? '2026-12-01' : '2026-11-05';
    setJobFormDate(defaultDate);
    setJobFormDateLabel('');
    setJobFormVenue('');
    setJobFormLoadingSchedule('');
    setJobFormPic(currentUser.nickname ? `${currentUser.nickname} (${currentUser.name})` : currentUser.name);
    setJobFormStatus('Terjadwal');
    setJobFormNotes('');
    const initialSec: JobDivisionSection = {
      division: 'Audio',
      packageLabel: 'Sound 5rb',
      equipment: [],
      crew: [],
      vehicles: []
    };
    setJobFormSectionsDraft([initialSec]);
    setJobFormSectionIdx(0);
    loadSectionIntoModalFields(initialSec);
    setShowJobFormModal(true);
  };

  const handleOpenEditJobModal = (job: JobAssignment, initialSecIndex = 0) => {
    setEditingJobId(job.id);
    setJobFormDate(job.date);
    setJobFormDateLabel(job.dateLabel);
    setJobFormVenue(job.venue);
    setJobFormLoadingSchedule(job.loadingSchedule || '');
    setJobFormPic(job.pic || '');
    setJobFormStatus(job.status || 'Terjadwal');
    setJobFormNotes(job.notes || '');
    const clonedSections: JobDivisionSection[] =
      job.sections.length > 0
        ? job.sections.map(s => ({
            ...s,
            equipment: [...s.equipment],
            crew: [...s.crew],
            vehicles: [...s.vehicles]
          }))
        : [
            {
              division: 'Audio',
              packageLabel: 'Sound 5rb',
              equipment: [],
              crew: [],
              vehicles: []
            }
          ];
    const safeIdx = Math.min(Math.max(0, initialSecIndex), clonedSections.length - 1);
    setJobFormSectionsDraft(clonedSections);
    setJobFormSectionIdx(safeIdx);
    loadSectionIntoModalFields(clonedSections[safeIdx]);
    setShowJobFormModal(true);
  };

  const handleSaveJobAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobFormVenue.trim()) {
      alert('Lokasi / Venue wajib diisi.');
      return;
    }
    const monthKey = jobFormDate.slice(0, 7) || '2026-11';
    const nextSections = syncCurrentModalSectionToDraft(jobFormSectionsDraft, jobFormSectionIdx);

    const finalJob: JobAssignment & { _userEdited?: boolean } = {
      id: editingJobId || `job-${jobFormDate.replace(/-/g, '')}-${Date.now().toString().slice(-4)}`,
      monthKey,
      date: jobFormDate,
      dateLabel: jobFormDateLabel.trim() || `${jobFormDate} ${jobFormVenue.trim()}`,
      venue: jobFormVenue.trim(),
      loadingSchedule: jobFormLoadingSchedule.trim() || '-',
      pic: jobFormPic.trim() || '-',
      status: jobFormStatus,
      notes: jobFormNotes.trim() || undefined,
      sections: nextSections,
      _userEdited: true
    };

    persistUpdatedJobAssignment(
      finalJob,
      `${editingJobId ? 'Memperbarui' : 'Menambahkan'} Jadwal Penugasan Job: ${finalJob.dateLabel} (PIC: ${finalJob.pic})`
    );
    setShowJobFormModal(false);

    if (jobFormOpenGcalOnSave && typeof window !== 'undefined') {
      const gcalEventUrl = buildGoogleCalendarEventUrl(finalJob);
      window.open(gcalEventUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSyncAllToGoogleCalendar = async (jobsToSync: JobAssignment[]) => {
    if (jobsToSync.length === 0) return;
    setIsSyncingGcal(true);
    try {
      const activePersonName =
        jobSelectedStaffId !== 'ALL'
          ? (staffList.find(s => s.id === jobSelectedStaffId)?.name || 'ALL')
          : jobSelectedFreelanceName !== 'ALL'
            ? jobSelectedFreelanceName
            : 'ALL';
      const activePersonType =
        jobSelectedStaffId !== 'ALL'
          ? ('Staff' as const)
          : jobSelectedFreelanceName !== 'ALL'
            ? ('Freelance' as const)
            : undefined;

      const res = await syncAllJobAssignmentsToGoogleCalendar(
        jobsToSync,
        {
          filterPersonName: activePersonName,
          filterPersonType: activePersonType,
          filterDivision: jobDivisionFilter
        },
        gcalConfig
      );
      setGcalConfig(getGoogleCalendarSyncConfig());
      setGcalSyncFeedback({
        type: res.mode === 'ics_import' ? 'info' : 'success',
        text: res.message,
        importUrl: res.importUrl
      });
      onLogActivity(
        currentUser.name,
        currentUser.role,
        `Menyinkronkan ${res.syncedCount} jadwal event ke Google Calendar (${gcalConfig.calendarId})`
      );
      if (res.mode === 'ics_import' && typeof window !== 'undefined') {
        window.open(OFFICIAL_GOOGLE_CALENDAR_IMPORT_URL, '_blank', 'noopener,noreferrer');
      }
    } finally {
      setIsSyncingGcal(false);
    }
  };

  const handlePullLiveFromGoogleCalendar = async () => {
    setIsSyncingGcal(true);
    try {
      const res = await pullJobAssignmentsFromGoogleCalendarLive(gcalConfig);
      setGcalConfig(getGoogleCalendarSyncConfig());
      if (res.ok && res.jobs.length > 0) {
        setJobAssignments(prev => {
          const map = new Map<string, JobAssignment>(prev.map(j => [j.id, j]));
          res.jobs.forEach(imp => {
            const existing = map.get(imp.id);
            if (!existing || !existing._userEdited) {
              map.set(imp.id, imp);
            }
          });
          const sorted = normalizeJobAssignmentsMaster(Array.from(map.values()));
          try {
            localStorage.setItem('riz_job_assignments_gcal_v2', JSON.stringify(sorted));
          } catch {}
          return sorted;
        });
        setGcalSyncFeedback({
          type: 'success',
          text: res.message
        });
        onLogActivity(
          currentUser.name,
          currentUser.role,
          `Menarik & menyinkronkan ${res.jobs.length} jadwal event dari Google Calendar (${gcalConfig.calendarId})`
        );
      } else {
        setGcalSyncFeedback({
          type: res.ok ? 'info' : 'warning',
          text: res.message,
          importUrl: OFFICIAL_GOOGLE_CALENDAR_IMPORT_URL
        });
      }
    } finally {
      setIsSyncingGcal(false);
    }
  };

  const handleUpdateJobStatus = (job: JobAssignment, nextStatus: JobAssignment['status']) => {
    const updated: JobAssignment & { _userEdited?: boolean } = {
      ...job,
      status: nextStatus,
      _userEdited: true
    };
    setJobAssignments(prev => {
      const next = prev.map(j => (j.id === job.id ? updated : j));
      try {
        localStorage.setItem('riz_job_assignments_gcal_v2', JSON.stringify(next));
      } catch {}
      return next;
    });
    saveCloudDoc('job_assignments_gcal', updated.id, updated, currentUser.name);
    onLogActivity(currentUser.name, currentUser.role, `Mengubah status Job "${job.dateLabel}" menjadi ${nextStatus}`);
  };

  const handleDeleteJobAssignment = (job: JobAssignment) => {
    if (!window.confirm(`Hapus jadwal penugasan job "${job.dateLabel}"?`)) return;
    setJobAssignments(prev => {
      const next = prev.filter(j => j.id !== job.id);
      try {
        localStorage.setItem('riz_job_assignments_gcal_v2', JSON.stringify(next));
      } catch {}
      return next;
    });
    deleteCloudDoc('job_assignments_gcal', job.id);
    onLogActivity(currentUser.name, currentUser.role, `Menghapus Jadwal Penugasan Job: ${job.dateLabel}`);
  };

  const handleImportGoogleCalendarIcs = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const importedJobs = parseGoogleCalendarIcsToJobAssignments(text);
      if (importedJobs.length === 0) {
        alert('Tidak ditemukan event kalender (.ics) yang valid di dalam file yang dipilih.');
        return;
      }
      setJobAssignments(prev => {
        const map = new Map<string, JobAssignment>(prev.map(j => [j.id, j]));
        importedJobs.forEach(imp => {
          map.set(imp.id, { ...imp, _userEdited: true });
        });
        const sorted = normalizeJobAssignmentsMaster(Array.from(map.values()));
        try {
          localStorage.setItem('riz_job_assignments_gcal_v2', JSON.stringify(sorted));
        } catch {}
        return sorted;
      });
      importedJobs.forEach(imp => {
        saveCloudDoc('job_assignments_gcal', imp.id, { ...imp, _userEdited: true }, currentUser.name);
      });
      onLogActivity(
        currentUser.name,
        currentUser.role,
        `Mengimpor & menyinkronkan ${importedJobs.length} jadwal penugasan dari Google Calendar (.ics)`
      );
      alert(`Berhasil mengimpor & menyinkronkan ${importedJobs.length} jadwal penugasan dari Google Calendar!`);
    } catch (err) {
      alert('Gagal membaca file Google Calendar (.ics).');
    }
  };

  // Active check in / out state for current user on today's date
  const todayStr = new Date().toISOString().split('T')[0];
  const userTodayLog = attendanceLogs.find(log => log.staffId === currentUser.id && log.date === todayStr);

  // Form check in / out inputs
  const [gpsSimulated, setGpsSimulated] = useState('');
  const [photoSimulated, setPhotoSimulated] = useState('');
  const [simulatedTime, setSimulatedTime] = useState('');
  const [customStatus, setCustomStatus] = useState<'Hadir' | 'Izin' | 'Sakit'>('Hadir');

  // Camera simulation
  const [cameraActive, setCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isLiveSelfieCamera, setIsLiveSelfieCamera] = useState(false);
  const [selfieFacingMode, setSelfieFacingMode] = useState<'user' | 'environment'>('user');
  const attendanceVideoRef = useRef<HTMLVideoElement | null>(null);
  const attendanceStreamRef = useRef<MediaStream | null>(null);

  const handleStopSelfieCamera = () => {
    if (attendanceStreamRef.current) {
      attendanceStreamRef.current.getTracks().forEach(t => t.stop());
      attendanceStreamRef.current = null;
    }
    if (attendanceVideoRef.current) {
      attendanceVideoRef.current.srcObject = null;
    }
    setIsLiveSelfieCamera(false);
    setCameraActive(false);
  };

  const handleStartSelfieCamera = async (overrideFacing?: 'user' | 'environment') => {
    setCameraActive(true);
    const targetFacing = overrideFacing || selfieFacingMode;
    try {
      if (attendanceStreamRef.current) {
        attendanceStreamRef.current.getTracks().forEach(t => t.stop());
      }
      const session = await startUniversalCameraStream({
        preferredFacingMode: targetFacing,
        videoElement: attendanceVideoRef.current
      });
      attendanceStreamRef.current = session.stream;
      setSelfieFacingMode(session.facingMode);
      setIsLiveSelfieCamera(true);
      setTimeout(() => {
        if (attendanceVideoRef.current && attendanceStreamRef.current) {
          attendanceVideoRef.current.setAttribute('playsinline', 'true');
          attendanceVideoRef.current.setAttribute('webkit-playsinline', 'true');
          attendanceVideoRef.current.srcObject = attendanceStreamRef.current;
          attendanceVideoRef.current.play().catch(() => {});
        }
      }, 50);
    } catch {
      setIsLiveSelfieCamera(false);
    }
  };

  const handleSwitchSelfieCameraFacing = async () => {
    const nextFacing = selfieFacingMode === 'user' ? 'environment' : 'user';
    setSelfieFacingMode(nextFacing);
    await handleStartSelfieCamera(nextFacing);
  };

  const handleCaptureSimulatedSelfie = () => {
    setIsCapturing(true);
    setTimeout(() => {
      try {
        if (isLiveSelfieCamera && attendanceVideoRef.current && attendanceVideoRef.current.videoWidth > 0) {
          const snap = captureSnapshotFromVideo(
            attendanceVideoRef.current,
            `${currentUser.name} (${currentUser.division}) • ${new Date().toLocaleString('id-ID')}`
          );
          if (snap) {
            setPhotoSimulated(snap);
            if (!gpsSimulated) {
              setGpsSimulated(`${OFFICIAL_COMPANY_GPS_COORDINATES} (${OFFICIAL_COMPANY_PLUS_CODE})`);
            }
            setIsCapturing(false);
            handleStopSelfieCamera();
            return;
          }
        }
      } catch {}

      const nowLabel = new Date().toLocaleString('id-ID');
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300" viewBox="0 0 480 300">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#1e1b4b"/>
          </linearGradient>
        </defs>
        <rect width="480" height="300" fill="url(#bg)"/>
        <rect x="18" y="18" width="444" height="264" rx="14" fill="none" stroke="#34d399" stroke-width="2" stroke-dasharray="8 4"/>
        <circle cx="240" cy="110" r="42" fill="#312e81" stroke="#818cf8" stroke-width="3"/>
        <text x="240" y="118" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="24" font-weight="bold">${(currentUser.nickname || currentUser.name).slice(0, 2).toUpperCase()}</text>
        <text x="240" y="182" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="13" font-weight="bold">VERIFIKASI KAMERA ABSENSI AKTIF</text>
        <text x="240" y="206" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="15" font-weight="bold">${currentUser.name} (${currentUser.division})</text>
        <text x="240" y="230" text-anchor="middle" fill="#cbd5e1" font-family="monospace" font-size="11">${nowLabel}</text>
        <text x="240" y="252" text-anchor="middle" fill="#93c5fd" font-family="monospace" font-size="10">HQ Bogor: ${OFFICIAL_COMPANY_GPS_COORDINATES}</text>
      </svg>`;
      const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
      setPhotoSimulated(dataUrl);
      if (!gpsSimulated) {
        setGpsSimulated(`${OFFICIAL_COMPANY_GPS_COORDINATES} (${OFFICIAL_COMPANY_PLUS_CODE})`);
      }
      setIsCapturing(false);
      handleStopSelfieCamera();
    }, 180);
  };

  // Pagination or filters for schedule grid
  const [scheduleSearch, setScheduleSearch] = useState('');

  // Real-time Cloud Subscriptions
  useEffect(() => {
    const unsubAttendance = subscribeCloudCollection<AttendanceLog>(
      'attendance_logs',
      'riz_attendance_logs',
      setAttendanceLogs,
      []
    );

    return () => {
      unsubAttendance();
    };
  }, []);

  // Save states to localStorage & Cloud
  useEffect(() => {
    localStorage.setItem('riz_attendance_logs', JSON.stringify(attendanceLogs));
  }, [attendanceLogs]);

  useEffect(() => {
    localStorage.setItem('riz_work_schedule', JSON.stringify(schedule));
  }, [schedule]);

  // Handler to toggle / cycle shift with Cloud push
  const handleToggleShift = (staffNo: number, day: number) => {
    if (!canManageJobSchedule) return;

    const cycle: string[] = ['MD', 'P', 'M', 'PM', 'L', 'Cuti', '-'];
    const updated = scheduleData.map(row => {
      if (row.no === staffNo) {
        const currentShift = row.shifts[day] || '-';
        const nextIdx = (cycle.indexOf(currentShift) + 1) % cycle.length;
        return {
          ...row,
          shifts: {
            ...row.shifts,
            [day]: cycle[nextIdx]
          }
        };
      }
      return row;
    });

    setScheduleData(updated);
    localStorage.setItem(`riz_schedule_${activeMonth}`, JSON.stringify(updated));
    pushCollectionToCloud(`schedule_${activeMonth}`, updated, currentUser.name);
  };

  useEffect(() => {
    localStorage.setItem('riz_staff_electrical_competencies', JSON.stringify(electricalCompetencies));
    if (electricalCompetencies && Object.keys(electricalCompetencies).length > 0) {
      saveCloudDoc('system_configs', 'staff_electrical_competencies', { data: electricalCompetencies }, currentUser.name);
    }
  }, [electricalCompetencies]);

  // Handle Real GPS detection & Fallback to HQ
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsSimulated(`${OFFICIAL_COMPANY_GPS_COORDINATES} (${OFFICIAL_COMPANY_PLUS_CODE})`);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGpsSimulated(`Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`);
      },
      (error) => {
        // Fallback to official HQ Bogor coordinates
        setGpsSimulated(`${OFFICIAL_COMPANY_GPS_COORDINATES} (${OFFICIAL_COMPANY_PLUS_CODE})`);
      }
    );
  };

  const handleSetHqGPS = () => {
    setGpsSimulated(`${OFFICIAL_COMPANY_GPS_COORDINATES} (${OFFICIAL_COMPANY_PLUS_CODE})`);
  };

  // Handle Real File Input for Camera
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoSimulated(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate Month Schedule (1-31)
  const handleGenerateMonthSchedule = () => {
    const defaultData: { [staffId: string]: { [day: number]: 'Masuk' | 'Off' | 'Libur' | 'Izin' | 'Sakit' | 'Alpha' } } = {};

    staffList.forEach(staff => {
      defaultData[staff.id] = {};
      for (let day = 1; day <= 31; day++) {
        // Simple default: off on Sunday (day index, say 7, 14, 21, 28)
        const isSunday = day % 7 === 0;
        defaultData[staff.id][day] = isSunday ? 'Off' : 'Masuk';
      }
    });

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthNum = String(now.getMonth() + 1).padStart(2, '0');
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const currentMonthName = monthNames[now.getMonth()];

    const newSchedule: WorkSchedule = {
      id: `${currentYear}-${currentMonthNum}`,
      monthLabel: `${currentMonthName} ${currentYear}`,
      scheduleData: defaultData
    };

    setSchedule(newSchedule);
    onLogActivity(currentUser.name, currentUser.role, 'Admin menekan tombol "Generate Bulan Baru" dan menyalin staff dari master_staff');
  };

  // Update a single day's schedule for a staff
  const handleUpdateDaySchedule = (staffId: string, day: number, value: 'Masuk' | 'Off' | 'Libur' | 'Izin' | 'Sakit' | 'Alpha') => {
    if (!schedule) return;

    const updatedData = {
      ...schedule.scheduleData,
      [staffId]: {
        ...schedule.scheduleData[staffId],
        [day]: value
      }
    };

    setSchedule({
      ...schedule,
      scheduleData: updatedData
    });

    const staffName = staffList.find(s => s.id === staffId)?.name || 'Staff';
    onLogActivity(currentUser.name, currentUser.role, `Mengubah jadwal ${staffName} Tanggal ${day} menjadi ${value}`);
  };

  // Handle check-in
  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const isTeamLeader = currentUser.role === 'Team Leader';
    if (!isTeamLeader) {
      if (!photoSimulated) {
        alert('Silakan ambil foto selfie untuk Check In!');
        return;
      }
      if (!gpsSimulated) {
        alert('Silakan dapatkan lokasi GPS terlebih dahulu!');
        return;
      }
    }

    // Determine check-in time
    const checkInTimeStr = simulatedTime || new Date().toTimeString().split(' ')[0].substring(0, 5); // HH:MM

    // Calculate lateness (Standard threshold is 08:00 AM)
    const [hours, minutes] = checkInTimeStr.split(':').map(Number);
    const checkInMinutes = hours * 60 + minutes;
    const thresholdMinutes = 8 * 60; // 08:00 AM
    const isLate = checkInMinutes > thresholdMinutes;
    const lateMinutes = isLate ? (checkInMinutes - thresholdMinutes) : 0;

    const newLog: AttendanceLog = {
      id: 'att-' + Date.now(),
      staffId: currentUser.id,
      staffName: currentUser.name,
      division: currentUser.division,
      date: todayStr,
      checkInTime: checkInTimeStr,
      checkInPhoto: isTeamLeader
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
        : photoSimulated,
      checkInGps: isTeamLeader
        ? `${OFFICIAL_COMPANY_GPS_COORDINATES} (Office HQ - ${OFFICIAL_COMPANY_PLUS_CODE})`
        : gpsSimulated,
      status: customStatus === 'Hadir' ? 'Hadir' : customStatus,
      isLate,
      lateMinutes
    };

    setAttendanceLogs(prev => [newLog, ...prev]);
    saveCloudDoc('attendance_logs', newLog.id, newLog);
    onLogActivity(currentUser.name, currentUser.role, `Berhasil melakukan Check In pada jam ${checkInTimeStr} (${isLate ? 'Terlambat' : 'Tepat Waktu'})`);

    // Reset form helper states
    setPhotoSimulated('');
    setGpsSimulated('');
    setSimulatedTime('');
  };

  // Handle check-out
  const handleCheckOut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userTodayLog) return;

    const isTeamLeader = currentUser.role === 'Team Leader';
    if (!isTeamLeader) {
      if (!photoSimulated) {
        alert('Silakan ambil foto selfie untuk Check Out!');
        return;
      }
      if (!gpsSimulated) {
        alert('Silakan dapatkan lokasi GPS terlebih dahulu!');
        return;
      }
    }

    const checkOutTimeStr = simulatedTime || new Date().toTimeString().split(' ')[0].substring(0, 5); // HH:MM

    const updatedLog: AttendanceLog = {
      ...userTodayLog,
      checkOutTime: checkOutTimeStr,
      checkOutPhoto: isTeamLeader
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
        : photoSimulated,
      checkOutGps: isTeamLeader
        ? `${OFFICIAL_COMPANY_GPS_COORDINATES} (Office HQ - ${OFFICIAL_COMPANY_PLUS_CODE})`
        : gpsSimulated
    };

    setAttendanceLogs(prev => prev.map(log => log.id === userTodayLog.id ? updatedLog : log));
    saveCloudDoc('attendance_logs', updatedLog.id, updatedLog);

    onLogActivity(currentUser.name, currentUser.role, `Berhasil melakukan Check Out pada jam ${checkOutTimeStr}`);

    // Reset form helper states
    setPhotoSimulated('');
    setGpsSimulated('');
    setSimulatedTime('');
  };

  // Helper colors for grid status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Masuk': return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
      case 'Off': return 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200';
      case 'Libur': return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'Izin': return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
      case 'Sakit': return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
      case 'Alpha': return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100';
      default: return 'bg-white text-slate-400 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Tab Header & Title */}
      {!forceSubTab && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Sistem Absensi & Penjadwalan</h1>
            <p className="text-xs text-slate-500">
              Pencatatan kehadiran harian menggunakan verifikasi foto selfie, koordinat GPS real-time, serta monitoring schedule 1-31 bulanan.
            </p>
          </div>

          {/* Sub-Tabs and Drive Bukti Button */}
          <div className="flex flex-wrap items-center gap-2 self-start">
            <a
              href={OFFICIAL_GOOGLE_DRIVE_ATTENDANCE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
              title="Folder Bukti Absensi Google Drive"
            >
              <Camera className="w-3.5 h-3.5 text-indigo-600" />
              <span>Folder Bukti Absensi ↗</span>
            </a>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveSubTab('self')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${activeSubTab === 'self' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-950'
                  }`}
              >
                Absensi Mandiri
              </button>

              <button
                onClick={() => {
                  setActiveSubTab('schedule');
                  setScheduleViewMode('job_assignments');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${activeSubTab === 'schedule' && scheduleViewMode === 'job_assignments' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-950'
                  }`}
              >
                📋 Penugasan Job & Event
              </button>

              {/* Schedule Tab available to Admin, Supervisor, Manager and Team Leader */}
              {(currentUser.role === 'Admin' || currentUser.role === 'Supervisor' || currentUser.role === 'Manager' || currentUser.role === 'Owner' || currentUser.role === 'Direktur' || currentUser.role === 'Team Leader') && (
                <button
                  onClick={() => {
                    setActiveSubTab('schedule');
                    setScheduleViewMode('official');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${activeSubTab === 'schedule' && scheduleViewMode !== 'job_assignments' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-950'
                    }`}
                >
                  Penjadwalan (1-31)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {forceSubTab === 'self' && (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveSubTab('self')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${activeSubTab === 'self' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Absensi Mandiri</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSubTab('schedule');
                setScheduleViewMode('job_assignments');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${activeSubTab === 'schedule' && scheduleViewMode === 'job_assignments' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>📋 Penugasan Job & Event (Staff & Freelance)</span>
            </button>
          </div>
          <a
            href={OFFICIAL_GOOGLE_CALENDAR_WEB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Buka Google Calendar Jadwal Crew ↗</span>
          </a>
        </div>
      )}

      {/* VIEW 1: SELF ATTENDANCE */}
      {activeSubTab === 'self' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Action Form for Checking In or Out */}
          <div className="lg:col-span-2 space-y-6">
            {!isWajibAbsen(currentUser.name) ? (
              <div className="bg-indigo-50/70 border border-indigo-200 p-8 rounded-xl text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
                  <UserCheck className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-indigo-950 text-base">{currentUser.name} ({currentUser.role})</h3>
                  <p className="text-xs text-indigo-800 max-w-md mx-auto leading-relaxed">
                    Sesuai kebijakan perusahaan, posisi **{currentUser.role}** ({currentUser.name}) dibebaskan dari kewajiban melakukan absensi harian maupun pencatatan jam kerja.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-100 border border-emerald-200 rounded-full text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5" /> EXEMPT / BEBAS ABSENSI
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">



                {/* Header Status Card */}
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Clock className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Status Kehadiran Hari Ini</div>
                      <div className="font-semibold text-xs text-slate-700">Tanggal: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    {!userTodayLog ? (
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold uppercase font-mono">Belum Masuk</span>
                    ) : !userTodayLog.checkOutTime ? (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold uppercase font-mono">Sudah Check In</span>
                    ) : (
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-bold uppercase font-mono">Selesai Kerja</span>
                    )}
                  </div>
                </div>

                {/* Attendance Form */}
                {(!userTodayLog || !userTodayLog.checkOutTime) ? (
                  <form onSubmit={!userTodayLog ? handleCheckIn : handleCheckOut} className="space-y-4">
                    <div className="text-sm font-bold text-slate-800 border-b pb-2">
                      {!userTodayLog ? 'Formulir Check In (Masuk)' : 'Formulir Check Out (Pulang)'}
                    </div>

                    {/* Status selection (Only for Check In) */}
                    {!userTodayLog && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Pilih Status Kehadiran
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Hadir', 'Izin', 'Sakit'] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setCustomStatus(st)}
                              className={`p-2 border rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${customStatus === st
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Simulated inputs */}
                    {currentUser.role === 'Team Leader' ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-xl text-emerald-800 text-xs font-sans flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold uppercase text-[10px] tracking-wider text-emerald-700 mb-0.5">Bypass Validasi Team Leader</div>
                          <p className="text-slate-600 leading-tight">
                            Setiap <strong>Team Leader</strong> dibebaskan dari kewajiban verifikasi Foto Selfie dan Koordinat GPS Lokasi. Kehadiran Anda terverifikasi secara instan.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* REAL HARDWARE CAMERA FOR SELFIE ATTENDANCE (MOBILE / TABLET / DESKTOP) */}
                        <div className="p-4 border border-slate-200 rounded-lg space-y-3 bg-slate-50/50">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                              <Camera className="w-3.5 h-3.5 text-indigo-600" />
                              Foto Selfie Verifikasi (Kamera Perangkat)
                            </span>
                            {photoSimulated ? (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">Terlampir</span>
                            ) : cameraActive ? (
                              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-mono font-bold animate-pulse">Kamera Live Aktif</span>
                            ) : null}
                          </div>

                          {photoSimulated ? (
                            <div className="relative group">
                              <img src={photoSimulated} alt="Selfie Absen" className="w-full h-36 object-cover rounded-lg shadow-sm border border-slate-200" />
                              <button
                                type="button"
                                onClick={() => setPhotoSimulated('')}
                                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <a
                                href={OFFICIAL_GOOGLE_DRIVE_ATTENDANCE_FOLDER_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] py-1 px-2 rounded font-bold text-center hover:bg-slate-900 transition-colors"
                              >
                                📁 Folder Bukti Absensi (Drive) ↗
                              </a>
                            </div>
                          ) : cameraActive ? (
                            <div className="rounded-xl overflow-hidden border-2 border-indigo-600 bg-slate-950 text-white space-y-2 p-3">
                              <div className="relative h-36 rounded-lg bg-slate-900 overflow-hidden flex flex-col items-center justify-center">
                                <video
                                  ref={attendanceVideoRef}
                                  autoPlay
                                  playsInline
                                  muted
                                  className={`absolute inset-0 w-full h-full object-cover ${
                                    isLiveSelfieCamera ? 'opacity-95' : 'hidden'
                                  }`}
                                />
                                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                                {!isLiveSelfieCamera && (
                                  <div className="relative z-10 text-center px-3 space-y-1">
                                    <div className="w-10 h-10 rounded-full bg-indigo-600/40 border border-indigo-400 flex items-center justify-center mx-auto text-xs font-mono font-black">
                                      {(currentUser.nickname || currentUser.name).slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                                      ● KAMERA VERIFIKASI SIAP DIJEPRET
                                    </div>
                                    <div className="text-[11px] font-bold text-white">
                                      {currentUser.name} ({currentUser.division})
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={handleCaptureSimulatedSelfie}
                                  disabled={isCapturing}
                                  className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                  <Camera className="w-3.5 h-3.5" />
                                  <span>{isCapturing ? 'Menjepret Foto...' : 'Jepret Foto Selfie'}</span>
                                </button>
                                {isLiveSelfieCamera && (
                                  <button
                                    type="button"
                                    onClick={handleSwitchSelfieCameraFacing}
                                    className="py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1"
                                    title="Ganti Kamera Depan / Belakang"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    <span>{selfieFacingMode === 'user' ? 'Depan' : 'Belakang'}</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={handleStopSelfieCamera}
                                  className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                                >
                                  Tutup
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 bg-slate-50 relative overflow-hidden space-y-2">
                              <Camera className="w-7 h-7 text-indigo-500" />
                              <span className="text-xs font-semibold text-slate-700">Foto Selfie Area / Wajah (Ponsel / Tablet / Laptop)</span>
                              <div className="flex flex-wrap items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleStartSelfieCamera()}
                                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold cursor-pointer flex items-center gap-1 shadow-2xs"
                                >
                                  <Camera className="w-3.5 h-3.5" />
                                  <span>Buka Kamera Live</span>
                                </button>
                                <label className="px-3 py-1.5 bg-white hover:bg-slate-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-bold cursor-pointer">
                                  Kamera HP / Pilih Foto
                                  <input
                                    type="file"
                                    accept="image/*"
                                    capture="user"
                                    className="hidden"
                                    onChange={handlePhotoUpload}
                                  />
                                </label>
                              </div>
                              <a
                                href={OFFICIAL_GOOGLE_DRIVE_ATTENDANCE_FOLDER_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold block transition-colors underline"
                              >
                                📁 Folder Drive Bukti Absensi ↗
                              </a>
                            </div>
                          )}
                        </div>

                        {/* GPS LOCATION SIMULATOR */}
                        <div className="p-4 border border-slate-200 rounded-lg space-y-3 bg-slate-50/50">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                              Koordinat GPS Lokasi Absensi
                            </span>
                            {gpsSimulated && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">Tersinkron</span>
                            )}
                          </div>

                          {/* Titik Acuan Resmi Kantor/Gudang */}
                          <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                                🏢 Titik Acuan Kantor & Gudang (HQ):
                              </span>
                              <a
                                href={OFFICIAL_COMPANY_GOOGLE_MAPS_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline"
                              >
                                Google Maps ↗
                              </a>
                            </div>
                            <div className="text-[10px] text-slate-600 leading-tight">
                              {OFFICIAL_COMPANY_ADDRESS}
                            </div>
                            <div className="text-[10px] text-indigo-700 font-mono font-bold">
                              Plus Code: {OFFICIAL_COMPANY_PLUS_CODE} | {OFFICIAL_COMPANY_GPS_COORDINATES}
                            </div>
                          </div>

                          {gpsSimulated ? (
                            <div className="p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-lg text-xs space-y-1">
                              <div className="font-semibold text-indigo-900">GPS Terdeteksi / Terpilih:</div>
                              <div className="text-[11px] text-slate-800 font-mono font-bold leading-tight">{gpsSimulated}</div>
                              <div className="flex items-center gap-3 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setGpsSimulated('')}
                                  className="text-[10px] text-rose-600 underline font-semibold hover:text-rose-800 cursor-pointer"
                                >
                                  Reset Koordinat
                                </button>
                                <button
                                  type="button"
                                  onClick={handleSetHqGPS}
                                  className="text-[10px] text-indigo-600 underline font-semibold hover:text-indigo-800 cursor-pointer"
                                >
                                  Set Titik HQ Bogor
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="border border-slate-200 rounded-lg p-3 bg-white text-center space-y-2">
                              <span className="text-xs text-slate-400 block">Koordinat GPS belum diambil</span>
                              <div className="flex flex-wrap items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={handleDetectGPS}
                                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded cursor-pointer transition-colors shadow-2xs"
                                >
                                  Dapatkan Lokasi GPS
                                </button>
                                <button
                                  type="button"
                                  onClick={handleSetHqGPS}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-semibold rounded cursor-pointer transition-colors"
                                >
                                  Gunakan Titik HQ Bogor
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Simulated check-in time (for easier testing/demo of Lateness indicator) */}
                    <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Jam Absensi <span className="text-slate-400 font-normal">(Demo: kosongkan untuk menggunakan waktu sekarang)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 07:45 atau 08:15"
                        value={simulatedTime}
                        onChange={(e) => setSimulatedTime(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs bg-white"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block leading-tight">
                        *Jam Masuk Standard: Maksimal 08:00 AM. Di atas 08:00 akan tercatat **Terlambat**.
                      </span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className={`w-full py-2.5 px-4 rounded-lg text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer ${!userTodayLog
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                      {!userTodayLog ? 'KIRIM DATA CHECK IN' : 'KIRIM DATA CHECK OUT'}
                    </button>
                  </form>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-850 p-6 rounded-xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">Absensi Hari Ini Lengkap!</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Anda telah mengirim data Check In dan Check Out untuk tanggal {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}. Terima kasih atas kerja keras Anda hari ini!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right sidebar: Self Attendance Output Details & Personal Logs */}
          <div className="space-y-6">

            {/* Output Details */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
              <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider border-b pb-2">
                OUTPUT ABSENSI HARI INI
              </div>

              {userTodayLog ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block">KEHADIRAN:</span>
                    <span className="text-sm font-bold text-slate-800">
                      {userTodayLog.status} (Sudah Absen)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block">STATUS KETERLAMBATAN:</span>
                    {userTodayLog.isLate ? (
                      <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold font-mono">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        Terlambat {userTodayLog.lateMinutes} Menit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold font-mono">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Tepat Waktu
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-2 border border-slate-100 rounded bg-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Jam Masuk</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">{userTodayLog.checkInTime || '-'}</span>
                    </div>
                    <div className="p-2 border border-slate-100 rounded bg-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Jam Pulang</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">{userTodayLog.checkOutTime || '-'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 text-center py-6">
                  Belum melakukan absensi hari ini. Silakan lengkapi formulir Check In di sebelah kiri.
                </div>
              )}
            </div>

            {/* Attendance Log History */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">
                  HISTORI LOG ABSENSI TERBARU
                </div>
                <a
                  href={OFFICIAL_GOOGLE_DRIVE_ATTENDANCE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold transition-colors inline-flex items-center gap-1"
                >
                  📁 Drive Bukti Absensi ↗
                </a>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {attendanceLogs.length > 0 ? (
                  attendanceLogs.slice(0, 10).map((log) => (
                    <div key={log.id} className="p-3 border border-slate-150 rounded-lg text-xs space-y-1.5 bg-slate-50/50">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">{log.staffName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.date}</span>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono">{log.division} Division</div>

                      <div className="grid grid-cols-2 gap-1 font-mono text-[10px] text-slate-500">
                        <div>In: <strong className="text-slate-700">{log.checkInTime}</strong></div>
                        <div>Out: <strong className="text-slate-700">{log.checkOutTime || '--:--'}</strong></div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[9px] font-bold">{log.status}</span>
                        {log.isLate ? (
                          <span className="text-[9px] text-rose-600 font-bold font-mono">Terlambat {log.lateMinutes}m</span>
                        ) : (
                          <span className="text-[9px] text-emerald-600 font-bold font-mono">Tepat Waktu</span>
                        )}
                        <a
                          href={OFFICIAL_GOOGLE_DRIVE_ATTENDANCE_FOLDER_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] text-indigo-600 hover:text-indigo-800 font-bold underline ml-auto"
                        >
                          Bukti Foto ↗
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 text-center py-8">
                    Belum ada data kehadiran yang tercatat dalam sistem.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW 2: ADMIN 1-31 SCHEDULING GRID */}
      {activeSubTab === 'schedule' && (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">

          {/* Sub-navigation inside Schedule: Mode switcher */}
          {initialScheduleViewMode !== 'job_assignments' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setScheduleViewMode('official')}
                  className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${scheduleViewMode === 'official'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>📅 Schedule Resmi Bulanan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleViewMode('job_assignments')}
                  className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${scheduleViewMode === 'job_assignments'
                    ? 'bg-indigo-600 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>📋 Penugasan Job & Event (Staff & Freelance)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleViewMode('custom')}
                  className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${scheduleViewMode === 'custom'
                    ? 'bg-white text-indigo-600 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Edit className="w-4 h-4" />
                  <span>✏️ Editor Tanggal 1-31 (Custom)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={OFFICIAL_GOOGLE_DRIVE_ATTENDANCE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700 flex items-center gap-1.5 transition-colors"
                  title="Folder Bukti Absensi Google Drive"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Drive Bukti Absensi ↗</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Schedule PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* HEADER PRINT LOGO (Hanya muncul saat dicetak)               */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="hidden print:flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-slate-800 pb-6 mb-6 gap-4">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="RIZ-PRODUCTION Logo" className="h-16 w-auto object-contain print:h-14" />
              <div>
                <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">RIZ-PRODUCTION</h1>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Live Event Equipment & Production Solution</p>
                <p className="text-[10px] text-slate-500 mt-1 max-w-sm">Jl. Alternatif Jl. Tugu Wates No.78, RT.02/RW.13, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat 16164 (CRR3+82 Kedungbadak, Bogor City, West Java)</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Absensi & Jadwal</h2>
              <p className="text-xs text-slate-500 font-medium">Bulan: {getScheduleByKey(activeMonth)?.label || activeMonth}</p>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* MODE 1: OFFICIAL MONTHLY SCHEDULE                          */}
          {/* ────────────────────────────────────────────────────────── */}
          {scheduleViewMode === 'official' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex flex-col md:flex-row gap-2 w-full">
                  <select
                    value={divisionFilter}
                    onChange={(e) => setDivisionFilter(e.target.value)}
                    className="text-xs p-2 border border-slate-200 rounded font-semibold text-slate-700 outline-none w-full md:w-auto min-w-[200px]"
                  >
                    <option value="All">--- Semua Divisi ---</option>
                    <option value="GUDANG">Gudang</option>
                    <option value="LED">Videotron (LED)</option>
                    <option value="ADMIN">Admin / Manajemen</option>
                    <option value="SOUND">Sound / Audio</option>
                    <option value="LIGHTING">Lighting</option>
                    <option value="MULTIMEDIA">Multimedia</option>
                    <option value="SERVICE">Service</option>
                  </select>

                  {onActiveMonthChange && (
                    <select
                      value={activeMonth}
                      onChange={(e) => onActiveMonthChange(e.target.value)}
                      className="text-xs p-2 border border-slate-200 rounded font-semibold text-slate-700 outline-none w-full md:w-auto"
                    >
                      {ALL_MONTHLY_SCHEDULES.map(sch => (
                        <option key={sch.key} value={sch.key}>{sch.label}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 text-[9px] w-full justify-end font-semibold text-slate-500">
                  {Object.values(SHIFT_LEGEND).map(sh => (
                    <span key={sh.code} className={`px-1.5 py-0.5 rounded border ${sh.bg} ${sh.border} ${sh.text}`}>
                      {sh.code} = {sh.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
                <table className="w-full text-[10px] text-left border-collapse min-w-max">
                  <thead>
                    <tr className="bg-slate-800 text-slate-100 uppercase font-black text-center">
                      <th className="p-2 border-r border-slate-600 sticky left-0 bg-slate-800 z-10 whitespace-nowrap" rowSpan={2}>No</th>
                      <th className="p-2 border-r border-slate-600 sticky left-8 bg-slate-800 z-10 whitespace-nowrap" rowSpan={2}>Divisi</th>
                      <th className="p-2 border-r border-slate-600 sticky left-24 bg-slate-800 z-10 whitespace-nowrap" rowSpan={2}>Nama Crew</th>
                      <th className="p-1 border-b border-slate-600" colSpan={getScheduleByKey(activeMonth)?.totalDays || 30}>
                        TANGGAL ({getScheduleByKey(activeMonth)?.label || 'Bulan'})
                      </th>
                    </tr>
                    <tr className="bg-slate-700 text-slate-200 text-[9px] text-center font-bold">
                      {(getScheduleByKey(activeMonth)?.days || generateMonthDays(2026, 9)).map(d => (
                        <th key={d.day} className={`p-1 border border-slate-600 min-w-[28px] ${d.isWeekend ? 'bg-rose-900/40 text-rose-200' : ''}`}>
                          {d.day}<br />
                          <span className="text-[8px] font-normal">{d.dayName}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleData
                      .filter(row => divisionFilter === 'All' || row.division === divisionFilter)
                      .map((row, idx) => (
                        <tr key={row.no} className="border-b border-slate-200 hover:bg-slate-50 transition-colors text-center font-bold">
                          <td className="p-1.5 border-r border-slate-200 text-slate-500 sticky left-0 bg-white group-hover:bg-slate-50 z-10">{idx + 1}</td>
                          <td className="p-1.5 border-r border-slate-200 text-indigo-700 sticky left-8 bg-white group-hover:bg-slate-50 z-10">{row.division}</td>
                          <td className="p-1.5 border-r border-slate-200 text-slate-800 sticky left-24 bg-white group-hover:bg-slate-50 z-10 uppercase whitespace-nowrap text-left pl-2">
                            {row.name}
                          </td>
                          {(getScheduleByKey(activeMonth)?.days || generateMonthDays(2026, 9)).map(d => {
                            const shiftCode = row.shifts[d.day] || '-';
                            const shiftInfo = SHIFT_LEGEND[shiftCode];
                            return (
                              <td
                                key={d.day}
                                className={`p-1 border border-slate-200 text-center ${shiftInfo?.bg || 'bg-white'} ${shiftInfo?.text || 'text-slate-800'} ${d.isWeekend ? 'border-r-rose-200' : ''}`}
                                title={shiftInfo?.timeRange}
                                onClick={() => handleToggleShift(row.no, d.day)}
                              >
                                {shiftCode}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* MODE 1B: JOB & EVENT ASSIGNMENTS (STAFF & FREELANCE)       */}
          {/* ────────────────────────────────────────────────────────── */}
          {scheduleViewMode === 'job_assignments' && (() => {
            const matchesStaffOnJob = (job: JobAssignment, targetStaff: Staff | undefined): boolean => {
              if (!targetStaff) return true;
              const targetId = targetStaff.id;
              const targetNameLower = targetStaff.name.toLowerCase();
              const targetNickLower = (targetStaff.nickname || '').toLowerCase().trim();
              const targetFirstLower = targetStaff.name.split(' ')[0].toLowerCase().trim();
              const picLower = (job.pic || '').toLowerCase();

              // 1. Check if staff is PIC of the job or any section
              if (
                picLower.includes(targetNameLower) ||
                (targetNickLower && picLower.includes(targetNickLower))
              ) {
                return true;
              }

              // 2. Check if staff is in any section's crew or sectionPic
              return job.sections.some(sec => {
                const secPicLower = (sec.sectionPic || '').toLowerCase();
                if (
                  secPicLower.includes(targetNameLower) ||
                  (targetNickLower && secPicLower.includes(targetNickLower))
                ) {
                  return true;
                }
                return sec.crew.some(c => {
                  if (c.staffId && c.staffId === targetId) return true;
                  const cName = c.name.toLowerCase().trim();
                  const cCanon = (c.canonicalName || '').toLowerCase();
                  if (cName === targetNameLower || cCanon.includes(targetNameLower)) return true;
                  if (targetNickLower && (cName === targetNickLower || cCanon.includes(targetNickLower))) return true;
                  if (targetFirstLower.length >= 3 && cName === targetFirstLower) return true;
                  return false;
                });
              });
            };

            const matchesFreelanceOnJob = (job: JobAssignment, freelanceName: string): boolean => {
              if (!freelanceName || freelanceName === 'ALL') return true;
              const flLower = freelanceName.toLowerCase().trim();
              const picLower = (job.pic || '').toLowerCase();
              if (picLower.includes(flLower)) return true;
              return job.sections.some(sec =>
                sec.crew.some(c => {
                  const cName = c.name.toLowerCase().trim();
                  const cCanon = (c.canonicalName || '').toLowerCase();
                  return cName === flLower || cCanon.includes(flLower);
                })
              );
            };

            const selectedStaffObj =
              jobSelectedStaffId === 'ALL'
                ? undefined
                : staffList.find(s => s.id === jobSelectedStaffId) ||
                  STAFF_LIST.find(s => s.id === jobSelectedStaffId);

            const selectedFreelanceObj =
              jobSelectedFreelanceName === 'ALL'
                ? undefined
                : OFFICIAL_FREELANCE_CREW_LIST.find(
                    f => f.name.toLowerCase() === jobSelectedFreelanceName.toLowerCase()
                  );

            const getJobWeekCode = (dateStr: string): 'W1' | 'W2' | 'W3' | 'W4' | 'W5' => {
              const dayNum = Number(String(dateStr || '').slice(8, 10)) || 1;
              if (dayNum <= 7) return 'W1';
              if (dayNum <= 14) return 'W2';
              if (dayNum <= 21) return 'W3';
              if (dayNum <= 28) return 'W4';
              return 'W5';
            };

            const getWeekRangeLabel = (weekCode: 'W1' | 'W2' | 'W3' | 'W4' | 'W5', mKey: string): string => {
              const monthNamesMap: Record<string, { short: string; days: number }> = {
                '2026-01': { short: 'Jan 2026', days: 31 },
                '2026-02': { short: 'Feb 2026', days: 28 },
                '2026-03': { short: 'Mar 2026', days: 31 },
                '2026-04': { short: 'Apr 2026', days: 30 },
                '2026-05': { short: 'Mei 2026', days: 31 },
                '2026-06': { short: 'Jun 2026', days: 30 },
                '2026-07': { short: 'Jul 2026', days: 31 },
                '2026-08': { short: 'Agu 2026', days: 31 },
                '2026-09': { short: 'Sep 2026', days: 30 },
                '2026-10': { short: 'Okt 2026', days: 31 },
                '2026-11': { short: 'Nov 2026', days: 30 },
                '2026-12': { short: 'Des 2026', days: 31 }
              };
              const mInfo = monthNamesMap[mKey] || { short: 'Bulan Aktif', days: 31 };
              const mName = mInfo.short;
              const maxDay = mInfo.days;
              switch (weekCode) {
                case 'W1': return `Minggu 1 (Tgl 1–7 ${mName})`;
                case 'W2': return `Minggu 2 (Tgl 8–14 ${mName})`;
                case 'W3': return `Minggu 3 (Tgl 15–21 ${mName})`;
                case 'W4': return `Minggu 4 (Tgl 22–28 ${mName})`;
                case 'W5': return `Minggu 5 (Tgl 29–${maxDay} ${mName})`;
              }
            };

            const monthFilteredJobs = jobAssignments.filter(job =>
              jobMonthFilter === 'ALL' ? true : job.monthKey === jobMonthFilter
            );

            // Jobs matching month + staff/freelance + division + crewType + search (used to count per-week tabs)
            const baseFilteredJobs = monthFilteredJobs.filter(job => {
              if (selectedStaffObj && !matchesStaffOnJob(job, selectedStaffObj)) {
                return false;
              }
              if (jobSelectedFreelanceName !== 'ALL' && !matchesFreelanceOnJob(job, jobSelectedFreelanceName)) {
                return false;
              }
              if (jobDivisionFilter !== 'All') {
                const hasDiv = job.sections.some(sec => sec.division === jobDivisionFilter);
                if (!hasDiv) return false;
              }
              if (jobCrewTypeFilter !== 'All') {
                const hasCrewType = job.sections.some(sec =>
                  sec.crew.some(c => c.personnelType === jobCrewTypeFilter)
                );
                if (!hasCrewType) return false;
              }
              if (jobSearchQuery.trim()) {
                const q = jobSearchQuery.toLowerCase().trim();
                const inHeader =
                  job.dateLabel.toLowerCase().includes(q) ||
                  job.venue.toLowerCase().includes(q) ||
                  job.pic.toLowerCase().includes(q) ||
                  (job.loadingSchedule || '').toLowerCase().includes(q) ||
                  (job.notes || '').toLowerCase().includes(q);
                const inSections = job.sections.some(sec =>
                  sec.packageLabel.toLowerCase().includes(q) ||
                  sec.equipment.some(eq => eq.toLowerCase().includes(q)) ||
                  sec.crew.some(c => c.name.toLowerCase().includes(q) || (c.canonicalName || '').toLowerCase().includes(q) || (c.roleNote || '').toLowerCase().includes(q)) ||
                  sec.vehicles.some(v => v.toLowerCase().includes(q) || formatFleetVehicleBadge(v).toLowerCase().includes(q))
                );
                if (!inHeader && !inSections) return false;
              }
              return true;
            });

            const weekJobCounts: Record<'W1' | 'W2' | 'W3' | 'W4' | 'W5', number> = {
              W1: 0,
              W2: 0,
              W3: 0,
              W4: 0,
              W5: 0
            };
            baseFilteredJobs.forEach(job => {
              const wk = getJobWeekCode(job.date);
              weekJobCounts[wk] = (weekJobCounts[wk] || 0) + 1;
            });

            // Compute assignment count per staff & freelance for the active week AND full month
            const weekScopedMonthJobs = monthFilteredJobs.filter(job =>
              jobWeekFilter === 'ALL' ? true : getJobWeekCode(job.date) === jobWeekFilter
            );
            const staffJobCounts = new Map<string, number>();
            const monthStaffJobCounts = new Map<string, number>();
            staffList.forEach(st => {
              const wkCnt = weekScopedMonthJobs.filter(j => matchesStaffOnJob(j, st)).length;
              const moCnt = monthFilteredJobs.filter(j => matchesStaffOnJob(j, st)).length;
              staffJobCounts.set(st.id, wkCnt);
              monthStaffJobCounts.set(st.id, moCnt);
            });

            const freelanceJobCounts = new Map<string, number>();
            const monthFreelanceJobCounts = new Map<string, number>();
            OFFICIAL_FREELANCE_CREW_LIST.forEach(fl => {
              const wkCnt = weekScopedMonthJobs.filter(j => matchesFreelanceOnJob(j, fl.name)).length;
              const moCnt = monthFilteredJobs.filter(j => matchesFreelanceOnJob(j, fl.name)).length;
              freelanceJobCounts.set(fl.name, wkCnt);
              monthFreelanceJobCounts.set(fl.name, moCnt);
            });

            const handleSelectStaffPill = (targetStaff: Staff) => {
              if (jobSelectedStaffId === targetStaff.id) {
                setJobSelectedStaffId('ALL');
                return;
              }
              setJobSelectedStaffId(targetStaff.id);
              setJobSelectedFreelanceName('ALL');
              if (jobCrewTypeFilter === 'Freelance') {
                setJobCrewTypeFilter('All');
              }
              const staffMonthJobs = monthFilteredJobs.filter(j => matchesStaffOnJob(j, targetStaff));
              if (jobDivisionFilter !== 'All') {
                const hasInDiv = staffMonthJobs.some(j =>
                  j.sections.some(sec => sec.division === jobDivisionFilter)
                );
                if (!hasInDiv) {
                  setJobDivisionFilter('All');
                }
              }
              if (jobWeekFilter !== 'ALL') {
                const inCurrentWeek = staffMonthJobs.some(j => getJobWeekCode(j.date) === jobWeekFilter);
                if (!inCurrentWeek) {
                  setJobWeekFilter('ALL');
                }
              }
            };

            const handleSelectFreelancePill = (flName: string) => {
              if (jobSelectedFreelanceName.toLowerCase() === flName.toLowerCase()) {
                setJobSelectedFreelanceName('ALL');
                return;
              }
              setJobSelectedFreelanceName(flName);
              setJobSelectedStaffId('ALL');
              if (jobCrewTypeFilter === 'Staff') {
                setJobCrewTypeFilter('All');
              }
              const flMonthJobs = monthFilteredJobs.filter(j => matchesFreelanceOnJob(j, flName));
              if (jobDivisionFilter !== 'All') {
                const hasInDiv = flMonthJobs.some(j =>
                  j.sections.some(sec => sec.division === jobDivisionFilter)
                );
                if (!hasInDiv) {
                  setJobDivisionFilter('All');
                }
              }
              if (jobWeekFilter !== 'ALL') {
                const inCurrentWeek = flMonthJobs.some(j => getJobWeekCode(j.date) === jobWeekFilter);
                if (!inCurrentWeek) {
                  setJobWeekFilter('ALL');
                }
              }
            };

            const filteredJobs = baseFilteredJobs.filter(job =>
              jobWeekFilter === 'ALL' ? true : getJobWeekCode(job.date) === jobWeekFilter
            );

            let totalStaffAssignments = 0;
            let totalFreelanceAssignments = 0;
            const uniqueVehicleSet = new Set<string>();
            filteredJobs.forEach(job => {
              job.sections.forEach(sec => {
                sec.crew.forEach(c => {
                  if (c.personnelType === 'Staff') totalStaffAssignments++;
                  else totalFreelanceAssignments++;
                });
                sec.vehicles.forEach(v => {
                  if (v && v !== '-') uniqueVehicleSet.add(v);
                });
              });
            });

            const getDivisionBadgeStyle = (div: JobDivisionSection['division']) => {
              switch (div) {
                case 'Audio':
                  return 'bg-indigo-100 text-indigo-800 border-indigo-200';
                case 'Videotron':
                  return 'bg-emerald-100 text-emerald-800 border-emerald-200';
                case 'Lighting':
                  return 'bg-amber-100 text-amber-800 border-amber-200';
                case 'Multimedia':
                  return 'bg-purple-100 text-purple-800 border-purple-200';
                case 'Produksi':
                  return 'bg-rose-100 text-rose-800 border-rose-200';
                default:
                  return 'bg-slate-100 text-slate-800 border-slate-200';
              }
            };

            const getJobStatusBadgeStyle = (st?: JobAssignment['status']) => {
              switch (st) {
                case 'Loading / Setup':
                  return 'bg-amber-100 text-amber-800 border-amber-300';
                case 'Berlangsung (Show)':
                  return 'bg-emerald-100 text-emerald-800 border-emerald-300';
                case 'Bongkaran':
                  return 'bg-purple-100 text-purple-800 border-purple-300';
                case 'Selesai':
                  return 'bg-slate-200 text-slate-700 border-slate-300';
                default:
                  return 'bg-blue-50 text-blue-700 border-blue-200';
              }
            };

            const effectiveQuickAssignJob =
              monthFilteredJobs.find(j => j.id === quickAssignJobId) || monthFilteredJobs[0];
            const effectiveQuickAssignSecIdx =
              effectiveQuickAssignJob &&
              quickAssignSectionIdx >= 0 &&
              quickAssignSectionIdx < effectiveQuickAssignJob.sections.length
                ? quickAssignSectionIdx
                : 0;

            return (
              <div className="space-y-5">
                {/* Official Reference Banner */}
                <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl border border-indigo-800/60 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-indigo-500/30 border border-indigo-400/40 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-200">
                        OFFICIAL CREW & JOB SCHEDULE
                      </span>
                      <span className="text-xs text-slate-300 font-mono">
                         Staff Inhouse & Kru Freelance
                      </span>
                    </div>
                    <h3 className="text-base font-black tracking-tight text-white">
                      Jadwal Penugasan Kerja / Job Event (Staff/Crew, Unit Alat, Armada, Lokasi/Venue & PIC)
                    </h3>
                    <p className="text-xs text-slate-300">
                      Sumber Acuan Resmi: Sistem Penjadwalan Aplikasi & Sinkronisasi Google Calendar (Staff Inhouse & Kru Freelance) serta Google Sheet Armada Resmi PT. Riz Production Multi Kreasi.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={isSyncingGcal}
                      onClick={() => handleSyncAllToGoogleCalendar(filteredJobs)}
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors disabled:opacity-60"
                      title={`Sinkronkan seluruh ${filteredJobs.length} jadwal event ke Google Calendar (${gcalConfig.calendarId})`}
                    >
                      <Calendar className={`w-3.5 h-3.5 text-slate-950 ${isSyncingGcal ? 'animate-spin' : ''}`} />
                      <span>
                        {isSyncingGcal
                          ? 'Menyinkronkan...'
                          : `Sync ke Google Calendar (${filteredJobs.length} Job)`}
                      </span>
                    </button>
                    <button
                      type="button"
                      disabled={isSyncingGcal}
                      onClick={handlePullLiveFromGoogleCalendar}
                      className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors disabled:opacity-60"
                      title={`Tarik jadwal event live dari Google Calendar (${gcalConfig.calendarId})`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-slate-950 ${isSyncingGcal ? 'animate-spin' : ''}`} />
                      <span>Tarik dari Google Calendar</span>
                    </button>
                    {canManageJobSchedule && (
                      <label
                        className="px-3 py-2 bg-white/15 hover:bg-white/25 text-white border border-white/25 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        title="Impor jadwal penugasan dari file Google Calendar (.ics)"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
                        <span>Impor File (.ics)</span>
                        <input
                          type="file"
                          accept=".ics,text/calendar"
                          onChange={handleImportGoogleCalendarIcs}
                          className="hidden"
                        />
                      </label>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowGcalVisualCalendar(prev => !prev)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors border ${
                        showGcalVisualCalendar
                          ? 'bg-sky-500 text-slate-950 border-sky-300 font-black'
                          : 'bg-sky-600/40 hover:bg-sky-600/60 text-sky-100 border-sky-400/50'
                      }`}
                      title="Tampilkan Kalender Bulanan Event & Embed Google Calendar"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{showGcalVisualCalendar ? 'Tutup Kalender Visual' : 'Lihat Kalender Event'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGcalSyncPanel(prev => !prev)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors border ${
                        showGcalSyncPanel
                          ? 'bg-white text-indigo-950 border-white font-black'
                          : 'bg-white/10 hover:bg-white/20 text-indigo-100 border-white/20'
                      }`}
                      title="Pengaturan Akun & Auto-Sync Google Calendar"
                    >
                      <span>⚙️ Koneksi GCal ({gcalConfig.calendarId.split('@')[0]})</span>
                    </button>
                    {canManageJobSchedule && (
                      <button
                        type="button"
                        onClick={handleOpenAddJobModal}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Jadwal Job</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Feedback Banner Sinkronisasi Google Calendar */}
                {gcalSyncFeedback && (
                  <div
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                      gcalSyncFeedback.type === 'success'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : gcalSyncFeedback.type === 'warning'
                          ? 'bg-amber-50 border-amber-300 text-amber-900'
                          : 'bg-sky-50 border-sky-300 text-sky-900'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600" />
                      <div>
                        <div className="font-black uppercase tracking-wide text-[11px]">
                          Status Sinkronisasi Google Calendar ({gcalConfig.calendarId})
                        </div>
                        <p className="font-semibold mt-0.5">{gcalSyncFeedback.text}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {gcalSyncFeedback.importUrl && (
                        <a
                          href={gcalSyncFeedback.importUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-black text-xs flex items-center gap-1"
                        >
                          <span>Buka Impor Google Calendar ↗</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setGcalSyncFeedback(null)}
                        className="px-2 py-1 bg-white/80 hover:bg-white rounded border border-slate-300 text-slate-600 font-bold cursor-pointer"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                )}

                {/* Panel Konfigurasi Koneksi Live Google Calendar */}
                {showGcalSyncPanel && (
                  <div className="p-4 bg-white border-2 border-indigo-500 rounded-xl shadow-md space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                          <span>Konfigurasi Sinkronisasi Dua Arah Google Calendar ({gcalConfig.calendarId})</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Hubungkan akun Google Calendar resmi agar seluruh jadwal event, kru staff/freelance, alat, dan armada tersinkronisasi otomatis.
                        </p>
                      </div>
                      {gcalConfig.lastSyncedAt && (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-mono font-bold">
                          Terakhir Sync: {new Date(gcalConfig.lastSyncedAt).toLocaleString('id-ID')} ({gcalConfig.lastSyncCount || 0} Event)
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          ID Google Calendar Resmi (Email / Calendar ID)
                        </label>
                        <input
                          type="text"
                          value={gcalConfig.calendarId}
                          onChange={(e) => {
                            const updated = saveGoogleCalendarSyncConfig({ calendarId: e.target.value });
                            setGcalConfig(updated);
                          }}
                          placeholder="rizproduction78@gmail.com"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs font-bold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          URL Feed iCal Google Calendar (.ics Public / Secret Address)
                        </label>
                        <input
                          type="text"
                          value={gcalConfig.icalFeedUrl}
                          onChange={(e) => {
                            const updated = saveGoogleCalendarSyncConfig({ icalFeedUrl: e.target.value });
                            setGcalConfig(updated);
                          }}
                          placeholder="https://calendar.google.com/calendar/ical/.../basic.ics"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Google OAuth Access Token / Webhook URL (Opsional Push Langsung)
                        </label>
                        <input
                          type="password"
                          value={gcalConfig.accessToken || ''}
                          onChange={(e) => {
                            const updated = saveGoogleCalendarSyncConfig({ accessToken: e.target.value });
                            setGcalConfig(updated);
                          }}
                          placeholder="ya29.a0... (Token Google Calendar API v3)"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                      <label className="inline-flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gcalConfig.autoSyncOnSave}
                          onChange={(e) => {
                            const updated = saveGoogleCalendarSyncConfig({ autoSyncOnSave: e.target.checked });
                            setGcalConfig(updated);
                          }}
                          className="rounded border-slate-300 text-indigo-600"
                        />
                        <span>Otomatis sinkronkan setiap perubahan jadwal penugasan ke Google Calendar</span>
                      </label>

                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={OFFICIAL_GOOGLE_CALENDAR_IMPORT_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-bold flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Halaman Impor Google Calendar ↗</span>
                        </a>
                        <a
                          href={OFFICIAL_GOOGLE_CALENDAR_WEB_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg font-bold flex items-center gap-1"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Buka Google Calendar ({gcalConfig.calendarId}) ↗</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tampilan Kalender Visual Event & Live Embed Google Calendar */}
                {showGcalVisualCalendar && (
                  <div className="p-4 bg-white border-2 border-sky-500 rounded-xl shadow-md space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-sky-600" />
                          <span>
                            Kalender Visual Event & Integrasi Google Calendar ({jobMonthFilter === '2026-12' ? 'Desember 2026' : 'November 2026'})
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500">
                          Klik tombol <strong>+ GCal</strong> pada tanggal mana pun untuk langsung menyimpan event ke Google Calendar ({gcalConfig.calendarId}).
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSyncAllToGoogleCalendar(filteredJobs)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black cursor-pointer flex items-center gap-1.5"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Sync Semua ({filteredJobs.length} Event) ke Google Calendar</span>
                        </button>
                      </div>
                    </div>

                    {/* Grid Kalender Hari 1 - 30/31 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                      {Array.from(
                        { length: jobMonthFilter === '2026-12' ? 31 : 30 },
                        (_, idx) => idx + 1
                      ).map(dayNum => {
                        const targetPrefix = `${jobMonthFilter === 'ALL' ? '2026-11' : jobMonthFilter}-${String(dayNum).padStart(2, '0')}`;
                        const dayJobs = filteredJobs.filter(j => j.date === targetPrefix);
                        return (
                          <div
                            key={dayNum}
                            className={`p-2.5 rounded-xl border min-h-24 flex flex-col justify-between transition-all ${
                              dayJobs.length > 0
                                ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs'
                                : 'bg-slate-50/50 border-slate-200 opacity-75'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-black text-slate-700">
                                Tgl {dayNum}
                              </span>
                              {dayJobs.length > 0 && (
                                <span className="px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[9px] font-mono font-black">
                                  {dayJobs.length} Event
                                </span>
                              )}
                            </div>
                            <div className="space-y-1.5 mt-2">
                              {dayJobs.length === 0 ? (
                                <div className="text-[10px] text-slate-400 italic">Standby Gudang</div>
                              ) : (
                                dayJobs.map(dj => (
                                  <div
                                    key={dj.id}
                                    className="p-1.5 bg-white border border-indigo-200 rounded-lg text-[10px] space-y-1 shadow-2xs"
                                  >
                                    <div className="font-black text-slate-900 truncate" title={dj.venue}>
                                      📍 {dj.venue}
                                    </div>
                                    <div className="text-[9px] text-slate-500 truncate">
                                      PIC: {dj.pic} • {dj.sections.reduce((acc, s) => acc + s.crew.length, 0)} Kru
                                    </div>
                                    <a
                                      href={buildGoogleCalendarEventUrl(dj)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full py-0.5 px-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-[9px] inline-flex items-center justify-center gap-1"
                                    >
                                      <Calendar className="w-2.5 h-2.5" />
                                      <span>+ Sync ke GCal ↗</span>
                                    </a>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Direct Full-Browser Google Calendar Sign-In & Sync Bar (No Blocked Iframe) */}
                    <div className="pt-3 border-t border-slate-200">
                      <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-indigo-600" />
                            <span>Akses & Login Langsung Google Calendar Resmi ({gcalConfig.calendarId})</span>
                          </div>
                          <p className="text-[11px] text-slate-600">
                            Google memblokir halaman Sign-In di dalam bingkai iframe tertanam. Gunakan tombol di samping untuk membuka & masuk ke akun <strong>{gcalConfig.calendarId}</strong> langsung di tab browser penuh atau mengimpor seluruh event sekaligus.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <a
                            href={`https://calendar.google.com/calendar/u/0/r?authuser=${encodeURIComponent(gcalConfig.calendarId)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-2xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Buka & Sign-In Google Calendar ↗</span>
                          </a>
                          <a
                            href={`${OFFICIAL_GOOGLE_CALENDAR_IMPORT_URL}?authuser=${encodeURIComponent(gcalConfig.calendarId)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-2xs"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Halaman Impor (.ics) Google Calendar ↗</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="text-[10px] font-mono uppercase font-bold text-slate-500">Total Jadwal Job / Venue</div>
                    <div className="text-xl font-black text-slate-900 mt-0.5">{filteredJobs.length} <span className="text-xs font-semibold text-slate-500">Event</span></div>
                  </div>
                  <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-xl">
                    <div className="text-[10px] font-mono uppercase font-bold text-indigo-700">Penugasan Staff Inhouse</div>
                    <div className="text-xl font-black text-indigo-950 mt-0.5">{totalStaffAssignments} <span className="text-xs font-semibold text-indigo-600">Penugasan</span></div>
                  </div>
                  <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                    <div className="text-[10px] font-mono uppercase font-bold text-emerald-700">Penugasan Kru Freelance</div>
                    <div className="text-xl font-black text-emerald-950 mt-0.5">{totalFreelanceAssignments} <span className="text-xs font-semibold text-emerald-600">Penugasan</span></div>
                  </div>
                  <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl">
                    <div className="text-[10px] font-mono uppercase font-bold text-amber-800">Armada Mobilisasi Terlibat</div>
                    <div className="text-xl font-black text-amber-950 mt-0.5">{uniqueVehicleSet.size} <span className="text-xs font-semibold text-amber-700">Unit Kendaraan</span></div>
                  </div>
                </div>

                {/* Per 1 Minggu (Weekly) Selector Bar */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        Jadwal Penugasan Kerja Per 1 Minggu (7 Hari):
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-xs font-black">
                        {jobWeekFilter === 'ALL'
                          ? `Semua Minggu (${filteredJobs.length} Job)`
                          : `${getWeekRangeLabel(jobWeekFilter, jobMonthFilter)} — ${filteredJobs.length} Job`}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {([
                      { code: 'W1' as const, title: 'Minggu 1', range: 'Tanggal 1 – 7' },
                      { code: 'W2' as const, title: 'Minggu 2', range: 'Tanggal 8 – 14' },
                      { code: 'W3' as const, title: 'Minggu 3', range: 'Tanggal 15 – 21' },
                      { code: 'W4' as const, title: 'Minggu 4', range: 'Tanggal 22 – 28' },
                      { code: 'W5' as const, title: 'Minggu 5', range: jobMonthFilter === '2026-12' ? 'Tanggal 29 – 31' : 'Tanggal 29 – 30' },
                    ]).map(wk => {
                      const isSelected = jobWeekFilter === wk.code;
                      const cnt = weekJobCounts[wk.code] || 0;
                      return (
                        <button
                          key={wk.code}
                          type="button"
                          onClick={() => setJobWeekFilter(wk.code)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-300'
                              : cnt > 0
                                ? 'bg-slate-50 hover:bg-emerald-50/60 text-slate-800 border-slate-200 hover:border-emerald-300'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-black uppercase">{wk.title}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
                                isSelected
                                  ? 'bg-white text-emerald-800'
                                  : cnt > 0
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {cnt} Job
                            </span>
                          </div>
                          <div className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-emerald-100 font-bold' : 'text-slate-500'}`}>
                            {wk.range}
                          </div>
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => setJobWeekFilter('ALL')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        jobWeekFilter === 'ALL'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-slate-300'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black uppercase">Semua Minggu</span>
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
                            jobWeekFilter === 'ALL' ? 'bg-white text-slate-900' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {baseFilteredJobs.length} Job
                        </span>
                      </div>
                      <div className={`text-[10px] font-mono mt-1 ${jobWeekFilter === 'ALL' ? 'text-slate-300 font-bold' : 'text-slate-500'}`}>
                        Full 1 Bulan (Tgl 1–{jobMonthFilter === '2026-12' ? '31' : '30'})
                      </div>
                    </button>
                  </div>
                </div>

                {/* Staff & Freelance Name Filter Bar + Quick Admin Scheduling */}
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <User className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                        Filter & Pilih Penugasan Sesuai Nama Staff / Freelance:
                      </span>
                      {selectedStaffObj ? (
                        <span className="px-2.5 py-0.5 bg-indigo-600 text-white rounded-full text-xs font-black">
                          Staff: {selectedStaffObj.name}{selectedStaffObj.nickname ? ` (${selectedStaffObj.nickname})` : ''} — {filteredJobs.length} Job
                        </span>
                      ) : selectedFreelanceObj ? (
                        <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full text-xs font-black">
                          Freelance: {selectedFreelanceObj.name} ({selectedFreelanceObj.division}) — {filteredJobs.length} Job
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-slate-800 text-white rounded-full text-xs font-bold">
                          Semua Staff & Freelance ({filteredJobs.length} Job)
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const activePersonName = selectedStaffObj
                            ? selectedStaffObj.name
                            : selectedFreelanceObj
                              ? selectedFreelanceObj.name
                              : 'ALL';
                          const activePersonType = selectedStaffObj
                            ? ('Staff' as const)
                            : selectedFreelanceObj
                              ? ('Freelance' as const)
                              : undefined;
                          downloadJobAssignmentsIcs(filteredJobs, {
                            filterPersonName: activePersonName,
                            filterPersonType: activePersonType,
                            filterDivision: jobDivisionFilter
                          });
                        }}
                        className="px-3 py-1 rounded-lg text-xs font-black cursor-pointer transition-all border bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-600 shadow-2xs flex items-center gap-1"
                        title="Sinkronkan & unduh jadwal penugasan personil ini ke Google Calendar (.ics)"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          Sync Google Calendar {selectedStaffObj ? `(${selectedStaffObj.nickname || selectedStaffObj.name.split(' ')[0]})` : selectedFreelanceObj ? `(${selectedFreelanceObj.name})` : '(Semua Kru)'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectStaffPill(currentUser)}
                        className={`px-3 py-1 rounded-lg text-xs font-black cursor-pointer transition-all border ${
                          jobSelectedStaffId === currentUser.id
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                            : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                        }`}
                      >
                        👤 Jadwal Saya ({currentUser.nickname || currentUser.name.split(' ')[0]}: {monthStaffJobCounts.get(currentUser.id) || 0})
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowFreelanceFilterPills(prev => !prev)}
                        className={`px-3 py-1 rounded-lg text-xs font-black cursor-pointer transition-all border ${
                          showFreelanceFilterPills || jobCrewTypeFilter === 'Freelance' || jobSelectedFreelanceName !== 'ALL'
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                            : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        🤝 Pilih Kru Freelance ({OFFICIAL_FREELANCE_CREW_LIST.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setJobSelectedStaffId('ALL');
                          setJobSelectedFreelanceName('ALL');
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                          jobSelectedStaffId === 'ALL' && jobSelectedFreelanceName === 'ALL'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        📋 Semua Jadwal ({weekScopedMonthJobs.length})
                      </button>
                    </div>
                  </div>

                  {/* Quick Staff Inhouse Pills — All 21 Staff Always Active & Selectable */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono font-bold uppercase text-indigo-900">
                      Daftar Staff Inhouse (Klik nama staff untuk melihat / menjadwalkan penugasan):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {staffList
                        .filter(st => st.id !== 'director-wahyu')
                        .map(st => {
                          const wkCount = staffJobCounts.get(st.id) || 0;
                          const moCount = monthStaffJobCounts.get(st.id) || 0;
                          const displayCount = jobWeekFilter === 'ALL' ? moCount : wkCount;
                          const isSelected = jobSelectedStaffId === st.id;
                          const shortLabel = st.nickname ? `${st.nickname} (${st.name.split(' ')[0]})` : st.name;
                          return (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => handleSelectStaffPill(st)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                                isSelected
                                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs ring-2 ring-indigo-300'
                                  : displayCount > 0
                                    ? 'bg-white text-slate-900 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50'
                                    : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50'
                              }`}
                              title={`${st.name} (${st.division}) — Minggu ini: ${wkCount} Job | Total Bulan ini: ${moCount} Job (Klik untuk pilih / jadwalkan)`}
                            >
                              <span>{shortLabel}</span>
                              <span
                                className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-black ${
                                  isSelected
                                    ? 'bg-white text-indigo-700'
                                    : displayCount > 0
                                      ? 'bg-indigo-100 text-indigo-800'
                                      : moCount > 0
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {jobWeekFilter !== 'ALL' && wkCount === 0 && moCount > 0 ? `${moCount} Bln` : displayCount}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {/* Quick Freelance Crew Pills (Shown when toggled or when Hanya Kru Freelance is selected) */}
                  {(showFreelanceFilterPills || jobCrewTypeFilter === 'Freelance' || jobSelectedFreelanceName !== 'ALL') && (
                    <div className="pt-2 border-t border-indigo-200/70 space-y-1.5">
                      <div className="text-[10px] font-mono font-bold uppercase text-emerald-900 flex items-center justify-between">
                        <span>Daftar Kru Freelance Resmi (Klik nama freelance untuk melihat / menjadwalkan penugasan):</span>
                        {jobSelectedFreelanceName !== 'ALL' && (
                          <button
                            type="button"
                            onClick={() => setJobSelectedFreelanceName('ALL')}
                            className="text-[10px] text-rose-600 hover:underline font-bold cursor-pointer"
                          >
                            Reset Pilihan Freelance ×
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                        {OFFICIAL_FREELANCE_CREW_LIST.map(fl => {
                          const wkCount = freelanceJobCounts.get(fl.name) || 0;
                          const moCount = monthFreelanceJobCounts.get(fl.name) || 0;
                          const displayCount = jobWeekFilter === 'ALL' ? moCount : wkCount;
                          const isSelected = jobSelectedFreelanceName.toLowerCase() === fl.name.toLowerCase();
                          return (
                            <button
                              key={fl.id}
                              type="button"
                              onClick={() => handleSelectFreelancePill(fl.name)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                                isSelected
                                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-300'
                                  : displayCount > 0
                                    ? 'bg-white text-slate-900 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50'
                                    : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-400 hover:bg-emerald-50'
                              }`}
                              title={`${fl.canonicalName} (Freelance ${fl.division}) — Minggu ini: ${wkCount} Job | Total Bulan ini: ${moCount} Job`}
                            >
                              <span>{fl.name}</span>
                              <span
                                className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-black ${
                                  isSelected
                                    ? 'bg-white text-emerald-700'
                                    : displayCount > 0
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : moCount > 0
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {jobWeekFilter !== 'ALL' && wkCount === 0 && moCount > 0 ? `${moCount} Bln` : displayCount}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Admin Quick-Schedule Bar when a Staff or Freelance is selected */}
                  {canManageJobSchedule && (selectedStaffObj || selectedFreelanceObj) && effectiveQuickAssignJob && (
                    <div className="pt-2.5 border-t border-indigo-200/80 bg-white/90 p-3 rounded-xl border flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-mono font-black uppercase">
                          ADMIN QUICK SCHEDULE
                        </span>
                        <span>
                          Jadwalkan{' '}
                          <strong className="text-indigo-700">
                            {selectedStaffObj
                              ? `${selectedStaffObj.nickname || selectedStaffObj.name} (Staff ${selectedStaffObj.division})`
                              : `${selectedFreelanceObj?.name} (Freelance ${selectedFreelanceObj?.division})`}
                          </strong>{' '}
                          ke Event:
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={effectiveQuickAssignJob.id}
                          onChange={(e) => {
                            setQuickAssignJobId(e.target.value);
                            setQuickAssignSectionIdx(0);
                          }}
                          className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800 outline-none"
                        >
                          {monthFilteredJobs.map(j => (
                            <option key={j.id} value={j.id}>
                              {j.date} — {j.venue} ({j.dateLabel})
                            </option>
                          ))}
                        </select>

                        <select
                          value={effectiveQuickAssignSecIdx}
                          onChange={(e) => setQuickAssignSectionIdx(Number(e.target.value))}
                          className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800 outline-none"
                        >
                          {effectiveQuickAssignJob.sections.map((s, idx) => (
                            <option key={idx} value={idx}>
                              Divisi {s.division} ({s.packageLabel})
                            </option>
                          ))}
                        </select>

                        <input
                          type="text"
                          value={quickAssignRoleNote}
                          onChange={(e) => setQuickAssignRoleNote(e.target.value)}
                          placeholder="Catatan tugas (opsional, misal: Campers / Pasang)"
                          className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium text-slate-800 w-56 outline-none focus:border-indigo-500"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const personName = selectedStaffObj
                              ? selectedStaffObj.nickname?.split('/')[0].trim() || selectedStaffObj.name
                              : selectedFreelanceObj?.name || '';
                            if (!personName) return;
                            handleToggleCrewInJobSection(
                              effectiveQuickAssignJob,
                              effectiveQuickAssignSecIdx,
                              personName,
                              quickAssignRoleNote
                            );
                            setQuickAssignRoleNote('');
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Jadwalkan ke Event Ini</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex flex-wrap items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => {
                          setJobMonthFilter('2026-10');
                          if (onActiveMonthChange) onActiveMonthChange('2026-10');
                        }}
                        className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${jobMonthFilter === '2026-10' ? 'bg-indigo-600 text-white font-black' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        Oktober 2026
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setJobMonthFilter('2026-11');
                          if (onActiveMonthChange) onActiveMonthChange('2026-11');
                        }}
                        className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${jobMonthFilter === '2026-11' ? 'bg-indigo-600 text-white font-black' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        November 2026
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setJobMonthFilter('2026-12');
                          if (onActiveMonthChange) onActiveMonthChange('2026-12');
                        }}
                        className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${jobMonthFilter === '2026-12' ? 'bg-indigo-600 text-white font-black' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        Desember 2026
                      </button>
                      <button
                        type="button"
                        onClick={() => setJobMonthFilter('ALL')}
                        className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${jobMonthFilter === 'ALL' ? 'bg-indigo-600 text-white font-black' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        Semua Bulan ({jobAssignments.length})
                      </button>
                    </div>

                    <select
                      value={jobMonthFilter}
                      onChange={(e) => {
                        const val = e.target.value;
                        setJobMonthFilter(val);
                        if (val !== 'ALL' && onActiveMonthChange) {
                          onActiveMonthChange(val);
                        }
                      }}
                      className="text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg font-bold text-indigo-900 outline-none cursor-pointer"
                      title="Pilih Bulan Jadwal Google Calendar (Januari - Desember 2026)"
                    >
                      <option value="ALL">📅 Semua Bulan Google Calendar ({jobAssignments.length} Event)</option>
                      <option value="2026-01">Januari 2026</option>
                      <option value="2026-02">Februari 2026</option>
                      <option value="2026-03">Maret 2026</option>
                      <option value="2026-04">April 2026</option>
                      <option value="2026-05">Mei 2026</option>
                      <option value="2026-06">Juni 2026</option>
                      <option value="2026-07">Juli 2026</option>
                      <option value="2026-08">Agustus 2026</option>
                      <option value="2026-09">September 2026</option>
                      <option value="2026-10">Oktober 2026</option>
                      <option value="2026-11">November 2026</option>
                      <option value="2026-12">Desember 2026</option>
                    </select>

                    <select
                      value={jobDivisionFilter}
                      onChange={(e) => setJobDivisionFilter(e.target.value)}
                      className="text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 outline-none cursor-pointer"
                    >
                      <option value="All">Semua Divisi Alat</option>
                      <option value="Audio">Audio / Sound</option>
                      <option value="Videotron">Videotron / LED</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Multimedia">Multimedia / Stream</option>
                      <option value="Produksi">Produksi</option>
                    </select>

                    <select
                      value={jobCrewTypeFilter}
                      onChange={(e) => {
                        const nextType = e.target.value as 'All' | 'Staff' | 'Freelance';
                        setJobCrewTypeFilter(nextType);
                        if (nextType === 'Freelance') {
                          setJobSelectedStaffId('ALL');
                          setShowFreelanceFilterPills(true);
                        } else if (nextType === 'Staff') {
                          setJobSelectedFreelanceName('ALL');
                        }
                      }}
                      className="text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 outline-none cursor-pointer"
                    >
                      <option value="All">Semua Personil (Staff + Freelance)</option>
                      <option value="Staff">Hanya Staff Inhouse</option>
                      <option value="Freelance">Hanya Kru Freelance</option>
                    </select>
                  </div>

                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={jobSearchQuery}
                      onChange={(e) => setJobSearchQuery(e.target.value)}
                      placeholder="Cari staff/freelance, lokasi/venue, unit alat, armada, PIC..."
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Job Assignment Cards List Grouped Per 1 Minggu */}
                <div className="space-y-6">
                  {(['W1', 'W2', 'W3', 'W4', 'W5'] as const)
                    .filter(wk => (jobWeekFilter === 'ALL' ? true : wk === jobWeekFilter))
                    .map(wkCode => {
                      const jobsInWeek = filteredJobs.filter(j => getJobWeekCode(j.date) === wkCode);
                      if (jobsInWeek.length === 0) return null;
                      return (
                        <div key={wkCode} className="space-y-3">
                          {/* Weekly Section Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-xs">
                            <div className="flex items-center gap-2.5">
                              <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 rounded-md text-xs font-mono font-black uppercase">
                                {wkCode}
                              </span>
                              <span className="text-sm font-black tracking-tight">
                                {getWeekRangeLabel(wkCode, jobMonthFilter)}
                              </span>
                            </div>
                            <span className="text-xs font-mono font-bold text-emerald-300">
                              {jobsInWeek.length} Jadwal Penugasan Job
                            </span>
                          </div>

                          <div className="space-y-4">
                            {jobsInWeek.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white border border-slate-200 rounded-xl shadow-2xs hover:shadow-md transition-shadow overflow-hidden"
                    >
                      {/* Top Bar: Date, Venue, Loading, PIC, Status & Actions */}
                      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-1 bg-slate-900 text-white rounded-md text-xs font-mono font-black">
                              {job.date}
                            </span>
                            <h4 className="text-sm md:text-base font-black text-slate-900 tracking-tight">
                              {job.dateLabel}
                            </h4>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-full text-[11px] font-bold">
                              <MapPin className="w-3 h-3 text-indigo-600" />
                              {job.venue}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
                            {job.loadingSchedule && (
                              <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                                <Clock className="w-3 h-3 text-amber-600" />
                                Loading / Berangkat: {job.loadingSchedule}
                              </span>
                            )}

                            {/* Editable PIC Badge for Admin */}
                            {editingPicJobId === job.id && canManageJobSchedule ? (
                              <div className="inline-flex flex-wrap items-center gap-1.5 bg-white border border-indigo-300 p-1 rounded-lg shadow-xs">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-1" />
                                <span className="text-[11px] font-bold text-slate-700">PIC:</span>
                                <select
                                  value=""
                                  onChange={(e) => {
                                    if (e.target.value) setEditingPicValue(e.target.value);
                                  }}
                                  className="text-[11px] px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 rounded font-bold text-indigo-900 outline-none cursor-pointer"
                                >
                                  <option value="">-- Pilih Staff / Freelance --</option>
                                  <optgroup label="Staff Inhouse">
                                    {staffList.map(st => {
                                      const label = st.nickname ? `${st.nickname} (${st.name})` : st.name;
                                      return (
                                        <option key={st.id} value={label}>
                                          {label} — {st.division}
                                        </option>
                                      );
                                    })}
                                  </optgroup>
                                  <optgroup label="Kru Freelance">
                                    {OFFICIAL_FREELANCE_CREW_LIST.map(fl => (
                                      <option key={fl.id} value={fl.name}>
                                        {fl.name} ({fl.division})
                                      </option>
                                    ))}
                                  </optgroup>
                                </select>
                                <input
                                  type="text"
                                  value={editingPicValue}
                                  onChange={(e) => setEditingPicValue(e.target.value)}
                                  className="text-xs px-2 py-0.5 border border-slate-300 rounded font-bold text-slate-800 w-44 outline-none focus:border-indigo-500"
                                  placeholder="Nama PIC..."
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateJobPic(job, editingPicValue)}
                                  className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[11px] font-black cursor-pointer"
                                >
                                  Simpan
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingPicJobId(null)}
                                  className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-bold cursor-pointer"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <span
                                onClick={() => {
                                  if (canManageJobSchedule) {
                                    setEditingPicJobId(job.id);
                                    setEditingPicValue(job.pic || '');
                                  }
                                }}
                                className={`inline-flex items-center gap-1 font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-0.5 rounded shadow-2xs ${
                                  canManageJobSchedule ? 'cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/40' : ''
                                }`}
                                title={canManageJobSchedule ? 'Klik untuk ubah / pilih Person in Charge (PIC)' : undefined}
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                Person in Charge (PIC): <span className="text-indigo-700 uppercase">{job.pic || '-'}</span>
                                {canManageJobSchedule && (
                                  <Edit className="w-3 h-3 text-slate-400 ml-1" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                          {/* Google Calendar Sync Status Badge */}
                          <span
                            className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-mono font-black flex items-center gap-1"
                            title={
                              job.gcalLastSyncedAt
                                ? `Tersinkron ke Google Calendar (${gcalConfig.calendarId}) pada ${new Date(job.gcalLastSyncedAt).toLocaleString('id-ID')}`
                                : `Tersedia di Feed Sinkronisasi Google Calendar (${gcalConfig.calendarId})`
                            }
                          >
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Synced GCal</span>
                          </span>

                          {/* Admin Assessment Status Badge */}
                          <span
                            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-black border flex items-center gap-1 ${
                              job.adminAssessmentStatus === 'Perlu Revisi Teknis/Kru'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : job.adminAssessmentStatus === 'Selesai & Dievaluasi'
                                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                                  : 'bg-indigo-50 text-indigo-900 border-indigo-200'
                            }`}
                            title={
                              job.adminAssessedBy
                                ? `Di-assessment oleh ${job.adminAssessedBy}${job.adminAssessedAt ? ` (${new Date(job.adminAssessedAt).toLocaleString('id-ID')})` : ''}`
                                : 'Status Assessment Admin untuk Unit Alat/Spesifikasi Teknis & Penugasan Kru'
                            }
                          >
                            <ShieldCheck className="w-3 h-3 text-indigo-600" />
                            <span>{job.adminAssessmentStatus || 'Terverifikasi Admin (Approved)'}</span>
                          </span>

                          {canManageJobSchedule && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenAssessmentModal(job)}
                                className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                                title="Buka Panel Assessment Admin: Verifikasi Unit Alat / Spesifikasi Teknis & Penugasan Staff / Crew Freelance"
                              >
                                <ClipboardList className="w-3.5 h-3.5 text-slate-950" />
                                <span>📋 Assessment Admin (Alat & Crew)</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleQuickApproveEventAssessment(job, false)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
                                title="1-Klik Approve Assessment Spesifikasi Teknis & Penugasan Kru + Auto-Sync Google Calendar"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve Spek & Crew</span>
                              </button>
                            </>
                          )}

                          <a
                            href={buildGoogleCalendarEventUrl(job, {
                              filterPersonName: selectedStaffObj
                                ? selectedStaffObj.name
                                : selectedFreelanceObj
                                  ? selectedFreelanceObj.name
                                  : 'ALL',
                              filterPersonType: selectedStaffObj
                                ? 'Staff'
                                : selectedFreelanceObj
                                  ? 'Freelance'
                                  : undefined,
                              filterDivision: jobDivisionFilter
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                            title="Tambahkan / sinkronkan jadwal penugasan job ini (lengkap dengan hasil assessment kru, alat, armada, venue & PIC) ke Google Calendar"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Sync ke Google Calendar ↗</span>
                          </a>

                          <select
                            value={job.status || 'Terjadwal'}
                            onChange={(e) => handleUpdateJobStatus(job, e.target.value as JobAssignment['status'])}
                            className={`text-xs font-extrabold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer ${getJobStatusBadgeStyle(job.status)}`}
                          >
                            <option value="Terjadwal">📅 Terjadwal</option>
                            <option value="Loading / Setup">🚚 Loading / Setup</option>
                            <option value="Berlangsung (Show)">🎬 Berlangsung (Show)</option>
                            <option value="Bongkaran">📦 Bongkaran</option>
                            <option value="Selesai">✅ Selesai</option>
                          </select>

                          {canManageJobSchedule && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenEditJobModal(job, 0)}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                                title="Edit Jadwal Penugasan"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Edit Job</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteJobAssignment(job)}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold cursor-pointer"
                                title="Hapus Jadwal Penugasan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Admin Assessment Summary Note Banner (if present) */}
                      {job.adminAssessmentNote && (
                        <div className="px-4 py-2 bg-indigo-50/90 border-b border-indigo-200 flex items-start justify-between gap-2 text-xs text-indigo-950">
                          <div className="flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-black uppercase tracking-wider mr-1.5">
                                Catatan Assessment Admin ({job.adminAssessedBy || 'Admin'}):
                              </span>
                              <span className="font-semibold">{job.adminAssessmentNote}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Special Venue / Dresscode Notes */}
                      {job.notes && (
                        <div className="px-4 py-2.5 bg-amber-50/90 border-b border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-black uppercase tracking-wider mr-1.5">Catatan / SOP Venue:</span>
                            <span className="font-semibold">{job.notes}</span>
                          </div>
                        </div>
                      )}

                      {/* Division Sections Grid */}
                      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {job.sections.map((sec, sIdx) => {
                          const pickerKey = `${job.id}::${sIdx}`;
                          const isPickerOpen = activeCrewPickerKey === pickerKey;
                          const searchLower = crewPickerSearch.toLowerCase().trim();
                          const isEquipPickerOpen = activeEquipPickerKey === pickerKey;
                          const equipSearchLower = equipPickerSearch.toLowerCase().trim();
                          const filteredSectionInventory = inventoryAssets.filter(asset => {
                            if (equipPickerDivFilter !== 'ALL' && asset.division !== equipPickerDivFilter) {
                              return false;
                            }
                            if (!equipSearchLower) return true;
                            const typeInfo = getInventoryAssetTypeInfo(asset);
                            return (
                              asset.name.toLowerCase().includes(equipSearchLower) ||
                              asset.code.toLowerCase().includes(equipSearchLower) ||
                              typeInfo.typeGroup.toLowerCase().includes(equipSearchLower)
                            );
                          });

                          return (
                          <div
                            key={`${job.id}-sec-${sIdx}`}
                            className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/40 space-y-3 flex flex-col justify-between"
                          >
                            <div className="space-y-3">
                              {/* Package Header */}
                              <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 text-[10px] font-mono font-black uppercase rounded border ${getDivisionBadgeStyle(sec.division)}`}>
                                    {sec.division}
                                  </span>
                                  <span className="text-xs font-black text-slate-900">
                                    {sec.packageLabel}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono font-semibold text-slate-500">
                                    {sec.crew.length} Crew • {sec.equipment.length} Alat
                                  </span>
                                  <a
                                    href={buildGoogleCalendarSectionEventUrl(job, sec)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 flex items-center gap-1"
                                    title={`Tambahkan jadwal divisi ${sec.division} (${sec.packageLabel}) ke Google Calendar`}
                                  >
                                    <Calendar className="w-2.5 h-2.5" />
                                    <span>+Google Cal</span>
                                  </a>
                                  {canManageJobSchedule && (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditJobModal(job, sIdx)}
                                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 px-1.5 py-0.5 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 cursor-pointer"
                                      title="Edit Paket & Alat Divisi Ini"
                                    >
                                      Edit Paket
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* 1. Unit Alat (Equipment Manifest - Selectable & Assessable by Admin) */}
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center justify-between gap-1.5">
                                  <div className="text-[10px] font-mono uppercase font-bold text-slate-500 flex items-center gap-1">
                                    <Package className="w-3 h-3 text-indigo-600" />
                                    <span>Unit Alat & Spesifikasi Teknis:</span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {canManageJobSchedule ? (
                                      <select
                                        value={sec.specAssessmentStatus || 'Sesuai Spesifikasi (Approved)'}
                                        onChange={(e) =>
                                          handleUpdateSectionSpecAssessment(
                                            job,
                                            sIdx,
                                            e.target.value as NonNullable<JobDivisionSection['specAssessmentStatus']>
                                          )
                                        }
                                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border outline-none cursor-pointer ${
                                          sec.specAssessmentStatus === 'Perlu Penyesuaian Spek'
                                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                                            : sec.specAssessmentStatus === 'Belum Assessment'
                                              ? 'bg-slate-100 text-slate-700 border-slate-300'
                                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                        }`}
                                        title="Status Assessment Spesifikasi Teknis Divisi oleh Admin"
                                      >
                                        <option value="Sesuai Spesifikasi (Approved)">✓ Spek Approved</option>
                                        <option value="Lengkap & Siap Loading">📦 Lengkap & Siap Loading</option>
                                        <option value="Perlu Penyesuaian Spek">⚠ Perlu Penyesuaian Spek</option>
                                        <option value="Belum Assessment">⏳ Belum Assessment</option>
                                      </select>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                        {sec.specAssessmentStatus || '✓ Spek Approved'}
                                      </span>
                                    )}
                                    {canManageJobSchedule && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (isEquipPickerOpen) {
                                            setActiveEquipPickerKey(null);
                                          } else {
                                            setActiveEquipPickerKey(pickerKey);
                                            setEquipPickerDivFilter(mapSectionDivToAssetDiv(sec.division));
                                            setEquipPickerSearch('');
                                            setEquipPickerQty('');
                                            setEquipPickerManualText('');
                                          }
                                        }}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black cursor-pointer transition-all flex items-center gap-1 border ${
                                          isEquipPickerOpen
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 shadow-2xs'
                                        }`}
                                      >
                                        {isEquipPickerOpen ? (
                                          <>
                                            <X className="w-3 h-3" />
                                            <span>Tutup Pilihan Alat</span>
                                          </>
                                        ) : (
                                          <>
                                            <Plus className="w-3 h-3" />
                                            <span>Pilih Inventory / Tulis Manual</span>
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {sec.specAssessmentNote && (
                                  <div className="px-2.5 py-1 bg-indigo-50/70 border border-indigo-200 rounded text-[10px] font-semibold text-indigo-900">
                                    📋 Catatan Spek Admin: {sec.specAssessmentNote}
                                  </div>
                                )}

                                {sec.equipment.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5">
                                    {sec.equipment.map((eq, eqIdx) => {
                                      const equipBadgeKey = `${job.id}::${sIdx}::${eqIdx}`;
                                      const isEditingThisEquip = editingEquipBadgeKey === equipBadgeKey;
                                      const eqAssess = sec.equipmentAssessments?.[eq];
                                      const eqStatus = eqAssess?.status || 'Sesuai Spek';
                                      const matchedInvAsset = inventoryAssets.find(
                                        a =>
                                          a.name.toLowerCase().trim() === eq.toLowerCase().trim() ||
                                          getBaseInventoryAssetName(a.name).toLowerCase() ===
                                            getBaseInventoryAssetName(eq).toLowerCase()
                                      );

                                      if (isEditingThisEquip && canManageJobSchedule) {
                                        return (
                                          <div
                                            key={eqIdx}
                                            className="w-full p-2.5 bg-white border-2 border-indigo-500 rounded-xl shadow-sm space-y-2"
                                          >
                                            <div className="flex items-center justify-between">
                                              <span className="text-[10px] font-mono font-black uppercase text-indigo-700">
                                                Assessment & Edit Unit Alat / Spesifikasi Teknis
                                              </span>
                                              <button
                                                type="button"
                                                onClick={() => setEditingEquipBadgeKey(null)}
                                                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                                              >
                                                Batal
                                              </button>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                              <select
                                                value=""
                                                onChange={(e) => {
                                                  if (e.target.value) {
                                                    setEditingEquipValue(e.target.value);
                                                  }
                                                }}
                                                className="px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                                              >
                                                <option value="">-- Ganti dari Daftar Inventory Gudang --</option>
                                                {(['Sound', 'Lighting', 'Multimedia', 'Videotron'] as const).map(divName => (
                                                  <optgroup key={divName} label={`Inventory Divisi ${divName}`}>
                                                    {inventoryAssets
                                                      .filter(a => a.division === divName)
                                                      .map(a => (
                                                        <option key={a.id} value={a.name}>
                                                          {a.name} [{a.code}]
                                                        </option>
                                                      ))}
                                                  </optgroup>
                                                ))}
                                              </select>
                                              <input
                                                type="text"
                                                value={editingEquipValue}
                                                onChange={(e) => setEditingEquipValue(e.target.value)}
                                                placeholder="Atau tulis manual nama unit alat / spesifikasi..."
                                                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                                              />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                                              <select
                                                value={editingEquipAssessmentStatus}
                                                onChange={(e) =>
                                                  setEditingEquipAssessmentStatus(
                                                    e.target.value as typeof editingEquipAssessmentStatus
                                                  )
                                                }
                                                className="px-2 py-1.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-black text-emerald-900"
                                              >
                                                <option value="Sesuai Spek">✓ Sesuai Spek (Approved)</option>
                                                <option value="Perlu Penyesuaian">⚠ Perlu Penyesuaian Spek</option>
                                                <option value="Backup / Sub-Vendor">🔄 Backup / Sub-Vendor</option>
                                                <option value="Pending Cek">⏳ Pending Cek Gudang</option>
                                              </select>
                                              <input
                                                type="text"
                                                value={editingEquipQtyVerified}
                                                onChange={(e) => setEditingEquipQtyVerified(e.target.value)}
                                                placeholder="Qty / Spek Terverifikasi (misal: 4 Unit Ready)"
                                                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                                              />
                                              <input
                                                type="text"
                                                value={editingEquipTechnicalNote}
                                                onChange={(e) => setEditingEquipTechnicalNote(e.target.value)}
                                                placeholder="Catatan Assessment Teknis Admin..."
                                                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                                              />
                                            </div>
                                            <div className="flex items-center justify-end gap-1.5">
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleUpdateEquipmentInSection(
                                                    job,
                                                    sIdx,
                                                    eqIdx,
                                                    editingEquipValue,
                                                    editingEquipAssessmentStatus,
                                                    editingEquipQtyVerified,
                                                    editingEquipTechnicalNote
                                                  )
                                                }
                                                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-black cursor-pointer"
                                              >
                                                Simpan Assessment Alat
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      }

                                      return (
                                        <span
                                          key={eqIdx}
                                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border rounded-md text-[11px] font-semibold text-slate-800 shadow-2xs transition-all ${
                                            eqStatus === 'Perlu Penyesuaian'
                                              ? 'border-amber-300 bg-amber-50/50'
                                              : matchedInvAsset
                                                ? 'border-indigo-200 bg-indigo-50/40'
                                                : 'border-slate-200'
                                          }`}
                                        >
                                          <button
                                            type="button"
                                            disabled={!canManageJobSchedule}
                                            onClick={() => {
                                              if (!canManageJobSchedule) return;
                                              setEditingEquipBadgeKey(equipBadgeKey);
                                              setEditingEquipValue(eq);
                                              setEditingEquipAssessmentStatus(eqAssess?.status || 'Sesuai Spek');
                                              setEditingEquipQtyVerified(eqAssess?.qtyVerified || '');
                                              setEditingEquipTechnicalNote(eqAssess?.technicalNote || '');
                                            }}
                                            className={`inline-flex items-center gap-1.5 text-left ${
                                              canManageJobSchedule ? 'cursor-pointer hover:underline' : ''
                                            }`}
                                            title={
                                              canManageJobSchedule
                                                ? 'Klik untuk Assessment Spesifikasi Teknis / Edit Unit Alat ini'
                                                : eq
                                            }
                                          >
                                            <span>• {eq}</span>
                                            {matchedInvAsset && (
                                              <span className="px-1 py-0.2 rounded text-[9px] font-mono font-black uppercase bg-indigo-100 text-indigo-700">
                                                INV
                                              </span>
                                            )}
                                            {eqAssess?.qtyVerified && (
                                              <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-sky-100 text-sky-800">
                                                {eqAssess.qtyVerified}
                                              </span>
                                            )}
                                            {eqAssess?.technicalNote && (
                                              <span className="px-1 py-0.2 rounded text-[9px] font-mono font-semibold bg-amber-100 text-amber-900">
                                                {eqAssess.technicalNote}
                                              </span>
                                            )}
                                          </button>
                                          {canManageJobSchedule && (
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleCycleEquipmentAssessmentStatus(job, sIdx, eq);
                                              }}
                                              className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-black cursor-pointer border ${
                                                eqStatus === 'Sesuai Spek'
                                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                                  : eqStatus === 'Perlu Penyesuaian'
                                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                                    : eqStatus === 'Backup / Sub-Vendor'
                                                      ? 'bg-purple-100 text-purple-800 border-purple-300'
                                                      : 'bg-slate-100 text-slate-600 border-slate-300'
                                              }`}
                                              title="Klik untuk ubah cepat status Assessment Spesifikasi Unit Alat"
                                            >
                                              {eqStatus === 'Sesuai Spek'
                                                ? '✓ Spek OK'
                                                : eqStatus === 'Perlu Penyesuaian'
                                                  ? '⚠ Revisi'
                                                  : eqStatus === 'Backup / Sub-Vendor'
                                                    ? '🔄 Sub/Backup'
                                                    : '⏳ Cek'}
                                            </button>
                                          )}
                                          {canManageJobSchedule && (
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveEquipmentFromSection(job, sIdx, eqIdx);
                                              }}
                                              className="ml-0.5 w-4 h-4 rounded-full inline-flex items-center justify-center text-slate-400 hover:bg-rose-100 hover:text-rose-700 transition-colors cursor-pointer"
                                              title={`Hapus "${eq}" dari daftar alat`}
                                            >
                                              <X className="w-2.5 h-2.5" />
                                            </button>
                                          )}
                                        </span>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="text-[11px] text-slate-400 italic">
                                    Sesuai paket standar {sec.packageLabel} (Klik &ldquo;+ Pilih Inventory / Tulis Manual&rdquo; untuk menambah unit alat)
                                  </div>
                                )}

                                {/* Admin Inline Equipment Picker: Pilih dari Inventory & Tulis Manual */}
                                {canManageJobSchedule && isEquipPickerOpen && (
                                  <div className="mt-2 p-3 bg-white border-2 border-indigo-600 rounded-xl shadow-md space-y-3">
                                    {/* A. Tulis Manual Unit Alat (Apabila Tidak Ada di Daftar Inventory) */}
                                    <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg space-y-1.5">
                                      <div className="text-[10px] font-mono font-black uppercase text-amber-900 flex items-center justify-between">
                                        <span>✍️ Tulis Manual Unit Alat (Apabila Tidak Ada di Daftar Inventory):</span>
                                        <span className="text-[9px] font-semibold text-amber-700">Bebas Ketik Spesifikasi / Alat Tambahan</span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row gap-1.5">
                                        <input
                                          type="text"
                                          value={equipPickerManualText}
                                          onChange={(e) => setEquipPickerManualText(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter' && equipPickerManualText.trim()) {
                                              e.preventDefault();
                                              handleAddManualEquipmentToSection(job, sIdx, equipPickerManualText);
                                              setEquipPickerManualText('');
                                            }
                                          }}
                                          placeholder="Contoh: 6001 2, Sub Double 2, ART4, M32 + DL 32 1 / Stand Set / Genset 60 KVA..."
                                          className="flex-1 px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (!equipPickerManualText.trim()) return;
                                            handleAddManualEquipmentToSection(job, sIdx, equipPickerManualText);
                                            setEquipPickerManualText('');
                                          }}
                                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-black cursor-pointer shrink-0 flex items-center justify-center gap-1"
                                        >
                                          <Plus className="w-3.5 h-3.5" />
                                          <span>Tambah Manual</span>
                                        </button>
                                      </div>
                                    </div>

                                    {/* B. Pilih dari Daftar Inventory Gudang Resmi (133 Kelompok Aset) */}
                                    <div className="space-y-2">
                                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                                        <span className="text-[10px] font-mono font-black uppercase text-indigo-900">
                                          📦 Pilih dari Daftar Inventory Gudang Resmi ({filteredSectionInventory.length} Kelompok Unit):
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                          {(
                                            [
                                              { id: 'ALL', label: 'Semua Divisi (133)' },
                                              { id: 'Sound', label: 'Audio / Sound (70)' },
                                              { id: 'Lighting', label: 'Lighting (28)' },
                                              { id: 'Multimedia', label: 'Multimedia (26)' },
                                              { id: 'Videotron', label: 'Videotron (9)' }
                                            ] as const
                                          ).map(tab => (
                                            <button
                                              key={tab.id}
                                              type="button"
                                              onClick={() => setEquipPickerDivFilter(tab.id)}
                                              className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer border transition-all ${
                                                equipPickerDivFilter === tab.id
                                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                              }`}
                                            >
                                              {tab.label}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                                        <div className="sm:col-span-2 relative">
                                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                          <input
                                            type="text"
                                            value={equipPickerSearch}
                                            onChange={(e) => setEquipPickerSearch(e.target.value)}
                                            placeholder="Cari unit inventory (nama alat, kode AST, atau type)..."
                                            className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                          />
                                        </div>
                                        <input
                                          type="text"
                                          value={equipPickerQty}
                                          onChange={(e) => setEquipPickerQty(e.target.value)}
                                          placeholder="Qty Pakai (opsional, misal: 4 Unit)"
                                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                      </div>

                                      {/* Dropdown Cepat Pilih Inventory */}
                                      <div>
                                        <select
                                          value=""
                                          onChange={(e) => {
                                            const selectedId = e.target.value;
                                            if (!selectedId) return;
                                            const found = inventoryAssets.find(a => a.id === selectedId);
                                            if (found) {
                                              handleToggleInventoryAssetInSection(job, sIdx, found, equipPickerQty);
                                            }
                                          }}
                                          className="w-full px-2.5 py-1.5 bg-indigo-50/60 border border-indigo-200 rounded-lg text-xs font-bold text-slate-800"
                                        >
                                          <option value="">
                                            -- Klik Pilih Cepat dari Dropdown Inventory ({filteredSectionInventory.length} Unit) --
                                          </option>
                                          {filteredSectionInventory.map(asset => {
                                            const typeInfo = getInventoryAssetTypeInfo(asset);
                                            const isSelected = findMatchingAssetIndexInEquipment(asset, sec.equipment) >= 0;
                                            return (
                                              <option key={asset.id} value={asset.id}>
                                                {isSelected ? '✓ ' : '+ '}
                                                {asset.name} — [{typeInfo.typeGroup}] ({asset.code})
                                              </option>
                                            );
                                          })}
                                        </select>
                                      </div>

                                      {/* Daftar Chip Inventory yang Bisa Diklik Langsung */}
                                      <div className="max-h-48 overflow-y-auto pr-1 flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
                                        {filteredSectionInventory.map(asset => {
                                          const isSelected = findMatchingAssetIndexInEquipment(asset, sec.equipment) >= 0;
                                          const typeInfo = getInventoryAssetTypeInfo(asset);
                                          return (
                                            <button
                                              key={asset.id}
                                              type="button"
                                              onClick={() =>
                                                handleToggleInventoryAssetInSection(job, sIdx, asset, equipPickerQty)
                                              }
                                              className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1 border text-left ${
                                                isSelected
                                                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                                                  : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 border-slate-200 hover:border-indigo-300'
                                              }`}
                                              title={`${asset.name} (${typeInfo.typeGroup} • ${asset.code})`}
                                            >
                                              <span>{isSelected ? '✓' : '+'}</span>
                                              <span>{asset.name}</span>
                                              <span
                                                className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                                                  isSelected
                                                    ? 'bg-indigo-800 text-indigo-100'
                                                    : 'bg-slate-200/80 text-slate-600'
                                                }`}
                                              >
                                                {typeInfo.shortTypeLabel}
                                              </span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* 2. Staff & Freelance Crew (Editable, Selectable & Assessable by Admin) */}
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center justify-between gap-1.5">
                                  <div className="text-[10px] font-mono uppercase font-bold text-slate-500 flex items-center gap-1">
                                    <Users className="w-3 h-3 text-emerald-600" />
                                    <span>Personil Penugasan (Staff Inhouse & Freelance):</span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {canManageJobSchedule ? (
                                      <select
                                        value={sec.crewAssessmentStatus || 'Personil Approved & Siap'}
                                        onChange={(e) =>
                                          handleUpdateSectionCrewAssessment(
                                            job,
                                            sIdx,
                                            e.target.value as NonNullable<JobDivisionSection['crewAssessmentStatus']>
                                          )
                                        }
                                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border outline-none cursor-pointer ${
                                          sec.crewAssessmentStatus === 'Perlu Briefing / Tambah Kru'
                                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                                            : sec.crewAssessmentStatus === 'Belum Assessment'
                                              ? 'bg-slate-100 text-slate-700 border-slate-300'
                                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                        }`}
                                        title="Status Assessment Penugasan Kru Divisi oleh Admin"
                                      >
                                        <option value="Personil Approved & Siap">✓ Kru Approved & Siap</option>
                                        <option value="Perlu Briefing / Tambah Kru">⚠ Perlu Briefing / Tambah Kru</option>
                                        <option value="Selesai Dievaluasi">✅ Selesai Dievaluasi</option>
                                        <option value="Belum Assessment">⏳ Belum Assessment</option>
                                      </select>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                        {sec.crewAssessmentStatus || '✓ Kru Approved'}
                                      </span>
                                    )}

                                    {canManageJobSchedule && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (isPickerOpen) {
                                            setActiveCrewPickerKey(null);
                                          } else {
                                            setActiveCrewPickerKey(pickerKey);
                                            setCrewPickerSearch('');
                                            setCrewPickerRoleNote('');
                                          }
                                        }}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black cursor-pointer transition-all flex items-center gap-1 border ${
                                          isPickerOpen
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700 shadow-2xs'
                                        }`}
                                      >
                                        {isPickerOpen ? (
                                          <>
                                            <Check className="w-3 h-3" />
                                            <span>Selesai Pilih Crew</span>
                                          </>
                                        ) : (
                                          <>
                                            <Plus className="w-3 h-3" />
                                            <span>Pilih / Edit Staff & Freelance</span>
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {sec.crewAssessmentNote && (
                                  <div className="px-2.5 py-1 bg-emerald-50/70 border border-emerald-200 rounded text-[10px] font-semibold text-emerald-900">
                                    👥 Catatan Assessment Crew: {sec.crewAssessmentNote}
                                  </div>
                                )}

                                {sec.crew.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5">
                                    {sec.crew.map((member, mIdx) => {
                                      const isStaff = member.personnelType === 'Staff';
                                      const isSelectedStaffMember = Boolean(
                                        selectedStaffObj &&
                                        (member.staffId === selectedStaffObj.id ||
                                          member.name.toLowerCase() === (selectedStaffObj.nickname || '').toLowerCase() ||
                                          member.name.toLowerCase() === selectedStaffObj.name.toLowerCase())
                                      );
                                      const isSelectedFreelanceMember = Boolean(
                                        jobSelectedFreelanceName !== 'ALL' &&
                                        member.name.toLowerCase() === jobSelectedFreelanceName.toLowerCase()
                                      );
                                      const isHighlighted = isSelectedStaffMember || isSelectedFreelanceMember;
                                      const badgeEditKey = `${job.id}::${sIdx}::${mIdx}`;

                                      if (editingCrewBadgeKey === badgeEditKey && canManageJobSchedule) {
                                        return (
                                          <div
                                            key={mIdx}
                                            className="w-full p-2.5 bg-white border-2 border-indigo-500 rounded-xl shadow-sm space-y-2"
                                          >
                                            <div className="text-[10px] font-mono font-black uppercase text-indigo-700 flex items-center justify-between">
                                              <span>Assessment & Edit Personil Penugasan (Staff / Freelance):</span>
                                              <button
                                                type="button"
                                                onClick={() => setEditingCrewBadgeKey(null)}
                                                className="text-slate-400 hover:text-slate-700 cursor-pointer"
                                              >
                                                <X className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                              <div>
                                                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                                                  Pilih dari Daftar Staff / Freelance:
                                                </label>
                                                <select
                                                  value=""
                                                  onChange={(e) => {
                                                    if (e.target.value) setEditingCrewPersonName(e.target.value);
                                                  }}
                                                  className="w-full text-xs p-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800 outline-none cursor-pointer"
                                                >
                                                  <option value="">-- Ganti dengan Staff / Freelance --</option>
                                                  <optgroup label="Staff Inhouse Resmi">
                                                    {staffList.map(st => {
                                                      const nick = st.nickname?.split('/')[0].trim() || st.name;
                                                      return (
                                                        <option key={st.id} value={nick}>
                                                          {nick} — {st.name} (STAFF {st.division})
                                                        </option>
                                                      );
                                                    })}
                                                  </optgroup>
                                                  <optgroup label="Kru Freelance Resmi">
                                                    {OFFICIAL_FREELANCE_CREW_LIST.map(fl => (
                                                      <option key={fl.id} value={fl.name}>
                                                        {fl.name} — {fl.canonicalName} (FREELANCE {fl.division})
                                                      </option>
                                                    ))}
                                                  </optgroup>
                                                </select>
                                              </div>
                                              <div>
                                                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                                                  Nama Personil:
                                                </label>
                                                <input
                                                  type="text"
                                                  value={editingCrewPersonName}
                                                  onChange={(e) => setEditingCrewPersonName(e.target.value)}
                                                  className="w-full text-xs p-1.5 border border-slate-300 rounded-lg font-bold text-slate-800"
                                                  placeholder="Nama Staff / Freelance"
                                                />
                                              </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                              <div>
                                                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                                                  Status Assessment Penugasan:
                                                </label>
                                                <select
                                                  value={editingCrewAssessmentStatus}
                                                  onChange={(e) =>
                                                    setEditingCrewAssessmentStatus(
                                                      e.target.value as NonNullable<JobCrewMember['assessmentStatus']>
                                                    )
                                                  }
                                                  className="w-full text-xs p-1.5 bg-emerald-50 border border-emerald-300 rounded-lg font-black text-emerald-950"
                                                >
                                                  <option value="Approved">✓ Approved / Siap Tugas</option>
                                                  <option value="Perlu Briefing">⚠ Perlu Briefing Khusus</option>
                                                  <option value="Standby">⏳ Standby / Backup</option>
                                                  <option value="Diganti">🔄 Diganti / Reschedule</option>
                                                  <option value="Selesai Dievaluasi">✅ Selesai Dievaluasi</option>
                                                </select>
                                              </div>
                                              <div>
                                                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                                                  Skor Assessment (1–5 ★):
                                                </label>
                                                <select
                                                  value={editingCrewAssessmentScore}
                                                  onChange={(e) =>
                                                    setEditingCrewAssessmentScore(Number(e.target.value) || 5)
                                                  }
                                                  className="w-full text-xs p-1.5 bg-amber-50 border border-amber-300 rounded-lg font-black text-amber-950"
                                                >
                                                  <option value={5}>★★★★★ (5/5 — Sangat Baik)</option>
                                                  <option value={4}>★★★★☆ (4/5 — Baik & Siap)</option>
                                                  <option value={3}>★★★☆☆ (3/5 — Cukup / Standar)</option>
                                                  <option value={2}>★★☆☆☆ (2/5 — Perlu Pendampingan)</option>
                                                  <option value={1}>★☆☆☆☆ (1/5 — Evaluasi Khusus)</option>
                                                </select>
                                              </div>
                                              <div>
                                                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                                                  Peran / Role Teknis Lapangan:
                                                </label>
                                                <input
                                                  type="text"
                                                  value={editingCrewRoleNote}
                                                  onChange={(e) => setEditingCrewRoleNote(e.target.value)}
                                                  className="w-full text-xs p-1.5 border border-slate-300 rounded-lg font-medium text-slate-800"
                                                  placeholder="FOH, Operator LED, VJ+Zoom, Campers, Pasang"
                                                />
                                              </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                              <input
                                                type="text"
                                                value={editingCrewAssessmentNote}
                                                onChange={(e) => setEditingCrewAssessmentNote(e.target.value)}
                                                className="flex-1 text-xs p-1.5 border border-slate-300 rounded-lg font-medium text-slate-800"
                                                placeholder="Catatan Assessment Admin (kompetensi teknis, ketepatan waktu, evaluasi lapangan)..."
                                              />
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleUpdateCrewMemberInSection(
                                                    job,
                                                    sIdx,
                                                    mIdx,
                                                    editingCrewPersonName,
                                                    editingCrewRoleNote,
                                                    editingCrewAssessmentStatus,
                                                    editingCrewAssessmentScore,
                                                    editingCrewAssessmentNote
                                                  )
                                                }
                                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black cursor-pointer"
                                              >
                                                Simpan Assessment
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  handleRemoveCrewFromSection(job, sIdx, mIdx);
                                                  setEditingCrewBadgeKey(null);
                                                }}
                                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold cursor-pointer"
                                              >
                                                Hapus
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      }

                                      return (
                                        <div
                                          key={mIdx}
                                          onClick={() => {
                                            if (canManageJobSchedule) {
                                              setEditingCrewBadgeKey(badgeEditKey);
                                              setEditingCrewPersonName(member.name);
                                              setEditingCrewRoleNote(member.roleNote || '');
                                              setEditingCrewAssessmentStatus(member.assessmentStatus || 'Approved');
                                              setEditingCrewAssessmentScore(member.assessmentScore ?? 5);
                                              setEditingCrewAssessmentNote(member.assessmentNote || '');
                                            } else if (isStaff && member.staffId) {
                                              const stObj = staffList.find(s => s.id === member.staffId);
                                              if (stObj) handleSelectStaffPill(stObj);
                                            } else {
                                              handleSelectFreelancePill(member.name);
                                            }
                                          }}
                                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                            isHighlighted
                                              ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-amber-400 shadow-sm'
                                              : isStaff
                                                ? 'bg-indigo-50/90 hover:bg-indigo-100 text-indigo-950 border-indigo-200'
                                                : 'bg-emerald-50/90 hover:bg-emerald-100 text-emerald-950 border-emerald-200'
                                          }`}
                                          title={
                                            canManageJobSchedule
                                              ? `Klik untuk Assessment / Edit ${member.name} (${member.personnelType})`
                                              : member.canonicalName
                                                ? `${member.canonicalName} (${member.personnelType} - ${member.division || ''})`
                                                : member.name
                                          }
                                        >
                                          <span>{member.name}</span>
                                          <span
                                            className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-black uppercase ${
                                              isHighlighted
                                                ? 'bg-amber-300 text-slate-950'
                                                : isStaff
                                                  ? 'bg-indigo-600 text-white'
                                                  : 'bg-emerald-600 text-white'
                                            }`}
                                          >
                                            {isStaff ? 'STAFF' : 'FREELANCE'}
                                          </span>
                                          {member.roleNote && (
                                            <span className="text-[10px] font-mono font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                                              {member.roleNote}
                                            </span>
                                          )}
                                          <span
                                            className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-black ${
                                              member.assessmentStatus === 'Perlu Briefing'
                                                ? 'bg-amber-200 text-amber-950'
                                                : member.assessmentStatus === 'Diganti'
                                                  ? 'bg-rose-200 text-rose-950'
                                                  : 'bg-emerald-100 text-emerald-900'
                                            }`}
                                          >
                                            {member.assessmentStatus === 'Perlu Briefing'
                                              ? '⚠ Briefing'
                                              : member.assessmentStatus === 'Standby'
                                                ? '⏳ Standby'
                                                : member.assessmentStatus === 'Diganti'
                                                  ? '🔄 Diganti'
                                                  : `✓ ${member.assessmentScore || 5}★`}
                                          </span>
                                          {member.assessmentNote && (
                                            <span className="text-[9px] font-mono text-indigo-800 bg-white/80 px-1 rounded border border-indigo-200">
                                              {member.assessmentNote}
                                            </span>
                                          )}
                                          {canManageJobSchedule && (
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveCrewFromSection(job, sIdx, mIdx);
                                              }}
                                              className={`ml-0.5 px-1 rounded hover:bg-rose-500 hover:text-white transition-colors ${
                                                isHighlighted ? 'text-white/80' : 'text-slate-400'
                                              }`}
                                              title={`Hapus ${member.name} dari penugasan ini`}
                                            >
                                              ×
                                            </button>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="text-[11px] text-slate-400 italic">
                                    Belum ada personil ditugaskan — klik "Pilih / Edit Staff & Freelance" untuk menjadwalkan.
                                  </div>
                                )}

                                {/* Inline Admin Picker Panel for Staff Inhouse & Kru Freelance */}
                                {isPickerOpen && canManageJobSchedule && (
                                  <div className="mt-2 p-3 bg-white border-2 border-indigo-500 rounded-xl shadow-md space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => setCrewPickerTab('Staff')}
                                          className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer transition-all ${
                                            crewPickerTab === 'Staff'
                                              ? 'bg-indigo-600 text-white shadow-2xs'
                                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                          }`}
                                        >
                                          👤 Pilih Staff Inhouse ({staffList.length})
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setCrewPickerTab('Freelance')}
                                          className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer transition-all ${
                                            crewPickerTab === 'Freelance'
                                              ? 'bg-emerald-600 text-white shadow-2xs'
                                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                          }`}
                                        >
                                          🤝 Pilih Kru Freelance ({OFFICIAL_FREELANCE_CREW_LIST.length})
                                        </button>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => setActiveCrewPickerKey(null)}
                                        className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                                      >
                                        Tutup ✕
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <input
                                        type="text"
                                        value={crewPickerSearch}
                                        onChange={(e) => setCrewPickerSearch(e.target.value)}
                                        placeholder="Cari nama Staff / Freelance / Divisi..."
                                        className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800 outline-none focus:border-indigo-500"
                                      />
                                      <input
                                        type="text"
                                        value={crewPickerRoleNote}
                                        onChange={(e) => setCrewPickerRoleNote(e.target.value)}
                                        placeholder="Catatan Role saat ditambahkan (misal: VJ + Zoom, Campers)"
                                        className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800 outline-none focus:border-indigo-500"
                                      />
                                    </div>

                                    {crewPickerTab === 'Staff' ? (
                                      <div className="space-y-1.5">
                                        <div className="text-[10px] font-mono font-bold uppercase text-indigo-800">
                                          Klik nama Staff Inhouse untuk menjadwalkan / membatalkan pada paket {sec.division}:
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                                          {staffList
                                            .filter(st => {
                                              if (!searchLower) return true;
                                              return (
                                                st.name.toLowerCase().includes(searchLower) ||
                                                (st.nickname || '').toLowerCase().includes(searchLower) ||
                                                st.division.toLowerCase().includes(searchLower)
                                              );
                                            })
                                            .map(st => {
                                              const primaryNick = st.nickname?.split('/')[0].trim() || st.name;
                                              const isAssigned = sec.crew.some(
                                                c =>
                                                  c.staffId === st.id ||
                                                  c.name.toLowerCase().trim() === primaryNick.toLowerCase() ||
                                                  c.name.toLowerCase().trim() === st.name.toLowerCase()
                                              );
                                              return (
                                                <button
                                                  key={st.id}
                                                  type="button"
                                                  onClick={() =>
                                                    handleToggleCrewInJobSection(
                                                      job,
                                                      sIdx,
                                                      primaryNick,
                                                      crewPickerRoleNote
                                                    )
                                                  }
                                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                                                    isAssigned
                                                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                                                      : 'bg-slate-50 hover:bg-indigo-50 text-slate-800 border-slate-300 hover:border-indigo-400'
                                                  }`}
                                                >
                                                  <span>{isAssigned ? '✓' : '+'}</span>
                                                  <span>{st.nickname ? `${st.nickname} (${st.name.split(' ')[0]})` : st.name}</span>
                                                  <span
                                                    className={`text-[9px] font-mono px-1 rounded ${
                                                      isAssigned ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-600'
                                                    }`}
                                                  >
                                                    {st.division}
                                                  </span>
                                                </button>
                                              );
                                            })}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-1.5">
                                        <div className="text-[10px] font-mono font-bold uppercase text-emerald-800">
                                          Klik nama Kru Freelance untuk menjadwalkan / membatalkan pada paket {sec.division}:
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                                          {OFFICIAL_FREELANCE_CREW_LIST.filter(fl => {
                                            if (!searchLower) return true;
                                            return (
                                              fl.name.toLowerCase().includes(searchLower) ||
                                              fl.canonicalName.toLowerCase().includes(searchLower) ||
                                              fl.division.toLowerCase().includes(searchLower)
                                            );
                                          }).map(fl => {
                                            const isAssigned = sec.crew.some(
                                              c =>
                                                c.name.toLowerCase().trim() === fl.name.toLowerCase() ||
                                                (c.canonicalName || '').toLowerCase() === fl.canonicalName.toLowerCase()
                                            );
                                            return (
                                              <button
                                                key={fl.id}
                                                type="button"
                                                onClick={() =>
                                                  handleToggleCrewInJobSection(
                                                    job,
                                                    sIdx,
                                                    fl.name,
                                                    crewPickerRoleNote
                                                  )
                                                }
                                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                                                  isAssigned
                                                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                                                    : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-300 hover:border-emerald-400'
                                                }`}
                                              >
                                                <span>{isAssigned ? '✓' : '+'}</span>
                                                <span>{fl.name}</span>
                                                <span
                                                  className={`text-[9px] font-mono px-1 rounded ${
                                                    isAssigned ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-600'
                                                  }`}
                                                >
                                                  {fl.division}
                                                </span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}

                                    {/* Custom / Additional Crew Name Input */}
                                    <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
                                      <input
                                        type="text"
                                        value={crewPickerCustomName}
                                        onChange={(e) => setCrewPickerCustomName(e.target.value)}
                                        placeholder="Ketik nama personil lain jika belum ada di daftar..."
                                        className="flex-1 text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800 outline-none focus:border-indigo-500"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!crewPickerCustomName.trim()) return;
                                          handleToggleCrewInJobSection(
                                            job,
                                            sIdx,
                                            crewPickerCustomName.trim(),
                                            crewPickerRoleNote
                                          );
                                          setCrewPickerCustomName('');
                                        }}
                                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                                      >
                                        + Tambah Manual
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* 3. Armada / Mobilisasi */}
                            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                              <div className="text-[10px] font-mono uppercase font-bold text-slate-500 flex items-center gap-1">
                                <Truck className="w-3.5 h-3.5 text-amber-600" />
                                <span>Armada / Mobilisasi:</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {sec.vehicles.length > 0 ? (
                                  sec.vehicles.map((veh, vIdx) => (
                                    <span
                                      key={vIdx}
                                      className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 rounded text-[11px] font-mono font-bold"
                                      title={formatFleetVehicleBadge(veh)}
                                    >
                                      🚚 {formatFleetVehicleBadge(veh)}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[11px] text-slate-400 font-mono">-</span>
                                )}
                              </div>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                          </div>
                        </div>
                      );
                    })}

                  {filteredJobs.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-3">
                      <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                      <div className="text-sm font-bold text-slate-700">
                        {selectedStaffObj
                          ? `Belum ada jadwal penugasan job untuk ${selectedStaffObj.name} (${selectedStaffObj.nickname || selectedStaffObj.division}) pada filter ini`
                          : selectedFreelanceObj
                            ? `Belum ada jadwal penugasan job untuk Kru Freelance ${selectedFreelanceObj.name} pada filter ini`
                            : 'Tidak ada jadwal penugasan job pada minggu / filter yang dipilih'}
                      </div>
                      <p className="text-xs text-slate-500 max-w-lg mx-auto">
                        {canManageJobSchedule && (selectedStaffObj || selectedFreelanceObj)
                          ? 'Gunakan panel "ADMIN QUICK SCHEDULE" berwarna biru di atas untuk langsung menjadwalkan personil ini ke Event yang ada, atau klik "+ Tambah Jadwal Job".'
                          : 'Pilih tab Minggu 1–5 lainnya, klik "Semua Minggu", atau ubah filter nama staff/freelance di atas.'}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        {jobWeekFilter !== 'ALL' && (
                          <button
                            type="button"
                            onClick={() => setJobWeekFilter('ALL')}
                            className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer"
                          >
                            Tampilkan Semua Minggu (1 Bulan Penuh)
                          </button>
                        )}
                        {(jobSelectedStaffId !== 'ALL' || jobSelectedFreelanceName !== 'ALL' || jobDivisionFilter !== 'All' || jobCrewTypeFilter !== 'All') && (
                          <button
                            type="button"
                            onClick={() => {
                              setJobSelectedStaffId('ALL');
                              setJobSelectedFreelanceName('ALL');
                              setJobDivisionFilter('All');
                              setJobCrewTypeFilter('All');
                              setJobWeekFilter('ALL');
                            }}
                            className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold cursor-pointer"
                          >
                            Reset Semua Filter
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Admin Assessment Modal: Unit Alat / Spesifikasi Teknis & Penugasan Staff / Crew Freelance */}
                {assessmentModalJob && (
                  <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border-2 border-indigo-600 shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-5 text-xs">
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-amber-500 text-slate-950 rounded text-[10px] font-mono font-black uppercase">
                              PANEL ASSESSMENT ADMIN
                            </span>
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-[10px] font-mono font-bold">
                              {assessmentModalJob.date} • {assessmentModalJob.venue}
                            </span>
                          </div>
                          <h3 className="text-base font-black text-slate-900">
                            Assessment Unit Alat / Spesifikasi Teknis & Penugasan Staff / Crew Freelance
                          </h3>
                          <p className="text-xs text-slate-500">
                            Verifikasi kesiapan unit alat, kesesuaian spesifikasi teknis, peran, serta kesiapan penugasan Staff Inhouse & Kru Freelance. Setiap perubahan otomatis disinkronkan ke Google Calendar ({gcalConfig.calendarId}).
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAssessmentModalJob(null)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Event-Level Admin Assessment Status & Note */}
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-black text-slate-800 mb-1">
                            Status Assessment Event (Admin)
                          </label>
                          <select
                            value={assessmentModalJob.adminAssessmentStatus || 'Terverifikasi Admin (Approved)'}
                            onChange={(e) =>
                              setAssessmentModalJob(prev =>
                                prev
                                  ? {
                                      ...prev,
                                      adminAssessmentStatus: e.target.value as NonNullable<
                                        JobAssignment['adminAssessmentStatus']
                                      >
                                    }
                                  : prev
                              )
                            }
                            className="w-full p-2 bg-white border border-indigo-300 rounded-lg font-black text-indigo-950"
                          >
                            <option value="Terverifikasi Admin (Approved)">✓ Terverifikasi Admin (Approved)</option>
                            <option value="Perlu Revisi Teknis/Kru">⚠ Perlu Revisi Teknis / Kru</option>
                            <option value="Selesai & Dievaluasi">✅ Selesai & Dievaluasi</option>
                            <option value="Belum Assessment">⏳ Belum Assessment</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block font-black text-slate-800 mb-1">
                            Catatan Assessment Admin Event (Instruksi Spesifikasi, Loading, atau Evaluasi Tim)
                          </label>
                          <input
                            type="text"
                            value={assessmentModalJob.adminAssessmentNote || ''}
                            onChange={(e) =>
                              setAssessmentModalJob(prev =>
                                prev ? { ...prev, adminAssessmentNote: e.target.value } : prev
                              )
                            }
                            placeholder="Contoh: Seluruh unit alat sesuai spesifikasi teknis & kru lengkap siap loading..."
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800"
                          />
                        </div>
                      </div>

                      {/* Per-Section Assessment: Equipment/Technical Spec & Staff/Freelance Crew */}
                      <div className="space-y-4">
                        {assessmentModalJob.sections.map((sec, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-4 border border-slate-200 rounded-xl bg-white shadow-2xs space-y-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-0.5 text-[10px] font-mono font-black uppercase rounded border ${getDivisionBadgeStyle(
                                    sec.division
                                  )}`}
                                >
                                  DIVISI {sec.division}
                                </span>
                                <span className="text-sm font-black text-slate-900">
                                  Paket: {sec.packageLabel}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <select
                                  value={sec.specAssessmentStatus || 'Sesuai Spesifikasi (Approved)'}
                                  onChange={(e) => {
                                    const val = e.target.value as NonNullable<
                                      JobDivisionSection['specAssessmentStatus']
                                    >;
                                    setAssessmentModalJob(prev => {
                                      if (!prev) return prev;
                                      const nextSecs = prev.sections.map((s, i) =>
                                        i === sIdx ? { ...s, specAssessmentStatus: val } : s
                                      );
                                      return { ...prev, sections: nextSecs };
                                    });
                                  }}
                                  className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-lg font-black text-indigo-900 text-[11px]"
                                >
                                  <option value="Sesuai Spesifikasi (Approved)">✓ Spek Alat Approved</option>
                                  <option value="Lengkap & Siap Loading">📦 Lengkap & Siap Loading</option>
                                  <option value="Perlu Penyesuaian Spek">⚠ Perlu Penyesuaian Spek</option>
                                  <option value="Belum Assessment">⏳ Belum Assessment</option>
                                </select>

                                <select
                                  value={sec.crewAssessmentStatus || 'Personil Approved & Siap'}
                                  onChange={(e) => {
                                    const val = e.target.value as NonNullable<
                                      JobDivisionSection['crewAssessmentStatus']
                                    >;
                                    setAssessmentModalJob(prev => {
                                      if (!prev) return prev;
                                      const nextSecs = prev.sections.map((s, i) =>
                                        i === sIdx ? { ...s, crewAssessmentStatus: val } : s
                                      );
                                      return { ...prev, sections: nextSecs };
                                    });
                                  }}
                                  className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg font-black text-emerald-900 text-[11px]"
                                >
                                  <option value="Personil Approved & Siap">✓ Penugasan Kru Approved</option>
                                  <option value="Perlu Briefing / Tambah Kru">⚠ Perlu Briefing / Tambah Kru</option>
                                  <option value="Selesai Dievaluasi">✅ Selesai Dievaluasi</option>
                                  <option value="Belum Assessment">⏳ Belum Assessment</option>
                                </select>
                              </div>
                            </div>

                            {/* Bagian A: Assessment Unit Alat & Spesifikasi Teknis */}
                            <div className="p-3 bg-indigo-50/40 border border-indigo-200 rounded-xl space-y-2.5">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-black text-indigo-950 uppercase font-mono text-[11px] flex items-center gap-1.5">
                                  <Package className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>1. Assessment Unit Alat & Spesifikasi Teknis ({sec.equipment.length} Item)</span>
                                </span>
                                <input
                                  type="text"
                                  value={sec.specAssessmentNote || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setAssessmentModalJob(prev => {
                                      if (!prev) return prev;
                                      const nextSecs = prev.sections.map((s, i) =>
                                        i === sIdx ? { ...s, specAssessmentNote: val } : s
                                      );
                                      return { ...prev, sections: nextSecs };
                                    });
                                  }}
                                  placeholder="Catatan spesifikasi teknis divisi ini..."
                                  className="w-full sm:w-72 px-2.5 py-1 bg-white border border-indigo-200 rounded-lg text-[11px] font-semibold"
                                />
                              </div>

                              <div className="space-y-1.5">
                                {sec.equipment.map((eq, eqIdx) => {
                                  const eqAssess = sec.equipmentAssessments?.[eq] || {
                                    itemLabel: eq,
                                    status: 'Sesuai Spek' as const
                                  };
                                  return (
                                    <div
                                      key={eqIdx}
                                      className="p-2 bg-white border border-slate-200 rounded-lg grid grid-cols-1 md:grid-cols-12 gap-2 items-center"
                                    >
                                      <div className="md:col-span-4">
                                        <input
                                          type="text"
                                          value={eq}
                                          onChange={(e) => {
                                            const newVal = e.target.value;
                                            setAssessmentModalJob(prev => {
                                              if (!prev) return prev;
                                              const nextSecs = prev.sections.map((s, i) => {
                                                if (i !== sIdx) return s;
                                                const nextEq = s.equipment.map((item, idx) =>
                                                  idx === eqIdx ? newVal : item
                                                );
                                                const nextMap = { ...(s.equipmentAssessments || {}) };
                                                if (nextMap[eq]) {
                                                  nextMap[newVal] = { ...nextMap[eq], itemLabel: newVal };
                                                  delete nextMap[eq];
                                                }
                                                return { ...s, equipment: nextEq, equipmentAssessments: nextMap };
                                              });
                                              return { ...prev, sections: nextSecs };
                                            });
                                          }}
                                          className="w-full px-2 py-1 border border-slate-300 rounded font-bold text-slate-900 text-xs"
                                        />
                                      </div>
                                      <div className="md:col-span-3">
                                        <select
                                          value={eqAssess.status}
                                          onChange={(e) => {
                                            const nextSt = e.target.value as typeof eqAssess.status;
                                            setAssessmentModalJob(prev => {
                                              if (!prev) return prev;
                                              const nextSecs = prev.sections.map((s, i) => {
                                                if (i !== sIdx) return s;
                                                const nextMap = { ...(s.equipmentAssessments || {}) };
                                                nextMap[eq] = { ...eqAssess, itemLabel: eq, status: nextSt };
                                                return { ...s, equipmentAssessments: nextMap };
                                              });
                                              return { ...prev, sections: nextSecs };
                                            });
                                          }}
                                          className="w-full px-2 py-1 bg-emerald-50 border border-emerald-200 rounded font-black text-emerald-900 text-[11px]"
                                        >
                                          <option value="Sesuai Spek">✓ Sesuai Spek</option>
                                          <option value="Perlu Penyesuaian">⚠ Perlu Penyesuaian</option>
                                          <option value="Backup / Sub-Vendor">🔄 Backup / Sub-Vendor</option>
                                          <option value="Pending Cek">⏳ Pending Cek</option>
                                        </select>
                                      </div>
                                      <div className="md:col-span-2">
                                        <input
                                          type="text"
                                          value={eqAssess.qtyVerified || ''}
                                          onChange={(e) => {
                                            const qVal = e.target.value;
                                            setAssessmentModalJob(prev => {
                                              if (!prev) return prev;
                                              const nextSecs = prev.sections.map((s, i) => {
                                                if (i !== sIdx) return s;
                                                const nextMap = { ...(s.equipmentAssessments || {}) };
                                                nextMap[eq] = { ...eqAssess, itemLabel: eq, qtyVerified: qVal };
                                                return { ...s, equipmentAssessments: nextMap };
                                              });
                                              return { ...prev, sections: nextSecs };
                                            });
                                          }}
                                          placeholder="Qty Ready"
                                          className="w-full px-2 py-1 border border-slate-200 rounded text-[11px] font-semibold"
                                        />
                                      </div>
                                      <div className="md:col-span-3 flex items-center gap-1">
                                        <input
                                          type="text"
                                          value={eqAssess.technicalNote || ''}
                                          onChange={(e) => {
                                            const nVal = e.target.value;
                                            setAssessmentModalJob(prev => {
                                              if (!prev) return prev;
                                              const nextSecs = prev.sections.map((s, i) => {
                                                if (i !== sIdx) return s;
                                                const nextMap = { ...(s.equipmentAssessments || {}) };
                                                nextMap[eq] = { ...eqAssess, itemLabel: eq, technicalNote: nVal };
                                                return { ...s, equipmentAssessments: nextMap };
                                              });
                                              return { ...prev, sections: nextSecs };
                                            });
                                          }}
                                          placeholder="Catatan teknis alat..."
                                          className="flex-1 px-2 py-1 border border-slate-200 rounded text-[11px] font-medium"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setAssessmentModalJob(prev => {
                                              if (!prev) return prev;
                                              const nextSecs = prev.sections.map((s, i) =>
                                                i === sIdx
                                                  ? { ...s, equipment: s.equipment.filter((_, idx) => idx !== eqIdx) }
                                                  : s
                                              );
                                              return { ...prev, sections: nextSecs };
                                            });
                                          }}
                                          className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                                          title="Hapus item alat"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Tambah Unit Alat / Spesifikasi Baru di Modal Assessment */}
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <select
                                  value=""
                                  onChange={(e) => {
                                    const assetName = e.target.value;
                                    if (!assetName) return;
                                    setAssessmentModalJob(prev => {
                                      if (!prev) return prev;
                                      const nextSecs = prev.sections.map((s, i) =>
                                        i === sIdx ? { ...s, equipment: [...s.equipment, assetName] } : s
                                      );
                                      return { ...prev, sections: nextSecs };
                                    });
                                  }}
                                  className="px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-bold text-slate-800"
                                >
                                  <option value="">+ Tambah Cepat dari Inventory Gudang...</option>
                                  {inventoryAssets.map(a => (
                                    <option key={a.id} value={a.name}>
                                      [{a.division}] {a.name} ({a.code})
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="text"
                                  value={assessmentModalAddEquipText[sIdx] || ''}
                                  onChange={(e) =>
                                    setAssessmentModalAddEquipText(prev => ({
                                      ...prev,
                                      [sIdx]: e.target.value
                                    }))
                                  }
                                  placeholder="Ketik spesifikasi / unit alat tambahan manual..."
                                  className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const txt = (assessmentModalAddEquipText[sIdx] || '').trim();
                                    if (!txt) return;
                                    setAssessmentModalJob(prev => {
                                      if (!prev) return prev;
                                      const nextSecs = prev.sections.map((s, i) =>
                                        i === sIdx ? { ...s, equipment: [...s.equipment, txt] } : s
                                      );
                                      return { ...prev, sections: nextSecs };
                                    });
                                    setAssessmentModalAddEquipText(prev => ({ ...prev, [sIdx]: '' }));
                                  }}
                                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black cursor-pointer"
                                >
                                  + Tambah Spek Alat
                                </button>
                              </div>
                            </div>

                            {/* Bagian B: Assessment Penugasan Staff Inhouse & Kru Freelance */}
                            <div className="p-3 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-2.5">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-black text-emerald-950 uppercase font-mono text-[11px] flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>2. Assessment Penugasan Staff Inhouse & Crew Freelance ({sec.crew.length} Personil)</span>
                                </span>
                                <input
                                  type="text"
                                  value={sec.crewAssessmentNote || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setAssessmentModalJob(prev => {
                                      if (!prev) return prev;
                                      const nextSecs = prev.sections.map((s, i) =>
                                        i === sIdx ? { ...s, crewAssessmentNote: val } : s
                                      );
                                      return { ...prev, sections: nextSecs };
                                    });
                                  }}
                                  placeholder="Catatan assessment tim/kru divisi ini..."
                                  className="w-full sm:w-72 px-2.5 py-1 bg-white border border-emerald-200 rounded-lg text-[11px] font-semibold"
                                />
                              </div>

                              <div className="space-y-1.5">
                                {sec.crew.map((member, mIdx) => (
                                  <div
                                    key={mIdx}
                                    className="p-2 bg-white border border-slate-200 rounded-lg grid grid-cols-1 md:grid-cols-12 gap-2 items-center"
                                  >
                                    <div className="md:col-span-3 flex items-center gap-1.5">
                                      <span
                                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase ${
                                          member.personnelType === 'Staff'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-emerald-600 text-white'
                                        }`}
                                      >
                                        {member.personnelType}
                                      </span>
                                      <span className="font-black text-slate-900 truncate" title={member.canonicalName}>
                                        {member.name}
                                      </span>
                                    </div>
                                    <div className="md:col-span-2">
                                      <input
                                        type="text"
                                        value={member.roleNote || ''}
                                        onChange={(e) => {
                                          const rVal = e.target.value;
                                          setAssessmentModalJob(prev => {
                                            if (!prev) return prev;
                                            const nextSecs = prev.sections.map((s, i) => {
                                              if (i !== sIdx) return s;
                                              const nextCrew = s.crew.map((c, idx) =>
                                                idx === mIdx ? { ...c, roleNote: rVal } : c
                                              );
                                              return { ...s, crew: nextCrew };
                                            });
                                            return { ...prev, sections: nextSecs };
                                          });
                                        }}
                                        placeholder="Peran / Role (FOH, LED, dll.)"
                                        className="w-full px-2 py-1 border border-slate-200 rounded text-[11px] font-semibold"
                                      />
                                    </div>
                                    <div className="md:col-span-3">
                                      <select
                                        value={member.assessmentStatus || 'Approved'}
                                        onChange={(e) => {
                                          const stVal = e.target.value as NonNullable<
                                            JobCrewMember['assessmentStatus']
                                          >;
                                          setAssessmentModalJob(prev => {
                                            if (!prev) return prev;
                                            const nextSecs = prev.sections.map((s, i) => {
                                              if (i !== sIdx) return s;
                                              const nextCrew = s.crew.map((c, idx) =>
                                                idx === mIdx ? { ...c, assessmentStatus: stVal } : c
                                              );
                                              return { ...s, crew: nextCrew };
                                            });
                                            return { ...prev, sections: nextSecs };
                                          });
                                        }}
                                        className="w-full px-2 py-1 bg-emerald-50 border border-emerald-200 rounded font-black text-emerald-950 text-[11px]"
                                      >
                                        <option value="Approved">✓ Approved / Siap Tugas</option>
                                        <option value="Perlu Briefing">⚠ Perlu Briefing Khusus</option>
                                        <option value="Standby">⏳ Standby / Backup</option>
                                        <option value="Diganti">🔄 Diganti / Reschedule</option>
                                        <option value="Selesai Dievaluasi">✅ Selesai Dievaluasi</option>
                                      </select>
                                    </div>
                                    <div className="md:col-span-1">
                                      <select
                                        value={member.assessmentScore ?? 5}
                                        onChange={(e) => {
                                          const scVal = Number(e.target.value) || 5;
                                          setAssessmentModalJob(prev => {
                                            if (!prev) return prev;
                                            const nextSecs = prev.sections.map((s, i) => {
                                              if (i !== sIdx) return s;
                                              const nextCrew = s.crew.map((c, idx) =>
                                                idx === mIdx ? { ...c, assessmentScore: scVal } : c
                                              );
                                              return { ...s, crew: nextCrew };
                                            });
                                            return { ...prev, sections: nextSecs };
                                          });
                                        }}
                                        className="w-full px-1.5 py-1 bg-amber-50 border border-amber-200 rounded font-black text-amber-950 text-[11px]"
                                      >
                                        <option value={5}>5★</option>
                                        <option value={4}>4★</option>
                                        <option value={3}>3★</option>
                                        <option value={2}>2★</option>
                                        <option value={1}>1★</option>
                                      </select>
                                    </div>
                                    <div className="md:col-span-3 flex items-center gap-1">
                                      <input
                                        type="text"
                                        value={member.assessmentNote || ''}
                                        onChange={(e) => {
                                          const nVal = e.target.value;
                                          setAssessmentModalJob(prev => {
                                            if (!prev) return prev;
                                            const nextSecs = prev.sections.map((s, i) => {
                                              if (i !== sIdx) return s;
                                              const nextCrew = s.crew.map((c, idx) =>
                                                idx === mIdx ? { ...c, assessmentNote: nVal } : c
                                              );
                                              return { ...s, crew: nextCrew };
                                            });
                                            return { ...prev, sections: nextSecs };
                                          });
                                        }}
                                        placeholder="Catatan evaluasi personil..."
                                        className="flex-1 px-2 py-1 border border-slate-200 rounded text-[11px] font-medium"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setAssessmentModalJob(prev => {
                                            if (!prev) return prev;
                                            const nextSecs = prev.sections.map((s, i) =>
                                              i === sIdx
                                                ? { ...s, crew: s.crew.filter((_, idx) => idx !== mIdx) }
                                                : s
                                            );
                                            return { ...prev, sections: nextSecs };
                                          });
                                        }}
                                        className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                                        title="Hapus personil"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Tambah Staff Inhouse / Kru Freelance di Modal Assessment */}
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <select
                                  value={assessmentModalAddCrewName[sIdx] || ''}
                                  onChange={(e) =>
                                    setAssessmentModalAddCrewName(prev => ({
                                      ...prev,
                                      [sIdx]: e.target.value
                                    }))
                                  }
                                  className="px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs font-bold text-slate-800"
                                >
                                  <option value="">-- Pilih Staff Inhouse / Kru Freelance --</option>
                                  <optgroup label="Staff Inhouse Resmi">
                                    {staffList.map(st => {
                                      const nick = st.nickname?.split('/')[0].trim() || st.name;
                                      return (
                                        <option key={st.id} value={nick}>
                                          {nick} — {st.name} (STAFF {st.division})
                                        </option>
                                      );
                                    })}
                                  </optgroup>
                                  <optgroup label="Kru Freelance Resmi">
                                    {OFFICIAL_FREELANCE_CREW_LIST.map(fl => (
                                      <option key={fl.id} value={fl.name}>
                                        {fl.name} — {fl.canonicalName} (FREELANCE {fl.division})
                                      </option>
                                    ))}
                                  </optgroup>
                                </select>
                                <input
                                  type="text"
                                  value={assessmentModalAddCrewRole[sIdx] || ''}
                                  onChange={(e) =>
                                    setAssessmentModalAddCrewRole(prev => ({
                                      ...prev,
                                      [sIdx]: e.target.value
                                    }))
                                  }
                                  placeholder="Role teknis (opsional, misal: FOH / Operator LED)"
                                  className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const pName = (assessmentModalAddCrewName[sIdx] || '').trim();
                                    if (!pName) return;
                                    const resolved = resolveCrewMember(
                                      pName,
                                      sec.division,
                                      (assessmentModalAddCrewRole[sIdx] || '').trim() || undefined
                                    );
                                    setAssessmentModalJob(prev => {
                                      if (!prev) return prev;
                                      const nextSecs = prev.sections.map((s, i) =>
                                        i === sIdx
                                          ? {
                                              ...s,
                                              crew: [
                                                ...s.crew,
                                                {
                                                  ...resolved,
                                                  assessmentStatus: 'Approved' as const,
                                                  assessmentScore: 5
                                                }
                                              ]
                                            }
                                          : s
                                      );
                                      return { ...prev, sections: nextSecs };
                                    });
                                    setAssessmentModalAddCrewName(prev => ({ ...prev, [sIdx]: '' }));
                                    setAssessmentModalAddCrewRole(prev => ({ ...prev, [sIdx]: '' }));
                                  }}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black cursor-pointer"
                                >
                                  + Tambah & Approve Kru
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setAssessmentModalJob(null)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                        >
                          Batal
                        </button>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSaveAssessmentModal(false)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black cursor-pointer shadow-sm flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            <span>Simpan Hasil Assessment & Auto-Sync</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveAssessmentModal(true)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black cursor-pointer shadow-sm flex items-center gap-1.5"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Simpan Assessment & Buka di Google Calendar ↗</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add / Edit Job Assignment Modal */}
                {showJobFormModal && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div>
                          <h3 className="text-base font-black text-slate-900">
                            {editingJobId ? 'Edit Jadwal Penugasan Job / Event' : 'Tambah Jadwal Penugasan Job / Event Baru'}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Admin dapat memilih langsung Staff Inhouse & Kru Freelance untuk dijadwalkan pada setiap divisi event.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowJobFormModal(false)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveJobAssignment} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Tanggal Event *</label>
                            <input
                              type="date"
                              required
                              value={jobFormDate}
                              onChange={(e) => setJobFormDate(e.target.value)}
                              className="w-full p-2 border border-slate-200 rounded-lg font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Label Tanggal & Judul Job</label>
                            <input
                              type="text"
                              placeholder="Contoh: 3 Nov Qbig BSD"
                              value={jobFormDateLabel}
                              onChange={(e) => setJobFormDateLabel(e.target.value)}
                              className="w-full p-2 border border-slate-200 rounded-lg font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Lokasi / Venue *</label>
                            <input
                              type="text"
                              required
                              placeholder="Contoh: Qbig BSD / Parkir Timur Senayan"
                              value={jobFormVenue}
                              onChange={(e) => setJobFormVenue(e.target.value)}
                              className="w-full p-2 border border-slate-200 rounded-lg font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Person in Charge (PIC) *
                            </label>
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                required
                                placeholder="Ketik atau pilih PIC..."
                                value={jobFormPic}
                                onChange={(e) => setJobFormPic(e.target.value)}
                                className="flex-1 p-2 border border-slate-200 rounded-lg font-semibold"
                              />
                              <select
                                value=""
                                onChange={(e) => {
                                  if (e.target.value) setJobFormPic(e.target.value);
                                }}
                                className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg font-bold text-indigo-900 outline-none cursor-pointer max-w-[155px]"
                                title="Pilih PIC dari Daftar Staff / Freelance"
                              >
                                <option value="">Pilih PIC ▾</option>
                                <optgroup label="Staff Inhouse">
                                  {staffList.map(st => {
                                    const label = st.nickname ? `${st.nickname} (${st.name})` : st.name;
                                    return (
                                      <option key={st.id} value={label}>
                                        {label} ({st.division})
                                      </option>
                                    );
                                  })}
                                </optgroup>
                                <optgroup label="Kru Freelance">
                                  {OFFICIAL_FREELANCE_CREW_LIST.map(fl => (
                                    <option key={fl.id} value={fl.name}>
                                      {fl.name} ({fl.division})
                                    </option>
                                  ))}
                                </optgroup>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Jadwal Loading / Jam Berangkat</label>
                            <input
                              type="text"
                              placeholder="Contoh: Loading Tgl 2 Nov Jam 18.00 WIB"
                              value={jobFormLoadingSchedule}
                              onChange={(e) => setJobFormLoadingSchedule(e.target.value)}
                              className="w-full p-2 border border-slate-200 rounded-lg font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Status Penugasan</label>
                            <select
                              value={jobFormStatus}
                              onChange={(e) => setJobFormStatus(e.target.value as JobAssignment['status'])}
                              className="w-full p-2 border border-slate-200 rounded-lg font-bold"
                            >
                              <option value="Terjadwal">Terjadwal</option>
                              <option value="Loading / Setup">Loading / Setup</option>
                              <option value="Berlangsung (Show)">Berlangsung (Show)</option>
                              <option value="Bongkaran">Bongkaran</option>
                              <option value="Selesai">Selesai</option>
                            </select>
                          </div>
                        </div>

                        {/* Multi-Section Selector Bar inside Modal */}
                        <div className="pt-3 border-t border-slate-200 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] font-black uppercase text-slate-700">
                              Pilih Paket Divisi pada Event Ini ({jobFormSectionsDraft.length} Paket):
                            </span>
                            <button
                              type="button"
                              onClick={handleAddModalSection}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-black cursor-pointer flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Tambah Paket Divisi Lain</span>
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {jobFormSectionsDraft.map((secItem, idx) => {
                              const isCurrent = idx === jobFormSectionIdx;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleSelectModalSection(idx)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all border ${
                                    isCurrent
                                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                                  }`}
                                >
                                  Paket {idx + 1}: {isCurrent ? jobFormDivision : secItem.division} ({isCurrent ? jobFormPackageLabel || '-' : secItem.packageLabel || '-'})
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Divisi Paket #{jobFormSectionIdx + 1}</label>
                            <select
                              value={jobFormDivision}
                              onChange={(e) => {
                                const nextDiv = e.target.value as JobDivisionSection['division'];
                                setJobFormDivision(nextDiv);
                                setModalEquipDivFilter(mapSectionDivToAssetDiv(nextDiv));
                              }}
                              className="w-full p-2 border border-slate-200 rounded-lg font-bold"
                            >
                              <option value="Audio">Audio / Sound</option>
                              <option value="Videotron">Videotron / LED</option>
                              <option value="Lighting">Lighting</option>
                              <option value="Multimedia">Multimedia / Stream</option>
                              <option value="Produksi">Produksi</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Nama Paket Alat</label>
                            <input
                              type="text"
                              placeholder="Contoh: Sound 20rb / LED 48Meter / Stream + 2 Cam"
                              value={jobFormPackageLabel}
                              onChange={(e) => setJobFormPackageLabel(e.target.value)}
                              className="w-full p-2 border border-slate-200 rounded-lg font-semibold"
                            />
                          </div>
                        </div>

                        {/* Unit Alat & Spesifikasi Teknis: Pilih dari Inventory ATAU Tulis Manual */}
                        <div className="p-3 bg-indigo-50/40 border border-indigo-200 rounded-xl space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <label className="font-black text-slate-800 flex items-center gap-1.5">
                              <Package className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Unit Alat & Spesifikasi Teknis (Pilih dari Inventory atau Tulis Manual)</span>
                            </label>
                            <div className="flex flex-wrap gap-1">
                              {(
                                [
                                  { id: 'ALL', label: 'Semua Divisi (133)' },
                                  { id: 'Sound', label: 'Sound (70)' },
                                  { id: 'Lighting', label: 'Lighting (28)' },
                                  { id: 'Multimedia', label: 'Multimedia (26)' },
                                  { id: 'Videotron', label: 'Videotron (9)' }
                                ] as const
                              ).map(tab => (
                                <button
                                  key={tab.id}
                                  type="button"
                                  onClick={() => setModalEquipDivFilter(tab.id)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer border transition-all ${
                                    modalEquipDivFilter === tab.id
                                      ? 'bg-indigo-600 text-white border-indigo-600'
                                      : 'bg-white text-slate-600 border-slate-300 hover:bg-indigo-50'
                                  }`}
                                >
                                  {tab.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 1. Pilih dari Daftar Inventory Gudang Resmi */}
                          {(() => {
                            const modalSearchLower = modalEquipSearch.toLowerCase().trim();
                            const currentEquipLines = jobFormEquipmentText
                              .split('\n')
                              .map(s => s.trim())
                              .filter(Boolean);
                            const filteredModalAssets = inventoryAssets.filter(asset => {
                              if (modalEquipDivFilter !== 'ALL' && asset.division !== modalEquipDivFilter) {
                                return false;
                              }
                              if (!modalSearchLower) return true;
                              const typeInfo = getInventoryAssetTypeInfo(asset);
                              return (
                                asset.name.toLowerCase().includes(modalSearchLower) ||
                                asset.code.toLowerCase().includes(modalSearchLower) ||
                                typeInfo.typeGroup.toLowerCase().includes(modalSearchLower)
                              );
                            });

                            return (
                              <div className="space-y-2 bg-white p-2.5 rounded-lg border border-indigo-100">
                                <div className="text-[10px] font-mono font-black uppercase text-indigo-800">
                                  📦 1. Pilih Unit Alat dari Daftar Inventory Gudang ({filteredModalAssets.length} Kelompok Unit):
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
                                  <div className="md:col-span-2 relative">
                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                    <input
                                      type="text"
                                      value={modalEquipSearch}
                                      onChange={(e) => setModalEquipSearch(e.target.value)}
                                      placeholder="Cari unit inventory (nama alat, kode AST, atau type)..."
                                      className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    value={modalEquipQty}
                                    onChange={(e) => setModalEquipQty(e.target.value)}
                                    placeholder="Qty Pakai (opsional, misal: 4 Unit)"
                                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                                  />
                                </div>

                                <select
                                  value=""
                                  onChange={(e) => {
                                    const selectedId = e.target.value;
                                    if (!selectedId) return;
                                    const found = inventoryAssets.find(a => a.id === selectedId);
                                    if (found) {
                                      handleToggleInventoryAssetInModalText(found, modalEquipQty);
                                    }
                                  }}
                                  className="w-full p-1.5 bg-indigo-50/60 border border-indigo-200 rounded-lg text-xs font-bold text-slate-800"
                                >
                                  <option value="">
                                    -- Klik Pilih Cepat dari Dropdown Inventory ({filteredModalAssets.length} Unit) --
                                  </option>
                                  {filteredModalAssets.map(asset => {
                                    const typeInfo = getInventoryAssetTypeInfo(asset);
                                    const isSelected = findMatchingAssetIndexInEquipment(asset, currentEquipLines) >= 0;
                                    return (
                                      <option key={asset.id} value={asset.id}>
                                        {isSelected ? '✓ ' : '+ '}
                                        {asset.name} — [{typeInfo.typeGroup}] ({asset.code})
                                      </option>
                                    );
                                  })}
                                </select>

                                <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto pr-1 pt-1 border-t border-slate-100">
                                  {filteredModalAssets.map(asset => {
                                    const isSelected = findMatchingAssetIndexInEquipment(asset, currentEquipLines) >= 0;
                                    const typeInfo = getInventoryAssetTypeInfo(asset);
                                    return (
                                      <button
                                        key={asset.id}
                                        type="button"
                                        onClick={() => handleToggleInventoryAssetInModalText(asset, modalEquipQty)}
                                        className={`px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all border flex items-center gap-1 ${
                                          isSelected
                                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                                            : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 border-slate-300'
                                        }`}
                                      >
                                        <span>{isSelected ? '✓' : '+'}</span>
                                        <span>{asset.name}</span>
                                        <span
                                          className={`text-[9px] font-mono px-1 rounded ${
                                            isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-600'
                                          }`}
                                        >
                                          {typeInfo.shortTypeLabel}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}

                          {/* 2. Tulis Manual Apabila Tidak Ada di Daftar Inventory */}
                          <div className="space-y-1.5 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200">
                            <div className="text-[10px] font-mono font-black uppercase text-amber-900">
                              ✍️ 2. Tulis Manual Unit Alat (Apabila Tidak Ada di Daftar Inventory):
                            </div>
                            <div className="flex flex-col sm:flex-row gap-1.5">
                              <input
                                type="text"
                                value={modalEquipManualInput}
                                onChange={(e) => setModalEquipManualInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && modalEquipManualInput.trim()) {
                                    e.preventDefault();
                                    handleAddManualEquipmentToModalText(modalEquipManualInput);
                                    setModalEquipManualInput('');
                                  }
                                }}
                                placeholder="Ketik manual unit alat / spesifikasi teknis yang tidak ada di daftar inventory..."
                                className="flex-1 px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-semibold"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (!modalEquipManualInput.trim()) return;
                                  handleAddManualEquipmentToModalText(modalEquipManualInput);
                                  setModalEquipManualInput('');
                                }}
                                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-black cursor-pointer shrink-0 flex items-center justify-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tambah Manual</span>
                              </button>
                            </div>
                          </div>

                          {/* 3. Daftar Unit Alat Terpilih (Bisa Diedit Bebas per Baris) */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Daftar Unit Alat Terjadwal pada Paket Ini (Satu baris per item alat — bisa ketik/edit manual):
                            </label>
                            <textarea
                              rows={3}
                              placeholder={"6001 2, Sub Double 2, ART4, M32 + DL 32 1, WHM 4\nStand Set"}
                              value={jobFormEquipmentText}
                              onChange={(e) => setJobFormEquipmentText(e.target.value)}
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Staff / Freelance Crew Terjadwal (Bisa ketik atau klik pilih di bawah)
                            </label>
                            <input
                              type="text"
                              placeholder="Contoh: Mboh, Dani, Butonk, Uloh (VJ + Zoom), Chandra (Campers)"
                              value={jobFormCrewText}
                              onChange={(e) => setJobFormCrewText(e.target.value)}
                              className="w-full p-2 border border-slate-200 rounded-lg font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Armada / Kendaraan (Pisahkan koma)
                            </label>
                            <input
                              type="text"
                              placeholder="Contoh: Truck, Riz 2, Engkel Riz, Serena, Yosep"
                              value={jobFormVehiclesText}
                              onChange={(e) => setJobFormVehiclesText(e.target.value)}
                              className="w-full p-2 border border-slate-200 rounded-lg font-semibold"
                            />
                          </div>
                        </div>

                        {/* Interactive Staff & Freelance Multi-Select Chips in Modal */}
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                          <div className="space-y-1">
                            <div className="text-[10px] font-mono font-black uppercase text-indigo-800">
                              👤 Klik untuk Pilih / Hapus Staff Inhouse pada Paket Ini:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {staffList.map(st => {
                                const primaryNick = st.nickname?.split('/')[0].trim() || st.name;
                                const activeTokens = jobFormCrewText
                                  .split(',')
                                  .map(t => t.replace(/\([^)]*\)/g, '').trim().toLowerCase())
                                  .filter(Boolean);
                                const isChecked =
                                  activeTokens.includes(primaryNick.toLowerCase()) ||
                                  activeTokens.includes(st.name.toLowerCase());
                                return (
                                  <button
                                    key={st.id}
                                    type="button"
                                    onClick={() => handleTogglePersonInModalCrewText(primaryNick)}
                                    className={`px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all border ${
                                      isChecked
                                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                                        : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-300'
                                    }`}
                                  >
                                    {isChecked ? '✓ ' : '+ '}
                                    {st.nickname ? `${st.nickname} (${st.division})` : `${st.name} (${st.division})`}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="space-y-1 pt-2 border-t border-slate-200">
                            <div className="text-[10px] font-mono font-black uppercase text-emerald-800">
                              🤝 Klik untuk Pilih / Hapus Kru Freelance pada Paket Ini:
                            </div>
                            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto pr-1">
                              {OFFICIAL_FREELANCE_CREW_LIST.map(fl => {
                                const activeTokens = jobFormCrewText
                                  .split(',')
                                  .map(t => t.replace(/\([^)]*\)/g, '').trim().toLowerCase())
                                  .filter(Boolean);
                                const isChecked = activeTokens.includes(fl.name.toLowerCase());
                                return (
                                  <button
                                    key={fl.id}
                                    type="button"
                                    onClick={() => handleTogglePersonInModalCrewText(fl.name)}
                                    className={`px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all border ${
                                      isChecked
                                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                                        : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-300'
                                    }`}
                                  >
                                    {isChecked ? '✓ ' : '+ '}
                                    {fl.name} ({fl.division})
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Catatan Khusus / Dresscode / SOP Venue</label>
                          <input
                            type="text"
                            placeholder="Contoh: WAJIB PAKAI KEMEJA, CELANA PANJANG DAN SEPATU"
                            value={jobFormNotes}
                            onChange={(e) => setJobFormNotes(e.target.value)}
                            className="w-full p-2 border border-slate-200 rounded-lg font-semibold"
                          />
                        </div>

                        <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg flex items-center justify-between gap-3">
                          <label className="inline-flex items-center gap-2 text-xs font-bold text-indigo-950 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={jobFormOpenGcalOnSave}
                              onChange={(e) => setJobFormOpenGcalOnSave(e.target.checked)}
                              className="rounded border-indigo-300 text-indigo-600"
                            />
                            <span>
                              Sinkronkan & simpan langsung event ini ke Google Calendar ({gcalConfig.calendarId}) saat klik Simpan
                            </span>
                          </label>
                          <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                          <button
                            type="button"
                            onClick={() => setShowJobFormModal(false)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-black cursor-pointer shadow-xs"
                          >
                            Simpan Jadwal Penugasan
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ────────────────────────────────────────────────────────── */}
          {/* MODE 2: CUSTOM 1-31 GENERATOR (LEGACY / EXPERIMENTAL)      */}
          {/* ────────────────────────────────────────────────────────── */}
          {scheduleViewMode === 'custom' && (
            <div>
              {/* Admin Command Panel */}
              <div className="p-4 bg-[#f8fafc] border border-slate-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="text-xs uppercase font-bold text-indigo-600 font-mono tracking-wider">
                    PANEL PENJADWALAN BULANAN (1-31)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Admin dapat menghasilkan lembar jadwal otomatis untuk bulan baru dan melakukan koreksi jam/status masuk karyawan secara langsung.
                  </p>
                </div>

                {currentUser.role === 'Admin' && (
                  <button
                    onClick={handleGenerateMonthSchedule}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Generate Bulan Baru</span>
                  </button>
                )}
              </div>

              {schedule ? (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-bold text-slate-800">Lembar Jadwal Kerja Periode: {schedule.monthLabel}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">Siap Diedit</span>
                    </div>

                    <div className="relative w-full md:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Cari karyawan..."
                        value={scheduleSearch}
                        onChange={(e) => setScheduleSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-inner max-h-[500px]">
                    <table className="min-w-full divide-y divide-slate-200 text-xs font-mono">
                      <thead className="bg-slate-50 sticky top-0 z-10">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left font-bold text-slate-500 w-44 bg-slate-50 sticky left-0 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)] border-r">
                            Nama Karyawan
                          </th>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <th key={day} scope="col" className="px-1.5 py-2 text-center font-bold text-slate-500 min-w-[34px] border-r">
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {staffList.filter(s => s.name.toLowerCase().includes(scheduleSearch.toLowerCase())).map((staff) => {
                          const staffRowSchedule = schedule.scheduleData[staff.id] || {};

                          return (
                            <tr key={staff.id} className="hover:bg-slate-50/50">
                              <td className="px-3 py-2.5 font-sans font-bold text-slate-800 bg-white sticky left-0 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)] border-r">
                                <div>{staff.name}</div>
                                <div className="text-[9px] text-slate-400 font-mono font-normal uppercase">{staff.division} • {staff.role}</div>
                              </td>

                              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                                const status = staffRowSchedule[day] || 'Masuk';
                                const handleCellClick = () => {
                                  const order: ('Masuk' | 'Off' | 'Libur' | 'Izin' | 'Sakit' | 'Alpha')[] = ['Masuk', 'Off', 'Libur', 'Izin', 'Sakit', 'Alpha'];
                                  const nextIndex = (order.indexOf(status) + 1) % order.length;
                                  handleUpdateDaySchedule(staff.id, day, order[nextIndex]);
                                };

                                return (
                                  <td key={day} className="p-0.5 border-r text-center">
                                    <button
                                      type="button"
                                      onClick={handleCellClick}
                                      className={`w-full h-8 text-[10px] font-bold border rounded flex items-center justify-center transition-all focus:outline-none cursor-pointer ${getStatusColor(status)}`}
                                      title={`${staff.name} - Tanggal ${day}: ${status}`}
                                    >
                                      {status === 'Masuk' ? 'M' :
                                        status === 'Off' ? 'O' :
                                          status === 'Libur' ? 'L' :
                                            status === 'Izin' ? 'I' :
                                              status === 'Sakit' ? 'S' : 'A'}
                                    </button>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl space-y-4">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto animate-bounce" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-700 text-sm">Lembar Jadwal Belum Dibuat</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Silakan tekan tombol "Generate Bulan Baru" di atas untuk membuat jadwal tanggal 1-31 otomatis.
                    </p>
                  </div>
                  {currentUser.role === 'Admin' && (
                    <button
                      onClick={handleGenerateMonthSchedule}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-all"
                    >
                      Generate Bulan Baru Sekarang
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* VIEW 3: STAFF PROGRESSION & ELECTRICAL COMPETENCY */}
      {activeSubTab === 'progress' && (() => {
        // Filter staffList to only those in the 5 eligible divisions
        const ELIGIBLE_DIVISIONS = ['Audio', 'Lighting', 'Multimedia', 'Videotron', 'Gudang'];
        const eligibleStaff = staffList.filter(staff => ELIGIBLE_DIVISIONS.includes(staff.division));

        // Calculate progress for each staff member
        const getStaffProgress = (staffId: string) => {
          const comps = electricalCompetencies[staffId] || {};
          const completedKeys = Object.keys(comps).filter(k => comps[k]?.verified);
          const count = completedKeys.length;
          const pct = Math.round((count / 6) * 100);

          let title = 'Junior Apprentice';
          let titleColor = 'text-slate-500 bg-slate-100';
          if (count === 6) {
            title = 'Certified Practitioner 🌟';
            titleColor = 'text-emerald-700 bg-emerald-100 border-emerald-200';
          } else if (count >= 4) {
            title = 'Electrical Competent';
            titleColor = 'text-indigo-700 bg-indigo-100 border-indigo-200';
          } else if (count >= 2) {
            title = 'Qualified Assistant';
            titleColor = 'text-amber-700 bg-amber-100 border-amber-200';
          }

          return { count, pct, title, titleColor };
        };

        // Summary calculations
        const totalEligible = eligibleStaff.length;
        const totalCertified = eligibleStaff.filter(s => getStaffProgress(s.id).count === 6).length;
        const totalCompetenciesChecked = eligibleStaff.reduce((acc, s) => acc + getStaffProgress(s.id).count, 0);
        const overallPct = Math.round((totalCompetenciesChecked / (totalEligible * 6)) * 100) || 0;

        // Apply filters
        const filteredStaff = eligibleStaff.filter(staff => {
          const matchesSearch = staff.name.toLowerCase().includes(progressSearch.toLowerCase()) ||
            staff.role.toLowerCase().includes(progressSearch.toLowerCase());

          // Map 'Sound (Audio)' to 'Audio'
          const filterDiv = progressFilterDivision === 'Sound (Audio)' ? 'Audio' : progressFilterDivision;
          const matchesDiv = progressFilterDivision === 'All' || staff.division === filterDiv;

          return matchesSearch && matchesDiv;
        });

        const selectedStaff = staffList.find(s => s.id === selectedStaffId);
        const selectedProgress = selectedStaff ? getStaffProgress(selectedStaff.id) : null;

        // Check if current logged-in user can verify the target staff's competency
        const canVerifyFor = (target: Staff) => {
          if (currentUser.role === 'Admin' || currentUser.role === 'Supervisor' || currentUser.role === 'Manager') {
            return true;
          }
          if (currentUser.role === 'Team Leader' && currentUser.division === target.division) {
            return true;
          }
          return false;
        };

        const handleToggleCompetency = (staffId: string, compKey: string) => {
          const currentStaff = staffList.find(s => s.id === staffId);
          if (!currentStaff) return;

          if (!canVerifyFor(currentStaff)) {
            alert('Akses Ditolak: Anda tidak memiliki wewenang untuk memverifikasi staff divisi ini.');
            return;
          }

          const staffComps = { ...(electricalCompetencies[staffId] || {}) };
          const isCurrentlyVerified = !!staffComps[compKey]?.verified;

          if (isCurrentlyVerified) {
            // Unverify
            staffComps[compKey] = { verified: false };
            onLogActivity(
              currentUser.name,
              currentUser.role,
              `Membatalkan verifikasi kompetensi listrik "${ELECTRICAL_COMPETENCIES.find(c => c.key === compKey)?.title}" untuk ${currentStaff.name}`
            );
          } else {
            // Verify
            staffComps[compKey] = {
              verified: true,
              verifiedBy: currentUser.name,
              dateVerified: new Date().toISOString().split('T')[0]
            };
            onLogActivity(
              currentUser.name,
              currentUser.role,
              `Memverifikasi kompetensi listrik "${ELECTRICAL_COMPETENCIES.find(c => c.key === compKey)?.title}" untuk ${currentStaff.name}`
            );
          }

          setElectricalCompetencies(prev => ({
            ...prev,
            [staffId]: staffComps
          }));
        };

        // Handle Automatic Certification of Safety via Quiz
        const handleClaimSafetyCertification = (staffId: string) => {
          const staffComps = { ...(electricalCompetencies[staffId] || {}) };
          staffComps['comp_safety'] = {
            verified: true,
            verifiedBy: 'Sistem Uji Mandiri',
            dateVerified: new Date().toISOString().split('T')[0]
          };

          setElectricalCompetencies(prev => ({
            ...prev,
            [staffId]: staffComps
          }));

          onLogActivity(
            currentUser.name,
            currentUser.role,
            `Berhasil menyelesaikan Uji Kelayakan Listrik Mandiri (Skor ${quizScore}/5) dan tersertifikasi otomatis "AC/DC Safety & K3 Kelistrikan"`
          );

          setQuizActive(false);
          setQuizCompleted(false);
          alert('Selamat! Sertifikasi AC/DC Safety & K3 Kelistrikan Anda telah didaftarkan secara otomatis!');
        };

        return (
          <div className="space-y-6 font-sans">

            {/* POLICY OVERVIEW BANNER */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-xl border border-slate-800 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Zap className="w-48 h-48 text-amber-400" />
              </div>
              <div className="relative z-10 max-w-4xl space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 border border-amber-400/30 rounded-full text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> REGULASI WAJIB BASIC ELECTRICAL - PROGRESS PEGAWAI
                </div>
                <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight">Standardisasi Kompetensi Kelistrikan Staff Produksi</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sesuai dengan instruksi manajemen RIZ-PRODUCTION, seluruh personel di divisi <strong className="text-white">Sound (Audio), Lighting, Multimedia, Videotron, dan Gudang</strong> wajib menguasai 6 poin kompetensi kelistrikan dasar (Basic Electrical). Tingkat penguasaan kelistrikan ini dicatat dalam sistem dan menjadi prasyarat mutlak untuk <strong>kenaikan status kepegawaian</strong> (Magang ke Kontrak, Kontrak ke Tetap) serta penilaian kinerja tahunan.
                </p>
                <div className="text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1 pt-2">
                  <span>⚡ <strong className="text-slate-200">Admin/Supervisor/TL</strong> dapat memberikan verifikasi centang kelayakan langsung.</span>
                  <span>✍️ <strong className="text-slate-200">Staff</strong> dapat mengambil Quiz K3 Kelistrikan secara mandiri untuk membuka modul pertama.</span>
                </div>
              </div>
            </div>

            {/* HIERARCHICAL COMPETENCY DEVELOPMENT FLOW (ROADMAP) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-indigo-50 text-indigo-600 rounded">
                    <Award className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Alur Standardisasi Pelatihan & Sertifikasi</h3>
                    <p className="text-[10px] text-slate-400">Kerangka Penilaian Kompetensi Kelistrikan Dasar RIZ-PRODUCTION</p>
                  </div>
                </div>

                {(currentUser.role === 'Admin' || currentUser.role === 'Supervisor' || currentUser.role === 'Manager') && (
                  <button
                    type="button"
                    onClick={handleResetAllCompetencies}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
                    title="Reset seluruh hasil kompetensi dan sertifikasi semua staff ke 0%"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Reset Semua Kompetensi Staff (0%)</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-2.5 items-stretch relative">
                {[
                  { name: 'Program', desc: 'Regulasi Dasar' },
                  { name: 'Bidang', desc: 'Basic Electrical' },
                  { name: 'Modul', desc: '6 Materi Inti' },
                  { name: 'Unit Kompetensi', desc: 'Standar Kelayakan' },
                  { name: 'Elemen Kompetensi', desc: 'Rincian Kriteria' },
                  { name: 'Indikator Unjuk Kerja', desc: 'Metrik Pengukuran' },
                  { name: 'Materi', desc: 'K3 & Teori Fisika' },
                  { name: 'Workshop', desc: 'Praktek Lapangan' },
                  { name: 'Assessment', desc: 'Uji Mandiri / TL' },
                  { name: 'Evidence', desc: 'Portofolio / Log' },
                  { name: 'Certification', desc: 'Rekomendasi TL' }
                ].map((step, sIdx, arr) => (
                  <div key={sIdx} className="flex flex-col items-center justify-between text-center relative group">
                    <div className="w-full h-full p-2.5 bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-200 rounded-lg transition-all flex flex-col items-center justify-center space-y-1">
                      <span className="text-[9px] font-mono font-bold text-indigo-500">0{sIdx + 1}</span>
                      <span className="font-bold text-[11px] text-slate-800 leading-tight">{step.name}</span>
                      <span className="text-[9px] text-slate-400 font-medium leading-none">{step.desc}</span>
                    </div>
                    {sIdx < arr.length - 1 && (
                      <div className="hidden lg:flex items-center absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                        →
                      </div>
                    )}
                    {sIdx < arr.length - 1 && (
                      <div className="flex lg:hidden text-center text-slate-300 my-0.5 justify-center w-full">
                        ↓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* HIGH-LEVEL ANALYTICS METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Rasio Penguasaan Kompetensi</div>
                  <div className="text-2xl font-bold text-amber-600">{overallPct}% <span className="text-xs font-normal text-slate-400">Rerata</span></div>
                  <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${overallPct}%` }}></div>
                  </div>
                </div>
                <div className="p-3 bg-amber-50 text-amber-500 rounded-lg">
                  <Zap className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* DIRECTORY GRID AND DETAIL DRAWER */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* FILTERABLE LIST OF EMPLOYEES */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={progressSearch}
                      onChange={(e) => setProgressSearch(e.target.value)}
                      placeholder="Cari nama staff / posisi..."
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Divisi:</span>
                    <select
                      value={progressFilterDivision}
                      onChange={(e) => setProgressFilterDivision(e.target.value)}
                      className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="All">Semua Divisi Wajib</option>
                      <option value="Sound (Audio)">Sound (Audio)</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Multimedia">Multimedia</option>
                      <option value="Videotron">Videotron</option>
                      <option value="Gudang">Gudang</option>
                    </select>
                  </div>
                </div>

                {/* STAFF GRIDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredStaff.length === 0 ? (
                    <div className="col-span-2 text-center py-12 bg-white border border-dashed border-slate-200 rounded-xl space-y-2">
                      <User className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-500">Tidak ada staff kelistrikan yang cocok dengan pencarian.</p>
                    </div>
                  ) : (
                    filteredStaff.map(staff => {
                      const progress = getStaffProgress(staff.id);
                      const isSelected = selectedStaffId === staff.id;

                      return (
                        <div
                          key={staff.id}
                          onClick={() => {
                            setSelectedStaffId(staff.id);
                            setQuizActive(false);
                            setQuizCompleted(false);
                          }}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-3.5 relative ${isSelected
                            ? 'bg-indigo-50/40 border-indigo-500 shadow-sm'
                            : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'
                            }`}
                        >
                          {/* Top row */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm leading-tight">{staff.name}</h4>
                              <p className="text-[10px] text-slate-400 font-mono font-medium">{staff.role} • Divisi {staff.division === 'Audio' ? 'Sound (Audio)' : staff.division}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide border ${staff.division === 'Audio' ? 'bg-red-50 text-red-700 border-red-200' :
                              staff.division === 'Lighting' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                staff.division === 'Multimedia' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                  staff.division === 'Videotron' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    'bg-orange-50 text-orange-700 border-orange-200'
                              }`}>
                              {staff.division === 'Audio' ? 'Sound' : staff.division}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span className="text-slate-500">Kompetensi Kelistrikan</span>
                              <span className={progress.count === 6 ? 'text-emerald-600' : 'text-slate-700'}>
                                {progress.count}/6 Modul ({progress.pct}%)
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${progress.count === 6 ? 'bg-emerald-500' :
                                  progress.count >= 4 ? 'bg-indigo-500' :
                                    progress.count >= 2 ? 'bg-amber-500' : 'bg-slate-400'
                                  }`}
                                style={{ width: `${progress.pct}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Bottom Row Badge status */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100/80">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${progress.titleColor}`}>
                              {progress.title}
                            </span>
                            <span className="text-[10px] text-indigo-600 font-semibold hover:underline">
                              Lihat detail &raquo;
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* SELECTED STAFF COMPETENCY DETAILS PANEL / QUIZ INTERACTIVE */}
              <div className="lg:col-span-1">
                {!selectedStaff ? (
                  <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm text-center space-y-4 py-16 sticky top-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-full text-slate-300 flex items-center justify-center mx-auto">
                      <Zap className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-slate-700 text-sm">Detail Kompetensi Staff</h3>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Silakan klik salah satu nama staff di sebelah kiri untuk melihat rincian kompetensi, memverifikasi kemampuan, atau mengikuti ujian mandiri.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6 sticky top-6">

                    {/* Drawer Header */}
                    <div className="pb-4 border-b border-slate-100 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Karyawan Terpilih</div>
                          <h3 className="font-bold text-slate-900 text-base leading-tight">{selectedStaff.name}</h3>
                          <p className="text-xs text-slate-500">{selectedStaff.role} • {selectedStaff.division === 'Audio' ? 'Sound (Audio)' : selectedStaff.division}</p>
                        </div>
                        <button
                          onClick={() => setSelectedStaffId(null)}
                          className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Current summary status */}
                      <div className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200/60 rounded-lg">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-500">Kualifikasi Saat Ini:</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] border ${selectedProgress?.titleColor}`}>
                            {selectedProgress?.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium">
                          {selectedProgress?.count === 6 ? (
                            <span className="text-emerald-700">🌟 <strong className="font-bold">LULUS SELEKSI KELISTRIKAN</strong>: Staff memenuhi seluruh standar electrical untuk kenaikan status kepegawaian!</span>
                          ) : (
                            <span className="text-slate-500">⚠️ Butuh <strong className="font-bold text-slate-700">{6 - (selectedProgress?.count || 0)} modul lagi</strong> untuk direkomendasikan naik status pegawai tetap.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* INTERACTIVE QUIZ WORKSPACE */}
                    {quizActive ? (
                      <div className="bg-slate-50 border border-indigo-200 p-4 rounded-xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
                            <BookOpen className="w-4 h-4 text-indigo-600" />
                            Uji Mandiri: Pertanyaan {quizCurrentIndex + 1}/5
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">Skor: {quizScore} / 5</span>
                        </div>

                        {!quizCompleted ? (
                          <div className="space-y-4">
                            <p className="text-xs font-bold text-slate-900 leading-relaxed">
                              {QUIZ_QUESTIONS[quizCurrentIndex].question}
                            </p>

                            <div className="space-y-2">
                              {QUIZ_QUESTIONS[quizCurrentIndex].options.map((opt, oIdx) => {
                                const hasAnswered = quizAnswers.length > quizCurrentIndex;
                                const isSelected = quizAnswers[quizCurrentIndex] === oIdx;
                                const isCorrect = QUIZ_QUESTIONS[quizCurrentIndex].correctIndex === oIdx;

                                let optClass = 'border-slate-200 bg-white hover:border-slate-300';
                                if (hasAnswered) {
                                  if (isSelected && isCorrect) optClass = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold';
                                  else if (isSelected && !isCorrect) optClass = 'border-rose-500 bg-rose-50/80 text-rose-950';
                                  else if (!isSelected && isCorrect) optClass = 'border-emerald-500 bg-emerald-50/30 text-emerald-950';
                                  else optClass = 'border-slate-100 bg-white opacity-60';
                                } else if (isSelected) {
                                  optClass = 'border-indigo-500 bg-indigo-50 text-indigo-950 font-semibold';
                                }

                                return (
                                  <button
                                    key={oIdx}
                                    type="button"
                                    disabled={hasAnswered}
                                    onClick={() => {
                                      const newAnswers = [...quizAnswers];
                                      newAnswers[quizCurrentIndex] = oIdx;
                                      setQuizAnswers(newAnswers);
                                      if (oIdx === QUIZ_QUESTIONS[quizCurrentIndex].correctIndex) {
                                        setQuizScore(prev => prev + 1);
                                      }
                                    }}
                                    className={`w-full p-2.5 text-left text-xs rounded-lg border transition-all cursor-pointer ${optClass}`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Show Explanation once answered */}
                            {quizAnswers.length > quizCurrentIndex && (
                              <div className="p-3 rounded-lg text-[11px] leading-relaxed bg-indigo-50 text-indigo-900 border border-indigo-100">
                                <strong className="font-bold">Penjelasan Teknik:</strong> {QUIZ_QUESTIONS[quizCurrentIndex].explanation}
                              </div>
                            )}

                            {/* Navigation */}
                            <div className="flex justify-end pt-2">
                              {quizAnswers.length > quizCurrentIndex && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (quizCurrentIndex < 4) {
                                      setQuizCurrentIndex(prev => prev + 1);
                                    } else {
                                      setQuizCompleted(true);
                                    }
                                  }}
                                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm"
                                >
                                  {quizCurrentIndex === 4 ? 'Lihat Hasil Akhir' : 'Lanjut Pertanyaan'}
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          // QUIZ COMPLETED SCREEN
                          <div className="text-center py-4 space-y-4">
                            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                              <Award className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-bold text-slate-800 text-sm">Uji Kelayakan Kelistrikan Selesai!</h4>
                              <p className="text-xs text-slate-500">Anda menjawab dengan benar <strong className="text-slate-800 font-bold">{quizScore} dari 5</strong> pertanyaan.</p>
                            </div>

                            {/* Scoring Logic */}
                            {quizScore >= 4 ? (
                              <div className="space-y-3.5 bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                                <div className="text-xs text-emerald-800 font-bold leading-relaxed">
                                  🎉 LUAR BIASA! Anda Lulus dengan Skor {(quizScore / 5) * 100}% (Syarat minimal lulus: 80%).
                                </div>
                                <p className="text-[10px] text-emerald-700">
                                  Anda berhak mendapatkan sertifikasi modul pertama secara otomatis untuk pembukaan progress status karir Anda.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => handleClaimSafetyCertification(selectedStaff.id)}
                                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-sm transition-all flex items-center justify-center gap-1.5"
                                >
                                  <Check className="w-4 h-4" /> Klaim Sertifikasi K3 Kelistrikan
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-3 bg-rose-50 border border-rose-200 p-4 rounded-lg">
                                <div className="text-xs text-rose-800 font-bold">
                                  ❌ BELUM LULUS (Skor {(quizScore / 5) * 100}%)
                                </div>
                                <p className="text-[10px] text-rose-700">
                                  Dibutuhkan minimal 4 dari 5 jawaban benar (skor 80%) untuk lulus uji mandiri. Silakan baca pembahasan di setiap pertanyaan dan coba kembali.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setQuizCurrentIndex(0);
                                    setQuizAnswers([]);
                                    setQuizScore(0);
                                    setQuizCompleted(false);
                                  }}
                                  className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs cursor-pointer shadow-sm transition-all"
                                >
                                  Coba Ujian Kembali
                                </button>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => setQuizActive(false)}
                              className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer underline"
                            >
                              Kembali ke Daftar Kompetensi
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      // STANDARD LIST OF 6 COMPETENCIES
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Metrik Penilaian Kelayakan:</h4>

                          {/* Staff Self Testing Trigger button */}
                          <button
                            onClick={() => {
                              setQuizActive(true);
                              setQuizCurrentIndex(0);
                              setQuizAnswers([]);
                              setQuizScore(0);
                              setQuizCompleted(false);
                            }}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-extrabold rounded shadow-xs flex items-center gap-1 cursor-pointer transition-all uppercase tracking-wide"
                          >
                            <HelpCircle className="w-3.5 h-3.5" /> Uji Kompetensi Dasar
                          </button>
                        </div>

                        <div className="space-y-3">
                          {ELECTRICAL_COMPETENCIES.map((comp, idx) => {
                            const staffComps = electricalCompetencies[selectedStaff.id] || {};
                            const compStatus = staffComps[comp.key] || { verified: false };
                            const isVerified = compStatus.verified;
                            const isAuthorized = canVerifyFor(selectedStaff);

                            return (
                              <div
                                key={comp.key}
                                className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 relative ${isVerified
                                  ? 'bg-emerald-50/40 border-emerald-200'
                                  : 'bg-white border-slate-100 hover:border-slate-200'
                                  }`}
                              >
                                <div className={`p-1.5 rounded-md mt-0.5 ${isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                                  }`}>
                                  <Zap className="w-4 h-4" />
                                </div>

                                <div className="space-y-1.5 flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-1">
                                    <h5 className="font-bold text-slate-800 text-[11px] leading-snug">{idx + 1}. {comp.title}</h5>
                                    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                                      }`}>
                                      {isVerified ? 'PASSED' : 'PENDING'}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 leading-relaxed">{comp.desc}</p>

                                  {isVerified && (
                                    <div className="text-[9px] text-emerald-700 font-mono flex flex-wrap gap-x-2 bg-emerald-50/80 p-1.5 rounded border border-emerald-100">
                                      <span>✅ Approved: <strong className="font-semibold">{compStatus.verifiedBy}</strong></span>
                                      <span>📅 Tgl: <strong className="font-semibold">{compStatus.dateVerified}</strong></span>
                                    </div>
                                  )}

                                  {/* Toggle controls for Supervisor / TL */}
                                  {isAuthorized ? (
                                    <div className="pt-2 flex items-center justify-end">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleCompetency(selectedStaff.id, comp.key)}
                                        className={`px-2.5 py-1 text-[9px] font-bold rounded cursor-pointer border flex items-center gap-1.5 transition-all ${isVerified
                                          ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                          : 'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700'
                                          }`}
                                      >
                                        {isVerified ? (
                                          <>✕ Batalkan Persetujuan</>
                                        ) : (
                                          <><Check className="w-3 h-3" /> Setujui & Berikan Centang</>
                                        )}
                                      </button>
                                    </div>
                                  ) : (
                                    !isVerified && (
                                      <div className="text-[9px] text-slate-400 font-mono italic pt-1.5 flex items-center gap-1">
                                        🔒 Memerlukan otorisasi Atasan / TL divisi terkait untuk approval.
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>

            </div>

          </div>
        );
      })()}

      {/* VIEW 4: MAINTENANCE & SERVICE DASHBOARD */}
      {activeSubTab === 'maintenance_dashboard' && (() => {
        const isSvcDiv = (picName: string, divisionName?: string) => {
          const svcNames = ['mang damri', 'damri', 'kharo', 'service'];
          return svcNames.includes((picName || '').toLowerCase()) || divisionName === 'Service';
        };

        const getWoMonthKey = (wo: any): string => {
          const raw = String(wo.dateCreated || wo.date || wo.deadline || '');
          if (raw.length >= 7) {
            return raw.slice(0, 7);
          }
          const match = String(wo.id || wo.description || '').match(/202[0-9][-]?0[1-9]|202[0-9][-]1[0-2]/);
          if (match) {
            const clean = match[0].replace('-', '');
            return `${clean.slice(0, 4)}-${clean.slice(4, 6)}`;
          }
          return '';
        };

        const getSchMonthKey = (sch: any): string => {
          const raw = String(sch.nextDate || sch.lastDate || sch.date || '');
          if (raw.length >= 7) {
            return raw.slice(0, 7);
          }
          return '';
        };

        const filteredSchedules = maintenanceSchedules.filter(sch => {
          const nameMatch = sch.assetName.toLowerCase().includes(maintenanceSearch.toLowerCase());
          const codeMatch = sch.assetCode.toLowerCase().includes(maintenanceSearch.toLowerCase());
          const notesMatch = (sch.notes || '').toLowerCase().includes(maintenanceSearch.toLowerCase());
          const matchesSearch = nameMatch || codeMatch || notesMatch;

          const matchesDiv = maintenanceFilterDivision === 'All' || sch.assetCode.toLowerCase().includes(`-${maintenanceFilterDivision.substring(0, 3).toLowerCase()}-`);

          const schMonth = getSchMonthKey(sch);
          const matchesMonth = !activeMonth || activeMonth === 'all' || !schMonth || schMonth === activeMonth;

          return matchesSearch && matchesDiv && matchesMonth;
        });

        const filteredWorkOrders = localWorkOrders.filter(wo => {
          const titleMatch = (wo.title || '').toLowerCase().includes(maintenanceSearch.toLowerCase());
          const descMatch = (wo.description || '').toLowerCase().includes(maintenanceSearch.toLowerCase());
          const picMatch = (wo.pic || '').toLowerCase().includes(maintenanceSearch.toLowerCase());
          const matchesSearch = titleMatch || descMatch || picMatch;

          const matchesDiv = maintenanceFilterDivision === 'All' ||
            wo.division === maintenanceFilterDivision ||
            (maintenanceFilterDivision === 'Audio' && wo.division === 'Audio') ||
            (maintenanceFilterDivision === 'Lighting' && wo.division === 'Lighting') ||
            (maintenanceFilterDivision === 'Videotron' && wo.division === 'Videotron') ||
            (maintenanceFilterDivision === 'Multimedia' && wo.division === 'Multimedia') ||
            (maintenanceFilterDivision === 'Gudang' && wo.division === 'Gudang') ||
            (maintenanceFilterDivision === 'Service' && wo.division === 'Service');

          const woMonth = getWoMonthKey(wo);
          const matchesMonth = !activeMonth || activeMonth === 'all' || !woMonth || woMonth === activeMonth;

          return matchesSearch && matchesDiv && matchesMonth;
        });

        const selfRepairItems = filteredWorkOrders.filter(wo => !isSvcDiv(wo.pic, wo.division));
        const serviceDivisionItems = filteredWorkOrders.filter(wo => isSvcDiv(wo.pic, wo.division));

        const activeRoutineCount = filteredSchedules.filter(s => s.status !== 'Done').length;
        const activeSelfRepairCount = selfRepairItems.filter(wo => wo.status !== 'Completed' && wo.status !== 'Cancelled').length;
        const activeServiceCount = serviceDivisionItems.filter(wo => wo.status !== 'Completed' && wo.status !== 'Cancelled').length;
        const totalCompletedCount = filteredSchedules.filter(s => s.status === 'Done').length + filteredWorkOrders.filter(wo => wo.status === 'Completed').length;

        const saveSchedulesState = (updated: any[]) => {
          setMaintenanceSchedules(updated);
          localStorage.setItem('riz_schedules', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        };

        const saveWorkOrdersState = (updated: any[]) => {
          setLocalWorkOrders(updated);
          try {
            localStorage.setItem('riz_work_orders_v2', JSON.stringify(updated));
            localStorage.setItem('riz_work_orders', JSON.stringify(updated));
          } catch (e) { }
          window.dispatchEvent(new Event('storage'));
        };

        const handleCompleteSchedule = (id: string, name: string) => {
          const today = new Date().toISOString().split('T')[0];
          const next = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          const updated = maintenanceSchedules.map(sch => {
            if (sch.id === id) {
              return { ...sch, status: 'Done', lastDate: today, nextDate: next };
            }
            return sch;
          });
          saveSchedulesState(updated);
          onLogActivity(currentUser.name, currentUser.role, `Menyelesaikan maintenance rutin berkala alat: ${name}`);
          alert(`Maintenance rutin untuk ${name} berhasil dicentang SELESAI!`);
        };

        const handleUpdateSelfRepairProgress = (id: string, name: string, currentProgress: number) => {
          const nextProgress = Math.min(currentProgress + 20, 100);
          const nextStatus = nextProgress === 100 ? 'Completed' : 'In Progress';
          const updated = localWorkOrders.map(wo => {
            if (wo.id === id) {
              return { ...wo, progress: nextProgress, status: nextStatus };
            }
            return wo;
          });
          saveWorkOrdersState(updated);
          onLogActivity(currentUser.name, currentUser.role, `Mengupdate progres perbaikan mandiri ${name} menjadi ${nextProgress}%`);
          if (nextProgress === 100) {
            alert(`Perbaikan mandiri untuk ${name} selesai 100%!`);
          }
        };

        const handleCompleteWorkOrder = (id: string, name: string) => {
          const updated = localWorkOrders.map(wo => {
            if (wo.id === id) {
              return { ...wo, progress: 100, status: 'Completed' };
            }
            return wo;
          });
          saveWorkOrdersState(updated);
          onLogActivity(currentUser.name, currentUser.role, `Menyelesaikan perbaikan mandiri/divisi service untuk: ${name}`);
          alert(`Perbaikan untuk ${name} berhasil diselesaikan 100%!`);
        };

        const handleStartServiceOrder = (id: string, name: string) => {
          const updated = localWorkOrders.map(wo => {
            if (wo.id === id) {
              return { ...wo, status: 'In Progress', progress: 10 };
            }
            return wo;
          });
          saveWorkOrdersState(updated);
          onLogActivity(currentUser.name, currentUser.role, `Memulai penanganan servis oleh divisi perbaikan untuk: ${name}`);
        };

        const handleDeleteItem = (id: string, type: 'schedule' | 'wo', name: string) => {
          if (!confirm(`Apakah Anda yakin ingin menghapus pencatatan pemeliharaan ${name}?`)) return;
          if (type === 'schedule') {
            const updated = maintenanceSchedules.filter(sch => sch.id !== id);
            saveSchedulesState(updated);
          } else {
            const updated = localWorkOrders.filter(wo => wo.id !== id);
            saveWorkOrdersState(updated);
          }
          onLogActivity(currentUser.name, currentUser.role, `Menghapus pencatatan pemeliharaan/perbaikan alat: ${name}`);
        };

        const handleAddNewMaintenanceItem = (e: React.FormEvent) => {
          e.preventDefault();
          if (!newEquipName || !newDesc) {
            alert('Nama alat dan deskripsi wajib diisi!');
            return;
          }

          const todayString = new Date().toISOString().split('T')[0];

          if (newType === 'Routine') {
            const newSch: any = {
              id: 'ms-' + Date.now(),
              assetName: newEquipName,
              assetCode: newEquipCode || 'AST-' + newEquipName.substring(0, 3).toUpperCase() + '-' + Math.floor(Math.random() * 1000),
              type: 'Preventive',
              frequency: 'Bulanan',
              lastDate: todayString,
              nextDate: newDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              status: 'Scheduled',
              notes: newDesc
            };
            const updated = [newSch, ...maintenanceSchedules];
            saveSchedulesState(updated);
            onLogActivity(currentUser.name, currentUser.role, `Menambahkan agenda Maintenance Rutin baru untuk ${newEquipName}`);
          } else {
            const isSvc = newType === 'Service';
            const selectedPic = newPic || (isSvc ? 'Kharo' : currentUser.name);
            const newWO: any = {
              id: 'wo-' + Date.now(),
              title: `Perbaikan: ${newEquipName}`,
              description: newDesc,
              pic: selectedPic,
              division: isSvc ? 'Service' : currentUser.division,
              deadline: newDeadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              progress: 0,
              status: 'Pending',
              dateCreated: todayString
            };
            const updated = [newWO, ...localWorkOrders];
            saveWorkOrdersState(updated);
            onLogActivity(currentUser.name, currentUser.role, `Menambahkan Work Order perbaikan (${isSvc ? 'Divisi Service' : 'Mandiri'}) untuk ${newEquipName}`);
          }

          setNewEquipName('');
          setNewEquipCode('');
          setNewDesc('');
          setNewPic('');
          setNewDeadline('');
          setShowAddForm(false);
          alert('Agenda pemeliharaan/perbaikan berhasil ditambahkan!');
        };

        return (
          <div className="space-y-6">
            {/* Header section with inline form toggle */}
            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-500/20 text-indigo-300 rounded">
                    <Wrench className="w-5 h-5" />
                  </span>
                  <h2 className="text-lg font-bold tracking-tight">Kondisi & Status Pemeliharaan Peralatan</h2>
                </div>
                <p className="text-xs text-slate-400">
                  Dashboard indikator monitoring peralatan yang sedang maintenance rutin, perbaikan mandiri oleh divisi terkait, atau diservis oleh Divisi Service.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow transition-all cursor-pointer"
              >
                {showAddForm ? 'Tutup Form' : 'Tambah Agenda Pemeliharaan'}
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Addition Form (Inline and Interactive) */}
            {showAddForm && (
              <form
                onSubmit={handleAddNewMaintenanceItem}
                className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Formulir Agenda Pemeliharaan / Perbaikan Baru</h3>
                  <span className="text-[10px] text-slate-400 font-medium">Semua Staff / TL / Gudang / Admin dapat mengisi form ini</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Peralatan / Alat</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Moving Head Beam, Kabel XLR, Mixer CL5"
                      value={newEquipName}
                      onChange={(e) => setNewEquipName(e.target.value)}
                      className="w-full text-xs p-2 rounded border border-slate-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kode Asset (Opsional)</label>
                    <input
                      type="text"
                      placeholder="Contoh: AST-AUD-005, AST-LGT-12"
                      value={newEquipCode}
                      onChange={(e) => setNewEquipCode(e.target.value)}
                      className="w-full text-xs p-2 rounded border border-slate-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kategori Alur Pemeliharaan</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full text-xs p-2 rounded border border-slate-200 focus:border-indigo-500 focus:outline-none bg-white font-semibold"
                    >
                      <option value="Routine">1. Maintenance Rutin (Preventive)</option>
                      <option value="SelfRepair">2. Perbaikan Mandiri (Divisi Sendiri)</option>
                      <option value="Service">3. Dikelola Divisi Service (Perbaikan Khusus)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Detail Kegiatan / Catatan Kerusakan / Keluhan</label>
                    <input
                      type="text"
                      required
                      placeholder="Deskripsikan masalah alat atau tindakan maintenance rutin secara mendetail..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full text-xs p-2 rounded border border-slate-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target PIC / Teknisi</label>
                    <select
                      value={newPic}
                      onChange={(e) => setNewPic(e.target.value)}
                      className="w-full text-xs p-2 rounded border border-slate-200 focus:border-indigo-500 focus:outline-none bg-white font-semibold"
                    >
                      <option value="">-- Pilih PIC Default atau Karyawan --</option>
                      {staffList.map(st => (
                        <option key={st.id} value={st.name}>{st.name} ({st.division} - {st.role})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Batas Waktu / Target Selesai</label>
                    <input
                      type="date"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="w-full text-xs p-2 rounded border border-slate-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Prioritas Urgensi</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full text-xs p-2 rounded border border-slate-200 focus:border-indigo-500 focus:outline-none bg-white font-semibold text-slate-700"
                    >
                      <option value="Rendah">🟢 Rendah (Biasa)</option>
                      <option value="Sedang">🟡 Sedang (Menengah)</option>
                      <option value="Tinggi">🔴 Tinggi (Sangat Mendesak)</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded shadow cursor-pointer transition-all uppercase tracking-wider"
                    >
                      Simpan ke Agenda Dashboard
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Stats Cards Section */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">1. Maintenance Rutin</div>
                  <div className="text-lg font-extrabold text-slate-800">{activeRoutineCount} <span className="text-[10px] text-slate-400 font-normal">alat aktif</span></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">2. Perbaikan Mandiri</div>
                  <div className="text-lg font-extrabold text-slate-800">{activeSelfRepairCount} <span className="text-[10px] text-slate-400 font-normal">alat ditangani</span></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600 shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">3. Divisi Service</div>
                  <div className="text-lg font-extrabold text-slate-800">{activeServiceCount} <span className="text-[10px] text-slate-400 font-normal">antrean servis</span></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Total Selesai</div>
                  <div className="text-lg font-extrabold text-slate-800">{totalCompletedCount} <span className="text-[10px] text-emerald-500 font-semibold">Done / Resolved</span></div>
                </div>
              </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Cari alat, kode, PIC, atau keluhan kerusakan..."
                  value={maintenanceSearch}
                  onChange={(e) => setMaintenanceSearch(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 focus:outline-none w-full"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Filter Divisi:</span>
                {['All', 'Audio', 'Lighting', 'Videotron', 'Multimedia', 'Service'].map(div => (
                  <button
                    key={div}
                    type="button"
                    onClick={() => setMaintenanceFilterDivision(div)}
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-all cursor-pointer ${maintenanceFilterDivision === div
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {div === 'All' ? 'SEMUA DIVISI' : div.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Three Columns Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* COLUMN 1: MAINTENANCE RUTIN (PREVENTIVE) */}
              <div className="space-y-4">
                <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                    <h3 className="font-extrabold text-xs text-blue-950 uppercase tracking-wide">1. Maintenance Rutin</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[9px] font-black">
                    {filteredSchedules.length} Items
                  </span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {filteredSchedules.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      <p className="text-[10px] text-slate-400 font-medium">Tidak ada agenda maintenance rutin aktif.</p>
                    </div>
                  ) : (
                    filteredSchedules.map(sch => {
                      const isOverdue = sch.status === 'Overdue';
                      const isDone = sch.status === 'Done';

                      return (
                        <div
                          key={sch.id}
                          className={`p-4 rounded-xl border transition-all relative group bg-white ${isDone
                            ? 'border-emerald-100 opacity-70'
                            : isOverdue
                              ? 'border-rose-200 bg-rose-50/20'
                              : 'border-slate-100 hover:border-slate-200'
                            }`}
                        >
                          <div className="flex items-start justify-between gap-1.5 mb-2">
                            <div>
                              <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                {sch.assetCode}
                              </span>
                              <h4 className="font-extrabold text-slate-800 text-xs mt-1">{sch.assetName}</h4>
                            </div>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : isOverdue
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-blue-100 text-blue-800'
                              }`}>
                              {sch.status}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 mb-3 bg-slate-50/50 p-2 rounded border border-slate-100/50 italic leading-relaxed">
                            "{sch.notes}"
                          </p>

                          <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-500 font-mono border-t border-slate-100 pt-2 mb-3">
                            <div>
                              <span className="block text-[8px] text-slate-400 uppercase">Tgl Terakhir Checked:</span>
                              <span className="font-bold">{sch.lastDate || '-'}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-slate-400 uppercase">Jadwal Berikutnya:</span>
                              <span className={`font-bold ${isOverdue ? 'text-rose-600 font-black' : ''}`}>{sch.nextDate}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                              🔄 Frekuensi: {sch.frequency}
                            </span>

                            <div className="flex items-center gap-1">
                              {!isDone && (
                                <button
                                  type="button"
                                  onClick={() => handleCompleteSchedule(sch.id, sch.assetName)}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold rounded flex items-center gap-0.5 shadow-xs transition-all cursor-pointer"
                                >
                                  Tandai Done
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(sch.id, 'schedule', sch.assetName)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* COLUMN 2: PERBAIKAN MANDIRI (IN-HOUSE DIVISION) */}
              <div className="space-y-4">
                <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse"></span>
                    <h3 className="font-extrabold text-xs text-amber-950 uppercase tracking-wide">2. Perbaikan Mandiri</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[9px] font-black">
                    {selfRepairItems.length} Items
                  </span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {selfRepairItems.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      <p className="text-[10px] text-slate-400 font-medium">Tidak ada perbaikan mandiri aktif.</p>
                    </div>
                  ) : (
                    selfRepairItems.map(wo => {
                      const isCompleted = wo.status === 'Completed';
                      const isHigh = wo.priority === 'Tinggi';

                      return (
                        <div
                          key={wo.id}
                          className={`p-4 rounded-xl border transition-all relative bg-white ${isCompleted
                            ? 'border-emerald-100 opacity-70'
                            : 'border-slate-100 hover:border-slate-200 shadow-xs'
                            }`}
                        >
                          <div className="flex items-start justify-between gap-1.5 mb-1.5">
                            <div>
                              <span className="text-[8px] font-bold uppercase text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                Divisi {wo.division}
                              </span>
                              <h4 className="font-extrabold text-slate-800 text-xs mt-1">{wo.title}</h4>
                            </div>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isHigh
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                              }`}>
                              {wo.status}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 mb-3 bg-slate-50/50 p-2 rounded border border-slate-100/50 italic leading-relaxed">
                            "{wo.description}"
                          </p>

                          {/* Progress bar */}
                          <div className="space-y-1 mb-3">
                            <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
                              <span>Progres Perbaikan:</span>
                              <span className="font-black text-indigo-600">{wo.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${wo.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-500 font-mono border-t border-slate-100 pt-2 mb-3">
                            <div>
                              <span className="block text-[8px] text-slate-400 uppercase">Penanggung Jawab PIC:</span>
                              <span className="font-bold text-slate-700">👤 {wo.pic}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-slate-400 uppercase">Target Deadline:</span>
                              <span className="font-bold text-rose-600">📅 {wo.deadline}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1">
                            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase ${isHigh ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                              ⚡ Prioritas: {wo.priority}
                            </span>

                            <div className="flex items-center gap-1">
                              {!isCompleted && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateSelfRepairProgress(wo.id, wo.title, wo.progress)}
                                    className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[9px] font-bold rounded flex items-center gap-0.5 shadow-xs transition-all cursor-pointer"
                                    title="Tambah 20% Progres"
                                  >
                                    +20%
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleCompleteWorkOrder(wo.id, wo.title)}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold rounded flex items-center gap-0.5 shadow-xs transition-all cursor-pointer"
                                  >
                                    Selesai
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(wo.id, 'wo', wo.title)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* COLUMN 3: DIKELOLA DIVISI SERVICE (SPECIALIST) */}
              <div className="space-y-4">
                <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
                    <h3 className="font-extrabold text-xs text-rose-950 uppercase tracking-wide">3. Dikelola Divisi Service</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-[9px] font-black">
                    {serviceDivisionItems.length} Items
                  </span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {serviceDivisionItems.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      <p className="text-[10px] text-slate-400 font-medium">Tidak ada agenda perbaikan oleh Divisi Service.</p>
                    </div>
                  ) : (
                    serviceDivisionItems.map(wo => {
                      const isCompleted = wo.status === 'Completed';
                      const isPending = wo.status === 'Pending';
                      const isHigh = wo.priority === 'Tinggi';

                      return (
                        <div
                          key={wo.id}
                          className={`p-4 rounded-xl border transition-all relative bg-white ${isCompleted
                            ? 'border-emerald-100 opacity-70'
                            : 'border-slate-100 hover:border-slate-200 shadow-xs'
                            }`}
                        >
                          <div className="flex items-start justify-between gap-1.5 mb-1.5">
                            <div>
                              <span className="text-[8px] font-extrabold uppercase text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                                SERVICE DEPT
                              </span>
                              <h4 className="font-extrabold text-slate-800 text-xs mt-1">{wo.title}</h4>
                            </div>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPending
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                              }`}>
                              {wo.status}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 mb-3 bg-slate-50/50 p-2 rounded border border-slate-100/50 italic leading-relaxed">
                            "{wo.description}"
                          </p>

                          <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-500 font-mono border-t border-slate-100 pt-2 mb-3">
                            <div>
                              <span className="block text-[8px] text-slate-400 uppercase">Spesialis Service PIC:</span>
                              <span className="font-extrabold text-rose-700">⚙️ {wo.pic}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-slate-400 uppercase">Target Selesai:</span>
                              <span className="font-bold text-slate-700">📅 {wo.deadline}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1">
                            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase ${isHigh ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                              ⚡ Prioritas: {wo.priority}
                            </span>

                            <div className="flex items-center gap-1">
                              {isPending && (
                                <button
                                  type="button"
                                  onClick={() => handleStartServiceOrder(wo.id, wo.title)}
                                  className="px-2 py-1 bg-rose-500 hover:bg-rose-600 text-white text-[9px] font-bold rounded flex items-center gap-0.5 shadow-xs transition-all cursor-pointer uppercase tracking-wider"
                                >
                                  Mulai Servis
                                </button>
                              )}
                              {wo.status === 'In Progress' && (
                                <button
                                  type="button"
                                  onClick={() => handleCompleteWorkOrder(wo.id, wo.title)}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold rounded flex items-center gap-0.5 shadow-xs transition-all cursor-pointer uppercase tracking-wider"
                                >
                                  Selesai
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(wo.id, 'wo', wo.title)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

          </div>
        );
      })()}

    </div>
  );
}
