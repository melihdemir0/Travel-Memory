import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { createMemory } from "../interfaces/Memory";
import {
  addMemory as persistAddMemory,
  deleteMemory as persistDeleteMemory,
  loadMemories,
  updateMemory as persistUpdateMemory,
} from "../utils/storage";

export function useMemories() {
  const [memories, setMemories] = useState(() => loadMemories());

  const addMemory = useCallback((memoryInput) => {
    const memory = createMemory({
      ...memoryInput,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    });

    setMemories((currentMemories) => persistAddMemory(memory, currentMemories));
    return memory;
  }, []);

  const updateMemory = useCallback((memoryInput) => {
    const memory = createMemory(memoryInput);
    setMemories((currentMemories) => persistUpdateMemory(memory, currentMemories));
    return memory;
  }, []);

  const deleteMemory = useCallback((id) => {
    setMemories((currentMemories) => persistDeleteMemory(id, currentMemories));
  }, []);

  const getMemories = useCallback(() => memories, [memories]);

  return {
    memories,
    addMemory,
    updateMemory,
    deleteMemory,
    getMemories,
  };
}
