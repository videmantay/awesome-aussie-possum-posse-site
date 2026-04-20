import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Howl } from 'howler';

const TRACK_MAP = {
  en: '/audio/theme-en.mp3',
  'es-MX': '/audio/theme-es.mp3',
  'pt-BR': '/audio/theme-pt.mp3',
};

function getTrackSrc(language) {
  return TRACK_MAP[language] || TRACK_MAP.en;
}

function MusicPlayer() {
  const { i18n } = useTranslation();
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const howlRef = useRef(null);
  const langRef = useRef(i18n.language);

  function loadTrack(lang) {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
    }
    setReady(false);
    howlRef.current = new Howl({
      src: [getTrackSrc(lang)],
      loop: true,
      volume: 0.35,
      html5: true,
      onload: () => setReady(true),
      onloaderror: () => setReady(false),
      onplayerror: () => {
        // Browser blocked autoplay — user must interact first
        if (howlRef.current) {
          howlRef.current.once('unlock', () => {
            howlRef.current.play();
            setPlaying(true);
          });
        }
      },
    });
  }

  useEffect(() => {
    loadTrack(i18n.language);
    langRef.current = i18n.language;

    return () => {
      if (howlRef.current) {
        howlRef.current.stop();
        howlRef.current.unload();
      }
    };
  }, [i18n.language]);

  // Try autoplay once track is loaded
  useEffect(() => {
    if (ready && howlRef.current) {
      const id = howlRef.current.play();
      if (id !== undefined) setPlaying(true);
    }
  }, [ready]);

  function toggle() {
    if (!howlRef.current) return;
    if (playing) {
      howlRef.current.pause();
      setPlaying(false);
    } else {
      howlRef.current.play();
      setPlaying(true);
    }
  }

  return (
    <button
      onClick={toggle}
      title={playing ? 'Mute music' : 'Play music'}
      aria-label={playing ? 'Mute music' : 'Play music'}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 1000,
        width: '3.2rem',
        height: '3.2rem',
        borderRadius: '50%',
        border: '3px solid #c06e1e',
        backgroundColor: playing ? '#c06e1e' : '#fdf4eb',
        color: playing ? '#fdf4eb' : '#c06e1e',
        cursor: 'pointer',
        fontSize: '1.3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
        transition: 'background-color 0.25s, color 0.25s, transform 0.15s',
        outline: 'none',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {playing ? '🎵' : '🔇'}
    </button>
  );
}

export default MusicPlayer;
