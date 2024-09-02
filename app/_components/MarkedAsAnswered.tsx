import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { FaRegCheckCircle } from 'react-icons/fa';
import { timeDifference } from '@/lib/relativeDateTime';
import { FaCircleUser } from 'react-icons/fa6';

type AnsweredCommentProps = {
    comment: {
        content: string;
        creator?: {
            username: string;
        };
        creationDate: {
            toDate: () => Date;
        };
    };
};

export const MarkedAsAnswered: React.FC<AnsweredCommentProps> = ({
    comment,
}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead
                        className='bg-stone-50 w-full'
                        colSpan={3}>
                        <div className='flex items-center gap-2 text-green-600'>
                            <FaRegCheckCircle />
                            <span>Marked as Answer</span>
                        </div>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className='p-4'>
                        {comment.content}
                        <TableRow>
                            <div className='flex flex-col mt-6 gap-1'>
                                <span className='flex gap-1 items-center'>
                                    <FaCircleUser className='text-muted-foreground' />
                                    <span className='text-xs font-semibold'>
                                        {comment.creator?.username}
                                    </span>
                                </span>
                                <span className='text-xs text-muted-foreground'>
                                    {timeDifference(
                                        new Date(),
                                        new Date(comment.creationDate.toDate())
                                    )}
                                </span>
                            </div>
                        </TableRow>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};
