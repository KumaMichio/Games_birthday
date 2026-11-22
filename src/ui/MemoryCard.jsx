import { useEffect } from 'react'
import memoriesData from '../data/memories.json'
import { useGameStore } from '../stores/gameStore.js'

/**
 * Memory reveal card (GDD §6.6): briefly pauses play when a memory is
 * discovered and shows its title, text, and collection progress.
 */
export default function MemoryCard() {
  const pendingMemory = useGameStore((s) => s.pendingMemory)
  const memories = useGameStore((s) => s.memories)
  const acknowledgeMemory = useGameStore((s) => s.acknowledgeMemory)

  const memory = pendingMemory ? memoriesData[pendingMemory] : null
  const total = Object.keys(memoriesData).length

  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return
      if (e.code === 'KeyE' || e.code === 'Enter' || e.code === 'Space') acknowledgeMemory()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [acknowledgeMemory])

  if (!memory) return null

  return (
    <div className="overlay memory-overlay">
      <div className="memory-card">
        <div className="memory-kicker">✦ Memory discovered ✦</div>
        <h2 className="memory-title">{memory.title}</h2>
        <p className="memory-text">“{memory.text}”</p>
        {memory.personalNote && <p className="memory-note">{memory.personalNote}</p>}
        <div className="memory-progress">
          Memory {memories.length} of {total}
        </div>
        <button className="menu-button" onClick={acknowledgeMemory}>
          Keep walking
        </button>
      </div>
    </div>
  )
}
