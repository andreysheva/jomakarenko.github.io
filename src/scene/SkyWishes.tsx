import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useAppStore } from "../lib/store";
import type { SkyWish } from "../types";

function AnimatedLantern({ wish }: { wish: SkyWish }) {
  const groupRef = useRef<THREE.Group>(null);
  const startY = wish.position[1];

  useFrame((state) => {
    if (groupRef.current) {
      const elapsed = (state.clock.elapsedTime - wish.createdAt / 1000) % 25;
      const y = startY + elapsed * 0.95;
      const swayX = Math.sin(elapsed * 1.2) * 0.4;
      const swayZ = Math.cos(elapsed * 0.9) * 0.4;

      groupRef.current.position.set(
        wish.position[0] + swayX,
        y,
        wish.position[2] + swayZ
      );
    }
  });

  return (
    <group ref={groupRef} position={wish.position}>
      {/* Glowing Lantern Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.22, 0.6, 12]} />
        <meshStandardMaterial
          color="#ffaa66"
          emissive="#ff7733"
          emissiveIntensity={2.2}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Point light */}
      <pointLight color="#ffa040" intensity={1.8} distance={10} />

      {/* Floating Wish Text Tag */}
      <Html
        position={[0, -0.6, 0]}
        center
        distanceFactor={18}
        className="pointer-events-none"
      >
        <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#f4a261]/50 text-[#f4a261] text-[11px] font-medium whitespace-nowrap shadow-lg animate-[fade-in_0.5s_ease-out]">
          ✨ {wish.text}
        </div>
      </Html>
    </group>
  );
}

function HeartFireworks() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate heart parametric shape particles
  const { positions, colors } = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#ff6b81"),
      new THREE.Color("#f4a261"),
      new THREE.Color("#e76f51"),
      new THREE.Color("#ffd97d"),
    ];

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      // Parametric heart formula
      const scale = 0.25;
      const x = 16 * Math.pow(Math.sin(t), 3) * scale;
      const y =
        (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) *
        scale;
      const z = (Math.random() - 0.5) * 1.5;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y + 14;
      pos[i * 3 + 2] = z;

      const c = palette[i % palette.length];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.08;
      pointsRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={[0, 0, -2]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.45}
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Explosion Light */}
      <pointLight position={[0, 14, -2]} color="#ff6b81" intensity={3.0} distance={30} />
    </group>
  );
}

export function SkyWishes() {
  const releasedLanterns = useAppStore((s) => s.releasedLanterns);
  const triggerFireworks = useAppStore((s) => s.triggerFireworks);

  return (
    <group>
      {/* Released Wish Lanterns */}
      {releasedLanterns.map((wish) => (
        <AnimatedLantern key={wish.id} wish={wish} />
      ))}

      {/* Grand Finale Heart Fireworks */}
      {triggerFireworks && <HeartFireworks />}
    </group>
  );
}
