import { Component } from '@angular/core';
import { navLists } from '../../constant';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  protected readonly appleImg = 'assets/images/apple.svg';
  protected readonly searchImg = 'assets/images/search.svg';
  protected readonly bagImg = 'assets/images/bag.svg';
  protected readonly navLists = navLists;
}
