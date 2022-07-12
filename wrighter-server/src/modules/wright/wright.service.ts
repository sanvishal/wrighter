import { Wright } from "@prisma/client";
import { nanoid } from "nanoid";
import prisma from "../../utils/prisma";
import { EditWrightRequestSchema } from "./wright.schema";

export const createWright = async (userId: string) => {
  const wright = await prisma.wright.create({
    data: {
      userId: userId,
      content: "",
      title: "Give me a title",
      head: "",
      isUnderReview: false,
      id: nanoid(),
    },
  });
  return wright;
};

export const getAllWrights = async (userId: string) => {
  const wrights = await prisma.wright.findMany({ where: { userId } });
  return wrights;
};

export const getWright = async (id: string) => {
  const wright = await prisma.wright.findUnique({ where: { id: id } });
  return wright;
};

export const editWright = async (id: string, wright: EditWrightRequestSchema, userId: string) => {
  const editedWright = await prisma.wright.updateMany({
    where: { id: id, userId: userId },
    data: {
      content: wright?.content,
      title: wright?.title,
      head: wright?.head,
    },
  });
  if (editedWright?.count === 0) {
    return null;
  }
  return editedWright;
};

export const deleteWright = async (id: string, userId: string) => {
  const deletedWright = await prisma.wright.deleteMany({
    where: { id: id, userId: userId },
  });
  if (deletedWright?.count === 0) {
    return null;
  }
  return deletedWright;
};
