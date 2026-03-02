/**
 * Layout Engine — resolves template selections and handles fallbacks.
 * Validates LayoutAgent decisions against actual content fitness.
 */

import type { SlideTemplate, SlideContent } from "../templates/types.js";
import { getTemplate, getDefaultTemplate, getAllTemplates } from "../templates/registry.js";

/**
 * Resolve the best template for a slide, using the agent's decision as preference
 * but falling back to fitness scoring if the choice doesn't fit.
 */
export function resolveTemplate(
  agentTemplateId: string,
  content: SlideContent
): SlideTemplate {
  const chosen = getTemplate(agentTemplateId);

  // If agent picked a valid template and it fits reasonably well, use it
  if (chosen && chosen.scoreFitness(content) > 0.3) {
    return chosen;
  }

  // Fallback: find the best-fitting template by fitness score
  let best = { template: getDefaultTemplate(), score: 0 };
  for (const template of getAllTemplates()) {
    const score = template.scoreFitness(content);
    if (score > best.score) {
      best = { template, score };
    }
  }
  return best.template;
}

/**
 * Convert agent content output to our SlideContent type.
 * Maps the schema fields to template-compatible format.
 */
export function toSlideContent(
  agentContent: Record<string, unknown>
): SlideContent {
  const sc: SlideContent = {};

  if (typeof agentContent.title === "string") sc.title = agentContent.title;
  if (typeof agentContent.subtitle === "string") sc.subtitle = agentContent.subtitle;
  if (typeof agentContent.body === "string") sc.body = agentContent.body;
  if (Array.isArray(agentContent.bullets)) sc.bullets = agentContent.bullets as string[];
  if (agentContent.leftContent) sc.leftContent = agentContent.leftContent as SlideContent["leftContent"];
  if (agentContent.rightContent) sc.rightContent = agentContent.rightContent as SlideContent["rightContent"];
  if (typeof agentContent.speakerNotes === "string") sc.speakerNotes = agentContent.speakerNotes;

  // Chart
  if (agentContent.chart && typeof agentContent.chart === "object") {
    sc.chart = agentContent.chart as SlideContent["chart"];
  }

  // Metrics
  if (Array.isArray(agentContent.metrics)) {
    sc.metrics = agentContent.metrics as SlideContent["metrics"];
  }

  // Image description → image spec with alt text
  if (typeof agentContent.imageDescription === "string") {
    sc.image = { alt: agentContent.imageDescription };
  }

  return sc;
}
