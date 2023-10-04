import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import cookie from "cookie";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const removeCookie = (name: string) => {
  document.cookie = cookie.serialize(name, "", {
    maxAge: -1, // Set the cookie's maxAge to a negative value to expire it immediately
    path: "/", // Set the cookie's path to the root to make sure it's deleted from all paths
  });
};
