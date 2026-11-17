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
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/projects" }),
  schema: z.object({
    id: z.string().regex(/^[a-z]+(?:-[a-z]+)*$/),
    category: z.enum(["personal", "academic", "practice"]),
    featured: z.boolean(),
    archived: z.boolean().default(false),
    diagram: screen.optional(),
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
          title: bilingual,
          rule: bilingual,
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
