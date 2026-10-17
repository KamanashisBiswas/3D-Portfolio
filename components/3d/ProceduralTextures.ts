import * as THREE from 'three';

/**
 * Creates high-fidelity procedural CanvasTextures for the futuristic science laboratory.
 * All textures are 100% in-code generated (zero external 404 assets).
 * V2: Enhanced with glowing circuit nodes, scanlines, richer detail.
 */

export function createLabFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base dark navy graphite floor
  ctx.fillStyle = '#06090f';
  ctx.fillRect(0, 0, 1024, 1024);

  // Large ceramic/metallic slab grids
  const gridSize = 256;
  ctx.strokeStyle = '#1a2d44';
  ctx.lineWidth = 3;
  for (let x = 0; x <= 1024; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
  }

  // Inner sub-grid (subtle)
  ctx.strokeStyle = '#0d1624';
  ctx.lineWidth = 1;
  const subGrid = 64;
  for (let x = 0; x <= 1024; x += subGrid) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += subGrid) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
  }

  // Cyan circuit traces — main paths
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
  ctx.lineWidth = 1.5;
  // Horizontal trace lines
  [[128, 128, 896, 128], [128, 896, 896, 896], [256, 256, 768, 256], [256, 768, 768, 768]].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  });
  // Vertical trace lines
  [[128, 128, 128, 896], [896, 128, 896, 896], [256, 256, 256, 768], [768, 256, 768, 768]].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  });

  // Glowing circuit intersection nodes
  const nodes = [
    [128, 128], [896, 128], [128, 896], [896, 896],
    [256, 256], [768, 256], [256, 768], [768, 768],
    [512, 128], [512, 896], [128, 512], [896, 512],
    [512, 512], [512, 256], [512, 768], [256, 512], [768, 512],
  ];
  nodes.forEach(([cx, cy]) => {
    // Outer glow
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 18);
    grd.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
    grd.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fill();
    // Inner bright dot
    ctx.fillStyle = 'rgba(0, 240, 255, 0.9)';
    ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
    // Crosshair ticks
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 14, cy); ctx.lineTo(cx - 6, cy);
    ctx.moveTo(cx + 6, cy); ctx.lineTo(cx + 14, cy);
    ctx.moveTo(cx, cy - 14); ctx.lineTo(cx, cy - 6);
    ctx.moveTo(cx, cy + 6); ctx.lineTo(cx, cy + 14);
    ctx.stroke();
  });

  // Purple accent trace (secondary circuit)
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(384, 384); ctx.lineTo(640, 384); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(384, 640); ctx.lineTo(640, 640); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(384, 384); ctx.lineTo(384, 640); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(640, 384); ctx.lineTo(640, 640); ctx.stroke();

  // Lab telemetry text
  ctx.fillStyle = 'rgba(0, 240, 255, 0.30)';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('LAB-SECTOR 01 // KB RESEARCH CORE', 44, 148);
  ctx.fillText('STATION GRID A-4 // SYSTEM ACTIVE', 44, 660);
  ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
  ctx.fillText('HIGH-VOLTAGE QUANTUM DATASTREAM', 560, 148);
  ctx.fillText('FULL-STACK DIGITAL LAB // ONLINE', 560, 660);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createFloorRoughnessMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#181818'; // low roughness = slightly reflective
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#aaaaaa';
  ctx.lineWidth = 5;
  for (let x = 0; x <= 512; x += 128) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
  }
  for (let y = 0; y <= 512; y += 128) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export function createWallPanelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#08101e';
  ctx.fillRect(0, 0, 512, 512);

  // Outer panel frame
  ctx.strokeStyle = '#1a2d44';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 496, 496);

  // Internal dark inset panel
  ctx.fillStyle = '#0b1420';
  ctx.fillRect(20, 20, 472, 472);

  // Horizontal ventilation slots
  ctx.fillStyle = '#050a12';
  for (let y = 80; y < 420; y += 22) {
    ctx.fillRect(55, y, 402, 10);
  }

  // Top cyan status bar
  ctx.fillStyle = '#00f0ff';
  ctx.fillRect(55, 48, 130, 5);
  // Dim segment
  ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
  ctx.fillRect(200, 48, 80, 5);

  // Warning triangle icon area (top-right)
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(420, 52); ctx.lineTo(440, 52); ctx.lineTo(430, 36); ctx.closePath();
  ctx.stroke();

  // Panel ID text
  ctx.fillStyle = 'rgba(0, 240, 255, 0.45)';
  ctx.font = '11px monospace';
  ctx.fillText('MODULE-PW-99 // ACTIVE', 240, 56);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createHoloScreenTexture(
  title: string,
  subtitle: string,
  codeLines: string[],
  accentColor: string = '#00f0ff'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;

  // Dark hologram background with slight gradient
  const bgGrd = ctx.createLinearGradient(0, 0, 0, 320);
  bgGrd.addColorStop(0, 'rgba(4, 12, 28, 0.96)');
  bgGrd.addColorStop(1, 'rgba(6, 20, 44, 0.96)');
  ctx.fillStyle = bgGrd;
  ctx.fillRect(0, 0, 512, 320);

  // CRT Scanlines overlay (subtle)
  for (let sy = 0; sy < 320; sy += 4) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(0, sy, 512, 2);
  }

  // Glowing border with inner glow
  ctx.shadowColor = accentColor;
  ctx.shadowBlur = 8;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(3, 3, 506, 314);
  ctx.shadowBlur = 0;

  // Header band with gradient
  const headerGrd = ctx.createLinearGradient(0, 8, 512, 8);
  headerGrd.addColorStop(0, accentColor);
  headerGrd.addColorStop(1, `${accentColor}88`);
  ctx.fillStyle = headerGrd;
  ctx.fillRect(6, 6, 500, 34);

  // Title text (dark on bright header)
  ctx.fillStyle = '#020810';
  ctx.font = 'bold 17px monospace';
  ctx.fillText(title.toUpperCase().slice(0, 32), 16, 29);

  // Subtitle
  ctx.fillStyle = accentColor;
  ctx.font = '13px monospace';
  ctx.globalAlpha = 0.9;
  ctx.fillText(subtitle.slice(0, 58), 16, 60);
  ctx.globalAlpha = 1.0;

  // Divider line with tick marks
  ctx.strokeStyle = `${accentColor}66`;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(16, 72); ctx.lineTo(496, 72); ctx.stroke();
  [60, 160, 260, 360, 460].forEach(tx => {
    ctx.beginPath(); ctx.moveTo(tx, 68); ctx.lineTo(tx, 76); ctx.stroke();
  });

  // Code / telemetry lines
  ctx.font = '12px monospace';
  let y = 96;
  codeLines.slice(0, 7).forEach((line, i) => {
    // Alternate row backgrounds
    if (i % 2 === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      ctx.fillRect(12, y - 12, 488, 20);
    }
    // Prompt character
    ctx.fillStyle = `${accentColor}aa`;
    ctx.fillText('›', 12, y);
    // Line content
    ctx.fillStyle = i === 0 ? '#e2f8ff' : '#94d8e8';
    ctx.fillText(line.slice(0, 60), 28, y);
    y += 22;
  });

  // Footer bar
  ctx.fillStyle = `${accentColor}22`;
  ctx.fillRect(6, 278, 500, 34);
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 11px monospace';
  ctx.fillText('● STATUS: ONLINE // PRESS [E] TO INTERACT', 16, 298);

  // Corner brackets (all four)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  // TL
  ctx.beginPath(); ctx.moveTo(10, 20); ctx.lineTo(10, 10); ctx.lineTo(20, 10); ctx.stroke();
  // TR
  ctx.beginPath(); ctx.moveTo(502, 20); ctx.lineTo(502, 10); ctx.lineTo(492, 10); ctx.stroke();
  // BL
  ctx.beginPath(); ctx.moveTo(10, 300); ctx.lineTo(10, 310); ctx.lineTo(20, 310); ctx.stroke();
  // BR
  ctx.beginPath(); ctx.moveTo(502, 300); ctx.lineTo(502, 310); ctx.lineTo(492, 310); ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export interface TypewriterScreenInstance {
  texture: THREE.CanvasTexture;
  update: (time: number, delta: number) => void;
}

/**
 * Creates an animated typewriter terminal screen texture for 3D laboratory stations.
 * Renders high-resolution (640x380) terminal with live typing text and blinking cursor block.
 */
export function createTypewriterHoloScreenTexture(
  title: string,
  subtitle: string,
  codeLines: string[],
  accentColor: string = '#00f0ff',
  startDelay: number = 0.2
): TypewriterScreenInstance {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 380;
  const ctx = canvas.getContext('2d')!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const totalChars = codeLines.reduce((acc, line) => acc + line.length, 0);
  const charsPerSec = 36;
  const typeDuration = totalChars / charsPerSec;
  const holdDuration = 18; // stay fully visible for 18 seconds before looping
  const cycleDuration = startDelay + typeDuration + holdDuration;

  let lastVisibleChars = -1;
  let lastCursorOn = false;

  const renderFrame = (visibleChars: number, cursorOn: boolean) => {
    ctx.clearRect(0, 0, 640, 380);

    // Dark hologram glass gradient
    const bgGrd = ctx.createLinearGradient(0, 0, 0, 380);
    bgGrd.addColorStop(0, 'rgba(4, 11, 24, 0.96)');
    bgGrd.addColorStop(1, 'rgba(6, 18, 38, 0.96)');
    ctx.fillStyle = bgGrd;
    ctx.fillRect(0, 0, 640, 380);

    // Subtle CRT scanlines
    for (let sy = 0; sy < 380; sy += 4) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, sy, 640, 2);
    }

    // Glowing border
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 8;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(4, 4, 632, 372);
    ctx.shadowBlur = 0;

    // Corner tech brackets
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    // TL
    ctx.beginPath(); ctx.moveTo(12, 26); ctx.lineTo(12, 12); ctx.lineTo(26, 12); ctx.stroke();
    // TR
    ctx.beginPath(); ctx.moveTo(628, 26); ctx.lineTo(628, 12); ctx.lineTo(614, 12); ctx.stroke();
    // BL
    ctx.beginPath(); ctx.moveTo(12, 354); ctx.lineTo(12, 368); ctx.lineTo(26, 368); ctx.stroke();
    // BR
    ctx.beginPath(); ctx.moveTo(628, 354); ctx.lineTo(628, 368); ctx.lineTo(614, 368); ctx.stroke();

    // Header band with gradient
    const headerGrd = ctx.createLinearGradient(0, 8, 640, 8);
    headerGrd.addColorStop(0, accentColor);
    headerGrd.addColorStop(1, `${accentColor}77`);
    ctx.fillStyle = headerGrd;
    ctx.fillRect(8, 8, 624, 38);

    // Title text
    ctx.fillStyle = '#020810';
    ctx.font = "bold 17px 'JetBrains Mono', monospace";
    ctx.fillText(title.toUpperCase().slice(0, 36), 20, 33);

    // Status pill on header right
    ctx.fillStyle = 'rgba(2, 8, 16, 0.85)';
    ctx.beginPath();
    ctx.roundRect(500, 14, 120, 26, 6);
    ctx.fill();
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.arc(516, 27, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.fillText('ONLINE', 528, 31);

    // Subtitle
    ctx.fillStyle = accentColor;
    ctx.font = "12px 'JetBrains Mono', monospace";
    ctx.globalAlpha = 0.95;
    ctx.fillText(subtitle.slice(0, 68), 20, 68);
    ctx.globalAlpha = 1.0;

    // Divider line with tick marks
    ctx.strokeStyle = `${accentColor}55`;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(20, 80); ctx.lineTo(620, 80); ctx.stroke();
    [80, 200, 320, 440, 560].forEach(tx => {
      ctx.beginPath(); ctx.moveTo(tx, 76); ctx.lineTo(tx, 84); ctx.stroke();
    });

    // Code / telemetry lines (typewriter effect)
    ctx.font = "13px 'JetBrains Mono', monospace";
    let y = 112;
    let remainingChars = visibleChars;
    let cursorDrawn = false;

    codeLines.forEach((line, i) => {
      if (remainingChars <= 0) return;

      // Row background
      if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.fillRect(16, y - 14, 608, 22);
      }

      // Prompt character ›
      ctx.fillStyle = accentColor;
      ctx.fillText('›', 20, y);

      if (remainingChars >= line.length) {
        // Line fully revealed
        ctx.fillStyle = i === 0 ? '#e0f2fe' : '#94a3b8';
        ctx.fillText(line, 38, y);
        remainingChars -= line.length;

        // If last line and all chars typed, draw blinking cursor at line end
        if ((i === codeLines.length - 1 || remainingChars === 0) && !cursorDrawn && cursorOn) {
          const tw = ctx.measureText(line).width;
          ctx.fillStyle = accentColor;
          ctx.fillText('█', 42 + tw, y);
          cursorDrawn = true;
        }
      } else {
        // Actively typing line
        const slice = line.slice(0, remainingChars);
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(slice, 38, y);
        if (cursorOn) {
          const tw = ctx.measureText(slice).width;
          ctx.fillStyle = '#ffffff';
          ctx.fillText('█', 42 + tw, y);
        }
        cursorDrawn = true;
        remainingChars = 0;
      }
      y += 26;
    });

    // If nothing typed yet, show blinking cursor on first line
    if (visibleChars === 0 && cursorOn) {
      ctx.fillStyle = accentColor;
      ctx.fillText('› █', 20, 112);
    }

    // Footer bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(8, 342, 624, 30);
    ctx.fillStyle = accentColor;
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.fillText('● DATA FEED LIVE // PRESS [E] TO INSPECT', 20, 362);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('SEC-LINK // OK', 620, 362);
    ctx.textAlign = 'left';

    texture.needsUpdate = true;
  };

  // Initial draw so the canvas isn't blank
  renderFrame(0, true);

  return {
    texture,
    update: (time: number) => {
      const cycleTime = (time + startDelay * 0.7) % cycleDuration;
      let visibleChars = 0;

      if (cycleTime < startDelay) {
        visibleChars = 0;
      } else if (cycleTime < startDelay + typeDuration) {
        visibleChars = Math.floor((cycleTime - startDelay) * charsPerSec);
      } else {
        visibleChars = totalChars;
      }

      const cursorOn = Math.floor(time * 3) % 2 === 0;

      // Throttle redraws to save CPU/GPU
      if (visibleChars === lastVisibleChars && (visibleChars >= totalChars ? cursorOn === lastCursorOn : true)) {
        return;
      }

      lastVisibleChars = visibleChars;
      lastCursorOn = cursorOn;
      renderFrame(visibleChars, cursorOn);
    },
  };
}

export function createPedestalRingTexture(label: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#06090f';
  ctx.fillRect(0, 0, 512, 512);

  // Outer glow ring
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 16;
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(256, 256, 218, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Dashed inner ring
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.setLineDash([14, 10]);
  ctx.beginPath();
  ctx.arc(256, 256, 178, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 8 tick marks around the ring
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const r1 = 196, r2 = 210;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(256 + Math.cos(angle) * r1, 256 + Math.sin(angle) * r1);
    ctx.lineTo(256 + Math.cos(angle) * r2, 256 + Math.sin(angle) * r2);
    ctx.stroke();
  }

  // Center label text with glow
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#00f0ff';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(label.toUpperCase().slice(0, 22), 256, 264);
  ctx.shadowBlur = 0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Building window texture for the cityscape panorama */
export function createBuildingWindowTexture(seed: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Building facade
  ctx.fillStyle = '#05080f';
  ctx.fillRect(0, 0, 256, 512);

  // Random window grid
  const windowColors = ['#ffd580', '#ffe09a', '#e8f4ff', '#00f0ff', '#a855f7', '#44ddff'];
  const rng = (n: number) => ((Math.sin(seed * 127.1 + n * 311.7) * 43758.5453) % 1 + 1) % 1;

  const cols = 6, rows = 16;
  const ww = 28, wh = 18, gx = 14, gy = 12;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = rng(r * cols + c + seed) > 0.35;
      const x = gx + c * (ww + gx);
      const y = gy + r * (wh + gy);
      if (lit) {
        const color = windowColors[Math.floor(rng(r * 7 + c + seed * 3) * windowColors.length)];
        // Window glow
        const grd = ctx.createRadialGradient(x + ww / 2, y + wh / 2, 0, x + ww / 2, y + wh / 2, ww);
        grd.addColorStop(0, color + 'cc');
        grd.addColorStop(1, color + '11');
        ctx.fillStyle = grd;
        ctx.fillRect(x - 4, y - 4, ww + 8, wh + 8);
        // Window itself
        ctx.fillStyle = color + 'dd';
        ctx.fillRect(x, y, ww, wh);
      } else {
        // Dark window
        ctx.fillStyle = '#0a0e18';
        ctx.fillRect(x, y, ww, wh);
        // Very dim interior glow (some barely on)
        if (rng(r * c + seed * 7) > 0.8) {
          ctx.fillStyle = 'rgba(255, 200, 100, 0.08)';
          ctx.fillRect(x, y, ww, wh);
        }
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural texture for the Sci-Fi Blast Door Leaves (Left & Right)
 * Faithfully recreating the metallic panel, vision port, structural ribs,
 * locking pins, and yellow/black hazard caution stripes.
 */
export function createAirlockDoorTexture(side: 'left' | 'right'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Dark metallic panel gradient (#18202d -> #101622 -> #0b0f19)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  bgGrad.addColorStop(0, '#1c2536');
  bgGrad.addColorStop(0.45, '#101622');
  bgGrad.addColorStop(1, '#080c14');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 1024);

  // 2. Beveled border & inner panel frame
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.strokeRect(6, 6, 500, 1012);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.strokeRect(10, 10, 492, 1004);

  // Inner recessed panel line
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.strokeRect(24, 24, 464, 976);

  // 3. Top Structural Reinforcement Ribs
  ctx.fillStyle = '#64748b';
  ctx.font = "bold 20px 'JetBrains Mono', monospace";
  if (side === 'left') {
    ctx.fillText('PART: DR-L//903', 38, 70);
    // 2 Rivet dots
    [430, 460].forEach((rx) => {
      ctx.beginPath();
      ctx.arc(rx, 64, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#334155';
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  } else {
    // 2 Rivet dots
    [52, 82].forEach((rx) => {
      ctx.beginPath();
      ctx.arc(rx, 64, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#334155';
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    ctx.fillText('PART: DR-R//904', 270, 70);
  }

  // 4. Recessed Reinforced Vision Port Window
  const vpX = 56;
  const vpY = 120;
  const vpW = 400;
  const vpH = 140;
  const vpR = 14;

  // Window outer housing
  ctx.fillStyle = '#090d16';
  ctx.beginPath();
  ctx.roundRect(vpX, vpY, vpW, vpH, vpR);
  ctx.fill();

  // Cyan border & glow
  ctx.shadowColor = '#00f2fe';
  ctx.shadowBlur = 12;
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.75)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Inner window glass gradient
  const winGrad = ctx.createLinearGradient(vpX, vpY, vpX, vpY + vpH);
  winGrad.addColorStop(0, 'rgba(8, 51, 68, 0.9)');
  winGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.95)');
  winGrad.addColorStop(1, 'rgba(8, 51, 68, 0.9)');
  ctx.fillStyle = winGrad;
  ctx.beginPath();
  ctx.roundRect(vpX + 6, vpY + 6, vpW - 12, vpH - 12, vpR - 4);
  ctx.fill();

  // Glass reflection sheen
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(vpX + 30, vpY + vpH - 15);
  ctx.lineTo(vpX + 130, vpY + 15);
  ctx.moveTo(vpX + 80, vpY + vpH - 15);
  ctx.lineTo(vpX + 180, vpY + 15);
  ctx.stroke();

  // Window Text Label
  ctx.fillStyle = '#38bdf8';
  ctx.font = "bold 22px 'JetBrains Mono', monospace";
  ctx.textAlign = 'center';
  const labelText = side === 'left' ? 'AIRLOCK VACUUM' : 'INTERIOR DEPRESS';
  ctx.fillText(labelText, vpX + vpW / 2, vpY + vpH / 2 + 6);
  ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
  ctx.font = "12px 'JetBrains Mono', monospace";
  ctx.fillText('SEAL INTEGRITY: 100%', vpX + vpW / 2, vpY + vpH / 2 + 30);
  ctx.textAlign = 'start';

  // 5. Mid-Gate Reinforcement Seam with Rivet Boss
  const midY = 490;
  // Horizontal seam lines
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.9)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(30, midY);
  ctx.lineTo(210, midY);
  ctx.moveTo(302, midY);
  ctx.lineTo(482, midY);
  ctx.stroke();

  // Center rivet boss
  ctx.beginPath();
  ctx.arc(256, midY, 20, 0, Math.PI * 2);
  ctx.fillStyle = '#1e293b';
  ctx.fill();
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(256, midY, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#00f2fe';
  ctx.fill();

  // 6. Subpanel Bevel Grooves
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 290, 432, 170);
  ctx.strokeRect(40, 520, 432, 180);

  // 7. Lower Hydraulic Locking Anchor Points & Mechanical Pins
  const pinY = 740;
  const pinW = 86;
  const pinH = 26;
  const pinXs = [42, 154, 268, 380];
  pinXs.forEach((px) => {
    // Housing slot
    ctx.beginPath();
    ctx.roundRect(px, pinY, pinW, pinH, 13);
    ctx.fillStyle = '#0c121e';
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pin cylinder inside
    ctx.beginPath();
    ctx.roundRect(px + 8, pinY + 5, pinW - 16, pinH - 10, 6);
    ctx.fillStyle = '#475569';
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // 8. Caution / Hazard Stripes along the bottom (matching HTML .hazard-stripes)
  const hzY = 880;
  const hzH = 120;
  ctx.save();
  ctx.beginPath();
  ctx.rect(14, hzY, 484, hzH);
  ctx.clip();

  // 45 degree yellow and charcoal stripes
  ctx.fillStyle = '#111827';
  ctx.fillRect(14, hzY, 484, hzH);

  ctx.fillStyle = '#facc15';
  const stripeWidth = 24;
  for (let x = -hzH; x < 512 + hzH; x += stripeWidth * 2) {
    ctx.beginPath();
    ctx.moveTo(x, hzY + hzH);
    ctx.lineTo(x + stripeWidth, hzY + hzH);
    ctx.lineTo(x + stripeWidth + hzH, hzY);
    ctx.lineTo(x + hzH, hzY);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Hazard border
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.lineWidth = 3;
  ctx.strokeRect(14, hzY, 484, hzH);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural texture for Portal Arch Header
 * Displays warning strobes (AL-01, SYS-OK) and green clearance array (CLEARANCE: GRANTED).
 */
export function createClearanceHeaderTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Background header plate
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 256);
  bgGrad.addColorStop(0, '#1c2434');
  bgGrad.addColorStop(1, '#0e1420');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 256);

  // Border
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 1016, 248);

  // 1. Left Warning Strobe & AL-01
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(60, 128, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(60, 128, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#94a3b8';
  ctx.font = "bold 26px 'JetBrains Mono', monospace";
  ctx.fillText('AL-01', 100, 137);

  // 2. Central Clearance Status Array
  const badgeX = 220;
  const badgeY = 50;
  const badgeW = 584;
  const badgeH = 156;

  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 4 Pulsing Green LEDs
  const ledY = badgeY + badgeH / 2;
  const ledXs = [badgeX + 36, badgeX + 70, badgeX + 104, badgeX + 138];
  ledXs.forEach((lx) => {
    // Glow halo
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(lx, ledY, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#34d399';
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Clearance Text
  ctx.fillStyle = '#10b981';
  ctx.font = "bold 30px 'JetBrains Mono', monospace";
  ctx.fillText('CLEARANCE: GRANTED', badgeX + 180, ledY + 10);

  // 3. Right Warning Strobe & SYS-OK
  ctx.fillStyle = '#94a3b8';
  ctx.font = "bold 26px 'JetBrains Mono', monospace";
  ctx.fillText('SYS-OK', 830, 137);

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(960, 128, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(960, 128, 12, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural texture for cyan light emission reflection pool on the ground
 */
export function createFloorReflectionTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const radGrad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  radGrad.addColorStop(0, 'rgba(0, 242, 254, 0.65)');
  radGrad.addColorStop(0.3, 'rgba(0, 242, 254, 0.35)');
  radGrad.addColorStop(0.65, 'rgba(0, 242, 254, 0.1)');
  radGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');

  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
