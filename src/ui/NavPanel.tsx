import { useAppStore } from "../lib/store";

export function NavPanel() {
  const landmarks = useAppStore((s) => s.landmarks);
  const navigateTo = useAppStore((s) => s.navigateTo);
  const isWalking = useAppStore((s) => s.isWalking);
  const coupleTarget = useAppStore((s) => s.coupleTarget);
  const visitedLandmarks = useAppStore((s) => s.visitedLandmarks);

  const firstRow = landmarks.slice(0, Math.ceil(landmarks.length / 2));
  const secondRow = landmarks.slice(Math.ceil(landmarks.length / 2));

  const interleaved = [] as (typeof landmarks)[number][];
  for (let i = 0; i < firstRow.length; i++) {
    interleaved.push(firstRow[i]);
    if (secondRow[i]) interleaved.push(secondRow[i]);
  }

  const renderCard = (l: (typeof landmarks)[number]) => {
    const active = coupleTarget === l.id;
    const visited = visitedLandmarks.has(l.id);
    const isLocked = l.locked;

    return (
      <button
        key={l.id}
        onClick={() => {
          if (!isWalking && !active && !isLocked) navigateTo(l.id);
        }}
        disabled={isWalking || active || isLocked}
        className={[
          "group flex flex-col items-start gap-1 p-2.5 w-[210px] flex-shrink-0 rounded-xl border text-left transition-all duration-300 relative overflow-hidden",
          isLocked
            ? "bg-purple-950/30 border-purple-400/35 opacity-75 cursor-not-allowed"
            : active
            ? "bg-white/25 border-white/60 shadow-[0_0_18px_rgba(255,255,255,0.25)]"
            : isWalking
            ? "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
            : "bg-white/10 border-white/15 hover:bg-white/20 hover:border-white/40 hover:scale-[1.02] cursor-pointer",
        ].join(" ")}
      >
        {/* Accent glow line on top of card */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 opacity-90"
          style={{ background: l.color }}
        />

        <span className="flex items-center gap-2 w-full">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: l.color, boxShadow: `0 0 10px ${l.color}` }}
          />
          <span className="text-white font-medium text-xs leading-tight">
            {l.name}
          </span>
        </span>
        <span className="text-white/60 text-[10px] tracking-tight pl-4 leading-tight">
          {isLocked ? "🔒 Locked Event" : visited ? "✓ Visited" : l.subtitle || "Tap to walk"}
        </span>
      </button>
    );
  };

  return (
    <div className="pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 w-[min(96vw,980px)] z-30">
      <div className="glass-panel rounded-2xl shadow-2xl px-4 py-3 border border-white/20">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-white/80 text-[11px] uppercase tracking-widest font-medium">
            {isWalking ? "Walking in progress…" : "Where to next?"}
          </span>
          {isWalking && (
            <span className="flex items-center gap-1.5 text-[#f4a261] text-[11px] font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-[#f4a261] animate-pulse" />
              Walking together
            </span>
          )}
        </div>

        {/* Two long rows in a single scrollable navbar */}
        <div className="overflow-x-auto pb-1 pt-0.5 scrollbar-thin scrollbar-thumb-amber-400/40 scrollbar-track-black/20">
          <div className="grid grid-rows-2 grid-flow-col auto-cols-max gap-2">
            {interleaved.map(renderCard)}
          </div>
        </div>

        <p className="px-1 pt-2 text-white/40 text-[10px] text-center hidden sm:block">
          Scroll or tap any destination to walk along Planet Jomakarenko together
        </p>
      </div>
    </div>
  );
}