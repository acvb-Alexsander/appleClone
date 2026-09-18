import { AfterViewInit, Component } from '@angular/core';
import { gsap } from 'gsap';
import { watchImg, rightImg } from '../../utils';
import { VideoCarousel } from '../../shared/video-carousel/video-carousel';

@Component({
  imports: [VideoCarousel],
  standalone: true,
  selector: 'app-highlights',
  styleUrl: './highlights.css',
  templateUrl: './highlights.html',
})
export class Highlights implements AfterViewInit {
  protected watchImg = watchImg;
  protected rightImg = rightImg;

  ngAfterViewInit() {
    gsap.to('#title', {
      y: 0,
      opacity: 1,
    });

    gsap.to('.link', {
      opacity: 1,
      y: 0,
      duration: 2,
      stagger: 1,
    });
  }
}
