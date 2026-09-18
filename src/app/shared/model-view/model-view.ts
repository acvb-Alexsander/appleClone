import {
  Component,
  input,
  WritableSignal,
  effect,
  viewChild,
  ElementRef,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { NgtArgs } from 'angular-three';
import { NgtCanvas } from 'angular-three/dom';
import { NgtsCameraControls } from 'angular-three-soba/controls';
import { injectGLTF } from 'angular-three-soba/loaders';
import { PhoneModel } from '../../interface/phone-model';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

type IPhoneGLTF = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
};

@Component({
  selector: 'app-model-scene',
  standalone: true,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    ...
    @if (gltf(); as model) {
      <ngt-group #modelGroup [scale]="modelScale()">
        <ngt-primitive *args="[model.scene]" />
      </ngt-group>
    }
  `,
})
export class Scene {
  size = input.required<string>();
  item = input.required<PhoneModel>(); // <-- adicionar aqui também
  setRotationState = input.required<WritableSignal<number>>();

  gltf = injectGLTF<IPhoneGLTF>(() => '/models/scene.gltf');

  cameraControls = viewChild.required(NgtsCameraControls);
  modelGroup = viewChild<ElementRef<THREE.Group>>('modelGroup');

  modelScale = computed(() => (this.size() === 'small' ? 15 : 17));

  constructor() {
    // rotação (já existente)
    effect((onCleanup) => {
      const controls = this.cameraControls().controls();
      if (!controls) return;
      const handleChange = () => this.setRotationState().set(controls.azimuthAngle);
      controls.addEventListener('control', handleChange);
      onCleanup(() => controls.removeEventListener('control', handleChange));
    });

    // cor do material baseada no item selecionado
    effect(() => {
      const model = this.gltf();
      const colors = this.item().color;
      if (!model || !colors) return;

      // ajuste os nomes dos materiais conforme os do SEU arquivo .gltf real
      // (abra o .gltf em texto ou use um viewer pra ver os nomes exatos)
      if (model.materials['back_material']) {
        (model.materials['back_material'] as THREE.MeshStandardMaterial).color.set(colors[0]);
      }
      if (model.materials['frame_material']) {
        (model.materials['frame_material'] as THREE.MeshStandardMaterial).color.set(colors[1]);
      }
    });
  }
}

@Component({
  imports: [NgtCanvas, Scene],
  standalone: true,
  selector: 'app-model-view',
  styleUrl: './model-view.css',
  templateUrl: './model-view.html',
})
export class ModelView {
  index = input.required<number>();
  groupRef = input.required<THREE.Group>();
  gsapType = input.required<string>();
  controlRef = input<any>();
  setRotationState = input.required<WritableSignal<number>>();
  item = input.required<PhoneModel>();
  size = input.required<string>();
}
