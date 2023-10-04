import { usersProps } from "../users/layout";

// User model interface
export interface User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  hash: string;
  avatarPicture?: string | null;
  session?: Session | null;
  conversation: Conversation[];
  seenMessage: Message[];
  sentMessage: Message[];
}

// Session model interface
export interface Session {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sessionID: string;
  user: User;
  userID: number;
}

// Message model interface
export interface Message {
  id: number;
  createdAt: Date;
  body?: string | null;
  image?: string | null;
  conversation: Conversation;
  conversationID: number;
  seen: User[];
  sender: User;
  senderID: number;
}

// Conversation model interface
export interface Conversation {
  id: number;
  createdAt: Date;
  lastMessageAt: Date;
  uid: string;
  name?: string | null;
  isGroup?: boolean | null;
  users: usersProps[];
  message: Message[];
}
