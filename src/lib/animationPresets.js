export const ANIMATION_PRESETS = {
  none: {
    label: 'No Animation',
    description: 'Post appears immediately',
  },
  'fade-in': {
    label: 'Fade In',
    description: 'Gently fades into view as you scroll',
    fromVars: { opacity: 0 },
  },
  'slide-up': {
    label: 'Slide Up',
    description: 'Rises up from below',
    fromVars: { y: 80, opacity: 0 },
  },
  'slide-left': {
    label: 'Ride In from Left',
    description: 'Sweeps in from the left side',
    fromVars: { x: -100, opacity: 0 },
  },
  'slide-right': {
    label: 'Ride In from Right',
    description: 'Sweeps in from the right side',
    fromVars: { x: 100, opacity: 0 },
  },
  parallax: {
    label: 'Parallax Drift',
    description: 'Drifts up as you scroll past',
    fromVars: { y: 60, opacity: 0 },
  },
  stagger: {
    label: 'Stagger Reveal',
    description: 'Each element inside appears one by one',
    fromVars: { y: 40, opacity: 0 },
    stagger: true,
  },
  'western-ride': {
    label: 'Western Ride-In',
    description: 'Bold bounce entrance from the left with a spin',
    fromVars: { x: -120, opacity: 0, rotation: -3 },
    ease: 'back.out(1.7)',
  },
};

export const SPEED_MAP = {
  slow: 1.4,
  normal: 0.85,
  fast: 0.45,
};

export const TRIGGER_MAP = {
  top: 'top 85%',
  center: 'top 62%',
  bottom: 'top 40%',
};
