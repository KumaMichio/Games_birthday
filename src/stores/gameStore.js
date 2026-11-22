import { create } from 'zustand'
import questsData from '../data/quests.json'

/**
 * Central game state (GDD §10.2). All mutations live here so systems and
 * UI stay deterministic and testable (GDD §17.3): duplicate quest starts,
 * rewards, items, and memory discoveries are guarded at the source.
 *
 * uiMode gates player movement: anything other than 'free' freezes input.
 */
export const useGameStore = create((set, get) => ({
  phase: 'menu', // 'menu' | 'playing'
  uiMode: 'free', // 'free' | 'dialogue' | 'memory' | 'journal' | 'inventory'
  currentLocation: 'Town Entrance',

  interactionTarget: null, // { id, label } | null — nearest interactable
  dialogue: null, // { id, nodeId } | null
  quests: {}, // questId -> { status: 'active'|'completed', objectives: { objId: bool } }
  inventory: [], // item ids
  memories: [], // discovered memory ids, in discovery order
  pendingMemory: null, // memory id awaiting its reveal card

  // The "Begin" click is also the browser audio-unlock point (GDD §10.9).
  beginGame: () => set({ phase: 'playing' }),
  setLocation: (currentLocation) => set({ currentLocation }),
  setInteractionTarget: (interactionTarget) => set({ interactionTarget }),

  // ---------- dialogue ----------
  startDialogue: (dialogueId, nodeId = 'start') =>
    set({ uiMode: 'dialogue', dialogue: { id: dialogueId, nodeId }, interactionTarget: null }),
  advanceDialogue: (nodeId) =>
    set((s) => (s.dialogue ? { dialogue: { ...s.dialogue, nodeId } } : {})),
  endDialogue: () =>
    set((s) => ({ dialogue: null, uiMode: s.pendingMemory ? 'memory' : 'free' })),

  // ---------- quests ----------
  startQuest: (id) =>
    set((s) => {
      if (s.quests[id] || !questsData[id]) return {}
      const objectives = {}
      for (const o of questsData[id].objectives) objectives[o.id] = false
      return { quests: { ...s.quests, [id]: { status: 'active', objectives } } }
    }),
  completeObjective: (questId, objectiveId) =>
    set((s) => {
      const q = s.quests[questId]
      if (!q || q.objectives[objectiveId]) return {}
      return {
        quests: {
          ...s.quests,
          [questId]: { ...q, objectives: { ...q.objectives, [objectiveId]: true } },
        },
      }
    }),
  completeQuest: (id) =>
    set((s) => {
      const q = s.quests[id]
      if (!q || q.status === 'completed') return {}
      return { quests: { ...s.quests, [id]: { ...q, status: 'completed' } } }
    }),

  // ---------- inventory ----------
  addItem: (id) =>
    set((s) => (s.inventory.includes(id) ? {} : { inventory: [...s.inventory, id] })),
  removeItem: (id) => set((s) => ({ inventory: s.inventory.filter((i) => i !== id) })),

  // ---------- memories ----------
  discoverMemory: (id) =>
    set((s) => {
      if (s.memories.includes(id)) return {}
      const next = { memories: [...s.memories, id], pendingMemory: id }
      // Outside dialogue the reveal card opens immediately; inside dialogue
      // it opens when the conversation ends (see endDialogue).
      if (s.uiMode === 'free') next.uiMode = 'memory'
      return next
    }),
  acknowledgeMemory: () => set({ pendingMemory: null, uiMode: 'free' }),

  // ---------- overlays ----------
  openOverlay: (mode) => set((s) => (s.uiMode === 'free' ? { uiMode: mode } : {})),
  closeOverlay: () =>
    set((s) => (s.uiMode === 'journal' || s.uiMode === 'inventory' ? { uiMode: 'free' } : {})),
}))

// Dev-only handle for smoke tests and console debugging; stripped from prod builds.
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.__game = useGameStore
}
