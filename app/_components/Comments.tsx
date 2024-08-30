'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Comment, Thread } from '../types/thread';
import { useEffect, useState } from 'react';
import { getThreadById } from '@/lib/thread.db';
import { useParams } from 'next/navigation';

export const Comments = () => {
    const [comments, setComments] = useState<Comment[]>([]);

    const { id } = useParams() as { id: string };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const thread = await getThreadById(id);
                if (thread && thread.comments) {
                    setComments(thread.comments);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [id]);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className='bg-stone-50'>Comments</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {comments.length ? (
                    comments.map((comment) => (
                        <TableRow key={comment.id}>
                            <TableCell>
                                <div>
                                    {comment.content}
                                    <div className='flex gap-1 mt-1 items-center'>
                                        <span className='text-xs text-muted-foreground'>
                                            by
                                        </span>
                                        <span className='text-xs hover:underline cursor-pointer'>
                                            {/* {comment.creator} */}
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
                            No comments yet.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
