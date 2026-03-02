/**
 * Zod schemas for all agent I/O types.
 * Single source of truth — these get converted to JSON Schema for Claude structured output.
 */

import { z } from "zod";

// ---------- OutlineAgent ----------

export const slideOutlineItemSchema = z.object({
  index: z.number().int().min(0),
  purpose: z.string().describe("What this slide communicates"),
  suggestedType: z
    .string()
    .describe(
      "Suggested template: title_cover, section_divider, text_only, text_image_left, two_column, chart_insight, metrics_dashboard, cta_closing"
    ),
  keyMessage: z
    .string()
    .describe("The ONE takeaway for this slide (will become the action title)"),
  contentHints: z
    .array(z.string())
    .describe("What information to include on this slide"),
  dataNeeded: z
    .boolean()
    .describe("Does this slide need quantitative data or charts?"),
});

export const deckOutlineSchema = z.object({
  title: z.string().describe("Presentation title"),
  subtitle: z.string().describe("Presentation subtitle or tagline"),
  audience: z
    .string()
    .describe('Target audience, e.g. "board of directors", "investors"'),
  tone: z
    .string()
    .describe('Presentation tone, e.g. "formal", "conversational", "persuasive"'),
  slideCount: z.number().int().min(3).max(30),
  slides: z.array(slideOutlineItemSchema),
});

export type DeckOutline = z.infer<typeof deckOutlineSchema>;
export type SlideOutlineItem = z.infer<typeof slideOutlineItemSchema>;

// ---------- ContentAgent ----------

export const chartDataSchema = z.object({
  chartType: z.enum(["bar", "line", "pie", "doughnut", "area", "scatter"]),
  data: z.array(
    z.object({
      name: z.string(),
      labels: z.array(z.string()),
      values: z.array(z.number()),
    })
  ),
  insightText: z.string().optional(),
  showLegend: z.boolean().optional(),
  showDataLabels: z.boolean().optional(),
});

export const metricSchema = z.object({
  value: z.string().describe('Display value, e.g. "23%", "$4.2M"'),
  label: z.string().describe('Metric label, e.g. "Revenue Growth"'),
  trend: z.enum(["up", "down", "flat"]).optional(),
  trendLabel: z.string().optional().describe('e.g. "+12% YoY"'),
});

export const columnContentSchema = z.object({
  heading: z.string().optional(),
  body: z.string().optional(),
  bullets: z.array(z.string()).optional(),
});

export const slideContentSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  leftContent: columnContentSchema.optional(),
  rightContent: columnContentSchema.optional(),
  chart: chartDataSchema.optional(),
  metrics: z.array(metricSchema).optional(),
  imageDescription: z
    .string()
    .optional()
    .describe("Description of what image should be shown (for placeholder)"),
  speakerNotes: z.string().optional(),
});

export const slideContentArraySchema = z.object({
  slides: z.array(slideContentSchema),
});

export type SlideContentOutput = z.infer<typeof slideContentSchema>;
export type SlideContentArrayOutput = z.infer<typeof slideContentArraySchema>;

// ---------- LayoutAgent ----------

export const slideLayoutDecisionSchema = z.object({
  index: z.number().int().min(0),
  templateId: z
    .enum([
      "title_cover",
      "section_divider",
      "text_only",
      "text_image_left",
      "text_image_right",
      "two_column",
      "three_column",
      "chart_insight",
      "metrics_dashboard",
      "timeline",
      "process_flow",
      "quote",
      "team_grid",
      "image_showcase",
      "table_slide",
      "icon_bullets",
      "comparison",
      "cta_closing",
    ])
    .describe("Template ID to use for this slide"),
  compositionNotes: z
    .string()
    .describe("Brief notes on how to compose this slide"),
  emphasisElement: z
    .enum(["title", "chart", "image", "metrics", "body", "bullets"])
    .describe("Which element should be visually dominant"),
});

export const layoutDecisionArraySchema = z.object({
  slides: z.array(slideLayoutDecisionSchema),
});

export type SlideLayoutDecision = z.infer<typeof slideLayoutDecisionSchema>;
export type LayoutDecisionArray = z.infer<typeof layoutDecisionArraySchema>;
