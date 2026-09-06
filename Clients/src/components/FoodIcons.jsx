function iconProps(props) {
  return { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', ...props };
}

export function IconRice(props) {
  return (
    <svg {...iconProps(props)}>
      <ellipse cx="12" cy="17" rx="8" ry="3" />
      <path d="M4 17c0-5 3.5-9 8-9s8 4 8 9" />
      <path d="M9 8c0-2 1-3.5 3-3.5S15 6 15 8" />
    </svg>
  );
}

export function IconCurry(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M3 12h18a9 9 0 0 1-18 0z" />
      <path d="M8 12c0-3 1-5 4-5s4 2 4 5" />
      <path d="M12 3v2" />
    </svg>
  );
}

export function IconRoti(props) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M8 12h8" strokeDasharray="1.5 2.5" />
    </svg>
  );
}

export function IconSnacks(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 3l2.5 5 5.5.8-4 4 1 5.5-5-2.6-5 2.6 1-5.5-4-4 5.5-.8z" />
    </svg>
  );
}

export function IconSweets(props) {
  return (
    <svg {...iconProps(props)}>
      <rect x="4" y="9" width="16" height="8" rx="2" />
      <path d="M4 13h16" />
      <path d="M8 9V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3" />
    </svg>
  );
}

export function IconFoodGeneric(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M6 3v7a2 2 0 0 0 4 0V3" />
      <path d="M8 10v11" />
      <path d="M17 3c-1.5 0-3 1.5-3 4.5S15.5 12 17 12v9" />
    </svg>
  );
}

export const FOOD_TYPE_ICONS = {
  Rice: IconRice,
  Curry: IconCurry,
  Roti: IconRoti,
  Snacks: IconSnacks,
  Sweets: IconSweets,
  Other: IconFoodGeneric,
};

export function IconClock(props) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function IconScale(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 3v18" />
      <path d="M5 7h14" />
      <path d="M5 7 2 13a3 3 0 0 0 6 0z" />
      <path d="M19 7l-3 6a3 3 0 0 0 6 0z" />
    </svg>
  );
}

export function IconMapPinSmall(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}

export function IconUsersSmall(props) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="8.5" cy="8" r="3" />
      <path d="M2.5 20a6 6 0 0 1 12 0" />
      <path d="M15 8.5a2.7 2.7 0 1 1 0 5.4" />
      <path d="M16.5 14.3c1.8.5 3 2 3 5.7" />
    </svg>
  );
}
