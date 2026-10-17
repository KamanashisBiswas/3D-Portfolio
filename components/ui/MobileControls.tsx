'use client';

import React, { useRef, useState, useCallback } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RotateCw,
  Radio,
  Sliders,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '@/lib/soundEffects';

interface MobileControlsProps {
  onMove: (vector: { x: number; y: number }) => void;
  onRotate: (deltaX: number, deltaY: number) => void;
  onRotateYaw: (deltaYaw: number) => void;
  onDirectionalMove: (direction: 'forward' | 'backward' | 'left' | 'right', active: boolean) => void;
  onInteract: () => void;
  canInteract: boolean;
  nearStationName?: string;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMove,
  onRotate,
  onRotateYaw,
  onDirectionalMove,
  onInteract,
  canInteract,
  nearStationName
}) => {
  const [controlType, setControlType] = useState<'touchpad' | 'dpad'>('touchpad');

  // Virtual Dynamic Thumbstick state
  const [isStickActive, setIsStickActive] = useState(false);
  const [stickOrigin, setStickOrigin] = useState({ x: 90, y: 0 });
  const [stickOffset, setStickOffset] = useState({ x: 0, y: 0 });

  const moveTouchIdRef = useRef<number | null>(null);
  const lookTouchIdRef = useRef<number | null>(null);
  const lastLookPosRef = useRef({ x: 0, y: 0 });

  // Touch handlers for the full-screen touch zone
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Only capture touches not originating from explicit buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const isLeftHalf = touch.clientX < window.innerWidth * 0.5;

      if (isLeftHalf && moveTouchIdRef.current === null && controlType === 'touchpad') {
        // Start movement joystick at the touch location
        moveTouchIdRef.current = touch.identifier;
        setStickOrigin({ x: touch.clientX, y: touch.clientY });
        setStickOffset({ x: 0, y: 0 });
        setIsStickActive(true);
      } else if (!isLeftHalf && lookTouchIdRef.current === null) {
        // Start look rotation
        lookTouchIdRef.current = touch.identifier;
        lastLookPosRef.current = { x: touch.clientX, y: touch.clientY };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];

      // Left thumbstick movement
      if (touch.identifier === moveTouchIdRef.current && controlType === 'touchpad') {
        const dx = touch.clientX - stickOrigin.x;
        const dy = touch.clientY - stickOrigin.y;
        const maxDist = 48;
        const dist = Math.hypot(dx, dy);

        let clampedX = dx;
        let clampedY = dy;
        if (dist > maxDist) {
          clampedX = (dx / dist) * maxDist;
          clampedY = (dy / dist) * maxDist;
        }

        setStickOffset({ x: clampedX, y: clampedY });
        onMove({
          x: clampedX / maxDist,
          y: clampedY / maxDist,
        });
      }

      // Right touch look rotation
      if (touch.identifier === lookTouchIdRef.current) {
        const deltaX = touch.clientX - lastLookPosRef.current.x;
        const deltaY = touch.clientY - lastLookPosRef.current.y;
        lastLookPosRef.current = { x: touch.clientX, y: touch.clientY };
        onRotate(deltaX, deltaY);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];

      if (touch.identifier === moveTouchIdRef.current) {
        moveTouchIdRef.current = null;
        setIsStickActive(false);
        setStickOffset({ x: 0, y: 0 });
        onMove({ x: 0, y: 0 });
      }

      if (touch.identifier === lookTouchIdRef.current) {
        lookTouchIdRef.current = null;
      }
    }
  };

  // D-Pad button helpers
  const handleButtonPress = useCallback(
    (dir: 'forward' | 'backward' | 'left' | 'right') => {
      onDirectionalMove(dir, true);
    },
    [onDirectionalMove]
  );

  const handleButtonRelease = useCallback(
    (dir: 'forward' | 'backward' | 'left' | 'right') => {
      onDirectionalMove(dir, false);
    },
    [onDirectionalMove]
  );

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="absolute inset-0 z-25 overflow-hidden md:hidden select-none touch-none"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Control Type Mode Switcher Pill (Top Center) */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <button
          onClick={() => {
            soundEngine.playClick();
            setControlType((prev) => (prev === 'touchpad' ? 'dpad' : 'touchpad'));
          }}
          className="flex items-center space-x-1.5 px-3 py-1 bg-slate-950/85 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 rounded-full shadow-lg"
        >
          <Sliders className="w-3 h-3 text-cyan-400" />
          <span>TOUCH MODE: {controlType === 'touchpad' ? 'THUMBSTICK' : 'D-PAD BUTTONS'}</span>
        </button>
      </div>

      {/* Floating Dynamic Thumbstick (Visual indicator when touching left screen) */}
      {controlType === 'touchpad' && isStickActive && (
        <div
          style={{
            left: `${stickOrigin.x}px`,
            top: `${stickOrigin.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute pointer-events-none w-24 h-24 rounded-full border-2 border-cyan-400/50 bg-slate-950/60 flex items-center justify-center transition-opacity"
        >
          {/* Inner stick cap */}
          <div
            style={{
              transform: `translate(${stickOffset.x}px, ${stickOffset.y}px)`,
            }}
            className="w-10 h-10 rounded-full bg-cyan-400/80 border border-white shadow-lg flex items-center justify-center text-[9px] font-mono text-slate-950 font-bold"
          >
            WALK
          </div>
        </div>
      )}

      {/* Static Joystick Base Hint if idle in touchpad mode */}
      {controlType === 'touchpad' && !isStickActive && (
        <div className="absolute bottom-20 left-4 pointer-events-none opacity-60">
          <div className="w-24 h-24 rounded-full border border-dashed border-cyan-500/40 bg-slate-950/40 flex flex-col items-center justify-center text-center p-1">
            <span className="text-[9px] font-mono text-cyan-300 uppercase font-semibold">TOUCH & DRAG</span>
            <span className="text-[8px] font-mono text-slate-400">TO MOVE</span>
          </div>
        </div>
      )}

      {/* Touch Look Area Hint (Right side) */}
      <div className="absolute bottom-20 right-4 pointer-events-none opacity-50 text-right">
        <div className="px-2.5 py-1.5 rounded border border-dashed border-slate-700 bg-slate-950/30 text-[9px] font-mono text-slate-400">
          SWIPE SCREEN TO ROTATE 360°
        </div>
      </div>

      {/* D-PAD BUTTONS MODE */}
      {controlType === 'dpad' && (
        <div className="absolute bottom-18 left-3 z-30 pointer-events-auto">
          <div className="relative w-36 h-36 bg-slate-950/85 border border-cyan-500/30 rounded-full p-1.5 flex items-center justify-center shadow-2xl">
            {/* Forward Button */}
            <button
              onTouchStart={() => handleButtonPress('forward')}
              onTouchEnd={() => handleButtonRelease('forward')}
              onMouseDown={() => handleButtonPress('forward')}
              onMouseUp={() => handleButtonRelease('forward')}
              className="absolute top-1.5 w-11 h-10 bg-slate-900 border border-cyan-500/40 active:bg-cyan-500 active:text-slate-950 rounded flex items-center justify-center text-cyan-300"
              aria-label="Walk Forward"
            >
              <ChevronUp className="w-6 h-6" />
            </button>

            {/* Left Button */}
            <button
              onTouchStart={() => handleButtonPress('left')}
              onTouchEnd={() => handleButtonRelease('left')}
              onMouseDown={() => handleButtonPress('left')}
              onMouseUp={() => handleButtonRelease('left')}
              className="absolute left-1.5 w-10 h-11 bg-slate-900 border border-cyan-500/40 active:bg-cyan-500 active:text-slate-950 rounded flex items-center justify-center text-cyan-300"
              aria-label="Strafe Left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Center Core Badge */}
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400/30 flex items-center justify-center text-[8px] font-mono text-cyan-300 font-bold">
              KB
            </div>

            {/* Right Button */}
            <button
              onTouchStart={() => handleButtonPress('right')}
              onTouchEnd={() => handleButtonRelease('right')}
              onMouseDown={() => handleButtonPress('right')}
              onMouseUp={() => handleButtonRelease('right')}
              className="absolute right-1.5 w-10 h-11 bg-slate-900 border border-cyan-500/40 active:bg-cyan-500 active:text-slate-950 rounded flex items-center justify-center text-cyan-300"
              aria-label="Strafe Right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Backward Button */}
            <button
              onTouchStart={() => handleButtonPress('backward')}
              onTouchEnd={() => handleButtonRelease('backward')}
              onMouseDown={() => handleButtonPress('backward')}
              onMouseUp={() => handleButtonRelease('backward')}
              className="absolute bottom-1.5 w-11 h-10 bg-slate-900 border border-cyan-500/40 active:bg-cyan-500 active:text-slate-950 rounded flex items-center justify-center text-cyan-300"
              aria-label="Walk Backward"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Camera Rotate Buttons (Rotate Left / Right 45°) */}
      <div className="absolute bottom-28 right-4 flex space-x-2 pointer-events-auto">
        <button
          onClick={() => {
            soundEngine.playClick();
            onRotateYaw(Math.PI / 4);
          }}
          className="p-2.5 bg-slate-900/90 border border-cyan-500/40 active:bg-cyan-500 active:text-slate-950 text-cyan-300 rounded-full shadow-lg"
          title="Turn Left"
          aria-label="Turn Camera Left"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onRotateYaw(-Math.PI / 4);
          }}
          className="p-2.5 bg-slate-900/90 border border-cyan-500/40 active:bg-cyan-500 active:text-slate-950 text-cyan-300 rounded-full shadow-lg"
          title="Turn Right"
          aria-label="Turn Camera Right"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Touch Interact Button */}
      {canInteract && (
        <div className="absolute bottom-40 right-4 pointer-events-auto">
          <button
            onClick={() => {
              soundEngine.playTerminalOpen();
              onInteract();
            }}
            className="flex items-center space-x-2 px-4 py-3 rounded-full bg-cyan-400 text-slate-950 font-black border-2 border-white shadow-2xl shadow-cyan-400/50 active:scale-95 transition"
            aria-label="Access Terminal"
          >
            <Radio className="w-5 h-5 animate-spin" />
            <div className="text-left font-mono">
              <div className="text-[9px] uppercase tracking-wider text-slate-900 font-semibold">TAP TO OPEN</div>
              <div className="text-xs uppercase font-black text-black">
                {nearStationName || 'STATION TERMINAL'}
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
