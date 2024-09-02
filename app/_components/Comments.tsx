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
import { FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { MarkedAsAnswered } from './MarkedAsAnswered';
import { timeDifference } from '@/lib/relativeDateTime';
import { FaCircleUser } from 'react-icons/fa6';

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
};

export const Comments: React.FC<CommentsProps> = ({
    comments = [],
    threadCreatorId,
    answered,
    answeredCommentId,
    handleAnswered,
    isQnA,
    isLocked,
}) => {
    const { user: currentUser } = useAuth();
    const router = useRouter();

    const answeredComment = comments.find(
        (comment) => comment.id === answeredCommentId
    );

    return (
        <>
            {isQnA && answeredComment && (
                <MarkedAsAnswered
                    key={answeredComment.id}
                    comment={answeredComment}
                />
            )}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='bg-stone-50 border-t-1'>
                            Comments
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {comments.map((comment, index) => {
                        const isAnswered = comment.id === answeredCommentId;
                        return (
                            <TableRow
                                key={comment.id || index}
                                className='comment-hover'>
                                <div className='pl-4 p-6 w-full border border-collapse'>
                                    {comment.content}
                                </div>
                                <div className='flex justify-between items-center px-4 py-4'>
                                    <div className='flex flex-col gap-1'>
                                        <span className='flex gap-1 items-center'>
                                            <FaCircleUser className='text-muted-foreground' />
                                            <span className='text-xs font-semibold'>
                                                {comment.creator?.username}
                                            </span>
                                        </span>
                                        <span className='text-xs text-muted-foreground'>
                                            {timeDifference(
                                                new Date(),
                                                new Date(
                                                    comment.creationDate.toDate()
                                                )
                                            )}
                                        </span>
                                    </div>
                                    <div className=''>
                                        {isQnA &&
                                            (isAnswered ? (
                                                <span
                                                    className={`flex items-center ${
                                                        isLocked
                                                            ? 'text-green-600/70'
                                                            : 'text-green-600'
                                                    }`}>
                                                    <FaCheck className='mr-2' />
                                                    Answered
                                                </span>
                                            ) : (
                                                <button
                                                    className={`flex items-center ${
                                                        isLocked
                                                            ? 'text-gray-400'
                                                            : 'text-gray-600'
                                                    }`}
                                                    onClick={() => {
                                                        if (currentUser) {
                                                            handleAnswered(
                                                                comment.id
                                                            );
                                                        } else {
                                                            router.push(
                                                                '/log-in'
                                                            );
                                                            toast.error(
                                                                'You need to log in to mark a comment as answered.'
                                                            );
                                                        }
                                                    }}
                                                    disabled={isLocked}>
                                                    <FaCheck className='mr-2' />
                                                    Mark as Answered
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
};
