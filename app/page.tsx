'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ConventionalPortfolioView } from '@/components/ui/ConventionalPortfolioView';

// Dynamically import 3D LaboratoryScene with SSR disabled to ensure WebGL only mounts client-side
const LaboratoryScene = dynamic(
  () => import('@/components/3d/LaboratoryScene').then((mod) => mod.LaboratoryScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#0a0a0b] text-[#f4f4f5] px-6 select-none font-sans">
        <div className="flex flex-col items-center text-center space-y-3 max-w-sm">
          <div className="w-2 h-2 rounded-full bg-[#22d3ee] animate-ping mb-1" />
          <div className="text-sm font-semibold tracking-wide text-[#f4f4f5]">
            Kamanashis Biswas
          </div>
          <div className="text-xs text-[#a1a1aa] tracking-normal">
            Full-Stack Developer &bull; Loading 3D Lab
          </div>
          <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden mt-4 relative">
            <div className="w-20 h-full bg-[#22d3ee] rounded-full absolute left-0 animate-loading-slide" />
          </div>
        </div>
      </div>
    ),
  }
);

export default function HomePage() {
  const [webGLSupported] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  });

  const [viewMode, setViewMode] = useState<'3d' | '2d'>(() => (webGLSupported ? '3d' : '2d'));

  const handleToggleViewMode = () => {
    setViewMode((prev) => (prev === '3d' ? '2d' : '3d'));
  };

  return (
    <main className="w-full min-h-screen bg-slate-950">
      {viewMode === '3d' && webGLSupported ? (
        <LaboratoryScene
          viewMode={viewMode}
          onToggleViewMode={handleToggleViewMode}
        />
      ) : (
        <ConventionalPortfolioView
          onEnter3D={() => {
            if (webGLSupported) {
              setViewMode('3d');
            }
          }}
        />
      )}
    </main>
  );
}
