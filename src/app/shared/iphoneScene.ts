import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

export interface IphoneModelItem {
  title: string;
  color: string[];
  img: string;
}

export interface IphoneHandle {
  group: THREE.Group;
  loaded: Promise<void>;
  setColor: (color: string) => void;
  setSize: (size: 'small' | 'large') => void;
}

const MODEL_URL = '/models/scene.glb';

// Materiais que NÃO mudam de cor (tela, câmera, vidro etc.)
const FIXED_MATERIALS = new Set([
  'zFdeDaGNRwzccye',
  'ujsvqBWRMnqdwPx',
  'hUlRcbieVuIiOXG',
  'jlzuBkUzuJqgvAY',
  'xNrofRCqOXXHVZt',
]);

function setSize(_size: 'small' | 'large') {
  // Intencionalmente vazio: a troca de tamanho é feita pela escala
  // (15 vs 17) e pela animação GSAP, não pela geometria.
}

export function createIphoneModel(scale: [number, number, number]): IphoneHandle {
  const group = new THREE.Group();
  group.scale.set(...scale);

  const colorable = new Set<THREE.MeshStandardMaterial>();

  const loaded = new Promise<void>((resolve, reject) => {
    gltfLoader.load(
      MODEL_URL,
      (gltf) => {
        gltf.scene.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.castShadow = mesh.receiveShadow = true;

          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            console.log('material:', m.name); // remova depois de conferir
            if (!FIXED_MATERIALS.has(m.name)) {
              colorable.add(m as THREE.MeshStandardMaterial);
            }
          });
        });
        group.add(gltf.scene);
        resolve();
      },
      undefined,
      reject,
    );
  });

  function setColor(color: string) {
    colorable.forEach((m) => {
      m.color.set(color);
      m.needsUpdate = true;
    });
  }

  return { group, loaded, setColor, setSize };
}
