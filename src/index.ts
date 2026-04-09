export type { FormatBuilder } from "./builder";
import { DEFAULT_LOCALE, createBuilder } from "./builder";

export function format(value: number | null | undefined) {
  return createBuilder({ value, locale: DEFAULT_LOCALE });
}

export function createFormatter() {
  return createBuilder({ locale: DEFAULT_LOCALE });
}

export function preset() {
  return createBuilder({ locale: DEFAULT_LOCALE });
}
