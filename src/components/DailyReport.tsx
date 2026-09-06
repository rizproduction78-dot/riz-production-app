/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DailyReport as DailyReportType, Division, Finding, Staff } from '../types';
import { STAFF_LIST, getMasterStaffList } from '../data';
import { FileText, Plus, Calendar, User, Briefcase, CheckCircle2, Clipboard, Image as ImageIcon, Trash2, Search, Send, AlertOctagon, Eye, X, Upload } from 'lucide-react';
import { subscribeCloudCollection } from '../lib/cloudSync';

interface DailyReportProps {
  reports: DailyReportType[];
  onAddReport: (report: Omit<DailyReportType, 'id'>) => void;
  onDeleteReport: (id: string) => void;
  onAddFinding?: (finding: Omit<Finding, 'id' | 'dateCreated'>) => void;
  currentUser: any;
  onLogActivity: (username: string, role: string, action: string) => void;
}

const DEFAULT_PHOTOS = [
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=300&q=80', // Soundboard/Mixer
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80', // Stage lights
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80', // Dj/Audio
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=300&q=80', // Event stage
];

export default function DailyReport({
  reports,
  onAddReport,
  onDeleteReport,
  onAddFinding,
  currentUser,
  onLogActivity,
}: DailyReportProps) {
  const isManagement = currentUser.role === 'Admin' || currentUser.role === 'Supervisor' || currentUser.role === 'Manager';

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

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [staffName, setStaffName] = useState(currentUser.name);
  const [division, setDivision] = useState<Division>(currentUser.division || 'Audio');
  const [activity, setActivity] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Submitted'>('Submitted');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploadOption, setUploadOption] = useState<'file' | 'preset' | 'none'>('preset');
  const [customFileBase64, setCustomFileBase64] = useState('');
  const [customFilesBase64, setCustomFilesBase64] = useState<string[]>([]);
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);

  // Faulty Unit Reporting States
  const [hasFaultyUnit, setHasFaultyUnit] = useState(false);
  const [faultyUnitName, setFaultyUnitName] = useState('');
  const [faultyUnitIssue, setFaultyUnitIssue] = useState('');
  const [faultyUnitPriority, setFaultyUnitPriority] = useState<'Tinggi' | 'Sedang' | 'Rendah'>('Sedang');

  // Search/Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDivision, setFilterDivision] = useState<string>(isManagement ? 'All' : currentUser.division);

  // Handle Photo Upload Conversion (Multiple files supported)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setCustomFilesBase64(prev => [...prev, ...newImages]);
      });
    }
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity.trim()) return;

    const finalNotes = hasFaultyUnit 
      ? `${notes}\n[Temuan Unit Bermasalah: ${faultyUnitName} - ${faultyUnitIssue} (Prioritas: ${faultyUnitPriority})]`
      : notes;

    onAddReport({
      date,
      staffName,
      division,
      activity,
      notes: finalNotes,
      photoUrl: uploadOption === 'none' ? undefined : (customFilesBase64[0] || photoUrl || undefined),
      photos: uploadOption === 'none' ? undefined : (customFilesBase64.length > 0 ? customFilesBase64 : (photoUrl ? [photoUrl] : undefined)),
      status,
    });

    if (hasFaultyUnit && onAddFinding && faultyUnitName.trim() && faultyUnitIssue.trim()) {
      onAddFinding({
        equipment: `${division} - ${faultyUnitName}`,
        issue: faultyUnitIssue,
        priority: faultyUnitPriority,
        pic: staffName,
        targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days
        status: 'Open'
      });
      alert(`Berhasil menyimpan laporan! Temuan unit bermasalah "${faultyUnitName}" otomatis didaftarkan ke Temuan QC & Kerusakan.`);
    }

    onLogActivity(currentUser.name, currentUser.role, `Menambahkan daily report untuk tanggal ${date}`);

    // Reset Form
    setActivity('');
    setNotes('');
    setPhotoUrl('');
    setCustomFilesBase64([]);
    setCustomFileBase64('');
    setHasFaultyUnit(false);
    setFaultyUnitName('');
    setFaultyUnitIssue('');
    setFaultyUnitPriority('Sedang');
  };

  // Filter reports - Staff only sees their own division
  const filteredReports = reports.filter(r => {
    const matchSearch = r.staffName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        r.activity.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        r.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDivision = isManagement 
      ? (filterDivision === 'All' || r.division === filterDivision)
      : (r.division === currentUser.division);
    return matchSearch && matchDivision;
  });

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Daily Report Staff</h1>
          <p className="text-xs text-slate-500">Pencatatan harian aktivitas dan progres kerja staff RIZ-PRODUCTION</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input Form */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-fit space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Plus className="w-5 h-5 text-indigo-600" />
            <h2 className="text-md font-display font-bold text-slate-800">Tulis Laporan Harian Baru</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tanggal */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Tanggal Laporan
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 bg-slate-50/50"
                  required
                />
              </div>
            </div>

            {/* Nama Teknisi / Staff */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Nama Staff / Teknisi
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={staffName}
                  onChange={(e) => {
                    setStaffName(e.target.value);
                    const selected = staffList.find(s => s.name === e.target.value);
                    if (selected) {
                      setDivision(selected.division);
                    }
                  }}
                  className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 bg-slate-50/50"
                  required
                >
                  {staffList.filter(
                    (staff) =>
                      isManagement ||
                      staff.division === currentUser.division ||
                      staff.id === currentUser.id
                  ).map(staff => (
                    <option key={staff.id} value={staff.name}>
                      {staff.name} ({staff.division})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Divisi */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Divisi Kerja
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value as Division)}
                  className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 bg-slate-50/50"
                  required
                >
                  {isManagement ? (
                    <>
                      <option value="Audio">Audio (Sound)</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Videotron">Videotron</option>
                      <option value="Multimedia">Multimedia</option>
                      <option value="Gudang">Gudang</option>
                      <option value="Admin">Admin / Management</option>
                      <option value="Service">Service (Perbaikan)</option>
                    </>
                  ) : (
                    <option value={currentUser.division}>
                      {currentUser.division === 'Audio' ? 'Audio (Sound)' : currentUser.division}
                    </option>
                  )}
                </select>
              </div>
            </div>

            {/* Aktivitas Utama */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Aktivitas Utama Kerja
              </label>
              <textarea
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="Contoh: Bongkar pasang monitor panggung, cleaning mixer di Gudang Utama, dll"
                rows={3}
                className="block w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 bg-slate-50/50"
                required
              />
            </div>

            {/* Keterangan Tambahan */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Keterangan Tambahan / Detail
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Terdapat 1 mic wireless Shure mengalami noise ringan pada baterai case"
                rows={2}
                className="block w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 bg-slate-50/50"
              />
            </div>

            {/* Pelaporan Temuan Alat Bermasalah */}
            <div className="p-4 border border-rose-100 rounded-xl bg-rose-50/10 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={hasFaultyUnit}
                  onChange={(e) => setHasFaultyUnit(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                />
                <span className="flex items-center gap-1.5 text-rose-950 uppercase tracking-wider select-none">
                  <AlertOctagon className="w-4 h-4 text-rose-500" />
                  Laporkan Temuan Unit Bermasalah Baru (Auto-Sync ke Temuan QC)
                </span>
              </label>

              {hasFaultyUnit && (
                <div className="space-y-3 pt-3 border-t border-rose-100/60">
                  <div>
                    <label className="block text-[10px] font-bold text-rose-800 uppercase tracking-wide mb-1">
                      Nama Alat / Unit Bermasalah <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={faultyUnitName}
                      onChange={(e) => setFaultyUnitName(e.target.value)}
                      placeholder="e.g. Solder Station Gordak #2 atau Kabel Speaker 15M"
                      className="block w-full px-3 py-2 border border-rose-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-700 font-sans"
                      required={hasFaultyUnit}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-rose-800 uppercase tracking-wide mb-1">
                      Deskripsi Masalah / Kerusakan <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      value={faultyUnitIssue}
                      onChange={(e) => setFaultyUnitIssue(e.target.value)}
                      placeholder="e.g. Elemen pemanas mati total, perlu ganti sparepart gagang solder"
                      rows={2}
                      className="block w-full p-2.5 border border-rose-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-700 font-sans"
                      required={hasFaultyUnit}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-rose-800 uppercase tracking-wide mb-1">
                      Prioritas Penanganan
                    </label>
                    <select
                      value={faultyUnitPriority}
                      onChange={(e) => setFaultyUnitPriority(e.target.value as any)}
                      className="block w-full px-3 py-2 border border-rose-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-700 font-sans cursor-pointer"
                    >
                      <option value="Rendah">Rendah (Low)</option>
                      <option value="Sedang">Sedang (Medium)</option>
                      <option value="Tinggi">Tinggi (High / Urgent)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Foto (Simulation) */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Lampiran Foto Pekerjaan
              </label>
              
              <div className="flex gap-2 mb-2 text-xs">
                <button
                  type="button"
                  onClick={() => { setUploadOption('preset'); setPhotoUrl(DEFAULT_PHOTOS[0]); }}
                  className={`px-3 py-1 rounded border ${uploadOption === 'preset' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                >
                  Pilih Preset Foto
                </button>
                <button
                  type="button"
                  onClick={() => { setUploadOption('file'); setPhotoUrl(customFileBase64 || ''); }}
                  className={`px-3 py-1 rounded border ${uploadOption === 'file' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => { setUploadOption('none'); setPhotoUrl(''); }}
                  className={`px-3 py-1 rounded border ${uploadOption === 'none' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                >
                  Tanpa Foto
                </button>
              </div>

              {uploadOption === 'preset' && (
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {DEFAULT_PHOTOS.map((src, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(src)}
                      className={`relative rounded-lg overflow-hidden border-2 h-12 transition-all ${photoUrl === src ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-transparent opacity-70'}`}
                    >
                      <img src={src} alt="preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}

              {uploadOption === 'file' && (
                <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">Foto Terpilih ({customFilesBase64.length})</span>
                    {customFilesBase64.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setCustomFilesBase64([])}
                        className="text-[10px] text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                      >
                        Hapus Semua
                      </button>
                    )}
                  </div>

                  {customFilesBase64.length === 0 ? (
                    <div className="border border-dashed border-indigo-200 hover:border-indigo-400 bg-white rounded-lg p-3 text-center transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="daily-report-file-multi"
                      />
                      <label htmlFor="daily-report-file-multi" className="cursor-pointer flex flex-col items-center gap-1 text-xs font-semibold text-indigo-600">
                        <Upload className="w-4 h-4" />
                        <span>Pilih Beberapa Foto dari Perangkat / Kamera</span>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-1.5">
                        {customFilesBase64.map((imgSrc, idx) => (
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
                                onClick={() => setCustomFilesBase64(prev => prev.filter((_, i) => i !== idx))}
                                className="p-1 bg-rose-600 text-white rounded text-[9px] cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="border border-dashed border-indigo-200 hover:border-indigo-400 rounded-lg flex items-center justify-center bg-white cursor-pointer min-h-[64px] transition-colors">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="daily-report-file-multi-add"
                          />
                          <label htmlFor="daily-report-file-multi-add" className="cursor-pointer flex flex-col items-center gap-0.5 text-indigo-600 text-[10px] font-bold p-1">
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Foto</span>
                          </label>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold block">✓ {customFilesBase64.length} foto siap dilampirkan</span>
                    </div>
                  )}
                </div>
              )}

              {uploadOption === 'preset' && photoUrl && (
                <div className="text-center bg-slate-50 p-2 rounded border border-slate-200/50">
                  <span className="text-[10px] text-indigo-600 font-semibold font-mono">Preset terpilih ✓</span>
                </div>
              )}
            </div>

            {/* Status Pekerjaan */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Status Pekerjaan
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'Submitted'}
                    onChange={() => setStatus('Submitted')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Langsung Kirim (Submitted)</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'Draft'}
                    onChange={() => setStatus('Draft')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Simpan draf (Draft)</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={!activity.trim()}
              className="w-full py-2.5 px-4 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <Send className="w-4 h-4" />
              <span>{status === 'Submitted' ? 'Kirim Laporan' : 'Simpan Draf Laporan'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: List of Existing Reports */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari laporan berdasarkan nama staff / aktivitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700"
              />
            </div>

            {/* Division Filter */}
            {isManagement ? (
              <select
                value={filterDivision}
                onChange={(e) => setFilterDivision(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 bg-white cursor-pointer"
              >
                <option value="All">Semua Divisi (Manajemen)</option>
                <option value="Audio">Audio</option>
                <option value="Lighting">Lighting</option>
                <option value="Videotron">Videotron</option>
                <option value="Multimedia">Multimedia</option>
                <option value="Gudang">Gudang</option>
                <option value="Admin">Admin</option>
              </select>
            ) : (
              <div className="px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                <span>Divisi Anda: {currentUser.division} (Terkunci)</span>
              </div>
            )}
          </div>

          {/* List Wrapper */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:border-slate-200/80 transition-all space-y-4 relative group"
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-display font-bold text-indigo-700 text-sm">
                      {report.staffName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{report.staffName}</h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-mono">
                        <span>{report.date}</span>
                        <span>•</span>
                        <span className="text-indigo-600 font-medium bg-indigo-50 px-1.5 py-0.2 rounded">
                          {report.division}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        report.status === 'Submitted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {report.status}
                    </span>
                    {(currentUser.role === 'Admin' || currentUser.role === 'Supervisor' || currentUser.name === report.staffName) && (
                      <button
                        onClick={() => {
                          if (confirm('Yakin ingin menghapus laporan ini?')) {
                            onDeleteReport(report.id);
                          }
                        }}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-slate-50"
                        title="Hapus Laporan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content body */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-slate-700">Aktivitas:</div>
                  <p className="text-sm text-slate-600 leading-relaxed font-sans bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    {report.activity}
                  </p>

                  {report.notes && (
                    <>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2">Keterangan:</div>
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-dashed border-slate-200">
                        {report.notes}
                      </p>
                    </>
                  )}
                </div>

                {/* Photo attachment if available */}
                {((report.photos && report.photos.length > 0) || report.photoUrl) && (
                  <div className="pt-2 space-y-1.5">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>Lampiran Foto Lapangan</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {(report.photos && report.photos.length > 0) ? `${report.photos.length} Foto` : '1 Foto'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(report.photos && report.photos.length > 0 ? report.photos : [report.photoUrl!]).map((photoSrc, pIdx) => (
                        <div
                          key={pIdx}
                          className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-xs"
                          onClick={() => setPreviewModalImg(photoSrc)}
                        >
                          <img
                            src={photoSrc}
                            alt={`attachment ${pIdx + 1}`}
                            className="h-28 w-36 sm:w-44 object-cover hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredReports.length === 0 && (
              <div className="bg-white py-12 text-center rounded-xl border border-slate-100 text-slate-400 text-sm">
                Tidak ada laporan harian yang sesuai filter pencarian.
              </div>
            )}
          </div>
        </div>
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
              alt="Foto Dokumentasi Lapangan"
              className="max-h-[80vh] w-auto mx-auto object-contain rounded-xl"
            />
            <div className="p-3 text-center text-xs text-slate-300 font-mono">
              Foto Bukti Dokumentasi Daily Report
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
