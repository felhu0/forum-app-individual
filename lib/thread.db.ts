import { Thread, ThreadCategory, Comment } from '@/app/types/thread';
import { db } from '@/firebase.config';
import { setDoc, doc, getDoc, deleteDoc, collection, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore'; 
import { getUserById } from './user.db';
import { tree } from 'next/dist/build/templates/app-page';
import { threadId } from 'worker_threads';


export const getAllThreads = async (): Promise<Thread[]> => {
    try {
        const threadsCollection = collection(db, 'threads');
        const threadsSnapshot = await getDocs(threadsCollection);
        const threads: Thread[] = await Promise.all(threadsSnapshot.docs.map(async doc => {
            const data = doc.data() as Thread;
            const thread: Thread = {
                ...data,
                id: doc.id,
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
                        creationDate: Timestamp.fromDate(commentData.creationDate.toDate()),
                        user: commentData.creator.email
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

export const getThreadById = async (id: string): Promise<Thread | null> => {
    try {
        const threadDoc = await getDoc(doc(db, 'threads', id));
        if (!threadDoc.exists()) {
            console.log(`Thread with ID ${id} does not exist.`);
            return null;
        }

        const data = threadDoc.data() as Thread;
        const thread: Thread = {
            ...data,
            id,
            creationDate: Timestamp.fromDate(data.creationDate.toDate()),
            comments: data.comments ? data.comments.map((comment: Comment, index: number) => ({
                ...comment,
                id: comment.id || `${id}-${index}`,
                creationDate: Timestamp.fromDate(comment.creationDate.toDate()),
                user: comment.creator.email
            })) : []
        };

        console.log(`Fetched ${thread.comments.length} comments for thread ID ${id}.`);
    
        return thread;
    } catch (error) {
        toast.error('Failed to fetch thread: ' + (error as Error).message);
        console.error('Error fetching thread:', error);
        return null;
    }
};

export const createThread = async (data: Thread) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', data.creator.id));
        if (!userDoc.exists()) {
            throw new Error('User not found');
        }

        const newThread = {
            title: data.title,
            status: 'New',
            category: data.category,
            creationDate: Timestamp.now(),
            description: data.description,
            creator: {
                id: data.creator.id,
                name: data.creator.username,
            },
            comments: [],
            isQnA: data.isQnA || false,
            isAnswered: data.isAnswered || false,
            isLocked: data.isLocked || false
        };

        await addDoc(collection(db, 'threads'), newThread);
        toast.success('Thread created successfully!');
    } catch (error) {
        toast.error('Failed to create thread: ' + (error as Error).message);
        console.error('Error creating thread:', error);
    }
};

export const updateThread = async (threadId: string, fieldsToUpdate: Partial<Thread>): Promise<void> => {
    try {
        const threadDocRef = doc(db, 'threads', threadId);
        const threadDoc = await getDoc(threadDocRef);

        if (!threadDoc.exists()) {
            throw new Error('Thread not found');
        }

        await updateDoc(threadDocRef, fieldsToUpdate);
        toast.success('Thread updated successfully!');
    } catch (error) {
        toast.error('Failed to update thread: ' + (error as Error).message);
        console.error('Error updating thread:', error);
    }
};

export const lockThread = async (threadId: string, isLocked: boolean): Promise<void> => {
    try {
        const threadDocRef = doc(db, 'threads', threadId);
        const threadDoc = await getDoc(threadDocRef);

        if (!threadDoc.exists()) {
            throw new Error('Thread not found');
        }

        await updateDoc(threadDocRef, { isLocked });
        toast.success(`Thread ${isLocked ? 'locked' : 'unlocked'} successfully!`);
    } catch (error) {
        toast.error(`Failed to ${isLocked ? 'lock' : 'unlock'} thread: ` + (error as Error).message);
        console.error(`Error ${isLocked ? 'locking' : 'unlocking'} thread:`, error);
    }
};

export const addCommentToThread = async (threadId: string, comment: Comment): Promise<Comment> => {
    try {
        const threadDocRef = doc(db, 'threads', threadId);
        const threadDoc = await getDoc(threadDocRef);

        if (!threadDoc.exists()) {
            throw new Error('Thread not found');
        }

        const threadData = threadDoc.data() as Thread;

        if (threadData.isLocked) {
            throw new Error('Thread is locked. You can no longer comment.');
        }

        const user = await getUserById(comment.creator.id);
        if (!user) {
            throw new Error('User not found');
        }

        const updatedComment = {
            ...comment,
            creator: {
                ...comment.creator,
                email: user.email,
                name: user.name || '', 
                username: user.username || '' 
            }
        };
        const updatedComments = [...threadData.comments, updatedComment];

        await updateDoc(threadDocRef, {
            comments: updatedComments,
            isAnswered: false
        });

        toast.success('Comment added successfully!');
        return updatedComment;
    } catch (error) {
        toast.error('Failed to add comment: ' + (error as Error).message);
        throw new Error('Failed to add comment: ' + (error as Error).message);
    }
};


export const deleteThread = async (threadId: string): Promise<boolean> => {
    try {
        const threadDocRef = doc(db, 'threads', threadId)

        if(threadId) {
            await deleteDoc(threadDocRef);
            toast.success('Thread deleted successfully!');
            return true;
        } else {
            throw new Error('Thread not found');
        }
    } catch (error) {
        toast.error('Failed to delete thread: ' + (error as Error).message);
        return false;
    }
}

export const addCommentToComment = async (threadId: string, commentId: string, comment: Comment): Promise<Comment> => {
    try {
        const threadDocRef = doc(db, 'threads', threadId);
        const threadDoc = await getDoc(threadDocRef);
        
        if (!threadDoc.exists()) {
            throw new Error('Comment ID is required');
        }

        const threadData = threadDoc.data() as Thread;
        if(!threadData) {
            throw new Error('Thread not found');
        }

        const comments = threadData.comments || []
        const parentComment = comments.find((c: Comment) => c.id === commentId);
        if (!parentComment) {
            throw new Error('Parent comment not found');
        }

        const newComment = {
            ...comment,
            id: comment.id || doc(db, 'comments').id,
            creationData: comment.creationDate || Timestamp.now(),
        }
        
        parentComment.newComments = [...(parentComment.newComments || []), newComment];
        parentComment.comment = parentComment.comment ? parentComment.comment + 1 : 1;
        await updateDoc(threadDocRef, {
            comments: comments.map((c: Comment) => (c.id === commentId ? parentComment : c)),
        });
        toast.success('Comment added successfully!');
          
        return newComment
     
    } catch (error) {
        console.error('Error adding comment to comment:', error);
        throw error
    }
}