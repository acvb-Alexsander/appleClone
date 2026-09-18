import * as THREE from 'three';

/**
 * ATENÇÃO: seu Lights.jsx original não foi enviado, então esta é uma
 * reconstrução razoável (ambient já está em ModelView, então aqui só
 * adiciono as luzes "de cena"). Troque intensidades/posições pelas do
 * seu componente original se elas forem diferentes.
 */
export function addLights(scene: THREE.Scene) {
  const directional = new THREE.DirectionalLight(0xffffff, 5);
  directional.position.set(5, 10, 5);
  directional.castShadow = true;

  const point = new THREE.PointLight(0xffffff, 2);
  point.position.set(-5, -5, 5);

  scene.add(directional, point);
}
