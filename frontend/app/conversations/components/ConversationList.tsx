import { FullConversationType } from "@/app/types";
import useConversation from "@/components/hooks/useConversation";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { usersProps } from "@/app/users/layout";
import useCurrentUser from "@/components/hooks/useCurrentUser";
import { pusherClient } from "@/app/utils/pusher";
import { find } from "lodash";
import useAuthSession from "@/components/hooks/useAuthSession";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: usersProps[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { conversationId, isOpen } = useConversation();
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const [items, setItems] = useState<FullConversationType[]>([]);
  useAuthSession();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const pusherKey = useMemo(() => {
    return currentUser?.email;
  }, [currentUser]);

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }
        return [conversation, ...current];
      });
    };

    const updateHandler = (updatedConversation: FullConversationType) => {
      setItems((current) => {
        return current.map((currentConversation) => {
          if (currentConversation.uid === updatedConversation.uid) {
            return {
              ...currentConversation,
              message: updatedConversation.message,
            };
          }
          return currentConversation;
        });
      });
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.uid !== conversation.uid)];
      });
      if (conversationId === conversation.uid) router.push("/conversations");
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [pusherKey, items, conversationId, router]);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          "fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200",
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              details={item}
              selected={conversationId === item.uid}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
