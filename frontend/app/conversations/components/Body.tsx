"use client";

import { FullMessageType } from "@/app/types";
import useConversation from "@/components/hooks/useConversation";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { find } from "lodash";
import Cookies from "js-cookie";
import { pusherClient } from "@/app/utils/pusher";
import LoadingIndicator from "@/components/loadingIndicator";
import useCurrentUser from "@/components/hooks/useCurrentUser";
import { toast } from "react-toastify";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<FullMessageType[]>([]);
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const { conversationId } = useConversation();

  useEffect(() => {
    const sessionID = Cookies.get("sessionID");

    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/conversations/${conversationId}/seen`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionID}`,
          },
        }
      )
      .then((response) => {})
      .catch((error) => {
        toast.error("Something went wrong");
      });
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        } else return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();

      const sessionID = Cookies.get("sessionID");

      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/conversations/${conversationId}/seen`,
          {},
          {
            headers: {
              Authorization: `Bearer ${sessionID}`,
            },
          }
        )
        .then((response) => {})
        .catch((error) => {
          toast.error("Something went wrong");
        });
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) =>
          currentMessage.id === newMessage.id ? newMessage : currentMessage
        )
      );
    };

    pusherClient.bind("message:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("message:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId, messages]);

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {!messages ? (
          <>
            <LoadingIndicator />
          </>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBox
                key={index}
                isLast={index === messages.length - 1}
                data={message}
                isOwn={currentUser?.email === message.sender.email}
              />
            ))}
          </>
        )}
        <div ref={bottomRef} className="pt-2" />
      </div>
    </>
  );
};

export default Body;
