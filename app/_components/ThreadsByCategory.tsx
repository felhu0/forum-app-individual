'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Thread, ThreadCategory } from '../types/thread';
import { getAllThreads } from '@/lib/thread.db';
import { useState, useEffect } from 'react';
import { formatCategory } from '@/lib/formatCategory';
import { useRouter } from 'next/navigation';

type ThreadsByCategoryProps = {
    currentCategory: ThreadCategory;
};

export const ThreadsByCategory = ({
    currentCategory,
}: ThreadsByCategoryProps) => {
    const router = useRouter();
    const category = formatCategory(currentCategory);

    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const allThreads = await getAllThreads();
                const filteredThreads = allThreads.filter(
                    (thread) => thread.category === category
                );
                setThreads(filteredThreads);
            } catch (error) {
                console.error('Error fetching threads:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchThreads();
    }, [category]);

    if (loading) {
        return (
            <div className='flex pt-16 text-center justify-center max-auto text-lg font-medium'>
                Loading...
            </div>
        );
    }

    const handleRedirect = (threadId: string) => {
        router.push(`/threads/${currentCategory}/${threadId}`);
    }

    return (
        <div className='mx-auto w-full pl-12 px-6 my-8 max-w-6xl'>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <span>Threads in </span>
                                {category}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {threads.length > 0 ? (
                            threads.map((thread) => (
                                <TableRow key={thread.id} onClick={() => handleRedirect}>
                                    <TableCell>
                                        <div>
                                            {thread.title}
                                            <div className='flex gap-1 mt-1 items-center'>
                                                <span className='text-xs text-muted-foreground truncate'>
                                                    {thread.description}
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
