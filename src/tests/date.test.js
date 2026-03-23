import { describe, expect, jest, test } from "@jest/globals";
import { formatDisplayDate } from "../utils/date";

describe("date utils", () => {
  test("returns a placeholder for empty dates", () => {
    expect(formatDisplayDate("")).toBe("-");
    expect(formatDisplayDate(null)).toBe("-");
  });

  test("formats dates using the platform locale formatter", () => {
    const dateSpy = jest.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue("03/19/2026");

    expect(formatDisplayDate("2026-03-19")).toBe("03/19/2026");

    dateSpy.mockRestore();
  });
});
