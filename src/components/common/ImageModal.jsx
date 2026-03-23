import { ChevronLeft, ChevronRight, X } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";

function ImageModal({ imageData, onClose }) {
  const images = useMemo(
    () => (Array.isArray(imageData?.images) ? imageData.images.filter(Boolean) : []),
    [imageData],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) {
      setActiveIndex(0);
      return;
    }

    const desiredIndex = Number(imageData?.initialIndex || 0);
    const normalizedIndex = Math.max(0, Math.min(desiredIndex, images.length - 1));
    setActiveIndex(normalizedIndex);
  }, [imageData, images]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (images.length === 0) {
    return null;
  }

  const currentImage = images[activeIndex] || images[0];

  function handlePrev() {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  }

  function handleNext() {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  }
  return (
    <dialog open className="image-modal-overlay" aria-label="Travel memory image viewer">
      <button
        type="button"
        className="image-modal-backdrop"
        onClick={onClose}
        aria-label="Close image viewer"
      />
      <div className="image-modal-content">
        <button
          type="button"
          onClick={onClose}
          className="image-modal-close-btn"
          aria-label="Close image"
        >
          <X size={24} strokeWidth={2.1} />
        </button>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="image-modal-nav-btn image-modal-nav-btn--left"
              aria-label="Previous photo"
            >
              <ChevronLeft size={22} strokeWidth={2.1} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="image-modal-nav-btn image-modal-nav-btn--right"
              aria-label="Next photo"
            >
              <ChevronRight size={22} strokeWidth={2.1} />
            </button>
          </>
        )}

        <img src={currentImage} alt="Travel memory" className="image-modal-image" />
      </div>
    </dialog>
  );
}

ImageModal.propTypes = {
  imageData: PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.string),
    initialIndex: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
};

ImageModal.defaultProps = {
  imageData: null,
};

export default ImageModal;
