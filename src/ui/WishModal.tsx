import { useState } from "react";
import { useAppStore } from "../lib/store";

const QUICK_WISHES = [
  "To many more adventures together! ✨",
  "Always & Forever ❤",
  "My favorite memory is with you 🌟",
  "To our endless love & happiness 💖",
];

export function WishModal() {
  const wishModalOpen = useAppStore((s) => s.wishModalOpen);
  const setWishModalOpen = useAppStore((s) => s.setWishModalOpen);
  const releaseWishLantern = useAppStore((s) => s.releaseWishLantern);

  const [wishText, setWishText] = useState("");

  if (!wishModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;
    releaseWishLantern(wishText.trim());
    setWishText("");
  };

  const handleSelectQuick = (text: string) => {
    releaseWishLantern(text);
    setWishText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto transition-opacity"
        onClick={() => setWishModalOpen(false)}
      />

      {/* Wish Card Modal */}
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 shadow-2xl pointer-events-auto border border-white/25 animate-[modal-enter_0.3s_ease-out]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏮</span>
            <h3 className="font-display text-xl text-white font-normal">
              Send a Sky Lantern Wish
            </h3>
          </div>
          <button
            onClick={() => setWishModalOpen(false)}
            className="text-white/60 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            &times;
          </button>
        </div>

        <p className="text-white/70 text-xs leading-relaxed mb-4">
          Write a secret wish or romantic message to float up into the sunset sky over Bangkok.
        </p>

        {/* Quick Wish Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {QUICK_WISHES.map((w, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectQuick(w)}
              className="text-[11px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 transition-all text-left"
            >
              {w}
            </button>
          ))}
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={wishText}
            onChange={(e) => setWishText(e.target.value)}
            placeholder="Type your own wish or promise..."
            maxLength={60}
            className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#f4a261]"
          />

          <button
            type="submit"
            disabled={!wishText.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#f4a261] to-[#e76f51] text-white font-medium text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(244,162,97,0.3)] hover:shadow-[0_0_35px_rgba(244,162,97,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Release Wish Lantern ✨
          </button>
        </form>
      </div>
    </div>
  );
}
