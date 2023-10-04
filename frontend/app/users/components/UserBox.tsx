"use client";

import { useCallback, useState } from "react";
import { usersProps } from "../layout";
import { useRouter } from "next/navigation";
import axios from "axios";
import Avatar from "@/components/avatar";
import Cookies from "js-cookie";
import LoadingModal from "@/components/LoadingModal";

interface UserBoxProps {
  data: usersProps;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    const sessionIDFromCookie = Cookies.get("sessionID");

    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/conversations`,
        {
          userID: data.id,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionIDFromCookie}`,
          },
        }
      )
      .then((data) => {
        router.push(`/conversations/${data.data.uid}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router, data]);

  return (
    <>
      {isLoading && (
        <>
          <LoadingModal />
        </>
      )}
      <div
        onClick={handleClick}
        className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
      >
        <Avatar currentUser={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-900">
                {data.username}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
