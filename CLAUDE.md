# Slide Maker

Agentic PPTX slide builder. User provides a text prompt → AI agents structure, write, and design → outputs a world-class .pptx file.

## Stack
- Node.js 22+ / TypeScript 5.x (strict, ESM)
- pptxgenjs v4 for PPTX generation
- @anthropic-ai/sdk for Claude API (Sonnet 4.5 for content, Opus 4.6 for layout)
- zod for schema validation
- commander + chalk + ora for CLI

## Architecture
```
CLI → AgentOrchestrator → OutlineAgent → ContentAgent → LayoutAgent → AssemblyEngine → .pptx
```
AssemblyEngine is pure TypeScript (no LLM). It uses DesignSystem + TemplateLibrary + PptxRenderer.

## Key Conventions
- All pptxgenjs measurements in inches (native unit)
- Hex colors WITHOUT `#` prefix (pptxgenjs requirement)
- ALWAYS clone option objects before passing to pptxgenjs (it mutates in-place)
- LAYOUT_WIDE (13.33" × 7.5") as default slide size
- Safe fonts only: Arial, Calibri, Georgia, Trebuchet MS
- Agent I/O uses Zod schemas → auto-converted to JSON Schema for Claude structured output
- Templates never hardcode colors/fonts — everything comes from Theme object

## Commands
- `pnpm dev generate "prompt"` — generate a presentation
- `pnpm dev generate "prompt" --theme modern --output ./my-deck.pptx`
- `pnpm dev themes` — list available themes
- `pnpm build` — compile TypeScript
- `pnpm test` — run tests
