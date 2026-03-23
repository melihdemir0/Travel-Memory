import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAddressSuggestions } from "../hooks/useAddressSuggestions";

function mockJsonResponse(data) {
  return {
    ok: true,
    json: async () => data,
  };
}

async function waitForDebounce() {
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 350);
    });
  });
}

describe("useAddressSuggestions hook", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("loads suggestions after the debounce and lets the caller clear them", async () => {
    globalThis.fetch.mockResolvedValueOnce(
      mockJsonResponse([{ lat: "41.0082", lon: "28.9784", display_name: "Istanbul, Turkey" }]),
    );

    const { result } = renderHook(() => useAddressSuggestions("Istanbul"));

    await waitForDebounce();

    await waitFor(() => {
      expect(result.current.suggestions).toEqual([
        { label: "Istanbul, Turkey", lat: 41.0082, lng: 28.9784 },
      ]);
    });

    act(() => {
      result.current.clearSuggestions();
    });

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  test("clears suggestions when disabled and skips short queries", async () => {
    globalThis.fetch.mockResolvedValueOnce(
      mockJsonResponse([{ lat: "48.8566", lon: "2.3522", display_name: "Paris, France" }]),
    );

    const { result, rerender } = renderHook(
      ({ query, enabled }) => useAddressSuggestions(query, enabled),
      {
        initialProps: { query: "Paris", enabled: true },
      },
    );

    await waitForDebounce();
    await waitFor(() => {
      expect(result.current.suggestions).toHaveLength(1);
    });

    rerender({ query: "Paris", enabled: false });
    await waitFor(() => {
      expect(result.current.suggestions).toEqual([]);
    });

    rerender({ query: "ab", enabled: true });
    await waitForDebounce();

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  test("falls back to an empty state when suggestion loading fails", async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error("network"));

    const { result } = renderHook(() => useAddressSuggestions("Ankara"));

    await waitForDebounce();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.suggestions).toEqual([]);
  });
});
