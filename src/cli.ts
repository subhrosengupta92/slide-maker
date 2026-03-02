import "dotenv/config";
import { readFile } from "node:fs/promises";
import { Command } from "commander";
import { buildDeck } from "./agent/pipeline.js";
import { themes } from "./design/themes.js";
import { DeckInput, ThemeId } from "./types.js";

async function loadPrompt(options: {
  prompt?: string;
  promptFile?: string;
}): Promise<string> {
  if (options.prompt && options.prompt.trim().length > 0) {
    return options.prompt.trim();
  }

  if (options.promptFile) {
    const text = await readFile(options.promptFile, "utf8");
    if (text.trim().length > 0) {
      return text.trim();
    }
  }

  throw new Error("A prompt is required. Use --prompt or --prompt-file.");
}

const program = new Command();

program
  .name("slide-maker")
  .description("Agentic PPTX deck builder with design-forward templates")
  .version("0.1.0");

program
  .command("themes")
  .description("List available themes")
  .action(() => {
    Object.values(themes).forEach((theme) => {
      console.log(`${theme.id}  -  ${theme.name}`);
    });
  });

program
  .command("build")
  .description("Generate an editable PPTX deck from a prompt")
  .option("-p, --prompt <text>", "natural language brief")
  .option("-f, --prompt-file <path>", "path to a text/markdown brief")
  .option("-o, --out <path>", "output pptx path", "output/deck.pptx")
  .option("--theme <id>", "theme id: aurora | graphite | ember", "aurora")
  .option("--title <title>", "force deck title")
  .option("--audience <audience>", "target audience")
  .option("--purpose <purpose>", "deck purpose")
  .option("--tone <tone>", "executive | investor | marketing | product", "executive")
  .option("--slide-count <count>", "target number of slides", "8")
  .action(async (options) => {
    const prompt = await loadPrompt(options);

    const input: DeckInput = {
      prompt,
      title: options.title,
      audience: options.audience,
      purpose: options.purpose,
      tone: options.tone,
      slideCount: Number(options.slideCount),
      theme: options.theme as ThemeId
    };

    if (!themes[input.theme ?? "aurora"]) {
      throw new Error(`Unknown theme: ${input.theme}`);
    }

    const result = await buildDeck(input, options.out);

    console.log(`Created PPTX: ${result.outputPath}`);
    console.log(`Theme: ${result.deck.meta.theme}`);
    console.log(`Slides: ${result.deck.slides.length}`);
    console.log(`Title: ${result.deck.meta.title}`);
  });

program.parseAsync(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
