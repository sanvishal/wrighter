import { FastifyInstance } from "fastify";
import {
  attachTagToWrightHandler,
  changeWrightSettingsHandler,
  createWrightHandler,
  deleteWrightHandler,
  editWrightHandler,
  getAllWrightsHandler,
  getTagsForWrightHandler,
  getWrightBySlugHandler,
  getWrightHandler,
  untagWrightHandler,
} from "./wright.controller";
import { $ref } from "./wright.schema";
import { $ref as $tagRef } from "../tag/tag.schema";

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

  server.put(
    "/:id/settings",
    {
      preHandler: server.authenticate,
    },
    changeWrightSettingsHandler
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

  server.get(
    "/:id/tag",
    {
      preHandler: server.authenticate,
      schema: {
        response: {
          200: $tagRef("tagResponseArraySchema"),
        },
      },
    },
    getTagsForWrightHandler
  );

  server.put(
    "/:id/tag",
    {
      preHandler: server.authenticate,
      schema: {
        body: $ref("tagAttachRequestSchema"),
      },
    },
    attachTagToWrightHandler
  );

  server.delete(
    "/:wrightId/tag/:tagId",
    {
      preHandler: server.authenticate,
    },
    untagWrightHandler
  );

  server.get(
    "/public/:slug",
    {
      schema: {
        response: { 200: $ref("wrightBySlugResponseSchema") },
      },
    },
    getWrightBySlugHandler
  );
}
