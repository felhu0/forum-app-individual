import { Thread, ThreadCategory, Comment } from '@/app/types/thread';
import { db } from '@/firebase.config';
import { setDoc, doc, getDoc, deleteDoc, collection, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';
import { User } from '@/app/types/user';


type ThreadPropsList = {
    title: string;
    category: ThreadCategory;
    creationDate: Timestamp;
    description: string;
    creator: User;
    comments: Comment[];
};

export const getAllThreads = async (): Promise<Thread[]> => {
    try {
        const threadsCollection = collection(db, 'threads');
        const threadsSnapshot = await getDocs(threadsCollection);
        const threads: Thread[] = await Promise.all(threadsSnapshot.docs.map(async doc => {
            const data = doc.data() as ThreadPropsList;
            const thread: Thread = {
                id: doc.id,
                ...data,
                creationDate: Timestamp.fromDate(data.creationDate.toDate()),
                comments: []
            };

            const commentsCollection = collection(db, 'threads', doc.id, 'comments');
            const commentsSnapshot = await getDocs(commentsCollection);
            if (!commentsSnapshot.empty) {
                thread.comments = commentsSnapshot.docs.map(commentDoc => {
                    const commentData = commentDoc.data() as Comment;
                    return {
                        ...commentData,
                        creationDate: Timestamp.fromDate(commentData.creationDate.toDate())
                    };
                });
            }

            return thread;
        }));
        return threads;
    } catch (error) {
        toast.error('Failed to fetch threads: ' + (error as Error).message);
        return [];
    }
};

export const getThreadById = async (threadId: string): Promise<Thread | null> => {
    try {
        const threadDoc = await getDoc(doc(db, 'threads', threadId));

        if (threadDoc.exists()) {
            const data = threadDoc.data() as ThreadPropsList;
            return {
                id: threadDoc.id,
                ...data,
                creationDate: Timestamp.fromDate(data.creationDate.toDate())
            } as Thread;
        } else {
            toast.error('Thread not found');
            return null;
        }
    } catch (error) {
        toast.error('Failed to fetch thread: ' + (error as Error).message);
        return null;
    }
};

export const createThread = async (newThread: Thread): Promise<string> => {
    try {
        const threadData: ThreadPropsList = {
            title: newThread.title,
            category: newThread.category,
            creationDate: Timestamp.fromDate(newThread.creationDate.toDate()),
            description: newThread.description,
            creator: newThread.creator,
            comments: []
        }

        const docRef = await addDoc(collection(db, 'threads'), threadData);
        const newThreadId = docRef.id;

        await setDoc(doc(db, 'threads', newThreadId), { ...threadData, id: newThreadId })

        toast.success('Thread created successfully!')

        return newThreadId;

    } catch (error) {
        toast.error('Failed to create thread: ' + (error as Error).message);
        throw error;
    }
}

export const addCommentToThread = async (threadId: string, comment: Comment): Promise<void> => {
    try {
        const threadDocRef = doc(db, 'threads', threadId);
        const threadDoc = await getDoc(threadDocRef);

        if(threadDoc.exists()) {
            const threadData = threadDoc.data() as ThreadPropsList;
            const updatedComments = [...threadData.comments, comment]

            await updateDoc(threadDocRef, {
                comments: updatedComments
            })
            toast.success('Comment added successfully!');
        }
        else {
            toast.error('Thread not found')
        }

    } catch (error) {
        toast.error('Failed to add comment: ' + (error as Error).message);
        throw error;
    }
}
