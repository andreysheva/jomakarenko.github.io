import type { LandmarkData } from "../types";

export function LandmarkModel({ landmark }: { landmark: LandmarkData }) {
  const { id, color, locked } = landmark;

  return (
    <group>
      {/* -----------------------------------------------------------
          1. FAT BUDS SUKHUMVIT (Favorite Weed Shop)
         ----------------------------------------------------------- */}
      {id === "fat-buds-sukhumvit" && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.4, 2.8, 2.6]} />
            <meshStandardMaterial color={color} flatShading roughness={0.65} />
          </mesh>
          <mesh position={[0, 2.9, 0]} castShadow>
            <boxGeometry args={[3.7, 0.3, 2.9]} />
            <meshStandardMaterial color="#3d2b27" flatShading />
          </mesh>
          <mesh position={[0, 1.1, 1.32]}>
            <boxGeometry args={[2.4, 1.4, 0.08]} />
            <meshStandardMaterial color="#ffe5a3" emissive="#ffd573" emissiveIntensity={0.8} />
          </mesh>
          <group position={[0, 2.5, 1.35]}>
            <mesh>
              <boxGeometry args={[2.2, 0.5, 0.12]} />
              <meshStandardMaterial color="#2d6a4f" emissive="#52b788" emissiveIntensity={1.8} />
            </mesh>
          </group>
          {[-0.9, 0.9].map((x, i) => (
            <group key={i} position={[x, 0, 2.0]}>
              <mesh position={[0, 0.35, 0]}>
                <cylinderGeometry args={[0.35, 0.35, 0.06, 12]} />
                <meshStandardMaterial color="#5c433b" />
              </mesh>
              <mesh position={[0, 0.17, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.34, 6]} />
                <meshStandardMaterial color="#2b1e1a" />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* -----------------------------------------------------------
          2. BLACK CABIN BAR (First Date & Live Music)
         ----------------------------------------------------------- */}
      {id === "black-cabin-bar" && (
        <group position={[0, 0, 0]}>
          {/* Dark Wooden Cabin Body */}
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.2, 3.0, 2.8]} />
            <meshStandardMaterial color="#241e2b" flatShading roughness={0.8} />
          </mesh>
          {/* Gabled Roof */}
          <mesh position={[0, 3.3, 0]} rotation={[0, 0, 0]} castShadow>
            <coneGeometry args={[2.6, 1.2, 4]} />
            <meshStandardMaterial color="#1a1420" flatShading />
          </mesh>
          {/* Glowing Purple/Amber Neon "BLACK CABIN" Sign */}
          <mesh position={[0, 2.7, 1.43]}>
            <boxGeometry args={[2.4, 0.5, 0.1]} />
            <meshStandardMaterial color="#9b5de5" emissive="#9b5de5" emissiveIntensity={1.6} />
          </mesh>
          {/* Warm Interior Windows Glow */}
          <mesh position={[0, 1.2, 1.42]}>
            <boxGeometry args={[2.0, 1.2, 0.08]} />
            <meshStandardMaterial color="#ffb703" emissive="#ffb703" emissiveIntensity={1.0} />
          </mesh>
          {/* Live Music Saxophone / Vinyl Sign */}
          <group position={[1.4, 1.0, 1.5]}>
            <mesh rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 0.06, 16]} />
              <meshStandardMaterial color="#ffc107" emissive="#ffc107" emissiveIntensity={0.8} />
            </mesh>
          </group>
        </group>
      )}

      {/* -----------------------------------------------------------
          3. LA PETITE SALIL (First Hotel Together)
         ----------------------------------------------------------- */}
      {id === "la-petite-salil" && (
        <group position={[0, 0, 0]}>
          {/* French-Siamese Cream Hotel Body */}
          <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.2, 4.0, 3.0]} />
            <meshStandardMaterial color="#e9d8c0" flatShading roughness={0.6} />
          </mesh>
          {/* Marble Archway Porch */}
          <mesh position={[0, 0.6, 1.6]} castShadow>
            <boxGeometry args={[1.8, 1.2, 0.5]} />
            <meshStandardMaterial color="#f8f1e5" roughness={0.3} />
          </mesh>
          {/* Golden "LA PETITE SALIL" Roof Crest */}
          <mesh position={[0, 4.2, 0]} castShadow>
            <boxGeometry args={[3.4, 0.3, 3.2]} />
            <meshStandardMaterial color="#c68a4c" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Soft Warm Windows */}
          <mesh position={[0, 2.4, 1.52]}>
            <boxGeometry args={[2.2, 2.2, 0.06]} />
            <meshStandardMaterial color="#fff0c2" emissive="#ffd573" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}

      {/* -----------------------------------------------------------
          4. SHINE HOTEL (Rooftop & Guard KAAAAP!)
         ----------------------------------------------------------- */}
      {id === "shine-hotel" && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.0, 4.0, 3.0]} />
            <meshStandardMaterial color={color} flatShading roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.5, 1.65]} castShadow>
            <boxGeometry args={[1.8, 1.0, 0.5]} />
            <meshStandardMaterial color="#4a3854" flatShading />
          </mesh>
          {/* Guard Security Post Booth ("KAAAAP!") */}
          <group position={[1.8, 0, 1.8]}>
            <mesh position={[0, 0.6, 0]} castShadow>
              <boxGeometry args={[0.8, 1.2, 0.8]} />
              <meshStandardMaterial color="#ffb703" flatShading />
            </mesh>
            <mesh position={[0, 1.25, 0]}>
              <boxGeometry args={[0.9, 0.1, 0.9]} />
              <meshStandardMaterial color="#211d24" />
            </mesh>
          </group>
          <mesh position={[0, 2.4, 1.52]}>
            <boxGeometry args={[2.0, 2.2, 0.06]} />
            <meshStandardMaterial color="#ffebad" emissive="#ffd875" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 4.1, 0]} castShadow>
            <boxGeometry args={[3.3, 0.2, 3.3]} />
            <meshStandardMaterial color="#2d2236" flatShading />
          </mesh>
        </group>
      )}

      {/* -----------------------------------------------------------
          5. LEBUA HOTEL (51st Floor Skyscraper & Mirrors)
         ----------------------------------------------------------- */}
      {id === "lebua-hotel" && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.8, 9.0, 2.8]} />
            <meshStandardMaterial color={color} flatShading roughness={0.4} />
          </mesh>
          <mesh position={[0, 4.5, 1.42]}>
            <boxGeometry args={[2.0, 7.5, 0.06]} />
            <meshStandardMaterial
              color="#e6f0ff"
              emissive="#7aa5eb"
              emissiveIntensity={0.6}
              metalness={0.8}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[0, 9.1, 0]} castShadow>
            <cylinderGeometry args={[1.8, 2.0, 0.3, 16]} />
            <meshStandardMaterial color="#f7e6c4" flatShading />
          </mesh>
          <mesh position={[0, 9.8, 0]} castShadow>
            <sphereGeometry args={[1.1, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color="#f4a261"
              metalness={0.8}
              roughness={0.15}
              emissive="#ffb870"
              emissiveIntensity={0.8}
            />
          </mesh>
          <pointLight position={[0, 10.4, 0]} color="#f4a261" intensity={2.8} distance={18} />
        </group>
      )}

      {/* -----------------------------------------------------------
          6. SLOW BURN PHROM PHONG (Work Date & Monkey Massage)
         ----------------------------------------------------------- */}
      {id === "slow-burn-phrom-phong" && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.4, 2.8, 2.6]} />
            <meshStandardMaterial color={color} flatShading roughness={0.7} />
          </mesh>
          <mesh position={[0, 2.4, 1.35]}>
            <boxGeometry args={[2.4, 0.5, 0.12]} />
            <meshStandardMaterial color="#e76f51" emissive="#f4a261" emissiveIntensity={1.2} />
          </mesh>
          <group position={[-1.8, 0, 2.2]}>
            <mesh position={[0, 0.8, 0]}>
              <boxGeometry args={[1.2, 0.7, 0.1]} />
              <meshStandardMaterial color="#ffb703" emissive="#ffb703" emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.7, 6]} />
              <meshStandardMaterial color="#2d2a26" />
            </mesh>
          </group>
        </group>
      )}

      {/* -----------------------------------------------------------
          7. PARK ORIGIN PHROM PHONG (Our Last Condo & Hipster Neighbor)
         ----------------------------------------------------------- */}
      {id === "park-origin-phrom-phong" && (
        <group position={[0, 0, 0]}>
          <mesh position={[-0.7, 4.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 8.0, 2.2]} />
            <meshStandardMaterial color={color} flatShading roughness={0.4} />
          </mesh>
          <mesh position={[0.7, 4.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 9.0, 2.2]} />
            <meshStandardMaterial color="#b56576" flatShading roughness={0.4} />
          </mesh>
          <mesh position={[0, 4.2, 1.12]}>
            <boxGeometry args={[2.8, 7.0, 0.06]} />
            <meshStandardMaterial color="#48cae4" emissive="#00b4d8" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0.7, 9.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.3, 1.8]} />
            <meshStandardMaterial color="#00b4d8" emissive="#00b4d8" emissiveIntensity={1.2} />
          </mesh>
        </group>
      )}

      {/* -----------------------------------------------------------
          8. DREAMLOFT (Best Food & Beautiful Interior)
         ----------------------------------------------------------- */}
      {id === "dreamloft" && (
        <group position={[0, 0, 0]}>
          {/* Glass & Timber Loft Building Body */}
          <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.6, 3.2, 2.8]} />
            <meshStandardMaterial color="#3a2f3b" flatShading roughness={0.5} />
          </mesh>
          {/* Greenhouse Glass Roof Canopy */}
          <mesh position={[0, 3.4, 0]} castShadow>
            <coneGeometry args={[2.4, 0.8, 4]} />
            <meshStandardMaterial color="#a8dede" transparent opacity={0.65} metalness={0.8} />
          </mesh>

          {/* "DREAMLOFT" Neon Sign */}
          <mesh position={[0, 2.6, 1.43]}>
            <boxGeometry args={[2.6, 0.55, 0.12]} />
            <meshStandardMaterial color="#e76f51" emissive="#ff85a1" emissiveIntensity={1.5} />
          </mesh>
          {/* Warm Candlelit Dining Windows */}
          <mesh position={[0, 1.2, 1.42]}>
            <boxGeometry args={[2.8, 1.6, 0.08]} />
            <meshStandardMaterial color="#ffebad" emissive="#ffc107" emissiveIntensity={0.9} />
          </mesh>
        </group>
      )}

      {/* -----------------------------------------------------------
          9. SECRET CHINESE SPEAKEASY (龍寶 & "I hope you so rich" Sticker)
         ----------------------------------------------------------- */}
      {id === "secret-chinese-bar" && (
        <group position={[0, 0, 0]}>
          {/* Red Brick Chinese Shophouse Facade */}
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.2, 3.0, 2.6]} />
            <meshStandardMaterial color="#8b263e" flatShading roughness={0.75} />
          </mesh>
          {/* Red Chinese Lanterns hanging from roof */}
          {[-1.2, 1.2].map((x, i) => (
            <group key={i} position={[x, 2.4, 1.45]}>
              <mesh>
                <sphereGeometry args={[0.22, 10, 10]} />
                <meshStandardMaterial color="#e63946" emissive="#e63946" emissiveIntensity={2.0} />
              </mesh>
              <pointLight color="#e63946" intensity={1.2} distance={5} />
            </group>
          ))}
          {/* Red Neon Chinese Characters Signboard "龍寶" */}
          <mesh position={[0, 2.5, 1.33]}>
            <boxGeometry args={[2.0, 0.55, 0.12]} />
            <meshStandardMaterial color="#ff4d6d" emissive="#ff4d6d" emissiveIntensity={1.8} />
          </mesh>
          {/* Wall Sticker: "I HOPE YOU SO RICH 🧧" */}
          <mesh position={[0.9, 0.9, 1.32]}>
            <planeGeometry args={[0.7, 0.4]} />
            <meshStandardMaterial color="#ffb703" emissive="#ffb703" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}

      {/* -----------------------------------------------------------
          10. BADMINTON COURT (No AC Sweatfest!)
         ----------------------------------------------------------- */}
      {id === "badminton" && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[4.2, 2.8]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4.0, 2.6]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.8, 2.4]} />
            <meshStandardMaterial color="#2d6a4f" />
          </mesh>
          <group position={[0, 0.45, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.04, 0.6, 2.6]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
            </mesh>
            {[-1.3, 1.3].map((z, i) => (
              <mesh key={i} position={[0, 0, z]}>
                <cylinderGeometry args={[0.04, 0.04, 0.8, 6]} />
                <meshStandardMaterial color="#e76f51" />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* -----------------------------------------------------------
          11. TENNIS CLUB (🔒 Locked Event)
         ----------------------------------------------------------- */}
      {id === "tennis" && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[4.2, 2.8]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
          <group position={[0, 0.45, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.04, 0.5, 2.6]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
            </mesh>
          </group>
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[4.4, 1.0, 3.0]} />
            <meshStandardMaterial color="#6c757d" wireframe transparent opacity={0.4} />
          </mesh>
          {locked && (
            <group position={[0, 2.2, 0]}>
              <mesh>
                <boxGeometry args={[0.6, 0.6, 0.25]} />
                <meshStandardMaterial color="#ffd166" emissive="#ffb703" emissiveIntensity={1.2} />
              </mesh>
              <mesh position={[0, 0.45, 0]}>
                <torusGeometry args={[0.2, 0.06, 8, 16, Math.PI]} />
                <meshStandardMaterial color="#e76f51" />
              </mesh>
            </group>
          )}
        </group>
      )}

      {/* Shared Base Pedestal */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial color="#ded2ba" roughness={0.9} />
      </mesh>
    </group>
  );
}
