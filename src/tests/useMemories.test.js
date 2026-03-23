import { beforeEach, describe, expect, test } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";
import { useMemories } from "../hooks/useMemories";
import { STORAGE_KEY } from "../utils/storage";

const memoryInput = {
  place: "Paris Trip",
  address: "Paris, France",
  lat: 48.8566,
  lng: 2.3522,
  rating: 4,
  notes: "Amazing city",
  date: "2026-03-14",
};

function getStoredMemories() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

describe("useMemories hook", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("addMemory creates a memory and persists it", () => {
    const { result } = renderHook(() => useMemories());
    let createdMemory = null;

    act(() => {
      createdMemory = result.current.addMemory(memoryInput);
    });

    expect(createdMemory.id).toBeDefined();
    expect(createdMemory.createdAt).toBeDefined();
    expect(result.current.memories).toHaveLength(1);
    expect(getStoredMemories()).toHaveLength(1);
  });

  test("updateMemory updates existing memory", () => {
    const { result } = renderHook(() => useMemories());
    let createdMemory = null;

    act(() => {
      createdMemory = result.current.addMemory(memoryInput);
    });

    act(() => {
      result.current.updateMemory({
        ...createdMemory,
        place: "Updated Paris Trip",
      });
    });

    expect(result.current.memories[0].place).toBe("Updated Paris Trip");
    expect(getStoredMemories()[0].place).toBe("Updated Paris Trip");
  });

  test("deleteMemory removes memory from state and storage", () => {
    const { result } = renderHook(() => useMemories());
    let createdMemory = null;

    act(() => {
      createdMemory = result.current.addMemory(memoryInput);
    });

    act(() => {
      result.current.deleteMemory(createdMemory.id);
    });

    expect(result.current.memories).toHaveLength(0);
    expect(getStoredMemories()).toHaveLength(0);
  });

  test("getMemories returns the current in-memory collection", () => {
    const { result } = renderHook(() => useMemories());

    act(() => {
      result.current.addMemory(memoryInput);
    });

    expect(result.current.getMemories()).toEqual(result.current.memories);
  });
});
