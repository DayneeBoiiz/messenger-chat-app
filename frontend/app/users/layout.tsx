"use client";

import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import UserList from "./components/UserList";
import { useQuery } from "@tanstack/react-query";
import useAuthSession from "@/components/hooks/useAuthSession";

export interface usersProps {
  currentUser: any;
  id: number;
  createdAt: string;
  updatedAt: string;
  username: string;
  email: string;
  users: any;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<usersProps[]>([]);
  useAuthSession();

  const { isLoading, error, data } = useQuery({
    queryKey: ["getAllUsers"],
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
      setUsers(response.data.users);
      return response;
    },
  });

  return (
    <>
      <div className="h-full">
        {!isLoading && <UserList items={users} />}
        {children}
      </div>
    </>
  );
}
