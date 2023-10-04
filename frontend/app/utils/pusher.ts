"use client";

import PusherClient from "pusher-js";
import Cookies from "js-cookie";

const sessionID = Cookies.get("sessionID");

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    channelAuthorization: {
      endpoint: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/pusher/auth`,
      transport: "ajax",
      headers: {
        Authorization: `Bearer ${sessionID}`,
      },
    },
    cluster: "eu",
  }
);
