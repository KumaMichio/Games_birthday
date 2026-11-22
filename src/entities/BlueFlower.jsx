import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Float } from '@react-three/drei'
import { registerInteractable } from '../systems/InteractionSystem.js'
import { applyActions } from '../systems/DialogueSystem.js'
import { useGameStore } from '../stores/gameStore.js'

const FLOWER_POS = [19, 0, -33.5] // inside the hidden garden, past the fountain
const PETAL_COUNT = 6

/**
 * The vertical-slice collectible (GDD §15). Appears once Lily's quest is
 * active; picking it adds the item and ticks the quest objective.
 */
export default function BlueFlower() {
  const questActive = useGameStore((s) => s.quests.find_blue_flower?.status === 'active')
  const picked = useGameStore((s) => s.quests.find_blue_flower?.objectives?.pick === true)
  const worldPos = useMemo(
    () => new THREE.Vector3(FLOWER_POS[0], FLOWER_POS[1] + 0.4, FLOWER_POS[2]),
    [],
  )

  const active = questActive && !picked

  useEffect(() => {
    if (!active) return
    return registerInteractable({
      id: 'blue_flower_pickup',
      type: 'collectible',
      label: 'Pick the little blue flower',
      position: worldPos,
      radius: 2,
      onInteract: () =>
        applyActions([
          { type: 'addItem', id: 'blue_flower' },
          { type: 'completeObjective', quest: 'find_blue_flower', objective: 'pick' },
        ]),
    })
  }, [active, worldPos])

  if (!active) return null

  return (
    <group position={FLOWER_POS}>
      <Float speed={2.4} floatIntensity={0.25} rotationIntensity={0.4} floatingRange={[0, 0.15]}>
        <group position={[0, 0.45, 0]}>
          {/* stem */}
          <mesh castShadow position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.025, 0.035, 0.4, 8]} />
            <meshStandardMaterial color="#6f9b5e" />
          </mesh>
          {/* petals */}
          {Array.from({ length: PETAL_COUNT }, (_, i) => {
            const a = (i / PETAL_COUNT) * Math.PI * 2
            return (
              <mesh key={i} castShadow position={[Math.cos(a) * 0.11, 0.05, Math.sin(a) * 0.11]}>
                <sphereGeometry args={[0.07, 10, 10]} />
                <meshStandardMaterial color="#6c9bd1" />
              </mesh>
            )
          })}
          {/* center */}
          <mesh castShadow position={[0, 0.07, 0]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial color="#ffd54f" emissive="#8a6d1a" emissiveIntensity={0.4} />
          </mesh>
        </group>
      </Float>
      {/* soft glow marker so it reads from a distance */}
      <mesh position={[0, 0.02, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.3, 0.42, 24]} />
        <meshBasicMaterial color="#9cc3ea" transparent opacity={0.55} />
      </mesh>
    </group>
  )
}
