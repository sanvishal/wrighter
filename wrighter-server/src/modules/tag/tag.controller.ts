import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTagRequestSchema } from "./tag.schema";
import { createTag, deleteTag, getAllTags } from "./tag.service";

export const createTagHandler = async (request: FastifyRequest<{ Body: CreateTagRequestSchema }>, reply: FastifyReply) => {
  try {
    if (!request.body.name.trim()) {
      return reply.code(400).send({
        error: "tag name cannot be empty",
      });
    }
    return await createTag(request.body.name, request.user.id);
  } catch (e) {
    return reply.code(500).send(e);
  }
};

export const getAllTagsHandler = async (request: FastifyRequest<{ Querystring: { q?: string } }>, reply: FastifyReply) => {
  try {
    return await getAllTags(request.query?.q || "", request.user.id);
  } catch (e) {
    return reply.code(500).send(e);
  }
};

export const deleteTagHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    if (!request.params.id) {
      return reply.code(400).send({
        error: "missing id",
      });
    }
    return await deleteTag(request.params.id, request.user.id);
  } catch (e) {
    return reply.code(500).send(e);
  }
};
