import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Scene } from "./scene/Scene";
import { IntroScreen } from "./ui/IntroScreen";
import { HUD } from "./ui/HUD";
import { MemoryModal } from "./ui/MemoryModal";
import { WishModal } from "./ui/WishModal";
import { AudioControl } from "./ui/AudioControl";
import { NavPanel } from "./ui/NavPanel";
import { useAppStore } from "./lib/store";

export default function App() {
  const journeyStarted = useAppStore((s) => s.journeyStarted);
  const modalOpen = useAppStore((s) => s.modalOpen);

  return (
    <div className="relative w-full h-screen bg-[#0c1226] overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          position: [36, 32, 54],
          fov: 48,
          near: 0.1,
          far: 500,
        }}
      >
        <color attach="background" args={["#0c1226"]} />
        <fog attach="fog" args={["#2b1b36", 90, 260]} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* Atmosphere gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(12,18,38,0.2) 0%, rgba(12,18,38,0) 35%, rgba(231,111,81,0.08) 100%)",
        }}
      />

      {/* DOM Overlay */}
      {journeyStarted && (
        <div className="absolute inset-0 pointer-events-none">
          <HUD />
          <AudioControl />
          <NavPanel />
          <MemoryModal />
          <WishModal />
        </div>
      )}

      {/* Map legend + hint */}
      {journeyStarted && !modalOpen && (
        <div className="absolute bottom-5 left-5 hidden md:block pointer-events-none z-20">
          <div className="text-white/50 text-[11px] leading-relaxed backdrop-blur-md bg-black/25 border border-white/10 rounded-xl px-3 py-2">
            Drag to orbit &middot; Scroll to zoom
            <br />
            Tap a beacon or destination to walk
          </div>
        </div>
      )}

      {/* Intro */}
      {!journeyStarted && <IntroScreen />}
    </div>
  );
}