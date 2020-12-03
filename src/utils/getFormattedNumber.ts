const localizedAbbr = {
  'en': {
    'b': 'b', 'm': 'm', 'k': 'k',
  },
  'de': {
    'b': 'Mrd.', 'm': 'Mio.', 'k': 'Tsd.',
  },
};

export function localizedAbbreviatedNumber(
  langCode: string,
  number: number,
  fractionDigits: number,
) {
  if (number >= 1000000000)
    return getFormattedRoundedNumber(langCode, number/1000000000, fractionDigits) + localizedAbbr[langCode]['b'];
  if (number >= 1000000)
    return getFormattedRoundedNumber(langCode, number/1000000, fractionDigits) + localizedAbbr[langCode]['m'];
  if (number >= 1000)
    return getFormattedRoundedNumber(langCode, number/1000, fractionDigits) + localizedAbbr[langCode]['k'];

  return getFormattedRoundedNumber(langCode, number, fractionDigits);
}

export function getFormattedRoundedNumber(
  langCode: string,
  number: number,
  fractionDigits: number,
) {
  // console.log("getFormattedRoundedNumber", langCode, number, fractionDigits);
  if (Math.round(number) === Math.round(number*fractionDigits*10)/(fractionDigits*10)) 
    fractionDigits = 0;
  const formatter = new Intl.NumberFormat(langCode, {
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return formatter.format(number);
}

export function getFormattedNumber(
  langCode: string,
  number: number
) {
  // console.log("getFormattedNumber", langCode, number);
  const formatter = new Intl.NumberFormat(langCode);
  return formatter.format(number);
}

