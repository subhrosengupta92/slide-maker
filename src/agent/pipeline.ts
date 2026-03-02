import { mkdir } from "node:fs/promises";
import path from "node:path";
import { designDeck } from "../design/designer.js";
import { writeDeckPptx } from "../render/pptxRenderer.js";
import { BuildResult, DeckInput } from "../types.js";
import { buildHeuristicPlan } from "./heuristicPlanner.js";
import { tryBuildOpenAiPlan } from "./openaiPlanner.js";

export async function buildDeck(input: DeckInput, outputPath: string): Promise<BuildResult> {
  const plan = (await tryBuildOpenAiPlan(input)) ?? buildHeuristicPlan(input);
  const deck = designDeck(plan, input);

  const resolved = path.resolve(outputPath);
  await mkdir(path.dirname(resolved), { recursive: true });
  await writeDeckPptx(deck, resolved);

  return {
    outputPath: resolved,
    plan,
    deck
  };
}
