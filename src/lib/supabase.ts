/**
 * Supabase Client Configuration & Real-time Integration
 * PT. Riz Production Multi Kreasi
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safely read environment variables in both Vite browser and Node.js/CLI environments
const getEnvVar = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.[key]) {
      return (import.meta as any).env[key];
    }
  } catch (e) {}

  try {
    if (typeof process !== 'undefined' && process.env?.[key]) {
      return process.env[key] || '';
    }
  } catch (e) {}

  return '';
};

// Default production credentials for PT. Riz Production Supabase Cloud
const DEFAULT_SUPABASE_URL = 'https://bthncgakjzgxvadgyirk.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_MZATJsoDYMXYVMGVq3FnZQ_igKNHcwb';

const supabaseUrl = (getEnvVar('VITE_SUPABASE_URL') || DEFAULT_SUPABASE_URL).trim();
const supabaseAnonKey = (getEnvVar('VITE_SUPABASE_ANON_KEY') || DEFAULT_SUPABASE_ANON_KEY).trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

/**
 * Helper to check connection health with Supabase
 */
export async function checkSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      message: 'Supabase URL atau Anon Key belum dikonfigurasi di file .env (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY)',
    };
  }

  try {
    const { error } = await supabase.from('master_staff').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      return {
        connected: false,
        message: `Terhubung ke endpoint, tetapi tabel belum tersedia atau terjadi kesalahan: ${error.message}`,
      };
    }
    return {
      connected: true,
      message: 'Berhasil terhubung ke Supabase Database!',
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Gagal menghubungi Supabase: ${err.message || String(err)}`,
    };
  }
}
