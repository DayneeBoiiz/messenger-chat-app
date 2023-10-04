import { useMemo } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import useConversation from "./useConversation";
import { removeCookie } from "@/lib/utils";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();
  const router = useRouter();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleLogout = async () => {
    try {
      const sessionID = Cookies.get("sessionID");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/logout`,
        {
          sessionID: sessionID,
        }
      );
      removeCookie("sessionID");
      window.location.href = "/login";
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleChatClick = () => {
    // Handle chat click logic here
  };

  const handleUsersClick = () => {
    // Handle users click logic here
  };

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/conversations",
        icon: HiChat,
        active: pathname === "/conversations" || conversationId,
        handler: handleChatClick,
      },
      {
        label: "Users",
        href: "/users",
        icon: HiUsers,
        active: pathname === "/users",
        handler: handleUsersClick,
      },
      {
        label: "Logout",
        href: "#",
        onclick: handleLogout,
        icon: HiArrowLeftOnRectangle,
        handler: handleLogout,
      },
    ],
    [pathname, conversationId, handleLogout]
  );

  return { routes, handleLogout };
};

export default useRoutes;
