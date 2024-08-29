'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const threadData: Thread[] = [
    {
        id: 1,
        title: 'Best Practices for Managing State in React?',
        category: 'Software Development',
    },
    {
        id: 2,
        title: 'Struggling with Setting Up a VPN on My Home Network',
        category: 'Networking & Security',
    },
    {
        id: 3,
        title: 'Is It Worth Upgrading to DDR5 RAM for Gaming?',
        category: 'Hardware & Gadgets',
    },
    {
        id: 4,
        title: 'AWS vs. Google Cloud for Machine Learning Projects?',
        category: 'Cloud Computing',
    },
    {
        id: 5,
        title: 'Thoughts on Apples Latest Vision Pro Release?',
        category: 'Tech News & Trends',
    },
];

export type Thread = {
    id: number;
    title: string;
    category: string;
};

export const LatestThreads = () => {

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
                        {threadData.length ? (
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
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
