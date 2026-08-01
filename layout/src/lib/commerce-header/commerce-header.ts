import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

export type CommerceNavigationItem =
  | 'home'
  | 'wood'
  | 'products'
  | 'catalog'
  | 'contact';

@Component({
  selector: 'lib-commerce-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './commerce-header.html',
  styleUrl: './commerce-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommerceHeaderComponent {
  readonly activeItem = input<CommerceNavigationItem | null>(null);
  readonly transparentAtTop = input(false);

  isScrolled = false;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }
}
