'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { Language } from './i18n/translations';
import { useSound } from './SoundEffects';

const languagesList: Array<{ code: Language; label: string; flag: string; nativeName: string }> = [
  { code: 'pt', label: 'Português', flag: '🇧🇷', nativeName: 'Português (BR)' },
  { code: 'en', label: 'English', flag: '🇺🇸', nativeName: 'English (US)' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', nativeName: 'العربية (AR)' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺', nativeName: 'Русский (RU)' },
  { code: 'ja', label: '日本語', flag: '🇯🇵', nativeName: '日本語 (JA)' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { playClick, playWhoosh } = useSound();

  const currentLang = languagesList.find((l) => l.code === language) || languagesList[0];

  const handleToggle = () => {
    playClick();
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (code: Language) => {
    playWhoosh();
    setLanguage(code);
    setIsOpen(false);
  };

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="lang-selector-container" ref={dropdownRef}>
      <button
        type="button"
        className={`lang-selector-btn ${isOpen ? 'active' : ''}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Selecionar idioma / Select language"
      >
        <span className="lang-flag">{currentLang.flag}</span>
        <span className="lang-code">{currentLang.code.toUpperCase()}</span>
        <svg
          className={`lang-chevron ${isOpen ? 'open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="lang-dropdown" role="listbox">
          <div className="lang-dropdown-header">
            <span>Selecione o idioma</span>
          </div>
          {languagesList.map((item) => {
            const isSelected = item.code === language;
            return (
              <button
                key={item.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`lang-dropdown-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(item.code)}
              >
                <span className="item-flag">{item.flag}</span>
                <span className="item-label">{item.nativeName}</span>
                {isSelected && (
                  <span className="item-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
