import { User } from "./user";

type ThreadCategory = "THREAD" | "QNA";

type Thread = {
  id: number;
  title: string;
  category: ThreadCategory;
  creationDate: Date;
  description: string;
  creator: User;
}

type QNAThread =  Thread & { 
	category: "QNA";
	isAnswered: boolean;
	commentAnswerId?: number;
}