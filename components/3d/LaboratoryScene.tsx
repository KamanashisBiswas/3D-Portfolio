'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { LaboratoryEnvironment, StationAnchor } from './LaboratoryEnvironment';
import { PlayerController } from './PlayerController';
import { CinematicIntroController } from './CinematicIntroController';
import { CinematicIntroOverlay } from '@/components/ui/CinematicIntroOverlay';
import { PortfolioHUD } from '@/components/ui/PortfolioHUD';
import { StationModal } from '@/components/ui/StationModal';
import { MobileControls } from '@/components/ui/MobileControls';
import { soundEngine } from '@/lib/soundEffects';

interface LaboratorySceneProps {
  onToggleViewMode: () => void;
  viewMode: '3d' | '2d';
}

export const LaboratoryScene: React.FC<LaboratorySceneProps> = ({
  onToggleViewMode,
  viewMode
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerControllerRef = useRef<PlayerController | null>(null);
  const introControllerRef = useRef<CinematicIntroController | null>(null);
  const envRef = useRef<LaboratoryEnvironment | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(15);
  const [isIntroRunning, setIsIntroRunning] = useState(true);
  const [introScene, setIntroScene] = useState(1);
  const [nearStation, setNearStation] = useState<StationAnchor | null>(null);
  const [activeStationId, setActiveStationId] = useState<string | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  const isIntroRunningRef = useRef(isIntroRunning);
  const activeStationIdRef = useRef(activeStationId);

  useEffect(() => {
    isIntroRunningRef.current = isIntroRunning;
    activeStationIdRef.current = activeStationId;
  }, [isIntroRunning, activeStationId]);

  // Teleport to station
  const handleTeleportTo = useCallback((stationId: string) => {
    if (!envRef.current || !playerControllerRef.current) return;
    const station = envRef.current.stations.find((s) => s.id === stationId);
    if (!station) return;

    // Station desk is on West wing (x < 0) or East wing (x > 0)
    // The desk faces the central corridor (towards x = 0).
    // So the player stands directly in front of the desk facing the screen!
    const standDist = 2.4;
    const standX = station.position.x < 0
      ? station.position.x + standDist
      : station.position.x - standDist;

    const targetPos = new THREE.Vector3(standX, 1.7, station.position.z);
    const lookAtTarget = new THREE.Vector3(station.position.x, 1.8, station.position.z);
    playerControllerRef.current.flyTo(targetPos, lookAtTarget);
  }, []);

  const handleTeleportToRef = useRef(handleTeleportTo);
  useEffect(() => {
    handleTeleportToRef.current = handleTeleportTo;
  }, [handleTeleportTo]);

  // Station modal open
  const handleOpenStation = useCallback((stationId: string) => {
    setActiveStationId(stationId);
    if (playerControllerRef.current) {
      playerControllerRef.current.exitPointerLock();
    }
  }, []);

  // Audio toggle
  const handleToggleAudio = useCallback(() => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  }, [isAudioMuted]);

  // Request pointer lock
  const handleRequestPointerLock = useCallback(() => {
    if (playerControllerRef.current && !isIntroRunning && !activeStationId) {
      playerControllerRef.current.requestPointerLock();
    }
  }, [isIntroRunning, activeStationId]);

  // Skip or start exploring intro
  const handleSkipIntro = useCallback(() => {
    if (introControllerRef.current) {
      introControllerRef.current.skip();
    }
    setIsIntroRunning(false);
  }, []);

  const handleStartExploring = useCallback(() => {
    if (introControllerRef.current) {
      introControllerRef.current.finishAndStartExploring();
    }
    setIsIntroRunning(false);
    // Request pointer lock for immersion
    setTimeout(() => {
      handleRequestPointerLock();
    }, 300);
  }, [handleRequestPointerLock]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060910);
    scene.fog = new THREE.FogExp2(0x060910, 0.022);

    const camera = new THREE.PerspectiveCamera(
      68,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );

    // 2. Renderer Setup (PBR, ACESFilmic, SRGB per Skill guidelines)
    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2b. Post-Processing: Cinematic Bloom (Controlled Neon Glow)
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.45,  // strength — refined sci-fi neon intensity (was 0.85)
      0.25,  // radius — controlled, tight glow spread (was 0.4)
      0.78   // threshold — ONLY bright neon elements bloom, preventing room blowout (was 0.12!)
    );
    composer.addPass(bloomPass);

    // 3. PMREM Procedural Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    setLoadProgress(50);

    // 4. Build Laboratory Environment Architecture
    const env = new LaboratoryEnvironment();
    envRef.current = env;
    scene.add(env.rootGroup);

    setLoadProgress(80);

    // 5. Player Controller
    const playerController = new PlayerController({
      camera,
      domElement: renderer.domElement,
      collisionBoxes: env.collisionBoxes,
      stations: env.stations,
      onNearStationChange: (station) => {
        setNearStation(station);
        if (station) {
          soundEngine.playProximityPing();
        }
      },
      onInteract: (station) => {
        soundEngine.playTerminalOpen();
        setActiveStationId(station.id);
      },
    });
    playerControllerRef.current = playerController;

    // 6. Cinematic Intro Controller
    const introController = new CinematicIntroController(
      camera,
      env,
      (sceneNum) => {
        setIntroScene(sceneNum);
      },
      () => {
        setIsIntroRunning(false);
      }
    );
    introControllerRef.current = introController;

    // Pre-warm renderer
    renderer.compile(scene, camera);
    setLoadProgress(100);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
      bloomPass.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Pointer lock listener
    const onLockChange = () => {
      setIsPointerLocked(document.pointerLockElement === renderer.domElement);
    };
    document.addEventListener('pointerlockchange', onLockChange);

    // Raycaster for tapping on stations directly
    const raycaster = new THREE.Raycaster();
    const tapCoord = new THREE.Vector2();

    // Click or tap canvas handler
    const handleCanvasClick = (e: MouseEvent) => {
      if (isIntroRunningRef.current || activeStationIdRef.current) return;

      // Check if user clicked on a 3D station
      const rect = container.getBoundingClientRect();
      tapCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      tapCoord.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(tapCoord, camera);
      if (envRef.current) {
        const stationGroups = envRef.current.stations.map((s) => s.meshGroup);
        const intersects = raycaster.intersectObjects(stationGroups, true);

        if (intersects.length > 0) {
          const hitObj = intersects[0].object;
          for (const station of envRef.current.stations) {
            let current: THREE.Object3D | null = hitObj;
            while (current) {
              if (current === station.meshGroup) {
                soundEngine.playTerminalOpen();
                handleTeleportToRef.current(station.id);
                return;
              }
              current = current.parent;
            }
          }
        }
      }
    };
    renderer.domElement.addEventListener('click', handleCanvasClick);

    // 8. Main Render Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Update lab rotating holograms and particle movement
      env.update(elapsedTime, delta);

      // Either intro camera moves, or player controls camera
      if (introController.isRunning) {
        introController.update(delta);
      } else {
        playerController.update(delta);
      }

      composer.render();
    };

    animate();

    // Key listener for entering facility during intro (matching HTML spec)
    const handleIntroKeyDown = (e: KeyboardEvent) => {
      if (isIntroRunningRef.current && (e.key === 'Enter' || e.key === 'e' || e.key === 'E')) {
        handleSkipIntro();
      }
    };
    window.addEventListener('keydown', handleIntroKeyDown);

    // 9. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleIntroKeyDown);
      document.removeEventListener('pointerlockchange', onLockChange);
      renderer.domElement.removeEventListener('click', handleCanvasClick);

      playerController.dispose();
      envTexture.dispose();
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 overflow-hidden select-none touch-none">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-crosshair touch-none" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 font-mono text-cyan-400 p-6">
          <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin mb-6" />
          <div className="text-sm tracking-widest uppercase font-bold text-white mb-2">
            INITIALIZING 3D SCIENCE LAB
          </div>
          <div className="text-xs text-cyan-300/80 mb-4">
            COMPILING PROCEDURAL SHADERS & QUANTUM CORE // {loadProgress}%
          </div>
          <div className="w-56 h-1 bg-slate-900 rounded overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Cinematic Intro Overlay */}
      {!isLoading && isIntroRunning && (
        <CinematicIntroOverlay
          currentScene={introScene}
          onSkip={handleSkipIntro}
          onStartExploring={handleStartExploring}
          isIntroRunning={isIntroRunning}
        />
      )}

      {/* Laboratory Exploration HUD */}
      {!isLoading && !isIntroRunning && (
        <>
          <PortfolioHUD
            nearStation={nearStation}
            onOpenStation={handleOpenStation}
            onTeleportTo={handleTeleportTo}
            onToggleViewMode={onToggleViewMode}
            viewMode={viewMode}
            isAudioMuted={isAudioMuted}
            onToggleAudio={handleToggleAudio}
            isPointerLocked={isPointerLocked}
            onRequestPointerLock={handleRequestPointerLock}
          />

          {/* Virtual Mobile Joystick and Touch Controls */}
          <MobileControls
            onMove={(vector) => {
              if (playerControllerRef.current) {
                playerControllerRef.current.virtualJoystick = vector;
              }
            }}
            onRotate={(deltaX, deltaY) => {
              if (playerControllerRef.current) {
                playerControllerRef.current.touchRotate(deltaX, deltaY);
              }
            }}
            onRotateYaw={(deltaYaw) => {
              if (playerControllerRef.current) {
                playerControllerRef.current.rotateYaw(deltaYaw);
              }
            }}
            onDirectionalMove={(dir, active) => {
              if (playerControllerRef.current) {
                playerControllerRef.current.setDirectionalMove(dir, active);
              }
            }}
            onInteract={() => {
              if (nearStation) {
                handleOpenStation(nearStation.id);
              }
            }}
            canInteract={!!nearStation}
            nearStationName={nearStation?.name}
          />
        </>
      )}

      {/* Interactive Station Data Terminal Modal */}
      <StationModal
        stationId={activeStationId}
        onClose={() => setActiveStationId(null)}
      />
    </div>
  );
};
