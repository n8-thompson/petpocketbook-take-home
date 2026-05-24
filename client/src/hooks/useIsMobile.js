import { useEffect, useState } from 'react';

const MOBILE_QUERY = '(max-width: 768px)';

// Used to *not render* the trash drop zone on mobile (README rule). CSS hiding
// is insufficient because @dnd-kit registers droppables regardless of styling.
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(MOBILE_QUERY).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isMobile;
}
