export const birthdayConfig = {
  celebrantName: "Amelia",
  senderName: "With love",
  openingMessage:
    "Today is all about celebrating the beautiful person you are.",
  finalMessage:
    "May this new chapter of your life be filled with beautiful memories, exciting adventures, peaceful days, and dreams slowly becoming reality. Never forget how special you are and how much happiness you bring into the lives of the people around you.",
};

export interface Memory {
  id: number;
  title: string;
  shortTitle: string;
  image: string;
  date: string;
  message: string;
  /** Deterministic 3D placement */
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  floatSpeed: number;
  floatIntensity: number;
}

// Deterministic exploded positions (x, y, z) with rotations
export const memories: Memory[] = [
  {
    id: 1,
    title: "A Little Birthday Surprise",
    shortTitle: "Surprise",
    image: "/memories/image1.jpg",
    date: "A special day",
    message:
      "I wanted to create something a little different for you. Something you could open, explore, and hopefully smile at.",
    position: [-2.4, 1.8, 1.0],
    rotation: [0.05, 0.35, -0.12],
    scale: 1,
    floatSpeed: 0.6,
    floatIntensity: 0.15,
  },
  {
    id: 2,
    title: "My Favorite Person",
    shortTitle: "Favorite Person",
    image: "/memories/image2.jpg",
    date: "Always",
    message:
      "There are people who somehow make ordinary days feel more meaningful. You are one of those people.",
    position: [2.6, 2.1, 0.6],
    rotation: [-0.08, -0.42, 0.1],
    scale: 1.05,
    floatSpeed: 0.5,
    floatIntensity: 0.18,
  },
  {
    id: 3,
    title: "Our Favorite Memories",
    shortTitle: "Memories",
    image: "/memories/image3.jpg",
    date: "Good times",
    message:
      "Some moments become unforgettable not because of where we were, but because of who we shared them with.",
    position: [-2.0, -1.4, 1.6],
    rotation: [0.1, 0.28, 0.15],
    scale: 0.95,
    floatSpeed: 0.7,
    floatIntensity: 0.12,
  },
  {
    id: 4,
    title: "The Little Things About You",
    shortTitle: "Little Things",
    image: "/memories/image4.jpg",
    date: "Every day",
    message:
      "Sometimes it is the smallest things that make someone truly special.",
    position: [2.2, -1.6, 1.4],
    rotation: [-0.05, -0.3, -0.2],
    scale: 1,
    floatSpeed: 0.55,
    floatIntensity: 0.16,
  },
  {
    id: 5,
    title: "Forever Grateful",
    shortTitle: "Grateful",
    image: "/memories/image5.jpg",
    date: "Forever",
    message:
      "Thank you for the laughter, the conversations, and the memories that became more meaningful because you were there.",
    position: [-3.0, 0.3, -1.2],
    rotation: [0.15, 0.55, 0.05],
    scale: 0.9,
    floatSpeed: 0.45,
    floatIntensity: 0.2,
  },
  {
    id: 6,
    title: "Dream Big",
    shortTitle: "Dream Big",
    image: "/memories/image6.jpg",
    date: "The future",
    message:
      "I hope you continue chasing every dream that makes your heart excited.",
    position: [3.2, 0.6, -1.0],
    rotation: [-0.1, -0.5, -0.08],
    scale: 0.92,
    floatSpeed: 0.65,
    floatIntensity: 0.14,
  },
  {
    id: 7,
    title: "Pure Happiness",
    shortTitle: "Happiness",
    image: "/memories/image7.jpg",
    date: "Always smile",
    message:
      "I hope life gives you thousands of reasons to smile and countless moments of genuine happiness.",
    position: [0.4, 3.0, -0.6],
    rotation: [0.08, 0.12, 0.06],
    scale: 1.08,
    floatSpeed: 0.5,
    floatIntensity: 0.22,
  },
  {
    id: 8,
    title: "Another Beautiful Year",
    shortTitle: "New Chapter",
    image: "/memories/image8.jpg",
    date: "This year",
    message:
      "Another year means another beautiful chapter waiting to be filled with stories, adventures, and dreams.",
    position: [-0.4, -2.6, 1.2],
    rotation: [-0.12, -0.15, 0.18],
    scale: 1.02,
    floatSpeed: 0.6,
    floatIntensity: 0.15,
  },
  {
    id: 9,
    title: "Little Adventures",
    shortTitle: "Adventures",
    image: "/memories/image9.jpg",
    date: "Every trip",
    message:
      "Every small adventure with you turns into a memory worth keeping.",
    position: [-2.8, 2.6, -1.8],
    rotation: [0.06, 0.6, -0.05],
    scale: 0.85,
    floatSpeed: 0.55,
    floatIntensity: 0.17,
  },
  {
    id: 10,
    title: "Beautiful Chaos",
    shortTitle: "Beautiful Chaos",
    image: "/memories/image10.jpg",
    date: "Us",
    message:
      "Life with you is beautifully chaotic, and I would not trade a moment of it.",
    position: [3.0, 2.4, -1.8],
    rotation: [-0.06, -0.6, 0.08],
    scale: 0.88,
    floatSpeed: 0.5,
    floatIntensity: 0.19,
  },
  {
    id: 11,
    title: "Lovely Days",
    shortTitle: "Lovely Days",
    image: "/memories/image11.jpg",
    date: "Sunshine",
    message: "Some days are lovely just because you were part of them.",
    position: [1.6, -3.0, 0.3],
    rotation: [0.2, -0.1, -0.15],
    scale: 0.98,
    floatSpeed: 0.6,
    floatIntensity: 0.13,
  },
  {
    id: 12,
    title: "Forever Us",
    shortTitle: "Forever Us",
    image: "/memories/image12.jpg",
    date: "Always",
    message: "Some things are meant to be. Us, always, is one of them.",
    position: [-1.6, -3.2, 0.2],
    rotation: [-0.2, 0.1, 0.12],
    scale: 1,
    floatSpeed: 0.55,
    floatIntensity: 0.15,
  },
];