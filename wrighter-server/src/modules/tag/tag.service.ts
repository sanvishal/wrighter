import { nanoid } from "nanoid";
import prisma from "../../utils/prisma";

export const createTag = async (tagName: string, userId: string) => {
  const tagAlreadyExists = await prisma.tag.findFirst({
    where: {
      name: tagName,
    },
  });
  if (tagAlreadyExists) {
    return tagAlreadyExists;
  }
  const newTag = await prisma.tag.create({
    data: {
      id: nanoid(),
      name: tagName,
      createdBy: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return newTag;
};

export const getAllTags = async (userId: string) => {
  const tags = await prisma.tag.findMany({
    where: {
      createdBy: {
        id: userId,
      },
    },
  });

  return tags;
};
