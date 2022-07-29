import { Wright } from "@prisma/client";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz", 22);
import { splitSlug, slugify } from "../../utils/helpers";
import prisma from "../../utils/prisma";
import { EditWrightRequestSchema } from "./wright.schema";

export const createWright = async (userId: string) => {
  const wright = await prisma.wright.create({
    data: {
      userId: userId,
      content: "",
      title: "Give me a title",
      head: "",
      isPublic: false,
      slug: slugify("Give me a title"),
      id: nanoid(),
    },
  });
  return wright;
};

export const getAllWrights = async (userId: string, compact: boolean) => {
  const wrights = await prisma.wright.findMany({
    where: { userId },
    select: {
      tagWrights: { select: { tag: true } },
      id: true,
      content: !compact,
      head: true,
      isPublic: true,
      slug: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      ogImage: true,
    },
  });

  const flattenedWrights = wrights.map((wright) => {
    const { tagWrights, ...rest } = wright;
    const tags = tagWrights.map((tagWright) => tagWright.tag);
    return { ...rest, tags };
  });
  return flattenedWrights;
};

export const getWright = async (id: string, userId: string, compact: boolean) => {
  const wright = await prisma.wright.findUnique({
    where: { id: id },
    select: {
      tagWrights: { select: { tag: true } },
      id: true,
      content: !compact,
      head: true,
      isPublic: true,
      slug: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      ogImage: true,
    },
  });
  if (wright?.userId !== userId && !wright?.isPublic) {
    return null;
  }
  if (wright) {
    const flattenedWright = {
      ...wright,
      tags: wright.tagWrights.map((tagWright) => tagWright.tag),
    };
    return flattenedWright;
  }
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

export const attachTagToWright = async (wrightId: string, tagId: string, userId: string) => {
  const isAlreadyAttached = await prisma.tagWright.findFirst({
    where: { tagId: tagId, wrightId: wrightId, tag: { userId: userId }, wright: { userId: userId } },
  });
  if (isAlreadyAttached) {
    return isAlreadyAttached;
  }
  const isTagExists = await prisma.tag.findFirst({ where: { id: tagId, userId: userId } });
  const isWrightExists = await prisma.wright.findFirst({ where: { id: wrightId, userId: userId } });
  if (!isTagExists && !isWrightExists) {
    throw new Error("404");
  }
  const resp = await prisma.tagWright.create({
    data: {
      tag: { connect: { id: tagId } },
      wright: { connect: { id: wrightId } },
    },
  });
  return resp;
};

export const unTagWright = async (wrightId: string, tagId: string, userId: string) => {
  return await prisma.tagWright.deleteMany({
    where: { tagId: tagId, wrightId: wrightId, tag: { userId: userId }, wright: { userId: userId } },
  });
};

export const getTagsForWright = async (wrightId: string, userId: string) => {
  const tags = await prisma.tagWright.findMany({
    where: { wrightId: wrightId, tag: { userId: userId }, wright: { userId: userId } },
    include: { tag: true },
  });
  const flattenedtags = tags.map((tag) => tag.tag);
  return flattenedtags;
};

export const changeWrightSettings = async (
  wrightId: string,
  userId: string,
  { isPublic, slug, ogImage = "" }: { isPublic?: boolean; slug?: string; ogImage?: string }
) => {
  const wright = await prisma.wright.findFirst({ where: { id: wrightId, userId: userId } });
  if (!wright) {
    return 0;
  }
  const { count } = await prisma.wright.updateMany({
    where: { id: wrightId, userId: userId },
    data: {
      isPublic: isPublic === undefined ? wright.isPublic : isPublic,
      slug: slug?.trim().length === 0 ? slugify(wright.title) : slug,
      ogImage: ogImage.trim() || "",
    },
  });
  return count;
};

export const getWrightBySlug = async (slug: string) => {
  const { wrightId, slug: slugOnly } = splitSlug(slug);
  const wright = await prisma.wright.findFirst({
    where: { slug: slugOnly, id: wrightId },
    include: { tagWrights: { select: { tag: true } }, wrighter: { select: { name: true } } },
  });
  if (!wright) {
    return null;
  }
  if (!wright.isPublic) {
    return null;
  }

  const flattenedWright = {
    ...wright,
    tags: wright.tagWrights.map((tagWright) => tagWright.tag),
    user: wright.wrighter.name,
  };
  return flattenedWright;
};
