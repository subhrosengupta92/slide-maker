/**
 * OutlineAgent — structures the deck narrative from a raw user prompt.
 * Uses Claude Sonnet 4.5 for fast, high-quality structured output.
 */

import { callClaude } from "./shared/claude-client.js";
import { deckOutlineSchema, type DeckOutline } from "./shared/schemas.js";
import { OUTLINE_AGENT_PROMPT } from "./shared/prompts.js";

export async function runOutlineAgent(userPrompt: string): Promise<DeckOutline> {
  const result = await callClaude({
    model: "fast",
    system: OUTLINE_AGENT_PROMPT,
    userMessage: `Create a presentation outline for the following request:\n\n${userPrompt}`,
    schema: deckOutlineSchema,
    schemaName: "DeckOutline",
    maxTokens: 4096,
  });

  // Validate structural rules
  if (result.slides.length === 0) {
    throw new Error("OutlineAgent produced zero slides");
  }

  // Ensure first slide is title_cover
  if (result.slides[0].suggestedType !== "title_cover") {
    result.slides[0].suggestedType = "title_cover";
  }

  // Ensure last slide is cta_closing
  const lastSlide = result.slides[result.slides.length - 1];
  if (lastSlide.suggestedType !== "cta_closing") {
    lastSlide.suggestedType = "cta_closing";
  }

  // Re-index slides
  result.slides.forEach((slide, i) => {
    slide.index = i;
  });

  return result;
}
