'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playHover: () => void;
  playClick: () => void;
  playCopy: () => void;
  playCardSelect: () => void;
  playModalOpen: () => void;
  playModalClose: () => void;
  playWhoosh: () => void;
}

const SoundContext = createContext<SoundContextType>({
  isMuted: false,
  toggleMute: () => { },
  playHover: () => { },
  playClick: () => { },
  playCopy: () => { },
  playCardSelect: () => { },
  playModalOpen: () => { },
  playModalClose: () => { },
  playWhoosh: () => { },
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastHoverTimeRef = useRef<number>(0);

  // Initialize or get AudioContext on first user interaction
  const getAudioContext = (): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  useEffect(() => {
    const saved = localStorage.getItem('pomar-sound-muted');
    if (saved !== null) {
      setIsMuted(saved === 'true');
    }
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem('pomar-sound-muted', String(next));
      return next;
    });
  };

  // Subtle warm harmonic chime on hover (pentatonic scale notes)
  const hoverNotes = [523.25, 587.33, 659.25, 783.99, 880.0]; // C5, D5, E5, G5, A5
  const hoverIndexRef = useRef(0);

  const playHover = () => {
    if (isMuted) return;
    const now = Date.now();
    // Throttle hover sounds so rapid mouse moves stay soft and pleasing
    if (now - lastHoverTimeRef.current < 65) return;
    lastHoverTimeRef.current = now;

    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq = hoverNotes[hoverIndexRef.current % hoverNotes.length];
      hoverIndexRef.current = (hoverIndexRef.current + 1) % hoverNotes.length;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Very soft, gentle envelope
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio playback safely ignored if blocked
    }
  };

  // Soft wooden click/tap
  const playClick = () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignore
    }
  };

  // Crisp high double-blip when copying
  const playCopy = () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      [880, 1318.51].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.045);

        gain.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.045 + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.045);
        osc.stop(ctx.currentTime + i * 0.045 + 0.12);
      });
    } catch {
      // Ignore
    }
  };

  // Resonant card select sound (warm kalimba/marimba pluck)
  const playCardSelect = () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      [523.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.03);

        gain.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.03 + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.03);
        osc.stop(ctx.currentTime + i * 0.03 + 0.18);
      });
    } catch {
      // Ignore
    }
  };

  // Ascending gentle chord when opening modal
  const playModalOpen = () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      [440, 554.37, 659.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.04);

        gain.gain.setValueAtTime(0.035, ctx.currentTime + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.04 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.04);
        osc.stop(ctx.currentTime + i * 0.04 + 0.22);
      });
    } catch {
      // Ignore
    }
  };

  // Soft descending tone when closing modal
  const playModalClose = () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      [659.25, 440].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.04);

        gain.gain.setValueAtTime(0.03, ctx.currentTime + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.04 + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.04);
        osc.stop(ctx.currentTime + i * 0.04 + 0.15);
      });
    } catch {
      // Ignore
    }
  };

  // Airy swish
  const playWhoosh = () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignore
    }
  };

  // Global event delegation for interactive hover/click sounds
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a, button, .pokemon-card, .project-row, .carousel-arrow-btn, .highlight-card');
      if (target) {
        playHover();
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a, button, .pokemon-card, .project-row, .carousel-arrow-btn');
      if (target) {
        playClick();
      }
    };

    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('click', handleClick);
    };
  }, [isMuted]);

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        playHover,
        playClick,
        playCopy,
        playCardSelect,
        playModalOpen,
        playModalClose,
        playWhoosh,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);

export function SoundToggle() {
  const { isMuted, toggleMute } = useSound();

  return (
    <button
      onClick={toggleMute}
      className="sound-toggle-btn"
      aria-label={isMuted ? 'Ativar efeitos sonoros' : 'Desativar efeitos sonoros'}
      title={isMuted ? 'Ativar efeitos sonoros' : 'Desativar efeitos sonoros'}
    >
      <span className="sound-toggle-icon" aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center' }}>
        {isMuted ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </span>
      <span className="sound-toggle-label">{isMuted ? 'Mudo' : 'Som'}</span>
    </button>
  );
}
