import { Timestamp } from "firebase/firestore";
import { User } from "./user";

export type ThreadCategory = "NEW" | "HOT";

export type Comment = {
  id: string;
  content: string;
  creationDate: Timestamp;
  creator: User;
}

export type Thread = {
  id: string;
  title: string;
  category: ThreadCategory;
  creationDate: Timestamp;
  description: string;
  creator: User;
  comments: Comment[];
}