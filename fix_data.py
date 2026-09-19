import re

with open('src/data.ts', 'r') as f:
    content = f.read()

# Fix normalizeStaffMaster to not overwrite fields, just set id
def replacer(match):
    body = match.group(0)
    # We want to replace canonicalStaff = { ...s, id: '...', name: 'Wahyu', ... } with canonicalStaff.id = '...';
    # Actually, the simplest is to find blocks like `canonicalStaff = { ...s, id: '...', name: '...', ... };`
    # and replace them with `canonicalStaff.id = '...';`
    new_body = re.sub(r"canonicalStaff\s*=\s*\{\s*\.\.\.s,\s*id:\s*('[^']+')([^}]*)\};", r"canonicalStaff.id = \1;", body)
    return new_body

# apply replacer
new_content = re.sub(r"(?s)// 1\. Wahyu.*?// Overwrite or update in staffMap", lambda m: replacer(m) + "\n    // Overwrite or update in staffMap", content)

# Add STAFF SEMUA DIVISI
staff_add = """
  // 8. UMUM
  { id: 'staff-semua-divisi', name: 'STAFF SEMUA DIVISI', fullName: 'STAFF SEMUA DIVISI', nickname: 'STAFF', division: 'Semua Divisi', role: 'Staff', level: 1 }
];"""
new_content = new_content.replace('];\n\nexport const MASTER_STAFF', staff_add + '\n\nexport const MASTER_STAFF')

# Add FREE-LANCE SEMUA DIVISI
fl_add = """
  // ── 0. UMUM ──────────────────────────────────────────
  { id: 'fl-semua-divisi', name: 'FREE-LANCE SEMUA DIVISI', email: '', phone: '', specialization: 'Umum', roleTitle: 'FREELANCE', dailyRate: 200000, status: 'Aktif', createdAt: '2026-09-01' },
"""
new_content = new_content.replace('export const INITIAL_FREELANCE_WORKERS: FreelanceWorker[] = [', 'export const INITIAL_FREELANCE_WORKERS: FreelanceWorker[] = [' + fl_add)

with open('src/data.ts', 'w') as f:
    f.write(new_content)

print("done")
