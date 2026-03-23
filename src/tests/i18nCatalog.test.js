import { beforeEach, describe, expect, test } from "@jest/globals";
import {
  DEFAULT_LANGUAGE,
  interpolate,
  isSupportedLanguage,
  LANGUAGE_STORAGE_KEY,
  resolveInitialLanguage,
  translations,
} from "../context/i18nCatalog";

describe("i18nCatalog", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("builds english and turkish dictionaries from a shared entry list", () => {
    expect(translations.en.navMyTravels).toBe("My Travels");
    expect(translations.tr.navMyTravels).toBe("Seyahatlerim");
    expect(translations.en.formPlaceName).toBe("Place Name");
    expect(translations.tr.formPlaceName).toBe("Mekan Ad\u0131");
  });

  test("resolves the stored language when it is supported", () => {
    expect(resolveInitialLanguage()).toBe(DEFAULT_LANGUAGE);

    localStorage.setItem(LANGUAGE_STORAGE_KEY, "tr");
    expect(resolveInitialLanguage()).toBe("tr");

    localStorage.setItem(LANGUAGE_STORAGE_KEY, "de");
    expect(resolveInitialLanguage()).toBe(DEFAULT_LANGUAGE);
  });

  test("interpolates variables and validates supported languages", () => {
    expect(interpolate("Rating: {{rating}}/5", { rating: 4 })).toBe("Rating: 4/5");
    expect(isSupportedLanguage("en")).toBe(true);
    expect(isSupportedLanguage("tr")).toBe(true);
    expect(isSupportedLanguage("de")).toBe(false);
  });

  test("defaults to english when localStorage is unavailable", () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");

    try {
      Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        value: undefined,
      });

      expect(resolveInitialLanguage()).toBe(DEFAULT_LANGUAGE);
    } finally {
      Object.defineProperty(globalThis, "localStorage", originalDescriptor);
    }
  });
});
