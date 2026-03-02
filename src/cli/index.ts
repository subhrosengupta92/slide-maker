#!/usr/bin/env node

/**
 * Slide Maker CLI — entry point.
 */

import "dotenv/config";
import { Command } from "commander";
import { generateCommand } from "./commands/generate.js";
import { themesCommand } from "./commands/themes.js";

const program = new Command();

program
  .name("slide-maker")
  .description(
    "Agentic PPTX slide builder with world-class design capabilities"
  )
  .version("0.1.0");

program
  .command("generate")
  .description("Generate a presentation from a text prompt")
  .argument("<prompt>", "Description of the presentation to create")
  .option("-t, --theme <theme>", "Theme to use (consulting, modern)", "consulting")
  .option("-o, --output <path>", "Output file path")
  .option("-v, --verbose", "Show detailed agent reasoning", false)
  .action(generateCommand);

program
  .command("themes")
  .description("List available themes")
  .action(themesCommand);

program.parse();
