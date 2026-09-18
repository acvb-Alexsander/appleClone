import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

import { ModelViewComponent } from '../model-view/model-view';
import { ModelViewerService } from '../../service/modal-viewer.service';
import { animateWithGsapTimeline } from '../animations';
import { PhoneModel } from '../../interface/phone-model';

// Mesma origem de dados do projeto original — ajuste o caminho de import
// para onde constants.ts / utils vivem no seu repo Angular.

import { yellowImg } from '../../utils';
import { models } from '../../constant';

@Component({
  selector: 'app-model',
  standalone: true,
  imports: [CommonModule, ModelViewComponent],
  templateUrl: './model.html',
  styleUrls: ['./model.css'],
})
export class ModelComponent implements AfterViewInit, OnDestroy {
  size: 'small' | 'large' = 'small';

  model: PhoneModel = {
    title: 'iPhone 15 Pro in Natural Titanium',
    color: ['#8F8A81', '#FFE7B9', '#6F6C64'],
    img: yellowImg,
  };

  smallRotation = 0;
  largeRotation = 0;

  readonly models = models;
  readonly sizes = [
    { label: '6.1"', value: 'small' as const },
    { label: '6.7"', value: 'large' as const },
  ];

  @ViewChild('canvasHost', { static: true }) canvasHostRef!: ElementRef<HTMLDivElement>;
  @ViewChild('smallView') smallView!: ModelViewComponent;
  @ViewChild('largeView') largeView!: ModelViewComponent;

  private tl = gsap.timeline();

  constructor(private viewerService: ModelViewerService) {}

  ngAfterViewInit(): void {
    // Um único WebGLRenderer/canvas compartilhado pelas duas ModelView,
    // tal como <Canvas><View.Port/></Canvas> no original.
    this.viewerService.init(this.canvasHostRef.nativeElement);

    // Equivalente ao useGSAP(() => gsap.to('#heading', {...}), [])
    gsap.to('#heading', { y: 0, opacity: 1 });
  }

  onSmallRotationChange(angle: number) {
    this.smallRotation = angle;
  }

  onLargeRotationChange(angle: number) {
    this.largeRotation = angle;
  }

  selectModel(item: PhoneModel) {
    this.model = item;
  }

  selectSize(value: 'small' | 'large') {
    if (this.size === value) return;
    this.size = value;
    this.runSizeTransition(value);
  }

  /** Mesma lógica do useEffect([size]) original. */
  private runSizeTransition(size: 'small' | 'large') {
    if (!this.smallView || !this.largeView) return;

    if (size === 'large') {
      animateWithGsapTimeline(
        this.tl,
        this.smallView.group,
        this.smallRotation,
        '#view1',
        '#view2',
        { transform: 'translateX(-100%)', duration: 2 },
      );
    }

    if (size === 'small') {
      animateWithGsapTimeline(
        this.tl,
        this.largeView.group,
        this.largeRotation,
        '#view2',
        '#view1',
        { transform: 'translateX(0)', duration: 2 },
      );
    }
  }

  ngOnDestroy(): void {
    this.viewerService.dispose();
  }
}
