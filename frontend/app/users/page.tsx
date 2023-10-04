"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import EmptyState from "@/components/empty_state";
import useAuthSession from "@/components/hooks/useAuthSession";
import { usersProps } from "./layout";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState<usersProps[]>([]);
  useAuthSession();

  const { isLoading, error, data } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const sessionID = Cookies.get("sessionID");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/users/all`,
        {
          headers: {
            Authorization: `Bearer ${sessionID}`,
          },
        }
      );

      return response;
    },
  });

  return (
    <>
      <div className="lg:block lg:pl-80 h-screen">
        <EmptyState />
      </div>
    </>
  );
};

export default Users;
