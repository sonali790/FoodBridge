function iconProps(props) {
  return { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', ...props };
}

export function IconUser(props) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

export function IconMail(props) {
  return (
    <svg {...iconProps(props)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </svg>
  );
}

export function IconLock(props) {
  return (
    <svg {...iconProps(props)}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}

export function IconMapPin(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}

export function IconUtensils(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M6 3v7a2 2 0 0 0 4 0V3" />
      <path d="M8 10v11" />
      <path d="M17 3c-1.5 0-3 1.5-3 4.5S15.5 12 17 12v9" />
    </svg>
  );
}

export function IconUsersGroup(props) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="8.5" cy="8" r="3" />
      <path d="M2.5 20a6 6 0 0 1 12 0" />
      <path d="M15 8.5a2.7 2.7 0 1 1 0 5.4" />
      <path d="M16.5 14.3c1.8.5 3 2 3 5.7" />
    </svg>
  );
}

export function IconLeaf(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 20c8 0 16-4 16-16-9 0-16 5-16 16z" />
      <path d="M4 20c3-6 7-10 13-13" />
    </svg>
  );
}

export function IconKey(props) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="8" cy="14" r="4" />
      <path d="M11 11l9-9" />
      <path d="M17 5l3 3" />
      <path d="M14 8l2.5 2.5" />
    </svg>
  );
}
