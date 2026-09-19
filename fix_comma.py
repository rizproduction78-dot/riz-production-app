import re

with open('src/data.ts', 'r') as f:
    content = f.read()

# Fix the missing comma for STAFF_LIST
content = re.sub(
    r"(\}\s*)\n\s*// 8\. UMUM\s*\n\s*\{\s*id:\s*'staff-semua-divisi'",
    r"\1,\n  // 8. UMUM\n  { id: 'staff-semua-divisi'",
    content
)

with open('src/data.ts', 'w') as f:
    f.write(content)

print("done")
