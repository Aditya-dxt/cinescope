import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF, Center, Html } from "@react-three/drei";
import { Suspense, useRef, useEffect, useMemo } from "react";
import * as THREE from "three";

function ProceduralProduct({ color, metalness, roughness, wireframe }: { color: string; metalness: number; roughness: number; wireframe: boolean }) {
  const group = useRef<THREE.Group>(null);
  // subtle floating on scroll/cursor via frame
  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.15) * 0.12 + pointer.x * 0.25;
    group.current.rotation.x = Math.cos(t * 0.12) * 0.06 + pointer.y * -0.12;
    group.current.position.y = Math.sin(t * 0.5) * 0.08;
  });
  return (
    <group ref={group}>
      {/* Main hero shape — abstract product (torus knot + floating chips) */}
      <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
        <torusKnotGeometry args={[0.9, 0.28, 180, 32]} />
        <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} wireframe={wireframe} />
      </mesh>
      <mesh castShadow position={[0, -0.65, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[1.05, 1.1, 0.12, 64]} />
        <meshStandardMaterial color="#1a1a24" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh castShadow position={[1.35, 0.2, 0.2]} scale={0.28}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} wireframe={wireframe} emissive={color} emissiveIntensity={0.06} />
      </mesh>
      <mesh castShadow position={[-1.3, -0.1, -0.15]} scale={0.22}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.22} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

function GLBModel({ url, color, metalness, roughness, wireframe }: { url: string; color: string; metalness: number; roughness: number; wireframe: boolean }) {
  const { scene } = useGLTF(url, "https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    cloned.traverse((obj: THREE.Object3D) => {
      if ((obj as THREE.Mesh).isMesh) {
        const m = obj as THREE.Mesh;
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat && "color" in mat) {
          // preserve texture? override color only if no map or user changed
          (mat as THREE.MeshStandardMaterial).color = new THREE.Color(color);
          (mat as THREE.MeshStandardMaterial).metalness = metalness;
          (mat as THREE.MeshStandardMaterial).roughness = roughness;
          (mat as THREE.MeshStandardMaterial).wireframe = wireframe;
          mat.needsUpdate = true;
        }
      }
    });
  }, [cloned, color, metalness, roughness, wireframe]);

  // auto-center & scale
  return (
    <Center>
      <primitive object={cloned} scale={1} />
    </Center>
  );
}

function Loader() {
  return (
    <Html center>
      <div style={{ background: "rgba(18,18,26,0.9)", border: "1px solid #23232f", borderRadius: 12, padding: "10px 14px", color: "#9a9ab0", fontSize: 12, whiteSpace: "nowrap" }}>
        Loading 3D…
      </div>
    </Html>
  );
}

export function ViewerCanvas({
  glbUrl,
  color,
  metalness,
  roughness,
  wireframe,
  envPreset,
  autoRotate,
  lightIntensity,
  dprCap = 1.5,
}: {
  glbUrl: string | null;
  color: string;
  metalness: number;
  roughness: number;
  wireframe: boolean;
  envPreset: "city" | "studio" | "sunset" | "warehouse" | "apartment";
  autoRotate: boolean;
  lightIntensity: number;
  dprCap?: number;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, dprCap]}
      camera={{ position: [2.6, 1.6, 3.2], fov: 42, near: 0.1, far: 80 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, powerPreference: "high-performance", stencil: false, depth: true }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = lightIntensity;
      }}
    >
      <Suspense fallback={<Loader />}>
        {/* Lights */}
        <ambientLight intensity={0.6 * lightIntensity} />
        <directionalLight
          castShadow
          position={[4, 6, 3]}
          intensity={1.2 * lightIntensity}
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0005}
        />
        <spotLight position={[-3, 4, -2]} intensity={0.6 * lightIntensity} angle={0.35} penumbra={0.6} castShadow />
        <hemisphereLight args={["#ffffff", "#1a1a24", 0.45 * lightIntensity]} />

        {glbUrl ? (
          <GLBModel url={glbUrl} color={color} metalness={metalness} roughness={roughness} wireframe={wireframe} />
        ) : (
          <ProceduralProduct color={color} metalness={metalness} roughness={roughness} wireframe={wireframe} />
        )}

        <ContactShadows position={[0, -0.92, 0]} opacity={0.42} scale={7} blur={2.2} far={2.2} color="#000000" />
        <Environment preset={envPreset} background={false} />
        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          minDistance={1.4}
          maxDistance={9}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI / 1.95}
          autoRotate={autoRotate}
          autoRotateSpeed={0.7}
          enablePan={false}
          makeDefault
        />
      </Suspense>
    </Canvas>
  );
}

// Preload draco decoder path hint
void useGLTF.preload;
