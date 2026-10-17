import * as THREE from 'three';
import { CollisionBox, StationAnchor } from './LaboratoryEnvironment';

export interface PlayerControllerOptions {
  camera: THREE.PerspectiveCamera;
  domElement: HTMLElement;
  collisionBoxes: CollisionBox[];
  stations: StationAnchor[];
  onNearStationChange: (station: StationAnchor | null) => void;
  onInteract: (station: StationAnchor) => void;
}

export class PlayerController {
  private camera: THREE.PerspectiveCamera;
  private domElement: HTMLElement;
  private collisionBoxes: CollisionBox[];
  private stations: StationAnchor[];
  private onNearStationChange: (station: StationAnchor | null) => void;
  private onInteract: (station: StationAnchor) => void;

  public position: THREE.Vector3;
  private velocity: THREE.Vector3 = new THREE.Vector3();
  public pitch: number = 0;
  public yaw: number = 0;

  // Key states
  private keys: Record<string, boolean> = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  public isLocked: boolean = false;
  public isTransitioning: boolean = false;
  private transitionStartPos = new THREE.Vector3();
  private transitionTargetPos = new THREE.Vector3();
  private transitionStartPitch: number = 0;
  private transitionStartYaw: number = 0;
  private transitionTargetPitch: number = 0;
  private transitionTargetYaw: number = 0;
  private transitionProgress: number = 1;
  private transitionDuration: number = 1.2;

  // Mobile virtual joystick input
  public virtualJoystick = { x: 0, y: 0 };

  public nearestStation: StationAnchor | null = null;
  private readonly playerRadius = 0.55;
  private readonly eyeHeight = 1.7;

  constructor(options: PlayerControllerOptions) {
    this.camera = options.camera;
    this.domElement = options.domElement;
    this.collisionBoxes = options.collisionBoxes;
    this.stations = options.stations;
    this.onNearStationChange = options.onNearStationChange;
    this.onInteract = options.onInteract;

    // Start inside lab entrance
    this.position = new THREE.Vector3(0, this.eyeHeight, 14);
    this.camera.position.copy(this.position);
    this.yaw = 0; // Face north toward center of lab (-Z)

    this.bindEvents();
  }

  public isDragging: boolean = false;
  private previousMousePosition = { x: 0, y: 0 };

  private bindEvents() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    document.addEventListener('pointerlockchange', this.handlePointerLockChange);
    this.domElement.addEventListener('mousemove', this.handleMouseMove);
    this.domElement.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  public dispose() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('pointerlockchange', this.handlePointerLockChange);
    this.domElement.removeEventListener('mousemove', this.handleMouseMove);
    this.domElement.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
    if (document.pointerLockElement === this.domElement) {
      document.exitPointerLock();
    }
  }

  public requestPointerLock() {
    if (this.domElement && !this.isLocked) {
      this.domElement.requestPointerLock().catch(() => {});
    }
  }

  public exitPointerLock() {
    if (document.pointerLockElement === this.domElement) {
      document.exitPointerLock();
    }
  }

  private handlePointerLockChange = () => {
    this.isLocked = document.pointerLockElement === this.domElement;
  };

  private handleMouseDown = (e: MouseEvent) => {
    if (e.button === 0) {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  };

  private handleMouseUp = () => {
    this.isDragging = false;
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.isTransitioning) return;

    const sensitivity = 0.0022;

    if (this.isLocked) {
      // If user specifically locked pointer
      this.yaw -= e.movementX * sensitivity;
      this.pitch -= e.movementY * sensitivity;
    } else if (this.isDragging) {
      // Natural click-and-drag without pointer lock
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;
      this.yaw -= deltaX * sensitivity;
      this.pitch -= deltaY * sensitivity;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    } else {
      return;
    }

    // Clamp pitch between -80 and +80 degrees
    const maxPitch = Math.PI / 2.2;
    this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (['KeyW', 'ArrowUp'].includes(e.code)) this.keys.forward = true;
    if (['KeyS', 'ArrowDown'].includes(e.code)) this.keys.backward = true;
    if (['KeyA', 'ArrowLeft'].includes(e.code)) this.keys.left = true;
    if (['KeyD', 'ArrowRight'].includes(e.code)) this.keys.right = true;

    if (e.code === 'KeyE') {
      if (this.nearestStation) {
        this.onInteract(this.nearestStation);
      }
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (['KeyW', 'ArrowUp'].includes(e.code)) this.keys.forward = false;
    if (['KeyS', 'ArrowDown'].includes(e.code)) this.keys.backward = false;
    if (['KeyA', 'ArrowLeft'].includes(e.code)) this.keys.left = false;
    if (['KeyD', 'ArrowRight'].includes(e.code)) this.keys.right = false;
  };

  public touchRotate(deltaX: number, deltaY: number) {
    if (this.isTransitioning) return;
    const sensitivity = 0.004;
    this.yaw -= deltaX * sensitivity;
    this.pitch -= deltaY * sensitivity;
    const maxPitch = Math.PI / 2.2;
    this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));
  }

  public rotateYaw(deltaYaw: number) {
    if (this.isTransitioning) return;
    this.yaw += deltaYaw;
  }

  public setDirectionalMove(dir: 'forward' | 'backward' | 'left' | 'right', active: boolean) {
    this.keys[dir] = active;
  }

  public flyTo(targetPos: THREE.Vector3, lookAtTarget?: THREE.Vector3) {
    this.transitionStartPos.copy(this.position);
    this.transitionTargetPos.set(targetPos.x, this.eyeHeight, targetPos.z);

    this.transitionStartPitch = this.pitch;
    this.transitionStartYaw = this.yaw;

    if (lookAtTarget) {
      const dx = lookAtTarget.x - targetPos.x;
      const dz = lookAtTarget.z - targetPos.z;
      const targetYaw = Math.atan2(-dx, -dz);
      this.transitionTargetYaw = targetYaw;
      this.transitionTargetPitch = 0.02;
    } else {
      this.transitionTargetYaw = this.yaw;
      this.transitionTargetPitch = this.pitch;
    }

    this.transitionProgress = 0;
    this.isTransitioning = true;
  }

  public update(delta: number) {
    if (this.isTransitioning) {
      this.transitionProgress += delta / this.transitionDuration;
      if (this.transitionProgress >= 1) {
        this.transitionProgress = 1;
        this.isTransitioning = false;
      }
      // Smooth cubic easing
      const t = this.transitionProgress;
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      this.position.lerpVectors(this.transitionStartPos, this.transitionTargetPos, ease);
      this.yaw = THREE.MathUtils.lerp(this.transitionStartYaw, this.transitionTargetYaw, ease);
      this.pitch = THREE.MathUtils.lerp(this.transitionStartPitch, this.transitionTargetPitch, ease);

      this.applyCameraTransform();
      this.checkStationProximity();
      return;
    }

    // Direction vectors
    const moveSpeed = 4.8; // meters per second
    const forwardX = -Math.sin(this.yaw);
    const forwardZ = -Math.cos(this.yaw);
    const rightX = Math.cos(this.yaw);
    const rightZ = -Math.sin(this.yaw);

    let moveX = 0;
    let moveZ = 0;

    // Keyboard inputs
    if (this.keys.forward) {
      moveX += forwardX;
      moveZ += forwardZ;
    }
    if (this.keys.backward) {
      moveX -= forwardX;
      moveZ -= forwardZ;
    }
    if (this.keys.left) {
      moveX -= rightX;
      moveZ -= rightZ;
    }
    if (this.keys.right) {
      moveX += rightX;
      moveZ += rightZ;
    }

    // Virtual Joystick inputs (Mobile)
    if (Math.abs(this.virtualJoystick.x) > 0.05 || Math.abs(this.virtualJoystick.y) > 0.05) {
      moveX += forwardX * (-this.virtualJoystick.y) + rightX * (this.virtualJoystick.x);
      moveZ += forwardZ * (-this.virtualJoystick.y) + rightZ * (this.virtualJoystick.x);
    }

    // Normalize movement vector if diagonal
    const len = Math.hypot(moveX, moveZ);
    if (len > 0.001) {
      moveX /= len;
      moveZ /= len;
    }

    // Velocity dampening
    const targetVelX = moveX * moveSpeed;
    const targetVelZ = moveZ * moveSpeed;
    this.velocity.x = THREE.MathUtils.damp(this.velocity.x, targetVelX, 10, delta);
    this.velocity.z = THREE.MathUtils.damp(this.velocity.z, targetVelZ, 10, delta);

    // Apply movement with axis-independent collision detection
    const deltaMoveX = this.velocity.x * delta;
    const deltaMoveZ = this.velocity.z * delta;

    // Test X-axis movement
    const testPosX = this.position.x + deltaMoveX;
    if (!this.checkCollision(testPosX, this.position.z)) {
      this.position.x = testPosX;
    }

    // Test Z-axis movement
    const testPosZ = this.position.z + deltaMoveZ;
    if (!this.checkCollision(this.position.x, testPosZ)) {
      this.position.z = testPosZ;
    }

    this.position.y = this.eyeHeight;
    this.applyCameraTransform();
    this.checkStationProximity();
  }

  private applyCameraTransform() {
    this.camera.position.copy(this.position);

    // Camera rotation using Euler angles (YXZ order)
    const euler = new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ');
    this.camera.quaternion.setFromEuler(euler);
  }

  private checkCollision(x: number, z: number): boolean {
    const r = this.playerRadius;
    for (let i = 0; i < this.collisionBoxes.length; i++) {
      const box = this.collisionBoxes[i];
      // Circle vs AABB overlap test
      const closestX = Math.max(box.minX, Math.min(x, box.maxX));
      const closestZ = Math.max(box.minZ, Math.min(z, box.maxZ));
      const dx = x - closestX;
      const dz = z - closestZ;
      if (dx * dx + dz * dz < r * r) {
        return true; // Collided
      }
    }
    return false;
  }

  private checkStationProximity() {
    let closest: StationAnchor | null = null;
    let closestDistSq = Infinity;

    for (let i = 0; i < this.stations.length; i++) {
      const station = this.stations[i];
      const dx = this.position.x - station.position.x;
      const dz = this.position.z - station.position.z;
      const distSq = dx * dx + dz * dz;
      const radSq = station.interactRadius * station.interactRadius;

      if (distSq < radSq && distSq < closestDistSq) {
        closest = station;
        closestDistSq = distSq;
      }
    }

    if (closest !== this.nearestStation) {
      this.nearestStation = closest;
      this.onNearStationChange(closest);
    }
  }
}
