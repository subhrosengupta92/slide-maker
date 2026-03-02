import { describe, expect, it } from "vitest";
import { buildHeuristicPlan } from "../src/agent/heuristicPlanner.js";
import { designDeck } from "../src/design/designer.js";

describe("heuristic planner", () => {
  it("creates a structured plan from plain text", () => {
    const plan = buildHeuristicPlan({
      prompt:
        "Launch a premium analytics product for CFO teams. We need positioning, GTM plan, pricing, and operating model. Highlight adoption risks and timeline.",
      slideCount: 8
    });

    expect(plan.title.length).toBeGreaterThan(4);
    expect(plan.sections.length).toBeGreaterThanOrEqual(3);
    expect(plan.agenda.length).toBeGreaterThanOrEqual(3);
  });

  it("converts a plan into renderable deck specs", () => {
    const plan = buildHeuristicPlan({
      prompt: "Build growth strategy with milestones and KPI targets"
    });

    const deck = designDeck(plan, { prompt: "x", theme: "aurora" });

    expect(deck.slides.length).toBeGreaterThan(4);
    expect(deck.meta.theme).toBe("aurora");
  });
});
