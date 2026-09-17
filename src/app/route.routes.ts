import { Routes } from '@angular/router';
import { Hero } from './components/hero/hero';

export const routes: Routes = [
  {
    path: '',
    component: Hero,
    pathMatch: 'full', // 1. Garante que só carregue o Hero se a URL estiver 100% vazia
  },
  {
    path: 'highlights', // 2. Removida a barra '/' do início
    loadComponent: () => import('./components/highlights/highlights').then((m) => m.Highlights),
  },
];
