/**
 * Text Only slide — action title + body text or bullet points.
 * Clean, generous whitespace. The workhorse of any presentation.
 * Uses MASTER_CONTENT (brand bar + slide number).
 */

import type {
  SlideTemplate,
  SlideContent,
  ContentRequirement,
  SlideCategory,
} from "../types.js";
import type { Theme } from "../../design-system/theme.js";
import type { PptxRenderer } from "../../engine/pptx-renderer.js";
import { contentArea, titleArea } from "../../design-system/theme.js";
import { renderTitleBar, renderAccentLine, renderBulletList } from "../helpers/shared.js";

export class TextOnlyTemplate implements SlideTemplate {
  id = "text_only";
  name = "Text Only";
  category: SlideCategory = "content";

  requiredContent: ContentRequirement[] = [
    { type: "title", required: true, maxLength: 120 },
  ];

  optionalContent: ContentRequirement[] = [
    { type: "body", required: false, maxLength: 500 },
    { type: "bullets", required: false, maxItems: 6 },
  ];

  scoreFitness(content: SlideContent): number {
    if (!content.title) return 0;
    if (content.chart || content.table || content.metrics) return 0.2;
    if (content.image) return 0.3;
    if (content.quote) return 0.2;
    if (content.bullets && content.bullets.length > 0) return 0.7;
    if (content.body) return 0.7;
    return 0.5; // Universal fallback
  }

  render(content: SlideContent, theme: Theme, renderer: PptxRenderer): void {
    const slide = renderer.addSlide("MASTER_CONTENT");
    const ta = titleArea(theme);
    const ca = contentArea(theme);

    // Action title
    renderTitleBar(slide, content.title || "", theme, renderer);

    // Accent line below title
    renderAccentLine(slide, theme.spacing.margin.left, theme.spacing.contentTop - 0.12, theme, renderer);

    // Content area — bullets or body text
    const contentY = ca.y + 0.1;
    const contentH = ca.h - 0.1;
    const contentW = ca.w * 0.75; // 75% width for readability

    if (content.bullets && content.bullets.length > 0) {
      renderBulletList(
        slide,
        content.bullets,
        { x: ca.x, y: contentY, w: contentW, h: contentH },
        theme,
        renderer
      );
    } else if (content.body) {
      renderer.addText(slide, content.body, {
        x: ca.x,
        y: contentY,
        w: contentW,
        h: contentH,
        fontSize: theme.fontSizes.body,
        fontFace: theme.fonts.body,
        color: theme.colors.text.primary,
        lineSpacingMultiple: 1.5,
        valign: "top",
        align: "left",
      });
    }

    // Speaker notes
    if (content.speakerNotes) {
      renderer.addNotes(slide, content.speakerNotes);
    }
  }
}
