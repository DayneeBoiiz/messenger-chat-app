"use client";

import ConversationList from "./components/ConversationList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { FullConversationType } from "../types/index";
import { usersProps } from "../users/layout";
import { toast } from "react-toastify";

export default function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [item, setItem] = useState<FullConversationType[]>([]);
  const [users, setUsers] = useState<usersProps[]>([]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["AllMessages"],
    queryFn: async () => {
      const sessionID = Cookies.get("sessionID");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/conversations/getconversation`,
        {
          headers: {
            Authorization: `Bearer ${sessionID}`,
          },
        }
      );
      setItem(response.data);
      return response;
    },
  });

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/users/all`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("sessionID")}`,
        },
      })
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
  }, []);

  return (
    <>
      <div className="h-full">
        <ConversationList users={users} initialItems={item} />
        {children}
      </div>
    </>
  );
}
