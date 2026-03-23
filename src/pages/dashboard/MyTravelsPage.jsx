import { CalendarDays, ImageOff, MapPin, Star } from "lucide-react";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import { formatDisplayDate } from "../../utils/date";
import { openImageModal } from "../../utils/imageModal";

function TravelCard({ memory, onOpenMap, onEditMemory, onDeleteMemory }) {
  const { t } = useI18n();
  const handleOpenMap = useCallback(() => onOpenMap(memory.id), [memory.id, onOpenMap]);
  const handleEditMemory = useCallback(() => onEditMemory(memory.id), [memory.id, onEditMemory]);
  const handleDeleteMemory = useCallback(
    () => onDeleteMemory(memory.id),
    [memory.id, onDeleteMemory],
  );

  const imageUrl = memory.images?.[0] ?? memory.image ?? memory.imageUrl ?? "";
  let imageGallery = [];
  if (Array.isArray(memory.images)) {
    imageGallery = memory.images.filter(Boolean);
  } else if (imageUrl) {
    imageGallery = [imageUrl];
  }
  const notesSuffix = memory.notes?.length > 130 ? "..." : "";
  const notesPreview = memory.notes ? `${memory.notes.slice(0, 130)}${notesSuffix}` : t("noNotes");

  function handleOpenImagePreview(event) {
    event.preventDefault();
    event.stopPropagation();
    if (imageGallery.length === 0) {
      return;
    }
    openImageModal({ images: imageGallery, initialIndex: 0 });
  }

  return (
    <article className="travel-journal-card rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <button type="button" onClick={handleOpenMap} className="travel-card-main w-full text-left">
        <div className="travel-card-shell">
          <div className="travel-card-media" aria-hidden="true">
            {imageUrl ? (
              <button
                type="button"
                className="travel-card-image-wrapper modal-zoom-trigger"
                onClick={handleOpenImagePreview}
                onKeyDown={(e) => e.key === "Enter" && handleOpenImagePreview(e)}
                aria-label={t("openImageGallery")}
              >
                <img src={imageUrl} alt={memory.place} className="travel-card-image" />
              </button>
            ) : (
              <div className="travel-card-media-fallback">
                <ImageOff size={28} strokeWidth={1.9} />
              </div>
            )}
          </div>

          <div className="travel-card-content">
            <div className="travel-card-header">
              <h3 className="travel-card-title text-lg font-semibold text-gray-900">
                {memory.place}
              </h3>
              <span className="travel-card-badge">{memory.place}</span>
            </div>

            <p className="travel-card-location text-sm text-gray-600">
              <MapPin size={16} strokeWidth={2} />
              <span>{memory.address}</span>
            </p>

            <p className="travel-card-date text-sm text-gray-600">
              <CalendarDays size={16} strokeWidth={2} />
              <span>{t("memoryVisited", { date: formatDisplayDate(memory.date) })}</span>
            </p>

            <div
              className="travel-card-rating"
              role="img"
              aria-label={t("memoryRating", { rating: memory.rating })}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={`star-${index < memory.rating ? "filled" : "empty"}`}
                  size={18}
                  strokeWidth={2}
                  fill={index < memory.rating ? "#F55A5A" : "transparent"}
                  color={index < memory.rating ? "#F55A5A" : "#CBD5E0"}
                  className="travel-card-star"
                />
              ))}
              <span className="travel-card-rating-value">{memory.rating}/5</span>
            </div>

            <p className="travel-card-notes text-sm text-gray-600">{notesPreview}</p>
          </div>
        </div>
      </button>

      <div className="travel-card-actions mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleOpenMap}
          className="travel-card-action btn-secondary px-3 py-1.5 text-sm"
        >
          {t("viewOnMap")}
        </button>
        <button
          type="button"
          onClick={handleEditMemory}
          className="travel-card-action btn-secondary px-3 py-1.5 text-sm"
        >
          {t("edit")}
        </button>
        <button
          type="button"
          onClick={handleDeleteMemory}
          className="travel-card-action btn-danger px-3 py-1.5 text-sm"
        >
          {t("delete")}
        </button>
      </div>
    </article>
  );
}

TravelCard.propTypes = {
  memory: PropTypes.shape({
    id: PropTypes.string.isRequired,
    place: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string,
    imageUrl: PropTypes.string,
  }).isRequired,
  onOpenMap: PropTypes.func.isRequired,
  onEditMemory: PropTypes.func.isRequired,
  onDeleteMemory: PropTypes.func.isRequired,
};

function MyTravelsPage({ memories, onOpenMap, onEditMemory, onDeleteMemory }) {
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleOpenMap = useCallback(
    (memoryId) => {
      onOpenMap(memoryId);
      navigate("/dashboard/map");
    },
    [navigate, onOpenMap],
  );

  const handleEditMemory = useCallback(
    (memoryId) => {
      onEditMemory(memoryId);
      navigate(`/dashboard/add?edit=${memoryId}`);
    },
    [navigate, onEditMemory],
  );

  return (
    <div className="journal-travels-page space-y-6">
      <div>
        <h2 className="journal-section-title text-2xl font-bold text-gray-900">
          {t("myTravelsTitle")}
        </h2>
        <p className="mt-1 text-sm text-gray-600">{t("myTravelsSubtitle")}</p>
      </div>

      {memories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-600">
          {t("myTravelsEmpty")}
        </div>
      ) : (
        <div className="travel-cards-grid grid gap-6">
          {memories.map((memory) => (
            <TravelCard
              key={memory.id}
              memory={memory}
              onOpenMap={handleOpenMap}
              onEditMemory={handleEditMemory}
              onDeleteMemory={onDeleteMemory}
            />
          ))}
        </div>
      )}
    </div>
  );
}

MyTravelsPage.propTypes = {
  memories: PropTypes.arrayOf(PropTypes.object).isRequired,
  onOpenMap: PropTypes.func.isRequired,
  onEditMemory: PropTypes.func.isRequired,
  onDeleteMemory: PropTypes.func.isRequired,
};

export default MyTravelsPage;
