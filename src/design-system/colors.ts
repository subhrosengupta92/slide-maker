/**
 * ColorResolver — semantic color application from theme.
 * Ensures consistent color usage across all templates.
 */

import type { Theme } from "./theme.js";

export class ColorResolver {
  constructor(private theme: Theme) {}

  // Backgrounds
  slideBackground(): string {
    return this.theme.colors.background;
  }
  sectionDividerBg(): string {
    return this.theme.colors.primary;
  }
  titleCoverBg(): string {
    return this.theme.colors.primary;
  }
  cardBackground(): string {
    return this.theme.colors.surface;
  }

  // Text
  titleText(): string {
    return this.theme.colors.text.primary;
  }
  bodyText(): string {
    return this.theme.colors.text.primary;
  }
  mutedText(): string {
    return this.theme.colors.text.secondary;
  }
  inverseText(): string {
    return this.theme.colors.text.inverse;
  }

  // Accents
  accentColor(): string {
    return this.theme.colors.accent;
  }
  primaryColor(): string {
    return this.theme.colors.primary;
  }
  secondaryColor(): string {
    return this.theme.colors.secondary;
  }

  // Brand bar
  brandBarColor(): string {
    return this.theme.colors.primary;
  }

  // Dividers
  dividerColor(): string {
    return this.theme.colors.divider;
  }

  // Charts — cycle through chart palette
  chartColor(index: number): string {
    const palette = this.theme.colors.chart;
    return palette[index % palette.length];
  }

  // Get all chart colors
  chartPalette(): string[] {
    return [...this.theme.colors.chart];
  }
}
