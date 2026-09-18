import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoCarousel } from './video-carousel';

describe('VideoCarousel', () => {
  let component: VideoCarousel;
  let fixture: ComponentFixture<VideoCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCarousel],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoCarousel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
