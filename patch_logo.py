import os
import glob

components_dir = 'src/components'
files = glob.glob(os.path.join(components_dir, '*.tsx'))

old_header = '<div>\n              <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">RIZ-PRODUCTION</h1>'
new_header = '''<div className="flex items-center gap-4">\n              <img src="/logo.png" alt="RIZ-PRODUCTION Logo" className="h-16 w-auto object-contain print:h-12" />\n              <div>\n                <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">RIZ-PRODUCTION</h1>'''

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    if old_header in content:
        content = content.replace(old_header, new_header)
        # Also need to close the extra div
        # Actually, let's just use regex to wrap the header or rely on a simpler replace.
        print(f"Would patch {filepath}")

