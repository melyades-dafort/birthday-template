import { useState, useEffect } from 'react';
import { birthdayConfig, memories, type Memory } from '@/data/memories';
import LZString from 'lz-string';

// Helper to encode/decode data for URL sharing
function encodeDataForURL(data: BirthdayData): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(data));
}

function decodeDataFromURL(encoded: string): BirthdayData | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json);
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
    // First, check if there's data in URL parameters (try both new and old formats)
    const urlParams = new URLSearchParams(window.location.search);
    const compressedData = urlParams.get('d'); // New compressed format
    const oldData = urlParams.get('data'); // Old base64 format
    
    if (compressedData) {
      const decoded = decodeDataFromURL(compressedData);
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
        // Continue to localStorage
      }
    }
    
    // Otherwise, load from localStorage
    const saved = localStorage.getItem('birthdayData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Migrate old data structure if needed
        if (parsed.memories && parsed.memories.length > 0) {
          // Check if old structure (with 'caption' instead of 'title' and 'message')
          const firstMemory = parsed.memories[0];
          if (firstMemory.caption !== undefined && firstMemory.title === undefined) {
            // Old structure - needs migration
            console.log('Migrating old birthday data structure...');
            const migratedMemories = memories.map((defaultMem, index) => {
              const oldMem = parsed.memories[index];
              return {
                id: defaultMem.id,
                image: oldMem?.image || defaultMem.image,
                title: defaultMem.title,
                message: defaultMem.message,
              };
            });
            
            setData({
              celebrantName: parsed.celebrantName || birthdayConfig.celebrantName,
              memories: migratedMemories,
              finalMessage: parsed.finalMessage || birthdayConfig.finalMessage,
            });
            return;
          }
        }
        
        setData(parsed);
      } catch (error) {
        console.error('Failed to parse birthday data:', error);
      }
    }
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
