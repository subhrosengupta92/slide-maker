import {
  AgendaSlideSpec,
  ClosingSlideSpec,
  ComparisonSlideSpec,
  DeckPlan,
  DeckSpec,
  DeckInput,
  MetricSpec,
  MetricsSlideSpec,
  NarrativeSlideSpec,
  PlanSection,
  QuoteSlideSpec,
  SlideSpec,
  TimelineMilestone,
  TimelineSlideSpec,
  TitleSlideSpec
} from "../types.js";

function fromSectionToSlide(section: PlanSection): SlideSpec {
  switch (section.intention) {
    case "compare": {
      const split = Math.max(1, Math.ceil(section.points.length / 2));
      const leftBullets = section.points.slice(0, split);
      const rightBullets = section.points.slice(split);

      const comparisonSlide: ComparisonSlideSpec = {
        kind: "comparison",
        title: section.heading,
        leftTitle: "Current",
        rightTitle: "Target",
        leftBullets,
        rightBullets: rightBullets.length > 0 ? rightBullets : ["Define desired state"]
      };
      return comparisonSlide;
    }
    case "timeline": {
      const milestones: TimelineMilestone[] = section.points.slice(0, 5).map((point, index) => ({
        label: `Phase ${index + 1}`,
        detail: point
      }));

      const timelineSlide: TimelineSlideSpec = {
        kind: "timeline",
        title: section.heading,
        milestones
      };
      return timelineSlide;
    }
    case "metrics": {
      const metrics: MetricSpec[] = section.points.slice(0, 4).map((point, index) => {
        const numberMatch = point.match(/\d+[\d,.%xX]*/);
        return {
          label: `Signal ${index + 1}`,
          value: numberMatch?.[0] ?? `${(index + 2) * 12}%`,
          context: point
        };
      });

      const metricsSlide: MetricsSlideSpec = {
        kind: "metrics",
        title: section.heading,
        metrics: metrics.length > 0 ? metrics : [{ label: "Signal 1", value: "24%", context: "Add metric context" }]
      };
      return metricsSlide;
    }
    case "quote": {
      const quoteSlide: QuoteSlideSpec = {
        kind: "quote",
        title: section.heading,
        quote: section.points[0] ?? "Great strategy is deliberate about tradeoffs.",
        author: section.points[1] ?? "Project Team"
      };
      return quoteSlide;
    }
    case "explain":
    default: {
      const narrativeSlide: NarrativeSlideSpec = {
        kind: "narrative",
        title: section.heading,
        bullets: section.points,
        callout: section.points[0]
      };
      return narrativeSlide;
    }
  }
}

export function designDeck(plan: DeckPlan, input: DeckInput): DeckSpec {
  const intro: TitleSlideSpec = {
    kind: "title",
    title: plan.title,
    subtitle: plan.subtitle,
    kicker: "Agentic PPTX Builder"
  };

  const agenda: AgendaSlideSpec = {
    kind: "agenda",
    title: "Agenda",
    items: plan.agenda
  };

  const sectionSlides = plan.sections.map(fromSectionToSlide);

  const closing: ClosingSlideSpec = {
    kind: "closing",
    title: "Next Steps",
    cta: plan.closingCta,
    nextSteps: [
      "Confirm strategic narrative",
      "Assign owners for each workstream",
      "Start execution and track weekly"
    ]
  };

  return {
    meta: {
      title: plan.title,
      subtitle: plan.subtitle,
      theme: input.theme ?? "aurora",
      generatedAt: new Date().toISOString()
    },
    slides: [intro, agenda, ...sectionSlides, closing]
  };
}
