import Fastify from "fastify";
import cors from "cors";
import frameguard from "frameguard";
import xXssProtection from "x-xss-protection";
import fastifyJWT, { JWT } from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import userRoutes from "./modules/user/user.route";
import wrightRoutes from "./modules/wright/wright.route";
import { userSchemas } from "./modules/user/user.schema";
import { FastifyRequest } from "fastify";
import { FastifyReply } from "fastify";
import { wrightSchemas } from "./modules/wright/wright.schema";
import tagRoutes from "./modules/tag/tag.route";
import { tagSchemas } from "./modules/tag/tag.schema";
import biteRoutes from "./modules/bite/bite.route";
import { biteSchemas } from "./modules/bite/bite.schema";

export const fastify = Fastify({
  logger: process.env.NODE_ENV === "development",
});

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      email: string;
      id: string;
      name: string;
    };
  }
}

async function build() {
  fastify.get("/ping", async (request, reply) => {
    return "pong\n";
  });

  await fastify.register(require("@fastify/middie"));

  await fastify.register(fastifyCookie, { secret: process.env.COOKIE_SECRET! });

  await fastify.register(fastifyJWT, {
    secret: process.env.SECRET_KEY!,
    cookie: {
      cookieName: "token",
      // unsigned cookie for now
      signed: false,
    },
    verify: {
      maxAge: 86400 * 2,
    },
    messages: {
      noAuthorizationInCookieMessage: "You are not authorized to access",
      authorizationTokenExpiredMessage: "You are not authorized to access",
      authorizationTokenInvalid: "You are not authorized to access",
      authorizationTokenUntrusted: "You are not authorized to access",
    },
  });

  // @ts-ignore
  fastify.use(
    cors({
      origin: ["http://localhost:3000", "http://127.0.0.1:3000", "https://wrighter.vercel.app"],
      credentials: true,
      exposedHeaders: ["set-cookie"],
    })
  );
  // @ts-ignore
  fastify.use(frameguard());
  // @ts-ignore
  fastify.use(xXssProtection());

  fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (e) {
      // console.log(e);
      await reply.code(401).send(e);
    }
  });

  fastify.addHook("preHandler", (req, reply, next) => {
    req.jwt = fastify.jwt;
    return next();
  });

  return fastify;
}

build()
  .then((fastify) => {
    for (const schema of [...userSchemas, ...wrightSchemas, ...tagSchemas, ...biteSchemas]) {
      fastify.addSchema(schema);
    }

    fastify.register(userRoutes, {
      prefix: "api/user",
    });
    fastify.register(wrightRoutes, {
      prefix: "api/wright",
    });
    fastify.register(tagRoutes, {
      prefix: "api/tag",
    });
    fastify.register(biteRoutes, {
      prefix: "api/bite",
    });

    const port = +process.env.PORT! || 8080;
    fastify.listen({ port: port, host: "0.0.0.0" }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log("port: ", port);
      console.log(`⚡ Server listening at ${address}`);
    });
  })
  .catch((e) => console.error(e));
