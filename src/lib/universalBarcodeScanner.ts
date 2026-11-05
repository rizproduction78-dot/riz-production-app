/**
 * Universal Mobile, Tablet & Desktop Camera Barcode / QR Scanner Engine
 * PT. Riz Production Multi Kreasi
 *
 * Mendukung pemindaian kamera nyata (bukan simulator) di seluruh perangkat:
 * - Ponsel Android (Chrome, Samsung Internet, Firefox, Edge, WebView)
 * - iPhone & iPad iOS/iPadOS (Safari, Chrome iOS)
 * - Tablet Android / Windows / iPad
 * - Laptop / PC (Webcam internal & USB scanner)
 */

export interface CameraDeviceInfo {
  deviceId: string;
  label: string;
  facing: 'environment' | 'user' | 'unknown';
}

export interface UniversalCameraSession {
  stream: MediaStream;
  facingMode: 'environment' | 'user';
  deviceId?: string;
  hasTorch: boolean;
  deviceLabel: string;
}

export interface BarcodeDecodeResult {
  rawValue: string;
  format: string;
  source: 'native_barcode_detector' | 'polyfill_detector' | 'optical_1d_scanline' | 'image_match';
}

const SUPPORTED_BARCODE_FORMATS = [
  'qr_code',
  'code_128',
  'code_39',
  'code_93',
  'ean_13',
  'ean_8',
  'upc_a',
  'upc_e',
  'itf',
  'codabar',
  'data_matrix',
  'pdf417',
  'aztec'
];

let cachedDetectorInstance: any = null;
let polyfillLoadAttempted = false;

/**
 * Get or initialize native BarcodeDetector or dynamic polyfill for iOS Safari / Firefox
 */
export async function getUniversalBarcodeDetector(): Promise<any | null> {
  if (cachedDetectorInstance) return cachedDetectorInstance;
  if (typeof window === 'undefined') return null;

  const NativeDetector = (window as any).BarcodeDetector;
  if (NativeDetector) {
    try {
      let formats = SUPPORTED_BARCODE_FORMATS;
      if (typeof NativeDetector.getSupportedFormats === 'function') {
        const supported = await NativeDetector.getSupportedFormats();
        if (Array.isArray(supported) && supported.length > 0) {
          formats = supported;
        }
      }
      cachedDetectorInstance = new NativeDetector({ formats });
      return cachedDetectorInstance;
    } catch {
      try {
        cachedDetectorInstance = new NativeDetector();
        return cachedDetectorInstance;
      } catch {}
    }
  }

  // Fallback for iOS Safari / browsers without native BarcodeDetector:
  // Dynamically load standard BarcodeDetector ponyfill if online
  if (!polyfillLoadAttempted && typeof navigator !== 'undefined' && navigator.onLine) {
    polyfillLoadAttempted = true;
    try {
      const ponyfillCdnUrl = 'https://fastly.jsdelivr.net/npm/barcode-detector@2/dist/es/ponyfill.min.js';
      const mod: any = await import(/* @vite-ignore */ ponyfillCdnUrl);
      const Ponyfill = mod?.BarcodeDetector || mod?.default;
      if (Ponyfill) {
        (window as any).BarcodeDetector = Ponyfill;
        cachedDetectorInstance = new Ponyfill({ formats: SUPPORTED_BARCODE_FORMATS });
        return cachedDetectorInstance;
      }
    } catch {
      // Ignore if offline or blocked by CSP; optical 1D scanline decoder remains active
    }
  }

  return null;
}

/**
 * Code 39 character pattern table (9 elements: 5 bars, 4 spaces; 1 = wide, 0 = narrow)
 */
const CODE39_PATTERNS: Record<string, string> = {
  '000110100': '0',
  '100100001': '1',
  '001100001': '2',
  '101100000': '3',
  '000110001': '4',
  '100110000': '5',
  '001110000': '6',
  '000100101': '7',
  '100100100': '8',
  '001100100': '9',
  '100001001': 'A',
  '001001001': 'B',
  '101001000': 'C',
  '000011001': 'D',
  '100011000': 'E',
  '001011000': 'F',
  '000001101': 'G',
  '100001100': 'H',
  '001001100': 'I',
  '000011100': 'J',
  '100000011': 'K',
  '001000011': 'L',
  '101000010': 'M',
  '000010011': 'N',
  '100010010': 'O',
  '001010010': 'P',
  '000000111': 'Q',
  '100000110': 'R',
  '001000110': 'S',
  '000010110': 'T',
  '110000001': 'U',
  '011000001': 'V',
  '111000000': 'W',
  '010010001': 'X',
  '110010000': 'Y',
  '011010000': 'Z',
  '010000101': '-',
  '110000100': '.',
  '011000100': ' ',
  '010101000': '$',
  '010100010': '/',
  '010001010': '+',
  '000101010': '%',
  '010010100': '*'
};

/**
 * Pure-TypeScript 1D Code 39 Scanline Optical Decoder
 * Reads horizontal scanlines from ImageData to decode physical 1D barcodes offline.
 */
export function decode1DBarcodeFromImageData(imageData: ImageData): BarcodeDecodeResult | null {
  const { width, height, data } = imageData;
  if (width < 80 || height < 20) return null;

  const scanRatios = [0.5, 0.42, 0.58, 0.35, 0.65];

  for (const ratio of scanRatios) {
    const y = Math.floor(height * ratio);
    const rowGray = new Uint8Array(width);
    let minLum = 255;
    let maxLum = 0;

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const lum = Math.round(data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114);
      rowGray[x] = lum;
      if (lum < minLum) minLum = lum;
      if (lum > maxLum) maxLum = lum;
    }

    if (maxLum - minLum < 45) continue;
    const threshold = (minLum + maxLum) / 2;

    // Extract run-length segments of dark (1) and light (0)
    const runs: { isDark: boolean; length: number }[] = [];
    let currentDark = rowGray[0] < threshold;
    let count = 1;

    for (let x = 1; x < width; x++) {
      const isDark = rowGray[x] < threshold;
      if (isDark === currentDark) {
        count++;
      } else {
        runs.push({ isDark: currentDark, length: count });
        currentDark = isDark;
        count = 1;
      }
    }
    runs.push({ isDark: currentDark, length: count });

    // Start from first dark bar
    const firstDarkIdx = runs.findIndex(r => r.isDark);
    if (firstDarkIdx < 0 || runs.length - firstDarkIdx < 29) continue;

    // Try decoding Code 39 sequence (*...*)
    const darkRuns = runs.slice(firstDarkIdx);
    const decodedChars: string[] = [];
    let i = 0;
    let started = false;

    while (i + 8 < darkRuns.length) {
      if (!darkRuns[i].isDark) {
        i++;
        continue;
      }
      const chunk = darkRuns.slice(i, i + 9);
      const lengths = chunk.map(c => c.length);
      const sorted = [...lengths].sort((a, b) => a - b);
      // In Code 39, 6 elements are narrow and 3 are wide
      const splitThreshold = (sorted[5] + sorted[6]) / 2;
      const pattern = lengths.map(l => (l >= splitThreshold ? '1' : '0')).join('');
      const ch = CODE39_PATTERNS[pattern];

      if (ch === '*') {
        if (!started) {
          started = true;
          decodedChars.length = 0;
          i += 10; // 9 elements + 1 inter-character narrow space
          continue;
        } else if (decodedChars.length >= 3) {
          return {
            rawValue: decodedChars.join('').trim(),
            format: 'code_39',
            source: 'optical_1d_scanline'
          };
        }
      } else if (started && ch) {
        decodedChars.push(ch);
        i += 10;
        continue;
      }
      i += 2;
    }
  }

  return null;
}

/**
 * Decode barcode / QR code from an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, or ImageBitmap
 */
export async function decodeBarcodeFromSource(
  source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | ImageBitmap
): Promise<BarcodeDecodeResult | null> {
  // 1. Try Native or Polyfill BarcodeDetector first
  const detector = await getUniversalBarcodeDetector();
  if (detector) {
    try {
      const results = await detector.detect(source);
      if (Array.isArray(results) && results.length > 0) {
        const hit = results.find((r: any) => r && String(r.rawValue || '').trim().length > 0);
        if (hit) {
          return {
            rawValue: String(hit.rawValue).trim(),
            format: String(hit.format || 'qr_code'),
            source: 'native_barcode_detector'
          };
        }
      }
    } catch {
      // Fall through to canvas scanline & multi-pass decoder
    }
  }

  // 2. Draw onto offscreen canvas for contrast enhancement + 1D scanline decoding
  if (typeof document === 'undefined') return null;

  try {
    let w = 0;
    let h = 0;
    if (source instanceof HTMLVideoElement) {
      w = source.videoWidth || source.clientWidth || 640;
      h = source.videoHeight || source.clientHeight || 480;
    } else if (source instanceof HTMLImageElement) {
      w = source.naturalWidth || source.width || 640;
      h = source.naturalHeight || source.height || 480;
    } else {
      w = (source as any).width || 640;
      h = (source as any).height || 480;
    }

    if (w <= 0 || h <= 0) return null;

    const maxDim = 960;
    const scale = Math.min(1, maxDim / Math.max(w, h));
    const cw = Math.max(120, Math.round(w * scale));
    const ch = Math.max(80, Math.round(h * scale));

    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(source as CanvasImageSource, 0, 0, cw, ch);

    // Retry detector on normalized canvas if detector exists
    if (detector) {
      try {
        const canvasResults = await detector.detect(canvas);
        if (Array.isArray(canvasResults) && canvasResults.length > 0 && canvasResults[0]?.rawValue) {
          return {
            rawValue: String(canvasResults[0].rawValue).trim(),
            format: String(canvasResults[0].format || 'barcode'),
            source: 'polyfill_detector'
          };
        }
      } catch {}
    }

    const imageData = ctx.getImageData(0, 0, cw, ch);
    const scanlineHit = decode1DBarcodeFromImageData(imageData);
    if (scanlineHit) return scanlineHit;
  } catch {}

  return null;
}

/**
 * List available camera video input devices on phone, tablet, or desktop
 */
export async function listVideoInputDevices(): Promise<CameraDeviceInfo[]> {
  if (
    typeof navigator === 'undefined' ||
    !navigator.mediaDevices ||
    typeof navigator.mediaDevices.enumerateDevices !== 'function'
  ) {
    return [];
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter(d => d.kind === 'videoinput')
      .map((d, idx) => {
        const lbl = d.label || `Kamera Perangkat ${idx + 1}`;
        const lower = lbl.toLowerCase();
        const facing: CameraDeviceInfo['facing'] =
          lower.includes('back') || lower.includes('rear') || lower.includes('environment') || lower.includes('belakang')
            ? 'environment'
            : lower.includes('front') || lower.includes('user') || lower.includes('depan') || lower.includes('facetime')
              ? 'user'
              : 'unknown';
        return {
          deviceId: d.deviceId,
          label: lbl,
          facing
        };
      });
  } catch {
    return [];
  }
}

/**
 * Open real hardware camera stream across any mobile phone, tablet, or laptop
 * Uses progressive constraint fallback so iOS Safari, Android Chrome, and tablets never fail on OverconstrainedError.
 */
export async function startUniversalCameraStream(options?: {
  preferredFacingMode?: 'environment' | 'user';
  preferredDeviceId?: string;
  videoElement?: HTMLVideoElement | null;
}): Promise<UniversalCameraSession> {
  if (
    typeof navigator === 'undefined' ||
    !navigator.mediaDevices ||
    typeof navigator.mediaDevices.getUserMedia !== 'function'
  ) {
    throw new Error('Peramban tidak mengizinkan akses kamera langsung (pastikan menggunakan HTTPS atau tombol Kamera HP).');
  }

  const facingMode = options?.preferredFacingMode || 'environment';
  const constraintCandidates: MediaStreamConstraints[] = [];

  if (options?.preferredDeviceId) {
    constraintCandidates.push({
      video: {
        deviceId: { exact: options.preferredDeviceId },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });
  }

  // Candidate 1: HD with ideal facingMode (best for Android & iPhone/iPad rear/front camera)
  constraintCandidates.push({
    video: {
      facingMode: { ideal: facingMode },
      width: { ideal: 1280 },
      height: { ideal: 720 }
    },
    audio: false
  });

  // Candidate 2: Simple facingMode without resolution lock (important for older tablets/iPads)
  constraintCandidates.push({
    video: { facingMode },
    audio: false
  });

  // Candidate 3: Any available camera on the device
  constraintCandidates.push({
    video: true,
    audio: false
  });

  let acquiredStream: MediaStream | null = null;
  let lastError: unknown = null;

  for (const constraints of constraintCandidates) {
    try {
      acquiredStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (acquiredStream) break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!acquiredStream) {
    throw lastError instanceof Error
      ? lastError
      : new Error('Gagal membuka kamera perangkat.');
  }

  const videoTrack = acquiredStream.getVideoTracks()[0];
  let hasTorch = false;
  let deviceLabel = videoTrack?.label || (facingMode === 'environment' ? 'Kamera Belakang' : 'Kamera Depan');
  let activeDeviceId: string | undefined;

  if (videoTrack) {
    try {
      const settings = typeof videoTrack.getSettings === 'function' ? videoTrack.getSettings() : {};
      activeDeviceId = settings.deviceId;
      const capabilities =
        typeof (videoTrack as any).getCapabilities === 'function'
          ? (videoTrack as any).getCapabilities()
          : {};
      hasTorch = Boolean(capabilities && capabilities.torch);

      // Enable continuous autofocus on mobile/tablet cameras when supported
      if (
        capabilities &&
        Array.isArray(capabilities.focusMode) &&
        capabilities.focusMode.includes('continuous')
      ) {
        await videoTrack.applyConstraints({
          advanced: [{ focusMode: 'continuous' } as any]
        });
      }
    } catch {}
  }

  if (options?.videoElement) {
    const videoEl = options.videoElement;
    videoEl.setAttribute('playsinline', 'true');
    videoEl.setAttribute('webkit-playsinline', 'true');
    videoEl.muted = true;
    videoEl.autoplay = true;
    videoEl.srcObject = acquiredStream;
    try {
      await videoEl.play();
    } catch {}
  }

  return {
    stream: acquiredStream,
    facingMode,
    deviceId: activeDeviceId,
    hasTorch,
    deviceLabel
  };
}

/**
 * Toggle hardware Flashlight / Torch on supported mobile/tablet cameras
 */
export async function toggleCameraTorch(
  stream: MediaStream | null,
  enable: boolean
): Promise<boolean> {
  if (!stream) return false;
  const track = stream.getVideoTracks()[0];
  if (!track || typeof track.applyConstraints !== 'function') return false;
  try {
    await track.applyConstraints({
      advanced: [{ torch: enable } as any]
    });
    return enable;
  } catch {
    return false;
  }
}

/**
 * Capture a high-clarity JPEG data URL snapshot from a live HTMLVideoElement
 */
export function captureSnapshotFromVideo(
  videoEl: HTMLVideoElement | null,
  overlayText?: string
): string | null {
  if (!videoEl || typeof document === 'undefined') return null;
  const vw = videoEl.videoWidth || videoEl.clientWidth || 640;
  const vh = videoEl.videoHeight || videoEl.clientHeight || 480;
  if (vw <= 0 || vh <= 0) return null;

  const canvas = document.createElement('canvas');
  canvas.width = vw;
  canvas.height = vh;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.drawImage(videoEl, 0, 0, vw, vh);

  if (overlayText) {
    const barHeight = Math.max(36, Math.round(vh * 0.08));
    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    ctx.fillRect(0, vh - barHeight, vw, barHeight);
    ctx.fillStyle = '#34d399';
    ctx.font = `bold ${Math.max(12, Math.round(barHeight * 0.42))}px monospace`;
    ctx.fillText(overlayText, 14, vh - Math.round(barHeight * 0.32));
  }

  return canvas.toDataURL('image/jpeg', 0.88);
}
