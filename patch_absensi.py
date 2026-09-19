with open("src/components/Absensi.tsx", "r") as f:
    content = f.read()

import_statement = "import { PrintHeader } from './PrintHeader';\n"
if "import { PrintHeader }" not in content:
    content = content.replace("import React,", "import React,")
    # Actually just append after the first import
    content = content.replace("import { useState, useMemo, useEffect } from 'react';", "import { useState, useMemo, useEffect } from 'react';\n" + import_statement)

# find the top div of the return statement or top of the component and add PrintHeader
# For Absensi, it starts with:
# <div className="space-y-8 font-sans">
content = content.replace('<div className="space-y-8 font-sans">', '<div className="space-y-8 font-sans">\n      <PrintHeader title="Laporan Absensi & Shift" />')

with open("src/components/Absensi.tsx", "w") as f:
    f.write(content)
