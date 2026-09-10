import { useAppStore } from "../lib/store";

export function HUD() {
  const visitedLandmarks = useAppStore((s) => s.visitedLandmarks);
  const landmarks = useAppStore((s) => s.landmarks);
  const isWalking = useAppStore((s) => s.isWalking);
  const coupleTarget = useAppStore((s) => s.coupleTarget);
  const setWishModalOpen = useAppStore((s) => s.setWishModalOpen);

  const visitedCount = visitedLandmarks.size;
  const total = landmarks.length;
  const progress = Math.min(100, (visitedCount / total) * 100);

  const currentLandmark = coupleTarget
    ? landmarks.find((l) => l.id === coupleTarget)
    : null;

  return (
    <div className="absolute top-5 left-5 pointer-events-none flex flex-col gap-2.5 z-30">
      <div className="glass-panel rounded-2xl px-4 py-3 shadow-xl border border-white/15">
        <div className="flex items-center justify-between gap-4">
          <span className="font-display text-white/95 text-sm tracking-wider">
            Planet Jomakarenko
          </span>
          <span className="text-white/60 text-xs font-mono">
            {visitedCount}/{total}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-2 w-48 h-2 rounded-full bg-black/40 overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#f4a261] to-[#e76f51] rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(244,162,97,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Mini landmark indicators */}
        <div className="mt-3 flex items-center justify-between gap-1">
          {landmarks.map((l) => {
            const isVisited = visitedLandmarks.has(l.id);
            return (
              <div
                key={l.id}
                className="flex items-center gap-1.5"
                title={l.name}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isVisited ? l.color : "rgba(255,255,255,0.25)",
                    boxShadow: isVisited ? `0 0 10px ${l.color}` : "none",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Release Wish Button */}
      <button
        onClick={() => setWishModalOpen(true)}
        className="pointer-events-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass-panel border border-[#f4a261]/40 text-[#f4a261] hover:bg-[#f4a261]/20 transition-all duration-200 shadow-lg text-xs font-medium tracking-wide active:scale-95"
      >
        <span>🏮</span>
        <span>Release Sky Wish</span>
      </button>

      {/* Walking status chip */}
      {isWalking && currentLandmark && (
        <div className="px-4 py-2 rounded-xl bg-[#f4a261]/20 border border-[#f4a261]/40 backdrop-blur-md animate-[fade-in_0.3s_ease-out] shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f4a261] animate-ping" />
            <span className="text-[#f4a261] text-xs font-medium tracking-wide">
              Walking to {currentLandmark.name}…
            </span>
          </div>
        </div>
      )}
    </div>
  );
}