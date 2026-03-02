/**
 * Metrics Dashboard — 3-6 large KPI numbers in a grid layout.
 * Perfect for executive dashboards and scorecards.
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
import { createGrid, gridNth } from "../../design-system/grid.js";
import { renderTitleBar, renderAccentLine, renderMetricCard } from "../helpers/shared.js";

export class MetricsDashboardTemplate implements SlideTemplate {
  id = "metrics_dashboard";
  name = "Metrics Dashboard";
  category: SlideCategory = "data";

  requiredContent: ContentRequirement[] = [
    { type: "title", required: true, maxLength: 120 },
    { type: "metrics", required: true, maxItems: 6 },
  ];
  optionalContent: ContentRequirement[] = [];

  scoreFitness(content: SlideContent): number {
    if (!content.title) return 0;
    if (content.metrics && content.metrics.length >= 3) return 0.95;
    if (content.metrics && content.metrics.length > 0) return 0.7;
    return 0;
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

    const metrics = content.metrics || [];
    const count = Math.min(metrics.length, 6);

    // Layout: determine grid arrangement
    // 3 metrics: 1 row of 3
    // 4 metrics: 2 rows of 2
    // 5-6 metrics: 2 rows of 3
    let cols: number;
    let rows: number;

    if (count <= 3) {
      cols = count;
      rows = 1;
    } else if (count === 4) {
      cols = 2;
      rows = 2;
    } else {
      cols = 3;
      rows = 2;
    }

    const cardGap = theme.spacing.gutterX;
    const startY = ca.y + 0.2;
    const availH = ca.h - 0.3;
    const cardH = (availH - (rows - 1) * theme.spacing.gutterY) / rows;

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;

      const colPos = gridNth(grid, cols, col);
      const cardY = startY + row * (cardH + theme.spacing.gutterY);

      renderMetricCard(
        slide,
        metrics[i].value,
        metrics[i].label,
        {
          x: colPos.x,
          y: cardY,
          w: colPos.w,
          h: cardH,
        },
        theme,
        renderer,
        metrics[i].trendLabel
      );
    }

    if (content.speakerNotes) {
      renderer.addNotes(slide, content.speakerNotes);
    }
  }
}
