import { chunkArray, extractBulletLines, splitSentences, toTitleCase, truncate } from "../utils/text.js";
import { DeckInput, DeckPlan, PlanSection, SectionIntention } from "../types.js";

const intentionOrder: SectionIntention[] = [
  "explain",
  "compare",
  "timeline",
  "metrics",
  "explain"
];

function inferTitle(input: DeckInput, sentences: string[]): string {
  if (input.title) {
    return input.title;
  }

  if (sentences.length === 0) {
    return "Strategic Brief";
  }

  const first = sentences[0]
    .replace(/[.!?]+$/, "")
    .split(/\s+/)
    .slice(0, 7)
    .join(" ");

  return toTitleCase(first);
}

function inferAgendaPoints(prompt: string, sentences: string[]): string[] {
  const bullets = extractBulletLines(prompt);
  if (bullets.length >= 3) {
    return bullets.slice(0, 6).map((b) => truncate(b, 52));
  }

  return sentences
    .slice(1)
    .slice(0, 6)
    .map((s) => truncate(s.replace(/[.!?]+$/, ""), 52));
}

function toSectionHeading(raw: string, index: number): string {
  const stem = raw
    .replace(/[.!?]+$/, "")
    .split(/[:;,]/)[0]
    .split(/\s+/)
    .slice(0, 5)
    .join(" ");

  if (!stem) {
    return `Section ${index + 1}`;
  }

  return toTitleCase(stem);
}

function inferSections(input: DeckInput, points: string[]): PlanSection[] {
  const requestedSlides = input.slideCount ?? 8;
  const sectionCount = Math.max(3, Math.min(8, requestedSlides - 3));
  const normalizedPoints = points.length > 0 ? points : ["Situation", "Opportunity", "Execution"]; 
  const chunkSize = Math.max(1, Math.ceil(normalizedPoints.length / sectionCount));
  const chunks = chunkArray(normalizedPoints, chunkSize).slice(0, sectionCount);

  while (chunks.length < 3) {
    chunks.push([`Priority ${chunks.length + 1}`]);
  }

  return chunks.map((chunk, index) => {
    const heading = toSectionHeading(chunk[0] ?? "", index);
    const intention = intentionOrder[index % intentionOrder.length];

    return {
      heading,
      intention,
      points: chunk.map((point) => truncate(point, 96))
    };
  });
}

export function buildHeuristicPlan(input: DeckInput): DeckPlan {
  const sentences = splitSentences(input.prompt);
  const title = inferTitle(input, sentences);
  const subtitle = input.audience
    ? `For ${input.audience}`
    : "AI-generated narrative deck";

  const storyline = sentences[0] ?? "A clear and compelling story.";
  const agenda = inferAgendaPoints(input.prompt, sentences);
  const normalizedAgenda = [...agenda];
  while (normalizedAgenda.length < 3) {
    normalizedAgenda.push(`Priority ${normalizedAgenda.length + 1}`);
  }

  const candidatePoints = [
    ...extractBulletLines(input.prompt),
    ...sentences.slice(1)
  ].filter(Boolean);

  const sections = inferSections(input, candidatePoints);

  return {
    title,
    subtitle,
    storyline,
    agenda:
      normalizedAgenda.length > 0
        ? normalizedAgenda
        : sections.map((section) => section.heading),
    sections,
    closingCta: input.purpose
      ? `Align on ${input.purpose} and launch execution this week.`
      : "Align on ownership, timeline, and first execution sprint."
  };
}
