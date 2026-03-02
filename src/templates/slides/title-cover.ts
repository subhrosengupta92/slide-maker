/**
 * Title/Cover slide — the opening slide of the presentation.
 * Full-bleed primary color background with large title and subtitle.
 * Uses MASTER_DARK (no decorations — this slide IS the brand).
 */

import type {
  SlideTemplate,
  SlideContent,
  ContentRequirement,
  SlideCategory,
} from "../types.js";
import type { Theme } from "../../design-system/theme.js";
import type { PptxRenderer } from "../../engine/pptx-renderer.js";

export class TitleCoverTemplate implements SlideTemplate {
  id = "title_cover";
  name = "Title / Cover";
  category: SlideCategory = "opener";

  requiredContent: ContentRequirement[] = [
    { type: "title", required: true, maxLength: 80 },
  ];

  optionalContent: ContentRequirement[] = [
    { type: "subtitle", required: false, maxLength: 120 },
  ];

  scoreFitness(content: SlideContent): number {
    if (!content.title) return 0;
    // This template should only be used for the first slide
    // The orchestrator handles that logic; here we just check basics
    if (content.chart || content.table || content.metrics) return 0;
    if (content.bullets && content.bullets.length > 0) return 0.1;
    return 0.3; // Low default — LayoutAgent explicitly picks this for slide 0
  }

  render(content: SlideContent, theme: Theme, renderer: PptxRenderer): void {
    const slide = renderer.addSlide("MASTER_DARK");
    const t = theme;

    // Full-bleed background is already set by MASTER_DARK

    // Thin accent line — decorative element near the center
    renderer.addRect(slide, {
      x: t.spacing.margin.left,
      y: 2.8,
      w: 2.0,
      h: 0.04,
      fill: { color: t.colors.accent },
    });

    // Main title — large, bold, white on dark
    renderer.addText(slide, content.title || "Untitled Presentation", {
      x: t.spacing.margin.left,
      y: 3.0,
      w: t.slide.width - t.spacing.margin.left - t.spacing.margin.right,
      h: 1.8,
      fontSize: t.fontSizes.title,
      fontFace: t.fonts.heading,
      color: t.colors.text.inverse,
      bold: true,
      align: "left",
      valign: "top",
      lineSpacingMultiple: 1.1,
    });

    // Subtitle — lighter, smaller
    if (content.subtitle) {
      renderer.addText(slide, content.subtitle, {
        x: t.spacing.margin.left,
        y: 5.0,
        w: t.slide.width * 0.6,
        h: 0.8,
        fontSize: t.fontSizes.subheading,
        fontFace: t.fonts.body,
        color: t.colors.text.inverse,
        bold: false,
        align: "left",
        valign: "top",
        lineSpacingMultiple: 1.3,
      });
    }

    // Date / footer line at bottom
    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    renderer.addText(slide, today, {
      x: t.spacing.margin.left,
      y: t.slide.height - 0.7,
      w: 3,
      h: 0.3,
      fontSize: t.fontSizes.caption,
      fontFace: t.fonts.body,
      color: t.colors.text.inverse,
      align: "left",
      valign: "bottom",
    });

    // Speaker notes
    if (content.speakerNotes) {
      renderer.addNotes(slide, content.speakerNotes);
    }
  }
}
