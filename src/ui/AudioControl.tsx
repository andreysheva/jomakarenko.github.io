import { useAppStore } from "../lib/store";

export function AudioControl() {
  const audioMuted = useAppStore((s) => s.audioMuted);
  const audioPlaying = useAppStore((s) => s.audioPlaying);
  const toggleAudio = useAppStore((s) => s.toggleAudio);

  return (
    <div className="absolute top-5 right-5 pointer-events-auto z-30 flex items-center gap-2">
      {/* Audio equalizing track badge */}
      {audioPlaying && !audioMuted && (
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-white/15 text-white/70 text-xs">
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 bg-[#f4a261] animate-wave-1" />
            <span className="w-0.5 bg-[#f4a261] animate-wave-2" />
            <span className="w-0.5 bg-[#f4a261] animate-wave-3" />
          </div>
          <span className="text-[11px] tracking-wide truncate max-w-[120px]">
            Cornerstone
          </span>
        </div>
      )}

      {/* Mute/Unmute Toggle Button */}
      <button
        onClick={toggleAudio}
        className="w-11 h-11 rounded-full glass-panel border border-white/20 flex items-center justify-center text-white/90 hover:bg-white/20 transition-all duration-200 shadow-lg active:scale-95"
        title={audioMuted ? "Unmute Soundtrack" : "Mute Soundtrack"}
      >
        {audioMuted ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>
    </div>
  );
}
