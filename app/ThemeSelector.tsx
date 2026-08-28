'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, SeasonTheme, SEASONS } from './ThemeContext';
import { useLanguage } from './LanguageContext';
import { useSound } from './SoundEffects';
import { LeafIcon, AutumnLeafIcon, MoonIcon, CheckIcon } from './Icons';

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

  const renderSeasonIcon = (id: SeasonTheme, size = 15) => {
    switch (id) {
      case 'summer':
        return <LeafIcon size={size} />;
      case 'autumn':
        return <AutumnLeafIcon size={size} />;
      case 'night':
        return <MoonIcon size={size} />;
    }
  };

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
        <span className="theme-icon-slot">{renderSeasonIcon(theme, 15)}</span>
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
              <span className="theme-option-icon">{renderSeasonIcon(s.id, 16)}</span>
              <span className="theme-option-label">{getSeasonName(s.id)}</span>
              {theme === s.id && <span className="theme-check"><CheckIcon size={13} /></span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
