'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Comment } from '../types/thread';

type CommentsProps = {
    comments: Comment[]
}

export const Comments: React.FC<CommentsProps> = ({ comments = [] }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Comments</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {comments.map((comment) => {
                    return (
                        <TableRow key={comment.id}>
                            <TableCell>{comment.content}</TableCell>
                            <TableCell>
                                <small>By {comment.creator?.username} on {comment.creationDate.toDate().toLocaleString()}</small>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

