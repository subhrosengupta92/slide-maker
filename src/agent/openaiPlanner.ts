import { z } from "zod";
import { DeckInput, DeckPlan, SectionIntention } from "../types.js";

const planSchema = z.object({
  title: z.string().min(3),
  subtitle: z.string().min(3),
  storyline: z.string().min(8),
  agenda: z.array(z.string().min(2)).min(3).max(8),
  sections: z
    .array(
      z.object({
        heading: z.string().min(2),
        intention: z.enum(["explain", "compare", "timeline", "metrics", "quote"] as [SectionIntention, ...SectionIntention[]]),
        points: z.array(z.string().min(2)).min(2).max(6)
      })
    )
    .min(3)
    .max(8),
  closingCta: z.string().min(8)
});

function extractFirstJsonObject(value: string): string | null {
  const firstBrace = value.indexOf("{");
  const lastBrace = value.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
    return null;
  }

  return value.slice(firstBrace, lastBrace + 1);
}

export async function tryBuildOpenAiPlan(input: DeckInput): Promise<DeckPlan | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-5-mini";

  const plannerInstructions = [
    "You are an elite presentation strategist.",
    "Return only JSON matching this shape: {title, subtitle, storyline, agenda, sections, closingCta}.",
    "sections is an array where each element has: heading, intention (one of explain|compare|timeline|metrics|quote), and points array.",
    "Design for editable PPTX decks. Keep text concise and executive-ready."
  ].join(" ");

  const userPrompt = [
    `Prompt: ${input.prompt}`,
    input.title ? `Title override: ${input.title}` : "",
    input.audience ? `Audience: ${input.audience}` : "",
    input.purpose ? `Purpose: ${input.purpose}` : "",
    input.slideCount ? `Target slides: ${input.slideCount}` : "",
    input.tone ? `Tone: ${input.tone}` : ""
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: plannerInstructions }]
        },
        {
          role: "user",
          content: [{ type: "input_text", text: userPrompt }]
        }
      ],
      max_output_tokens: 1400
    })
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { output_text?: string };
  const rawText = payload.output_text;
  if (!rawText) {
    return null;
  }

  const jsonObject = extractFirstJsonObject(rawText);
  if (!jsonObject) {
    return null;
  }

  const parsed = JSON.parse(jsonObject);
  const result = planSchema.safeParse(parsed);
  if (!result.success) {
    return null;
  }

  return result.data;
}
