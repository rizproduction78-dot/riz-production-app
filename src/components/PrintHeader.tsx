import React from 'react';

export const PrintHeader: React.FC<{ title: string; subtitle?: string; date?: string; className?: string }> = ({ title, subtitle, date, className = '' }) => {
  return (
    <div className={`hidden print:flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-slate-800 pb-6 mb-6 gap-4 ${className}`}>
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="RIZ-PRODUCTION Logo" className="h-16 w-auto object-contain" />
        <div>
          <div className="flex items-center gap-4">
              <img src="/logo.png" alt="RIZ-PRODUCTION Logo" className="h-16 w-auto object-contain print:h-12" />
              <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">RIZ-PRODUCTION</h1>
            </div>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Live Event Equipment & Production Solution</p>
          <p className="text-[10px] text-slate-500 mt-1">Jl. Alternatif Jl. Tugu Wates No.78, RT.02/RW.13, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat 16164</p>
          <p className="text-[10px] text-slate-500">CRR3+82 Kedungbadak, Bogor City, West Java</p>
        </div>
      </div>
      <div className="text-right sm:text-right text-xs space-y-1">
        <h2 className="text-md font-bold text-slate-800 uppercase font-display">{title}</h2>
        <div className="font-mono text-slate-500">
          {subtitle && <div>{subtitle}</div>}
          {date && <div>Tanggal: {date}</div>}
          <div>Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</div>
        </div>
      </div>
    </div>
  );
};
