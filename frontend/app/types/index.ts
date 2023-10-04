import { usersProps } from "../users/layout";
import { User, Message, Conversation } from "./prismaTypes";

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullConversationType = Conversation & {
  users: usersProps[];
  messages: FullMessageType[];
};
