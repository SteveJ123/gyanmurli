import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [CommonModule, RouterLink, RouterLinkActive],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  readonly brandName = 'Gyan Murli';
  readonly tagline = 'Divine Knowledge & Practical Life';

  readonly navItems = [
  { label: 'Home', path: '/' },
  { label: 'Blessings', path: '/blessings' },
  { label: 'Books', path: '/books' },
  { label: 'Seva', path: '/seva' },
  { label: 'News', path: '/news' },
  { label: 'Contact', path: '/contact' },
];
}
