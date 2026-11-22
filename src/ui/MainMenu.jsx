import { useGameStore } from '../stores/gameStore.js'

/**
 * Title screen. The "Begin" click doubles as the browser audio-unlock
 * gesture once music is added (GDD §10.9).
 */
export default function MainMenu() {
  const beginGame = useGameStore((s) => s.beginGame)

  return (
    <div className="overlay menu">
      <div className="menu-card">
        <p className="menu-kicker">Somewhere along this street…</p>
        <h1 className="menu-title">A Street Full of Memories</h1>
        <p className="menu-subtitle">
          “…there is something waiting for you. You just have to remember.”
        </p>
        <button className="menu-button" onClick={beginGame}>
          Begin
        </button>
        <p className="menu-hint">WASD to walk · Shift to run · drag the mouse to look around</p>
      </div>
    </div>
  )
}
