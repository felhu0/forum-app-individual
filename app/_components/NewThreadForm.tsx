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
import { ComboBox } from './SelectCategoryNewThread';

const FormSchema = z.object({
    threadTitle: z.string().min(10, {
        message: 'Your new thread message must be at least 10 characters.',
    }),
    threadBody: z.string().min(10, {
        message: 'Your new thread message must be at least 10 characters.',
    }),
    threadCategory: z.string(),
});

type NewThreadFormProps = {
    onSubmit: (data: z.infer<typeof FormSchema>) => void;
}

const categoryOptions = [
    'Software Development',
    'Networking & Security',
    'Hardware & Gadgets',
    'Cloud Computing',
    'Tech News & Trends'
] as const;

export const NewThreadForm = ({ onSubmit }: NewThreadFormProps) => {
    const { control, handleSubmit, formState: { errors }} = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    return (
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='mx-auto w-2/3 space-y-4 pl-12 py-12 max-w-3xl'>
                <FormField
                    control={control}
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
                                    id='threadTitle'
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
                    control={control}
                    name='threadBody'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    id='threadBody'
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
                <FormItem
                    control={control}
                    name='threadCategory'
                    render={({ field }) => (
                    <div>
                        <label htmlFor='threadCategory'>Category</label>
                        <ComboBox
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                        />
                        {errors.threadCategory && <p>{errors.threadCategory.message}</p>}
                    </div>
                    )}
                />
                    <Button
                        type='submit'
                        className='px-8'>
                        Submit
                    </Button>
            </form>
    );
};
