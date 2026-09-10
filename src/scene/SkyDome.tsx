import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ---------------------------------------------------------------
// 3D Atmospheric Sky Dome with Sunset Color Gradient
// ---------------------------------------------------------------
export function SkyDome() {
  const skyGeo = useMemo(() => {
    const radius = 250;
    const geo = new THREE.SphereGeometry(radius, 32, 32);
    const p = geo.getAttribute("position");
    const colors = new Float32Array(p.count * 3);

    const cHorizon = new THREE.Color("#3b2647"); // Soft dusk violet horizon
    const cLowSky = new THREE.Color("#ff8c52");  // Vibrant golden sunset coral
    const cMidSky = new THREE.Color("#8b4570");  // Warm sunset mauve
    const cZenith = new THREE.Color("#0c1226");  // Deep twilight night sky

    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i);
      // Normalized height in range [0, 1]
      const t = Math.max(0, Math.min(1, (y + 20) / 270));

      const col = new THREE.Color();
      if (t < 0.25) {
        const factor = t / 0.25;
        col.copy(cHorizon).lerp(cLowSky, factor);
      } else if (t < 0.6) {
        const factor = (t - 0.25) / 0.35;
        col.copy(cLowSky).lerp(cMidSky, factor);
      } else {
        const factor = (t - 0.6) / 0.4;
        col.copy(cMidSky).lerp(cZenith, factor);
      }

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  // Distant mountain range silhouettes along horizon
  const mountainsGeo = useMemo(() => {
    const count = 48;
    const rInner = 175;
    const rOuter = 195;
    const pos: number[] = [];
    const idx: number[] = [];
    let base = 0;

    for (let i = 0; i < count; i++) {
      const a1 = (i / count) * Math.PI * 2;
      const a2 = ((i + 1) / count) * Math.PI * 2;

      // Peak height variations
      const h1 = 12 + Math.sin(i * 3.7) * 8 + Math.cos(i * 7.1) * 6;
      const h2 = 12 + Math.sin((i + 1) * 3.7) * 8 + Math.cos((i + 1) * 7.1) * 6;

      const x1 = Math.cos(a1) * rInner;
      const z1 = Math.sin(a1) * rInner;
      const x2 = Math.cos(a2) * rInner;
      const z2 = Math.sin(a2) * rInner;

      const x1o = Math.cos(a1) * rOuter;
      const z1o = Math.sin(a1) * rOuter;
      const x2o = Math.cos(a2) * rOuter;
      const z2o = Math.sin(a2) * rOuter;

      // Triangle 1: Base to Peak
      pos.push(x1, -2, z1, x2, -2, z2, (x1 + x2) / 2, h1, (z1 + z2) / 2);
      // Triangle 2: Backing depth
      pos.push(x1o, -4, z1o, x2o, -4, z2o, (x1 + x2) / 2, h2, (z1 + z2) / 2);

      idx.push(base, base + 1, base + 2, base + 3, base + 4, base + 5);
      base += 6;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Floating sunset clouds animation
  const cloudsGroupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (cloudsGroupRef.current) {
      cloudsGroupRef.current.rotation.y = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <group>
      {/* Gradient Sky Dome Sphere */}
      <mesh geometry={skyGeo}>
        <meshBasicMaterial vertexColors side={THREE.BackSide} depthWrite={false} />
      </mesh>

      {/* Glowing Horizon Sun Disc */}
      <group position={[110, 22, -140]}>
        <mesh>
          <sphereGeometry args={[14, 24, 24]} />
          <meshBasicMaterial color="#ffc107" />
        </mesh>
        {/* Sun Halo Ring */}
        <mesh>
          <sphereGeometry args={[26, 24, 24]} />
          <meshBasicMaterial
            color="#ff7043"
            transparent
            opacity={0.35}
            side={THREE.BackSide}
          />
        </mesh>
      </group>

      {/* Horizon Mountain Silhouettes Ring */}
      <mesh geometry={mountainsGeo} position={[0, -2, 0]}>
        <meshStandardMaterial color="#1a1528" roughness={0.95} flatShading />
      </mesh>

      {/* Drifting Sunset Clouds */}
      <group ref={cloudsGroupRef}>
        {[
          [-60, 48, -110, 18],
          [80, 52, -90, 22],
          [-110, 42, 60, 20],
          [95, 56, 80, 24],
          [0, 60, -140, 28],
        ].map(([cx, cy, cz, size], idx) => (
          <mesh key={idx} position={[cx, cy, cz]}>
            <sphereGeometry args={[size, 10, 10]} />
            <meshStandardMaterial
              color="#e09f68"
              emissive="#c45d3e"
              emissiveIntensity={0.35}
              transparent
              opacity={0.65}
              flatShading
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
