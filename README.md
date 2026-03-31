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

format(1000000).currency("INR").compact().value(); // ₹10L
format(0.25).percent().value();                    // 25%
format(99.99).locale("en-US").currency("USD").value(); // $99.99
format(1.23456).round(2).value();                  // 1.23
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
| `.compact()` | Use compact notation (`1000000` → `10L` / `1M`) |
| `.round(digits)` | Fix fraction digits |
| `.locale(loc)` | Override locale (default: `en-IN`) |
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
