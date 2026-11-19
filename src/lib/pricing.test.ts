import { describe, it, expect } from 'vitest';
import { calculatePrice } from './pricing';

describe('Pricing Logic', () => {
  it('should return base price if no customizations', () => {
    expect(calculatePrice(25.00, '', 'M')).toBe(25.00);
  });

  it('should add $5.00 for custom text', () => {
    expect(calculatePrice(25.00, 'Hello', 'M')).toBe(30.00);
  });

  it('should add $2.00 for XL or XXL sizes', () => {
    expect(calculatePrice(25.00, '', 'XL')).toBe(27.00);
    expect(calculatePrice(25.00, '', 'XXL')).toBe(27.00);
  });

  it('should combine text and size upcharges correctly', () => {
    expect(calculatePrice(25.00, 'Hello', 'XL')).toBe(32.00);
  });
});