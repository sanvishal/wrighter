import { FastifyReply, FastifyRequest } from "fastify";
import { EditWrightRequestSchema } from "./wright.schema";
import { createWright, deleteWright, editWright, getAllWrights, getWright } from "./wright.service";

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
