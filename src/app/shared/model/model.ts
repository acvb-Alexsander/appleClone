import { AfterViewInit, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { gsap } from 'gsap/gsap-core';
import { ModelView } from '../model-view/model-view';
import { PhoneModel } from '../../interface/phone-model';
import { yellowImg } from '../../utils';
import * as THREE from 'three';

@Component({
  imports: [ModelView],
  standalone: true,
  selector: 'app-model',
  styleUrl: './model.css',
  templateUrl: './model.html',
})
export class Model implements AfterViewInit {
  protected yellowImg = yellowImg;

  size = signal<string>('small');

  phoneModel = signal<PhoneModel>({
    title: 'iPhone 15 Pro in Natural Titanium',
    color: ['#88F8A81', '#FFE7B9', '#6F6C64'],
    img: this.yellowImg, // substitua pela sua variável ou string
  });
  //controle das cameras
  @ViewChild('cameraControlSmall') cameraControlSmall!: ElementRef;

  @ViewChild('cameraControlLarge') cameraControlLarge!: ElementRef;
  //modelos dos celulares
  small = new THREE.Group();
  large = new THREE.Group();

  smallRotation = signal(0);
  largeRotation = signal(0);

  updateSize(newSize: string) {
    this.size.set(newSize);
  }

  updateModel(newTitle: string) {
    this.phoneModel.update((current) => ({
      ...current,
      title: newTitle,
    }));
  }

  ngAfterViewInit(): void {
    gsap.to('#heading', {
      y: 0,
      opacity: 1,
    });
  }
}
