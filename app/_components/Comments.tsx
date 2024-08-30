'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export const Comments = () => {
    return (
        <div className='mx-auto w-full pl-12 px-6 my-8 max-w-6xl'>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Comments</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>Kommentarer här</TableBody>
                </Table>
            </div>
        </div>
    );
};
