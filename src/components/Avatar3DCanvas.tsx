import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, useGLTF, Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

// Enhanced 3D Avatar with multiple geometric shapes
function Avatar3DScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <group>
      {/* Main icosahedron */}
      <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh 
          ref={meshRef} 
          castShadow 
          receiveShadow
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <icosahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial
            color={new THREE.Color(hovered ? "#a855f7" : "#8b5cf6")}
            metalness={0.7}
            roughness={0.1}
            emissive={new THREE.Color("#6d28d9")}
            emissiveIntensity={hovered ? 1.2 : 0.8}
          />
        </mesh>
      </Float>

      {/* Orbiting smaller shapes */}
      {[...Array(3)].map((_, i) => (
        <Float
          key={i}
          speed={1.5 + i * 0.5}
          rotationIntensity={0.8}
          floatIntensity={1}
        >
          <mesh
            position={[
              Math.cos((i * Math.PI * 2) / 3) * 2.5,
              Math.sin((i * Math.PI * 2) / 3) * 0.5,
              Math.sin((i * Math.PI * 2) / 3) * 2.5,
            ]}
            castShadow
          >
            <octahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial
              color={new THREE.Color(i === 0 ? "#60a5fa" : i === 1 ? "#c084fc" : "#34d399")}
              metalness={0.5}
              roughness={0.2}
              emissive={new THREE.Color(i === 0 ? "#3b82f6" : i === 1 ? "#a855f7" : "#10b981")}
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>
      ))}

      {/* Contact shadows for better grounding */}
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />
    </group>
  );
}

// Loading fallback for 3D scene
function Scene3DFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#8b5cf6" wireframe />
    </mesh>
  );
}

export default function Avatar3DCanvas() {
  return (
    <div className="relative aspect-square w-full max-w-[320px] rounded-2xl p-[2px] neon-ring">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/60 to-fuchsia-500/60 blur-2xl" />
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-2 overflow-hidden">
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 45 }} 
          shadows
          dpr={[1, 2]} // Responsive pixel ratio
          performance={{ min: 0.5 }} // Performance optimization
        >
          {/* Lighting setup */}
          <ambientLight intensity={0.4} />
          <pointLight 
            position={[5, 5, 5]} 
            intensity={1.2} 
            color={new THREE.Color("#60a5fa")}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight 
            position={[-5, -3, -5]} 
            intensity={0.8} 
            color={new THREE.Color("#c084fc")} 
          />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={0.5}
            castShadow
          />

          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* 3D Scene */}
          <Suspense fallback={<Scene3DFallback />}>
            <Avatar3DScene />
          </Suspense>

          {/* Controls */}
          <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={0.8}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Canvas>

        {/* Interactive hint */}
        <motion.div
          className="absolute bottom-2 right-2 text-xs text-white/40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          Arraste para interagir
        </motion.div>
      </div>
    </div>
  );
}