import { Tag } from "@prisma/client";
import { nanoid } from "nanoid";
import prisma from "../../utils/prisma";
import { CreateBiteRequestSchema } from "./bite.schema";

export const createBite = async (bite: CreateBiteRequestSchema, userId: string) => {
  const id = nanoid();
  const tagBiteQueries = bite.tags.map((tag) => {
    return prisma.tag.update({
      where: {
        id_userId: {
          id: tag.id,
          userId,
        },
      },
      data: {
        tagBites: {
          create: { biteId: id },
        },
      },
    });
  });

  await prisma.$transaction([
    prisma.bite.create({
      data: {
        id,
        createdAt: bite.createdAt,
        updatedAt: bite.updatedAt,
        title: bite.title,
        content: bite.content,
        type: bite.type,
        createdBy: { connect: { id: userId } },
      },
    }),
    ...tagBiteQueries,
  ]);
  return { id, ...bite };
};

export const deleteBite = async (id: string, userId: string) => {
  const bite = await prisma.bite.findUnique({
    where: { id },
    select: {
      createdBy: true,
    },
  });
  if (bite?.createdBy?.id !== userId) {
    throw new Error("you can't delete this bite");
  }
  await prisma.bite.delete({ where: { id } });
  return { message: "success" };
};

export const getBites = async (fromDate: string, toDate: string, userId: string) => {
  const bites = await prisma.bite.findMany({
    include: { tagBites: { select: { tag: true } } },
    where: {
      createdAt: {
        gte: fromDate,
        lte: toDate,
      },
      createdBy: {
        id: userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const flattenedBites = bites.map((bite) => {
    const { tagBites, ...rest } = bite;
    const tags = tagBites.map((tagBite) => tagBite.tag);
    return { ...rest, tags };
  });
  return flattenedBites;
};
