import { getFormatter } from "./cache";

interface FormatState {
  value?: number | null;
  locale: string;
  style?: "currency" | "percent" | "unit" | "decimal";
  currency?: string;
  unit?: string;
  unitDisplay?: "short" | "long" | "narrow";
  notation?: "standard" | "scientific" | "engineering" | "compact";
  signDisplay?: "auto" | "always" | "never" | "exceptZero";
  currencyDisplay?: "symbol" | "code" | "name";
  useGrouping?: boolean;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

export type FormatBuilder = {
  (value?: number | null): string;
  value(): string;
  currency(code: string): FormatBuilder;
  percent(): FormatBuilder;
  unit(u: string, display?: "short" | "long" | "narrow"): FormatBuilder;
  compact(): FormatBuilder;
  round(digits: number): FormatBuilder;
  locale(loc: string): FormatBuilder;
  sign(mode: "auto" | "always" | "never" | "exceptZero"): FormatBuilder;
  notation(type: "standard" | "scientific" | "engineering" | "compact"): FormatBuilder;
  currencyDisplay(type: "symbol" | "code" | "name"): FormatBuilder;
  group(enabled: boolean): FormatBuilder;
};

function buildOptions(state: FormatState): Intl.NumberFormatOptions {
  const opts: Intl.NumberFormatOptions = {};
  if (state.style) opts.style = state.style;
  if (state.currency) opts.currency = state.currency;
  if (state.unit) opts.unit = state.unit;
  if (state.unitDisplay) opts.unitDisplay = state.unitDisplay;
  if (state.notation) opts.notation = state.notation;
  if (state.signDisplay) opts.signDisplay = state.signDisplay;
  if (state.currencyDisplay) opts.currencyDisplay = state.currencyDisplay;
  if (state.useGrouping !== undefined) opts.useGrouping = state.useGrouping;
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
      unit: (u: string, display: "short" | "long" | "narrow" = "short") =>
        createBuilder({ ...state, style: "unit", unit: u, unitDisplay: display }),
      compact: () => createBuilder({ ...state, notation: "compact" }),
      round: (digits: number) =>
        createBuilder({
          ...state,
          maximumFractionDigits: digits,
          minimumFractionDigits: digits,
        }),
      locale: (loc: string) => createBuilder({ ...state, locale: loc }),
      sign: (mode: "auto" | "always" | "never" | "exceptZero") =>
        createBuilder({ ...state, signDisplay: mode }),
      notation: (type: "standard" | "scientific" | "engineering" | "compact") =>
        createBuilder({ ...state, notation: type }),
      currencyDisplay: (type: "symbol" | "code" | "name") =>
        createBuilder({ ...state, currencyDisplay: type }),
      group: (enabled: boolean) => createBuilder({ ...state, useGrouping: enabled }),
    },
  ) as FormatBuilder;
}

export const DEFAULT_LOCALE =
  typeof navigator !== "undefined" ? navigator.language : "en-IN";
