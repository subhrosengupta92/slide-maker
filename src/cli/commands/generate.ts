/**
 * Generate command — creates a presentation from a text prompt.
 */

import ora from "ora";
import chalk from "chalk";
import { generatePresentation, getAvailableThemes } from "../../agents/orchestrator.js";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

interface GenerateFlags {
  theme: string;
  output?: string;
  verbose: boolean;
}

export async function generateCommand(
  prompt: string,
  flags: GenerateFlags
): Promise<void> {
  // Validate API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      chalk.red(
        "Error: ANTHROPIC_API_KEY not set. Copy .env.example to .env and add your key."
      )
    );
    process.exit(1);
  }

  // Validate theme
  const availableThemes = getAvailableThemes();
  if (!availableThemes.includes(flags.theme)) {
    console.error(
      chalk.red(
        `Error: Unknown theme "${flags.theme}". Available: ${availableThemes.join(", ")}`
      )
    );
    process.exit(1);
  }

  console.log();
  console.log(chalk.bold("  Slide Maker v0.1.0"));
  console.log();
  console.log(chalk.dim(`  Theme: ${flags.theme}`));
  console.log(chalk.dim(`  Prompt: "${prompt.slice(0, 80)}${prompt.length > 80 ? "..." : ""}"`));
  console.log();

  const spinner = ora({ text: "Starting...", color: "cyan" }).start();

  const stageEmoji: Record<string, string> = {
    outline: "1/4",
    content: "2/4",
    layout: "3/4",
    assembly: "4/4",
    save: "4/4",
  };

  try {
    // Ensure output directory exists
    const outputPath = flags.output ?? undefined;
    if (outputPath) {
      await mkdir(dirname(outputPath), { recursive: true });
    } else {
      await mkdir("output", { recursive: true });
    }

    const result = await generatePresentation({
      prompt,
      theme: flags.theme,
      outputPath,
      verbose: flags.verbose,
      onProgress: (stage, detail) => {
        const prefix = stageEmoji[stage] ?? "";
        spinner.text = `[${prefix}] ${detail}`;
        if (flags.verbose) {
          spinner.info(`[${prefix}] ${detail}`);
          spinner.start();
        }
      },
    });

    spinner.succeed(chalk.green(`Created: ${result}`));
    console.log();
    console.log(
      chalk.dim(
        "  Open in PowerPoint, Keynote, or Google Slides to edit."
      )
    );
    console.log();
  } catch (error) {
    spinner.fail(chalk.red("Failed to generate presentation"));
    console.error();
    if (error instanceof Error) {
      console.error(chalk.red(`  ${error.message}`));
      if (flags.verbose && error.stack) {
        console.error(chalk.dim(error.stack));
      }
    }
    process.exit(1);
  }
}
