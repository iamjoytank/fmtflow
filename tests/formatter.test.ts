import { describe, expect, it } from "vitest";
import { createFormatter, format } from "../src/index";

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

describe("cache", () => {
  it("returns the same Intl.NumberFormat instance for identical options", async () => {
    const { getFormatter } = await import("../src/cache");
    const a = getFormatter({ style: "currency", currency: "USD" }, "en-US");
    const b = getFormatter({ style: "currency", currency: "USD" }, "en-US");
    expect(a).toBe(b);
  });
});
