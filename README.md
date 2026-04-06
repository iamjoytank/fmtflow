# fmtflow

Fluent formatting pipeline for JavaScript — powered by native `Intl.NumberFormat`.

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
```

### Reusable formatters

Avoid repeating configuration across your app:

```ts
import { createFormatter } from "fmtflow";

const price = createFormatter().locale("en-US").currency("USD");
price(100);   // $100.00
price(9.99);  // $9.99

const compact = createFormatter().locale("en-IN").currency("INR").compact();
compact(1000000); // ₹10L
compact(2500000); // ₹25L
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

### `createFormatter()`

Creates a reusable formatter with no bound value. Call it as a function to format.

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
