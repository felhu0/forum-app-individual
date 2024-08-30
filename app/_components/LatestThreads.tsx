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
import { formatCategory } from '@/lib/formattingCategoryForURL';


export const LatestThreads = () => {
    const [threads, setThreads] = useState<Thread[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchThreads = async () => {
            const data: Thread[] = await getAllThreads();
            setThreads(data);
        };

        fetchThreads();
    }, []);


    
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
