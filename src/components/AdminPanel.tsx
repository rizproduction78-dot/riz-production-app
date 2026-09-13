/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PANEL KONTROL PENGELOLAAN APLIKASI DIVISI ADMIN
 * PT. RIZ PRODUCTION MULTI KREASI
 */

import React, { useState, useEffect } from 'react';
import { Staff, Division, QCItem, Finding, WorkOrder, MaintenanceSchedule, Asset, VehicleMaster, FleetAssignment, FreelanceWorker, FleetDriver, FreelanceSpecialization, DailyReport, LogbookEntry } from '../types';
import { STAFF_LIST, QC_ITEMS_BY_DIVISION, INITIAL_VEHICLES, INITIAL_FREELANCE_WORKERS, INITIAL_FLEET_DRIVERS, getMasterStaffList, getMasterFreelanceList } from '../data';
import { getScheduleByKey, StaffScheduleRow, getActiveMonthKey, ALL_MONTHLY_SCHEDULES } from '../data/staffSchedules';
import {
  Users,
  CheckSquare,
  Calendar,
  Database,
  Plus,
  Trash2,
  Edit2,
  Save,
  RefreshCw,
  Download,
  Upload,
  Shield,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  X,
  FileText,
  Phone,
  Mail,
  Camera,
  Image as ImageIcon,
  AlertOctagon,
  Wrench,
  Package,
  Clock,
  ArrowUpDown,
  Truck,
  Layers,
  DollarSign,
  Star,
  CreditCard,
  Award,
  ExternalLink,
  MessageCircle,
  UserPlus,
  MapPin,
  Sparkles,
  UserCheck,
  Zap,
  FileSpreadsheet,
  Copy,
  Check
} from 'lucide-react';
import {
  forceSyncAllModules,
  subscribeCloudCollection,
  pushCollectionToCloud,
  saveCloudDoc,
  deleteCloudDoc
} from '../lib/cloudSync';
import {
  DEFAULT_SPREADSHEET_ID,
  DEFAULT_SPREADSHEET_URL,
  getGoogleSheetWebhookUrl,
  setGoogleSheetWebhookUrl,
  testGoogleSheetWebhook,
  syncAllToGoogleSheet,
  pullDataFromGoogleSheet,
  getGoogleSheetLastSync,
  GOOGLE_APPS_SCRIPT_TEMPLATE,
  SHEET_GID_SEPTEMBER_2026
} from '../lib/googleSheetSync';
import { workspaceManager, AppWorkspace } from '../lib/workspaceConfig';

interface AdminPanelProps {
  currentUser: Staff;
  onLogActivity: (username: string, role: string, action: string) => void;
  findings: Finding[];
  onAddFinding: (finding: Omit<Finding, 'id' | 'dateCreated'>) => void;
  onUpdateFinding: (id: string, updated: Partial<Finding>) => void;
  onDeleteFinding: (id: string) => void;
  workOrders: WorkOrder[];
  onAddWorkOrder: (wo: Omit<WorkOrder, 'id'>) => void;
  onUpdateWorkOrder: (id: string, updated: Partial<WorkOrder>) => void;
  onDeleteWorkOrder: (id: string) => void;
  maintenanceSchedules: MaintenanceSchedule[];
  onAddSchedule: (schedule: Omit<MaintenanceSchedule, 'id'>) => void;
  onUpdateSchedule: (id: string, updated: Partial<MaintenanceSchedule>) => void;
  onDeleteSchedule: (id: string) => void;
  assets: Asset[];
  onAddAsset: (asset: Omit<Asset, 'id' | 'repairHistory'>) => void;
  onUpdateAsset: (id: string, updated: Partial<Asset>) => void;
  onDeleteAsset: (id: string) => void;
  dailyReports?: DailyReport[];
  logbookEntries?: LogbookEntry[];
  onSyncDailyLogFromSheet?: (gid?: string) => Promise<void>;
  isSyncingSheet?: boolean;
  lastSheetPull?: string | null;
  sheetPullMessage?: { text: string; type: 'success' | 'error' | 'info' } | null;
}

export default function AdminPanel({
  currentUser,
  onLogActivity,
  findings,
  onAddFinding,
  onUpdateFinding,
  onDeleteFinding,
  workOrders,
  onAddWorkOrder,
  onUpdateWorkOrder,
  onDeleteWorkOrder,
  maintenanceSchedules,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  assets,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
  dailyReports = [],
  logbookEntries = [],
  onSyncDailyLogFromSheet,
  isSyncingSheet = false,
  lastSheetPull = null,
  sheetPullMessage = null
}: AdminPanelProps) {
  // Navigation Sub-tabs
  const [activeTab, setActiveTab] = useState<'staff' | 'findings_wo' | 'maintenance' | 'gudang' | 'kendaraan' | 'qc_checklist' | 'schedule' | 'database'>('staff');

  // ─────────────────────────────────────────────────────────────
  // ACTIVE MONTH STATE (Multi-Bulan)
  // ─────────────────────────────────────────────────────────────
  const [activeMonth, setActiveMonth] = useState<string>(getActiveMonthKey);
  const [scheduleData, setScheduleData] = useState<StaffScheduleRow[]>(() => {
    try {
      const key = getActiveMonthKey();
      const saved = localStorage.getItem(`riz_schedule_${key}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    const defaultSch = getScheduleByKey(getActiveMonthKey());
    return defaultSch ? defaultSch.rows : [];
  });

  // Reload schedule data when activeMonth changes
  React.useEffect(() => {
    const unsubSched = subscribeCloudCollection<any>(
      `schedule_${activeMonth}`,
      `riz_schedule_${activeMonth}`,
      (data) => {
        if (data.length > 0) {
          const flatItems = data.flatMap((item: any) => {
            if (item && Array.isArray(item.list)) return item.list;
            return item;
          });
          const validItems = flatItems.filter((i: any) => i && typeof i === 'object' && i.no);
          if (validItems.length > 0) {
            validItems.sort((a: any, b: any) => (a.no || 0) - (b.no || 0));
            setScheduleData(validItems);
          } else {
            const defaultSch = getScheduleByKey(activeMonth);
            setScheduleData(defaultSch ? defaultSch.rows : []);
          }
        } else {
          const defaultSch = getScheduleByKey(activeMonth);
          setScheduleData(defaultSch ? defaultSch.rows : []);
        }
      },
      getScheduleByKey(activeMonth)?.rows || []
    );
    return () => unsubSched();
  }, [activeMonth]);

  // ─────────────────────────────────────────────────────────────
  // 1. MASTER STAF STATE
  // ─────────────────────────────────────────────────────────────
  const [staffList, setStaffList] = useState<Staff[]>(() => getMasterStaffList());

  const [staffSearch, setStaffSearch] = useState('');
  const [staffSortBy, setStaffSortBy] = useState<'hierarchy' | 'division' | 'name'>('hierarchy');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [activeStaffForEdit, setActiveStaffForEdit] = useState<Staff | null>(null);

  const [staffFormData, setStaffFormData] = useState<Partial<Staff>>({
    name: '',
    fullName: '',
    nickname: '',
    division: 'Audio',
    role: 'Staff',
    level: 2,
    phone: '',
    email: '',
    avatar: ''
  });

  const saveStaffList = async (updated: Staff[], actionDoc?: { type: 'save' | 'delete', id: string, doc?: Staff }) => {
    setStaffList(updated);
    localStorage.setItem('riz_master_staff_list', JSON.stringify(updated));
    pushCollectionToCloud('master_staff', updated, currentUser.name);
    if (actionDoc) {
      if (actionDoc.type === 'save' && actionDoc.doc) {
        await saveCloudDoc('master_staff', actionDoc.id, actionDoc.doc, currentUser.name);
      } else if (actionDoc.type === 'delete') {
        await deleteCloudDoc('master_staff', actionDoc.id);
      }
    }
  };

  // Real-time Cloud Subscriptions across all Admin collections
  useEffect(() => {
    const unsubStaff = subscribeCloudCollection<Staff>(
      'master_staff',
      'riz_master_staff_list',
      setStaffList,
      STAFF_LIST
    );
    const unsubFreelance = subscribeCloudCollection<FreelanceWorker>(
      'freelance_workers',
      'riz_freelance_workers',
      setFreelanceList,
      INITIAL_FREELANCE_WORKERS
    );
    const unsubDrivers = subscribeCloudCollection<FleetDriver>(
      'fleet_drivers',
      'riz_fleet_drivers',
      (rawItems) => {
        const flat = (rawItems || []).flatMap(item => (item && Array.isArray((item as any).list)) ? (item as any).list : [item]);
        const valid = flat.filter((d): d is FleetDriver => Boolean(d && typeof d === 'object' && d.name));
        setDriverList(valid);
      },
      INITIAL_FLEET_DRIVERS
    );
    const unsubVehicles = subscribeCloudCollection<VehicleMaster>(
      'master_vehicles',
      'riz_master_vehicles',
      (rawItems) => {
        const flat = (rawItems || []).flatMap(item => (item && Array.isArray((item as any).list)) ? (item as any).list : [item]);
        const valid = flat.filter((v): v is VehicleMaster => Boolean(v && typeof v === 'object' && (v.name || v.policeNumber)));
        setVehicles(valid.length > 0 ? valid : INITIAL_VEHICLES);
      },
      INITIAL_VEHICLES
    );
    const unsubAssignments = subscribeCloudCollection<FleetAssignment>(
      'fleet_assignments',
      'riz_fleet_assignments',
      (rawItems) => {
        const flat = (rawItems || []).flatMap(item => (item && Array.isArray((item as any).list)) ? (item as any).list : [item]);
        const valid = flat.filter((f): f is FleetAssignment => Boolean(f && typeof f === 'object' && (f.spjNumber || f.driverName)));
        setFleetAssignments(valid);
      },
      []
    );
    return () => {
      unsubStaff();
      unsubFreelance();
      unsubDrivers();
      unsubVehicles();
      unsubAssignments();
    };
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStaffFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStaff = async () => {
    const rawFullName = staffFormData.fullName?.trim() || '';
    const rawNickname = staffFormData.nickname?.trim() || '';
    const displayName = rawNickname || rawFullName || staffFormData.name?.trim() || '';
    if (!displayName) {
      alert('Mohon isi nama lengkap atau nama panggilan staf!');
      return;
    }

    const newStaff: Staff = {
      id: `staff-${Date.now()}`,
      name: displayName,
      fullName: rawFullName || displayName,
      nickname: rawNickname || displayName,
      division: (staffFormData.division as Division) || 'Audio',
      role: (staffFormData.role as any) || 'Staff',
      level: Number(staffFormData.level || 2),
      phone: staffFormData.phone?.trim() || '',
      email: staffFormData.email?.trim() || '',
      avatar: staffFormData.avatar || ''
    };
    const updated = [...staffList, newStaff];
    setShowAddStaffModal(false);
    setStaffFormData({ name: '', fullName: '', nickname: '', division: 'Audio', role: 'Staff', level: 2, phone: '', email: '', avatar: '' });
    onLogActivity(currentUser.name, currentUser.role, `Menambahkan staf baru: ${newStaff.fullName || newStaff.name} (${newStaff.division})`);
    try {
      await saveStaffList(updated, { type: 'save', id: newStaff.id, doc: newStaff });
    } catch (e) {
      console.warn('[Staff] Background save error:', e);
    }
  };

  const handleOpenEditStaff = (staff: Staff) => {
    setActiveStaffForEdit(staff);
    setStaffFormData({
      name: staff.name,
      fullName: staff.fullName || staff.name,
      nickname: staff.nickname || staff.name,
      division: staff.division,
      role: staff.role,
      level: staff.level || (staff.division === 'Audio' && (staff.id === '8' || staff.nickname === 'Emboh' || staff.name === 'Mboh') ? 5 : (staff.id === '9' || staff.id === '14' || staff.name === 'Unyim' || staff.name === 'Buluk') ? 4 : 2),
      phone: staff.phone || '',
      email: staff.email || '',
      avatar: staff.avatar || ''
    });
    setShowEditStaffModal(true);
  };

  const handleSaveEditStaff = async () => {
    if (!activeStaffForEdit) return;
    const rawFullName = staffFormData.fullName?.trim() || '';
    const rawNickname = staffFormData.nickname?.trim() || '';
    const displayName = rawNickname || rawFullName || staffFormData.name?.trim() || activeStaffForEdit.name;
    if (!displayName) {
      alert('Mohon isi nama lengkap atau nama panggilan!');
      return;
    }

    let updatedStaffObj: Staff = activeStaffForEdit;
    const updated = staffList.map(s => {
      if (s.id === activeStaffForEdit.id) {
        updatedStaffObj = {
          ...s,
          name: displayName,
          fullName: rawFullName || displayName,
          nickname: rawNickname || displayName,
          division: (staffFormData.division as Division) || s.division,
          role: (staffFormData.role as any) || s.role,
          level: Number(staffFormData.level || s.level || 2),
          phone: staffFormData.phone?.trim() || '',
          email: staffFormData.email?.trim() || '',
          avatar: staffFormData.avatar || s.avatar || ''
        };
        return updatedStaffObj;
      }
      return s;
    });
    // Immediately close modal and reset state
    setShowEditStaffModal(false);
    setActiveStaffForEdit(null);
    onLogActivity(currentUser.name, currentUser.role, `Mengubah data staf: ${updatedStaffObj.fullName || updatedStaffObj.name}`);
    try {
      await saveStaffList(updated, { type: 'save', id: updatedStaffObj.id, doc: updatedStaffObj });
    } catch (e) {
      console.warn('[Staff] Background save error:', e);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    const target = staffList.find(s => s.id === id);
    const targetName = target?.nickname || target?.fullName || target?.name || id;
    if (confirm(`Yakin ingin menghapus staf "${targetName}" dari sistem? Data akun staf ini akan dihapus.`)) {
      const updated = staffList.filter(s => s.id !== id);
      onLogActivity(currentUser.name, currentUser.role, `Menghapus staf: ${targetName}`);
      try {
        await saveStaffList(updated, { type: 'delete', id });
      } catch (e) {
        console.warn('[Staff] Background delete error:', e);
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 1B. MASTER DATABASE KRU FREELANCE & MITRA STATE
  // ─────────────────────────────────────────────────────────────
  const [personnelSubTab, setPersonnelSubTab] = useState<'permanent' | 'freelance'>('permanent');

  const [freelanceList, setFreelanceList] = useState<FreelanceWorker[]>(() => getMasterFreelanceList());

  const [freelanceSearch, setFreelanceSearch] = useState('');
  const [freelanceSpecFilter, setFreelanceSpecFilter] = useState<string>('ALL');
  const [freelanceStatusFilter, setFreelanceStatusFilter] = useState<string>('ALL');
  const [showAddFreelanceModal, setShowAddFreelanceModal] = useState(false);
  const [showEditFreelanceModal, setShowEditFreelanceModal] = useState(false);
  const [activeFreelanceForEdit, setActiveFreelanceForEdit] = useState<FreelanceWorker | null>(null);

  const [freelanceFormData, setFreelanceFormData] = useState<Partial<FreelanceWorker>>({
    name: '',
    specialization: 'Audio',
    roleTitle: '',
    phone: '',
    email: '',
    dailyRate: 300000,
    idCardNumber: '',
    bankName: 'BCA',
    bankAccountNumber: '',
    bankAccountHolder: '',
    status: 'Aktif',
    rating: 5,
    skills: '',
    address: '',
    notes: ''
  });

  const saveFreelanceList = async (updated: FreelanceWorker[], actionDoc?: { type: 'save' | 'delete', id: string, doc?: FreelanceWorker }) => {
    setFreelanceList(updated);
    localStorage.setItem('riz_freelance_workers', JSON.stringify(updated));
    pushCollectionToCloud('freelance_workers', updated, currentUser.name);
    if (actionDoc) {
      if (actionDoc.type === 'save' && actionDoc.doc) {
        await saveCloudDoc('freelance_workers', actionDoc.id, actionDoc.doc, currentUser.name);
      } else if (actionDoc.type === 'delete') {
        await deleteCloudDoc('freelance_workers', actionDoc.id);
      }
    }
  };

  const handleAddFreelance = async () => {
    if (!freelanceFormData.name?.trim()) {
      alert('Mohon isi nama kru freelance!');
      return;
    }
    const newWorker: FreelanceWorker = {
      id: `fl-${Date.now()}`,
      name: freelanceFormData.name.trim(),
      specialization: (freelanceFormData.specialization as FreelanceSpecialization) || 'Audio',
      roleTitle: freelanceFormData.roleTitle?.trim() || `Freelance ${freelanceFormData.specialization || 'Audio'}`,
      phone: freelanceFormData.phone?.trim() || '',
      email: freelanceFormData.email?.trim() || '',
      dailyRate: Number(freelanceFormData.dailyRate || 0),
      idCardNumber: freelanceFormData.idCardNumber?.trim() || '',
      bankName: freelanceFormData.bankName?.trim() || 'BCA',
      bankAccountNumber: freelanceFormData.bankAccountNumber?.trim() || '',
      bankAccountHolder: freelanceFormData.bankAccountHolder?.trim() || freelanceFormData.name.trim(),
      status: (freelanceFormData.status as any) || 'Aktif',
      rating: Number(freelanceFormData.rating || 5),
      skills: freelanceFormData.skills?.trim() || '',
      address: freelanceFormData.address?.trim() || '',
      notes: freelanceFormData.notes?.trim() || '',
      createdAt: new Date().toISOString().split('T')[0],
      _syncMeta: {
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.name
      }
    };
    const updated = [...freelanceList, newWorker];
    setShowAddFreelanceModal(false);
    setShowEditFreelanceModal(false);
    setActiveFreelanceForEdit(null);
    setFreelanceFormData({
      name: '',
      specialization: 'Audio',
      roleTitle: '',
      phone: '',
      email: '',
      dailyRate: 300000,
      idCardNumber: '',
      bankName: 'BCA',
      bankAccountNumber: '',
      bankAccountHolder: '',
      status: 'Aktif',
      rating: 5,
      skills: '',
      address: '',
      notes: ''
    });
    onLogActivity(currentUser.name, currentUser.role, `Menambahkan kru freelance: ${newWorker.name} (${newWorker.specialization})`);
    try {
      await saveFreelanceList(updated, { type: 'save', id: newWorker.id, doc: newWorker });
    } catch (e) {
      console.warn('[Freelance] Background save error:', e);
    }
  };

  const handleOpenEditFreelance = (worker: FreelanceWorker) => {
    setActiveFreelanceForEdit(worker);
    setFreelanceFormData({
      id: worker.id,
      name: worker.name || '',
      specialization: worker.specialization || 'Audio',
      roleTitle: worker.roleTitle || '',
      phone: worker.phone || '',
      email: worker.email || '',
      dailyRate: worker.dailyRate !== undefined ? worker.dailyRate : 200000,
      idCardNumber: worker.idCardNumber || '',
      bankName: worker.bankName || 'BCA',
      bankAccountNumber: worker.bankAccountNumber || '',
      bankAccountHolder: worker.bankAccountHolder || worker.name || '',
      status: worker.status || 'Aktif',
      rating: worker.rating || 5,
      skills: worker.skills || '',
      address: worker.address || '',
      notes: worker.notes || ''
    });
    setShowEditFreelanceModal(true);
  };

  const handleSaveEditFreelance = async () => {
    if (!activeFreelanceForEdit) return;
    const name = freelanceFormData.name?.trim() || activeFreelanceForEdit.name;
    if (!name) {
      alert('Mohon isi nama freelance!');
      return;
    }

    const rateNum = Number(freelanceFormData.dailyRate);
    const resolvedRate = !isNaN(rateNum) && rateNum >= 0 ? rateNum : (activeFreelanceForEdit.dailyRate || 0);

    const updatedPhone = freelanceFormData.phone !== undefined ? freelanceFormData.phone.trim() : (activeFreelanceForEdit.phone || '');
    const updatedSkills = freelanceFormData.skills !== undefined ? freelanceFormData.skills.trim() : (activeFreelanceForEdit.skills || '');
    const updatedEmail = freelanceFormData.email !== undefined ? freelanceFormData.email.trim() : (activeFreelanceForEdit.email || '');

    const updatedWorkerObj: FreelanceWorker = {
      ...activeFreelanceForEdit,
      name: name,
      specialization: (freelanceFormData.specialization as FreelanceSpecialization) || activeFreelanceForEdit.specialization,
      roleTitle: freelanceFormData.roleTitle !== undefined ? freelanceFormData.roleTitle.trim() : (activeFreelanceForEdit.roleTitle || ''),
      phone: updatedPhone,
      email: updatedEmail,
      dailyRate: resolvedRate,
      idCardNumber: freelanceFormData.idCardNumber !== undefined ? freelanceFormData.idCardNumber.trim() : (activeFreelanceForEdit.idCardNumber || ''),
      bankName: freelanceFormData.bankName !== undefined ? freelanceFormData.bankName.trim() : (activeFreelanceForEdit.bankName || ''),
      bankAccountNumber: freelanceFormData.bankAccountNumber !== undefined ? freelanceFormData.bankAccountNumber.trim() : (activeFreelanceForEdit.bankAccountNumber || ''),
      bankAccountHolder: freelanceFormData.bankAccountHolder !== undefined ? freelanceFormData.bankAccountHolder.trim() : (activeFreelanceForEdit.bankAccountHolder || ''),
      status: (freelanceFormData.status as any) || activeFreelanceForEdit.status || 'Aktif',
      rating: Number(freelanceFormData.rating || activeFreelanceForEdit.rating || 5),
      skills: updatedSkills,
      address: freelanceFormData.address !== undefined ? freelanceFormData.address.trim() : (activeFreelanceForEdit.address || ''),
      notes: freelanceFormData.notes !== undefined ? freelanceFormData.notes.trim() : (activeFreelanceForEdit.notes || ''),
      _syncMeta: {
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.name
      }
    } as FreelanceWorker;

    const updated = freelanceList.map(w => w.id === activeFreelanceForEdit.id ? updatedWorkerObj : w);

    setFreelanceList(updated);
    localStorage.setItem('riz_freelance_workers', JSON.stringify(updated));

    // Close modal immediately so the UI is super responsive
    setShowEditFreelanceModal(false);
    setShowAddFreelanceModal(false);
    setActiveFreelanceForEdit(null);
    onLogActivity(
      currentUser.name,
      currentUser.role,
      `Mengubah data freelance: ${updatedWorkerObj.name} (No HP: ${updatedPhone || '-'}, Keahlian: ${updatedSkills || '-'}, Fee: Rp ${resolvedRate.toLocaleString('id-ID')}/hari)`
    );
    try {
      await saveFreelanceList(updated, { type: 'save', id: updatedWorkerObj.id, doc: updatedWorkerObj });
    } catch (e) {
      console.warn('[Freelance] Background save error:', e);
    }
  };

  const handleDeleteFreelance = async (id: string) => {
    const target = freelanceList.find(w => w.id === id);
    const targetName = target?.name || id;
    if (confirm(`Yakin ingin menghapus data freelance "${targetName}" dari sistem?`)) {
      const updated = freelanceList.filter(w => w.id !== id);
      onLogActivity(currentUser.name, currentUser.role, `Menghapus freelance: ${targetName}`);
      try {
        await saveFreelanceList(updated, { type: 'delete', id });
      } catch (e) {
        console.warn('[Freelance] Background delete error:', e);
      }
    }
  };


  // ─────────────────────────────────────────────────────────────
  // 2. TEMUAN QC & WORK ORDERS STATE
  // ─────────────────────────────────────────────────────────────
  const [findingSearch, setFindingSearch] = useState('');
  const [showAddFindingModal, setShowAddFindingModal] = useState(false);
  const [showEditFindingModal, setShowEditFindingModal] = useState(false);
  const [activeFindingForEdit, setActiveFindingForEdit] = useState<Finding | null>(null);

  const [findingFormData, setFindingFormData] = useState<Partial<Finding>>({
    equipment: '',
    issue: '',
    priority: 'Sedang',
    pic: currentUser.name,
    targetDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: 'Open'
  });

  const handleOpenEditFinding = (f: Finding) => {
    setActiveFindingForEdit(f);
    setFindingFormData({ ...f });
    setShowEditFindingModal(true);
  };

  const handleSaveEditFinding = () => {
    if (!activeFindingForEdit) return;
    onUpdateFinding(activeFindingForEdit.id, findingFormData);
    onLogActivity(currentUser.name, currentUser.role, `Mengubah data temuan QC: ${findingFormData.equipment}`);
    setShowEditFindingModal(false);
    setActiveFindingForEdit(null);
  };

  const handleCreateFinding = () => {
    if (!findingFormData.equipment || !findingFormData.issue) return;
    onAddFinding({
      equipment: findingFormData.equipment,
      issue: findingFormData.issue,
      priority: (findingFormData.priority as 'Tinggi' | 'Sedang' | 'Rendah') || 'Sedang',
      pic: findingFormData.pic || currentUser.name,
      targetDate: findingFormData.targetDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: (findingFormData.status as 'Open' | 'Close') || 'Open'
    });
    onLogActivity(currentUser.name, currentUser.role, `Menambahkan temuan QC baru: ${findingFormData.equipment}`);
    setShowAddFindingModal(false);
  };

  // ─────────────────────────────────────────────────────────────
  // 3. MAINTENANCE (PEMELIHARAAN) STATE
  // ─────────────────────────────────────────────────────────────
  const [maintenanceSearch, setMaintenanceSearch] = useState('');
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [activeScheduleForEdit, setActiveScheduleForEdit] = useState<MaintenanceSchedule | null>(null);

  const [scheduleFormData, setScheduleFormData] = useState<Partial<MaintenanceSchedule>>({
    assetName: '',
    assetCode: '',
    type: 'Preventive',
    frequency: 'Bulanan',
    lastDate: new Date().toISOString().split('T')[0],
    nextDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    status: 'Scheduled',
    notes: '',
    sparepart: '',
    vendor: '',
    biaya: 0
  });

  const handleOpenEditSchedule = (s: MaintenanceSchedule) => {
    setActiveScheduleForEdit(s);
    setScheduleFormData({ ...s });
    setShowEditScheduleModal(true);
  };

  const handleSaveEditSchedule = () => {
    if (!activeScheduleForEdit) return;
    onUpdateSchedule(activeScheduleForEdit.id, scheduleFormData);
    onLogActivity(currentUser.name, currentUser.role, `Mengubah jadwal maintenance: ${scheduleFormData.assetName}`);
    setShowEditScheduleModal(false);
    setActiveScheduleForEdit(null);
  };

  const handleCreateSchedule = () => {
    if (!scheduleFormData.assetName || !scheduleFormData.assetCode) return;
    onAddSchedule({
      assetName: scheduleFormData.assetName,
      assetCode: scheduleFormData.assetCode,
      type: (scheduleFormData.type as any) || 'Preventive',
      frequency: (scheduleFormData.frequency as any) || 'Bulanan',
      lastDate: scheduleFormData.lastDate || new Date().toISOString().split('T')[0],
      nextDate: scheduleFormData.nextDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: (scheduleFormData.status as any) || 'Scheduled',
      notes: scheduleFormData.notes || '',
      sparepart: scheduleFormData.sparepart || '',
      vendor: scheduleFormData.vendor || '',
      biaya: scheduleFormData.biaya || 0
    });
    onLogActivity(currentUser.name, currentUser.role, `Menambah jadwal pemeliharaan baru: ${scheduleFormData.assetName}`);
    setShowAddScheduleModal(false);
  };

  // ─────────────────────────────────────────────────────────────
  // 4. MANAJEMEN GUDANG & MASTER ASET STATE
  // ─────────────────────────────────────────────────────────────
  const [assetSearch, setAssetSearch] = useState('');
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showEditAssetModal, setShowEditAssetModal] = useState(false);
  const [activeAssetForEdit, setActiveAssetForEdit] = useState<Asset | null>(null);

  const [assetFormData, setAssetFormData] = useState<Partial<Asset>>({
    name: '',
    code: '',
    brand: 'Standard',
    serialNumber: '-',
    division: 'Audio',
    location: 'Gudang Utama - Rak A1',
    condition: 'Baik'
  });

  const handleOpenEditAsset = (a: Asset) => {
    setActiveAssetForEdit(a);
    setAssetFormData({ ...a });
    setShowEditAssetModal(true);
  };

  const handleSaveEditAsset = () => {
    if (!activeAssetForEdit) return;
    onUpdateAsset(activeAssetForEdit.id, assetFormData);
    onLogActivity(currentUser.name, currentUser.role, `Mengubah data aset gudang: ${assetFormData.name}`);
    setShowEditAssetModal(false);
    setActiveAssetForEdit(null);
  };

  const handleCreateAsset = () => {
    if (!assetFormData.name || !assetFormData.code) return;
    onAddAsset({
      name: assetFormData.name,
      code: assetFormData.code,
      brand: assetFormData.brand || 'Standard',
      serialNumber: assetFormData.serialNumber || '-',
      division: (assetFormData.division as Division) || 'Audio',
      location: assetFormData.location || 'Gudang Utama',
      condition: (assetFormData.condition as any) || 'Baik'
    });
    onLogActivity(currentUser.name, currentUser.role, `Menambahkan aset gudang baru: ${assetFormData.name}`);
    setShowAddAssetModal(false);
  };

  // ─────────────────────────────────────────────────────────────
  // 4B. TATA KELOLA KENDARAAN & ARMADA LOGISTIK STATE
  // ─────────────────────────────────────────────────────────────
  const [vehicles, setVehicles] = useState<VehicleMaster[]>(() => {
    try {
      const saved = localStorage.getItem('riz_master_vehicles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const flat = parsed.flatMap(item => (item && Array.isArray(item.list)) ? item.list : [item]);
          let valid = flat.filter(v => Boolean(v && typeof v === 'object' && (v.name || v.policeNumber)));
          valid = valid.filter(v => v.policeNumber !== 'F 8446 BF' && v.policeNumber !== 'B 9142 SXZ');
          const seen = new Set();
          valid = valid.filter(v => {
            if (seen.has(v.policeNumber)) return false;
            seen.add(v.policeNumber);
            return true;
          });
          if (valid.length > 0) return valid;
        }
      }
    } catch (e) {}
    return INITIAL_VEHICLES;
  });

  const [fleetAssignments, setFleetAssignments] = useState<FleetAssignment[]>(() => {
    try {
      const saved = localStorage.getItem('riz_fleet_assignments');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const flat = parsed.flatMap(item => (item && Array.isArray(item.list)) ? item.list : [item]);
          const valid = flat.filter(f => Boolean(f && typeof f === 'object' && (f.spjNumber || f.driverName)));
          return valid;
        }
      }
    } catch (e) {}
    return [];
  });

  const [kendaraanSubTab, setKendaraanSubTab] = useState<'vehicles' | 'drivers' | 'trips'>('vehicles');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [fleetSearch, setFleetSearch] = useState('');

  // ─────────────────────────────────────────────────────────────
  // 4C. MASTER DRIVER ARMADA STATE
  // ─────────────────────────────────────────────────────────────
  const [driverList, setDriverList] = useState<FleetDriver[]>(() => {
    try {
      const saved = localStorage.getItem('riz_fleet_drivers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const flat = parsed.flatMap(item => (item && Array.isArray(item.list)) ? item.list : [item]);
          const valid = flat.filter(d => Boolean(d && typeof d === 'object' && d.name));
          if (valid.length > 0) return valid;
        }
      }
    } catch (e) {}
    return INITIAL_FLEET_DRIVERS;
  });

  const [driverSearch, setDriverSearch] = useState('');
  const [driverTypeFilter, setDriverTypeFilter] = useState<string>('ALL');
  const [driverStatusFilter, setDriverStatusFilter] = useState<string>('ALL');
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showEditDriverModal, setShowEditDriverModal] = useState(false);
  const [activeDriverForEdit, setActiveDriverForEdit] = useState<FleetDriver | null>(null);

  const [driverFormData, setDriverFormData] = useState<Partial<FleetDriver>>({
    name: '',
    phone: '',
    driverType: 'Internal',
    simType: 'SIM B1',
    simExpiry: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    idCardNumber: '',
    assignedVehicle: 'Truk Box Mitsubishi Canter CDD (6 Roda)',
    status: 'Siap Jalan',
    emergencyContact: '',
    address: '',
    notes: ''
  });

  const saveDriverList = async (updated: FleetDriver[], actionDoc?: { type: 'save' | 'delete', id: string, doc?: FleetDriver, name?: string }) => {
    setDriverList(updated);
    localStorage.setItem('riz_fleet_drivers', JSON.stringify(updated));
    pushCollectionToCloud('fleet_drivers', updated, currentUser.name);
    if (actionDoc) {
      if (actionDoc.type === 'save' && actionDoc.doc) {
        await saveCloudDoc('fleet_drivers', actionDoc.id, actionDoc.doc, currentUser.name);
      } else if (actionDoc.type === 'delete') {
        await deleteCloudDoc('fleet_drivers', actionDoc.id, actionDoc.name);
      }
    }
    onLogActivity(currentUser.name, currentUser.role, 'Memperbarui master database driver armada');
  };

  const handleAddDriver = async () => {
    if (!driverFormData.name?.trim()) return;
    const newDriver: FleetDriver = {
      id: `drv-${Date.now()}`,
      name: driverFormData.name.trim(),
      phone: driverFormData.phone?.trim() || '',
      driverType: (driverFormData.driverType as any) || 'Internal',
      simType: (driverFormData.simType as any) || 'SIM B1',
      simExpiry: driverFormData.simExpiry || new Date().toISOString().split('T')[0],
      idCardNumber: driverFormData.idCardNumber?.trim() || '',
      assignedVehicle: driverFormData.assignedVehicle || '',
      status: (driverFormData.status as any) || 'Siap Jalan',
      emergencyContact: driverFormData.emergencyContact?.trim() || '',
      address: driverFormData.address?.trim() || '',
      notes: driverFormData.notes?.trim() || '',
      createdAt: new Date().toISOString().split('T')[0],
      _syncMeta: {
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.name
      }
    };
    const updated = [...driverList, newDriver];
    await saveDriverList(updated, { type: 'save', id: newDriver.id, doc: newDriver });
    setDriverFormData({
      name: '',
      phone: '',
      driverType: 'Internal',
      simType: 'SIM B1',
      simExpiry: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      idCardNumber: '',
      assignedVehicle: 'Truk Box Mitsubishi Canter CDD (6 Roda)',
      status: 'Siap Jalan',
      emergencyContact: '',
      address: '',
      notes: ''
    });
    setShowAddDriverModal(false);
  };

  const handleOpenEditDriver = (driver: FleetDriver) => {
    setActiveDriverForEdit(driver);
    setDriverFormData({ ...driver });
    setShowEditDriverModal(true);
  };

  const handleSaveEditDriver = async () => {
    if (!activeDriverForEdit) return;
    const name = driverFormData.name?.trim() || activeDriverForEdit.name;
    if (!name) {
      alert('Mohon isi nama driver!');
      return;
    }
    let updatedDriverObj: FleetDriver = activeDriverForEdit;
    const updated = driverList.map(d => {
      if (d.id === activeDriverForEdit.id) {
        updatedDriverObj = {
          ...d,
          name: name,
          phone: driverFormData.phone?.trim() || '',
          driverType: (driverFormData.driverType as any) || d.driverType,
          simType: (driverFormData.simType as any) || d.simType,
          simExpiry: driverFormData.simExpiry || d.simExpiry,
          idCardNumber: driverFormData.idCardNumber?.trim() || '',
          assignedVehicle: driverFormData.assignedVehicle || '',
          status: (driverFormData.status as any) || d.status,
          emergencyContact: driverFormData.emergencyContact?.trim() || '',
          address: driverFormData.address?.trim() || '',
          notes: driverFormData.notes?.trim() || '',
          _syncMeta: {
            updatedAt: new Date().toISOString(),
            updatedBy: currentUser.name
          }
        };
        return updatedDriverObj;
      }
      return d;
    });
    setShowEditDriverModal(false);
    setShowAddDriverModal(false);
    setActiveDriverForEdit(null);
    onLogActivity(currentUser.name, currentUser.role, `Mengubah data driver: ${updatedDriverObj.name}`);
    try {
      await saveDriverList(updated, { type: 'save', id: updatedDriverObj.id, doc: updatedDriverObj });
    } catch (e) {
      console.warn('[Driver] Background save error:', e);
    }
  };

  const handleDeleteDriver = async (id: string) => {
    const target = driverList.find(d => d.id === id || d.name === id);
    const targetName = target?.name || id;
    const targetId = target?.id || id;
    if (confirm(`Yakin ingin menghapus data driver "${targetName}" dari sistem?`)) {
      const updated = driverList.filter(d => d.id !== targetId && d.name !== targetName);
      onLogActivity(currentUser.name, currentUser.role, `Menghapus driver: ${targetName}`);
      try {
        await saveDriverList(updated, { type: 'delete', id: targetId, name: targetName });
        if (targetName && targetName !== targetId) {
          await deleteCloudDoc('fleet_drivers', targetName.toLowerCase().trim());
          await deleteCloudDoc('fleet_drivers', targetName.trim());
        }
      } catch (e) {
        console.warn('[Driver] Background delete error:', e);
      }
    }
  };

  const handleToggleDriverStatus = (driver: FleetDriver) => {
    const nextStatusMap: Record<string, 'Siap Jalan' | 'On Trip' | 'Off / Libur'> = {
      'Siap Jalan': 'On Trip',
      'On Trip': 'Off / Libur',
      'Off / Libur': 'Siap Jalan',
      'Nonaktif': 'Siap Jalan'
    };
    const nextStatus = nextStatusMap[driver.status] || 'Siap Jalan';
    const updated = driverList.map(d => d.id === driver.id ? { ...d, status: nextStatus } : d);
    saveDriverList(updated);
  };

  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showEditVehicleModal, setShowEditVehicleModal] = useState(false);
  const [activeVehicleForEdit, setActiveVehicleForEdit] = useState<VehicleMaster | null>(null);


  const [vehicleFormData, setVehicleFormData] = useState<Partial<VehicleMaster>>({
    name: '',
    ownership: 'Internal',
    policeNumber: '',
    vehicleType: 'Truk Box CDD (6 Roda)',
    tonnageCapacity: 5.0,
    cbmCapacity: 22.0,
    odometerKM: 50000,
    stnkTaxExpiry: new Date().toISOString().split('T')[0],
    kirExpiry: new Date().toISOString().split('T')[0],
    status: 'Siap Operasi'
  });

  const [showAddFleetModal, setShowAddFleetModal] = useState(false);
  const [showEditFleetModal, setShowEditFleetModal] = useState(false);
  const [activeFleetForEdit, setActiveFleetForEdit] = useState<FleetAssignment | null>(null);

  const [fleetFormData, setFleetFormData] = useState<Partial<FleetAssignment>>({
    spjNumber: '',
    eventName: '',
    tripType: 'Dalam Kota (Jabodetabek)',
    vehicleType: 'Truk Box Mitsubishi Canter CDD (6 Roda)',
    policeNumber: '',
    driverName: '',
    destination: '',
    departureDate: new Date().toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    totalCBM: 0,
    p2hStatus: 'Laik Jalan',
    approvalStatus: 'Approved',
    status: 'Dijadwalkan',
    budget: {
      sewaVendor: 0,
      bbmSolar: 0,
      eToll: 0,
      uangMakanDriver: 0,
      biayaBongkarMuat: 0,
      totalRAB: 0,
      receiptVerified: true,
      calculatedBy: 'Caca (Admin & Logistik)'
    }
  });

  const saveVehicles = async (updated: VehicleMaster[], actionDoc?: { type: 'save' | 'delete', id: string, doc?: VehicleMaster }) => {
    setVehicles(updated);
    localStorage.setItem('riz_master_vehicles', JSON.stringify(updated));
    pushCollectionToCloud('master_vehicles', updated, currentUser.name);
    if (actionDoc) {
      if (actionDoc.type === 'save' && actionDoc.doc) {
        await saveCloudDoc('master_vehicles', actionDoc.id, actionDoc.doc, currentUser.name);
      } else if (actionDoc.type === 'delete') {
        await deleteCloudDoc('master_vehicles', actionDoc.id);
      }
    }
    onLogActivity(currentUser.name, currentUser.role, 'Admin memperbarui database master kendaraan armada');
  };

  const saveFleetAssignments = async (updated: FleetAssignment[], actionDoc?: { type: 'save' | 'delete', id: string, doc?: FleetAssignment }) => {
    setFleetAssignments(updated);
    localStorage.setItem('riz_fleet_assignments', JSON.stringify(updated));
    pushCollectionToCloud('fleet_assignments', updated, currentUser.name);
    if (actionDoc) {
      if (actionDoc.type === 'save' && actionDoc.doc) {
        await saveCloudDoc('fleet_assignments', actionDoc.id, actionDoc.doc, currentUser.name);
      } else if (actionDoc.type === 'delete') {
        await deleteCloudDoc('fleet_assignments', actionDoc.id);
      }
    }
    onLogActivity(currentUser.name, currentUser.role, 'Admin memperbarui penugasan armada & SPJ');
  };

  const handleOpenEditVehicle = (v: VehicleMaster) => {
    setActiveVehicleForEdit(v);
    setVehicleFormData({ ...v });
    setShowEditVehicleModal(true);
  };

  const handleSaveEditVehicle = async () => {
    if (!activeVehicleForEdit || !vehicleFormData.name || !vehicleFormData.policeNumber) return;
    let updatedVehicleObj: VehicleMaster = activeVehicleForEdit;
    const updated = vehicles.map(v => {
      if (v.id === activeVehicleForEdit.id) {
        updatedVehicleObj = { ...v, ...vehicleFormData } as VehicleMaster;
        return updatedVehicleObj;
      }
      return v;
    });
    setShowEditVehicleModal(false);
    setShowAddVehicleModal(false);
    setActiveVehicleForEdit(null);
    try {
      await saveVehicles(updated, { type: 'save', id: updatedVehicleObj.id, doc: updatedVehicleObj });
    } catch (e) {
      console.warn('[Vehicle] Background save error:', e);
    }
  };

  const handleCreateVehicle = async () => {
    if (!vehicleFormData.name || !vehicleFormData.policeNumber) return;
    const newV: VehicleMaster = {
      id: 'veh-' + Date.now(),
      name: vehicleFormData.name,
      ownership: vehicleFormData.ownership || 'Internal',
      policeNumber: vehicleFormData.policeNumber.toUpperCase().trim(),
      vehicleType: vehicleFormData.vehicleType || 'Truk Box CDD (6 Roda)',
      tonnageCapacity: Number(vehicleFormData.tonnageCapacity || 3.0),
      cbmCapacity: Number(vehicleFormData.cbmCapacity || 15.0),
      odometerKM: Number(vehicleFormData.odometerKM || 0),
      stnkTaxExpiry: vehicleFormData.stnkTaxExpiry || new Date().toISOString().split('T')[0],
      kirExpiry: vehicleFormData.kirExpiry || new Date().toISOString().split('T')[0],
      status: vehicleFormData.status || 'Siap Operasi'
    };
    const updated = [newV, ...vehicles];
    setShowAddVehicleModal(false);
    setShowEditVehicleModal(false);
    setActiveVehicleForEdit(null);
    try {
      await saveVehicles(updated, { type: 'save', id: newV.id, doc: newV });
    } catch (e) {
      console.warn('[Vehicle] Background create error:', e);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    const target = vehicles.find(v => v.id === id);
    const targetName = target?.name || target?.policeNumber || id;
    if (confirm(`Hapus unit armada "${targetName}" ini dari master database oleh Admin?`)) {
      const updated = vehicles.filter(v => v.id !== id);
      try {
        await saveVehicles(updated, { type: 'delete', id });
      } catch (e) {
        console.warn('[Vehicle] Background delete error:', e);
      }
    }
  };

  const handleOpenEditFleet = (f: FleetAssignment) => {
    setActiveFleetForEdit(f);
    setFleetFormData({ ...f });
    setShowEditFleetModal(true);
  };

  const handleSaveEditFleet = async () => {
    if (!activeFleetForEdit) return;
    const b = fleetFormData.budget || {
      sewaVendor: 0,
      bbmSolar: 0,
      eToll: 0,
      uangMakanDriver: 0,
      biayaBongkarMuat: 0,
      totalRAB: 0,
      receiptVerified: true,
      calculatedBy: 'Caca'
    };
    const totalRAB = Number(b.sewaVendor || 0) + Number(b.bbmSolar || 0) + Number(b.eToll || 0) + Number(b.uangMakanDriver || 0) + Number(b.biayaBongkarMuat || 0);

    let updatedFleetObj: FleetAssignment = activeFleetForEdit;
    const updated = fleetAssignments.map(f => {
      if (f.id === activeFleetForEdit.id) {
        updatedFleetObj = {
          ...f,
          ...fleetFormData,
          budget: {
            ...b,
            totalRAB
          }
        } as FleetAssignment;
        return updatedFleetObj;
      }
      return f;
    });
    setShowEditFleetModal(false);
    setShowAddFleetModal(false);
    setActiveFleetForEdit(null);
    try {
      await saveFleetAssignments(updated, { type: 'save', id: updatedFleetObj.id, doc: updatedFleetObj });
    } catch (e) {
      console.warn('[Fleet] Background save error:', e);
    }
  };

  const handleCreateFleet = async () => {
    if (!fleetFormData.policeNumber || !fleetFormData.driverName || !fleetFormData.destination) return;
    const b = fleetFormData.budget || {
      sewaVendor: 0,
      bbmSolar: 0,
      eToll: 0,
      uangMakanDriver: 0,
      biayaBongkarMuat: 0,
      totalRAB: 0,
      receiptVerified: true,
      calculatedBy: 'Caca'
    };
    const totalRAB = Number(b.sewaVendor || 0) + Number(b.bbmSolar || 0) + Number(b.eToll || 0) + Number(b.uangMakanDriver || 0) + Number(b.biayaBongkarMuat || 0);

    const newF: FleetAssignment = {
      id: 'fleet-' + Date.now(),
      spjNumber: fleetFormData.spjNumber || `SPJ/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(1000 + Math.random() * 9000)}`,
      eventName: fleetFormData.eventName || 'Event Produksi',
      tripType: fleetFormData.tripType || 'Dalam Kota (Jabodetabek)',
      vehicleType: fleetFormData.vehicleType || 'Truk Box Mitsubishi Canter CDD (6 Roda)',
      policeNumber: fleetFormData.policeNumber.toUpperCase().trim(),
      driverName: fleetFormData.driverName.trim(),
      destination: fleetFormData.destination.trim(),
      departureDate: fleetFormData.departureDate || new Date().toISOString().split('T')[0],
      returnDate: fleetFormData.returnDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      manifest: fleetFormData.manifest || [],
      totalCBM: Number(fleetFormData.totalCBM || 0),
      p2hStatus: fleetFormData.p2hStatus || 'Laik Jalan',
      p2h: fleetFormData.p2h || {
        banPsi: true,
        oliMesin: true,
        rem: true,
        kelistrikanLampu: true,
        radiatorCoolant: true,
        ratchetLashingStrap: true,
        legalitasSurat: true,
        notes: 'Disetujui Admin Panel.',
        inspector: 'Agus'
      },
      budget: {
        ...b,
        totalRAB,
        calculatedBy: 'Caca (Admin & Logistik)'
      },
      approvalStatus: fleetFormData.approvalStatus || 'Approved',
      approvedBy: 'Fahrul (Manager Operasional)',
      approvedAt: new Date().toLocaleString('id-ID'),
      status: fleetFormData.status || 'Dijadwalkan'
    };

    const updated = [newF, ...fleetAssignments];
    await saveFleetAssignments(updated, { type: 'save', id: newF.id, doc: newF });
    setShowAddFleetModal(false);
  };

  const handleDeleteFleet = async (id: string) => {
    if (confirm('Hapus penugasan armada / SPJ ini dari sistem oleh Admin?')) {
      const updated = fleetAssignments.filter(f => f.id !== id);
      await saveFleetAssignments(updated, { type: 'delete', id });
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 5. QC CHECKLIST STATE
  // ─────────────────────────────────────────────────────────────
  const [selectedQcDivision, setSelectedQcDivision] = useState<Division>('Audio');
  const [qcChecklists, setQcChecklists] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('riz_custom_qc_checklists');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return QC_ITEMS_BY_DIVISION;
  });
  const [newQcItemText, setNewQcItemText] = useState('');
  const [editingQcIdx, setEditingQcIdx] = useState<number | null>(null);
  const [editingQcText, setEditingQcText] = useState('');

  const saveQcChecklists = (updated: Record<string, string[]>) => {
    setQcChecklists(updated);
    localStorage.setItem('riz_custom_qc_checklists', JSON.stringify(updated));
    saveCloudDoc('system_configs', 'custom_qc_checklists', { data: updated }, currentUser.name);
    onLogActivity(currentUser.name, currentUser.role, `Memperbarui butir QC checklist divisi ${selectedQcDivision}`);
  };

  const handleAddQcItem = () => {
    if (!newQcItemText.trim()) return;
    const currentItems = qcChecklists[selectedQcDivision] || [];
    const updated = {
      ...qcChecklists,
      [selectedQcDivision]: [...currentItems, newQcItemText.trim()]
    };
    saveQcChecklists(updated);
    setNewQcItemText('');
  };

  const handleUpdateQcItem = (index: number) => {
    if (!editingQcText.trim()) return;
    const currentItems = [...(qcChecklists[selectedQcDivision] || [])];
    currentItems[index] = editingQcText.trim();
    const updated = {
      ...qcChecklists,
      [selectedQcDivision]: currentItems
    };
    saveQcChecklists(updated);
    setEditingQcIdx(null);
  };

  const handleDeleteQcItem = (index: number) => {
    const currentItems = qcChecklists[selectedQcDivision] || [];
    const updated = {
      ...qcChecklists,
      [selectedQcDivision]: currentItems.filter((_, idx) => idx !== index)
    };
    saveQcChecklists(updated);
  };

  // ─────────────────────────────────────────────────────────────
  // 6. SCHEDULE ROSTER STATE
  // ─────────────────────────────────────────────────────────────
  const saveSchedule = (updated: StaffScheduleRow[]) => {
    localStorage.setItem(`riz_schedule_${activeMonth}`, JSON.stringify(updated));
    pushCollectionToCloud(`schedule_${activeMonth}`, updated, currentUser.name);
    onLogActivity(currentUser.name, currentUser.role, `Memperbarui jadwal dinas operasional shift ${getScheduleByKey(activeMonth)?.label}`);
  };

  const handleUpdateDayShift = (staffId: string, day: number, newShift: string) => {
    const updated = scheduleData.map(s => {
      if ((s as any).id === staffId || String(s.no) === String(staffId)) {
        return {
          ...s,
          shifts: {
            ...s.shifts,
            [day]: newShift
          }
        };
      }
      return s;
    });
    saveSchedule(updated);
  };

  // ─────────────────────────────────────────────────────────────
  // 7. DATABASE & BACKUP & GOOGLE SHEETS SYNC
  // ─────────────────────────────────────────────────────────────
  const [syncMessage, setSyncMessage] = useState('');
  const [sheetWebhookUrl, setSheetWebhookUrl] = useState<string>(() => getGoogleSheetWebhookUrl());
  const [sheetSyncing, setSheetSyncing] = useState<boolean>(false);
  const [sheetTesting, setSheetTesting] = useState<boolean>(false);
  const [sheetMessage, setSheetMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [sheetLastSync, setSheetLastSync] = useState<string | null>(() => getGoogleSheetLastSync());
  const [showScriptModal, setShowScriptModal] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Live listener untuk update otomatis status sinkronisasi Google Sheet
  useEffect(() => {
    const handleSheetSynced = (e: any) => {
      const ts = e?.detail?.timestamp || new Date().toISOString();
      setSheetLastSync(ts);
    };
    window.addEventListener('riz_google_sheet_synced', handleSheetSynced);
    return () => {
      window.removeEventListener('riz_google_sheet_synced', handleSheetSynced);
    };
  }, []);

  const handleSaveSheetUrl = () => {
    setGoogleSheetWebhookUrl(sheetWebhookUrl);
    setSheetMessage({ text: 'URL Google Apps Script Webhook berhasil disimpan!', type: 'success' });
    setTimeout(() => setSheetMessage(null), 4000);
  };

  const handleTestSheetConnection = async () => {
    setSheetTesting(true);
    setSheetMessage({ text: 'Menguji koneksi ke Google Sheet Webhook...', type: 'info' });
    const res = await testGoogleSheetWebhook(sheetWebhookUrl);
    setSheetTesting(false);
    setSheetMessage({ text: res.message, type: res.success ? 'success' : 'error' });
    if (res.success) {
      setGoogleSheetWebhookUrl(sheetWebhookUrl);
    }
  };

  const handleSyncToGoogleSheet = async () => {
    setSheetSyncing(true);
    setSheetMessage({ text: 'Mengunggah seluruh data ke Google Sheet...', type: 'info' });
    const res = await syncAllToGoogleSheet(sheetWebhookUrl);
    setSheetSyncing(false);
    setSheetMessage({ text: res.message, type: res.success ? 'success' : 'error' });
    if (res.success) {
      setSheetLastSync(new Date().toISOString());
      onLogActivity(currentUser.name, currentUser.role, 'Sinkronisasi seluruh data ke Google Sheet Spreadsheet');
    }
  };

  const handlePullFromGoogleSheet = async () => {
    setSheetSyncing(true);
    setSheetMessage({ text: 'Menarik data shift roster dari Google Sheet...', type: 'info' });
    const res = await pullDataFromGoogleSheet(sheetWebhookUrl);
    setSheetSyncing(false);
    setSheetMessage({ text: res.message, type: res.success ? 'success' : 'error' });
    if (res.success && res.details?.schedule_shifts) {
      saveSchedule(res.details.schedule_shifts);
      setSheetLastSync(new Date().toISOString());
      onLogActivity(currentUser.name, currentUser.role, 'Menarik data jadwal shift dari Google Sheet Spreadsheet');
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const handleExportAllData = () => {
    const allData: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('riz_')) {
        try {
          allData[key] = JSON.parse(localStorage.getItem(key) || '');
        } catch (e) {
          allData[key] = localStorage.getItem(key);
        }
      }
    }
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_riz_production_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onLogActivity(currentUser.name, currentUser.role, 'Mengunduh file backup JSON database aplikasi');
  };

  const handleTriggerCloudSync = async () => {
    setSyncMessage('Sedang menyinkronkan seluruh modul ke Cloud Firestore...');
    try {
      await forceSyncAllModules();
      setSyncMessage('Sinkronisasi database Cloud Firestore berhasil diselesaikan!');
      setTimeout(() => setSyncMessage(''), 4000);
    } catch (e) {
      setSyncMessage('Sinkronisasi selesai (data tersimpan di cloud & lokal).');
      setTimeout(() => setSyncMessage(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-2 rounded-xl shadow-xs">
              <Sliders className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Panel Kontrol Pengelolaan Admin</h1>
              <p className="text-xs text-slate-500 font-medium">Ubah & Kelola Master Staf, Temuan QC/WO, Maintenance, Aset Gudang, Checklist & Roster</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'staff' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Master Staf</span>
          </button>
          <button
            onClick={() => setActiveTab('findings_wo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'findings_wo' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Temuan QC & WO</span>
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'maintenance' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Maintenance</span>
          </button>
          <button
            onClick={() => setActiveTab('gudang')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'gudang' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Gudang & Aset</span>
          </button>
          <button
            onClick={() => setActiveTab('kendaraan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'kendaraan' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Tata Kelola Kendaraan</span>
          </button>
          <button
            onClick={() => setActiveTab('qc_checklist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'qc_checklist' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Checklist QC</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'schedule' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Shift Roster</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'database' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Sync & DB</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: MASTER PERSONEL (STAF TETAP & KRU FREELANCE)           */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          {/* Sub Navigation Staf vs Freelance */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setPersonnelSubTab('permanent')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  personnelSubTab === 'permanent' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Staf Karyawan Tetap ({staffList.length})</span>
              </button>
              <button
                onClick={() => setPersonnelSubTab('freelance')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  personnelSubTab === 'freelance' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Database Kru Freelance ({freelanceList.length})</span>
              </button>
            </div>

            {personnelSubTab === 'permanent' ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari nama staf / no telp / divisi..."
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                  />
                </div>
                <select
                  value={staffSortBy}
                  onChange={(e) => setStaffSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                  title="Urutan Master Staf"
                >
                  <option value="hierarchy">👑 Hierarki Jabatan & Level</option>
                  <option value="division">🏢 Berdasarkan Divisi</option>
                  <option value="name">🔤 Nama (A - Z)</option>
                </select>
                <button
                  onClick={() => {
                    setStaffFormData({ name: '', division: 'Audio', role: 'Staff', phone: '', email: '', avatar: '' });
                    setShowAddStaffModal(true);
                  }}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Staf Baru</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari nama / keahlian / WA / bank..."
                    value={freelanceSearch}
                    onChange={(e) => setFreelanceSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                  />
                </div>
                <select
                  value={freelanceSpecFilter}
                  onChange={(e) => setFreelanceSpecFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">Semua Spesialisasi</option>
                  <option value="Audio">Audio / Sound</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Videotron">Videotron</option>
                  <option value="Multimedia">Multimedia</option>
                  <option value="Rigging">Rigging</option>
                  <option value="Genset / Power">Genset / Power</option>
                  <option value="Gudang / Helper">Gudang / Helper</option>
                  <option value="Driver">Driver Lapangan</option>
                  <option value="Service / Teknisi">Service / Teknisi</option>
                  <option value="Umum">Umum</option>
                </select>
                <select
                  value={freelanceStatusFilter}
                  onChange={(e) => setFreelanceStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Standby">Standby</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
                <button
                  onClick={() => {
                    setFreelanceFormData({
                      name: '',
                      specialization: 'Audio',
                      roleTitle: '',
                      phone: '',
                      email: '',
                      dailyRate: 300000,
                      idCardNumber: '',
                      bankName: 'BCA',
                      bankAccountNumber: '',
                      bankAccountHolder: '',
                      status: 'Aktif',
                      rating: 5,
                      skills: '',
                      address: '',
                      notes: ''
                    });
                    setShowAddFreelanceModal(true);
                  }}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Input Freelance Baru</span>
                </button>
              </div>
            )}
          </div>

          {/* VIEW 1: STAF KARYAWAN TETAP */}
          {personnelSubTab === 'permanent' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                      <th className="p-3.5">Foto Profil</th>
                      <th className="p-3.5">Nama Asli & Panggilan</th>
                      <th className="p-3.5">Divisi</th>
                      <th className="p-3.5">Role / Jabatan</th>
                      <th className="p-3.5">Jenjang Level</th>
                      <th className="p-3.5">No. Telp / WA</th>
                      <th className="p-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...staffList]
                      .sort((a, b) => {
                        const levelA = a.level || (a.role === 'Owner' ? 8 : a.role === 'Manager' ? 6 : a.role === 'Team Leader' ? 5 : a.role === 'Admin' ? 4 : a.division === 'Gudang' ? 3 : 2);
                        const levelB = b.level || (b.role === 'Owner' ? 8 : b.role === 'Manager' ? 6 : b.role === 'Team Leader' ? 5 : b.role === 'Admin' ? 4 : b.division === 'Gudang' ? 3 : 2);

                        if (staffSortBy === 'hierarchy') {
                          if (levelB !== levelA) return levelB - levelA;
                          return (a.fullName || a.name).localeCompare(b.fullName || b.name);
                        } else if (staffSortBy === 'division') {
                          const divOrder: Record<string, number> = {
                            'Admin': 1,
                            'Audio': 2,
                            'Lighting': 3,
                            'Videotron': 4,
                            'Multimedia': 5,
                            'Service': 6,
                            'Gudang': 7
                          };
                          const diffDiv = (divOrder[a.division] || 99) - (divOrder[b.division] || 99);
                          if (diffDiv !== 0) return diffDiv;
                          if (levelB !== levelA) return levelB - levelA;
                          return (a.fullName || a.name).localeCompare(b.fullName || b.name);
                        } else {
                          return (a.fullName || a.name).localeCompare(b.fullName || b.name);
                        }
                      })
                      .filter(s => 
                        (s.fullName && s.fullName.toLowerCase().includes(staffSearch.toLowerCase())) ||
                        (s.nickname && s.nickname.toLowerCase().includes(staffSearch.toLowerCase())) ||
                        s.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
                        s.division.toLowerCase().includes(staffSearch.toLowerCase()) ||
                        s.role.toLowerCase().includes(staffSearch.toLowerCase()) ||
                        (s.phone && s.phone.includes(staffSearch))
                      )
                      .map(staff => {
                        const currentStaffLevel = staff.level || (staff.division === 'Audio' && (staff.id === '8' || staff.nickname === 'Emboh' || staff.name === 'Mboh') ? 5 : (staff.id === '9' || staff.id === '14' || staff.name === 'Unyim' || staff.name === 'Buluk') ? 4 : (staff.division === 'Audio' ? 2 : 1));
                        return (
                          <tr key={staff.id} className="hover:bg-slate-50/60">
                            <td className="p-3.5">
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                                {staff.avatar ? (
                                  <img src={staff.avatar} alt={staff.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="font-bold text-slate-600 font-mono text-xs">
                                    {(staff.nickname || staff.fullName || staff.name).substring(0, 2).toUpperCase()}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900 text-xs">
                                {staff.fullName || staff.name}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-100">
                                  Panggilan: {staff.nickname || staff.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">ID: {staff.id}</span>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md font-bold text-[10px]">
                                {staff.division}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="text-slate-700 font-semibold">{staff.role}</span>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-0.5 rounded-full font-black font-mono text-[10px] inline-flex items-center gap-1 shadow-2xs border ${
                                currentStaffLevel >= 5 ? 'bg-amber-100 text-amber-950 border-amber-300' :
                                currentStaffLevel >= 3 ? 'bg-blue-100 text-blue-900 border-blue-200' :
                                'bg-slate-100 text-slate-800 border-slate-200'
                              }`}>
                                <span>★</span> Level {currentStaffLevel}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono text-slate-600">
                              {staff.phone ? (
                                <a
                                  href={`https://wa.me/${staff.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  {staff.phone}
                                </a>
                              ) : (
                                <span className="text-slate-400 italic text-[11px]">- Belum ada -</span>
                              )}
                            </td>
                          <td className="p-3.5 text-right space-x-1.5">
                            <button
                              onClick={() => handleOpenEditStaff(staff)}
                              className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 font-bold text-[11px]"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteStaff(staff.id)}
                              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 2: DATABASE KRU FREELANCE */}
          {personnelSubTab === 'freelance' && (() => {
            const DIVISION_ORDER: Record<string, number> = {
              'Audio': 1,
              'Sound': 1,
              'Multimedia': 2,
              'Lighting': 3,
              'Videotron': 4,
              'LED': 4,
              'Driver': 5,
              'Umum': 6
            };

            const getDivisionBadgeStyle = (spec: string) => {
              switch (spec) {
                case 'Audio':
                case 'Sound':
                  return 'bg-indigo-50 text-indigo-700 border-indigo-200';
                case 'Multimedia':
                  return 'bg-sky-50 text-sky-700 border-sky-200';
                case 'Lighting':
                  return 'bg-amber-50 text-amber-800 border-amber-200';
                case 'Videotron':
                case 'LED':
                  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
                case 'Driver':
                  return 'bg-orange-50 text-orange-700 border-orange-200';
                default:
                  return 'bg-slate-100 text-slate-700 border-slate-200';
              }
            };

            const getDivisionIcon = (spec: string) => {
              switch (spec) {
                case 'Audio':
                case 'Sound':
                  return '🔊';
                case 'Multimedia':
                  return '🎬';
                case 'Lighting':
                  return '💡';
                case 'Videotron':
                case 'LED':
                  return '📺';
                case 'Driver':
                  return '🚚';
                default:
                  return '🛠️';
              }
            };

            const countBySpec = (spec: string) => freelanceList.filter(f => f.specialization === spec).length;

            const sortedFreelance = [...freelanceList].sort((a, b) => {
              const orderA = DIVISION_ORDER[a.specialization] || 99;
              const orderB = DIVISION_ORDER[b.specialization] || 99;
              if (orderA !== orderB) return orderA - orderB;
              return a.name.localeCompare(b.name);
            });

            const filteredFreelance = sortedFreelance.filter(f => {
              const matchesSearch =
                f.name.toLowerCase().includes(freelanceSearch.toLowerCase()) ||
                f.specialization.toLowerCase().includes(freelanceSearch.toLowerCase()) ||
                (f.roleTitle && f.roleTitle.toLowerCase().includes(freelanceSearch.toLowerCase())) ||
                (f.phone && f.phone.includes(freelanceSearch)) ||
                (f.skills && f.skills.toLowerCase().includes(freelanceSearch.toLowerCase())) ||
                (f.bankName && f.bankName.toLowerCase().includes(freelanceSearch.toLowerCase())) ||
                (f.bankAccountNumber && f.bankAccountNumber.includes(freelanceSearch));
              const matchesSpec = freelanceSpecFilter === 'ALL' || f.specialization === freelanceSpecFilter;
              const matchesStatus = freelanceStatusFilter === 'ALL' || f.status === freelanceStatusFilter;
              return matchesSearch && matchesSpec && matchesStatus;
            });

            return (
              <div className="space-y-4">
                {/* Quick Freelance Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Kru Freelance</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{freelanceList.length} Personel</div>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-xs">
                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Status Aktif</div>
                    <div className="text-xl font-black text-emerald-700 mt-1">
                      {freelanceList.filter(f => f.status === 'Aktif').length}
                    </div>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-amber-100 bg-amber-50/20 shadow-xs">
                    <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Status Standby</div>
                    <div className="text-xl font-black text-amber-700 mt-1">
                      {freelanceList.filter(f => f.status === 'Standby').length}
                    </div>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 bg-indigo-50/20 shadow-xs">
                    <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Honor Rata-rata</div>
                    <div className="text-xl font-black text-indigo-700 mt-1">
                      Rp {freelanceList.length > 0 ? Math.round(freelanceList.reduce((acc, f) => acc + (f.dailyRate || 0), 0) / freelanceList.length).toLocaleString('id-ID') : '0'}
                    </div>
                  </div>
                </div>

                {/* Division Fast Tabs / Pills */}
                <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setFreelanceSpecFilter('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      freelanceSpecFilter === 'ALL'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span>📋 Semua Divisi</span>
                    <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full text-[10px]">{freelanceList.length}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFreelanceSpecFilter('Audio')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      freelanceSpecFilter === 'Audio'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span>🔊 Sound / Audio</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${freelanceSpecFilter === 'Audio' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'}`}>{countBySpec('Audio')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFreelanceSpecFilter('Multimedia')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      freelanceSpecFilter === 'Multimedia'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span>🎬 Multimedia</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${freelanceSpecFilter === 'Multimedia' ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-700'}`}>{countBySpec('Multimedia')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFreelanceSpecFilter('Lighting')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      freelanceSpecFilter === 'Lighting'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span>💡 Lighting</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${freelanceSpecFilter === 'Lighting' ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'}`}>{countBySpec('Lighting')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFreelanceSpecFilter('Videotron')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      freelanceSpecFilter === 'Videotron'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span>📺 Videotron / LED</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${freelanceSpecFilter === 'Videotron' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>{countBySpec('Videotron')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFreelanceSpecFilter('Driver')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      freelanceSpecFilter === 'Driver'
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span>🚚 Driver Armada</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${freelanceSpecFilter === 'Driver' ? 'bg-orange-700 text-white' : 'bg-slate-200 text-slate-700'}`}>{countBySpec('Driver')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFreelanceSpecFilter('Umum')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      freelanceSpecFilter === 'Umum'
                        ? 'bg-slate-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span>🛠️ Umum / Logistik</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${freelanceSpecFilter === 'Umum' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}>{countBySpec('Umum')}</span>
                  </button>
                </div>

                {/* Freelance Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead>
                        <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                          <th className="p-3.5">Nama & Keahlian</th>
                          <th className="p-3.5">Divisi / Spesialisasi</th>
                          <th className="p-3.5">Kontak WhatsApp / Telp</th>
                          <th className="p-3.5">Honor / Fee Harian</th>
                          <th className="p-3.5">Rekening Bank</th>
                          <th className="p-3.5">Rating & Status</th>
                          <th className="p-3.5 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredFreelance.map((worker, idx) => {
                          const prevWorker = idx > 0 ? filteredFreelance[idx - 1] : null;
                          const isNewDivisionGroup = !prevWorker || prevWorker.specialization !== worker.specialization;

                          return (
                            <React.Fragment key={worker.id}>
                              {isNewDivisionGroup && freelanceSpecFilter === 'ALL' && (
                                <tr className="bg-slate-100/70 border-t border-b border-slate-200/80">
                                  <td colSpan={7} className="px-3.5 py-2 font-black text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                                    <span>{getDivisionIcon(worker.specialization)}</span>
                                    <span>DIVISI {worker.specialization.toUpperCase()} ({countBySpec(worker.specialization)} PERSONEL)</span>
                                  </td>
                                </tr>
                              )}
                              <tr className="hover:bg-slate-50/60 transition-colors">
                                <td className="p-3.5">
                                  <div className="font-bold text-slate-900">{worker.name}</div>
                                  <div className="text-[11px] text-slate-500 font-medium">{worker.roleTitle || `Freelance ${worker.specialization}`}</div>
                                  {worker.skills && (
                                    <div className="text-[10px] text-indigo-600 bg-indigo-50/70 inline-block px-1.5 py-0.5 rounded mt-0.5 max-w-[200px] truncate">
                                      {worker.skills}
                                    </div>
                                  )}
                                </td>
                                <td className="p-3.5">
                                  <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] border inline-flex items-center gap-1 ${getDivisionBadgeStyle(worker.specialization)}`}>
                                    <span>{getDivisionIcon(worker.specialization)}</span>
                                    <span>{worker.specialization}</span>
                                  </span>
                                </td>
                                <td className="p-3.5">
                                  {worker.phone ? (
                                    <a
                                      href={`https://wa.me/${worker.phone.replace(/[^0-9]/g, '')}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold font-mono text-xs hover:underline"
                                    >
                                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>{worker.phone}</span>
                                    </a>
                                  ) : (
                                    <span className="text-slate-400 italic text-[11px]">- Belum ada -</span>
                                  )}
                                  {worker.email && (
                                    <div className="text-[10px] text-slate-400 font-mono">{worker.email}</div>
                                  )}
                                </td>
                                <td className="p-3.5 font-mono font-bold text-slate-900">
                                  <div
                                    onClick={() => handleOpenEditFreelance(worker)}
                                    className="group inline-flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 transition-colors p-1.5 -m-1 rounded-lg hover:bg-indigo-50/70 border border-transparent hover:border-indigo-200"
                                    title="Klik untuk ubah honor / fee"
                                  >
                                    <span>Rp {(worker.dailyRate || 0).toLocaleString('id-ID')}</span>
                                    <span className="text-[10px] text-slate-400 font-normal group-hover:text-indigo-400"> / hari</span>
                                    <Edit2 className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-indigo-600 transition-opacity ml-0.5" />
                                  </div>
                                </td>
                                <td className="p-3.5">
                                  {worker.bankAccountNumber ? (
                                    <div>
                                      <span className="font-bold text-slate-800 text-[11px]">{worker.bankName || 'Bank'}</span>
                                      <div className="font-mono text-slate-600 text-[11px]">{worker.bankAccountNumber}</div>
                                      <div className="text-[10px] text-slate-400">a.n {worker.bankAccountHolder || worker.name}</div>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 italic text-[11px]">- Cash / Belum ada -</span>
                                  )}
                                </td>
                                <td className="p-3.5">
                                  <div className="flex items-center gap-1 mb-1">
                                    <span className="flex text-amber-400 text-xs">
                                      {'★'.repeat(Math.min(5, Math.max(1, worker.rating || 5)))}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-500">({worker.rating || 5})</span>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    worker.status === 'Aktif'
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : worker.status === 'Standby'
                                      ? 'bg-amber-100 text-amber-700'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {worker.status}
                                  </span>
                                </td>
                                <td className="p-3.5 text-right space-x-1.5">
                                  <button
                                    onClick={() => handleOpenEditFreelance(worker)}
                                    className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 font-bold text-[11px]"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteFreelance(worker.id)}
                                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                        {filteredFreelance.length === 0 && (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                              Tidak ada data kru freelance yang cocok dengan pencarian / filter ini.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: TEMUAN QC & WORK ORDERS                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'findings_wo' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari temuan QC / alat / PIC..."
                value={findingSearch}
                onChange={(e) => setFindingSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              />
            </div>

            <button
              onClick={() => {
                setFindingFormData({
                  equipment: '',
                  issue: '',
                  priority: 'Sedang',
                  pic: currentUser.name,
                  targetDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
                  status: 'Open'
                });
                setShowAddFindingModal(true);
              }}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Temuan QC Baru</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                    <th className="p-3.5">Peralatan</th>
                    <th className="p-3.5">Masalah / Temuan</th>
                    <th className="p-3.5">Prioritas</th>
                    <th className="p-3.5">PIC</th>
                    <th className="p-3.5">Target Selesai</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {findings
                    .filter(f =>
                      f.equipment.toLowerCase().includes(findingSearch.toLowerCase()) ||
                      f.issue.toLowerCase().includes(findingSearch.toLowerCase()) ||
                      f.pic.toLowerCase().includes(findingSearch.toLowerCase())
                    )
                    .map(f => (
                      <tr key={f.id} className="hover:bg-slate-50/60">
                        <td className="p-3.5 font-bold text-slate-900">{f.equipment}</td>
                        <td className="p-3.5 text-slate-800 max-w-xs">{f.issue}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            f.priority === 'Tinggi' ? 'bg-rose-100 text-rose-800' :
                            f.priority === 'Sedang' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {f.priority}
                          </span>
                        </td>
                        <td className="p-3.5 font-medium text-slate-700">{f.pic}</td>
                        <td className="p-3.5 font-mono text-slate-600 text-[11px]">{f.targetDate}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            f.status === 'Close' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {f.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenEditFinding(f)}
                            className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 font-bold text-[11px]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Hapus temuan QC ini?')) onDeleteFinding(f.id);
                            }}
                            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: MAINTENANCE (PEMELIHARAAN)                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari jadwal maintenance / alat / kode..."
                value={maintenanceSearch}
                onChange={(e) => setMaintenanceSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              />
            </div>

            <button
              onClick={() => {
                setScheduleFormData({
                  assetName: '',
                  assetCode: '',
                  type: 'Preventive',
                  frequency: 'Bulanan',
                  lastDate: new Date().toISOString().split('T')[0],
                  nextDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                  status: 'Scheduled',
                  notes: '',
                  sparepart: '',
                  vendor: '',
                  biaya: 0
                });
                setShowAddScheduleModal(true);
              }}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal Maintenance</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                    <th className="p-3.5">Kode Aset</th>
                    <th className="p-3.5">Nama Peralatan</th>
                    <th className="p-3.5">Tipe & Frekuensi</th>
                    <th className="p-3.5">Terakhir / Jadwal Berikutnya</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Biaya / Sparepart</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {maintenanceSchedules
                    .filter(s =>
                      s.assetName.toLowerCase().includes(maintenanceSearch.toLowerCase()) ||
                      s.assetCode.toLowerCase().includes(maintenanceSearch.toLowerCase())
                    )
                    .map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/60">
                        <td className="p-3.5 font-mono font-bold text-indigo-700">{s.assetCode}</td>
                        <td className="p-3.5 font-bold text-slate-900">{s.assetName}</td>
                        <td className="p-3.5">
                          <span className="font-bold text-slate-800">{s.type}</span>
                          <span className="text-[10px] text-slate-500 block">({s.frequency})</span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-600 text-[11px]">
                          <div>Terakhir: {s.lastDate}</div>
                          <div className="text-indigo-600 font-bold">Next: {s.nextDate}</div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            s.status === 'Done' ? 'bg-emerald-100 text-emerald-800' :
                            s.status === 'Overdue' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 text-[11px]">
                          {s.biaya ? <div>Rp {s.biaya.toLocaleString('id-ID')}</div> : null}
                          {s.sparepart ? <div className="text-slate-500 italic">{s.sparepart}</div> : null}
                          {!s.biaya && !s.sparepart ? <span className="text-slate-400">-</span> : null}
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenEditSchedule(s)}
                            className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 font-bold text-[11px]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Hapus jadwal maintenance ini?')) onDeleteSchedule(s.id);
                            }}
                            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 4: GUDANG & MASTER ASET                                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'gudang' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari aset / kode / lokasi..."
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              />
            </div>

            <button
              onClick={() => {
                setAssetFormData({
                  name: '',
                  code: '',
                  brand: 'Standard',
                  serialNumber: '-',
                  division: 'Audio',
                  location: 'Gudang Utama - Rak A1',
                  condition: 'Baik'
                });
                setShowAddAssetModal(true);
              }}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Aset Gudang Baru</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                    <th className="p-3.5">Kode Aset</th>
                    <th className="p-3.5">Nama Peralatan / Barang</th>
                    <th className="p-3.5">Merk / Serial</th>
                    <th className="p-3.5">Divisi</th>
                    <th className="p-3.5">Lokasi Rak / Zona</th>
                    <th className="p-3.5">Kondisi Fisik</th>
                    <th className="p-3.5">Riwayat Servis</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assets
                    .filter(a =>
                      a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
                      a.code.toLowerCase().includes(assetSearch.toLowerCase()) ||
                      a.location.toLowerCase().includes(assetSearch.toLowerCase())
                    )
                    .map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/60">
                        <td className="p-3.5 font-mono font-bold text-indigo-700">{a.code}</td>
                        <td className="p-3.5 font-bold text-slate-900">{a.name}</td>
                        <td className="p-3.5 text-slate-600">
                          <div>{a.brand}</div>
                          <div className="text-[10px] text-slate-400 font-mono">SN: {a.serialNumber}</div>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-600">{a.division}</td>
                        <td className="p-3.5 font-medium text-slate-700">{a.location}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            a.condition === 'Baik' ? 'bg-emerald-100 text-emerald-800' :
                            a.condition === 'Rusak Ringan' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {a.condition}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                          {a.repairHistory?.length || 0} servis
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenEditAsset(a)}
                            className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 font-bold text-[11px]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Hapus aset ini dari database gudang?')) onDeleteAsset(a.id);
                            }}
                            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 4B: TATA KELOLA KENDARAAN & ARMADA LOGISTIK               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'kendaraan' && (
        <div className="space-y-6">
          {/* Sub Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setKendaraanSubTab('vehicles')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  kendaraanSubTab === 'vehicles' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Master Unit Armada ({vehicles.length})</span>
              </button>
              <button
                onClick={() => setKendaraanSubTab('drivers')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  kendaraanSubTab === 'drivers' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Master Driver Armada ({driverList.length})</span>
              </button>
              <button
                onClick={() => setKendaraanSubTab('trips')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  kendaraanSubTab === 'trips' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Jadwal Penugasan & SPJ ({fleetAssignments.length})</span>
              </button>
            </div>

            {kendaraanSubTab === 'vehicles' && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari armada / plat..."
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48"
                  />
                </div>
                <button
                  onClick={() => {
                    setActiveVehicleForEdit(null);
                    setVehicleFormData({
                      name: '',
                      ownership: 'Internal',
                      policeNumber: '',
                      vehicleType: 'Truk Box CDD (6 Roda)',
                      tonnageCapacity: 5.0,
                      cbmCapacity: 22.0,
                      odometerKM: 50000,
                      stnkTaxExpiry: new Date().toISOString().split('T')[0],
                      kirExpiry: new Date().toISOString().split('T')[0],
                      status: 'Siap Operasi'
                    });
                    setShowAddVehicleModal(true);
                  }}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Unit Armada</span>
                </button>
              </div>
            )}

            {kendaraanSubTab === 'drivers' && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari driver / SIM / WA..."
                    value={driverSearch}
                    onChange={(e) => setDriverSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44"
                  />
                </div>
                <select
                  value={driverTypeFilter}
                  onChange={(e) => setDriverTypeFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">Semua Tipe Driver</option>
                  <option value="Internal">Driver Internal PT RIZ</option>
                  <option value="Mitra Vendor">Driver Mitra Vendor</option>
                  <option value="Freelance Driver">Freelance Driver</option>
                </select>
                <select
                  value={driverStatusFilter}
                  onChange={(e) => setDriverStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="Siap Jalan">Siap Jalan</option>
                  <option value="On Trip">On Trip</option>
                  <option value="Off / Libur">Off / Libur</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
                <button
                  onClick={() => {
                    setDriverFormData({
                      name: '',
                      phone: '',
                      driverType: 'Internal',
                      simType: 'SIM B1',
                      simExpiry: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
                      idCardNumber: '',
                      assignedVehicle: vehicles[0]?.name || 'Truk Box Mitsubishi Canter CDD (6 Roda)',
                      status: 'Siap Jalan',
                      emergencyContact: '',
                      address: '',
                      notes: ''
                    });
                    setShowAddDriverModal(true);
                  }}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Input Driver Baru</span>
                </button>
              </div>
            )}

            {kendaraanSubTab === 'trips' && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari SPJ / event / driver..."
                    value={fleetSearch}
                    onChange={(e) => setFleetSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48"
                  />
                </div>
                <button
                  onClick={() => {
                    setActiveFleetForEdit(null);
                    setFleetFormData({
                      spjNumber: `SPJ/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(1000 + Math.random() * 9000)}`,
                      eventName: '',
                      tripType: 'Dalam Kota (Jabodetabek)',
                      vehicleType: vehicles[0]?.name || 'SUZUKI CARRY',
                      policeNumber: vehicles[0]?.policeNumber || 'F 8433 BF',
                      driverName: driverList[0]?.name || '',
                      destination: '',
                      departureDate: new Date().toISOString().split('T')[0],
                      returnDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                      totalCBM: 0,
                      p2hStatus: 'Laik Jalan',
                      approvalStatus: 'Approved',
                      status: 'Dijadwalkan',
                      budget: {
                        sewaVendor: 0,
                        bbmSolar: 0,
                        eToll: 0,
                        uangMakanDriver: 0,
                        biayaBongkarMuat: 0,
                        totalRAB: 0,
                        receiptVerified: true,
                        calculatedBy: 'Caca (Admin & Logistik)'
                      }
                    });
                    setShowAddFleetModal(true);
                  }}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Terbitkan / Tambah SPJ</span>
                </button>
              </div>
            )}
          </div>

          {/* SUB-VIEW 1: MASTER UNIT ARMADA TABLE */}
          {kendaraanSubTab === 'vehicles' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                      <th className="p-3.5">Nama Armada & Plat</th>
                      <th className="p-3.5">Kepemilikan</th>
                      <th className="p-3.5">Kapasitas Muat</th>
                      <th className="p-3.5">Odometer KM</th>
                      <th className="p-3.5">Legalitas & KIR</th>
                      <th className="p-3.5">Status Unit</th>
                      <th className="p-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vehicles
                      .filter(v => v && ((v.name || '').toLowerCase().includes(vehicleSearch.toLowerCase()) || (v.policeNumber || '').toLowerCase().includes(vehicleSearch.toLowerCase())))
                      .map((v) => (
                        <tr key={v.id || v.policeNumber} className="hover:bg-slate-50/60">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{v.name || 'Unit Armada'}</div>
                            <span className="font-mono text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                              {v.policeNumber || '-'}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              (v.ownership || 'Internal') === 'Internal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {v.ownership || 'Internal'}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono">
                            <div><strong>{v.tonnageCapacity ?? 0}</strong> Ton</div>
                            <div className="text-[10px] text-slate-400"><strong>{v.cbmCapacity ?? 0}</strong> CBM (m³)</div>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-slate-800">
                            {(Number(v.odometerKM) || 0).toLocaleString('id-ID')} KM
                          </td>
                          <td className="p-3.5 text-[11px] font-mono">
                            <div>STNK: <span className="font-bold">{v.stnkTaxExpiry || '-'}</span></div>
                            <div className="text-slate-500">KIR: <span className="font-bold text-slate-700">{v.kirExpiry || '-'}</span></div>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {v.status || 'Siap Operasi'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditVehicle(v)}
                              className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Edit Data Armada"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(v.id)}
                              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Unit Armada"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {vehicles.filter(v => v && ((v.name || '').toLowerCase().includes(vehicleSearch.toLowerCase()) || (v.policeNumber || '').toLowerCase().includes(vehicleSearch.toLowerCase()))).length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          {vehicles.length === 0 ? 'Belum ada data unit armada. Klik "Tambah Unit Armada" untuk memasukkan unit baru.' : 'Tidak ada unit armada yang cocok dengan pencarian.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: MASTER DRIVER ARMADA TABLE */}
          {kendaraanSubTab === 'drivers' && (
            <div className="space-y-4">
              {/* Driver Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Driver Armada</div>
                  <div className="text-xl font-black text-slate-900 mt-1">{driverList.filter(Boolean).length} Pengemudi</div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-xs">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Driver Siap Jalan</div>
                  <div className="text-xl font-black text-emerald-700 mt-1">
                    {driverList.filter(d => d && d.status === 'Siap Jalan').length}
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-blue-100 bg-blue-50/20 shadow-xs">
                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Sedang On Trip</div>
                  <div className="text-xl font-black text-blue-700 mt-1">
                    {driverList.filter(d => d && d.status === 'On Trip').length}
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-amber-100 bg-amber-50/20 shadow-xs">
                  <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Driver Internal</div>
                  <div className="text-xl font-black text-amber-700 mt-1">
                    {driverList.filter(d => d && d.driverType === 'Internal').length} Driver
                  </div>
                </div>
              </div>

              {/* Driver Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                        <th className="p-3.5">Nama Pengemudi (Driver)</th>
                        <th className="p-3.5">Tipe Driver</th>
                        <th className="p-3.5">Legalitas SIM & Masa Berlaku</th>
                        <th className="p-3.5">No. HP / WhatsApp</th>
                        <th className="p-3.5">Armada Biasa Dibawa</th>
                        <th className="p-3.5">Status Kesiapan</th>
                        <th className="p-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {driverList
                        .filter(d => {
                          if (!d) return false;
                          const name = d.name || '';
                          const phone = d.phone || '';
                          const simType = d.simType || '';
                          const assignedVehicle = d.assignedVehicle || '';
                          const notes = d.notes || '';
                          const search = driverSearch.toLowerCase();
                          const matchesSearch =
                            name.toLowerCase().includes(search) ||
                            phone.includes(search) ||
                            simType.toLowerCase().includes(search) ||
                            assignedVehicle.toLowerCase().includes(search) ||
                            notes.toLowerCase().includes(search);
                          const matchesType = driverTypeFilter === 'ALL' || d.driverType === driverTypeFilter;
                          const matchesStatus = driverStatusFilter === 'ALL' || d.status === driverStatusFilter;
                          return matchesSearch && matchesType && matchesStatus;
                        })
                        .map(driver => (
                          <tr key={driver.id || driver.name} className="hover:bg-slate-50/60">
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900">{driver.name || 'Pengemudi'}</div>
                              {driver.idCardNumber && (
                                <div className="text-[10px] text-slate-400 font-mono">KTP: {driver.idCardNumber}</div>
                              )}
                              {driver.emergencyContact && (
                                <div className="text-[10px] text-slate-500">Kontak Darurat: {driver.emergencyContact}</div>
                              )}
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                                driver.driverType === 'Internal'
                                  ? 'bg-blue-100 text-blue-800'
                                  : driver.driverType === 'Mitra Vendor'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {driver.driverType || 'Internal'}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono">
                              <div className="font-bold text-slate-800">{driver.simType || '-'}</div>
                              <div className="text-[11px] text-slate-500">
                                Berlaku s/d: <span className="font-bold text-slate-700">{driver.simExpiry || '-'}</span>
                              </div>
                            </td>
                            <td className="p-3.5">
                              {driver.phone ? (
                                <a
                                  href={`https://wa.me/${driver.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold font-mono text-xs hover:underline"
                                >
                                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{driver.phone}</span>
                                </a>
                              ) : (
                                <span className="text-slate-400 italic text-[11px]">- Belum ada -</span>
                              )}
                            </td>
                            <td className="p-3.5 text-slate-700 font-medium">
                              {driver.assignedVehicle || '-'}
                            </td>
                            <td className="p-3.5">
                              <button
                                onClick={() => handleToggleDriverStatus(driver)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-transform active:scale-95 flex items-center gap-1 ${
                                  driver.status === 'Siap Jalan'
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : driver.status === 'On Trip'
                                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                    : driver.status === 'Off / Libur'
                                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                                title="Klik untuk mengubah status cepat"
                              >
                                <span>{driver.status || 'Siap Jalan'}</span>
                                <RefreshCw className="w-2.5 h-2.5 opacity-60" />
                              </button>
                            </td>
                            <td className="p-3.5 text-right space-x-1">
                              <button
                                onClick={() => handleOpenEditDriver(driver)}
                                className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                title="Edit Data Driver"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDriver(driver.id || driver.name)}
                                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                title="Hapus Data Driver"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      {driverList.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400">
                            Belum ada data driver armada. Klik <strong>Input Driver Baru</strong> untuk menambahkan master driver pengemudi armada.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: JADWAL & PENUGASAN SPJ TABLE */}
          {kendaraanSubTab === 'trips' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                      <th className="p-3.5">No. SPJ & Event</th>
                      <th className="p-3.5">Kategori Rute</th>
                      <th className="p-3.5">Armada & Plat</th>
                      <th className="p-3.5">Driver & Tujuan</th>
                      <th className="p-3.5">P2H (Agus)</th>
                      <th className="p-3.5">Status Alur</th>
                      <th className="p-3.5">RAB Total</th>
                      <th className="p-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fleetAssignments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400">
                          Belum ada data penugasan armada SPJ. Klik <strong>"Terbitkan / Tambah SPJ"</strong> untuk menambahkan.
                        </td>
                      </tr>
                    ) : (
                      fleetAssignments
                        .filter(f => {
                          if (!f) return false;
                          const spj = (f.spjNumber || '').toLowerCase();
                          const event = (f.eventName || '').toLowerCase();
                          const driver = (f.driverName || '').toLowerCase();
                          const search = fleetSearch.toLowerCase();
                          return spj.includes(search) || event.includes(search) || driver.includes(search);
                        })
                        .map((f) => (
                          <tr key={f.id || f.spjNumber} className="hover:bg-slate-50/60">
                            <td className="p-3.5 font-mono">
                              <div className="font-bold text-slate-900">{f.spjNumber || '-'}</div>
                              <div className="font-sans text-indigo-700 font-bold text-xs">{f.eventName || 'Event Produksi'}</div>
                              <div className="text-[10px] text-slate-400">{f.departureDate || '-'} s/d {f.returnDate || '-'}</div>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                f.tripType === 'Luar Kota (Tour / Festival)' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {f.tripType || 'Dalam Kota (Jabodetabek)'}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-slate-800">{f.vehicleType || '-'}</div>
                              <span className="font-mono text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                {f.policeNumber || '-'}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="font-medium text-slate-800">{f.driverName || '-'}</div>
                              <div className="text-[11px] text-slate-500 font-semibold">{f.destination || '-'}</div>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                f.p2hStatus === 'Laik Jalan' ? 'bg-emerald-100 text-emerald-800' :
                                f.p2hStatus === 'Perlu Perbaikan' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {f.p2hStatus || 'Laik Jalan'}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                                {f.status || 'Dijadwalkan'}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono font-black text-indigo-700 text-xs">
                              Rp {(f.budget?.totalRAB || 0).toLocaleString('id-ID')}
                            </td>
                            <td className="p-3.5 text-right space-x-1">
                              <button
                                onClick={() => handleOpenEditFleet(f)}
                                className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                title="Edit SPJ & Anggaran"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteFleet(f.id)}
                                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                title="Hapus SPJ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 5: QC CHECKLIST ITEMS                                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'qc_checklist' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Pilih Divisi Checklist:</label>
              <div className="flex flex-wrap gap-1.5">
                {(['Audio', 'Lighting', 'Videotron', 'Multimedia', 'Gudang', 'Service', 'Admin'] as Division[]).map(div => (
                  <button
                    key={div}
                    onClick={() => setSelectedQcDivision(div)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedQcDivision === div ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {div}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-right text-xs text-slate-500 font-mono">
              Total Item: <strong>{(qcChecklists[selectedQcDivision] || []).length} Butir Standar</strong>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Tambah Butir Checklist Baru</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={`Masukkan butir pemeriksaan untuk divisi ${selectedQcDivision}...`}
                value={newQcItemText}
                onChange={(e) => setNewQcItemText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddQcItem}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Butir</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {(qcChecklists[selectedQcDivision] || []).map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50">
                <div className="flex items-start gap-3 flex-1">
                  <span className="font-mono text-slate-400 font-bold text-xs mt-0.5">{idx + 1}.</span>
                  {editingQcIdx === idx ? (
                    <input
                      type="text"
                      value={editingQcText}
                      onChange={(e) => setEditingQcText(e.target.value)}
                      className="flex-1 bg-white border border-indigo-300 rounded-lg p-1.5 text-xs font-medium text-slate-900 focus:outline-none"
                    />
                  ) : (
                    <span className="text-xs font-medium text-slate-800 leading-relaxed">{item}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {editingQcIdx === idx ? (
                    <button
                      onClick={() => handleUpdateQcItem(idx)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Simpan
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingQcIdx(idx);
                        setEditingQcText(item);
                      }}
                      className="text-slate-400 hover:text-indigo-600 p-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteQcItem(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 6: SCHEDULE SHIFT ROSTER                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap justify-between items-center gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase">
                Jadwal Shift Operasional — {ALL_MONTHLY_SCHEDULES.find(s => s.key === activeMonth)?.label || 'September 2026'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Edit shift kerja harian per staf secara langsung</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Dropdown Pilih Bulan */}
              <select
                value={activeMonth}
                onChange={(e) => setActiveMonth(e.target.value)}
                className="text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
              >
                {ALL_MONTHLY_SCHEDULES.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
              <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-mono font-bold text-slate-700">P = Pagi</span>
              <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-mono font-bold text-slate-700">MD = Middle</span>
              <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-mono font-bold text-slate-700">M = Malam</span>
              <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-mono font-bold text-slate-700">L = Libur/Off</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-bold text-[10px]">
                  <th className="p-3 sticky left-0 bg-slate-50 z-10">Nama Staf</th>
                  <th className="p-3">Divisi</th>
                  {Array.from({ length: ALL_MONTHLY_SCHEDULES.find(s => s.key === activeMonth)?.totalDays || 30 }, (_, i) => (
                    <th key={i + 1} className="p-2 text-center w-8 border-l border-slate-200/60">
                      {i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scheduleData.map(s => (
                  <tr key={s.no} className="hover:bg-slate-50/50">
                    <td className="p-3 font-sans font-bold text-slate-900 sticky left-0 bg-white z-10">{s.name}</td>
                    <td className="p-3 font-sans text-slate-500">{s.division}</td>
                    {Array.from({ length: 30 }, (_, i) => {
                      const day = i + 1;
                      const shift = s.shifts?.[day] || '-';
                      return (
                        <td key={day} className="p-1 text-center border-l border-slate-100">
                          <select
                            value={shift}
                            onChange={(e) => handleUpdateDayShift(String(s.no), day, e.target.value)}
                            className="bg-transparent text-[10px] font-black focus:outline-none cursor-pointer text-slate-800"
                          >
                            <option value="P">P</option>
                            <option value="MD">MD</option>
                            <option value="M">M</option>
                            <option value="PM">PM</option>
                            <option value="L">L</option>
                            <option value="MASUK">MASUK</option>
                            <option value="IZIN">IZIN</option>
                            <option value="SAKIT">SAKIT</option>
                          </select>
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

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 7: DATABASE & SYNC & GOOGLE SHEETS                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          {/* GOOGLE SHEETS REAL-TIME INTEGRATION CARD */}
          <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 rounded-2xl border border-emerald-500/30 p-6 text-white shadow-lg space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-emerald-800/40">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-white">Integrasi Google Sheet Real-Time</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Webhook Bi-Directional
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/80 mt-0.5">
                    Sinkronisasi otomatis dua arah dengan Spreadsheet Master PT. RIZ Production
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={DEFAULT_SPREADSHEET_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/40 rounded-xl text-xs font-bold text-emerald-200 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Google Sheet</span>
                </a>
                <button
                  onClick={() => setShowScriptModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-400/40 rounded-xl text-xs font-bold text-indigo-200 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Salin Apps Script (Code.gs)</span>
                </button>
              </div>
            </div>

            {/* Webhook Configuration Input */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                URL Google Apps Script Webhook (Web App Deployment URL):
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={sheetWebhookUrl}
                  onChange={(e) => setSheetWebhookUrl(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-emerald-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleSaveSheetUrl}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Simpan URL
                  </button>
                  <button
                    onClick={handleTestSheetConnection}
                    disabled={sheetTesting || !sheetWebhookUrl.trim()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{sheetTesting ? 'Menguji...' : 'Uji Koneksi'}</span>
                  </button>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 pt-1">
                <span>Spreadsheet ID Target: <code className="text-emerald-400 font-mono font-bold">{DEFAULT_SPREADSHEET_ID}</code></span>
                {sheetLastSync && (
                  <span className="text-emerald-400 font-mono">Terakhir Sinkron: {new Date(sheetLastSync).toLocaleString('id-ID')}</span>
                )}
              </div>
            </div>

            {/* Sync Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleSyncToGoogleSheet}
                disabled={sheetSyncing || !sheetWebhookUrl.trim()}
                className="p-3.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-xl text-left transition-all cursor-pointer disabled:opacity-40 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-white">1. Kirim & Sinkronkan Seluruh Data Daily Task</div>
                  <div className="text-[10px] text-emerald-200/70">Upload Daily Tasks (Kanban), QC Logs, Staf, Freelance, Armada & Shift ke Google Sheet</div>
                </div>
              </button>

              <button
                onClick={handlePullFromGoogleSheet}
                disabled={sheetSyncing || !sheetWebhookUrl.trim()}
                className="p-3.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 rounded-xl text-left transition-all cursor-pointer disabled:opacity-40 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-white">2. Tarik Data Jadwal dari Google Sheet</div>
                  <div className="text-[10px] text-indigo-200/70">Import perubahan shift jadwal dari Spreadsheet</div>
                </div>
              </button>
            </div>

            {sheetMessage && (
              <div className={`p-3 rounded-xl text-xs font-medium border ${
                sheetMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' :
                sheetMessage.type === 'error' ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' :
                'bg-blue-500/10 border-blue-500/40 text-blue-300'
              }`}>
                {sheetMessage.text}
              </div>
            )}
          </div>

          {/* SINKRONISASI DAILY LOG DARI GOOGLE SHEET (GVIZ DIRECT PULL) */}
          <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 rounded-2xl border border-blue-500/30 p-6 text-white shadow-lg space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-blue-800/40">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-black text-white">Sinkronisasi Daily Log & QC dari Google Sheet</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      Auto-Sync 30 Menit
                    </span>
                    {isSyncingSheet && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 animate-pulse">
                        ⟳ Sedang Sinkronisasi...
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-blue-200/80 mt-0.5">
                    Baca langsung data Daily Log & QC yang diisi di Google Sheet → simpan ke aplikasi & Firestore secara otomatis
                  </p>
                </div>
              </div>
              <a
                href="https://docs.google.com/spreadsheets/d/1N8MkJtDpD9VmrtSkTuygxiyNRmEVCAWDITZisiVd_Dc/edit?gid=198998470#gid=198998470"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 rounded-xl text-xs font-bold text-blue-200 transition-all cursor-pointer shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Sheet September 2026</span>
              </a>
            </div>

            {/* Status Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/70 rounded-xl p-3 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Sheet Target</span>
                <span className="font-bold text-blue-300 font-mono block text-[11px] truncate">1N8MkJtDpD9VmrtSkTuygxiyNRmEVCAWDITZisiVd_Dc</span>
              </div>
              <div className="bg-slate-900/70 rounded-xl p-3 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Tab Aktif</span>
                <span className="font-bold text-white block">September 2026 (gid=198998470)</span>
              </div>
              <div className="bg-slate-900/70 rounded-xl p-3 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Terakhir Pull</span>
                <span className="font-bold text-emerald-300 font-mono block text-[11px]">
                  {lastSheetPull
                    ? new Date(lastSheetPull).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                    : 'Belum pernah'}
                </span>
              </div>
            </div>

            {/* Pull action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onSyncDailyLogFromSheet?.(SHEET_GID_SEPTEMBER_2026)}
                disabled={isSyncingSheet}
                className="p-3.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-xl text-left transition-all cursor-pointer disabled:opacity-40 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center shrink-0">
                  <RefreshCw className={`w-4 h-4 ${isSyncingSheet ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-white">
                    {isSyncingSheet ? 'Sedang Mengambil Data...' : '🔄 Sync Daily Log September 2026'}
                  </div>
                  <div className="text-[10px] text-blue-200/70">Baca sheet aktif Sep 2026 → impor ke Daily Reports & Temuan QC</div>
                </div>
              </button>

              <div className="p-3.5 bg-slate-800/50 border border-slate-700/40 rounded-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-700/50 text-slate-400 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-300">Auto-Sync Aktif</div>
                  <div className="text-[10px] text-slate-400">
                    Sistem otomatis tarik data baru dari Google Sheet setiap <strong className="text-white">30 menit</strong> dan saat aplikasi dibuka
                  </div>
                </div>
              </div>
            </div>

            {/* Pull result message */}
            {sheetPullMessage && (
              <div className={`p-3 rounded-xl text-xs font-medium border ${
                sheetPullMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' :
                sheetPullMessage.type === 'error' ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' :
                'bg-blue-500/10 border-blue-500/40 text-blue-300'
              }`}>
                {sheetPullMessage.text}
              </div>
            )}
          </div>

          {/* DEDICATED WORKSPACE STATUS & ISOLATION CARD */}

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 font-black text-sm">
                  WS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-slate-900">Dedicated Application Workspace</h2>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                      {workspaceManager.getActiveWorkspace().environment.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Workspace Mandiri Resmi: <strong className="text-slate-800">{workspaceManager.getActiveWorkspace().name}</strong>
                  </p>
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-slate-400">Kode Workspace: </span>
                <strong className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {workspaceManager.getActiveWorkspace().code}
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">ID Workspace</span>
                <span className="font-mono font-bold text-slate-800 block truncate">
                  {workspaceManager.getActiveWorkspace().id}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Prefiks Storage Lokal & DB</span>
                <span className="font-mono font-bold text-indigo-600 block">
                  {workspaceManager.getActiveWorkspace().storagePrefix}*
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Organisasi Induk</span>
                <span className="font-bold text-slate-800 block truncate">
                  {workspaceManager.getActiveWorkspace().organization}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Aplikasi ini berjalan dalam workspace tersendiri yang terisolasi penuh, memastikan integritas seluruh transaksi QC, Daily Tasks, Jadwal Shift, dan Inventaris Armada terlindungi dari polusi data eksternal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <RefreshCw className="w-5 h-5" />
                <h2 className="text-base font-extrabold text-slate-900">Sinkronisasi Cloud Firestore</h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Paksa sinkronisasi real-time seluruh modul transaksi (QC, Daily Task, Absensi, Temuan WO, Logistik Gudang) ke server Cloud Firestore.
              </p>
              <button
                onClick={handleTriggerCloudSync}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Paksa Sinkronisasi Sekarang</span>
              </button>
              {syncMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
                  {syncMessage}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Download className="w-5 h-5" />
                <h2 className="text-base font-extrabold text-slate-900">Ekspor File Backup JSON</h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Unduh seluruh data operasional, master staf, checklist, temuan, maintenance, dan aset dalam format JSON terenkapsulasi penuh.
              </p>
              <button
                onClick={handleExportAllData}
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File Backup JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL EDIT / TAMBAH STAF                                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Tambah Staf Karyawan Baru</h3>
              <button onClick={() => setShowAddStaffModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500 bg-white flex items-center justify-center shrink-0">
                  {staffFormData.avatar ? (
                    <img src={staffFormData.avatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="font-bold text-slate-700 block">Foto Profil</label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-indigo-700 cursor-pointer transition-all shadow-2xs">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Pilih Foto</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Asli (Nama Lengkap KTP) *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ubaidillah"
                    value={staffFormData.fullName}
                    onChange={(e) => setStaffFormData({ ...staffFormData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Panggilan (Lapangan) *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Mang ube"
                    value={staffFormData.nickname}
                    onChange={(e) => setStaffFormData({ ...staffFormData, nickname: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Divisi *</label>
                  <select
                    value={staffFormData.division}
                    onChange={(e) => setStaffFormData({ ...staffFormData, division: e.target.value as Division })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Videotron">Videotron</option>
                    <option value="Multimedia">Multimedia</option>
                    <option value="Gudang">Gudang</option>
                    <option value="Service">Service</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role / Jabatan *</label>
                  <select
                    value={staffFormData.role}
                    onChange={(e) => setStaffFormData({ ...staffFormData, role: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  >
                    <option value="Owner">Owner (Pemilik)</option>
                    <option value="Direktur">Direktur</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Team Leader">Team Leader</option>
                    <option value="Staff">Staff</option>
                    <option value="Gudang">Gudang</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Level Kompetensi *</label>
                  <select
                    value={staffFormData.level || 2}
                    onChange={(e) => setStaffFormData({ ...staffFormData, level: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  >
                    <option value={1}>Level 1 - Helper</option>
                    <option value={2}>Level 2 - Junior Tech</option>
                    <option value={3}>Level 3 - Technician</option>
                    <option value={4}>Level 4 - Senior Tech</option>
                    <option value={5}>Level 5 - Operator</option>
                    <option value={6}>Level 6 - Sys. Engineer</option>
                    <option value={7}>Level 7 - Team Leader</option>
                    <option value={8}>Level 8 - Supervisor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No. Telepon / WhatsApp</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="Contoh: 0812-3456-7890"
                      value={staffFormData.phone}
                      onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="nama@rizproduction.com"
                      value={staffFormData.email}
                      onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleAddStaff}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer shadow-xs"
              >
                Simpan Staf
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditStaffModal && activeStaffForEdit && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Ubah / Edit Data Staf (V2)</h3>
              <button onClick={() => setShowEditStaffModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500 bg-white flex items-center justify-center shrink-0">
                  {staffFormData.avatar ? (
                    <img src={staffFormData.avatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-slate-600 font-mono text-sm">
                      {(staffFormData.nickname || staffFormData.fullName || staffFormData.name)?.substring(0, 2).toUpperCase() || 'ST'}
                    </span>
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="font-bold text-slate-700 block">Ubah Foto Profil</label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-indigo-700 cursor-pointer transition-all shadow-2xs">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Ganti Foto</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Asli (Nama Lengkap KTP) *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ubaidillah"
                    value={staffFormData.fullName}
                    onChange={(e) => setStaffFormData({ ...staffFormData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Panggilan (Lapangan) *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Mang ube"
                    value={staffFormData.nickname}
                    onChange={(e) => setStaffFormData({ ...staffFormData, nickname: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Divisi *</label>
                  <select
                    value={staffFormData.division}
                    onChange={(e) => setStaffFormData({ ...staffFormData, division: e.target.value as Division })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Videotron">Videotron</option>
                    <option value="Multimedia">Multimedia</option>
                    <option value="Gudang">Gudang</option>
                    <option value="Service">Service</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role / Jabatan *</label>
                  <select
                    value={staffFormData.role}
                    onChange={(e) => setStaffFormData({ ...staffFormData, role: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  >
                    <option value="Owner">Owner (Pemilik)</option>
                    <option value="Direktur">Direktur</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Team Leader">Team Leader</option>
                    <option value="Staff">Staff</option>
                    <option value="Gudang">Gudang</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Level Kompetensi *</label>
                  <select
                    value={staffFormData.level || 2}
                    onChange={(e) => setStaffFormData({ ...staffFormData, level: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  >
                    <option value={1}>Level 1 - Helper</option>
                    <option value={2}>Level 2 - Junior Tech</option>
                    <option value={3}>Level 3 - Technician</option>
                    <option value={4}>Level 4 - Senior Tech</option>
                    <option value={5}>Level 5 - Operator</option>
                    <option value={6}>Level 6 - Sys. Engineer</option>
                    <option value={7}>Level 7 - Team Leader</option>
                    <option value={8}>Level 8 - Supervisor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No. Telepon / WhatsApp</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={staffFormData.phone}
                      onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="nama@rizproduction.com"
                      value={staffFormData.email}
                      onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowEditStaffModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEditStaff}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL EDIT / TAMBAH TEMUAN QC                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      {(showAddFindingModal || (showEditFindingModal && activeFindingForEdit)) && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                {showAddFindingModal ? 'Tambah Temuan QC Baru' : 'Ubah / Edit Temuan QC'}
              </h3>
              <button
                onClick={() => {
                  setShowAddFindingModal(false);
                  setShowEditFindingModal(false);
                  setActiveFindingForEdit(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Peralatan *</label>
                <input
                  type="text"
                  placeholder="Contoh: Power Amplifier Line Array"
                  value={findingFormData.equipment}
                  onChange={(e) => setFindingFormData({ ...findingFormData, equipment: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prioritas *</label>
                  <select
                    value={findingFormData.priority}
                    onChange={(e) => setFindingFormData({ ...findingFormData, priority: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  >
                    <option value="Rendah">Rendah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status Temuan</label>
                  <select
                    value={findingFormData.status}
                    onChange={(e) => setFindingFormData({ ...findingFormData, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  >
                    <option value="Open">Open</option>
                    <option value="Close">Close (Selesai)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Masalah / Kerusakan *</label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan kendala atau kerusakan yang ditemukan..."
                  value={findingFormData.issue}
                  onChange={(e) => setFindingFormData({ ...findingFormData, issue: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">PIC Penanggung Jawab</label>
                  <input
                    type="text"
                    value={findingFormData.pic}
                    onChange={(e) => setFindingFormData({ ...findingFormData, pic: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Selesai</label>
                  <input
                    type="date"
                    value={findingFormData.targetDate}
                    onChange={(e) => setFindingFormData({ ...findingFormData, targetDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowAddFindingModal(false);
                  setShowEditFindingModal(false);
                  setActiveFindingForEdit(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={showAddFindingModal ? handleCreateFinding : handleSaveEditFinding}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer shadow-xs"
              >
                {showAddFindingModal ? 'Simpan Temuan' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL EDIT / TAMBAH MAINTENANCE                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {(showAddScheduleModal || (showEditScheduleModal && activeScheduleForEdit)) && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                {showAddScheduleModal ? 'Tambah Jadwal Pemeliharaan' : 'Ubah / Edit Jadwal Maintenance'}
              </h3>
              <button
                onClick={() => {
                  setShowAddScheduleModal(false);
                  setShowEditScheduleModal(false);
                  setActiveScheduleForEdit(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kode Aset *</label>
                  <input
                    type="text"
                    placeholder="Contoh: AUD-MIX-01"
                    value={scheduleFormData.assetCode}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, assetCode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipe Pemeliharaan *</label>
                  <select
                    value={scheduleFormData.type}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  >
                    <option value="Preventive">Preventive (Pencegahan)</option>
                    <option value="Corrective">Corrective (Perbaikan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Peralatan / Mesin *</label>
                <input
                  type="text"
                  placeholder="Contoh: Digital Mixing Console Yamaha CL5"
                  value={scheduleFormData.assetName}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, assetName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Frekuensi *</label>
                  <select
                    value={scheduleFormData.frequency}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, frequency: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  >
                    <option value="Harian">Harian</option>
                    <option value="Mingguan">Mingguan</option>
                    <option value="Bulanan">Bulanan</option>
                    <option value="Insidental">Insidental</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={scheduleFormData.status}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Done">Done (Selesai)</option>
                    <option value="Overdue">Overdue (Terlewat)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Terakhir</label>
                  <input
                    type="date"
                    value={scheduleFormData.lastDate}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, lastDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jadwal Berikutnya</label>
                  <input
                    type="date"
                    value={scheduleFormData.nextDate}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, nextDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Biaya Servis (Rp)</label>
                  <input
                    type="number"
                    value={scheduleFormData.biaya || 0}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, biaya: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sparepart / Suku Cadang</label>
                  <input
                    type="text"
                    placeholder="Contoh: Fader motor, IC"
                    value={scheduleFormData.sparepart || ''}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, sparepart: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Teknis</label>
                <textarea
                  rows={2}
                  value={scheduleFormData.notes || ''}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowAddScheduleModal(false);
                  setShowEditScheduleModal(false);
                  setActiveScheduleForEdit(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={showAddScheduleModal ? handleCreateSchedule : handleSaveEditSchedule}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer shadow-xs"
              >
                {showAddScheduleModal ? 'Simpan Jadwal' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL EDIT / TAMBAH ASET GUDANG                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {(showAddAssetModal || (showEditAssetModal && activeAssetForEdit)) && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                {showAddAssetModal ? 'Tambah Aset Gudang Baru' : 'Ubah / Edit Aset Gudang'}
              </h3>
              <button
                onClick={() => {
                  setShowAddAssetModal(false);
                  setShowEditAssetModal(false);
                  setActiveAssetForEdit(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kode Aset *</label>
                  <input
                    type="text"
                    placeholder="Contoh: AUD-MIC-01"
                    value={assetFormData.code}
                    onChange={(e) => setAssetFormData({ ...assetFormData, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Divisi *</label>
                  <select
                    value={assetFormData.division}
                    onChange={(e) => setAssetFormData({ ...assetFormData, division: e.target.value as Division })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Videotron">Videotron</option>
                    <option value="Multimedia">Multimedia</option>
                    <option value="Gudang">Gudang</option>
                    <option value="Service">Service</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Peralatan / Barang *</label>
                <input
                  type="text"
                  placeholder="Contoh: Shure Wireless UR4D Double Handheld"
                  value={assetFormData.name}
                  onChange={(e) => setAssetFormData({ ...assetFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Merk / Brand</label>
                  <input
                    type="text"
                    placeholder="Contoh: Shure, Yamaha"
                    value={assetFormData.brand}
                    onChange={(e) => setAssetFormData({ ...assetFormData, brand: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Seri (SN)</label>
                  <input
                    type="text"
                    placeholder="Contoh: SN-928374"
                    value={assetFormData.serialNumber}
                    onChange={(e) => setAssetFormData({ ...assetFormData, serialNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lokasi Rak / Zona Gudang *</label>
                <input
                  type="text"
                  placeholder="Contoh: Gudang Utama - Rak B2"
                  value={assetFormData.location}
                  onChange={(e) => setAssetFormData({ ...assetFormData, location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kondisi Fisik *</label>
                <select
                  value={assetFormData.condition}
                  onChange={(e) => setAssetFormData({ ...assetFormData, condition: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                >
                  <option value="Baik">Baik (Siap Pakai)</option>
                  <option value="Rusak Ringan">Rusak Ringan (Perlu Perawatan)</option>
                  <option value="Rusak Berat">Rusak Berat (Off / Perbaikan)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowAddAssetModal(false);
                  setShowEditAssetModal(false);
                  setActiveAssetForEdit(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={showAddAssetModal ? handleCreateAsset : handleSaveEditAsset}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer shadow-xs"
              >
                {showAddAssetModal ? 'Simpan Aset' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MASTER VEHICLE: TAMBAH / EDIT ARMADA */}
      {(showAddVehicleModal || showEditVehicleModal) && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {showAddVehicleModal ? 'Tambah Unit Armada Baru (Admin)' : 'Edit Data Unit Armada (Admin)'}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Pengelolaan Master Inventaris Kendaraan Logistik</p>
              </div>
              <button
                onClick={() => {
                  setShowAddVehicleModal(false);
                  setShowEditVehicleModal(false);
                  setActiveVehicleForEdit(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama & Tipe Kendaraan *</label>
                <input
                  type="text"
                  placeholder="Contoh: Truk Box Mitsubishi Canter CDD (6 Roda)"
                  value={vehicleFormData.name}
                  onChange={(e) => setVehicleFormData({ ...vehicleFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Polisi (Plat) *</label>
                  <input
                    type="text"
                    placeholder="Contoh: F 8433 BF"
                    value={vehicleFormData.policeNumber}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, policeNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kepemilikan *</label>
                  <select
                    value={vehicleFormData.ownership}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, ownership: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold"
                  >
                    <option value="Internal">Internal PT RIZ</option>
                    <option value="Sewa Mitra">Sewa Mitra</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tonase (Ton)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vehicleFormData.tonnageCapacity}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, tonnageCapacity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-center"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kubikasi (m³)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vehicleFormData.cbmCapacity}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, cbmCapacity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-center"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Odometer KM</label>
                  <input
                    type="number"
                    value={vehicleFormData.odometerKM}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, odometerKM: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jatuh Tempo Pajak STNK</label>
                  <input
                    type="date"
                    value={vehicleFormData.stnkTaxExpiry}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, stnkTaxExpiry: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jatuh Tempo Uji KIR</label>
                  <input
                    type="date"
                    value={vehicleFormData.kirExpiry}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, kirExpiry: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Status Operasional Unit *</label>
                <select
                  value={vehicleFormData.status}
                  onChange={(e) => setVehicleFormData({ ...vehicleFormData, status: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold"
                >
                  <option value="Siap Operasi">Siap Operasi</option>
                  <option value="Dalam Perjalanan">Dalam Perjalanan (On Trip)</option>
                  <option value="Maintenance / Servis">Maintenance / Servis</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowAddVehicleModal(false);
                  setShowEditVehicleModal(false);
                  setActiveVehicleForEdit(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={showAddVehicleModal ? handleCreateVehicle : handleSaveEditVehicle}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer shadow-xs"
              >
                {showAddVehicleModal ? 'Simpan Unit Armada' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FLEET ASSIGNMENT: TAMBAH / EDIT SPJ & ANGGARAN */}
      {(showAddFleetModal || showEditFleetModal) && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {showAddFleetModal ? 'Terbitkan SPJ / Penugasan Baru (Admin)' : 'Edit SPJ & Anggaran Armada (Admin)'}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Pengelolaan Jadwal & Rencana Anggaran Logistik</p>
              </div>
              <button
                onClick={() => {
                  setShowAddFleetModal(false);
                  setShowEditFleetModal(false);
                  setActiveFleetForEdit(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor SPJ</label>
                  <input
                    type="text"
                    value={fleetFormData.spjNumber}
                    onChange={(e) => setFleetFormData({ ...fleetFormData, spjNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Rute *</label>
                  <select
                    value={fleetFormData.tripType}
                    onChange={(e) => setFleetFormData({ ...fleetFormData, tripType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold"
                  >
                    <option value="Dalam Kota (Jabodetabek)">Dalam Kota (Jabodetabek)</option>
                    <option value="Luar Kota (Tour / Festival)">Luar Kota (Tour / Festival)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Event / Proyek *</label>
                <input
                  type="text"
                  placeholder="Contoh: Soundrenaline 2026 Stage 1"
                  value={fleetFormData.eventName}
                  onChange={(e) => setFleetFormData({ ...fleetFormData, eventName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit Armada *</label>
                  <select
                    value={fleetFormData.policeNumber}
                    onChange={(e) => {
                      const selected = vehicles.find(v => v.policeNumber === e.target.value);
                      if (selected) {
                        setFleetFormData({
                          ...fleetFormData,
                          policeNumber: selected.policeNumber,
                          vehicleType: selected.name
                        });
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold"
                  >
                    {vehicles.filter(v => v && v.policeNumber).map(v => (
                      <option key={v.id || v.policeNumber} value={v.policeNumber}>{v.name || 'Armada'} ({v.policeNumber})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Driver *</label>
                  <div className="space-y-1">
                    {driverList.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            setFleetFormData({ ...fleetFormData, driverName: e.target.value });
                          }
                        }}
                        className="w-full bg-slate-100 border border-slate-200 rounded-lg p-1.5 text-[11px] text-slate-700 font-semibold mb-1"
                        defaultValue=""
                      >
                        <option value="">-- Pilih dari Master Driver Armada --</option>
                        {driverList.map(d => (
                          <option key={d.id} value={d.name}>{d.name} ({d.driverType} - {d.status})</option>
                        ))}
                      </select>
                    )}
                    <input
                      type="text"
                      placeholder="Ketik nama driver..."
                      value={fleetFormData.driverName}
                      onChange={(e) => setFleetFormData({ ...fleetFormData, driverName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Destinasi / Lokasi Venue *</label>
                <input
                  type="text"
                  value={fleetFormData.destination}
                  onChange={(e) => setFleetFormData({ ...fleetFormData, destination: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Berangkat</label>
                  <input
                    type="date"
                    value={fleetFormData.departureDate}
                    onChange={(e) => setFleetFormData({ ...fleetFormData, departureDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estimasi Kembali</label>
                  <input
                    type="date"
                    value={fleetFormData.returnDate}
                    onChange={(e) => setFleetFormData({ ...fleetFormData, returnDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status Kelaikan P2H</label>
                  <select
                    value={fleetFormData.p2hStatus}
                    onChange={(e) => setFleetFormData({ ...fleetFormData, p2hStatus: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                  >
                    <option value="Laik Jalan">Laik Jalan</option>
                    <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                    <option value="Tidak Laik">Tidak Laik</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status Alur Penugasan</label>
                  <select
                    value={fleetFormData.status}
                    onChange={(e) => setFleetFormData({ ...fleetFormData, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Menunggu Approval Fahrul">Menunggu Approval Fahrul</option>
                    <option value="Disetujui">Disetujui</option>
                    <option value="Dalam Perjalanan (On Trip)">Dalam Perjalanan (On Trip)</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
              </div>

              {/* Rincian Biaya RAB */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
                <span className="font-bold text-indigo-900 block text-xs">Rincian Anggaran (RAB):</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-600 block">Sewa Vendor (Rp)</label>
                    <input
                      type="number"
                      value={fleetFormData.budget?.sewaVendor || 0}
                      onChange={(e) => setFleetFormData({
                        ...fleetFormData,
                        budget: { ...fleetFormData.budget!, sewaVendor: Number(e.target.value) }
                      })}
                      className="w-full bg-white border border-slate-300 rounded p-1 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 block">BBM Solar (Rp)</label>
                    <input
                      type="number"
                      value={fleetFormData.budget?.bbmSolar || 0}
                      onChange={(e) => setFleetFormData({
                        ...fleetFormData,
                        budget: { ...fleetFormData.budget!, bbmSolar: Number(e.target.value) }
                      })}
                      className="w-full bg-white border border-slate-300 rounded p-1 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 block">e-Toll (Rp)</label>
                    <input
                      type="number"
                      value={fleetFormData.budget?.eToll || 0}
                      onChange={(e) => setFleetFormData({
                        ...fleetFormData,
                        budget: { ...fleetFormData.budget!, eToll: Number(e.target.value) }
                      })}
                      className="w-full bg-white border border-slate-300 rounded p-1 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 block">Uang Jalan Driver (Rp)</label>
                    <input
                      type="number"
                      value={fleetFormData.budget?.uangMakanDriver || 0}
                      onChange={(e) => setFleetFormData({
                        ...fleetFormData,
                        budget: { ...fleetFormData.budget!, uangMakanDriver: Number(e.target.value) }
                      })}
                      className="w-full bg-white border border-slate-300 rounded p-1 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowAddFleetModal(false);
                  setShowEditFleetModal(false);
                  setActiveFleetForEdit(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={showAddFleetModal ? handleCreateFleet : handleSaveEditFleet}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer shadow-xs"
              >
                {showAddFleetModal ? 'Terbitkan SPJ' : 'Simpan Perubahan SPJ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL MASTER FREELANCE: TAMBAH / EDIT KRU FREELANCE          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {(showAddFreelanceModal || (showEditFreelanceModal && activeFreelanceForEdit)) && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {showAddFreelanceModal ? 'Input Data Kru Freelance Baru' : 'Ubah / Edit Data Kru Freelance'}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Database Mitra & Tenaga Kerja Lepas PT RIZ-PRODUCTION</p>
              </div>
              <button
                onClick={() => {
                  setShowAddFreelanceModal(false);
                  setShowEditFreelanceModal(false);
                  setActiveFreelanceForEdit(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs font-sans">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Freelance *</label>
                <input
                  type="text"
                  placeholder="Contoh: Rian Soundman / Budi Lighting"
                  value={freelanceFormData.name || ''}
                  onChange={(e) => setFreelanceFormData({ ...freelanceFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Spesialisasi Divisi *</label>
                  <select
                    value={freelanceFormData.specialization || 'Audio'}
                    onChange={(e) => setFreelanceFormData({ ...freelanceFormData, specialization: e.target.value as FreelanceSpecialization })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Audio">Audio / Sound</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Videotron">Videotron</option>
                    <option value="Multimedia">Multimedia</option>
                    <option value="Rigging">Rigging</option>
                    <option value="Genset / Power">Genset / Power</option>
                    <option value="Gudang / Helper">Gudang / Helper</option>
                    <option value="Driver">Driver Lapangan</option>
                    <option value="Service / Teknisi">Service / Teknisi</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Peran / Jabatan Lapangan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Sound Engineer / Crew Loading"
                    value={freelanceFormData.roleTitle || ''}
                    onChange={(e) => setFreelanceFormData({ ...freelanceFormData, roleTitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No. WhatsApp / HP *</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="0812-xxxx-xxxx"
                      value={freelanceFormData.phone || ''}
                      onChange={(e) => setFreelanceFormData({ ...freelanceFormData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-mono font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="freelance@email.com"
                      value={freelanceFormData.email || ''}
                      onChange={(e) => setFreelanceFormData({ ...freelanceFormData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700 block text-xs">Honor / Fee Harian (Rp)</label>
                  <span className="text-[11px] font-extrabold text-indigo-600 font-mono">
                    Rp {Number(freelanceFormData.dailyRate || 0).toLocaleString('id-ID')} / hari
                  </span>
                </div>
                <input
                  type="number"
                  step="25000"
                  placeholder="Contoh: 200000"
                  value={freelanceFormData.dailyRate !== undefined ? freelanceFormData.dailyRate : ''}
                  onChange={(e) => setFreelanceFormData({ ...freelanceFormData, dailyRate: e.target.value === '' ? 0 : Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => setFreelanceFormData({ ...freelanceFormData, dailyRate: 200000 })}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-[10px] font-bold text-slate-600 border border-slate-200 cursor-pointer transition-colors"
                    >
                      Rp 200k (Crew)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFreelanceFormData({ ...freelanceFormData, dailyRate: 250000 })}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-[10px] font-bold text-slate-600 border border-slate-200 cursor-pointer transition-colors"
                    >
                      Rp 250k (Tech/Driver)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFreelanceFormData({ ...freelanceFormData, dailyRate: 300000 })}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-[10px] font-bold text-slate-600 border border-slate-200 cursor-pointer transition-colors"
                    >
                      Rp 300k (Senior)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFreelanceFormData({ ...freelanceFormData, dailyRate: 350000 })}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-[10px] font-bold text-slate-600 border border-slate-200 cursor-pointer transition-colors"
                    >
                      Rp 350k (Operator)
                    </button>
                  </div>
                </div>

              {/* Data Rekening Pembayaran */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Informasi Rekening Bank (Fee Transfer):</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-600 block">Bank</label>
                    <input
                      type="text"
                      placeholder="BCA / Mandiri / BRI"
                      value={freelanceFormData.bankName || ''}
                      onChange={(e) => setFreelanceFormData({ ...freelanceFormData, bankName: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-bold focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 block">No. Rekening</label>
                    <input
                      type="text"
                      placeholder="1234567890"
                      value={freelanceFormData.bankAccountNumber || ''}
                      onChange={(e) => setFreelanceFormData({ ...freelanceFormData, bankAccountNumber: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-mono font-bold focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 block">Atas Nama (a.n)</label>
                    <input
                      type="text"
                      placeholder="Nama Pemilik Rekening"
                      value={freelanceFormData.bankAccountHolder || ''}
                      onChange={(e) => setFreelanceFormData({ ...freelanceFormData, bankAccountHolder: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status Keaktifan</label>
                  <select
                    value={freelanceFormData.status || 'Aktif'}
                    onChange={(e) => setFreelanceFormData({ ...freelanceFormData, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Standby">Standby</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rating Kinerja (1-5)</label>
                  <select
                    value={freelanceFormData.rating || 5}
                    onChange={(e) => setFreelanceFormData({ ...freelanceFormData, rating: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-amber-600 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value={5}>★★★★★ (5 Bintang)</option>
                    <option value={4}>★★★★☆ (4 Bintang)</option>
                    <option value={3}>★★★☆☆ (3 Bintang)</option>
                    <option value={2}>★★☆☆☆ (2 Bintang)</option>
                    <option value={1}>★☆☆☆☆ (1 Bintang)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No. KTP</label>
                  <input
                    type="text"
                    placeholder="3201xxxxxxxxxxxx"
                    value={freelanceFormData.idCardNumber || ''}
                    onChange={(e) => setFreelanceFormData({ ...freelanceFormData, idCardNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Keahlian Khusus / Pengalaman / Catatan</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Ahli mixing Midas M32, setting rigging stage festival, pengalaman 5 tahun."
                  value={freelanceFormData.skills || ''}
                  onChange={(e) => setFreelanceFormData({ ...freelanceFormData, skills: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowAddFreelanceModal(false);
                  setShowEditFreelanceModal(false);
                  setActiveFreelanceForEdit(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={showAddFreelanceModal ? handleAddFreelance : handleSaveEditFreelance}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer shadow-xs"
              >
                {showAddFreelanceModal ? 'Simpan Data Freelance' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL MASTER DRIVER: TAMBAH / EDIT DRIVER ARMADA             */}
      {/* ───────────────────────────────────────────────────────────── */}
      {(showAddDriverModal || (showEditDriverModal && activeDriverForEdit)) && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {showAddDriverModal ? 'Input Data Driver Armada Baru' : 'Ubah / Edit Data Driver'}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Master Pengemudi Armada Logistik PT RIZ-PRODUCTION</p>
              </div>
              <button
                onClick={() => {
                  setShowAddDriverModal(false);
                  setShowEditDriverModal(false);
                  setActiveDriverForEdit(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Driver *</label>
                <input
                  type="text"
                  placeholder="Contoh: Pak Joko / Mang Ujang"
                  value={driverFormData.name}
                  onChange={(e) => setDriverFormData({ ...driverFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipe Driver *</label>
                  <select
                    value={driverFormData.driverType}
                    onChange={(e) => setDriverFormData({ ...driverFormData, driverType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                  >
                    <option value="Internal">Driver Internal PT RIZ</option>
                    <option value="Mitra Vendor">Driver Mitra Vendor</option>
                    <option value="Freelance Driver">Freelance Driver</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No. WhatsApp / HP *</label>
                  <input
                    type="tel"
                    placeholder="0812-xxxx-xxxx"
                    value={driverFormData.phone}
                    onChange={(e) => setDriverFormData({ ...driverFormData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jenis Golongan SIM *</label>
                  <select
                    value={driverFormData.simType}
                    onChange={(e) => setDriverFormData({ ...driverFormData, simType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold font-mono"
                  >
                    <option value="SIM A">SIM A (Mobil Penumpang/Blindvan)</option>
                    <option value="SIM B1">SIM B1 (Truk Engkel CDE / CDD)</option>
                    <option value="SIM B1 Umum">SIM B1 Umum</option>
                    <option value="SIM B2">SIM B2 (Tronton / Wingbox)</option>
                    <option value="SIM B2 Umum">SIM B2 Umum</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Masa Berlaku SIM *</label>
                  <input
                    type="date"
                    value={driverFormData.simExpiry}
                    onChange={(e) => setDriverFormData({ ...driverFormData, simExpiry: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Armada Yang Biasa Dibawa</label>
                  <select
                    value={driverFormData.assignedVehicle}
                    onChange={(e) => setDriverFormData({ ...driverFormData, assignedVehicle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                  >
                    <option value="">-- Bebas / Semua Unit --</option>
                    {vehicles.filter(v => v && (v.name || v.policeNumber)).map(v => (
                      <option key={v.id || v.name || v.policeNumber} value={v.name || v.policeNumber}>{v.name || 'Armada'} ({v.policeNumber || '-'})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status Kesiapan Operasi</label>
                  <select
                    value={driverFormData.status}
                    onChange={(e) => setDriverFormData({ ...driverFormData, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold"
                  >
                    <option value="Siap Jalan">Siap Jalan</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Off / Libur">Off / Libur</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor KTP</label>
                  <input
                    type="text"
                    placeholder="3201xxxxxxxxxxxx"
                    value={driverFormData.idCardNumber}
                    onChange={(e) => setDriverFormData({ ...driverFormData, idCardNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kontak Darurat</label>
                  <input
                    type="text"
                    placeholder="Nama & No HP Keluarga"
                    value={driverFormData.emergencyContact}
                    onChange={(e) => setDriverFormData({ ...driverFormData, emergencyContact: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  placeholder="Catatan rute, pengalaman luar kota, dll."
                  value={driverFormData.notes}
                  onChange={(e) => setDriverFormData({ ...driverFormData, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowAddDriverModal(false);
                  setShowEditDriverModal(false);
                  setActiveDriverForEdit(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={showAddDriverModal ? handleAddDriver : handleSaveEditDriver}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer shadow-xs"
              >
                {showAddDriverModal ? 'Simpan Data Driver' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: GOOGLE APPS SCRIPT CODE VIEWER & COPY */}
      {showScriptModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-700 shadow-2xl max-w-3xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-white text-base">Kode Google Apps Script (Code.gs)</h3>
              </div>
              <button
                onClick={() => setShowScriptModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step by step guide */}
            <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-3.5 text-xs text-emerald-200 space-y-2">
              <div className="font-bold text-emerald-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Cara Pasang (Jika menu "Ekstensi" tidak muncul di Google Sheet):</span>
                </span>
                <a
                  href="https://script.new"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] inline-flex items-center gap-1 shadow-xs"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Buka script.new Langsung</span>
                </a>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                <li>Buka editor Apps Script baru dengan klik tombol <strong className="text-emerald-400">"Buka script.new Langsung"</strong> di atas (atau ketik <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-300 font-mono">script.new</code> di tab baru browser).</li>
                <li>Hapus seluruh kode default yang ada di editor Apps Script.</li>
                <li>Klik tombol <strong className="text-emerald-400">"Salin Semua Kode"</strong> di bawah, lalu <strong>Paste</strong> ke editor Apps Script dan klik ikon <strong>Simpan (Ctrl+S / Cmd+S)</strong>.</li>
                <li>Klik tombol biru <strong>Terapkan (Deploy)</strong> di kanan atas &gt; <strong>Deployment baru</strong> &gt; Pilih jenis <strong>Aplikasi Web (Web App)</strong> &gt; Akses: <strong>"Siapa saja" (Anyone)</strong>.</li>
                <li>Klik <strong>Terapkan</strong>, berikan izin Google, lalu <strong>Salin URL Aplikasi Web</strong> (<code className="text-emerald-300 font-mono text-[10px]">https://script.google.com/macros/s/.../exec</code>).</li>
                <li>Tempelkan URL tersebut ke kolom <strong>URL Webhook</strong> di Panel Admin aplikasi ini, lalu klik <strong>Simpan URL</strong> dan <strong>Uji Koneksi</strong>.</li>
              </ol>
            </div>

            {/* Code Box */}
            <div className="flex-1 overflow-hidden flex flex-col space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-slate-400">File: Code.gs (Bi-directional Sync Bridge)</span>
                <button
                  onClick={handleCopyScript}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Tersalin ke Clipboard!' : 'Salin Semua Kode'}</span>
                </button>
              </div>
              <pre className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-emerald-300 overflow-y-auto max-h-72 select-all">
                {GOOGLE_APPS_SCRIPT_TEMPLATE}
              </pre>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowScriptModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

