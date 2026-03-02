/**
 * Theme interface — the contract for all visual styling.
 * Every template reads from Theme; nothing is hardcoded.
 * All measurements in inches (pptxgenjs native unit).
 * Hex colors WITHOUT '#' prefix (pptxgenjs requirement).
 */

export interface Theme {
  name: string;

  fonts: {
    heading: string; // e.g. "Georgia"
    body: string; // e.g. "Arial"
  };

  fontSizes: {
    title: number; // 44pt — cover slides
    heading: number; // 32pt — section titles, action titles
    subheading: number; // 24pt — subtitles
    body: number; // 16pt — paragraphs, bullets
    caption: number; // 12pt — annotations, footnotes
    label: number; // 11pt — chart labels, metadata
  };

  colors: {
    primary: string; // Hero color (no #)
    secondary: string; // Supporting color
    accent: string; // CTA / highlight
    background: string; // Slide background
    surface: string; // Card/panel background
    text: {
      primary: string; // Main text
      secondary: string; // Muted text
      inverse: string; // Text on dark backgrounds
    };
    chart: string[]; // 6-8 colors for data visualization
    divider: string; // Lines and borders
  };

  spacing: {
    margin: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    gutterX: number; // Horizontal gap between columns
    gutterY: number; // Vertical gap between rows
    contentTop: number; // Where content starts below title bar
  };

  slide: {
    width: number; // 13.33 for LAYOUT_WIDE
    height: number; // 7.5 for LAYOUT_WIDE
    layout: "LAYOUT_WIDE" | "LAYOUT_16x9" | "LAYOUT_16x10";
  };
}

/** Compute usable content area from a theme */
export function contentArea(theme: Theme) {
  const x = theme.spacing.margin.left;
  const y = theme.spacing.contentTop;
  const w =
    theme.slide.width - theme.spacing.margin.left - theme.spacing.margin.right;
  const h = theme.slide.height - y - theme.spacing.margin.bottom;
  return { x, y, w, h };
}

/** Compute title area (above content) */
export function titleArea(theme: Theme) {
  const x = theme.spacing.margin.left;
  const y = theme.spacing.margin.top;
  const w =
    theme.slide.width - theme.spacing.margin.left - theme.spacing.margin.right;
  const h = theme.spacing.contentTop - theme.spacing.margin.top - 0.15; // 0.15" gap before content
  return { x, y, w, h };
}
