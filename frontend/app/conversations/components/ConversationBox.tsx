"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import clsx from "clsx";
import { FullConversationType } from "@/app/types";
import useCurrentUser from "@/components/hooks/useCurrentUser";
import Avatar from "@/components/avatar";
import { usersProps } from "@/app/users/layout";
import useOtherUser from "@/components/hooks/useOtherUser";
import AvatarGroup from "@/components/AvatarGroup";

interface ConversationBoxProps {
  details: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  details,
  selected,
}) => {
  const otherUser: usersProps = useOtherUser(details);
  const router = useRouter();
  const { currentUser } = useCurrentUser();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${details.uid}`);
  }, [router, details.uid]);

  const lastMessage = useMemo(() => {
    const messages = details.message || [];
    return messages[messages.length - 1];
  }, [details.message]);

  const userEmail = useMemo(() => {
    return currentUser?.email;
  }, [currentUser?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email !== userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  return (
    <>
      <div
        onClick={handleClick}
        className={clsx(
          "w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer",
          selected ? "bg-neutral-100" : "bg-white"
        )}
      >
        <>
          {details.isGroup ? (
            <>
              <AvatarGroup users={details.users} />
            </>
          ) : (
            <>
              <Avatar currentUser={otherUser} />
            </>
          )}
          <div className="min-w-0 flex-1">
            <div className="focus:outline-none">
              <div className="flex justify-between items-center mb-1">
                <p className="text-md font-medium text-gray-900">
                  {details.name || otherUser?.username}
                </p>
                {lastMessage?.createdAt && (
                  <p className="text-xs text-gray-400 font-light">
                    {format(new Date(lastMessage.createdAt), "p")}
                  </p>
                )}
              </div>
              <p
                className={clsx(
                  "truncate text-sm",
                  hasSeen ? "text-gray-500" : "text-black font-medium"
                )}
              >
                {lastMessageText}
              </p>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default ConversationBox;
