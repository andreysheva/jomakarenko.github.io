import { useEffect, useState } from "react";
import { useAppStore } from "../lib/store";

export function MemoryModal() {
  const activeLandmark = useAppStore((s) => s.activeLandmark);
  const modalOpen = useAppStore((s) => s.modalOpen);
  const closeModal = useAppStore((s) => s.closeModal);
  const currentImageIndex = useAppStore((s) => s.currentImageIndex);
  const nextImage = useAppStore((s) => s.nextImage);
  const prevImage = useAppStore((s) => s.prevImage);
  const showFinale = useAppStore((s) => s.showFinale);
  const visitedCount = useAppStore((s) => s.visitedLandmarks.size);
  const total = useAppStore((s) => s.landmarks.length);
  const setWishModalOpen = useAppStore((s) => s.setWishModalOpen);
  const setTriggerFireworks = useAppStore((s) => s.setTriggerFireworks);

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (modalOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (expanded) setExpanded(false);
        else closeModal();
      }
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    if (modalOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen, closeModal, nextImage, prevImage, expanded]);

  if (!modalOpen || !activeLandmark) return null;

  const images = activeLandmark.images;
  const currentImageSrc = images[currentImageIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto transition-opacity"
        onClick={closeModal}
      />

      {/* Lightbox Expanded Image View */}
      {expanded && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 pointer-events-auto animate-[fade-in_0.2s_ease-out]"
          onClick={() => setExpanded(false)}
        >
          <img
            src={currentImageSrc}
            alt={activeLandmark.name}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-white/20"
          />
          <button
            onClick={() => setExpanded(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white text-3xl font-light"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Modal Card */}
      <div
        className="relative w-full max-w-lg glass-panel rounded-3xl shadow-2xl pointer-events-auto overflow-hidden animate-[modal-enter_0.35s_ease-out] border border-white/25"
        style={{ boxShadow: `0 0 70px ${activeLandmark.color}44` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{
                background: activeLandmark.color,
                boxShadow: `0 0 12px ${activeLandmark.color}`,
              }}
            />
            <div>
              <h2 className="font-display text-2xl text-white font-normal">
                {activeLandmark.name}
              </h2>
              <span className="text-white/40 text-[11px] uppercase tracking-wider">
                Bangkok, Thailand
              </span>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-white/60 hover:text-white transition-colors text-2xl leading-none w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            &times;
          </button>
        </div>

        {/* Photo Display Frame */}
        <div className="px-6 pt-3">
          <div
            className="relative w-full h-64 md:h-72 rounded-2xl overflow-hidden cursor-zoom-in group border border-white/15 bg-black/40"
            onClick={() => setExpanded(true)}
          >
            <img
              src={currentImageSrc}
              alt={activeLandmark.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
              <span className="text-white/80 text-xs bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                Click to expand photo ↗
              </span>
            </div>
          </div>

          {/* Photo Navigation Controls */}
          {images.length > 1 && (
            <div className="flex items-center justify-between px-2 mt-3">
              <button
                onClick={prevImage}
                className="text-white/70 hover:text-white text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              >
                &#8592; Prev Photo
              </button>
              <div className="flex gap-2">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        i === currentImageIndex
                          ? activeLandmark.color
                          : "rgba(255,255,255,0.25)",
                      width: i === currentImageIndex ? "16px" : "6px",
                    }}
                  />
                ))}
              </div>
              <button
                onClick={nextImage}
                className="text-white/70 hover:text-white text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              >
                Next Photo &#8594;
              </button>
            </div>
          )}
        </div>

        {/* Memory Text Quote */}
        <div className="px-6 py-5">
          <p className="text-white/90 text-sm md:text-base leading-relaxed italic font-light">
            &ldquo;{activeLandmark.description}&rdquo;
          </p>
        </div>

        {/* Grand Finale Celebration Card */}
        <div className="px-6 pb-6">
          {showFinale && visitedCount >= total && (
            <div className="rounded-2xl bg-gradient-to-r from-[#f4a261]/25 to-[#e76f51]/25 border border-[#f4a261]/50 p-4 text-center animate-[fade-in_0.5s_ease-out] shadow-xl space-y-3">
              <p className="text-[#f4a261] text-sm font-semibold tracking-wide">
                ❤ Journey Complete! ❤
              </p>
              <p className="text-white/80 text-xs">
                You&apos;ve unlocked all four memories in Bangkok. Every step of the way is a memory we will hold forever.
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => {
                    closeModal();
                    setWishModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#f4a261] text-slate-950 font-semibold text-xs hover:bg-[#ffb578] transition-all"
                >
                  Send Sky Wish 🏮
                </button>
                <button
                  onClick={() => setTriggerFireworks(true)}
                  className="px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs transition-all border border-white/25"
                >
                  Fireworks ✨
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
