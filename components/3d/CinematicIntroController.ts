import * as THREE from 'three';
import { LaboratoryEnvironment } from './LaboratoryEnvironment';
import { soundEngine } from '@/lib/soundEffects';

export interface IntroState {
  currentScene: number; // 1, 2, 3, 4
  isFinished: boolean;
  timeElapsed: number;
}

export class CinematicIntroController {
  private camera: THREE.PerspectiveCamera;
  private env: LaboratoryEnvironment;
  private onSceneChange: (scene: number) => void;
  private onIntroComplete: () => void;

  public isRunning: boolean = true;
  private timeElapsed: number = 0;
  private sceneReported: number = 1;

  // Keyframe camera coordinates
  // Scene 1: Exterior overview (0, 5.5, 29)
  // Scene 2: Approach entrance (0, 2.8, 21)
  // Scene 3: At doors as they open (0, 2.2, 18.5)
  // Scene 4: Glide into lab threshold (0, 1.7, 13)

  constructor(
    camera: THREE.PerspectiveCamera,
    env: LaboratoryEnvironment,
    onSceneChange: (scene: number) => void,
    onIntroComplete: () => void
  ) {
    this.camera = camera;
    this.env = env;
    this.onSceneChange = onSceneChange;
    this.onIntroComplete = onIntroComplete;

    // Initial camera position for Scene 1
    this.camera.position.set(0, 5.5, 29);
    this.camera.lookAt(0, 2.2, 16);
  }

  public update(delta: number): boolean {
    if (!this.isRunning) return false;

    this.timeElapsed += delta;
    const t = this.timeElapsed;

    if (t < 3.2) {
      // Scene 1: Exterior research facility view at night
      if (this.sceneReported !== 1) {
        this.sceneReported = 1;
        this.onSceneChange(1);
      }
      const p = t / 3.2;
      // Gentle orbit crane
      this.camera.position.x = Math.sin(p * 0.4) * 2.5;
      this.camera.position.y = 5.5 - p * 0.8;
      this.camera.position.z = 29 - p * 3.0;
      this.camera.lookAt(0, 2.2, 17);
    } else if (t < 6.5) {
      // Scene 2: Camera moves toward entrance
      if (this.sceneReported !== 2) {
        this.sceneReported = 2;
        this.onSceneChange(2);
      }
      const p = (t - 3.2) / 3.3;
      const ease = p * p * (3 - 2 * p);
      this.camera.position.x = THREE.MathUtils.lerp(2.5 * Math.sin(0.4), 0, ease);
      this.camera.position.y = THREE.MathUtils.lerp(4.7, 2.2, ease);
      this.camera.position.z = THREE.MathUtils.lerp(26, 18.8, ease);
      this.camera.lookAt(0, 2.2, 16);
    } else if (t < 9.5) {
      // Scene 3: Open doors & reveal interior
      if (this.sceneReported !== 3) {
        this.sceneReported = 3;
        this.onSceneChange(3);
        this.env.setDoorOpen(true);
        soundEngine.playDoorSwoosh();
      }
      const p = (t - 6.5) / 3.0;
      const ease = p * p * (3 - 2 * p);
      this.camera.position.x = 0;
      this.camera.position.y = THREE.MathUtils.lerp(2.2, 1.9, ease);
      this.camera.position.z = THREE.MathUtils.lerp(18.8, 15.5, ease);
      this.camera.lookAt(0, 1.8, 0); // Looking deep into the lab
    } else if (t < 13.5) {
      // Scene 4: Glide into main lab & hold at threshold
      if (this.sceneReported !== 4) {
        this.sceneReported = 4;
        this.onSceneChange(4);
      }
      const p = Math.min(1, (t - 9.5) / 2.5);
      const ease = p * p * (3 - 2 * p);
      this.camera.position.x = 0;
      this.camera.position.y = THREE.MathUtils.lerp(1.9, 1.7, ease);
      this.camera.position.z = THREE.MathUtils.lerp(15.5, 13.0, ease);
      this.camera.lookAt(0, 1.7, 0);
    }

    return true;
  }

  public skip() {
    this.isRunning = false;
    this.env.setDoorOpen(true);
    this.camera.position.set(0, 1.7, 13);
    this.camera.lookAt(0, 1.7, 0);
    this.onIntroComplete();
  }

  public finishAndStartExploring() {
    this.isRunning = false;
    this.env.setDoorOpen(true);
    this.onIntroComplete();
  }
}
