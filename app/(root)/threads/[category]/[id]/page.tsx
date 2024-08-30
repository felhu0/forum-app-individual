'use client';

import { Comments } from '@/app/_components/Comments';
import { NewCommentForm } from '@/app/_components/NewCommentForm';
import { Thread } from '@/app/types/thread';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getThreadById } from '@/lib/thread.db';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ThreadDetailsPage = () => {
    const { id } = useParams() as { id: string };

    const [thread, setThread] = useState<Thread | null>(null);

    useEffect(() => {
        const fetchThread = async () => {
            if (id) {
                const fetchedThread = await getThreadById(id);
                setThread(fetchedThread);
            }
        };

        fetchThread();
    }, [id]);

    if (!thread) {
        return (
            <div className='flex pt-16 text-center justify-center max-auto text-lg font-medium'>
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
                    <Comments />
                </div>
            </div>
            <div className='w-full pl-12 px-6 py-8 absolute bottom-0 bg-slate-200'>
                <div className='mx-auto max-w-3xl'>
                    <NewCommentForm id={thread.id} />
                </div>
            </div>
        </>
    );
};

export default ThreadDetailsPage;
