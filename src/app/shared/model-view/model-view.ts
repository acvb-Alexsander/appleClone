import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { ModelViewerService } from '../../service/modal-viewer.service';
import { addLights } from '../lights';
import { createIphoneModel, IphoneModelItem, IphoneHandle } from '../iphoneScene';
import { LoaderComponent } from '../loaderComponent';
@Component({
  selector: 'app-model-view',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  template: `
    <!--
      Este <div> é o "trackingEl": o ModelViewerService lê o retângulo dele
      a cada frame e desenha a cena correspondente exatamente nessa área do
      canvas compartilhado — é o mesmo papel que <View id="view1"> tinha no
      react-three/drei.
    -->
    <div #trackingEl [id]="gsapType" class="model-view" [class.model-view--right]="index === 2">
      <app-loader [visible]="loading"></app-loader>
    </div>
  `,
  styles: [
    `
      .model-view {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 100%;
      }
      .model-view--right {
        left: 100%;
      }
    `,
  ],
})
export class ModelViewComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) index!: 1 | 2;
  @Input({ required: true }) gsapType!: string; // 'view1' | 'view2'
  @Input({ required: true }) item!: IphoneModelItem;
  @Input({ required: true }) size!: 'small' | 'large';

  /** Equivalente ao callback setRotationState do React. */
  @Output() rotationChange = new EventEmitter<number>();

  /** Exposto para o componente pai poder animar (equivalente ao groupRef do React). */
  group!: THREE.Group;
  controls!: OrbitControls;

  @ViewChild('trackingEl', { static: true }) trackingElRef!: ElementRef<HTMLDivElement>;

  loading = true;

  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
  private iphone!: IphoneHandle;

  constructor(private readonly viewerService: ModelViewerService) {}

  ngAfterViewInit(): void {
    this.camera.position.set(0, 0, 4);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    addLights(this.scene);

    const scale: [number, number, number] = this.index === 1 ? [15, 15, 15] : [17, 17, 17];
    this.iphone = createIphoneModel(scale);
    this.group = this.iphone.group;
    this.group.name = this.index === 1 ? 'small' : 'large';
    this.scene.add(this.group);

    this.iphone.setColor(this.item.color[0]);
    // Assim que o loader do GLTF resolver o modelo, escondemos o spinner.
    // (createIphoneModel não expõe uma Promise; se quiser, adapte-o para
    // retornar uma para trocar este timeout por um "então" real.)
    setTimeout(() => (this.loading = false), 300);

    const trackingEl = this.trackingElRef.nativeElement;

    this.controls = new OrbitControls(this.camera, trackingEl);
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.rotateSpeed = 0.4;
    this.controls.target.set(0, 0, 0);
    this.controls.addEventListener('end', () => {
      this.rotationChange.emit(this.controls.getAzimuthalAngle());
    });

    this.viewerService.registerViewport(this.gsapType, trackingEl, this.scene, this.camera);

    this.iphone.loaded
      .then(() => {
        this.iphone.setColor(this.item.color[0]); // reaplica a cor depois que os meshes existem
        this.loading = false;
      })
      .catch((err) => {
        console.error('Falha ao carregar o modelo', err);
        this.loading = false;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.iphone) {
      this.iphone.setColor(this.item.color[0]);
    }
    if (changes['size'] && this.iphone) {
      this.iphone.setSize(this.size);
    }
  }

  ngOnDestroy(): void {
    this.viewerService.unregisterViewport(this.gsapType);
    this.controls?.dispose();
  }
}
