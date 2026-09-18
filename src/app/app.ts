import { Component, signal } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { Highlights } from './components/highlights/highlights';
import { ModelComponent } from './shared/model/model';
@Component({
  imports: [Navbar, Hero, Highlights, ModelComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('apple-clone');
}
