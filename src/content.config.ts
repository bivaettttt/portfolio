import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const bilingual = z.object({ ru: z.string().min(1), en: z.string().min(1) });
const screen = z.object({
  path: z.string().regex(/^(media|artifacts)\/[a-zA-Z0-9/_.-]+$/),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  title: bilingual,
  source: z.url().optional(),
  preview: z.string().optional(),
  original: z.string().optional(),
  originalWidth: z.number().int().positive().optional(),
  originalHeight: z.number().int().positive().optional(),
  originalSha256: z
    .string()
    .regex(/^[a-f0-9]{64}$/)
    .optional(),
  variants: z
    .array(z.object({ path: z.string(), width: z.number().int().positive() }))
    .default([]),
  capture: z
    .object({
      codeSha: z.string().regex(/^[a-f0-9]{40}$/),
      viewport: z.array(z.number().int().positive()).length(2),
      dpr: z.number().positive(),
      date: z.string(),
      evidence: z.string(),
    })
    .optional(),
  caption: bilingual.optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/projects" }),
  schema: z.object({
    id: z.string().regex(/^[a-z]+(?:-[a-z]+)*$/),
    category: z.enum(["personal", "academic", "practice"]),
    featured: z.boolean(),
    archived: z.boolean().default(false),
    diagram: screen.optional(),
    detail: screen.optional(),
    caseNotes: z
      .object({
        trigger: bilingual,
        exception: bilingual,
        tradeoff: bilingual,
        acceptance: bilingual,
      })
      .optional(),
    engineering: z
      .array(
        z.object({
          id: z.enum(["actors", "data", "quality", "exceptions"]),
          text: bilingual,
        }),
      )
      .default([]),
    title: bilingual,
    headline: bilingual,
    description: bilingual,
    context: bilingual,
    model: bilingual,
    decision: bilingual,
    verification: bilingual,
    role: bilingual,
    limits: bilingual,
    flow: z.array(bilingual).min(2),
    screens: z.array(screen),
    repo: z.url().optional(),
    sha: z
      .string()
      .regex(/^[0-9a-f]{40}$/)
      .optional(),
    links: z.array(z.object({ label: bilingual, url: z.string() })),
    video: z.string().optional(),
    requirements: z
      .array(
        z.object({
          id: z.string(),
          retrospective: z.boolean().default(false),
          title: bilingual,
          rule: bilingual,
          condition: bilingual.optional(),
          constraints: bilingual.optional(),
          implementation: z.url().optional(),
          testSource: z.url().optional(),
          check: bilingual,
        }),
      )
      .default([]),
    api: z.array(
      z.object({
        path: z.string(),
        method: z.enum(["GET", "POST", "PATCH", "PUT", "DELETE"]),
        summary: z.string(),
        responses: z.array(z.string()),
      }),
    ),
  }),
});
export const collections = { projects };
