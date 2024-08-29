'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ThreadCategory } from '../types/thread';


type ThreadsByCategoryProps = {
    currentCategory: ThreadCategory;
};

export const ThreadsByCategory = ({ currentCategory }: ThreadsByCategoryProps) => {
    return (
        <div className='mx-auto w-full pl-12 px-6 my-8 max-w-6xl'>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <span>Threads in</span>
                                {currentCategory}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* {threadData.length ? (
                            threadData.map((thread) => (
                                <TableRow key={thread.id}>
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
                        )} */}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
