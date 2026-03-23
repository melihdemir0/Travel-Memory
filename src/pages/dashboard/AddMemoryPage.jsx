import PropTypes from "prop-types";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import MemoryForm from "../../components/forms/MemoryForm";
import { findMemoryById } from "../../utils/memoryPayload";

function AddMemoryPage({ memories, onSaveMemory }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editMemoryId = searchParams.get("edit");

  const editingMemory = useMemo(
    () => findMemoryById(memories, editMemoryId),
    [memories, editMemoryId],
  );

  async function handleSubmitMemory(formData) {
    await onSaveMemory(formData, editMemoryId);
    navigate("/dashboard/travels");
  }

  function handleCancel() {
    navigate("/dashboard/travels");
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {editingMemory ? t("editMemoryTitle") : t("addMemoryTitle")}
        </h2>
        <p className="mt-1 text-sm text-gray-600">{t("addMemorySubtitle")}</p>
      </div>

      <MemoryForm
        onSubmit={handleSubmitMemory}
        onCancel={handleCancel}
        initialData={editingMemory}
      />
    </div>
  );
}

AddMemoryPage.propTypes = {
  memories: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSaveMemory: PropTypes.func.isRequired,
};

export default AddMemoryPage;
