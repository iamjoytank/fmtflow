import { describe, expect, it } from "vitest";
import { createFormatter, format, preset } from "../src/index";

describe("format()", () => {
  it("formats INR currency with compact notation", () => {
    const result = format(1000000).locale("en-IN").currency("INR").compact().value();
    expect(result).toBe("₹10L");
  });

  it("formats percent from decimal", () => {
    expect(format(0.25).percent().value()).toBe("25%");
  });

  it("formats USD currency", () => {
    expect(format(99.99).locale("en-US").currency("USD").value()).toBe("$99.99");
  });

  it("returns empty string for null", () => {
    expect(format(null).value()).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(format(undefined).value()).toBe("");
  });

  it("round() controls fraction digits", () => {
    expect(format(1.23456).locale("en-US").round(2).value()).toBe("1.23");
  });

  it("locale() overrides default", () => {
    const result = format(1234567.89).locale("en-US").value();
    expect(result).toBe("1,234,567.89");
  });

  it("compact() shortens large numbers", () => {
    const result = format(2500000).locale("en-IN").compact().value();
    expect(result).toBe("25L");
  });
});

describe("unit()", () => {
  it("formats kilometer short", () => {
    expect(format(10).locale("en-US").unit("kilometer").value()).toBe("10 km");
  });

  it("formats kilometer long", () => {
    expect(format(10).locale("en-US").unit("kilometer", "long").value()).toBe(
      "10 kilometers",
    );
  });

  it("formats kilometer narrow", () => {
    expect(format(5).locale("en-US").unit("kilometer", "narrow").value()).toBe("5km");
  });
});

describe("createFormatter()", () => {
  it("is callable and reusable", () => {
    const price = createFormatter().locale("en-US").currency("USD");
    expect(price(100)).toBe("$100.00");
    expect(price(9.99)).toBe("$9.99");
  });

  it("chains are immutable — original unaffected", () => {
    const base = createFormatter().locale("en-US");
    const withCurrency = base.currency("USD");
    const withPercent = base.percent();
    expect(withCurrency(50)).toBe("$50.00");
    expect(withPercent(0.5)).toBe("50%");
  });
});

describe("v1.2.0 additions", () => {
  it("sign('always') shows + on positive", () => {
    expect(format(100).locale("en-US").sign("always").value()).toBe("+100");
  });

  it("sign('never') hides sign on negative", () => {
    expect(format(-50).locale("en-US").sign("never").value()).toBe("50");
  });

  it("notation('scientific') formats in scientific notation", () => {
    expect(format(1000).locale("en-US").notation("scientific").value()).toBe("1E3");
  });

  it("notation('compact') is equivalent to compact()", () => {
    const a = format(2500000).locale("en-IN").compact().value();
    const b = format(2500000).locale("en-IN").notation("compact").value();
    expect(a).toBe(b);
  });

  it("currencyDisplay('code') shows currency code", () => {
    expect(
      format(1000).locale("en-US").currency("USD").currencyDisplay("code").value(),
    ).toBe("USD\u00a01,000.00");
  });

  it("currencyDisplay('name') shows currency name", () => {
    expect(
      format(1).locale("en-US").currency("USD").currencyDisplay("name").value(),
    ).toBe("1.00 US dollars");
  });

  it("group(false) disables thousand separators", () => {
    expect(format(1000000).locale("en-US").group(false).value()).toBe("1000000");
  });

  it("group(true) keeps thousand separators", () => {
    expect(format(1000000).locale("en-US").group(true).value()).toBe("1,000,000");
  });
});

describe("preset()", () => {
  it("is callable as a function", () => {
    const INR = preset().locale("en-IN").currency("INR").compact();
    expect(INR(1000000)).toBe("₹10L");
  });

  it("is reusable across multiple values", () => {
    const usd = preset().locale("en-US").currency("USD");
    expect(usd(100)).toBe("$100.00");
    expect(usd(9.99)).toBe("$9.99");
    expect(usd(0)).toBe("$0.00");
  });

  it("chains are immutable — preset unaffected by derived chains", () => {
    const base = preset().locale("en-US");
    const withCurrency = base.currency("USD");
    const withPercent = base.percent();
    expect(withCurrency(50)).toBe("$50.00");
    expect(withPercent(0.5)).toBe("50%");
  });

  it("preset with round()", () => {
    const rounded = preset().locale("en-US").round(2);
    expect(rounded(1.23456)).toBe("1.23");
  });

  it("preset with group(false)", () => {
    const noGroup = preset().locale("en-US").group(false);
    expect(noGroup(1000000)).toBe("1000000");
  });
});

describe("cache", () => {
  it("returns the same Intl.NumberFormat instance for identical options", async () => {
    const { getFormatter } = await import("../src/cache");
    const a = getFormatter({ style: "currency", currency: "USD" }, "en-US");
    const b = getFormatter({ style: "currency", currency: "USD" }, "en-US");
    expect(a).toBe(b);
  });
});
