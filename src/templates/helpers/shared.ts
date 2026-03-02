/**
 * Shared rendering helpers used across multiple templates.
 * Ensures visual consistency for common patterns.
 */

import type { Theme } from "../../design-system/theme.js";
import type { PptxRenderer, Slide, TextProps } from "../../engine/pptx-renderer.js";
import { titleArea } from "../../design-system/theme.js";

/** Render the action title bar (used on most content slides) */
export function renderTitleBar(
  slide: Slide,
  title: string,
  theme: Theme,
  renderer: PptxRenderer
): void {
  const ta = titleArea(theme);
  renderer.addText(slide, title, {
    x: ta.x,
    y: ta.y,
    w: ta.w,
    h: ta.h,
    fontSize: theme.fontSizes.heading,
    fontFace: theme.fonts.heading,
    color: theme.colors.text.primary,
    bold: true,
    valign: "bottom",
    align: "left",
    lineSpacingMultiple: 1.1,
  });
}

/** Render a thin accent-colored line (decorative separator) */
export function renderAccentLine(
  slide: Slide,
  x: number,
  y: number,
  theme: Theme,
  renderer: PptxRenderer,
  width: number = 1.5
): void {
  renderer.addRect(slide, {
    x,
    y,
    w: width,
    h: 0.03,
    fill: { color: theme.colors.accent },
  });
}

/** Render a bullet list in a defined zone */
export function renderBulletList(
  slide: Slide,
  bullets: string[],
  zone: { x: number; y: number; w: number; h: number },
  theme: Theme,
  renderer: PptxRenderer
): void {
  const textProps: TextProps[] = bullets.map((bullet, i) => ({
    text: bullet,
    options: {
      bullet: true,
      indentLevel: 0,
      fontSize: theme.fontSizes.body,
      fontFace: theme.fonts.body,
      color: theme.colors.text.primary,
      lineSpacingMultiple: 1.5,
      paraSpaceBefore: i === 0 ? 0 : 6,
      paraSpaceAfter: 4,
      breakLine: true,
    },
  }));

  renderer.addText(slide, textProps, {
    x: zone.x,
    y: zone.y,
    w: zone.w,
    h: zone.h,
    valign: "top",
  });
}

/** Render a metric card (large number + label + optional trend) */
export function renderMetricCard(
  slide: Slide,
  value: string,
  label: string,
  zone: { x: number; y: number; w: number; h: number },
  theme: Theme,
  renderer: PptxRenderer,
  trendLabel?: string
): void {
  // Card background
  renderer.addRoundRect(slide, {
    x: zone.x,
    y: zone.y,
    w: zone.w,
    h: zone.h,
    fill: { color: theme.colors.surface },
    rectRadius: 0.08,
  });

  // Large value
  renderer.addText(slide, value, {
    x: zone.x + 0.2,
    y: zone.y + 0.3,
    w: zone.w - 0.4,
    h: 1.0,
    fontSize: 36,
    fontFace: theme.fonts.heading,
    color: theme.colors.primary,
    bold: true,
    align: "left",
    valign: "bottom",
  });

  // Label
  renderer.addText(slide, label, {
    x: zone.x + 0.2,
    y: zone.y + 1.4,
    w: zone.w - 0.4,
    h: 0.5,
    fontSize: theme.fontSizes.caption,
    fontFace: theme.fonts.body,
    color: theme.colors.text.secondary,
    align: "left",
    valign: "top",
  });

  // Trend label (if present)
  if (trendLabel) {
    renderer.addText(slide, trendLabel, {
      x: zone.x + 0.2,
      y: zone.y + 1.85,
      w: zone.w - 0.4,
      h: 0.3,
      fontSize: theme.fontSizes.label,
      fontFace: theme.fonts.body,
      color: theme.colors.accent,
      align: "left",
      valign: "top",
    });
  }
}

/** Render a subtitle below the title */
export function renderSubtitle(
  slide: Slide,
  subtitle: string,
  theme: Theme,
  renderer: PptxRenderer,
  y?: number
): void {
  const ta = titleArea(theme);
  renderer.addText(slide, subtitle, {
    x: ta.x,
    y: y ?? theme.spacing.contentTop - 0.05,
    w: ta.w * 0.7,
    h: 0.4,
    fontSize: theme.fontSizes.subheading - 4,
    fontFace: theme.fonts.body,
    color: theme.colors.text.secondary,
    align: "left",
    valign: "top",
  });
}
