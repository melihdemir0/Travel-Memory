import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { geocodeAddress, searchAddressSuggestions } from "../utils/geocoding";

const FETCH_OK_RESPONSE = { ok: true };
const LOCATION_NOT_FOUND_ERROR = "Location not found. Please enter a valid address.";

function mockJsonResponse(data) {
  return {
    ...FETCH_OK_RESPONSE,
    json: async () => data,
  };
}

describe("geocoding utils", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("geocodeAddress returns numeric coordinates", async () => {
    globalThis.fetch.mockResolvedValueOnce(
      mockJsonResponse([{ lat: "36.8841", lon: "30.7056", display_name: "Antalya, Turkey" }]),
    );

    const result = await geocodeAddress("Antalya");

    expect(result).toEqual({
      lat: 36.8841,
      lng: 30.7056,
      address: "Antalya, Turkey",
    });
  });

  test("geocodeAddress throws when no results are returned", async () => {
    globalThis.fetch.mockResolvedValueOnce(mockJsonResponse([]));

    await expect(geocodeAddress("Unknown Place")).rejects.toThrow(LOCATION_NOT_FOUND_ERROR);
  });

  test("geocodeAddress throws when the response is not ok or address is blank", async () => {
    globalThis.fetch.mockResolvedValueOnce({ ok: false, json: async () => [] });

    await expect(geocodeAddress("Antalya")).rejects.toThrow(LOCATION_NOT_FOUND_ERROR);
    await expect(geocodeAddress("   ")).rejects.toThrow("Address is required.");
  });

  test("searchAddressSuggestions returns empty list for short query", async () => {
    const result = await searchAddressSuggestions("ab");
    expect(result).toEqual([]);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  test("searchAddressSuggestions filters invalid coordinates", async () => {
    globalThis.fetch.mockResolvedValueOnce(
      mockJsonResponse([
        { lat: "10", lon: "20", display_name: "Valid Place" },
        { lat: "abc", lon: "20", display_name: "Invalid Place" },
      ]),
    );

    const suggestions = await searchAddressSuggestions("valid");
    expect(suggestions).toEqual([{ label: "Valid Place", lat: 10, lng: 20 }]);
  });

  test("searchAddressSuggestions returns empty list when the API response is not an array", async () => {
    globalThis.fetch.mockResolvedValueOnce(mockJsonResponse({ message: "unexpected" }));

    await expect(searchAddressSuggestions("valid")).resolves.toEqual([]);
  });
});
