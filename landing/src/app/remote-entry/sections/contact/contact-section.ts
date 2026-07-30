import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSectionComponent {}