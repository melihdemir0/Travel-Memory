import PropTypes from "prop-types";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../../components/map/MapView";
import MemoryList from "../../components/sidebar/MemoryList";
import { useI18n } from "../../context/I18nContext";

function MapExplorerPage({
  memories,
  selectedMemory,
  selectedMemoryId,
  onSelectMemory,
  onDeleteMemory,
  onEditMemory,
}) {
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleEditMemory = useCallback(
    (memoryId) => {
      onEditMemory(memoryId);
      navigate(`/dashboard/add?edit=${memoryId}`);
    },
    [navigate, onEditMemory],
  );

  return (
    <div className="map-explorer-content flex min-h-0 flex-col gap-5 lg:h-full lg:flex-row">
      <section className="map-explorer-sidebar flex min-h-[320px] w-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:min-h-0 lg:w-[22rem] lg:max-w-[22rem] lg:overflow-hidden">
        <h2 className="text-xl font-semibold text-gray-900">{t("mapExplorerTitle")}</h2>
        <p className="mt-1 text-sm text-gray-600">{t("mapExplorerSubtitle")}</p>
        <div className="map-explorer-list mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
          <MemoryList
            memories={memories}
            onSelectMemory={onSelectMemory}
            selectedMemoryId={selectedMemoryId}
          />
        </div>
      </section>

      <section className="map-pane min-h-[420px] min-w-0 flex-1 lg:min-h-0">
        <MapView
          memories={memories}
          selectedMemory={selectedMemory}
          onSelectMemory={onSelectMemory}
          onEditMemory={handleEditMemory}
          onDeleteMemory={onDeleteMemory}
        />
      </section>
    </div>
  );
}

MapExplorerPage.propTypes = {
  memories: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedMemory: PropTypes.object,
  selectedMemoryId: PropTypes.string,
  onSelectMemory: PropTypes.func.isRequired,
  onDeleteMemory: PropTypes.func.isRequired,
  onEditMemory: PropTypes.func.isRequired,
};

MapExplorerPage.defaultProps = {
  selectedMemory: null,
  selectedMemoryId: null,
};

export default MapExplorerPage;
