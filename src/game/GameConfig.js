// Shared gameplay constants (Week 1 scope).

export const KEYBOARD_MAP = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'run', keys: ['ShiftLeft', 'ShiftRight'] },
  { name: 'interact', keys: ['KeyE'] },
]

// Spawn near the town entrance, looking down the street (street runs toward -Z).
export const PLAYER_SPAWN = [0, 1.2, 4]

export const PLAYER = {
  capsuleHalfHeight: 0.35,
  capsuleRadius: 0.3,
  floatHeight: 0.2,
  maxWalkVel: 2.5,
  maxRunVel: 5,
}

// Distance from capsule center down to the character's feet.
export const PLAYER_FOOT_OFFSET =
  PLAYER.capsuleHalfHeight + PLAYER.capsuleRadius + PLAYER.floatHeight

export const CAMERA = {
  minDistance: 2,
  maxDistance: 9,
  smoothTime: 0.12,
  // Keep the orbit above the ground and below straight-down.
  minPolarAngle: 0.3,
  maxPolarAngle: 1.45,
  targetHeight: 0.9, // look-at point above the capsule center
}
