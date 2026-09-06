function iconProps(props) {
  return { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', ...props };
}

export function IconGrid(props) {
  return (
    <svg {...iconProps(props)}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

export function IconPlusCircle(props) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8" /><path d="M8 12h8" />
    </svg>
  );
}

export function IconBellNav(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function IconListSearch(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 6h16" /><path d="M4 12h10" /><path d="M4 18h6" />
      <circle cx="17" cy="17" r="3" />
      <path d="M19.5 19.5L22 22" />
    </svg>
  );
}

export function IconTruckNav(props) {
  return (
    <svg {...iconProps(props)}>
      <rect x="1" y="6" width="13" height="11" rx="1" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="6" cy="19" r="1.6" /><circle cx="17" cy="19" r="1.6" />
    </svg>
  );
}

export function IconStarNav(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 2l2.9 6 6.6.7-5 4.6 1.4 6.5L12 16.7 6.1 19.8l1.4-6.5-5-4.6L9.1 8z" />
    </svg>
  );
}

export function IconUserNav(props) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

export function IconLogout(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function IconPackageNav(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}

export function IconStoreNav(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      <path d="M5 9v10h14V9" />
      <path d="M10 19v-5h4v5" />
    </svg>
  );
}

export function IconHandshakeNav(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M11 12 8 9a2 2 0 0 0-3 3l4 4 2-1" />
      <path d="M13 12l3 3a2 2 0 0 0 3-3l-5-5-3 2-2-2-4 4" />
    </svg>
  );
}
