import { useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'

// كل المجسمات مبنية بالكود (بدون ملفات خارجية) وبتتلون حسب اللون المختار
function Headphones({ color, glow }) {
  return (
    <group scale={0.95}>
      {/* الحزام */}
      <mesh position={[0, 0.15, 0]}>
        <torusGeometry args={[1.1, 0.08, 24, 90, Math.PI]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.25, 0]} scale={[1, 0.6, 1]}>
        <capsuleGeometry args={[0.3, 0.45, 8, 24]} />
        <meshStandardMaterial color="#111118" roughness={0.9} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 1.1, 0.15, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.52, 0.52, 0.38, 64]} />
            <meshStandardMaterial color={color} metalness={0.75} roughness={0.22} />
          </mesh>
          <mesh position={[-s * 0.26, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.47, 0.47, 0.18, 64]} />
            <meshStandardMaterial color="#0e0e14" roughness={1} />
          </mesh>
          <mesh position={[s * 0.2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.36, 0.025, 16, 80]} />
            <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={2.4} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Watch({ color, glow }) {
  return (
    <group rotation={[0.1, 0, 0]} scale={1.05}>
      {/* السيور */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, s * 1.2, -0.05]} rotation={[s * -0.12, 0, 0]}>
          <boxGeometry args={[0.72, 1.1, 0.1]} />
          <meshStandardMaterial color="#14141b" roughness={0.85} />
        </mesh>
      ))}
      {/* الجسم */}
      <RoundedBox args={[1.15, 1.35, 0.32]} radius={0.22} smoothness={6}>
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} />
      </RoundedBox>
      {/* الشاشة */}
      <RoundedBox args={[0.95, 1.15, 0.02]} radius={0.16} smoothness={6} position={[0, 0, 0.165]}>
        <meshPhysicalMaterial color="#05050a" roughness={0.05} metalness={0.3} clearcoat={1} />
      </RoundedBox>
      {/* عقارب وحلقة */}
      <mesh position={[0, 0, 0.19]}>
        <torusGeometry args={[0.34, 0.012, 12, 80]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.13, 0.19]}>
        <boxGeometry args={[0.03, 0.28, 0.01]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      <mesh position={[0.1, 0, 0.19]} rotation={[0, 0, Math.PI / 2.4]}>
        <boxGeometry args={[0.03, 0.22, 0.01]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={2} toneMapped={false} />
      </mesh>
      {/* التاج */}
      <mesh position={[0.62, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.14, 32]} />
        <meshStandardMaterial color={color} metalness={1} roughness={0.25} />
      </mesh>
    </group>
  )
}

function Lamp({ color, glow }) {
  return (
    <group position={[0, -0.1, 0]}>
      <mesh position={[0, -1.15, 0]}>
        <cylinderGeometry args={[0.65, 0.75, 0.14, 64]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2.1, 24]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.28, 0.95, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.6, 24]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} />
      </mesh>
      <group position={[0.6, 0.8, 0]} rotation={[0, 0, -0.15]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.55, 0.6, 64, 1, true]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.35} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.18, 0]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={3} toneMapped={false} />
        </mesh>
        <pointLight position={[0, -0.3, 0]} intensity={6} color={glow} distance={5} />
      </group>
    </group>
  )
}

function Speaker({ color, glow }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.95, 64, 64]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.28} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.97, 0.045, 24, 120]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={2.8} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
        <torusGeometry args={[0.8, 0.015, 16, 100]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <torusGeometry args={[0.8, 0.015, 16, 100]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      <mesh position={[0, -1.12, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 0.12, 48]} />
        <meshStandardMaterial color="#15151c" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  )
}

function Vase({ color, glow }) {
  const points = useMemo(
    () =>
      [
        [0.001, 0], [0.5, 0], [0.58, 0.12], [0.78, 0.55], [0.82, 0.95],
        [0.62, 1.4], [0.32, 1.75], [0.3, 2.0], [0.4, 2.12], [0.34, 2.14],
        [0.24, 2.0], [0.001, 1.9],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
    []
  )
  return (
    <group position={[0, -1.1, 0]}>
      <mesh>
        <latheGeometry args={[points, 80]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.18}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.84, 0.012, 12, 120]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Bag({ color, glow }) {
  return (
    <group position={[0, -0.25, 0]} scale={1.05}>
      {/* جسم الحقيبة */}
      <RoundedBox args={[2, 1.35, 0.8]} radius={0.16} smoothness={6}>
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.55} />
      </RoundedBox>
      {/* الغطاء */}
      <RoundedBox args={[2.04, 0.62, 0.84]} radius={0.15} smoothness={6} position={[0, 0.5, 0]}>
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.45} />
      </RoundedBox>
      {/* خط الخياطة المضيء */}
      <mesh position={[0, 0.16, 0.425]}>
        <boxGeometry args={[1.9, 0.014, 0.01]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={2} toneMapped={false} />
      </mesh>
      {/* القفل */}
      <mesh position={[0, 0.16, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.06, 32]} />
        <meshStandardMaterial color="#d9d9e3" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.16, 0.47]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.07, 0.016, 12, 40]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
      {/* المقبض */}
      <mesh position={[0, 0.82, 0]} scale={[1, 0.85, 1]}>
        <torusGeometry args={[0.6, 0.06, 20, 80, Math.PI]} />
        <meshStandardMaterial color="#14141b" roughness={0.7} />
      </mesh>
      {/* الحلقات المعدنية */}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.82, 0]}>
          <sphereGeometry args={[0.09, 24, 24]} />
          <meshStandardMaterial color="#d9d9e3" metalness={1} roughness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

const MODELS = { headphones: Headphones, watch: Watch, lamp: Lamp, speaker: Speaker, vase: Vase, bag: Bag }

export default function ProductModel({ type, color, glow }) {
  const Model = MODELS[type] || Speaker
  return <Model color={color} glow={glow} />
}
