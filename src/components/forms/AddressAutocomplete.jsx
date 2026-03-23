import PropTypes from "prop-types";
import { useCallback } from "react";
import { useI18n } from "../../context/I18nContext";
import AddressSuggestionItem from "./AddressSuggestionItem";

const suggestionPropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
});

function AddressAutocomplete(props) {
  const { t } = useI18n();
  const { address, onAddressChange, suggestions, isLoadingSuggestions, onSelectSuggestion } = props;

  const handleAddressInputChange = useCallback(
    (event) => {
      onAddressChange(event.target.value);
    },
    [onAddressChange],
  );

  const hasSuggestions = suggestions.length > 0;

  return (
    <div className="relative">
      <label htmlFor="address" className="mb-1 block text-sm font-medium text-gray-700">
        {t("formAddress")}
      </label>
      <input
        id="address"
        value={address}
        onChange={handleAddressInputChange}
        className="form-input"
        placeholder={t("formAddressPlaceholder")}
        autoComplete="off"
        required
      />

      {isLoadingSuggestions && (
        <p className="mt-1 text-xs text-gray-500">{t("formSearchingAddress")}</p>
      )}

      {hasSuggestions && (
        <ul className="absolute z-[1000] mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((suggestion) => (
            <AddressSuggestionItem
              key={suggestion.label}
              suggestion={suggestion}
              onSelectSuggestion={onSelectSuggestion}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

AddressAutocomplete.propTypes = {
  address: PropTypes.string.isRequired,
  onAddressChange: PropTypes.func.isRequired,
  suggestions: PropTypes.arrayOf(suggestionPropType).isRequired,
  isLoadingSuggestions: PropTypes.bool.isRequired,
  onSelectSuggestion: PropTypes.func.isRequired,
};

export default AddressAutocomplete;
