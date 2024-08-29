import { ThreadCategory, ThreadStatus } from "../types/thread";
import { User } from "../types/user";
import { Timestamp } from "firebase/firestore";
import { createThread } from "@/lib/thread.db";
import toast from "react-hot-toast";
import { NewThreadForm } from "./NewThreadForm";

type CreateThreadProps = {
    id: string;
    category: ThreadCategory;
    creator: User;
};

const CreateThread = ({ id, category, creator }: CreateThreadProps): JSX.Element => {
    const handleSubmit = async (data: {
        threadTitle: string;
        threadBody: string;
        threadCategory: string;
    }) => {
        const newThread = {
            title: data.threadTitle,
            id,
            status: 'New' as ThreadStatus,
            category: data.threadCategory as ThreadCategory,
            creationDate: Timestamp.now(),
            description: data.threadBody,
            creator,
            comments: []
        };
        
        try {
            await createThread(newThread);
            toast.success('Thread created successfully!');
        } catch (error) {
            toast.error('Failed to create thread.' + (error as Error).message);
        }
    }
        
        return (
            <div>
                <NewThreadForm onSubmit={handleSubmit} />
            </div>
        )
}

export default CreateThread;