/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { STAFF_LIST, getMasterStaffList, normalizeStaffMaster } from '../data';
import { Staff } from '../types';
import { LogIn, Shield, User, Key, ClipboardList, Package, Award, LayoutDashboard, X, Lock, CheckCircle, RotateCcw, AlertCircle, Smartphone, Download, Share } from 'lucide-react';
import { subscribeCloudCollection, saveCloudDoc } from '../lib/cloudSync';
import { pullCollectionFromSupabase, syncStaffPasswordVault } from '../lib/supabaseSync';

interface LoginScreenProps {
  onLogin: (staff: Staff) => void;
  onLogActivity: (username: string, role: string, action: string) => void;
  staffList?: Staff[];
  onInstallPWA?: () => void;
  canInstallPWA?: boolean;
  isAppInstalled?: boolean;
  isIOSDevice?: boolean;
}

export default function LoginScreen({
  onLogin,
  onLogActivity,
  staffList: propsStaffList,
  onInstallPWA,
  canInstallPWA,
  isAppInstalled = false,
  isIOSDevice = false
}: LoginScreenProps) {
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showMobileInstallGuide, setShowMobileInstallGuide] = useState(false);
  const [localPromptEvent, setLocalPromptEvent] = useState<any>(() =>
    typeof window !== 'undefined' ? (window as any).__rizDeferredPwaPrompt || null : null
  );

  useEffect(() => {
    const syncPrompt = (e?: any) => {
      const promptObj = e?.detail || (typeof window !== 'undefined' ? (window as any).__rizDeferredPwaPrompt : null) || e;
      if (promptObj && typeof promptObj.prompt === 'function') {
        setLocalPromptEvent(promptObj);
      }
    };
    syncPrompt();
    window.addEventListener('beforeinstallprompt', syncPrompt);
    window.addEventListener('riz-pwa-prompt-ready', syncPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', syncPrompt);
      window.removeEventListener('riz-pwa-prompt-ready', syncPrompt);
    };
  }, []);

  const isAndroidDevice =
    typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '');

  const handleDownloadAppLauncher = () => {
    try {
      const targetOrigin =
        typeof window !== 'undefined' && window.location?.origin
          ? window.location.origin
          : 'https://log-task-book-riz-production-app.vercel.app';
      const launcherHtml = `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
  <meta name="theme-color" content="#0f172a" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="RIZ-PROLOG" />
  <link rel="icon" type="image/png" href="${targetOrigin}/icon-192.png" />
  <link rel="apple-touch-icon" href="${targetOrigin}/apple-touch-icon.png" />
  <title>RIZ-PRO LOG — App Launcher</title>
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #0f172a; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; }
    .box { text-align: center; padding: 24px; max-width: 360px; }
    .logo { width: 72px; height: 72px; border-radius: 16px; margin-bottom: 16px; border: 1px solid #334155; }
    .title { font-size: 18px; font-weight: 800; margin-bottom: 6px; }
    .sub { font-size: 12px; color: #94a3b8; margin-bottom: 20px; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 20px; border-radius: 10px; }
  </style>
  <script>
    window.location.replace("${targetOrigin}/?source=pwa_launcher");
  </script>
</head>
<body>
  <div class="box">
    <img class="logo" src="${targetOrigin}/icon-192.png" alt="RIZ-PRO LOG" />
    <div class="title">RIZ-PRO LOG</div>
    <div class="sub">Membuka Sistem Operasional & QC PT. Riz Production Multi Kreasi...</div>
    <a class="btn" href="${targetOrigin}/?source=pwa_launcher">Buka Aplikasi Sekarang</a>
  </div>
</body>
</html>`;
      const blob = new Blob([launcherHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'RIZ-PROLOG-App.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (_e) {}
  };

  const handleOpenInAndroidChrome = () => {
    try {
      const hostAndPath = `${window.location.host}${window.location.pathname}${window.location.search}`;
      const scheme = window.location.protocol.replace(':', '') || 'https';
      window.location.href = `intent://${hostAndPath}#Intent;scheme=${scheme};package=com.android.chrome;end`;
    } catch (_e) {}
  };

  const handleTriggerInstall = async () => {
    const promptEvt =
      localPromptEvent ||
      (typeof window !== 'undefined' ? (window as any).__rizDeferredPwaPrompt : null);

    if (promptEvt && typeof promptEvt.prompt === 'function') {
      try {
        await promptEvt.prompt();
        const choice = await promptEvt.userChoice;
        setLocalPromptEvent(null);
        if (typeof window !== 'undefined') {
          (window as any).__rizDeferredPwaPrompt = null;
        }
        if (choice && choice.outcome === 'accepted') {
          return;
        }
      } catch (_err) {}
    }

    if (canInstallPWA && onInstallPWA) {
      onInstallPWA();
    } else {
      setShowMobileInstallGuide(true);
    }
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [modalMode, setModalMode] = useState<'change' | 'forgot'>('change');
  const [reqStaffId, setReqStaffId] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [reqError, setReqError] = useState('');
  const [reqSuccess, setReqSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successStaffName, setSuccessStaffName] = useState('');

  const [localStaffList, setLocalStaffList] = useState<Staff[]>(() => getMasterStaffList());
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Keep synced with cloud and prop updates
  useEffect(() => {
    if (propsStaffList && propsStaffList.length > 0) {
      setLocalStaffList(prev => normalizeStaffMaster([...propsStaffList, ...prev]));
    }
  }, [propsStaffList]);

  useEffect(() => {
    const unsub = subscribeCloudCollection<Staff>(
      'master_staff',
      'riz_master_staff_list',
      (items) => {
        if (Array.isArray(items)) {
          setLocalStaffList(prev => normalizeStaffMaster([...prev, ...items]));
        }
      },
      STAFF_LIST
    );
    pullCollectionFromSupabase('master_staff').catch(() => {});
    return () => unsub();
  }, []);

  const activeStaffList = normalizeStaffMaster([
    ...(propsStaffList || []),
    ...localStaffList
  ]);

  const handleLogin = async (e: React.FormEvent) => {
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

    // Check against custom password or default master password riz123 (case-insensitive & trim whitespace)
    const expectedPassword = (staff.password || 'riz123').trim();
    const inputPassword = password.trim() || 'riz123';

    if (
      inputPassword.toLowerCase() === expectedPassword.toLowerCase() ||
      inputPassword.toLowerCase() === 'riz123'
    ) {
      onLogActivity(staff.name, `${staff.division} - ${staff.role}`, 'Mencoba login berhasil');
      onLogin(staff);
      return;
    }

    // Fallback real-time ke Supabase jika password lokal tidak cocok
    // (Menjamin staf yang baru disetujui ganti password langsung bisa login seketika dari perangkat/browser manapun)
    setIsLoggingIn(true);
    setError('');
    let isPendingRequestMatch = Boolean(
      staff.passwordRequest &&
      staff.passwordRequest !== 'RESET_REQUEST_DEFAULT' &&
      inputPassword.toLowerCase() === staff.passwordRequest.trim().toLowerCase()
    );

    try {
      const { supabase, isSupabaseConfigured } = await import('../lib/supabase');
      if (isSupabaseConfigured && supabase) {
        const [{ data: remoteRow, error: remoteErr }, { data: vaultRow }] = await Promise.all([
          supabase
            .from('master_staff')
            .select('*')
            .eq('id', staff.id)
            .maybeSingle(),
          supabase
            .from('system_configs')
            .select('data')
            .eq('key', 'staff_passwords_v1')
            .maybeSingle()
        ]);

        const vaultEntry = (vaultRow?.data && typeof vaultRow.data === 'object' && !Array.isArray(vaultRow.data))
          ? (vaultRow.data as Record<string, any>)[staff.id]
          : null;

        const rowTime = remoteRow?.updated_at ? new Date(remoteRow.updated_at).getTime() : 0;
        const vaultTime = vaultEntry?.updatedAt ? new Date(vaultEntry.updatedAt).getTime() : 0;

        const candidatePasswords = new Set<string>();
        if (remoteRow?.password) candidatePasswords.add(String(remoteRow.password).trim());
        if (vaultEntry?.password) candidatePasswords.add(String(vaultEntry.password).trim());

        const matchedPw = Array.from(candidatePasswords).find(
          pw => pw && inputPassword.toLowerCase() === pw.toLowerCase()
        );

        if (matchedPw) {
          const { formatFromSupabase } = await import('../lib/supabaseSync');
          const formatted = (remoteRow && !remoteErr)
            ? (formatFromSupabase('master_staff', remoteRow) as Staff)
            : staff;
          const nowIso = (vaultTime >= rowTime ? vaultEntry?.updatedAt : remoteRow?.updated_at) || new Date().toISOString();
          const mergedStaff: Staff = {
            ...staff,
            ...formatted,
            password: matchedPw,
            passwordRequest: '',
            _userEdited: true,
            _syncMeta: {
              updatedAt: nowIso,
              updatedBy: vaultEntry?.updatedBy || 'Supabase Cloud Sync',
              _userEdited: true
            }
          } as Staff;

          await syncStaffPasswordVault(staff.id, matchedPw, '', vaultEntry?.updatedBy || staff.name, nowIso);

          // Update cache lokal langsung
          try {
            const saved = localStorage.getItem('riz_master_staff_list');
            let list = saved ? JSON.parse(saved) : [];
            if (Array.isArray(list)) {
              const idx = list.findIndex((s: any) => s.id === staff.id);
              if (idx >= 0) list[idx] = { ...list[idx], ...mergedStaff };
              else list.unshift(mergedStaff);
              localStorage.setItem('riz_master_staff_list', JSON.stringify(list));
            }
            window.dispatchEvent(new CustomEvent('riz_collection_updated', {
              detail: { collectionName: 'master_staff', docId: staff.id, data: mergedStaff }
            }));
          } catch {}

          setLocalStaffList(prev => normalizeStaffMaster(prev.map(s => s.id === staff.id ? mergedStaff : s)));
          onLogActivity(staff.name, `${staff.division} - ${staff.role}`, 'Mencoba login berhasil (sinkronisasi cloud)');
          onLogin(mergedStaff);
          setIsLoggingIn(false);
          return;
        }

        const remoteReq = String(vaultEntry?.passwordRequest || remoteRow?.password_request || '').trim();
        if (remoteReq && remoteReq !== 'RESET_REQUEST_DEFAULT' && inputPassword.toLowerCase() === remoteReq.toLowerCase()) {
          isPendingRequestMatch = true;
        }
      }
    } catch (cloudErr) {
      console.warn('Real-time password check fallback error:', cloudErr);
    } finally {
      setIsLoggingIn(false);
    }

    if (isPendingRequestMatch) {
      setError('Password baru yang Anda ajukan masih menunggu persetujuan (Approve) dari Admin. Sementara menunggu, Anda dapat masuk menggunakan password sebelumnya atau default (riz123).');
      return;
    }

    setError('Password salah! Silakan coba lagi.');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReqError('');
    setReqSuccess(false);

    if (!reqStaffId) {
      setReqError('Silakan pilih nama staff terlebih dahulu.');
      return;
    }

    const staff = activeStaffList.find((s) => s.id === reqStaffId);
    if (!staff) {
      setReqError('Data staff tidak ditemukan.');
      return;
    }

    // MODE 1: GANTI PASSWORD LANGSUNG (Verifikasi Password Lama)
    if (modalMode === 'change') {
      if (!oldPassword) {
        setReqError('Silakan masukkan password lama Anda.');
        return;
      }
      if (!newPassword) {
        setReqError('Silakan masukkan password baru.');
        return;
      }
      if (newPassword.trim().length < 4) {
        setReqError('Password baru minimal 4 karakter.');
        return;
      }
      if (!confirmPassword) {
        setReqError('Silakan ulangi password baru pada kolom konfirmasi.');
        return;
      }
      if (newPassword.trim() !== confirmPassword.trim()) {
        setReqError('Konfirmasi password baru tidak cocok!');
        return;
      }

      const expectedPassword = (staff.password || 'riz123').trim();
      const cleanOldInput = oldPassword.trim();
      let isOldPasswordValid =
        cleanOldInput.toLowerCase() === expectedPassword.toLowerCase() ||
        cleanOldInput.toLowerCase() === 'riz123';

      if (!isOldPasswordValid) {
        try {
          const { supabase, isSupabaseConfigured } = await import('../lib/supabase');
          if (isSupabaseConfigured && supabase) {
            const [{ data: remoteRow }, { data: vaultRow }] = await Promise.all([
              supabase.from('master_staff').select('password').eq('id', reqStaffId).maybeSingle(),
              supabase.from('system_configs').select('data').eq('key', 'staff_passwords_v1').maybeSingle()
            ]);
            const remotePw = String(remoteRow?.password || '').trim();
            const vaultPw = String((vaultRow?.data as any)?.[reqStaffId]?.password || '').trim();
            if (
              (remotePw && cleanOldInput.toLowerCase() === remotePw.toLowerCase()) ||
              (vaultPw && cleanOldInput.toLowerCase() === vaultPw.toLowerCase())
            ) {
              isOldPasswordValid = true;
            }
          }
        } catch {}
      }

      if (!isOldPasswordValid) {
        setReqError('Password lama salah! Jika Anda lupa password lama, silakan gunakan opsi "Lupa Password".');
        return;
      }

      if (newPassword.trim().toLowerCase() === cleanOldInput.toLowerCase()) {
        setReqError('Password baru tidak boleh sama dengan password saat ini.');
        return;
      }

      try {
        const cleanNewPassword = newPassword.trim();
        const nowIso = new Date().toISOString();
        const updatedStaff: Staff = {
          ...staff,
          password: cleanNewPassword,
          passwordRequest: '', // Bersihkan antrean pengajuan lama jika ada
          _userEdited: true,
          _syncMeta: {
            updatedAt: nowIso,
            updatedBy: staff.name,
            _userEdited: true
          }
        } as Staff;

        // 1. Perbarui state lokal LoginScreen & localStorage secara sinkron
        setLocalStaffList(prev => {
          const next = prev.map(s => s.id === reqStaffId ? updatedStaff : s);
          return normalizeStaffMaster(next);
        });

        try {
          const saved = localStorage.getItem('riz_master_staff_list');
          let list = saved ? JSON.parse(saved) : [];
          if (Array.isArray(list)) {
            const idx = list.findIndex((s: any) => s.id === reqStaffId);
            if (idx >= 0) {
              list[idx] = { ...list[idx], ...updatedStaff };
            } else {
              list.unshift(updatedStaff);
            }
          } else {
            list = [updatedStaff];
          }
          localStorage.setItem('riz_master_staff_list', JSON.stringify(list));
        } catch (err) {
          console.warn('LocalStorage error:', err);
        }

        // 2. Simpan ke sistem cloud & vault dengan data staf lengkap
        await saveCloudDoc('master_staff', reqStaffId, updatedStaff, staff.name);

        // 3. Catat aktivitas audit
        onLogActivity(staff.name, `${staff.division} - ${staff.role}`, 'Mengganti password akun (langsung aktif)');

        // 4. Pre-fill login screen dengan nama staf & password baru
        setSelectedStaffId(reqStaffId);
        setPassword(cleanNewPassword);
        setError('');

        setSuccessStaffName(staff.name);
        setSuccessMessage(`Password untuk ${staff.name} berhasil diubah dan langsung aktif! Anda dapat langsung masuk sekarang.`);
        setReqSuccess(true);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (err) {
        console.error('Error updating password:', err);
        setReqError('Gagal mengubah password. Silakan periksa koneksi internet Anda.');
      }
    } 
    // MODE 2: LUPA PASSWORD / AJUKAN GANTI PASSWORD KE ADMIN
    else {
      try {
        let desiredPw = '';
        if (newPassword.trim()) {
          if (newPassword.trim().length < 4) {
            setReqError('Password baru yang diinginkan minimal 4 karakter.');
            return;
          }
          if (newPassword.trim() !== confirmPassword.trim()) {
            setReqError('Konfirmasi password baru tidak cocok!');
            return;
          }
          desiredPw = newPassword.trim();
        }

        const requestValue = desiredPw || 'RESET_REQUEST_DEFAULT';
        const nowIso = new Date().toISOString();
        const updatedStaff: Staff = {
          ...staff,
          passwordRequest: requestValue,
          _userEdited: true,
          _syncMeta: {
            updatedAt: nowIso,
            updatedBy: staff.name,
            _userEdited: true
          }
        } as Staff;

        setLocalStaffList(prev => {
          const next = prev.map(s => s.id === reqStaffId ? updatedStaff : s);
          return normalizeStaffMaster(next);
        });

        try {
          const saved = localStorage.getItem('riz_master_staff_list');
          if (saved) {
            const list = JSON.parse(saved);
            const next = list.map((s: any) => s.id === reqStaffId ? { ...s, ...updatedStaff } : s);
            localStorage.setItem('riz_master_staff_list', JSON.stringify(next));
          }
        } catch {}

        await saveCloudDoc('master_staff', reqStaffId, updatedStaff, staff.name);

        if (desiredPw) {
          setSelectedStaffId(reqStaffId);
          setPassword(desiredPw);
        }

        const logMsg = desiredPw 
          ? `Mengajukan permohonan ganti password baru ke Admin` 
          : 'Mengajukan permohonan reset password ke default ke Admin';
        onLogActivity(staff.name, `${staff.division} - ${staff.role}`, logMsg);

        setSuccessStaffName(staff.name);
        const successTxt = desiredPw
          ? `Permohonan ganti password baru untuk ${staff.name} telah dikirim ke Admin. Setelah disetujui di Admin Panel, Anda dapat langsung masuk menggunakan password baru tersebut.`
          : `Permohonan reset password untuk ${staff.name} telah dikirim ke Admin. Admin (Fahrul / Syalsa / Seno) dapat mengembalikan password Anda ke default (riz123) melalui Admin Panel.`;
        setSuccessMessage(successTxt);
        setReqSuccess(true);
        setNewPassword('');
        setConfirmPassword('');
      } catch (err) {
        setReqError('Gagal mengirim pengajuan reset. Coba lagi.');
      }
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
                      const val = e.target.value;
                      setSelectedStaffId(val);
                      setError('');
                      if (val) {
                        pullCollectionFromSupabase('master_staff')
                          .then((cloudStaff) => {
                            if (Array.isArray(cloudStaff) && cloudStaff.length > 0) {
                              setLocalStaffList(normalizeStaffMaster(cloudStaff));
                            }
                          })
                          .catch(() => {});
                      }
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
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
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

            <div className="space-y-2.5">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm disabled:opacity-75 cursor-pointer"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {isLoggingIn ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <LogIn className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300" />
                  )}
                </span>
                {isLoggingIn ? 'Memverifikasi Cloud...' : 'Masuk ke Sistem'}
              </button>

              {!isAppInstalled && (
                <button
                  type="button"
                  onClick={handleTriggerInstall}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
                  title="Install aplikasi RIZ-PRO LOG ke layar utama ponsel (Android / iOS)"
                >
                  <Smartphone className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    {isIOSDevice
                      ? 'Install Aplikasi ke Ponsel (iPhone / iOS)'
                      : 'Install Aplikasi ke Ponsel (Android / iOS)'}
                  </span>
                  <Download className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                </button>
              )}
            </div>
            <div className="text-center mt-4 flex items-center justify-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setModalMode('change');
                  setReqStaffId(selectedStaffId || '');
                  setOldPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setReqError('');
                  setReqSuccess(false);
                  setShowPasswordModal(true);
                }}
                className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                Ganti Password
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => {
                  setModalMode('forgot');
                  setReqStaffId(selectedStaffId || '');
                  setOldPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setReqError('');
                  setReqSuccess(false);
                  setShowPasswordModal(true);
                }}
                className="font-medium text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
              >
                Lupa Password?
              </button>
            </div>
          </form>
          
          <div className="lg:hidden text-center text-xs text-slate-400 font-mono mt-8">
            Status: Sistem Siap • Versi 1.1.0
          </div>
        </div>
      </div>

      {/* Password Management Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-display font-bold text-slate-800 flex items-center gap-2 text-sm">
                <Lock className="w-4 h-4 text-indigo-500" />
                {modalMode === 'change' ? 'Ganti Password Akun' : 'Lupa Password / Reset'}
              </h3>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tab navigation */}
            {!reqSuccess && (
              <div className="flex border-b border-slate-100 bg-slate-50/60 p-1.5 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setModalMode('change');
                    setReqError('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    modalMode === 'change'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Ganti Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalMode('forgot');
                    setReqError('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    modalMode === 'forgot'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Lupa Password?
                </button>
              </div>
            )}
            
            <div className="p-6">
              {reqSuccess ? (
                <div className="text-center py-4 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800">
                    {modalMode === 'change' ? 'Password Berhasil Diubah & Aktif!' : 'Permintaan Reset Terkirim!'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                    {successMessage}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setReqSuccess(false);
                    }}
                    className="w-full mt-2 bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer text-xs"
                  >
                    {modalMode === 'change' ? 'Masuk ke Sistem Sekarang' : 'Tutup'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Nama Staf</label>
                    <select
                      value={reqStaffId}
                      onChange={(e) => setReqStaffId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                    >
                      <option value="">-- Pilih Staf --</option>
                      {activeStaffList.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.division} - {s.role})</option>
                      ))}
                    </select>
                  </div>

                  {modalMode === 'change' ? (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Password Lama <span className="text-[10px] text-slate-400 font-normal">(Default: riz123)</span>
                        </label>
                        <input
                          type="password"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                          placeholder="Masukkan password saat ini"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Password Baru</label>
                        <input
                          type="password"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                          placeholder="Minimal 4 karakter"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Password Baru</label>
                        <input
                          type="password"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                          placeholder="Ketik ulang password baru"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-xl text-amber-900 text-xs space-y-1.5 leading-relaxed">
                        <div className="font-bold flex items-center gap-1.5 text-amber-800">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Pengajuan Ganti Password / Reset</span>
                        </div>
                        <p className="text-[11px] text-amber-700">
                          Ketik password baru yang Anda inginkan di bawah agar disetujui Admin, atau kosongkan jika ingin mereset password ke default (<span className="font-mono font-bold">riz123</span>).
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Password Baru yang Diinginkan <span className="text-[10px] text-slate-400 font-normal">(Opsional)</span>
                        </label>
                        <input
                          type="password"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                          placeholder="Kosongkan jika ingin reset ke riz123"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                        />
                      </div>

                      {newPassword.trim().length > 0 && (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Password Baru</label>
                          <input
                            type="password"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            placeholder="Ketik ulang password baru"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {reqError && (
                    <div className="text-red-600 text-xs bg-red-50 p-2.5 rounded-lg border border-red-100 font-medium flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{reqError}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer text-xs flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        {modalMode === 'change'
                          ? 'Simpan & Aktifkan Password Baru'
                          : (newPassword.trim() ? 'Kirim Pengajuan Password ke Admin' : 'Kirim Permintaan Reset ke Default')}
                      </span>
                    </button>
                    {modalMode === 'change' && (
                      <p className="text-[10px] text-slate-400 text-center mt-2.5">
                        Password baru langsung aktif seketika setelah disimpan tanpa menunggu persetujuan Admin.
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile App Install Instructions Modal (Accessible directly from Login Screen) */}
      {showMobileInstallGuide && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] text-white border border-slate-700 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Install Aplikasi RIZ-PRO LOG di Ponsel</h3>
                  <p className="text-[11px] text-slate-400">Pasang di layar utama Android atau iPhone/iPad (iOS)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileInstallGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              {(canInstallPWA || Boolean(localPromptEvent)) && (
                <button
                  type="button"
                  onClick={async () => {
                    setShowMobileInstallGuide(false);
                    if (localPromptEvent && typeof localPromptEvent.prompt === 'function') {
                      try {
                        await localPromptEvent.prompt();
                      } catch (_e) {}
                    } else if (onInstallPWA) {
                      onInstallPWA();
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Install Otomatis Sekarang</span>
                </button>
              )}

              {isAndroidDevice && (
                <button
                  type="button"
                  onClick={handleOpenInAndroidChrome}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Buka di Google Chrome & Install (Android)</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleDownloadAppLauncher}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Download Pemasang Aplikasi (Ponsel / Desktop)</span>
              </button>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-blue-400 text-xs flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Ponsel Android (Chrome):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                  <li>Ketuk ikon menu <strong>Titik Tiga (⋮)</strong> di pojok kanan atas browser Chrome.</li>
                  <li>Pilih menu <strong>"Install aplikasi"</strong> atau <strong>"Tambahkan ke layar utama" (Add to Home screen)</strong>.</li>
                  <li>Tekan <strong>Install / Tambah</strong> untuk menyelesaikan pemasangan.</li>
                </ol>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-indigo-400 text-xs flex items-center gap-1.5">
                  <Share className="w-3.5 h-3.5" />
                  <span>iPhone / iPad (iOS Safari):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                  <li>Buka halaman ini di browser <strong>Safari</strong>.</li>
                  <li>Ketuk tombol <strong>Bagikan / Share</strong> (ikon kotak dengan panah ke atas) di bagian bawah layar.</li>
                  <li>Pilih <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong> lalu ketuk <strong>Tambah / Add</strong>.</li>
                </ol>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowMobileInstallGuide(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-blue-500/20"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
