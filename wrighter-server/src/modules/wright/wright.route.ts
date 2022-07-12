import { FastifyInstance } from "fastify";
import {
  createWrightHandler,
  deleteWrightHandler,
  editWrightHandler,
  getAllWrightsHandler,
  getWrightHandler,
} from "./wright.controller";
import { $ref } from "./wright.schema";

export default async function wrightRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: server.authenticate,
      schema: {
        response: {
          201: $ref("wrightResponseSchema"),
        },
      },
    },
    createWrightHandler
  );

  server.get(
    "/",
    {
      preHandler: server.authenticate,
      schema: {
        response: {
          200: $ref("wrightResponseArraySchema"),
        },
      },
    },
    getAllWrightsHandler
  );

  server.put(
    "/:id",
    {
      preHandler: server.authenticate,
      schema: {
        body: $ref("editWrightRequestSchema"),
      },
    },
    editWrightHandler
  );

  server.get(
    "/:id",
    {
      preHandler: server.authenticate,
      schema: {
        response: {
          200: $ref("wrightResponseSchema"),
        },
      },
    },
    getWrightHandler
  );

  server.delete(
    "/:id",
    {
      preHandler: server.authenticate,
    },
    deleteWrightHandler
  );
}
