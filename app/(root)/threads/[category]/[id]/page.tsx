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

const ThreadDetails = ({ title, id }: Thread) => {
  console.log(title, id)
    return (
        <div className='mx-auto w-full pl-12 px-6 my-8 max-w-6xl'>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Thread test {title}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody></TableBody>
                </Table>
            </div>
            <CommentsForm id={id} />
        </div>
    );
};

export default ThreadDetails;
