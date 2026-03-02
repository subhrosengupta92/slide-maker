/**
 * Template Registry — central map of all available slide templates.
 */

import type { SlideTemplate } from "./types.js";
import { TitleCoverTemplate } from "./slides/title-cover.js";
import { SectionDividerTemplate } from "./slides/section-divider.js";
import { TextOnlyTemplate } from "./slides/text-only.js";
import { TextImageLeftTemplate } from "./slides/text-image-left.js";
import { TwoColumnTemplate } from "./slides/two-column.js";
import { ChartInsightTemplate } from "./slides/chart-insight.js";
import { MetricsDashboardTemplate } from "./slides/metrics-dashboard.js";
import { CtaClosingTemplate } from "./slides/cta-closing.js";

const templates: SlideTemplate[] = [
  new TitleCoverTemplate(),
  new SectionDividerTemplate(),
  new TextOnlyTemplate(),
  new TextImageLeftTemplate(),
  new TwoColumnTemplate(),
  new ChartInsightTemplate(),
  new MetricsDashboardTemplate(),
  new CtaClosingTemplate(),
];

const templateMap = new Map<string, SlideTemplate>();
for (const t of templates) {
  templateMap.set(t.id, t);
}

/** Get a template by ID */
export function getTemplate(id: string): SlideTemplate | undefined {
  return templateMap.get(id);
}

/** Get all registered templates */
export function getAllTemplates(): SlideTemplate[] {
  return [...templates];
}

/** Get all template IDs */
export function getTemplateIds(): string[] {
  return templates.map((t) => t.id);
}

/** Fallback: text_only */
export function getDefaultTemplate(): SlideTemplate {
  return templateMap.get("text_only")!;
}
