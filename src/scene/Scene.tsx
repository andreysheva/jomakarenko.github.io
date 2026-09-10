import { Lighting } from "./Lighting";
import { SceneCamera } from "./SceneCamera";
import { CameraController } from "./CameraController";
import { SkyDome } from "./SkyDome";
import { Island, Ocean, Road, CityBlocks, PalmTrees, Plaza, Lanterns } from "./City";
import { Couple } from "./Couple";
import { Landmark } from "./Landmark";
import { SkyWishes } from "./SkyWishes";
import { LANDMARKS } from "../data/landmarks";

export function Scene() {
  return (
    <>
      <SceneCamera />
      <CameraController />
      <Lighting />
      <SkyDome />

      <Island />
      <Ocean />
      <Road />
      <CityBlocks />
      <PalmTrees />
      <Plaza />
      <Lanterns />
      <SkyWishes />

      <Couple />

      <group>
        {LANDMARKS.map((l) => (
          <Landmark
            key={l.id}
            id={l.id}
            position={l.position}
            color={l.color}
            buildingType={l.buildingType}
          />
        ))}
      </group>
    </>
  );
}
