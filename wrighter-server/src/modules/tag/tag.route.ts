import { FastifyInstance } from "fastify";
import { createTagHandler, getAllTagsHandler } from "./tag.controller";
import { $ref } from "./tag.schema";

export default async function tagRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: server.authenticate,
      schema: {
        body: $ref("createTagSchema"),
        response: {
          201: $ref("tagResponseSchema"),
        },
      },
    },
    createTagHandler
  );

  server.get(
    "/",
    {
      preHandler: server.authenticate,
      schema: {
        response: {
          200: $ref("tagResponseArraySchema"),
        },
      },
    },
    getAllTagsHandler
  );
}
