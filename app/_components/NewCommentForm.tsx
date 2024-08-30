'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Comment, Thread } from '../types/thread';
import { addCommentToThread } from '@/lib/thread.db';
import toast from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from './authProvider';
import { Textarea } from '@/components/ui/textarea';

export const NewCommentForm: React.FC<{ id: string }> = ({ id }) => {

    const { user: currentUser } = useAuth();

    const FormSchema = z.object({
        commentBody: z.string().min(2, {
            message: 'Comment body must be at least 2 characters.',
        }),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            commentBody: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (!currentUser) {
            toast.error('You must be logged in to write a comment.');
            return;
        }

        try {
            const newComment: Comment = {
                id: '',
                content: data.commentBody,
                creationDate: Timestamp.now(),
                creator: {
                    id: currentUser.id,
                    email: currentUser.email,
                    username: currentUser.username,
                },
            };

            await addCommentToThread(id, newComment);

            form.reset();
        } catch (error) {
            toast.error('Failed to create thread: ' + (error as Error).message);
            console.error('Error creating thread:', error);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'>
                <FormField
                    control={form.control}
                    name='commentBody'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-lg'>
                                Write Comment
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder='Write your comment here...'
                                    rows={6}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type='submit'
                    className='px-8'>
                    Add Comment
                </Button>
            </form>
        </Form>
    );
};
