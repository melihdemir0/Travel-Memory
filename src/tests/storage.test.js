import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import {
  addMemory,
  deleteMemory,
  loadMemories,
  STORAGE_KEY,
  saveMemories,
  updateMemory,
} from "../utils/storage";

const baseMemory = {
  id: "memory-1",
  place: "Antalya Trip",
  address: "Antalya, Turkey",
  lat: 36.8841,
  lng: 30.7056,
  rating: 5,
  notes: "Great trip",
  date: "2026-03-14",
  createdAt: "2026-03-14T10:00:00.000Z",
  image: "",
  images: [],
};

describe("storage utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("loadMemories returns empty array when nothing is stored", () => {
    expect(loadMemories()).toEqual([]);
  });

  test("saveMemories persists and loadMemories returns normalized data", () => {
    saveMemories([baseMemory]);
    const loaded = loadMemories();
    expect(loaded).toEqual([baseMemory]);
  });

  test("loadMemories falls back for malformed, legacy, and non-array storage values", () => {
    localStorage.setItem(STORAGE_KEY, "{invalid-json");
    expect(loadMemories()).toEqual([]);

    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem("travel_memories", JSON.stringify([baseMemory]));
    expect(loadMemories()).toEqual([baseMemory]);

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ bad: true }));
    expect(loadMemories()).toEqual([]);
  });

  test("addMemory inserts at the beginning and updates localStorage", () => {
    const secondMemory = { ...baseMemory, id: "memory-2" };
    saveMemories([baseMemory]);
    const result = addMemory(secondMemory);

    expect(result.map((memory) => memory.id)).toEqual(["memory-2", "memory-1"]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toHaveLength(2);
  });

  test("updateMemory replaces memory by id", () => {
    saveMemories([baseMemory]);
    const updated = updateMemory({ ...baseMemory, place: "Updated Place" });
    expect(updated[0].place).toBe("Updated Place");
  });

  test("deleteMemory removes memory by id", () => {
    saveMemories([baseMemory]);
    const result = deleteMemory(baseMemory.id);
    expect(result).toEqual([]);
  });

  test("saveMemories maps quota errors to a user-friendly message and rethrows unknown errors", () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
    setItemSpy.mockImplementationOnce(() => {
      const error = new Error("quota");
      error.name = "QuotaExceededError";
      throw error;
    });

    expect(() => saveMemories([baseMemory])).toThrow("Hafiza doldu, lutfen bazi anilari silin");

    setItemSpy.mockImplementationOnce(() => {
      throw new Error("unexpected");
    });

    expect(() => saveMemories([baseMemory])).toThrow("unexpected");
  });
});
