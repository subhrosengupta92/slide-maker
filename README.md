# Slide Maker

Agentic presentation builder that turns natural-language briefs into high-design, fully editable PowerPoint decks.

## Product direction
Slide Maker targets the quality bar of modern narrative tools while keeping one critical capability: output is a native `.pptx` file you can edit in PowerPoint.

## Features in this starter
- Prompt to deck generation (`slide-maker build`).
- Design-forward themes inspired by premium narrative layouts.
- Slide archetype system: title, agenda, narrative, comparison, timeline, metrics, quote, closing.
- Optional OpenAI planning (`OPENAI_API_KEY`) with deterministic fallback.
- Fully editable PPTX output (native text boxes and vector shapes).

## Quick start
```bash
npm install
npm run build
npm run generate -- --prompt-file examples/product-launch-brief.md --out output/slide-maker-demo.pptx --theme aurora
```

## CLI usage
```bash
# List themes
npm run dev -- themes

# Generate from inline prompt
npm run dev -- build \
  --prompt "Build a 10-slide executive deck about product-led growth for enterprise" \
  --audience "Executive Leadership Team" \
  --purpose "approve Q2 plan" \
  --out output/q2-growth-deck.pptx \
  --theme graphite
```

### Key options
- `--prompt` or `--prompt-file`: deck brief.
- `--out`: output path.
- `--theme`: `aurora`, `graphite`, `ember`.
- `--slide-count`: target slide count.
- `--title`: force a custom title.

## Environment variables
Use `.env` (see `.env.example`):
- `OPENAI_API_KEY` to enable LLM planning.
- `OPENAI_MODEL` defaults to `gpt-5-mini`.

## Architecture docs
- `docs/architecture.md`
- `docs/roadmap.md`

## Next build priorities
1. Brand-pack ingestion and strict design constraints.
2. Data-aware chart generation into editable PPTX charts.
3. Multi-pass critique loop for world-class layout quality.
