/**
 * LayoutAgent — selects the best template for each slide based on content.
 * Uses Claude Opus 4.6 for best judgment on visual composition.
 */

import { callClaude } from "./shared/claude-client.js";
import {
  layoutDecisionArraySchema,
  type SlideContentArrayOutput,
  type LayoutDecisionArray,
} from "./shared/schemas.js";
import { LAYOUT_AGENT_PROMPT } from "./shared/prompts.js";

export async function runLayoutAgent(
  contentArray: SlideContentArrayOutput
): Promise<LayoutDecisionArray> {
  // Build a summary of each slide's content for the layout agent
  const slideSummaries = contentArray.slides
    .map((s, i) => {
      const parts: string[] = [`Slide ${i}:`];
      if (s.title) parts.push(`  Title: "${s.title}"`);
      if (s.subtitle) parts.push(`  Subtitle: "${s.subtitle}"`);
      if (s.body) parts.push(`  Body: ${s.body.length} chars`);
      if (s.bullets) parts.push(`  Bullets: ${s.bullets.length} items`);
      if (s.leftContent) parts.push(`  Has left column content`);
      if (s.rightContent) parts.push(`  Has right column content`);
      if (s.chart) parts.push(`  Chart: ${s.chart.chartType} with ${s.chart.data.length} series`);
      if (s.metrics) parts.push(`  Metrics: ${s.metrics.length} KPIs`);
      if (s.imageDescription) parts.push(`  Image: "${s.imageDescription}"`);
      return parts.join("\n");
    })
    .join("\n\n");

  const userMessage = `Select the best template layout for each slide in this ${contentArray.slides.length}-slide presentation.

SLIDE CONTENT SUMMARY:
${slideSummaries}

For each slide, provide:
- index: slide number (0-indexed)
- templateId: which template to use
- compositionNotes: how to compose the slide
- emphasisElement: what the viewer should see first

Remember:
- Slide 0 MUST be "title_cover"
- Last slide MUST be "cta_closing"
- Never repeat the same template more than 2 times in a row
- Match templates to content types`;

  const result = await callClaude({
    model: "reasoning",
    system: LAYOUT_AGENT_PROMPT,
    userMessage,
    schema: layoutDecisionArraySchema,
    schemaName: "LayoutDecisionArray",
    maxTokens: 4096,
  });

  // Enforce structural rules
  if (result.slides.length > 0) {
    result.slides[0].templateId = "title_cover";
    result.slides[result.slides.length - 1].templateId = "cta_closing";
  }

  // Re-index
  result.slides.forEach((s, i) => {
    s.index = i;
  });

  return result;
}
