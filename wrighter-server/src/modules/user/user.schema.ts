import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const baseUser = {
  email: z
    .string({
      required_error: "Email is required!",
      invalid_type_error: "Invalid email type",
    })
    .email(),
  name: z.string(),
};

const createUserSchema = z.object({
  ...baseUser,
  password: z.string({
    required_error: "Password is required!",
    invalid_type_error: "Invalid Password type",
  }),
});

const createUserResponseSchema = z.object({
  id: z.string(),
  ...baseUser,
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required!",
      invalid_type_error: "Invalid email type",
    })
    .email(),
  password: z.string({
    required_error: "Password is required!",
    invalid_type_error: "Invalid Password type",
  }),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema,
  },
  { $id: "userSchema" }
);
