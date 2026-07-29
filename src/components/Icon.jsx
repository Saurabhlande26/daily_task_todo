const paths = {
  plus: 'M12 5v14M5 12h14',
  search: 'm21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
  calendar: 'M8 2v4m8-4v4M3 9h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z',
  chevronLeft: 'm15 18-6-6 6-6',
  chevronRight: 'm9 18 6-6-6-6',
  chevronDown: 'm6 9 6 6 6-6',
  play: 'm8 5 11 7-11 7V5Z',
  pause: 'M9 5v14M15 5v14',
  rotate: 'M3 12a9 9 0 1 0 3-6.7L3 8m0 0h5m-5 0V3',
  check: 'm5 12 4 4L19 6',
  checkCircle: 'M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z',
  trash: 'M4 7h16M9 11v6m6-6v6M9 4h6l1 3H8l1-3Zm-3 3 1 14h10l1-14',
  timer: 'M9 2h6m-3 4a8 8 0 1 1-8 8 8 8 0 0 1 8-8Zm0 4v4l3 2',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-14v5l3 2',
  moon: 'M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8Z',
  sun: 'M12 3V1m0 22v-2m9-9h2M1 12h2m15.4-6.4 1.4-1.4M4.2 19.8l1.4-1.4m0-12.8L4.2 4.2m15.6 15.6-1.4-1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z',
  download: 'M12 3v12m0 0 5-5m-5 5-5-5M4 19h16',
  upload: 'M12 21V9m0 0 5 5m-5-5-5 5M4 5h16',
  close: 'M6 6l12 12M18 6 6 18',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  pin: 'm12 17-4 4v-6l-3-3 5-1 3-7 3 3-2 5 5 5-7 0Z',
  flame: 'M12 22c4 0 7-3 7-7 0-3-2-5-4-7 0 3-2 4-3 5 0-5-3-8-6-11 1 5-2 7-2 11 0 4 3 7 7 7Z',
  target: 'M22 12a10 10 0 1 1-10-10m10 0-10 10m5-10h5v5M12 8a4 4 0 1 0 4 4',
  sliders: 'M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6M9 8h6m2 8h6',
  sparkles: 'm12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Zm7 10 .8 2.2L22 16l-2.2.8L19 19l-.8-2.2L16 16l2.2-.8L19 13Z',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Zm0 0V7m4 3h8m-8 4h6',
  activity: 'M3 12h4l2-7 4 14 2-7h6',
  briefcase: 'M9 6V4h6v2m5 5v8H4v-8m-1-4h18v6H3V7Z',
  leaf: 'M20 4C12 4 5 8 5 15c0 3 2 5 5 5 7 0 10-8 10-16ZM5 20c3-5 7-8 13-12',
  archive: 'M4 7h16v13H4V7Zm-1-4h18v4H3V3Zm6 8h6',
  copy: 'M9 9h11v11H9V9ZM4 4h11v3M4 4v11h3',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  chart: 'M4 20V10m6 10V4m6 16v-7m5 7H2',
  settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0-13v2m0 15v2m9.5-9.5h-2m-15 0h-2m16.2-6.2-1.4 1.4M7.2 16.8l-1.4 1.4m12.4 0-1.4-1.4M7.2 7.2 5.8 5.8',
}

export default function Icon({ name, size = 20, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d={paths[name] || paths.sparkles} />
    </svg>
  )
}
