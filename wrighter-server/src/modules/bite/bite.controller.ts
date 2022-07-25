import { FastifyReply } from "fastify";
import { FastifyRequest } from "fastify";
import { CreateBiteRequestSchema } from "./bite.schema";
import { createBite, deleteBite, getBites } from "./bite.service";

export const createBiteHandler = async (request: FastifyRequest<{ Body: CreateBiteRequestSchema }>, reply: FastifyReply) => {
  try {
    return await createBite(request.body, request.user.id);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "something bad happened!" });
  }
};

export const deleteBiteHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    if (!request.params.id) {
      return reply.code(400).send({ message: "id is required" });
    }
    return await deleteBite(request.params.id, request.user.id);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "something bad happened!" });
  }
};

export const getBitesHandler = async (
  request: FastifyRequest<{ Querystring: { f: string; t: string } }>,
  reply: FastifyReply
) => {
  try {
    const fromDate = request.query.f;
    const toDate = request.query.t;
    if (!fromDate || !toDate) {
      return reply.code(400).send({ message: "fromDate and toDate are required" });
    }
    const bites = await getBites(fromDate, toDate, request.user.id);
    return bites;
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "something bad happened!" });
  }
};
