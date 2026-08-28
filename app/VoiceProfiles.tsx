'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSound } from './SoundEffects';
import { useLanguage } from './LanguageContext';
import { VoiceItem } from './i18n/translations';

interface VoiceProfilesProps {
  voices: VoiceItem[];
}

export default function VoiceProfiles({ voices }: VoiceProfilesProps) {
  const { t } = useLanguage();
  const [selectedVoice, setSelectedVoice] = useState<VoiceItem | null>(null);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playModalOpen, playModalClose, playClick } = useSound();

  const handleOpenModal = (voice: VoiceItem) => {
    playModalOpen();
    setSelectedVoice(voice);
  };

  const handleCloseModal = () => {
    stopPreview();
    playModalClose();
    setSelectedVoice(null);
  };

  // Keep selectedVoice updated if language changes while modal is open
  useEffect(() => {
    if (selectedVoice) {
      const updated = voices.find((v) => v.id === selectedVoice.id);
      if (updated) {
        setSelectedVoice(updated);
      }
    }
  }, [voices]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedVoice) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedVoice]);

  // Stop current audio preview (both HTML5 audio and Web Audio synthesizer)
  const stopPreview = () => {
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // Ignore
      }
      audioCtxRef.current = null;
    }
    setPlayingVoice(null);
  };

  const playVoicePreview = (voice: VoiceItem) => {
    if (playingVoice === voice.name) {
      stopPreview();
      return;
    }

    stopPreview();
    setPlayingVoice(voice.name);

    // If a real audio sample file is provided (e.g. llane_standard.mp3), play it!
    if (voice.audioSample) {
      try {
        const audio = new Audio(voice.audioSample);
        audioElRef.current = audio;
        audio.play().catch(() => {
          setPlayingVoice(null);
        });
        audio.onended = () => {
          setPlayingVoice(null);
          audioElRef.current = null;
        };
        audio.onerror = () => {
          setPlayingVoice(null);
          audioElRef.current = null;
        };
        return;
      } catch {
        // Fallback to synth if audio fails
      }
    }

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    // Distinct character melodic motifs
    const melodyMap: Record<string, { notes: number[]; durations: number[]; baseFreq: number }> = {
      'VIICTOR': {
        notes: [261.63, 329.63, 392.0, 440.0, 523.25], // C4, E4, G4, A4, C5
        durations: [0.22, 0.22, 0.22, 0.28, 0.55],
        baseFreq: 261.63,
      },
      'YOHJI': {
        notes: [196.0, 246.94, 293.66, 329.63, 392.0], // G3, B3, D4, E4, G4
        durations: [0.25, 0.25, 0.25, 0.32, 0.6],
        baseFreq: 196.0,
      },
      'EDDIE': {
        notes: [146.83, 185.0, 220.0, 293.66, 369.99], // D3, F#3, A3, D4, F#4
        durations: [0.2, 0.2, 0.22, 0.26, 0.55],
        baseFreq: 146.83,
      },
      'MIZUKI': {
        notes: [349.23, 440.0, 523.25, 659.25, 880.0], // F4, A4, C5, E5, A5
        durations: [0.18, 0.18, 0.2, 0.24, 0.5],
        baseFreq: 349.23,
      },
      'LLANE CROW': {
        notes: [130.81, 196.0, 261.63, 311.13, 392.0], // C3, G3, C4, D#4, G4
        durations: [0.28, 0.28, 0.28, 0.35, 0.65],
        baseFreq: 130.81,
      },
    };

    const config = melodyMap[voice.name] || melodyMap['VIICTOR'];
    let startTime = ctx.currentTime + 0.05;

    config.notes.forEach((freq, idx) => {
      const dur = config.durations[idx];

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(freq, startTime);
      osc2.frequency.setValueAtTime(freq * 1.002, startTime);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 2.2, startTime);
      filter.Q.setValueAtTime(3.5, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + dur);
      osc2.stop(startTime + dur);

      startTime += dur * 0.92;
    });

    const totalDuration = (startTime - ctx.currentTime) * 1000;
    timeoutRef.current = setTimeout(() => {
      setPlayingVoice(null);
    }, totalDuration);
  };

  return (
    <>
      <div className="voice-profiles">
        {voices.map((voice, idx) => (
          <article 
            className="profile-card" 
            key={voice.id || voice.name}
            id={`voice-${voice.id || voice.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <button 
              className="profile-image-btn" 
              onClick={() => handleOpenModal(voice)}
              style={{ '--accent': voice.accent } as React.CSSProperties} 
              aria-label={`${t.voicesSection.viewDetails}: ${voice.name}`}
            >
              <span>0{idx + 1}</span>
              <img src={voice.image} alt={voice.name} />
              <div className="profile-image-hover-indicator">
                <span>{t.voicesSection.viewDetails}</span>
              </div>
            </button>
            <div className="profile-copy">
              <p className="profile-meta">{voice.meta}</p>
              <div className="profile-name-row">
                <h3>{voice.name}</h3>
                <button
                  className={`voice-preview-btn ${playingVoice === voice.name ? 'playing' : ''}`}
                  onClick={() => playVoicePreview(voice)}
                  aria-label={playingVoice === voice.name ? `${t.voicesSection.stopAudio} (${voice.name})` : `${t.voicesSection.listenSample} (${voice.name})`}
                  title={playingVoice === voice.name ? t.voicesSection.stopAudio : t.voicesSection.listenSample}
                >
                  <span className="preview-icon">{playingVoice === voice.name ? '❚❚' : '▶'}</span>
                  <span>{playingVoice === voice.name ? t.voicesSection.playing : t.voicesSection.listenSample}</span>
                  {playingVoice === voice.name && (
                    <span className="mini-equalizer">
                      <i /><i /><i />
                    </span>
                  )}
                </button>
              </div>
              <p>{voice.detail}</p>
              <div className="tags">
                {voice.tags.map(tag => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="profile-links">
                <button 
                  className="profile-detail-trigger"
                  onClick={() => handleOpenModal(voice)}
                >
                  {t.voicesSection.viewDetails}
                </button>
                <a href={voice.owner} target="_blank" rel="noreferrer">
                  {t.voicesSection.modal.creatorChannel}: {voice.ownerName}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal / Card Details Overlay */}
      {selectedVoice && (() => {
        const specs = selectedVoice.specs;
        return (
          <div 
            className="modal-overlay" 
            onClick={handleCloseModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            data-lenis-prevent="true"
          >
            <div 
              className="modal-card" 
              onClick={(e) => e.stopPropagation()}
              style={{ '--accent': selectedVoice.accent } as React.CSSProperties}
              data-lenis-prevent="true"
            >
              <button 
                className="modal-close-btn" 
                onClick={handleCloseModal}
                aria-label={t.voicesSection.modal.close}
              >
                ✕
              </button>
              
              <div className="modal-grid">
                <div className="modal-image-panel">
                  <img src={selectedVoice.image} alt={selectedVoice.name} />
                </div>
                
                <div className="modal-info-panel" data-lenis-prevent="true">
                  <p className="modal-meta">{selectedVoice.meta}</p>
                  
                  <div className="modal-header-flex">
                    <h2 id="modal-title" className="modal-title">{selectedVoice.name}</h2>
                    <button
                      className={`voice-preview-btn large ${playingVoice === selectedVoice.name ? 'playing' : ''}`}
                      onClick={() => playVoicePreview(selectedVoice)}
                    >
                      <span className="preview-icon">{playingVoice === selectedVoice.name ? '❚❚' : '▶'}</span>
                      <span>{playingVoice === selectedVoice.name ? t.voicesSection.playing : t.voicesSection.listenSample}</span>
                      {playingVoice === selectedVoice.name && (
                        <span className="mini-equalizer">
                          <i /><i /><i />
                        </span>
                      )}
                    </button>
                  </div>
                  
                  <div className="modal-divider" />
                  
                  <p className="modal-detail-text">{selectedVoice.detail}</p>
                  
                  {specs && (
                    <div className="modal-specs">
                      <div className="spec-item">
                        <span className="spec-label">{t.voicesSection.modal.species}</span>
                        <span className="spec-val">{specs.species}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">{t.voicesSection.modal.engines}</span>
                        <span className="spec-val">{specs.engines}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">{t.voicesSection.modal.languages}</span>
                        <span className="spec-val">{specs.languages}</span>
                      </div>
                      {specs.range && (
                        <div className="spec-item">
                          <span className="spec-label">{t.voicesSection.modal.range}</span>
                          <span className="spec-val">{specs.range}</span>
                        </div>
                      )}
                      <div className="spec-desc-block">
                        <span className="spec-label">{t.voicesSection.modal.bio}</span>
                        <p className="spec-desc-text">{specs.description}</p>
                      </div>
                    </div>
                  )}

                  <div className="modal-footer-tags">
                    {selectedVoice.tags.map(tag => (
                      <span key={tag} className="modal-tag">{tag}</span>
                    ))}
                  </div>

                  <div className="modal-actions">
                    {specs?.downloadUrl && (
                      <a 
                        href={specs.downloadUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="modal-action-btn download-btn"
                        onClick={playClick}
                      >
                        {t.voicesSection.modal.downloadBank}
                      </a>
                    )}
                    <a 
                      href={selectedVoice.profile} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="modal-action-btn primary"
                    >
                      {t.voicesSection.modal.officialWiki}
                    </a>
                    <a 
                      href={selectedVoice.owner} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="modal-action-btn secondary"
                    >
                      {t.voicesSection.modal.creatorChannel} ({selectedVoice.ownerName})
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
