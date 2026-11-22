import GameCanvas from '../game/GameCanvas.jsx'
import HUD from '../ui/HUD.jsx'
import MainMenu from '../ui/MainMenu.jsx'
import DialogueUI from '../ui/DialogueUI.jsx'
import MemoryCard from '../ui/MemoryCard.jsx'
import JournalUI from '../ui/JournalUI.jsx'
import InventoryUI from '../ui/InventoryUI.jsx'
import GlobalHotkeys from '../ui/GlobalHotkeys.jsx'
import { useGameStore } from '../stores/gameStore.js'

export default function App() {
  const phase = useGameStore((s) => s.phase)
  const uiMode = useGameStore((s) => s.uiMode)

  return (
    <div className="app-root" onContextMenu={(e) => e.preventDefault()}>
      <GameCanvas />
      {phase === 'menu' && <MainMenu />}
      {phase === 'playing' && (
        <>
          <GlobalHotkeys />
          <HUD />
          {uiMode === 'dialogue' && <DialogueUI />}
          {uiMode === 'memory' && <MemoryCard />}
          {uiMode === 'journal' && <JournalUI />}
          {uiMode === 'inventory' && <InventoryUI />}
        </>
      )}
    </div>
  )
}
