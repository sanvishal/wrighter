import { createContext, useContext, useEffect, useState } from "react";
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
  const { isAuth, isUserLoading } = useUserContext();

  const { refetch: fetchAllTagsRequest, isFetching: isTagsLoading } = useQuery(
    ["getAllTagsQuery", !isAuth],
    () => getAllTags(!isAuth),
    { enabled: false, refetchOnWindowFocus: false }
  );

  const fetchTags = async () => {
    const { data: tags } = await fetchAllTagsRequest();
    setTags(tags || []);
    return tags || [];
  };

  useEffect(() => {
    if (!isUserLoading) {
      fetchTags();
    }
  }, [isUserLoading, isAuth]);

  return <TagsContext.Provider value={{ tags, isTagsLoading, fetchTags }}>{children}</TagsContext.Provider>;
};

export const useTagsContext = () => {
  return useContext(TagsContext);
};
