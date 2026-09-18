import { Component, ElementRef, signal, viewChildren, effect } from '@angular/core';
import { hightlightsSlides } from '../../constant';

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

  // Estado único que descreve "qual slide está ativo e o que ele está fazendo"
  protected video = signal({
    isEnd: false,
    startPlay: true,
    videoId: 0,
    isLastVideo: false,
    isPlaying: true,
  });

  // Progresso (0-100) do vídeo atualmente ativo, usado na barrinha de cada dot
  protected progress = signal(0);

  constructor() {
    // Sempre que o slide ativo (videoId) ou o estado de play/pause mudar,
    // garante que SÓ o vídeo atual está tocando e todos os outros estão pausados/zerados.
    effect(() => {
      const { videoId, isPlaying } = this.video();
      const videos = this.videoRef();

      if (!videos || videos.length === 0) return;

      videos.forEach((ref, i) => {
        const el = ref.nativeElement;

        if (i !== videoId) {
          el.pause();
          el.currentTime = 0;
          return;
        }

        if (isPlaying) {
          el.play().catch(() => {
            // Autoplay pode ser bloqueado pelo navegador antes de interação do usuário; ignora silenciosamente.
          });
        } else {
          el.pause();
        }
      });

      // zera a barra de progresso ao trocar de slide
      this.progress.set(0);
    });
  }

  // Dispara quando o navegador consegue ler a duração do vídeo (metadata carregada)
  protected handleLoadedMetadata(_index: number, _event: Event): void {
    // Reservado caso precise da duração (event.target as HTMLVideoElement).duration
  }

  // Atualiza a barra de progresso do vídeo atual conforme ele toca
  protected handleTimeUpdate(index: number, event: Event): void {
    if (index !== this.video().videoId) return;

    const el = event.target as HTMLVideoElement;
    if (!el.duration) return;

    this.progress.set((el.currentTime / el.duration) * 100);
  }

  // Quando o vídeo atual termina: avança pro próximo, e ao terminar o último volta pro primeiro (loop infinito)
  protected handleVideoEnd(index: number): void {
    if (index !== this.video().videoId) return;

    const isLast = index === this.hightlightsSlides.length - 1;
    const nextId = isLast ? 0 : index + 1;

    this.video.update((prev) => ({
      ...prev,
      videoId: nextId,
      isEnd: false,
      isLastVideo: false,
      isPlaying: true,
    }));
  }

  // Botão principal: play/pause do slide atual, ou replay se já terminou tudo
  protected handleProcess(): void {
    const current = this.video();

    if (current.isLastVideo) {
      this.video.update((prev) => ({
        ...prev,
        videoId: 0,
        isLastVideo: false,
        isEnd: false,
        isPlaying: true,
      }));
      return;
    }

    this.video.update((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }

  // Clique em um indicador (dot): pula direto para aquele slide e toca
  protected handleDotClick(index: number): void {
    this.video.update((prev) => ({
      ...prev,
      videoId: index,
      isLastVideo: index === this.hightlightsSlides.length - 1 && false,
      isEnd: false,
      isPlaying: true,
    }));
  }
}
