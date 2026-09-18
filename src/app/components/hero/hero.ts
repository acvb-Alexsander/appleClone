import { Component, OnInit, HostListener, signal } from '@angular/core';
import { gsap } from 'gsap';
import { heroVideo, smallHeroVideo } from '../../utils';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero implements OnInit {
  protected heroVideo = heroVideo;
  protected smallHeroVideo = smallHeroVideo;

  protected isMobile = signal(window.innerWidth <= 768);

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth < 768);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.heroVideoAnimation();
    this.heroTextAnimation();
  }

  heroVideoAnimation() {
    gsap.to('#hero', {
      y: 0,
      opacity: 1,
      duration: 2,
      delay: 1.0,
    });
  }

  heroTextAnimation() {
    gsap.to('#cta', {
      y: -50,
      opacity: 1,
      duration: 2,
      delay: 1.5,
    });
  }
}
