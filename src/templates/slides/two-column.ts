/**
 * Two Column — equal 50/50 split for comparisons, before/after, pros/cons.
 */

import type {
  SlideTemplate,
  SlideContent,
  ContentRequirement,
  SlideCategory,
} from "../types.js";
import type { Theme } from "../../design-system/theme.js";
import type { PptxRenderer } from "../../engine/pptx-renderer.js";
import { contentArea } from "../../design-system/theme.js";
import { createGrid, gridLeftHalf, gridRightHalf } from "../../design-system/grid.js";
import {
  renderTitleBar,
  renderAccentLine,
  renderBulletList,
} from "../helpers/shared.js";

export class TwoColumnTemplate implements SlideTemplate {
  id = "two_column";
  name = "Two Column";
  category: SlideCategory = "content";

  requiredContent: ContentRequirement[] = [
    { type: "title", required: true, maxLength: 120 },
    { type: "leftContent", required: true },
    { type: "rightContent", required: true },
  ];
  optionalContent: ContentRequirement[] = [];

  scoreFitness(content: SlideContent): number {
    if (!content.title) return 0;
    if (content.leftContent && content.rightContent) return 0.9;
    return 0.1;
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

    const colY = ca.y + 0.1;
    const colH = ca.h - 0.1;
    const left = gridLeftHalf(grid);
    const right = gridRightHalf(grid);

    // Vertical divider line
    const dividerX = left.x + left.w + theme.spacing.gutterX / 2;
    renderer.addLine(slide, {
      x: dividerX,
      y: colY,
      w: 0,
      h: colH * 0.8,
      line: { color: theme.colors.divider, width: 1 },
    });

    // Left column
    this.renderColumn(slide, content.leftContent, left, colY, colH, theme, renderer);

    // Right column
    this.renderColumn(slide, content.rightContent, right, colY, colH, theme, renderer);

    if (content.speakerNotes) {
      renderer.addNotes(slide, content.speakerNotes);
    }
  }

  private renderColumn(
    slide: ReturnType<PptxRenderer["addSlide"]>,
    col: SlideContent["leftContent"],
    pos: { x: number; w: number },
    y: number,
    h: number,
    theme: Theme,
    renderer: PptxRenderer
  ): void {
    if (!col) return;

    let currentY = y;

    // Column heading
    if (col.heading) {
      renderer.addText(slide, col.heading, {
        x: pos.x,
        y: currentY,
        w: pos.w,
        h: 0.5,
        fontSize: theme.fontSizes.subheading - 2,
        fontFace: theme.fonts.heading,
        color: theme.colors.primary,
        bold: true,
        align: "left",
        valign: "bottom",
      });
      currentY += 0.6;
    }

    // Column content
    const remainH = h - (currentY - y);
    if (col.bullets && col.bullets.length > 0) {
      renderBulletList(
        slide,
        col.bullets,
        { x: pos.x, y: currentY, w: pos.w, h: remainH },
        theme,
        renderer
      );
    } else if (col.body) {
      renderer.addText(slide, col.body, {
        x: pos.x,
        y: currentY,
        w: pos.w,
        h: remainH,
        fontSize: theme.fontSizes.body,
        fontFace: theme.fonts.body,
        color: theme.colors.text.primary,
        lineSpacingMultiple: 1.5,
        valign: "top",
        align: "left",
      });
    }
  }
}
