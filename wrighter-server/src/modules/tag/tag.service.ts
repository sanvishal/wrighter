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

export const getAllTags = async (query: string, userId: string) => {
  const tags = await prisma.tag.findMany({
    where: {
      name: {
        contains: query.toLowerCase(),
      },
      createdBy: {
        id: userId,
      },
    },
  });

  return tags;
};

export const deleteTag = async (tagId: string, userId: string) => {
  return await prisma.tag.deleteMany({
    where: {
      id: tagId,
      createdBy: {
        id: userId,
      },
    },
  });
};
