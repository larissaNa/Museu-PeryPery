import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  Environment,
  Center,
  ContactShadows,
  Html,
} from "@react-three/drei";
import { Loader2 } from "lucide-react";
import * as THREE from "three";

function Model({ url }: { url: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url, true);

  // Slow auto-rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.getElapsedTime() * 0.15) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} scale={2.5} />
      </Center>
    </group>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-museum-orange">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm font-medium">Carregando modelo 3D...</span>
      </div>
    </Html>
  );
}

interface Model3DViewerProps {
  modelUrl: string;
  className?: string;
}

export function Model3DViewer({ modelUrl, className = "" }: Model3DViewerProps) {
  return (
    <div className={`relative w-full ${className}`} style={{ height: "800px" }}>
      <Canvas
        camera={{ position: [0, 0, 1.8], fov: 30 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-3, 2, -3]} intensity={0.4} />
        <Suspense fallback={<LoadingFallback />}>
          <Model url={modelUrl} />
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={1.0}
          maxDistance={5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={false}
        />
      </Canvas>
      {/* Overlay hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/50 px-4 py-1.5 text-xs text-white backdrop-blur-sm">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
        <span>Arraste para rotacionar • Scroll para zoom</span>
      </div>
    </div>
  );
}
