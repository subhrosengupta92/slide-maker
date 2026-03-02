/**
 * CTA / Closing slide — final slide with next steps or contact info.
 * Clean, focused, memorable.
 */

import type {
  SlideTemplate,
  SlideContent,
  ContentRequirement,
  SlideCategory,
} from "../types.js";
import type { Theme } from "../../design-system/theme.js";
import type { PptxRenderer } from "../../engine/pptx-renderer.js";
import { renderBulletList } from "../helpers/shared.js";

export class CtaClosingTemplate implements SlideTemplate {
  id = "cta_closing";
  name = "CTA / Closing";
  category: SlideCategory = "closer";

  requiredContent: ContentRequirement[] = [
    { type: "title", required: true, maxLength: 80 },
  ];
  optionalContent: ContentRequirement[] = [
    { type: "subtitle", required: false, maxLength: 120 },
    { type: "bullets", required: false, maxItems: 5 },
    { type: "body", required: false, maxLength: 300 },
  ];

  scoreFitness(content: SlideContent): number {
    if (!content.title) return 0;
    // Low fitness — only the orchestrator should explicitly select this
    return 0.2;
  }

  render(content: SlideContent, theme: Theme, renderer: PptxRenderer): void {
    const slide = renderer.addSlide("MASTER_DARK");
    const t = theme;

    // Accent line
    renderer.addRect(slide, {
      x: t.spacing.margin.left,
      y: 2.2,
      w: 1.5,
      h: 0.04,
      fill: { color: t.colors.accent },
    });

    // Main CTA title
    renderer.addText(slide, content.title || "Thank You", {
      x: t.spacing.margin.left,
      y: 2.4,
      w: t.slide.width - t.spacing.margin.left - t.spacing.margin.right,
      h: 1.2,
      fontSize: t.fontSizes.title - 4,
      fontFace: t.fonts.heading,
      color: t.colors.text.inverse,
      bold: true,
      align: "left",
      valign: "top",
      lineSpacingMultiple: 1.1,
    });

    // Subtitle or body text
    const contentY = 3.8;
    const contentW = t.slide.width * 0.55;

    if (content.subtitle) {
      renderer.addText(slide, content.subtitle, {
        x: t.spacing.margin.left,
        y: contentY,
        w: contentW,
        h: 0.6,
        fontSize: t.fontSizes.subheading - 4,
        fontFace: t.fonts.body,
        color: t.colors.text.inverse,
        align: "left",
        valign: "top",
        lineSpacingMultiple: 1.3,
      });
    }

    // Next steps / bullets
    if (content.bullets && content.bullets.length > 0) {
      const bulletsY = content.subtitle ? 4.5 : contentY;
      const bulletProps = content.bullets.map((b, i) => ({
        text: b,
        options: {
          bullet: true,
          indentLevel: 0,
          fontSize: t.fontSizes.body,
          fontFace: t.fonts.body,
          color: t.colors.text.inverse,
          lineSpacingMultiple: 1.5,
          paraSpaceBefore: i === 0 ? 0 : 6,
          paraSpaceAfter: 4,
          breakLine: true,
        },
      }));

      renderer.addText(slide, bulletProps, {
        x: t.spacing.margin.left,
        y: bulletsY,
        w: contentW,
        h: 2.5,
        valign: "top",
      });
    } else if (content.body) {
      renderer.addText(slide, content.body, {
        x: t.spacing.margin.left,
        y: content.subtitle ? 4.5 : contentY,
        w: contentW,
        h: 2.0,
        fontSize: t.fontSizes.body,
        fontFace: t.fonts.body,
        color: t.colors.text.inverse,
        lineSpacingMultiple: 1.5,
        align: "left",
        valign: "top",
      });
    }

    if (content.speakerNotes) {
      renderer.addNotes(slide, content.speakerNotes);
    }
  }
}
