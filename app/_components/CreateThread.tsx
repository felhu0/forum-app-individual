import { useState } from "react";
import { ThreadCategory } from "../types/thread";
import { User } from "../types/user";
import { Timestamp } from "firebase/firestore";
import { createThread } from "@/lib/thread.db";

type ThreadProps = {
    title: string;
    id: string;
    category: ThreadCategory;
    creationDate: Timestamp;
    description: string;
    creator: User;
    comments: Comment[];
};

const CreateThread = (props: ThreadProps): JSX.Element => {
    const [title, setTitle] = useState<string>('');
    const [category, setCategory] = useState<ThreadCategory>('NEW');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
    }

    const newThread = {
        title,
        id: props.id,
        category,
        creationDate: Timestamp.now(),
        description,
        creator: props.creator,
        comments: []
    };

    try {
        createThread(newThread);
    } catch (error) {
        setError((error as Error).message);
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Thread title"
                required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value as ThreadCategory)}>
            <option value="new">New</option>
            <option value="hot">Hot</option>
        </select>
        <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Thread description"
            required
        />
            <button type="submit">Create Thread</button>
        </form>
    )
}

export default CreateThread;