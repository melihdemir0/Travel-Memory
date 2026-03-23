import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { IMAGE_MODAL_OPEN_EVENT, openImageModal } from "../utils/imageModal";

describe("imageModal utils", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("dispatches the image modal event for string payloads", () => {
    const dispatchSpy = jest.spyOn(globalThis, "dispatchEvent").mockReturnValue(true);

    openImageModal("photo-a.jpg");

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy.mock.calls[0][0]).toBeInstanceOf(CustomEvent);
    expect(dispatchSpy.mock.calls[0][0].type).toBe(IMAGE_MODAL_OPEN_EVENT);
    expect(dispatchSpy.mock.calls[0][0].detail).toEqual({
      images: ["photo-a.jpg"],
      initialIndex: 0,
    });
  });

  test("normalizes object payloads before dispatching", () => {
    const dispatchSpy = jest.spyOn(globalThis, "dispatchEvent").mockReturnValue(true);

    openImageModal({
      images: ["photo-a.jpg", "", null, "photo-b.jpg"],
      initialIndex: "2",
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy.mock.calls[0][0].detail).toEqual({
      images: ["photo-a.jpg", "photo-b.jpg"],
      initialIndex: 2,
    });
  });

  test("does nothing when the payload is missing or contains no valid images", () => {
    const dispatchSpy = jest.spyOn(globalThis, "dispatchEvent").mockReturnValue(true);

    openImageModal();
    openImageModal({ images: ["", null] });

    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
