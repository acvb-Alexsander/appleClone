import { Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';

interface ViewportEntry {
  id: string;
  trackingEl: HTMLElement; // elemento DOM cujo retângulo define onde a cena é desenhada
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
}

/**
 * Equivalente Angular do padrão:
 *   <Canvas><View.Port /></Canvas>  +  <View id="view1">...</View>
 *
 * O @react-three/fiber usa UM <canvas> físico e, para cada <View>, recorta
 * (scissor) a região correspondente ao elemento DOM associado. Fazemos o
 * mesmo aqui manualmente: cada "viewport" registrada informa um elemento
 * de referência (trackingEl); a cada frame lemos o getBoundingClientRect()
 * dele e desenhamos apenas naquele retângulo do canvas.
 */
@Injectable({ providedIn: 'root' })
export class ModelViewerService {
  private renderer!: THREE.WebGLRenderer;
  private readonly viewports = new Map<string, ViewportEntry>();
  private container!: HTMLElement;
  private rafId: number | null = null;

  constructor(private readonly zone: NgZone) {}

  /** Chamado uma única vez pelo componente pai (Model), quando o <div> host do canvas existe. */
  init(container: HTMLElement) {
    if (this.renderer) return; // já inicializado (StrictMode/HMR-safe)

    this.container = container;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setScissorTest(true);

    Object.assign(this.renderer.domElement.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none', // os controles de órbita escutam no trackingEl, não no canvas
    });

    container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', this.onResize);
    this.onResize();

    // Roda o loop de render fora da Zone do Angular por performance
    // (evita disparar detecção de mudanças a 60fps).
    this.zone.runOutsideAngular(() => this.loop());
  }

  registerViewport(
    id: string,
    trackingEl: HTMLElement,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
  ) {
    this.viewports.set(id, { id, trackingEl, scene, camera });
  }

  unregisterViewport(id: string) {
    this.viewports.delete(id);
  }

  private readonly onResize = () => {
    if (!this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height);
    this.viewports.forEach((v) => {
      v.camera.aspect = v.trackingEl.clientWidth / v.trackingEl.clientHeight || 1;
      v.camera.updateProjectionMatrix();
    });
  };

  private readonly loop = () => {
    this.rafId = requestAnimationFrame(this.loop);
    if (!this.renderer) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    // limpa o canvas inteiro, senão sobra "lixo" fora dos scissors
    this.renderer.setScissorTest(false);
    this.renderer.clear();
    this.renderer.setScissorTest(true);

    this.viewports.forEach((v) => {
      const rect = v.trackingEl.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > H || rect.right < 0 || rect.left > W) return;

      const left = rect.left;
      const bottom = H - rect.bottom;
      this.renderer.setViewport(left, bottom, rect.width, rect.height);
      this.renderer.setScissor(left, bottom, rect.width, rect.height);

      if (v.camera.aspect !== rect.width / rect.height) {
        v.camera.aspect = rect.width / rect.height;
        v.camera.updateProjectionMatrix();
      }
      this.renderer.render(v.scene, v.camera);
    });
  };

  dispose() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    this.renderer?.dispose();
    this.viewports.clear();
  }
}
