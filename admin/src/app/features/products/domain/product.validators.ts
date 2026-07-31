import {
  AbstractControl,
  FormArray,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const slugValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = String(control.value ?? '').trim();
  if (!value) {
    return null;
  }

  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? null : { slugFormat: true };
};

export const skuValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = String(control.value ?? '').trim();
  if (!value) {
    return null;
  }

  return /^[A-Z0-9-]{4,30}$/.test(value) ? null : { skuFormat: true };
};

export const priceRelationshipValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const group = control;
  const price = Number(group.get('price')?.value ?? 0);
  const offerPrice = Number(group.get('offerPrice')?.value ?? 0);
  const previousPrice = Number(group.get('previousPrice')?.value ?? 0);

  if (offerPrice > 0 && offerPrice > price) {
    return { offerPriceGreaterThanPrice: true };
  }

  if (previousPrice > 0 && previousPrice < price) {
    return { previousPriceLowerThanPrice: true };
  }

  return null;
};

export const positiveDimensionValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const group = control;
  const height = Number(group.get('height')?.value ?? 0);
  const width = Number(group.get('width')?.value ?? 0);
  const length = Number(group.get('length')?.value ?? 0);

  if (height <= 0 || width <= 0 || length <= 0) {
    return { invalidDimensions: true };
  }

  return null;
};

export const slugPatternValidator = (): ValidatorFn => {
  const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');
    if (!value) {
      return null;
    }

    return pattern.test(value) ? null : { invalidSlug: true };
  };
};

export const skuPatternValidator = (): ValidatorFn => {
  const pattern = /^[A-Z0-9_-]{4,40}$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');
    if (!value) {
      return null;
    }

    return pattern.test(value) ? null : { invalidSku: true };
  };
};

export const offerPriceValidator = (
  saleKey: string,
  offerKey: string,
): ValidatorFn => {
  return (group: AbstractControl): ValidationErrors | null => {
    const sale = Number(group.get(saleKey)?.value ?? 0);
    const offer = Number(group.get(offerKey)?.value ?? 0);

    if (!offer || offer <= sale) {
      return null;
    }

    return { offerGreaterThanSale: true };
  };
};

export const minStockValidator = (
  stockKey: string,
  minKey: string,
): ValidatorFn => {
  return (group: AbstractControl): ValidationErrors | null => {
    const stock = Number(group.get(stockKey)?.value ?? 0);
    const minStock = Number(group.get(minKey)?.value ?? 0);

    return minStock <= stock ? null : { minStockGreaterThanStock: true };
  };
};

export const atLeastOneVariantWhenEnabled = (
  enabledKey: string,
  itemsKey: string,
): ValidatorFn => {
  return (group: AbstractControl): ValidationErrors | null => {
    const enabled = Boolean(group.get(enabledKey)?.value);
    const items = group.get(itemsKey) as FormArray | null;

    if (!enabled) {
      return null;
    }

    return items && items.length > 0 ? null : { variantsRequired: true };
  };
};
