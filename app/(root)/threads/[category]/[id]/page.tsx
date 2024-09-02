'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getThreadById, lockThread, updateThread } from '@/lib/thread.db';
import { FaQuestionCircle, FaUnlock, FaLock } from 'react-icons/fa';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Comments } from '@/app/_components/Comments';
import { NewCommentForm } from '@/app/_components/NewCommentForm';
import { Thread, Comment } from '@/app/types/thread';
import { User } from '@/app/types/user';
import { useAuth } from '@/app/_components/authProvider';
import { Badge } from '@/components/ui/badge';
import Loading from '@/app/_components/Loading';

type Params = {
    id: string;
};

const ThreadDetailsPage = () => {
    const [thread, setThread] = useState<Thread | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [answered, setAnswered] = useState<boolean>(false);
    const [answeredCommentId, setAnsweredCommentId] = useState<string | null>(
        null
    );
    const [threadCreatorId, setThreadCreatorId] = useState<User | null>(null);
    const { user } = useAuth();
    const router = useRouter();
    const { id } = useParams<Params>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchThread = async () => {
            if (id) {
                try {
                    const fetchedThread = await getThreadById(id);
                    if (fetchedThread) {
                        setThread(fetchedThread);
                        setComments(fetchedThread.comments);
                        setThreadCreatorId(fetchedThread.creator);
                        setAnswered(fetchedThread.isAnswered ?? false);
                        setAnsweredCommentId(
                            fetchedThread.answeredCommentId ?? null
                        );
                    } else {
                        console.log('No thread found with the given ID.');
                        router.push('/404');
                    }
                } catch (error) {
                    console.error('Error fetching thread data:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                console.log('ID is not available in search parameters.');
            }
        };

        fetchThread();
    }, [id, router]);

    if (loading) {
        return (
            <Loading />
        );
    }

    const handleCommentSubmit = async (newComment: Comment) => {
        if (thread) {
            setComments([...comments, newComment]);
        }
    };

    const handleMarkAsAnswered = async (commentId: string) => {
        try {
            if (!thread) {
                console.error('Thread not found.');
                return;
            }

            const newIsAnswered = answeredCommentId !== commentId;

            const fieldsToUpdate: Partial<Thread> = {
                isAnswered: newIsAnswered,
            };

            if (newIsAnswered) {
                fieldsToUpdate.answeredCommentId = commentId;
            } else {
                fieldsToUpdate.answeredCommentId = null;
            }

            await updateThread(thread.id, fieldsToUpdate);

            setAnswered(newIsAnswered);
            setAnsweredCommentId(newIsAnswered ? commentId : null);
        } catch (error) {
            console.error('Error toggling comment as answered:', error);
        }
    };

    const handleToggleLock = async () => {
        if (!thread) return;

        try {
            await lockThread(thread.id, !thread.isLocked);
            setThread({ ...thread, isLocked: !thread.isLocked });
        } catch (error) {
            console.error('Failed to lock/unlock thread.', error);
        }
    };

    if (!thread) {
        return (
            <div className='flex pt-16 text-center justify-center mx-auto text-lg font-medium'>
                Loading...
            </div>
        );
    }

    return (
        <>
            <div className='w-full mx-auto pl-12 px-6 max-w-6xl my-8 pt-6'>
                <div className='rounded-md border'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='text-stone-600 text-sm font-semibold p-4 bg-stone-50 flex items-center justify-between h-auto w-full'>
                                    <div>
                                        <p>{thread.title}</p>
                                    </div>
                                    <div
                                        className='
                                    mr-2'>
                                        {user && (
                                            <button onClick={handleToggleLock}>
                                                {thread.isLocked ? (
                                                    <Badge
                                                        variant='destructive'
                                                        className='rounded-full p-3'>
                                                        <FaLock className='h-3 w-3' />
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant='secondary'
                                                        className='rounded-full p-3 transition-all duration-300 hover:scale-105'>
                                                        <FaUnlock className='h-3 w-3' />
                                                    </Badge>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <div className='py-3 pl-1 pr-6 text-base'>
                                        {thread.description}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        <TableBody>
                            <TableRow className='bg-stone-50'>
                                <TableCell>
                                    <div className='flex justify-between items-center'>
                                        <span className='flex gap-1 text-muted-foreground'>
                                            By
                                            <p className='font-bold text-indigo-700'>
                                                {' '}
                                                {thread.creator.name}
                                            </p>
                                        </span>

                                        {thread.isQnA && (
                                            <Badge variant='qna'>Q&A</Badge>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className='mx-auto w-full pl-12 px-6 my-8 max-w-6xl'>
                <div className='rounded-md border'>
                    {thread.isQnA && (
                        <Comments
                            comments={comments}
                            threadId={thread.id}
                            threadCreatorId={thread.creator.id}
                            answered={answered}
                            setAnswered={setAnswered}
                            handleAnswered={handleMarkAsAnswered}
                            answeredCommentId={answeredCommentId ?? null}
                            isQnA={thread.isQnA}
                            isLocked={thread.isLocked}
                        />
                    )}
                </div>
            </div>
            {!thread.isLocked && (
                <div className='w-full pl-12 px-6 py-8 relative bottom-0 bg-slate-200'>
                    <div className='mx-auto max-w-3xl'>
                        <NewCommentForm
                            id={thread.id}
                            onCommentSubmit={handleCommentSubmit}
                        />
                    </div>
                </div>
            )}

            {thread.isLocked && (
                <div className='w-full pl-12 px-6 py-8 bg-red-100 text-red-500 text-center'>
                    This thread is locked. No further comments can be added.
                </div>
            )}
        </>
    );
};

export default ThreadDetailsPage;
