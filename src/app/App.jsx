import PropTypes from "prop-types";
import { useCallback, useMemo, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useMemories } from "../hooks/useMemories";
import AddMemoryPage from "../pages/dashboard/AddMemoryPage";
import DashboardHomePage from "../pages/dashboard/DashboardHomePage";
import MapExplorerPage from "../pages/dashboard/MapExplorerPage";
import MyTravelsPage from "../pages/dashboard/MyTravelsPage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import { clearAuthState, loadAuthState, saveAuthState } from "../utils/auth";
import { resolveMemoryLocation } from "../utils/memoryLocation";
import {
  buildCreatedMemoryPayload,
  buildUpdatedMemoryPayload,
  findMemoryById,
} from "../utils/memoryPayload";

function ProtectedRoute({ isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

ProtectedRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

function App() {
  const { memories, addMemory, updateMemory, deleteMemory } = useMemories();
  const [isAuthenticated, setIsAuthenticated] = useState(() => loadAuthState());
  const [selectedMemoryId, setSelectedMemoryId] = useState(null);

  const selectedMemory = useMemo(
    () => findMemoryById(memories, selectedMemoryId),
    [memories, selectedMemoryId],
  );

  const handleLogin = useCallback(() => {
    saveAuthState(true);
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    clearAuthState();
    setIsAuthenticated(false);
    setSelectedMemoryId(null);
  }, []);

  const handleSelectMemory = useCallback((memoryId) => {
    setSelectedMemoryId(memoryId);
  }, []);

  const handleDeleteMemory = useCallback(
    (memoryId) => {
      deleteMemory(memoryId);
      if (selectedMemoryId === memoryId) {
        setSelectedMemoryId(null);
      }
    },
    [deleteMemory, selectedMemoryId],
  );

  const handleSaveMemory = useCallback(
    async (formData, editMemoryId = null) => {
      const existingMemory = findMemoryById(memories, editMemoryId);
      const location = await resolveMemoryLocation(formData, existingMemory);
      if (existingMemory) {
        const updatedMemory = updateMemory(
          buildUpdatedMemoryPayload(existingMemory, formData, location),
        );
        setSelectedMemoryId(updatedMemory.id);
        return updatedMemory;
      }

      const createdMemory = addMemory(buildCreatedMemoryPayload(formData, location));
      setSelectedMemoryId(createdMemory.id);
      return createdMemory;
    },
    [addMemory, memories, updateMemory],
  );

  return (
    <Routes>
      <Route path="/" element={<LandingPage isAuthenticated={isAuthenticated} />} />
      <Route
        path="/login"
        element={<LoginPage isAuthenticated={isAuthenticated} onLogin={handleLogin} />}
      />
      <Route path="/signup" element={<SignUpPage />} />

      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/dashboard" element={<DashboardLayout onLogout={handleLogout} />}>
          <Route index element={<DashboardHomePage memories={memories} />} />
          <Route
            path="travels"
            element={
              <MyTravelsPage
                memories={memories}
                onOpenMap={handleSelectMemory}
                onEditMemory={handleSelectMemory}
                onDeleteMemory={handleDeleteMemory}
              />
            }
          />
          <Route
            path="map"
            element={
              <MapExplorerPage
                memories={memories}
                selectedMemory={selectedMemory}
                selectedMemoryId={selectedMemoryId}
                onSelectMemory={handleSelectMemory}
                onDeleteMemory={handleDeleteMemory}
                onEditMemory={handleSelectMemory}
              />
            }
          />
          <Route
            path="add"
            element={<AddMemoryPage memories={memories} onSaveMemory={handleSaveMemory} />}
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}

export default App;
