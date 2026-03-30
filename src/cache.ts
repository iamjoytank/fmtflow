const cache = new Map<string, Intl.NumberFormat>();

export function getFormatter(
  options: Intl.NumberFormatOptions,
  locale: string,
): Intl.NumberFormat {
  const key = `${locale}:${JSON.stringify(options)}`;
  let formatter = cache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    cache.set(key, formatter);
  }
  return formatter;
}
