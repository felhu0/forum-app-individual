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
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type CommentsProps = {
    comments: Comment[];
    threadId: string;
    threadCreatorId: string;
    answered: boolean;
    answeredCommentId: string | null;
    setAnswered: (answered: boolean) => void;
    handleAnswered: (commentId: string) => Promise<void>;
    isQnA: boolean;
    isLocked: boolean;
}

export const Comments: React.FC<CommentsProps> = ({
    comments = [],
    threadCreatorId,
    answered,
    answeredCommentId,
    handleAnswered,
    isLocked
}) => {
    const { user: currentUser } = useAuth();
    const router = useRouter();

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
                                    <span className={`flex items-center ${isLocked ? 'text-gray-400' : 'text-green-600'}`}>
                                        <FaCheck className="mr-2" />
                                        Answered
                                    </span>
                                ) : (
                                    <button
                                    className={`flex items-center ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}
                                    onClick={() => {
                                        if (currentUser) {
                                            handleAnswered(comment.id);
                                        } else {
                                            router.push('/log-in');
                                            toast.error("You need to log in to mark a comment as answered.")
                                        }
                                    }}
                                    disabled={isLocked}
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

