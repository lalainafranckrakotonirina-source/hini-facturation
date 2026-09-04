/**
 * Converts a positive integer or decimal number to French words for Malagasy Ariary (Ar).
 * e.g. 2450000 -> "Deux millions quatre cent cinquante mille Ariary"
 */

const units = [
  '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
  'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'
];

const tens = [
  '', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'
];

function convertBelowThousand(n: number): string {
  if (n === 0) return '';
  if (n < 20) return units[n];

  const ten = Math.floor(n / 10);
  const unit = n % 10;

  if (ten === 7) {
    if (unit === 1) return 'soixante et onze';
    return `soixante-${units[10 + unit]}`;
  }

  if (ten === 8) {
    if (unit === 0) return 'quatre-vingts';
    return `quatre-vingt-${units[unit]}`;
  }

  if (ten === 9) {
    return `quatre-vingt-${units[10 + unit]}`;
  }

  let result = tens[ten];
  if (unit === 1) {
    result += ' et un';
  } else if (unit > 1) {
    result += `-${units[unit]}`;
  }
  return result;
}

function convertHundreds(n: number): string {
  if (n === 0) return '';
  if (n < 100) return convertBelowThousand(n);

  const hundred = Math.floor(n / 100);
  const remainder = n % 100;

  let hundredStr = '';
  if (hundred === 1) {
    hundredStr = 'cent';
  } else {
    hundredStr = `${units[hundred]} cent${remainder === 0 ? 's' : ''}`;
  }

  if (remainder > 0) {
    hundredStr += ` ${convertBelowThousand(remainder)}`;
  }

  return hundredStr;
}

export function numberToFrenchWords(num: number): string {
  if (isNaN(num) || num <= 0) return 'Zéro Ariary';

  // Work with integer amounts (Ariary has no decimal subdivisions in practical invoicing)
  const integerPart = Math.round(num);

  if (integerPart === 0) return 'Zéro Ariary';

  const chunks: { value: number; singular: string; plural: string }[] = [
    { value: 1_000_000_000, singular: 'milliard', plural: 'milliards' },
    { value: 1_000_000, singular: 'million', plural: 'millions' },
    { value: 1_000, singular: 'mille', plural: 'mille' }, // 'mille' is invariable in French
    { value: 1, singular: '', plural: '' },
  ];

  let remaining = integerPart;
  const parts: string[] = [];

  for (const chunk of chunks) {
    const chunkVal = Math.floor(remaining / chunk.value);
    if (chunkVal > 0) {
      if (chunk.value === 1_000) {
        if (chunkVal === 1) {
          parts.push('mille');
        } else {
          parts.push(`${convertHundreds(chunkVal)} mille`);
        }
      } else if (chunk.value > 1_000) {
        const word = convertHundreds(chunkVal);
        const unit = chunkVal > 1 ? chunk.plural : chunk.singular;
        parts.push(`${word} ${unit}`);
      } else {
        parts.push(convertHundreds(chunkVal));
      }
      remaining %= chunk.value;
    }
  }

  const result = parts.join(' ').trim();
  // Capitalize first letter and append "Ariary"
  if (!result) return 'Zéro Ariary';
  const capitalized = result.charAt(0).toUpperCase() + result.slice(1);
  return `${capitalized} Ariary`;
}
