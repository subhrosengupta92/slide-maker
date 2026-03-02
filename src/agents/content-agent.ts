/**
 * ContentAgent — writes the actual text, data, and speaker notes for each slide.
 * Uses Claude Sonnet 4.5 for fast, high-quality content generation.
 */

import { callClaude } from "./shared/claude-client.js";
import {
  slideContentArraySchema,
  type DeckOutline,
  type SlideContentArrayOutput,
} from "./shared/schemas.js";
import { CONTENT_AGENT_PROMPT } from "./shared/prompts.js";

export async function runContentAgent(
  outline: DeckOutline
): Promise<SlideContentArrayOutput> {
  // Build a detailed prompt from the outline
  const slideDescriptions = outline.slides
    .map(
      (s) =>
        `Slide ${s.index} (${s.suggestedType}):
  Purpose: ${s.purpose}
  Key Message: ${s.keyMessage}
  Content Hints: ${s.contentHints.join("; ")}
  Data Needed: ${s.dataNeeded ? "Yes" : "No"}`
    )
    .join("\n\n");

  const userMessage = `Write the content for each slide in this presentation.

PRESENTATION: "${outline.title}"
SUBTITLE: "${outline.subtitle}"
AUDIENCE: ${outline.audience}
TONE: ${outline.tone}
TOTAL SLIDES: ${outline.slideCount}

SLIDE OUTLINE:
${slideDescriptions}

Generate content for ALL ${outline.slides.length} slides. Each slide needs:
- title (action title — a complete sentence)
- body text OR bullets (not both, unless the template needs it)
- For data slides: chart data with realistic numbers, or metrics with values
- For two_column slides: leftContent and rightContent
- speakerNotes for every slide
- imageDescription where an image would enhance the slide

Match the content to each slide's suggestedType:
- title_cover: needs title and subtitle
- section_divider: needs title only (brief, punchy)
- text_only: needs title + bullets or body
- text_image_left: needs title + bullets/body + imageDescription
- two_column: needs title + leftContent + rightContent
- chart_insight: needs title + chart data + chart.insightText
- metrics_dashboard: needs title + 3-6 metrics
- cta_closing: needs title + bullets (next steps)`;

  const result = await callClaude({
    model: "fast",
    system: CONTENT_AGENT_PROMPT,
    userMessage,
    schema: slideContentArraySchema,
    schemaName: "SlideContentArray",
    maxTokens: 8192,
  });

  // Validate slide count matches
  if (result.slides.length !== outline.slides.length) {
    console.warn(
      `ContentAgent produced ${result.slides.length} slides but outline has ${outline.slides.length}. Using what we got.`
    );
  }

  return result;
}
