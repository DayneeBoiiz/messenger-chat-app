import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { removeCookie } from "@/lib/utils";
import { toast } from "react-toastify";

const useAuthSession = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/register") {
      setLoading(false);
      return;
    }

    const checkSessionID = () => {
      const sessionIDFromCookie = Cookies.get("sessionID");

      if (!sessionIDFromCookie) {
        router.push("/login");
        return;
      }

      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/check`, {
          sessionIDFromCookie: sessionIDFromCookie,
        })
        .then((response) => {
          const { valid } = response.data;
          if (!valid) {
            removeCookie("sessionID");
            router.push("/login");
          }
        })
        .catch((error) => {
          toast.error("Something went wrong");
          router.push("/login");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    checkSessionID();
  }, [router, pathname]);

  return loading;
};

export default useAuthSession;
