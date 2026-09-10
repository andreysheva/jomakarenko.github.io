import { create } from "zustand";
import type { LandmarkState, SkyWish } from "../types";
import { LANDMARKS } from "../data/landmarks";
import { asset } from "./assets";

let audioEl: HTMLAudioElement | null = null;

export const useAppStore = create<LandmarkState>((set, get) => ({
  landmarks: LANDMARKS,
  activeLandmark: null,
  visitedLandmarks: new Set(),
  journeyStarted: false,
  modalOpen: false,
  audioPlaying: false,
  audioMuted: false,
  showFinale: false,
  currentImageIndex: 0,
  coupleTarget: null,
  isWalking: false,

  // Sky wishes & fireworks
  releasedLanterns: [],
  triggerFireworks: false,
  wishModalOpen: false,

  startJourney: () => set({ journeyStarted: true }),

  setActiveLandmark: (landmark) => set({ activeLandmark: landmark }),

  openModal: (landmark) => {
    const visited = new Set(get().visitedLandmarks);
    visited.add(landmark.id);
    const allVisited = LANDMARKS.every((l) => visited.has(l.id));
    set({
      activeLandmark: landmark,
      modalOpen: true,
      visitedLandmarks: visited,
      currentImageIndex: 0,
      showFinale: allVisited,
      triggerFireworks: allVisited,
    });
  },

  closeModal: () => set({ modalOpen: false, activeLandmark: null }),

  markVisited: (id) => {
    const visited = new Set(get().visitedLandmarks);
    visited.add(id);
    set({ visitedLandmarks: visited });
  },

  toggleAudio: () => {
    const muted = !get().audioMuted;
    if (audioEl) {
      audioEl.muted = muted;
    }
    set({ audioMuted: muted });
  },

  startAudio: () => {
    if (!audioEl && !get().audioPlaying) {
      audioEl = new Audio(asset("/audio/cornerstone.mp3"));
      audioEl.loop = true;
      audioEl.volume = 0.5;
      audioEl.play()
        .then(() => {
          set({ audioPlaying: true });
        })
        .catch(() => {
          audioEl = null;
        });
    }
  },

  nextImage: () =>
    set((state) => {
      if (!state.activeLandmark) return state;
      const count = state.activeLandmark.images.length;
      return { currentImageIndex: (state.currentImageIndex + 1) % count };
    }),

  prevImage: () =>
    set((state) => {
      if (!state.activeLandmark) return state;
      const count = state.activeLandmark.images.length;
      return {
        currentImageIndex:
          (state.currentImageIndex - 1 + count) % count,
      };
    }),

  reset: () => set({ journeyStarted: false, showFinale: false, triggerFireworks: false }),

  navigateTo: (id) => set({ coupleTarget: id, isWalking: true }),

  arriveAt: (id) => {
    const landmark = LANDMARKS.find((l) => l.id === id);
    if (landmark) {
      get().openModal(landmark);
    }
    set({ coupleTarget: null, isWalking: false });
  },

  releaseWishLantern: (text: string, pos?: [number, number, number]) => {
    const defaultPos: [number, number, number] = [
      (Math.random() - 0.5) * 16,
      2,
      (Math.random() - 0.5) * 16,
    ];
    const newWish: SkyWish = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      position: pos || defaultPos,
      createdAt: Date.now(),
    };
    set((state) => ({
      releasedLanterns: [...state.releasedLanterns, newWish],
      wishModalOpen: false,
    }));
  },

  setTriggerFireworks: (val) => set({ triggerFireworks: val }),
  setWishModalOpen: (open) => set({ wishModalOpen: open }),
}));
