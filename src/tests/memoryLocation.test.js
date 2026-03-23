import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { resolveMemoryLocation } from "../utils/memoryLocation";

function mockJsonResponse(data) {
  return {
    ok: true,
    json: async () => data,
  };
}

describe("memoryLocation utils", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("prefers hinted coordinates from form data when they are valid", async () => {
    await expect(
      resolveMemoryLocation(
        {
          address: "Tokyo, Japan",
          lat: "35.6762",
          lng: "139.6503",
        },
        null,
      ),
    ).resolves.toEqual({
      address: "Tokyo, Japan",
      lat: 35.6762,
      lng: 139.6503,
    });

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  test("reuses the existing memory location when the address is unchanged", async () => {
    await expect(
      resolveMemoryLocation(
        {
          address: "Tokyo, Japan",
          lat: "",
          lng: "",
        },
        {
          address: "Tokyo, Japan",
          lat: 35.6762,
          lng: 139.6503,
        },
      ),
    ).resolves.toEqual({
      address: "Tokyo, Japan",
      lat: 35.6762,
      lng: 139.6503,
    });

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  test("geocodes the address when no reusable coordinates are available", async () => {
    globalThis.fetch.mockResolvedValueOnce(
      mockJsonResponse([{ lat: "48.8566", lon: "2.3522", display_name: "Paris, France" }]),
    );

    await expect(
      resolveMemoryLocation(
        {
          address: "Paris",
          lat: undefined,
          lng: undefined,
        },
        {
          address: "Old address",
          lat: 1,
          lng: 2,
        },
      ),
    ).resolves.toEqual({
      address: "Paris, France",
      lat: 48.8566,
      lng: 2.3522,
    });
  });
});
