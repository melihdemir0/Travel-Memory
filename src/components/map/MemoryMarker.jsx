import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  MapPin,
  Quote,
  Star,
} from "lucide-react";
import { CircleMarker, Popup } from "react-leaflet";
import { useI18n } from "../../context/I18nContext";
import { formatDisplayDate } from "../../utils/date";
import { openImageModal } from "../../utils/imageModal";

const MARKER_RADIUS = 9;
const MARKER_HOVER_RADIUS = 11;
const MARKER_BORDER_COLOR = "#ffffff";
const MARKER_BORDER_WIDTH = 2;

const DEFAULT_MARKER_COLOR = "#3b82f6";
const RATING_MARKER_COLORS = {
  1: "#ef4444",
  2: "#f97316",
  3: "#3b82f6",
  4: "#10b981",
  5: "#f59e0b",
};

function MemoryPopup({ memory, onEdit, onDelete }) {
  const { t } = useI18n();
  const handleEditClick = () => onEdit(memory.id);
  const handleDeleteClick = () => onDelete(memory.id);
  const images = useMemo(() => {
    if (Array.isArray(memory.images) && memory.images.length > 0) {
      return memory.images.filter(Boolean);
    }

    return memory.image ? [memory.image] : [];
  }, [memory.image, memory.images]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, []);

  const imageUrl = images[activeImageIndex] || "";

  function handleOpenImagePreview(event, imageIndex = activeImageIndex) {
    event.stopPropagation();
    if (!images || images.length === 0) {
      return;
    }
    openImageModal({ images, initialIndex: imageIndex });
  }

  function handlePrevImage() {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1,
    );
  }

  function handleNextImage() {
    setActiveImageIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1,
    );
  }

  return (
    <div className="memory-popup">
      <div className="memory-popup-hero" aria-hidden="true">
        {imageUrl ? (
          <button
            type="button"
            className="memory-popup-image-wrapper modal-zoom-trigger"
            onClick={(event) => handleOpenImagePreview(event, activeImageIndex)}
            onKeyDown={(e) => e.key === "Enter" && handleOpenImagePreview(e, activeImageIndex)}
            aria-label={t("openImageGallery")}
          >
            <img src={imageUrl} alt={memory.place} className="memory-popup-image" />
          </button>
        ) : (
          <div className="memory-popup-media-fallback">
            <ImageOff size={20} strokeWidth={1.9} />
            <span>{t("noPhoto")}</span>
          </div>
        )}

        <div className="memory-popup-hero-overlay">
          <h4 className="memory-popup-title">{memory.place}</h4>
          <div
            className="memory-popup-rating memory-popup-rating--hero"
            role="img"
            aria-label={t("memoryRating", { rating: memory.rating })}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={`popup-star-${index < memory.rating ? "filled" : "empty"}`}
                size={18}
                strokeWidth={2}
                fill={index < memory.rating ? "#fbbf24" : "transparent"}
                color={index < memory.rating ? "#fbbf24" : "#e2e8f0"}
              />
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <div className="memory-popup-slider-controls">
            <button
              type="button"
              onClick={handlePrevImage}
              className="memory-popup-slider-btn"
              aria-label={t("previousPhoto")}
            >
              <ChevronLeft size={16} strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="memory-popup-slider-btn"
              aria-label={t("nextPhoto")}
            >
              <ChevronRight size={16} strokeWidth={2.2} />
            </button>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <section className="memory-popup-thumbs" aria-label={t("photoGallery")}>
          {images?.map((image, index) => (
            <button
              key={`thumb-${image.substring(0, 20)}`}
              type="button"
              onClick={(event) => {
                setActiveImageIndex(index);
                handleOpenImagePreview(event, index);
              }}
              className={`memory-popup-thumb ${index === activeImageIndex ? "is-active" : ""}`}
              aria-label={t("photoItem", { index: index + 1 })}
            >
              <img src={image} alt="" className="memory-popup-thumb-image" />
            </button>
          ))}
        </section>
      )}

      <div className="memory-popup-body">
        <p className="memory-popup-info-row memory-popup-address">
          <MapPin size={14} strokeWidth={1.9} />
          <span>{memory.address}</span>
        </p>

        <p className="memory-popup-info-row memory-popup-date">
          <CalendarDays size={14} strokeWidth={1.9} />
          <span>{t("memoryVisited", { date: formatDisplayDate(memory.date) })}</span>
        </p>

        <div className="memory-popup-note-box">
          <p className="memory-popup-info-row memory-popup-notes">
            <Quote size={14} strokeWidth={1.8} />
            <span>{memory.notes || t("noNotesProvided")}</span>
          </p>
        </div>
      </div>

      <div className="memory-popup-actions">
        <button
          type="button"
          onClick={handleEditClick}
          className="memory-popup-btn memory-popup-btn-edit"
        >
          {t("edit")}
        </button>
        <button
          type="button"
          onClick={handleDeleteClick}
          className="memory-popup-btn memory-popup-btn-delete"
        >
          {t("delete")}
        </button>
      </div>
    </div>
  );
}

MemoryPopup.propTypes = {
  memory: PropTypes.shape({
    id: PropTypes.string.isRequired,
    place: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    notes: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

function buildMarkerPathOptions(rating) {
  return {
    color: MARKER_BORDER_COLOR,
    weight: MARKER_BORDER_WIDTH,
    fillColor: RATING_MARKER_COLORS[rating] ?? DEFAULT_MARKER_COLOR,
    fillOpacity: 1,
  };
}

function MemoryMarker({ memory, onSelect, onEdit, onDelete }) {
  const pathOptions = useMemo(() => buildMarkerPathOptions(memory.rating), [memory.rating]);

  const markerEventHandlers = useMemo(
    () => ({
      click: () => onSelect(memory.id),
      mouseover: (event) => event.target.setRadius(MARKER_HOVER_RADIUS),
      mouseout: (event) => event.target.setRadius(MARKER_RADIUS),
    }),
    [memory.id, onSelect],
  );

  return (
    <CircleMarker
      center={[memory.lat, memory.lng]}
      radius={MARKER_RADIUS}
      pathOptions={pathOptions}
      eventHandlers={markerEventHandlers}
      keyboard
    >
      <Popup>
        <MemoryPopup memory={memory} onEdit={onEdit} onDelete={onDelete} />
      </Popup>
    </CircleMarker>
  );
}

MemoryMarker.propTypes = {
  memory: PropTypes.shape({
    id: PropTypes.string.isRequired,
    place: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    notes: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default MemoryMarker;
