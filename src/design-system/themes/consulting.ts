/**
 * Consulting theme — McKinsey/BCG inspired.
 * Dark navy primary, clean white backgrounds, Georgia headings, Arial body.
 * Professional, authoritative, data-driven.
 */

import type { Theme } from "../theme.js";

export const consultingTheme: Theme = {
  name: "consulting",

  fonts: {
    heading: "Georgia",
    body: "Arial",
  },

  fontSizes: {
    title: 44,
    heading: 32,
    subheading: 24,
    body: 16,
    caption: 12,
    label: 11,
  },

  colors: {
    primary: "1B2A4A", // Dark navy blue
    secondary: "2D5F8A", // Medium blue
    accent: "C0392B", // Deep red for emphasis
    background: "FFFFFF", // White
    surface: "F5F6F8", // Light gray for cards
    text: {
      primary: "1A1A2E", // Near-black
      secondary: "6C757D", // Medium gray
      inverse: "FFFFFF", // White
    },
    chart: [
      "1B2A4A", // Navy
      "2D5F8A", // Blue
      "C0392B", // Red
      "27AE60", // Green
      "F39C12", // Amber
      "8E44AD", // Purple
      "16A085", // Teal
      "D35400", // Orange
    ],
    divider: "DEE2E6", // Light border
  },

  spacing: {
    margin: { top: 0.5, right: 0.5, bottom: 0.4, left: 0.5 },
    gutterX: 0.25,
    gutterY: 0.25,
    contentTop: 1.3,
  },

  slide: {
    width: 13.33,
    height: 7.5,
    layout: "LAYOUT_WIDE",
  },
};
