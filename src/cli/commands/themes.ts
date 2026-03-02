/**
 * Themes command — lists available presentation themes.
 */

import chalk from "chalk";
import { getAvailableThemes } from "../../agents/orchestrator.js";

const THEME_DESCRIPTIONS: Record<string, string> = {
  consulting:
    "McKinsey/BCG inspired — dark navy, Georgia headings, clean and authoritative",
  modern:
    "Chronicle HQ inspired — near-black primary, electric blue accents, contemporary",
};

export function themesCommand(): void {
  console.log();
  console.log(chalk.bold("  Available Themes"));
  console.log();

  for (const name of getAvailableThemes()) {
    const desc = THEME_DESCRIPTIONS[name] ?? "";
    console.log(`  ${chalk.cyan(name.padEnd(15))} ${chalk.dim(desc)}`);
  }

  console.log();
  console.log(
    chalk.dim(
      '  Usage: slide-maker generate "your prompt" --theme <theme-name>'
    )
  );
  console.log();
}
