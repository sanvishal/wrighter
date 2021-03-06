import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyReply, FastifyRequest } from "fastify";
import { EditWrightRequestSchema, WrightSettingRequestSchema } from "./wright.schema";
import {
  attachTagToWright,
  changeWrightSettings,
  createWright,
  deleteWright,
  editWright,
  getAllWrights,
  getTagsForWright,
  getWright,
  getWrightBySlug,
  unTagWright,
} from "./wright.service";

export const createWrightHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const wright = await createWright(request.user.id);
    return wright;
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
};

export const getAllWrightsHandler = async (
  request: FastifyRequest<{ Querystring: { compact?: string } }>,
  reply: FastifyReply
) => {
  try {
    const wrights = await getAllWrights(request.user.id, Boolean(request?.query?.compact));
    return wrights;
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
};

export const getWrightHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Querystring: { compact?: string } }>,
  reply: FastifyReply
) => {
  try {
    if (!request.params.id) {
      return reply.code(400).send({
        message: "Missing id",
      });
    }
    const wright = await getWright(request.params.id, request?.user?.id, Boolean(request?.query?.compact));
    if (!wright) {
      return reply.code(404).send({
        message: "Wright not found",
      });
    }
    return wright;
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
};

export const editWrightHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: EditWrightRequestSchema }>,
  reply: FastifyReply
) => {
  try {
    if (!request.params.id) {
      return reply.code(400).send({
        message: "Missing id",
      });
    }
    const wright = await editWright(request.params.id, request.body, request.user.id);
    if (!wright) {
      return reply.code(500).send({
        message: "Something happened while trying to edit wright!",
      });
    }
    return { message: "success" };
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
};

export const deleteWrightHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    if (!request.params.id) {
      return reply.code(400).send({
        message: "Missing id",
      });
    }
    const wright = await deleteWright(request.params.id, request.user.id);
    if (!wright) {
      return reply.code(404).send({
        message: "Wright not found",
      });
    }
    return { message: "success" };
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
};

export const attachTagToWrightHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: { tagId: string } }>,
  reply: FastifyReply
) => {
  try {
    if (!request.params.id) {
      return reply.code(400).send({
        message: "Missing id",
      });
    }
    await attachTagToWright(request.params.id, request.body.tagId, request.user.id);
    return { message: "success" };
  } catch (e: any) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return reply.code(400).send({
          message: "bad request",
        });
      }
    }
    if (e.message === "404") {
      return reply.code(404).send({
        message: "tag or wright not found",
      });
    }
    return reply.code(500).send(e);
  }
};

export const untagWrightHandler = async (
  request: FastifyRequest<{ Params: { wrightId: string; tagId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { count } = await unTagWright(request.params.wrightId, request.params.tagId, request.user.id);
    if (!count) {
      return reply.code(400).send({
        message: "bad request",
      });
    }
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
};

export const getTagsForWrightHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    if (!request.params.id) {
      return reply.code(400).send({
        message: "missing id",
      });
    }
    const tags = await getTagsForWright(request.params.id, request.user.id);
    return tags;
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
};

export const changeWrightSettingsHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: WrightSettingRequestSchema }>,
  reply: FastifyReply
) => {
  try {
    if (!request.params.id) {
      return reply.code(400).send({
        message: "missing id",
      });
    }
    const isUpdated = await changeWrightSettings(request.params.id, request.user.id, {
      isPublic: request.body.isPublic,
      slug: request.body.slug,
      ogImage: request.body.ogImage,
    });
    if (!isUpdated) {
      return reply.code(400).send({
        message: "bad request",
      });
    }
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
};

export const getWrightBySlugHandler = async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) => {
  try {
    if (!request.params.slug) {
      return reply.code(400).send({
        message: "missing slug",
      });
    }
    const wright = await getWrightBySlug(request.params.slug);
    if (!wright) {
      return reply.code(404).send({
        message: "wright not found",
      });
    }
    return wright;
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
};
