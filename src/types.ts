export type ThemeId = "aurora" | "graphite" | "ember";

export type SectionIntention =
  | "explain"
  | "compare"
  | "timeline"
  | "metrics"
  | "quote";

export interface DeckInput {
  prompt: string;
  title?: string;
  audience?: string;
  purpose?: string;
  tone?: "executive" | "investor" | "marketing" | "product";
  slideCount?: number;
  theme?: ThemeId;
}

export interface PlanSection {
  heading: string;
  points: string[];
  intention: SectionIntention;
}

export interface DeckPlan {
  title: string;
  subtitle: string;
  storyline: string;
  agenda: string[];
  sections: PlanSection[];
  closingCta: string;
}

export type SlideKind =
  | "title"
  | "agenda"
  | "narrative"
  | "comparison"
  | "timeline"
  | "metrics"
  | "quote"
  | "closing";

export interface BaseSlideSpec {
  kind: SlideKind;
  title: string;
}

export interface TitleSlideSpec extends BaseSlideSpec {
  kind: "title";
  subtitle: string;
  kicker: string;
}

export interface AgendaSlideSpec extends BaseSlideSpec {
  kind: "agenda";
  items: string[];
}

export interface NarrativeSlideSpec extends BaseSlideSpec {
  kind: "narrative";
  bullets: string[];
  callout?: string;
}

export interface ComparisonSlideSpec extends BaseSlideSpec {
  kind: "comparison";
  leftTitle: string;
  rightTitle: string;
  leftBullets: string[];
  rightBullets: string[];
}

export interface TimelineMilestone {
  label: string;
  detail: string;
}

export interface TimelineSlideSpec extends BaseSlideSpec {
  kind: "timeline";
  milestones: TimelineMilestone[];
}

export interface MetricSpec {
  label: string;
  value: string;
  context: string;
}

export interface MetricsSlideSpec extends BaseSlideSpec {
  kind: "metrics";
  metrics: MetricSpec[];
}

export interface QuoteSlideSpec extends BaseSlideSpec {
  kind: "quote";
  quote: string;
  author: string;
}

export interface ClosingSlideSpec extends BaseSlideSpec {
  kind: "closing";
  cta: string;
  nextSteps: string[];
}

export type SlideSpec =
  | TitleSlideSpec
  | AgendaSlideSpec
  | NarrativeSlideSpec
  | ComparisonSlideSpec
  | TimelineSlideSpec
  | MetricsSlideSpec
  | QuoteSlideSpec
  | ClosingSlideSpec;

export interface DeckSpec {
  meta: {
    title: string;
    subtitle: string;
    theme: ThemeId;
    generatedAt: string;
  };
  slides: SlideSpec[];
}

export interface BuildResult {
  outputPath: string;
  plan: DeckPlan;
  deck: DeckSpec;
}
