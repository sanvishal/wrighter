import { FastifyInstance } from "fastify";
import { getUserHandler, getUsersHandler, loginHandler, registerUserHandler, userLogoutHandler } from "./user.controller";
import { $ref } from "./user.schema";

export default async function userRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: { 201: $ref("createUserResponseSchema") },
      },
    },
    registerUserHandler
  );

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginSchema"),
        response: {
          200: $ref("loginResponseSchema"),
        },
      },
    },
    loginHandler
  );

  server.get("/whoami", { preHandler: server.authenticate }, getUserHandler);

  server.get("/logout", {}, userLogoutHandler);

  server.get(
    "/",
    {
      preHandler: server.authenticate,
    },
    getUsersHandler
  );
}
