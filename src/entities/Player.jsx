import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CameraControls, useKeyboardControls } from '@react-three/drei'
import { Ecctrl } from 'ecctrl'
import { CAMERA, PLAYER, PLAYER_FOOT_OFFSET, PLAYER_SPAWN } from '../game/GameConfig.js'
import { setPlayerPosition } from '../systems/InteractionSystem.js'
import { useGameStore } from '../stores/gameStore.js'
import PlaceholderCharacter from './PlaceholderCharacter.jsx'

const NO_INPUT = {
  forward: false,
  backward: false,
  leftward: false,
  rightward: false,
  jump: false,
  run: false,
}

/**
 * Third-person player (GDD §5.3, §10.8).
 * - Ecctrl (Rapier floating capsule) handles movement, slopes, collision;
 *   input is fed each frame via setMovement().
 * - Drei CameraControls provides drag-to-rotate orbit (pointer-lock-free,
 *   GDD §10.11); we follow the capsule every frame.
 * - Movement freezes whenever any UI overlay owns the screen (uiMode).
 */
export default function Player() {
  const ecctrl = useRef(null)
  const controls = useRef(null)
  const [, getKeys] = useKeyboardControls()

  useEffect(() => {
    const c = controls.current
    if (!c) return
    // Left-drag rotates; disable truck/pan so the camera stays on the player.
    c.mouseButtons.right = 0
    c.mouseButtons.middle = 0
    const [x, y, z] = PLAYER_SPAWN
    c.setLookAt(x, y + 1.8, z + 4.5, x, y + CAMERA.targetHeight, z, false)
  }, [])

  // Dev-only teleport hook for smoke tests (stripped from prod builds).
  useEffect(() => {
    if (!import.meta.env.DEV) return
    window.__teleport = (x, y, z) => {
      const body = ecctrl.current?.body
      if (!body) return
      body.setTranslation({ x, y, z }, true)
      body.setLinvel({ x: 0, y: 0, z: 0 }, true)
    }
    return () => delete window.__teleport
  }, [])

  useFrame(() => {
    const character = ecctrl.current
    if (!character) return

    const { phase, uiMode } = useGameStore.getState()
    const free = phase === 'playing' && uiMode === 'free'
    character.setMovement(free ? getKeys() : NO_INPUT)

    const p = character.currPos
    setPlayerPosition(p)
    controls.current?.moveTo(p.x, p.y + CAMERA.targetHeight, p.z, true)
  })

  return (
    <>
      <Ecctrl
        ref={ecctrl}
        position={PLAYER_SPAWN}
        capsuleHalfHeight={PLAYER.capsuleHalfHeight}
        capsuleRadius={PLAYER.capsuleRadius}
        floatHeight={PLAYER.floatHeight}
        maxWalkVel={PLAYER.maxWalkVel}
        maxRunVel={PLAYER.maxRunVel}
        enableToggleRun={false}
      >
        <group position={[0, -PLAYER_FOOT_OFFSET, 0]}>
          <PlaceholderCharacter />
        </group>
      </Ecctrl>
      <CameraControls
        ref={controls}
        makeDefault
        smoothTime={CAMERA.smoothTime}
        minDistance={CAMERA.minDistance}
        maxDistance={CAMERA.maxDistance}
        minPolarAngle={CAMERA.minPolarAngle}
        maxPolarAngle={CAMERA.maxPolarAngle}
      />
    </>
  )
}
