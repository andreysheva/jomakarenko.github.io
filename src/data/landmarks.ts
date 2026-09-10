import type { LandmarkData } from "../types";
import { asset } from "../lib/assets";

export const LANDMARKS: LandmarkData[] = [
  {
    id: "fat-buds-sukhumvit",
    name: "Fat Buds Sukhumvit",
    subtitle: "Our Favorite Weed Shop",
    position: [-58, 0, -28],
    cameraOffset: [0, 6, 12],
    description:
      "Our absolute favorite weed shop in Bangkok! Remember the cozy lounge, warm neon lights, and amazing vibes every time we stopped by to relax together?",
    images: [asset("/images/fatbuds.jpeg")],
    color: "#e76f51",
    buildingType: "shop",
  },
  {
    id: "black-cabin-bar",
    name: "Black Cabin Bar",
    subtitle: "Our First Date & Live Music",
    position: [-42, 0, -50],
    cameraOffset: [0, 6, 12],
    description:
      "Where it all began! Our magical first date — incredible dark cozy atmosphere, live indie/jazz music, and that nervous excitement of falling for each other.",
    images: [asset("/images/black_cabin.webp")],
    color: "#4a3b4e",
    buildingType: "bar",
  },
  {
    id: "la-petite-salil",
    name: "La Petite Salil",
    subtitle: "Our First Hotel Together",
    position: [-14, 0, -56],
    cameraOffset: [0, 6.2, 12],
    description:
      "The romantic boutique haven of our very first hotel stay together! Charming French-Siamese architecture, marble courtyard, and unforgettable morning coffee.",
    images: [asset("/images/le-petit-salil.jpg"), asset("/images/le-petit-salil2.jpeg")],
    color: "#d4a373",
    buildingType: "hotel",
  },
  {
    id: "shine-hotel",
    name: "Shine Hotel",
    subtitle: "Rooftop Memory & Guard KAAAAP!",
    position: [18, 0, -52],
    cameraOffset: [0, 6.5, 12],
    description:
      "That unforgettable rooftop evening listening to tropical rain! And of course, the legendary guard who greeted us with the most enthusiastic 'KAAAAP!' every single time we walked through the gates.",
    images: [asset("/images/shine.jpeg")],
    color: "#6d597a",
    buildingType: "hotel",
  },
  {
    id: "lebua-hotel",
    name: "Lebua Hotel Sky Bar",
    subtitle: "51st Floor View & Mirror Suite",
    position: [52, 0, -32],
    cameraOffset: [0, 14, 18],
    description:
      "The breathless 51st floor apartment with crazy panoramic views of Bangkok and mirrors everywhere! Watching the golden sunset skyline over the Chao Phraya River from way up high.",
    images: [asset("/images/lebua.jpg")],
    color: "#355070",
    buildingType: "hotel",
  },
  {
    id: "slow-burn-phrom-phong",
    name: "Slow Burn Phrom Phong",
    subtitle: "Work Date & Monkey Massage",
    position: [68, 0, 8],
    cameraOffset: [0, 6, 12],
    description:
      "The last weed shop we visited and worked together at! Right in front of that famous 'monkey massage' place — such sweet memories of co-working side by side in Phrom Phong.",
    images: [asset("/images/slow_burn.jfif")],
    color: "#2a9d8f",
    buildingType: "shop",
  },
  {
    id: "park-origin-phrom-phong",
    name: "Park Origin Phrom Phong",
    subtitle: "Our Last Condo & Hipster Neighbor",
    position: [56, 0, 44],
    cameraOffset: [0, 11, 16],
    description:
      "Our home for a month and a half! Remember getting noise complaints and that legendary hipster neighbor who told on us? The best 6 weeks living together in Bangkok.",
    images: [asset("/images/park_origin.jfif")],
    color: "#e07a5f",
    buildingType: "condo",
  },
  {
    id: "dreamloft",
    name: "Dreamloft Restaurant",
    subtitle: "Best Food & Beautiful Interior",
    position: [24, 0, 58],
    cameraOffset: [0, 6.5, 12],
    description:
      "Hands down the best food in Bangkok with the most stunning interior design! Glass roof, hanging flora, candlelit dinners, and dishes we still dream about.",
    images: [asset("/images/Dreamloft.jpg")],
    color: "#e76f51",
    buildingType: "restaurant",
  },
  {
    id: "secret-chinese-bar",
    name: "Secret Speakeasy (龍寶)",
    subtitle: "Best Cocktails & 'I hope you so rich' Sticker",
    position: [-12, 0, 54],
    cameraOffset: [0, 6, 12],
    description:
      "Hidden behind a secret Chinese doorway with the best cocktails in the world! Remember finding the legendary 'I hope you so rich' sticker pasted on the brick wall?",
    images: [asset("/images/chinese_cocktails.jpg")],
    color: "#e63946",
    buildingType: "bar",
  },
  {
    id: "badminton",
    name: "Badminton Court",
    subtitle: "No AC Sweatfest!",
    position: [-44, 0, 36],
    cameraOffset: [0, 5.8, 12],
    description:
      "We had so much fun playing competitive badminton matches! Even though there was no AC and we sweated way too much, your energy and laughter made it unforgettable.",
    images: [asset("/images/badminton.jpg")],
    color: "#f4a261",
    buildingType: "sports",
  },
  {
    id: "tennis",
    name: "Bangkok Tennis Club",
    subtitle: "🔒 Locked Event",
    position: [-62, 0, 6],
    cameraOffset: [0, 6, 12],
    description:
      "🔒 This romantic memory is locked! Complete all other landmark visits to unlock this special future date.",
    images: [asset("/images/fatbuds-2.jpg")],
    color: "#9b5de5",
    buildingType: "sports",
    locked: true,
  },
];
