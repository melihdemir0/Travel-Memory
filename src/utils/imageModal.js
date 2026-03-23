export const IMAGE_MODAL_OPEN_EVENT = "open-image-modal";

export function openImageModal(payload) {
  if (!payload) {
    return;
  }

  const detail =
    typeof payload === "string"
      ? { images: [payload], initialIndex: 0 }
      : {
          images: Array.isArray(payload.images) ? payload.images.filter(Boolean) : [],
          initialIndex: Number(payload.initialIndex || 0),
        };

  if (detail.images.length === 0) {
    return;
  }

  globalThis.dispatchEvent(
    new CustomEvent(IMAGE_MODAL_OPEN_EVENT, {
      detail,
    }),
  );
}
