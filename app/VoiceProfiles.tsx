'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSound } from './SoundEffects';
import { useLanguage } from './LanguageContext';
import { VoiceItem } from './i18n/translations';
import FloatingAudioPlayer from './FloatingAudioPlayer';

interface VoiceProfilesProps {
  voices: VoiceItem[];
}

export default function VoiceProfiles({ voices }: VoiceProfilesProps) {
  const { t } = useLanguage();
  const [selectedVoice, setSelectedVoice] = useState<VoiceItem | null>(null);
  
  // Audio playback and floating player state
  const [activeAudioVoice, setActiveAudioVoice] = useState<VoiceItem | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const { playModalOpen, playModalClose } = useSound();

  const handleOpenModal = (voice: VoiceItem) => {
    playModalOpen();
    setSelectedVoice(voice);
  };

  const handleCloseModal = () => {
    playModalClose();
    setSelectedVoice(null);
  };

  // Keep selectedVoice and activeAudioVoice updated if language changes
  useEffect(() => {
    if (selectedVoice) {
      const updated = voices.find((v) => v.id === selectedVoice.id);
      if (updated) {
        setSelectedVoice(updated);
      }
    }
    if (activeAudioVoice) {
      const updatedActive = voices.find((v) => v.id === activeAudioVoice.id);
      if (updatedActive) {
        setActiveAudioVoice(updatedActive);
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioElRef.current) {
        audioElRef.current.pause();
        audioElRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

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
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // Ignore
      }
      audioCtxRef.current = null;
    }
    setIsPlayingAudio(false);
    setIsPlayerVisible(false);
  };

  const playVoicePreview = (voice: VoiceItem) => {
    // If the same voice is already loaded
    if (activeAudioVoice?.id === voice.id && isPlayerVisible) {
      if (isPlayingAudio) {
        if (audioElRef.current) {
          audioElRef.current.pause();
          setIsPlayingAudio(false);
          return;
        } else {
          stopPreview();
          return;
        }
      } else {
        if (audioElRef.current) {
          audioElRef.current.play().catch(() => {});
          setIsPlayingAudio(true);
          return;
        }
      }
    }

    // Stop ongoing audio cleanly without unmounting floating player
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }

    // Switch active voice immediately (smoothly transitions colors via CSS)
    setActiveAudioVoice(voice);
    setIsPlayingAudio(true);
    setIsPlayerVisible(true);
    setCurrentTime(0);
    setProgress(0);
    setDuration(0);

    // If real audio sample file is provided, play it!
    if (voice.audioSample) {
      try {
        const audio = new Audio(voice.audioSample);
        audioElRef.current = audio;

        audio.ontimeupdate = () => {
          if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration);
            setProgress((audio.currentTime / audio.duration) * 100);
          }
        };

        audio.onloadedmetadata = () => {
          if (audio.duration && !isNaN(audio.duration)) {
            setDuration(audio.duration);
          }
        };

        audio.onplay = () => {
          setIsPlayingAudio(true);
        };

        audio.onpause = () => {
          setIsPlayingAudio(false);
        };

        audio.onended = () => {
          setIsPlayingAudio(false);
          setProgress(100);
          if (audio.duration) setCurrentTime(audio.duration);
          // Graceful fade out after track finishes
          timeoutRef.current = setTimeout(() => {
            setIsPlayerVisible(false);
            audioElRef.current = null;
          }, 450);
        };

        audio.onerror = () => {
          setIsPlayingAudio(false);
          setIsPlayerVisible(false);
          audioElRef.current = null;
        };

        audio.play().catch(() => {
          setIsPlayingAudio(false);
          setIsPlayerVisible(false);
          audioElRef.current = null;
        });

        return;
      } catch {
        // Fallback to synth
      }
    }

    // Web Audio Synthesizer Fallback
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    const melodyMap: Record<string, { notes: number[]; durations: number[]; baseFreq: number }> = {
      'VIICTOR': {
        notes: [261.63, 329.63, 392.0, 440.0, 523.25],
        durations: [0.22, 0.22, 0.22, 0.28, 0.55],
        baseFreq: 261.63,
      },
      'YOHJI': {
        notes: [196.0, 246.94, 293.66, 329.63, 392.0],
        durations: [0.25, 0.25, 0.25, 0.32, 0.6],
        baseFreq: 196.0,
      },
      'EDDIE': {
        notes: [146.83, 185.0, 220.0, 293.66, 369.99],
        durations: [0.2, 0.2, 0.22, 0.26, 0.55],
        baseFreq: 146.83,
      },
      'MIZUKI': {
        notes: [349.23, 440.0, 523.25, 659.25, 880.0],
        durations: [0.18, 0.18, 0.2, 0.24, 0.5],
        baseFreq: 349.23,
      },
      'LLANE CROW': {
        notes: [130.81, 196.0, 261.63, 311.13, 392.0],
        durations: [0.28, 0.28, 0.28, 0.35, 0.65],
        baseFreq: 130.81,
      },
      'KODAMA KITO': {
        notes: [164.81, 196.0, 246.94, 293.66, 329.63],
        durations: [0.22, 0.22, 0.24, 0.28, 0.55],
        baseFreq: 164.81,
      },
    };

    const config = melodyMap[voice.name] || melodyMap[voice.id] || melodyMap['KODAMA KITO'] || melodyMap['VIICTOR'];
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

    const totalSeconds = startTime - ctx.currentTime;
    setDuration(totalSeconds);

    const startPerf = performance.now();
    const animTick = (now: number) => {
      const elapsed = (now - startPerf) / 1000;
      setCurrentTime(Math.min(elapsed, totalSeconds));
      setProgress(Math.min((elapsed / totalSeconds) * 100, 100));

      if (elapsed < totalSeconds) {
        animFrameRef.current = requestAnimationFrame(animTick);
      }
    };
    animFrameRef.current = requestAnimationFrame(animTick);

    const totalDuration = totalSeconds * 1000;
    timeoutRef.current = setTimeout(() => {
      setIsPlayingAudio(false);
      setProgress(100);
      setCurrentTime(totalSeconds);
      timeoutRef.current = setTimeout(() => {
        setIsPlayerVisible(false);
      }, 450);
    }, totalDuration);
  };

  const handleTogglePlayer = () => {
    if (!activeAudioVoice) return;
    if (audioElRef.current) {
      if (audioElRef.current.paused) {
        audioElRef.current.play().catch(() => {});
        setIsPlayingAudio(true);
      } else {
        audioElRef.current.pause();
        setIsPlayingAudio(false);
      }
    } else {
      if (isPlayingAudio) {
        stopPreview();
      } else {
        playVoicePreview(activeAudioVoice);
      }
    }
  };

  const handleSeekPlayer = (percentage: number) => {
    if (audioElRef.current && audioElRef.current.duration) {
      const target = percentage * audioElRef.current.duration;
      audioElRef.current.currentTime = target;
      setCurrentTime(target);
      setProgress(percentage * 100);
    }
  };

  const handlePlayerVoiceClick = (voice: VoiceItem) => {
    const slug = voice.name.toLowerCase().replace(/\s+/g, '-');
    const targetEl = document.getElementById(`voice-${slug}`) || document.getElementById(`voice-${voice.id}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
    handleOpenModal(voice);
  };

  return (
    <>
      <div className="voice-profiles">
        {voices.map((voice, idx) => {
          const isThisPlaying = activeAudioVoice?.id === voice.id && isPlayingAudio;

          return (
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
                    className={`voice-preview-btn ${isThisPlaying ? 'playing' : ''}`}
                    onClick={() => playVoicePreview(voice)}
                    aria-label={isThisPlaying ? `${t.voicesSection.stopAudio} (${voice.name})` : `${t.voicesSection.listenSample} (${voice.name})`}
                    title={isThisPlaying ? t.voicesSection.stopAudio : t.voicesSection.listenSample}
                  >
                    <span className="preview-icon">{isThisPlaying ? '❚❚' : '▶'}</span>
                    <span>{isThisPlaying ? t.voicesSection.playing : t.voicesSection.listenSample}</span>
                    {isThisPlaying && (
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
          );
        })}
      </div>

      {/* Modal / Card Details Overlay */}
      {selectedVoice && (() => {
        const specs = selectedVoice.specs;
        const isModalPlaying = activeAudioVoice?.id === selectedVoice.id && isPlayingAudio;

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
                      className={`voice-preview-btn large ${isModalPlaying ? 'playing' : ''}`}
                      onClick={() => playVoicePreview(selectedVoice)}
                    >
                      <span className="preview-icon">{isModalPlaying ? '❚❚' : '▶'}</span>
                      <span>{isModalPlaying ? t.voicesSection.playing : t.voicesSection.listenSample}</span>
                      {isModalPlaying && (
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
                    </div>
                  )}

                  <div className="modal-specs" style={{ marginTop: '12px' }}>
                    <div className="spec-item full-width">
                      <span className="spec-label">{t.voicesSection.modal.bio}</span>
                      <span className="spec-val" style={{ lineHeight: '1.6', fontSize: '0.86rem' }}>
                        {specs?.description}
                      </span>
                    </div>
                  </div>

                  <div className="modal-footer-tags">
                    {selectedVoice.tags.map(tag => (
                      <span className="modal-tag" key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className="modal-actions">
                    {specs?.downloadUrl && (
                      <a 
                        href={specs.downloadUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="modal-action-btn download-btn"
                      >
                        {t.voicesSection.modal.downloadBank} <span>↓</span>
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

      {/* Floating Audio Player (Fixed Bottom Bar) */}
      <FloatingAudioPlayer
        activeVoice={activeAudioVoice}
        isPlaying={isPlayingAudio}
        isVisible={isPlayerVisible}
        currentTime={currentTime}
        duration={duration}
        progress={progress}
        onTogglePlay={handleTogglePlayer}
        onClose={stopPreview}
        onVoiceClick={handlePlayerVoiceClick}
        onSeek={handleSeekPlayer}
      />
    </>
  );
}
