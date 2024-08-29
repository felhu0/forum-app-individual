'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { ComboBox } from './SelectCategoryNewThread';
import { addDoc, collection, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { useAuth } from './authProvider';
import { ThreadCategory } from '../types/thread';


const FormSchema = z.object({
    threadTitle: z.string().min(10, {
        message: 'Your new thread message must be at least 10 characters.',
    }),
    threadBody: z.string().min(10, {
        message: 'Your new thread message must be at least 10 characters.',
    }),
    threadCategory: z.string(),
});

export const NewThreadForm = () => {
    const { user: currentUser } = useAuth(); 
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            threadTitle: '',
            threadBody: '',
            threadCategory: '',
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const userDoc = await getDoc(doc(db, 'users', currentUser?.id!));
            if (!userDoc.exists()) {
                throw new Error('User not found');
            }

            const newThread = {
                title: data.threadTitle,
                status: 'New',
                category: data.threadCategory,
                creationDate: Timestamp.now(),
                description: data.threadBody,
                creator: {
                    id: currentUser?.id,
                    name: currentUser?.username
                },
                comments: [],
            };

            await addDoc(collection(db, 'threads'), newThread);
            toast.success('Thread created successfully!');
            form.reset();
        } catch (error) {
            toast.error('Failed to create thread: ' + (error as Error).message);
            console.error('Error creating thread:', error);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='mx-auto w-2/3 space-y-4 pl-12 py-12 max-w-3xl'>
                <FormField
                    control={form.control}
                    name='threadTitle'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-xl'>
                                Create Thread
                            </FormLabel>
                            <FormDescription className='pb-6'>
                                Please provide a title, body and its
                                corresponding category for your new thread.
                            </FormDescription>
                            <FormControl>
                                <Input
                                    placeholder='Title'
                                    className='resize-none'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='threadBody'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder='Body'
                                    rows={5}
                                    className='resize-none'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex items-center justify-between'>
                    <FormField
                        control={form.control}
                        name='threadCategory'
                        render={({ field }) => (
                            <ComboBox
                                value={field.value as ThreadCategory}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    <Button
                        type='submit'
                        className='px-8'>
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
};