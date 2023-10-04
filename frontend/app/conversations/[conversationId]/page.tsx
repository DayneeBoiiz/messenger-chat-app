"use client";

import { FullMessageType } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Body from "../components/Body";
import Form from "../components/Form";
import { Skeleton } from "@/components/ui/skeleton";

interface IParams {
  conversationId: string;
}

const SkeletonLoader = () => {
  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-96 my-4" />
        <Skeleton className="h-14" />
      </div>
    </div>
  );
};

const ConversationId = ({ params }: { params: IParams }) => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState<FullMessageType[]>([]);

  const conversationQuery = useQuery({
    queryKey: ["conversation", params.conversationId],
    queryFn: async () => {
      const sessionID = Cookies.get("sessionID");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/conversations/${params.conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionID}`,
          },
        }
      );
      return response.data;
    },
  });

  const messagesQuery = useQuery({
    queryKey: ["messages", params.conversationId],
    queryFn: async () => {
      const sessionID = Cookies.get("sessionID");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/conversations/${params.conversationId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${sessionID}`,
          },
        }
      );
      return response.data;
    },
  });

  useEffect(() => {
    if (conversationQuery.data) {
      setConversation(conversationQuery.data);
    }
  }, [conversationQuery.data]);

  useEffect(() => {
    if (messagesQuery.data) {
      setMessages(messagesQuery.data);
    }
  }, [messagesQuery.data]);

  if (conversationQuery.isLoading || messagesQuery.isLoading) {
    return <SkeletonLoader />;
  }

  if (!conversation) {
    return (
      <>
        <div className="lg:pl-80 h-full">
          <div className="h-full flex flex-col">
            <SkeletonLoader />;
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="lg:pl-80 h-[100vh]">
        <div className="h-full flex flex-col">
          <Header conversation={conversation} />
          <Body initialMessages={messages} />
          <Form />
        </div>
      </div>
    </>
  );
};

export default ConversationId;
