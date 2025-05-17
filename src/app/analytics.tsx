'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (command: 'config' | 'event', targetId: string, config?: Record<string, unknown>) => void;
  }
}

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    window.gtag?.('event', 'page_view', {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}
