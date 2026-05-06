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
  // Home / homestead — sprite from westernIcons.svg
  hat: <use href="/westernIcons.svg#home-icon" />,
  // Characters — sprite from westernIcons.svg
  paw: <use href="/westernIcons.svg#boot-icon" />,
  // The Book / About — sprite from westernIcons.svg
  poster: <use href="/westernIcons.svg#plateau-icon" />,
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
  // The Author — sprite from westernIcons.svg
  quill: <use href="/westernIcons.svg#saloon-icon" />,
  // The Illustrator — sprite from westernIcons.svg
  palette: <use href="/westernIcons.svg#pony-icon" />,
  // For Parents — sprite from westernIcons.svg
  family: <use href="/westernIcons.svg#parent-icon" />,
  // Frontier Post — sprite from westernIcons.svg
  mailbox: <use href="/westernIcons.svg#map-icon" />,
};

// Per-icon viewBox overrides for sprite-based icons (keyed by icon name)
const VIEWBOXES = {
  hat:     '149 506 101 100',
  poster:  '868 877 98 77',
  family:  '688 865 100 100',
  mailbox: '507 158 101 89',
  paw:     '1227 506 94 101',
  quill:   '1771 327 84 101',
  palette: '865 167 101 77',
};

export default function WesternIcon({
  name,
  size = 30,
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
      viewBox={VIEWBOXES[name] || '0 0 24 24'}
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
