import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import GameScene from './GameScene.jsx'
import { KEYBOARD_MAP } from './GameConfig.js'

export default function GameCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 3.5, 12], fov: 50 }}
      className="game-canvas"
    >
      <color attach="background" args={['#ffdfc2']} />
      <fog attach="fog" args={['#ffdfc2', 35, 120]} />
      <Suspense fallback={null}>
        <KeyboardControls map={KEYBOARD_MAP}>
          <Physics>
            <GameScene />
          </Physics>
        </KeyboardControls>
      </Suspense>
    </Canvas>
  )
}
