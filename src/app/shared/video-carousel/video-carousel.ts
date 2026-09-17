import { Component, ElementRef, signal, viewChildren, effect } from '@angular/core';
import { hightlightsSlides } from '../../constant';
import gsap from 'gsap';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-video-carousel',
  styleUrl: './video-carousel.css',
  templateUrl: './video-carousel.html',
})
export class VideoCarousel {
  protected hightlightsSlides = hightlightsSlides;
  protected videoRef = viewChildren<ElementRef<HTMLVideoElement>>('videoRef');
  protected videoSpanRef = viewChildren<ElementRef<HTMLSpanElement>>('videoSpanRef');
  protected videoDivRef = viewChildren<ElementRef<HTMLDivElement>>('videoDivRef');

  protected video = signal({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  protected loadedData = signal<any[]>([]);

  constructor() {
    // 1. Efeito de Animação do Progresso (GSAP)
    effect(() => {
      const { videoId } = this.video();
      const spans = this.videoSpanRef();

      if (spans && spans[videoId]) {
        const spanNativo = spans[videoId].nativeElement;

        let anim = gsap.to(spanNativo, {
          onUpdate: () => {
            // Seu código de atualização aqui
          },
          onComplete: () => {
            // Seu código de conclusão aqui
          },
        });
      }
    });

    // 2. Efeito de Controle de Play/Pause (Restaurado para o construtor)
    effect(() => {
      const { isPlaying, startPlay, videoId } = this.video();
      const dadosCarregados = this.loadedData();
      const videos = this.videoRef();

      if (dadosCarregados.length > 3 && videos && videos[videoId]) {
        const videoNativo = videos[videoId].nativeElement;

        if (!isPlaying) {
          videoNativo.pause();
        } else if (startPlay) {
          videoNativo.play();
        }
      }
    });
  }

  // Método Corrigido: Adicionado o 'return' antes de abrir o objeto
  handlePlay() {
    this.video.update((prevVideo) => {
      return {
        ...prevVideo,
        isPlaying: true,
      };
    });
  }
}
