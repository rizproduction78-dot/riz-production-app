/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LogbookEntry, Division, Finding, Staff } from '../types';
import { STAFF_LIST, QC_ITEMS_BY_DIVISION, getMasterStaffList } from '../data';
import { Check, X, Shield, Calendar, User, Briefcase, ChevronRight, ClipboardCheck, AlertOctagon, Save, Activity, Award, CheckCircle, Camera, Upload, Trash2, Eye, Plus } from 'lucide-react';
import { subscribeCloudCollection } from '../lib/cloudSync';
import { compressImageFile } from '../utils/imageUtils';

interface QCOnhouseProps {
  logbookEntries: LogbookEntry[];
  onAddLogbookEntry: (entry: Omit<LogbookEntry, 'id'>) => void;
  onAddFinding: (finding: Omit<Finding, 'id' | 'dateCreated'>) => void;
  currentUser: any;
  onLogActivity: (username: string, role: string, action: string) => void;
}

export default function QCOnhouse({
  logbookEntries,
  onAddLogbookEntry,
  onAddFinding,
  currentUser,
  onLogActivity,
}: QCOnhouseProps) {
  // Master Staff Dynamic State with Cloud Subscription
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

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Load electrical competencies from localStorage to calculate metrics dynamically
  const [electricalCompetencies] = useState<{ [staffId: string]: { [compKey: string]: { verified: boolean; verifiedBy?: string; dateVerified?: string } } }>(() => {
    const saved = localStorage.getItem('riz_staff_electrical_competencies');
    return saved ? JSON.parse(saved) : {};
  });

  // Calculate metrics based on staffList and competencies
  const ELIGIBLE_DIVISIONS = ['Audio', 'Lighting', 'Multimedia', 'Videotron', 'Gudang'];
  const eligibleStaff = staffList.filter(staff => ELIGIBLE_DIVISIONS.includes(staff.division));

  const getStaffProgress = (staffId: string) => {
    const comps = electricalCompetencies[staffId] || {};
    const completedKeys = Object.keys(comps).filter(k => comps[k]?.verified);
    const count = completedKeys.length;
    return { count };
  };

  const totalEligible = eligibleStaff.length;
  const totalCertified = eligibleStaff.filter(s => getStaffProgress(s.id).count === 6).length;
  const totalCompetenciesChecked = eligibleStaff.reduce((acc, s) => acc + getStaffProgress(s.id).count, 0);
  const overallPct = Math.round((totalCompetenciesChecked / (totalEligible * 6)) * 100) || 0;
  
  // Determine if user has management permissions to see/change all divisions
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
  
  // Get allowed divisions for the inspection (Pekerjaan QC bisa lintas divisi)
  const allowedDivisions = ['Audio', 'Lighting', 'Videotron', 'Multimedia', 'Service'] as const;

  const [selectedDivision, setSelectedDivision] = useState<'Audio' | 'Lighting' | 'Videotron' | 'Multimedia' | 'Service'>(() => {
    if (currentUser.division && ['Audio', 'Lighting', 'Videotron', 'Multimedia', 'Service'].includes(currentUser.division)) {
      return currentUser.division as 'Audio' | 'Lighting' | 'Videotron' | 'Multimedia' | 'Service';
    }
    return 'Audio';
  });

  const [staffName, setStaffName] = useState(currentUser.name);
  const [equipmentArea, setEquipmentArea] = useState('');
  const [activityType, setActivityType] = useState('Cleaning / Check / Test');
  const [followUp, setFollowUp] = useState('');
  const [status, setStatus] = useState<'Open' | 'Close'>('Open');

  // Photo upload state for QC / Logbook (Mendukung beberapa foto)
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files) as File[];
      try {
        const compressedList = await Promise.all(
          fileArray.map((file: File) => compressImageFile(file, 1200, 1200, 0.75))
        );
        setPhotoUrls(prev => [...prev, ...compressedList]);
      } catch (err) {
        console.error('Error compressing QC photos:', err);
      }
    }
    e.target.value = '';
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotoUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearAllPhotos = () => {
    setPhotoUrls([]);
  };

  // Checklist items values: key is item name, value is { status: 'OK' | 'NG', notes: string }
  const [checklistState, setChecklistState] = useState<{ [key: string]: { status: 'OK' | 'NG'; notes: string } }>({});

  // Reset/Initialize checklist items when division changes
  useEffect(() => {
    const items = QC_ITEMS_BY_DIVISION[selectedDivision];
    const newChecklistState: typeof checklistState = {};
    items.forEach(item => {
      newChecklistState[item] = { status: 'OK', notes: '' };
    });
    setChecklistState(newChecklistState);
    setEquipmentArea(`Set ${selectedDivision} RIZ-PRODUCTION`);
  }, [selectedDivision]);

  const handleStatusChange = (item: string, status: 'OK' | 'NG') => {
    setChecklistState(prev => ({
      ...prev,
      [item]: {
        ...prev[item],
        status
      }
    }));
  };

  const handleNotesChange = (item: string, notes: string) => {
    setChecklistState(prev => ({
      ...prev,
      [item]: {
        ...prev[item],
        notes
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine overall result
    const hasNG = (Object.values(checklistState) as { status: 'OK' | 'NG'; notes: string }[]).some(item => item.status === 'NG');
    const overallResult = hasNG ? 'NG' : 'OK';

    // Verification name/status (Supervisor or Admin can auto-verify, staff is pending)
    const verificationStr = (currentUser.role === 'Supervisor' || currentUser.role === 'Admin' || currentUser.role === 'Manager')
      ? `${currentUser.name} (Verified ✓)`
      : 'Pending Verifikasi';

    // Save Logbook Entry
    onAddLogbookEntry({
      date,
      division: selectedDivision,
      staffName,
      activity: activityType,
      result: overallResult,
      followUp: followUp || (hasNG ? 'Terdapat beberapa kendala item NG yang perlu tindak lanjut.' : 'Semua item dalam kondisi OK dan aman.'),
      status,
      verification: verificationStr,
      checklists: checklistState,
      photoUrl: photoUrls[0] || undefined,
      photos: photoUrls.length > 0 ? photoUrls : undefined
    });

    onLogActivity(currentUser.name, currentUser.role, `Melakukan Checklist QC Divisi ${selectedDivision} dengan hasil ${overallResult}`);

    // Automatically generate Findings (Temuan QC) for any item marked NG!
    let generatedFindingsCount = 0;
    (Object.entries(checklistState) as [string, { status: 'OK' | 'NG'; notes: string }][]).forEach(([item, val]) => {
      if (val.status === 'NG') {
        onAddFinding({
          equipment: `${selectedDivision} - ${item}`,
          issue: val.notes || 'Kerusakan terdeteksi saat inspeksi harian',
          priority: 'Sedang',
          pic: staffName,
          targetDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
          status: 'Open'
        });
        generatedFindingsCount++;
      }
    });

    if (generatedFindingsCount > 0) {
      alert(`Berhasil menyimpan Logbook! ${generatedFindingsCount} item bermasalah (NG) otomatis dimasukkan ke menu TEMUAN QC.`);
    } else {
      alert('Berhasil menyimpan Logbook QC Harian. Semua peralatan berfungsi dengan baik (OK).');
    }

    // Reset Checklist state to default OK and clear photo
    const items = QC_ITEMS_BY_DIVISION[selectedDivision];
    const resetChecklist: typeof checklistState = {};
    items.forEach(item => {
      resetChecklist[item] = { status: 'OK', notes: '' };
    });
    setChecklistState(resetChecklist);
    setFollowUp('');
    setPhotoUrls([]);
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Logbook QC Harian Staff Inhouse</h1>
        <p className="text-xs text-slate-500">Formulir pemeriksaan kelayakan dan fungsionalitas unit aset per divisi</p>
      </div>

      {/* HIGH-LEVEL ANALYTICS METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Staff Terikat Aturan</div>
            <div className="text-2xl font-bold text-slate-900">{totalEligible} <span className="text-xs font-normal text-slate-400">Pegawai</span></div>
            <div className="text-[10px] text-indigo-600 font-semibold">5 Divisi Operasional Utama</div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <User className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Sudah Bersertifikat Penuh</div>
            <div className="text-2xl font-bold text-emerald-600">{totalCertified} <span className="text-xs font-normal text-slate-400">Pegawai ({(Math.round((totalCertified / totalEligible) * 100) || 0)}%)</span></div>
            <div className="text-[10px] text-emerald-600 font-semibold">Telah Menyelesaikan 6/6 Modul</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Rasio Penguasaan Kompetensi</div>
            <div className="text-2xl font-bold text-amber-600">{overallPct}% <span className="text-xs font-normal text-slate-400">Rerata</span></div>
            <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${overallPct}%` }}></div>
            </div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-500 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* left bar: Select Division and Basic Metadata */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Langkah 1: Pilih Divisi</h3>
            <div className="grid grid-cols-1 gap-2">
              {allowedDivisions.map((div) => (
                <button
                  key={div}
                  type="button"
                  onClick={() => setSelectedDivision(div)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedDivision === div
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>Divisi {div}</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Langkah 2: Informasi QC</h3>

            {/* Date */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-500">Tanggal Pemeriksaan</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50"
                  required
                />
              </div>
            </div>

            {/* Staff PIC */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-500">Nama Pemeriksa (Staff)</label>
              {isManagement ? (
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50"
                    required
                  >
                    {staffList.map((staff) => (
                      <option key={staff.id} value={staff.name}>
                        {staff.name} ({staff.division})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    {currentUser.name} ({currentUser.division})
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal px-1.5 py-0.5 bg-slate-200/70 rounded">Terkunci</span>
                </div>
              )}
            </div>

            {/* Activity Type */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-500">Aktivitas QC</label>
              <input
                type="text"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                placeholder="Cleaning / Check / Test"
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50"
                required
              />
            </div>

            {/* Equipment/Area */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-500">Peralatan / Area</label>
              <input
                type="text"
                value={equipmentArea}
                onChange={(e) => setEquipmentArea(e.target.value)}
                placeholder="e.g. Rack Sound Utama, Studio B"
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50"
                required
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-500">Status Awal Laporan</label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="logbook-status"
                    checked={status === 'Open'}
                    onChange={() => setStatus('Open')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Open (Belum tuntas)</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="logbook-status"
                    checked={status === 'Close'}
                    onChange={() => setStatus('Close')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Close (Tuntas)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* right bar: Checklist Table and Actions */}
        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-indigo-600" />
                <h2 className="text-md font-display font-bold text-slate-800">
                  Item Detail Pemeriksaan Divisi {selectedDivision.toUpperCase()}
                </h2>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-mono font-medium px-2 py-0.5 rounded">
                {QC_ITEMS_BY_DIVISION[selectedDivision].length} Item Wajib Cek
              </span>
            </div>

            {/* Checklist Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-mono text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Nama Item Pemeriksaan</th>
                    <th className="pb-3 text-center font-semibold w-32">Kondisi (OK)</th>
                    <th className="pb-3 text-center font-semibold w-32">Kondisi (NG)</th>
                    <th className="pb-3 font-semibold">Keterangan Kerusakan / Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {QC_ITEMS_BY_DIVISION[selectedDivision].map((item) => {
                    const currentItemState = checklistState[item] || { status: 'OK', notes: '' };
                    return (
                      <tr key={item} className="hover:bg-slate-50/50">
                        <td className="py-3 font-medium text-slate-700">{item}</td>
                        <td className="py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item, 'OK')}
                            className={`p-2 rounded-lg border inline-flex items-center justify-center transition-all ${
                              currentItemState.status === 'OK'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-600 ring-2 ring-emerald-100'
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                            }`}
                          >
                            <Check className="w-4 h-4 font-bold" />
                          </button>
                        </td>
                        <td className="py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item, 'NG')}
                            className={`p-2 rounded-lg border inline-flex items-center justify-center transition-all ${
                              currentItemState.status === 'NG'
                                ? 'bg-rose-50 border-rose-300 text-rose-600 ring-2 ring-rose-100'
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                            }`}
                          >
                            <X className="w-4 h-4 font-bold" />
                          </button>
                        </td>
                        <td className="py-3">
                          <input
                            type="text"
                            value={currentItemState.notes}
                            onChange={(e) => handleNotesChange(item, e.target.value)}
                            placeholder={currentItemState.status === 'NG' ? "WAJIB diisi! Sebutkan jenis kerusakannya..." : "Catatan opsional..."}
                            className={`w-full px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/30 ${
                              currentItemState.status === 'NG' && !currentItemState.notes
                                ? 'border-rose-300 placeholder-rose-400 ring-1 ring-rose-100'
                                : 'border-slate-200'
                            }`}
                            required={currentItemState.status === 'NG'}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Foto Dokumentasi QC / Bukti Pemeriksaan (Bisa Beberapa Foto) */}
            <div className="p-4 border border-indigo-100 rounded-xl bg-indigo-50/20 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-indigo-600" />
                  <span>Foto Bukti Fisik / Dokumentasi QC ({photoUrls.length} Foto)</span>
                </label>
                {photoUrls.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllPhotos}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Semua ({photoUrls.length})</span>
                  </button>
                )}
              </div>

              {photoUrls.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-5 text-center transition-colors bg-white">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="qc-photo-upload"
                  />
                  <label htmlFor="qc-photo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-indigo-600">Klik untuk Upload Beberapa Foto dari Perangkat / Kamera</span>
                    <span className="text-[11px] text-slate-400">Dapat memilih 1 atau sekaligus beberapa foto (JPG, PNG, WEBP, HEIC)</span>
                  </label>
                  <a
                    href="https://drive.google.com/drive/folders/1s_mRU4FzBm29SKvsmNWlBlz1rfL3b90h?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                  >
                    Buka Folder Penyimpanan Foto Drive (Khusus QC)
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {photoUrls.map((pUrl, pIdx) => (
                      <div key={pIdx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
                        <img
                          src={pUrl}
                          alt={`Foto QC ${pIdx + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/65 text-white font-mono text-[9px] font-bold">
                          Foto #{pIdx + 1}
                        </span>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewModalImg(pUrl)}
                            className="p-1.5 bg-white/95 text-slate-800 hover:bg-white rounded-lg cursor-pointer transition-colors shadow-xs"
                            title="Lihat Penuh"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(pIdx)}
                            className="p-1.5 bg-rose-600/95 text-white hover:bg-rose-700 rounded-lg cursor-pointer transition-colors shadow-xs"
                            title="Hapus Foto Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-xl p-3 flex flex-col items-center justify-center text-center bg-white transition-colors cursor-pointer min-h-[96px]">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="qc-photo-upload-more"
                      />
                      <label htmlFor="qc-photo-upload-more" className="cursor-pointer flex flex-col items-center gap-1">
                        <Plus className="w-5 h-5 text-indigo-600" />
                        <span className="text-[11px] font-bold text-indigo-600">+ Tambah Foto</span>
                      </label>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-600 font-semibold">✓ {photoUrls.length} foto siap dilampirkan ke logbook QC</p>
                </div>
              )}
            </div>

            {/* General Follow Up & Comments */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tindak Lanjut & Rekomendasi Umum
              </label>
              <textarea
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                placeholder="Sebutkan langkah-langkah tindak lanjut yang disarankan untuk keseluruhan pengecekan divisi ini..."
                rows={3}
                className="w-full p-3 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Logbook QC Harian</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Riwayat Logbook QC & Bukti Foto */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Riwayat Entri Logbook QC ({logbookEntries.length})</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-time log</span>
        </div>

        {logbookEntries.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs italic">
            Belum ada entri logbook QC yang tercatat. Silakan input formulir di atas untuk menambahkan laporan inspeksi baru dengan foto bukti.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {logbookEntries.map((entry) => (
              <div key={entry.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{entry.staffName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    entry.result === 'OK' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {entry.result}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Divisi {entry.division}:</span> {entry.activity}
                </div>
                {((entry.photos && entry.photos.length > 0) || entry.photoUrl) && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                      <span>Bukti Foto</span>
                      <span>{(entry.photos && entry.photos.length > 0) ? `${entry.photos.length} Foto` : '1 Foto'}</span>
                    </div>
                    <div className={`grid gap-1.5 ${
                      (entry.photos && entry.photos.length > 1) ? 'grid-cols-3' : 'grid-cols-1'
                    }`}>
                      {(entry.photos && entry.photos.length > 0 ? entry.photos : [entry.photoUrl!]).map((imgSrc, imgIdx) => (
                        <div
                          key={imgIdx}
                          className={`relative group rounded-lg overflow-hidden border border-slate-200 cursor-pointer ${
                            (entry.photos && entry.photos.length > 1) ? 'h-20' : 'h-36'
                          }`}
                          onClick={() => setPreviewModalImg(imgSrc)}
                        >
                          <img
                            src={imgSrc}
                            alt={`Foto QC ${imgIdx + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1">
                            <Eye className="w-3 h-3" />
                            {(entry.photos && entry.photos.length > 1) ? null : <span>Lihat Foto Penuh</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{entry.date}</span>
                  <span>{entry.verification || 'Verified'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
              alt="Foto QC Ukuran Penuh"
              className="max-h-[80vh] w-auto mx-auto object-contain rounded-xl"
            />
            <div className="p-3 text-center text-xs text-slate-300 font-mono">
              Foto Bukti Pemeriksaan QC / Logbook
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
