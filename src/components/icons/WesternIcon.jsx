/**
 * WesternIcon — hand-drawn SVG icon library for the Possum Posse brand.
 *
 *   <WesternIcon name="hat" size={20} color="#5a3a1a" />
 *
 *  All icons share the same style: solid fill in `color`, ink outline in
 *  --color-ink (#3a1e00). Use these instead of emoji or a generic icon font.
 */

import React from 'react';

const ICONS = {
  // Sheriff star — for skill chips, awards, callouts
  star: (
    <g fill="currentColor" stroke="#3a1e00" strokeWidth="1" strokeLinejoin="round">
      <path d="M12 2 L13.6 8.2 L20 8.2 L14.8 12 L16.8 18.4 L12 14.6 L7.2 18.4 L9.2 12 L4 8.2 L10.4 8.2 Z" />
      <circle cx="12" cy="12" r="1.2" fill="#3a1e00" stroke="none" />
    </g>
  ),
  // Cowboy hat — Home / homestead
  hat: (
    <g fill="currentColor" stroke="#3a1e00" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" transform="translate(0,2)">
      <path d="M2 14 C 6 16, 18 16, 22 14 C 20 15.2, 16 16.5, 12 16.5 C 8 16.5, 4 15.2, 2 14 Z" />
      <path d="M6 14 C 6 9, 8 4, 12 4 C 16 4, 18 9, 18 14 Z" />
      <path d="M7 11.5 C 9 12.5, 15 12.5, 17 11.5" fill="none" />
    </g>
  ),
  // Paw print — Characters
  paw: (
    <g fill="currentColor" stroke="#3a1e00" strokeWidth="1" strokeLinejoin="round">
      <ellipse cx="12" cy="15.5" rx="4.5" ry="4" />
      <ellipse cx="6.5" cy="10" rx="2" ry="2.5" />
      <ellipse cx="17.5" cy="10" rx="2" ry="2.5" />
      <ellipse cx="9" cy="6" rx="1.6" ry="2.2" />
      <ellipse cx="15" cy="6" rx="1.6" ry="2.2" />
    </g>
  ),
  // Wanted poster — The Book / About
  poster: (
    <g stroke="#3a1e00" strokeWidth="1.2" strokeLinejoin="round">
      <path d="M5 3 L19 3 L19 21 L5 21 Z" fill="currentColor" />
      <path d="M7 6 L17 6 M7 8.5 L17 8.5" strokeWidth="1" fill="none" />
      <circle cx="12" cy="14" r="2.5" fill="#fdf4eb" />
      <path d="M8 19 L16 19" strokeWidth="0.8" fill="none" />
    </g>
  ),
  // Horseshoe — Frontier Post / luck
  horseshoe: (
    <g fill="none" stroke="#3a1e00" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4 C 4 9, 4 16, 8 20 L10 19 C 7 16, 7 10, 9 6 Z" fill="currentColor" />
      <path d="M18 4 C 20 9, 20 16, 16 20 L14 19 C 17 16, 17 10, 15 6 Z" fill="currentColor" />
      <circle cx="7" cy="6" r="0.7" fill="#3a1e00" />
      <circle cx="17" cy="6" r="0.7" fill="#3a1e00" />
      <circle cx="6" cy="11" r="0.7" fill="#3a1e00" />
      <circle cx="18" cy="11" r="0.7" fill="#3a1e00" />
      <circle cx="8" cy="17" r="0.7" fill="#3a1e00" />
      <circle cx="16" cy="17" r="0.7" fill="#3a1e00" />
    </g>
  ),
  // Quill — The Author
  quill: (
    <g stroke="#3a1e00" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M3 21 L8 16" fill="none" />
      <path d="M20 3 C 14 5, 9 10, 7 17 L11 17 C 14 12, 18 8, 21 5 Z" fill="currentColor" />
      <path d="M11 13 L17 7" fill="none" strokeWidth="0.8" />
      <path d="M9 15 L15 9" fill="none" strokeWidth="0.8" />
    </g>
  ),
  // Palette — The Illustrator
  palette: (
    <g stroke="#3a1e00" strokeWidth="1.2" strokeLinejoin="round">
      <path d="M12 3 C 6.5 3, 3 7, 3 11.5 C 3 15, 5.5 17, 8.5 17 C 9.5 17, 10 17.7, 10 18.5 C 10 20, 11 21, 12.5 21 C 17.5 21, 21 17, 21 12 C 21 7, 17 3, 12 3 Z" fill="currentColor" />
      <circle cx="8"  cy="9"   r="1.2" fill="#4a8a5a" stroke="none" />
      <circle cx="13" cy="6.5" r="1.2" fill="#c45a1a" stroke="none" />
      <circle cx="17" cy="9.5" r="1.2" fill="#c8a010" stroke="none" />
      <circle cx="17" cy="14"  r="1.2" fill="#6a6a9a" stroke="none" />
    </g>
  ),
  // Family / homestead — For Parents
  family: (
    <g fill="currentColor" stroke="#3a1e00" strokeWidth="1.1" strokeLinejoin="round">
      <circle cx="7"  cy="7"  r="2.4" />
      <circle cx="17" cy="7"  r="2.4" />
      <circle cx="12" cy="9.5" r="1.8" />
      <path d="M2 20 C 2 16, 4.5 14, 7 14 C 9.5 14, 12 16, 12 20 Z" />
      <path d="M12 20 C 12 16, 14.5 14, 17 14 C 19.5 14, 22 16, 22 20 Z" />
      <path d="M9 20 C 9 17.5, 10.5 16, 12 16 C 13.5 16, 15 17.5, 15 20 Z" />
    </g>
  ),
  // Mailbox / scroll — Frontier Post (alt)
  mailbox: (
    <g stroke="#3a1e00" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M3 9 C 3 6.5, 5 5, 8 5 L17 5 C 19.5 5, 21 7, 21 9 L21 16 L8 16 C 5 16, 3 14.5, 3 12 Z" fill="currentColor" />
      <path d="M7 9 L13 9" fill="none" strokeWidth="1" />
      <path d="M7 12 L11 12" fill="none" strokeWidth="1" />
      <path d="M17 5 L17 16" fill="none" />
      <path d="M19 7 L19 4" fill="none" strokeWidth="1" />
      <circle cx="19" cy="3.3" r="0.8" fill="#c45a1a" stroke="none" />
      <path d="M8 16 L8 20" fill="none" />
    </g>
  ),
};

export default function WesternIcon({
  name,
  size = 20,
  color = 'currentColor',
  className = '',
  style = {},
  ...rest
}) {
  const path = ICONS[name];
  if (!path) {
    if (typeof console !== 'undefined') console.warn(`WesternIcon: unknown name "${name}"`);
    return null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`possum-icon ${className}`}
      style={{ color, ...style }}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {path}
    </svg>
  );
}

export const WESTERN_ICON_NAMES = Object.keys(ICONS);
