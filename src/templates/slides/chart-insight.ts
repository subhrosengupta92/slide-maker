/**
 * Chart + Insight — chart on left (70%), insight callout on right (30%).
 * The go-to for data storytelling.
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
import {
  createGrid,
  gridLeftTwoThirds,
  gridRightOneThird,
} from "../../design-system/grid.js";
import { renderTitleBar, renderAccentLine } from "../helpers/shared.js";

export class ChartInsightTemplate implements SlideTemplate {
  id = "chart_insight";
  name = "Chart + Insight";
  category: SlideCategory = "data";

  requiredContent: ContentRequirement[] = [
    { type: "title", required: true, maxLength: 120 },
    { type: "chart", required: true },
  ];
  optionalContent: ContentRequirement[] = [];

  scoreFitness(content: SlideContent): number {
    if (!content.title) return 0;
    if (content.chart) return 0.9;
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

    const chartArea = gridLeftTwoThirds(grid);
    const insightArea = gridRightOneThird(grid);

    // Chart
    if (content.chart) {
      renderer.addChart(
        slide,
        content.chart.chartType,
        content.chart.data,
        {
          x: chartArea.x,
          y: ca.y + 0.1,
          w: chartArea.w,
          h: ca.h - 0.2,
          showLegend: content.chart.showLegend ?? true,
          legendPos: "b",
          showDataLabels: content.chart.showDataLabels ?? false,
          dataLabelFontSize: theme.fontSizes.label,
          catAxisLabelFontSize: theme.fontSizes.label,
          valAxisLabelFontSize: theme.fontSizes.label,
          valGridLine: { style: "solid", color: theme.colors.divider },
          chartColors: theme.colors.chart,
        }
      );
    }

    // Insight callout box on the right
    const insightText = content.chart?.insightText || "";
    if (insightText) {
      // Background card
      renderer.addRoundRect(slide, {
        x: insightArea.x,
        y: ca.y + 0.5,
        w: insightArea.w,
        h: 2.5,
        fill: { color: theme.colors.surface },
        rectRadius: 0.08,
      });

      // "Key Insight" label
      renderer.addText(slide, "KEY INSIGHT", {
        x: insightArea.x + 0.2,
        y: ca.y + 0.65,
        w: insightArea.w - 0.4,
        h: 0.3,
        fontSize: theme.fontSizes.label,
        fontFace: theme.fonts.body,
        color: theme.colors.accent,
        bold: true,
        align: "left",
        valign: "top",
      });

      // Insight text
      renderer.addText(slide, insightText, {
        x: insightArea.x + 0.2,
        y: ca.y + 1.0,
        w: insightArea.w - 0.4,
        h: 1.8,
        fontSize: theme.fontSizes.body - 1,
        fontFace: theme.fonts.body,
        color: theme.colors.text.primary,
        lineSpacingMultiple: 1.4,
        align: "left",
        valign: "top",
      });
    }

    if (content.speakerNotes) {
      renderer.addNotes(slide, content.speakerNotes);
    }
  }
}
