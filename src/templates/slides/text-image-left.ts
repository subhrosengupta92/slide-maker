/**
 * Text + Image Left — text on left (60%), image placeholder on right (40%).
 * Great for narrative slides that pair explanation with a visual.
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
import { createGrid, gridX } from "../../design-system/grid.js";
import {
  renderTitleBar,
  renderAccentLine,
  renderBulletList,
} from "../helpers/shared.js";

export class TextImageLeftTemplate implements SlideTemplate {
  id = "text_image_left";
  name = "Text + Image";
  category: SlideCategory = "content";

  requiredContent: ContentRequirement[] = [
    { type: "title", required: true, maxLength: 120 },
  ];
  optionalContent: ContentRequirement[] = [
    { type: "body", required: false, maxLength: 400 },
    { type: "bullets", required: false, maxItems: 5 },
    { type: "image", required: false },
  ];

  scoreFitness(content: SlideContent): number {
    if (!content.title) return 0;
    if (content.chart || content.metrics) return 0.1;
    // Prefer this when there's an image description or image
    if (content.image) return 0.85;
    if (content.body || content.bullets) return 0.4;
    return 0.2;
  }

  render(content: SlideContent, theme: Theme, renderer: PptxRenderer): void {
    const slide = renderer.addSlide("MASTER_CONTENT");
    const ca = contentArea(theme);
    const grid = createGrid(theme);

    // Title
    renderTitleBar(slide, content.title || "", theme, renderer);
    renderAccentLine(
      slide,
      theme.spacing.margin.left,
      theme.spacing.contentTop - 0.12,
      theme,
      renderer
    );

    // Left side: text (columns 1-7)
    const left = gridX(grid, 1, 7);
    const textY = ca.y + 0.1;
    const textH = ca.h - 0.1;

    if (content.bullets && content.bullets.length > 0) {
      renderBulletList(
        slide,
        content.bullets,
        { x: left.x, y: textY, w: left.w, h: textH },
        theme,
        renderer
      );
    } else if (content.body) {
      renderer.addText(slide, content.body, {
        x: left.x,
        y: textY,
        w: left.w,
        h: textH,
        fontSize: theme.fontSizes.body,
        fontFace: theme.fonts.body,
        color: theme.colors.text.primary,
        lineSpacingMultiple: 1.5,
        valign: "top",
        align: "left",
      });
    }

    // Right side: image placeholder (columns 8-12)
    const right = gridX(grid, 8, 5);
    const imgY = ca.y;
    const imgH = ca.h;

    if (content.image?.path || content.image?.data) {
      renderer.addImage(slide, {
        x: right.x,
        y: imgY,
        w: right.w,
        h: imgH,
        ...(content.image.path ? { path: content.image.path } : {}),
        ...(content.image.data ? { data: content.image.data } : {}),
        sizing: { type: "cover", w: right.w, h: imgH },
      });
    } else {
      renderer.addImagePlaceholder(slide, {
        x: right.x,
        y: imgY,
        w: right.w,
        h: imgH,
        label: content.image?.alt || "[Image]",
      });
    }

    if (content.speakerNotes) {
      renderer.addNotes(slide, content.speakerNotes);
    }
  }
}
