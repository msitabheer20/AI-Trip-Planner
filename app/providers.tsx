'use client';

import { ReactNode } from 'react';
import { TripProvider } from '@/lib/trip-context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TripProvider>
      {children}
    </TripProvider>
  );
} 