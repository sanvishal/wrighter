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
    const cd = new Date();
    cd.setSeconds(cd.getSeconds() + 86400 * 2);
    reply
      .setCookie("token", token, {
        // domain: "*",
        path: "/",
        secure: process.env.NODE_ENV !== "development",
        httpOnly: true,
        sameSite: true,
        maxAge: 86400 * 2,
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

export const getUserHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = await findUserByEmail(request.user.email);
    if (!user) {
      return reply.code(401).send({
        message: "You are not authorized",
      });
    }
    return { id: user.id, email: user.email, name: user.name };
  } catch (e) {
    console.error(e);
    return reply.code(401).send(e);
  }
};

export const userLogoutHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  reply.setCookie("token", "", {
    // domain: "*",
    path: "/",
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    sameSite: true,
    maxAge: -1,
  });
  return reply.code(200).send();
};
