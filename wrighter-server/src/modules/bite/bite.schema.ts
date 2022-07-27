import { BiteType } from "@prisma/client";
import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";
import { tagResponseSchema } from "../tag/tag.schema";

const createBiteRequestSchema = z.object({
  title: z.string().min(2).max(150),
  content: z.string().min(2).max(900),
  tags: z.array(tagResponseSchema).optional().default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
  type: z.enum([BiteType.IMAGE, BiteType.TEXT, BiteType.LINK]),
});

const biteResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  tags: z.array(tagResponseSchema).optional().default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
  type: z.enum([BiteType.IMAGE, BiteType.TEXT, BiteType.LINK]),
});

const biteResponseSchemaArray = z.array(biteResponseSchema);

export type CreateBiteRequestSchema = z.infer<typeof createBiteRequestSchema>;

export const { schemas: biteSchemas, $ref } = buildJsonSchemas(
  {
    biteResponseSchema,
    createBiteRequestSchema,
    biteResponseSchemaArray,
  },
  { $id: "biteSchema" }
);
