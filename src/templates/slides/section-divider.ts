/**
 * Section Divider — large title on dark background for topic transitions.
 */

import type {
  SlideTemplate,
  SlideContent,
  ContentRequirement,
  SlideCategory,
} from "../types.js";
import type { Theme } from "../../design-system/theme.js";
import type { PptxRenderer } from "../../engine/pptx-renderer.js";

export class SectionDividerTemplate implements SlideTemplate {
  id = "section_divider";
  name = "Section Divider";
  category: SlideCategory = "opener";

  requiredContent: ContentRequirement[] = [
    { type: "title", required: true, maxLength: 60 },
  ];
  optionalContent: ContentRequirement[] = [
    { type: "subtitle", required: false, maxLength: 100 },
  ];

  scoreFitness(content: SlideContent): number {
    if (!content.title) return 0;
    if (content.chart || content.table || content.metrics || content.bullets) return 0;
    // Short titles with no body content = section divider
    if (!content.body && !content.bullets && (content.title?.length ?? 0) < 80)
      return 0.6;
    return 0.2;
  }

  render(content: SlideContent, theme: Theme, renderer: PptxRenderer): void {
    const slide = renderer.addSlide("MASTER_DARK");
    const t = theme;

    // Section number or accent line
    renderer.addRect(slide, {
      x: t.spacing.margin.left,
      y: 2.8,
      w: 1.5,
      h: 0.04,
      fill: { color: t.colors.accent },
    });

    // Large title
    renderer.addText(slide, content.title || "Section", {
      x: t.spacing.margin.left,
      y: 3.0,
      w: t.slide.width - t.spacing.margin.left - t.spacing.margin.right,
      h: 1.8,
      fontSize: t.fontSizes.title - 4,
      fontFace: t.fonts.heading,
      color: t.colors.text.inverse,
      bold: true,
      align: "left",
      valign: "top",
      lineSpacingMultiple: 1.1,
    });

    // Subtitle (if present)
    if (content.subtitle) {
      renderer.addText(slide, content.subtitle, {
        x: t.spacing.margin.left,
        y: 4.9,
        w: t.slide.width * 0.5,
        h: 0.6,
        fontSize: t.fontSizes.body,
        fontFace: t.fonts.body,
        color: t.colors.text.inverse,
        align: "left",
        valign: "top",
      });
    }

    if (content.speakerNotes) {
      renderer.addNotes(slide, content.speakerNotes);
    }
  }
}
