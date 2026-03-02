/**
 * Template system types — the contract all slide templates implement.
 */

import type { Theme } from "../design-system/theme.js";
import type { PptxRenderer } from "../engine/pptx-renderer.js";

// ---------- Content types ----------

export interface SlideContent {
  title?: string;
  subtitle?: string;
  body?: string;
  bullets?: string[];
  leftContent?: ColumnContent;
  rightContent?: ColumnContent;
  image?: ImageSpec;
  chart?: ChartSpec;
  metrics?: MetricSpec[];
  quote?: QuoteSpec;
  table?: TableSpec;
  timelineItems?: TimelineItem[];
  people?: PersonSpec[];
  iconItems?: IconItemSpec[];
  speakerNotes?: string;
}

export interface ColumnContent {
  heading?: string;
  body?: string;
  bullets?: string[];
}

export interface ImageSpec {
  path?: string;
  data?: string; // base64
  alt: string;
}

export interface ChartSpec {
  chartType: "bar" | "line" | "pie" | "doughnut" | "area" | "scatter";
  data: Array<{
    name: string;
    labels: string[];
    values: number[];
  }>;
  insightText?: string;
  showLegend?: boolean;
  showDataLabels?: boolean;
}

export interface MetricSpec {
  value: string; // "23%", "$4.2M", "150k"
  label: string; // "Revenue Growth", "ARR", "Active Users"
  trend?: "up" | "down" | "flat";
  trendLabel?: string; // "+12% YoY"
}

export interface QuoteSpec {
  text: string;
  attribution: string;
  role?: string;
}

export interface TableSpec {
  headers: string[];
  rows: string[][];
}

export interface TimelineItem {
  date: string;
  title: string;
  description?: string;
}

export interface PersonSpec {
  name: string;
  role: string;
  image?: ImageSpec;
}

export interface IconItemSpec {
  icon?: string; // Placeholder for now
  heading: string;
  description: string;
}

// ---------- Template interface ----------

export type SlideCategory =
  | "opener"
  | "content"
  | "data"
  | "visual"
  | "closer";

export interface ContentRequirement {
  type: keyof SlideContent;
  required: boolean;
  maxLength?: number; // Character limit for text
  maxItems?: number; // Item count limit for lists
}

export interface SlideTemplate {
  id: string;
  name: string;
  category: SlideCategory;
  requiredContent: ContentRequirement[];
  optionalContent: ContentRequirement[];

  /**
   * Score how well this template fits the given content.
   * Returns 0-1 where 1 = perfect fit.
   */
  scoreFitness(content: SlideContent): number;

  /**
   * Render the slide using the template layout.
   */
  render(content: SlideContent, theme: Theme, renderer: PptxRenderer): void;
}
