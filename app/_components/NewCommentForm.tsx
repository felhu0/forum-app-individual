'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useController } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Comment } from '../types/thread';
import { addCommentToThread } from '@/lib/thread.db';
import toast from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from './authProvider';
import { Textarea } from '@/components/ui/textarea';

type NewCommentFormProps = {
    id: string;
    onCommentSubmit: (comment: Comment) => void; 
};

export const NewCommentForm: React.FC<NewCommentFormProps> = ({ id, onCommentSubmit }) => {

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

    const { field } = useController({
        name: 'commentBody',
        control: form.control,
        defaultValue: '',
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
                    username: currentUser.username,
                    email: currentUser.email
                },
            };

            await addCommentToThread(id, newComment);
            
            form.reset();
            onCommentSubmit(newComment); // Pass the new comment to the callback
            return newComment; // Return the new comment
        } catch (error) {
            toast.error('Failed to add comment.');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 my-4'>
                <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Write your comment..." {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
};