/**
 * Agent Orchestrator — coordinates the full pipeline from prompt to PPTX.
 *
 * Flow: Prompt → OutlineAgent → ContentAgent → LayoutAgent → AssemblyEngine → .pptx
 */

import { runOutlineAgent } from "./outline-agent.js";
import { runContentAgent } from "./content-agent.js";
import { runLayoutAgent } from "./layout-agent.js";
import { resolveTemplate, toSlideContent } from "../engine/layout-engine.js";
import { PptxRenderer } from "../engine/pptx-renderer.js";
import type { Theme } from "../design-system/theme.js";
import { consultingTheme } from "../design-system/themes/consulting.js";
import { modernTheme } from "../design-system/themes/modern.js";

export interface GenerateOptions {
  prompt: string;
  theme?: string;
  outputPath?: string;
  verbose?: boolean;
  onProgress?: (stage: string, detail: string) => void;
}

const THEMES: Record<string, Theme> = {
  consulting: consultingTheme,
  modern: modernTheme,
};

export function getAvailableThemes(): string[] {
  return Object.keys(THEMES);
}

export async function generatePresentation(
  opts: GenerateOptions
): Promise<string> {
  const theme = THEMES[opts.theme ?? "consulting"] ?? consultingTheme;
  const progress = opts.onProgress ?? (() => {});
  const outputPath =
    opts.outputPath ?? `output/${sanitizeFilename(opts.prompt)}.pptx`;

  // Step 1: Outline
  progress("outline", "Structuring presentation narrative...");
  const outline = await runOutlineAgent(opts.prompt);
  if (opts.verbose) {
    progress(
      "outline",
      `Planned ${outline.slides.length} slides: "${outline.title}"`
    );
  }

  // Step 2: Content
  progress("content", "Writing slide content...");
  const contentArray = await runContentAgent(outline);
  if (opts.verbose) {
    progress("content", `Generated content for ${contentArray.slides.length} slides`);
  }

  // Step 3: Layout
  progress("layout", "Designing slide layouts...");
  const layoutDecisions = await runLayoutAgent(contentArray);
  if (opts.verbose) {
    const templates = layoutDecisions.slides.map((s) => s.templateId).join(", ");
    progress("layout", `Selected templates: ${templates}`);
  }

  // Step 4: Assembly (pure TypeScript, no LLM)
  progress("assembly", "Assembling presentation...");
  const renderer = new PptxRenderer(theme);
  renderer.setTitle(outline.title);

  const slideCount = Math.min(
    contentArray.slides.length,
    layoutDecisions.slides.length
  );

  for (let i = 0; i < slideCount; i++) {
    const agentContent = contentArray.slides[i];
    const layoutDecision = layoutDecisions.slides[i];

    // Convert agent output to SlideContent
    const slideContent = toSlideContent(agentContent as unknown as Record<string, unknown>);

    // Resolve template (agent decision + fitness fallback)
    const template = resolveTemplate(layoutDecision.templateId, slideContent);

    // Render the slide
    template.render(slideContent, theme, renderer);
  }

  // Save
  progress("save", `Saving to ${outputPath}...`);
  await renderer.save(outputPath);

  return outputPath;
}

function sanitizeFilename(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50)
    .replace(/-+$/, "");
}
