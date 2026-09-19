import os

# 1. Update address in PrintHeader.tsx
with open('src/components/PrintHeader.tsx', 'r') as f:
    ph = f.read()

ph = ph.replace(
    '<p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Live Event Equipment & Production Solution</p>',
    '<p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Live Event Equipment & Production Solution</p>\n          <p className="text-[10px] text-slate-500 mt-1">Jl. Alternatif Jl. Tugu Wates No.78, RT.02/RW.13, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat 16164</p>\n          <p className="text-[10px] text-slate-500">CRR3+82 Kedungbadak, Bogor City, West Java</p>'
)

with open('src/components/PrintHeader.tsx', 'w') as f:
    f.write(ph)

# 2. Update address in Reports.tsx
with open('src/components/Reports.tsx', 'r') as f:
    rep = f.read()

rep = rep.replace(
    '<p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Live Event Equipment & Production Solution</p>',
    '<p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Live Event Equipment & Production Solution</p>\n                <p className="text-[10px] text-slate-500 mt-1 max-w-sm">Jl. Alternatif Jl. Tugu Wates No.78, RT.02/RW.13, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat 16164 (CRR3+82 Kedungbadak, Bogor City, West Java)</p>'
)

with open('src/components/Reports.tsx', 'w') as f:
    f.write(rep)

# 3. Update Top Performer sorting logic in Dashboard.tsx
with open('src/components/Dashboard.tsx', 'r') as f:
    dash = f.read()

old_sort = '''      .sort((a, b) => {
        if (b.kpi !== a.kpi) return b.kpi - a.kpi;
        if (b.qcs !== a.qcs) return b.qcs - a.qcs;
        if (b.reports !== a.reports) return b.reports - a.reports;
        if (b.attendanceCount !== a.attendanceCount) return b.attendanceCount - a.attendanceCount;
        return b.wos - a.wos;
      })'''

new_sort = '''      .sort((a, b) => {
        // Sort by productivity first (total reports + qcs + wos)
        const prodA = a.reports + a.qcs + a.wos;
        const prodB = b.reports + b.qcs + b.wos;
        if (prodB !== prodA) return prodB - prodA;
        if (b.kpi !== a.kpi) return b.kpi - a.kpi;
        if (b.attendanceCount !== a.attendanceCount) return b.attendanceCount - a.attendanceCount;
        return b.wos - a.wos;
      })'''

if old_sort in dash:
    dash = dash.replace(old_sort, new_sort)
else:
    print("WARNING: Old sort not found in Dashboard.tsx")

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(dash)

print("Patch applied successfully.")
