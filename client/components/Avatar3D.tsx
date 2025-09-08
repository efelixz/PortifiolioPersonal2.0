import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function Icosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);
  return (
    <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color={new THREE.Color("#8b5cf6")}
          metalness={0.7}
          roughness={0.1}
          emissive={new THREE.Color("#6d28d9")}
          emissiveIntensity={0.8}
        />
      </mesh>
    </Float>
  );
}

export default function Avatar3D() {
  return (
    <div className="relative aspect-square w-full max-w-[320px] rounded-2xl p-[2px] neon-ring">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/60 to-fuchsia-500/60 blur-2xl" />
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-2">
        <Canvas camera={{ position: [0, 0, 4] }} shadows>
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} intensity={1.2} color={new THREE.Color("#60a5fa")} />
          <pointLight position={[-5, -3, -5]} intensity={0.8} color={new THREE.Color("#c084fc")} />
          <Suspense fallback={null}>
            <Icosahedron />
          </Suspense>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
        </Canvas>
      </div>
    </div>
  );
}
