/**
 * Utilitas Pemasangan Aplikasi ke Layar Utama (Home Screen) untuk Ponsel & Tablet (Android & iOS/iPadOS)
 * PT. Riz Production Multi Kreasi
 */

export function detectIsIOSOrIPadOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isClassicIOS = /iPad|iPhone|iPod/i.test(ua);
  const isModernIPadOS =
    navigator.platform === 'MacIntel' && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1;
  return isClassicIOS || isModernIPadOS;
}

export function detectIsAndroidDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent || '');
}

export function detectIsInAppWebView(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /FBAN|FBAV|Instagram|Line|WhatsApp|Telegram|wv|WebView|GSA\//i.test(ua);
}

export async function triggerNativeAndroidPrompt(explicitPrompt?: any): Promise<boolean> {
  const promptEvt =
    explicitPrompt ||
    (typeof window !== 'undefined' ? (window as any).__rizDeferredPwaPrompt : null);

  if (promptEvt && typeof promptEvt.prompt === 'function') {
    try {
      await promptEvt.prompt();
      const choice = await promptEvt.userChoice;
      if (typeof window !== 'undefined') {
        (window as any).__rizDeferredPwaPrompt = null;
      }
      return Boolean(choice && choice.outcome === 'accepted');
    } catch (_err) {
      return false;
    }
  }
  return false;
}

export function openInAndroidChromeForHomeScreen(): void {
  if (typeof window === 'undefined') return;
  try {
    const cleanUrl = `${window.location.origin}${window.location.pathname}?install_homescreen=android`;
    const hostAndPath = `${window.location.host}${window.location.pathname}?install_homescreen=android`;
    const scheme = window.location.protocol.replace(':', '') || 'https';
    const fallback = encodeURIComponent(cleanUrl);
    window.location.href = `intent://${hostAndPath}#Intent;scheme=${scheme};package=com.android.chrome;S.browser_fallback_url=${fallback};end`;
  } catch (_e) {}
}

export async function triggerNativeShareSheetForHomeScreen(): Promise<boolean> {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return false;
  }
  try {
    const targetUrl =
      typeof window !== 'undefined' && window.location?.origin
        ? `${window.location.origin}/`
        : 'https://log-task-book-riz-production-app.vercel.app/';
    await navigator.share({
      title: 'RIZ-PROLOG',
      text: 'Pilih "Tambah ke Layar Utama" (Add to Home Screen) pada menu di bawah ini:',
      url: targetUrl,
    });
    return true;
  } catch (_e) {
    return false;
  }
}

async function fetchIconBase64(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = String(reader.result || '');
        const base64 = result.includes(',') ? result.split(',')[1] : '';
        resolve(base64);
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(blob);
    });
  } catch (_e) {
    return '';
  }
}

export async function downloadIOSWebClipProfile(): Promise<void> {
  if (typeof window === 'undefined') return;
  const targetOrigin =
    window.location?.origin || 'https://log-task-book-riz-production-app.vercel.app';
  const iconBase64 = await fetchIconBase64(`${targetOrigin}/apple-touch-icon.png`);

  const iconKeyBlock = iconBase64
    ? `      <key>Icon</key>
      <data>
      ${iconBase64}
      </data>`
    : '';

  const mobileConfigXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>FullScreen</key>
      <true/>
      <key>IgnoreManifestScope</key>
      <true/>
      <key>IsRemovable</key>
      <true/>
      <key>Label</key>
      <string>RIZ-PROLOG</string>
      <key>PayloadDescription</key>
      <string>Menampilkan ikon aplikasi RIZ-PRO LOG pada Layar Utama iOS / iPadOS</string>
      <key>PayloadDisplayName</key>
      <string>RIZ-PRO LOG WebClip</string>
      <key>PayloadIdentifier</key>
      <string>id.rizproduction.prolog.webclip</string>
      <key>PayloadOrganization</key>
      <string>PT. Riz Production Multi Kreasi</string>
      <key>PayloadType</key>
      <string>com.apple.webClip.managed</string>
      <key>PayloadUUID</key>
      <string>A1B2C3D4-E5F6-4789-9012-3456789ABCDE</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
      <key>Precomposed</key>
      <true/>
      <key>URL</key>
      <string>${targetOrigin}/</string>
${iconKeyBlock}
    </dict>
  </array>
  <key>PayloadDescription</key>
  <string>Profil Resmi Pintasan Layar Utama RIZ-PRO LOG (PT. Riz Production Multi Kreasi). Buka Pengaturan &gt; Profil Diunduh &gt; Install untuk menampilkan ikon di Layar Utama iPhone/iPad.</string>
  <key>PayloadDisplayName</key>
  <string>RIZ-PRO LOG (Layar Utama iOS/iPadOS)</string>
  <key>PayloadIdentifier</key>
  <string>id.rizproduction.prolog.profile</string>
  <key>PayloadOrganization</key>
  <string>PT. Riz Production Multi Kreasi</string>
  <key>PayloadRemovalDisallowed</key>
  <false/>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>F1E2D3C4-B5A6-4987-8123-456789ABCDEF</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>`;

  const blob = new Blob([mobileConfigXml], { type: 'application/x-apple-aspen-config' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'RIZ-PROLOG-iOS-HomeScreen.mobileconfig';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

