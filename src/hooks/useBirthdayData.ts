import { useState, useEffect } from 'react';
import { birthdayConfig, memories, type Memory } from '@/data/memories';
import LZString from 'lz-string';

// Helper to encode/decode data for URL sharing
function encodeDataForURL(data: BirthdayData): string {
  return LZString.compressToBase64(JSON.stringify(data));
}

function decodeDataFromURL(encoded: string): BirthdayData | null {
  try {
    // Try base64 compression (newest format)
    const json = LZString.decompressFromBase64(encoded);
    if (json) {
      return JSON.parse(json);
    }
    
    // Fallback to URI component compression
    const json2 = LZString.decompressFromEncodedURIComponent(encoded);
    if (json2) {
      return JSON.parse(json2);
    }
    
    return null;
  } catch {
    return null;
  }
}

interface BirthdayData {
  celebrantName: string;
  backgroundMusic?: string;
  memories: Array<{
    id: number;
    image: string;
    title: string;
    message: string;
  }>;
  finalMessage: string;
}

// Static intro messages that cannot be changed
const STATIC_INTRO = {
  message: 'A little birthday surprise is waiting for you 🎀',
  subtitle: 'Ready to open your gift?',
};

export function useBirthdayData() {
  const [data, setData] = useState<BirthdayData>({
    celebrantName: birthdayConfig.celebrantName,
    backgroundMusic: undefined,
    memories: memories.map(m => ({
      id: m.id,
      image: m.image,
      title: m.title,
      message: m.message,
    })),
    finalMessage: birthdayConfig.finalMessage,
  });

  useEffect(() => {
    // Only load from URL parameters - never from localStorage
    // This ensures the template always shows defaults unless opened via a shareable link
    const urlParams = new URLSearchParams(window.location.search);
    const compressedData = urlParams.get('d'); // Compressed format
    const oldData = urlParams.get('data'); // Old base64 format
    
    if (compressedData) {
      const decoded = decodeDataFromURL(decodeURIComponent(compressedData));
      if (decoded) {
        setData(decoded);
        return;
      }
    }
    
    // Fallback to old format for backwards compatibility
    if (oldData) {
      try {
        const json = decodeURIComponent(atob(oldData));
        const parsed = JSON.parse(json);
        setData(parsed);
        return;
      } catch {
        // Use defaults
      }
    }
    
    // No URL data = show default template (no localStorage)
  }, []);

  // Merge with full memory data for complete Memory objects
  const fullMemories: Memory[] = memories.map((defaultMemory) => {
    const customMemory = data.memories.find(m => m.id === defaultMemory.id);
    if (customMemory) {
      const title = customMemory.title || defaultMemory.title;
      const message = customMemory.message || defaultMemory.message;
      return {
        ...defaultMemory,
        image: customMemory.image,
        title: title,
        message: message,
        shortTitle: title.split(' ').slice(0, 2).join(' '),
      };
    }
    return defaultMemory;
  });

  return {
    celebrantName: data.celebrantName,
    introMessage: STATIC_INTRO.message,
    introSubtitle: STATIC_INTRO.subtitle,
    memories: fullMemories,
    finalMessage: data.finalMessage,
    backgroundMusic: data.backgroundMusic || '/audio/birthday-ambient.mp3', // Default to Kabisado
    // Export function to generate shareable link
    generateShareableLink: () => {
      const encoded = encodeDataForURL(data);
      const baseUrl = window.location.origin;
      return `${baseUrl}/?data=${encoded}`;
    },
  };
}
