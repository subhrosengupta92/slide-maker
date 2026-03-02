# Slide Maker Architecture

## Core flow
1. Input ingestion (`src/cli.ts`) captures a brief from inline text or a file.
2. Planning (`src/agent/pipeline.ts`) attempts OpenAI planning first and falls back to deterministic planning.
3. Design synthesis (`src/design/designer.ts`) maps strategy sections into slide archetypes.
4. Rendering (`src/render/pptxRenderer.ts`) writes fully editable `.pptx` output via PptxGenJS.

## Why this is agentic
- No drag-and-drop editor is required.
- The system transforms intent into structured slides and a styled output automatically.
- The agent can be upgraded by improving planner prompts, constraints, and template selection policy.

## Design strategy
- Theme tokens control typography, palette, and visual tone.
- Slide archetypes emulate modern narrative patterns: hero, agenda, narrative, comparison, timeline, metrics, quote, closing.
- Output remains editable: every block is native PowerPoint text/shapes.

## Extension points
- Add chart/data primitives mapped from structured JSON.
- Add brand packs (font + color + spacing constraints).
- Add retrieval layer for company context and slide memory.
- Add multi-pass critique loop for layout quality scoring.
