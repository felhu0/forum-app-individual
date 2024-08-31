import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Comment } from '../types/thread';
import { useAuth } from './authProvider';
import { FaCheck, FaTimes } from 'react-icons/fa';

type CommentsProps = {
    comments: Comment[];
    threadId: string;
    threadCreatorId: string;
    answered: boolean;
    answeredCommentId: string | null;
    setAnswered: (answered: boolean) => void;
    handleAnswered: (commentId: string) => Promise<void>;
    isQnA: boolean;
}

export const Comments: React.FC<CommentsProps> = ({
    comments = [],
    threadCreatorId,
    answered,
    answeredCommentId,
    handleAnswered,
}) => {
    const { user: currentUser } = useAuth();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className='bg-stone-50'>Comments</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {comments.map((comment, index) => {
                    const isAnsweredComment = comment.id === answeredCommentId;
                    return (
                        <TableRow key={comment.id || index} className="comment-hover">
                            <TableCell>{comment.content}</TableCell>
                            <TableCell>
                                <small>
                                    By {comment.creator?.username} on{' '}
                                    {new Date(comment.creationDate.toDate()).toLocaleString()}
                                </small>
                            </TableCell>
                            <TableCell>
                                {isAnsweredComment ? (
                                    <span className="text-green-600 flex items-center">
                                        <FaCheck className="mr-2" />
                                        Answered
                                    </span>
                                ) : (
                                    <button
                                        className="text-gray-600 flex items-center"
                                        onClick={() => handleAnswered(comment.id)}
                                        >
                                        <FaCheck className="mr-2" />
                                        Mark as Answered
                                    </button>
                                )}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

