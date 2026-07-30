import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'admin-settings-page',
  standalone: true,
  template: `<section><h1>Configuracion</h1><p>Pantalla de configuracion lista para integracion.</p></section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {}
