# fmtflow

Fluent, chainable number formatting powered by `Intl.NumberFormat`.

## Install

```bash
bun add fmtflow
# or
npm install fmtflow
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

```ts
import { createFormatter } from "fmtflow";

const price = createFormatter().locale("en-US").currency("USD");
price(100);   // $100.00
price(9.99);  // $9.99

const compact = createFormatter().locale("en-IN").currency("INR").compact();
compact(1000000); // ₹10L
compact(2500000); // ₹25L
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

## Edge cases

```ts
format(null).value();      // ""
format(undefined).value(); // ""
```

Invalid currency codes fall back to `String(value)` — no throws.

