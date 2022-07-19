import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyReply, FastifyRequest } from "fastify";
import { EditWrightRequestSchema } from "./wright.schema";
import {
  attachTagToWright,
  createWright,
  deleteWright,
  editWright,
  getAllWrights,
  getWright,
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

export const getAllWrightsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const wrights = await getAllWrights(request.user.id);
    return wrights;
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
};

export const getWrightHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    if (!request.params.id) {
      return reply.code(400).send({
        message: "Missing id",
      });
    }
    const wright = await getWright(request.params.id);
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
