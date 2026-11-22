import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { findNearestInteractable, getInteractable } from '../systems/InteractionSystem.js'
import { useGameStore } from '../stores/gameStore.js'

/**
 * Proximity + interact-key handling (GDD §10.4):
 * - each frame, find the nearest in-range interactable; the store is only
 *   written when the target actually changes (GDD §17.3 perf rule);
 * - E fires the current target's onInteract on the key's rising edge,
 *   and only while the player is free (no double-triggers from dialogue).
 */
export default function InteractionManager() {
  const [subscribeKeys] = useKeyboardControls()

  useEffect(
    () =>
      subscribeKeys(
        (state) => state.interact,
        (pressed) => {
          if (!pressed) return
          const { uiMode, interactionTarget } = useGameStore.getState()
          if (uiMode !== 'free' || !interactionTarget) return
          getInteractable(interactionTarget.id)?.onInteract()
        },
      ),
    [subscribeKeys],
  )

  useFrame(() => {
    const state = useGameStore.getState()
    if (state.phase !== 'playing') return
    const nearest = state.uiMode === 'free' ? findNearestInteractable() : null
    const currentId = state.interactionTarget?.id ?? null
    if ((nearest?.id ?? null) !== currentId) {
      state.setInteractionTarget(nearest ? { id: nearest.id, label: nearest.label } : null)
    }
  })

  return null
}
