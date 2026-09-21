/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Finding, Division, Staff, WorkOrder, Asset } from '../types';
import { STAFF_LIST, getMasterStaffList } from '../data';
import { AlertTriangle, Plus, Search, Trash2, CheckCircle, Clock, Check, X, ShieldAlert, Wrench, ArrowRight, Activity, Filter, Sparkles, CheckSquare } from 'lucide-react';
import { subscribeCloudCollection } from '../lib/cloudSync';

interface FindingsProps {
  findings: Finding[];
  workOrders?: WorkOrder[];
  assets?: Asset[];
  onAddFinding: (finding: Omit<Finding, 'id' | 'dateCreated'>) => void;
  onUpdateFindingStatus: (id: string, status: 'Open' | 'Close', approvedBy?: string, approvedAt?: string) => void;
  onDeleteFinding: (id: string) => void;
  onAddWorkOrder?: (wo: Omit<WorkOrder, 'id' | 'dateCreated'>) => void;
  onUpdateWorkOrderStatus?: (id: string, status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled', approvedBy?: string, approvedAt?: string) => void;
  onUpdateWorkOrderProgress?: (id: string, progress: number) => void;
  onDeleteWorkOrder?: (id: string) => void;
  onAddReport?: (report: any) => void;
  onUpdateAssetCondition?: (id: string, condition: 'Baik' | 'Rusak Ringan' | 'Rusak Berat') => void;
  currentUser: any;
  onLogActivity: (username: string, role: string, action: string) => void;
  initialSubTab?: 'findings' | 'work_orders';
}

export default function Findings({
  findings,
  workOrders = [],
  assets = [],
  onAddFinding,
  onUpdateFindingStatus,
  onDeleteFinding,
  onAddWorkOrder,
  onUpdateWorkOrderStatus,
  onUpdateWorkOrderProgress,
  onDeleteWorkOrder,
  onAddReport,
  onUpdateAssetCondition,
  currentUser,
  onLogActivity,
  initialSubTab = 'findings',
}: FindingsProps) {
  // Dynamic Master Staff List
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

  // View Tab: Findings vs Work Orders
  const [activeSubTab, setActiveSubTab] = useState<'findings' | 'work_orders'>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Detail Modal State for Accessing Finished Log Data
  const [selectedWODetail, setSelectedWODetail] = useState<WorkOrder | null>(null);
  const [selectedFindingDetail, setSelectedFindingDetail] = useState<Finding | null>(null);

  // Management access check (Owner, Direktur, Admin, Supervisor, Manager)
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

  // Filter/Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterDivision, setFilterDivision] = useState<string>('All');

  // Form state for Findings
  const [showAddForm, setShowAddForm] = useState(false);
  const [equipment, setEquipment] = useState('');
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState<'Tinggi' | 'Sedang' | 'Rendah'>('Sedang');
  const [pic, setPic] = useState('');
  const [findingDivision, setFindingDivision] = useState<Division>('Audio');
  const [targetDate, setTargetDate] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  // Form state for Work Order
  const [showAddWOForm, setShowAddWOForm] = useState(false);
  const [woTitle, setWoTitle] = useState('');
  const [woDescription, setWoDescription] = useState('');
  const [woPic, setWoPic] = useState('');
  const [woDivision, setWoDivision] = useState<Division>('Service');
  const [woDeadline, setWoDeadline] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const handleSubmitFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipment.trim() || !issue.trim() || !pic) return;

    onAddFinding({
      equipment,
      issue,
      priority,
      pic,
      division: findingDivision,
      targetDate,
      status: 'Open',
    });

    onLogActivity(currentUser.name, currentUser.role, `Menambahkan temuan QC untuk ${equipment} (Divisi: ${findingDivision}, PIC: ${pic})`);

    // Reset Form
    setEquipment('');
    setIssue('');
    setPriority('Sedang');
    setPic('');
    setFindingDivision('Audio');
    setShowAddForm(false);
  };

  const handleSubmitWO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!woTitle.trim() || !woPic || !onAddWorkOrder) return;

    onAddWorkOrder({
      title: woTitle,
      description: woDescription,
      pic: woPic,
      division: woDivision,
      deadline: woDeadline,
      progress: 0,
      status: 'Pending',
    });

    onLogActivity(currentUser.name, currentUser.role, `Menerbitkan Work Order baru: "${woTitle}" untuk PIC ${woPic}`);

    // Reset Form
    setWoTitle('');
    setWoDescription('');
    setWoPic('');
    setWoDivision('Service');
    setShowAddWOForm(false);
  };

  // Convert Finding directly to Work Order for Service Division
  const handleConvertToWorkOrder = (finding: Finding) => {
    if (!onAddWorkOrder) return;

    // Cek jika WO untuk temuan ini sudah ada sebelumnya
    const existingWO = workOrders.find(w => {
      const desc = String(w?.description || (w as any)?.notes || '');
      const fid = String(finding?.id || '');
      const eq = String(finding?.equipment || '').toLowerCase();
      const title = String(w?.title || '').toLowerCase();
      return (fid && desc.includes(fid)) || (eq && title.includes(eq));
    });

    if (existingWO) {
      setActiveSubTab('work_orders');
      alert(`Work Order untuk unit "${finding.equipment}" sudah aktif terdaftar (Status: ${existingWO.status}, Progress: ${existingWO.progress}%). Anda langsung diarahkan ke tiket WO tersebut.`);
      return;
    }

    // Cari staf service default atau PIC finding
    const serviceStaff = staffList.find(s => s.division === 'Service') || staffList.find(s => s.name === finding.pic) || staffList[0];
    const defaultPic = serviceStaff ? serviceStaff.name : finding.pic;

    onAddWorkOrder({
      findingId: finding.id,
      equipment: finding.equipment,
      priority: finding.priority,
      title: `Perbaikan: ${finding.equipment}`,
      description: `[Temuan QC ID: ${finding.id}] ${finding.issue} (Prioritas: ${finding.priority})`,
      pic: defaultPic,
      division: 'Service',
      deadline: finding.targetDate,
      progress: 10,
      status: 'In Progress',
    });

    onLogActivity(currentUser.name, currentUser.role, `Menerbitkan Work Order Perbaikan dari Temuan QC: ${finding.equipment}`);
    setActiveSubTab('work_orders');
    alert(`Work Order untuk unit "${finding.equipment}" berhasil diterbitkan dan dialokasikan ke Divisi Service (${defaultPic})!`);
  };

  const handleToggleStatus = (id: string, currentStatus: 'Open' | 'Close') => {
    const nextStatus = currentStatus === 'Open' ? 'Close' : 'Open';
    const today = new Date().toISOString().split('T')[0];
    if (nextStatus === 'Close' && isManagement) {
      onUpdateFindingStatus(id, nextStatus, currentUser.name, today);
    } else {
      onUpdateFindingStatus(id, nextStatus);
    }
    // P1.3: saat finding di-Close, update kondisi aset terkait ke 'Baik'
    if (nextStatus === 'Close' && onUpdateAssetCondition && assets && assets.length > 0) {
      const finding = findings.find(f => f?.id === id);
      if (finding && finding.equipment) {
        const equipName = String(finding.equipment).replace(/\s*\(.*\)$/, '').trim().toLowerCase();
        const matched = assets.find(a => {
          const aname = String(a?.name || '').toLowerCase();
          return (aname && equipName && (aname.includes(equipName) || equipName.includes(aname)));
        });
        if (matched) {
          onUpdateAssetCondition(matched.id, 'Baik');
        }
      }
    }
    onLogActivity(currentUser.name, currentUser.role, `Mengubah status temuan QC id:${id} menjadi ${nextStatus}`);
  };

  // Handler Approval Admin untuk Temuan QC agar terselesaikan (Status: Close)
  const handleAdminApproveFinding = (finding: Finding) => {
    const today = new Date().toISOString().split('T')[0];
    onUpdateFindingStatus(finding.id, 'Close', currentUser.name, today);
    if (onUpdateAssetCondition && assets && assets.length > 0 && finding.equipment) {
      const equipName = String(finding.equipment).replace(/\s*\(.*\)$/, '').trim().toLowerCase();
      const matched = assets.find(a => {
        const aname = String(a?.name || '').toLowerCase();
        return (aname && equipName && (aname.includes(equipName) || equipName.includes(aname)));
      });
      if (matched) {
        onUpdateAssetCondition(matched.id, 'Baik');
      }
    }
    onLogActivity(
      currentUser.name,
      currentUser.role,
      `[ADMIN APPROVAL] Menyetujui & menyelesaikan temuan QC: "${finding.equipment}" (Status: Close)`
    );
    alert(`Temuan QC untuk unit "${finding.equipment}" berhasil DISETUJUI (APPROVED) dan terselesaikan (Close) oleh Admin!`);
  };

  const handleCompleteWorkOrder = (wo: WorkOrder) => {
    if (!onUpdateWorkOrderStatus) return;
    onUpdateWorkOrderStatus(wo.id, 'Completed');
    
    // Auto-close finding jika WO berasal dari temuan QC (via findingId langsung atau via parsing catatan)
    const fid = wo.findingId || (String(wo?.description || (wo as any)?.notes || '').match(/\[Temuan QC ID: ([^\]]+)\]/)?.[1]);
    if (fid) {
      const relatedFinding = findings.find(f => f?.id === fid);
      if (relatedFinding && relatedFinding.status === 'Open') {
        onUpdateFindingStatus(fid, 'Close');
        if (onUpdateAssetCondition && assets && assets.length > 0 && relatedFinding.equipment) {
          const equipName = String(relatedFinding.equipment).replace(/\s*\(.*\)$/, '').trim().toLowerCase();
          const matched = assets.find(a => {
            const aname = String(a?.name || '').toLowerCase();
            return (aname && equipName && (aname.includes(equipName) || equipName.includes(aname)));
          });
          if (matched) {
            onUpdateAssetCondition(matched.id, 'Baik');
          }
        }
      }
    }

    // Auto-create Daily Report log entry for the technician who completed the WO
    if (onAddReport) {
      onAddReport({
        date: new Date().toISOString().split('T')[0],
        staffName: wo.pic,
        division: wo.division,
        activity: `[Penyelesaian Work Order] ${wo.title}`,
        notes: `Work Order berhasil diselesaikan 100%. Rincian instruksi: ${wo.description}. Unit siap dioperasikan kembali.`,
        status: 'Submitted'
      });
    }

    onLogActivity(currentUser.name, currentUser.role, `Menyelesaikan Work Order: "${wo.title}" (Status: Completed, Progress: 100%)`);
    alert(`Work Order "${wo.title}" selesai 100% dan log kerja resmi otomatis terekam di Daily Report ${wo.pic}!`);
  };

  // Handler Approval Admin untuk Work Order agar terselesaikan (Status: Completed, 100%)
  const handleAdminApproveWorkOrder = (wo: WorkOrder) => {
    if (!onUpdateWorkOrderStatus) return;
    const today = new Date().toISOString().split('T')[0];
    onUpdateWorkOrderStatus(wo.id, 'Completed', currentUser.name, today);

    // Auto-close finding jika WO berasal dari temuan QC
    const fid = wo.findingId || (String(wo?.description || (wo as any)?.notes || '').match(/\[Temuan QC ID: ([^\]]+)\]/)?.[1]);
    if (fid) {
      const relatedFinding = findings.find(f => f?.id === fid);
      if (relatedFinding && relatedFinding.status === 'Open') {
        onUpdateFindingStatus(fid, 'Close', currentUser.name, today);
        if (onUpdateAssetCondition && assets && assets.length > 0 && relatedFinding.equipment) {
          const equipName = String(relatedFinding.equipment).replace(/\s*\(.*\)$/, '').trim().toLowerCase();
          const matched = assets.find(a => {
            const aname = String(a?.name || '').toLowerCase();
            return (aname && equipName && (aname.includes(equipName) || equipName.includes(aname)));
          });
          if (matched) {
            onUpdateAssetCondition(matched.id, 'Baik');
          }
        }
      }
    }

    // Auto-create Daily Report log entry for the technician who completed the WO
    if (onAddReport) {
      onAddReport({
        date: today,
        staffName: wo.pic,
        division: wo.division,
        activity: `[Admin Approved WO] ${wo.title}`,
        notes: `Work Order telah disetujui (Approved) & diselesaikan oleh Admin (${currentUser.name}). Unit siap operasional 100%.`,
        status: 'Submitted'
      });
    }

    onLogActivity(
      currentUser.name,
      currentUser.role,
      `[ADMIN APPROVAL] Menyetujui & menyelesaikan Work Order: "${wo.title}" (Status: Completed 100%)`
    );
    alert(`Work Order "${wo.title}" berhasil DISETUJUI (APPROVED) dan terselesaikan (Completed 100%) oleh Admin!`);
  };

  // Filter Findings list
  const filteredFindings = findings.filter(f => {
    const equip = String(f?.equipment || '').toLowerCase();
    const iss = String(f?.issue || '').toLowerCase();
    const p = String(f?.pic || '').toLowerCase();
    const q = searchTerm.toLowerCase();

    // Resolusi divisi temuan baik dari f.division maupun dari profil staffList
    const findingDiv = f?.division || staffList.find(s => s.name.toLowerCase() === p.toLowerCase() || (s.nickname && p.toLowerCase().includes(s.nickname.toLowerCase())))?.division;

    const matchesSearch = equip.includes(q) || iss.includes(q) || p.includes(q) || (findingDiv && findingDiv.toLowerCase().includes(q));
    const matchesPriority = filterPriority === 'All' || f?.priority === filterPriority;
    const matchesStatus = filterStatus === 'All' || f?.status === filterStatus;
    const matchesDivision = filterDivision === 'All' || findingDiv === filterDivision;
    return matchesSearch && matchesPriority && matchesStatus && matchesDivision;
  }).sort((a, b) => {
    const priorityWeight: Record<string, number> = { 'Tinggi': 3, 'Sedang': 2, 'Rendah': 1 };
    const pA = priorityWeight[a.priority] || 0;
    const pB = priorityWeight[b.priority] || 0;
    if (pB !== pA) return pB - pA;
    return b.id.localeCompare(a.id, undefined, { numeric: true });
  });

  // Filter Work Orders list
  const filteredWorkOrders = workOrders.filter(w => {
    const t = String(w?.title || '').toLowerCase();
    const d = String(w?.description || (w as any)?.notes || '').toLowerCase();
    const p = String(w?.pic || '').toLowerCase();
    const q = searchTerm.toLowerCase();

    const matchesSearch = t.includes(q) || d.includes(q) || p.includes(q);
    const matchesDivision = filterDivision === 'All' || w?.division === filterDivision;
    const matchesStatus = filterStatus === 'All' || w?.status === filterStatus;
    return matchesSearch && matchesDivision && matchesStatus;
  }).sort((a, b) => {
    const priorityWeight: Record<string, number> = { 'Tinggi': 3, 'Sedang': 2, 'Rendah': 1 };
    const pA = priorityWeight[a.priority || ''] || 0;
    const pB = priorityWeight[b.priority || ''] || 0;
    if (pB !== pA) return pB - pA;
    return b.id.localeCompare(a.id, undefined, { numeric: true });
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-md border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🛠️</span>
            <h1 className="text-2xl font-black tracking-tight">TEMUAN QC & WORK ORDER (WO)</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              Lintas Divisi Terhubung
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Pusat penanganan hasil inspeksi QC, temuan kerusakan unit harian, dan tiket perintah kerja (Work Order) antar-divisi Audio, Lighting, Videotron, Multimedia, Gudang, & Service.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeSubTab === 'findings' ? (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'Tutup Form' : '+ Laporkan Temuan Baru'}</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddWOForm(!showAddWOForm)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddWOForm ? 'Tutup Form' : '+ Terbitkan WO Baru'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('findings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'findings' ? 'bg-white text-indigo-700 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
            <span>Temuan QC & Kerusakan ({filteredFindings.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('work_orders')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'work_orders' ? 'bg-white text-blue-700 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4 text-blue-600" />
            <span>Work Orders / Perbaikan Service ({filteredWorkOrders.length})</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={activeSubTab === 'findings' ? "Cari alat, masalah, PIC..." : "Cari tiket WO, PIC, divisi..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none w-48 md:w-56"
            />
          </div>

          {activeSubTab === 'findings' && (
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="All">Semua Prioritas</option>
              <option value="Tinggi">🔴 Prioritas Tinggi</option>
              <option value="Sedang">🟡 Prioritas Sedang</option>
              <option value="Rendah">🟢 Prioritas Rendah</option>
            </select>
          )}

          <select
            value={filterDivision}
            onChange={(e) => setFilterDivision(e.target.value)}
            className={`px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:outline-none cursor-pointer font-medium ${
              activeSubTab === 'findings' ? 'focus:ring-indigo-500' : 'focus:ring-blue-500'
            }`}
          >
            <option value="All">🌐 Semua Divisi (7 Divisi)</option>
            <option value="Audio">🔊 Divisi Audio</option>
            <option value="Lighting">💡 Divisi Lighting</option>
            <option value="Videotron">📺 Divisi Videotron</option>
            <option value="Multimedia">🎥 Divisi Multimedia</option>
            <option value="Gudang">📦 Divisi Gudang</option>
            <option value="Admin">💼 Divisi Admin</option>
            <option value="Service">🔧 Divisi Service</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
          >
            <option value="All">Semua Status</option>
            {activeSubTab === 'findings' ? (
              <>
                <option value="Open">Open (Belum Selesai)</option>
                <option value="Close">Close (Selesai)</option>
              </>
            ) : (
              <>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. SUB-TAB: TEMUAN QC & KERUSAKAN                          */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeSubTab === 'findings' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Total Temuan QC</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{filteredFindings.length}</div>
            </div>
            <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200 shadow-sm">
              <div className="text-xs text-rose-700 font-semibold">Open (Perlu Penanganan)</div>
              <div className="text-2xl font-black text-rose-700 mt-1">
                {filteredFindings.filter(f => f.status === 'Open').length}
              </div>
            </div>
            <div className="bg-red-50/70 p-4 rounded-xl border border-red-200 shadow-sm">
              <div className="text-xs text-red-700 font-semibold">Prioritas Tinggi</div>
              <div className="text-2xl font-black text-red-700 mt-1">
                {filteredFindings.filter(f => f.priority === 'Tinggi' && f.status === 'Open').length}
              </div>
            </div>
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 shadow-sm">
              <div className="text-xs text-emerald-700 font-semibold">Selesai (Close)</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {filteredFindings.filter(f => f.status === 'Close').length}
              </div>
            </div>
          </div>



          {/* Form Add Finding */}
          {showAddForm && (

            <form onSubmit={handleSubmitFinding} className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-md space-y-4 max-w-xl">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <ShieldAlert className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800">Form Laporan Kerusakan Unit Baru</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Nama Alat / Unit Bermasalah
                  </label>
                  <input
                    type="text"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    placeholder="e.g. Mixer Yamaha CL5 #1 atau Moving Head BSW #4"
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Deskripsi Kerusakan / Kendala
                  </label>
                  <textarea
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="Sebutkan detail kendala, e.g. Layar berkedip-kedip setelah pemakaian 2 jam"
                    rows={2}
                    className="block w-full p-3 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Prioritas Penanganan
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Rendah">🟢 Rendah (Low)</option>
                    <option value="Sedang">🟡 Sedang (Medium)</option>
                    <option value="Tinggi">🔴 Tinggi (High / Urgent)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    PIC Penanggung Jawab
                  </label>
                  <select
                    value={pic}
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      setPic(selectedName);
                      const matchedStaff = staffList.find(s => s.name === selectedName);
                      if (matchedStaff) {
                        setFindingDivision(matchedStaff.division);
                      }
                    }}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  >
                    <option value="">-- Pilih PIC Staff --</option>
                    {staffList.map(s => (
                      <option key={s.id} value={s.name}>
                        {s.name} {s.nickname && s.nickname.toLowerCase() !== s.name.toLowerCase() ? `(${s.nickname})` : ''} - {s.division}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Divisi Terkait
                  </label>
                  <select
                    value={findingDivision}
                    onChange={(e) => setFindingDivision(e.target.value as Division)}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  >
                    <option value="Audio">🔊 Audio</option>
                    <option value="Lighting">💡 Lighting</option>
                    <option value="Videotron">📺 Videotron</option>
                    <option value="Multimedia">🎥 Multimedia</option>
                    <option value="Gudang">📦 Gudang</option>
                    <option value="Admin">💼 Admin</option>
                    <option value="Service">🔧 Service</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Target Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
                >
                  Simpan & Daftarkan Temuan
                </button>
              </div>
            </form>
          )}

          {/* List of Findings */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredFindings.map((finding) => {
              const isHigh = finding.priority === 'Tinggi';
              const isOpen = finding.status === 'Open';
              
              // Cek apakah temuan sudah dibuatkan Work Order
              const linkedWO = workOrders.find(w => {
                if (!w) return false;
                const fid = String(finding?.id || '');
                if (w.findingId && fid && w.findingId === fid) return true;
                const desc = String(w?.description || (w as any)?.notes || '');
                const title = String(w?.title || '').toLowerCase();
                const eq = String(finding?.equipment || '').toLowerCase();
                return (fid && desc.includes(fid)) || (eq && (title.includes(eq) || eq.includes(title)));
              });
              const hasLinkedWO = !!linkedWO;

              return (
                <div
                  key={finding.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all ${
                    isHigh && isOpen
                      ? 'border-red-200 bg-red-50/10 hover:border-red-300 ring-1 ring-red-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Badge Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            finding.priority === 'Tinggi' ? 'bg-red-100 text-red-800' :
                            finding.priority === 'Sedang' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          Prioritas {finding.priority}
                        </span>

                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {finding.division || staffList.find(s => s.name.toLowerCase() === (finding.pic || '').toLowerCase() || (s.nickname && (finding.pic || '').toLowerCase().includes(s.nickname.toLowerCase())))?.division || 'Semua Divisi'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {hasLinkedWO && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            ⚡ WO Aktif
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                            finding.status === 'Open' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {finding.status}
                        </span>
                      </div>
                    </div>

                    {/* Equipment & Problem */}
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{finding.equipment}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100 font-sans">
                        {finding.issue}
                      </p>
                    </div>
                  </div>

                  {/* PIC, Target Date and Actions */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 font-mono">
                      <div>
                        <span className="block text-[10px] text-slate-400">PIC Lapor</span>
                        <span className="font-semibold text-slate-800">{finding.pic}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400">Target Selesai</span>
                        <span className="font-semibold text-slate-800">{finding.targetDate}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      {/* Convert to Work Order Button for Open Findings */}
                      {isOpen && onAddWorkOrder && (
                        hasLinkedWO ? (
                          <button
                            onClick={() => {
                              setActiveSubTab('work_orders');
                            }}
                            className="w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer"
                          >
                            <Wrench className="w-3.5 h-3.5 text-blue-600" />
                            <span>⚡ Lihat Work Order Aktif ({linkedWO?.status || 'In Progress'})</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleConvertToWorkOrder(finding)}
                            className="w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer"
                          >
                            <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                            <span>⚡ Terbitkan Work Order (WO) Service</span>
                          </button>
                        )
                      )}

                      <div className="flex items-center gap-2">
                        {/* Status Approved by Admin bila sudah Close */}
                        {!isOpen && finding.approvedBy && (
                          <div className="flex-1 py-1.5 px-3 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg text-xs font-bold text-center">
                            🛡️ Approved by {finding.approvedBy} ({finding.approvedAt || 'Selesai'})
                          </div>
                        )}

                        {/* Tombol Approval Khusus Admin jika status masih Open */}
                        {isOpen && isManagement && (
                          <button
                            onClick={() => handleAdminApproveFinding(finding)}
                            className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer"
                            title="Admin Approve Temuan QC agar langsung terselesaikan (Close)"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                            <span>Approve Temuan (Admin)</span>
                          </button>
                        )}

                        {/* Toggle Status Button (Regular / Staf) */}
                        <button
                          onClick={() => handleToggleStatus(finding.id, finding.status)}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border cursor-pointer ${
                            finding.status === 'Open'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                          }`}
                        >
                          {finding.status === 'Open' ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Selesaikan (Close)</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              <span>Re-open Temuan</span>
                            </>
                          )}
                        </button>

                        {/* Delete Button */}
                        {isManagement && (
                          <button
                            onClick={() => {
                              if (confirm('Yakin ingin menghapus temuan ini dari history?')) {
                                onDeleteFinding(finding.id);
                              }
                            }}
                            className="p-1.5 border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Hapus Temuan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredFindings.length === 0 && (
              <div className="col-span-full bg-slate-50/50 py-16 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-700 mb-1">Peralatan dalam Kondisi Prima</h3>
                <p className="text-slate-500 text-xs max-w-sm">
                  Tidak ada temuan kerusakan yang terdeteksi atau cocok dengan kriteria pencarian Anda saat ini.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. SUB-TAB: WORK ORDERS / PERBAIKAN SERVICE                */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeSubTab === 'work_orders' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Total Work Orders</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{filteredWorkOrders.length}</div>
            </div>
            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 shadow-sm">
              <div className="text-xs text-amber-700 font-semibold">Pending / Menunggu</div>
              <div className="text-2xl font-black text-amber-700 mt-1">
                {filteredWorkOrders.filter(w => w.status === 'Pending').length}
              </div>
            </div>
            <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 shadow-sm">
              <div className="text-xs text-blue-700 font-semibold">Sedang Dikerjakan (Progress)</div>
              <div className="text-2xl font-black text-blue-700 mt-1">
                {filteredWorkOrders.filter(w => w.status === 'In Progress').length}
              </div>
            </div>
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 shadow-sm">
              <div className="text-xs text-emerald-700 font-semibold">Selesai (Completed)</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {filteredWorkOrders.filter(w => w.status === 'Completed').length}
              </div>
            </div>
          </div>

          {/* Form Add Work Order */}
          {showAddWOForm && (
            <form onSubmit={handleSubmitWO} className="bg-white p-6 rounded-2xl border border-blue-100 shadow-md space-y-4 max-w-xl">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Wrench className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">Form Penerbitan Work Order (WO) Perbaikan Baru</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Judul Work Order / Pekerjaan
                  </label>
                  <input
                    type="text"
                    value={woTitle}
                    onChange={(e) => setWoTitle(e.target.value)}
                    placeholder="e.g. Servis Power Supply Moving Head Beam #2"
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Instruksi & Deskripsi Pekerjaan
                  </label>
                  <textarea
                    value={woDescription}
                    onChange={(e) => setWoDescription(e.target.value)}
                    placeholder="Jelaskan detail perbaikan, penggantian sparepart atau pengecekan komponen..."
                    rows={2}
                    className="block w-full p-3 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Divisi Pelaksana
                  </label>
                  <select
                    value={woDivision}
                    onChange={(e) => setWoDivision(e.target.value as any)}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Service">🔧 Divisi Service</option>
                    <option value="Audio">🔊 Divisi Audio</option>
                    <option value="Lighting">💡 Divisi Lighting</option>
                    <option value="Videotron">📺 Divisi Videotron</option>
                    <option value="Multimedia">🎥 Divisi Multimedia</option>
                    <option value="Gudang">📦 Divisi Gudang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Teknisi PIC
                  </label>
                  <select
                    value={woPic}
                    onChange={(e) => setWoPic(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  >
                    <option value="">-- Pilih PIC Teknisi --</option>
                    {staffList.map(s => (
                      <option key={s.id} value={s.name}>
                        {s.name} {s.nickname && s.nickname.toLowerCase() !== s.name.toLowerCase() ? `(${s.nickname})` : ''} - {s.division}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Batas Waktu (Deadline)
                  </label>
                  <input
                    type="date"
                    value={woDeadline}
                    onChange={(e) => setWoDeadline(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddWOForm(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
                >
                  Terbitkan Work Order
                </button>
              </div>
            </form>
          )}

          {/* List of Work Orders */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredWorkOrders.map((wo) => {
              const isCompleted = wo.status === 'Completed';

              return (
                <div
                  key={wo.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all ${
                    isCompleted
                      ? 'border-emerald-200 bg-emerald-50/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Badge Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                        {wo.division}
                      </span>

                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                          wo.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          wo.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          wo.status === 'Cancelled' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {wo.status}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{wo.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100 font-sans">
                        {wo.description}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-slate-500 font-medium">Progres Pengerjaan</span>
                        <span className="font-bold text-slate-800">{wo.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            wo.progress >= 100 ? 'bg-emerald-500' : wo.progress >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${wo.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* PIC, Deadline and Actions */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 font-mono">
                      <div>
                        <span className="block text-[10px] text-slate-400">Teknisi PIC</span>
                        <span className="font-semibold text-slate-800">{wo.pic}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400">Deadline</span>
                        <span className="font-semibold text-slate-800">{wo.deadline}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        {/* Tombol Approval Khusus Admin jika WO belum berstatus Completed */}
                        {!isCompleted && isManagement && (
                          <button
                            onClick={() => handleAdminApproveWorkOrder(wo)}
                            className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                            title="Admin Approve Work Order agar langsung selesai 100%"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                            <span>Approve WO (Admin)</span>
                          </button>
                        )}

                        {!isCompleted ? (
                          <button
                            onClick={() => handleCompleteWorkOrder(wo)}
                            className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Tandai Selesai (100%)</span>
                          </button>
                        ) : (
                          <div className="flex-1 py-1.5 px-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold text-center">
                            {wo.approvedBy ? `🛡️ Approved by ${wo.approvedBy} (Selesai 100%)` : '✅ Perbaikan Selesai (100%)'}
                          </div>
                        )}

                        <button
                          onClick={() => setSelectedWODetail(wo)}
                          className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          title="Buka Lembar Log Kerja"
                        >
                          📄 Log Kerja
                        </button>

                        {/* Delete Work Order */}
                        {onDeleteWorkOrder && isManagement && (
                          <button
                            onClick={() => {
                              if (confirm('Yakin ingin menghapus Work Order ini?')) {
                                onDeleteWorkOrder(wo.id);
                              }
                            }}
                            className="p-1.5 border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Hapus Work Order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredWorkOrders.length === 0 && (
              <div className="col-span-full bg-white py-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
                Tidak ada tiket Work Order yang terdaftar saat ini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODAL: DETAIL LOG KERJA WORK ORDER                         */}
      {/* ────────────────────────────────────────────────────────── */}
      {selectedWODetail && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                  {selectedWODetail.division} • Work Order #{selectedWODetail.id}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">{selectedWODetail.title}</h3>
              </div>
              <button
                onClick={() => setSelectedWODetail(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-500 uppercase text-[10px] block">Instruksi & Uraian Pekerjaan:</span>
                <p className="text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">{selectedWODetail.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-sans">Teknisi PIC:</span>
                  <strong className="text-slate-800 text-xs mt-0.5 block">{selectedWODetail.pic}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-sans">Deadline / Target:</span>
                  <strong className="text-slate-800 text-xs mt-0.5 block">{selectedWODetail.deadline}</strong>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-900">Status Pengerjaan:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    selectedWODetail.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedWODetail.status} ({selectedWODetail.progress}%)
                  </span>
                </div>
                <div className="text-[11px] text-indigo-700 leading-relaxed font-sans">
                  {selectedWODetail.status === 'Completed'
                    ? '✓ Pekerjaan telah selesai 100%. Tiket ini terhubung otomatis dengan log harian personel dan temuan QC terkait telah ditutup.'
                    : '⏳ Pekerjaan sedang dalam tahap penanganan oleh teknisi divisi terkait.'}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedWODetail(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Tutup Lembar Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
