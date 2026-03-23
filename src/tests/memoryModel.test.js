import { describe, expect, test } from "@jest/globals";
import {
  createMemory,
  emptyMemoryDraft,
  MEMORY_RATING_MAX,
  MEMORY_RATING_MIN,
  normalizeMemory,
} from "../interfaces/Memory";

describe("Memory model helpers", () => {
  test("exposes the expected empty draft and rating bounds", () => {
    expect(emptyMemoryDraft).toEqual({
      place: "",
      address: "",
      rating: 3,
      notes: "",
      date: "",
      image: "",
      images: [],
    });
    expect(MEMORY_RATING_MIN).toBe(1);
    expect(MEMORY_RATING_MAX).toBe(5);
  });

  test("createMemory trims strings and derives the primary image from the gallery", () => {
    expect(
      createMemory({
        id: "memory-1",
        place: "  Tokyo  ",
        address: "  Tokyo, Japan  ",
        lat: "35.6762",
        lng: "139.6503",
        rating: "5",
        notes: "  Great trip  ",
        date: "2026-03-19",
        image: "fallback.jpg",
        images: ["hero.jpg", "", null],
        createdAt: "2026-03-19T10:00:00.000Z",
      }),
    ).toEqual({
      id: "memory-1",
      place: "Tokyo",
      address: "Tokyo, Japan",
      lat: 35.6762,
      lng: 139.6503,
      rating: 5,
      notes: "Great trip",
      date: "2026-03-19",
      image: "hero.jpg",
      images: ["hero.jpg"],
      createdAt: "2026-03-19T10:00:00.000Z",
    });
  });

  test("normalizeMemory falls back to a single legacy image and rejects invalid memories", () => {
    const normalized = normalizeMemory({
      id: 99,
      place: "Istanbul",
      address: "Istanbul, Turkey",
      lat: "41.0082",
      lng: "28.9784",
      rating: "4",
      notes: null,
      date: "2026-03-19",
      image: "legacy.jpg",
      images: undefined,
    });

    expect(normalized).toEqual({
      id: "99",
      place: "Istanbul",
      address: "Istanbul, Turkey",
      lat: 41.0082,
      lng: 28.9784,
      rating: 4,
      notes: "",
      date: "2026-03-19",
      image: "legacy.jpg",
      images: ["legacy.jpg"],
      createdAt: expect.any(String),
    });

    expect(normalizeMemory(null)).toBeNull();
    expect(
      normalizeMemory({
        id: "bad-rating",
        place: "Place",
        address: "Address",
        lat: 1,
        lng: 2,
        rating: 0,
      }),
    ).toBeNull();
    expect(
      normalizeMemory({
        id: "bad-coordinates",
        place: "Place",
        address: "Address",
        lat: "abc",
        lng: 2,
        rating: 3,
      }),
    ).toBeNull();
  });
});
