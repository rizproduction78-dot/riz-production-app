/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Error Boundary Component
 * Uses a stable pattern compatible with useDefineForClassFields: false
 */
import React from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Using React.Component via namespace access to avoid TypeScript class field issues
export class ErrorBoundary extends (React.Component as any) {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    (this as any).state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  handleHardReset() {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  }

  handleReload() {
    window.location.reload();
  }

  render() {
    const state = (this as any).state as ErrorBoundaryState;
    const props = (this as any).props as { children: React.ReactNode };

    if (state.hasError) {
      return React.createElement(
        'div',
        { className: 'min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 font-sans' },
        React.createElement(
          'div',
          { className: 'max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-6' },
          React.createElement(
            'div',
            { className: 'flex items-center gap-3 text-rose-400' },
            React.createElement(
              'div',
              { className: 'p-3 bg-rose-500/10 rounded-xl border border-rose-500/20' },
              React.createElement(AlertTriangle, { className: 'w-8 h-8' })
            ),
            React.createElement(
              'div',
              null,
              React.createElement('h2', { className: 'text-lg font-bold text-white' }, 'Terjadi Kendala Tampilan'),
              React.createElement('p', { className: 'text-xs text-slate-400' }, 'Aplikasi mendeteksi error pada saat render')
            )
          ),
          React.createElement(
            'div',
            { className: 'bg-slate-950/80 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-rose-300 max-h-40 overflow-y-auto break-all' },
            (state.error?.toString() || 'Unknown Error')
          ),
          React.createElement(
            'div',
            { className: 'space-y-3' },
            React.createElement(
              'button',
              {
                onClick: () => this.handleReload(),
                className: 'w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors'
              },
              React.createElement(RefreshCw, { className: 'w-4 h-4' }),
              'Muat Ulang Halaman'
            ),
            React.createElement(
              'button',
              {
                onClick: () => this.handleHardReset(),
                className: 'w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-rose-900/60 hover:text-rose-200 text-slate-300 font-medium text-xs transition-colors border border-slate-600'
              },
              React.createElement(Trash2, { className: 'w-4 h-4' }),
              'Reset Cache & Muat Ulang Bersih'
            )
          )
        )
      );
    }

    return props.children;
  }
}
