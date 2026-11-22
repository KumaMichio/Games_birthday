/**
 * Greybox stand-in figure used for the player and NPCs until real models
 * arrive (GDD §17.1.9). Origin is at the feet; the nose marks facing (+Z).
 */
export default function PlaceholderCharacter({
  bodyColor = '#e8a0bf',
  headColor = '#ffd9b3',
  noseColor = '#f2b28c',
}) {
  return (
    <group>
      {/* body */}
      <mesh castShadow position={[0, 0.55, 0]}>
        <capsuleGeometry args={[0.28, 0.55, 6, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      {/* head */}
      <mesh castShadow position={[0, 1.18, 0]}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial color={headColor} />
      </mesh>
      {/* nose — marks the facing direction while greyboxing */}
      <mesh castShadow position={[0, 1.18, 0.22]} rotation-x={Math.PI / 2}>
        <coneGeometry args={[0.05, 0.12, 8]} />
        <meshStandardMaterial color={noseColor} />
      </mesh>
    </group>
  )
}
