import { useEffect } from 'react'
import { useGameStore } from '../stores/gameStore.js'

/**
 * DOM-level hotkeys for overlays (GDD §5.2): J journal, I inventory,
 * Esc closes. Overlays only open from free play (guarded in the store).
 */
export default function GlobalHotkeys() {
  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return
      const s = useGameStore.getState()
      if (s.phase !== 'playing') return
      if (e.code === 'KeyJ') {
        if (s.uiMode === 'journal') s.closeOverlay()
        else s.openOverlay('journal')
      } else if (e.code === 'KeyI') {
        if (s.uiMode === 'inventory') s.closeOverlay()
        else s.openOverlay('inventory')
      } else if (e.code === 'Escape') {
        s.closeOverlay()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return null
}
