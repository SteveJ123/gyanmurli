import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  readonly brandName = 'Gyan Murli';
  readonly tagline = 'Divine Knowledge & Practical Life';
}
