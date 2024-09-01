'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Thread } from '../types/thread';
import { getAllThreads, getThreadById } from '@/lib/thread.db';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCategory } from '@/lib/formatCategory';
import { FaLock, FaQuestionCircle } from 'react-icons/fa';


export const LatestThreads = () => {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const data: Thread[] = await getAllThreads();
                setThreads(data);
            } catch (error) {
                console.error('Error fetching threads:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchThreads();
    }, []);

    if (loading) {
        return (
            <div className='flex pt-16 text-center justify-center max-auto text-lg font-medium'>
                Loading...
            </div>
        );
    }
    
    const handleRowClick = async (threadId: string, category: string) => {
        try {
            const thread = await getThreadById(threadId);
            if (thread) {
                const formattedCategory = formatCategory(category);
                router.push(`/threads/${formattedCategory}/${threadId}`);
            } else {
                console.error('Thread not found');
            }
        } catch (error) {
            console.error('Error fetching thread:', error);
        }

    };

    return (
        <div className='mx-auto w-full pl-12 px-6 my-8 max-w-6xl'>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Latest Threads</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {threads.length ? (
                            threads.map((thread) => (
                                <TableRow
                                    key={thread.id}
                                    onClick={() =>
                                        handleRowClick(
                                            thread.id,
                                            thread.category
                                        )
                                    }
                                    className='cursor-pointer'>
                                    <TableCell>
                                        <div>
                                            {thread.title}
                                            {thread.isQnA && (
                                                <FaQuestionCircle className='h-4 w-4 text-yellow-600 ml-2 inline' />
                                            )}
                                            {thread.isLocked && (
                                                <FaLock className='h-4 w-4 text-red-500 ml-2 inline' />
                                            )}
                                            <div className='flex gap-1 mt-1 items-center'>
                                                <span className='text-xs text-muted-foreground'>
                                                    in
                                                </span>
                                                <span className='text-xs hover:underline cursor-pointer'>
                                                    {thread.category}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className='h-24 text-center'>
                                    No threads found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
