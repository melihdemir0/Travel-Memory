export const MEMORY_RATING_MIN = 1;
export const MEMORY_RATING_MAX = 5;

export const emptyMemoryDraft = {
  place: "",
  address: "",
  rating: 3,
  notes: "",
  date: "",
  image: "",
  images: [],
};

function toSafeString(value, fallback = "") {
  return String(value ?? fallback);
}

function toSafeStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => toSafeString(item)).filter(Boolean);
}

function resolveMemoryImages(memoryLike) {
  const normalizedImages = toSafeStringArray(memoryLike.images);
  if (normalizedImages.length > 0) {
    return normalizedImages;
  }

  const fallbackImage = toSafeString(memoryLike.image);
  return fallbackImage ? [fallbackImage] : [];
}

function isValidRating(rating) {
  return rating >= MEMORY_RATING_MIN && rating <= MEMORY_RATING_MAX;
}

function isValidCoordinates(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng);
}

function sanitizeMemory(rawMemory, lat, lng, rating) {
  const images = resolveMemoryImages(rawMemory);

  return {
    ...rawMemory,
    id: toSafeString(rawMemory.id),
    place: toSafeString(rawMemory.place),
    address: toSafeString(rawMemory.address),
    notes: toSafeString(rawMemory.notes),
    date: toSafeString(rawMemory.date),
    image: images[0] || "",
    images,
    createdAt: toSafeString(rawMemory.createdAt, new Date().toISOString()),
    lat,
    lng,
    rating,
  };
}

export function createMemory(memoryInput) {
  const images = resolveMemoryImages(memoryInput);

  return {
    id: memoryInput.id,
    place: memoryInput.place.trim(),
    address: memoryInput.address.trim(),
    lat: Number(memoryInput.lat),
    lng: Number(memoryInput.lng),
    rating: Number(memoryInput.rating),
    notes: memoryInput.notes.trim(),
    date: memoryInput.date,
    image: images[0] || "",
    images,
    createdAt: memoryInput.createdAt,
  };
}

export function normalizeMemory(rawMemory) {
  if (!rawMemory || typeof rawMemory !== "object") {
    return null;
  }

  const lat = Number(rawMemory.lat);
  const lng = Number(rawMemory.lng);
  const rating = Number(rawMemory.rating);
  if (!isValidCoordinates(lat, lng) || !isValidRating(rating)) {
    return null;
  }

  return createMemory(sanitizeMemory(rawMemory, lat, lng, rating));
}
