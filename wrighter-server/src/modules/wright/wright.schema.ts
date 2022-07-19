import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { tagResponseArraySchema, TagResponseSchema } from "../tag/tag.schema";

const wrightResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  head: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
  isUnderReview: z.boolean(),
  tags: tagResponseArraySchema,
});

const editWrightRequestSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  head: z.string().optional(),
});

const tagAttachRequestSchema = z.object({
  tagId: z.string(),
});

const wrightResponseArraySchema = z.array(wrightResponseSchema);

export type EditWrightRequestSchema = z.infer<typeof editWrightRequestSchema>;

export const { schemas: wrightSchemas, $ref } = buildJsonSchemas(
  {
    wrightResponseSchema,
    wrightResponseArraySchema,
    editWrightRequestSchema,
    tagAttachRequestSchema,
  },
  { $id: "wrightSchema" }
);
