import { geocodeAddress } from "./geocoding";

function hasValidCoordinates(latitude, longitude) {
  return Number.isFinite(latitude) && Number.isFinite(longitude);
}

function hasCoordinateHint(value) {
  return value !== "" && value !== null && value !== undefined;
}

function getHintedLocation(formData) {
  if (!hasCoordinateHint(formData.lat) || !hasCoordinateHint(formData.lng)) {
    return null;
  }

  const latitude = Number(formData.lat);
  const longitude = Number(formData.lng);
  if (!hasValidCoordinates(latitude, longitude)) {
    return null;
  }

  return {
    lat: latitude,
    lng: longitude,
    address: formData.address,
  };
}

function getExistingMemoryLocation(existingMemory, address) {
  if (!existingMemory || existingMemory.address !== address) {
    return null;
  }

  return {
    lat: existingMemory.lat,
    lng: existingMemory.lng,
    address: existingMemory.address,
  };
}

export async function resolveMemoryLocation(formData, existingMemory) {
  const hintedLocation = getHintedLocation(formData);
  if (hintedLocation) {
    return hintedLocation;
  }

  const existingLocation = getExistingMemoryLocation(existingMemory, formData.address);
  if (existingLocation) {
    return existingLocation;
  }

  return geocodeAddress(formData.address);
}
