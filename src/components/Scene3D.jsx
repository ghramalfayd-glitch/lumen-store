import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Lightformer, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import ProductModel from './ProductModel'

// إضاءة ستوديو بدون تحميل ملفات HDR من الإنترنت
function Studio() {
  return (
    <Environment resolution={256}>
      <Lightformer intensity={2.2} position={[0, 5, -6]} scale={[12, 4, 1]} />
      <Lightformer intensity={1.4} position={[-5, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[6, 4, 1]} />
      <Lightformer intensity={1.4} position={[5, 1, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 4, 1]} />
      <Lightformer intensity={0.8} position={[0, -3, 3]} scale={[10, 2, 1]} />
    </Environment>
  )
}

function Rig({ children, follow, spin }) {
  const ref = useRef()
  useFrame((state, delta) => {
    const g = ref.current
    if (!g) return
    if (follow) {
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, state.pointer.x * 0.9, 0.05)
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * 0.35, 0.05)
    } else if (spin) {
      g.rotation.y += delta * 0.7
    }
  })
  return <group ref={ref}>{children}</group>
}

export default function Scene3D({
  type,
  color,
  glow,
  interactive = false,
  spin = true,
  follow = false,
  float = true,
  active = true,
  camera = [0, 0.3, 5.4],
  fov = 35,
  scale = 1,
}) {
  const model = <ProductModel type={type} color={color} glow={glow} />
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: camera, fov }}
      frameloop={active ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 3]} intensity={1.1} />
        <pointLight position={[-4, 2, -2]} intensity={10} color={glow} />
        <Studio />
        <Rig follow={follow} spin={spin && active && !interactive}>
          <group scale={scale}>
            {float ? (
              <Float speed={2} rotationIntensity={0.15} floatIntensity={0.5}>
                {model}
              </Float>
            ) : (
              model
            )}
          </group>
        </Rig>
        <ContactShadows position={[0, -1.45, 0]} opacity={0.45} scale={9} blur={2.8} far={3.2} color={glow} />
      </Suspense>
      {interactive && (
        <OrbitControls
          enablePan={false}
          minDistance={3.2}
          maxDistance={8}
          autoRotate={spin}
          autoRotateSpeed={1.4}
          maxPolarAngle={Math.PI / 1.7}
        />
      )}
    </Canvas>
  )
}
