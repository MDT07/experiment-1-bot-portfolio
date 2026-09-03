import { describe, expect, it } from "vitest";
import { catalogByLocale } from "./solution-catalog";

describe("solution catalog", () => {
  it("ships eight stable, unique implementation blueprints", () => {
    const catalog = catalogByLocale.en;
    expect(catalog).toHaveLength(8);
    expect(new Set(catalog.map((solution) => solution.id)).size).toBe(catalog.length);
    expect(new Set(catalog.map((solution) => solution.code)).size).toBe(catalog.length);
  });

  it("keeps English and Russian entries structurally aligned", () => {
    const english = catalogByLocale.en;
    const russian = catalogByLocale.ru;

    expect(russian.map((solution) => solution.id)).toEqual(english.map((solution) => solution.id));
    english.forEach((solution, index) => {
      expect(russian[index].functions).toHaveLength(solution.functions.length);
      expect(russian[index].flow).toHaveLength(solution.flow.length);
      expect(russian[index].controls).toHaveLength(solution.controls.length);
      expect(russian[index].delivery).toHaveLength(solution.delivery.length);
    });
  });

  it("documents delivery, controls, and optional model choices without a live runtime", () => {
    for (const solution of catalogByLocale.en) {
      expect(solution.functions.length).toBeGreaterThanOrEqual(5);
      expect(solution.flow).toHaveLength(5);
      expect(solution.stack.length).toBeGreaterThanOrEqual(3);
      expect(solution.controls.length).toBeGreaterThanOrEqual(3);
      expect(solution.delivery.length).toBeGreaterThanOrEqual(3);
      expect(solution.aiProfiles.length).toBeGreaterThanOrEqual(2);
    }

    const providers = new Set(
      catalogByLocale.en.flatMap((solution) => solution.aiProfiles.map((profile) => profile.provider)),
    );
    expect(providers).toEqual(expect.objectContaining({ size: expect.any(Number) }));
    expect(providers.size).toBeGreaterThanOrEqual(5);
    expect(providers.has("No provider")).toBe(true);
  });
});
