import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { tagResponseArraySchema, TagResponseSchema } from "../tag/tag.schema";

const wright = {
  id: z.string(),
  title: z.string(),
  content: z.string().optional(),
  head: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
  slug: z.string(),
  isPublic: z.boolean(),
  tags: tagResponseArraySchema,
  ogImage: z.string().optional(),
};

const wrightResponseSchema = z.object({
  ...wright,
});

const editWrightRequestSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  head: z.string().optional(),
});

const tagAttachRequestSchema = z.object({
  tagId: z.string(),
});

const wrightSettingRequestSchema = z.object({
  isPublic: z.boolean().optional(),
  slug: z.string().min(5).max(200).optional(),
  ogImage: z.string().min(0).max(250).optional().default(""),
});

const wrightBySlugResponseSchema = z.object({
  ...wright,
  user: z.string(),
});

const wrightResponseArraySchema = z.array(wrightResponseSchema);

export type EditWrightRequestSchema = z.infer<typeof editWrightRequestSchema>;
export type WrightSettingRequestSchema = z.infer<typeof wrightSettingRequestSchema>;

export const { schemas: wrightSchemas, $ref } = buildJsonSchemas(
  {
    wrightResponseSchema,
    wrightResponseArraySchema,
    editWrightRequestSchema,
    tagAttachRequestSchema,
    wrightSettingRequestSchema,
    wrightBySlugResponseSchema,
  },
  { $id: "wrightSchema" }
);
