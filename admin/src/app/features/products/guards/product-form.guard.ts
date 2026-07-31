import { Observable } from 'rxjs';
import { CanDeactivateFn } from '@angular/router';

export interface CanLeavePage {
  canLeave: () => boolean | Promise<boolean> | Observable<boolean>;
}

export const canDeactivateProductForm: CanDeactivateFn<CanLeavePage> = (
  component,
) => component.canLeave();
