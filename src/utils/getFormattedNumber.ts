class NumberParser {
  private _group: RegExp;
  private _decimal: RegExp;
  private _numeral: RegExp;
  private _index: (d: string) => number | undefined;
  constructor(locale: string) {
    const format = new Intl.NumberFormat(locale);
    const parts = format.formatToParts(12345.6);
    const numerals = Array.from({ length: 10 }).map((_, i) => format.format(i));
    const index = new Map(numerals.map((d, i) => [d, i]));
    const groupPart = parts.find((d) => d.type === 'group');
    const decimalPart = parts.find((d) => d.type === 'decimal');

    if (groupPart) {
      this._group = new RegExp(`[${groupPart.value}]`, 'g');
    }

    if (decimalPart) {
      this._decimal = new RegExp(`[${decimalPart.value}]`);
    }
    this._numeral = new RegExp(`[${numerals.join('')}]`, 'g');
    this._index = (d) => index.get(d);
  }
  parse(string: string) {
    string = string
      .trim()
      .replace(this._group, '')
      .replace(this._decimal, '.')
      .replace(this._numeral, (d) => {
        const index = this._index(d);
        return index !== undefined ? index.toString() : '';
      });
    return string ? +string : NaN;
  }
}

const localizedAbbr: {
  [key: string]: {
    [key: string]: string;
  };
} = {
  en: {
    b: 'b',
    m: 'm',
    k: 'k',
  },
  de: {
    b: 'Mrd.',
    m: 'Mio.',
    k: 'Tsd.',
  },
};

function getLocalizedAbbreviation(langCode: string, abbr: string) {
  return localizedAbbr[langCode]
    ? localizedAbbr[langCode][abbr]
    : localizedAbbr['en'][abbr];
}

export function getFormattedRoundedNumber(
  langCode: string,
  number: number,
  fractionDigits: number
) {
  // console.log("getFormattedRoundedNumber", langCode, number, fractionDigits);
  if (
    Math.round(number) ===
    Math.round(number * fractionDigits * 10) / (fractionDigits * 10)
  )
    fractionDigits = 0;
  const formatter = new Intl.NumberFormat(langCode, {
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return formatter.format(number);
}

export function localizedAbbreviatedNumber(
  langCode: string,
  number: number,
  fractionDigits: number
) {
  if (number >= 1000000000)
    return (
      getFormattedRoundedNumber(langCode, number / 1000000000, fractionDigits) +
      getLocalizedAbbreviation(langCode, 'b')
    );
  if (number >= 1000000)
    return (
      getFormattedRoundedNumber(langCode, number / 1000000, fractionDigits) +
      getLocalizedAbbreviation(langCode, 'm')
    );
  //if (number >= 1000)
  //  return getFormattedRoundedNumber(langCode, number/1000, fractionDigits) + getLocalizedAbbreviation(langCode, 'k');

  return getFormattedRoundedNumber(langCode, number, fractionDigits);
}

export function getFormattedNumber(langCode: string, number: number) {
  // console.log("getFormattedNumber", langCode, number);
  const formatter = new Intl.NumberFormat(langCode);
  return formatter.format(number);
}

export function parseNumber(langCode: string, number: number) {
  const parser = new NumberParser(langCode);
  return parser.parse(number.toString());
}
