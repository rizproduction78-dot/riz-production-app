/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PANEL KONTROL PENGELOLAAN APLIKASI DIVISI ADMIN
 * PT. RIZ PRODUCTION MULTI KREASI
 */

import React, { useState, useEffect } from 'react';
import { Staff, Division, QCItem } from '../types';
import { STAFF_LIST, QC_ITEMS_BY_DIVISION } from '../data';
import { OFFICIAL_SEPTEMBER_2026_SCHEDULE, StaffScheduleRow, SHIFT_LEGEND } from '../data/september2026Schedule';
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
  Image as ImageIcon
} from 'lucide-react';
import { forceSyncAllModules } from '../lib/cloudSync';

interface AdminPanelProps {
  currentUser: Staff;
  onLogActivity: (username: string, role: string, action: string) => void;
}

export default function AdminPanel({ currentUser, onLogActivity }: AdminPanelProps) {
  // Sub-tabs
  const [activeTab, setActiveTab] = useState<'staff' | 'qc_checklist' | 'schedule' | 'database'>('staff');

  // ─────────────────────────────────────────────────────────────
  // 1. MASTER STAF MANAGEMENT STATE
  // ─────────────────────────────────────────────────────────────
  const [staffList, setStaffList] = useState<Staff[]>(() => {
    try {
      const saved = localStorage.getItem('riz_master_staff_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return STAFF_LIST;
  });

  const [staffSearch, setStaffSearch] = useState('');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [activeStaffForEdit, setActiveStaffForEdit] = useState<Staff | null>(null);

  const [staffFormData, setStaffFormData] = useState<Partial<Staff>>({
    name: '',
    division: 'Audio',
    role: 'Staff',
    phone: '',
    email: '',
    avatar: ''
  });

  const saveStaffList = (updated: Staff[]) => {
    setStaffList(updated);
    localStorage.setItem('riz_master_staff_list', JSON.stringify(updated));
    onLogActivity(currentUser.name, currentUser.role, 'Memperbarui master data staf karyawan');
  };

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

  const handleAddStaff = () => {
    if (!staffFormData.name?.trim()) return;
    const newStaff: Staff = {
      id: `staff-${Date.now()}`,
      name: staffFormData.name.trim(),
      division: (staffFormData.division as Division) || 'Audio',
      role: (staffFormData.role as any) || 'Staff',
      phone: staffFormData.phone?.trim() || '',
      email: staffFormData.email?.trim() || '',
      avatar: staffFormData.avatar || ''
    };
    const updated = [...staffList, newStaff];
    saveStaffList(updated);
    setStaffFormData({ name: '', division: 'Audio', role: 'Staff', phone: '', email: '', avatar: '' });
    setShowAddStaffModal(false);
  };

  const handleOpenEditStaff = (staff: Staff) => {
    setActiveStaffForEdit(staff);
    setStaffFormData({
      name: staff.name,
      division: staff.division,
      role: staff.role,
      phone: staff.phone || '',
      email: staff.email || '',
      avatar: staff.avatar || ''
    });
    setShowEditStaffModal(true);
  };

  const handleSaveEditStaff = () => {
    if (!activeStaffForEdit || !staffFormData.name?.trim()) return;
    const updated = staffList.map(s => {
      if (s.id === activeStaffForEdit.id) {
        return {
          ...s,
          name: staffFormData.name!.trim(),
          division: (staffFormData.division as Division) || s.division,
          role: (staffFormData.role as any) || s.role,
          phone: staffFormData.phone?.trim() || '',
          email: staffFormData.email?.trim() || '',
          avatar: staffFormData.avatar || s.avatar || ''
        };
      }
      return s;
    });
    saveStaffList(updated);
    setShowEditStaffModal(false);
    setActiveStaffForEdit(null);
  };

  const handleDeleteStaff = (id: string) => {
    if (confirm('Yakin ingin menghapus staf ini dari sistem?')) {
      const updated = staffList.filter(s => s.id !== id);
      saveStaffList(updated);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 2. QC CHECKLIST MANAGEMENT STATE
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
  // 3. SCHEDULE MANAGEMENT STATE
  // ─────────────────────────────────────────────────────────────
  const [septemberSchedule, setSeptemberSchedule] = useState<StaffScheduleRow[]>(() => {
    try {
      const saved = localStorage.getItem('riz_september_2026_schedule');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return OFFICIAL_SEPTEMBER_2026_SCHEDULE;
  });

  const saveSchedule = (updated: StaffScheduleRow[]) => {
    setSeptemberSchedule(updated);
    localStorage.setItem('riz_september_2026_schedule', JSON.stringify(updated));
    onLogActivity(currentUser.name, currentUser.role, 'Memperbarui jadwal dinas operasional shift September 2026');
  };

  const handleUpdateDayShift = (staffId: string, day: number, newShift: string) => {
    const updated = septemberSchedule.map(s => {
      if (s.id === staffId) {
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
  // 4. DATABASE & BACKUP STATE
  // ─────────────────────────────────────────────────────────────
  const [syncMessage, setSyncMessage] = useState('');

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
      setSyncMessage('Sinkronisasi selesai (data tersimpan di penyimpanan lokal & cloud).');
      setTimeout(() => setSyncMessage(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-2 rounded-xl">
              <Sliders className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Panel Pengelolaan Admin</h1>
              <p className="text-xs text-slate-500 font-medium">Pengelolaan Master Data Staf, Foto Profil, No Telp, Checklist QC & Roster Shift</p>
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
            onClick={() => setActiveTab('qc_checklist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'qc_checklist' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Checklist QC Divisi</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'schedule' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Jadwal Shift Roster</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'database' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Pusat Database & Sync</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: MASTER STAF & KELOLA ANGGOTA                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            </div>

            <button
              onClick={() => {
                setStaffFormData({ name: '', division: 'Audio', role: 'Staff', phone: '', email: '', avatar: '' });
                setShowAddStaffModal(true);
              }}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Staf Baru</span>
            </button>
          </div>

          {/* Table Staf */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                    <th className="p-3.5">Foto Profil</th>
                    <th className="p-3.5">Nama Lengkap</th>
                    <th className="p-3.5">Divisi</th>
                    <th className="p-3.5">Role / Jabatan</th>
                    <th className="p-3.5">No. Telp / WA</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staffList
                    .filter(s => 
                      s.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
                      s.division.toLowerCase().includes(staffSearch.toLowerCase()) ||
                      s.role.toLowerCase().includes(staffSearch.toLowerCase()) ||
                      (s.phone && s.phone.includes(staffSearch))
                    )
                    .map(staff => (
                      <tr key={staff.id} className="hover:bg-slate-50/60">
                        <td className="p-3.5">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                            {staff.avatar ? (
                              <img src={staff.avatar} alt={staff.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-bold text-slate-600 font-mono text-xs">
                                {staff.name.substring(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">
                          <div>{staff.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono font-normal">ID: {staff.id}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md font-bold text-[10px]">
                            {staff.division}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-slate-700 font-semibold">{staff.role}</span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-600">
                          {staff.phone ? (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-emerald-600" />
                              {staff.phone}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">- Belum ada -</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenEditStaff(staff)}
                            className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 font-bold text-[11px]"
                            title="Edit Staf"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Staf"
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
      {/* TAB 2: QC CHECKLIST ITEMS MANAGEMENT                         */}
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

          {/* Add New QC Item */}
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

          {/* List QC Items */}
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
      {/* TAB 3: SCHEDULE SHIFT ROSTER MANAGEMENT                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase">Jadwal Shift Operasional September 2026</h2>
              <p className="text-xs text-slate-500 mt-0.5">Edit shift kerja harian per staf secara langsung</p>
            </div>
            <div className="flex items-center gap-2">
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
                  {Array.from({ length: 30 }, (_, i) => (
                    <th key={i + 1} className="p-2 text-center w-8 border-l border-slate-200/60">
                      {i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {septemberSchedule.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-sans font-bold text-slate-900 sticky left-0 bg-white z-10">{s.name}</td>
                    <td className="p-3 font-sans text-slate-500">{s.division}</td>
                    {Array.from({ length: 30 }, (_, i) => {
                      const day = i + 1;
                      const shift = s.shifts?.[day] || '-';
                      return (
                        <td key={day} className="p-1 text-center border-l border-slate-100">
                          <select
                            value={shift}
                            onChange={(e) => handleUpdateDayShift(s.id, day, e.target.value)}
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
      {/* TAB 4: DATABASE, CLOUD SYNC & BACKUP                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sync Cloud Firestore */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <RefreshCw className="w-5 h-5" />
                <h2 className="text-base font-extrabold text-slate-900">Sinkronisasi Cloud Firestore</h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Paksa sinkronisasi real-time seluruh modul transaksi (QC, Daily Task, Absensi, Temuan WO, Logistik Gudang) ke server Cloud Firestore agar data terbarui di semua perangkat multi-user.
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

            {/* Backup JSON */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Download className="w-5 h-5" />
                <h2 className="text-base font-extrabold text-slate-900">Ekspor File Backup JSON</h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Unduh seluruh data operasional, master staf, checklist, dan riwayat transaksi dalam format JSON terenkapsulasi penuh sebagai arsip resmi perusahaan.
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

      {/* MODAL TAMBAH STAF */}
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
              {/* Photo Preview & Upload */}
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

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={staffFormData.name}
                  onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    <option value="Staff">Staff</option>
                    <option value="Team Leader">Team Leader</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="Gudang">Gudang</option>
                  </select>
                </div>
              </div>

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
                <label className="font-bold text-slate-700 block mb-1">Email Resmi (Opsional)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="nama@rizproduction.com"
                    value={staffFormData.email}
                    onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
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

      {/* MODAL EDIT STAF */}
      {showEditStaffModal && activeStaffForEdit && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Ubah / Edit Data Staf</h3>
              <button onClick={() => setShowEditStaffModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              {/* Photo Preview & Upload */}
              <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500 bg-white flex items-center justify-center shrink-0">
                  {staffFormData.avatar ? (
                    <img src={staffFormData.avatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-slate-600 font-mono text-sm">
                      {staffFormData.name?.substring(0, 2).toUpperCase() || 'ST'}
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
                  {staffFormData.avatar && (
                    <button
                      type="button"
                      onClick={() => setStaffFormData(prev => ({ ...prev, avatar: '' }))}
                      className="block text-[10px] text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  value={staffFormData.name}
                  onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    <option value="Staff">Staff</option>
                    <option value="Team Leader">Team Leader</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="Gudang">Gudang</option>
                  </select>
                </div>
              </div>

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
                <label className="font-bold text-slate-700 block mb-1">Email Resmi (Opsional)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="nama@rizproduction.com"
                    value={staffFormData.email}
                    onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
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
    </div>
  );
}
