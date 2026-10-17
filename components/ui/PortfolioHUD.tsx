'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Compass,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  MousePointer,
  HelpCircle,
  X,
  Sparkles,
  MapPin,
  Radio
} from 'lucide-react';
import { StationAnchor } from '@/components/3d/LaboratoryEnvironment';
import { soundEngine } from '@/lib/soundEffects';

interface PortfolioHUDProps {
  nearStation: StationAnchor | null;
  onOpenStation: (stationId: string) => void;
  onTeleportTo: (stationId: string) => void;
  onToggleViewMode: () => void;
  viewMode: '3d' | '2d';
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  isPointerLocked: boolean;
  onRequestPointerLock: () => void;
}

export const PortfolioHUD: React.FC<PortfolioHUDProps> = ({
  nearStation,
  onOpenStation,
  onTeleportTo,
  onToggleViewMode,
  viewMode,
  isAudioMuted,
  onToggleAudio,
  isPointerLocked,
  onRequestPointerLock
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [showHelpGuide, setShowHelpGuide] = useState(false);

  const stationsList = [
    { id: 'about-station', label: 'About', code: '01' },
    { id: 'education-archive', label: 'Education', code: '02' },
    { id: 'skills-station', label: 'Skills', code: '03' },
    { id: 'projects-station', label: 'Projects', code: '04' },
    { id: 'tools-station', label: 'Tools', code: '05' },
    { id: 'certificate-archive', label: 'Certificates', code: '06' },
    { id: 'blog-station', label: 'Blog', code: '07' },
    { id: 'contact-terminal', label: 'Contact', code: '08' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 sm:p-5 select-none overflow-hidden font-mono">
      {/* TOP STATUS BAR */}
      <div className="flex items-start justify-between w-full">
        {/* Left: Brand & Location */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center space-x-2 bg-slate-950/85 border border-cyan-500/30 px-3 py-1.5 rounded pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-bold tracking-wider text-white">KB // LAB-01</span>
            <span className="text-[10px] text-cyan-400 border-l border-slate-700 pl-2">FULL-STACK PORTFOLIO</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded text-[11px] text-slate-300 pointer-events-auto">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>SECTOR:</span>
            <span className="text-cyan-300 font-semibold uppercase">
              {nearStation ? nearStation.name : 'CENTRAL LABORATORY AISLE'}
            </span>
          </div>
        </div>

        {/* Right: Audio, 2D Switcher, Help */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleAudio();
            }}
            className={`p-2 rounded border transition cursor-pointer ${
              !isAudioMuted
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isAudioMuted ? 'Unmute Ambient Sound' : 'Mute Sound'}
            aria-label="Toggle Audio"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Switch 2D / 3D */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleViewMode();
            }}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-950/80 hover:bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 rounded text-xs text-cyan-300 font-semibold transition cursor-pointer"
            title="Switch between 3D Lab and Conventional 2D Portfolio"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{viewMode === '3d' ? '2D VIEW' : '3D LAB'}</span>
          </button>

          {/* Help Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowHelpGuide(true);
            }}
            className="p-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 rounded text-slate-300 hover:text-white transition cursor-pointer"
            title="Movement Controls Guide"
            aria-label="Help Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TOP-CENTER INTERACTION PROMPT (POSITIONED ABOVE THE 3D SCREEN) */}
      <div className="flex-1 flex flex-col items-center justify-start pt-2 sm:pt-4 pointer-events-none">
        {/* Proximity Interaction Banner */}
        <AnimatePresence>
          {nearStation && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto mb-2"
            >
              <button
                onClick={() => {
                  soundEngine.playTerminalOpen();
                  onOpenStation(nearStation.id);
                }}
                className="flex items-center space-x-3 px-5 py-2.5 bg-slate-950/95 border-2 border-cyan-400 hover:border-cyan-300 text-white rounded-lg shadow-2xl shadow-cyan-950/80 transition cursor-pointer hover:scale-105 active:scale-95"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded bg-cyan-400 text-slate-950 font-black text-xs shadow-md">
                  E
                </span>
                <div className="text-left">
                  <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
                    INTERACT WITH TERMINAL // CLICK OR PRESS [E]
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white uppercase tracking-wide">
                    {nearStation.name}
                  </div>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Natural drag hint (only shown when not near a station to prevent clutter) */}
        {!isPointerLocked && !nearStation && (
          <div className="hidden md:flex items-center space-x-2 bg-slate-950/75 border border-white/10 text-slate-300 text-[11px] px-3.5 py-1.5 rounded-full backdrop-blur-sm pointer-events-none font-sans shadow-md">
            <MousePointer className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span>Click &amp; drag to look around &bull; Click any station or dock to explore</span>
          </div>
        )}

        {/* Subtle center crosshair reticle when in mouse look */}
        {isPointerLocked && !nearStation && (
          <div className="my-auto w-4 h-4 rounded-full border border-cyan-400/50 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-cyan-400" />
          </div>
        )}
      </div>

      {/* BOTTOM COLLAPSIBLE DOCK (PER THREE.JS CONSTITUTION) */}
      <div className="w-full flex flex-col items-center pointer-events-auto max-w-4xl mx-auto">
        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setIsDockCollapsed(!isDockCollapsed);
          }}
          className="flex items-center space-x-1.5 bg-slate-950/90 border-t border-x border-cyan-500/30 text-cyan-300 hover:text-cyan-100 px-4 py-1.5 rounded-t text-[11px] font-mono tracking-wider transition cursor-pointer"
        >
          {isDockCollapsed ? (
            <>
              <ChevronUp className="w-3 h-3 text-cyan-400" />
              <span>SHOW LAB DIRECTORY</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 text-cyan-400" />
              <span>HIDE DOCK</span>
            </>
          )}
        </button>

        {/* Main Dock Container */}
        <AnimatePresence>
          {!isDockCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 25 }}
              transition={{ duration: 0.2 }}
              className="w-full bg-slate-950/90 border border-cyan-500/30 p-2.5 sm:p-3 rounded-b-lg shadow-2xl flex flex-col space-y-2"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Compass className="w-3.5 h-3.5" /> QUICK LAB DIRECTORY (CLICK TO FLY TO STATION)
                </span>
                <span className="hidden sm:inline text-slate-400">[W][A][S][D] MOVE • [E] INTERACT • [ESC] CURSOR</span>
              </div>

              {/* Station Teleport Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {stationsList.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      soundEngine.playClick();
                      onTeleportTo(st.id);
                    }}
                    className={`flex-shrink-0 flex items-center space-x-1 px-2.5 py-1.5 rounded text-[11px] font-medium border transition cursor-pointer ${
                      nearStation?.id === st.id
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-cyan-200 hover:border-cyan-500/40'
                    }`}
                  >
                    <span className="opacity-60">{st.code}</span>
                    <span>{st.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CONTROLS HELP MODAL */}
      <AnimatePresence>
        {showHelpGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-cyan-500/40 p-6 rounded-lg max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-cyan-300 uppercase">Movement & Exploration Guide</h3>
                <button
                  onClick={() => setShowHelpGuide(false)}
                  className="p-1 text-slate-400 hover:text-white rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="font-bold text-cyan-400">WASD / Arrow Keys</span>
                  <span>Walk forward, left, backward, right</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="font-bold text-cyan-400">Mouse Movement</span>
                  <span>Look around 360° (Click screen to lock)</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="font-bold text-cyan-400">[E] Key or Click</span>
                  <span>Open station details terminal</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="font-bold text-cyan-400">[ESC] Key</span>
                  <span>Release mouse pointer from canvas</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="font-bold text-cyan-400">Bottom Directory</span>
                  <span>Smooth camera glide to any lab zone</span>
                </div>
              </div>

              <button
                onClick={() => setShowHelpGuide(false)}
                className="w-full py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded uppercase tracking-wider transition"
              >
                Acknowledge & Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
