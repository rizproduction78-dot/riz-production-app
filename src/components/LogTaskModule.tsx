/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PrintHeader } from './PrintHeader';
import { Staff, Division, DailyReport as DailyReportType, DailyTask, Finding, LogbookEntry, WorkOrder } from '../types';
import { STAFF_LIST, QC_ITEMS_BY_DIVISION, getMasterStaffList } from '../data';
import { DIVISION_DAILY_TASK_REFERENCES } from '../data/divisionTaskTemplates';
import { db } from '../lib/firebase';
import { collection, onSnapshot, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { saveCloudDoc, deleteCloudDoc, subscribeCloudCollection } from '../lib/cloudSync';
import { getStaffDivisions, isStaffInDivision } from '../utils/kpiCalculator';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Briefcase,
  Trash2,
  Edit2,
  Send,
  Cloud,
  CheckSquare,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  Image as ImageIcon,
  Flame,
  ArrowRight,
  Sparkles,
  AlertOctagon,
  Check,
  X,
  Shield,
  ClipboardCheck,
  CheckCircle,
  Wrench,
  Camera,
  Upload,
  Eye
} from 'lucide-react';

export interface QcItemState {
  status: 'OK' | 'NG';
  notes: string;
}

interface LogTaskModuleProps {
  currentUser: Staff;
  dailyReports: DailyReportType[];
  onAddReport: (report: Omit<DailyReportType, 'id'>) => void;
  onDeleteReport: (id: string) => void;
  onAddFinding?: (finding: Omit<Finding, 'id' | 'dateCreated'>) => void;
  onLogActivity: (username: string, role: string, action: string) => void;
  initialTasks: DailyTask[];
  onUpdateTasks?: (tasks: DailyTask[]) => void;
  logbookEntries?: LogbookEntry[];
  onAddLogbookEntry?: (entry: Omit<LogbookEntry, 'id'>) => void;
  workOrders?: WorkOrder[];
  initialSubTab?: 'kanban' | 'qc_checklist' | 'logbook' | 'rekap';
}

const DIVISION_CONFIG: Record<Division, { color: string; bg: string; icon: string }> = {
  Audio:      { color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', icon: '🔊' },
  Lighting:   { color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200',   icon: '💡' },
  Videotron:  { color: 'text-cyan-600',   bg: 'bg-cyan-50 border-cyan-200',     icon: '📺' },
  Multimedia: { color: 'text-red-600',    bg: 'bg-red-50 border-red-200',       icon: '🎥' },
  Gudang:     { color: 'text-emerald-600',bg: 'bg-emerald-50 border-emerald-200',icon: '📦' },
  Admin:      { color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200',     icon: '🗄️' },
  Service:    { color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200', icon: '🔧' },
  'Semua Divisi': { color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200', icon: '🌐' },
};

const DEFAULT_PHOTOS = [
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=300&q=80',
];

export default function LogTaskModule({
  currentUser,
  dailyReports,
  onAddReport,
  onDeleteReport,
  onAddFinding,
  onLogActivity,
  initialTasks,
  onUpdateTasks,
  logbookEntries = [],
  onAddLogbookEntry,
  workOrders = [],
  initialSubTab = 'kanban'
}: LogTaskModuleProps) {
  const isManagement = Boolean(
    currentUser && (
      currentUser.role === 'Admin' ||
      currentUser.role === 'Supervisor' ||
      currentUser.role === 'Manager' ||
      currentUser.role === 'Owner' ||
      currentUser.role === 'Direktur' ||
      currentUser.division === 'Admin' ||
      currentUser.id === 'director-wahyu' ||
      String(currentUser.name || '').toLowerCase().includes('wahyu')
    )
  );

  // Active sub-tab
  const [subTab, setSubTab] = useState<'kanban' | 'qc_checklist' | 'logbook' | 'rekap'>(initialSubTab);

  // Dynamic Master Staff List with Cloud Subscription
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

  // Tasks state (synced with Firebase if possible, fallback to local)
  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    const saved = localStorage.getItem('riz_daily_tasks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return (initialTasks && initialTasks.length > 0) ? initialTasks : [];
  });
  const [cloudSynced, setCloudSynced] = useState<boolean>(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivision, setFilterDivision] = useState<string>(isManagement ? 'All' : currentUser.division);
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [taskSortBy, setTaskSortBy] = useState<'flow' | 'division' | 'priority' | 'date'>('flow');

  // New Task Modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDivision, setTaskDivision] = useState<Division>(currentUser.division || 'Audio');
  const [taskPriority, setTaskPriority] = useState<'Tinggi' | 'Sedang' | 'Rendah'>('Sedang');
  const [taskAssignee, setTaskAssignee] = useState(currentUser.name);
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);

  // Logbook form state
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logStaffName, setLogStaffName] = useState(currentUser.name);
  const [logDivision, setLogDivision] = useState<Division>(currentUser.division || 'Audio');
  const [logActivity, setLogActivity] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [logStatus, setLogStatus] = useState<'Submitted' | 'Draft'>('Submitted');
  const [logPhotoUrl, setLogPhotoUrl] = useState('');
  const [logPhotoUrls, setLogPhotoUrls] = useState<string[]>([]);
  const [uploadOption, setUploadOption] = useState<'preset' | 'file' | 'none'>('preset');
  const [hasFaultyUnit, setHasFaultyUnit] = useState(false);
  const [faultyUnitName, setFaultyUnitName] = useState('');
  const [faultyUnitIssue, setFaultyUnitIssue] = useState('');
  const [faultyUnitPriority, setFaultyUnitPriority] = useState<'Tinggi' | 'Sedang' | 'Rendah'>('Sedang');

  // QC / Checklist state (merged from QCOnhouse)
  const [qcDate, setQcDate] = useState(new Date().toISOString().split('T')[0]);
  const [qcDivision, setQcDivision] = useState<Division>(() => {
    if (currentUser.division && ['Audio', 'Lighting', 'Videotron', 'Multimedia', 'Service', 'Gudang'].includes(currentUser.division)) {
      return currentUser.division;
    }
    return 'Audio';
  });
  const [qcStaffName, setQcStaffName] = useState(currentUser.name);
  const [qcEquipmentArea, setQcEquipmentArea] = useState(`Set ${currentUser.division || 'Audio'} RIZ-PRODUCTION`);
  const [qcActivityType, setQcActivityType] = useState('Cleaning / Check / Test');
  const [qcFollowUp, setQcFollowUp] = useState('');
  const [qcStatus, setQcStatus] = useState<'Open' | 'Close'>('Open');
  const [qcPhotoUrls, setQcPhotoUrls] = useState<string[]>([]);
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);
  const [selectedQCEntry, setSelectedQCEntry] = useState<LogbookEntry | null>(null);
  const [qcChecklistState, setQcChecklistState] = useState<Record<string, QcItemState>>({});

  const handleQcPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files) as File[];
      const readPromises = fileArray.map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readPromises).then(newImages => {
        setQcPhotoUrls(prev => [...prev, ...newImages]);
      });
    }
    e.target.value = '';
  };

  const handleRemoveQcPhoto = (idxToRemove: number) => {
    setQcPhotoUrls(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleClearQcPhotos = () => {
    setQcPhotoUrls([]);
  };

  // Reset/Initialize checklist items when qcDivision changes
  useEffect(() => {
    const rawItems = (QC_ITEMS_BY_DIVISION as any)[qcDivision] || [
      'Peralatan Utama & Konsol',
      'Kabel Signal & DMX/Audio/LAN',
      'Power Distribution & Grounding',
      'Rigging, Clamp & Safety Wire',
      'Kebersihan Lingkungan & Packing'
    ];
    const newChecklistState: typeof qcChecklistState = {};
    rawItems.forEach((item: string) => {
      newChecklistState[item] = { status: 'OK', notes: '' };
    });
    setQcChecklistState(newChecklistState);
    setQcEquipmentArea(`Set ${qcDivision} RIZ-PRODUCTION`);
  }, [qcDivision]);

  const handleQcStatusChange = (item: string, status: 'OK' | 'NG') => {
    setQcChecklistState(prev => ({
      ...prev,
      [item]: {
        ...prev[item],
        status
      }
    }));
  };

  const handleQcNotesChange = (item: string, notes: string) => {
    setQcChecklistState(prev => ({
      ...prev,
      [item]: {
        ...prev[item],
        notes
      }
    }));
  };

  const handleQcSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hasNG = (Object.values(qcChecklistState) as { status: 'OK' | 'NG'; notes: string }[]).some(item => item.status === 'NG');
    const overallResult = hasNG ? 'NG' : 'OK';

    const verificationStr = (currentUser.role === 'Supervisor' || currentUser.role === 'Admin' || currentUser.role === 'Manager')
      ? `${currentUser.name} (Verified ✓)`
      : 'Pending Verifikasi';

    if (onAddLogbookEntry) {
      onAddLogbookEntry({
        date: qcDate,
        division: qcDivision as any,
        staffName: qcStaffName,
        activity: qcActivityType,
        result: overallResult,
        followUp: qcFollowUp || (hasNG ? 'Terdapat item NG yang perlu tindakan teknis lanjutan.' : 'Semua item dalam kondisi OK dan aman siap produksi.'),
        status: qcStatus,
        verification: verificationStr,
        checklists: qcChecklistState,
        photoUrl: qcPhotoUrls[0] || undefined,
        photos: qcPhotoUrls.length > 0 ? qcPhotoUrls : undefined
      });
    }

    // Auto-add to daily reports for tracking
    onAddReport({
      date: qcDate,
      staffName: qcStaffName,
      division: qcDivision,
      activity: `[QC Checklist] ${qcActivityType} - ${qcEquipmentArea}`,
      notes: `Hasil Inspeksi: ${overallResult}. Catatan: ${qcFollowUp || 'Sesuai checklist SOP'}.`,
      photoUrl: qcPhotoUrls[0] || undefined,
      photos: qcPhotoUrls.length > 0 ? qcPhotoUrls : undefined,
      status: 'Submitted'
    });

    onLogActivity(currentUser.name, currentUser.role, `Melakukan Checklist QC Divisi ${qcDivision} dengan hasil ${overallResult}`);

    // Auto-create Finding for any NG item
    let ngCount = 0;
    if (onAddFinding) {
      (Object.entries(qcChecklistState) as [string, { status: 'OK' | 'NG'; notes: string }][]).forEach(([item, val]) => {
        if (val.status === 'NG') {
          onAddFinding({
            equipment: `${qcDivision} - ${item}`,
            issue: val.notes || 'Kerusakan terdeteksi saat inspeksi QC harian',
            priority: 'Sedang',
            pic: qcStaffName,
            targetDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'Open'
          });
          ngCount++;
        }
      });
    }

    if (ngCount > 0) {
      alert(`Checklist QC berhasil disimpan! ${ngCount} item berstatus NG otomatis didaftarkan ke Temuan QC & Kerusakan.`);
    } else {
      alert('Checklist QC berhasil disimpan! Semua item berstatus OK.');
    }
    setQcPhotoUrls([]);
  };

  // 1. Firebase Real-time Listener for Tasks
  useEffect(() => {
    try {
      const q = query(collection(db, 'daily_tasks'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const cloudList: DailyTask[] = snapshot.docs.map(d => ({
            id: d.id,
            ...(d.data() as Omit<DailyTask, 'id'>)
          }));
          setTasks(cloudList);
          localStorage.setItem('riz_daily_tasks', JSON.stringify(cloudList));
          if (onUpdateTasks) onUpdateTasks(cloudList);
          setCloudSynced(true);
        }
      }, (err) => {
        console.warn('Firebase sync notice (running in local storage mode):', err.message);
        setCloudSynced(false);
      });
      return () => unsub();
    } catch (e) {
      setCloudSynced(false);
    }
  }, []);

  // Save to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem('riz_daily_tasks', JSON.stringify(tasks));
    if (onUpdateTasks) onUpdateTasks(tasks);
  }, [tasks]);

  // Task Operations
  const handleOpenNewTask = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDesc('');
    setTaskDivision(currentUser.division || 'Audio');
    setTaskPriority('Sedang');
    setTaskAssignee(currentUser.name);
    setTaskDueDate(new Date().toISOString().split('T')[0]);
    setShowTaskModal(true);
  };

  const handleOpenEditTask = (t: DailyTask) => {
    setEditingTask(t);
    setTaskTitle(t.title);
    setTaskDesc(t.description);
    setTaskDivision(t.division);
    setTaskPriority(t.priority);
    setTaskAssignee(t.assignedName || currentUser.name);
    setTaskDueDate(t.dueDate || new Date().toISOString().split('T')[0]);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingTask) {
      const updated: DailyTask = {
        ...editingTask,
        title: taskTitle,
        description: taskDesc,
        division: taskDivision,
        priority: taskPriority,
        assignedName: taskAssignee,
        dueDate: taskDueDate,
      };
      setTasks(prev => prev.map(t => t.id === editingTask.id ? updated : t));
      saveCloudDoc('daily_tasks', editingTask.id, updated, currentUser.name);
      onLogActivity(currentUser.name, currentUser.role, `Memperbarui daily task "${taskTitle}"`);
    } else {
      const newTask: DailyTask = {
        id: 'task-' + Date.now(),
        title: taskTitle,
        description: taskDesc,
        division: taskDivision,
        priority: taskPriority,
        status: 'Pending',
        assignedName: taskAssignee,
        dueDate: taskDueDate,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.name
      };
      setTasks(prev => [newTask, ...prev]);
      saveCloudDoc('daily_tasks', newTask.id, newTask, currentUser.name);
      onLogActivity(currentUser.name, currentUser.role, `Menambahkan daily task baru "${taskTitle}" [${taskDivision}]`);
    }

    setShowTaskModal(false);
  };

  const handleUpdateStatus = async (taskId: string, newStatus: 'Pending' | 'In Progress' | 'Done') => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updated = { ...t, status: newStatus };
        saveCloudDoc('daily_tasks', taskId, updated, currentUser.name);
        return updated;
      }
      return t;
    }));
    const target = tasks.find(t => t.id === taskId);
    if (target) {
      onLogActivity(currentUser.name, currentUser.role, `Ubah status task "${target.title}" jadi ${newStatus}`);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Hapus task ini?')) return;
    setTasks(prev => prev.filter(t => t.id !== taskId));
    deleteCloudDoc('daily_tasks', taskId);
    onLogActivity(currentUser.name, currentUser.role, `Menghapus task id ${taskId}`);
  };

  // Submit Logbook
  const handleSubmitLogbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logActivity.trim()) return;

    const finalNotes = hasFaultyUnit 
      ? `${logNotes}\n[Temuan Unit Bermasalah: ${faultyUnitName} - ${faultyUnitIssue} (Prioritas: ${faultyUnitPriority})]`
      : logNotes;

    onAddReport({
      date: logDate,
      staffName: logStaffName,
      division: logDivision,
      activity: logActivity,
      notes: finalNotes,
      photoUrl: uploadOption === 'none' ? undefined : (logPhotoUrls[0] || logPhotoUrl || undefined),
      photos: uploadOption === 'none' ? undefined : (logPhotoUrls.length > 0 ? logPhotoUrls : (logPhotoUrl ? [logPhotoUrl] : undefined)),
      status: logStatus,
    });

    if (hasFaultyUnit && onAddFinding && faultyUnitName.trim() && faultyUnitIssue.trim()) {
      onAddFinding({
        equipment: `${logDivision} - ${faultyUnitName}`,
        issue: faultyUnitIssue,
        priority: faultyUnitPriority,
        pic: logStaffName,
        targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Open'
      });
      alert(`Berhasil menyimpan logbook! Unit bermasalah "${faultyUnitName}" otomatis didaftarkan ke Temuan QC & Kerusakan.`);
    }

    onLogActivity(currentUser.name, currentUser.role, `Menulis entri logbook untuk tanggal ${logDate}`);

    // Reset
    setLogActivity('');
    setLogNotes('');
    setLogPhotoUrl('');
    setLogPhotoUrls([]);
    setHasFaultyUnit(false);
    setFaultyUnitName('');
    setFaultyUnitIssue('');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID,Tanggal,Staff,Divisi,Aktivitas,Catatan,Status'];
    const rows = dailyReports.map(r => 
      `"${r.id}","${r.date}","${r.staffName}","${r.division}","${r.activity.replace(/"/g, '""')}","${(r.notes || '').replace(/"/g, '""')}","${r.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan_daily_task_riz_pro_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Tasks - Staff only sees their own division(s); Management can filter or see All
  const userDivs = getStaffDivisions(currentUser);
  const isDualStaffName = (name?: string) => {
    const lower = (name || '').toLowerCase();
    return lower.includes('mulyana') || lower.includes('kharo') || lower.includes('karo');
  };

  const filteredTasks = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (t.assignedName && t.assignedName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchDiv = isManagement
      ? (filterDivision === 'All' || t.division === filterDivision || (isDualStaffName(t.assignedName) && (filterDivision === 'Videotron' || filterDivision === 'Service')))
      : (userDivs.includes(t.division) || isDualStaffName(t.assignedName));
    const matchPri = filterPriority === 'All' || t.priority === filterPriority;
    return matchSearch && matchDiv && matchPri;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (taskSortBy === 'flow') {
      // Urutan struktur alur kerja operasional: Admin -> Audio -> Lighting -> Videotron -> Multimedia -> Service -> Gudang
      const divWorkflowOrder: Record<string, number> = {
        'Admin': 1,
        'Audio': 2,
        'Lighting': 3,
        'Videotron': 4,
        'Multimedia': 5,
        'Service': 6,
        'Gudang': 7
      };
      const prioOrder: Record<string, number> = { 'Tinggi': 1, 'Sedang': 2, 'Rendah': 3 };
      const diffDiv = (divWorkflowOrder[a.division] || 99) - (divWorkflowOrder[b.division] || 99);
      if (diffDiv !== 0) return diffDiv;
      const diffPrio = (prioOrder[a.priority] || 99) - (prioOrder[b.priority] || 99);
      if (diffPrio !== 0) return diffPrio;
      return b.id.localeCompare(a.id, undefined, { numeric: true });
    } else if (taskSortBy === 'division') {
      return a.division.localeCompare(b.division);
    } else if (taskSortBy === 'priority') {
      const prioOrder: Record<string, number> = { 'Tinggi': 1, 'Sedang': 2, 'Rendah': 3 };
      return (prioOrder[a.priority] || 99) - (prioOrder[b.priority] || 99);
    } else {
      return b.id.localeCompare(a.id, undefined, { numeric: true });
    }
  });

  const pendingTasks = sortedTasks.filter(t => t.status === 'Pending');
  const progressTasks = sortedTasks.filter(t => t.status === 'In Progress');
  const doneTasks = sortedTasks.filter(t => t.status === 'Done');

  // Filtered Reports for Logbook View - Staff sees reports from all assigned divisions
  const filteredReports = dailyReports.filter(r => {
    const matchSearch = r.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDiv = isManagement
      ? (filterDivision === 'All' || r.division === filterDivision || (isDualStaffName(r.staffName) && (filterDivision === 'Videotron' || filterDivision === 'Service')))
      : (userDivs.includes(r.division) || isDualStaffName(r.staffName));
    return matchSearch && matchDiv;
  }).sort((a, b) => b.id.localeCompare(a.id, undefined, { numeric: true }));

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl text-white shadow-md border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h1 className="text-2xl font-black tracking-tight">LOG TASK & DAILY TASK</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Multi-Divisi
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Pusat kendali tugas harian, logbook aktivitas operasional gudang, tracking progres teknisi, dan pelaporan real-time divisi Audio, Lighting, Videotron, Multimedia, Gudang, Admin, & Service.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Cloud Sync Status */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${cloudSynced ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className={cloudSynced ? 'text-emerald-300' : 'text-amber-300'}>
              {cloudSynced ? 'Firebase Cloud' : 'Penyimpanan Lokal'}
            </span>
          </div>

          <button
            onClick={handleOpenNewTask}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Task Baru</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
          <button
            onClick={() => setSubTab('kanban')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              subTab === 'kanban' ? 'bg-white text-blue-600 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Kanban Daily Task ({filteredTasks.length})</span>
          </button>
          <button
            onClick={() => setSubTab('qc_checklist')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              subTab === 'qc_checklist' ? 'bg-white text-emerald-700 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>QC & Checklist Peralatan</span>
          </button>
          <button
            onClick={() => setSubTab('logbook')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              subTab === 'logbook' ? 'bg-white text-blue-600 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Log-Book Harian ({filteredReports.length})</span>
          </button>
          <button
            onClick={() => setSubTab('rekap')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              subTab === 'rekap' ? 'bg-white text-blue-600 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Rekap & Ekspor</span>
          </button>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari task / staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none w-44 md:w-56"
            />
          </div>

          <select
            value={filterDivision}
            onChange={(e) => setFilterDivision(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer font-medium"
          >
            <option value="All">🌐 Semua Divisi</option>
            <option value="Audio">🔊 Audio (Sound)</option>
            <option value="Lighting">💡 Lighting</option>
            <option value="Videotron">📺 Videotron</option>
            <option value="Multimedia">🎥 Multimedia</option>
            <option value="Gudang">📦 Gudang</option>
            <option value="Admin">🗄️ Admin</option>
            <option value="Service">🔧 Service</option>
          </select>

          {subTab === 'kanban' && (
            <>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="All">Semua Prioritas</option>
                <option value="Tinggi">🔴 Tinggi</option>
                <option value="Sedang">🟡 Sedang</option>
                <option value="Rendah">🟢 Rendah</option>
              </select>

              <select
                value={taskSortBy}
                onChange={(e) => setTaskSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium text-slate-700"
                title="Urutkan Berdasarkan Struktur Kerja"
              >
                <option value="flow">📊 Urut: Alur Struktur Kerja</option>
                <option value="division">🏢 Urut: Divisi</option>
                <option value="priority">🔥 Urut: Prioritas</option>
                <option value="date">📅 Urut: Tanggal Jatuh Tempo</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. SUB-TAB: KANBAN DAILY TASK                             */}
      {/* ────────────────────────────────────────────────────────── */}
      {subTab === 'kanban' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Total Task</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{filteredTasks.length}</div>
            </div>
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 shadow-sm">
              <div className="text-xs text-amber-700 font-semibold">Menunggu (Pending)</div>
              <div className="text-2xl font-black text-amber-700 mt-1">{pendingTasks.length}</div>
            </div>
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/80 shadow-sm">
              <div className="text-xs text-blue-700 font-semibold">Dikerjakan (In Progress)</div>
              <div className="text-2xl font-black text-blue-700 mt-1">{progressTasks.length}</div>
            </div>
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 shadow-sm">
              <div className="text-xs text-emerald-700 font-semibold">Selesai (Done)</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">{doneTasks.length}</div>
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Pending */}
            <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200/80 space-y-3 min-h-[450px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="font-bold text-xs uppercase tracking-wide text-slate-800">Menunggu (Pending)</span>
                </div>
                <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-600">
                  {pendingTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {pendingTasks.map(task => renderTaskCard(task))}
                {pendingTasks.length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-xs italic">
                    Tidak ada task pending.
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200/80 space-y-3 min-h-[450px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                  <span className="font-bold text-xs uppercase tracking-wide text-slate-800">Sedang Dikerjakan</span>
                </div>
                <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-600">
                  {progressTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {progressTasks.map(task => renderTaskCard(task))}
                {progressTasks.length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-xs italic">
                    Belum ada task yang dikerjakan saat ini.
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Done */}
            <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200/80 space-y-3 min-h-[450px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-xs uppercase tracking-wide text-slate-800">Selesai (Done)</span>
                </div>
                <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-600">
                  {doneTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {doneTasks.map(task => renderTaskCard(task))}
                {doneTasks.length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-xs italic">
                    Belum ada task selesai hari ini.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. SUB-TAB: QC & CHECKLIST PERALATAN (MERGED DENGAN DAILY)  */}
      {/* ────────────────────────────────────────────────────────── */}
      {subTab === 'qc_checklist' && (
        <div className="space-y-6">
          {/* Top Quick Stats for QC */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Item Diperiksa</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {Object.keys(qcChecklistState).length}
                <span className="text-xs text-slate-500 font-normal ml-1">Poin Checklist</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-[10px] font-mono uppercase text-emerald-600 font-bold">Kondisi OK</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {(Object.values(qcChecklistState) as QcItemState[]).filter(v => v.status === 'OK').length}
                <span className="text-xs text-slate-500 font-normal ml-1">Siap Show</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-[10px] font-mono uppercase text-rose-600 font-bold">Memerlukan Tindakan (NG)</div>
              <div className="text-2xl font-black text-rose-600 mt-1">
                {(Object.values(qcChecklistState) as QcItemState[]).filter(v => v.status === 'NG').length}
                <span className="text-xs text-slate-500 font-normal ml-1">Unit Rusak</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-[10px] font-mono uppercase text-indigo-600 font-bold">Riwayat Inspeksi</div>
              <div className="text-2xl font-black text-indigo-600 mt-1">
                {logbookEntries.filter(e => isManagement || e.division === currentUser.division).length}
                <span className="text-xs text-slate-500 font-normal ml-1">Entri Tercatat</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left / Main Column: QC Checklist Form (2 Columns span) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                      Form Checklist QC Peralatan Harian
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Pemeriksaan fungsi, fisik, dan kebersihan unit sebelum/sesudah event & operasional warehouse.
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-200">
                  {qcDivision}
                </span>
              </div>

              <form onSubmit={handleQcSubmit} className="space-y-6">
                {/* Header Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tanggal Pemeriksaan</label>
                    <input
                      type="date"
                      value={qcDate}
                      onChange={(e) => setQcDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Divisi</label>
                    {isManagement ? (
                      <select
                        value={qcDivision}
                        onChange={(e) => setQcDivision(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                      >
                        <option value="Audio">🔊 Audio (Sound)</option>
                        <option value="Lighting">💡 Lighting</option>
                        <option value="Videotron">📺 Videotron</option>
                        <option value="Multimedia">🎥 Multimedia</option>
                        <option value="Gudang">📦 Gudang</option>
                        <option value="Service">🔧 Service</option>
                      </select>
                    ) : userDivs.length > 1 ? (
                      <select
                        value={qcDivision}
                        onChange={(e) => setQcDivision(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-50 border border-indigo-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                      >
                        {userDivs.map(d => (
                          <option key={d} value={d}>
                            {DIVISION_CONFIG[d]?.icon} {d} (Multi-Posisi)
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span>{DIVISION_CONFIG[currentUser.division]?.icon}</span>
                        <span>{currentUser.division} (Terkunci)</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nama Petugas / Teknisi</label>
                    {isManagement ? (
                      <select
                        value={qcStaffName}
                        onChange={(e) => setQcStaffName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                      >
                        {staffList.map(s => (
                          <option key={s.id} value={s.name}>{s.name} {s.nickname && s.nickname.toLowerCase() !== s.name.toLowerCase() ? `(${s.nickname})` : ''} - {s.division}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>{currentUser.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Set / Area Peralatan</label>
                    <input
                      type="text"
                      value={qcEquipmentArea}
                      onChange={(e) => setQcEquipmentArea(e.target.value)}
                      placeholder="Contoh: Set FOH Main Stage, Rack Amp 01, dll"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Jenis Aktivitas</label>
                  <select
                    value={qcActivityType}
                    onChange={(e) => setQcActivityType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Cleaning / Check / Test">Cleaning / Check / Test</option>
                    <option value="Pre-Event Inspection">Pre-Event Inspection (Sebelum Berangkat Event)</option>
                    <option value="Post-Event Return QC">Post-Event Return QC (Bongkaran Event)</option>
                    <option value="Preventive Maintenance (PM)">Preventive Maintenance (PM Berkala)</option>
                  </select>
                </div>

                {/* Checklist Items Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                      Daftar Poin Pengecekan ({qcDivision})
                    </span>
                    <span className="text-[10px] text-slate-400 italic">
                      Klik OK atau NG untuk setiap item
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                    {(Object.entries(qcChecklistState) as [string, QcItemState][]).map(([item, val]) => {
                      const isNG = val.status === 'NG';
                      return (
                        <div
                          key={item}
                          className={`p-3 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isNG ? 'bg-rose-50/60 border-l-4 border-l-rose-500' : 'hover:bg-slate-50/60'
                          }`}
                        >
                          <div className="min-w-0 sm:w-1/3">
                            <div className="font-bold text-xs text-slate-900">{item}</div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleQcStatusChange(item, 'OK')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                                val.status === 'OK'
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>OK</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleQcStatusChange(item, 'NG')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                                val.status === 'NG'
                                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>NG (Rusak)</span>
                            </button>
                          </div>

                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={val.notes}
                              onChange={(e) => handleQcNotesChange(item, e.target.value)}
                              placeholder={isNG ? '⚠️ Wajib: Detail kerusakan/kendala...' : 'Catatan kondisi opsional...'}
                              className={`w-full px-3 py-1.5 rounded-xl text-xs border focus:ring-2 focus:outline-none ${
                                isNG
                                  ? 'bg-white border-rose-300 text-rose-900 focus:ring-rose-500 placeholder-rose-400 font-medium'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-indigo-500'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Lampiran Foto Hasil QC / Bukti Pemeriksaan (Bisa Beberapa Foto) */}
                <div className="p-3.5 bg-indigo-50/20 border border-indigo-100 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Lampiran Foto Bukti QC ({qcPhotoUrls.length} Foto)</span>
                    </label>
                    {qcPhotoUrls.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearQcPhotos}
                        className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                      >
                        Hapus Semua ({qcPhotoUrls.length})
                      </button>
                    )}
                  </div>

                  {qcPhotoUrls.length === 0 ? (
                    <div className="border border-dashed border-indigo-200 hover:border-indigo-400 bg-white rounded-xl p-4 text-center transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleQcPhotoUpload}
                        className="hidden"
                        id="tab-qc-photo-upload"
                      />
                      <label htmlFor="tab-qc-photo-upload" className="cursor-pointer flex flex-col items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600">
                        <Upload className="w-4 h-4" />
                        <span>Upload Beberapa Foto dari Perangkat / Kamera</span>
                        <span className="text-[10px] text-slate-400 font-normal">Pilih 1 atau beberapa foto sekaligus (JPG, PNG, WEBP)</span>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {qcPhotoUrls.map((qUrl, qIdx) => (
                          <div key={qIdx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
                            <img src={qUrl} alt={`Foto QC ${qIdx + 1}`} className="w-full h-20 object-cover" />
                            <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/65 text-white font-mono text-[8px] font-bold">
                              #{qIdx + 1}
                            </span>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setPreviewModalImg(qUrl)}
                                className="p-1 bg-white/95 text-slate-800 rounded shadow-xs cursor-pointer hover:bg-white"
                                title="Lihat Penuh"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveQcPhoto(qIdx)}
                                className="p-1 bg-rose-600 text-white rounded shadow-xs cursor-pointer hover:bg-rose-700"
                                title="Hapus"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-xl flex items-center justify-center bg-white cursor-pointer min-h-[80px] transition-colors">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleQcPhotoUpload}
                            className="hidden"
                            id="tab-qc-photo-upload-more"
                          />
                          <label htmlFor="tab-qc-photo-upload-more" className="cursor-pointer flex flex-col items-center gap-0.5 text-indigo-600 text-[10px] font-bold p-2">
                            <Plus className="w-4 h-4" />
                            <span>+ Foto</span>
                          </label>
                        </div>
                      </div>
                      <p className="text-[10px] text-emerald-600 font-bold">✓ {qcPhotoUrls.length} foto siap dilampirkan</p>
                    </div>
                  )}
                </div>

                {/* Follow up & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Catatan Tindak Lanjut & Rekomendasi</label>
                    <textarea
                      value={qcFollowUp}
                      onChange={(e) => setQcFollowUp(e.target.value)}
                      placeholder="Tindakan yang perlu diambil oleh tim service / supervisor..."
                      rows={2}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Status Inspeksi</label>
                    <select
                      value={qcStatus}
                      onChange={(e) => setQcStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="Open">Open (Menunggu Tindak Lanjut)</option>
                      <option value="Close">Close (Semua Selesai / Aman)</option>
                    </select>

                    <button
                      type="submit"
                      className="w-full mt-4 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Simpan & Catat QC</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Column: SOP Guidelines & Recent QC Activity */}
            <div className="space-y-6">
              {/* Guidelines Card */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-2xl text-white border border-indigo-900 shadow-md space-y-4">
                <div className="flex items-center gap-2 text-amber-400">
                  <Shield className="w-5 h-5" />
                  <h3 className="text-xs font-black uppercase tracking-wider">SOP & Integrasi QC Otomatis</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">1.</span>
                    <span>Setiap barang keluar atau masuk warehouse <strong>wajib melalui checklist QC</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">2.</span>
                    <span>Jika memilih <strong>NG</strong>, sistem otomatis meneruskan ke <strong>Temuan QC & Work Order</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">3.</span>
                    <span>Log checklist otomatis tercatat pada <strong>Daily Task & Logbook</strong> personel yang bersangkutan.</span>
                  </li>
                </ul>
              </div>

              {/* Recent QC Inspection Activity Feed */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Riwayat Inspeksi QC Terkini</span>
                  </h3>
                </div>

                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {logbookEntries
                    .filter(e => isManagement || e.division === currentUser.division)
                    .slice(0, 8)
                    .map((entry) => (
                      <div key={entry.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{entry.staffName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            entry.result === 'OK' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {entry.result}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 line-clamp-1">
                          {entry.activity} • {entry.division}
                        </div>
                        {((entry.photos && entry.photos.length > 0) || entry.photoUrl) && (
                          <div className={`grid gap-1 mt-1.5 ${
                            (entry.photos && entry.photos.length > 1) ? 'grid-cols-3' : 'grid-cols-1'
                          }`}>
                            {(entry.photos && entry.photos.length > 0 ? entry.photos : [entry.photoUrl!]).map((imgSrc, imgIdx) => (
                              <div
                                key={imgIdx}
                                className={`relative group rounded-lg overflow-hidden border border-slate-200 cursor-pointer ${
                                  (entry.photos && entry.photos.length > 1) ? 'h-16' : 'h-28'
                                }`}
                                onClick={() => setPreviewModalImg(imgSrc)}
                              >
                                <img src={imgSrc} alt={`Foto QC ${imgIdx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                                  <Eye className="w-3 h-3" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-200/60">
                          <span>{entry.date}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedQCEntry(entry)}
                            className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer"
                          >
                            📄 Lembar QC Lengkap
                          </button>
                        </div>
                      </div>
                    ))}

                  {logbookEntries.filter(e => isManagement || e.division === currentUser.division).length === 0 && (
                    <div className="col-span-full bg-slate-50/50 py-16 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-700 mb-1">Tidak Ada Temuan QC</h3>
                      <p className="text-slate-500 text-xs max-w-sm">
                        Belum ada riwayat inspeksi QC untuk divisi ini, atau peralatan dalam kondisi sangat baik.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 3. SUB-TAB: LOG-BOOK HARIAN (AKTIVITAS & FOTO)              */}
      {/* ────────────────────────────────────────────────────────── */}
      {subTab === 'logbook' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form Column */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Plus className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Tulis Entri Log-Book Baru</h2>
            </div>

            <form onSubmit={handleSubmitLogbook} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tanggal</label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nama Staff</label>
                  {isManagement ? (
                    <select
                      value={logStaffName}
                      onChange={(e) => {
                        setLogStaffName(e.target.value);
                        const sel = staffList.find(s => s.name === e.target.value);
                        if (sel) setLogDivision(sel.division);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                    >
                      {staffList.map(s => (
                        <option key={s.id} value={s.name}>{s.name} {s.nickname && s.nickname.toLowerCase() !== s.name.toLowerCase() ? `(${s.nickname})` : ''} - {s.division}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{currentUser.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Divisi</label>
                  {isManagement ? (
                    <select
                      value={logDivision}
                      onChange={(e) => setLogDivision(e.target.value as Division)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Audio">Audio (Sound)</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Videotron">Videotron</option>
                      <option value="Multimedia">Multimedia</option>
                      <option value="Gudang">Gudang</option>
                      <option value="Admin">Admin</option>
                      <option value="Service">Service</option>
                    </select>
                  ) : userDivs.length > 1 ? (
                    <select
                      value={logDivision}
                      onChange={(e) => setLogDivision(e.target.value as Division)}
                      className="w-full px-3 py-2 bg-slate-50 border border-blue-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                    >
                      {userDivs.map(d => (
                        <option key={d} value={d}>
                          {DIVISION_CONFIG[d]?.icon} {d} (Multi-Posisi)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{DIVISION_CONFIG[currentUser.division]?.icon}</span>
                      <span>{currentUser.division}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Aktivitas / Kegiatan</label>
                <textarea
                  value={logActivity}
                  onChange={(e) => setLogActivity(e.target.value)}
                  placeholder="Contoh: Setup audio FOH panggung utama, cek kabel snake, loading videotron kabinet..."
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Keterangan / Temuan</label>
                <textarea
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="Catatan tambahan hasil kegiatan atau kendala..."
                  rows={2}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Temuan Alat Rusak Checkbox */}
              <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasFaultyUnit}
                    onChange={(e) => setHasFaultyUnit(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
                    Auto-Sync ke Temuan Kerusakan QC
                  </span>
                </label>

                {hasFaultyUnit && (
                  <div className="space-y-2 pt-2 border-t border-rose-200/60">
                    <input
                      type="text"
                      placeholder="Nama unit bermasalah..."
                      value={faultyUnitName}
                      onChange={(e) => setFaultyUnitName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-rose-200 rounded-lg text-xs"
                      required={hasFaultyUnit}
                    />
                    <textarea
                      placeholder="Deskripsi kerusakan..."
                      value={faultyUnitIssue}
                      onChange={(e) => setFaultyUnitIssue(e.target.value)}
                      rows={2}
                      className="w-full p-2 bg-white border border-rose-200 rounded-lg text-xs"
                      required={hasFaultyUnit}
                    />
                    <select
                      value={faultyUnitPriority}
                      onChange={(e) => setFaultyUnitPriority(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-white border border-rose-200 rounded-lg text-xs"
                    >
                      <option value="Rendah">Prioritas Rendah</option>
                      <option value="Sedang">Prioritas Sedang</option>
                      <option value="Tinggi">Prioritas Tinggi (Urgent)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Lampiran Foto */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Lampiran Foto</label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => { setUploadOption('file'); }}
                    className={`px-2.5 py-1 rounded text-xs border ${uploadOption === 'file' ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold' : 'bg-slate-50 text-slate-600'}`}
                  >
                    Upload File / Kamera
                  </button>
                  <button
                    type="button"
                    onClick={() => { setUploadOption('preset'); setLogPhotoUrl(DEFAULT_PHOTOS[0]); }}
                    className={`px-2.5 py-1 rounded text-xs border ${uploadOption === 'preset' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600'}`}
                  >
                    Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => { setUploadOption('none'); setLogPhotoUrl(''); }}
                    className={`px-2.5 py-1 rounded text-xs border ${uploadOption === 'none' ? 'bg-slate-200 text-slate-800' : 'bg-slate-50 text-slate-600'}`}
                  >
                    Tanpa Foto
                  </button>
                </div>

                {uploadOption === 'file' && (
                  <div className="space-y-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">Foto Terpilih ({logPhotoUrls.length})</span>
                      {logPhotoUrls.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setLogPhotoUrls([])}
                          className="text-[10px] text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                        >
                          Hapus Semua
                        </button>
                      )}
                    </div>

                    {logPhotoUrls.length === 0 ? (
                      <div className="border border-dashed border-blue-200 hover:border-blue-400 bg-white rounded-lg p-3 text-center transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              const fileArray = Array.from(files) as File[];
                              const readPromises = fileArray.map((file: File) => {
                                return new Promise<string>((resolve) => {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    resolve(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                });
                              });

                              Promise.all(readPromises).then(newImages => {
                                setLogPhotoUrls(prev => [...prev, ...newImages]);
                              });
                            }
                            e.target.value = '';
                          }}
                          className="hidden"
                          id="logbook-file-multi"
                        />
                        <label htmlFor="logbook-file-multi" className="cursor-pointer flex flex-col items-center gap-1 text-xs font-semibold text-blue-600">
                          <Upload className="w-4 h-4" />
                          <span>Pilih Beberapa Foto dari Perangkat / Kamera</span>
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-1.5">
                          {logPhotoUrls.map((imgSrc, idx) => (
                            <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white shadow-xs">
                              <img src={imgSrc} alt={`Foto ${idx + 1}`} className="w-full h-16 object-cover" />
                              <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/65 text-white font-mono text-[8px] font-bold">
                                #{idx + 1}
                              </span>
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setPreviewModalImg(imgSrc)}
                                  className="p-1 bg-white/95 text-slate-800 rounded text-[9px] cursor-pointer"
                                  title="Lihat Penuh"
                                >
                                  <Eye className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setLogPhotoUrls(prev => prev.filter((_, i) => i !== idx))}
                                  className="p-1 bg-rose-600 text-white rounded text-[9px] cursor-pointer"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <div className="border border-dashed border-blue-200 hover:border-blue-400 rounded-lg flex items-center justify-center bg-white cursor-pointer min-h-[64px] transition-colors">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                  const fileArray = Array.from(files) as File[];
                                  const readPromises = fileArray.map((file: File) => {
                                    return new Promise<string>((resolve) => {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        resolve(reader.result as string);
                                      };
                                      reader.readAsDataURL(file);
                                    });
                                  });

                                  Promise.all(readPromises).then(newImages => {
                                    setLogPhotoUrls(prev => [...prev, ...newImages]);
                                  });
                                }
                                e.target.value = '';
                              }}
                              className="hidden"
                              id="logbook-file-multi-add"
                            />
                            <label htmlFor="logbook-file-multi-add" className="cursor-pointer flex flex-col items-center gap-0.5 text-blue-600 text-[10px] font-bold p-1">
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Foto</span>
                            </label>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold block">✓ {logPhotoUrls.length} foto siap disimpan</span>
                      </div>
                    )}
                  </div>
                )}

                {uploadOption === 'preset' && (
                  <div className="grid grid-cols-4 gap-1.5">
                    {DEFAULT_PHOTOS.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        onClick={() => setLogPhotoUrl(src)}
                        className={`h-12 w-full object-cover rounded cursor-pointer border-2 ${logPhotoUrl === src ? 'border-blue-600' : 'border-transparent opacity-60'}`}
                        alt="preset"
                      />
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan ke Log-Book</span>
              </button>
            </form>
          </div>

          {/* Timeline Feed Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Kronologi Aktivitas ({filteredReports.length} Catatan)
              </h3>
            </div>

            <div className="space-y-4">
              {filteredReports.map((rep) => {
                const conf = DIVISION_CONFIG[rep.division] || { color: 'text-slate-600', bg: 'bg-slate-50', icon: '📝' };
                return (
                  <div key={rep.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition-all space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-blue-700">
                          {rep.staffName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-800">{rep.staffName}</div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                            <span>{rep.date}</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${conf.bg} ${conf.color}`}>
                              {conf.icon} {rep.division}
                            </span>
                          </div>
                        </div>
                      </div>

                      {(currentUser.role === 'Admin' || currentUser.name === rep.staffName) && (
                        <button
                          onClick={() => onDeleteReport(rep.id)}
                          className="text-slate-400 hover:text-red-500 p-1"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-sans">
                      {rep.activity}
                    </div>

                    {rep.notes && (
                      <div className="text-xs text-slate-500 italic bg-amber-50/40 p-2.5 rounded-lg border border-amber-200/40">
                        {rep.notes}
                      </div>
                    )}

                    {((rep.photos && rep.photos.length > 0) || rep.photoUrl) && (
                      <div className="pt-1 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                          <span>Dokumentasi Foto</span>
                          <span>{(rep.photos && rep.photos.length > 0) ? `${rep.photos.length} Foto` : '1 Foto'}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(rep.photos && rep.photos.length > 0 ? rep.photos : [rep.photoUrl!]).map((pImg, pI) => (
                            <img
                              key={pI}
                              src={pImg}
                              alt={`foto kegiatan ${pI + 1}`}
                              onClick={() => setPreviewModalImg(pImg)}
                              className="h-28 w-36 sm:w-44 object-cover rounded-xl border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity shadow-xs"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredReports.length === 0 && (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                  Tidak ada entri logbook untuk divisi / kata kunci ini.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 3. SUB-TAB: REKAP & EKSPOR                                 */}
      {/* ────────────────────────────────────────────────────────── */}
      {subTab === 'rekap' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Rekapitulasi Operasional Harian</h2>
              <p className="text-xs text-slate-500">Ekspor laporan ke format Microsoft Excel (CSV) atau cetak ke PDF</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Unduh CSV</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / PDF</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Petugas</th>
                  <th className="p-3">Divisi</th>
                  <th className="p-3">Aktivitas Utama</th>
                  <th className="p-3">Keterangan / Temuan</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-mono text-slate-500 whitespace-nowrap">{r.date}</td>
                    <td className="p-3 font-semibold text-slate-800">{r.staffName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700">
                        {r.division}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs text-slate-700">{r.activity}</td>
                    <td className="p-3 max-w-xs text-slate-500 italic">{r.notes || '-'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Preview Foto Ukuran Penuh */}
      {previewModalImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setPreviewModalImg(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-2 border border-slate-800" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full z-10 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewModalImg}
              alt="Foto QC / Logbook Ukuran Penuh"
              className="max-h-[80vh] w-auto mx-auto object-contain rounded-xl"
            />
            <div className="p-3 text-center text-xs text-slate-300 font-mono">
              Foto Bukti QC / Log-Book
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODAL: CREATE / EDIT TASK                                  */}
      {/* ────────────────────────────────────────────────────────── */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-800">
                {editingTask ? 'Edit Daily Task' : 'Tambah Daily Task Baru'}
              </h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 text-base font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4 text-xs">
              {/* Preset Template Selector */}
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1 flex items-center justify-between">
                  <span>✨ Pilih Template Tugas Cepat (SOP Divisi {taskDivision})</span>
                  <span className="text-[10px] text-blue-600 font-normal">Klik untuk mengisi otomatis</span>
                </label>
                <select
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    const templates = DIVISION_DAILY_TASK_REFERENCES[taskDivision] || [];
                    if (templates[idx]) {
                      setTaskTitle(templates[idx].title);
                      setTaskDesc(templates[idx].description);
                      setTaskPriority(templates[idx].priority);
                    }
                  }}
                  defaultValue=""
                  className="w-full px-3 py-2 bg-blue-50/60 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium text-blue-900 cursor-pointer"
                >
                  <option value="" disabled>-- Pilih Template Tugas Standar --</option>
                  {(DIVISION_DAILY_TASK_REFERENCES[taskDivision] || []).map((tmpl, idx) => (
                    <option key={idx} value={idx}>
                      [{tmpl.category}] {tmpl.title} ({tmpl.priority})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Judul Task *</label>
                <input
                  type="text"
                  placeholder="Contoh: Kalibrasi Processor LED Videotron"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Deskripsi Detail</label>
                <textarea
                  placeholder="Detail instruksi pengerjaan..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Divisi Pelaksana</label>
                  {isManagement ? (
                    <select
                      value={taskDivision}
                      onChange={(e) => setTaskDivision(e.target.value as Division)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Audio">🔊 Audio (Sound)</option>
                      <option value="Lighting">💡 Lighting</option>
                      <option value="Videotron">📺 Videotron</option>
                      <option value="Multimedia">🎥 Multimedia</option>
                      <option value="Gudang">📦 Gudang</option>
                      <option value="Admin">🗄️ Admin</option>
                      <option value="Service">🔧 Service</option>
                    </select>
                  ) : (
                    <div className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center gap-2">
                      <span>{DIVISION_CONFIG[currentUser.division]?.icon}</span>
                      <span>{currentUser.division} (Divisi Anda)</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Prioritas</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Tinggi">🔴 Tinggi (High)</option>
                    <option value="Sedang">🟡 Sedang (Medium)</option>
                    <option value="Rendah">🟢 Rendah (Low)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Ditugaskan Kepada (PIC)</label>
                  <select
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  >
                    {staffList.filter(s => isManagement || s.division === currentUser.division).map(s => (
                      <option key={s.id} value={s.name}>{s.name} {s.nickname && s.nickname.toLowerCase() !== s.name.toLowerCase() ? `(${s.nickname})` : ''} - {s.division}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Tenggat Waktu (Due Date)</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Simpan Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODAL: LEMBAR CHECKLIST QC LENGKAP (DETAIL LOG)           */}
      {/* ────────────────────────────────────────────────────────── */}
      {selectedQCEntry && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                    {selectedQCEntry.division} • Inspeksi QC #{selectedQCEntry.id}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-black ${
                    selectedQCEntry.result === 'OK' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    Hasil: {selectedQCEntry.result}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">{selectedQCEntry.activity}</h3>
              </div>
              <button
                onClick={() => setSelectedQCEntry(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-sans">Inspektor QC:</span>
                  <strong className="text-slate-800 text-xs mt-0.5 block">{selectedQCEntry.staffName}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-sans">Tanggal & Verifikasi:</span>
                  <strong className="text-slate-800 text-xs mt-0.5 block">{selectedQCEntry.date} ({selectedQCEntry.verification || 'Verified'})</strong>
                </div>
              </div>

              {/* Rincian Item Checklist */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Lembar Periksa Checklist Item:</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {selectedQCEntry.checklists && Object.keys(selectedQCEntry.checklists).length > 0 ? (
                    Object.entries(selectedQCEntry.checklists).map(([itemName, itemVal]: [string, any], idx) => (
                      <div key={idx} className="p-3 bg-slate-50/50 flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 block text-xs">{itemName}</span>
                          {itemVal?.notes && (
                            <span className="text-[11px] text-slate-500 italic block">Catatan: {itemVal.notes}</span>
                          )}
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                          itemVal?.status === 'OK' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {itemVal?.status || 'OK'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-400 italic">Checklist SOP terverifikasi standar.</div>
                  )}
                </div>
              </div>

              {/* Catatan & Follow Up */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-500 uppercase text-[10px] block">Tindak Lanjut / Follow Up:</span>
                <p className="text-slate-800 leading-relaxed font-sans">{selectedQCEntry.followUp || 'Tidak ada catatan khusus.'}</p>
              </div>

              {/* Lampiran Foto */}
              {((selectedQCEntry.photos && selectedQCEntry.photos.length > 0) || selectedQCEntry.photoUrl) && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Dokumentasi Foto Bukti:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(selectedQCEntry.photos && selectedQCEntry.photos.length > 0 ? selectedQCEntry.photos : [selectedQCEntry.photoUrl!]).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Foto Bukti ${i + 1}`}
                        onClick={() => setPreviewModalImg(img)}
                        className="h-24 w-full object-cover rounded-xl border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedQCEntry(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Tutup Lembar QC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Helper render card for Kanban
  function renderTaskCard(task: DailyTask) {
    const conf = DIVISION_CONFIG[task.division] || { color: 'text-slate-700', bg: 'bg-slate-50', icon: '📝' };
    const priorityColor = {
      Tinggi: 'bg-rose-100 text-rose-800 border-rose-200',
      Sedang: 'bg-amber-100 text-amber-800 border-amber-200',
      Rendah: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    }[task.priority];

    return (
      <div
        key={task.id}
        className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-400 transition-all space-y-3 relative group"
      >
        <div className="flex items-start justify-between gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${conf.bg} ${conf.color}`}>
            {conf.icon} {task.division}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${priorityColor}`}>
            {task.priority}
          </span>
        </div>

        <div>
          <h4 className="font-bold text-xs text-slate-900 leading-snug">{task.title}</h4>
          {task.description && (
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3 text-slate-400" />
            <strong className="text-slate-700 font-sans">{task.assignedName || 'Staff'}</strong>
          </span>
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{task.dueDate}</span>
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            {task.status === 'Pending' && (
              <button
                onClick={() => handleUpdateStatus(task.id, 'In Progress')}
                className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                title="Mulai Kerjakan"
              >
                <span>Mulai</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            {task.status === 'In Progress' && (
              <button
                onClick={() => handleUpdateStatus(task.id, 'Done')}
                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                title="Tandai Selesai"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Selesai</span>
              </button>
            )}

            {task.status === 'Done' && (
              <button
                onClick={() => handleUpdateStatus(task.id, 'Pending')}
                className="px-2 py-1 text-slate-400 hover:text-slate-700 rounded text-[10px]"
                title="Kembalikan ke Pending"
              >
                Re-open
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
            <button
              onClick={() => handleOpenEditTask(task)}
              className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-50"
              title="Edit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-50"
              title="Hapus"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}
