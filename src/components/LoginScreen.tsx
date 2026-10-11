/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { STAFF_LIST, getMasterStaffList, normalizeStaffMaster } from '../data';
import { Staff } from '../types';
import { LogIn, Shield, User, Key, ClipboardList, Package, Award, LayoutDashboard, X, Lock } from 'lucide-react';
import { subscribeCloudCollection, saveCloudDoc } from '../lib/cloudSync';

interface LoginScreenProps {
  onLogin: (staff: Staff) => void;
  onLogActivity: (username: string, role: string, action: string) => void;
  staffList?: Staff[];
}

export default function LoginScreen({ onLogin, onLogActivity, staffList: propsStaffList }: LoginScreenProps) {
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [reqStaffId, setReqStaffId] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reqError, setReqError] = useState('');
  const [reqSuccess, setReqSuccess] = useState(false);

  const [localStaffList, setLocalStaffList] = useState<Staff[]>(() => getMasterStaffList());

  // Keep synced with Firestore and prop updates
  useEffect(() => {
    if (propsStaffList && propsStaffList.length > 0) {
      setLocalStaffList(normalizeStaffMaster(propsStaffList));
    }
  }, [propsStaffList]);

  useEffect(() => {
    const unsub = subscribeCloudCollection<Staff>(
      'master_staff',
      'riz_master_staff_list',
      (items) => {
        if (Array.isArray(items)) {
          setLocalStaffList(normalizeStaffMaster(items));
        }
      },
      STAFF_LIST
    );
    return () => unsub();
  }, []);

  const rawStaffList = (propsStaffList && propsStaffList.length > 0) ? propsStaffList : localStaffList;
  const activeStaffList = normalizeStaffMaster(rawStaffList);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) {
      setError('Silakan pilih nama staff terlebih dahulu.');
      return;
    }

    const staff = activeStaffList.find((s) => s.id === selectedStaffId);
    if (!staff) {
      setError('Staff tidak ditemukan.');
      return;
    }

    // Check against custom password or fallback (case-insensitive & trim whitespace)
    const expectedPassword = staff.password || 'riz123';
    if (password.trim().toLowerCase() !== expectedPassword.toLowerCase()) {
      setError('Password salah! Silakan coba lagi.');
      return;
    }

    onLogActivity(staff.name, `${staff.division} - ${staff.role}`, 'Mencoba login berhasil');
    onLogin(staff);
  };

  const handlePasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setReqError('');
    setReqSuccess(false);

    if (!reqStaffId || !oldPassword || !newPassword) {
      setReqError('Harap lengkapi semua bidang.');
      return;
    }

    const staff = activeStaffList.find((s) => s.id === reqStaffId);
    if (!staff) {
      setReqError('Staff tidak ditemukan.');
      return;
    }

    const expectedPassword = staff.password || 'riz123';
    if (oldPassword.trim().toLowerCase() !== expectedPassword.toLowerCase()) {
      setReqError('Password lama salah.');
      return;
    }

    try {
      await saveCloudDoc('master_staff', reqStaffId, { passwordRequest: newPassword });
      try {
        const saved = localStorage.getItem('riz_master_staff_list');
        if (saved) {
          const list = JSON.parse(saved);
          const next = list.map((s: any) => s.id === reqStaffId ? { ...s, passwordRequest: newPassword } : s);
          localStorage.setItem('riz_master_staff_list', JSON.stringify(next));
        }
      } catch {}
      setReqSuccess(true);
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setReqError('Gagal mengirim pengajuan. Coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      
      {/* Left Column: Hero & Feature Hierarchy */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 xl:p-16 bg-slate-900 text-white relative overflow-hidden">
        {/* Decorative subtle gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 mb-8 border border-indigo-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-4xl xl:text-5xl font-display font-extrabold tracking-tight mb-4 leading-tight">
            RIZ-PRODUCTION
          </h1>
          <p className="text-lg text-slate-400 max-w-md">
            Sistem Logbook QC & Laporan Harian Terpusat.
          </p>
        </div>

        <div className="relative z-10 mt-12 space-y-8 flex-1 flex flex-col justify-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Arsitektur Sistem</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200">Operasional & QC</h4>
                <p className="text-sm text-slate-400 mt-1">Pencatatan Daily Task, Checklist QC, dan Work Order.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200">Manajemen Aset & Gudang</h4>
                <p className="text-sm text-slate-400 mt-1">Asset Tracking, Pemeliharaan Fasilitas, dan Armada.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200">SDM & Performa KPI</h4>
                <p className="text-sm text-slate-400 mt-1">Paspor Kompetensi, Absensi, dan Kalkulasi KPI Otomatis.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200">Analitik & Laporan</h4>
                <p className="text-sm text-slate-400 mt-1">Dashboard Eksekutif dan Cetak Laporan PDF.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 font-mono mt-12">
          Versi 1.1.0 • Enterprise System
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        {/* Mobile-only header since left column is hidden */}
        <div className="lg:hidden absolute top-8 left-8 right-8 text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">RIZ-PRODUCTION</h2>
          <p className="text-xs text-slate-500 mt-1">Sistem Logbook QC & Laporan Harian Terpusat.</p>
        </div>

        <div className="max-w-sm w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm mt-24 lg:mt-0">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
              Masuk
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-sans">
              Silakan pilih profil staf Anda untuk melanjutkan.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md space-y-4">
              <div>
                <label htmlFor="staff-select" className="block text-sm font-bold text-slate-700 mb-1">
                  Pilih Nama Staff ({activeStaffList.length} Terdaftar)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <select
                    id="staff-select"
                    value={selectedStaffId}
                    onChange={(e) => {
                      setSelectedStaffId(e.target.value);
                      setError('');
                    }}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 text-sm bg-slate-50/50"
                  >
                    <option value="">-- Pilih Anggota Staff --</option>
                    
                    {['Admin', 'Gudang', 'Audio', 'Lighting', 'Multimedia', 'Videotron', 'Service'].map(divName => {
                      const staffInDiv = activeStaffList.filter(s => s && s.division === divName);
                      if (staffInDiv.length === 0) return null;
                      const groupLabel = divName === 'Admin' ? 'ADMIN / MANAGEMENT'
                        : divName === 'Gudang' ? 'STAFF GUDANG'
                        : divName === 'Audio' ? 'SOUND (AUDIO) DIVISION'
                        : `${divName.toUpperCase()} DIVISION`;
                      return (
                        <optgroup key={divName} label={groupLabel}>
                          {staffInDiv.map(s => {
                            let displayRole: string = s?.role || 'Staff';
                            if (s?.id === 'director-wahyu' || s?.role === 'Owner') displayRole = 'Owner / Director';
                            const nick = s?.nickname && s.nickname.toLowerCase() !== s.name.toLowerCase() ? ` (${s.nickname})` : '';
                            return (
                              <option key={s.id} value={s.id}>{s.name}{nick} ({displayRole} - {s.division})</option>
                            );
                          })}
                        </optgroup>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-1">
                  Password <span className="text-[10px] text-slate-400 font-normal uppercase tracking-wider ml-1">(Default: riz123)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 text-sm bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-100 font-medium flex items-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LogIn className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300" />
                </span>
                Masuk ke Sistem
              </button>
            </div>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Ajukan Ganti Password
              </button>
            </div>
          </form>
          
          <div className="lg:hidden text-center text-xs text-slate-400 font-mono mt-8">
            Status: Sistem Siap • Versi 1.1.0
          </div>
        </div>
      </div>

      {/* Password Change Request Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-display font-bold text-slate-800 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-500" />
                Ajukan Ganti Password
              </h3>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {reqSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">Pengajuan Berhasil</h4>
                  <p className="text-sm text-slate-600">
                    Pengajuan ganti password Anda telah dikirim dan menunggu persetujuan Admin.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="w-full mt-4 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordRequest} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Staff</label>
                    <select
                      value={reqStaffId}
                      onChange={(e) => setReqStaffId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">-- Pilih Nama --</option>
                      {activeStaffList.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.division})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password Lama</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password Baru</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {reqError && (
                    <div className="text-red-600 text-xs bg-red-50 p-2 rounded-lg border border-red-100 font-medium">
                      {reqError}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Ajukan Perubahan
                    </button>
                    <p className="text-[11px] text-slate-500 text-center mt-3 font-medium">
                      Lupa password yang sudah diubah? Silakan hubungi Admin / Fahrul untuk mengembalikan password ke default (<span className="font-mono font-bold text-indigo-600">riz123</span>).
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
