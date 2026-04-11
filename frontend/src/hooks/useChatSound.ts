import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "chat-sound-enabled";

export const useChatSound = () => {
  // Initialize state from localStorage (default to true if null)
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Audio object initialized once on mount
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create the audio object
    audioRef.current = new Audio("/sounds/receive.mp3");
    
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Save changes to localStorage whenever state updates
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(isSoundEnabled));
  }, [isSoundEnabled]);

  const toggleSound = () => {
    setIsSoundEnabled((prev) => !prev);
  };

  const playNotification = async () => {
    if (!isSoundEnabled || !audioRef.current) return;

    try {
      // Set currentTime = 0 to allow rapid successive notifications
      audioRef.current.currentTime = 0;
      
      // Handle the .play() promise safely to avoid "Autoplay" DOM exceptions
      await audioRef.current.play();
    } catch (error) {
      // Silently catch autoplay errors (usually browser policy)
      console.warn("Audio notification blocked by browser autoplay policy:", error);
    }
  };

  return {
    isSoundEnabled,
    toggleSound,
    playNotification,
  };
};
