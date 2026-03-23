import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import {
  compressImageFilesToBase64,
  compressImageToBase64,
  getBase64TotalBytes,
} from "../utils/imageCompression";

const originalCreateElement = document.createElement.bind(document);
const originalImage = globalThis.Image;
const originalCreateObjectURL = globalThis.URL.createObjectURL;
const originalRevokeObjectURL = globalThis.URL.revokeObjectURL;

let createElementSpy;

function installCanvasAndImageMocks({
  imageWidth = 1000,
  imageHeight = 400,
  dataUrl = "data:image/jpeg;base64,compressed",
  hasContext = true,
  triggerError = false,
} = {}) {
  const drawImage = jest.fn();
  const context = hasContext ? { drawImage } : null;
  const canvas = {
    width: 0,
    height: 0,
    getContext: jest.fn(() => context),
    toDataURL: jest.fn(() => dataUrl),
  };

  createElementSpy = jest.spyOn(document, "createElement").mockImplementation((tagName) => {
    if (tagName === "canvas") {
      return canvas;
    }

    return originalCreateElement(tagName);
  });

  globalThis.Image = class MockImage {
    constructor() {
      this.width = imageWidth;
      this.height = imageHeight;
      this.onload = null;
      this.onerror = null;
    }

    set src(_value) {
      if (triggerError) {
        this.onerror?.(new Error("load failed"));
        return;
      }

      this.onload?.();
    }
  };

  return { canvas, drawImage };
}

describe("imageCompression utils", () => {
  beforeEach(() => {
    globalThis.URL.createObjectURL = jest.fn(() => "blob:mock-image");
    globalThis.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    createElementSpy?.mockRestore();
    createElementSpy = undefined;
    globalThis.Image = originalImage;

    if (originalCreateObjectURL) {
      globalThis.URL.createObjectURL = originalCreateObjectURL;
    } else {
      delete globalThis.URL.createObjectURL;
    }

    if (originalRevokeObjectURL) {
      globalThis.URL.revokeObjectURL = originalRevokeObjectURL;
    } else {
      delete globalThis.URL.revokeObjectURL;
    }
  });

  test("computes the total byte size of base64 strings", () => {
    const values = ["abc", "12345"];

    expect(getBase64TotalBytes(values)).toBe(new Blob(["abc12345"]).size);
  });

  test("compressImageToBase64 rejects non-image files", async () => {
    await expect(compressImageToBase64({ type: "text/plain" })).rejects.toThrow(
      "Please select a valid image file.",
    );
  });

  test("compressImageToBase64 resizes wide images and returns a jpeg data url", async () => {
    const { canvas, drawImage } = installCanvasAndImageMocks();

    await expect(compressImageToBase64({ type: "image/png" })).resolves.toBe(
      "data:image/jpeg;base64,compressed",
    );

    expect(canvas.width).toBe(500);
    expect(canvas.height).toBe(200);
    expect(drawImage).toHaveBeenCalledWith(expect.any(globalThis.Image), 0, 0, 500, 200);
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-image");
  });

  test("compressImageToBase64 rejects when canvas rendering is unavailable or the image fails", async () => {
    installCanvasAndImageMocks({ hasContext: false });

    await expect(compressImageToBase64({ type: "image/png" })).rejects.toThrow(
      "Image processing is not supported in this browser.",
    );

    createElementSpy.mockRestore();
    createElementSpy = undefined;

    installCanvasAndImageMocks({ triggerError: true });

    await expect(compressImageToBase64({ type: "image/png" })).rejects.toThrow(
      "Image could not be loaded.",
    );
  });

  test("compressImageFilesToBase64 supports array-like file lists and enforces the byte limit", async () => {
    installCanvasAndImageMocks({ dataUrl: "data:image/jpeg;base64,small" });

    await expect(
      compressImageFilesToBase64(
        {
          0: { type: "image/png" },
          1: { type: "image/png" },
          length: 2,
        },
        { maxTotalBytes: 10_000 },
      ),
    ).resolves.toEqual(["data:image/jpeg;base64,small", "data:image/jpeg;base64,small"]);

    createElementSpy.mockRestore();
    createElementSpy = undefined;

    installCanvasAndImageMocks({
      dataUrl: "data:image/jpeg;base64,this-string-is-intentionally-long-for-the-limit-check",
    });

    await expect(
      compressImageFilesToBase64([{ type: "image/png" }], { maxTotalBytes: 1 }),
    ).rejects.toThrow("Lutfen daha az veya daha kucuk fotograflar secin, depolama alani sinirli");
  });
});
