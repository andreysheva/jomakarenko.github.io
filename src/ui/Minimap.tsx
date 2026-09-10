import { useEffect, useMemo, useRef } from "react";
import { useAppStore } from "../lib/store";
import { coupleWorld } from "../scene/Couple";
import { routeCurve } from "../lib/route";

function worldToMap(x: number, z: number, w: number, h: number, pad: number) {
  const min = -75;
  const max = 75;
  const worldSize = max - min;
  const cx = (x - min) / worldSize;
  const cy = (z - min) / worldSize;
  return [
    pad + Math.max(0, Math.min(1, cx)) * (w - pad * 2),
    h - pad - Math.max(0, Math.min(1, cy)) * (h - pad * 2),
  ];
}

export function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarks = useAppStore((s) => s.landmarks);
  const visitedLandmarks = useAppStore((s) => s.visitedLandmarks);

  const roadMapPoints = useMemo(() => {
    const pts: [number, number][] = [];
    const samples = 100;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const v = routeCurve.getPointAt(((t % 1) + 1) % 1);
      pts.push([v.x, v.z]);
    }
    return pts;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const pad = 18;

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Background frame
      ctx.fillStyle = "rgba(14, 18, 34, 0.82)";
      roundRect(ctx, 0, 0, W, H, 16);
      ctx.fill();

      // Border glow
      ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Road loop path
      ctx.strokeStyle = "rgba(244, 162, 97, 0.35)";
      ctx.lineWidth = 4.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let i = 0; i < roadMapPoints.length; i++) {
        const [wx, wz] = roadMapPoints[i];
        const [mx, my] = worldToMap(wx, wz, W, H, pad);
        if (i === 0) ctx.moveTo(mx, my);
        else ctx.lineTo(mx, my);
      }
      ctx.stroke();

      // Landmark pins
      landmarks.forEach((l) => {
        const [mx, my] = worldToMap(l.position[0], l.position[2], W, H, pad);
        const isVisited = visitedLandmarks.has(l.id);

        ctx.fillStyle = l.color;
        ctx.beginPath();
        ctx.arc(mx, my, isVisited ? 4.5 : 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isVisited ? "#ffffff" : "rgba(255,255,255,0.4)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Couple location blip
      const [cx, cy] = worldToMap(coupleWorld.position.x, coupleWorld.position.z, W, H, pad);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#f4a261";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Compass "N" badge
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "9px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("N", W / 2, 13);

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(raf);
  }, [landmarks, visitedLandmarks, roadMapPoints]);

  return (
    <div className="pointer-events-none absolute bottom-5 right-5 hidden sm:block z-30">
      <canvas
        ref={canvasRef}
        width={140}
        height={140}
        className="rounded-2xl shadow-2xl backdrop-blur-md"
      />
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
