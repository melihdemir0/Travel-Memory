import { normalizeMemory } from "../interfaces/Memory";

export const STORAGE_KEY = "my_travels";
const LEGACY_STORAGE_KEY = "travel_memories";
const STORAGE_LIMIT_MESSAGE = "Hafiza doldu, lutfen bazi anilari silin";

function isQuotaExceededError(error) {
  return error?.name === "QuotaExceededError" || error?.code === 22 || error?.code === 1014;
}

export function loadMemories() {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizeMemory).filter(Boolean);
  } catch {
    return [];
  }
}

export function saveMemories(memories) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch (error) {
    if (isQuotaExceededError(error)) {
      throw new Error(STORAGE_LIMIT_MESSAGE);
    }

    throw error;
  }
}

export function addMemory(memory, memories = loadMemories()) {
  const nextMemories = [memory, ...memories];
  saveMemories(nextMemories);
  return nextMemories;
}

export function updateMemory(memory, memories = loadMemories()) {
  const nextMemories = memories.map((currentMemory) =>
    currentMemory.id === memory.id ? memory : currentMemory,
  );
  saveMemories(nextMemories);
  return nextMemories;
}

export function deleteMemory(id, memories = loadMemories()) {
  const nextMemories = memories.filter((memory) => memory.id !== id);
  saveMemories(nextMemories);
  return nextMemories;
}
