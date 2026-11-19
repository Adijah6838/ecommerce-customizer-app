export const calculatePrice = (basePrice: number, customText: string, size: string) => {
  let price = basePrice;
  if (customText && customText.length > 0) price += 5.00;
  if (size === 'XL' || size === 'XXL') price += 2.00;
  return price;
};