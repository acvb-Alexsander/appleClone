import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

/**
 * Igual ao animateWithGsap original: anima qualquer alvo (DOM, objeto etc.)
 * disparado por scroll.
 */
export function animateWithGsap(
  target: gsap.TweenTarget,
  animationProps: gsap.TweenVars,
  scrollProps: ScrollTrigger.Vars = {},
) {
  gsap.to(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target as Element,
      toggleActions: 'restart reverse restart reverse',
      start: 'top 85%',
      ...scrollProps,
    },
  });
}

/**
 * Igual ao animateWithGsapTimeline original.
 *
 * Diferença de API: em vez de receber um `ref` do React (`{ current: Object3D }`),
 * recebe o THREE.Object3D diretamente — em Angular não existe o conceito de ref
 * do React, então os componentes guardam o grupo como propriedade de classe
 * e o passam aqui diretamente.
 */
export function animateWithGsapTimeline(
  timeline: gsap.core.Timeline,
  rotationObject: THREE.Object3D,
  rotationState: number,
  firstTarget: string,
  secondTarget: string,
  animationProps: gsap.TweenVars,
) {
  timeline.to(rotationObject.rotation, {
    y: rotationState,
    duration: 1,
    ease: 'power2.inOut',
  });

  timeline.to(
    firstTarget,
    {
      ...animationProps,
      ease: 'power2.inOut',
    },
    '<',
  );

  timeline.to(
    secondTarget,
    {
      ...animationProps,
      ease: 'power2.inOut',
    },
    '<',
  );
}
