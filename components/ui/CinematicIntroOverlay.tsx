'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Compass } from 'lucide-react';
import { soundEngine } from '@/lib/soundEffects';

interface CinematicIntroOverlayProps {
  currentScene: number;
  onSkip: () => void;
  onStartExploring: () => void;
  isIntroRunning: boolean;
}

export const CinematicIntroOverlay: React.FC<CinematicIntroOverlayProps> = ({
  currentScene,
  onSkip,
  onStartExploring,
  isIntroRunning,
}) => {
  const [isDoorOpen, setIsDoorOpen] = useState(false);

  // Sync with 3D intro progression
  useEffect(() => {
    if (currentScene >= 3 && !isDoorOpen) {
      setIsDoorOpen(true);
      soundEngine.playDoorSwoosh();
    }
  }, [currentScene, isDoorOpen]);

  // Click or [Enter] trigger
  const handleTriggerOpen = () => {
    if (!isDoorOpen) {
      setIsDoorOpen(true);
      soundEngine.playDoorSwoosh();
      setTimeout(() => {
        onSkip();
      }, 1200);
    } else {
      onSkip();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') {
        handleTriggerOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDoorOpen]);

  if (!isIntroRunning) return null;

  const sceneTitles = [
    'SCENE 1 // RESEARCH FACILITY PERIMETER',
    'SCENE 2 // APPROACHING FACILITY AIRLOCK',
    'SCENE 3 // DEPRESSURIZING BLAST DOORS',
    'SCENE 4 // DIGITAL LAB ENTRY INITIALIZED',
  ];

  return (
    <div className="fixed inset-0 z-30 select-none overflow-hidden font-sans">
      {/* ════════════════════════════════════════════════════════════════════════
          1. TACTICAL HUD OVERLAY (TOP BAR)
      ════════════════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 pointer-events-none">
        {/* Top Left: Location / Access Badge */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-sm border border-cyan-500/30 bg-slate-950/80 backdrop-blur-md shadow-[0_0_15px_rgba(0,242,254,0.15)]">
            <svg className="w-4 h-4 text-cyan-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="h-3 w-[1px] bg-cyan-500/40" />
            <span className="font-mono text-[11px] font-semibold tracking-wider text-cyan-300">
              {sceneTitles[currentScene - 1] || sceneTitles[0]}
            </span>
          </div>
        </div>

        {/* Top Right: Interactive Skip Button */}
        <div className="pointer-events-auto">
          <button
            onClick={onSkip}
            className="group flex items-center gap-2 px-4 py-1.5 rounded-sm border border-cyan-500/30 bg-slate-950/70 hover:bg-cyan-950/40 hover:border-cyan-400/70 backdrop-blur-md text-cyan-400 hover:text-cyan-200 font-mono text-xs font-semibold tracking-widest transition-all duration-200 active:scale-95 shadow-[0_0_12px_rgba(0,242,254,0.1)] hover:shadow-[0_0_20px_rgba(0,242,254,0.35)] cursor-pointer"
            aria-label="Skip Intro"
          >
            <span>SKIP INTRO</span>
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5.5 4.5l8 7.5-8 7.5V4.5zM14.5 4.5h3v15h-3v-15z" />
            </svg>
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════════════
          2. SCI-FI BLAST PORTAL GATE (1:1 Match of User Design)
      ════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {currentScene <= 3 && (
          <motion.main
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: currentScene === 3 ? 0.4 : 1,
              scale: currentScene === 3 ? 1.05 : 1,
            }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="relative w-full h-full viewport-scene flex items-center justify-center overflow-hidden bg-[#02050b]"
          >
            {/* Cosmic Void Background with Starfield Depth & Distant Megastructures */}
            <div className="absolute inset-0 star-dots opacity-40 pointer-events-none" />

            {/* Distant Facility Vertical Columns / Monoliths */}
            <div className="absolute top-0 inset-x-0 h-48 flex justify-around opacity-30 pointer-events-none">
              <div className="w-16 h-full bg-gradient-to-b from-slate-900 to-transparent border-x border-slate-700/20" />
              <div className="w-24 h-full bg-gradient-to-b from-slate-900 to-transparent border-x border-slate-700/20" />
              <div className="w-12 h-full bg-gradient-to-b from-slate-900 to-transparent border-x border-slate-700/20" />
              <div className="w-20 h-full bg-gradient-to-b from-slate-900 to-transparent border-x border-slate-700/20" />
              <div className="w-16 h-full bg-gradient-to-b from-slate-900 to-transparent border-x border-slate-700/20" />
            </div>

            {/* Concrete & Blast-Resistant Facility Perimeter Outer Wall */}
            <div className="relative w-full max-w-[1720px] h-[640px] md:h-[680px] bg-gradient-to-b from-[#1b2230] via-[#101520] to-[#080b12] border-y border-slate-700/40 shadow-2xl flex flex-col justify-end items-center overflow-hidden">
              {/* Facility Exterior Wall Surface Detailing / Seams */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

              {/* Overhead Volumetric Light Fixture & Cone */}
              <div className="absolute -top-6 w-[560px] h-[480px] spotlight-cone animate-pulse z-20 pointer-events-none" />

              {/* Overhead Heavy Spotlight Housing Mounted on Wall */}
              <div className="absolute top-0 z-30 flex flex-col items-center pointer-events-none">
                <div className="w-32 h-3.5 bg-slate-900 border-b border-cyan-400/40 rounded-b shadow-lg flex justify-around items-center px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </div>
                <div className="w-48 h-2 bg-gradient-to-r from-transparent via-cyan-100 to-transparent blur-[1px]" />
              </div>

              {/* BEGIN: Sci-Fi Blast Portal Frame (Airlock Gate) */}
              <section
                aria-label="Secure Facility Blast Doors"
                onClick={handleTriggerOpen}
                className="relative z-20 w-[420px] sm:w-[500px] md:w-[580px] h-[440px] md:h-[480px] flex flex-col justify-end items-center cursor-pointer group pointer-events-auto"
                id="airlock-portal"
              >
                {/* Portal Arch Header & Clearance Sensors */}
                <div className="w-full h-14 bg-gradient-to-b from-[#1c2434] to-[#121824] border-t-2 border-x-2 border-slate-600/80 rounded-t-md px-6 flex items-center justify-between shadow-2xl relative">
                  {/* Warning Strobe Left */}
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
                    </span>
                    <span className="hidden sm:inline font-mono text-[9px] text-slate-400 tracking-tighter">AL-01</span>
                  </div>

                  {/* Central Status LED Bar (Clearance Array) */}
                  <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-950/80 rounded border border-emerald-500/30 shadow-[inset_0_0_8px_rgba(16,185,129,0.2)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse" />
                    <span className="font-mono text-[10px] text-emerald-400 font-bold tracking-wider ml-1">CLEARANCE: GRANTED</span>
                  </div>

                  {/* Warning Strobe Right */}
                  <div className="flex items-center gap-1.5">
                    <span className="hidden sm:inline font-mono text-[9px] text-slate-400 tracking-tighter">SYS-OK</span>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
                    </span>
                  </div>

                  {/* External Hydraulic Mount Details */}
                  <div className="absolute -left-3 top-2 w-3 h-10 bg-slate-800 border border-slate-600 rounded-l" />
                  <div className="absolute -right-3 top-2 w-3 h-10 bg-slate-800 border border-slate-600 rounded-r" />
                </div>

                {/* Glowing Neon Energy Border Outer Chamber Seal */}
                <div className="relative w-full h-[400px] md:h-[430px] p-2 bg-slate-950/90 border-x-4 border-b-4 border-slate-700/80 flex items-stretch gap-1.5 glow-cyan-frame overflow-hidden">
                  {/* BEGIN: Left Door Leaf */}
                  <div
                    className="relative flex-1 metal-panel rounded-l-sm border border-slate-600/50 flex flex-col justify-between p-4 transition-transform duration-700 ease-in-out"
                    style={{ transform: isDoorOpen ? 'translateX(-85%)' : 'translateX(0)' }}
                    id="door-leaf-left"
                  >
                    {/* Structural Reinforcement Ribs */}
                    <div className="flex justify-between items-center opacity-40">
                      <span className="font-mono text-[9px] text-slate-400">PART: DR-L//903</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      </div>
                    </div>

                    {/* Recessed Reinforced Vision Port Window */}
                    <div className="self-center w-24 sm:w-28 h-10 bg-gradient-to-b from-cyan-950/90 via-slate-900 to-cyan-950/90 rounded border border-cyan-400/50 shadow-[inset_0_0_12px_rgba(0,242,254,0.3)] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,242,254,0.15)_50%,transparent_75%)] bg-[length:250%_250%] animate-pulse" />
                      <span className="font-mono text-[8px] text-cyan-300 font-semibold tracking-wider z-10 opacity-75">AIRLOCK VACUUM</span>
                    </div>

                    {/* Rivets and Mid-Gate Reinforcement Seam */}
                    <div className="w-full my-4 flex items-center gap-2">
                      <div className="h-[1px] flex-1 bg-slate-700/80" />
                      <div className="w-2 h-2 rounded-full border border-slate-500 bg-slate-800" />
                      <div className="h-[1px] flex-1 bg-slate-700/80" />
                    </div>

                    {/* Lower Hydraulic Locking Anchor Points & Mechanical Pins */}
                    <div className="grid grid-cols-4 gap-2 mb-2 px-2">
                      <div className="h-2 rounded-full bg-slate-800 border border-slate-600" />
                      <div className="h-2 rounded-full bg-slate-800 border border-slate-600" />
                      <div className="h-2 rounded-full bg-slate-800 border border-slate-600" />
                      <div className="h-2 rounded-full bg-slate-800 border border-slate-600" />
                    </div>

                    {/* Caution Stripe Edge */}
                    <div className="h-3 w-full hazard-stripes rounded-sm border border-black/50 shadow-inner" />

                    {/* Vertical Neon Cyan Energy Edge (Center Seam) */}
                    <div className="absolute -right-[3px] top-0 bottom-0 w-[4px] bg-cyan-300 glow-cyan-seam rounded-full z-30" />
                  </div>
                  {/* END: Left Door Leaf */}

                  {/* BEGIN: Right Door Leaf */}
                  <div
                    className="relative flex-1 metal-panel rounded-r-sm border border-slate-600/50 flex flex-col justify-between p-4 transition-transform duration-700 ease-in-out"
                    style={{ transform: isDoorOpen ? 'translateX(85%)' : 'translateX(0)' }}
                    id="door-leaf-right"
                  >
                    {/* Structural Reinforcement Ribs */}
                    <div className="flex justify-between items-center opacity-40">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      </div>
                      <span className="font-mono text-[9px] text-slate-400">PART: DR-R//904</span>
                    </div>

                    {/* Recessed Reinforced Vision Port Window */}
                    <div className="self-center w-24 sm:w-28 h-10 bg-gradient-to-b from-cyan-950/90 via-slate-900 to-cyan-950/90 rounded border border-cyan-400/50 shadow-[inset_0_0_12px_rgba(0,242,254,0.3)] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,242,254,0.15)_50%,transparent_75%)] bg-[length:250%_250%] animate-pulse" />
                      <span className="font-mono text-[8px] text-cyan-300 font-semibold tracking-wider z-10 opacity-75">INTERIOR DEPRESS</span>
                    </div>

                    {/* Rivets and Mid-Gate Reinforcement Seam */}
                    <div className="w-full my-4 flex items-center gap-2">
                      <div className="h-[1px] flex-1 bg-slate-700/80" />
                      <div className="w-2 h-2 rounded-full border border-slate-500 bg-slate-800" />
                      <div className="h-[1px] flex-1 bg-slate-700/80" />
                    </div>

                    {/* Lower Hydraulic Locking Anchor Points & Mechanical Pins */}
                    <div className="grid grid-cols-4 gap-2 mb-2 px-2">
                      <div className="h-2 rounded-full bg-slate-800 border border-slate-600" />
                      <div className="h-2 rounded-full bg-slate-800 border border-slate-600" />
                      <div className="h-2 rounded-full bg-slate-800 border border-slate-600" />
                      <div className="h-2 rounded-full bg-slate-800 border border-slate-600" />
                    </div>

                    {/* Caution Stripe Edge */}
                    <div className="h-3 w-full hazard-stripes rounded-sm border border-black/50 shadow-inner" />

                    {/* Vertical Neon Cyan Energy Edge (Center Seam) */}
                    <div className="absolute -left-[3px] top-0 bottom-0 w-[4px] bg-cyan-300 glow-cyan-seam rounded-full z-30" />
                  </div>
                  {/* END: Right Door Leaf */}
                </div>

                {/* Center Interactive Breach CTA Overlay */}
                <div className="absolute bottom-16 z-40 transition-all duration-300 transform group-hover:scale-105 pointer-events-none">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,242,254,0.35)]">
                    <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="font-mono text-[10px] text-cyan-300 tracking-wider font-semibold">
                      CLICK OR PRESS [ENTER] TO ENTER FACILITY
                    </span>
                  </div>
                </div>
              </section>
              {/* END: Sci-Fi Blast Portal Frame */}
            </div>

            {/* Ground Platform & Light Emission Reflection */}
            <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-black via-[#040810] to-[#0a101b] grid-ground z-10 flex justify-center pointer-events-none">
              <div className="w-[720px] h-32 floor-reflection -translate-y-8 pointer-events-none" />
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════════════
          3. SCENE 4: LAB WELCOME TITLE CARD
      ════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {currentScene >= 4 && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-[2px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-center max-w-2xl px-6 py-8 rounded-lg bg-slate-950/85 border border-cyan-500/40 shadow-2xl shadow-cyan-950/50"
            >
              <div className="inline-block text-[11px] font-mono tracking-widest text-cyan-400 uppercase mb-2 border-b border-cyan-500/30 pb-1">
                KB RESEARCH & FULL-STACK LAB // 2026
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase mb-2 font-mono drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                KAMANASHIS BISWAS
              </h1>

              <div className="text-sm sm:text-base font-semibold tracking-wider text-cyan-300 uppercase mb-3 font-mono">
                FULL-STACK WEB DEVELOPER
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-6 font-mono leading-relaxed">
                WELCOME TO MY DIGITAL LAB. EXPLORE REAL-TIME 3D INTERACTIVE STATIONS, VERIFIED PROJECT BLUEPRINTS, AND FULL-STACK SYSTEMS ARCHITECTURE.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pointer-events-auto">
                <button
                  onClick={onStartExploring}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded text-xs font-mono uppercase tracking-wider transition cursor-pointer shadow-lg shadow-cyan-500/30"
                >
                  <Compass className="w-4 h-4" />
                  <span>START EXPLORING</span>
                </button>

                <button
                  onClick={onSkip}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 px-5 py-3 rounded text-xs font-mono uppercase tracking-wider transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>ENTER LAB NOW</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════════════
          4. TACTICAL TELEMETRY & DIAGNOSTIC HUD (BOTTOM BAR)
      ════════════════════════════════════════════════════════════════════════ */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-between px-6 py-4 pointer-events-none">
        {/* Bottom Left: Compass Radar & Spatial Coordinates */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full border border-cyan-500/40 bg-slate-950/80 flex items-center justify-center shadow-[0_0_10px_rgba(0,242,254,0.2)]">
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40 animate-spin [animation-duration:12s]" />
            <span className="font-mono text-xs font-bold text-cyan-300 tracking-tighter">N</span>
            <div className="absolute -top-0.5 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_4px_#00f2fe]" />
          </div>
          <div className="flex flex-col">
            <p className="font-mono text-[11px] font-medium text-slate-300 tracking-wider">
              COORDINATES: <span className="text-cyan-400">[0.00, 1.70, 13.00]</span> // SECTOR: <span className="text-slate-100">ENTRANCE</span>
            </p>
            <p className="font-mono text-[9px] text-slate-400 tracking-widest uppercase">
              PERIMETER DEFENSE: ENGAGED // BIOMETRIC LOCK: ACTIVE
            </p>
          </div>
        </div>

        {/* Bottom Right: Engine Diagnostic Readout */}
        <div className="pointer-events-auto text-right hidden sm:block">
          <p className="font-mono text-[11px] font-medium text-slate-300 tracking-wider">
            SYSTEM RUNTIME: <span className="text-cyan-300 font-semibold">THREE.JS PBR ENVIRONMENT</span>
          </p>
          <p className="font-mono text-[9px] text-cyan-400/70 tracking-widest uppercase">
            PIPELINE: HDR BLOOM / POST-FX ACTIVE // 60 FPS
          </p>
        </div>
      </footer>
    </div>
  );
};
