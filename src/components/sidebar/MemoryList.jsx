import PropTypes from "prop-types";
import { useI18n } from "../../context/I18nContext";
import MemoryCard from "./MemoryCard";

function EmptyState() {
  const { t } = useI18n();

  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-600">
      {t("memoryListEmpty")}
    </div>
  );
}

function MemoryList({ memories, onSelectMemory, selectedMemoryId }) {
  if (memories.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {memories.map((memory) => (
        <MemoryCard
          key={memory.id}
          memory={memory}
          onSelect={onSelectMemory}
          isSelected={memory.id === selectedMemoryId}
        />
      ))}
    </div>
  );
}

MemoryList.propTypes = {
  memories: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectMemory: PropTypes.func.isRequired,
  selectedMemoryId: PropTypes.string,
};

MemoryList.defaultProps = {
  selectedMemoryId: null,
};

export default MemoryList;
