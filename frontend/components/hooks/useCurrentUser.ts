"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/app/types/prismaTypes";
import { usersProps } from "@/app/users/layout";

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<usersProps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const sessionID = Cookies.get("sessionID");

      if (!sessionID) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${sessionID}`,
            },
          }
        );

        setCurrentUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching current user:", error);
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { currentUser, loading };
};

export default useCurrentUser;
