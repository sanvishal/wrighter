import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const createTagSchema = z.object({
  name: z.string().min(3).max(35),
});

const tagResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().optional(),
});

export const tagResponseArraySchema = z.array(tagResponseSchema);

export type CreateTagRequestSchema = z.infer<typeof createTagSchema>;
export type TagResponseSchema = z.infer<typeof tagResponseSchema>;

export const { schemas: tagSchemas, $ref } = buildJsonSchemas(
  {
    createTagSchema,
    tagResponseArraySchema,
    tagResponseSchema,
  },
  { $id: "tagSchema" }
);
