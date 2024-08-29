import { Button } from '@/components/ui/button';
import { ThreadTable } from '../_components/ThreadTable';
import { Plus } from 'lucide-react';
import Link from 'next/link';

const LandingPage = () => {
    return (
        <>
            <header className='bg-slate-300'>
                <div className='pl-12 py-8 max-w-6xl mx-auto'>
                    <h1 className='text-base font-medium'>
                        Welcome to Threads
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        A community of developers
                    </p>
                </div>
            </header>
            <main className='mx-auto'>
                <Link href='/threads/new'>
                    <Button className='flex items-center gap-1 mx-auto pl-12 px-6 my-8 max-w-6xl' variant='outline'>
                        <Plus className='size-4' />
                        <span>Add new Thread</span>
                    </Button>
                </Link>
                <ThreadTable />
            </main>
        </>
    );
};

export default LandingPage;
