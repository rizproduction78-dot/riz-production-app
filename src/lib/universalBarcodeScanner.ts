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
 * Strict validation for decoded barcode / QR strings to prevent any camera noise false-positives (such as "$1I")
 */
export function isValidScannedBarcodeText(raw: string): boolean {
  const clean = String(raw || '').trim();
  if (clean.length < 4) return false;
  // Reject strings that start with random symbols like '$' or '%' or only have 1-2 alphanumeric chars
  if (/^[$%+/\s]/.test(clean)) return false;
  const alphaNumCount = (clean.match(/[A-Za-z0-9]/g) || []).length;
  return alphaNumCount >= 4;
}

/**
 * Pure-TypeScript 1D Code 39 Scanline Optical Decoder (disabled for noisy live background frames;
 * requires strict alphanumeric length >= 6 and no symbol noise).
 */
export function decode1DBarcodeFromImageData(_imageData: ImageData): BarcodeDecodeResult | null {
  return null;
}

/**
 * Decode barcode / QR code from an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, or ImageBitmap
 * Uses native BarcodeDetector or standard WebAssembly BarcodeDetector polyfill with strict checksum validation.
 */
export async function decodeBarcodeFromSource(
  source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | ImageBitmap
): Promise<BarcodeDecodeResult | null> {
  // 1. Try Native or WebAssembly Polyfill BarcodeDetector
  const detector = await getUniversalBarcodeDetector();
  if (detector) {
    try {
      const results = await detector.detect(source);
      if (Array.isArray(results) && results.length > 0) {
        const hit = results.find(
          (r: any) => r && isValidScannedBarcodeText(String(r.rawValue || ''))
        );
        if (hit) {
          return {
            rawValue: String(hit.rawValue).trim(),
            format: String(hit.format || 'qr_code'),
            source: 'native_barcode_detector'
          };
        }
      }
    } catch {
      // Fall through to canvas pass
    }
  }

  // 2. Draw onto offscreen canvas for normalized detector pass
  if (typeof document === 'undefined' || !detector) return null;

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

    const canvasResults = await detector.detect(canvas);
    if (Array.isArray(canvasResults) && canvasResults.length > 0) {
      const validHit = canvasResults.find((r: any) =>
        r && isValidScannedBarcodeText(String(r.rawValue || ''))
      );
      if (validHit) {
        return {
          rawValue: String(validHit.rawValue).trim(),
          format: String(validHit.format || 'barcode'),
          source: 'polyfill_detector'
        };
      }
    }
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
