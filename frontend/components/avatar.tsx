import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { usersProps } from "@/app/users/layout";
import useActiveList from "./hooks/useActiveList";
import { toast } from "react-toastify";

interface AvatarProps {
  currentUser: usersProps;
}

const Avatar: React.FC<AvatarProps> = ({ currentUser }) => {
  const [imageURL, setImageURL] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { members } = useActiveList();
  const isActive = members.indexOf(currentUser?.email) !== -1;

  useEffect(() => {
    const sessionID = Cookies.get("sessionID");
    if (currentUser) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/users/${currentUser?.username}/avatar`,
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${sessionID}`,
            },
          }
        )
        .then((response) => {
          const url = URL.createObjectURL(response.data);
          setImageURL(url);
        })
        .catch((error) => toast.error("Something went wrong"));
    }
    setIsLoading(false);
  }, [currentUser, currentUser?.username]);

  return (
    <>
      <div className="relative">
        <div className="relative inline-block rounded-full overflow-hidden w-9 h-9 md:h-11 md:w-11">
          {!isLoading && (
            <Image
              src={imageURL || "/default_avatar.png"}
              alt="Avatar"
              width={100}
              height={100}
            />
          )}
        </div>
        {isActive && (
          <>
            <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3" />
          </>
        )}
      </div>
    </>
  );
};

export default Avatar;
