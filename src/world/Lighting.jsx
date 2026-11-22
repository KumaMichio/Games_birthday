import { useEffect, useRef } from 'react'

/**
 * Warm morning light for the dreamy-storybook look (GDD §3).
 * One shadow-casting directional light covering the whole street,
 * plus soft ambient/hemisphere fill. Keep shadow cost low (GDD §11).
 */
export default function Lighting() {
  const lightRef = useRef(null)

  useEffect(() => {
    const light = lightRef.current
    if (!light) return
    // Aim at the middle of the street (street runs z = +6 .. -82).
    light.target.position.set(0, 0, -38)
    light.target.updateMatrixWorld()
  }, [])

  return (
    <>
      <ambientLight intensity={0.45} color="#fff2e0" />
      <hemisphereLight args={['#ffe8c8', '#b5c99a', 0.55]} />
      <directionalLight
        ref={lightRef}
        castShadow
        color="#ffe3b3"
        intensity={1.6}
        position={[30, 45, -20]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-65}
        shadow-camera-right={65}
        shadow-camera-top={65}
        shadow-camera-bottom={-65}
        shadow-camera-near={1}
        shadow-camera-far={150}
        shadow-bias={-0.0005}
      />
    </>
  )
}
