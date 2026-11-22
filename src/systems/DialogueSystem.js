import dialogues from '../data/dialogues.json'
import npcs from '../data/npcs.json'
import { useGameStore } from '../stores/gameStore.js'

/**
 * Data-driven dialogue (GDD §9.5): trees live in dialogues.json; which tree
 * an NPC opens with is decided by ordered dialogueRules in npcs.json,
 * evaluated against live game state.
 */

export function getDialogue(dialogueId) {
  return dialogues[dialogueId] ?? null
}

export function getNode(dialogueId, nodeId) {
  return dialogues[dialogueId]?.nodes?.[nodeId] ?? null
}

/**
 * Conditions: { questStatus: {id, status} } | { hasItem } | { hasMemory }
 * | { and: [...] }. A missing condition always passes (default rule).
 */
export function evaluateCondition(cond, state) {
  if (!cond) return true
  if (cond.and) return cond.and.every((c) => evaluateCondition(c, state))
  if (cond.questStatus) {
    const q = state.quests[cond.questStatus.id]
    return (q?.status ?? 'none') === cond.questStatus.status
  }
  if (cond.hasItem) return state.inventory.includes(cond.hasItem)
  if (cond.hasMemory) return state.memories.includes(cond.hasMemory)
  console.warn('Unknown dialogue condition', cond)
  return false
}

/** First matching rule wins (rules are ordered most-specific first). */
export function resolveNpcDialogue(npcId) {
  const state = useGameStore.getState()
  const rules = npcs[npcId]?.dialogueRules ?? []
  for (const rule of rules) {
    if (evaluateCondition(rule.if, state)) return rule.dialogue
  }
  return null
}

/**
 * Side effects attached to dialogue nodes/choices and collectibles.
 * Every underlying store action is idempotent, so re-entry is safe.
 */
export function applyActions(actions = []) {
  const s = useGameStore.getState()
  for (const a of actions) {
    switch (a.type) {
      case 'startQuest':
        s.startQuest(a.id)
        break
      case 'completeObjective':
        s.completeObjective(a.quest, a.objective)
        break
      case 'completeQuest':
        s.completeQuest(a.id)
        break
      case 'addItem':
        s.addItem(a.id)
        break
      case 'removeItem':
        s.removeItem(a.id)
        break
      case 'discoverMemory':
        s.discoverMemory(a.id)
        break
      default:
        console.warn('Unknown dialogue action', a)
    }
  }
}
