import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import { CapsuleCollider, RigidBody } from '@react-three/rapier'
import npcs from '../data/npcs.json'
import PlaceholderCharacter from './PlaceholderCharacter.jsx'
import { registerInteractable } from '../systems/InteractionSystem.js'
import { resolveNpcDialogue } from '../systems/DialogueSystem.js'
import { useGameStore } from '../stores/gameStore.js'

/**
 * Data-driven NPC (GDD §4.7–4.8): visuals + collider + interaction
 * registration. Which dialogue opens is resolved at interact time from
 * npcs.json dialogueRules, so conversations follow quest progression.
 */
export default function NPC({ npcId }) {
  const npc = npcs[npcId]
  const visualRef = useRef(null)
  const bobOffset = useMemo(() => Math.random() * Math.PI * 2, [])
  const worldPos = useMemo(() => new THREE.Vector3(...npc.position), [npc])

  useEffect(
    () =>
      registerInteractable({
        id: npcId,
        type: 'npc',
        label: `Talk to ${npc.name}`,
        position: worldPos,
        radius: npc.interactionRadius ?? 2.5,
        onInteract: () => {
          const dialogueId = resolveNpcDialogue(npcId)
          if (dialogueId) useGameStore.getState().startDialogue(dialogueId)
        },
      }),
    [npcId, npc, worldPos],
  )

  // Gentle idle bob so greybox NPCs read as alive (GDD §4.7 "Idle").
  useFrame(({ clock }) => {
    if (visualRef.current) {
      visualRef.current.position.y =
        Math.abs(Math.sin(clock.elapsedTime * 1.6 + bobOffset)) * 0.04
    }
  })

  return (
    <group position={npc.position} rotation-y={npc.facing ?? 0}>
      <RigidBody type="fixed" colliders={false}>
        <CapsuleCollider args={[0.35, 0.3]} position={[0, 0.85, 0]} />
      </RigidBody>
      <group ref={visualRef}>
        <PlaceholderCharacter
          bodyColor={npc.colors?.body}
          headColor={npc.colors?.head}
          noseColor={npc.colors?.nose}
        />
      </group>
      <Billboard position={[0, 1.85, 0]}>
        <Text fontSize={0.24} color="#5b4a3f" anchorX="center" anchorY="middle">
          {npc.name}
        </Text>
      </Billboard>
      <QuestIndicator npc={npc} />
    </group>
  )
}

/** '!' = quest available, '?' = quest in progress (GDD §4.7). */
function QuestIndicator({ npc }) {
  const questId = npc.quests?.[0]
  const quest = useGameStore((s) => (questId ? s.quests[questId] : undefined))
  const ref = useRef(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 2.3 + Math.sin(clock.elapsedTime * 2.4) * 0.07
    }
  })

  if (!questId || quest?.status === 'completed') return null
  const symbol = quest ? '?' : '!'
  const color = quest ? '#8aa86b' : '#e0a100'

  return (
    <Billboard ref={ref} position={[0, 2.3, 0]}>
      <Text
        fontSize={0.42}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#fff7ec"
      >
        {symbol}
      </Text>
    </Billboard>
  )
}
