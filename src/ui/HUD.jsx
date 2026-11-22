import questsData from '../data/quests.json'
import { useGameStore } from '../stores/gameStore.js'

/**
 * Minimal HUD (GDD §9.2): current objective top-left, interaction prompt
 * and controls hint at the bottom. No persistent quest markers — the
 * street is meant to be explored (GDD §1.2).
 */
export default function HUD() {
  const quests = useGameStore((s) => s.quests)
  const interactionTarget = useGameStore((s) => s.interactionTarget)
  const uiMode = useGameStore((s) => s.uiMode)

  const objective = currentObjective(quests)

  return (
    <div className="hud">
      <div className="hud-objective">
        <span className="hud-objective-label">{objective ? 'Current quest' : 'Explore'}</span>
        <span>{objective ?? 'A street full of secrets'}</span>
      </div>
      {uiMode === 'free' && interactionTarget && (
        <div className="hud-prompt">
          <span className="hud-prompt-key">E</span>
          {interactionTarget.label}
        </div>
      )}
      <div className="hud-controls">
        WASD move · Shift run · Space jump · E interact · J journal · I inventory · drag mouse to look
      </div>
    </div>
  )
}

/** First incomplete objective of the first active quest. */
function currentObjective(quests) {
  for (const [id, q] of Object.entries(quests)) {
    if (q.status !== 'active') continue
    const def = questsData[id]
    const next = def?.objectives.find((o) => !q.objectives[o.id])
    if (next) return next.description
  }
  return null
}
