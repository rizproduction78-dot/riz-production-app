/**
 * Utility helper for image compression and processing
 * Menjamin file foto dari kamera/galeri di-resize dan dikompresi menjadi Base64 ringan
 * agar sinkronisasi Cloud Firestore cepat, hemat memori, dan tidak melebihi kuota 1MB Firestore.
 */

export async function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const rawData = event.target?.result as string;

      // Handle non-browser / test environments gracefully
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        resolve(rawData);
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Hitung skala aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawData);
          return;
        }

        // Draw image ke canvas dengan interpolasi halus
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor ke JPEG Base64 yang dioptimasi
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };

      img.onerror = () => {
        // Fallback jika decode gambar gagal
        resolve(rawData);
      };

      img.src = rawData;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
