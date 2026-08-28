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
      <span>↑</span>
    </button>
  );
}
