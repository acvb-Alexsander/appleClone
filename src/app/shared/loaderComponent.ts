import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Equivalente ao <Loader/> usado como fallback do <Suspense> no React.
 * Aqui não existe Suspense nativo para assets 3D, então o próprio
 * ModelViewComponent controla um sinal `loading` e mostra/esconde isto.
 */
@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" class="model-loader">
      <span class="spinner"></span>
    </div>
  `,
  styles: [
    `
      .model-loader {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }
      .spinner {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.25);
        border-top-color: #fff;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoaderComponent {
  @Input() visible = true;
}
