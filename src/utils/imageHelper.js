import heic2any from 'heic2any';

const MAX_BESTANDSGROOTTE = 20 * 1024 * 1024; // 20 MB

/**
 * Verwerk een foto-bestand: converteer HEIC/HEIF→JPEG indien nodig, resize naar max 800px, 70% kwaliteit.
 * Retourneert een Blob (image/jpeg) en een preview-URL (data URL).
 * Gooit een Error met een leesbare melding als het bestand te groot is of de conversie mislukt.
 */
export async function verwerkFoto(file) {
  if (file.size > MAX_BESTANDSGROOTTE) {
    throw new Error(`Bestand te groot (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 20 MB.`);
  }

  let blob = file;

  const isHeic =
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    file.name?.toLowerCase().endsWith('.heic') ||
    file.name?.toLowerCase().endsWith('.heif');

  if (isHeic) {
    try {
      const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.8 });
      blob = Array.isArray(converted) ? converted[0] : converted;
    } catch (err) {
      throw new Error(`HEIC/HEIF-conversie mislukt: ${err?.message || 'onbekende fout'}. Sla de foto op als JPEG en probeer opnieuw.`);
    }
  }

  // Resize naar max 800px, 70% JPEG kwaliteit
  const resized = await resizeAfbeelding(blob, 800, 0.7);
  const preview = await blobNaarDataUrl(resized);
  return { blob: resized, preview };
}

function resizeAfbeelding(blob, maxPx, quality) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width: w, height: h } = img;
      if (w > maxPx || h > maxPx) {
        if (w >= h) { h = Math.round(h * maxPx / w); w = maxPx; }
        else        { w = Math.round(w * maxPx / h); h = maxPx; }
      }
      const canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      canvas.toBlob(b => b ? resolve(b) : reject(new Error('Canvas toBlob mislukt')), 'image/jpeg', quality);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function blobNaarBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function blobNaarDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
