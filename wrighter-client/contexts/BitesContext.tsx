import { useDisclosure } from "@chakra-ui/react";
import { addDays, subDays } from "date-fns";
import { Priority, useRegisterActions } from "kbar";
import { createContext, useContext, useEffect, useState } from "react";
import { TbBulb } from "react-icons/tb";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { CreateBite } from "../components/Bites/CreateBite";
import { getBites, getLastNDaysBites } from "../services/biteService";
import { Bite } from "../types";
import { useUserContext } from "./UserContext";

export const BitesContext = createContext<{
  isCreateBitesOpen: boolean;
  onCreateBiteOpen: (date?: Date) => void;
  onCreateBiteClose: () => void;
  triggerRefresh: boolean;
  isBitesLoading: boolean;
  bites: Bite[];
  addToBitesMemoryContext: (bite: Bite) => void;
  removeFromBitesMemoryContext: (bite: Bite) => void;
}>({
  isCreateBitesOpen: false,
  onCreateBiteOpen: () => {},
  onCreateBiteClose: () => {},
  triggerRefresh: false,
  bites: [],
  isBitesLoading: false,
  addToBitesMemoryContext: () => {},
  removeFromBitesMemoryContext: () => {},
});

export const BitesProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const { isUserLoading, user, isAuth } = useUserContext();
  const [bites, setBites] = useState<Bite[]>([]);

  // const { refetch: refetchBites, isFetching: isBitesLoading } = useQuery(
  //   "getLast7DaysBitesQuery",
  //   () => getLastNDaysBites(!isAuth, 7),
  //   {
  //     refetchOnWindowFocus: false,
  //     enabled: false,
  //   }
  // );

  const { mutate: refetchBites, isLoading: isBitesLoading } = useMutation(
    (guest: boolean) => getBites(guest, subDays(new Date(), 7), addDays(new Date(), 1)),
    {
      onSuccess: (data, isGuest) => {
        console.log({ isGuest, isAuth, data });
        if (isGuest === !isAuth) {
          setBites(data || []);
        }
      },
    }
  );

  // const handleRefetchBites = async () => {
  //   const bites = await refetchBites(isAuth);
  //   console.log("new", bites, isAuth);
  //   setBites(bites || []);
  // };

  useEffect(() => {
    if (!isUserLoading) {
      refetchBites(!isAuth);
    }
  }, [isUserLoading, isAuth]);

  const handleTriggerRefresh = () => {
    setTriggerRefresh(!triggerRefresh);
  };

  const handleCreateBiteOpen = (date?: Date) => {
    setSelectedDate(date || new Date());
    onOpen();
  };

  // useEffect(() => {
  //   onOpen();
  // }, [selectedDate]);

  const addToBitesMemoryContext = (bite: Bite) => {
    if (bites.find((b) => b.id === bite.id)) {
      return;
    }
    setBites([...bites, bite]);
  };

  const removeFromBitesMemoryContext = (bite: Bite) => {
    setBites(bites.filter((b) => b.id !== bite.id));
  };

  return (
    <BitesContext.Provider
      value={{
        isCreateBitesOpen: isOpen,
        onCreateBiteOpen: handleCreateBiteOpen,
        onCreateBiteClose: onClose,
        triggerRefresh,
        bites: bites || [],
        isBitesLoading,
        addToBitesMemoryContext,
        removeFromBitesMemoryContext,
      }}
    >
      {children}
      <CreateBite isOpen={isOpen} onClose={onClose} date={selectedDate} triggerRefresh={handleTriggerRefresh} />
    </BitesContext.Provider>
  );
};

export const useBitesContext = () => {
  return useContext(BitesContext);
};
