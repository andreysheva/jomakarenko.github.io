import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAppStore } from "../lib/store";
import { pointAt, tangentAt, landmarkT, shortestDelta } from "../lib/route";

// Shared mutable world state read by minimap and camera controller
export const coupleWorld = {
  t: 0,
  position: new THREE.Vector3(-46, 0.40, -22),
  walking: false,
};

const WALK_SPEED = 0.0012;

function dampAngle(current: number, target: number, lambda: number, dt: number): number {
  let diff = (target - current) % (Math.PI * 2);
  if (diff < -Math.PI) diff += Math.PI * 2;
  if (diff > Math.PI) diff -= Math.PI * 2;
  return current + diff * (1 - Math.exp(-lambda * dt));
}

// ─────────────────────────────────────────────────────────────────────────────
// MALE CHARACTER
// Height ~1.94 units.  Light brown hair, white T-shirt, khaki shorts, sneakers.
// ─────────────────────────────────────────────────────────────────────────────
function MaleCharacter({
  legLRef,
  legRRef,
  armLRef,
}: {
  legLRef: React.RefObject<THREE.Group | null>;
  legRRef: React.RefObject<THREE.Group | null>;
  armLRef: React.RefObject<THREE.Group | null>;
}) {
  // Skin, hair, cloth colours
  const skin     = "#e8c49a";   // warm medium skin tone
  const hair     = "#8b5e3c";   // light brown
  const shirt    = "#f0f0f0";   // white tee
  const shorts   = "#b8a06a";   // khaki
  const shoe     = "#3d2e1e";   // dark brown shoe
  const soleCol  = "#f0ede8";   // light rubber sole

  return (
    <group position={[-0.34, 0, 0]}>
      {/* ── Sneakers ── */}
      <mesh position={[-0.10, 0.065, 0.05]} castShadow>
        <boxGeometry args={[0.12, 0.09, 0.24]} />
        <meshStandardMaterial color={shoe} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[-0.10, 0.04, 0.04]}>
        <boxGeometry args={[0.125, 0.04, 0.26]} />
        <meshStandardMaterial color={soleCol} roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0.10, 0.065, 0.05]} castShadow>
        <boxGeometry args={[0.12, 0.09, 0.24]} />
        <meshStandardMaterial color={shoe} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0.10, 0.04, 0.04]}>
        <boxGeometry args={[0.125, 0.04, 0.26]} />
        <meshStandardMaterial color={soleCol} roughness={0.7} flatShading />
      </mesh>

      {/* ── Left Leg (pivots at hip) ── */}
      <group ref={legLRef} position={[-0.10, 0.55, 0]}>
        {/* Shorts portion */}
        <mesh position={[0, -0.14, 0]} castShadow>
          <boxGeometry args={[0.14, 0.28, 0.15]} />
          <meshStandardMaterial color={shorts} roughness={0.82} flatShading />
        </mesh>
        {/* Bare lower leg */}
        <mesh position={[0, -0.40, 0]} castShadow>
          <boxGeometry args={[0.12, 0.26, 0.13]} />
          <meshStandardMaterial color={skin} roughness={0.72} flatShading />
        </mesh>
      </group>

      {/* ── Right Leg ── */}
      <group ref={legRRef} position={[0.10, 0.55, 0]}>
        <mesh position={[0, -0.14, 0]} castShadow>
          <boxGeometry args={[0.14, 0.28, 0.15]} />
          <meshStandardMaterial color={shorts} roughness={0.82} flatShading />
        </mesh>
        <mesh position={[0, -0.40, 0]} castShadow>
          <boxGeometry args={[0.12, 0.26, 0.13]} />
          <meshStandardMaterial color={skin} roughness={0.72} flatShading />
        </mesh>
      </group>

      {/* ── Torso / White T-shirt ── */}
      <mesh position={[0, 0.90, 0]} castShadow>
        <boxGeometry args={[0.44, 0.60, 0.27]} />
        <meshStandardMaterial color={shirt} roughness={0.75} flatShading />
      </mesh>
      {/* T-shirt collar */}
      <mesh position={[0, 1.19, 0.09]}>
        <boxGeometry args={[0.18, 0.09, 0.05]} />
        <meshStandardMaterial color="#d8d8d8" roughness={0.7} flatShading />
      </mesh>

      {/* ── Neck ── */}
      <mesh position={[0, 1.28, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.08, 0.12, 8]} />
        <meshStandardMaterial color={skin} roughness={0.65} flatShading />
      </mesh>

      {/* ── Head ── */}
      <mesh position={[0, 1.52, 0]} castShadow>
        <sphereGeometry args={[0.21, 14, 14]} />
        <meshStandardMaterial color={skin} roughness={0.6} flatShading />
      </mesh>
      {/* Jaw / chin squaring */}
      <mesh position={[0, 1.40, 0.06]}>
        <boxGeometry args={[0.28, 0.16, 0.22]} />
        <meshStandardMaterial color={skin} roughness={0.6} flatShading />
      </mesh>

      {/* ── Light Brown Hair (close-cropped dome) ── */}
      <mesh position={[0, 1.63, 0]}>
        <sphereGeometry args={[0.215, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshStandardMaterial color={hair} roughness={0.92} flatShading />
      </mesh>
      {/* Side hair coverage */}
      <mesh position={[0, 1.54, 0]}>
        <sphereGeometry args={[0.218, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
        <meshStandardMaterial color={hair} roughness={0.92} flatShading />
      </mesh>

      {/* ── Eyes (tiny dark dots) ── */}
      <mesh position={[-0.07, 1.54, 0.19]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      <mesh position={[0.07, 1.54, 0.19]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>

      {/* ── Outer Left Arm (free swing) ── */}
      <group ref={armLRef} position={[-0.28, 1.08, 0]}>
        <mesh position={[0, -0.20, 0]} castShadow>
          <boxGeometry args={[0.11, 0.38, 0.12]} />
          <meshStandardMaterial color={shirt} roughness={0.75} flatShading />
        </mesh>
        {/* Bare forearm */}
        <mesh position={[0, -0.44, 0]} castShadow>
          <boxGeometry args={[0.10, 0.22, 0.11]} />
          <meshStandardMaterial color={skin} roughness={0.7} flatShading />
        </mesh>
      </group>

      {/* ── Inner Right Arm (holding hand, angled inward) ── */}
      <group position={[0.26, 1.02, 0]} rotation={[0, 0, -0.32]}>
        <mesh position={[0, -0.20, 0]} castShadow>
          <boxGeometry args={[0.10, 0.38, 0.11]} />
          <meshStandardMaterial color={shirt} roughness={0.75} flatShading />
        </mesh>
        <mesh position={[0, -0.44, 0]} castShadow>
          <boxGeometry args={[0.10, 0.20, 0.10]} />
          <meshStandardMaterial color={skin} roughness={0.7} flatShading />
        </mesh>
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEMALE CHARACTER
// Height ~1.55 units (scale ≈ 0.80 relative to man).  Black hair (long),
// black T-shirt, black office trousers, dark flats.
// ─────────────────────────────────────────────────────────────────────────────
function FemaleCharacter({
  legLRef,
  legRRef,
  armRRef,
}: {
  legLRef: React.RefObject<THREE.Group | null>;
  legRRef: React.RefObject<THREE.Group | null>;
  armRRef: React.RefObject<THREE.Group | null>;
}) {
  const skin      = "#c8956a";   // slightly warmer skin
  const hair      = "#0d0d0d";   // jet black
  const shirt     = "#1a1a1a";   // black tee
  const trousers  = "#22222e";   // black office trousers
  const flat      = "#222222";   // black flats
  const flatSole  = "#3a3a3a";   // dark sole

  // Female proportions — overall scale applied via <group scale>
  const S = 0.82; // 0.82 × man height ≈ 1.59 units (close to 1.55 m)

  return (
    <group position={[0.34, 0, 0]} scale={[S, S, S]}>
      {/* ── Ballet Flats ── */}
      <mesh position={[-0.09, 0.055, 0.04]} castShadow>
        <boxGeometry args={[0.11, 0.07, 0.22]} />
        <meshStandardMaterial color={flat} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.09, 0.03, 0.04]}>
        <boxGeometry args={[0.115, 0.035, 0.23]} />
        <meshStandardMaterial color={flatSole} roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0.09, 0.055, 0.04]} castShadow>
        <boxGeometry args={[0.11, 0.07, 0.22]} />
        <meshStandardMaterial color={flat} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.09, 0.03, 0.04]}>
        <boxGeometry args={[0.115, 0.035, 0.23]} />
        <meshStandardMaterial color={flatSole} roughness={0.8} flatShading />
      </mesh>

      {/* ── Left Leg — office trousers all the way down ── */}
      <group ref={legLRef} position={[-0.09, 0.50, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.12, 0.50, 0.13]} />
          <meshStandardMaterial color={trousers} roughness={0.82} flatShading />
        </mesh>
      </group>

      {/* ── Right Leg ── */}
      <group ref={legRRef} position={[0.09, 0.50, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.12, 0.50, 0.13]} />
          <meshStandardMaterial color={trousers} roughness={0.82} flatShading />
        </mesh>
      </group>

      {/* ── Waistband detail ── */}
      <mesh position={[0, 0.53, 0]}>
        <boxGeometry args={[0.38, 0.06, 0.23]} />
        <meshStandardMaterial color="#111111" roughness={0.7} flatShading />
      </mesh>

      {/* ── Torso / Black T-shirt ── */}
      <mesh position={[0, 0.84, 0]} castShadow>
        <boxGeometry args={[0.40, 0.58, 0.24]} />
        <meshStandardMaterial color={shirt} roughness={0.78} flatShading />
      </mesh>
      {/* Subtle shirt collar */}
      <mesh position={[0, 1.12, 0.08]}>
        <boxGeometry args={[0.15, 0.07, 0.05]} />
        <meshStandardMaterial color="#111111" roughness={0.75} />
      </mesh>

      {/* ── Neck ── */}
      <mesh position={[0, 1.20, 0]} castShadow>
        <cylinderGeometry args={[0.066, 0.072, 0.11, 8]} />
        <meshStandardMaterial color={skin} roughness={0.65} flatShading />
      </mesh>

      {/* ── Head (slightly smaller / rounder than male) ── */}
      <mesh position={[0, 1.41, 0]} castShadow>
        <sphereGeometry args={[0.195, 14, 14]} />
        <meshStandardMaterial color={skin} roughness={0.6} flatShading />
      </mesh>

      {/* ── Long Black Hair ── */}
      {/* Top dome */}
      <mesh position={[0, 1.52, 0]}>
        <sphereGeometry args={[0.205, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={hair} roughness={0.85} flatShading />
      </mesh>
      {/* Side panels down to shoulders */}
      <mesh position={[-0.14, 1.32, -0.02]} rotation={[0.05, 0, 0.08]}>
        <boxGeometry args={[0.10, 0.38, 0.15]} />
        <meshStandardMaterial color={hair} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0.14, 1.32, -0.02]} rotation={[0.05, 0, -0.08]}>
        <boxGeometry args={[0.10, 0.38, 0.15]} />
        <meshStandardMaterial color={hair} roughness={0.85} flatShading />
      </mesh>
      {/* Back curtain */}
      <mesh position={[0, 1.24, -0.14]} rotation={[-0.12, 0, 0]}>
        <boxGeometry args={[0.30, 0.44, 0.10]} />
        <meshStandardMaterial color={hair} roughness={0.85} flatShading />
      </mesh>

      {/* ── Eyes ── */}
      <mesh position={[-0.065, 1.43, 0.177]}>
        <sphereGeometry args={[0.022, 6, 6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      <mesh position={[0.065, 1.43, 0.177]}>
        <sphereGeometry args={[0.022, 6, 6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>

      {/* ── Inner Left Arm (holding hand, angled toward male) ── */}
      <group position={[-0.22, 0.96, 0]} rotation={[0, 0, 0.32]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.09, 0.36, 0.10]} />
          <meshStandardMaterial color={shirt} roughness={0.78} flatShading />
        </mesh>
        <mesh position={[0, -0.38, 0]} castShadow>
          <boxGeometry args={[0.09, 0.18, 0.09]} />
          <meshStandardMaterial color={skin} roughness={0.7} flatShading />
        </mesh>
      </group>

      {/* ── Outer Right Arm (free swing) ── */}
      <group ref={armRRef} position={[0.24, 1.00, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.09, 0.36, 0.10]} />
          <meshStandardMaterial color={shirt} roughness={0.78} flatShading />
        </mesh>
        <mesh position={[0, -0.38, 0]} castShadow>
          <boxGeometry args={[0.09, 0.18, 0.09]} />
          <meshStandardMaterial color={skin} roughness={0.7} flatShading />
        </mesh>
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Couple — both characters hand-in-hand with walk animation
// ─────────────────────────────────────────────────────────────────────────────
function HandInHandCouple({
  walkFlag,
  swingRef,
}: {
  walkFlag: boolean;
  swingRef: React.MutableRefObject<number>;
}) {
  const rootRef   = useRef<THREE.Group>(null);
  const maleLegL  = useRef<THREE.Group>(null);
  const maleLegR  = useRef<THREE.Group>(null);
  const maleArmL  = useRef<THREE.Group>(null);
  const femLegL   = useRef<THREE.Group>(null);
  const femLegR   = useRef<THREE.Group>(null);
  const femArmR   = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!rootRef.current) return;
    const swing = swingRef.current;

    if (!walkFlag) {
      // Gentle idle breathing
      const idle = state.clock.elapsedTime * 1.5;
      rootRef.current.position.y = Math.sin(idle) * 0.012;
      [maleLegL, maleLegR, femLegL, femLegR].forEach(r => { if (r.current) r.current.rotation.x = 0; });
      if (maleArmL.current)  maleArmL.current.rotation.x  =  Math.sin(idle) * 0.04;
      if (femArmR.current)   femArmR.current.rotation.x   = -Math.sin(idle) * 0.04;
      return;
    }

    // Walking: torso bob
    rootRef.current.position.y = Math.abs(Math.sin(swing * 2)) * 0.055;
    const stride = Math.sin(swing) * 0.50;

    if (maleLegL.current)  maleLegL.current.rotation.x  =  stride;
    if (maleLegR.current)  maleLegR.current.rotation.x  = -stride;
    if (femLegL.current)   femLegL.current.rotation.x   = -stride;       // offset phase
    if (femLegR.current)   femLegR.current.rotation.x   =  stride;
    if (maleArmL.current)  maleArmL.current.rotation.x  = -stride * 0.55;
    if (femArmR.current)   femArmR.current.rotation.x   =  stride * 0.55;
  });

  return (
    <group ref={rootRef}>
      <MaleCharacter legLRef={maleLegL} legRRef={maleLegR} armLRef={maleArmL} />
      <FemaleCharacter legLRef={femLegL} legRRef={femLegR} armRRef={femArmR} />

      {/* Held-hand join sphere */}
      <mesh position={[0, 0.68, 0]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshStandardMaterial color="#d4a878" roughness={0.6} />
      </mesh>

      {/* Soft drop shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} scale={[1.15, 0.65, 1]}>
        <circleGeometry args={[0.6, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export — handles movement along route curve
// ─────────────────────────────────────────────────────────────────────────────
export function Couple() {
  const groupRef       = useRef<THREE.Group>(null);
  const swingRef       = useRef(0);
  const [walking, setWalking] = useState(false);
  const prevWalkRef    = useRef(false);
  const tRef           = useRef(0);
  const currentRotY    = useRef(0);

  const coupleTarget = useAppStore((s) => s.coupleTarget);

  useFrame((_state, delta) => {
    const dt    = Math.min(delta, 0.1);
    const speed = WALK_SPEED * dt * 60;

    let t = tRef.current;
    let isWalking = false;

    const targetId = coupleTarget;
    const targetT  = targetId !== null ? landmarkT[targetId] : null;

    if (targetT !== null) {
      const d = shortestDelta(t, targetT);
      if (Math.abs(d) > 0.002) {
        t = t + Math.sign(d) * speed;
        const remaining = shortestDelta(t, targetT);
        if (Math.sign(remaining) !== Math.sign(d)) t = targetT;
        isWalking = true;
      } else {
        t = targetT;
        useAppStore.getState().arriveAt(targetId!);
      }
    }

    tRef.current = ((t % 1) + 1) % 1;
    swingRef.current += isWalking ? dt * 7.5 : 0;

    if (prevWalkRef.current !== isWalking) {
      prevWalkRef.current = isWalking;
      setWalking(isWalking);
    }

    const pos = pointAt(t);
    pos.y = 0.40;

    const tangent = tangentAt(t);
    tangent.y = 0;
    tangent.normalize();
    const targetHeading = Math.atan2(tangent.x, tangent.z);

    currentRotY.current = dampAngle(currentRotY.current, targetHeading, 6.0, dt);

    if (groupRef.current) {
      groupRef.current.position.copy(pos);
      groupRef.current.rotation.y = currentRotY.current;
    }

    coupleWorld.t = t;
    coupleWorld.position.copy(pos);
    coupleWorld.walking = isWalking;
  });

  return (
    <group ref={groupRef} position={[-46, 0.40, -22]}>
      <HandInHandCouple walkFlag={walking} swingRef={swingRef} />
    </group>
  );
}
