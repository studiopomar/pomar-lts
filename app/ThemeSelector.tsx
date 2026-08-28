'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, SeasonTheme, SEASONS } from './ThemeContext';
import { useLanguage } from './LanguageContext';
import { useSound } from './SoundEffects';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const { language } = useLanguage();
  const { playClick } = useSound();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getSeasonName = (id: SeasonTheme) => {
    switch (id) {
      case 'summer':
        if (language === 'pt') return 'Verão';
        if (language === 'ja') return '夏 (Verão)';
        if (language === 'ru') return 'Лето';
        if (language === 'ar') return 'الصيف';
        return 'Summer';
      case 'autumn':
        if (language === 'pt') return 'Outono';
        if (language === 'ja') return '秋 (Outono)';
        if (language === 'ru') return 'Осень';
        if (language === 'ar') return 'الخريف';
        return 'Autumn';
      case 'night':
        if (language === 'pt') return 'Noite';
        if (language === 'ja') return '夜 (Noite)';
        if (language === 'ru') return 'Ночь';
        if (language === 'ar') return 'الليل';
        return 'Night';
    }
  };

  const currentSeason = SEASONS.find((s) => s.id === theme) || SEASONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTheme = (newTheme: SeasonTheme) => {
    playClick();
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="theme-selector-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className={`theme-selector-btn ${isOpen ? 'active' : ''}`}
        onClick={() => {
          playClick();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
        aria-label="Selecionar ambiente e estação do Pomar"
        title="Ambiente do Pomar (Estações)"
      >
        <span className="theme-emoji">{currentSeason.emoji}</span>
        <span className="theme-name">{getSeasonName(theme)}</span>
        <span className={`theme-arrow ${isOpen ? 'open' : ''}`}>▾</span>
      </button>

      {isOpen && (
        <div className="theme-dropdown" role="menu">
          {SEASONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`theme-option ${theme === s.id ? 'selected' : ''}`}
              onClick={() => handleSelectTheme(s.id)}
              role="menuitem"
            >
              <span className="theme-option-emoji">{s.emoji}</span>
              <span className="theme-option-label">{getSeasonName(s.id)}</span>
              {theme === s.id && <span className="theme-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
