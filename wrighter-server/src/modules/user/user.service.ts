import bcrypt from "bcrypt";

import prisma from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};

export const createUser = async (user: CreateUserInput) => {
  const hash = await bcrypt.hash(user.password, 10);

  const userExists = await findUserByEmail(user.email);

  if (userExists) {
    throw { message: "User with same email already exists" };
  }

  const newUser = await prisma.user.create({
    data: {
      ...user,
      password: hash,
    },
  });

  return newUser;
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      email: true,
      name: true,
      id: true,
    },
  });
};
