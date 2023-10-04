import { FullConversationType } from "@/app/types";
import { User } from "@/app/types/prismaTypes";
import { useMemo } from "react";
import useCurrentUser from "./useCurrentUser";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useOtherUser = (conversation: FullConversationType) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [`${conversation.uid}/otheruser`],
    queryFn: async () => {
      const sessionID = Cookies.get("sessionID");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/conversations/${conversation.uid}/otherUser/`,
        {
          headers: {
            Authorization: `Bearer ${sessionID}`,
          },
        }
      );
      return response;
    },
  });
  const otherUser = data?.data;
  return otherUser;
};

export default useOtherUser;
