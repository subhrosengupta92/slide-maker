/**
 * PptxRenderer — adapter between our type system and pptxgenjs.
 *
 * CRITICAL: Always clone option objects before passing to pptxgenjs.
 * pptxgenjs mutates options in-place.
 *
 * CRITICAL: Hex colors WITHOUT '#' prefix.
 */

import PptxGenJS from "pptxgenjs";
import type { Theme } from "../design-system/theme.js";

// pptxgenjs uses `export as namespace` which makes its types awkward in ESM.
// We use `any` for the slide type since all calls go through our typed wrapper methods.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Slide = any;

export interface TextPropItem {
  text: string;
  options?: Record<string, unknown>;
}

export type TextProps = TextPropItem;

export interface TextOptions {
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize?: number;
  fontFace?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: "left" | "center" | "right" | "justify";
  valign?: "top" | "middle" | "bottom";
  lineSpacingMultiple?: number;
  margin?: number | [number, number, number, number];
  fit?: "none" | "shrink" | "resize";
  breakLine?: boolean;
  paraSpaceBefore?: number;
  paraSpaceAfter?: number;
  bullet?: boolean | { type?: string; code?: string };
  indentLevel?: number;
  hyperlink?: { url: string };
}

export interface ShapeOptions {
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: { color: string; transparency?: number };
  line?: { color: string; width: number };
  rectRadius?: number;
  shadow?: {
    type: "outer" | "inner";
    color: string;
    blur: number;
    offset: number;
    angle: number;
    opacity: number;
  };
}

export interface ImageOptions {
  x: number;
  y: number;
  w: number;
  h: number;
  path?: string;
  data?: string; // base64
  sizing?: {
    type: "cover" | "contain" | "crop";
    w: number;
    h: number;
  };
  rounding?: boolean;
}

export interface ChartData {
  name: string;
  labels: string[];
  values: number[];
}

export interface ChartOptions {
  x: number;
  y: number;
  w: number;
  h: number;
  showLegend?: boolean;
  legendPos?: "b" | "r" | "t" | "l";
  showTitle?: boolean;
  title?: string;
  titleFontSize?: number;
  showDataLabels?: boolean;
  dataLabelPosition?:
    | "bestFit"
    | "outEnd"
    | "inEnd"
    | "ctr"
    | "inBase"
    | "l"
    | "r"
    | "t"
    | "b";
  dataLabelFontSize?: number;
  catAxisLabelFontSize?: number;
  valAxisLabelFontSize?: number;
  showCatAxisTitle?: boolean;
  showValAxisTitle?: boolean;
  catAxisOrientation?: "minMax" | "maxMin";
  valGridLine?: { style: "none" | "solid" | "dash"; color: string };
  chartColors?: string[];
  barGapWidthPct?: number;
}

export type ChartType =
  | "bar"
  | "bar3D"
  | "line"
  | "pie"
  | "doughnut"
  | "area"
  | "scatter";

export type TableRow = Array<{ text: string; options?: Record<string, unknown> }>;

export class PptxRenderer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pptx: any;
  private theme: Theme;

  constructor(theme: Theme) {
    // pptxgenjs default export is the class constructor
    // @ts-expect-error — pptxgenjs types are a namespace, not a proper class export
    this.pptx = new PptxGenJS();
    this.theme = theme;

    // Configure presentation
    this.pptx.layout = theme.slide.layout;
    this.pptx.author = "Slide Maker";
    this.pptx.company = "";
    this.pptx.subject = "";

    // Define master slides
    this.defineMasterSlides();
  }

  private defineMasterSlides(): void {
    const t = this.theme;

    // MASTER_CONTENT: brand bar at top, slide number at bottom-right
    this.pptx.defineSlideMaster({
      title: "MASTER_CONTENT",
      background: { fill: t.colors.background },
      objects: [
        {
          rect: {
            x: 0,
            y: 0,
            w: t.slide.width,
            h: 0.04,
            fill: { color: t.colors.primary },
          },
        },
      ],
      slideNumber: {
        x: t.slide.width - 0.8,
        y: t.slide.height - 0.35,
        w: 0.5,
        h: 0.25,
        fontSize: t.fontSizes.label,
        fontFace: t.fonts.body,
        color: t.colors.text.secondary,
        align: "right",
      },
    });

    // MASTER_TITLE: clean, no decorations
    this.pptx.defineSlideMaster({
      title: "MASTER_TITLE",
      background: { fill: t.colors.background },
    });

    // MASTER_DARK: dark background for section dividers
    this.pptx.defineSlideMaster({
      title: "MASTER_DARK",
      background: { fill: t.colors.primary },
    });
  }

  /** Add a new slide using a master */
  addSlide(
    masterName: "MASTER_CONTENT" | "MASTER_TITLE" | "MASTER_DARK"
  ): Slide {
    return this.pptx.addSlide({ masterName });
  }

  /** Add text to a slide. Clones options to prevent mutation. */
  addText(
    slide: Slide,
    text: string | TextProps[],
    opts: TextOptions
  ): void {
    (slide as Record<string, CallableFunction>).addText(text, { ...opts });
  }

  /** Add a rectangle shape. Clones options. */
  addRect(slide: Slide, opts: ShapeOptions): void {
    (slide as Record<string, CallableFunction>).addShape("rect", { ...opts });
  }

  /** Add a rounded rectangle. Clones options. */
  addRoundRect(slide: Slide, opts: ShapeOptions & { rectRadius: number }): void {
    (slide as Record<string, CallableFunction>).addShape("roundRect", { ...opts });
  }

  /** Add a line. */
  addLine(
    slide: Slide,
    opts: { x: number; y: number; w: number; h: number; line: { color: string; width: number } }
  ): void {
    (slide as Record<string, CallableFunction>).addShape("line", { ...opts });
  }

  /** Add an image. Clones options. */
  addImage(slide: Slide, opts: ImageOptions): void {
    (slide as Record<string, CallableFunction>).addImage({ ...opts });
  }

  /** Add a placeholder rectangle (for images not yet available) */
  addImagePlaceholder(
    slide: Slide,
    opts: { x: number; y: number; w: number; h: number; label?: string }
  ): void {
    const t = this.theme;
    this.addRect(slide, {
      x: opts.x,
      y: opts.y,
      w: opts.w,
      h: opts.h,
      fill: { color: t.colors.surface },
    });
    this.addText(slide, opts.label || "[Image]", {
      x: opts.x,
      y: opts.y,
      w: opts.w,
      h: opts.h,
      fontSize: t.fontSizes.caption,
      fontFace: t.fonts.body,
      color: t.colors.text.secondary,
      align: "center",
      valign: "middle",
    });
  }

  /** Add a chart. Clones options. */
  addChart(
    slide: Slide,
    type: ChartType,
    data: ChartData[],
    opts: ChartOptions
  ): void {
    const pptxChartType = this.mapChartType(type);
    const chartOpts: Record<string, unknown> = { ...opts };

    if (!opts.chartColors) {
      chartOpts.chartColors = this.theme.colors.chart;
    }

    (slide as Record<string, CallableFunction>).addChart(
      pptxChartType,
      data,
      chartOpts
    );
  }

  /** Add a table */
  addTable(
    slide: Slide,
    rows: TableRow[],
    opts: {
      x: number;
      y: number;
      w: number;
      h?: number;
      fontSize?: number;
      fontFace?: string;
      color?: string;
      border?: { type: string; pt: number; color: string };
      colW?: number[];
      rowH?: number[];
      autoPage?: boolean;
    }
  ): void {
    (slide as Record<string, CallableFunction>).addTable(rows, { ...opts });
  }

  /** Add speaker notes to a slide */
  addNotes(slide: Slide, notes: string): void {
    (slide as Record<string, CallableFunction>).addNotes(notes);
  }

  /** Set the presentation title */
  setTitle(title: string): void {
    this.pptx.title = title;
  }

  private mapChartType(type: ChartType): string {
    // pptxgenjs ChartType enum values are just the string names
    const map: Record<ChartType, string> = {
      bar: this.pptx.ChartType.bar,
      bar3D: this.pptx.ChartType.bar3D,
      line: this.pptx.ChartType.line,
      pie: this.pptx.ChartType.pie,
      doughnut: this.pptx.ChartType.doughnut,
      area: this.pptx.ChartType.area,
      scatter: this.pptx.ChartType.scatter,
    };
    return map[type];
  }

  /** Save the presentation to a file */
  async save(filePath: string): Promise<void> {
    await this.pptx.writeFile({ fileName: filePath });
  }

  /** Get the presentation as a Buffer (for programmatic use) */
  async toBuffer(): Promise<Buffer> {
    const output = await this.pptx.write({ outputType: "nodebuffer" });
    return output as Buffer;
  }
}
