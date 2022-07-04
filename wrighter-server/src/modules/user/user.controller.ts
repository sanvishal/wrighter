import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import { CreateUserInput, LoginUserInput } from "./user.schema";
import { createUser, findUserByEmail, getAllUsers } from "./user.service";
import { fastify } from "../..";

export const registerUserHandler = async (request: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) => {
  const body = request.body;

  try {
    const user = await createUser(body);
    return reply.code(201).send(user);
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
};

export const loginHandler = async (request: FastifyRequest<{ Body: LoginUserInput }>, reply: FastifyReply) => {
  const { email, password } = request.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return reply.code(401).send({
      message: "Invalid email or password!",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (isPasswordCorrect) {
    const { password, ...rest } = user;
    // return {
    //   accessToken: fastify.jwt.sign(rest),
    // };
    const token = fastify.jwt.sign(rest, { expiresIn: 86400 * 2 });
    console.log(token);
    const cd = new Date();
    cd.setSeconds(cd.getSeconds() + 31536000);
    reply
      .setCookie("token", token, {
        domain: "*",
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: true,
        expires: cd,
      })
      .code(200)
      .send("Cookie sent");
  }

  return reply.code(401).send({
    message: "Invalid email or password!",
  });
};

export const getUsersHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await getAllUsers();
    return users;
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
};

export const userLogoutHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  reply.clearCookie("token");
  return reply.code(200).send();
};
