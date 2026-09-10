import { useAppStore } from "../lib/store";

export function IntroScreen() {
  const startJourney = useAppStore((s) => s.startJourney);
  const startAudio = useAppStore((s) => s.startAudio);

  const handleBegin = () => {
    startAudio();
    startJourney();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#14182b] via-[#1a1a2e] to-[#e76f51]/25 animate-[fade-in_0.8s_ease-out]">
      {/* Decorative floating lights */}
      <div className="absolute top-12 left-12 w-2.5 h-2.5 rounded-full bg-[#f4a261]/80 animate-pulse" />
      <div className="absolute top-24 right-20 w-3.5 h-3.5 rounded-full bg-[#e76f51]/70 animate-pulse" style={{ animationDelay: "0.4s" }} />
      <div className="absolute bottom-28 left-28 w-2 h-2 rounded-full bg-[#f4a261]/90 animate-pulse" style={{ animationDelay: "0.9s" }} />
      <div className="absolute top-1/3 right-36 w-2.5 h-2.5 rounded-full bg-[#e76f51]/50 animate-pulse" style={{ animationDelay: "1.4s" }} />

      <div className="text-center px-6 space-y-6 max-w-lg">
        <h1 className="font-display text-5xl md:text-7xl text-white font-normal leading-tight tracking-wide">
          Planet <span className="text-[#f4a261] italic font-normal">Jomakarenko</span>
        </h1>

        <div className="pt-2">
          <button
            onClick={handleBegin}
            className="group relative px-9 py-4 rounded-full bg-gradient-to-r from-[#f4a261]/30 to-[#e76f51]/30 border border-[#f4a261]/60 text-[#f4a261] text-sm font-semibold tracking-widest uppercase hover:bg-gradient-to-r hover:from-[#f4a261]/40 hover:to-[#e76f51]/40 hover:border-[#f4a261] transition-all duration-300 shadow-[0_0_35px_rgba(244,162,97,0.25)] hover:shadow-[0_0_50px_rgba(244,162,97,0.45)] active:scale-95"
          >
            Begin the Journey
            <span className="ml-2 inline-block transform transition-transform duration-300 group-hover:translate-x-1">
              &#8594;
            </span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-white/50 text-xs pt-2">
          <svg className="w-4 h-4 text-[#f4a261]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <span>Includes soundtrack: &ldquo;Cornerstone&rdquo; by Arctic Monkeys</span>
        </div>
      </div>
    </div>
  );
}
