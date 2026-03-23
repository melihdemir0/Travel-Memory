const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const LOCATION_NOT_FOUND_MESSAGE = "Location not found. Please enter a valid address.";
const ADDRESS_REQUIRED_MESSAGE = "Address is required.";
const AUTOCOMPLETE_MIN_QUERY_LENGTH = 3;
const GEOCODE_RESULT_LIMIT = 1;
const SUGGESTION_RESULT_LIMIT = 5;

function buildSearchParams(query, limit) {
  return new URLSearchParams({
    q: query,
    format: "json",
    addressdetails: "1",
    limit: String(limit),
  });
}

function createLocationError() {
  return new Error(LOCATION_NOT_FOUND_MESSAGE);
}

async function requestNominatim(query, limit) {
  const response = await fetch(`${NOMINATIM_URL}?${buildSearchParams(query, limit).toString()}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw createLocationError();
  }

  return response.json();
}

function parseCoordinates(latValue, lonValue) {
  const lat = Number(latValue);
  const lng = Number(lonValue);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw createLocationError();
  }

  return { lat, lng };
}

function toGeocodedLocation(result, fallbackAddress) {
  const coordinates = parseCoordinates(result.lat, result.lon);

  return {
    ...coordinates,
    address: result.display_name ?? fallbackAddress,
  };
}

function normalizeAddressInput(address) {
  const normalizedAddress = address.trim();
  if (!normalizedAddress) {
    throw new Error(ADDRESS_REQUIRED_MESSAGE);
  }

  return normalizedAddress;
}

function toSuggestion(result) {
  try {
    return {
      label: result.display_name,
      ...parseCoordinates(result.lat, result.lon),
    };
  } catch {
    return null;
  }
}

export async function geocodeAddress(address) {
  const normalizedAddress = normalizeAddressInput(address);

  try {
    const results = await requestNominatim(normalizedAddress, GEOCODE_RESULT_LIMIT);
    if (!Array.isArray(results) || results.length === 0) {
      throw createLocationError();
    }

    return toGeocodedLocation(results[0], normalizedAddress);
  } catch {
    throw createLocationError();
  }
}

export async function searchAddressSuggestions(query) {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < AUTOCOMPLETE_MIN_QUERY_LENGTH) {
    return [];
  }

  const results = await requestNominatim(normalizedQuery, SUGGESTION_RESULT_LIMIT);
  if (!Array.isArray(results)) {
    return [];
  }

  return results.map(toSuggestion).filter(Boolean);
}
