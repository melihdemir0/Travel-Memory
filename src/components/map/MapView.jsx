import PropTypes from "prop-types";
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  FOCUSED_MEMORY_ZOOM,
  MAP_FLY_DURATION_SECONDS,
  MAP_TILE_ATTRIBUTION,
  VOYAGER_TILE_URL,
} from "../../constants/mapConstants";
import MemoryMarker from "./MemoryMarker";

function hasValidCoordinates(memory) {
  return Number.isFinite(memory?.lat) && Number.isFinite(memory?.lng);
}

function getInitialMapTarget(memories, selectedMemory) {
  if (hasValidCoordinates(selectedMemory)) {
    return selectedMemory;
  }

  if (!Array.isArray(memories) || memories.length === 0) {
    return null;
  }

  return memories.find(hasValidCoordinates) || null;
}

function MapInitialViewController({ initialTarget }) {
  const map = useMap();
  const hasAppliedInitialFocus = useRef(false);

  useEffect(() => {
    if (hasAppliedInitialFocus.current || !initialTarget) {
      return;
    }

    hasAppliedInitialFocus.current = true;
    map.flyTo([initialTarget.lat, initialTarget.lng], FOCUSED_MEMORY_ZOOM, {
      duration: MAP_FLY_DURATION_SECONDS,
    });
  }, [initialTarget, map]);

  return null;
}

function MapFocusController({ selectedMemory }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedMemory) {
      return;
    }

    map.flyTo([selectedMemory.lat, selectedMemory.lng], FOCUSED_MEMORY_ZOOM, {
      duration: MAP_FLY_DURATION_SECONDS,
    });
  }, [map, selectedMemory]);

  return null;
}

MapInitialViewController.propTypes = {
  initialTarget: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
};

MapInitialViewController.defaultProps = {
  initialTarget: null,
};

function MapResizeController() {
  const map = useMap();

  useEffect(() => {
    const rafId = globalThis.requestAnimationFrame(() => {
      map.invalidateSize();
    });

    const handleResize = () => {
      map.invalidateSize();
    };

    globalThis.addEventListener("resize", handleResize);

    return () => {
      globalThis.cancelAnimationFrame(rafId);
      globalThis.removeEventListener("resize", handleResize);
    };
  }, [map]);

  return null;
}

MapFocusController.propTypes = {
  selectedMemory: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
};

MapFocusController.defaultProps = {
  selectedMemory: null,
};

function MarkerLayer({ memories, onSelectMemory, onEditMemory, onDeleteMemory }) {
  return memories.map((memory) => (
    <MemoryMarker
      key={memory.id}
      memory={memory}
      onSelect={onSelectMemory}
      onEdit={onEditMemory}
      onDelete={onDeleteMemory}
    />
  ));
}

MarkerLayer.propTypes = {
  memories: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectMemory: PropTypes.func.isRequired,
  onEditMemory: PropTypes.func.isRequired,
  onDeleteMemory: PropTypes.func.isRequired,
};

function MapView({ memories, selectedMemory, onSelectMemory, onEditMemory, onDeleteMemory }) {
  const initialTarget = useMemo(
    () => getInitialMapTarget(memories, selectedMemory),
    [memories, selectedMemory],
  );
  const initialCenter = initialTarget ? [initialTarget.lat, initialTarget.lng] : DEFAULT_MAP_CENTER;

  return (
    <div className="map-shell map-container relative h-full w-full">
      <MapContainer
        center={initialCenter}
        zoom={DEFAULT_MAP_ZOOM}
        className="map-canvas h-full w-full"
        scrollWheelZoom
      >
        <TileLayer attribution={MAP_TILE_ATTRIBUTION} url={VOYAGER_TILE_URL} />
        <MapResizeController />
        <MapInitialViewController initialTarget={initialTarget} />
        <MapFocusController selectedMemory={selectedMemory} />
        <MarkerLayer
          memories={memories}
          onSelectMemory={onSelectMemory}
          onEditMemory={onEditMemory}
          onDeleteMemory={onDeleteMemory}
        />
      </MapContainer>
    </div>
  );
}

MapView.propTypes = {
  memories: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedMemory: PropTypes.object,
  onSelectMemory: PropTypes.func.isRequired,
  onEditMemory: PropTypes.func.isRequired,
  onDeleteMemory: PropTypes.func.isRequired,
};

MapView.defaultProps = {
  selectedMemory: null,
};

export default MapView;
