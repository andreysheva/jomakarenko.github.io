import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useAppStore } from "../lib/store";
import { LandmarkModel } from "./LandmarkModel";

export function Landmark({
  id,
  position,
  color,
  buildingType,
}: {
  id: string;
  position: [number, number, number];
  color: string;
  buildingType: "hotel" | "shop" | "sports" | "condo" | "bar" | "restaurant" | "generic";
}) {
  const [hovered, setHovered] = useState(false);
  const [showLockedMessage, setShowLockedMessage] = useState(false);
  const navigateTo = useAppStore((s) => s.navigateTo);
  const isWalking = useAppStore((s) => s.isWalking);
  const landmark = useAppStore((s) => s.landmarks.find((l) => l.id === id))!;

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (isWalking) return;
    if (landmark.locked) {
      setShowLockedMessage(true);
      setTimeout(() => setShowLockedMessage(false), 3500);
      return;
    }
    navigateTo(id);
  };

  return (
    <group position={position}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = landmark.locked ? "not-allowed" : "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={handleClick}
      >
        <LandmarkModel landmark={{ ...landmark, buildingType, color }} />
        <MarkerGlow color={color} hovered={hovered} landmarkId={id} isLocked={!!landmark.locked} />

        {/* Hover / Locked Badge */}
        {hovered && (
          <group position={[0, landmark.id === "lebua-hotel" || landmark.id === "park-origin-phrom-phong" ? 10.5 : 5.2, 0]}>
            <Html center distanceFactor={22} style={{ pointerEvents: "none" }}>
              <div className="px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-amber-400/60 text-amber-200 text-xs font-semibold whitespace-nowrap shadow-xl flex items-center gap-1.5">
                <span>{landmark.locked ? "🔒" : "📍"}</span>
                <span>{landmark.name}</span>
                {landmark.subtitle && (
                  <span className="text-[10px] text-amber-400/80 font-normal">
                    &middot; {landmark.subtitle}
                  </span>
                )}
              </div>
            </Html>
          </group>
        )}

        {/* Locked Click Notification Toast */}
        {showLockedMessage && (
          <group position={[0, 4.5, 0]}>
            <Html center distanceFactor={18} zIndexRange={[100, 0]}>
              <div className="w-56 p-3 rounded-2xl bg-purple-950/95 backdrop-blur-xl border border-purple-400/60 shadow-2xl text-purple-100 text-center animate-bounce-subtle">
                <div className="text-xl mb-1">🔒</div>
                <div className="text-xs font-bold text-purple-200 mb-1">
                  Locked Event!
                </div>
                <div className="text-[11px] text-purple-300/90 leading-tight">
                  This tennis date is locked! Visit all other memories first.
                </div>
              </div>
            </Html>
          </group>
        )}
      </group>
    </group>
  );
}

function MarkerGlow({
  color,
  hovered,
  landmarkId,
  isLocked,
}: {
  color: string;
  hovered: boolean;
  landmarkId: string;
  isLocked: boolean;
}) {
  const beaconRef = useRef<THREE.Mesh>(null);
  const isTall = landmarkId === "lebua-hotel" || landmarkId === "park-origin-phrom-phong";
  const beaconY = isTall ? 9.8 : 4.4;

  useFrame((state) => {
    if (beaconRef.current) {
      beaconRef.current.rotation.y += 0.02;
      beaconRef.current.position.y =
        beaconY + Math.sin(state.clock.elapsedTime * 2.5) * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={beaconRef} position={[0, beaconY, 0]} scale={hovered ? 1.35 : 1.0}>
        <octahedronGeometry args={[0.48, 0]} />
        <meshStandardMaterial
          color={isLocked ? "#9b5de5" : color}
          emissive={isLocked ? "#9b5de5" : color}
          emissiveIntensity={hovered ? 2.0 : 1.2}
          flatShading
        />
      </mesh>

      <mesh position={[0, beaconY / 2, 0]}>
        <cylinderGeometry args={[0.08, 0.35, beaconY, 12, 1, true]} />
        <meshBasicMaterial
          color={isLocked ? "#9b5de5" : color}
          transparent
          opacity={hovered ? 0.45 : 0.22}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 2.05, 32]} />
        <meshBasicMaterial
          color={isLocked ? "#9b5de5" : color}
          transparent
          opacity={hovered ? 0.8 : 0.45}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
