/**
 * Typography utilities for text measurement and overflow handling.
 * All font sizes in points (pt) — pptxgenjs uses pt.
 */

import type { Theme } from "./theme.js";

/** Approximate characters per line at a given font size and available width (inches) */
export function charsPerLine(fontSize: number, widthInches: number): number {
  // Rough: at 12pt, ~15 chars per inch in Arial. Scale inversely with font size.
  const charsPerInchAt12pt = 15;
  const scaleFactor = 12 / fontSize;
  return Math.floor(widthInches * charsPerInchAt12pt * scaleFactor);
}

/** Estimate number of lines a text will occupy */
export function estimateLines(
  text: string,
  fontSize: number,
  widthInches: number
): number {
  const cpl = charsPerLine(fontSize, widthInches);
  if (cpl <= 0) return 1;
  const words = text.split(/\s+/);
  let lines = 1;
  let lineLen = 0;
  for (const word of words) {
    if (lineLen + word.length + 1 > cpl && lineLen > 0) {
      lines++;
      lineLen = word.length;
    } else {
      lineLen += (lineLen > 0 ? 1 : 0) + word.length;
    }
  }
  return lines;
}

/** Determine if text will overflow a given height */
export function willOverflow(
  text: string,
  fontSize: number,
  widthInches: number,
  heightInches: number,
  lineSpacing: number = 1.5
): boolean {
  const lines = estimateLines(text, fontSize, widthInches);
  const lineHeightInches = (fontSize / 72) * lineSpacing; // pt → inches
  const totalHeight = lines * lineHeightInches;
  return totalHeight > heightInches;
}

/**
 * Compute the best font size that fits text within a box.
 * Tries the given fontSize first, then shrinks by 2pt increments.
 * Returns at least minFontSize.
 */
export function fitFontSize(
  text: string,
  preferredSize: number,
  minSize: number,
  widthInches: number,
  heightInches: number,
  lineSpacing: number = 1.5
): number {
  let size = preferredSize;
  while (size > minSize) {
    if (!willOverflow(text, size, widthInches, heightInches, lineSpacing)) {
      return size;
    }
    size -= 2;
  }
  return minSize;
}

/** Truncate text to fit a maximum character count, adding ellipsis */
export function truncateText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars - 3).trimEnd() + "...";
}

/** Get the appropriate font size for a role */
export function roleFontSize(
  theme: Theme,
  role: "title" | "heading" | "subheading" | "body" | "caption" | "label"
): number {
  return theme.fontSizes[role];
}
