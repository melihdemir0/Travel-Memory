export function buildCreatedMemoryPayload(formData, location) {
  return {
    ...formData,
    address: location.address,
    lat: location.lat,
    lng: location.lng,
  };
}

export function buildUpdatedMemoryPayload(existingMemory, formData, location) {
  return {
    ...existingMemory,
    ...formData,
    address: location.address,
    lat: location.lat,
    lng: location.lng,
  };
}

export function findMemoryById(memories, memoryId) {
  if (!memoryId) {
    return null;
  }

  return memories.find((memory) => memory.id === memoryId) ?? null;
}
