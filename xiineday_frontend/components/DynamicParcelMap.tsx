'use client';

import dynamic from 'next/dynamic';

export const DynamicParcelMap = dynamic(() => import('./ParcelMap').then(mod => ({ default: mod.ParcelMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
    </div>
  ),
});
