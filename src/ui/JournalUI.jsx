import questsData from '../data/quests.json'
import memoriesData from '../data/memories.json'
import { useGameStore } from '../stores/gameStore.js'

/**
 * Quest journal + memory album panel (GDD §9.4, §7.2). Locked memories
 * appear as subtle placeholders.
 */
export default function JournalUI() {
  const quests = useGameStore((s) => s.quests)
  const memories = useGameStore((s) => s.memories)
  const closeOverlay = useGameStore((s) => s.closeOverlay)

  const questEntries = Object.entries(quests)

  return (
    <div className="overlay panel-overlay" onClick={closeOverlay}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>Journal</h2>
          <button className="panel-close" onClick={closeOverlay}>
            ✕
          </button>
        </div>

        <h3 className="panel-section">Quests</h3>
        {questEntries.length === 0 && (
          <p className="panel-empty">Nothing yet. Maybe someone on the street needs a hand…</p>
        )}
        {questEntries.map(([id, q]) => {
          const def = questsData[id]
          if (!def) return null
          return (
            <div key={id} className={`quest-entry ${q.status}`}>
              <div className="quest-title">
                {q.status === 'completed' ? '✓ ' : ''}
                {def.title}
              </div>
              <div className="quest-desc">{def.description}</div>
              <ul className="quest-objectives">
                {def.objectives.map((o) => (
                  <li key={o.id} className={q.objectives[o.id] ? 'done' : ''}>
                    {q.objectives[o.id] ? '✓' : '○'} {o.description}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}

        <h3 className="panel-section">Memory Album</h3>
        <div className="memory-album">
          {Object.values(memoriesData).map((m) =>
            memories.includes(m.id) ? (
              <div key={m.id} className="album-entry">
                <div className="album-title">✦ {m.title}</div>
                <div className="album-text">“{m.text}”</div>
              </div>
            ) : (
              <div key={m.id} className="album-entry locked">
                <div className="album-title">· · ·</div>
                <div className="album-text">A memory not yet found.</div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
