import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const wrightResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
  isUnderReview: z.boolean(),
});

const editWrightRequestSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  head: z.string().optional(),
});

const wrightResponseArraySchema = z.array(wrightResponseSchema);

export type EditWrightRequestSchema = z.infer<typeof editWrightRequestSchema>;

export const { schemas: wrightSchemas, $ref } = buildJsonSchemas(
  {
    wrightResponseSchema,
    wrightResponseArraySchema,
    editWrightRequestSchema,
  },
  { $id: "wrightSchema" }
);
