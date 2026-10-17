import * as THREE from 'three';
import {
  createLabFloorTexture,
  createFloorRoughnessMap,
  createWallPanelTexture,
  createHoloScreenTexture,
  createTypewriterHoloScreenTexture,
  TypewriterScreenInstance,
  createPedestalRingTexture,
  createBuildingWindowTexture,
  createAirlockDoorTexture,
  createClearanceHeaderTexture,
  createFloorReflectionTexture,
} from './ProceduralTextures';

export interface CollisionBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface StationAnchor {
  id: string;
  name: string;
  code: string;
  position: THREE.Vector3;
  meshGroup: THREE.Group;
  interactRadius: number;
  type: string;
}


export class LaboratoryEnvironment {
  public rootGroup: THREE.Group;
  public collisionBoxes: CollisionBox[] = [];
  public stations: StationAnchor[] = [];
  public animatedMeshes: { mesh: THREE.Object3D; update: (time: number, delta: number) => void }[] = [];
  public doorLeft: THREE.Mesh | null = null;
  public doorRight: THREE.Mesh | null = null;
  public doorTargetOpen: number = 0;

  constructor() {
    this.rootGroup = new THREE.Group();
    this.buildArchitecture();
    this.buildStations();
    this.buildLightingAndParticles();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // ARCHITECTURE
  // ───────────────────────────────────────────────────────────────────────────
  private buildArchitecture() {
    const roomWidth = 24;
    const roomLength = 34;
    const roomHeight = 7.5;

    // Floor
    const floorGeo = new THREE.PlaneGeometry(roomWidth, roomLength);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a1420,
      roughness: 0.45,
      metalness: 0.35,
      map: createLabFloorTexture(),
      roughnessMap: createFloorRoughnessMap(),
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.rootGroup.add(floor);

    // Ceiling
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x060b12, roughness: 0.85, metalness: 0.4 });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomLength), ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = roomHeight;
    this.rootGroup.add(ceiling);

    // Ceiling trusses & neon light rails
    for (let z = -14; z <= 14; z += 5.6) {
      const truss = new THREE.Mesh(
        new THREE.BoxGeometry(roomWidth - 0.5, 0.4, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x111c2c, metalness: 0.85, roughness: 0.25 })
      );
      truss.position.set(0, roomHeight - 0.2, z);
      this.rootGroup.add(truss);

      // Primary cyan strip
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(roomWidth - 4, 0.07, 0.1),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff })
      );
      strip.position.set(0, roomHeight - 0.43, z);
      this.rootGroup.add(strip);

      // Secondary purple accent strip
      const strip2 = new THREE.Mesh(
        new THREE.BoxGeometry(roomWidth - 10, 0.04, 0.08),
        new THREE.MeshBasicMaterial({ color: 0xa855f7 })
      );
      strip2.position.set(0, roomHeight - 0.5, z);
      this.rootGroup.add(strip2);
    }

    // Walls
    const wallPanelTexture = createWallPanelTexture();
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0b1320,
      roughness: 0.4,
      metalness: 0.7,
      map: wallPanelTexture,
    });

    const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.8, roomHeight, roomLength), wallMat);
    westWall.position.set(-12.4, roomHeight / 2, 0);
    this.rootGroup.add(westWall);

    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.8, roomHeight, roomLength), wallMat);
    eastWall.position.set(12.4, roomHeight / 2, 0);
    this.rootGroup.add(eastWall);

    this.buildNorthObservationWindow(roomWidth, roomHeight, -17);
    this.buildSouthEntrance(roomWidth, roomHeight, 17);

    // Glowing baseboard runners — cyan
    const runnerGeoH = new THREE.BoxGeometry(0.08, 0.18, roomLength);
    const runnerMatC = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const rW = new THREE.Mesh(runnerGeoH, runnerMatC);
    rW.position.set(-11.96, 0.09, 0); this.rootGroup.add(rW);
    const rE = new THREE.Mesh(runnerGeoH, runnerMatC);
    rE.position.set(11.96, 0.09, 0); this.rootGroup.add(rE);

    // Purple runner on south wall side
    const runnerMatP = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
    const rS = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, 0.08, 0.08), runnerMatP);
    rS.position.set(0, 0.04, 16.6); this.rootGroup.add(rS);

    this.collisionBoxes.push(
      { minX: -15, maxX: -11.5, minZ: -18, maxZ: 18 },
      { minX: 11.5, maxX: 15, minZ: -18, maxZ: 18 },
      { minX: -13, maxX: 13, minZ: -18.5, maxZ: -16.5 }
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // NORTH OBSERVATION WINDOW — Upgraded cityscape
  // ───────────────────────────────────────────────────────────────────────────
  private buildNorthObservationWindow(width: number, height: number, z: number) {
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x080d16, metalness: 0.9, roughness: 0.15 });

    // Glass pane
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x66aadd,
      transparent: true,
      opacity: 0.28,
      roughness: 0.05,
      metalness: 0.0,
      transmission: 0.9,
      ior: 1.45,
    });
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(width - 2, height - 1.5), glassMat);
    glass.position.set(0, height / 2 + 0.2, z + 0.1);
    this.rootGroup.add(glass);

    // Frame mullions
    [-8, -4, 0, 4, 8].forEach((x) => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.28, height, 0.38), frameMat);
      col.position.set(x, height / 2, z + 0.15);
      this.rootGroup.add(col);
    });

    // ── Panorama group behind the glass ──────────────────────────────────────
    const pano = new THREE.Group();
    pano.position.set(0, 0, z - 6);

    // Sky dome — deep space gradient
    const skyGeo = new THREE.SphereGeometry(55, 32, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x03060e,
      side: THREE.BackSide,
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    skyDome.position.set(0, 20, -20);
    pano.add(skyDome);

    // Nebula band (large plane with additive blend)
    const nebulaGeo = new THREE.PlaneGeometry(80, 30);
    const nebulaMat = new THREE.MeshBasicMaterial({
      color: 0x0d0628,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
    nebula.position.set(0, 22, -30);
    nebula.rotation.x = 0.2;
    pano.add(nebula);

    // Star field — 600 stars, tiny
    const starCount = 600;
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 80;
      starPositions[i * 3 + 1] = 5 + Math.random() * 38;
      starPositions[i * 3 + 2] = -8 - Math.random() * 38;
      starSizes[i] = 0.05 + Math.random() * 0.15;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xd0eeff,
      size: 0.1,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    pano.add(new THREE.Points(starGeo, starMat));

    // City buildings with window textures
    const buildingDefs = Array.from({ length: 32 }, (_, i) => ({
      h: 8 + Math.random() * 28,
      w: 1.4 + Math.random() * 3.2,
      px: -26 + (i / 31) * 52 + (Math.random() - 0.5) * 2.5,
      pz: -3 - Math.random() * 18,
      seed: i,
    }));

    buildingDefs.forEach(({ h, w, px, pz, seed }) => {
      const bGeo = new THREE.BoxGeometry(w, h, w * 0.85);
      const winTex = createBuildingWindowTexture(seed);
      const bMat = new THREE.MeshStandardMaterial({
        color: 0x04070d,
        roughness: 0.8,
        metalness: 0.6,
        map: winTex,
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(px, h / 2 - 4, pz);
      pano.add(bMesh);

      // Animated rooftop beacon (random phase so they don't sync)
      const beaconGeo = new THREE.SphereGeometry(0.18, 8, 8);
      const isBlue = Math.random() > 0.45;
      const beaconMat = new THREE.MeshBasicMaterial({ color: isBlue ? 0x00f0ff : 0xff3355 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(px, h - 3.6, pz);
      pano.add(beacon);

      const beaconPhase = Math.random() * Math.PI * 2;
      const beaconSpeed = 0.8 + Math.random() * 1.4;
      this.animatedMeshes.push({
        mesh: beacon,
        update: (time) => {
          const on = Math.sin(time * beaconSpeed + beaconPhase) > 0.0;
          (beacon.material as THREE.MeshBasicMaterial).color.setHex(
            on ? (isBlue ? 0x00f0ff : 0xff3355) : 0x111111
          );
        },
      });
    });

    // Ground-level city fog strip
    const fogGeo = new THREE.PlaneGeometry(70, 8);
    const fogMat = new THREE.MeshBasicMaterial({
      color: 0x0a1428,
      transparent: true,
      opacity: 0.7,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });
    const fogPlane = new THREE.Mesh(fogGeo, fogMat);
    fogPlane.rotation.x = -Math.PI / 2;
    fogPlane.position.set(0, -4, -14);
    pano.add(fogPlane);

    this.rootGroup.add(pano);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // SOUTH ENTRANCE — 1:1 Match of Sci-Fi Blast Gate & Perimeter Facility Design
  // ───────────────────────────────────────────────────────────────────────────
  private buildSouthEntrance(width: number, height: number, z: number) {
    // ════════════════════════════════════════════════════════════════════════
    //  1. PERIMETER WALL & TOP SEAM (data-purpose="perimeter-wall-structure")
    // ════════════════════════════════════════════════════════════════════════
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x101622,
      metalness: 0.8,
      roughness: 0.35,
      map: createWallPanelTexture(),
    });

    // Side walls flanking the entrance
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(width / 2 - 3, height, 0.8), wallMat);
    leftWall.position.set(-(width / 4 + 1.5), height / 2, z);
    this.rootGroup.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(width / 2 - 3, height, 0.8), wallMat);
    rightWall.position.set(width / 4 + 1.5, height / 2, z);
    this.rootGroup.add(rightWall);

    // Fill wall above doorway
    const topFill = new THREE.Mesh(new THREE.BoxGeometry(6.4, height - 5.4, 0.8), wallMat);
    topFill.position.set(0, height - (height - 5.4) / 2, z);
    this.rootGroup.add(topFill);

    // Glowing cyan seam across top edge of perimeter wall
    const topSeam = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.05, 0.85),
      new THREE.MeshBasicMaterial({ color: 0x00f2fe })
    );
    topSeam.position.set(0, height - 0.025, z);
    this.rootGroup.add(topSeam);

    // (Background monoliths removed to ensure clear, unobstructed view of the blast gate)

    // ════════════════════════════════════════════════════════════════════════
    //  3. OVERHEAD SPOTLIGHT HARDWARE & VOLUMETRIC CONE
    // ════════════════════════════════════════════════════════════════════════
    // Heavy spotlight housing mounted on wall
    const housingMat = new THREE.MeshStandardMaterial({
      color: 0x0b101b,
      metalness: 0.9,
      roughness: 0.15,
    });
    const spotHousing = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.38, 0.5), housingMat);
    spotHousing.position.set(0, 6.85, z + 0.42);
    this.rootGroup.add(spotHousing);

    // Cyan border bar under housing
    const housingBorder = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.05, 0.52),
      new THREE.MeshBasicMaterial({ color: 0x00f2fe })
    );
    housingBorder.position.set(0, 6.64, z + 0.42);
    this.rootGroup.add(housingBorder);

    // 3 Hardware LEDs (Emerald - Cyan - Emerald)
    const ledMatEmerald = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const ledMatCyan = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const ledGeo = new THREE.SphereGeometry(0.06, 8, 8);

    const ledL = new THREE.Mesh(ledGeo, ledMatEmerald);
    ledL.position.set(-1.0, 6.85, z + 0.68);
    this.rootGroup.add(ledL);

    const ledC = new THREE.Mesh(ledGeo, ledMatCyan);
    ledC.position.set(0, 6.85, z + 0.68);
    this.rootGroup.add(ledC);

    const ledR = new THREE.Mesh(ledGeo, ledMatEmerald);
    ledR.position.set(1.0, 6.85, z + 0.68);
    this.rootGroup.add(ledR);

    // Glowing cyan-white slit under spotlight
    const glowSlit = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 0.08, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xc8f0ff })
    );
    glowSlit.position.set(0, 6.6, z + 0.45);
    this.rootGroup.add(glowSlit);

    // Subtle directional entrance spot (reduced intensity to eliminate blinding washout)
    const spot = new THREE.SpotLight(0xc8f0ff, 0.75, 14, Math.PI / 4, 0.6, 1.2);
    spot.position.set(0, 6.9, z + 0.8);
    spot.target.position.set(0, 0, z + 0.5);
    this.rootGroup.add(spot);
    this.rootGroup.add(spot.target);

    // ════════════════════════════════════════════════════════════════════════
    //  4. PORTAL ARCH HEADER (Clearance Array + Warning Strobes)
    // ════════════════════════════════════════════════════════════════════════
    const headerGeo = new THREE.BoxGeometry(6.4, 1.1, 0.9);
    const headerSideMat = new THREE.MeshStandardMaterial({
      color: 0x141d2a,
      metalness: 0.9,
      roughness: 0.15,
    });
    const headerFaceMat = new THREE.MeshBasicMaterial({
      map: createClearanceHeaderTexture(),
    });
    const headerMats = [
      headerSideMat, // +X
      headerSideMat, // -X
      headerSideMat, // +Y
      headerSideMat, // -Y
      headerFaceMat, // +Z (facing camera outside)
      headerSideMat, // -Z
    ];
    const portalArch = new THREE.Mesh(headerGeo, headerMats);
    portalArch.position.set(0, 4.85, z);
    this.rootGroup.add(portalArch);

    // Physical amber strobe lights flanking header
    const strobeMatAmber = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const strobeGeo = new THREE.SphereGeometry(0.12, 12, 8);
    const strobeL = new THREE.Mesh(strobeGeo, strobeMatAmber);
    strobeL.position.set(-2.6, 4.85, z + 0.48);
    this.rootGroup.add(strobeL);

    const strobeR = new THREE.Mesh(strobeGeo, strobeMatAmber);
    strobeR.position.set(2.6, 4.85, z + 0.48);
    this.rootGroup.add(strobeR);

    // External hydraulic mount brackets on header sides
    const bracketMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.95, roughness: 0.1 });
    const bGeo = new THREE.BoxGeometry(0.2, 0.8, 0.4);
    const bL = new THREE.Mesh(bGeo, bracketMat);
    bL.position.set(-3.25, 4.85, z + 0.3);
    this.rootGroup.add(bL);
    const bR = new THREE.Mesh(bGeo, bracketMat);
    bR.position.set(3.25, 4.85, z + 0.3);
    this.rootGroup.add(bR);

    // ════════════════════════════════════════════════════════════════════════
    //  5. GLOWING NEON ENERGY BORDER OUTER CHAMBER SEAL (.glow-cyan-frame)
    // ════════════════════════════════════════════════════════════════════════
    const framePillarMat = new THREE.MeshStandardMaterial({
      color: 0x141d2c,
      metalness: 0.92,
      roughness: 0.15,
    });
    const pillarL = new THREE.Mesh(new THREE.BoxGeometry(0.38, 4.3, 0.9), framePillarMat);
    pillarL.position.set(-2.89, 2.15, z);
    this.rootGroup.add(pillarL);

    const pillarR = new THREE.Mesh(new THREE.BoxGeometry(0.38, 4.3, 0.9), framePillarMat);
    pillarR.position.set(2.89, 2.15, z);
    this.rootGroup.add(pillarR);

    // Neon cyan outer frame glow channels (catches UnrealBloom)
    const neonCyanMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });

    // Vertical left neon channel
    const vGlowL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.3, 0.12), neonCyanMat);
    vGlowL.position.set(-2.7, 2.15, z + 0.46);
    this.rootGroup.add(vGlowL);

    // Vertical right neon channel
    const vGlowR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.3, 0.12), neonCyanMat);
    vGlowR.position.set(2.7, 2.15, z + 0.46);
    this.rootGroup.add(vGlowR);

    // Horizontal top neon channel under header
    const hGlowTop = new THREE.Mesh(new THREE.BoxGeometry(5.48, 0.08, 0.12), neonCyanMat);
    hGlowTop.position.set(0, 4.28, z + 0.46);
    this.rootGroup.add(hGlowTop);

    // Bottom threshold glow lines
    const threshGlowL = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.04, 0.08), neonCyanMat);
    threshGlowL.position.set(-1.35, 0.04, z + 0.55);
    this.rootGroup.add(threshGlowL);
    const threshGlowR = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.04, 0.08), neonCyanMat);
    threshGlowR.position.set(1.35, 0.04, z + 0.55);
    this.rootGroup.add(threshGlowR);

    // ════════════════════════════════════════════════════════════════════════
    //  6. SLIDING BLAST DOOR LEAVES (Left & Right Groups)
    // ════════════════════════════════════════════════════════════════════════
    const doorGroupL = new THREE.Group();
    doorGroupL.position.set(-1.35, 2.15, z);
    this.rootGroup.add(doorGroupL);

    const doorGroupR = new THREE.Group();
    doorGroupR.position.set(1.35, 2.15, z);
    this.rootGroup.add(doorGroupR);

    const doorSlabGeo = new THREE.BoxGeometry(2.68, 4.25, 0.28);
    const doorMetalSideMat = new THREE.MeshStandardMaterial({
      color: 0x101622,
      metalness: 0.9,
      roughness: 0.18,
    });

    // Left door slab with high-res textured face
    const doorMatsL = [
      doorMetalSideMat, // +X
      doorMetalSideMat, // -X
      doorMetalSideMat, // +Y
      doorMetalSideMat, // -Y
      new THREE.MeshStandardMaterial({
        map: createAirlockDoorTexture('left'),
        metalness: 0.85,
        roughness: 0.25,
      }), // +Z face
      doorMetalSideMat, // -Z
    ];
    const doorMeshL = new THREE.Mesh(doorSlabGeo, doorMatsL);
    doorGroupL.add(doorMeshL);

    // Right door slab with high-res textured face
    const doorMatsR = [
      doorMetalSideMat, // +X
      doorMetalSideMat, // -X
      doorMetalSideMat, // +Y
      doorMetalSideMat, // -Y
      new THREE.MeshStandardMaterial({
        map: createAirlockDoorTexture('right'),
        metalness: 0.85,
        roughness: 0.25,
      }), // +Z face
      doorMetalSideMat, // -Z
    ];
    const doorMeshR = new THREE.Mesh(doorSlabGeo, doorMatsR);
    doorGroupR.add(doorMeshR);

    // ── Center Vertical Neon Cyan Energy Edge (.glow-cyan-seam) ──
    // Intense cyan energy rod along the meeting edge of both leaves
    const neonSeamGeo = new THREE.BoxGeometry(0.06, 4.22, 0.08);
    const neonSeamMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });

    const seamL = new THREE.Mesh(neonSeamGeo, neonSeamMat);
    seamL.position.set(1.32, 0, 0.14);
    doorGroupL.add(seamL);

    const seamR = new THREE.Mesh(neonSeamGeo, neonSeamMat);
    seamR.position.set(-1.32, 0, 0.14);
    doorGroupR.add(seamR);

    // ── Physical 3D Recessed Vision Port Window Frame & Glass ──
    const vpFrameGeo = new THREE.BoxGeometry(2.1, 0.75, 0.08);
    const vpFrameMat = new THREE.MeshStandardMaterial({
      color: 0x0b101b,
      metalness: 0.9,
      roughness: 0.1,
    });

    const vpFrameL = new THREE.Mesh(vpFrameGeo, vpFrameMat);
    vpFrameL.position.set(0, 0.98, 0.15);
    doorGroupL.add(vpFrameL);

    const vpFrameR = new THREE.Mesh(vpFrameGeo, vpFrameMat);
    vpFrameR.position.set(0, 0.98, 0.15);
    doorGroupR.add(vpFrameR);

    // Glowing cyan glass pane inside vision port
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x083344,
      transmission: 0.5,
      thickness: 0.3,
      roughness: 0.05,
      metalness: 0.1,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.25,
    });
    const glassGeo = new THREE.BoxGeometry(1.9, 0.58, 0.04);
    const glassL = new THREE.Mesh(glassGeo, glassMat);
    glassL.position.set(0, 0.98, 0.17);
    doorGroupL.add(glassL);

    const glassR = new THREE.Mesh(glassGeo, glassMat);
    glassR.position.set(0, 0.98, 0.17);
    doorGroupR.add(glassR);

    // ── 3D Locking Pin Cylinders (Mechanical pins) ──
    const pinMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.95, roughness: 0.1 });
    const pinGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.38, 8);
    for (const px of [-0.9, -0.3, 0.3, 0.9]) {
      const pL = new THREE.Mesh(pinGeo, pinMat);
      pL.rotation.z = Math.PI / 2;
      pL.position.set(px, -0.95, 0.16);
      doorGroupL.add(pL);

      const pR = new THREE.Mesh(pinGeo, pinMat);
      pR.rotation.z = Math.PI / 2;
      pR.position.set(px, -0.95, 0.16);
      doorGroupR.add(pR);
    }

    // ════════════════════════════════════════════════════════════════════════
    //  7. GROUND PLATFORM & LIGHT EMISSION REFLECTION
    // ════════════════════════════════════════════════════════════════════════
    // (Floor reflection mesh removed to prevent white blowout patch on the floor)

    // ════════════════════════════════════════════════════════════════════════
    //  8. ASSIGN DOOR REFS & ANIMATIONS
    // ════════════════════════════════════════════════════════════════════════
    this.doorLeft = doorMeshL;
    this.doorRight = doorMeshR;

    // Amber warning strobe pulse & light flicker hum
    this.animatedMeshes.push({
      mesh: strobeL,
      update: (time) => {
        // Ping strobe animation (matching HTML animate-ping)
        const pulse = (Math.sin(time * 6) + 1) * 0.5;
        const col = pulse > 0.4 ? 0xf59e0b : 0x451a03;
        (strobeL.material as THREE.MeshBasicMaterial).color.setHex(col);
        (strobeR.material as THREE.MeshBasicMaterial).color.setHex(col);

        // LEDs subtle breathe
        const ledGlow = (Math.sin(time * 3) + 1) * 0.5;
        (ledMatEmerald as THREE.MeshBasicMaterial).color.setHex(ledGlow > 0.3 ? 0x34d399 : 0x064e3b);
      },
    });

    // Smooth sliding blast door animation
    this.animatedMeshes.push({
      mesh: doorGroupL,
      update: (_t, delta) => {
        const targetLX = this.doorTargetOpen > 0.5 ? -4.3 : -1.35;
        const targetRX = this.doorTargetOpen > 0.5 ? 4.3 : 1.35;
        doorGroupL.position.x = THREE.MathUtils.damp(doorGroupL.position.x, targetLX, 3, delta);
        doorGroupR.position.x = THREE.MathUtils.damp(doorGroupR.position.x, targetRX, 3, delta);
      },
    });

    this.collisionBoxes.push({ minX: -13, maxX: 13, minZ: z - 0.5, maxZ: z + 2.5 });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STATIONS
  // ───────────────────────────────────────────────────────────────────────────
  private buildStations() {
    this.buildCentralFloorMarking();

    // West Wing Stations (facing East +X toward central corridor: rotationY = Math.PI / 2)
    this.buildStationTable({
      id: 'about-station',
      name: 'About Me Station',
      code: 'STATION 01 // ABOUT',
      type: 'about',
      position: new THREE.Vector3(-6.2, 0, 9.0),
      rotationY: Math.PI / 2,
      accentColor: 0x00f0ff,
      accentHex: '#00f0ff',
      screenTitle: 'KAMANASHIS BISWAS',
      screenSubtitle: 'FULL-STACK DEVELOPER // MERN & NEXT.JS ARCHITECT',
      screenLines: [
        '// PROFESSIONAL PROFILE // SECTOR 01',
        'STATUS: READY FOR PRODUCTION // SYSTEM NOMINAL',
        'EXPERTISE: NEXT.JS 15 • REACT 19 • NODE.JS • PRISMA',
        'LOCATION: KHULNA, BANGLADESH (REMOTE / HYBRID)',
        'ENGINEERING: SCALABLE DISTRIBUTED APIS & 3D UI',
        'ACTION: PRESS [E] OR CLICK SCREEN FOR BIO & METRICS',
      ],
      typeDelay: 0.15,
    });

    this.buildStationTable({
      id: 'education-archive',
      name: 'Education Station',
      code: 'STATION 02 // EDUCATION',
      type: 'education',
      position: new THREE.Vector3(-6.2, 0, 3.0),
      rotationY: Math.PI / 2,
      accentColor: 0x38bdf8,
      accentHex: '#38bdf8',
      screenTitle: 'EDUCATION ARCHIVE',
      screenSubtitle: 'ACADEMIC DEGREES & ADVANCED ICT RESEARCH',
      screenLines: [
        '// ACADEMIC CREDENTIALS // SECTOR 02',
        'DEGREE: M.SC. (ENGG.) IN ICT (CURRENTLY ENROLLED)',
        'INSTITUTION: KUET (KHULNA UNIV OF ENGG & TECH)',
        'DEGREE: B.SC. IN SOFTWARE ENGINEERING',
        'INSTITUTION: NORTH WESTERN UNIVERSITY',
        'CORE: DISTRIBUTED SYSTEMS, ALGORITHMS & NETWORKS',
        'ACTION: PRESS [E] OR CLICK SCREEN TO VIEW CURRICULUM',
      ],
      typeDelay: 0.3,
    });

    this.buildStationTable({
      id: 'skills-station',
      name: 'Skills Station',
      code: 'STATION 03 // SKILLS',
      type: 'skills',
      position: new THREE.Vector3(-6.2, 0, -3.0),
      rotationY: Math.PI / 2,
      accentColor: 0xa855f7,
      accentHex: '#a855f7',
      screenTitle: 'TECHNOLOGY MATRIX',
      screenSubtitle: 'CORE DEVELOPMENT STACK & FRAMEWORKS',
      screenLines: [
        '// TECHNICAL COMPETENCIES // SECTOR 03',
        'FRONTEND: NEXT.JS 15, REACT 19, TYPESCRIPT, TAILWIND',
        'BACKEND: NODE.JS, EXPRESS.JS, PRISMA ORM, REST APIS',
        'DATABASES: POSTGRESQL (ACID), MONGODB AGGREGATIONS',
        'GRAPHICS: THREE.JS, WEBGL SHADERS, REAL-TIME 3D',
        'ACTION: PRESS [E] OR CLICK SCREEN FOR SKILL MATRIX',
      ],
      typeDelay: 0.45,
    });

    this.buildStationTable({
      id: 'projects-station',
      name: 'Projects Station',
      code: 'STATION 04 // PROJECTS',
      type: 'project',
      position: new THREE.Vector3(-6.2, 0, -9.0),
      rotationY: Math.PI / 2,
      accentColor: 0x22d3ee,
      accentHex: '#22d3ee',
      screenTitle: 'PROJECT SHOWCASE',
      screenSubtitle: 'FEATURED PRODUCTION APPLICATIONS & BLUEPRINTS',
      screenLines: [
        '// PRODUCTION DEPLOYMENTS // SECTOR 04',
        '01. ANTIGRAVITY — FLAGSHIP 3D REACT PLATFORM',
        '02. UNIVERSITY ERP — ROLE-BASED POSTGRESQL SYSTEM',
        '03. TELEMETRY DASHBOARD — REAL-TIME METRICS HUB',
        '04. MERN COMMERCE — E-COMMERCE WITH STRIPE & REDUX',
        'ACTION: PRESS [E] OR CLICK SCREEN TO LAUNCH DEMOS',
      ],
      typeDelay: 0.6,
    });

    // East Wing Stations (facing West -X toward central corridor: rotationY = -Math.PI / 2)
    this.buildStationTable({
      id: 'tools-station',
      name: 'Tools & Applications Station',
      code: 'STATION 05 // TOOLS',
      type: 'tools',
      position: new THREE.Vector3(6.2, 0, -9.0),
      rotationY: -Math.PI / 2,
      accentColor: 0xf59e0b,
      accentHex: '#f59e0b',
      screenTitle: 'TOOLS & APPLICATIONS',
      screenSubtitle: 'ENGINEERING WORKSPACE & PRODUCTIVITY SUITE',
      screenLines: [
        '// TOOLING INFRASTRUCTURE // SECTOR 05',
        'IDE & CODING: VS CODE, NEOVIM, CHROME DEVTOOLS',
        'VERSION CONTROL: GIT, GITHUB CLI, GITHUB ACTIONS',
        'API & TESTING: POSTMAN, JEST, PLAYWRIGHT, THUNDER',
        'DEPLOYMENT: DOCKER, VERCEL, CLOUD RUN, LINUX',
        'ACTION: PRESS [E] OR CLICK SCREEN FOR TOOL ECOSYSTEM',
      ],
      typeDelay: 0.75,
    });

    this.buildStationTable({
      id: 'certificate-archive',
      name: 'Certificates & Achievements Station',
      code: 'STATION 06 // CERTIFICATES',
      type: 'certificates',
      position: new THREE.Vector3(6.2, 0, -3.0),
      rotationY: -Math.PI / 2,
      accentColor: 0xc084fc,
      accentHex: '#c084fc',
      screenTitle: 'CERTIFICATES & AWARDS',
      screenSubtitle: 'VERIFIED CREDENTIAL REPOSITORY',
      screenLines: [
        '// PROFESSIONAL CREDENTIALS // SECTOR 06',
        'SPECIALIZATION: NEXT LEVEL WEB DEVELOPMENT (PH)',
        'DOMAINS: TYPESCRIPT, ADVANCED NEXT.JS, REDUX TOOLKIT',
        'BACKEND: PRISMA ORM, POSTGRESQL & SECURE JWT ROTATION',
        'ACHIEVEMENT: HONORS GRADUATION IN SOFTWARE ENGG',
        'ACTION: PRESS [E] OR CLICK SCREEN TO VERIFY BADGES',
      ],
      typeDelay: 0.9,
    });

    this.buildStationTable({
      id: 'blog-station',
      name: 'Blog Station',
      code: 'STATION 07 // BLOG',
      type: 'blog',
      position: new THREE.Vector3(6.2, 0, 3.0),
      rotationY: -Math.PI / 2,
      accentColor: 0x14b8a6,
      accentHex: '#14b8a6',
      screenTitle: 'TECH INSIGHTS & BLOG',
      screenSubtitle: 'SYSTEM ARCHITECTURE & DEEP TECHNICAL ESSAYS',
      screenLines: [
        '// ENGINEERING DISPATCHES // SECTOR 07',
        'POST 01: NEXT.JS 15 SERVER COMPONENTS IN PRACTICE',
        'POST 02: ACID RELATIONAL PATTERNS IN PRISMA & POSTGRES',
        'POST 03: 60 FPS WEBGL & SHADER RENDERING PIPELINES',
        'REGULAR DISPATCHES ON DISTRIBUTED SYSTEMS',
        'ACTION: PRESS [E] OR CLICK SCREEN TO READ ARTICLES',
      ],
      typeDelay: 1.05,
    });

    this.buildStationTable({
      id: 'contact-terminal',
      name: 'Contact Me Station',
      code: 'STATION 08 // CONTACT',
      type: 'contact',
      position: new THREE.Vector3(6.2, 0, 9.0),
      rotationY: -Math.PI / 2,
      accentColor: 0x00f0ff,
      accentHex: '#00f0ff',
      screenTitle: 'COMMUNICATIONS RELAY',
      screenSubtitle: 'DIRECT INQUIRY & CONTACT TRANSMISSION',
      screenLines: [
        '// SECURE TRANSMISSION CHANNEL // SECTOR 08',
        'RECIPIENT: KAMANASHIS BISWAS',
        'DIRECT EMAIL: kamanashisbiswas007@gmail.com',
        'CODE REPO: github.com/kamanashisbiswas007',
        'PROFESSIONAL: linkedin.com/in/kamanashisbiswas',
        'ACTION: PRESS [E] OR CLICK SCREEN TO TRANSMIT MESSAGE',
      ],
      typeDelay: 1.2,
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // CENTRAL FLOOR MARKING (Flush with floor, NO middle screen, open hallway)
  // ───────────────────────────────────────────────────────────────────────────
  private buildCentralFloorMarking() {
    const group = new THREE.Group();
    group.position.set(0, 0, 0);

    // Flat concentric floor rings (y = 0.02, zero collision, wide open walkway)
    const ringOuter = new THREE.Mesh(
      new THREE.RingGeometry(2.3, 2.38, 64),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
    );
    ringOuter.rotation.x = -Math.PI / 2;
    ringOuter.position.y = 0.02;
    group.add(ringOuter);

    const ringInner = new THREE.Mesh(
      new THREE.RingGeometry(1.5, 1.56, 48),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide, transparent: true, opacity: 0.5 })
    );
    ringInner.rotation.x = -Math.PI / 2;
    ringInner.position.y = 0.02;
    group.add(ringInner);

    // Subtle ambient floor glow
    const centerGlow = new THREE.PointLight(0x00f0ff, 1.2, 7);
    centerGlow.position.set(0, 0.5, 0);
    group.add(centerGlow);

    this.rootGroup.add(group);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // UNIFIED STATION WORKSTATION TABLE & TYPEWRITER SCREEN
  // ───────────────────────────────────────────────────────────────────────────
  private buildStationTable(config: {
    id: string;
    name: string;
    code: string;
    type: string;
    position: THREE.Vector3;
    rotationY: number;
    accentColor: number;
    accentHex: string;
    screenTitle: string;
    screenSubtitle: string;
    screenLines: string[];
    typeDelay: number;
  }) {
    const group = new THREE.Group();
    group.position.copy(config.position);
    group.rotation.y = config.rotationY;

    // 1. Raised Floor Plinth / Dais
    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(1.7, 1.9, 0.2, 32),
      new THREE.MeshStandardMaterial({
        color: 0x0f1b2c,
        metalness: 0.88,
        roughness: 0.22,
        map: createPedestalRingTexture(config.code),
      })
    );
    plinth.position.y = 0.1;
    plinth.receiveShadow = true;
    group.add(plinth);

    // Glowing accent floor ring around plinth
    const plinthRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.7, 0.025, 16, 48),
      new THREE.MeshBasicMaterial({ color: config.accentColor, transparent: true, opacity: 0.85 })
    );
    plinthRing.rotation.x = Math.PI / 2;
    plinthRing.position.y = 0.205;
    group.add(plinthRing);

    // 2. Futuristic Console Desk Body
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.82, 0.95),
      new THREE.MeshStandardMaterial({
        color: 0x0c1624,
        metalness: 0.88,
        roughness: 0.22,
      })
    );
    desk.position.set(0, 0.52, 0);
    group.add(desk);

    // Front edge accent strip
    const frontStrip = new THREE.Mesh(
      new THREE.BoxGeometry(2.62, 0.035, 0.035),
      new THREE.MeshBasicMaterial({ color: config.accentColor, transparent: true, opacity: 0.9 })
    );
    frontStrip.position.set(0, 0.925, 0.475);
    group.add(frontStrip);

    // Side accent strips
    [-1.3, 1.3].forEach((sx) => {
      const sideStrip = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 0.035, 0.95),
        new THREE.MeshBasicMaterial({ color: config.accentColor, transparent: true, opacity: 0.6 })
      );
      sideStrip.position.set(sx, 0.925, 0);
      group.add(sideStrip);
    });

    // 3. Interactive Touch Scanner / Keyboard Grid (No crystals, clean sci-fi grid)
    const keyboard = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 0.4, 10, 3),
      new THREE.MeshBasicMaterial({
        color: config.accentColor,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      })
    );
    keyboard.rotation.x = -Math.PI / 2.3;
    keyboard.position.set(0, 0.94, 0.18);
    group.add(keyboard);

    // 4. Dual Monitor Mount Stands
    const postMat = new THREE.MeshStandardMaterial({ color: 0x1b2838, metalness: 0.92, roughness: 0.18 });
    [-0.75, 0.75].forEach((px) => {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.72, 12),
        postMat
      );
      post.position.set(px, 1.28, -0.2);
      group.add(post);
    });

    const crossbar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 1.65, 12),
      postMat
    );
    crossbar.rotation.z = Math.PI / 2;
    crossbar.position.set(0, 1.6, -0.2);
    group.add(crossbar);

    // 5. Screen Bezel Frame
    const screenFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.7, 1.65, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x08101a, metalness: 0.95, roughness: 0.18 })
    );
    screenFrame.position.set(0, 1.82, -0.18);
    screenFrame.rotation.x = -0.05;
    group.add(screenFrame);

    // Frame bezel border glow
    const frameGlow = new THREE.Mesh(
      new THREE.BoxGeometry(2.72, 0.035, 0.06),
      new THREE.MeshBasicMaterial({ color: config.accentColor, transparent: true, opacity: 0.75 })
    );
    frameGlow.position.set(0, 2.64, -0.22);
    group.add(frameGlow);

    // 6. Holographic Typewriter Screen (Expanded high-DPI display)
    const typewriter = createTypewriterHoloScreenTexture(
      config.screenTitle,
      config.screenSubtitle,
      config.screenLines,
      config.accentHex,
      config.typeDelay
    );

    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 1.55),
      new THREE.MeshBasicMaterial({
        map: typewriter.texture,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
      })
    );
    screenMesh.position.set(0, 1.82, -0.15);
    screenMesh.rotation.x = -0.05;
    group.add(screenMesh);

    // 7. Accent Station Light
    const stationLight = new THREE.PointLight(config.accentColor, 2.4, 8);
    stationLight.position.set(0, 2.3, 0.3);
    group.add(stationLight);

    // Register typewriter update loop
    this.animatedMeshes.push({
      mesh: screenMesh,
      update: (time, delta) => typewriter.update(time, delta),
    });

    // 8. Register Station & Collision Box
    this.rootGroup.add(group);
    this.stations.push({
      id: config.id,
      name: config.name,
      code: config.code,
      position: config.position.clone(),
      meshGroup: group,
      interactRadius: 3.2,
      type: config.type,
    });

    this.collisionBoxes.push({
      minX: config.position.x - 1.5,
      maxX: config.position.x + 1.5,
      minZ: config.position.z - 1.2,
      maxZ: config.position.z + 1.2,
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // LIGHTING & PARTICLES — V2 (3-tier particle system)
  // ───────────────────────────────────────────────────────────────────────────
  private buildLightingAndParticles() {
    // 1. Ambient (deep moody contrast)
    this.rootGroup.add(new THREE.AmbientLight(0x0a1530, 0.35));

    // 2. Hemisphere — subtle cool top, deep dark floor
    this.rootGroup.add(new THREE.HemisphereLight(0x00d4ee, 0x040810, 0.35));

    // 3. Zone spotlights
    const zoneLights: { pos: [number, number, number]; color: number }[] = [
      { pos: [-6, 6.8, -6], color: 0x00f0ff },
      { pos: [6, 6.8, -6], color: 0x00f0ff },
      { pos: [-6, 6.8, 4], color: 0xa855f7 },
      { pos: [6, 6.8, 4], color: 0x00f0ff },
      { pos: [0, 6.8, -12], color: 0x38bdf8 },
      { pos: [0, 6.8, 10], color: 0x00f0ff },
    ];
    zoneLights.forEach(({ pos, color }) => {
      const isSouthEntrance = pos[2] === 10;
      const intensity = isSouthEntrance ? 0.4 : 0.75;
      const spot = new THREE.SpotLight(color, intensity, 15, Math.PI / 3.5, 0.85, 1.2);
      spot.position.set(...pos);
      spot.target.position.set(pos[0], 0, pos[2]);
      this.rootGroup.add(spot, spot.target);
    });

    // 4. Corner floor-bounce fill lights
    [[-10, 0.3, -14], [10, 0.3, -14], [-10, 0.3, 14], [10, 0.3, 14]].forEach(([x, y, z]) => {
      const fill = new THREE.PointLight(0x001030, 0.6, 12);
      fill.position.set(x, y, z);
      this.rootGroup.add(fill);
    });

    // ── TIER 1: Micro-dust particles (many, tiny, full-height) ───────────────
    const tier1Count = 420;
    const t1Geo = new THREE.BufferGeometry();
    const t1Pos = new Float32Array(tier1Count * 3);
    const t1Vel = new Float32Array(tier1Count * 3); // velocity
    for (let i = 0; i < tier1Count; i++) {
      t1Pos[i * 3] = (Math.random() - 0.5) * 22;
      t1Pos[i * 3 + 1] = 0.3 + Math.random() * 6.8;
      t1Pos[i * 3 + 2] = (Math.random() - 0.5) * 32;
      t1Vel[i * 3] = (Math.random() - 0.5) * 0.008;
      t1Vel[i * 3 + 1] = (Math.random() - 0.5) * 0.004;
      t1Vel[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
    }
    t1Geo.setAttribute('position', new THREE.BufferAttribute(t1Pos, 3));
    const t1 = new THREE.Points(t1Geo, new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 2.0,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    this.rootGroup.add(t1);

    this.animatedMeshes.push({
      mesh: t1,
      update: (_time, delta) => {
        const p = t1Geo.attributes.position.array as Float32Array;
        for (let i = 0; i < tier1Count; i++) {
          p[i * 3] += t1Vel[i * 3];
          p[i * 3 + 1] += t1Vel[i * 3 + 1];
          p[i * 3 + 2] += t1Vel[i * 3 + 2];
          // Boundary wrap
          if (p[i * 3] > 11) p[i * 3] = -11;
          if (p[i * 3] < -11) p[i * 3] = 11;
          if (p[i * 3 + 1] > 7.2) p[i * 3 + 1] = 0.3;
          if (p[i * 3 + 1] < 0.3) p[i * 3 + 1] = 7.2;
          if (p[i * 3 + 2] > 16) p[i * 3 + 2] = -16;
          if (p[i * 3 + 2] < -16) p[i * 3 + 2] = 16;
          // Subtle sine drift
          p[i * 3 + 1] += Math.sin(_time + i * 0.7) * 0.0018 * delta * 60;
        }
        t1Geo.attributes.position.needsUpdate = true;
      },
    });

    // ── TIER 2: Medium particles (fewer, mid-height only, purple) ─────────────
    const tier2Count = 40;
    const t2Geo = new THREE.BufferGeometry();
    const t2Pos = new Float32Array(tier2Count * 3);
    const t2Vel = new Float32Array(tier2Count * 3);
    for (let i = 0; i < tier2Count; i++) {
      t2Pos[i * 3] = (Math.random() - 0.5) * 20;
      t2Pos[i * 3 + 1] = 1.0 + Math.random() * 4.0;
      t2Pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      t2Vel[i * 3] = (Math.random() - 0.5) * 0.015;
      t2Vel[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
      t2Vel[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
    }
    t2Geo.setAttribute('position', new THREE.BufferAttribute(t2Pos, 3));
    const t2 = new THREE.Points(t2Geo, new THREE.PointsMaterial({
      color: 0xa855f7,
      size: 3.0,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    this.rootGroup.add(t2);

    this.animatedMeshes.push({
      mesh: t2,
      update: (_time, delta) => {
        const p = t2Geo.attributes.position.array as Float32Array;
        for (let i = 0; i < tier2Count; i++) {
          p[i * 3] += t2Vel[i * 3];
          p[i * 3 + 1] += t2Vel[i * 3 + 1];
          p[i * 3 + 2] += t2Vel[i * 3 + 2];
          if (Math.abs(p[i * 3]) > 10) t2Vel[i * 3] *= -1;
          if (p[i * 3 + 1] < 1.0 || p[i * 3 + 1] > 5.0) t2Vel[i * 3 + 1] *= -1;
          if (Math.abs(p[i * 3 + 2]) > 15) t2Vel[i * 3 + 2] *= -1;
        }
        t2Geo.attributes.position.needsUpdate = true;
      },
    });

    // ── TIER 3: Bright sparks (very few, fast, subtle) ────────────────────────
    const tier3Count = 12;
    const t3Geo = new THREE.BufferGeometry();
    const t3Pos = new Float32Array(tier3Count * 3);
    const t3Vel = new Float32Array(tier3Count * 3);
    for (let i = 0; i < tier3Count; i++) {
      const cx = (Math.random() - 0.5) * 18;
      t3Pos[i * 3] = cx;
      t3Pos[i * 3 + 1] = 1.5 + Math.random() * 2.0;
      t3Pos[i * 3 + 2] = (Math.random() - 0.5) * 28;
      t3Vel[i * 3] = (Math.random() - 0.5) * 0.025;
      t3Vel[i * 3 + 1] = 0.01 + Math.random() * 0.02;
      t3Vel[i * 3 + 2] = (Math.random() - 0.5) * 0.025;
    }
    t3Geo.setAttribute('position', new THREE.BufferAttribute(t3Pos, 3));
    const t3 = new THREE.Points(t3Geo, new THREE.PointsMaterial({
      color: 0x88e5ff,
      size: 3.5,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    this.rootGroup.add(t3);

    this.animatedMeshes.push({
      mesh: t3,
      update: (_time) => {
        const p = t3Geo.attributes.position.array as Float32Array;
        for (let i = 0; i < tier3Count; i++) {
          p[i * 3] += t3Vel[i * 3];
          p[i * 3 + 1] += t3Vel[i * 3 + 1];
          p[i * 3 + 2] += t3Vel[i * 3 + 2];
          // Reset when reaching ceiling
          if (p[i * 3 + 1] > 5.5) {
            p[i * 3] = (Math.random() - 0.5) * 18;
            p[i * 3 + 1] = 1.0;
            p[i * 3 + 2] = (Math.random() - 0.5) * 28;
          }
        }
        t3Geo.attributes.position.needsUpdate = true;
      },
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // PUBLIC UPDATE LOOP
  // ───────────────────────────────────────────────────────────────────────────
  public update(time: number, delta: number) {
    for (let i = 0; i < this.animatedMeshes.length; i++) {
      this.animatedMeshes[i].update(time, delta);
    }
  }

  public setDoorOpen(open: boolean) {
    this.doorTargetOpen = open ? 1 : 0;
  }
}
