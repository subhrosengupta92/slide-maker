import PptxGenJS from "pptxgenjs";
import { getTheme } from "../design/themes.js";
import {
  AgendaSlideSpec,
  ClosingSlideSpec,
  ComparisonSlideSpec,
  DeckSpec,
  MetricsSlideSpec,
  NarrativeSlideSpec,
  QuoteSlideSpec,
  SlideSpec,
  TimelineSlideSpec,
  TitleSlideSpec
} from "../types.js";

const SLIDE_WIDTH = 13.333;
const SLIDE_HEIGHT = 7.5;

function withBullets(lines: string[]): string {
  return lines.map((line) => `• ${line}`).join("\n");
}

function drawBackground(slide: any, themeId: DeckSpec["meta"]["theme"]): void {
  const theme = getTheme(themeId);

  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: SLIDE_WIDTH,
    h: SLIDE_HEIGHT,
    fill: { color: theme.colors.background },
    line: { color: theme.colors.background }
  });

  slide.addShape("roundRect", {
    x: 0.35,
    y: 0.35,
    w: SLIDE_WIDTH - 0.7,
    h: SLIDE_HEIGHT - 0.7,
    radius: 0.06,
    fill: { color: theme.colors.surface, transparency: 2 },
    line: { color: theme.colors.border, pt: 0.5 }
  });

  slide.addShape("line", {
    x: 0.42,
    y: 0.6,
    w: 3.6,
    h: 0,
    line: { color: theme.colors.accent, pt: 2 }
  });

  slide.addShape("ellipse", {
    x: 11.8,
    y: 0.2,
    w: 1.2,
    h: 1.2,
    fill: { color: theme.colors.accentAlt, transparency: 70 },
    line: { color: theme.colors.accentAlt, transparency: 90 }
  });
}

function renderTitleSlide(
  slide: any,
  spec: TitleSlideSpec,
  themeId: DeckSpec["meta"]["theme"]
): void {
  const theme = getTheme(themeId);

  slide.addText(spec.kicker.toUpperCase(), {
    x: 0.9,
    y: 1.2,
    w: 6,
    h: 0.3,
    fontFace: theme.fonts.mono,
    color: theme.colors.accent,
    bold: true,
    charSpace: 2,
    fontSize: 11
  });

  slide.addText(spec.title, {
    x: 0.9,
    y: 1.55,
    w: 10.6,
    h: 1.7,
    fontFace: theme.fonts.display,
    color: theme.colors.textStrong,
    bold: true,
    fontSize: 46,
    fit: "resize"
  });

  slide.addText(spec.subtitle, {
    x: 0.95,
    y: 3.45,
    w: 9.5,
    h: 0.9,
    fontFace: theme.fonts.body,
    color: theme.colors.textSoft,
    fontSize: 20,
    fit: "shrink"
  });
}

function renderAgendaSlide(
  slide: any,
  spec: AgendaSlideSpec,
  themeId: DeckSpec["meta"]["theme"]
): void {
  const theme = getTheme(themeId);

  slide.addText(spec.title, {
    x: 0.95,
    y: 0.95,
    w: 7,
    h: 0.7,
    fontFace: theme.fonts.display,
    color: theme.colors.textStrong,
    bold: true,
    fontSize: 34
  });

  spec.items.slice(0, 7).forEach((item, index) => {
    const y = 1.95 + index * 0.74;

    slide.addShape("ellipse", {
      x: 0.98,
      y,
      w: 0.26,
      h: 0.26,
      fill: { color: index % 2 === 0 ? theme.colors.accent : theme.colors.accentAlt },
      line: { color: theme.colors.surface }
    });

    slide.addText(item, {
      x: 1.35,
      y: y - 0.05,
      w: 10.9,
      h: 0.4,
      fontFace: theme.fonts.body,
      color: theme.colors.textStrong,
      fontSize: 18,
      fit: "shrink"
    });
  });
}

function renderNarrativeSlide(
  slide: any,
  spec: NarrativeSlideSpec,
  themeId: DeckSpec["meta"]["theme"]
): void {
  const theme = getTheme(themeId);

  slide.addText(spec.title, {
    x: 0.95,
    y: 0.95,
    w: 8.8,
    h: 0.7,
    fontFace: theme.fonts.display,
    color: theme.colors.textStrong,
    bold: true,
    fontSize: 30,
    fit: "resize"
  });

  slide.addText(withBullets(spec.bullets.slice(0, 7)), {
    x: 1,
    y: 1.9,
    w: 7.7,
    h: 4.8,
    fontFace: theme.fonts.body,
    color: theme.colors.textStrong,
    fontSize: 18,
    breakLine: true,
    valign: "top"
  });

  if (spec.callout) {
    slide.addShape("roundRect", {
      x: 9,
      y: 2.15,
      w: 3.3,
      h: 2.3,
      radius: 0.08,
      fill: { color: theme.colors.accent, transparency: 7 },
      line: { color: theme.colors.accentAlt, pt: 1 }
    });

    slide.addText("Key Insight", {
      x: 9.25,
      y: 2.42,
      w: 2.8,
      h: 0.35,
      fontFace: theme.fonts.mono,
      color: "FFFFFF",
      bold: true,
      fontSize: 10,
      charSpace: 1
    });

    slide.addText(spec.callout, {
      x: 9.25,
      y: 2.8,
      w: 2.8,
      h: 1.5,
      fontFace: theme.fonts.body,
      color: "FFFFFF",
      bold: true,
      fontSize: 17,
      valign: "top",
      fit: "shrink"
    });
  }
}

function renderComparisonSlide(
  slide: any,
  spec: ComparisonSlideSpec,
  themeId: DeckSpec["meta"]["theme"]
): void {
  const theme = getTheme(themeId);

  slide.addText(spec.title, {
    x: 0.95,
    y: 0.95,
    w: 10,
    h: 0.7,
    fontFace: theme.fonts.display,
    color: theme.colors.textStrong,
    bold: true,
    fontSize: 30,
    fit: "resize"
  });

  const leftX = 0.95;
  const rightX = 6.9;
  const cardY = 1.9;
  const cardW = 5.45;
  const cardH = 4.9;

  const addCard = (x: number, title: string, bullets: string[], accent: string): void => {
    slide.addShape("roundRect", {
      x,
      y: cardY,
      w: cardW,
      h: cardH,
      radius: 0.08,
      fill: { color: theme.colors.surface },
      line: { color: accent, pt: 1.5 }
    });

    slide.addText(title, {
      x: x + 0.28,
      y: cardY + 0.3,
      w: cardW - 0.56,
      h: 0.45,
      fontFace: theme.fonts.body,
      color: accent,
      bold: true,
      fontSize: 16,
      fit: "shrink"
    });

    slide.addText(withBullets(bullets.slice(0, 6)), {
      x: x + 0.28,
      y: cardY + 0.86,
      w: cardW - 0.56,
      h: cardH - 1.2,
      fontFace: theme.fonts.body,
      color: theme.colors.textStrong,
      fontSize: 16,
      breakLine: true,
      valign: "top"
    });
  };

  addCard(leftX, spec.leftTitle, spec.leftBullets, theme.colors.accentAlt);
  addCard(rightX, spec.rightTitle, spec.rightBullets, theme.colors.accent);
}

function renderTimelineSlide(
  slide: any,
  spec: TimelineSlideSpec,
  themeId: DeckSpec["meta"]["theme"]
): void {
  const theme = getTheme(themeId);

  slide.addText(spec.title, {
    x: 0.95,
    y: 0.95,
    w: 9.5,
    h: 0.7,
    fontFace: theme.fonts.display,
    color: theme.colors.textStrong,
    bold: true,
    fontSize: 30,
    fit: "resize"
  });

  const milestones = spec.milestones.slice(0, 5);
  const startX = 1.2;
  const endX = 12.1;
  const y = 3.2;

  slide.addShape("line", {
    x: startX,
    y,
    w: endX - startX,
    h: 0,
    line: { color: theme.colors.border, pt: 2 }
  });

  milestones.forEach((milestone, index) => {
    const x = startX + (index * (endX - startX)) / Math.max(1, milestones.length - 1);
    const color = index % 2 === 0 ? theme.colors.accent : theme.colors.accentAlt;

    slide.addShape("ellipse", {
      x: x - 0.14,
      y: y - 0.14,
      w: 0.28,
      h: 0.28,
      fill: { color },
      line: { color }
    });

    slide.addText(milestone.label, {
      x: x - 0.7,
      y: y - 0.66,
      w: 1.4,
      h: 0.28,
      align: "center",
      fontFace: theme.fonts.mono,
      color,
      bold: true,
      fontSize: 9
    });

    slide.addText(milestone.detail, {
      x: x - 1.1,
      y: y + 0.24,
      w: 2.2,
      h: 1.2,
      align: "center",
      fontFace: theme.fonts.body,
      color: theme.colors.textStrong,
      fontSize: 12,
      fit: "shrink",
      valign: "top"
    });
  });
}

function renderMetricsSlide(
  slide: any,
  spec: MetricsSlideSpec,
  themeId: DeckSpec["meta"]["theme"]
): void {
  const theme = getTheme(themeId);

  slide.addText(spec.title, {
    x: 0.95,
    y: 0.95,
    w: 10,
    h: 0.7,
    fontFace: theme.fonts.display,
    color: theme.colors.textStrong,
    bold: true,
    fontSize: 30,
    fit: "resize"
  });

  const cards = spec.metrics.slice(0, 4);
  const gap = 0.28;
  const startX = 0.95;
  const cardW = (11.45 - gap * (cards.length - 1)) / Math.max(cards.length, 1);

  cards.forEach((metric, index) => {
    const x = startX + index * (cardW + gap);

    slide.addShape("roundRect", {
      x,
      y: 2,
      w: cardW,
      h: 3.8,
      radius: 0.08,
      fill: { color: theme.colors.surface },
      line: { color: theme.colors.border, pt: 1 }
    });

    slide.addText(metric.label, {
      x: x + 0.2,
      y: 2.22,
      w: cardW - 0.4,
      h: 0.35,
      fontFace: theme.fonts.mono,
      color: theme.colors.textSoft,
      fontSize: 10,
      charSpace: 1
    });

    slide.addText(metric.value, {
      x: x + 0.2,
      y: 2.62,
      w: cardW - 0.4,
      h: 0.9,
      fontFace: theme.fonts.display,
      color: theme.colors.accent,
      bold: true,
      fontSize: 38,
      fit: "shrink"
    });

    slide.addText(metric.context, {
      x: x + 0.2,
      y: 3.6,
      w: cardW - 0.4,
      h: 1.8,
      fontFace: theme.fonts.body,
      color: theme.colors.textStrong,
      fontSize: 13,
      valign: "top",
      fit: "shrink"
    });
  });
}

function renderQuoteSlide(
  slide: any,
  spec: QuoteSlideSpec,
  themeId: DeckSpec["meta"]["theme"]
): void {
  const theme = getTheme(themeId);

  slide.addText("\"", {
    x: 0.9,
    y: 1.55,
    w: 0.9,
    h: 1,
    fontFace: theme.fonts.display,
    color: theme.colors.accentAlt,
    bold: true,
    fontSize: 70
  });

  slide.addText(spec.quote, {
    x: 1.7,
    y: 1.95,
    w: 10.6,
    h: 2.5,
    fontFace: theme.fonts.display,
    color: theme.colors.textStrong,
    bold: true,
    fontSize: 36,
    fit: "shrink"
  });

  slide.addText(spec.author, {
    x: 1.75,
    y: 4.7,
    w: 6,
    h: 0.45,
    fontFace: theme.fonts.mono,
    color: theme.colors.textSoft,
    fontSize: 12,
    charSpace: 1,
    bold: true
  });
}

function renderClosingSlide(
  slide: any,
  spec: ClosingSlideSpec,
  themeId: DeckSpec["meta"]["theme"]
): void {
  const theme = getTheme(themeId);

  slide.addText(spec.title, {
    x: 0.95,
    y: 0.95,
    w: 9,
    h: 0.7,
    fontFace: theme.fonts.display,
    color: theme.colors.textStrong,
    bold: true,
    fontSize: 30
  });

  slide.addShape("roundRect", {
    x: 0.95,
    y: 1.9,
    w: 11.5,
    h: 1.6,
    radius: 0.08,
    fill: { color: theme.colors.accent, transparency: 8 },
    line: { color: theme.colors.accentAlt, pt: 1 }
  });

  slide.addText(spec.cta, {
    x: 1.3,
    y: 2.25,
    w: 10.8,
    h: 0.95,
    fontFace: theme.fonts.display,
    color: "FFFFFF",
    bold: true,
    fontSize: 24,
    fit: "shrink"
  });

  slide.addText(withBullets(spec.nextSteps), {
    x: 1,
    y: 4.1,
    w: 8,
    h: 2,
    fontFace: theme.fonts.body,
    color: theme.colors.textStrong,
    fontSize: 17,
    breakLine: true,
    valign: "top"
  });
}

function renderSlide(
  slide: any,
  spec: SlideSpec,
  themeId: DeckSpec["meta"]["theme"]
): void {
  drawBackground(slide, themeId);

  switch (spec.kind) {
    case "title":
      renderTitleSlide(slide, spec, themeId);
      break;
    case "agenda":
      renderAgendaSlide(slide, spec, themeId);
      break;
    case "narrative":
      renderNarrativeSlide(slide, spec, themeId);
      break;
    case "comparison":
      renderComparisonSlide(slide, spec, themeId);
      break;
    case "timeline":
      renderTimelineSlide(slide, spec, themeId);
      break;
    case "metrics":
      renderMetricsSlide(slide, spec, themeId);
      break;
    case "quote":
      renderQuoteSlide(slide, spec, themeId);
      break;
    case "closing":
      renderClosingSlide(slide, spec, themeId);
      break;
    default:
      break;
  }
}

export async function writeDeckPptx(deck: DeckSpec, outputPath: string): Promise<void> {
  const ctorCandidate = (PptxGenJS as any).default ?? PptxGenJS;
  const PptxCtor = ctorCandidate as { new (): any };
  const pptx = new PptxCtor();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Slide Maker";
  pptx.company = "Slide Maker";
  pptx.subject = "Agentic AI-generated deck";
  pptx.title = deck.meta.title;

  for (const spec of deck.slides) {
    const slide = pptx.addSlide();
    renderSlide(slide, spec, deck.meta.theme);
  }

  await pptx.writeFile({ fileName: outputPath });
}
