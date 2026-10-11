import React, { useState, useEffect } from 'react';
import { Staff, AttendanceLog, WorkSchedule, OFFICIAL_GOOGLE_DRIVE_EVIDENCE_FOLDER_URL } from '../types';
import { STAFF_LIST, getMasterStaffList } from '../data';
import {
  SHIFT_LEGEND,
  SCHEDULE_NOTE,
  StaffScheduleRow,
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
  X
} from 'lucide-react';
import { subscribeCloudCollection, saveCloudDoc, pushCollectionToCloud } from '../lib/cloudSync';

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
  activeMonth?: string;
  onActiveMonthChange?: (monthKey: string) => void;
  scheduleData?: StaffScheduleRow[];
}

export default function Absensi({ currentUser, onLogActivity, forceSubTab, activeMonth = getActiveMonthKey(), onActiveMonthChange, scheduleData = [] }: AbsensiProps) {
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
    const saved = localStorage.getItem('riz_work_orders');
    if (saved) {
      try {
        const parsed: any[] = JSON.parse(saved);
        const cleaned = parsed.filter(w => !['wo-1', 'wo-2', 'wo-3', 'wo-4'].includes(w.id));
        if (cleaned.length !== parsed.length) {
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
  const [scheduleViewMode, setScheduleViewMode] = useState<'official' | 'custom'>('official');
  const [divisionFilter, setDivisionFilter] = useState<string>('All');

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

  // Pagination or filters for schedule grid
  const [scheduleSearch, setScheduleSearch] = useState('');

  // Real-time Cloud Firestore Subscriptions
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

  // Handler to toggle / cycle shift with Cloud Firestore push
  const handleToggleShift = (staffNo: number, day: number) => {
    if (currentUser.role !== 'Admin' && currentUser.role !== 'Supervisor' && currentUser.role !== 'Manager') return;

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

    localStorage.setItem(`riz_schedule_${activeMonth}`, JSON.stringify(updated));
    pushCollectionToCloud(`schedule_${activeMonth}`, updated, currentUser.name);
  };

  useEffect(() => {
    localStorage.setItem('riz_staff_electrical_competencies', JSON.stringify(electricalCompetencies));
    if (electricalCompetencies && Object.keys(electricalCompetencies).length > 0) {
      saveCloudDoc('system_configs', 'staff_electrical_competencies', { data: electricalCompetencies }, currentUser.name);
    }
  }, [electricalCompetencies]);

  // Handle Real GPS detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung oleh browser Anda.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGpsSimulated(`Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`);
      },
      (error) => {
        alert('Gagal mendapatkan lokasi GPS. Pastikan izin lokasi diberikan.');
      }
    );
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
        ? 'Office - HQ (Bypass Team Leader)' 
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
        ? 'Office - HQ (Bypass Team Leader)' 
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

          {/* Sub-Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg self-start">
            <button
              onClick={() => setActiveSubTab('self')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeSubTab === 'self' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Absensi Mandiri
            </button>
            
            {/* Schedule Tab available to Admin, Supervisor and Manager */}
            {(currentUser.role === 'Admin' || currentUser.role === 'Supervisor' || currentUser.role === 'Manager') && (
              <button
                onClick={() => setActiveSubTab('schedule')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeSubTab === 'schedule' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Penjadwalan (1-31)
              </button>
            )}
          </div>
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
                              className={`p-2 border rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                                customStatus === st
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
                        
                        {/* CAMERA SIMULATOR */}
                        <div className="p-4 border border-slate-200 rounded-lg space-y-3 bg-slate-50/50">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                              <Camera className="w-3.5 h-3.5 text-indigo-600" />
                              Foto Selfie Verifikasi
                            </span>
                            {photoSimulated && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">Terlampir</span>
                            )}
                          </div>

                         {photoSimulated ? (
                          <div className="relative group">
                            <img src={photoSimulated} alt="Selfie Absen" className="w-full h-32 object-cover rounded-lg shadow-sm border border-slate-200" />
                            <button
                              type="button"
                              onClick={() => setPhotoSimulated('')}
                              className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 bg-slate-50 relative overflow-hidden">
                              <Camera className="w-8 h-8 mb-2 text-slate-300" />
                              <span className="text-xs font-medium">Foto Selfie Area/Wajah</span>
                              <label className="mt-2 text-[11px] text-indigo-600 font-bold hover:underline cursor-pointer">
                                Buka Kamera
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  capture="environment" 
                                  className="hidden" 
                                  onChange={handlePhotoUpload} 
                                />
                              </label>
                              <a
                                href={OFFICIAL_GOOGLE_DRIVE_EVIDENCE_FOLDER_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1.5 text-[10px] text-indigo-500 hover:text-indigo-700 font-bold block transition-colors"
                              >
                                Folder Drive Bukti Absensi
                              </a>
                          </div>
                        )}
                        </div>

                        {/* GPS LOCATION SIMULATOR */}
                        <div className="p-4 border border-slate-200 rounded-lg space-y-3 bg-slate-50/50">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                              Koordinat GPS Lokasi
                            </span>
                            {gpsSimulated && (
                              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-mono">Tersinkron</span>
                            )}
                          </div>

                          {gpsSimulated ? (
                            <div className="p-2 bg-indigo-50/50 border border-indigo-100 rounded-lg text-xs space-y-1">
                              <div className="font-semibold text-indigo-900">GPS Terdeteksi:</div>
                              <div className="text-[11px] text-slate-600 font-mono leading-tight">{gpsSimulated}</div>
                              <button
                                type="button"
                                onClick={() => setGpsSimulated('')}
                                className="text-[10px] text-indigo-600 underline font-semibold hover:text-indigo-800"
                              >
                                Reset Koordinat
                              </button>
                            </div>
                          ) : (
                            <div className="border border-slate-200 rounded-lg p-3 bg-white text-center space-y-2">
                              <span className="text-xs text-slate-400 block">Koordinat GPS belum diambil</span>
                              <button
                                type="button"
                                onClick={handleDetectGPS}
                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded cursor-pointer transition-colors"
                              >
                                Dapatkan Lokasi GPS
                              </button>
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
                      className={`w-full py-2.5 px-4 rounded-lg text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer ${
                        !userTodayLog
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
                  href={OFFICIAL_GOOGLE_DRIVE_EVIDENCE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
                >
                  Drive Bukti Foto ↗
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setScheduleViewMode('official')}
                className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  scheduleViewMode === 'official'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>📅 Schedule Resmi Bulanan</span>
              </button>
              <button
                type="button"
                onClick={() => setScheduleViewMode('custom')}
                className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  scheduleViewMode === 'custom'
                    ? 'bg-white text-indigo-600 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit className="w-4 h-4" />
                <span>✏️ Editor Tanggal 1-31 (Custom)</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Schedule PDF</span>
              </button>
            </div>
          </div>

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
                      <option value="2026-09">September 2026</option>
                      <option value="2026-10">Oktober 2026</option>
                      <option value="2026-11">November 2026</option>
                      <option value="2026-12">Desember 2026</option>
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
                          {d.day}<br/>
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
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-3.5 relative ${
                            isSelected 
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
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide border ${
                              staff.division === 'Audio' ? 'bg-red-50 text-red-700 border-red-200' :
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
                                className={`h-full rounded-full transition-all duration-500 ${
                                  progress.count === 6 ? 'bg-emerald-500' :
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
                                className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 relative ${
                                  isVerified 
                                    ? 'bg-emerald-50/40 border-emerald-200' 
                                    : 'bg-white border-slate-100 hover:border-slate-200'
                                }`}
                              >
                                <div className={`p-1.5 rounded-md mt-0.5 ${
                                  isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                                }`}>
                                  <Zap className="w-4 h-4" />
                                </div>

                                <div className="space-y-1.5 flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-1">
                                    <h5 className="font-bold text-slate-800 text-[11px] leading-snug">{idx + 1}. {comp.title}</h5>
                                    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                                      isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
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
                                        className={`px-2.5 py-1 text-[9px] font-bold rounded cursor-pointer border flex items-center gap-1.5 transition-all ${
                                          isVerified 
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

        const filteredSchedules = maintenanceSchedules.filter(sch => {
          const nameMatch = sch.assetName.toLowerCase().includes(maintenanceSearch.toLowerCase());
          const codeMatch = sch.assetCode.toLowerCase().includes(maintenanceSearch.toLowerCase());
          const notesMatch = (sch.notes || '').toLowerCase().includes(maintenanceSearch.toLowerCase());
          const matchesSearch = nameMatch || codeMatch || notesMatch;
          
          const matchesDiv = maintenanceFilterDivision === 'All' || sch.assetCode.toLowerCase().includes(`-${maintenanceFilterDivision.substring(0,3).toLowerCase()}-`);
          return matchesSearch && matchesDiv;
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
          return matchesSearch && matchesDiv;
        });

        const selfRepairItems = filteredWorkOrders.filter(wo => !isSvcDiv(wo.pic, wo.division));
        const serviceDivisionItems = filteredWorkOrders.filter(wo => isSvcDiv(wo.pic, wo.division));

        const activeRoutineCount = maintenanceSchedules.filter(s => s.status !== 'Done').length;
        const activeSelfRepairCount = localWorkOrders.filter(wo => !isSvcDiv(wo.pic, wo.division) && wo.status !== 'Completed' && wo.status !== 'Cancelled').length;
        const activeServiceCount = localWorkOrders.filter(wo => isSvcDiv(wo.pic, wo.division) && wo.status !== 'Completed' && wo.status !== 'Cancelled').length;
        const totalCompletedCount = maintenanceSchedules.filter(s => s.status === 'Done').length + localWorkOrders.filter(wo => wo.status === 'Completed').length;

        const saveSchedulesState = (updated: any[]) => {
          setMaintenanceSchedules(updated);
          localStorage.setItem('riz_schedules', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        };

        const saveWorkOrdersState = (updated: any[]) => {
          setLocalWorkOrders(updated);
          localStorage.setItem('riz_work_orders', JSON.stringify(updated));
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
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-all cursor-pointer ${
                      maintenanceFilterDivision === div
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
                          className={`p-4 rounded-xl border transition-all relative group bg-white ${
                            isDone 
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
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                              isDone 
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
                          className={`p-4 rounded-xl border transition-all relative bg-white ${
                            isCompleted 
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
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                              isCompleted 
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
                            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase ${
                              isHigh ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
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
                          className={`p-4 rounded-xl border transition-all relative bg-white ${
                            isCompleted 
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
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                              isCompleted 
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
                            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase ${
                              isHigh ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
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
