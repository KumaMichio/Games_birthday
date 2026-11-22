import * as THREE from 'three'

/**
 * Interaction registry (GDD §10.4): entities register themselves with a
 * world position, radius, label, and an onInteract callback. Everything is
 * plain refs/maps — no React state, nothing allocated per frame.
 */
const registry = new Map()

export const playerPosition = new THREE.Vector3()

/** Called by the Player every frame. */
export function setPlayerPosition(p) {
  playerPosition.copy(p)
}

/**
 * entry: { id, type, label, position: THREE.Vector3, radius, onInteract }
 * Returns an unregister function (use as a useEffect cleanup).
 */
export function registerInteractable(entry) {
  registry.set(entry.id, entry)
  return () => {
    // Only delete if this exact entry still owns the id (StrictMode remounts).
    if (registry.get(entry.id) === entry) registry.delete(entry.id)
  }
}

export function getInteractable(id) {
  return registry.get(id)
}

/** Nearest registered interactable within its own radius, or null. */
export function findNearestInteractable() {
  let best = null
  let bestDist = Infinity
  for (const entry of registry.values()) {
    const d = playerPosition.distanceTo(entry.position)
    if (d <= entry.radius && d < bestDist) {
      best = entry
      bestDist = d
    }
  }
  return best
}
