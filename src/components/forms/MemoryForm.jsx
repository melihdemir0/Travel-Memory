import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FIELD_REQUIRED_MESSAGE, SAVE_MEMORY_ERROR_MESSAGE } from "../../constants/uiConstants";
import { useI18n } from "../../context/I18nContext";
import { useAddressSuggestions } from "../../hooks/useAddressSuggestions";
import { emptyMemoryDraft } from "../../interfaces/Memory";
import { compressImageToBase64, getBase64TotalBytes } from "../../utils/imageCompression";
import AddressAutocomplete from "./AddressAutocomplete";

const MAX_IMAGE_TOTAL_BYTES = 1_000_000;
const COMPRESSED_IMAGE_MAX_WIDTH = 500;
const COMPRESSED_IMAGE_QUALITY = 0.5;

function buildInitialFormValues(initialData) {
  if (!initialData) {
    return emptyMemoryDraft;
  }

  let images = [];
  if (initialData.images?.length > 0) {
    images = initialData.images;
  } else if (initialData.image) {
    images = [initialData.image];
  }

  return {
    place: initialData.place,
    address: initialData.address,
    date: initialData.date,
    rating: initialData.rating,
    notes: initialData.notes,
    image: initialData.image || "",
    images,
  };
}

function buildInitialCoordinates(initialData) {
  if (!initialData) {
    return null;
  }

  return {
    lat: initialData.lat,
    lng: initialData.lng,
  };
}

function hasRequiredFields(formValues) {
  return Boolean(formValues.place.trim() && formValues.address.trim() && formValues.date);
}

function buildSubmitPayload(formValues, selectedCoordinates) {
  return {
    ...formValues,
    rating: Number(formValues.rating),
    lat: selectedCoordinates?.lat,
    lng: selectedCoordinates?.lng,
    image: formValues.images[0] || "",
    images: formValues.images,
  };
}

function getErrorMessage(error, fallbackMessage) {
  return error instanceof Error && error.message ? error.message : fallbackMessage;
}

async function compressSelectedImages(selectedFiles) {
  const results = await Promise.allSettled(
    selectedFiles.map((file) =>
      compressImageToBase64(file, {
        maxWidth: COMPRESSED_IMAGE_MAX_WIDTH,
        quality: COMPRESSED_IMAGE_QUALITY,
      }),
    ),
  );

  return results.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
}

function MemoryForm({ onSubmit, onCancel, initialData }) {
  const { t } = useI18n();
  const isEditMode = Boolean(initialData?.id);
  const [formValues, setFormValues] = useState(() => ({
    ...emptyMemoryDraft,
    images: Array.isArray(emptyMemoryDraft.images) ? emptyMemoryDraft.images : [],
  }));
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [isAddressSelectionLocked, setIsAddressSelectionLocked] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { suggestions, isLoading, clearSuggestions } = useAddressSuggestions(
    formValues.address,
    !isAddressSelectionLocked,
  );

  const submitLabel = useMemo(
    () => (isEditMode ? t("formUpdateMemory") : t("formSaveMemory")),
    [isEditMode, t],
  );

  useEffect(() => {
    setFormValues(buildInitialFormValues(initialData));
    setSelectedCoordinates(buildInitialCoordinates(initialData));
    setIsAddressSelectionLocked(Boolean(initialData?.address));
  }, [initialData]);

  const safeImages = useMemo(() => {
    if (!Array.isArray(formValues.images)) {
      return [];
    }

    return formValues.images.filter(Boolean);
  }, [formValues.images]);

  const updateField = useCallback((fieldName, value) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));
  }, []);

  const handlePlaceChange = useCallback(
    (event) => {
      updateField("place", event.target.value);
    },
    [updateField],
  );

  const handleAddressChange = useCallback(
    (addressValue) => {
      updateField("address", addressValue);
      setIsAddressSelectionLocked(false);
      setSelectedCoordinates(null);
    },
    [updateField],
  );

  const handleDateChange = useCallback(
    (event) => {
      updateField("date", event.target.value);
    },
    [updateField],
  );

  const handleRatingChange = useCallback(
    (event) => {
      updateField("rating", Number(event.target.value));
    },
    [updateField],
  );

  const handleNotesChange = useCallback(
    (event) => {
      updateField("notes", event.target.value);
    },
    [updateField],
  );

  const handleImageChange = useCallback(
    async (event) => {
      const selectedFiles = Array.from(event.target.files || []);
      if (selectedFiles.length === 0) {
        return;
      }

      setSubmitError("");
      try {
        const compressedImages = await compressSelectedImages(selectedFiles);

        if (compressedImages.length === 0) {
          throw new Error(t("imageProcessSelectedError"));
        }

        const combinedImages = [...safeImages, ...compressedImages];
        const combinedBytes = getBase64TotalBytes(combinedImages);
        if (combinedBytes > MAX_IMAGE_TOTAL_BYTES) {
          throw new Error(t("imageStorageLimitError"));
        }

        updateField("images", combinedImages);
        updateField("image", combinedImages[0] || "");
        event.target.value = "";
      } catch (error) {
        setSubmitError(getErrorMessage(error, t("imageProcessError")));
      }
    },
    [safeImages, t, updateField],
  );

  const handleSelectSuggestion = useCallback(
    (suggestion) => {
      updateField("address", suggestion.label);
      setSelectedCoordinates({ lat: suggestion.lat, lng: suggestion.lng });
      setIsAddressSelectionLocked(true);
      clearSuggestions();
    },
    [clearSuggestions, updateField],
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setSubmitError("");
      if (!hasRequiredFields(formValues)) {
        setSubmitError(t("requiredFieldsError") || FIELD_REQUIRED_MESSAGE);
        return;
      }

      try {
        setIsSubmitting(true);
        await onSubmit(buildSubmitPayload(formValues, selectedCoordinates));
      } catch (error) {
        setSubmitError(getErrorMessage(error, t("saveMemoryError") || SAVE_MEMORY_ERROR_MESSAGE));
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit, selectedCoordinates, t],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div>
        <label htmlFor="place" className="mb-1 block text-sm font-medium text-gray-700">
          {t("formPlaceName")}
        </label>
        <input
          id="place"
          value={formValues.place}
          onChange={handlePlaceChange}
          className="form-input"
          placeholder={t("formPlacePlaceholder")}
          required
        />
      </div>

      <AddressAutocomplete
        address={formValues.address}
        onAddressChange={handleAddressChange}
        suggestions={suggestions}
        isLoadingSuggestions={isLoading}
        onSelectSuggestion={handleSelectSuggestion}
      />

      <div>
        <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
          {t("formDateOfVisit")}
        </label>
        <input
          id="date"
          type="date"
          value={formValues.date}
          onChange={handleDateChange}
          className="form-input"
          required
        />
      </div>

      <div>
        <label htmlFor="rating" className="mb-1 block text-sm font-medium text-gray-700">
          {t("formRating")}
        </label>
        <select
          id="rating"
          value={formValues.rating}
          onChange={handleRatingChange}
          className="form-input"
        >
          <option value={5}>{t("rating5")}</option>
          <option value={4}>{t("rating4")}</option>
          <option value={3}>{t("rating3")}</option>
          <option value={2}>{t("rating2")}</option>
          <option value={1}>{t("rating1")}</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">
          {t("formNotes")}
        </label>
        <textarea
          id="notes"
          value={formValues.notes}
          onChange={handleNotesChange}
          className="form-input min-h-24"
          placeholder={t("formNotesPlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="memory-image" className="mb-1 block text-sm font-medium text-gray-700">
          {t("formPhoto")}
        </label>
        <input
          id="memory-image"
          type="file"
          accept="image/*"
          multiple
          className="form-input"
          onChange={handleImageChange}
        />
        <p className="mt-1 text-xs text-gray-500">{t("formPhotoHelp")}</p>

        {safeImages.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {safeImages?.map((image, index) => (
              <div
                key={image}
                className="h-[50px] w-[50px] overflow-hidden rounded-md border border-gray-200"
              >
                <img
                  src={image}
                  alt={t("formSelectedMemoryImage", { index: index + 1 })}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? t("formSaving") : submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          {t("formCancel")}
        </button>
      </div>
    </form>
  );
}

MemoryForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.string,
    place: PropTypes.string,
    address: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
    rating: PropTypes.number,
    notes: PropTypes.string,
    date: PropTypes.string,
    image: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
  }),
};

MemoryForm.defaultProps = {
  initialData: null,
};

export default MemoryForm;
