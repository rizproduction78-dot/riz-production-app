/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { STAFF_LIST } from '../data';
import { Staff } from '../types';
import { LogIn, Shield, Users, User, Key } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (staff: Staff) => void;
  onLogActivity: (username: string, role: string, action: string) => void;
}

export default function LoginScreen({ onLogin, onLogActivity }: LoginScreenProps) {
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) {
      setError('Silakan pilih nama staff terlebih dahulu.');
      return;
    }

    const staff = STAFF_LIST.find((s) => s.id === selectedStaffId);
    if (!staff) {
      setError('Staff tidak ditemukan.');
      return;
    }

    // Simple default password for quick demo access, or just allow instant login with visual password.
    // Password is 'riz123' for simplicity but we let them bypass if they just want to select and log in.
    if (password && password !== 'riz123') {
      setError('Password salah! Gunakan password default "riz123" atau kosongkan.');
      return;
    }

    onLogActivity(staff.name, `${staff.division} - ${staff.role}`, 'Mencoba login berhasil');
    onLogin(staff);
  };

  const handleQuickLogin = (staff: Staff) => {
    onLogActivity(staff.name, `${staff.division} - ${staff.role}`, 'Login cepat berhasil');
    onLogin(staff);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            RIZ-PRODUCTION
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-sans">
            LOGBOOK QC & DAILY REPORT STAFF INHOUSE
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="staff-select" className="block text-sm font-medium text-slate-700 mb-1">
                Pilih Nama Staff
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
                  
                  <optgroup label="ADMIN / MANAGEMENT">
                    {STAFF_LIST.filter(s => s.division === 'Admin').map(s => {
                      let displayRole: string = s.role;
                      if (s.name === 'Wahyu') displayRole = 'Director';
                      if (s.name === 'Caca' || s.name === 'Seno') displayRole = 'Staff Admin';
                      return (
                        <option key={s.id} value={s.id}>{s.name} ({displayRole})</option>
                      );
                    })}
                  </optgroup>

                  <optgroup label="STAFF GUDANG">
                    {STAFF_LIST.filter(s => s.division === 'Gudang').map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                    ))}
                  </optgroup>

                  <optgroup label="SOUND (AUDIO) DIVISION">
                    {STAFF_LIST.filter(s => s.division === 'Audio').map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                    ))}
                  </optgroup>

                  <optgroup label="LIGHTING DIVISION">
                    {STAFF_LIST.filter(s => s.division === 'Lighting').map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                    ))}
                  </optgroup>

                  <optgroup label="MULTIMEDIA DIVISION">
                    {STAFF_LIST.filter(s => s.division === 'Multimedia').map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                    ))}
                  </optgroup>

                  <optgroup label="VIDEOTRON DIVISION">
                    {STAFF_LIST.filter(s => s.division === 'Videotron').map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                    ))}
                  </optgroup>

                  <optgroup label="SERVICE DIVISION">
                    {STAFF_LIST.filter(s => s.division === 'Service').map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password <span className="text-xs text-slate-400 font-normal">(Default: riz123 atau kosongkan)</span>
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
            <div className="text-red-500 text-sm bg-red-50 p-2.5 rounded-lg border border-red-100 font-medium">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
              </span>
              Masuk ke Aplikasi
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-slate-400 font-mono mt-6">
          Status: Sistem Siap • Versi 1.1.0
        </div>
      </div>
    </div>
  );
}
