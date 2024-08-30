'use client';

import { CommentsForm } from '@/app/_components/CommentsForm';
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
        return <div>Loading...</div>;
    }

    return (
        <div className='mx-auto w-full pl-12 px-6 my-8 max-w-6xl'>
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
            <CommentsForm id={thread.id} />
        </div>
    );
};

export default ThreadDetailsPage;
