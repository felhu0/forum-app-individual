'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getThreadById } from '@/lib/thread.db';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Comments } from '@/app/_components/Comments';
import { NewCommentForm } from '@/app/_components/NewCommentForm';
import { Thread, Comment } from '@/app/types/thread';

type Params = {
    id: string
}

const ThreadDetailsPage = () => {
    const [thread, setThread] = useState<Thread | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const router = useRouter();
    const { id } = useParams<Params>();

    useEffect(() => {
        const fetchThread = async () => {
            if (id) {
                const fetchedThread = await getThreadById(id);
                if (fetchedThread) {
                    setThread(fetchedThread);
                    setComments(fetchedThread.comments);
                } else {
                    console.log('No thread found with the given ID.');
                    router.push('/404');
                }
            } else {
                console.log('ID is not available in search parameters.');
            }
        };

        fetchThread();
    }, [id]);

    const handleCommentSubmit = async (newComment: Comment) => {
        if (thread) {
            setComments([...comments, newComment]);
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
            <div className='w-full mx-auto pl-12 px-6 max-w-6xl my-6'>
                <div className='rounded-md border'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Thread {thread.title}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>{thread.description}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className='mx-auto w-full pl-12 px-6 my-8 max-w-6xl'>
                <div className='rounded-md border'>
                    <Comments comments={comments} />
                </div>
            </div>
            <div className='w-full pl-12 px-6 py-8 absolute bottom-0 bg-slate-200'>
                <div className='mx-auto max-w-3xl'>
                    <NewCommentForm id={thread.id} onCommentSubmit={handleCommentSubmit} />
                </div>
            </div>
        </>
    );
};

export default ThreadDetailsPage;
