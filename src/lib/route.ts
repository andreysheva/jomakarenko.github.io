import * as THREE from "three";
import { LANDMARKS } from "../data/landmarks";

// Build a smooth closed-loop route that visits every landmark in order.
// The couple (two characters) walk along this route.
const loopPoints = LANDMARKS.map(
  (l) => new THREE.Vector3(l.position[0], l.position[1], l.position[2])
);

// Catmull-Rom closed curve through the landmarks
export const routeCurve = new THREE.CatmullRomCurve3(loopPoints, true, "catmullrom", 0.0001);

// Arc-length parameterization so walking speed is constant
routeCurve.arcLengthDivisions = 1000;

// Map each landmark id -> its arc-length parameter t in [0,1]
export const landmarkT: Record<string, number> = {};
for (const l of LANDMARKS) {
  const pos = new THREE.Vector3(l.position[0], l.position[1], l.position[2]);
  landmarkT[l.id] = closestParam(pos);
}

// Find the curve parameter (arc-length normalized) nearest to a point
function closestParam(point: THREE.Vector3): number {
  const samples = 400;
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const p = routeCurve.getPointAt(t);
    const d = p.distanceToSquared(point);
    if (d < bestDist) {
      bestDist = d;
      best = t;
    }
  }
  return best;
}

// Warp parameter to handle closed-loop shortest direction
export function shortestDelta(from: number, to: number): number {
  let d = (to - from) % 1;
  if (d > 0.5) d -= 1;
  if (d < -0.5) d += 1;
  return d;
}

export function pointAt(t: number): THREE.Vector3 {
  return routeCurve.getPointAt(((t % 1) + 1) % 1);
}

export function tangentAt(t: number): THREE.Vector3 {
  return routeCurve.getTangentAt(((t % 1) + 1) % 1);
}

// Precomputed samples for fast "distance to road" checks
const ROAD_SAMPLES_COUNT = 240;
const roadSamples: THREE.Vector3[] = [];
for (let i = 0; i <= ROAD_SAMPLES_COUNT; i++) {
  roadSamples.push(routeCurve.getPointAt(i / ROAD_SAMPLES_COUNT));
}

/** Approximate distance from a point to the nearest road sample (world units). */
export function distanceToRoad(x: number, z: number): number {
  let best = Infinity;
  for (const p of roadSamples) {
    const dx = p.x - x;
    const dz = p.z - z;
    const d2 = dx * dx + dz * dz;
    if (d2 < best) best = d2;
    if (best === 0) break;
  }
  return Math.sqrt(best);
}
