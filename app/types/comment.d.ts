import { User } from "./user";

export type Comment = {
    id: number;
	thread: number;
	content: string;
    creationDate: Date;
    creator: User;
}