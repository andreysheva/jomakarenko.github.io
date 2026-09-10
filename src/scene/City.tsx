import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import {
  routeCurve,
  pointAt,
  tangentAt,
  distanceToRoad,
  landmarkT,
} from "../lib/route";
import { LANDMARKS } from "../data/landmarks";

// ---------------------------------------------------------------
// Deterministic hash helper
// ---------------------------------------------------------------
function hash(n: number): number {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

// ---------------------------------------------------------------
// Terrain — nearly FLAT so roads always show through
// ---------------------------------------------------------------
export function Island() {
  const geometry = useMemo(() => {
    const radius = 112;
    const seg = 80;
    const geo = new THREE.PlaneGeometry(radius * 2, radius * 2, seg, seg);
    const pos = geo.getAttribute("position");
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      let h = 0;
      if (dist < radius) {
        const edge = 1 - dist / radius;
        // Extremely subtle undulation — max 0.10 height, well below road at 0.45
        h  = Math.sin(x * 0.04) * Math.cos(y * 0.035) * 0.05;
        h += Math.cos(x * 0.03 - y * 0.03) * 0.05;
        h *= edge * edge;
      }
      pos.setZ(i, h);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  const flowers = useMemo(() => {
    const out: { pos: [number, number, number]; color: string; s: number }[] = [];
    const colors = ["#ff6b81", "#ffb703", "#c77dff", "#ff9f43", "#54a0ff"];
    for (let i = 0; i < 160; i++) {
      const ang = hash(i * 19) * Math.PI * 2;
      const r = 12 + hash(i * 37) * 82;
      const x = Math.cos(ang) * r;
      const z = Math.sin(ang) * r;
      if (distanceToRoad(x, z) < 14) continue;
      out.push({
        pos: [x, 0.3, z],
        color: colors[Math.floor(hash(i * 7) * colors.length)],
        s: 0.18 + hash(i * 13) * 0.22,
      });
    }
    return out;
  }, []);

  return (
    <group>
      {/* Grass */}
      <mesh geometry={geometry} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#3d7a55" roughness={0.85} flatShading />
      </mesh>
      {/* Sand ring slightly below grass */}
      <mesh geometry={geometry} position={[0, -0.06, 0]}>
        <meshStandardMaterial
          color="#c8b07a"
          roughness={0.92}
          flatShading
          transparent
          opacity={0.82}
        />
      </mesh>
      {/* Flower patches */}
      {flowers.map((f, i) => (
        <mesh key={i} position={f.pos} scale={f.s}>
          <sphereGeometry args={[0.7, 5, 5]} />
          <meshStandardMaterial
            color={f.color}
            emissive={f.color}
            emissiveIntensity={0.2}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------
// Ocean
// ---------------------------------------------------------------
export function Ocean() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current)
      ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.2) * 0.004;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]}>
      <planeGeometry args={[560, 560, 1, 1]} />
      <meshStandardMaterial
        color="#1a4e7a"
        roughness={0.08}
        metalness={0.35}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------
// ROAD SYSTEM — correct ribbon geometry with N+1 cross-sections
// All vertex normals explicitly point UP so they're always visible.
// ---------------------------------------------------------------

/** Build a flat ribbon along routeCurve at a fixed world Y. */
function buildRibbon(
  halfWidth: number,
  yLevel: number,
  segments = 400
): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  // N+1 cross-sections → correct closed-loop quad strip
  for (let i = 0; i <= segments; i++) {
    // Arc-length parameterized → perfectly uniform spacing
    const t = (i % segments) / segments;
    const p = routeCurve.getPointAt(t);
    const tan = routeCurve.getTangentAt(t).normalize();
    // Normal in XZ plane, perpendicular to tangent
    const nx = -tan.z;
    const nz = tan.x;

    // Left vertex
    positions.push(p.x + nx * halfWidth, yLevel, p.z + nz * halfWidth);
    normals.push(0, 1, 0);
    // Right vertex
    positions.push(p.x - nx * halfWidth, yLevel, p.z - nz * halfWidth);
    normals.push(0, 1, 0);
  }

  // Quads: each segment i uses cross-sections i and i+1
  for (let i = 0; i < segments; i++) {
    const a = i * 2;       // left  @ i
    const b = i * 2 + 1;   // right @ i
    const c = i * 2 + 2;   // left  @ i+1
    const d = i * 2 + 3;   // right @ i+1
    // CCW winding so normal faces +Y
    indices.push(a, c, b);
    indices.push(b, c, d);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setIndex(indices);
  return geo;
}

export function Road() {
  // Three distinct visual layers, each a clean flat ribbon
  const asphaltGeo   = useMemo(() => buildRibbon(5.5,  0.42, 400), []);
  const sidewalkGeo  = useMemo(() => buildRibbon(7.2,  0.38, 400), []);
  const centerGeo    = useMemo(() => buildRibbon(0.35, 0.46, 400), []);
  const edgeLeftGeo  = useMemo(() => buildRibbon(0.25, 0.45, 400), []);

  const crosswalkData = useMemo(() =>
    LANDMARKS.map((l) => {
      const t = landmarkT[l.id];
      const p = pointAt(t);
      const tn = tangentAt(t);
      return { p, heading: Math.atan2(tn.x, tn.z) };
    }), []);

  return (
    <group>
      {/* Wide beige/tan sidewalk border */}
      <mesh geometry={sidewalkGeo} receiveShadow>
        <meshStandardMaterial color="#b5a882" roughness={0.88} />
      </mesh>

      {/* Dark asphalt road surface */}
      <mesh geometry={asphaltGeo} receiveShadow>
        <meshStandardMaterial color="#1c2030" roughness={0.92} />
      </mesh>

      {/* Bright yellow center stripe */}
      <mesh geometry={centerGeo}>
        <meshStandardMaterial
          color="#f6d24a"
          emissive="#f6d24a"
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* White edge lines (reuse ribbon at ±5.2) */}
      {[5.1, -5.1].map((offset, k) => {
        // Build a thin ribbon at each edge offset
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const geo = useMemo(() => buildRibbon(0.22, 0.45, 400), []);
        return (
          <mesh key={k} geometry={geo}>
            <meshStandardMaterial
              color="#e8e8e8"
              emissive="#ffffff"
              emissiveIntensity={0.4}
              roughness={0.3}
            />
          </mesh>
        );
      })}

      {/* Zebra crosswalks at each landmark */}
      {crosswalkData.map((cw, i) => (
        <group
          key={i}
          position={[cw.p.x, 0.48, cw.p.z]}
          rotation={[0, cw.heading, 0]}
        >
          {[-2.7, -1.8, -0.9, 0, 0.9, 1.8, 2.7].map((off, j) => (
            <mesh
              key={j}
              position={[off, 0, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[0.55, 5.0]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.35}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------
// Building archetypes — 8 distinct visual styles
// ---------------------------------------------------------------
interface BldgProps {
  w: number;
  d: number;
  h: number;
  color: string;
  roof: string;
  variant: number; // 0-7
}

function BuildingMesh({ w, d, h, color, roof, variant }: BldgProps) {
  const v = variant % 8;

  switch (v) {
    /* ── 0: Simple Thai Shophouse ── */
    case 0:
      return (
        <group>
          <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color={color} roughness={0.82} flatShading />
          </mesh>
          {/* Overhang awning */}
          <mesh position={[0, h * 0.65, d / 2 + 0.3]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[w * 1.05, 0.08, 0.9]} />
            <meshStandardMaterial color="#d4533a" flatShading />
          </mesh>
          {/* Flat roof slab */}
          <mesh position={[0, h + 0.07, 0]}>
            <boxGeometry args={[w * 1.06, 0.14, d * 1.06]} />
            <meshStandardMaterial color={roof} roughness={0.9} flatShading />
          </mesh>
          {/* Window light */}
          <mesh position={[0, h * 0.4, d / 2 + 0.01]}>
            <planeGeometry args={[w * 0.55, h * 0.35]} />
            <meshStandardMaterial color="#ffe590" emissive="#ffd166" emissiveIntensity={0.8} transparent opacity={0.9} />
          </mesh>
        </group>
      );

    /* ── 1: Tall Apartment Tower ── */
    case 1: {
      const floors = Math.max(3, Math.round(h / 1.2));
      return (
        <group>
          <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w * 0.75, h, d * 0.75]} />
            <meshStandardMaterial color={color} roughness={0.75} flatShading />
          </mesh>
          {/* Balconies every 2 floors */}
          {Array.from({ length: Math.floor(floors / 2) }, (_, fi) => (
            <mesh key={fi} position={[0, 0.8 + fi * 2.2, d * 0.38 + 0.18]}>
              <boxGeometry args={[w * 0.8, 0.08, 0.45]} />
              <meshStandardMaterial color="#c0b89a" flatShading />
            </mesh>
          ))}
          {/* Roof antenna */}
          <mesh position={[0, h + 0.6, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.2, 6]} />
            <meshStandardMaterial color="#888" />
          </mesh>
        </group>
      );
    }

    /* ── 2: Modern Glass Tower ── */
    case 2:
      return (
        <group>
          <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w * 0.8, h, d * 0.8]} />
            <meshStandardMaterial
              color="#2a3d5c"
              roughness={0.05}
              metalness={0.75}
              flatShading
            />
          </mesh>
          {/* Glass window strips */}
          {[0.25, 0.5, 0.75].map((frac, fi) => (
            <mesh key={fi} position={[0, h * frac, d * 0.41]}>
              <planeGeometry args={[w * 0.7, h * 0.18]} />
              <meshStandardMaterial
                color="#85d4e8"
                emissive="#55b8d0"
                emissiveIntensity={0.55}
                transparent
                opacity={0.85}
              />
            </mesh>
          ))}
          {/* Roof cap */}
          <mesh position={[0, h + 0.15, 0]}>
            <boxGeometry args={[w * 0.85, 0.3, d * 0.85]} />
            <meshStandardMaterial color="#1a2840" metalness={0.6} />
          </mesh>
        </group>
      );

    /* ── 3: Low Warehouse / Market Hall ── */
    case 3:
      return (
        <group>
          <mesh position={[0, h * 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[w * 1.4, h * 0.8, d * 1.4]} />
            <meshStandardMaterial color={color} roughness={0.88} flatShading />
          </mesh>
          {/* Curved barrel roof */}
          <mesh position={[0, h * 0.8, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[d * 0.72, d * 0.72, w * 1.42, 8, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color={roof} roughness={0.85} flatShading />
          </mesh>
          {/* AC unit blobs on roof */}
          {[-w * 0.3, w * 0.3].map((ox, oi) => (
            <mesh key={oi} position={[ox, h * 0.8 + 0.3, 0]}>
              <boxGeometry args={[0.5, 0.35, 0.4]} />
              <meshStandardMaterial color="#999" flatShading />
            </mesh>
          ))}
        </group>
      );

    /* ── 4: Thai Stilted House ── */
    case 4:
      return (
        <group>
          {/* Stilts */}
          {[[-w * 0.35, -d * 0.35], [w * 0.35, -d * 0.35], [-w * 0.35, d * 0.35], [w * 0.35, d * 0.35]].map(([sx, sz], si) => (
            <mesh key={si} position={[sx, 0.4, sz]}>
              <cylinderGeometry args={[0.07, 0.10, 0.8, 6]} />
              <meshStandardMaterial color="#5c3820" roughness={0.9} />
            </mesh>
          ))}
          {/* House body raised on stilts */}
          <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h * 0.7, d]} />
            <meshStandardMaterial color="#8b5e3c" roughness={0.85} flatShading />
          </mesh>
          {/* Peaked Thai roof */}
          <mesh position={[0, 1.0 + h * 0.7 * 0.5 + 0.35, 0]} castShadow>
            <coneGeometry args={[Math.max(w, d) * 0.8, 0.9, 4]} />
            <meshStandardMaterial color="#7c3e1a" roughness={0.75} flatShading />
          </mesh>
          <pointLight position={[0, 0.9, d / 2 + 0.1]} color="#ffbb70" intensity={0.9} distance={5} />
        </group>
      );

    /* ── 5: Corner Store with Canopy ── */
    case 5:
      return (
        <group>
          <mesh position={[0, h * 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[w * 1.2, h * 0.7, d * 1.2]} />
            <meshStandardMaterial color={color} roughness={0.82} flatShading />
          </mesh>
          {/* Striped canopy */}
          <mesh position={[0, h * 0.65, d * 0.65]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[w * 1.1, 0.08, 1.1]} />
            <meshStandardMaterial color="#e63946" emissive="#c1121f" emissiveIntensity={0.15} flatShading />
          </mesh>
          {/* Sign board */}
          <mesh position={[0, h * 0.58, d * 0.62]}>
            <boxGeometry args={[w * 0.7, 0.3, 0.08]} />
            <meshStandardMaterial color="#f4d35e" emissive="#f4a261" emissiveIntensity={0.5} />
          </mesh>
          {/* Flat roof */}
          <mesh position={[0, h * 0.7 + 0.08, 0]}>
            <boxGeometry args={[w * 1.22, 0.14, d * 1.22]} />
            <meshStandardMaterial color={roof} roughness={0.9} flatShading />
          </mesh>
          <pointLight position={[0, h * 0.62, d * 0.7]} color="#ffe0a0" intensity={0.8} distance={4} />
        </group>
      );

    /* ── 6: Golden Pagoda ── */
    case 6:
      return (
        <group>
          {/* Base platform */}
          <mesh position={[0, 0.12, 0]} receiveShadow>
            <boxGeometry args={[w * 1.3, 0.24, d * 1.3]} />
            <meshStandardMaterial color="#c8a84b" roughness={0.7} flatShading />
          </mesh>
          {/* Ground floor */}
          <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 1.1, d]} />
            <meshStandardMaterial color="#d4a843" roughness={0.6} flatShading />
          </mesh>
          {/* Tier 1 roof */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[w * 1.45, 0.14, d * 1.45]} />
            <meshStandardMaterial color="#9b1a0a" roughness={0.5} flatShading />
          </mesh>
          {/* Mid floor */}
          <mesh position={[0, 2.15, 0]} castShadow receiveShadow>
            <boxGeometry args={[w * 0.68, 0.85, d * 0.68]} />
            <meshStandardMaterial color="#d4a843" roughness={0.6} flatShading />
          </mesh>
          {/* Tier 2 roof */}
          <mesh position={[0, 2.65, 0]} castShadow>
            <boxGeometry args={[w * 1.05, 0.12, d * 1.05]} />
            <meshStandardMaterial color="#9b1a0a" roughness={0.5} flatShading />
          </mesh>
          {/* Spire */}
          <mesh position={[0, 3.4, 0]} castShadow>
            <coneGeometry args={[0.22, 1.4, 8]} />
            <meshStandardMaterial color="#f5c518" emissive="#e8a000" emissiveIntensity={0.5} flatShading />
          </mesh>
          <pointLight position={[0, 2.0, 0]} color="#ffcc44" intensity={1.6} distance={8} />
        </group>
      );

    /* ── 7: Block Hotel / Office with Grid Windows ── */
    default:
      return (
        <group>
          <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color={color} roughness={0.78} flatShading />
          </mesh>
          {/* Grid of lit windows */}
          {Array.from({ length: Math.min(4, Math.floor(h / 1.2)) }, (_, row) =>
            [-0.35, 0, 0.35].map((col, ci) => (
              <mesh
                key={`${row}-${ci}`}
                position={[col * w, 0.6 + row * 1.1, d / 2 + 0.01]}
              >
                <planeGeometry args={[w * 0.22, 0.45]} />
                <meshStandardMaterial
                  color="#ffe8a3"
                  emissive="#ffd97d"
                  emissiveIntensity={hash(row * 3 + ci) > 0.3 ? 0.9 : 0.1}
                  transparent
                  opacity={0.9}
                />
              </mesh>
            ))
          )}
          {/* Roof lip */}
          <mesh position={[0, h + 0.1, 0]}>
            <boxGeometry args={[w * 1.05, 0.2, d * 1.05]} />
            <meshStandardMaterial color={roof} roughness={0.9} flatShading />
          </mesh>
        </group>
      );
  }
}

// ---------------------------------------------------------------
// Interactive Neighborhood Spot type
// ---------------------------------------------------------------
export interface SpotInfo {
  id: string;
  title: string;
  desc: string;
  icon: string;
  pos: [number, number, number];
}

interface BlockData {
  id: string;
  variant: number;
  pos: [number, number];
  w: number;
  d: number;
  h: number;
  color: string;
  roof: string;
  title?: string;
  desc?: string;
  icon?: string;
  isSpecial: boolean;
}

const SPECIAL_SPOTS = [
  { title: "Silom Night Market", desc: "Festive canvas stalls, glowing string lights, and mango sticky rice aromas!", icon: "🏮" },
  { title: "Traditional Teak Villa", desc: "Siamese wooden villa nestled under palm trees with warm glowing lanterns.", icon: "🏡" },
  { title: "Golden Thai Pagoda", desc: "A gleaming three-tiered golden pagoda rising above the canopy, adorned with wind chimes.", icon: "🛕" },
  { title: "Chatuchak Tuk-Tuk Cafe", desc: "Iconic blue Tuk-Tuk parked beside an outdoor café serving iced Thai tea!", icon: "🛺" },
  { title: "Charoenkrung Shophouse", desc: "Vintage pastel boutique with wrought-iron balconies and potted orchids.", icon: "🎨" },
  { title: "Riverside Noodle Cart", desc: "Cozy street food stall serving steamy noodle bowls with a river sunset view.", icon: "🍜" },
];

const PALETTE = ["#e5d3be", "#d9c0a6", "#c8cfe0", "#ebd7c3", "#b8d4c4", "#f4f1de", "#e07a5f", "#c4d0e8", "#d6bda1", "#e8c4aa"];
const ROOFS   = ["#b37b59", "#9c6d4e", "#4a6fa5", "#7c4a27", "#5a7a6e", "#8b3a2e", "#3d5a80", "#6b4226"];

function generateBlocks(): BlockData[] {
  const blocks: BlockData[] = [];
  const roadExcl = 14; // keep clear of road + sidewalk
  let specIdx = 0;

  for (let attempt = 0; attempt < 10000 && blocks.length < 24; attempt++) {
    const ang = hash(attempt * 3 + 7) * Math.PI * 2;
    const r   = 16 + hash(attempt * 5 + 11) * 58;
    const x   = Math.cos(ang) * r;
    const z   = Math.sin(ang) * r;

    if (distanceToRoad(x, z) < roadExcl) continue;
    if (Math.sqrt(x * x + z * z) > 105) continue;

    let tooClose = false;
    for (const b of blocks) {
      const dx = b.pos[0] - x, dz = b.pos[1] - z;
      if (dx * dx + dz * dz < 225) { tooClose = true; break; }
    }
    if (tooClose) continue;

    const isSpecial = specIdx < SPECIAL_SPOTS.length && (blocks.length < 6 || attempt % 3 === 0);
    const spec = isSpecial ? SPECIAL_SPOTS[specIdx++] : undefined;

    // Force special spots to their natural variant
    const naturalVariant = isSpecial
      ? [1, 4, 6, 5, 0, 3][specIdx - 1] ?? 0
      : Math.floor(hash(attempt * 11 + 3) * 8);

    blocks.push({
      id: `b${blocks.length}`,
      variant: naturalVariant,
      pos: [x, z],
      w: 2.0 + hash(attempt + 3) * 2.2,
      d: 1.8 + hash(attempt + 9) * 2.0,
      h: 2.0 + hash(attempt + 13) * 4.5,
      color: PALETTE[Math.floor(hash(attempt + 5) * PALETTE.length)],
      roof: ROOFS[Math.floor(hash(attempt + 17) * ROOFS.length)],
      ...(spec ? { title: spec.title, desc: spec.desc, icon: spec.icon } : {}),
      isSpecial: !!spec,
    });
  }
  return blocks;
}

function InteractiveBuilding({
  block,
  onSelect,
}: {
  block: BlockData;
  onSelect: (info: SpotInfo) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const rotY = useMemo(() => hash(block.pos[0] * 17 + block.pos[1]) * Math.PI * 2, [block]);

  return (
    <group
      position={[block.pos[0], 0, block.pos[1]]}
      rotation={[0, rotY, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (block.isSpecial) { setHovered(true); document.body.style.cursor = "pointer"; }
      }}
      onPointerOut={() => {
        if (block.isSpecial) { setHovered(false); document.body.style.cursor = "auto"; }
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (block.isSpecial && block.title && block.desc && block.icon) {
          onSelect({ id: block.id, title: block.title, desc: block.desc, icon: block.icon, pos: [block.pos[0], 3.5, block.pos[1]] });
        }
      }}
    >
      {/* Paved plaza pad */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[block.w + 1.6, 0.06, block.d + 1.6]} />
        <meshStandardMaterial color="#2e3240" roughness={0.82} flatShading />
      </mesh>
      {/* Curb border */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[block.w + 1.9, 0.04, block.d + 1.9]} />
        <meshStandardMaterial color="#b8ad94" roughness={0.85} flatShading />
      </mesh>

      <BuildingMesh
        w={block.w}
        d={block.d}
        h={block.h}
        color={block.color}
        roof={block.roof}
        variant={block.variant}
      />

      {block.isSpecial && hovered && (
        <group position={[0, block.h + 1.5, 0]}>
          <Html center distanceFactor={18} style={{ pointerEvents: "none" }}>
            <div style={{
              padding: "5px 12px",
              borderRadius: "999px",
              background: "rgba(10,12,25,0.88)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(246,210,74,0.5)",
              color: "#f6d24a",
              fontSize: "11px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <span style={{ fontSize: "14px" }}>{block.icon}</span>
              <span>{block.title}</span>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

export function CityBlocks() {
  const blocks = useMemo(generateBlocks, []);
  const [selected, setSelected] = useState<SpotInfo | null>(null);

  return (
    <group>
      {blocks.map((b) => (
        <InteractiveBuilding key={b.id} block={b} onSelect={setSelected} />
      ))}
      {selected && (
        <Html position={selected.pos} center distanceFactor={14} zIndexRange={[100, 0]}>
          <div style={{
            width: 240,
            padding: "16px",
            borderRadius: "16px",
            background: "rgba(8,10,22,0.92)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(246,210,74,0.4)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            color: "#f0eee8",
            position: "relative",
          }}>
            <button
              onClick={() => setSelected(null)}
              style={{ position: "absolute", top: 8, right: 10, background: "none", border: "none", color: "#f6d24a", cursor: "pointer", fontSize: 14 }}
            >✕</button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>{selected.icon}</span>
              <span style={{ color: "#f6d24a", fontWeight: 700, fontSize: 12 }}>{selected.title}</span>
            </div>
            <p style={{ fontSize: 11, color: "#ccc", lineHeight: 1.5, margin: 0 }}>{selected.desc}</p>
            <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(246,210,74,0.2)", fontSize: 10, color: "rgba(246,210,74,0.7)", display: "flex", justifyContent: "space-between" }}>
              <span>Memory Spot</span><span>🇹🇭 Bangkok</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// ---------------------------------------------------------------
// Palm Trees
// ---------------------------------------------------------------
function Palm({ position, scale = 1, rot = 0 }: {
  position: [number, number, number];
  scale?: number;
  rot?: number;
}) {
  return (
    <group position={position} scale={scale} rotation={[0, rot, 0]}>
      <mesh position={[0, 1.4, 0]} castShadow rotation={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.07, 0.17, 2.8, 7]} />
        <meshStandardMaterial color="#7a5c3e" roughness={0.9} flatShading />
      </mesh>
      {[0, 1.26, 2.51, 3.77, 5.03].map((a, i) => (
        <mesh
          key={i}
          position={[Math.cos(a) * 0.45, 2.7, Math.sin(a) * 0.45]}
          rotation={[Math.sin(a) * 0.75, a, Math.cos(a) * 0.75]}
          castShadow
        >
          <boxGeometry args={[1.3, 0.06, 0.26]} />
          <meshStandardMaterial color={i % 2 ? "#2e7a44" : "#3d9455"} roughness={0.78} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export function PalmTrees() {
  const palms = useMemo(() => {
    const out: [number, number][] = [];
    for (let i = 0; i < 80; i++) {
      const ang = hash(i + 210) * Math.PI * 2;
      const r   = 8 + hash(i + 320) * 85;
      const x   = Math.cos(ang) * r;
      const z   = Math.sin(ang) * r;
      if (distanceToRoad(x, z) < 13) continue;
      if (Math.sqrt(x * x + z * z) > 106) continue;
      out.push([x, z]);
    }
    return out;
  }, []);

  return (
    <group>
      {palms.map((p, i) => (
        <Palm
          key={i}
          position={[p[0], 0, p[1]]}
          scale={0.8 + hash(i) * 0.5}
          rot={hash(i) * Math.PI * 2}
        />
      ))}
    </group>
  );
}

// ---------------------------------------------------------------
// Street Lanterns along road edges
// ---------------------------------------------------------------
export function Lanterns() {
  const lamps = useMemo(() => {
    const out: { pos: [number, number, number]; rotY: number }[] = [];
    const count = 36;
    const offset = 6.2;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const p = routeCurve.getPointAt(t);
      const tn = routeCurve.getTangentAt(t).normalize();
      const nx = -tn.z, nz = tn.x;
      const side = i % 2 === 0 ? 1 : -1;
      const rotY = Math.atan2(tn.x, tn.z) + (side > 0 ? 0 : Math.PI);
      out.push({ pos: [p.x + nx * offset * side, 0, p.z + nz * offset * side], rotY });
    }
    return out;
  }, []);

  return (
    <group>
      {lamps.map((lamp, i) => (
        <group key={i} position={lamp.pos} rotation={[0, lamp.rotY, 0]}>
          {/* Pole */}
          <mesh position={[0, 1.3, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.09, 2.6, 7]} />
            <meshStandardMaterial color="#1e1e1e" roughness={0.6} />
          </mesh>
          {/* Arm */}
          <mesh position={[0.28, 2.5, 0]} rotation={[0, 0, 0.22]}>
            <cylinderGeometry args={[0.025, 0.025, 0.65, 5]} />
            <meshStandardMaterial color="#c07830" metalness={0.5} />
          </mesh>
          {/* Globe */}
          <mesh position={[0.46, 2.42, 0]}>
            <sphereGeometry args={[0.19, 10, 10]} />
            <meshStandardMaterial color="#fff5d0" emissive="#ff9a30" emissiveIntensity={2.5} />
          </mesh>
          <pointLight position={[0.46, 2.42, 0]} color="#ffa040" intensity={1.2} distance={9} />
        </group>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------
// Central Plaza fountain
// ---------------------------------------------------------------
export function Plaza() {
  const waterRef = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (waterRef.current)
      waterRef.current.position.y = 1.22 + Math.sin(s.clock.elapsedTime * 1.5) * 0.04;
  });
  return (
    <group position={[-40, 0.02, 28]}>
      {/* Base circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5.5, 32]} />
        <meshStandardMaterial color="#c8b88a" roughness={0.8} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[5.5, 5.5, 0.6, 32, 1, true]} />
        <meshStandardMaterial color="#d4c49a" roughness={0.85} flatShading />
      </mesh>
      {/* Water basin */}
      <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5.3, 32]} />
        <meshStandardMaterial color="#48cae4" emissive="#00b4d8" emissiveIntensity={0.55} roughness={0.05} metalness={0.4} transparent opacity={0.85} />
      </mesh>
      {/* Center column */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[1.6, 1.8, 1.2, 8]} />
        <meshStandardMaterial color="#e3d6c1" flatShading />
      </mesh>
      {/* Water top */}
      <mesh ref={waterRef} position={[0, 1.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.4, 16]} />
        <meshStandardMaterial color="#a8e6f0" emissive="#50c8e0" emissiveIntensity={0.7} transparent opacity={0.9} />
      </mesh>
      <pointLight position={[0, 1.5, 0]} color="#48cae4" intensity={2.0} distance={10} />
    </group>
  );
}
