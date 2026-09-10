import { Environment, Lightformer } from "@react-three/drei";

export function Lighting() {
  return (
    <>
      {/* Soft warm ambient lighting */}
      <ambientLight intensity={0.65} color="#ffe5d9" />
      <hemisphereLight intensity={0.45} color="#ffb085" groundColor="#3a2e4c" />

      {/* Main Sunset Sun */}
      <directionalLight
        position={[25, 32, 18]}
        intensity={2.2}
        color="#ffaa66"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0003}
      />

      {/* Blue/Purple Fill Rim Light from opposite direction */}
      <directionalLight position={[-18, 12, -20]} intensity={0.55} color="#7b5294" />

      {/* Warm Golden Glow Center */}
      <pointLight position={[0, 4, 0]} intensity={0.8} color="#f4a261" distance={45} />

      {/* Procedural Sunset Environment HDRI */}
      <Environment resolution={256}>
        <Lightformer
          intensity={3}
          rotation-x={Math.PI / 2}
          position={[0, 10, -15]}
          scale={[24, 24, 1]}
          color="#ff7e5f"
        />
        <Lightformer
          intensity={1.8}
          position={[-12, 4, -4]}
          rotation-y={Math.PI / 2}
          scale={[30, 8, 1]}
          color="#feb47b"
        />
        <Lightformer
          intensity={1.5}
          position={[18, 4, 2]}
          rotation-y={-Math.PI / 2}
          scale={[30, 8, 1]}
          color="#6c5ce7"
        />
      </Environment>
    </>
  );
}
