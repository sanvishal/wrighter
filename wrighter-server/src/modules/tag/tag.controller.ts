import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTagRequestSchema } from "./tag.schema";
import { createTag, getAllTags } from "./tag.service";

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

export const getAllTagsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    return await getAllTags(request.user.id);
  } catch (e) {
    return reply.code(500).send(e);
  }
};
