import PropTypes from "prop-types";
import { useCallback } from "react";
import { useI18n } from "../../context/I18nContext";
import { formatDisplayDate } from "../../utils/date";

function MemoryCard({ memory, onSelect, isSelected }) {
  const { t } = useI18n();
  const handleSelectMemory = useCallback(() => {
    onSelect(memory.id);
  }, [memory.id, onSelect]);

  const cardStateClass = isSelected
    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
    : "border-gray-200 bg-white";

  return (
    <button
      type="button"
      onClick={handleSelectMemory}
      className={`w-full cursor-pointer rounded-xl border p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${cardStateClass}`}
    >
      <h3 className="text-lg font-semibold text-gray-900">{memory.place}</h3>
      <p className="mt-1 text-sm font-medium text-amber-600">
        {t("memoryRating", { rating: memory.rating })}
      </p>
      <p className="mt-1 text-sm text-gray-600">
        {t("memoryVisited", { date: formatDisplayDate(memory.date) })}
      </p>
    </button>
  );
}

MemoryCard.propTypes = {
  memory: PropTypes.shape({
    id: PropTypes.string.isRequired,
    place: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default MemoryCard;
