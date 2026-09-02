/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LogbookEntry, Division, Finding } from '../types';
import { STAFF_LIST, QC_ITEMS_BY_DIVISION } from '../data';
import { Check, X, Shield, Calendar, User, Briefcase, ChevronRight, ClipboardCheck, AlertOctagon, Save, Activity, Award, CheckCircle } from 'lucide-react';

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
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Load electrical competencies from localStorage to calculate metrics dynamically
  const [electricalCompetencies] = useState<{ [staffId: string]: { [compKey: string]: { verified: boolean; verifiedBy?: string; dateVerified?: string } } }>(() => {
    const saved = localStorage.getItem('riz_staff_electrical_competencies');
    return saved ? JSON.parse(saved) : {};
  });

  // Calculate metrics based on STAFF_LIST and competencies
  const ELIGIBLE_DIVISIONS = ['Audio', 'Lighting', 'Multimedia', 'Videotron', 'Gudang'];
  const eligibleStaff = STAFF_LIST.filter(staff => ELIGIBLE_DIVISIONS.includes(staff.division));

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
  const isManagement = currentUser.role === 'Admin' || currentUser.role === 'Supervisor' || currentUser.role === 'Manager';
  
  // Get allowed divisions for the user
  const allowedDivisions = isManagement
    ? (['Audio', 'Lighting', 'Videotron', 'Multimedia', 'Service'] as const)
    : (['Audio', 'Lighting', 'Videotron', 'Multimedia', 'Service'] as const).filter(
        div => div === currentUser.division
      );

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
      checklists: checklistState
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

    // Reset Checklist state to default OK
    const items = QC_ITEMS_BY_DIVISION[selectedDivision];
    const resetChecklist: typeof checklistState = {};
    items.forEach(item => {
      resetChecklist[item] = { status: 'OK', notes: '' };
    });
    setChecklistState(resetChecklist);
    setFollowUp('');
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
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50"
                  required
                >
                  {STAFF_LIST.filter(
                    (staff) =>
                      staff.division === selectedDivision ||
                      staff.role === 'Admin' ||
                      staff.role === 'Supervisor' ||
                      staff.role === 'Manager'
                  ).map((staff) => (
                    <option key={staff.id} value={staff.name}>
                      {staff.name} ({staff.division})
                    </option>
                  ))}
                </select>
              </div>
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
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Logbook QC Harian</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
