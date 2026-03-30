import { getFormatter } from "./cache";

interface FormatState {
  value?: number | null;
  locale: string;
  style?: "currency" | "percent" | "decimal";
  currency?: string;
  notation?: "compact";
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

export type FormatBuilder = {
  (value?: number | null): string;
  value(): string;
  currency(code: string): FormatBuilder;
  percent(): FormatBuilder;
  compact(): FormatBuilder;
  round(digits: number): FormatBuilder;
  locale(loc: string): FormatBuilder;
};

function buildOptions(state: FormatState): Intl.NumberFormatOptions {
  const opts: Intl.NumberFormatOptions = {};
  if (state.style) opts.style = state.style;
  if (state.currency) opts.currency = state.currency;
  if (state.notation) opts.notation = state.notation;
  if (state.maximumFractionDigits !== undefined)
    opts.maximumFractionDigits = state.maximumFractionDigits;
  if (state.minimumFractionDigits !== undefined)
    opts.minimumFractionDigits = state.minimumFractionDigits;
  return opts;
}

function runFormat(v: number | null | undefined, state: FormatState): string {
  if (v == null) return "";
  try {
    return getFormatter(buildOptions(state), state.locale).format(v);
  } catch {
    return String(v);
  }
}

export function createBuilder(state: FormatState): FormatBuilder {
  return Object.assign(
    (value?: number | null) => runFormat(value ?? state.value, state),
    {
      value: () => runFormat(state.value, state),
      currency: (code: string) =>
        createBuilder({ ...state, style: "currency", currency: code }),
      percent: () => createBuilder({ ...state, style: "percent" }),
      compact: () => createBuilder({ ...state, notation: "compact" }),
      round: (digits: number) =>
        createBuilder({
          ...state,
          maximumFractionDigits: digits,
          minimumFractionDigits: digits,
        }),
      locale: (loc: string) => createBuilder({ ...state, locale: loc }),
    },
  ) as FormatBuilder;
}

export const DEFAULT_LOCALE =
  typeof navigator !== "undefined" ? navigator.language : "en-IN";
