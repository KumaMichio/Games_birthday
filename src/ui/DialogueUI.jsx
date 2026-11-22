import { useEffect } from 'react'
import { useGameStore } from '../stores/gameStore.js'
import { applyActions, getDialogue, getNode } from '../systems/DialogueSystem.js'

/**
 * Dialogue overlay (GDD §9.5): renders the current node, applies node
 * actions on entry, and supports mouse + keyboard (1–9 for choices,
 * E / Enter / Space to continue).
 */
export default function DialogueUI() {
  const dialogue = useGameStore((s) => s.dialogue)
  const advanceDialogue = useGameStore((s) => s.advanceDialogue)
  const endDialogue = useGameStore((s) => s.endDialogue)

  const node = dialogue ? getNode(dialogue.id, dialogue.nodeId) : null
  const speaker = dialogue ? getDialogue(dialogue.id)?.speaker : null

  // Node entry actions (quest turn-ins etc.). Store actions are idempotent,
  // so StrictMode's double-invoke in dev is harmless.
  useEffect(() => {
    if (node?.actions) applyActions(node.actions)
  }, [dialogue?.id, dialogue?.nodeId]) // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (choice) => {
    if (choice.actions) applyActions(choice.actions)
    if (choice.next) advanceDialogue(choice.next)
    else endDialogue()
  }

  const advance = () => {
    if (!node) return
    if (node.next) advanceDialogue(node.next)
    else endDialogue()
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat || !node) return
      if (node.choices) {
        const idx = ['Digit1', 'Digit2', 'Digit3', 'Digit4'].indexOf(e.code)
        if (idx >= 0 && node.choices[idx]) choose(node.choices[idx])
      } else if (e.code === 'KeyE' || e.code === 'Enter' || e.code === 'Space') {
        advance()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }) // re-bind each render so handlers always see the current node

  if (!node) return null

  return (
    <div className="dialogue-wrap">
      <div className="dialogue-panel">
        {speaker && <div className="dialogue-speaker">{speaker}</div>}
        <p className="dialogue-text">{node.text}</p>
        {node.choices ? (
          <div className="dialogue-choices">
            {node.choices.map((choice, i) => (
              <button key={i} className="dialogue-choice" onClick={() => choose(choice)}>
                <span className="dialogue-choice-key">{i + 1}</span>
                {choice.text}
              </button>
            ))}
          </div>
        ) : (
          <button className="dialogue-continue" onClick={advance}>
            Continue ▸ <span className="dialogue-continue-key">E</span>
          </button>
        )}
      </div>
    </div>
  )
}
