import os

files_to_patch = [
    "src/components/CareerCompetencyModule.tsx",
    "src/components/EmployeePerformanceModule.tsx",
    "src/components/Gudang.tsx",
    "src/components/LogTaskModule.tsx"
]

import_stmt = "import { PrintHeader } from './PrintHeader';\n"

for fpath in files_to_patch:
    with open(fpath, "r") as f:
        content = f.read()
        
    if "import { PrintHeader }" not in content:
        # inject import
        content = content.replace("import {", import_stmt + "import {", 1)
        
    # inject PrintHeader right after the main container div
    # LogTaskModule: <div className="space-y-6 lg:space-y-8 font-sans pb-24">
    # EmployeePerformance: <div className="space-y-6 pb-12 print:p-0">
    # CareerCompetency: <div className="space-y-6 pb-12 print:p-0">
    # Gudang: <div className="space-y-8 font-sans pb-24">
    
    if "LogTaskModule.tsx" in fpath:
        content = content.replace('<div className="space-y-6 lg:space-y-8 font-sans pb-24">', '<div className="space-y-6 lg:space-y-8 font-sans pb-24">\n      <PrintHeader title="Logbook Aktivitas & Tugas" />')
    elif "EmployeePerformanceModule.tsx" in fpath:
        content = content.replace('<div className="space-y-6 pb-12 print:p-0">', '<div className="space-y-6 pb-12 print:p-0">\n      <PrintHeader title="Profil & Kinerja Karyawan" />')
    elif "CareerCompetencyModule.tsx" in fpath:
        content = content.replace('<div className="space-y-6 pb-12 print:p-0">', '<div className="space-y-6 pb-12 print:p-0">\n      <PrintHeader title="Catatan Karir & Kompetensi" />')
    elif "Gudang.tsx" in fpath:
        content = content.replace('<div className="space-y-8 font-sans pb-24">', '<div className="space-y-8 font-sans pb-24">\n      <PrintHeader title="Laporan Inventaris Gudang" />')

    with open(fpath, "w") as f:
        f.write(content)
        print(f"Patched {fpath}")

