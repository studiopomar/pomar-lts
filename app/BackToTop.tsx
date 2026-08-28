'use client';

import React, { useEffect, useState } from 'react';
import { useSound } from './SoundEffects';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { playClick, playWhoosh } = useSound();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 380) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    playClick();
    playWhoosh();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`back-to-top-btn ${isVisible ? 'visible' : ''}`}
      aria-label="Voltar ao topo da página"
      title="Voltar ao topo"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  );
}
