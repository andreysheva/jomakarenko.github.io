export interface LandmarkData {
  id: string;
  name: string;
  subtitle?: string;
  position: [number, number, number];
  cameraOffset: [number, number, number];
  description: string;
  images: string[];
  color: string;
  buildingType: "hotel" | "shop" | "sports" | "condo" | "bar" | "restaurant" | "generic";
  locked?: boolean;
}

export interface SkyWish {
  id: string;
  text: string;
  position: [number, number, number];
  createdAt: number;
}

export interface LandmarkState {
  landmarks: LandmarkData[];
  activeLandmark: LandmarkData | null;
  visitedLandmarks: Set<string>;
  journeyStarted: boolean;
  modalOpen: boolean;
  audioPlaying: boolean;
  audioMuted: boolean;
  showFinale: boolean;
  currentImageIndex: number;

  // Walking / navigation
  coupleTarget: string | null;
  isWalking: boolean;

  // Sky Wishes & Fireworks
  releasedLanterns: SkyWish[];
  triggerFireworks: boolean;
  wishModalOpen: boolean;

  startAudio: () => void;
  startJourney: () => void;
  setActiveLandmark: (landmark: LandmarkData | null) => void;
  openModal: (landmark: LandmarkData) => void;
  closeModal: () => void;
  markVisited: (id: string) => void;
  toggleAudio: () => void;
  nextImage: () => void;
  prevImage: () => void;
  reset: () => void;

  navigateTo: (id: string) => void;
  arriveAt: (id: string) => void;

  releaseWishLantern: (text: string, pos?: [number, number, number]) => void;
  setTriggerFireworks: (val: boolean) => void;
  setWishModalOpen: (open: boolean) => void;
}
