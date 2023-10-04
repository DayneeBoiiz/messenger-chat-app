"use client";

import useAuthSession from "@/components/hooks/useAuthSession";
import clsx from "clsx";
import useConversation from "@/components/hooks/useConversation";
import EmptyState from "@/components/empty_state";

const Home = () => {
  const { isOpen } = useConversation();

  return (
    <>
      <div
        className={clsx(
          "lg:pl-80 h-full lg:block",
          isOpen ? `block` : "hidden"
        )}
      >
        <EmptyState />
      </div>
    </>
  );
};

export default Home;
