/**
 * Modern theme — Chronicle HQ inspired.
 * Near-black primary, bold accent colors, tight contemporary typography.
 * Sleek, editorial, high-contrast.
 */

import type { Theme } from "../theme.js";

export const modernTheme: Theme = {
  name: "modern",

  fonts: {
    heading: "Calibri",
    body: "Calibri",
  },

  fontSizes: {
    title: 48,
    heading: 34,
    subheading: 22,
    body: 15,
    caption: 11,
    label: 10,
  },

  colors: {
    primary: "0F0F0F", // Near-black
    secondary: "2B2B2B", // Dark gray
    accent: "3B82F6", // Electric blue
    background: "FFFFFF", // White
    surface: "F8F9FA", // Off-white
    text: {
      primary: "0F0F0F", // Near-black
      secondary: "71717A", // Zinc gray
      inverse: "FFFFFF", // White
    },
    chart: [
      "3B82F6", // Blue
      "0F0F0F", // Black
      "10B981", // Emerald
      "F59E0B", // Amber
      "EF4444", // Red
      "8B5CF6", // Violet
      "06B6D4", // Cyan
      "F97316", // Orange
    ],
    divider: "E5E7EB", // Gray border
  },

  spacing: {
    margin: { top: 0.6, right: 0.6, bottom: 0.5, left: 0.6 },
    gutterX: 0.3,
    gutterY: 0.3,
    contentTop: 1.4,
  },

  slide: {
    width: 13.33,
    height: 7.5,
    layout: "LAYOUT_WIDE",
  },
};
