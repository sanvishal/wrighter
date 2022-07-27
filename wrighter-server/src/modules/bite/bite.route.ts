import { FastifyInstance } from "fastify";
import { createBiteHandler, deleteBiteHandler, getBitesHandler } from "./bite.controller";
import { $ref } from "./bite.schema";

export default async function biteRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: server.authenticate,
      schema: {
        body: $ref("createBiteRequestSchema"),
        response: {
          201: $ref("biteResponseSchema"),
        },
      },
    },
    createBiteHandler
  );

  server.delete(
    "/:id",
    {
      preHandler: server.authenticate,
    },
    deleteBiteHandler
  );

  server.get(
    "/",
    {
      preHandler: server.authenticate,
      schema: {
        response: { 200: $ref("biteResponseSchemaArray") },
      },
    },
    getBitesHandler
  );
}
