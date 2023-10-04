"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Image from "next/image";
import { usersProps } from "@/app/users/layout";

interface AvatarGroupProps {
  users: usersProps[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users }) => {
  const slicedUsers = users.slice(0, 3);
  const [imagesURL, setImagesURL] = useState<(string | undefined)[]>([]);

  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };

  useEffect(() => {
    async function fetchAvatars() {
      const avatarPromises = users.slice(0, 3).map(async (user) => {
        if (users) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_HOST}/users/${user.username}/avatar`,
            {
              responseType: "blob",
              headers: {
                Authorization: `Bearer ${Cookies.get("sessionID")}`,
              },
            }
          );
          return URL.createObjectURL(response.data);
        }
      });

      try {
        const avatarURLs = await Promise.all(avatarPromises);
        setImagesURL(avatarURLs);
      } catch (error) {
        console.error("Error fetching avatars:", error);
      }
    }

    fetchAvatars();
  }, [users]);

  return (
    <>
      <div className="relative h-11 w-11">
        {slicedUsers.map((user, index) => (
          <div
            key={index}
            className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px]
            ${positionMap[index as keyof typeof positionMap]}`}
          >
            <Image
              key={index}
              src={imagesURL[index] || "/default_avatar.png"}
              alt={`Avatar ${index}`}
              width={100}
              height={100}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default AvatarGroup;
