import { PerspectiveCamera } from "@react-three/drei";

export function SceneCamera() {
  return (
    <PerspectiveCamera
      makeDefault
      position={[18, 16, 24]}
      fov={50}
      near={0.1}
      far={300}
    />
  );
}
