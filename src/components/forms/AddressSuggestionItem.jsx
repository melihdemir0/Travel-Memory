import PropTypes from "prop-types";
import { useCallback } from "react";

function AddressSuggestionItem({ suggestion, onSelectSuggestion }) {
  const handleSuggestionClick = useCallback(() => {
    onSelectSuggestion(suggestion);
  }, [onSelectSuggestion, suggestion]);

  return (
    <li>
      <button
        type="button"
        onClick={handleSuggestionClick}
        className="w-full border-b border-gray-100 px-4 py-2 text-left text-sm text-gray-700 transition duration-200 hover:bg-gray-50"
      >
        {suggestion.label}
      </button>
    </li>
  );
}

AddressSuggestionItem.propTypes = {
  suggestion: PropTypes.shape({
    label: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  onSelectSuggestion: PropTypes.func.isRequired,
};

export default AddressSuggestionItem;
