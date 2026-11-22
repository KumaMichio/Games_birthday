import { Billboard, Text } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'

/**
 * Week 1–2 greybox of the main street (GDD §3.4, §10.5 step 1).
 * One continuous street running toward -Z:
 *   entrance (z≈+8) → shops → plaza + café (z≈-40) → hill ramp (z≈-56..-78).
 * The hidden garden branches off a side alley on the right (x>0, z≈-31).
 * Everything here is placeholder geometry to be replaced by real assets.
 */
export default function Street() {
  return (
    <group>
      <Ground />
      <Paths />
      <Entrance />

      {/* Buildings — left side fronts face +X, right side fronts face -X */}
      <GreyboxBuilding
        position={[-8, 0, -14]}
        size={[7, 3.8, 6]}
        rotationY={Math.PI / 2}
        color="#f4a7b9"
        roofColor="#d96c85"
        label="Flower Shop"
      />
      <GreyboxBuilding
        position={[8, 0, -10]}
        size={[6, 3.4, 5]}
        rotationY={-Math.PI / 2}
        color="#f5e6c8"
        roofColor="#c9a227"
        label="House"
      />
      <GreyboxBuilding
        position={[8.5, 0, -22]}
        size={[7, 4.2, 6]}
        rotationY={-Math.PI / 2}
        color="#a9746e"
        roofColor="#6d4c41"
        label="Old Bookstore"
      />
      <GreyboxBuilding
        position={[-8, 0, -26]}
        size={[6, 3.4, 5]}
        rotationY={Math.PI / 2}
        color="#bcd4de"
        roofColor="#7c99a6"
        label="House"
      />
      <GreyboxBuilding
        position={[-9, 0, -38]}
        size={[7.5, 3.8, 6]}
        rotationY={Math.PI / 2}
        color="#f3b562"
        roofColor="#d1823a"
        label="Little Café"
      />
      <GreyboxBuilding
        position={[9, 0, -42]}
        size={[6, 3.4, 5]}
        rotationY={-Math.PI / 2}
        color="#cfe3b8"
        roofColor="#8aa86b"
        label="House"
      />

      <HiddenGarden />
      <Hill />

      {/* Trees along the street edges */}
      {TREE_SPOTS.map(([x, z, s], i) => (
        <Tree key={i} position={[x, 0, z]} scale={s} />
      ))}

      <Bench position={[-4.2, 0, -19]} rotationY={Math.PI / 2} />
      <Bench position={[4.2, 0, -33]} rotationY={-Math.PI / 2} />
      <Bench position={[-5, 0, -44]} rotationY={Math.PI / 4} />

      <Boundaries />
    </group>
  )
}

const TREE_SPOTS = [
  [-5, 2, 1], [5.5, -2, 1.15], [-5.5, -8, 0.9], [5, -16, 1.1],
  [-4.8, -23, 1], [5.2, -27, 0.95], [-5.4, -31, 1.1], [5.6, -37, 1],
  [-6, -48, 1.2], [6, -47, 0.9], [-11, -5, 1.3], [12, -16, 1.25],
  [-12, -32, 1.2], [13, -45, 1.1],
]

function Ground() {
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[55, 0.5, 85]} position={[0, -0.5, -35]} />
      <mesh receiveShadow position={[0, -0.5, -35]}>
        <boxGeometry args={[110, 1, 170]} />
        <meshStandardMaterial color="#9bc07c" />
      </mesh>
    </RigidBody>
  )
}

/** Cobblestone-colored walking paths laid flat on the ground (no colliders needed). */
function Paths() {
  return (
    <group>
      {/* main street */}
      <mesh receiveShadow position={[0, 0.04, -21]}>
        <boxGeometry args={[6, 0.08, 70]} />
        <meshStandardMaterial color="#d9c1a3" />
      </mesh>
      {/* plaza by the café */}
      <mesh receiveShadow position={[0, 0.04, -40]}>
        <boxGeometry args={[18, 0.08, 16]} />
        <meshStandardMaterial color="#e0cbb0" />
      </mesh>
      {/* path toward the hill ramp */}
      <mesh receiveShadow position={[0, 0.04, -52]}>
        <boxGeometry args={[4, 0.08, 10]} />
        <meshStandardMaterial color="#d9c1a3" />
      </mesh>
      {/* alley to the hidden garden (enters through the hedge gap at z≈-39) */}
      <mesh receiveShadow position={[13, 0.04, -39]}>
        <boxGeometry args={[12, 0.08, 3]} />
        <meshStandardMaterial color="#cdbb9e" />
      </mesh>
    </group>
  )
}

function Entrance() {
  return (
    <group position={[0, 0, 11.5]}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow position={[-3, 1.6, 0]}>
          <boxGeometry args={[0.4, 3.2, 0.4]} />
          <meshStandardMaterial color="#8d6e63" />
        </mesh>
        <mesh castShadow position={[3, 1.6, 0]}>
          <boxGeometry args={[0.4, 3.2, 0.4]} />
          <meshStandardMaterial color="#8d6e63" />
        </mesh>
      </RigidBody>
      {/* crossbar sign, above head height so no collider needed */}
      <mesh castShadow position={[0, 3.4, 0]}>
        <boxGeometry args={[7, 0.8, 0.3]} />
        <meshStandardMaterial color="#a1887f" />
      </mesh>
      <Text
        position={[0, 3.4, -0.2]}
        rotation-y={Math.PI}
        fontSize={0.42}
        color="#fff7ec"
        anchorX="center"
        anchorY="middle"
      >
        A Street Full of Memories
      </Text>
      {/* mailbox (future interactable, GDD §3.2) */}
      <RigidBody type="fixed" colliders="cuboid" position={[-2.2, 0, -1.5]}>
        <mesh castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[0.15, 1, 0.15]} />
          <meshStandardMaterial color="#6d4c41" />
        </mesh>
        <mesh castShadow position={[0, 1.1, 0]}>
          <boxGeometry args={[0.45, 0.35, 0.3]} />
          <meshStandardMaterial color="#d96c85" />
        </mesh>
      </RigidBody>
    </group>
  )
}

function GreyboxBuilding({ position, size, rotationY = 0, color, roofColor, label }) {
  const [w, h, d] = size
  const roofHeight = h * 0.55
  return (
    <group position={position} rotation-y={rotationY}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[w / 2, h / 2, d / 2]} position={[0, h / 2, 0]} />
        <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </RigidBody>
      {/* pyramid roof: 4-sided cone rotated 45° to align with the box */}
      <mesh castShadow position={[0, h + roofHeight / 2, 0]} rotation-y={Math.PI / 4}>
        <coneGeometry args={[Math.max(w, d) * 0.78, roofHeight, 4]} />
        <meshStandardMaterial color={roofColor} flatShading />
      </mesh>
      {/* door on the front (+Z after rotation) */}
      <mesh position={[0, 1, d / 2 + 0.02]}>
        <boxGeometry args={[1, 2, 0.05]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      <Billboard position={[0, h + roofHeight + 0.8, 0]}>
        <Text fontSize={0.55} color="#5b4a3f" anchorX="center" anchorY="middle">
          {label}
        </Text>
      </Billboard>
    </group>
  )
}

function HiddenGarden() {
  return (
    <group position={[17, 0, -36]}>
      {/* hedge walls forming a tucked-away courtyard */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow position={[0, 0.9, -5]}>
          <boxGeometry args={[12, 1.8, 1]} />
          <meshStandardMaterial color="#6f9b5e" />
        </mesh>
        <mesh castShadow position={[6, 0.9, 0]}>
          <boxGeometry args={[1, 1.8, 11]} />
          <meshStandardMaterial color="#6f9b5e" />
        </mesh>
        <mesh castShadow position={[-6, 0.9, 2]}>
          <boxGeometry args={[1, 1.8, 7]} />
          <meshStandardMaterial color="#6f9b5e" />
        </mesh>
        <mesh castShadow position={[0, 0.9, 5]}>
          <boxGeometry args={[12, 1.8, 1]} />
          <meshStandardMaterial color="#6f9b5e" />
        </mesh>
      </RigidBody>
      {/* fountain placeholder */}
      <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
        <CuboidCollider args={[1.3, 0.5, 1.3]} position={[0, 0.5, 0]} />
        <mesh castShadow position={[0, 0.4, 0]}>
          <cylinderGeometry args={[1.3, 1.5, 0.8, 20]} />
          <meshStandardMaterial color="#b0bec5" />
        </mesh>
        <mesh castShadow position={[0, 1, 0]}>
          <cylinderGeometry args={[0.25, 0.3, 1.2, 12]} />
          <meshStandardMaterial color="#90a4ae" />
        </mesh>
      </RigidBody>
      <Billboard position={[0, 3.2, 0]}>
        <Text fontSize={0.5} color="#4e6e45" anchorX="center" anchorY="middle">
          Hidden Garden
        </Text>
      </Billboard>
    </group>
  )
}

function Hill() {
  const slope = 0.245 // ≈14°, well within ecctrl's climbable range
  return (
    <group>
      {/* ramp up (far end rises toward -Z) */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[0, 2.6, -67]} rotation-x={slope}>
          <boxGeometry args={[8, 0.5, 23]} />
          <meshStandardMaterial color="#8db36f" />
        </mesh>
      </RigidBody>
      {/* hilltop plateau */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[0, 2.75, -82]}>
          <boxGeometry args={[16, 5.5, 12]} />
          <meshStandardMaterial color="#9bc07c" />
        </mesh>
      </RigidBody>
      <Tree position={[-4, 5.5, -83]} scale={1.3} />
      <Bench position={[2, 5.5, -82]} rotationY={Math.PI} />
      <Billboard position={[0, 9.5, -82]}>
        <Text fontSize={0.7} color="#5b4a3f" anchorX="center" anchorY="middle">
          The Hill
        </Text>
      </Billboard>
    </group>
  )
}

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.22, 0.8, 0.22]} position={[0, 0.8, 0]} />
        <mesh castShadow position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.16, 0.22, 1.6, 8]} />
          <meshStandardMaterial color="#8d6e63" />
        </mesh>
      </RigidBody>
      <mesh castShadow position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.95, 14, 14]} />
        <meshStandardMaterial color="#7fb069" flatShading />
      </mesh>
      <mesh castShadow position={[0.3, 2.9, 0.1]}>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshStandardMaterial color="#93c178" flatShading />
      </mesh>
    </group>
  )
}

function Bench({ position, rotationY = 0 }) {
  return (
    <group position={position} rotation-y={rotationY}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.9, 0.3, 0.3]} position={[0, 0.3, 0]} />
        <mesh castShadow position={[0, 0.45, 0]}>
          <boxGeometry args={[1.8, 0.1, 0.5]} />
          <meshStandardMaterial color="#a1887f" />
        </mesh>
        <mesh castShadow position={[-0.7, 0.2, 0]}>
          <boxGeometry args={[0.12, 0.4, 0.45]} />
          <meshStandardMaterial color="#8d6e63" />
        </mesh>
        <mesh castShadow position={[0.7, 0.2, 0]}>
          <boxGeometry args={[0.12, 0.4, 0.45]} />
          <meshStandardMaterial color="#8d6e63" />
        </mesh>
        <mesh castShadow position={[0, 0.75, -0.22]}>
          <boxGeometry args={[1.8, 0.5, 0.08]} />
          <meshStandardMaterial color="#a1887f" />
        </mesh>
      </RigidBody>
    </group>
  )
}

/** Invisible walls keeping the player inside the playable area. */
function Boundaries() {
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[0.5, 6, 85]} position={[-24, 3, -35]} />
      <CuboidCollider args={[0.5, 6, 85]} position={[24, 3, -35]} />
      <CuboidCollider args={[55, 6, 0.5]} position={[0, 3, 14]} />
      <CuboidCollider args={[55, 8, 0.5]} position={[0, 4, -90]} />
    </RigidBody>
  )
}
