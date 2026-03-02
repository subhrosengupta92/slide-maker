/**
 * 12-column grid system for LAYOUT_WIDE (13.33" × 7.5").
 * All positioning snaps to grid for visual consistency.
 */

import type { Theme } from "./theme.js";

export interface GridConfig {
  columns: 12;
  columnWidth: number;
  gutterWidth: number;
  totalWidth: number;
  marginLeft: number;
  marginRight: number;
}

/** Compute grid config from theme */
export function createGrid(theme: Theme): GridConfig {
  const totalWidth =
    theme.slide.width - theme.spacing.margin.left - theme.spacing.margin.right;
  const gutterWidth = theme.spacing.gutterX;
  // 12 columns with 11 gutters between them
  const columnWidth = (totalWidth - 11 * gutterWidth) / 12;

  return {
    columns: 12,
    columnWidth,
    gutterWidth,
    totalWidth,
    marginLeft: theme.spacing.margin.left,
    marginRight: theme.spacing.margin.right,
  };
}

/**
 * Convert column span to { x, w } positioning.
 * Columns are 1-indexed: col 1 is the leftmost.
 * Example: gridX(grid, 1, 6) → left half of slide
 *          gridX(grid, 7, 6) → right half of slide
 */
export function gridX(
  grid: GridConfig,
  startCol: number,
  spanCols: number
): { x: number; w: number } {
  const col0 = startCol - 1; // Convert to 0-indexed
  const x =
    grid.marginLeft + col0 * (grid.columnWidth + grid.gutterWidth);
  const w =
    spanCols * grid.columnWidth + (spanCols - 1) * grid.gutterWidth;
  return { x, w };
}

/**
 * Shorthand: full width (columns 1-12)
 */
export function gridFull(grid: GridConfig): { x: number; w: number } {
  return gridX(grid, 1, 12);
}

/**
 * Shorthand: left half (columns 1-6)
 */
export function gridLeftHalf(grid: GridConfig): { x: number; w: number } {
  return gridX(grid, 1, 6);
}

/**
 * Shorthand: right half (columns 7-12)
 */
export function gridRightHalf(grid: GridConfig): { x: number; w: number } {
  return gridX(grid, 7, 6);
}

/**
 * Shorthand: left two-thirds (columns 1-8)
 */
export function gridLeftTwoThirds(grid: GridConfig): { x: number; w: number } {
  return gridX(grid, 1, 8);
}

/**
 * Shorthand: right one-third (columns 9-12)
 */
export function gridRightOneThird(grid: GridConfig): { x: number; w: number } {
  return gridX(grid, 9, 4);
}

/**
 * Shorthand: left one-third (columns 1-4)
 */
export function gridLeftOneThird(grid: GridConfig): { x: number; w: number } {
  return gridX(grid, 1, 4);
}

/**
 * Shorthand: right two-thirds (columns 5-12)
 */
export function gridRightTwoThirds(
  grid: GridConfig
): { x: number; w: number } {
  return gridX(grid, 5, 8);
}

/**
 * Split into N equal columns, return the i-th (0-indexed).
 * Useful for three_column template, metrics grids, etc.
 */
export function gridNth(
  grid: GridConfig,
  n: number,
  i: number
): { x: number; w: number } {
  const colsPerItem = Math.floor(12 / n);
  const startCol = i * colsPerItem + 1;
  return gridX(grid, startCol, colsPerItem);
}
