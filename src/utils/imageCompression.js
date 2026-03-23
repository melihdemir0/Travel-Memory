const DEFAULT_MAX_WIDTH = 500;
const DEFAULT_QUALITY = 0.5;
const DEFAULT_MAX_TOTAL_BYTES = 1_000_000;

function getByteSize(value) {
  return new Blob([value]).size;
}

export function getBase64TotalBytes(values) {
  return (values || []).reduce((sum, value) => sum + getByteSize(value), 0);
}

function calculateSize(width, height, maxWidth) {
  if (width <= maxWidth) {
    return { width, height };
  }

  const ratio = maxWidth / width;
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

export function compressImageToBase64(file, options = {}) {
  const maxWidth = options.maxWidth ?? DEFAULT_MAX_WIDTH;
  const quality = options.quality ?? DEFAULT_QUALITY;

  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith("image/")) {
      reject(new Error("Please select a valid image file."));
      return;
    }

    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      const { width, height } = calculateSize(image.width, image.height, maxWidth);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Image processing is not supported in this browser."));
        return;
      }

      context.drawImage(image, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
      URL.revokeObjectURL(objectUrl);
      resolve(compressedBase64);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image could not be loaded."));
    };

    image.src = objectUrl;
  });
}

export async function compressImageFilesToBase64(fileList, options = {}) {
  const files = Array.isArray(fileList) ? fileList : Array.from(fileList || []);
  const maxTotalBytes = options.maxTotalBytes ?? DEFAULT_MAX_TOTAL_BYTES;
  const results = [];
  let totalBytes = 0;

  for (const file of files) {
    const compressed = await compressImageToBase64(file, options);
    totalBytes += getByteSize(compressed);

    if (totalBytes > maxTotalBytes) {
      throw new Error("Lutfen daha az veya daha kucuk fotograflar secin, depolama alani sinirli");
    }

    results.push(compressed);
  }

  return results;
}
