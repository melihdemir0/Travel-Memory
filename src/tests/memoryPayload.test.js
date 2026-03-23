import { describe, expect, test } from "@jest/globals";
import {
  buildCreatedMemoryPayload,
  buildUpdatedMemoryPayload,
  findMemoryById,
} from "../utils/memoryPayload";

const formData = {
  place: "Tokyo",
  address: "Old address",
  rating: 5,
  notes: "Great trip",
};

const location = {
  address: "Tokyo, Japan",
  lat: 35.6762,
  lng: 139.6503,
};

describe("memoryPayload utils", () => {
  test("buildCreatedMemoryPayload merges form data with the resolved location", () => {
    expect(buildCreatedMemoryPayload(formData, location)).toEqual({
      ...formData,
      address: "Tokyo, Japan",
      lat: 35.6762,
      lng: 139.6503,
    });
  });

  test("buildUpdatedMemoryPayload preserves existing fields while replacing editable values", () => {
    expect(
      buildUpdatedMemoryPayload(
        { id: "memory-1", createdAt: "2026-03-19T10:00:00.000Z", archived: true },
        formData,
        location,
      ),
    ).toEqual({
      id: "memory-1",
      createdAt: "2026-03-19T10:00:00.000Z",
      archived: true,
      ...formData,
      address: "Tokyo, Japan",
      lat: 35.6762,
      lng: 139.6503,
    });
  });

  test("findMemoryById returns a matching memory or null", () => {
    const memories = [{ id: "a" }, { id: "b" }];

    expect(findMemoryById(memories, "b")).toEqual({ id: "b" });
    expect(findMemoryById(memories, "missing")).toBeNull();
    expect(findMemoryById(memories, "")).toBeNull();
  });
});
