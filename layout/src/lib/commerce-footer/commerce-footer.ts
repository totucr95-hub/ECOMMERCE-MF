import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-commerce-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './commerce-footer.html',
  styleUrl: './commerce-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommerceFooterComponent {
  readonly productsRoute = input('/landing');
  readonly productsFragment = input<string | undefined>('productos');
}
