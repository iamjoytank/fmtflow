# fmtflow — JavaScript/Typescript Number & Formatter (Intl-based)

Fluent number, currency, percent, and unit formatting library for JavaScript and TypeScript - powered by native `Intl.NumberFormat`.

## Looking for?

- A currency formatter in JavaScript?
- A number formatting library using Intl?
- Compact number formatting (₹10L, 1M)?
- A fluent API for formatting values?

fmtflow provides all of these with a clean, chainable API.

## Keywords

number formatting, currency formatter, percent formatter, unit formatter, Intl.NumberFormat wrapper, JavaScript formatter, TypeScript formatter, compact number formatting

## Why fmtflow?

Formatting numbers with `Intl.NumberFormat` directly is verbose and repetitive:

```js
new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
}).format(1000000);
// ₹10L
```

fmtflow gives you a clean, chainable API:

```js
format(1000000).currency("INR").compact().value();
// ₹10L
```

✔ Readable
✔ Reusable
✔ Composable
✔ Built on native `Intl` — no custom formatting logic

## Install

```bash
# npm
npm install fmtflow

# yarn
yarn add fmtflow

# pnpm
pnpm add fmtflow

# bun
bun add fmtflow
```

## Usage

### One-off formatting

```ts
import { format } from "fmtflow";

format(1000000).currency("INR").compact().value();        // ₹10L
format(0.25).percent().value();                           // 25%
format(99.99).locale("en-US").currency("USD").value();    // $99.99
format(1.23456).round(2).value();                         // 1.23
format(10).locale("en-US").unit("kilometer").value();     // 10 km
format(10).locale("en-US").unit("kilometer", "long").value();   // 10 kilometers
format(5).locale("en-US").unit("kilometer", "narrow").value();  // 5km
format(1234.567).decimal().round(2).value();              // 1,234.57
```

### Reusable presets

Define a formatter once, call it anywhere:

```ts
import { preset } from "fmtflow";

const INR = preset().locale("en-IN").currency("INR").compact();
INR(1000000); // ₹10L
INR(2500000); // ₹25L

const usd = preset().locale("en-US").currency("USD");
usd(100);   // $100.00
usd(9.99);  // $9.99
```

Presets are immutable — derived chains don't affect the original:

```ts
const base = preset().locale("en-US");
const withCurrency = base.currency("USD");
const withPercent  = base.percent();

withCurrency(50); // $50.00
withPercent(0.5); // 50%
```

### Reusable formatters

```ts
import { createFormatter } from "fmtflow";

const price = createFormatter().locale("en-US").currency("USD");
price(100);   // $100.00
price(9.99);  // $9.99
```

### Unit formatting

Format physical measurements using any [ECMA-402 unit identifier](https://tc39.es/ecma402/#table-sanctioned-single-unit-identifiers):

```ts
import { format } from "fmtflow";

format(10).locale("en-US").unit("kilometer").value();          // 10 km
format(10).locale("en-US").unit("kilometer", "long").value();  // 10 kilometers
format(5).locale("en-US").unit("kilometer", "narrow").value(); // 5km
format(72).locale("en-US").unit("fahrenheit").value();         // 72°F
format(1.8).locale("en-US").unit("meter-per-second").value();  // 1.8 m/s
```

### Sign display

```ts
format(100).locale("en-US").sign("always").value();      // +100
format(-50).locale("en-US").sign("never").value();       // 50
format(0).locale("en-US").sign("exceptZero").value();    // 0
```

### Notation

```ts
format(1000).locale("en-US").notation("scientific").value();    // 1E3
format(1000).locale("en-US").notation("engineering").value();   // 1E3
format(2500000).locale("en-IN").notation("compact").value();    // 25L
```

### Currency display

```ts
format(1000).locale("en-US").currency("USD").currencyDisplay("symbol").value(); // $1,000.00
format(1000).locale("en-US").currency("USD").currencyDisplay("code").value();   // USD 1,000.00
format(1000).locale("en-US").currency("USD").currencyDisplay("name").value();   // 1,000.00 US dollars
```

### Grouping

```ts
format(1000000).locale("en-US").group(false).value();  // 1000000
format(1000000).locale("en-US").group(true).value();   // 1,000,000
```

### Indian number formatting

fmtflow defaults to `en-IN` locale, making it a natural fit for Indian apps:

```ts
format(100000).currency("INR").compact().value();   // ₹1L
format(10000000).currency("INR").compact().value(); // ₹1Cr
format(500000).currency("INR").value();             // ₹5,00,000.00
```

## API

### `format(value)`

Creates a bound formatter with a value. Call `.value()` at the end to get the string.

```ts
format(value: number | null | undefined): FormatBuilder
```

### `preset()`

Creates a reusable formatter template with no bound value. Call it as a function to format.

```ts
preset(): FormatBuilder
```

### `createFormatter()`

Alias for `preset()` — same behaviour, kept for backward compatibility.

```ts
createFormatter(): FormatBuilder
```

### Chain methods

| Method | Description |
|--------|-------------|
| `.currency(code)` | Format as currency (`"INR"`, `"USD"`, etc.) |
| `.percent()` | Format as percentage — input is a decimal (`0.25` → `25%`) |
| `.unit(u, display?)` | Format with a unit — `display` is `"short"` (default), `"long"`, or `"narrow"` |
| `.compact()` | Use compact notation (`1000000` → `10L` / `1M`) |
| `.round(digits)` | Fix fraction digits |
| `.locale(loc)` | Override locale (default: `en-IN`) |
| `.sign(mode)` | Control sign display — `"auto"` (default), `"always"`, `"never"`, `"exceptZero"` |
| `.notation(type)` | Number notation — `"standard"`, `"scientific"`, `"engineering"`, `"compact"` |
| `.currencyDisplay(type)` | How currency is shown — `"symbol"` (default), `"code"`, `"name"` |
| `.group(enabled)` | Toggle thousand separators (`true`/`false`) |
| `.value()` | Get the formatted string (only on bound formatters) |

## Comparison

| Approach | Readability | Reusable | Locale-aware |
|----------|-------------|----------|--------------|
| Raw `Intl.NumberFormat` | verbose | manual | yes |
| Traditional utility libs | function-based | limited | varies |
| fmtflow | chainable | yes | yes |

## Edge cases

```ts
format(null).value();      // ""
format(undefined).value(); // ""
```

Invalid currency codes fall back to `String(value)` — no throws.

## Design

- Zero dependencies
- Tree-shakable
- Uses native `Intl.NumberFormat` with internal caching
- No custom formatting logic — correctness is delegated to the runtime
