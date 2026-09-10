import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CameraControls } from "@react-three/drei";
import { useAppStore } from "../lib/store";
import { coupleWorld } from "./Couple";
import { tangentAt } from "../lib/route";

const FOLLOW_DISTANCE = 10.5;
const FOLLOW_HEIGHT = 7.2;
const LOOK_HEIGHT = 1.5;

export function CameraController() {
  const controlsRef = useRef<CameraControls>(null);
  const isWalking = useAppStore((s) => s.isWalking);
  const journeyStarted = useAppStore((s) => s.journeyStarted);
  const modalOpen = useAppStore((s) => s.modalOpen);
  const activeLandmark = useAppStore((s) => s.activeLandmark);

  const currentCamPos = useRef(new THREE.Vector3(52, 42, 75));
  const currentLookAt = useRef(new THREE.Vector3(-10, 1.2, 8));
  const initialized = useRef(false);

  // Initial framing once journey starts
  useEffect(() => {
    if (journeyStarted && controlsRef.current && !initialized.current) {
      initialized.current = true;
      const c = controlsRef.current;
      c.enabled = true;
      c.setLookAt(52, 42, 75, -10, 1.2, 8, true);
    }
  }, [journeyStarted]);

  // Frame active landmark when modal opens
  useEffect(() => {
    if (modalOpen && activeLandmark && controlsRef.current) {
      const [lx, ly, lz] = activeLandmark.position;
      const [ox, oy, oz] = activeLandmark.cameraOffset;
      controlsRef.current.setLookAt(
        lx + ox,
        ly + oy,
        lz + oz,
        lx,
        ly + 1.2,
        lz,
        true
      );
    }
  }, [modalOpen, activeLandmark]);

  useFrame((_state, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (isWalking && !modalOpen) {
      const dt = Math.min(delta, 0.1);
      const targetPos = coupleWorld.position;
      const forward = tangentAt(coupleWorld.t);

      // Target look focus in front of couple
      const targetLook = new THREE.Vector3(
        targetPos.x + forward.x * 1.5,
        LOOK_HEIGHT,
        targetPos.z + forward.z * 1.5
      );

      // Target camera position trailing behind couple
      const targetCam = new THREE.Vector3(
        targetPos.x - forward.x * FOLLOW_DISTANCE,
        Math.max(targetPos.y + FOLLOW_HEIGHT, 4.2),
        targetPos.z - forward.z * FOLLOW_DISTANCE
      );

      // Smooth framerate-independent exponential damping
      currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, targetLook.x, 4.5, dt);
      currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, targetLook.y, 4.5, dt);
      currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, targetLook.z, 4.5, dt);

      currentCamPos.current.x = THREE.MathUtils.damp(currentCamPos.current.x, targetCam.x, 4.0, dt);
      currentCamPos.current.y = THREE.MathUtils.damp(currentCamPos.current.y, targetCam.y, 4.0, dt);
      currentCamPos.current.z = THREE.MathUtils.damp(currentCamPos.current.z, targetCam.z, 4.0, dt);

      controls.setLookAt(
        currentCamPos.current.x,
        currentCamPos.current.y,
        currentCamPos.current.z,
        currentLookAt.current.x,
        currentLookAt.current.y,
        currentLookAt.current.z,
        false
      );
    }
  });

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      enabled={journeyStarted}
      smoothTime={0.6}
      minDistance={5}
      maxDistance={140}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minPolarAngle={0.05}
      azimuthRotateSpeed={-0.6}
      polarRotateSpeed={-0.5}
    />
  );
}
