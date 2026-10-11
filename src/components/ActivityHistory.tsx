/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserActivity } from '../types';
import { History, Search, Trash2, Clock, ShieldAlert } from 'lucide-react';

interface ActivityHistoryProps {
  activities: UserActivity[];
  onClearActivities: () => void;
  currentUser: any;
}

export default function ActivityHistory({
  activities,
  onClearActivities,
  currentUser,
}: ActivityHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = activities.filter((act) => {
    // Sesuai instruksi: aktifitas server untuk proses penarikan atau pengiriman data tidak perlu dimunculkan atau ditampilkan
    const isServerSync =
      act.role === 'Server' ||
      act.username === 'System Auto-Sync' ||
      act.username === 'System Boot' ||
      String(act.action || '').toLowerCase().includes('sinkronisasi') ||
      String(act.action || '').toLowerCase().includes('auto-sync') ||
      String(act.action || '').toLowerCase().includes('penarikan') ||
      String(act.action || '').toLowerCase().includes('pengiriman');
    if (isServerSync) return false;

    return act.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
           act.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
           act.action.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Riwayat Aktivitas Pengguna</h1>
          <p className="text-xs text-slate-500">Log audit real-time seluruh tindakan, perubahan status QC, dan pelaporan staff</p>
        </div>
        {(currentUser.role === 'Admin' || currentUser.role === 'Manager') && (
          <button
            onClick={() => {
              if (confirm('Yakin ingin membersihkan seluruh log audit ini? Tindakan ini tidak dapat dibatalkan.')) {
                onClearActivities();
              }
            }}
            className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Bersihkan Log Aktivitas</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama staff, role, atau deskripsi aktivitas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700"
          />
        </div>
      </div>

      {/* Log Feed */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100 max-w-4xl mx-auto">
        <div className="p-4 bg-slate-50 font-mono text-xs text-slate-500 flex justify-between uppercase font-bold tracking-wider">
          <span>Aktivitas & Log System</span>
          <span>Waktu Tindakan</span>
        </div>

        {filtered.map((act) => {
          return (
            <div key={act.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">
                    {act.username}{' '}
                    <span className="text-xs text-slate-400 font-mono font-normal bg-slate-100 px-1.5 py-0.2 rounded ml-1">
                      {act.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{act.action}</div>
                </div>
              </div>
              <div className="text-xs text-slate-400 font-mono self-end sm:self-auto shrink-0">
                {act.timestamp}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-400 italic">
            Belum ada catatan aktivitas system atau hasil pencarian tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
