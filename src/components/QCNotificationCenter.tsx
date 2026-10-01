import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  Filter,
  Clock,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  CheckCheck,
  Wrench,
  Music2,
  SunMedium,
  Tv,
  Laptop,
  Folder,
  ExternalLink
} from 'lucide-react';
import { DailyReport, LogbookEntry, Finding, OFFICIAL_GOOGLE_DRIVE_EVIDENCE_FOLDER_URL } from '../types';

interface QCNotificationCenterProps {
  dailyReports: DailyReport[];
  logbookEntries: LogbookEntry[];
  findings?: Finding[];
  lastSyncTime?: string | Date | null;
  onNavigateTab?: (tabId: string) => void;
  buttonClassName?: string;
  isMobileHeader?: boolean;
}

const READ_STORAGE_KEY = 'riz_qc_notification_last_read';

// Kata kunci spesifik temuan kendala / kerusakan nyata (bukan kata umum seperti service/repair biasa)
const STRICT_FINDING_TERMS = [
  'dead pixel',
  'ilang jalur',
  'hilang jalur',
  'kena ic',
  'mati total',
  'led merah mati',
  'warm separo',
  'separo',
  'suara serak',
  'serak',
  'error',
  'rusak 4 unit',
  'hilang 9 unit',
  '1 unit los',
  'los 1 unit',
  'ganti ptc',
  'minus breket',
  'blm clear',
  'belum clear',
  'kirim ke pib',
  'modul rusak'
];

export default function QCNotificationCenter({
  dailyReports,
  logbookEntries,
  findings = [],
  lastSyncTime,
  onNavigateTab,
  buttonClassName = '',
  isMobileHeader = false
}: QCNotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<string>('Semua');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NG' | 'OK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastReadTimestamp, setLastReadTimestamp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(READ_STORAGE_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Kunci scroll halaman ketika drawer terbuka & dengarkan tombol Escape
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Gabungkan aktivitas laporan harian & status QC dengan presisi data faktual
  const notifications = useMemo(() => {
    // Peta logbook otentik (mencocokkan berdasarkan tanggal + nama staf + potongan aktivitas)
    const logbookMap = new Map<string, LogbookEntry>();
    logbookEntries.forEach(log => {
      const staffNorm = String(log.staffName || '').toLowerCase().trim();
      const actNorm = String(log.activity || '').toLowerCase().trim().substring(0, 25);
      const key = `${log.date}_${staffNorm}_${actNorm}`;
      logbookMap.set(key, log);
    });

    const list = dailyReports
      .filter(r => r.date && r.activity && r.activity !== '-' && String(r.activity).trim() !== '')
      .map(rep => {
        const staffNorm = String(rep.staffName || '').toLowerCase().trim();
        const actNorm = String(rep.activity || '').toLowerCase().trim().substring(0, 25);
        const key = `${rep.date}_${staffNorm}_${actNorm}`;
        const relatedLog = logbookMap.get(key);

        const lowerAct = String(rep.activity || '').toLowerCase();
        const lowerNotes = String(rep.notes || '').toLowerCase();

        // Cek apakah item ini merupakan temuan kendala resmi
        const isOfficialFinding =
          relatedLog?.result === 'NG' ||
          findings.some(f => f.dateCreated === rep.date && lowerAct.includes(f.equipment.toLowerCase().split(' ')[0])) ||
          STRICT_FINDING_TERMS.some(term => lowerAct.includes(term) || lowerNotes.includes(term));

        // Catatan asli dari Google Sheet (hanya tampilkan jika memang ada catatan nyata)
        let cleanNotes = (rep.notes || '').trim();
        if (cleanNotes === '-' || cleanNotes.toLowerCase() === 'pengecekan selesai aman' && isOfficialFinding) {
          cleanNotes = '';
        }

        let itemTimestamp = 0;
        if (rep._syncMeta?.updatedAt) {
          const t = new Date(rep._syncMeta.updatedAt).getTime();
          if (!isNaN(t)) itemTimestamp = t;
        }
        if (!itemTimestamp && rep.id && rep.id.includes('-')) {
          const parts = rep.id.split('-');
          const ts = parseInt(parts[parts.length - 1], 10);
          if (!isNaN(ts) && ts > 1000000000000) {
            itemTimestamp = ts;
          }
        }
        if (!itemTimestamp) {
          const dateObj = new Date(`${rep.date}T17:00:00+07:00`);
          itemTimestamp = isNaN(dateObj.getTime()) ? Date.now() : dateObj.getTime();
        }

        return {
          id: rep.id,
          date: rep.date,
          staffName: rep.staffName,
          division: rep.division || 'Umum',
          activity: rep.activity,
          notes: cleanNotes,
          qcResult: (isOfficialFinding ? 'NG' : 'OK') as 'OK' | 'NG',
          timestamp: itemTimestamp,
          source: rep._source || 'google_sheet'
        };
      });

    // Urutkan dari tanggal terbaru ke terlama
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [dailyReports, logbookEntries, findings]);

  // Hitung jumlah notifikasi belum dibaca
  const unreadCount = useMemo(() => {
    const recent = notifications.slice(0, 15);
    const unread = recent.filter(n => n.timestamp > lastReadTimestamp);
    return unread.length;
  }, [notifications, lastReadTimestamp]);

  // Total kendala global
  const totalKendalaGlobal = useMemo(() => {
    return notifications.filter(n => n.qcResult === 'NG').length;
  }, [notifications]);

  // Statistik per divisi (total aktivitas & jumlah kendala per divisi)
  const divisionStats = useMemo(() => {
    const stats: Record<string, { total: number; ng: number }> = {
      Semua: { total: notifications.length, ng: totalKendalaGlobal }
    };
    notifications.forEach(n => {
      if (!stats[n.division]) {
        stats[n.division] = { total: 0, ng: 0 };
      }
      stats[n.division].total += 1;
      if (n.qcResult === 'NG') stats[n.division].ng += 1;
    });
    return stats;
  }, [notifications, totalKendalaGlobal]);

  // Filter notifikasi sesuai tab divisi, status, dan pencarian teks
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchDiv = selectedDivision === 'Semua' || n.division === selectedDivision;
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'NG' && n.qcResult === 'NG') ||
        (statusFilter === 'OK' && n.qcResult === 'OK');
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        query === '' ||
        n.staffName.toLowerCase().includes(query) ||
        n.activity.toLowerCase().includes(query) ||
        n.notes.toLowerCase().includes(query) ||
        n.division.toLowerCase().includes(query) ||
        n.date.includes(query);
      return matchDiv && matchStatus && matchSearch;
    });
  }, [notifications, selectedDivision, statusFilter, searchQuery]);

  // Hitung kendala PADA TAMPILAN YANG SEDANG DILIKAT (bukan global)
  const filteredKendalaCount = useMemo(() => {
    return filteredNotifications.filter(n => n.qcResult === 'NG').length;
  }, [filteredNotifications]);

  const handleOpenDrawer = () => {
    setIsOpen(true);
    const now = Date.now();
    setLastReadTimestamp(now);
    try {
      localStorage.setItem(READ_STORAGE_KEY, String(now));
    } catch {}
  };

  const handleMarkAllRead = () => {
    const now = Date.now();
    setLastReadTimestamp(now);
    try {
      localStorage.setItem(READ_STORAGE_KEY, String(now));
    } catch {}
  };

  const getDivisionIcon = (div: string) => {
    switch (div) {
      case 'Audio': return <Music2 className="w-3 h-3" />;
      case 'Lighting': return <SunMedium className="w-3 h-3" />;
      case 'Videotron': return <Tv className="w-3 h-3" />;
      case 'Service': return <Wrench className="w-3 h-3" />;
      case 'Multimedia': return <Laptop className="w-3 h-3" />;
      default: return <Layers className="w-3 h-3" />;
    }
  };

  const getDivisionColor = (div: string) => {
    switch (div) {
      case 'Audio': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Lighting': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Videotron': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Service': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Multimedia': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default: return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <>
      {/* Tombol Lonceng Notifikasi */}
      <button
        onClick={handleOpenDrawer}
        className={`relative flex items-center justify-center transition-all cursor-pointer ${
          isMobileHeader
            ? 'p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 active:scale-95'
            : buttonClassName ||
              'px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs hover:border-slate-300 active:scale-95'
        }`}
        title="Buka Notifikasi QC & Aktivitas Staf per Divisi"
      >
        <div className="relative flex items-center">
          <Bell className="w-4 h-4 text-blue-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-600 text-white text-[9px] font-black shadow-xs ring-2 ring-white animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>

        {!isMobileHeader && (
          <span className="ml-1.5 hidden lg:inline text-xs font-bold text-slate-700">
            Notifikasi QC
          </span>
        )}

        {!isMobileHeader && totalKendalaGlobal > 0 && (
          <span className="ml-1.5 hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
            {totalKendalaGlobal} Kendala
          </span>
        )}
      </button>

      {/* Modern Slide-Over Drawer Notifikasi via Portal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-hidden" role="dialog" aria-modal="true">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Full-Height Drawer Panel - Langsung Terikat ke Viewport (100vh) */}
          <div
            className="fixed top-0 right-0 bottom-0 z-[10000] w-full sm:max-w-lg md:max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden animate-in slide-in-from-right duration-250 ease-out"
            onClick={e => e.stopPropagation()}
            style={{ height: '100vh', maxHeight: '100vh' }}
          >
            {/* Top Header - Compact & Elegant */}
            <div className="shrink-0 bg-[#0f172a] text-white px-4 py-3 border-b border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                          Notifikasi QC & Checklist Staf
                        </h2>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[8px] font-mono font-bold uppercase tracking-wider shrink-0">
                          Auto-Update
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        Sumber Resmi Google Sheet • PT. Riz Production Multi Kreasi
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={handleMarkAllRead}
                      className="px-2 py-1 text-[10px] font-bold text-blue-300 hover:text-white hover:bg-slate-800 rounded transition-colors flex items-center gap-1 cursor-pointer"
                      title="Tandai semua sudah dibaca"
                    >
                      <CheckCheck className="w-3 h-3 text-blue-400" />
                      <span className="hidden sm:inline">Tandai Dibaca</span>
                    </button>
                    <a
                      href={OFFICIAL_GOOGLE_DRIVE_EVIDENCE_FOLDER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded-md text-[10px] font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 flex items-center gap-1 transition-colors cursor-pointer"
                      title="Buka Folder Google Drive Bukti Resmi"
                    >
                      <Folder className="w-3 h-3 text-amber-300" />
                      <span className="hidden sm:inline">Drive Bukti</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                    </a>

                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Tutup (Esc)"
                      aria-label="Tutup"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Toolbar Kompak (Pills Divisi + Search + Filter Status) */}
              <div className="flex-none px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 space-y-2">
                {/* Baris 1: Filter Divisi (Pills Ringkas dan Rapi) */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {['Semua', 'Audio', 'Videotron', 'Lighting', 'Service', 'Multimedia'].map(div => {
                    const stats = divisionStats[div] || { total: 0, ng: 0 };
                    const isSelected = selectedDivision === div;
                    return (
                      <button
                        key={div}
                        onClick={() => setSelectedDivision(div)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {getDivisionIcon(div)}
                        <span>{div}</span>
                        <span
                          className={`text-[9px] px-1 py-0.1 rounded font-mono ${
                            isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {stats.total}
                        </span>
                        {stats.ng > 0 && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-rose-300' : 'bg-rose-500'
                            }`}
                            title={`${stats.ng} kendala`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Baris 2: Search Input + Status Filter Toggle */}
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari staf, alat, kegiatan..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-7 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Toggle Status QC */}
                  <div className="flex items-center bg-white border border-slate-300 rounded p-0.5 shrink-0 text-[10px] font-bold">
                    <button
                      onClick={() => setStatusFilter('ALL')}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        statusFilter === 'ALL'
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Semua
                    </button>
                    <button
                      onClick={() => setStatusFilter('NG')}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        statusFilter === 'NG'
                          ? 'bg-rose-600 text-white'
                          : 'text-rose-700 hover:bg-rose-50'
                      }`}
                      title="Hanya unit kendala"
                    >
                      Kendala
                    </button>
                    <button
                      onClick={() => setStatusFilter('OK')}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        statusFilter === 'OK'
                          ? 'bg-emerald-600 text-white'
                          : 'text-emerald-700 hover:bg-emerald-50'
                      }`}
                      title="Hanya unit aman"
                    >
                      Aman
                    </button>
                  </div>
                </div>
              </div>

              {/* Feed Notifikasi - Ruang Luas untuk Konten (75%+ Layar) */}
              <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2.5 bg-slate-100/70">
                {filteredNotifications.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <Clock className="w-8 h-8 mx-auto text-slate-300 mb-1.5" />
                    <p className="text-xs font-semibold text-slate-600">
                      Tidak ada rekaman aktivitas yang sesuai filter
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Ganti pilihan divisi atau kata kunci pencarian
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map(item => {
                    const isNg = item.qcResult === 'NG';
                    return (
                      <div
                        key={item.id}
                        className={`rounded-lg border bg-white transition-all shadow-xs overflow-hidden ${
                          isNg
                            ? 'border-l-4 border-l-rose-500 border-slate-200'
                            : 'border-l-4 border-l-emerald-500 border-slate-200'
                        }`}
                      >
                        <div className="p-3">
                          {/* Header Kartu: Staf, Divisi, Tanggal & Status */}
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {item.staffName}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getDivisionColor(
                                  item.division
                                )}`}
                              >
                                {item.division}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-mono text-slate-400 font-semibold">
                                {item.date}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  isNg
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {isNg ? (
                                  <>
                                    <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
                                    <span>Kendala</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                    <span>Aman</span>
                                  </>
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Isi Literal Pekerjaan dari Google Sheet */}
                          <div
                            className={`rounded p-2 text-xs font-medium leading-relaxed mb-1.5 ${
                              isNg
                                ? 'bg-rose-50/50 text-rose-950 border border-rose-100'
                                : 'bg-slate-50 text-slate-800 border border-slate-100'
                            }`}
                          >
                            <p className="whitespace-pre-line">{item.activity}</p>
                          </div>

                          {/* Keterangan Asli jika ada di Google Sheet */}
                          {item.notes && item.notes.trim() !== '' && (
                            <div
                              className={`text-[11px] rounded p-1.5 px-2 mb-1.5 border-l-2 ${
                                isNg
                                  ? 'bg-rose-100/60 text-rose-900 border-l-rose-500 border border-rose-200/60'
                                  : 'bg-amber-50/70 text-amber-900 border-l-amber-500 border border-amber-200/60'
                              }`}
                            >
                              <span className="font-bold mr-1">Catatan:</span>
                              <span className="whitespace-pre-line">{item.notes}</span>
                            </div>
                          )}

                          {/* Keterangan tindak lanjut jika kendala */}
                          {isNg && (!item.notes || item.notes.trim() === '') && (
                            <div className="text-[10px] rounded p-1.5 px-2 bg-rose-50 text-rose-800 border border-rose-200/60 flex items-center gap-1 mb-1.5 font-medium">
                              <Wrench className="w-3 h-3 text-rose-600 shrink-0" />
                              <span>Tercatat kendala teknis, memerlukan penanganan service.</span>
                            </div>
                          )}

                          {/* Footer Sumber Resmi */}
                          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                            <span>Google Sheet Resmi (GID: 198998470)</span>
                            <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              Tervalidasi
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Footer - Ringkas & Perhitungan Faktual Tepat */}
              <div className="flex-none px-4 py-2.5 bg-white border-t border-slate-200 flex items-center justify-between">
                <div className="text-[11px] font-bold text-slate-600">
                  <span>{filteredNotifications.length} Aktivitas Ditampilkan</span>
                  {filteredKendalaCount > 0 ? (
                    <span className="ml-1 text-rose-600 font-bold">
                      ({filteredKendalaCount} kendala)
                    </span>
                  ) : (
                    <span className="ml-1 text-emerald-600 font-medium">(semua aman)</span>
                  )}
                </div>

                {onNavigateTab && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onNavigateTab('qc');
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>Modul QC Lengkap</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
        </div>,
        document.body
      )}
    </>
  );
}
