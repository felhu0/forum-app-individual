import { User } from "./user";

type ThreadCategory = "NEW" | "HOT";

type Thread = {
  id: number;
  title: string;
  category: ThreadCategory;
  creationDate: Date;
  description: string;
  creator: User;
}