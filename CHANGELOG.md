# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-04-06

### Added
- `sign(display)` — control positive/negative sign display (`auto`, `always`, `never`, `exceptZero`)
- `notation(style)` — set number notation style (`standard`, `scientific`, `engineering`, `compact`)
- `currencyDisplay(mode)` — switch currency rendering mode (`symbol`, `narrowSymbol`, `code`, `name`)
- `group(enabled)` — toggle digit grouping separators (thousands separators)

## [1.1.0] - 2026-04-02

### Added
- `unit(unitName, display?)` — format numbers with measurement units (e.g. `kilometer`, `liter`) using `Intl.NumberFormat` unit support

## [1.0.2] - 2025-01-01

### Changed
- Housekeeping version bump; no functional changes

## [1.0.1] - 2025-01-01

### Fixed
- Corrected ESM entry point from `index.mjs` to `index.js` in package exports
- Normalized repository URL to `git+https` format

## [1.0.0] - 2025-01-01

### Added
- `FormatBuilder` — immutable, fluent chainable API for composing number formats
- `format(value)` — format a number using the current builder configuration
- `createFormatter()` — expose a reusable `Intl.NumberFormat` instance
- Built-in support for currency, percent, and compact notation
- Memoized `Intl.NumberFormat` instances keyed by options for zero-cost repeated use
- Full TypeScript support with CJS + ESM dual output
- Zero runtime dependencies

[1.2.0]: https://github.com/iamjoytank/fmtflow/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/iamjoytank/fmtflow/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/iamjoytank/fmtflow/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/iamjoytank/fmtflow/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/iamjoytank/fmtflow/releases/tag/v1.0.0
