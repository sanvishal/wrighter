import { createContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { db } from "../services/dbService";
import { createTag, getAllTags } from "../services/tagService";
import { Tag } from "../types";
import { useUserContext } from "./UserContext";

export const TagsContext = createContext<{
  tags: Tag[];
  fetchTags?: () => Promise<Tag[]>;
  isTagsLoading: boolean;
}>({
  tags: [],
  isTagsLoading: false,
});

export const TagsProvider = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const { isAuthenticated, isUserLoading } = useUserContext();

  const { refetch: fetchAllTagsRequest, isFetching: isTagsLoading } = useQuery(
    "getAllTagsQuery",
    () => getAllTags(!isAuthenticated()),
    { enabled: false, refetchOnWindowFocus: false }
  );

  const fetchTags = async () => {
    const { data: tags } = await fetchAllTagsRequest();
    if (tags && tags.length > 0) {
      setTags(tags);
    }
    return tags || [];
  };

  useEffect(() => {
    if (!isUserLoading) {
      fetchTags();
    }
  }, [isUserLoading]);

  return <TagsContext.Provider value={{ tags, isTagsLoading, fetchTags }}>{children}</TagsContext.Provider>;
};
