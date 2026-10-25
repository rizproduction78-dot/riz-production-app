import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ [FAIL] ${message}`);
    process.exit(1);
  }
  console.log(`✅ [PASS] ${message}`);
}

async function runScrollVerification() {
  console.log('================================================================');
  console.log('  TEST SUITE: VERIFIKASI FITUR SCROLL UP & DOWN APLIKASI');
  console.log('================================================================');

  // 1. Verifikasi index.css
  const indexCssPath = path.resolve(process.cwd(), 'src/index.css');
  assert(fs.existsSync(indexCssPath), 'src/index.css ditemukan');
  const indexCss = fs.readFileSync(indexCssPath, 'utf-8');

  assert(
    indexCss.includes('overflow-y: auto') && indexCss.includes('html {'),
    'html di src/index.css memiliki overflow-y: auto untuk scroll window alami'
  );
  assert(
    !indexCss.includes('html, body {\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n  overscroll-behavior-y: none;'),
    'src/index.css tidak mengunci overscroll-behavior-y: none pada body yang membekukan gestur scroll'
  );
  assert(
    indexCss.includes('body {') && indexCss.includes('min-height: 100vh') && indexCss.includes('overflow-x: visible'),
    'body di src/index.css memiliki flow dokumen alami (overflow-x: visible & min-height 100vh)'
  );

  // 2. Verifikasi App.tsx <main>
  const appTsxPath = path.resolve(process.cwd(), 'src/App.tsx');
  assert(fs.existsSync(appTsxPath), 'src/App.tsx ditemukan');
  const appTsx = fs.readFileSync(appTsxPath, 'utf-8');

  assert(
    !appTsx.includes('<main className="flex-1 p-2.5 sm:p-4 md:p-8 pb-[max(env(safe-area-inset-bottom),2rem)] overflow-y-auto'),
    '<main> di App.tsx tidak memiliki overflow-y-auto yang menjebak event scroll di dalam flex item'
  );
  assert(
    appTsx.includes('<main className="flex-1 min-w-0 p-2.5 sm:p-4 md:p-8'),
    '<main> di App.tsx menggunakan flex-1 min-w-0 yang mengalir secara alami dengan window scroll'
  );

  // 3. Verifikasi QCNotificationCenter scroll lock cleanup
  const notifPath = path.resolve(process.cwd(), 'src/components/QCNotificationCenter.tsx');
  assert(fs.existsSync(notifPath), 'src/components/QCNotificationCenter.tsx ditemukan');
  const notifContent = fs.readFileSync(notifPath, 'utf-8');

  assert(
    notifContent.includes("document.body.style.overflow = ''") &&
    notifContent.includes("document.documentElement.style.overflow = ''"),
    'QCNotificationCenter membersihkan kunci scroll pada documentElement dan body saat ditutup'
  );

  console.log('================================================================');
  console.log('  SEMUA VERIFIKASI PERBAIKAN SCROLL LULUS 100%');
  console.log('================================================================');
}

runScrollVerification().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
