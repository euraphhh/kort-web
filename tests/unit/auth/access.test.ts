import { describe, expect, it } from "vitest";
import { canAccess, homePath, navFor, PANEL_PATHS } from "../../../src/lib/auth/access";

describe("navFor", () => {
  it("gives the owner every item, agenda first", () => {
    const hrefs = navFor("owner").map((item) => item.href);
    expect(hrefs).toEqual(["/agenda", "/to-close", "/customers", "/services", "/team", "/settings", "/profile"]);
  });

  it("gives the barber only agenda, to close and profile (customers were not released)", () => {
    expect(navFor("barber").map((item) => item.href)).toEqual(["/agenda", "/to-close", "/profile"]);
  });

  it("puts agenda, to close and customers on the phone tab bar for the owner, the rest under more", () => {
    const owner = navFor("owner");
    expect(owner.filter((i) => i.primary).map((i) => i.href)).toEqual(["/agenda", "/to-close", "/customers"]);
  });
});

describe("canAccess", () => {
  it("lets the owner reach every panel path", () => {
    for (const path of PANEL_PATHS) expect(canAccess("owner", path)).toBe(true);
  });

  it("keeps the barber out of customers, services, team and settings", () => {
    for (const path of ["/customers", "/services", "/team", "/settings"]) {
      expect(canAccess("barber", path)).toBe(false);
    }
    for (const path of ["/agenda", "/to-close", "/profile"]) expect(canAccess("barber", path)).toBe(true);
  });

  it("covers nested paths", () => {
    expect(canAccess("barber", "/customers/123")).toBe(false);
    expect(canAccess("owner", "/customers/123")).toBe(true);
  });

  it("denies a person without a role", () => {
    expect(canAccess(null, "/agenda")).toBe(false);
  });
});

describe("homePath", () => {
  it("is the agenda", () => {
    expect(homePath()).toBe("/agenda");
  });
});
