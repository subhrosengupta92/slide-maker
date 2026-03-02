/**
 * Claude client wrapper — Anthropic SDK with structured output, retry, and model selection.
 */

import Anthropic from "@anthropic-ai/sdk";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { ZodType } from "zod";

export type ModelTier = "fast" | "reasoning";

const MODEL_MAP: Record<ModelTier, string> = {
  fast: "claude-sonnet-4-5-20250514",
  reasoning: "claude-opus-4-0-20250514",
};

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

let clientInstance: Anthropic | null = null;

function getClient(): Anthropic {
  if (!clientInstance) {
    clientInstance = new Anthropic();
  }
  return clientInstance;
}

/**
 * Call Claude with structured output guaranteed by constrained decoding.
 * Returns a parsed, typed result matching the Zod schema.
 */
export async function callClaude<T>(opts: {
  model: ModelTier;
  system: string;
  userMessage: string;
  schema: ZodType<T>;
  schemaName: string;
  maxTokens?: number;
}): Promise<T> {
  const client = getClient();
  const jsonSchema = zodToJsonSchema(opts.schema, opts.schemaName);

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await client.messages.create({
        model: MODEL_MAP[opts.model],
        max_tokens: opts.maxTokens ?? 8192,
        system: opts.system,
        messages: [{ role: "user", content: opts.userMessage }],
        // @ts-expect-error — structured output format not yet in stable types
        response_format: {
          type: "json_schema",
          json_schema: {
            name: opts.schemaName,
            schema: jsonSchema,
          },
        },
      });

      // Extract text content
      const textBlock = response.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("No text block in Claude response");
      }

      // Parse and validate
      const parsed = JSON.parse(textBlock.text);
      return opts.schema.parse(parsed);
    } catch (error) {
      lastError = error as Error;

      // Don't retry on validation errors (schema mismatch)
      if (error instanceof SyntaxError) {
        throw new Error(`JSON parse error from Claude: ${error.message}`);
      }

      // Retry on rate limits and server errors
      const isRetryable =
        lastError.message.includes("rate_limit") ||
        lastError.message.includes("overloaded") ||
        lastError.message.includes("529") ||
        lastError.message.includes("500");

      if (isRetryable && attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        await sleep(delay);
        continue;
      }

      throw lastError;
    }
  }

  throw lastError ?? new Error("callClaude failed after retries");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
